import Link from "next/link";
import ContentForm from "../ContentForm";

export default function NewContent({
  searchParams,
}: {
  searchParams?: { section?: string };
}) {
  return (
    <div>
      <Link href="/admin/contents">← Back</Link>
      <h1>New Content</h1>
      <ContentForm defaultSection={searchParams?.section} />
    </div>
  );
}
