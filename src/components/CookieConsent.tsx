"use client";

import { useEffect, useState } from "react";

const KEY = "cookie-consent";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Tampilkan hanya jika belum ada pilihan tersimpan.
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(KEY, "accepted");
    } catch {
      /* ignore */
    }
    setShow(false);
    // Catatan: muat script analytics/pihak-ketiga HANYA setelah persetujuan.
  }

  function decline() {
    try {
      localStorage.setItem(KEY, "declined");
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie consent">
      <div className="cookie-banner__text">
        We use cookies to improve your experience and analyze traffic. By
        clicking &ldquo;Accept&rdquo;, you consent to our use of cookies. See our{" "}
        <a href="/privacy">Privacy Policy</a>.
      </div>
      <div className="cookie-banner__actions">
        <button className="btn btn-secondary" onClick={decline}>
          Decline
        </button>
        <button className="btn" onClick={accept}>
          Accept
        </button>
      </div>
    </div>
  );
}
