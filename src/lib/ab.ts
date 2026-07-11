// Helper A/B test variant (dipakai oleh homepage & route /[slug]).
export function pickVariant(): "A" | "B" {
  return Math.random() < 0.5 ? "A" : "B";
}

export function parseAbVariant(raw: string): Record<string, "A" | "B"> {
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed;
  } catch {}
  return {};
}
