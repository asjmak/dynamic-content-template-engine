import Link from "next/link";
import ContentForm from "../ContentForm";

export default function NewContent() {
  return (
    <div>
      <Link href="/admin/contents">← Kembali</Link>
      <h1>Content Baru</h1>
      <ContentForm />
    </div>
  );
}
