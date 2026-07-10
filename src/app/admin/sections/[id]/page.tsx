import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/guard";
import { createServerClient } from "@/lib/supabase/server";
import SectionForm from "../SectionForm";

export default async function EditSection({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin();
  const supabase = createServerClient();
  const { data } = await supabase
    .from("sections")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (!data) notFound();

  return (
    <div>
      <Link href="/admin/sections">← Kembali</Link>
      <h1>Edit Section</h1>
      <SectionForm section={data as any} />
    </div>
  );
}
