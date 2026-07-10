import { redirect } from "next/navigation";
import { createServerClient } from "./supabase/server";

// Guard untuk halaman admin: redirect ke login bila belum terautentikasi.
export async function requireAdmin() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return user;
}
