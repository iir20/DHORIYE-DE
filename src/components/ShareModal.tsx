import { Share2, Facebook, Twitter, MessageCircle, Send, Linkedin, Copy, Check, X } from 'lucide-react';
import { useState } from 'react';
import { Report } from '../types';
import { Language, translations } from '../lib/i18n';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface ShareModalProps {
  report: Report;
  lang: Language;
  onClose: () => void;
}

export default function ShareModal({ report, lang, onClose }: ShareModalProps) {
  const t = translations[lang];
  const [copied, setCopied] = useState(false);
  
  const shareUrl = `${window.location.origin}/report/${report.id}`;
  const shareText = `Corruption Report: ${report.description.substring(0, 100)}... via ${t.title}`;
  
  const shareOptions = [
    { name: 'Facebook', icon: Facebook, color: '#1877F2', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { name: 'Twitter', icon: Twitter, color: '#1DA1F2', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}` },
    { name: 'WhatsApp', icon: MessageCircle, color: '#25D366', url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}` },
    { name: 'Telegram', icon: Send, color: '#0088cc', url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}` },
    { name: 'LinkedIn', icon: Linkedin, color: '#0A66C2', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-zinc-200"
      >
        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-red rounded-xl text-white">
                <Share2 size={20} />
              </div>
              <h3 className="text-xl font-black text-brand-black uppercase tracking-tight">{t.shareTo}</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
              <X size={20} className="text-zinc-400" />
            </button>
          </div>

          {/* Preview Card */}
          <div className="p-4 bg-zinc-50 rounded-3xl border border-zinc-100 space-y-3">
            <div className="aspect-video rounded-2xl overflow-hidden bg-zinc-200 border border-zinc-200">
              <img 
                src={report.media_urls?.[0] || `https://picsum.photos/seed/${report.id}/600/400`} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-brand-red uppercase tracking-widest">
                {t.categories[report.category as keyof typeof t.categories] || report.category}
              </p>
              <p className="text-xs font-bold text-zinc-800 line-clamp-2">{report.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4">
            {shareOptions.map((option) => (
              <a
                key={option.name}
                href={option.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
              >
                <div 
                  style={{ backgroundColor: option.color }}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform"
                >
                  <option.icon size={24} />
                </div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{option.name}</span>
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-zinc-100">
            <div className="flex items-center gap-2 p-2 bg-zinc-50 rounded-2xl border border-zinc-200">
              <input 
                type="text" 
                readOnly 
                value={shareUrl} 
                className="flex-1 bg-transparent border-none outline-none text-xs font-medium text-zinc-500 px-2"
              />
              <button 
                onClick={handleCopy}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2",
                  copied ? "bg-brand-green text-white" : "bg-brand-black text-white hover:bg-zinc-800"
                )}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : t.copyLink}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
