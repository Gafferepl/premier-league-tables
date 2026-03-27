-- Cache entries table
CREATE TABLE IF NOT EXISTS cache_entries (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  api_source TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  access_count INTEGER DEFAULT 1
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_cache_entries_expires_at ON cache_entries(expires_at);
CREATE INDEX IF NOT EXISTS idx_cache_entries_api_source ON cache_entries(api_source);

-- Cache metrics table
CREATE TABLE IF NOT EXISTS cache_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cache_key TEXT NOT NULL,
  hit BOOLEAN NOT NULL,
  layer TEXT NOT NULL,
  response_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance tracking
CREATE INDEX IF NOT EXISTS idx_cache_metrics_created_at ON cache_metrics(created_at);
CREATE INDEX IF NOT EXISTS idx_cache_metrics_cache_key ON cache_metrics(cache_key);

-- API usage log table
CREATE TABLE IF NOT EXISTS api_usage_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  api_name TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  status TEXT NOT NULL,
  response_time INTEGER,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for API monitoring
CREATE INDEX IF NOT EXISTS idx_api_usage_log_created_at ON api_usage_log(created_at);
CREATE INDEX IF NOT EXISTS idx_api_usage_log_api_name ON api_usage_log(api_name);

-- Historical data archive table
CREATE TABLE IF NOT EXISTS historical_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  season TEXT NOT NULL,
  data_type TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for historical queries
CREATE INDEX IF NOT EXISTS idx_historical_data_season ON historical_data(season);
CREATE INDEX IF NOT EXISTS idx_historical_data_type ON historical_data(data_type);

-- Function to increment access count
CREATE OR REPLACE FUNCTION increment_access_count(cache_key TEXT)
RETURNS void AS $$
BEGIN
  UPDATE cache_entries
  SET 
    access_count = access_count + 1,
    last_accessed = NOW()
  WHERE key = cache_key;
END;
$$ LANGUAGE plpgsql;

-- Function to clean expired cache entries
CREATE OR REPLACE FUNCTION clean_expired_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM cache_entries
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE cache_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE cache_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE historical_data ENABLE ROW LEVEL SECURITY;

-- Policies for cache_entries (allow all operations for now)
CREATE POLICY "Allow all operations on cache_entries" ON cache_entries
  FOR ALL USING (true);

-- Policies for cache_metrics
CREATE POLICY "Allow all operations on cache_metrics" ON cache_metrics
  FOR ALL USING (true);

-- Policies for api_usage_log
CREATE POLICY "Allow all operations on api_usage_log" ON api_usage_log
  FOR ALL USING (true);

-- Policies for historical_data
CREATE POLICY "Allow all operations on historical_data" ON historical_data
  FOR ALL USING (true);
