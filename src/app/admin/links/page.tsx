import Link from "next/link";
import { requireAdmin } from "@/lib/guard";
import { createServerClient } from "@/lib/supabase/server";
import { deleteLink } from "@/lib/actions";
import ConfirmDeleteForm from "@/components/ConfirmDeleteForm";
import TemplateFilter from "@/components/TemplateFilter";

// Cari link yang dipakai oleh konten milik template terpilih.
// Alur: template -> sections.id -> contents.id -> content_links.link_id
async function linkIdsForTemplate(supabase: any, template: string) {
  const { data: sections } = await supabase
    .from("sections")
    .select("id")
    .eq("template", template);
  const sectionIds = (sections ?? []).map((s: any) => s.id);

  const { data: contents } = await supabase
    .from("contents")
    .select("id")
    .in("section_id", sectionIds.length ? sectionIds : ["__none__"]);
  const contentIds = (contents ?? []).map((c: any) => c.id);

  const { data: links } = await supabase
    .from("content_links")
    .select("link_id")
    .in("content_id", contentIds.length ? contentIds : ["__none__"]);
  return (links ?? []).map((l: any) => l.link_id);
}

export default async function LinksList({
  searchParams,
}: {
  searchParams?: { template?: string };
}) {
  await requireAdmin();
  const supabase = createServerClient();

  let linkIds: string[] | null = null;
  if (searchParams?.template) {
    linkIds = await linkIdsForTemplate(supabase, searchParams.template);
  }

  let query = supabase
    .from("links")
    .select("*")
    .order("label", { ascending: true });
  if (linkIds) {
    query = query.in("id", linkIds.length ? linkIds : ["__none__"]);
  }
  const { data } = await query;

  return (
    <div>
      <div className="row-between">
        <h1>Links</h1>
        <Link className="btn" href="/admin/links/new">
          + New Link
        </Link>
      </div>
      <TemplateFilter
        current={searchParams?.template ?? ""}
        basePath="/admin/links"
      />
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
                <ConfirmDeleteForm
                  action={deleteLink}
                  id={l.id}
                  message="Delete this link?"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
