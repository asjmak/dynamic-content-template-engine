"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/templates", label: "Templates" },
  { href: "/admin/sections", label: "Sections" },
  { href: "/admin/contents", label: "Contents" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/links", label: "Links" },
  { href: "/admin/leads", label: "Leads" },
];

export default function Navbar() {
  const path = usePathname();
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
        <strong>Admin Panel</strong>
        <div className="admin-nav-links">
          {NAV.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={path === href ? "admin-nav-active" : undefined}
            >
              {label}
            </a>
          ))}
          <a href="/" target="_blank" rel="noopener noreferrer">
            View site ↗
          </a>
          <button onClick={logout} className="btn-link">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}