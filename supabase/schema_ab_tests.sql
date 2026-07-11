
CREATE TABLE IF NOT EXISTS ab_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  template TEXT NOT NULL,
  section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  content_a_id UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
  content_b_id UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'ab_tests' AND policyname = 'ab_tests_admin_all'
  ) THEN
    CREATE POLICY ab_tests_admin_all ON ab_tests
      USING (auth.role() = 'authenticated')
      WITH CHECK (auth.role() = 'authenticated');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'ab_test_id'
  ) THEN
    ALTER TABLE leads ADD COLUMN ab_test_id UUID REFERENCES ab_tests(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'ab_variant'
  ) THEN
    ALTER TABLE leads ADD COLUMN ab_variant TEXT;
  END IF;
END$$;
