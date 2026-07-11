import { createServerClient } from "./supabase/server";
import { AbTest, Content, Link, Page, SectionWithContents, SiteSettings } from "./types";

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  return data;
}

export async function getPageData(
  abVariant?: Record<string, "A" | "B">,
  template?: string
): Promise<{
  sections: SectionWithContents[];
  settings: SiteSettings | null;
  activeTemplate: string;
}> {
  const supabase = createServerClient();
  const settings = await getSiteSettings();
  const activeTemplate = template || settings?.active_template || "classic-sales";

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

  let sectionsWith = (sections ?? []).map((s: any) => ({
    ...s,
    contents: contentsBySection[s.id] ?? [],
  }));

  // A/B test: swap content_a → content_b jika variant = "B"
  if (abVariant && Object.keys(abVariant).length > 0) {
    const { data: abTests } = await supabase
      .from("ab_tests")
      .select("id, section_id, content_a_id, content_b_id")
      .eq("is_active", true)
      .eq("template", activeTemplate)
      .in("id", Object.keys(abVariant));

    const testById: Record<string, AbTest> = {};
    for (const t of abTests ?? []) testById[t.id] = t;

    sectionsWith = sectionsWith.map((section) => {
      const test = Object.values(testById).find((t) => t.section_id === section.id);
      if (!test || abVariant[test.id] !== "B") return section;

      const idxA = section.contents.findIndex((c: Content) => c.id === test.content_a_id);
      const idxB = section.contents.findIndex((c: Content) => c.id === test.content_b_id);
      if (idxA === -1 || idxB === -1) return section;

      const newContents = [...section.contents];
      newContents[idxA] = section.contents[idxB];
      return { ...section, contents: newContents };
    });
  }

  return { sections: sectionsWith, settings, activeTemplate };
}

export async function getActiveAbTests(template?: string): Promise<AbTest[]> {
  const supabase = createServerClient();
  const settings = await getSiteSettings();
  const activeTemplate = template || settings?.active_template || "classic-sales";
  const { data } = await supabase
    .from("ab_tests")
    .select("*")
    .eq("is_active", true)
    .eq("template", activeTemplate);
  return (data ?? []) as AbTest[];
}

// Cari page publik by slug. Publik hanya boleh page status='active'
// (RLS + filter eksplisit). Preview (admin) boleh membaca draft.
export async function getPageBySlug(
  slug: string,
  opts: { includeDrafts?: boolean } = {}
): Promise<Page | null> {
  const supabase = createServerClient();
  let query = supabase.from("pages").select("*").eq("slug", slug);
  if (!opts.includeDrafts) query = query.eq("status", "active");
  const { data } = await query.maybeSingle();
  return (data as Page | null) ?? null;
}

export async function getLinks(): Promise<Link[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("links")
    .select("*")
    .order("label", { ascending: true });
  return (data ?? []) as Link[];
}
