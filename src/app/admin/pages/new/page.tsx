import Link from "next/link";
import PageForm from "../PageForm";

export default function NewPage() {
  return (
    <div>
      <Link href="/admin/pages">← Back</Link>
      <h1>New Page</h1>
      <PageForm />
    </div>
  );
}
