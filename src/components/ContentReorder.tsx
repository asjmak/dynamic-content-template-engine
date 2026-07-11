"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { reorderContent } from "@/lib/actions";

export default function ContentReorder({
  id,
  dir,
  disabled,
}: {
  id: string;
  dir: "up" | "down";
  disabled?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="reorder-btn"
      disabled={disabled || pending}
      aria-label={dir === "up" ? "Move up" : "Move down"}
      onClick={() => {
        startTransition(async () => {
          const fd = new FormData();
          fd.set("id", id);
          fd.set("dir", dir);
          await reorderContent(fd);
          router.refresh();
        });
      }}
    >
      {dir === "up" ? "↑" : "↓"}
    </button>
  );
}
