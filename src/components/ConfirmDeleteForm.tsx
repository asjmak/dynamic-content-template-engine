"use client";

import type { FormEvent } from "react";

// Client wrapper so the delete confirmation dialog (confirm()) can run in the
// browser. The server action is passed in as a prop from the Server Component.
export default function ConfirmDeleteForm({
  action,
  id,
  message,
  label = "Delete",
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  message: string;
  label?: string;
}) {
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    if (!confirm(message)) e.preventDefault();
  }

  return (
    <form action={action} onSubmit={onSubmit}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="btn-link">
        {label}
      </button>
    </form>
  );
}
