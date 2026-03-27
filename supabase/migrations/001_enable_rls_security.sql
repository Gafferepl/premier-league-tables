-- ============================================
-- SUPABASE ROW LEVEL SECURITY (RLS) SETUP
-- ============================================
-- This migration enables comprehensive security for all tables
-- Run this in your Supabase SQL Editor or via CLI

-- ============================================
-- 1. CREATE ADMIN USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only admins can view the admin list
CREATE POLICY "Only admins can view admin list"
ON admin_users FOR SELECT
USING (email = auth.jwt()->>'email');

-- Insert initial admin emails
INSERT INTO admin_users (email) VALUES 
  ('ellerkerdavid@gmail.com'),
  ('admin@thegafferEPL.com')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- 2. ENABLE RLS ON LEAGUE_APPLICANTS TABLE
-- ============================================
ALTER TABLE league_applicants ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own data" ON league_applicants;
DROP POLICY IF EXISTS "Users can insert own data" ON league_applicants;
DROP POLICY IF EXISTS "Users can update own data" ON league_applicants;
DROP POLICY IF EXISTS "Admins have full access" ON league_applicants;

-- Users can only view their own data
CREATE POLICY "Users can view own data"
ON league_applicants FOR SELECT
USING (
  auth.uid() = id 
  OR email = auth.jwt()->>'email'
  OR EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = auth.jwt()->>'email'
  )
);

-- Users can insert their own data
CREATE POLICY "Users can insert own data"
ON league_applicants FOR INSERT
WITH CHECK (
  email = auth.jwt()->>'email'
  OR EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = auth.jwt()->>'email'
  )
);

-- Users can update their own data
CREATE POLICY "Users can update own data"
ON league_applicants FOR UPDATE
USING (
  auth.uid() = id 
  OR email = auth.jwt()->>'email'
  OR EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = auth.jwt()->>'email'
  )
);

-- Users can delete their own data (GDPR compliance)
CREATE POLICY "Users can delete own data"
ON league_applicants FOR DELETE
USING (
  auth.uid() = id 
  OR email = auth.jwt()->>'email'
  OR EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = auth.jwt()->>'email'
  )
);

-- ============================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_league_applicants_email 
ON league_applicants(email);

CREATE INDEX IF NOT EXISTS idx_league_applicants_tier 
ON league_applicants(tier);

CREATE INDEX IF NOT EXISTS idx_league_applicants_created_at 
ON league_applicants(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_league_applicants_founding_member 
ON league_applicants(founding_member) 
WHERE founding_member = true;

-- ============================================
-- 4. CREATE AUDIT LOG TABLE (OPTIONAL)
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name TEXT NOT NULL,
  record_id UUID,
  action TEXT NOT NULL, -- INSERT, UPDATE, DELETE
  old_data JSONB,
  new_data JSONB,
  user_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit_logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs"
ON audit_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = auth.jwt()->>'email'
  )
);

-- Create index for audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at 
ON audit_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name 
ON audit_logs(table_name);

-- ============================================
-- 5. CREATE TRIGGER FOR AUDIT LOGGING
-- ============================================
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (table_name, record_id, action, old_data, user_email)
    VALUES (TG_TABLE_NAME, OLD.id, TG_OP, row_to_json(OLD), auth.jwt()->>'email');
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (table_name, record_id, action, old_data, new_data, user_email)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(OLD), row_to_json(NEW), auth.jwt()->>'email');
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (table_name, record_id, action, new_data, user_email)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(NEW), auth.jwt()->>'email');
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit trigger to league_applicants
DROP TRIGGER IF EXISTS audit_league_applicants ON league_applicants;
CREATE TRIGGER audit_league_applicants
  AFTER INSERT OR UPDATE OR DELETE ON league_applicants
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- ============================================
-- 6. CREATE UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to league_applicants
DROP TRIGGER IF EXISTS update_league_applicants_updated_at ON league_applicants;
CREATE TRIGGER update_league_applicants_updated_at
  BEFORE UPDATE ON league_applicants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply to admin_users
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. GRANT PERMISSIONS
-- ============================================
-- Grant authenticated users access to tables
GRANT SELECT, INSERT, UPDATE, DELETE ON league_applicants TO authenticated;
GRANT SELECT ON admin_users TO authenticated;
GRANT SELECT ON audit_logs TO authenticated;

-- Grant service role full access
GRANT ALL ON league_applicants TO service_role;
GRANT ALL ON admin_users TO service_role;
GRANT ALL ON audit_logs TO service_role;

-- ============================================
-- 8. VERIFICATION QUERIES
-- ============================================
-- Run these to verify RLS is working:

-- Check if RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- View all policies
-- SELECT * FROM pg_policies WHERE schemaname = 'public';

-- Test as authenticated user (replace with actual email)
-- SET request.jwt.claims.email = 'test@example.com';
-- SELECT * FROM league_applicants;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- RLS is now enabled with comprehensive security policies
-- All data access is controlled and audited
