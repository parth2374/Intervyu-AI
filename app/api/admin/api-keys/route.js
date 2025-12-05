// // app/api/admin/api-keys/route.ts
// export const runtime = "nodejs";
// import { NextResponse } from "next/server";
// import { createApiKey } from "@/lib/apiKeys";

// /** Temporary local-only admin check.
//  *  For production, replace this with a proper Clerk admin session check.
//  */
// function isLocalAdmin(req) {
//   // allow requests from localhost (useful for local dev)
//   const host = req.headers.get("host") || "";
//   // you can also check an env SECRET_ADMIN_TOKEN header if you prefer
//   return host.includes("localhost") || host.includes("127.0.0.1");
// }

// export async function POST(req) {
//   if (!isLocalAdmin(req)) return new Response("Forbidden", { status: 403 });

//   const body = await req.json().catch(() => ({}));
//   const { name, ownerId, scopes } = body;

//   try {
//     const { key, row } = await createApiKey({ name, ownerId, scopes });
//     return NextResponse.json({ apiKey: key, id: row.id });
//   } catch (err) {
//     console.error("createApiKey error:", err);
//     return new Response(JSON.stringify({ error: err.message || "Failed" }), { status: 500 });
//   }
// }

// app/api/admin/api-keys/route.js
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { createApiKey } from "@/lib/apiKeys";

function isLocalAdmin(req) {
  const host = req.headers.get("host") || "";
  return host.includes("localhost") || host.includes("127.0.0.1");
}

export async function POST(req) {
  if (!isLocalAdmin(req)) return new Response("Forbidden", { status: 403 });

  const body = await req.json().catch(() => ({}));
  const { name, ownerId, scopes } = body;

  console.log("📝 Creating API key with:", { name, ownerId, scopes }); // ADD THIS

  try {
    const { key, row } = await createApiKey({ name, ownerId, scopes });
    console.log("✅ API key created successfully:", row.id); // ADD THIS
    return NextResponse.json({ apiKey: key, id: row.id });
  } catch (err) {
    console.error("❌ createApiKey error:", err); // IMPROVED THIS
    console.error("Error details:", err.message, err.stack); // ADD THIS
    return NextResponse.json({ 
      error: err.message || "Failed",
      details: err.toString() 
    }, { status: 500 });
  }
}