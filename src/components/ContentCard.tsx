import Image from "next/image";
import { Content } from "@/lib/types";

const SEMANTIC = new Set(["pro", "con", "stat", "testimonial", "hero", "offer", "problem"]);

export default function ContentCard({ content }: { content: Content }) {
  const c = content;
  const primaryLink = c.links?.[0];

  const category = c.category || "";
  const isStat = category === "stat";
  const isQuote = category === "testimonial";
  const isPro = category === "pro";
  const isCon = category === "con";
  const isOffer = category === "offer";
  const isProblem = category === "problem";
  const isEmoji = category.length > 0 && category.length <= 3 && !SEMANTIC.has(category);
  const pill = category.length > 3 && !SEMANTIC.has(category) ? category : null;

  const cls = [
    "card",
    isStat ? "card--stat" : "",
    isQuote ? "card--quote" : "",
    isPro ? "card--pro" : "",
    isCon ? "card--con" : "",
    isOffer ? "card--offer" : "",
    isProblem ? "card--problem" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cls}>
      {c.image_url && (
        <Image
          src={c.image_url}
          alt={c.title ?? ""}
          className="card-img"
          width={700}
          height={438}
          sizes="(max-width: 680px) 100vw, 330px"
        />
      )}

      {isStat ? (
        <>
          <div className="stat-num">{c.title}</div>
          {c.body && <p className="card-body">{c.body}</p>}
        </>
      ) : isQuote ? (
        <>
          <div className="stars">{c.title}</div>
          <blockquote className="quote">{c.body}</blockquote>
        </>
      ) : (
        <>
          {isEmoji && <div className="card-icon">{category}</div>}
          {pill && <div className="card-pill">{pill}</div>}
          {c.title && <h3 className="card-title">{c.title}</h3>}
          {c.body && <p className="card-body">{c.body}</p>}
        </>
      )}

      {primaryLink && (c.cta_text || primaryLink.label) && (
        <a
          className="btn card-cta"
          href={primaryLink.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {c.cta_text || primaryLink.label}
        </a>
      )}
    </div>
  );
}
