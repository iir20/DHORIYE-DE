import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, ThumbsUp, ThumbsDown, Send, MessageSquare, Calendar, Shield } from 'lucide-react';
import { Report } from '../types';
import { Language, translations } from '../lib/i18n';
import { formatRelativeTime, cn } from '../lib/utils';
import { getSupabase } from '../lib/supabase';

interface ReportDetailProps {
  report: Report;
  lang: Language;
  onBack: () => void;
}

interface Comment {
  id: string;
  created_at: string;
  content: string;
  ip_hash: string;
}

export default function ReportDetail({ report, lang, onBack }: ReportDetailProps) {
  const t = translations[lang];
  const supabase = getSupabase();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('report_id', report.id)
      .order('created_at', { ascending: false });
    
    if (!error && data) setComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, [report.id]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !supabase) return;
    setLoading(true);

    try {
      const ipRes = await fetch('/api/ip-hash');
      const { hash } = await ipRes.json();

      const { error } = await supabase
        .from('comments')
        .insert({
          report_id: report.id,
          content: newComment,
          ip_hash: hash
        });

      if (error) throw error;
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-zinc-200 overflow-hidden">
      {/* Detail Header */}
      <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-600 hover:text-brand-red transition-colors font-bold text-sm"
        >
          <ArrowLeft size={18} />
          {t.back}
        </button>
        <h2 className="text-lg font-black text-brand-black uppercase tracking-tight">{t.details}</h2>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="p-6 space-y-8">
        {/* Media Gallery */}
        {report.media_urls && report.media_urls.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.media_urls.map((url, i) => (
              <div key={i} className="aspect-video rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200">
                <img src={url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 bg-brand-red/10 text-brand-red rounded-full text-xs font-black uppercase tracking-widest">
                {t.categories[report.category as keyof typeof t.categories] || report.category}
              </span>
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-bold">
                <Calendar size={14} />
                {formatRelativeTime(report.created_at, lang)}
              </div>
            </div>

            <p className="text-xl text-zinc-800 font-medium leading-relaxed">
              {report.description}
            </p>

            <div className="flex items-center gap-2 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
              <MapPin className="text-brand-red" size={20} />
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">{t.location}</p>
                <p className="text-sm font-bold text-zinc-700">{report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}</p>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="p-6 bg-brand-black text-white rounded-3xl shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="text-brand-red" size={20} />
                <h3 className="text-sm font-black uppercase tracking-widest">Verification Status</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold opacity-60">{t.voteYes}</span>
                  <span className="text-lg font-black text-brand-green">{report.upvotes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold opacity-60">{t.voteNo}</span>
                  <span className="text-lg font-black text-brand-red">{report.downvotes}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="pt-8 border-t border-zinc-100 space-y-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="text-brand-red" size={20} />
            <h3 className="text-lg font-black text-brand-black uppercase tracking-tight">{t.comments}</h3>
            <span className="px-2 py-0.5 bg-zinc-100 rounded-lg text-xs font-bold text-zinc-500">{comments.length}</span>
          </div>

          <form onSubmit={handlePostComment} className="flex gap-3">
            <input 
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={t.addComment}
              className="flex-1 px-5 py-3 rounded-2xl bg-zinc-50 border border-zinc-200 focus:ring-2 focus:ring-brand-red outline-none text-sm"
            />
            <button 
              disabled={loading || !newComment.trim()}
              className="px-6 py-3 bg-brand-red text-white rounded-2xl font-bold hover:bg-red-700 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <Send size={18} />
              <span className="hidden sm:inline">{t.post}</span>
            </button>
          </form>

          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Anonymous User</span>
                  <span className="text-[10px] font-bold text-zinc-400">{formatRelativeTime(comment.created_at, lang)}</span>
                </div>
                <p className="text-sm text-zinc-700 leading-relaxed">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
