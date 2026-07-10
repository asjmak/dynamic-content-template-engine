import { upsertSection } from "@/lib/actions";
import type { Section } from "@/lib/types";

const BLOCKS: Section["block_type"][] = [
  "hero",
  "grid",
  "slider",
  "single_column",
  "footer",
  "lead_form",
];

const TEMPLATES = ["classic-sales", "lead-gen", "modern-review", "long-form", "comparison"];

export default function SectionForm({ section }: { section?: Section }) {
  return (
    <form action={upsertSection} className="form">
      {section?.id && <input type="hidden" name="id" value={section.id} />}
      <label>
        Block Type
        <select name="block_type" defaultValue={section?.block_type ?? "grid"} required>
          {BLOCKS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </label>
      <label>
        Template
        <select name="template" defaultValue={section?.template ?? "classic-sales"}>
          {TEMPLATES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>
      <label>
        Title
        <input name="title" defaultValue={section?.title ?? ""} />
      </label>
      <label>
        Ordering
        <input
          type="number"
          name="ordering"
          defaultValue={section?.ordering ?? 0}
        />
      </label>
      <label>
        Settings (JSON)
        <textarea name="settings" defaultValue={JSON.stringify(section?.settings ?? {}, null, 2)} />
      </label>
      <label className="checkbox">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={section?.is_active ?? true}
        />
        Active
      </label>
      <button className="btn" type="submit">
        Simpan
      </button>
    </form>
  );
}
