// // services/vapiClient.js
// /**
//  * VAPI client helper
//  *
//  * - Uses server-only env var: VAPI_PRIVATE_KEY
//  * - Creates a VAPI session (POST /session)
//  * - Optionally tries to mint a short-lived client token for the session by attempting
//  *   common client-token endpoints (so the frontend can join). This is optional and
//  *   best-effort — some VAPI accounts or versions may use a different path.
//  * - Also exposes triggerAssistantMessage(...) to enqueue/speak an assistant message
//  *   into an active session.
//  *
//  * Env expected (server-only):
//  *   VAPI_URL (optional, defaults to https://api.vapi.ai)
//  *   VAPI_PRIVATE_KEY (required)
//  *   VAPI_ISSUE_CLIENT_TOKEN (optional, if 'true' helper will try to create a client token)
//  *   VAPI_CLIENT_TOKEN_TTL (optional, seconds; default 300)
//  *   VAPI_ALLOW_CHAT_ENDPOINT (optional, path for triggering messages, defaults to /chats)
//  */

// const VAPI_URL = process.env.VAPI_URL || 'https://api.vapi.ai';
// const VAPI_KEY = process.env.NEXT_PUBLIC_VAPI_PRIVATE_KEY; // must be server-only

// if (!VAPI_URL || !VAPI_KEY) {
//   console.warn('VAPI not configured (VAPI_URL / VAPI_PRIVATE_KEY missing).');
// }

// /**
//  * Try to create a client token for a created session.
//  * Attempts several possible endpoints. Returns normalized { token, wsUrl, raw } or null.
//  */
// async function tryCreateClientToken(sessionId, ttlSeconds = 300) {
//   if (!sessionId) return null;

//   const candidatePaths = [
//     `/session/${sessionId}/client-token`,
//     `/session/${sessionId}/client-token/create`,
//     `/session/${sessionId}/token`,
//     `/session/${sessionId}/client_token`,
//     `/session/${sessionId}/client-token/v1`
//   ];

//   for (const path of candidatePaths) {
//     try {
//       const url = `${VAPI_URL.replace(/\/$/, '')}${path.startsWith('/') ? path : '/' + path}`;
//       const res = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${VAPI_KEY}`
//         },
//         body: JSON.stringify({ ttlSeconds })
//       });

//       if (!res.ok) {
//         const txt = await res.text().catch(() => '');
//         if (res.status === 401) throw new Error(`Unauthorized when creating client token: ${txt}`);
//         continue;
//       }

//       const body = await res.json();
//       const token = body?.token || body?.clientToken?.token || body?.data?.token;
//       const wsUrl = body?.wsUrl || body?.clientToken?.wsUrl || body?.data?.wsUrl || body?.ws || null;
//       if (token || wsUrl) return { token, wsUrl, raw: body };
//       return { raw: body };
//     } catch (err) {
//       if (String(err).toLowerCase().includes('unauthor')) throw err;
//       continue;
//     }
//   }

//   return null;
// }

// /**
//  * Start a VAPI session (server-side).
//  *
//  * @param {Object} opts
//  * @param {string} opts.assistantId - required
//  * @param {string} [opts.sessionId] - internal id (not sent to VAPI)
//  * @param {string} [opts.interviewId] - internal id (not sent to VAPI)
//  * @param {string} [opts.candidateName]
//  * @param {string} [opts.candidateEmail]
//  * @returns {Promise<Object>} VAPI session response (augmented with client token if minted)
//  */
// export async function startVapiSession({ assistantId, sessionId, interviewId, candidateName, candidateEmail } = {}) {
//   if (!VAPI_URL || !VAPI_KEY) throw new Error('VAPI_URL or VAPI_PRIVATE_KEY not set in env');
//   if (!assistantId) throw new Error('assistantId required');

//   const payload = { assistantId };
//   if (candidateName || candidateEmail) {
//     payload.customer = {};
//     if (candidateName) payload.customer.name = candidateName;
//     if (candidateEmail) payload.customer.email = candidateEmail;
//   }

//   const sessionRes = await fetch(`${VAPI_URL.replace(/\/$/, '')}/session`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${VAPI_KEY}`
//     },
//     body: JSON.stringify(payload),
//   });

//   if (!sessionRes.ok) {
//     const txt = await sessionRes.text().catch(() => '');
//     throw new Error(`VAPI start failed: ${sessionRes.status} ${txt}`);
//   }

//   const vapiResp = await sessionRes.json();

//   // Optionally try to mint a short-lived client token so the browser can join directly.
//   try {
//     const issueToken = String(process.env.VAPI_ISSUE_CLIENT_TOKEN || '').toLowerCase() === 'true';
//     if (issueToken) {
//       const ttl = Number(process.env.VAPI_CLIENT_TOKEN_TTL || '300');
//       const createdSessionId = vapiResp?.id || vapiResp?.sessionId || null;
//       if (createdSessionId) {
//         const tokenResp = await tryCreateClientToken(createdSessionId, ttl);
//         if (tokenResp) {
//           if (!vapiResp.client) vapiResp.client = {};
//           if (tokenResp.token) vapiResp.client.token = tokenResp.token;
//           if (tokenResp.wsUrl) vapiResp.client.wsUrl = tokenResp.wsUrl;
//           vapiResp.client.raw = tokenResp.raw ?? tokenResp;
//         }
//       }
//     }
//   } catch (err) {
//     console.warn('Failed to create VAPI client token (non-fatal):', err?.message || err);
//   }

//   return vapiResp;
// }

// /**
//  * Trigger / enqueue an assistant message inside an active session so the assistant speaks it.
//  *
//  * @param {Object} opts
//  * @param {string} opts.sessionId - VAPI session id (required)
//  * @param {string} opts.assistantId - assistant id (required)
//  * @param {string} opts.text - message text to speak (required)
//  * @returns {Promise<Object>} VAPI response
//  */
// export async function triggerAssistantMessage({ sessionId, assistantId, text } = {}) {
//   if (!VAPI_URL || !VAPI_KEY) throw new Error('VAPI_URL or VAPI_PRIVATE_KEY not set in env');
//   if (!sessionId) throw new Error('sessionId required');
//   if (!assistantId) throw new Error('assistantId required');
//   if (!text) throw new Error('text required');

//   // Default control endpoint used by many VAPI versions; adjust if your account uses a different path.
//   const chatEndpoint = process.env.VAPI_CHAT_ENDPOINT || '/chats'; // /chats is common; replace if needed
//   const url = `${VAPI_URL.replace(/\/$/, '')}${chatEndpoint.startsWith('/') ? chatEndpoint : '/' + chatEndpoint}`;

//   // Many VAPI chat endpoints accept { assistantId, sessionId, input } or messages array.
//   const body = {
//     assistantId,
//     sessionId,
//     input: text
//   };

//   const res = await fetch(url, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${VAPI_KEY}`
//     },
//     body: JSON.stringify(body)
//   });

//   if (!res.ok) {
//     const txt = await res.text().catch(() => '');
//     throw new Error(`triggerAssistantMessage failed: ${res.status} ${txt}`);
//   }

//   return res.json();
// }



// services/vapiClient.js
/**
 * VAPI client helper (fixed audio shape)
 *
 * - Uses server-only env: VAPI_URL (optional) and VAPI_PRIVATE_KEY (required)
 * - Exports:
 *    - startVapiSession({ assistantId, candidateName, candidateEmail })
 *    - triggerAssistantMessage({ sessionId, assistantId, text, audioBase64 })
 *
 * triggerAssistantMessage:
 *  - prefers JSON with input.audio.base64
 *  - falls back to multipart/form-data upload if JSON is rejected
 */

const VAPI_URL = (process.env.VAPI_URL || 'https://api.vapi.ai').replace(/\/$/, '');
const VAPI_KEY = process.env.NEXT_PUBLIC_VAPI_PRIVATE_KEY;

if (!VAPI_URL || !VAPI_KEY) {
  console.warn('VAPI not configured (VAPI_URL / VAPI_PRIVATE_KEY).');
}

async function postJson(path, body) {
  const url = `${VAPI_URL}${path.startsWith('/') ? path : '/' + path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${VAPI_KEY}`,
    },
    body: JSON.stringify(body),
  });
  const txt = await res.text().catch(() => '');
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status} ${txt}`);
    err.status = res.status;
    err.body = txt;
    throw err;
  }
  try { return JSON.parse(txt); } catch (e) { return txt; }
}

async function postForm(path, formData) {
  const url = `${VAPI_URL}${path.startsWith('/') ? path : '/' + path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      // NOTE: don't set Content-Type; fetch will set multipart boundary
      'Authorization': `Bearer ${VAPI_KEY}`,
    },
    body: formData
  });
  const txt = await res.text().catch(() => '');
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status} ${txt}`);
    err.status = res.status;
    err.body = txt;
    throw err;
  }
  try { return JSON.parse(txt); } catch (e) { return txt; }
}

/** startVapiSession */
export async function startVapiSession({ assistantId, candidateName, candidateEmail } = {}) {
  if (!assistantId) throw new Error('assistantId required');
  const payload = { assistantId };
  if (candidateName || candidateEmail) {
    payload.customer = {};
    if (candidateName) payload.customer.name = candidateName;
    if (candidateEmail) payload.customer.email = candidateEmail;
  }
  return postJson('/session', payload);
}

/**
 * Trigger assistant message (text or audio).
 * - If audioBase64 provided, first try JSON { input: { audio: { base64 } } }.
 * - If JSON fails in a way indicating the endpoint doesn't accept that shape, fallback to multipart file upload.
 *
 * @param {Object} opts
 * @param {string} opts.sessionId
 * @param {string} opts.assistantId
 * @param {string} [opts.text]
 * @param {string} [opts.audioBase64] - raw base64 (no data: prefix)
 */
export async function triggerAssistantMessage({ sessionId, assistantId, text, audioBase64 } = {}) {
  if (!sessionId) throw new Error('sessionId required');
  if (!assistantId) throw new Error('assistantId required');

  const chatPath = '/chat'; // keep single predictable endpoint; change if your VAPI uses different path

  // If no audio, send simple text
  if (!audioBase64) {
    if (!text || text.trim().length === 0) throw new Error('text required when audio is not provided');
    return postJson(chatPath, { assistantId, sessionId, input: text });
  }

  // 1) Preferred: structured JSON with input.audio.base64
  const jsonBody = {
    assistantId,
    sessionId,
    input: {
      audio: {
        base64: audioBase64
      },
      // include optional text fallback so servers that require an input text won't reject
      ...(text ? { text } : {})
    }
  };

  try {
    return await postJson(chatPath, jsonBody);
  } catch (err) {
    // If it's an auth error, bubble up
    if (err.status === 401 || err.status === 403) throw err;

    // If server responded with a validation that top-level audioBase64 shouldn't exist,
    // it's likely because we previously sent the wrong shape. But we attempted the correct
    // structured JSON first. Some VAPI implementations still don't accept inline base64
    // JSON and expect a multipart file. Try multipart fallback below.
    const lower = String(err.body || '').toLowerCase();
    // If server explicitly said "audioBase64 should not exist" or "property audioBase64", fallback.
    const shouldFallback = lower.includes('audiobase64') || lower.includes('audio_base64') || lower.includes('base64') || err.status === 400;

    if (!shouldFallback) {
      // nothing promising to fallback on — rethrow original error for inspection
      throw err;
    }

    // 2) Fallback: multipart/form-data upload with a file named 'audio'
    // Build a Blob/File from base64 and send as FormData.
    try {
      // Node: create Buffer and use form-data polyfill (fetch in node supports FormData with Blob)
      // Build a Uint8Array from base64
      const binary = Buffer.from(audioBase64, 'base64');
      // In Node fetch, you can append Buffer directly to FormData with filename
      const form = new FormData();
      form.append('assistantId', assistantId);
      form.append('sessionId', sessionId);
      // server field name might be 'audio' or 'file' depending on VAPI implementation; try 'audio'
      form.append('audio', binary, 'audio.webm');

      // also include a text fallback
      if (text) form.append('text', text);

      return await postForm(chatPath, form);
    } catch (multipartErr) {
      // If this fails, surface both errors to help debugging
      const e = new Error(`JSON attempt failed: ${err.message}; multipart attempt failed: ${multipartErr.message}`);
      e.jsonError = err;
      e.multipartError = multipartErr;
      throw e;
    }
  }
}