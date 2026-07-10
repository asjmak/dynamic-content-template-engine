import { createClient } from "@supabase/supabase-js";

// HANYA untuk digunakan di server (webhook / script). Jangan import di client component.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
