import { SectionWithContents } from "@/lib/types";

export default function Footer({ section }: { section: SectionWithContents }) {
  return (
    <footer className="footer">
      <div className="container">
        <p>{section.settings?.text || section.title || "© Dynamic Template Engine"}</p>
      </div>
    </footer>
  );
}
