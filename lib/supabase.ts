import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://ihjtbwlrdkezosolwqaz.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_vfL2-Hze8IHOc9HzvnTXtQ_zYiDSgoG";

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || (!url.startsWith("http://") && !url.startsWith("https://"))) {
    url = DEFAULT_SUPABASE_URL;
  }

  if (!anonKey || anonKey.startsWith("sb_secret_")) {
    anonKey = DEFAULT_SUPABASE_ANON_KEY;
  }

  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient(url, anonKey);
  }

  return supabaseInstance;
}

export function createClient() {
  return getSupabaseClient();
}


