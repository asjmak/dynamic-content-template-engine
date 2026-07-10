import Link from "next/link";
import SectionForm from "../SectionForm";

export default function NewSection() {
  return (
    <div>
      <Link href="/admin/sections">← Back</Link>
      <h1>New Section</h1>
      <SectionForm />
    </div>
  );
}
