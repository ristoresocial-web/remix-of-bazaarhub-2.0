-- Search logs for trending data
CREATE TABLE IF NOT EXISTS public.search_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  search_query VARCHAR(300) NOT NULL,
  city VARCHAR(100) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_search_logs_city_date ON public.search_logs(city, created_at);

ALTER TABLE public.search_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert search logs"
  ON public.search_logs FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read search logs"
  ON public.search_logs FOR SELECT
  TO anon, authenticated
  USING (true);

-- AI scores cache table
CREATE TABLE IF NOT EXISTS public.ai_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_name VARCHAR(300) NOT NULL,
  city VARCHAR(100) NOT NULL,
  score INTEGER NOT NULL,
  reasons JSONB NOT NULL DEFAULT '[]',
  verdict VARCHAR(200),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days'
);

CREATE INDEX idx_ai_scores_lookup ON public.ai_scores(product_name, city, expires_at);

ALTER TABLE public.ai_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read ai scores"
  ON public.ai_scores FOR SELECT
  TO anon, authenticated
  USING (true);