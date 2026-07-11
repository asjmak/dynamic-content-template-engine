import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function parseAbCookie(req: NextRequest): Record<string, "A" | "B"> {
  const raw = req.cookies.get("ab-variant")?.value || "{}";
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    if (parsed && typeof parsed === "object") return parsed;
  } catch {}
  return {};
}

// Menyimpan prospek dari form lead-gen. Pakai service role (bypass RLS).
// Jika ada cookie "ab-variant" dan A/B test aktif yang cocok section_id=source,
// simpan ab_test_id & ab_variant untuk tracking konversi.
export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, phone, source } = body || {};
  if (!name && !email && !phone) {
    return NextResponse.json({ error: "Data kosong" }, { status: 400 });
  }

  let ab_test_id = null as string | null;
  let ab_variant = null as string | null;

  const abMap = parseAbCookie(req);
  const testIds = Object.keys(abMap);
  if (testIds.length > 0 && source) {
    const admin = createAdminClient();
    const { data: tests } = await admin
      .from("ab_tests")
      .select("id")
      .eq("section_id", source)
      .in("id", testIds)
      .eq("is_active", true)
      .limit(1);

    if (tests && tests.length > 0) {
      ab_test_id = tests[0].id;
      ab_variant = abMap[tests[0].id] || null;
    }
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("leads").insert({
    name: name || null,
    email: email || null,
    phone: phone || null,
    source: source || null,
    ab_test_id,
    ab_variant,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
