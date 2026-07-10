import Link from "next/link";
import SectionForm from "../SectionForm";

export default function NewSection() {
  return (
    <div>
      <Link href="/admin/sections">← Kembali</Link>
      <h1>Section Baru</h1>
      <SectionForm />
    </div>
  );
}
