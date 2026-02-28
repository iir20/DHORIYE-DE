import { motion } from 'motion/react';
import { Shield, ArrowRight, CheckCircle, Lock, Users, Share2, AlertTriangle, Briefcase, Building2, MapPin, Scale, FileText } from 'lucide-react';
import { Language, translations } from '../lib/i18n';
import { useState } from 'react';
import { cn } from '../lib/utils';

interface LandingPageProps {
  lang: Language;
  onEnter: () => void;
  onToggleLang: () => void;
}

export default function LandingPage({ lang, onEnter, onToggleLang }: LandingPageProps) {
  const t = translations[lang];

  const useCases = [
    { icon: Briefcase, title: lang === 'bn' ? 'ঘুষ (Bribery)' : 'Bribery', desc: lang === 'bn' ? 'সরকারি অফিসে ঘুষ লেনদেন।' : 'Bribery in government offices.' },
    { icon: Building2, title: lang === 'bn' ? 'চাঁদাবাজি (Extortion)' : 'Extortion', desc: lang === 'bn' ? 'ব্যবসায়ী বা সাধারণ মানুষের কাছ থেকে চাঁদা আদায়।' : 'Extortion from businesses or common people.' },
    { icon: FileText, title: lang === 'bn' ? 'টেন্ডার দুর্নীতি (Tender Scam)' : 'Tender Scam', desc: lang === 'bn' ? 'সরকারি টেন্ডার প্রক্রিয়ায় কারচুপি।' : 'Manipulation in government tender processes.' },
    { icon: Building2, title: lang === 'bn' ? 'হাসপাতাল দুর্নীতি (Hospital Corruption)' : 'Hospital Corruption', desc: lang === 'bn' ? 'চিকিৎসা সেবায় অনিয়ম ও দুর্নীতি।' : 'Irregularities and corruption in medical services.' },
    { icon: Shield, title: lang === 'bn' ? 'পুলিশ দুর্নীতি (Police Corruption)' : 'Police Corruption', desc: lang === 'bn' ? 'আইনশৃঙ্খলা রক্ষাকারী বাহিনীর অনিয়ম।' : 'Irregularities in law enforcement agencies.' },
    { icon: MapPin, title: lang === 'bn' ? 'ভূমি অফিস দুর্নীতি (Land Office Corruption)' : 'Land Office Corruption', desc: lang === 'bn' ? 'জমি সংক্রান্ত কাজে হয়রানি ও ঘুষ।' : 'Harassment and bribery in land-related work.' },
  ];

  const steps = [
    { title: t.step1, desc: t.step1Desc },
    { title: t.step2, desc: t.step2Desc },
    { title: t.step3, desc: t.step3Desc },
    { title: t.step4, desc: t.step4Desc },
    { title: t.step5, desc: t.step5Desc },
  ];

  return (
    <div className="min-h-screen bg-brand-black text-white font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-brand-black/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-red rounded-xl shadow-lg shadow-red-900/20">
              <Shield className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase">{t.title}</h1>
          </div>
          <button 
            onClick={onToggleLang}
            className="px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors text-xs font-bold uppercase tracking-widest"
          >
            {lang === 'bn' ? 'English' : 'বাংলা'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#e11d48_0%,transparent_70%)]" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase">
              {t.justiceHeroTitle}
            </h2>
            <p className="text-lg md:text-xl text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed">
              {t.justiceHeroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <button 
                onClick={onEnter}
                className="w-full sm:w-auto px-10 py-5 bg-brand-red text-white rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-red-700 transition-all shadow-2xl shadow-red-900/40 flex items-center justify-center gap-3 group"
              >
                {t.enterPlatform}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center gap-4 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1"><Lock size={14} /> 100% Anonymous</span>
                <span className="flex items-center gap-1"><CheckCircle size={14} /> Community Verified</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-zinc-900/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl font-black uppercase tracking-tighter text-brand-red">{t.aboutTitle}</h3>
              <p className="text-lg text-zinc-400 leading-relaxed font-medium">
                {t.aboutDescription}
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="p-4 bg-brand-black rounded-2xl border border-white/5 space-y-2">
                  <Users className="text-brand-green" size={24} />
                  <p className="text-sm font-bold uppercase tracking-widest">Community Driven</p>
                </div>
                <div className="p-4 bg-brand-black rounded-2xl border border-white/5 space-y-2">
                  <Scale className="text-brand-red" size={24} />
                  <p className="text-sm font-bold uppercase tracking-widest">Justice Focused</p>
                </div>
              </div>
            </div>
            <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img 
                src="https://picsum.photos/seed/justice/800/800" 
                className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8">
                <p className="text-2xl font-black uppercase tracking-tighter">Voice of the People</p>
                <p className="text-sm text-brand-red font-bold uppercase tracking-widest">Fighting Corruption Daily</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h3 className="text-3xl font-black uppercase tracking-tighter">{t.useCasesTitle}</h3>
            <div className="w-20 h-1 bg-brand-red mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 bg-zinc-900 border border-white/5 rounded-3xl space-y-4 hover:border-brand-red/50 transition-all"
              >
                <div className="p-3 bg-brand-red/10 text-brand-red rounded-xl w-fit">
                  <useCase.icon size={24} />
                </div>
                <h4 className="text-xl font-bold uppercase tracking-tight">{useCase.title}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed font-medium">{useCase.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-brand-red/5">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h3 className="text-3xl font-black uppercase tracking-tighter">{t.howItWorksTitle}</h3>
            <div className="w-20 h-1 bg-brand-red mx-auto rounded-full" />
          </div>
          <div className="max-w-4xl mx-auto space-y-12">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-8 items-start group">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-brand-red flex items-center justify-center font-black text-xl shadow-lg shadow-red-900/40 shrink-0">
                    {i + 1}
                  </div>
                  {i < steps.length - 1 && <div className="w-0.5 h-20 bg-brand-red/20 my-2" />}
                </div>
                <div className="pt-2 space-y-2">
                  <h4 className="text-xl font-bold uppercase tracking-tight group-hover:text-brand-red transition-colors">{step.title}</h4>
                  <p className="text-zinc-400 font-medium leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Manual */}
      <section className="py-24 bg-zinc-900/30">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h3 className="text-3xl font-black uppercase tracking-tighter">User Manual</h3>
            <div className="w-20 h-1 bg-brand-red mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-brand-red uppercase tracking-tight">How to Submit</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Click "Report Corruption", fill in the details, select the location on the map, and upload evidence. No personal info is required.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-brand-red uppercase tracking-tight">How to Vote</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Browse the feed or map. Click "Verify" if you believe the report is true, or "Fake" if you suspect it's false. One vote per 24h per IP.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-brand-red uppercase tracking-tight">Anonymity</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">
                We use cryptographic hashing on your IP address. This allows us to prevent spam while ensuring we never know who you actually are.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-brand-red uppercase tracking-tight">Trust System</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Reports with high "Verified" counts and solid evidence (photos/videos) gain higher visibility and are marked as trusted by the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Security */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="bg-brand-black border border-white/10 rounded-[3rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <Shield size={300} />
            </div>
            <div className="p-4 bg-brand-green/10 text-brand-green rounded-full w-fit mx-auto">
              <Lock size={32} />
            </div>
            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">{t.privacyTitle}</h3>
            <p className="text-lg md:text-xl text-zinc-400 leading-relaxed font-medium max-w-3xl mx-auto">
              {t.privacyDesc}
            </p>
            <div className="flex flex-wrap justify-center gap-8 pt-8">
              <div className="flex items-center gap-2 text-zinc-500 font-bold uppercase tracking-widest text-xs">
                <CheckCircle size={16} className="text-brand-green" /> No Logs
              </div>
              <div className="flex items-center gap-2 text-zinc-500 font-bold uppercase tracking-widest text-xs">
                <CheckCircle size={16} className="text-brand-green" /> IP Hashing
              </div>
              <div className="flex items-center gap-2 text-zinc-500 font-bold uppercase tracking-widest text-xs">
                <CheckCircle size={16} className="text-brand-green" /> End-to-End Anonymity
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-brand-black">
        <div className="container mx-auto px-6 text-center space-y-8">
          <div className="flex items-center justify-center gap-3">
            <Shield className="h-8 w-8 text-brand-red" />
            <h1 className="text-2xl font-black tracking-tighter uppercase">{t.title}</h1>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-zinc-500 text-xs font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
            <a href="#" className="hover:text-white transition-colors">Transparency Report</a>
          </div>
          <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-[0.2em]">
            &copy; {new Date().getFullYear()} {t.title}. Built for a Corruption-Free Bangladesh.
          </p>
        </div>
      </footer>
    </div>
  );
}
