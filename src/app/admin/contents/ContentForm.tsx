import { upsertContent } from "@/lib/actions";
import { createServerClient } from "@/lib/supabase/server";
import type { Content } from "@/lib/types";

export default async function ContentForm({
  content,
  defaultSection,
}: {
  content?: Content;
  defaultSection?: string;
}) {
  const supabase = createServerClient();
  const [
    { data: sections },
    { data: links },
  ] = await Promise.all([
    supabase.from("sections").select("id,title,block_type").order("ordering"),
    supabase.from("links").select("id,label,url").order("label"),
  ]);

  const selectedLinks = new Set((content?.links ?? []).map((l) => l.id));

  return (
    <form action={upsertContent} className="form">
      {content?.id && <input type="hidden" name="id" value={content.id} />}
      <label>
        Section
        <select
          name="section_id"
          defaultValue={content?.section_id ?? defaultSection ?? ""}
        >
          <option value="">— (tanpa section)</option>
          {(sections ?? []).map((s: any) => (
            <option key={s.id} value={s.id}>
              {s.title || s.block_type}
            </option>
          ))}
        </select>
      </label>
      <label>
        Category
        <input name="category" defaultValue={content?.category ?? ""} />
      </label>
      <label>
        Title
        <input name="title" defaultValue={content?.title ?? ""} />
      </label>
      <label>
        Body
        <textarea name="body" defaultValue={content?.body ?? ""} />
      </label>
      <label>
        Image URL
        <input name="image_url" defaultValue={content?.image_url ?? ""} />
      </label>
      <label>
        Video URL
        <input name="video_url" defaultValue={content?.video_url ?? ""} />
      </label>
      <label>
        CTA Text
        <input name="cta_text" defaultValue={content?.cta_text ?? ""} />
      </label>
      <label>
        Ordering
        <input type="number" name="ordering" defaultValue={content?.ordering ?? 0} />
      </label>
      <fieldset>
        <legend>Open Graph override (opsional)</legend>
        <label>
          OG Title
          <input name="og_title" defaultValue={content?.og_title ?? ""} />
        </label>
        <label>
          OG Description
          <textarea name="og_description" defaultValue={content?.og_description ?? ""} />
        </label>
        <label>
          OG Image URL
          <input name="og_image_url" defaultValue={content?.og_image_url ?? ""} />
        </label>
      </fieldset>
      <fieldset>
        <legend>Related Links</legend>
        {(links ?? []).map((l: any) => (
          <label key={l.id} className="checkbox">
            <input
              type="checkbox"
              name="linkIds"
              value={l.id}
              defaultChecked={selectedLinks.has(l.id)}
            />
            {l.label || l.url}
          </label>
        ))}
      </fieldset>
      <label className="checkbox">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={content?.is_active ?? true}
        />
        Active
      </label>
      <button className="btn" type="submit">
        Save
      </button>
    </form>
  );
}
