import Link from "next/link";
import { requireAdmin } from "@/lib/guard";
import { createServerClient } from "@/lib/supabase/server";
import { deleteContent } from "@/lib/actions";

export default async function ContentsList() {
  await requireAdmin();
  const supabase = createServerClient();
  const { data } = await supabase
    .from("contents")
    .select("id, title, section_id, ordering, is_active, sections(title)")
    .order("ordering", { ascending: true });

  return (
    <div>
      <div className="row-between">
        <h1>Contents</h1>
        <Link className="btn" href="/admin/contents/new">
          + Baru
        </Link>
      </div>
      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Title</th>
            <th>Section</th>
            <th>Active</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(data ?? []).map((c: any) => (
            <tr key={c.id}>
              <td>{c.ordering}</td>
              <td>{c.title}</td>
              <td>{c.sections?.title ?? "—"}</td>
              <td>{c.is_active ? "✓" : "—"}</td>
              <td style={{ display: "flex", gap: 8 }}>
                <Link href={`/admin/contents/${c.id}`}>Edit</Link>
                <form action={deleteContent}>
                  <input type="hidden" name="id" value={c.id} />
                  <button type="submit" className="btn-link">
                    Hapus
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
