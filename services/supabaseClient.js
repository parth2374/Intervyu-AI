// import { createClient } from '@supabase/supabase-js'

// // Create a single supabase client for interacting with your database
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// export const supabase = createClient(
// 	supabaseUrl,
// 	supabaseAnonKey
// )

// services/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error('Missing SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in env');
}

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false }
});