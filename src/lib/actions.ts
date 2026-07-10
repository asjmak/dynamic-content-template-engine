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
