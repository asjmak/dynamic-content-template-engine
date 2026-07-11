import Link from "next/link";
import { requireAdmin } from "@/lib/guard";
import AbTestForm from "./AbTestForm";

export default async function NewAbTest() {
  await requireAdmin();
  return (
    <div>
      <Link href="/admin/ab-tests">← Back</Link>
      <h1>New A / B Test</h1>
      <AbTestForm />
    </div>
  );
}
