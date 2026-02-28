-- 1. Create Reports Table
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  media_urls TEXT[] DEFAULT '{}',
  ip_hash TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected'))
);

-- 2. Create Votes Table
CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  vote_type TEXT CHECK (vote_type IN ('up', 'down')),
  ip_hash TEXT NOT NULL,
  UNIQUE(report_id, ip_hash)
);

-- 3. Create Comments Table
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  ip_hash TEXT NOT NULL
);

-- 4. Enable RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 5. Policies for Reports
CREATE POLICY "Allow public read access" ON reports FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON reports FOR INSERT WITH CHECK (true);

-- 6. Policies for Votes
CREATE POLICY "Allow public read access" ON votes FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON votes FOR INSERT WITH CHECK (true);

-- 7. Policies for Comments
CREATE POLICY "Allow public read access" ON comments FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON comments FOR INSERT WITH CHECK (true);

-- 6. Storage Setup
-- Create a bucket named 'evidence' in Supabase dashboard
-- Set it to 'Public'
-- Add policy: "Allow public read"
-- Add policy: "Allow public upload"
