import Link from "next/link";
import ContentForm from "../ContentForm";

export default function NewContent() {
  return (
    <div>
      <Link href="/admin/contents">← Back</Link>
      <h1>New Content</h1>
      <ContentForm />
    </div>
  );
}
