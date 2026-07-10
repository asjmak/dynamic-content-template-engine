import Link from "next/link";
import LinkForm from "../LinkForm";

export default function NewLink() {
  return (
    <div>
      <Link href="/admin/links">← Back</Link>
      <h1>New Link</h1>
      <LinkForm />
    </div>
  );
}
