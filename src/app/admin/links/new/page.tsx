import Link from "next/link";
import LinkForm from "../LinkForm";

export default function NewLink() {
  return (
    <div>
      <Link href="/admin/links">← Kembali</Link>
      <h1>Link Baru</h1>
      <LinkForm />
    </div>
  );
}
