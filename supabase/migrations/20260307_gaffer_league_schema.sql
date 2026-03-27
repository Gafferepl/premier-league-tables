-- Gaffer's League Database Schema
-- Migration: 20260307_gaffer_league_schema.sql
-- Description: Creates tables and functions for the Gaffer's League lottery system

-- ============================================================================
-- 1. LEAGUE APPLICANTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS league_applicants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  tier VARCHAR(20) NOT NULL CHECK (tier IN ('free', 'firstTeam', 'seasonPass')),
  league_opt_in BOOLEAN DEFAULT false,
  waitlist_opt_in BOOLEAN DEFAULT false,
  fpl_team_name VARCHAR(255),
  country VARCHAR(100),
  date_of_birth DATE,
  mobile VARCHAR(20),
  sms_consent BOOLEAN DEFAULT false,
  fpl_id VARCHAR(20),
  fpl_team_id INTEGER,
  fpl_integration_level VARCHAR(20) CHECK (fpl_integration_level IN ('none', 'basic', 'advanced')),
  fpl_last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one entry per email per tier
  UNIQUE(email, tier)
);

-- Index for faster queries
CREATE INDEX idx_league_applicants_tier ON league_applicants(tier);
CREATE INDEX idx_league_applicants_opt_in ON league_applicants(league_opt_in);
CREATE INDEX idx_league_applicants_email ON league_applicants(email);
CREATE INDEX idx_league_applicants_country ON league_applicants(country);
CREATE INDEX idx_league_applicants_dob ON league_applicants(date_of_birth);
CREATE INDEX idx_league_applicants_mobile ON league_applicants(mobile);
CREATE INDEX idx_league_applicants_fpl_id ON league_applicants(fpl_id);

-- ============================================================================
-- 2. LEAGUE SELECTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS league_selections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id UUID NOT NULL REFERENCES league_applicants(id) ON DELETE CASCADE,
  tier VARCHAR(20) NOT NULL CHECK (tier IN ('free', 'firstTeam', 'seasonPass')),
  league_code VARCHAR(50) NOT NULL,
  league_name VARCHAR(255) NOT NULL,
  fpl_league_id VARCHAR(50),
  selected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  code_sent_at TIMESTAMP WITH TIME ZONE,
  code_expires_at TIMESTAMP WITH TIME ZONE,
  joined_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  selection_round INTEGER DEFAULT 1,
  
  -- Ensure one selection per applicant per tier
  UNIQUE(applicant_id, tier)
);

-- Indexes
CREATE INDEX idx_league_selections_tier ON league_selections(tier);
CREATE INDEX idx_league_selections_active ON league_selections(is_active);
CREATE INDEX idx_league_selections_expires ON league_selections(code_expires_at);
CREATE INDEX idx_league_selections_code ON league_selections(league_code);

-- ============================================================================
-- 3. LEAGUE WAITLIST TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS league_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id UUID NOT NULL REFERENCES league_applicants(id) ON DELETE CASCADE,
  tier VARCHAR(20) NOT NULL CHECK (tier IN ('free', 'firstTeam', 'seasonPass')),
  position INTEGER NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notified_at TIMESTAMP WITH TIME ZONE,
  priority_level INTEGER DEFAULT 0, -- Higher = better priority
  
  -- Ensure one waitlist entry per applicant per tier
  UNIQUE(applicant_id, tier)
);

-- Indexes
CREATE INDEX idx_league_waitlist_tier ON league_waitlist(tier);
CREATE INDEX idx_league_waitlist_position ON league_waitlist(tier, position);
CREATE INDEX idx_league_waitlist_priority ON league_waitlist(priority_level DESC);

-- ============================================================================
-- 4. LEAGUE CONFIGURATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS league_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier VARCHAR(20) NOT NULL UNIQUE CHECK (tier IN ('free', 'firstTeam', 'seasonPass')),
  league_name VARCHAR(255) NOT NULL,
  fpl_league_id VARCHAR(50),
  fpl_league_code VARCHAR(50),
  max_spots INTEGER NOT NULL DEFAULT 50,
  current_spots_filled INTEGER DEFAULT 0,
  selection_date TIMESTAMP WITH TIME ZONE,
  is_selection_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default configurations
INSERT INTO league_configurations (tier, league_name, max_spots) VALUES
  ('free', 'Gaffer''s Community League', 50),
  ('firstTeam', 'Gaffer''s Elite League', 50),
  ('seasonPass', 'Gaffer''s Inner Circle', 50)
ON CONFLICT (tier) DO NOTHING;

-- ============================================================================
-- 5. LEAGUE LOTTERY HISTORY TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS league_lottery_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier VARCHAR(20) NOT NULL CHECK (tier IN ('free', 'firstTeam', 'seasonPass')),
  total_applicants INTEGER NOT NULL,
  selected_count INTEGER NOT NULL,
  selection_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  selection_algorithm VARCHAR(50) DEFAULT 'random',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 6. EMAIL NOTIFICATIONS LOG TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS league_email_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id UUID REFERENCES league_applicants(id) ON DELETE SET NULL,
  email_type VARCHAR(50) NOT NULL, -- 'selection', 'waitlist', 'reminder', etc.
  tier VARCHAR(20) NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'sent', -- 'sent', 'failed', 'bounced'
  error_message TEXT,
  metadata JSONB
);

-- Index
CREATE INDEX idx_league_email_log_type ON league_email_log(email_type);
CREATE INDEX idx_league_email_log_sent ON league_email_log(sent_at);

-- ============================================================================
-- 7. FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_league_applicants_updated_at
  BEFORE UPDATE ON league_applicants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_league_configurations_updated_at
  BEFORE UPDATE ON league_configurations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to get next waitlist position
CREATE OR REPLACE FUNCTION get_next_waitlist_position(p_tier VARCHAR)
RETURNS INTEGER AS $$
DECLARE
  next_position INTEGER;
BEGIN
  SELECT COALESCE(MAX(position), 0) + 1
  INTO next_position
  FROM league_waitlist
  WHERE tier = p_tier;
  
  RETURN next_position;
END;
$$ LANGUAGE plpgsql;

-- Function to get applicant stats by tier
CREATE OR REPLACE FUNCTION get_league_stats(p_tier VARCHAR DEFAULT NULL)
RETURNS TABLE (
  tier VARCHAR,
  total_applicants BIGINT,
  opted_in BIGINT,
  waitlist_opted_in BIGINT,
  selected BIGINT,
  waitlist_count BIGINT,
  spots_available INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    la.tier,
    COUNT(DISTINCT la.id) as total_applicants,
    COUNT(DISTINCT CASE WHEN la.league_opt_in THEN la.id END) as opted_in,
    COUNT(DISTINCT CASE WHEN la.waitlist_opt_in THEN la.id END) as waitlist_opted_in,
    COUNT(DISTINCT ls.id) as selected,
    COUNT(DISTINCT lw.id) as waitlist_count,
    (lc.max_spots - lc.current_spots_filled) as spots_available
  FROM league_applicants la
  LEFT JOIN league_selections ls ON la.id = ls.applicant_id AND la.tier = ls.tier
  LEFT JOIN league_waitlist lw ON la.id = lw.applicant_id AND la.tier = lw.tier
  LEFT JOIN league_configurations lc ON la.tier = lc.tier
  WHERE p_tier IS NULL OR la.tier = p_tier
  GROUP BY la.tier, lc.max_spots, lc.current_spots_filled
  ORDER BY la.tier;
END;
$$ LANGUAGE plpgsql;

-- Function to check if code is expired
CREATE OR REPLACE FUNCTION is_code_expired(p_selection_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT code_expires_at INTO expires_at
  FROM league_selections
  WHERE id = p_selection_id;
  
  RETURN expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 8. ROW LEVEL SECURITY (Optional - enable if needed)
-- ============================================================================

-- Enable RLS on tables
-- ALTER TABLE league_applicants ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE league_selections ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE league_waitlist ENABLE ROW LEVEL SECURITY;

-- Create policies (example)
-- CREATE POLICY "Users can view their own applications"
--   ON league_applicants FOR SELECT
--   USING (auth.email() = email);

-- ============================================================================
-- 9. VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View for active selections with applicant details
CREATE OR REPLACE VIEW active_league_selections AS
SELECT 
  ls.id as selection_id,
  ls.tier,
  ls.league_code,
  ls.league_name,
  ls.selected_at,
  ls.code_sent_at,
  ls.code_expires_at,
  ls.joined_at,
  la.id as applicant_id,
  la.email,
  la.name,
  la.fpl_team_name,
  la.country,
  CASE 
    WHEN ls.code_expires_at < NOW() THEN 'expired'
    WHEN ls.joined_at IS NOT NULL THEN 'joined'
    WHEN ls.code_sent_at IS NOT NULL THEN 'pending'
    ELSE 'selected'
  END as status
FROM league_selections ls
JOIN league_applicants la ON ls.applicant_id = la.id
WHERE ls.is_active = true;

-- View for waitlist with applicant details
CREATE OR REPLACE VIEW waitlist_with_details AS
SELECT 
  lw.id as waitlist_id,
  lw.tier,
  lw.position,
  lw.priority_level,
  lw.added_at,
  lw.notified_at,
  la.id as applicant_id,
  la.email,
  la.name,
  la.fpl_team_name,
  la.country
FROM league_waitlist lw
JOIN league_applicants la ON lw.applicant_id = la.id
ORDER BY lw.tier, lw.priority_level DESC, lw.position ASC;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE league_applicants IS 'Stores all users who have signed up and opted into the league lottery';
COMMENT ON TABLE league_selections IS 'Stores users who have been selected for a league';
COMMENT ON TABLE league_waitlist IS 'Stores users on the waitlist for each tier';
COMMENT ON TABLE league_configurations IS 'Configuration for each league tier';
COMMENT ON TABLE league_lottery_history IS 'Historical record of lottery selections';
COMMENT ON TABLE league_email_log IS 'Log of all emails sent for league notifications';

-- ============================================================================
-- GRANTS (adjust based on your security model)
-- ============================================================================

-- Grant permissions to authenticated users (adjust as needed)
-- GRANT SELECT, INSERT ON league_applicants TO authenticated;
-- GRANT SELECT ON league_selections TO authenticated;
-- GRANT SELECT ON league_waitlist TO authenticated;
-- GRANT SELECT ON league_configurations TO authenticated;
