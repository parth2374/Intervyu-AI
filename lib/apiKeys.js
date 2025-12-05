import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing SUPABASE envs", {
    SUPABASE_URL_set: !!SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY_set: !!SUPABASE_SERVICE_KEY,
  });
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add them to .env.local and restart dev server.");
}

export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

export function genSecret(len = 32) {
  return crypto.randomBytes(len).toString("hex");
}

export function hashSecret(secret, salt) {
  return crypto.createHmac("sha256", salt).update(secret).digest("hex");
}

export async function createApiKey({ name, ownerId, scopes = [] }) {
  const secret = genSecret();
  const salt = crypto.randomBytes(16).toString("hex");
  const hashed = hashSecret(secret, salt);
  const last4 = secret.slice(-4);

  const { data, error } = await supabaseAdmin
    .from("api_keys")
    .insert({
      name: name ?? null,
      owner_id: ownerId ?? null,
      hashed_secret: hashed,
      salt,
      last4,
      scopes
    })
    .select()
    .single();

  if (error) throw error;

  const returnedKey = `sk_${data.id}.${secret}`;
  return { key: returnedKey, row: data };
}

export async function verifyApiKey(authorization) {
  if (!authorization) return null;
  const token = authorization.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;

  const m = token.match(/^sk_([0-9a-fA-F-]+(?:-[0-9a-fA-F-]+)*)\.(.+)$/);
  if (!m) return null;
  const [, id, plainSecret] = m;

  const { data, error } = await supabaseAdmin
    .from("api_keys")
    .select("*")
    .eq("id", id)
    .limit(1)
    .single();

  if (error || !data || data.revoked) return null;

  const candidate = hashSecret(plainSecret, data.salt);
  const a = Buffer.from(candidate, "hex");
  const b = Buffer.from(data.hashed_secret, "hex");
  if (a.length !== b.length) return null;
  if (!crypto.timingSafeEqual(a, b)) return null;

  return data;
}