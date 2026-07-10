import { SectionWithContents } from "@/lib/types";
import ContentCard from "@/components/ContentCard";

export default function Slider({ section }: { section: SectionWithContents }) {
  return (
    <section className="section">
      <div className="container">
        {section.title && <h2 className="section-title">{section.title}</h2>}
        <div className="slider">
          {section.contents.map((c) => (
            <div className="slide" key={c.id}>
              <ContentCard content={c} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
