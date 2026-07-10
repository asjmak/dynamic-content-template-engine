import { createServerClient } from "./supabase/server";
import { Link, SectionWithContents, SiteSettings } from "./types";

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  return data;
}

export async function getPageData(): Promise<{
  sections: SectionWithContents[];
  settings: SiteSettings | null;
  activeTemplate: string;
}> {
  const supabase = createServerClient();
  const settings = await getSiteSettings();
  const activeTemplate = settings?.active_template || "classic-sales";

  const { data: sections } = await supabase
    .from("sections")
    .select("*")
    .eq("is_active", true)
    .eq("template", activeTemplate)
    .order("ordering", { ascending: true });

  const sectionIds = (sections ?? []).map((s: any) => s.id);
  const contentsBySection: Record<string, any[]> = {};

  if (sectionIds.length) {
    const { data: contents } = await supabase
      .from("contents")
      .select("*, content_links(link:links(*))")
      .eq("is_active", true)
      .in("section_id", sectionIds)
      .order("ordering", { ascending: true });

    for (const c of contents ?? []) {
      const links = (c.content_links ?? [])
        .map((cl: any) => cl.link)
        .filter(Boolean);
      const { content_links, ...rest } = c;
      const mapped = { ...rest, links };
      if (!contentsBySection[c.section_id]) contentsBySection[c.section_id] = [];
      contentsBySection[c.section_id].push(mapped);
    }
  }

  const sectionsWith = (sections ?? []).map((s: any) => ({
    ...s,
    contents: contentsBySection[s.id] ?? [],
  }));

  return { sections: sectionsWith, settings, activeTemplate };
}

export async function getLinks(): Promise<Link[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("links")
    .select("*")
    .order("label", { ascending: true });
  return (data ?? []) as Link[];
}
