-- Discord Notifications Table
-- Stores emails for Discord community launch notifications

CREATE TABLE IF NOT EXISTS discord_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  source TEXT DEFAULT 'support_page',
  notification_type TEXT DEFAULT 'discord_launch',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notified_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  CONSTRAINT discord_notifications_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT discord_notifications_source_check CHECK (source IN ('support_page', 'footer', 'pricing_page', 'other')),
  CONSTRAINT discord_notifications_type_check CHECK (notification_type IN ('discord_launch', 'weekly_leagues', 'advanced_analytics')),
  CONSTRAINT discord_notifications_status_check CHECK (status IN ('active', 'notified', 'unsubscribed'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_discord_notifications_email ON discord_notifications(email);
CREATE INDEX IF NOT EXISTS idx_discord_notifications_type ON discord_notifications(notification_type);
CREATE INDEX IF NOT EXISTS idx_discord_notifications_status ON discord_notifications(status);
CREATE INDEX IF NOT EXISTS idx_discord_notifications_created_at ON discord_notifications(created_at);

-- Unique constraint to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_discord_notifications_unique_email_type 
ON discord_notifications(email, notification_type) 
WHERE status = 'active';

-- RLS (Row Level Security) Policy
ALTER TABLE discord_notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own email entries
CREATE POLICY "Users can view their own discord notifications" ON discord_notifications
FOR SELECT USING (email = auth.email() OR auth.role() = 'service_role');

-- Policy: Service role can insert notifications
CREATE POLICY "Service role can insert discord notifications" ON discord_notifications
FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Policy: Service role can update notifications
CREATE POLICY "Service role can update discord notifications" ON discord_notifications
FOR UPDATE USING (auth.role() = 'service_role');

-- Function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_discord_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_discord_notifications_updated_at_trigger
BEFORE UPDATE ON discord_notifications
FOR EACH ROW EXECUTE FUNCTION update_discord_notifications_updated_at();

-- Comments for documentation
COMMENT ON TABLE discord_notifications IS 'Stores email addresses for Discord community and feature launch notifications';
COMMENT ON COLUMN discord_notifications.email IS 'User email address for notifications';
COMMENT ON COLUMN discord_notifications.source IS 'Where the signup originated (support_page, footer, etc.)';
COMMENT ON COLUMN discord_notifications.notification_type IS 'Type of notification (discord_launch, weekly_leagues, etc.)';
COMMENT ON COLUMN discord_notifications.status IS 'Current status of the notification (active, notified, unsubscribed)';
COMMENT ON COLUMN discord_notifications.notified_at IS 'When the notification was sent';
