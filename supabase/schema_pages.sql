
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  template TEXT NOT NULL,
  title TEXT,
  meta_description TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pages' AND policyname = 'pages_public_select') THEN
    CREATE POLICY pages_public_select ON pages
      FOR SELECT
      USING (status = 'active');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pages' AND policyname = 'pages_admin_all') THEN
    CREATE POLICY pages_admin_all ON pages
      FOR ALL
      USING (auth.role() = 'authenticated')
      WITH CHECK (auth.role() = 'authenticated');
  END IF;
END$$;

INSERT INTO pages (slug, template, title, meta_description, status)
VALUES ('vigrx-plus', 'vigrx-official', 'VigRX Plus® — Official', 'Clinically studied herbal male vitality supplement.', 'active')
ON CONFLICT (slug) DO NOTHING;
