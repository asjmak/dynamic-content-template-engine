import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/guard";
import { createServerClient } from "@/lib/supabase/server";
import LinkForm from "../LinkForm";

export default async function EditLink({ params }: { params: { id: string } }) {
  await requireAdmin();
  const supabase = createServerClient();
  const { data } = await supabase
    .from("links")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (!data) notFound();

  return (
    <div>
      <Link href="/admin/links">← Back</Link>
      <h1>Edit Link</h1>
      <LinkForm link={data as any} />
    </div>
  );
}
