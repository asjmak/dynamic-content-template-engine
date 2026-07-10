// =====================================================================
//  Seed 5 template landing page (produk: VigRX Plus) - konten BAHASA INGGRIS,
//  unik per template, target pasar USA. Idempoten & reset penuh.
//  Jalankan:  node scripts/seed-templates.mjs
//  Butuh: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY di .env.local
// =====================================================================
import fs from "node:fs";
import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  const txt = fs.readFileSync(file, "utf8");
  for (const line of txt.split("\n")) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let val = m[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
      val = val.slice(1, -1);
    if (!(m[1] in process.env)) process.env[m[1]] = val;
  }
}
loadEnv(".env");
loadEnv(".env.local");

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !SERVICE) {
  console.error("✗ Butuh NEXT_PUBLIC_SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY di .env.local");
  process.exit(1);
}
const admin = createClient(URL, SERVICE, { auth: { persistSession: false } });

// UUID deterministik (v3, RFC 4122) dari sebuah key -> id stabil & unik per template.
function uuid(key) {
  const h = createHash("md5").update(key).digest("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-3${h.slice(13, 16)}-8${h.slice(16, 19)}-${h.slice(20, 32)}`;
}

const LINKS = {
  official: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  promo: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
};

const IMG = {
  product: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=700&q=80",
  man: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80",
  herbs: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=80",
};

const DISCLAIMER =
  "© 2026 VigRX Plus Affiliate Demo. Statements have not been evaluated by the FDA. " +
  "This product is not intended to diagnose, treat, cure, or prevent any disease. " +
  "Individual results vary. Affiliate disclosure: we may earn a commission.";

const STAR = "★★★★★";

// ===================== TEMPLATES (tanpa id; di-generate saat insert) =====================
const TEMPLATES = {
  // ---------------------------------------------------------------- CLASSIC SALES
  "classic-sales": {
    sections: [
      {
        block_type: "hero",
        title: "Hero",
        ordering: 10,
        settings: {
          heading: "VigRX Plus® — Doctor-Endorsed Male Vitality",
          subheading:
            "A clinically studied herbal formula for stronger, longer-lasting performance — backed by a 67-day money-back guarantee.",
          cta_label: "Order VigRX Plus",
          rating: "4.8/5 from 1,200+ verified buyers",
          badges: ["Clinically Studied", "67-Day Guarantee", "Made in USA"],
        },
        contents: [
          {
            title: "VigRX Plus®",
            body: "Try it risk-free with our full 67-day money-back guarantee.",
            image_url: IMG.product,
            cta_text: "Order Now",
            category: "hero",
            links: ["official"],
          },
        ],
      },
      {
        block_type: "grid",
        title: "Why Men Choose VigRX Plus®",
        ordering: 20,
        settings: { columns: 3 },
        contents: [
          { category: "🌿", title: "Natural & Safe", body: "Time-tested botanicals like Korean Red Ginseng and Hawthorn Berry — no prescription required.", links: ["official"] },
          { category: "📈", title: "Clinically Studied", body: "In a controlled study, the majority of participants reported firmer, more lasting erections and greater satisfaction.", links: ["official"] },
          { category: "⏱️", title: "Results in 60 Days", body: "Most users notice meaningful change within the first 60 days of daily use.", links: ["official"] },
        ],
      },
      {
        block_type: "slider",
        title: "What Customers Say",
        ordering: 30,
        settings: {},
        contents: [
          { category: "testimonial", title: STAR, body: '"Within two months I felt like myself again — my wife noticed too." — James R., 47', links: [] },
          { category: "testimonial", title: STAR, body: '"Best decision I made this year. No side effects, just results." — Marcus T., 52', links: [] },
          { category: "testimonial", title: STAR, body: '"The guarantee made it an easy yes. Glad I tried it." — David L., 41', links: [] },
        ],
      },
      {
        block_type: "single_column",
        title: "How It Works",
        ordering: 40,
        settings: {},
        contents: [
          { title: "Triple-Action Support", body: "VigRX Plus® supports healthy blood flow, helps balance key hormones, and boosts daily energy — so performance improves naturally. Recommended use: 2 capsules daily with water.", links: [] },
        ],
      },
      {
        block_type: "single_column",
        title: "Limited-Time Offer",
        ordering: 50,
        settings: {},
        contents: [
          { title: "Save 25% + 67-Day Guarantee", body: "Order today and lock in our best price plus a full 67-day money-back guarantee. Try it completely risk-free.", cta_text: "Claim Discount", category: "offer", links: ["promo"] },
        ],
      },
      {
        block_type: "single_column",
        title: "Frequently Asked Questions",
        ordering: 60,
        settings: {},
        contents: [
          { title: "Is it safe?", body: "VigRX Plus® uses well-known herbal ingredients and is made in a cGMP-certified facility in the USA. Consult your doctor if you have a medical condition or take medication.", links: [] },
          { title: "How fast will I see results?", body: "Many users report changes within 30–60 days of consistent daily use. For best results, use for at least 60 days.", links: [] },
          { title: "What if it doesn't work for me?", body: "You're covered by a 67-day money-back guarantee. Return even empty boxes for a full refund — no questions asked.", links: [] },
        ],
      },
      {
        block_type: "footer",
        title: "Footer",
        ordering: 100,
        settings: { text: DISCLAIMER },
        contents: [],
      },
    ],
  },

  // ---------------------------------------------------------------- LEAD GEN
  "lead-gen": {
    sections: [
      {
        block_type: "hero",
        title: "Hero",
        ordering: 10,
        settings: {
          heading: "Get Your Free VigRX Plus® Guide",
          subheading:
            "Discover how thousands of men naturally boost stamina and confidence — and claim an exclusive discount.",
          cta_label: "Get the Free Guide",
          rating: "Join 1,200+ men who already did",
          badges: ["Free Guide", "Exclusive Discount", "No Spam"],
        },
        contents: [
          {
            title: "Free Starter Guide",
            body: "Enter your details to receive the guide and a one-time discount code.",
            image_url: IMG.man,
            cta_text: "Send My Guide",
            category: "hero",
            links: ["official"],
          },
        ],
      },
      {
        block_type: "single_column",
        title: "Are You Experiencing This?",
        ordering: 20,
        settings: {},
        contents: [
          { title: "Common signs", body: "• Low energy and drive  • Inconsistent performance  • Less confidence in the bedroom  • Avoiding intimacy", category: "problem", links: [] },
        ],
      },
      {
        block_type: "grid",
        title: "What You'll Gain",
        ordering: 30,
        settings: { columns: 3 },
        contents: [
          { category: "⚡", title: "More Energy", body: "Feel driven and present throughout the day.", links: [] },
          { category: "🔥", title: "Stronger Drive", body: "Reignite desire with balanced, natural support.", links: [] },
          { category: "🛡️", title: "Proven Formula", body: "Backed by a clinical study and 20+ years on the market.", links: [] },
        ],
      },
      {
        block_type: "lead_form",
        title: "Claim Your Exclusive Discount",
        ordering: 40,
        settings: {
          title: "Claim Your Exclusive Discount",
          subtitle: "Get the free guide plus a private discount code sent straight to your email.",
          cta_label: "Get My Discount",
          redirect_url: "https://example.com/vigrx-plus",
        },
        contents: [],
      },
      {
        block_type: "slider",
        title: "Real Stories",
        ordering: 50,
        settings: {},
        contents: [
          { category: "testimonial", title: STAR, body: '"The free guide answered questions I was too embarrassed to ask." — Chris M., 39', links: [] },
          { category: "testimonial", title: STAR, body: '"Got my discount the same day. Easy process." — Brian K., 44', links: [] },
        ],
      },
      {
        block_type: "footer",
        title: "Footer",
        ordering: 100,
        settings: { text: DISCLAIMER },
        contents: [],
      },
    ],
  },

  // ---------------------------------------------------------------- MODERN REVIEW
  "modern-review": {
    sections: [
      {
        block_type: "hero",
        title: "Hero",
        ordering: 10,
        settings: {
          heading: "Honest VigRX Plus® Review",
          subheading:
            "An unbiased look at the pros, cons, ingredients, and clinical proof — rated 4.8/5 by verified buyers.",
          cta_label: "See the Best Price",
          rating: "4.8/5 · 1,200+ reviews",
          badges: ["Unbiased Review", "Clinical Proof", "67-Day Guarantee"],
        },
        contents: [
          {
            title: "Rated 4.8/5",
            body: "Based on thousands of verified buyer reviews.",
            image_url: IMG.product,
            cta_text: "See the Best Price",
            category: "hero",
            links: ["official"],
          },
        ],
      },
      {
        block_type: "grid",
        title: "Pros & Cons",
        ordering: 20,
        settings: { columns: 2 },
        contents: [
          { category: "pro", title: "Pros", body: "✓ Natural herbal blend  ✓ Clinically studied  ✓ 67-day guarantee  ✓ Made in USA (cGMP)", links: [] },
          { category: "con", title: "Cons", body: "✗ Needs daily consistency  ✗ Sold only via official site  ✗ Results vary by person", links: [] },
        ],
      },
      {
        block_type: "single_column",
        title: "How It Works & What's Inside",
        ordering: 30,
        settings: {},
        contents: [
          { title: "Key ingredients", body: "Korean Red Ginseng, Hawthorn Berry, Saw Palmetto, Ginkgo Biloba, Damiana, Tribulus Terrestris, Catuaba Bark, Muira Puama, and Bioperine® for absorption. Together they support circulation, hormone balance, and daily energy.", links: [] },
        ],
      },
      {
        block_type: "grid",
        title: "What the Study Found",
        ordering: 40,
        settings: { columns: 3 },
        contents: [
          { category: "stat", title: "62%", body: "reported improved erection quality", links: [] },
          { category: "stat", title: "71%", body: "reported greater sexual satisfaction", links: [] },
          { category: "stat", title: "67 days", body: "money-back guarantee window", links: [] },
        ],
      },
      {
        block_type: "single_column",
        title: "Guarantee & Where to Buy",
        ordering: 50,
        settings: {},
        contents: [
          { title: "Buy from the official source", body: "To get the authentic product and the full 67-day guarantee, order only from the official site. Avoid marketplaces with counterfeits.", cta_text: "Order from Official", category: "offer", links: ["official"] },
        ],
      },
      {
        block_type: "single_column",
        title: "Frequently Asked Questions",
        ordering: 60,
        settings: {},
        contents: [
          { title: "Is it legit?", body: "VigRX Plus® has been on the market for over 20 years with a clinical study behind it. Authenticity is guaranteed only via the official store.", links: [] },
          { title: "Are there side effects?", body: "It uses common herbal ingredients and is generally well tolerated. Discontinue use if you experience discomfort and consult a physician.", links: [] },
        ],
      },
      {
        block_type: "footer",
        title: "Footer",
        ordering: 100,
        settings: { text: DISCLAIMER },
        contents: [],
      },
    ],
  },

  // ---------------------------------------------------------------- LONG FORM
  "long-form": {
    sections: [
      {
        block_type: "hero",
        title: "Hero",
        ordering: 10,
        settings: {
          heading: "My 60-Day VigRX Plus® Journey",
          subheading:
            "From quiet doubt to real confidence — the story thousands of men recognize, and how it can change for you too.",
          cta_label: "Read the Full Story",
          rating: "A story 1,200+ men relate to",
          badges: ["Real Story", "No Embarrassment", "67-Day Guarantee"],
        },
        contents: [
          {
            title: "The turning point",
            body: "What finally pushed me to try a natural approach — and what happened next.",
            image_url: IMG.man,
            cta_text: "Read the Full Story",
            category: "hero",
            links: ["official"],
          },
        ],
      },
      {
        block_type: "single_column",
        title: "Where It Started",
        ordering: 20,
        settings: {},
        contents: [
          { title: "The quiet struggle", body: "Most men never talk about it, but performance anxiety is incredibly common — and it chips away at confidence in every part of life. I'd tried to ignore it until I couldn't anymore.", links: [] },
        ],
      },
      {
        block_type: "grid",
        title: "What Changed",
        ordering: 30,
        settings: { columns: 3 },
        contents: [
          { category: "💪", title: "More Present", body: "I felt energy and drive return week by week.", links: [] },
          { category: "⏳", title: "Lasting", body: "Stamina and performance improved and held.", links: [] },
          { category: "😌", title: "Confident", body: "That confidence showed up everywhere, not just the bedroom.", links: [] },
        ],
      },
      {
        block_type: "slider",
        title: "Readers Who Relate",
        ordering: 40,
        settings: {},
        contents: [
          { category: "testimonial", title: STAR, body: '"This is basically my story. Finally something that worked." — Anthony S., 46', links: [] },
          { category: "testimonial", title: STAR, body: '"I sent it to my brother. We both ordered." — Kevin P., 50', links: [] },
        ],
      },
      {
        block_type: "single_column",
        title: "Your Turn",
        ordering: 50,
        settings: {},
        contents: [
          { title: "Start your own 60 days", body: "The same natural formula, the same 67-day guarantee. Begin your story today.", cta_text: "Claim Discount", category: "offer", links: ["promo"] },
        ],
      },
      {
        block_type: "single_column",
        title: "Frequently Asked Questions",
        ordering: 60,
        settings: {},
        contents: [
          { title: "Do I need a prescription?", body: "No. VigRX Plus® is an herbal supplement available without a prescription from the official site.", links: [] },
          { title: "How do I know it's authentic?", body: "Order only through the official store to guarantee the genuine formula and the 67-day money-back promise.", links: [] },
        ],
      },
      {
        block_type: "footer",
        title: "Footer",
        ordering: 100,
        settings: { text: DISCLAIMER },
        contents: [],
      },
    ],
  },

  // ---------------------------------------------------------------- COMPARISON
  "comparison": {
    sections: [
      {
        block_type: "hero",
        title: "Hero",
        ordering: 10,
        settings: {
          heading: "VigRX Plus® vs The Rest",
          subheading:
            "An objective comparison before you decide — see why VigRX Plus® stands apart from generic alternatives.",
          cta_label: "See the Comparison",
          rating: "The clear winner in our test",
          badges: ["Objective", "Clinically Studied", "67-Day Guarantee"],
        },
        contents: [
          {
            title: "Side-by-side",
            body: "How VigRX Plus® compares to typical alternatives.",
            image_url: IMG.product,
            cta_text: "See the Comparison",
            category: "hero",
            links: ["official"],
          },
        ],
      },
      {
        block_type: "grid",
        title: "Head to Head",
        ordering: 20,
        settings: { columns: 2 },
        contents: [
          { category: "pro", title: "VigRX Plus®", body: "✓ Clinically studied  ✓ 67-day guarantee  ✓ Transparent herbal blend  ✓ cGMP USA facility", links: ["official"] },
          { category: "con", title: "Generic Alternatives", body: "✗ Unproven claims  ✗ Weak or no guarantee  ✗ Unclear ingredient labels  ✗ Unknown sourcing", links: [] },
        ],
      },
      {
        block_type: "single_column",
        title: "The Verdict",
        ordering: 30,
        settings: {},
        contents: [
          { title: "The clear winner", body: "For results you can stand behind, choose the formula with clinical backing and a real 67-day guarantee. Order only from the official source.", cta_text: "Order the Winner", category: "offer", links: ["official"] },
        ],
      },
      {
        block_type: "single_column",
        title: "Frequently Asked Questions",
        ordering: 40,
        settings: {},
        contents: [
          { title: "Why not just buy the cheapest?", body: "Counterfeit and under-dosed products are common. The official store is the only place that honors the clinical formula and the 67-day guarantee.", links: [] },
        ],
      },
      {
        block_type: "footer",
        title: "Footer",
        ordering: 100,
        settings: { text: DISCLAIMER },
        contents: [],
      },
    ],
  },
};

async function main() {
  // pastikan link affiliate VigRX ada
  await admin.from("links").upsert(
    [
      { id: LINKS.official, label: "VigRX Official", url: "https://example.com/vigrx-plus", tracking_id: "VGRX_OFFICIAL" },
      { id: LINKS.promo, label: "VigRX Discount", url: "https://example.com/vigrx-plus", tracking_id: "VGRX_PROMO" },
    ],
    { onConflict: "id" }
  );

  // Reset bersih agar tidak ada sisa konten id lama (id deterministic unik per template).
  await admin.from("content_links").delete().neq("content_id", "00000000-0000-0000-0000-000000000000");
  await admin.from("contents").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await admin.from("sections").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  for (const [tpl, def] of Object.entries(TEMPLATES)) {
    let si = 0;
    for (const sec of def.sections) {
      si += 1;
      const secId = uuid(`${tpl}:sec:${si}`);
      await admin.from("sections").upsert({
        id: secId,
        block_type: sec.block_type,
        title: sec.title,
        ordering: sec.ordering,
        settings: sec.settings || {},
        template: tpl,
        is_active: true,
      });
      let ci = 0;
      for (const c of sec.contents || []) {
        ci += 1;
        const cId = uuid(`${tpl}:sec:${si}:c:${ci}`);
        await admin.from("contents").upsert({
          id: cId,
          section_id: secId,
          title: c.title || null,
          body: c.body || null,
          image_url: c.image_url || null,
          cta_text: c.cta_text || null,
          category: c.category || null,
          ordering: c.ordering || ci,
          is_active: true,
        });
        for (const lk of c.links || []) {
          await admin
            .from("content_links")
            .upsert({ content_id: cId, link_id: LINKS[lk] }, { onConflict: "content_id,link_id" });
        }
      }
      console.log(`✓ ${tpl}: section #${si} (${sec.block_type})`);
    }
  }

  await admin.from("site_settings").update({ active_template: "classic-sales" }).eq("id", 1);
  console.log("✓ Selesai. Template aktif = classic-sales");
  console.log("✓ Semua konten sekarang dalam Bahasa Inggris, unik per template.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
