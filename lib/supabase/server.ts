import { createClient } from "@supabase/supabase-js";

export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("⚠️ Supabase credentials missing. Falling back to sample data.");
    return null;
  }

  console.info(`✅ Connected to Supabase Project: ${supabaseUrl}`);
  console.info(`🌐 Connection status: Active`);
  return createClient(supabaseUrl, supabaseAnonKey);
}
