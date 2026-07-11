import Link from "next/link";
import { requireAdmin } from "@/lib/guard";
import { createServerClient } from "@/lib/supabase/server";
import { deleteSection } from "@/lib/actions";
import ConfirmDeleteForm from "@/components/ConfirmDeleteForm";
import TemplateFilter from "@/components/TemplateFilter";

export default async function SectionsList({
  searchParams,
}: {
  searchParams?: { template?: string };
}) {
  await requireAdmin();
  const supabase = createServerClient();

  let query = supabase
    .from("sections")
    .select("*")
    .order("ordering", { ascending: true });
  if (searchParams?.template) {
    query = query.eq("template", searchParams.template);
  }
  const { data } = await query;

  // Hitung jumlah content per section untuk kolom "Contents".
  const sectionIds = (data ?? []).map((s: any) => s.id);
  const counts: Record<string, number> = {};
  if (sectionIds.length) {
    const { data: conts } = await supabase
      .from("contents")
      .select("section_id")
      .in("section_id", sectionIds);
    for (const c of conts ?? []) {
      counts[c.section_id] = (counts[c.section_id] ?? 0) + 1;
    }
  }

  return (
    <div>
      <div className="row-between">
        <h1>Sections</h1>
        <Link className="btn" href="/admin/sections/new">
          + New Section
        </Link>
      </div>
      <TemplateFilter
        current={searchParams?.template ?? ""}
        basePath="/admin/sections"
      />
      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Section</th>
            <th>Template</th>
            <th>Contents</th>
            <th>Active</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(data ?? []).map((s: any) => (
            <tr key={s.id}>
              <td>{s.ordering}</td>
              <td>
                <span className="block-chip">{s.block_type}</span>{" "}
                <span className="section-cell-title">{s.title || "—"}</span>
              </td>
              <td>{s.template}</td>
              <td>
                <Link
                  className="count-link"
                  href={`/admin/contents?template=${s.template}`}
                >
                  {counts[s.id] ?? 0}
                </Link>
              </td>
              <td>{s.is_active ? "✓" : "—"}</td>
              <td className="table-actions">
                <Link href={`/admin/sections/${s.id}`}>Edit</Link>
                <ConfirmDeleteForm
                  action={deleteSection}
                  id={s.id}
                  message="Delete this section and all its contents?"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
