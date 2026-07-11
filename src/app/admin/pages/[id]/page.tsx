import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/guard";
import { createServerClient } from "@/lib/supabase/server";
import PageForm from "../PageForm";

export default async function EditPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin();
  const supabase = createServerClient();
  const { data } = await supabase
    .from("pages")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (!data) notFound();

  return (
    <div>
      <Link href="/admin/pages">← Back</Link>
      <h1>Edit Page</h1>
      <PageForm page={data as any} />
    </div>
  );
}
