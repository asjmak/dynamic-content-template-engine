import Link from "next/link";
import { requireAdmin } from "@/lib/guard";
import { createServerClient } from "@/lib/supabase/server";
import { deleteLink } from "@/lib/actions";

export default async function LinksList() {
  await requireAdmin();
  const supabase = createServerClient();
  const { data } = await supabase
    .from("links")
    .select("*")
    .order("label", { ascending: true });

  return (
    <div>
      <div className="row-between">
        <h1>Links</h1>
        <Link className="btn" href="/admin/links/new">
          + New Link
        </Link>
      </div>
      <table>
        <thead>
          <tr>
            <th>Label</th>
            <th>URL</th>
            <th>Tracking ID</th>
            <th>Active</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(data ?? []).map((l: any) => (
            <tr key={l.id}>
              <td>{l.label}</td>
              <td>
                <a href={l.url} target="_blank" rel="noopener noreferrer">
                  {l.url}
                </a>
              </td>
              <td>{l.tracking_id}</td>
              <td>{l.is_active ? "✓" : "—"}</td>
              <td className="table-actions">
                <Link href={`/admin/links/${l.id}`}>Edit</Link>
                <form action={deleteLink} onSubmit={(e: any) => {
                  if (!confirm("Delete this link?")) e.preventDefault();
                }}>
                  <input type="hidden" name="id" value={l.id} />
                  <button type="submit" className="btn-link">
                    Delete
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