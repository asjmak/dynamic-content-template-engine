import { requireAdmin } from "@/lib/guard";
import { createServerClient } from "@/lib/supabase/server";
import { setActiveTemplate } from "@/lib/actions";

const TEMPLATES = [
  {
    id: "classic-sales",
    name: "Classic Sales",
    desc: "Hero → Benefits → Testimonials → How It Works → Offer → FAQ. Classic direct-response structure built for conversion.",
  },
  {
    id: "lead-gen",
    name: "Lead Generation",
    desc: "Focus on capturing prospects: Hero → Value → Problem → Benefits → Lead Form → Testimonials → FAQ. Designed for list building.",
  },
  {
    id: "modern-review",
    name: "Modern Review",
    desc: "Review-style: Hero → Pros & Cons → How It Works → Stats → Guarantee → Testimonials → FAQ. Builds trust before selling.",
  },
  {
    id: "long-form",
    name: "Long-form Story",
    desc: "Narrative sales letter: Hero → Story → What Changed → Testimonials → Offer → FAQ. Builds desire through storytelling.",
  },
  {
    id: "comparison",
    name: "Comparison (VS)",
    desc: "Head-to-head: Hero → VigRX vs Others → Verdict → FAQ. For visitors actively comparing products.",
  },
];

export default async function TemplatesPage() {
  await requireAdmin();
  const supabase = createServerClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("active_template")
    .eq("id", 1)
    .maybeSingle();
  const active = settings?.active_template || "classic-sales";

  return (
    <div>
      <h1>Landing Page Templates</h1>
      <p>Select which template is active. Changes take effect immediately on the front page.</p>
      <div className="dash-cards">
        {TEMPLATES.map((t) => (
          <div className="dash-card" key={t.id}>
            <div className="num" style={{ fontSize: 22 }}>
              {t.name}
            </div>
            <p style={{ fontSize: 14, color: "#64748b", minHeight: 60 }}>
              {t.desc}
            </p>
            {active === t.id ? (
              <strong style={{ color: "#16a34a" }}>✓ Active</strong>
            ) : (
              <form action={setActiveTemplate}>
                <input type="hidden" name="template" value={t.id} />
                <button className="btn" type="submit">
                  Activate
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
      <p style={{ marginTop: 24 }}>
        <a className="btn" href="/">
          View website →
        </a>
      </p>
    </div>
  );
}