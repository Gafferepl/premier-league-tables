-- Founding Member Database Schema
-- Tracks founding member status and price locks

-- Create founding members table
CREATE TABLE IF NOT EXISTS founding_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text,
  slot_number integer UNIQUE,
  locked_price decimal(10,2) DEFAULT 49.99,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  UNIQUE(user_id)
);

-- Create founding member metrics table (internal tracking only)
CREATE TABLE IF NOT EXISTS founding_member_metrics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  total_slots integer DEFAULT 150,
  filled_slots integer DEFAULT 0,
  available_slots integer GENERATED ALWAYS AS (total_slots - filled_slots) STORED,
  last_updated timestamp DEFAULT now()
);

-- Insert initial metrics row
INSERT INTO founding_member_metrics (total_slots, filled_slots)
VALUES (150, 0)
ON CONFLICT DO NOTHING;

-- Create function to update metrics when founding member is added
CREATE OR REPLACE FUNCTION update_founding_member_metrics()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE founding_member_metrics
  SET filled_slots = (SELECT COUNT(*) FROM founding_members),
      last_updated = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update metrics
DROP TRIGGER IF EXISTS founding_member_added ON founding_members;
CREATE TRIGGER founding_member_added
AFTER INSERT OR DELETE ON founding_members
FOR EACH ROW
EXECUTE FUNCTION update_founding_member_metrics();

-- Create function to get next available slot number
CREATE OR REPLACE FUNCTION get_next_founding_slot()
RETURNS integer AS $$
DECLARE
  next_slot integer;
BEGIN
  SELECT COALESCE(MAX(slot_number), 0) + 1 INTO next_slot
  FROM founding_members;
  RETURN next_slot;
END;
$$ LANGUAGE plpgsql;

-- Create function to check if founding member slots are available
CREATE OR REPLACE FUNCTION founding_slots_available()
RETURNS boolean AS $$
DECLARE
  available boolean;
BEGIN
  SELECT (filled_slots < total_slots) INTO available
  FROM founding_member_metrics
  LIMIT 1;
  RETURN COALESCE(available, false);
END;
$$ LANGUAGE plpgsql;

-- Add founding member status to users table if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_founding_member boolean DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS founding_member_locked_price decimal(10,2);
ALTER TABLE users ADD COLUMN IF NOT EXISTS founding_member_joined_at timestamp;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_founding_members_user_id ON founding_members(user_id);
CREATE INDEX IF NOT EXISTS idx_founding_members_slot_number ON founding_members(slot_number);
CREATE INDEX IF NOT EXISTS idx_users_founding_member ON users(is_founding_member) WHERE is_founding_member = true;

-- Enable Row Level Security
ALTER TABLE founding_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE founding_member_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can only see their own founding member record
CREATE POLICY "Users can view own founding member record"
  ON founding_members FOR SELECT
  USING (auth.uid() = user_id);

-- Only authenticated users can check if slots are available (no specific numbers)
CREATE POLICY "Anyone can check founding member availability"
  ON founding_member_metrics FOR SELECT
  TO authenticated
  USING (true);

-- Only service role can insert/update founding members
CREATE POLICY "Service role can manage founding members"
  ON founding_members FOR ALL
  TO service_role
  USING (true);

COMMENT ON TABLE founding_members IS 'Tracks founding member status with price lock at £49.99/season forever';
COMMENT ON TABLE founding_member_metrics IS 'Internal metrics - total slots (150) never exposed to public';
COMMENT ON COLUMN founding_members.locked_price IS 'Price locked at £49.99/season forever';
COMMENT ON COLUMN founding_member_metrics.total_slots IS 'Total founding member slots - NEVER expose this number publicly';
