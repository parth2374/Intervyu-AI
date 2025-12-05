// app/api/v1/create-interview/route.ts
import { NextResponse } from "next/server";
import { verifyApiKey, supabaseAdmin } from "@/lib/apiKeys";
import { z } from "zod";
import { v4 as uuidv4 } from 'uuid'

const bodySchema = z.object({
  duration: z.string(),
  jobDescription: z.string(),
  jobPosition: z.string(),
  type: z.array(z.string())
});

export async function POST(req) {
  const auth = req.headers.get("authorization");
  const apiKeyRow = await verifyApiKey(auth);
  if (!apiKeyRow) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const json = await req.json().catch(() => ({}));
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", issues: parsed.error.format() }, { status: 400 });
  }

  // Optionally enforce scopes/quotas here
  // e.g. if (!apiKeyRow.scopes.includes("create:interview")) return 403

  // insert queued interview
  const { data, error } = await supabaseAdmin
    .from("Interviews")
    .insert({
      jobPosition: parsed.data.jobPosition,
      jobDescription: parsed.data.jobDescription,
      duration: parsed.data.duration,
      type: parsed.data.type,
      interview_id: uuidv4()
    })
    .select()
    .single();

  if (error) {
    console.error("Supabase insert error:", JSON.stringify(error, null, 2));
    // Return the error body for debugging (remove/obfuscate in production)
    return NextResponse.json({ error: "DB insert failed", supabaseError: error }, { status: 500 });
  }

  // NOW GENERATE QUESTIONS
  try {
    const aiResponse = await fetch(`http://localhost:3000/api/ai-model`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobPosition: parsed.data.jobPosition,
        jobDescription: parsed.data.jobDescription,
        duration: parsed.data.duration,
        type: parsed.data.type.join(", ")
      })
    });

    // Log status for debugging
    console.log("ai-model status:", aiResponse.status, aiResponse.statusText);

    if (!aiResponse.ok) {
      const bodyText = await aiResponse.text().catch(() => "<no body>");
      console.error("ai-model returned non-ok:", aiResponse.status, bodyText);
      throw new Error(`ai-model non-ok: ${aiResponse.status}`);
    }

    let questionsRaw;
    try {
      questionsRaw = await aiResponse.json();
    } catch (parseErr) {
      // If JSON parse fails, try to grab raw text and proceed
      const txt = await aiResponse.text().catch(() => "<no body>");
      console.error("Failed to parse ai-model JSON. body:", txt);
      // we'll still attempt to normalize `txt` below
      questionsRaw = txt;
    }

    console.log("ai-model response shape:", questionsRaw);

    // Candidate payload: prefer content -> questions -> raw
    const candidate = questionsRaw?.content ?? questionsRaw?.questions ?? questionsRaw;

    function stripCodeFences(s) {
      if (!s) return s;
      // remove common fences like ```json\n...\n``` or ```\n...\n```
      s = s.trim();
      if (s.startsWith("```") && s.endsWith("```")) {
        // remove outer fences
        s = s.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
      }
      return s.trim();
    }

    // Normalizer: produce Array<{question: string, type: string}>
    function normalizeQuestions(raw) {
      if (raw === null || raw === undefined) return [];

      // If it's already an array, map items (same as before)
      if (Array.isArray(raw)) {
        return raw.map((item) => {
          if (typeof item === "string") {
            return { question: item.trim(), type: "Technical" };
          }
          if (item && typeof item === "object") {
            const question = (item.question ?? item.text ?? item.q ?? item.prompt ?? item.title) + "";
            const type = (item.type ?? item.category ?? item.tag ?? "Technical") + "";
            return { question: question.trim(), type: type.trim() };
          }
          return { question: String(item), type: "Technical" };
        });
      }

      // If it's a string: try to strip code fences and parse JSON first
      if (typeof raw === "string") {
        const cleaned = stripCodeFences(raw);

        // If cleaned starts with { or [, try JSON.parse
        const firstChar = (cleaned || "").trim().charAt(0);
        if (firstChar === "{" || firstChar === "[") {
          try {
            const parsed = JSON.parse(cleaned);
            return normalizeQuestions(parsed); // recursion handles parsed arrays/objects
          } catch (e) {
            // parsing failed, continue to fallback splitting
            console.warn("JSON.parse failed on cleaned AI string, falling back to splitting");
          }
        }

        // fallback: split into blocks/lines / bullets (same strategy as before)
        const lines = cleaned
          .split(/\r?\n\s*\r?\n/) // split on blank lines first
          .map((s) => s.trim())
          .filter(Boolean)
          .flatMap((block) =>
            block
              .split(/\r?\n/) // split remaining newlines
              .map((s) => s.trim())
              .filter(Boolean)
          );

        if (lines.length > 0) {
          // if the lines look like JSON fragments (e.g., lines starting with "{" or '"question":'),
          // try to reconstruct a single JSON string and parse it once more:
          const looksLikeJsonFragment = lines.some((l) => /^[\{\]\[""]|"(question|type)"\s*:/.test(l));
          if (looksLikeJsonFragment) {
            const maybeJson = cleaned; // use the whole cleaned block
            try {
              const parsed = JSON.parse(maybeJson);
              return normalizeQuestions(parsed);
            } catch {
              // still not valid JSON — fall back to returning lines as questions
            }
          }

          return lines.map((q) => ({ question: q, type: "Technical" }));
        }

        // last resort: return whole string as one question
        return [{ question: cleaned, type: "Technical" }];
      }

      // If it's an object (not array) but contains arrays or text:
      if (raw && typeof raw === "object") {
        if (raw.content && (Array.isArray(raw.content) || typeof raw.content === "string")) {
          return normalizeQuestions(raw.content);
        }
        if (raw.questions && (Array.isArray(raw.questions) || typeof raw.questions === "string")) {
          return normalizeQuestions(raw.questions);
        }
        // also handle nested shapes like { interviewQuestions: [...] }
        if (raw.interviewQuestions && Array.isArray(raw.interviewQuestions)) {
          return normalizeQuestions(raw.interviewQuestions);
        }
        // fallback: convert object to a single JSON-string question
        try {
          return [{ question: JSON.stringify(raw), type: "Technical" }];
        } catch {
          return [{ question: String(raw), type: "Technical" }];
        }
      }

      // default fallback
      return [{ question: String(raw), type: "Technical" }];
    }

    const normalized = normalizeQuestions(candidate);

    if (!Array.isArray(normalized) || normalized.length === 0) {
      console.error("Unexpected ai-model response format after normalization", candidate);
      throw new Error("Unexpected ai-model response format");
    }

    // Choose correct identifier for update:
    const identifierCol = data.interview_id ? "interview_id" : (data.id ? "id" : null);
    const identifierVal = data.interview_id ?? data.id;
    if (!identifierCol) throw new Error("No valid identifier returned from insert to update row");

    // Update with generated questions (use correct column and table name)
    const { error: updateError } = await supabaseAdmin
      .from("Interviews")
      .update({
        questionList: normalized, // save as JSON/JSONB (Supabase will map JS array -> jsonb)
      })
      .eq(identifierCol, identifierVal);

    if (updateError) {
      console.error("Supabase update error:", updateError);
      throw updateError;
    }

    return NextResponse.json({
      id: identifierVal,
      questions: normalized
    });

  } catch (err) {
    console.error("Question generation failed:", err);

    // Mark as failed (attempt best-effort update)
    try {
      const identifierCol = data?.interview_id ? "interview_id" : (data?.id ? "id" : null);
      const identifierVal = data?.interview_id ?? data?.id;
      if (identifierCol && identifierVal) {
        await supabaseAdmin
          .from("Interviews")
          .update({ status: "failed", error_message: String(err?.message ?? err) })
          .eq(identifierCol, identifierVal);
      } else {
        console.error("Cannot mark failed: no identifier available on inserted row", data);
      }
    } catch (uErr) {
      console.error("Failed to mark interview as failed:", uErr);
    }

    return NextResponse.json({
      error: "Question generation failed",
      interviewId: data?.interview_id ?? data?.id ?? null,
      status: "failed",
      debug: String(err?.message ?? err) // remove in production
    }, { status: 500 });
  }
}