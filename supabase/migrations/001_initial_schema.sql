-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  fingerprint VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_tier VARCHAR(20) DEFAULT 'free' CHECK (user_tier IN ('free', 'firstTeam', 'seasonPass')),
  is_blocked BOOLEAN DEFAULT FALSE,
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Usage tracking table
CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  feature VARCHAR(50) NOT NULL CHECK (feature IN ('squad_analysis', 'chat', 'comparison', 'other')),
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  usage_count INTEGER DEFAULT 1 CHECK (usage_count >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, feature, usage_date)
);

-- Abuse detection table
CREATE TABLE IF NOT EXISTS abuse_detection (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ip_address VARCHAR(45) NOT NULL,
  fingerprint VARCHAR(100),
  suspicious_activity TEXT NOT NULL,
  detection_reason VARCHAR(255) NOT NULL,
  severity VARCHAR(10) DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_fingerprint ON users(fingerprint);
CREATE INDEX IF NOT EXISTS idx_users_ip ON users(ip_address);
CREATE INDEX IF NOT EXISTS idx_usage_user_feature ON usage_tracking(user_id, feature, usage_date);
CREATE INDEX IF NOT EXISTS idx_usage_date ON usage_tracking(usage_date);
CREATE INDEX IF NOT EXISTS idx_abuse_ip ON abuse_detection(ip_address);
CREATE INDEX IF NOT EXISTS idx_abuse_fingerprint ON abuse_detection(fingerprint);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for usage_tracking
CREATE TRIGGER update_usage_tracking_updated_at
  BEFORE UPDATE ON usage_tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to increment usage count
CREATE OR REPLACE FUNCTION increment_usage(
  p_user_id UUID,
  p_feature VARCHAR(50)
)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  INSERT INTO usage_tracking (user_id, feature, usage_date, usage_count)
  VALUES (p_user_id, p_feature, CURRENT_DATE, 1)
  ON CONFLICT (user_id, feature, usage_date)
  DO UPDATE SET 
    usage_count = usage_tracking.usage_count + 1,
    updated_at = NOW()
  RETURNING usage_count INTO v_count;
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get monthly usage
CREATE OR REPLACE FUNCTION get_monthly_usage(
  p_user_id UUID,
  p_feature VARCHAR(50)
)
RETURNS INTEGER AS $$
DECLARE
  v_total INTEGER;
BEGIN
  SELECT COALESCE(SUM(usage_count), 0)
  INTO v_total
  FROM usage_tracking
  WHERE user_id = p_user_id
    AND feature = p_feature
    AND usage_date >= DATE_TRUNC('month', CURRENT_DATE)
    AND usage_date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month';
  
  RETURN v_total;
END;
$$ LANGUAGE plpgsql;

-- Function to detect abuse patterns
CREATE OR REPLACE FUNCTION detect_abuse(
  p_user_id UUID,
  p_ip_address VARCHAR(45),
  p_fingerprint VARCHAR(100)
)
RETURNS TABLE(is_suspicious BOOLEAN, reason TEXT) AS $$
DECLARE
  v_recent_accounts INTEGER;
  v_recent_usage INTEGER;
  v_ip_accounts INTEGER;
BEGIN
  -- Check for multiple accounts from same IP in last hour
  SELECT COUNT(DISTINCT id)
  INTO v_ip_accounts
  FROM users
  WHERE ip_address = p_ip_address
    AND created_at > NOW() - INTERVAL '1 hour';
  
  IF v_ip_accounts > 3 THEN
    RETURN QUERY SELECT TRUE, 'Multiple accounts from same IP';
    RETURN;
  END IF;
  
  -- Check for rapid usage (more than 10 requests in 1 minute)
  SELECT COUNT(*)
  INTO v_recent_usage
  FROM usage_tracking
  WHERE user_id = p_user_id
    AND created_at > NOW() - INTERVAL '1 minute';
  
  IF v_recent_usage > 10 THEN
    RETURN QUERY SELECT TRUE, 'Rapid usage detected';
    RETURN;
  END IF;
  
  -- Check for fingerprint reuse
  SELECT COUNT(DISTINCT id)
  INTO v_recent_accounts
  FROM users
  WHERE fingerprint = p_fingerprint
    AND id != p_user_id
    AND created_at > NOW() - INTERVAL '24 hours';
  
  IF v_recent_accounts > 2 THEN
    RETURN QUERY SELECT TRUE, 'Fingerprint reuse detected';
    RETURN;
  END IF;
  
  RETURN QUERY SELECT FALSE, 'No suspicious activity';
END;
$$ LANGUAGE plpgsql;

-- Function to batch update usage
CREATE OR REPLACE FUNCTION batch_update_usage(
  p_updates JSONB
)
RETURNS VOID AS $$
DECLARE
  v_update JSONB;
BEGIN
  FOR v_update IN SELECT * FROM jsonb_array_elements(p_updates)
  LOOP
    PERFORM increment_usage(
      (v_update->>'user_id')::UUID,
      v_update->>'feature'
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to clean old data (run monthly)
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS VOID AS $$
BEGIN
  -- Delete usage data older than 6 months
  DELETE FROM usage_tracking
  WHERE usage_date < CURRENT_DATE - INTERVAL '6 months';
  
  -- Delete low-severity abuse logs older than 30 days
  DELETE FROM abuse_detection
  WHERE severity = 'low'
    AND created_at < NOW() - INTERVAL '30 days';
  
  -- Delete medium-severity abuse logs older than 90 days
  DELETE FROM abuse_detection
  WHERE severity = 'medium'
    AND created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE abuse_detection ENABLE ROW LEVEL SECURITY;

-- Users can only read their own data
CREATE POLICY users_select_own ON users
  FOR SELECT
  USING (auth.uid()::TEXT = id::TEXT);

-- Service role can do everything
CREATE POLICY users_service_all ON users
  FOR ALL
  USING (auth.role() = 'service_role');

-- Usage tracking policies
CREATE POLICY usage_select_own ON usage_tracking
  FOR SELECT
  USING (auth.uid()::TEXT = user_id::TEXT);

CREATE POLICY usage_service_all ON usage_tracking
  FOR ALL
  USING (auth.role() = 'service_role');

-- Abuse detection (admin only)
CREATE POLICY abuse_service_all ON abuse_detection
  FOR ALL
  USING (auth.role() = 'service_role');

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
