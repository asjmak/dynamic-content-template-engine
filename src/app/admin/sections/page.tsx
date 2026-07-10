import Link from "next/link";
import { requireAdmin } from "@/lib/guard";
import { createServerClient } from "@/lib/supabase/server";
import { deleteSection } from "@/lib/actions";

export default async function SectionsList() {
  await requireAdmin();
  const supabase = createServerClient();
  const { data } = await supabase
    .from("sections")
    .select("*")
    .order("ordering", { ascending: true });

  return (
    <div>
      <div className="row-between">
        <h1>Sections</h1>
        <Link className="btn" href="/admin/sections/new">
          + New Section
        </Link>
      </div>
      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Type</th>
            <th>Title</th>
            <th>Template</th>
            <th>Active</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(data ?? []).map((s: any) => (
            <tr key={s.id}>
              <td>{s.ordering}</td>
              <td>{s.block_type}</td>
              <td>{s.title}</td>
              <td>{s.template}</td>
              <td>{s.is_active ? "✓" : "—"}</td>
              <td className="table-actions">
                <Link href={`/admin/sections/${s.id}`}>Edit</Link>
                <form action={deleteSection} onSubmit={(e: any) => {
                  if (!confirm("Delete this section and all its contents?")) e.preventDefault();
                }}>
                  <input type="hidden" name="id" value={s.id} />
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