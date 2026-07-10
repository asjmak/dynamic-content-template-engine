import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// Escape satu nilai agar aman untuk CSV (RFC 4180):
// - jika mengandung koma, quote, newline -> bungkus dengan quote
// - quote di dalam nilai digandakan (" -> "")
function csvCell(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function toCsv(rows: any[]): string {
  const header = ["id", "created_at", "name", "email", "phone", "source"];
  const lines = [header.map(csvCell).join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.id,
        r.created_at,
        r.name,
        r.email,
        r.phone,
        r.source,
      ]
        .map(csvCell)
        .join(",")
    );
  }
  // BOM agar Excel membaca UTF-8 dengan benar.
  return "﻿" + lines.join("\r\n");
}

// Export leads ke CSV. Hanya untuk admin yang sudah login (cookie auth).
export async function GET(req: NextRequest) {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: leads, error } = await admin
    .from("leads")
    .select("id, created_at, name, email, phone, source")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const csv = toCsv(leads ?? []);
  const stamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .replace("T", "_")
    .slice(0, 19);
  const filename = `leads-${stamp}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
