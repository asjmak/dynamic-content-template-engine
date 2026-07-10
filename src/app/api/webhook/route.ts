import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// Endpoint untuk aplikasi manajemen EKSTERNAL memperbarui data.
// Autentikasi: header "x-webhook-secret" harus sama dengan WEBHOOK_SECRET.
// Writes menggunakan SUPABASE_SERVICE_ROLE_KEY (bypass RLS).
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-webhook-secret");
  if (!secret || secret !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const results: Record<string, any> = {};

  if (Array.isArray(payload.sections)) {
    const { error } = await supabase
      .from("sections")
      .upsert(payload.sections, { onConflict: "id" });
    results.sections = error ? { error: error.message } : "ok";
  }

  // Link bisa di-update massal berdasarkan tracking_id.
  if (Array.isArray(payload.links)) {
    const { error } = await supabase
      .from("links")
      .upsert(payload.links, { onConflict: "tracking_id" });
    results.links = error ? { error: error.message } : "ok";
  }

  if (Array.isArray(payload.contents)) {
    const { error } = await supabase
      .from("contents")
      .upsert(payload.contents, { onConflict: "id" });
    results.contents = error ? { error: error.message } : "ok";
  }

  if (Array.isArray(payload.content_links)) {
    const { error } = await supabase
      .from("content_links")
      .upsert(payload.content_links, { onConflict: "id" });
    results.content_links = error ? { error: error.message } : "ok";
  }

  return NextResponse.json({ ok: true, results });
}

export async function GET() {
  return NextResponse.json({ status: "webhook ready", method: "POST" });
}
