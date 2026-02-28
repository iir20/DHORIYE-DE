import { motion } from 'motion/react';
import { Shield, Loader2 } from 'lucide-react';
import { Language, translations } from '../lib/i18n';

interface LoadingScreenProps {
  lang: Language;
}

export default function LoadingScreen({ lang }: LoadingScreenProps) {
  const t = translations[lang];

  return (
    <div className="fixed inset-0 z-[9999] bg-brand-black flex flex-col items-center justify-center text-white p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-8 w-full max-w-md"
      >
        <div className="p-6 bg-brand-red rounded-3xl shadow-2xl shadow-red-900/40 relative">
          <Shield className="h-16 w-16" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-2 border-2 border-brand-red border-t-transparent rounded-full"
          />
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black tracking-tighter uppercase">{t.title}</h2>
          <p className="text-zinc-400 font-bold text-sm tracking-widest uppercase animate-pulse">
            {t.loadingDatabase}
          </p>
        </div>

        <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden border border-zinc-700">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="h-full bg-brand-red shadow-[0_0_15px_rgba(225,29,72,0.5)]"
          />
        </div>

        <div className="flex items-center gap-3 text-zinc-500 text-xs font-bold uppercase tracking-widest">
          <Loader2 className="animate-spin" size={14} />
          Initializing Realtime Sync...
        </div>
      </motion.div>
    </div>
  );
}
