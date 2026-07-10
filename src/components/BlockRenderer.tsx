import { SectionWithContents } from "@/lib/types";
import Hero from "@/lib/blocks/Hero";
import Grid from "@/lib/blocks/Grid";
import Slider from "@/lib/blocks/Slider";
import SingleColumn from "@/lib/blocks/SingleColumn";
import Footer from "@/lib/blocks/Footer";
import LeadForm from "@/lib/blocks/LeadForm";

export default function BlockRenderer({ section }: { section: SectionWithContents }) {
  switch (section.block_type) {
    case "hero":
      return <Hero section={section} />;
    case "grid":
      return <Grid section={section} />;
    case "slider":
      return <Slider section={section} />;
    case "single_column":
      return <SingleColumn section={section} />;
    case "footer":
      return <Footer section={section} />;
    case "lead_form":
      return <LeadForm section={section} />;
    default:
      return null;
  }
}
