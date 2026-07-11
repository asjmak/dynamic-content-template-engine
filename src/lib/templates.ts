// Daftar template landing page yang didukung engine.
// Sumber tunggal kebenaran — dipakai oleh form admin & filter daftar.
export const TEMPLATES = [
  "classic-sales",
  "lead-gen",
  "modern-review",
  "long-form",
  "comparison",
  "vigrx-official",
] as const;

export type Template = (typeof TEMPLATES)[number];

// Preset skema warna (palette). Dipasang via atribut data-palette di <main>.
export const PALETTES = ["red", "green", "blue", "violet"] as const;
export type Palette = (typeof PALETTES)[number];
