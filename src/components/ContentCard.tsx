import { Content } from "@/lib/types";

export default function ContentCard({ content }: { content: Content }) {
  const primaryLink = content.links?.[0];
  return (
    <div className="card">
      {content.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={content.image_url} alt={content.title ?? ""} className="card-img" />
      )}
      {content.title && <h3 className="card-title">{content.title}</h3>}
      {content.body && <p className="card-body">{content.body}</p>}
      {primaryLink && (
        <a
          className="btn"
          href={primaryLink.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content.cta_text || primaryLink.label || "Kunjungi"}
        </a>
      )}
    </div>
  );
}
