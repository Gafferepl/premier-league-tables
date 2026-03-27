-- Enhanced RLS Policies for Production
-- Optimize security and performance for league_applicants table

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations on league_applicants" ON league_applicants;

-- Create optimized RLS policies
CREATE POLICY "Users can view their own data" ON league_applicants
  FOR SELECT USING (
    auth.email() = email OR 
    -- Allow service role to read all data for admin functions
    auth.role() = 'service_role'
  );

CREATE POLICY "Users can insert their own data" ON league_applicants
  FOR INSERT WITH CHECK (
    auth.email() = email
  );

CREATE POLICY "Users can update their own data" ON league_applicants
  FOR UPDATE USING (
    auth.email() = email
  );

CREATE POLICY "Service role can manage all data" ON league_applicants
  FOR ALL USING (
    auth.role() = 'service_role'
  );

-- Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_league_applicants_email ON league_applicants(email);
CREATE INDEX IF NOT EXISTS idx_league_applicants_tier ON league_applicants(tier);
CREATE INDEX IF NOT EXISTS idx_league_applicants_founding_member ON league_applicants(founding_member);
CREATE INDEX IF NOT EXISTS idx_league_applicants_league_opt_in ON league_applicants(league_opt_in);
CREATE INDEX IF NOT EXISTS idx_league_applicants_created_at ON league_applicants(created_at);

-- Add constraints for data integrity
ALTER TABLE league_applicants 
  ADD CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  ADD CONSTRAINT valid_tier CHECK (tier IN ('free', 'firstTeam', 'seasonPass')),
  ADD CONSTRAINT valid_fpl_integration CHECK (fpl_integration_level IN ('none', 'basic', 'advanced'));

-- Create function to track founding member status
CREATE OR REPLACE FUNCTION assign_founding_member_number()
RETURNS TRIGGER AS $$
BEGIN
  -- Only assign founding member number for season pass signups
  IF NEW.tier = 'seasonPass' AND NEW.founding_member = true THEN
    -- Get the next available founding member number
    SELECT COALESCE(MAX(founding_member_number), 0) + 1
    INTO NEW.founding_member_number
    FROM league_applicants
    WHERE founding_member = true;
    
    -- Ensure we don't exceed 150 founding members
    IF NEW.founding_member_number > 150 THEN
      NEW.founding_member = false;
      NEW.founding_member_number = null;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically assign founding member numbers
DROP TRIGGER IF EXISTS assign_founding_member_trigger ON league_applicants;
CREATE TRIGGER assign_founding_member_trigger
  BEFORE INSERT ON league_applicants
  FOR EACH ROW
  EXECUTE FUNCTION assign_founding_member_number();

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  user_email TEXT,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for audit logging
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (table_name, operation, user_email, old_values, new_values)
  VALUES (
    TG_TABLE_NAME,
    TG_OP,
    COALESCE(auth.email(), 'system'),
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN row_to_json(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Add audit triggers
CREATE TRIGGER league_applicants_audit
  AFTER INSERT OR UPDATE OR DELETE ON league_applicants
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger();

-- Enable RLS
ALTER TABLE league_applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Audit log policies (service role only)
CREATE POLICY "Service role full access to audit log" ON audit_log
  FOR ALL USING (auth.role() = 'service_role');
