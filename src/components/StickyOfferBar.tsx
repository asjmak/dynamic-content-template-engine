"use client";

import { useState, useEffect } from "react";

export default function StickyOfferBar() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Check if user already dismissed
    if (typeof window !== "undefined") {
      const dismissed = localStorage.getItem("offer-bar-dismissed");
      if (dismissed) setVisible(false);
    }
  }, []);

  const handleClose = () => {
    setVisible(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("offer-bar-dismissed", "1");
    }
  };

  if (!visible) return null;

  return (
    <div className="offer-bar" id="offerBar">
      <button className="ob-x" id="offerClose" aria-label="Dismiss" onClick={handleClose}>
        &times;
      </button>
      <span className="ob-text">
        &#128666; <b>FREE</b> discreet shipping &bull; 67-day money-back guarantee &bull; lock in today&#39;s price
      </span>
      <a href="#order" className="btn btn-gold js-lead">
        Order Now
      </a>
    </div>
  );
}