import Image from "next/image";
import { SectionWithContents } from "@/lib/types";

export default function Hero({ section }: { section: SectionWithContents }) {
  const s = section.settings || {};
  const hero = section.contents[0];
  const cta = s.cta_label || hero?.cta_text;
  const link = hero?.links?.[0];

  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          {s.rating && (
            <div className="rating">
              <span className="stars">★</span>
              <span>{s.rating}</span>
            </div>
          )}
          <h1 className="hero-heading">{s.heading || hero?.title || "Welcome"}</h1>
          {s.subheading && <p className="hero-sub">{s.subheading}</p>}
          {Array.isArray(s.badges) && s.badges.length > 0 && (
            <div className="hero-badges">
              {s.badges.map((b: string, i: number) => (
                <span key={i} className="badge badge-amber">
                  {b}
                </span>
              ))}
            </div>
          )}
          {Array.isArray(s.trust_items) && s.trust_items.length > 0 && (
            <div className="trust-row">
              {s.trust_items.map((t: any, i: number) => (
                <span key={i}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.8 7.2 17l.9-5.4L4.2 7.7l5.4-.8L12 2z" fill="#C9A24B"/>
                  </svg>
                  {t.text}
                </span>
              ))}
            </div>
          )}
          {link && cta && (
            <a
              className="btn btn-lg"
              href={link.url}
              {.../^#|\//.test(link.url) ? {} : { target: "_blank", rel: "noopener noreferrer" }}
            >
              {cta}
            </a>
          )}
        </div>

        {hero?.image_url && (
          <div className="hero-media">
            <Image
              className="hero-img"
              src={hero.image_url}
              alt={hero.title ?? ""}
              width={700}
              height={525}
              priority
              sizes="(max-width: 900px) 100vw, 500px"
            />
            <div className="guarantee-seal">
              67-Day
              <br />
              Guarantee
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
