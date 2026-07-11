import { upsertPage } from "@/lib/actions";
import { TEMPLATES, PALETTES } from "@/lib/templates";
import type { Page } from "@/lib/types";

const STATUSES = ["active", "draft", "archived"];

export default function PageForm({ page }: { page?: Page }) {
  return (
    <form action={upsertPage} className="form">
      {page?.id && <input type="hidden" name="id" value={page.id} />}
      <label>
        Slug (URL path)
        <input
          name="slug"
          defaultValue={page?.slug ?? ""}
          required
          placeholder="vigrx-plus"
          pattern="[a-z0-9-]+"
          title="Hanya huruf kecil, angka, dan tanda hubung. Contoh: vigrx-plus"
        />
        <small style={{ color: "var(--muted)", fontWeight: 400 }}>
          Menjadi https://.../<b>slug</b> — mis. <code>vigrx-plus</code>
        </small>
      </label>
      <label>
        Template
        <select name="template" defaultValue={page?.template ?? "classic-sales"}>
          {TEMPLATES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>
      <label>
        Color Palette
        <select name="palette" defaultValue={page?.palette ?? "red"}>
          {PALETTES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </label>
      <label>
        SEO Title
        <input name="title" defaultValue={page?.title ?? ""} />
      </label>
      <label>
        Meta Description
        <textarea name="meta_description" defaultValue={page?.meta_description ?? ""} />
      </label>
      <label>
        Status
        <select name="status" defaultValue={page?.status ?? "active"}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <button className="btn" type="submit">
        Save
      </button>
    </form>
  );
}
