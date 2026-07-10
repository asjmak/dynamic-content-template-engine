"use client";

import { useState } from "react";
import { SectionWithContents } from "@/lib/types";

export default function LeadForm({ section }: { section: SectionWithContents }) {
  const s = section.settings || {};
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, phone, source: section.id }),
      });
      if (!res.ok) throw new Error("gagal");
      setStatus("done");
      if (s.redirect_url) {
        window.location.href = s.redirect_url;
      }
    } catch {
      setStatus("error");
      setMsg("Something went wrong. Please try again.");
    }
  }

  return (
    <section className="section">
      <div className="container single-column" style={{ maxWidth: 560 }}>
        <h2 className="section-title">{s.title || "Get Exclusive Info"}</h2>
        {s.subtitle && (
          <p style={{ textAlign: "center", color: "#64748b" }}>{s.subtitle}</p>
        )}
        {status === "done" && !s.redirect_url ? (
          <p className="dash-card" style={{ textAlign: "center" }}>
            Thank you! Our team will reach out shortly.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="form">
            <input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              placeholder="Phone (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button
              className="btn btn-lg"
              type="submit"
              disabled={status === "sending"}
            >
              {s.cta_label || "Submit"}
            </button>
            {status === "error" && <p className="error">{msg}</p>}
          </form>
        )}
      </div>
    </section>
  );
}
