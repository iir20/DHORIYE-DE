export interface Report {
  id: string;
  created_at: string;
  title: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  media_urls: string[];
  ip_hash: string;
  status: 'pending' | 'verified' | 'rejected';
  upvotes: number;
  downvotes: number;
}

export interface Vote {
  id: string;
  report_id: string;
  vote_type: 'up' | 'down';
  ip_hash: string;
  created_at: string;
}
