import Link from "next/link";
import { requireAdmin } from "@/lib/guard";
import { createServerClient } from "@/lib/supabase/server";
import { deleteContent } from "@/lib/actions";
import ConfirmDeleteForm from "@/components/ConfirmDeleteForm";
import ContentReorder from "@/components/ContentReorder";
import TemplateFilter from "@/components/TemplateFilter";

export default async function ContentsList({
  searchParams,
}: {
  searchParams?: { template?: string };
}) {
  await requireAdmin();
  const supabase = createServerClient();
  const tpl = searchParams?.template;

  // ---- Tampilan terkelompok per Section (saat 1 template dipilih) ----
  if (tpl) {
    const { data: sections } = await supabase
      .from("sections")
      .select("id, title, block_type, ordering, is_active, template")
      .eq("template", tpl)
      .order("ordering");

    const sectionIds = (sections ?? []).map((s) => s.id);
    let contents: any[] = [];
    if (sectionIds.length) {
      const { data } = await supabase
        .from("contents")
        .select("id, title, ordering, is_active, section_id")
        .in("section_id", sectionIds)
        .order("ordering");
      contents = data ?? [];
    }

    const grouped = (sections ?? []).map((sec) => ({
      ...sec,
      items: contents.filter((c) => c.section_id === sec.id),
    }));

    return (
      <div>
        <div className="row-between">
          <h1>Contents</h1>
          <Link className="btn" href="/admin/contents/new">
            + New Content
          </Link>
        </div>
        <TemplateFilter current={tpl} basePath="/admin/contents" />

        {grouped.length === 0 ? (
          <p className="empty">No sections found for template “{tpl}”.</p>
        ) : (
          grouped.map((sec: any) => (
            <details className="section-group" open key={sec.id}>
              <summary className="section-head">
                <span className="section-toggle">▾</span>
                <span className="section-title-text">
                  {sec.title || sec.block_type}
                </span>
                <span className="block-chip">{sec.block_type}</span>
                <span
                  className={sec.is_active ? "status-dot on" : "status-dot off"}
                  title={sec.is_active ? "Active" : "Inactive"}
                />
                <span className="section-meta">
                  {sec.items.length} item{sec.items.length === 1 ? "" : "s"}
                </span>
                <span className="section-head-actions">
                  <Link
                    className="btn-link"
                    href={`/admin/sections/${sec.id}`}
                  >
                    Edit section
                  </Link>
                  <Link
                    className="btn btn-sm"
                    href={`/admin/contents/new?section=${sec.id}`}
                  >
                    + Add
                  </Link>
                </span>
              </summary>

              <div className="section-body">
                {sec.items.length === 0 ? (
                  <p className="empty">
                    No content in this section yet. Use “+ Add” to create one.
                  </p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Title</th>
                        <th>Template</th>
                        <th>Active</th>
                        <th>Move</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {sec.items.map((c: any, i: number) => (
                        <tr key={c.id}>
                          <td>{c.ordering}</td>
                          <td>{c.title}</td>
                          <td>{sec.template}</td>
                          <td>{c.is_active ? "✓" : "—"}</td>
                          <td className="reorder-cell">
                            <ContentReorder
                              id={c.id}
                              dir="up"
                              disabled={i === 0}
                            />
                            <ContentReorder
                              id={c.id}
                              dir="down"
                              disabled={i === sec.items.length - 1}
                            />
                          </td>
                          <td className="table-actions">
                            <Link href={`/admin/contents/${c.id}`}>Edit</Link>
                            <ConfirmDeleteForm
                              action={deleteContent}
                              id={c.id}
                              message="Delete this content item?"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </details>
          ))
        )}
      </div>
    );
  }

  // ---- Tampilan datar (All templates) ----
  const { data } = await supabase
    .from("contents")
    .select(`id, title, section_id, ordering, is_active, sections(title, template)`)
    .order("ordering");

  return (
    <div>
      <div className="row-between">
        <h1>Contents</h1>
        <Link className="btn" href="/admin/contents/new">
          + New Content
        </Link>
      </div>
      <TemplateFilter current="" basePath="/admin/contents" />
      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Title</th>
            <th>Section</th>
            <th>Template</th>
            <th>Active</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(data ?? []).map((c: any) => (
            <tr key={c.id}>
              <td>{c.ordering}</td>
              <td>{c.title}</td>
              <td>{c.sections?.title || "—"}</td>
              <td>{c.sections?.template || "—"}</td>
              <td>{c.is_active ? "✓" : "—"}</td>
              <td className="table-actions">
                <Link href={`/admin/contents/${c.id}`}>Edit</Link>
                <ConfirmDeleteForm
                  action={deleteContent}
                  id={c.id}
                  message="Delete this content item?"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
