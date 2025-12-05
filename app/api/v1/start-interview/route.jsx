// // app/api/intervyu/start/route.js
// import crypto from 'crypto';
// import { supabaseAdmin } from '@/services/supabaseAdminClient';
// import { supabase } from '@/services/supabaseClient';
// import { startVapiSession, triggerAssistantMessage } from '@/services/vapiClient';

// function hashSecret(secret, salt) {
//   return crypto.createHmac('sha256', salt).update(secret).digest('hex');
// }

// // helper to fetch binary audio and convert to base64
// async function fetchBinaryAsBase64(url, headers = {}) {
//   const res = await fetch(url, { headers });
//   if (!res.ok) throw new Error(`Failed to fetch audio: ${res.status}`);
//   const arrayBuffer = await res.arrayBuffer();
//   const buffer = Buffer.from(arrayBuffer);
//   return buffer.toString('base64');
// }

// export async function POST(req) {
//   try {
//     // 1) parse body
//     let body = {};
//     try { body = await req.json(); } catch (e) { body = {}; }

//     const interview_id = (body.interview_id || '').toString().trim();
//     const candidateName = (body.candidateName || '').toString().trim();
//     const candidateEmail = (body.candidateEmail || '').toString().trim();

//     if (!interview_id || !candidateName || !candidateEmail) {
//       return new Response(JSON.stringify({ error: 'interview_id, candidateName and candidateEmail are required' }), { status: 400 });
//     }

//     // 2) extract token
//     const authHeader = (req.headers.get('authorization') || '').toString();
//     const headerApiKey = (req.headers.get('x-api-key') || '').toString();
//     let token = null;
//     if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) token = authHeader.slice(7).trim();
//     else if (headerApiKey) token = headerApiKey.trim();
//     if (!token) return new Response(JSON.stringify({ error: 'missing_auth_token' }), { status: 401 });

//     // 3) try supabase user
//     let callerUser = null;
//     try {
//       const { data: authData, error: authErr } = await supabaseAdmin.auth.getUser(token);
//       if (!authErr && authData?.user) callerUser = { type: 'supabase_user', user: authData.user };
//     } catch (e) { console.warn('supabase.auth.getUser error (fallback to api key):', e?.message || e); }

//     // 4) if not supabase user, expect sk_<id>.<secret>
//     let matchedApiKey = null;
//     if (!callerUser) {
//       const m = token.match(/^sk_([0-9a-fA-F-]+(?:-[0-9a-fA-F-]+)*)\.(.+)$/);
//       if (!m) return new Response(JSON.stringify({ error: 'invalid_auth_token_format' }), { status: 401 });
//       const [, id, plainSecret] = m;

//       const { data, error } = await supabaseAdmin
//         .from('api_keys')
//         .select('id, name, owner_id, hashed_secret, salt, last4, scopes, revoked, webhook_url, created_at, updated_at')
//         .eq('id', id)
//         .limit(1)
//         .single();

//       if (error || !data) {
//         console.warn('api_keys lookup error/not found:', error);
//         return new Response(JSON.stringify({ error: 'invalid_auth_token' }), { status: 401 });
//       }
//       if (data.revoked) return new Response(JSON.stringify({ error: 'invalid_auth_token_revoked' }), { status: 401 });

//       // verify HMAC
//       const candidateHex = hashSecret(plainSecret, data.salt);
//       const a = Buffer.from(candidateHex, 'hex');
//       const b = Buffer.from(data.hashed_secret, 'hex');
//       if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
//         return new Response(JSON.stringify({ error: 'invalid_auth_token' }), { status: 401 });
//       }

//       matchedApiKey = data;
//       callerUser = { type: 'api_key', api_key_id: matchedApiKey.id, api_key_name: matchedApiKey.name, user_id: matchedApiKey.owner_id ?? null, last4: matchedApiKey.last4 ?? null };
//     }

//     // 5) fetch interview row
//     const { data: InterviewRow, error: fetchErr } = await supabaseAdmin
//       .from('Interviews')
//       .select('*')
//       .eq('interview_id', interview_id)
//       .maybeSingle();

//     if (fetchErr) {
//       console.error('DB fetch error', fetchErr);
//       return new Response(JSON.stringify({ error: 'db_fetch_error', details: String(fetchErr) }), { status: 500 });
//     }
//     if (!InterviewRow) return new Response(JSON.stringify({ error: 'interview_not_found' }), { status: 404 });

//     // 6) normalize questions
//     const rawQuestionList = Array.isArray(InterviewRow?.interviewData?.questionList) ? InterviewRow.interviewData.questionList : [];
//     const genUUID = () => {
//       if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
//       try { return require('crypto').randomUUID(); } catch (e) { return 'qid_' + Date.now() + '_' + Math.floor(Math.random() * 1e6); }
//     };
//     const questionList = rawQuestionList.map((q, idx) => ({ question_id: q?.question_id || q?.id || genUUID(), index: idx, question: (q?.question || q?.text || '').toString().trim(), raw: q }));

//     // 7) create session row
//     const sessionId = genUUID();
//     const insertSession = {
//       session_id: sessionId,
//       interview_id,
//       user_id: callerUser?.type === 'supabase_user' ? callerUser.user.id : callerUser?.user_id ?? InterviewRow.user_id ?? null,
//       candidate_name: candidateName,
//       candidate_email: candidateEmail,
//       started_at: new Date().toISOString(),
//       status: 'in_progress',
//       meta: { created_via: 'api_start', created_by: callerUser?.type === 'supabase_user' ? callerUser.user.id : callerUser?.user_id ?? null }
//     };
//     const { data: sessionData, error: sessionErr } = await supabaseAdmin.from('Interview_Sessions').insert([insertSession]).select().maybeSingle();
//     if (sessionErr) console.warn('session insert error', sessionErr);

//     // 8) create empty Interview_Responses row to be populated by webhook
//     const emptyResponsesRow = {
//       session_id: sessionId,
//       interview_id,
//       qa: [], // will be filled by webhook events
//       meta: { created_via: 'api_start', created_by: callerUser?.type === 'supabase_user' ? callerUser.user.id : callerUser?.user_id ?? null }
//     };
//     const { data: respRow, error: respErr } = await supabaseAdmin.from('Interview_Responses').insert([emptyResponsesRow]).select().maybeSingle();
//     if (respErr) console.warn('Interview_Responses insert error', respErr);

//     // 9) build assistantOptions for internal use (kept for client/display only)
//     const formattedQuestionsText = questionList.map(q => `QID:${q.question_id} | ${q.question}`).join('\n');
//     const systemPrompt = `
// You are an AI voice assistant conducting a structured interview. Ask ONE question at a time.
// Each question MUST include "QID:<question_id>" exactly so the client/server can pair answers.
// Questions (use them in order):
// ${formattedQuestionsText}

// When asking, format: "Question (QID:<the-id>): <question text>"
// Pause after each question and wait for candidate speech. After answering, provide short feedback then move to next.
// `.trim();

//     const assistantOptions = {
//       name: "AI Recruiter",
//       firstMessage: `Hi ${candidateName}, I'm your AI interviewer for ${InterviewRow?.interviewData?.jobPosition ?? 'this role'}. Let's begin!`,
//       model: {
//         provider: 'openai',
//         model: 'gpt-4',
//         messages: [{ role: 'system', content: systemPrompt }]
//       },
//       // any other VAPI config (voices, transcriber) — adapt as required
//       transcriber: { provider: 'deepgram', model: 'nova-2', language: 'en-US' },
//       voice: { provider: 'playht', voiceId: 'jennifer' },
//       meta: { sessionId, interviewId: interview_id, questionCount: questionList.length }
//     };

//     // 10) Prepare VAPI-compatible payload (do NOT send assistantOptions directly)
//     const vapiAssistantId = InterviewRow?.interviewData?.vapiAssistantId || process.env.VAPI_ASSISTANT_ID;
//     if (!vapiAssistantId) {
//       console.error('Missing VAPI assistant id (InterviewRow.interviewData.vapiAssistantId or VAPI_ASSISTANT_ID env).');
//     }

//     const vapiPayload = {
//       assistantId: vapiAssistantId,
//       // minimal candidate metadata under "customer"
//       customer: {
//         name: candidateName || undefined,
//         email: candidateEmail || undefined
//       }
//     };

//     // clean optional fields
//     if (!vapiPayload.customer.name && !vapiPayload.customer.email) delete vapiPayload.customer;

//     // 11) Start VAPI session (server-side) — startVapiSession expects VAPI payload shape
//     let vapiResp = null;
//     try {
//       vapiResp = await startVapiSession(vapiPayload); // returns VAPI session info (id, token, wsUrl, etc.)
//     } catch (e) {
//       console.error('VAPI start failed:', e);
//       // We continue — the session & response rows are created; client can retry starting vapi or proceed without real-time voice
//       return new Response(JSON.stringify({ error: 'vapi_start_failed', details: String(e) }), { status: 502 });
//     }

//     // --- NEW: persist vapi id to session row (so webhooks can be correlated) ---
//     try {
//       const vapiSessionId = vapiResp?.id || vapiResp?.sessionId || null;
//       if (vapiSessionId) {
//         await supabaseAdmin
//           .from('Interview_Sessions')
//           .update({ vapi_session_id: vapiSessionId })
//           .eq('session_id', sessionId);
//       }
//     } catch (upErr) {
//       console.warn('Failed to persist vapi_session_id', upErr);
//     }

//     // --- NEW: trigger assistant to speak first message and try to fetch audio/text ---
//     let audioBase64 = null;
//     let assistantText = null;
//     try {
//       const triggerResp = await triggerAssistantMessage({
//         sessionId: vapiResp?.id || vapiResp?.sessionId,
//         assistantId: vapiResp?.assistantId || vapiAssistantId,
//         text: assistantOptions.firstMessage
//       });

//       // try to extract assistant text if present
//       assistantText =
//         triggerResp?.text ||
//         triggerResp?.assistantText ||
//         triggerResp?.output?.text ||
//         triggerResp?.result?.text ||
//         null;

//       // try to find audio URL or inline base64 in trigger response
//       const audioUrl =
//         triggerResp?.audio_url ||
//         triggerResp?.audioUrl ||
//         triggerResp?.output?.audio?.url ||
//         triggerResp?.audio?.url ||
//         triggerResp?.result?.audioUrl ||
//         null;

//       const audioBase64Inline =
//         triggerResp?.audioBase64 ||
//         triggerResp?.audio_base64 ||
//         triggerResp?.output?.audio?.base64 ||
//         null;

//       if (audioBase64Inline) {
//         audioBase64 = audioBase64Inline;
//       } else if (audioUrl) {
//         try {
//           // fetch audio and convert to base64 (server-side)
//           audioBase64 = await fetchBinaryAsBase64(audioUrl);
//         } catch (fetchErr) {
//           console.warn('Could not fetch audio URL from trigger response:', fetchErr);
//         }
//       }

//       // fallback: if no assistantText returned, use assistantOptions.firstMessage
//       if (!assistantText) assistantText = assistantOptions.firstMessage;
//     } catch (err) {
//       console.warn('triggerAssistantMessage error (non-fatal):', err?.message || err);
//       // fallback to assistantOptions.firstMessage
//       assistantText = assistantOptions.firstMessage;
//     }

//     // 12) return payload to client including vapiSession info and audio/text (do not expose private tokens)
//     return new Response(JSON.stringify({
//       ok: true,
//       sessionId,
//       vapi: {
//         id: vapiResp?.id || vapiResp?.sessionId || null,
//         status: vapiResp?.status || null,
//         assistantId: vapiResp?.assistantId || vapiAssistantId
//       },
//       assistantOptions,
//       interviewData: InterviewRow.interviewData ?? {},
//       questionList,
//       audioBase64,
//       assistantText
//     }), { status: 200 });

//   } catch (err) {
//     console.error('intervyu start API error:', err);
//     return new Response(JSON.stringify({ error: 'internal_server_error', details: String(err) }), { status: 500 });
//   }
// }

// app/api/intervyu/start/route.js
import crypto from 'crypto';
import { supabaseAdmin } from '@/services/supabaseAdminClient';
import { startVapiSession, triggerAssistantMessage } from '@/services/vapiClient';

function hashSecret(secret, salt) {
  return crypto.createHmac('sha256', salt).update(secret).digest('hex');
}

async function fetchBinaryAsBase64(url, headers = {}) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Failed to fetch audio: ${res.status}`);
  const ab = await res.arrayBuffer();
  return Buffer.from(ab).toString('base64');
}

export async function POST(req) {
  try {
    let body = {};
    try { body = await req.json(); } catch (e) { body = {}; }

    const { interview_id, candidateName, candidateEmail, audioBase64, text } = body;
    if (!interview_id) return new Response(JSON.stringify({ error: 'interview_id required' }), { status: 400 });

    // auth: bearer or x-api-key
    const authHeader = (req.headers.get('authorization') || '').toString();
    const headerApiKey = (req.headers.get('x-api-key') || '').toString();
    let token = null;
    if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) token = authHeader.slice(7).trim();
    else if (headerApiKey) token = headerApiKey.trim();
    if (!token) return new Response(JSON.stringify({ error: 'missing_auth_token' }), { status: 401 });

    // try supabase user
    let callerUser = null;
    try {
      const { data: authData, error: authErr } = await supabaseAdmin.auth.getUser(token);
      if (!authErr && authData?.user) callerUser = { type: 'supabase_user', user: authData.user };
    } catch (e) { console.warn('supabase auth.getUser error:', e?.message); }

    // fallback to API key validation
    if (!callerUser) {
      const m = token.match(/^sk_([0-9a-fA-F-]+)\.(.+)$/);
      if (!m) return new Response(JSON.stringify({ error: 'invalid_auth_token_format' }), { status: 401 });
      const [, id, plainSecret] = m;
      const { data, error } = await supabaseAdmin
        .from('api_keys').select('id, owner_id, hashed_secret, salt, revoked').eq('id', id).limit(1).single();
      if (error || !data) return new Response(JSON.stringify({ error: 'invalid_auth_token' }), { status: 401 });
      if (data.revoked) return new Response(JSON.stringify({ error: 'revoked_token' }), { status: 401 });
      const candidateHex = hashSecret(plainSecret, data.salt);
      const a = Buffer.from(candidateHex, 'hex');
      const b = Buffer.from(data.hashed_secret, 'hex');
      if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return new Response(JSON.stringify({ error: 'invalid_auth_token' }), { status: 401 });
      callerUser = { type: 'api_key', user_id: data.owner_id };
    }

    // lookup interview row
    const { data: InterviewRow, error: fetchErr } = await supabaseAdmin
      .from('Interviews').select('*').eq('interview_id', interview_id).maybeSingle();
    if (fetchErr) return new Response(JSON.stringify({ error: 'db_fetch_error' }), { status: 500 });
    if (!InterviewRow) return new Response(JSON.stringify({ error: 'interview_not_found' }), { status: 404 });

    // resolve assistantId
    const assistantId = InterviewRow?.interviewData?.vapiAssistantId || process.env.VAPI_ASSISTANT_ID || null;
    if (!assistantId) return new Response(JSON.stringify({ error: 'assistant_id_missing' }), { status: 500 });

    // ---------- If audioBase64 present => candidate reply ----------
    if (audioBase64) {
      try {
        const vapiSessionId = InterviewRow.vapi_session_id;
        if (!vapiSessionId) return new Response(JSON.stringify({ error: 'no_active_session' }), { status: 400 });

        // forward audio to VAPI (include text fallback to avoid "text required")
        const reply = await triggerAssistantMessage({
          sessionId: vapiSessionId,
          assistantId: assistantId,
          text: text || '[audio]',
          audioBase64,
        });

        const assistantText = reply?.assistantText || reply?.text || reply?.result?.text || null;
        const audioInline = reply?.audioBase64 || reply?.output?.audio?.base64 || null;
        const audioUrl = reply?.audioUrl || reply?.audio?.url || reply?.output?.audio?.url || null;

        let audioResp = audioInline;
        if (!audioResp && audioUrl) audioResp = await fetchBinaryAsBase64(audioUrl);

        return new Response(JSON.stringify({ ok: true, assistantText, audioBase64: audioResp }), { status: 200 });
      } catch (err) {
        console.error('audio reply failed:', err);
        return new Response(JSON.stringify({ error: 'audio_reply_failed', details: String(err) }), { status: 500 });
      }
    }

    // ---------- Otherwise: start interview ----------
    // start VAPI session
    let vapiResp;
    try {
      vapiResp = await startVapiSession({ assistantId, candidateName, candidateEmail });
    } catch (err) {
      console.error('VAPI start failed:', err);
      return new Response(JSON.stringify({ error: 'vapi_start_failed', details: String(err) }), { status: 502 });
    }

    const vapiSessionId = vapiResp?.id || vapiResp?.sessionId || null;
    if (vapiSessionId) {
      // persist to Interview row (so receive-audio flows can find it)
      try {
        await supabaseAdmin.from('Interviews').update({ vapi_session_id: vapiSessionId }).eq('interview_id', interview_id);
      } catch (upErr) {
        console.warn('persist vapi_session_id failed', upErr);
      }
    }

    // trigger assistant intro
    const intro = `Hi ${candidateName}, I'm your AI interviewer for ${InterviewRow?.interviewData?.jobPosition ?? 'this role'}. Let's begin!`;
    let assistantText = intro;
    let audioBase64Resp = null;
    try {
      const trigger = await triggerAssistantMessage({
        sessionId: vapiSessionId,
        assistantId,
        text: intro
      });
      assistantText = trigger?.assistantText || trigger?.text || intro;
      audioBase64Resp = trigger?.audioBase64 || trigger?.output?.audio?.base64 || null;
      const audioUrl = trigger?.audioUrl || trigger?.output?.audio?.url || null;
      if (!audioBase64Resp && audioUrl) audioBase64Resp = await fetchBinaryAsBase64(audioUrl);
    } catch (err) {
      console.warn('trigger intro failed (non-fatal):', err);
    }

    return new Response(JSON.stringify({
      ok: true,
      type: 'start',
      sessionId: crypto.randomUUID ? crypto.randomUUID() : `s_${Date.now()}`,
      vapiSessionId,
      assistantText,
      audioBase64: audioBase64Resp
    }), { status: 200 });

  } catch (err) {
    console.error('intervyu start route error:', err);
    return new Response(JSON.stringify({ error: 'internal_server_error', details: String(err) }), { status: 500 });
  }
}