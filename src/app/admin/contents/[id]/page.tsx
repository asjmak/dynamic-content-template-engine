import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/guard";
import { createServerClient } from "@/lib/supabase/server";
import ContentForm from "../ContentForm";

function mapContent(row: any) {
  const links = (row.content_links ?? []).map((cl: any) => cl.link).filter(Boolean);
  const { content_links, ...rest } = row;
  return { ...rest, links };
}

export default async function EditContent({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin();
  const supabase = createServerClient();
  const { data } = await supabase
    .from("contents")
    .select("*, content_links(link:links(*))")
    .eq("id", params.id)
    .maybeSingle();

  if (!data) notFound();

  return (
    <div>
      <Link href="/admin/contents">← Back</Link>
      <h1>Edit Content</h1>
      <ContentForm content={mapContent(data) as any} />
    </div>
  );
}
