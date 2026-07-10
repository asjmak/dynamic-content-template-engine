import { SectionWithContents } from "@/lib/types";
import ContentCard from "@/components/ContentCard";

export default function Grid({ section }: { section: SectionWithContents }) {
  const cols = Number(section.settings?.columns) || 3;
  return (
    <section className="section">
      <div className="container">
        {section.title && <h2 className="section-title">{section.title}</h2>}
        <div
          className="grid"
          style={{ ["--cols"]: cols } as any}
        >
          {section.contents.map((c) => (
            <ContentCard key={c.id} content={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
