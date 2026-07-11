"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServerClient } from "./supabase/server";
import { requireAdmin } from "./guard";

function num(v: FormDataEntryValue | null): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
function str(v: FormDataEntryValue | null): string {
  return v == null ? "" : String(v);
}
function bool(v: FormDataEntryValue | null): boolean {
  return v === "on" || v === "true" || v === "1";
}
function parseJson(s: string) {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}

// ---------------- SECTIONS ----------------
export async function upsertSection(formData: FormData) {
  await requireAdmin();
  const supabase = createServerClient();
  const id = str(formData.get("id"));
  const payload = {
    block_type: str(formData.get("block_type")),
    title: str(formData.get("title")) || null,
    ordering: num(formData.get("ordering")),
    settings: parseJson(str(formData.get("settings")) || "{}"),
    template: str(formData.get("template")) || "classic-sales",
    is_active: bool(formData.get("is_active")),
  };
  if (id) {
    await supabase.from("sections").update(payload).eq("id", id);
  } else {
    await supabase.from("sections").insert(payload);
  }
  revalidatePath("/");
  revalidatePath("/admin/sections");
  redirect("/admin/sections");
}

export async function deleteSection(formData: FormData) {
  await requireAdmin();
  const supabase = createServerClient();
  const id = str(formData.get("id"));
  if (id) await supabase.from("sections").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/sections");
  redirect("/admin/sections");
}

// ---------------- PAGES (multi-slug) ----------------
export async function upsertPage(formData: FormData) {
  await requireAdmin();
  const supabase = createServerClient();
  const id = str(formData.get("id"));
  const slug = str(formData.get("slug")).toLowerCase().trim();
  if (!slug) {
    redirect("/admin/pages");
    return;
  }
  const payload = {
    slug,
    template: str(formData.get("template")) || "classic-sales",
    title: str(formData.get("title")) || null,
    meta_description: str(formData.get("meta_description")) || null,
    status: str(formData.get("status")) || "active",
    palette: str(formData.get("palette")) || "red",
    updated_at: new Date().toISOString(),
  };
  if (id) {
    await supabase.from("pages").update(payload).eq("id", id);
  } else {
    await supabase.from("pages").insert(payload);
  }
  revalidatePath("/admin/pages");
  revalidatePath("/");
  revalidatePath("/" + slug);
  redirect("/admin/pages");
}

export async function deletePage(formData: FormData) {
  await requireAdmin();
  const supabase = createServerClient();
  const id = str(formData.get("id"));
  if (id) await supabase.from("pages").delete().eq("id", id);
  revalidatePath("/admin/pages");
  revalidatePath("/");
  redirect("/admin/pages");
}

// ---------------- SITE SETTINGS (default palette global) ----------------
export async function setDefaultPalette(formData: FormData) {
  await requireAdmin();
  const supabase = createServerClient();
  const palette = str(formData.get("palette")) || "red";
  await supabase.from("site_settings").update({ palette }).eq("id", 1);
  revalidatePath("/");
  revalidatePath("/admin/templates");
  redirect("/admin/templates");
}

// ---------------- CONTENTS ----------------
export async function upsertContent(formData: FormData) {
  await requireAdmin();
  const supabase = createServerClient();
  const id = str(formData.get("id"));
  const payload = {
    section_id: str(formData.get("section_id")) || null,
    category: str(formData.get("category")) || null,
    title: str(formData.get("title")) || null,
    body: str(formData.get("body")) || null,
    image_url: str(formData.get("image_url")) || null,
    video_url: str(formData.get("video_url")) || null,
    cta_text: str(formData.get("cta_text")) || null,
    ordering: num(formData.get("ordering")),
    og_title: str(formData.get("og_title")) || null,
    og_description: str(formData.get("og_description")) || null,
    og_image_url: str(formData.get("og_image_url")) || null,
    is_active: bool(formData.get("is_active")),
  };

  let contentId = id;
  if (id) {
    await supabase.from("contents").update(payload).eq("id", id);
  } else {
    const { data } = await supabase
      .from("contents")
      .insert(payload)
      .select("id")
      .single();
    contentId = data?.id;
  }

  if (contentId) {
    const linkIds = formData.getAll("linkIds").map(String).filter(Boolean);
    await supabase.from("content_links").delete().eq("content_id", contentId);
    if (linkIds.length) {
      await supabase
        .from("content_links")
        .insert(linkIds.map((link_id) => ({ content_id: contentId, link_id })));
    }
  }

  revalidatePath("/");
  revalidatePath("/admin/contents");
  redirect("/admin/contents");
}

export async function deleteContent(formData: FormData) {
  await requireAdmin();
  const supabase = createServerClient();
  const id = str(formData.get("id"));
  if (id) await supabase.from("contents").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/contents");
  redirect("/admin/contents");
}

// Pindah urutan content ke atas/bawah dalam section yang sama.
// Menggeser posisi lalu menomori ulang ordering 0..n agar selalu konsisten.
export async function reorderContent(formData: FormData) {
  await requireAdmin();
  const supabase = createServerClient();
  const id = str(formData.get("id"));
  const dir = str(formData.get("dir")) === "down" ? "down" : "up";
  if (!id) return;

  const { data: cur } = await supabase
    .from("contents")
    .select("id, section_id")
    .eq("id", id)
    .single();
  if (!cur || !cur.section_id) return;

  const { data: list } = await supabase
    .from("contents")
    .select("id")
    .eq("section_id", cur.section_id)
    .order("ordering")
    .order("id");
  if (!list || list.length < 2) return;

  const idx = list.findIndex((c) => c.id === id);
  if (idx < 0) return;
  const target = dir === "up" ? idx - 1 : idx + 1;
  if (target < 0 || target >= list.length) return;

  const arr = [...list];
  [arr[idx], arr[target]] = [arr[target], arr[idx]];

  await Promise.all(
    arr.map((c, i) =>
      supabase.from("contents").update({ ordering: i }).eq("id", c.id)
    )
  );
  revalidatePath("/admin/contents");
  revalidatePath("/");
}

// ---------------- LINKS ----------------
export async function upsertLink(formData: FormData) {
  await requireAdmin();
  const supabase = createServerClient();
  const id = str(formData.get("id"));
  const payload = {
    label: str(formData.get("label")) || null,
    url: str(formData.get("url")),
    tracking_id: str(formData.get("tracking_id")) || null,
    is_active: bool(formData.get("is_active")),
  };
  if (!payload.url) {
    redirect("/admin/links");
  }
  if (id) {
    await supabase.from("links").update(payload).eq("id", id);
  } else {
    await supabase.from("links").insert(payload);
  }
  revalidatePath("/");
  revalidatePath("/admin/links");
  redirect("/admin/links");
}

export async function deleteLink(formData: FormData) {
  await requireAdmin();
  const supabase = createServerClient();
  const id = str(formData.get("id"));
  if (id) await supabase.from("links").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/links");
  redirect("/admin/links");
}

// ---------------- TEMPLATE (pilih template aktif) ----------------
export async function setActiveTemplate(formData: FormData) {
  await requireAdmin();
  const supabase = createServerClient();
  const tpl = str(formData.get("template")) || "classic-sales";
  await supabase.from("site_settings").update({ active_template: tpl }).eq("id", 1);
  revalidatePath("/");
  revalidatePath("/admin/templates");
  redirect("/admin/templates");
}

// ---------------- A/B TESTS ----------------
export async function upsertAbTest(formData: FormData) {
  await requireAdmin();
  const supabase = createServerClient();
  const id = str(formData.get("id"));
  const payload = {
    name: str(formData.get("name")),
    template: str(formData.get("template")) || "classic-sales",
    section_id: str(formData.get("section_id")),
    content_a_id: str(formData.get("content_a_id")),
    content_b_id: str(formData.get("content_b_id")),
    is_active: bool(formData.get("is_active")),
  };
  if (!payload.name || !payload.section_id || !payload.content_a_id || !payload.content_b_id) {
    redirect("/admin/ab-tests");
  }
  if (id) {
    await supabase.from("ab_tests").update(payload).eq("id", id);
  } else {
    await supabase.from("ab_tests").insert(payload);
  }
  revalidatePath("/");
  revalidatePath("/admin/ab-tests");
  redirect("/admin/ab-tests");
}

export async function deleteAbTest(formData: FormData) {
  await requireAdmin();
  const supabase = createServerClient();
  const id = str(formData.get("id"));
  if (id) await supabase.from("ab_tests").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/ab-tests");
  redirect("/admin/ab-tests");
}

export async function toggleAbTest(formData: FormData) {
  await requireAdmin();
  const supabase = createServerClient();
  const id = str(formData.get("id"));
  const active = bool(formData.get("is_active"));
  if (id) await supabase.from("ab_tests").update({ is_active: active }).eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/ab-tests");
  redirect("/admin/ab-tests");
}
