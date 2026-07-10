import Link from "next/link";
import { requireAdmin } from "@/lib/guard";
import { createServerClient } from "@/lib/supabase/server";

export default async function Dashboard() {
  await requireAdmin();
  const supabase = createServerClient();

  const [
    { count: sections },
    { count: contents },
    { count: links },
  ] = await Promise.all([
    supabase.from("sections").select("*", { count: "exact", head: true }),
    supabase.from("contents").select("*", { count: "exact", head: true }),
    supabase.from("links").select("*", { count: "exact", head: true }),
  ]);

  const cards = [
    { label: "Sections", num: sections ?? 0, href: "/admin/sections" },
    { label: "Contents", num: contents ?? 0, href: "/admin/contents" },
    { label: "Links", num: links ?? 0, href: "/admin/links" },
  ];

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Kelola struktur, konten, dan link affiliate dari satu tempat.</p>
      <div className="dash-cards">
        {cards.map((c) => (
          <div className="dash-card" key={c.label}>
            <div className="num">{c.num}</div>
            <div>{c.label}</div>
            <Link href={c.href}>Kelola →</Link>
          </div>
        ))}
      </div>
      <p style={{ marginTop: 24 }}>
        <Link className="btn" href="/">
          Lihat website →
        </Link>
      </p>
    </div>
  );
}
