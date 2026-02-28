import { Shield, Languages, Menu, X, Home, Map as MapIcon, List, Info, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Language, translations } from '../lib/i18n';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  currentView: 'feed' | 'map';
  onViewChange: (view: 'feed' | 'map') => void;
  onHomeClick: () => void;
}

export default function Navbar({ lang, onToggleLang, currentView, onViewChange, onHomeClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = translations[lang];

  const navItems = [
    { id: 'feed', label: t.liveFeed, icon: List },
    { id: 'map', label: t.mapView, icon: MapIcon },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-brand-black/95 backdrop-blur-md text-white border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={onHomeClick}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="p-1.5 bg-brand-red rounded-lg shadow-lg shadow-red-900/20">
              <Shield className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h1 className="text-lg font-black tracking-tighter leading-none">{t.title}</h1>
              <p className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold">{t.subtitle}</p>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center bg-zinc-900/50 p-1 rounded-xl border border-white/5">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                    currentView === item.id 
                      ? "bg-brand-red text-white shadow-lg shadow-red-900/20" 
                      : "text-zinc-400 hover:text-white"
                  )}
                >
                  <item.icon size={14} />
                  {item.label}
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-white/10" />

            <button 
              onClick={onToggleLang}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors text-xs font-bold border border-white/5"
            >
              <Languages size={14} />
              {lang === 'bn' ? 'English' : 'বাংলা'}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-zinc-400 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-900 border-t border-white/10 overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onViewChange(item.id as any);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-bold transition-all",
                      currentView === item.id 
                        ? "bg-brand-red text-white" 
                        : "bg-zinc-800 text-zinc-400"
                    )}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => {
                  onToggleLang();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-zinc-800 text-white text-sm font-bold"
              >
                <Languages size={16} />
                {lang === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
