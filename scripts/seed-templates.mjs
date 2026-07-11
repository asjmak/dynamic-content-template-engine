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
  scroll: "dddddddd-dddd-dddd-dddd-dddddddddddd",
};

const IMG = {
  product: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=700&q=80",
  man: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80",
  herbs: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=80",
  hero: "https://images.unsplash.com/photo-1606871796789-3b5a8d3c7c1f?w=600&q=80",
};

const DISCLAIMER =
  "© 2026 VigRX Plus Affiliate Demo. Statements have not been evaluated by the FDA. " +
  "This product is not intended to diagnose, treat, cure, or prevent any disease. " +
  "Individual results vary. Affiliate disclosure: we may earn a commission from qualified purchases.";

const STAR = "★★★★★";

// ===================== TEMPLATES =====================
const TEMPLATES = {
  // ---------------------------------------------------------------- CLASSIC SALES
  "classic-sales": {
    sections: [
      {
        block_type: "hero",
        title: "Hero",
        ordering: 10,
        settings: {
          heading: "Doctor-Endorsed VigRX Plus® for Stronger, Longer Performance",
          subheading:
            "A clinically studied herbal formula that supports healthy blood flow and hormone balance — backed by 67-day money-back guarantee.",
          cta_label: "Get Your Risk-Free 67-Day Supply",
          rating: "4.8/5 from 1,200+ verified buyers",
          badges: ["Clinically Studied", "67-Day Guarantee", "Made in USA"],
        },
        contents: [
          {
            title: "VigRX Plus®",
            body: "Try it risk-free with our full 67-day money-back guarantee.",
            image_url: IMG.product,
            cta_text: "Get My Risk-Free Supply",
            category: "hero",
            links: ["official"],
          },
        ],
      },
      {
        block_type: "grid",
        title: "Why VigRX Plus® Stands Out",
        ordering: 20,
        settings: { columns: 3 },
        contents: [
          { category: "🌿", title: "Natural & Safe", body: "Time-tested botanicals like Korean Red Ginseng and Hawthorn Berry — no prescription required.", cta_text: "Get VigRX Plus®", links: ["official"] },
          { category: "📈", title: "Clinically Studied", body: "In a double-blind study, 62% reported improved erection quality and 71% greater sexual satisfaction.", cta_text: "Get VigRX Plus®", links: ["official"] },
          { category: "⏱️", title: "Results in 60 Days", body: "Most users notice meaningful change within the first 60 days of daily use.", cta_text: "Get VigRX Plus®", links: ["official"] },
        ],
      },
      {
        block_type: "slider",
        title: "What Customers Are Saying",
        ordering: 30,
        settings: {},
        contents: [
          { category: "testimonial", title: STAR, body: '"Within two months I felt like myself again — and my wife noticed too. The 67-day guarantee made saying yes easy." — James R., 47', links: [] },
          { category: "testimonial", title: STAR, body: '"Best decision I made this year. Steadier performance, no side effects, just real results." — Marcus T., 52', links: [] },
          { category: "testimonial", title: STAR, body: '"I was on the fence, but the money-back guarantee made it a no-brainer. Glad I tried it." — David L., 41', links: [] },
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
          { title: "⏳ Limited-Time: Save 25% + 67-Day Guarantee", body: "For a limited time, order today to lock in our best price — 25% off plus a full 67-day money-back guarantee. Try it completely risk-free; if it's not for you, return even empty boxes for a full refund.", cta_text: "Lock In 25% Off + Free Shipping", category: "offer", links: ["promo"] },
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
          heading: "Get the Free VigRX Plus® Guide + Your Private 25% Discount",
          subheading:
            "Join 1,200+ men who used this natural stamina protocol — and unlock a discount code you won't find anywhere else.",
          cta_label: "Get My Free Guide",
          rating: "Join 1,200+ men who already did",
          badges: ["100% Free", "Private Discount Code", "No Spam — Ever"],
        },
        contents: [
          {
            title: "Your free vitality kit",
            body: "We'll email your complete guide plus a private discount code the moment you join.",
            image_url: IMG.man,
            cta_text: "Get My Free Guide",
            category: "hero",
            links: ["scroll"],
          },
        ],
      },
      {
        block_type: "grid",
        title: "What's Inside Your Free Guide",
        ordering: 15,
        settings: { columns: 2 },
        contents: [
          { category: "🌿", title: "The 7-Day Stamina Protocol", body: "The exact daily routine 1,200+ men followed to feel a real difference in about two months — no prescriptions, no guesswork.", links: [] },
          { category: "🔬", title: "The 3 Ingredients That Do the Work", body: "What the clinical study actually found about the herbal blend — and why it beats random gas-station supplements.", links: [] },
          { category: "🎯", title: "Your Private 25% Discount Code", body: "A one-time code sent straight to your inbox that beats anything on the open market.", links: [] },
          { category: "🛡️", title: "How to Avoid Counterfeits", body: "The #1 mistake buyers make — and the only place that ships the authentic formula with the 67-day guarantee.", links: [] },
        ],
      },
      {
        block_type: "single_column",
        title: "Are You Experiencing This?",
        ordering: 20,
        settings: {},
        contents: [
          { title: "You're not alone", body: "• You avoid intimacy because you're not 100% confident  • Performance is inconsistent, no matter the moment  • You feel your drive slipping as the weeks go by  • You've tried 'something' but saw nothing change", category: "problem", links: [] },
        ],
      },
      {
        block_type: "grid",
        title: "What You'll Gain",
        ordering: 30,
        settings: { columns: 3 },
        contents: [
          { category: "⚡", title: "More Energy", body: "Show up present and driven from the moment you wake up.", links: [] },
          { category: "🔥", title: "Stronger Drive", body: "Reignite desire with balanced, natural support — no prescriptions required.", links: [] },
          { category: "🛡️", title: "Proven & Private", body: "Backed by a clinical study and 20+ years on the market. Your info stays yours.", links: [] },
        ],
      },
      {
        block_type: "lead_form",
        title: "Claim Your Free Guide + 25% Discount",
        ordering: 40,
        settings: {
          anchor: "lead-form",
          urgency: "Discount slots are limited — claim yours before they reset",
          title: "Claim Your Free Guide + 25% Discount",
          subtitle:
            "Enter your email and we'll send your complete guide plus your private 25% discount code instantly. Your email stays private — unsubscribe anytime.",
          cta_label: "Send My Free Guide + Discount",
          redirect_url: "https://example.com/vigrx-plus",
          trust: ["🔒 Privacy Protected", "✅ 100% Free", "⚡ Instant Delivery"],
        },
        contents: [],
      },
      {
        block_type: "slider",
        title: "Real Stories",
        ordering: 50,
        settings: {},
        contents: [
          { category: "testimonial", title: STAR, body: '"I downloaded the guide on a Tuesday and had my discount code in my inbox before lunch. Two months in, I finally feel like myself again." — Chris M., 39', links: [] },
          { category: "testimonial", title: STAR, body: '"I was skeptical, but the protocol was simple and the results were real. The private discount saved me a ton." — Brian K., 44', links: [] },
          { category: "testimonial", title: STAR, body: '"The guide explained the ingredients better than any doctor I\'d seen. Wish I\'d found it sooner." — Marcus T., 51', links: [] },
        ],
      },
      {
        block_type: "single_column",
        title: "Frequently Asked Questions",
        ordering: 60,
        settings: {},
        contents: [
          { title: "Is the guide really free?", body: "Yes. The guide and your private discount code are 100% free. We only earn if you later choose to order through our link — at no extra cost to you.", links: [] },
          { title: "Will I get spammed?", body: "Never. Your email is used only to send your guide and discount code. One click to unsubscribe, and we never sell or share your data.", links: [] },
          { title: "How fast will I get it?", body: "Instantly. The guide and discount code are emailed the moment you join — check your inbox (and spam folder) right after you hit send.", links: [] },
          { title: "Is VigRX Plus® legit?", body: "It's been on the market 20+ years with a clinical study behind it. Authenticity and the 67-day guarantee are honored only through the official source we link to.", links: [] },
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
          cta_label: "See Today's Best Price",
          rating: "4.8/5 · 1,200+ reviews",
          badges: ["Unbiased Review", "Clinical Proof", "67-Day Guarantee"],
        },
        contents: [
          {
            title: "Rated 4.8/5",
            body: "Based on thousands of verified buyer reviews.",
            image_url: IMG.product,
            cta_text: "See Today's Best Price",
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
        block_type: "slider",
        title: "What Buyers Are Saying",
        ordering: 45,
        settings: {},
        contents: [
          { category: "testimonial", title: STAR, body: '"I read a dozen reviews before buying. The clinical backing and 67-day guarantee sold me — and it delivered." — Robert H., 53', links: [] },
          { category: "testimonial", title: STAR, body: '"Finally a supplement that does what the label says. Steadier, stronger, no weird side effects." — Daniel K., 48', links: [] },
          { category: "testimonial", title: STAR, body: '"Wish I\'d started sooner. The guarantee meant there was nothing to lose." — Eric M., 44', links: [] },
        ],
      },
      {
        block_type: "single_column",
        title: "Guarantee & Where to Buy",
        ordering: 50,
        settings: {},
        contents: [
          { title: "Buy from the official source", body: "⏳ For a limited time, order from the official site to lock in the best price and the full 67-day guarantee — and avoid marketplaces selling counterfeits.", cta_text: "Order from Official", category: "offer", links: ["official"] },
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
          { title: "How fast will I see results?", body: "Most users notice meaningful change within 30–60 days of consistent daily use. For best results, commit to at least 60 days.", links: [] },
          { title: "Is it FDA approved?", body: "Like all dietary supplements, it is not evaluated by the FDA for treating disease. It is manufactured in a cGMP-certified facility in the USA for quality and consistency.", links: [] },
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
          cta_label: "Read The Full 60-Day Story",
          rating: "A story 1,200+ men relate to",
          badges: ["Real Story", "No Embarrassment", "67-Day Guarantee"],
        },
        contents: [
          {
            title: "The turning point",
            body: "What finally pushed me to try a natural approach — and what happened next.",
            image_url: IMG.man,
            cta_text: "Read The Full 60-Day Story",
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
          { category: "testimonial", title: STAR, body: '"This is basically my story. Two months in, finally something that worked — and my partner noticed." — Anthony S., 46', links: [] },
          { category: "testimonial", title: STAR, body: '"I sent it to my brother. We both ordered, and we both stuck with it." — Kevin P., 50', links: [] },
          { category: "testimonial", title: STAR, body: '"The 60-day timeline in the story is real. I gave it the full two months and it paid off." — Tomas B., 43', links: [] },
        ],
      },
      {
        block_type: "single_column",
        title: "Your Turn",
        ordering: 50,
        settings: {},
        contents: [
          { title: "Start your own 60 days", body: "⏳ For a limited time, begin your 60-day trial with the same natural formula and full 67-day guarantee — at our best price. Your story can start today.", cta_text: "Start My 60-Day Trial", category: "offer", links: ["promo"] },
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
          { title: "How fast will I see results?", body: "Most users notice meaningful change within 30–60 days of consistent daily use. The 60-day trial in the story reflects real-world timing.", links: [] },
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
          cta_label: "See The Full Comparison",
          rating: "The clear winner in our test",
          badges: ["Objective", "Clinically Studied", "67-Day Guarantee"],
        },
        contents: [
          {
            title: "Side-by-side",
            body: "How VigRX Plus® compares to typical alternatives.",
            image_url: IMG.product,
            cta_text: "See The Full Comparison",
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
          { title: "The clear winner", body: "⏳ For a limited time, choose the formula with clinical backing and a real 67-day guarantee — and order only from the official source to get the best price and avoid counterfeits.", cta_text: "Order the Winner", category: "offer", links: ["official"] },
        ],
      },
      {
        block_type: "single_column",
        title: "Frequently Asked Questions",
        ordering: 40,
        settings: {},
        contents: [
          { title: "Why not just buy the cheapest?", body: "Counterfeit and under-dosed products are common. The official store is the only place that honors the clinical formula and the 67-day guarantee.", links: [] },
          { title: "Is VigRX Plus® safe?", body: "It uses well-known herbal ingredients and is made in a cGMP-certified facility in the USA. Consult your doctor if you have a medical condition or take medication.", links: [] },
          { title: "How fast will I see results?", body: "Most users report changes within 30–60 days of consistent daily use. For best results, use for at least 60 days.", links: [] },
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

  // ---------------------------------------------------------------- VIGRX OFFICIAL (vigrxplus.com style)
  // Desain & konten selaras dengan website resmi vigrxplus.com (merah/emas, Montserrat/Open Sans).
  // CATATAN: testimoni di bawah masih CONTOH/placeholder (file referensi sendiri menandainya
  // "EXAMPLE") — ganti dengan testimoni VERIFIKASI ASLI sebelum iklan berbayar (aturan FTC).
  "vigrx-official": {
    sections: [
      {
        block_type: "hero",
        title: "Hero",
        ordering: 10,
        settings: {
          heading: "Have Great Sex Without A Doctor's Visit",
          subheading:
            "The world's only clinically-tested and proven, all-natural male performance supplement. Firmer, longer-lasting erections and renewed desire — no prescription required.",
          cta_label: "Order Now",
          rating: "Rated 4.8/5 by 1000s of men",
          badges: ["Clinically Tested & Proven", "Doctor Endorsed", "GMP Certified"],
          trust_items: [
            { icon: "★", text: "Rated 4.8/5 by 1000s of men" },
            { icon: "✓", text: "Doctor Endorsed Formula" },
            { icon: "✓", text: "GMP Certified Facility" },
          ],
        },
        contents: [
          {
            title: "VigRX Plus®",
            body: "Order today with our discreet shipping and full 67-day money-back guarantee.",
            image_url: IMG.product,
            cta_text: "Order Now",
            category: "hero",
            links: ["official"],
          },
        ],
      },
      {
        block_type: "grid",
        title: "The Proof — Backed By Science",
        ordering: 20,
        settings: { columns: 4 },
        contents: [
          { category: "stat", title: "+58.97%", body: "Firmer, stronger erections — improvement in erection firmness", links: [] },
          { category: "stat", title: "+47%", body: "More sexual desire — boost in libido & drive", links: [] },
          { category: "stat", title: "+82.31%", body: "Higher satisfaction — overall sexual satisfaction", links: [] },
          { category: "stat", title: "+62.82%", body: "Longer-lasting erections — ability to maintain erections", links: [] },
        ],
      },
      {
        block_type: "single_column",
        title: "",
        ordering: 25,
        settings: {},
        contents: [
          { title: "", body: "† Results based on a clinical study of the VigRX Plus formula. Individual results may vary.", links: [] },
        ],
      },
      {
        block_type: "grid",
        title: "Real Results, Backed By Science",
        ordering: 30,
        settings: { columns: 3 },
        contents: [
          { category: "🌿", title: "Harder, Fuller Erections", body: "Supports healthy blood flow so erections feel firmer, fuller, and more reliable when it matters most.", cta_text: "Order Now", links: ["official"] },
          { category: "🔥", title: "Renewed Desire", body: "Reignites libido and sexual appetite with traditional botanicals used for male vitality for centuries.", cta_text: "Order Now", links: ["official"] },
          { category: "⏱️", title: "Stay The Course", body: "Helps you maintain erections longer, giving you and your partner more satisfying, confident experiences.", cta_text: "Order Now", links: ["official"] },
          { category: "🌱", title: "All-Natural Formula", body: "No prescription, no synthetic chemicals — just clinically-studied herbs manufactured in a GMP facility.", cta_text: "Order Now", links: ["official"] },
          { category: "🔬", title: "Clinically Proven", body: "The only male supplement with a published, double-blind clinical study demonstrating measurable results.", cta_text: "Order Now", links: ["official"] },
          { category: "🌍", title: "Trusted Worldwide", body: "Over 1.2 million boxes sold to men in 100+ countries who choose VigRX Plus as their daily performance partner.", cta_text: "Order Now", links: ["official"] },
        ],
      },
      {
        block_type: "single_column",
        title: "Endorsed By Medical Experts",
        ordering: 40,
        settings: {},
        contents: [
          { title: "Why Professionals Recommend It", body: "VigRX Plus is formulated with standardized botanical extracts and produced in an FDA-registered, GMP-certified facility. It is intended as a daily dietary supplement for male sexual wellness — the quality standard clinicians look for in a daily male-performance supplement.", links: [] },
        ],
      },
      {
        block_type: "grid",
        title: "The Premium Formula — Powerful Botanicals, Precisely Dosed",
        ordering: 50,
        settings: { columns: 4 },
        contents: [
          { category: "🌿", title: "Korean Red Ginseng", body: "Traditional vigor & stamina root.", links: [] },
          { category: "🌿", title: "Hawthorn Berry", body: "Supports healthy circulation.", links: [] },
          { category: "🌿", title: "Ginkgo Biloba", body: "Promotes blood flow & arousal.", links: [] },
          { category: "🌿", title: "Saw Palmetto", body: "Male hormonal balance support.", links: [] },
          { category: "🌿", title: "Damiana", body: "Libido & performance botanical.", links: [] },
          { category: "🌿", title: "Bioperine®", body: "Boosts nutrient absorption.", links: [] },
          { category: "🌿", title: "Epimedium", body: "Supports sexual function.", links: [] },
          { category: "🌿", title: "Catuaba Bark", body: "Natural desire enhancer.", links: [] },
        ],
      },
      {
        block_type: "slider",
        title: "Real Men, Real Results",
        ordering: 55,
        settings: {},
        contents: [
          { category: "testimonial", title: STAR, body: `"Within the first month I noticed a real difference in firmness and stamina. My confidence is back and my wife noticed too." — James R., 47`, links: [] },
          { category: "testimonial", title: STAR, body: `"I was skeptical about a 'natural' product, but the clinical study sold me. Honestly the best investment I've made in myself." — Marcus T., 52`, links: [] },
          { category: "testimonial", title: STAR, body: `"No side effects, just steady improvement. Shipping was discreet and the guarantee made it an easy yes." — David L., 41`, links: [] },
        ],
      },
      {
        block_type: "single_column",
        title: "67-Day Money-Back Guarantee",
        ordering: 60,
        settings: {},
        contents: [
          { title: "Try It Risk-Free For 67 Days", body: "Try VigRX Plus risk-free for up to 67 days. If you're not completely satisfied with your results, return the empty boxes for a full refund — no questions asked. Your satisfaction is 100% guaranteed.", cta_text: "Claim Your Guarantee", category: "offer", links: ["official"] },
        ],
      },
      {
        block_type: "lead_form",
        title: "Get Your Free VigRX Plus® Guide + 25% Discount",
        ordering: 65,
        settings: {
          anchor: "lead-form",
          urgency: "Discount slots are limited — claim yours before they reset",
          title: "Get Your Free VigRX Plus® Guide + 25% Discount",
          subtitle:
            "Enter your email and we'll send your complete guide plus your private 25% discount code instantly. Your email stays private — unsubscribe anytime.",
          cta_label: "Send My Free Guide + Discount",
          redirect_url: "https://example.com/vigrx-plus",
          trust: ["🔒 Privacy Protected", "✅ 100% Free", "⚡ Instant Delivery"],
        },
        contents: [],
      },
      {
        block_type: "single_column",
        title: "Frequently Asked Questions",
        ordering: 70,
        settings: {},
        contents: [
          { title: "How does VigRX Plus work?", body: "VigRX Plus combines clinically-studied botanicals that support healthy blood flow, testosterone balance, and sexual response. Taken daily, the formula builds up in your system to improve erection quality, desire, and satisfaction.", links: [] },
          { title: "How soon will I see results?", body: "Most men report noticeable improvements within the first 2–4 weeks, with the best results typically seen after 60–90 days of consistent daily use. Individual results vary.", links: [] },
          { title: "Is it safe? Are there side effects?", body: "VigRX Plus uses all-natural ingredients and is manufactured in an FDA-registered, GMP-certified facility. It is generally well tolerated. As with any supplement, consult your physician if you have a medical condition or take medication.", links: [] },
          { title: "Do I need a prescription?", body: "No. VigRX Plus is a dietary supplement available without a prescription and ships discreetly to your door.", links: [] },
          { title: "What if it doesn't work for me?", body: "You're covered by our 67-day money-back guarantee. Return the product — even empty boxes — for a full refund, no questions asked.", links: [] },
        ],
      },
      {
        block_type: "single_column",
        title: "Ready For Better Sex — Without The Doctor?",
        ordering: 80,
        settings: {},
        contents: [
          { title: "Join Over A Million Men", body: "Join over a million men who chose the clinically proven, all-natural path to performance. Order today and lock in our discreet-shipping, money-back guarantee.", cta_text: "Order VigRX Plus Now", category: "offer", links: ["official"] },
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
  const KEEP = [LINKS.official, LINKS.promo, LINKS.scroll];
  // bersihkan link orphan (tidak dipakai) agar tidak bentrok constraint UNIQUE tracking_id
  const { data: orphans } = await admin
    .from("links")
    .select("id")
    .not("id", "in", `(${KEEP.map((id) => `"${id}"`).join(",")})`);
  if (orphans?.length) {
    const ids = orphans.map((o) => o.id);
    await admin.from("content_links").delete().in("link_id", ids);
    await admin.from("links").delete().in("id", ids);
    console.log(`✓ hapus ${ids.length} orphan link`);
  }

  await admin.from("links").upsert(
    [
      { id: LINKS.official, label: "VigRX Official", url: "https://example.com/vigrx-plus", tracking_id: "VGRX_OFFICIAL" },
      { id: LINKS.promo, label: "VigRX Discount", url: "https://example.com/vigrx-plus", tracking_id: "VGRX_PROMO" },
      { id: LINKS.scroll, label: "Scroll to form", url: "#lead-form", tracking_id: "SCROLL_FORM" },
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