import { SectionWithContents } from "@/lib/types";

export default function Hero({ section }: { section: SectionWithContents }) {
  const s = section.settings || {};
  const hero = section.contents[0];
  const cta = s.cta_label || hero?.cta_text;
  const link = hero?.links?.[0];

  return (
    <section className="hero">
      <div className="container hero-inner">
        <h1 className="hero-heading">{s.heading || hero?.title || "Selamat Datang"}</h1>
        {s.subheading && <p className="hero-sub">{s.subheading}</p>}
        {hero?.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="hero-img" src={hero.image_url} alt={hero.title ?? ""} />
        )}
        {link && cta && (
          <a className="btn btn-lg" href={link.url} target="_blank" rel="noopener noreferrer">
            {cta}
          </a>
        )}
      </div>
    </section>
  );
}
