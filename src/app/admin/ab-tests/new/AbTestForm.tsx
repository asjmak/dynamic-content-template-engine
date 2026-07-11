import { upsertAbTest } from "@/lib/actions";
import { createServerClient } from "@/lib/supabase/server";
import { TEMPLATES } from "@/lib/templates";
import type { AbTest } from "@/lib/types";

export default async function AbTestForm({ abTest }: { abTest?: AbTest }) {
  const supabase = createServerClient();

  // Ambil semua section (untuk pilihan section)
  const { data: sections } = await supabase
    .from("sections")
    .select("id,title,template,block_type")
    .eq("is_active", true)
    .order("ordering");

  // Ambil contents yang bisa dipasangkan
  const { data: contents } = await supabase
    .from("contents")
    .select("id,title,section_id")
    .eq("is_active", true)
    .order("ordering");

  // Filter contents per section untuk client-side autocomplete (kita sederhanakan di server)
  const groupedContents: Record<string, { id: string; title: string | null }[]> = {};
  for (const c of contents ?? []) {
    if (!c.section_id) continue;
    if (!groupedContents[c.section_id]) groupedContents[c.section_id] = [];
    groupedContents[c.section_id].push({ id: c.id, title: c.title });
  }

  return (
    <form action={upsertAbTest} className="form">
      {abTest?.id && <input type="hidden" name="id" value={abTest.id} />}

      <label>
        Test Name
        <input
          name="name"
          defaultValue={abTest?.name ?? ""}
          placeholder="e.g., Hero headline test July 2026"
          required
        />
      </label>

      <label>
        Template
        <select name="template" defaultValue={abTest?.template ?? ""} required>
          <option value="">— Select template —</option>
          {TEMPLATES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <label>
        Section
        <select name="section_id" defaultValue={abTest?.section_id ?? ""} required>
          <option value="">— Select section —</option>
          {(sections ?? []).map((s: any) => (
            <option key={s.id} value={s.id}>
              {s.title || s.block_type} ({s.template})
            </option>
          ))}
        </select>
      </label>

      <label>
        Content A (control)
        <select name="content_a_id" defaultValue={abTest?.content_a_id ?? ""} required>
          <option value="">— Select content —</option>
          {(contents ?? []).map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.title || c.id.slice(0, 8)}… (section: {c.section_id?.slice(0, 8)}…)
            </option>
          ))}
        </select>
      </label>

      <label>
        Content B (variation)
        <select name="content_b_id" defaultValue={abTest?.content_b_id ?? ""} required>
          <option value="">— Select content —</option>
          {(contents ?? []).map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.title || c.id.slice(0, 8)}… (section: {c.section_id?.slice(0, 8)}…)
            </option>
          ))}
        </select>
      </label>

      <label className="checkbox">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={abTest?.is_active ?? true}
        />
        Active (start splitting traffic immediately)
      </label>

      <button className="btn" type="submit">
        Save A/B Test
      </button>
    </form>
  );
}
