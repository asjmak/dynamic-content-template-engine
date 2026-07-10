import { SectionWithContents } from "@/lib/types";

export default function Footer({ section }: { section: SectionWithContents }) {
  return (
    <footer className="footer">
      <div className="container">
        <p>{section.settings?.text || section.title || "© Dynamic Content Template Engine"}</p>
      </div>
    </footer>
  );
}
