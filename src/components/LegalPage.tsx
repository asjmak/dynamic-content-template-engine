import Link from "next/link";
import type { ReactNode } from "react";

export default function LegalPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="legal-page">
      <div className="container legal">
        <Link href="/" className="legal-back">
          ← Back to home
        </Link>
        <h1>{title}</h1>
        {children}
      </div>
    </main>
  );
}
