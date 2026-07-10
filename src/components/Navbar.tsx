"use client";

import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/client";

export default function Navbar() {
  const router = useRouter();

  async function logout() {
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <nav className="admin-nav">
      <div className="container admin-nav-inner">
        <strong>Admin</strong>
        <div className="admin-nav-links">
          <a href="/admin">Dashboard</a>
          <a href="/admin/templates">Templates</a>
          <a href="/admin/sections">Sections</a>
          <a href="/admin/contents">Contents</a>
          <a href="/admin/links">Links</a>
          <a href="/admin/leads">Leads</a>
          <button onClick={logout} className="btn-link">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
