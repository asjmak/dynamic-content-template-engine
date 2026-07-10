import { SectionWithContents } from "@/lib/types";
import ContentCard from "@/components/ContentCard";

export default function SingleColumn({ section }: { section: SectionWithContents }) {
  return (
    <section className="section">
      <div className="container single-column">
        {section.title && <h2 className="section-title">{section.title}</h2>}
        {section.contents.map((c) => (
          <ContentCard key={c.id} content={c} />
        ))}
      </div>
    </section>
  );
}
