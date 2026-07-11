export type BlockType =
  | "hero"
  | "grid"
  | "slider"
  | "single_column"
  | "footer"
  | "lead_form";

export interface SiteSettings {
  id: number;
  site_name: string;
  default_title: string;
  default_description: string;
  default_og_image: string | null;
  site_url: string | null;
  active_template: string;
  palette: string;
}

export interface Section {
  id: string;
  block_type: BlockType;
  title: string | null;
  ordering: number;
  settings: Record<string, any>;
  template: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Link {
  id: string;
  label: string | null;
  url: string;
  tracking_id: string | null;
  is_active: boolean;
}

export interface Content {
  id: string;
  section_id: string | null;
  category: string | null;
  title: string | null;
  body: string | null;
  image_url: string | null;
  video_url: string | null;
  cta_text: string | null;
  ordering: number;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  is_active: boolean;
  links?: Link[];
}

export interface AbTest {
  id: string;
  name: string;
  template: string;
  section_id: string;
  content_a_id: string;
  content_b_id: string;
  is_active: boolean;
  created_at: string;
}

export interface Page {
  id: string;
  slug: string;
  template: string;
  title: string | null;
  meta_description: string | null;
  status: string;
  palette: string;
  created_at: string;
  updated_at: string;
}

export interface SectionWithContents extends Section {
  contents: Content[];
}
