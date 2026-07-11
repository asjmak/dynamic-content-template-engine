import Link from "next/link";
import { requireAdmin } from "@/lib/guard";
import { createServerClient } from "@/lib/supabase/server";
import { deletePage } from "@/lib/actions";
import ConfirmDeleteForm from "@/components/ConfirmDeleteForm";

export default async function PagesList() {
  await requireAdmin();
  const supabase = createServerClient();
  const { data } = await supabase.from("pages").select("*").order("slug");

  return (
    <div>
      <div className="row-between">
        <h1>Pages</h1>
        <Link className="btn" href="/admin/pages/new">
          + New Page
        </Link>
      </div>
      <table>
        <thead>
          <tr>
            <th>Slug</th>
            <th>Template</th>
            <th>Title</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(data ?? []).map((p: any) => (
            <tr key={p.id}>
              <td>
                <code>/{p.slug}</code>
              </td>
              <td>
                <span className="block-chip">{p.template}</span>
              </td>
              <td>{p.title || "—"}</td>
              <td>
                <span
                  className={
                    p.status === "active" ? "status-dot on" : "status-dot off"
                  }
                  title={p.status}
                />
              </td>
              <td className="table-actions">
                <a href={`/${p.slug}`} target="_blank" rel="noopener noreferrer">
                  View
                </a>
                {p.status !== "active" && (
                  <a
                    href={`/${p.slug}?preview=1`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Preview
                  </a>
                )}
                <Link href={`/admin/pages/${p.id}`}>Edit</Link>
                <ConfirmDeleteForm
                  action={deletePage}
                  id={p.id}
                  message={`Delete page /${p.slug}?`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
