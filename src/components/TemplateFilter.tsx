import { TEMPLATES } from "@/lib/templates";

// Filter template berbasis GET form — bisa dipakai di Server Component.
// Mengubah pilihan lalu "Apply" akan navigasi ke ?template=<value>.
export default function TemplateFilter({
  current = "",
  basePath,
}: {
  current?: string;
  basePath: string;
}) {
  return (
    <form method="get" className="template-filter">
      <label>
        Template
        <select name="template" defaultValue={current}>
          <option value="">All templates</option>
          {TEMPLATES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>
      <span className="template-filter-actions">
        <button type="submit" className="btn">
          Apply
        </button>
        {current ? (
          <a className="btn-link" href={basePath}>
            Clear
          </a>
        ) : null}
      </span>
    </form>
  );
}
