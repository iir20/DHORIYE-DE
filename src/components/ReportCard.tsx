import { MapPin, CheckCircle, AlertCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Report } from '../types';
import { translations, Language } from '../lib/i18n';
import { formatRelativeTime, cn } from '../lib/utils';
import { useState } from 'react';
import { getSupabase } from '../lib/supabase';

interface ReportCardProps {
  report: Report;
  lang: Language;
}

export default function ReportCard({ report, lang }: ReportCardProps) {
  const supabase = getSupabase();
  const t = translations[lang];
  const [votes, setVotes] = useState({ up: report.upvotes || 0, down: report.downvotes || 0 });
  const [voted, setVoted] = useState<string | null>(null);

  const handleVote = async (type: 'up' | 'down') => {
    if (voted || !supabase) return;
    try {
      const ipRes = await fetch('/api/ip-hash');
      const { hash } = await ipRes.json();

      // Check if already voted in last 24h (this should be handled by DB RLS/Functions for real security)
      const { data: existingVote } = await supabase
        .from('votes')
        .select('*')
        .eq('report_id', report.id)
        .eq('ip_hash', hash)
        .single();

      if (existingVote) {
        alert('You have already voted on this report.');
        return;
      }

      const { error } = await supabase
        .from('votes')
        .insert({ report_id: report.id, vote_type: type, ip_hash: hash });

      if (error) throw error;

      setVotes(prev => ({ ...prev, [type]: prev[type as keyof typeof prev] + 1 }));
      setVoted(type);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden hover:border-brand-red transition-colors">
      {report.media_urls?.[0] && (
        <div className="aspect-video w-full overflow-hidden bg-zinc-100">
          <img 
            src={report.media_urls[0]} 
            className="w-full h-full object-cover" 
            referrerPolicy="no-referrer"
          />
        </div>
      )}
      
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 bg-zinc-100 rounded-full text-xs font-bold uppercase tracking-wider text-zinc-600">
            {t.categories[report.category as keyof typeof t.categories] || report.category}
          </span>
          <span className="text-xs text-zinc-400 font-medium">
            {formatRelativeTime(report.created_at, lang)}
          </span>
        </div>

        <p className="text-zinc-800 leading-relaxed font-medium">
          {report.description}
        </p>

        <div className="flex items-center gap-2 text-zinc-500">
          <MapPin size={14} className="text-brand-red" />
          <span className="text-xs font-medium">
            {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
          </span>
        </div>

        <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => handleVote('up')}
              className={cn(
                "flex items-center gap-1.5 text-sm font-bold transition-colors",
                voted === 'up' ? "text-brand-green" : "text-zinc-400 hover:text-brand-green"
              )}
            >
              <ThumbsUp size={18} />
              {votes.up}
            </button>
            <button 
              onClick={() => handleVote('down')}
              className={cn(
                "flex items-center gap-1.5 text-sm font-bold transition-colors",
                voted === 'down' ? "text-brand-red" : "text-zinc-400 hover:text-brand-red"
              )}
            >
              <ThumbsDown size={18} />
              {votes.down}
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {report.status === 'verified' ? (
              <div className="flex items-center gap-1 text-brand-green">
                <CheckCircle size={16} />
                <span className="text-[10px] font-bold uppercase tracking-tighter">Verified</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-zinc-400">
                <AlertCircle size={16} />
                <span className="text-[10px] font-bold uppercase tracking-tighter">Pending</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
