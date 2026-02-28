import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Map as MapIcon, List, Plus, Languages, Search, AlertTriangle, Filter, ArrowUpDown, Share2 } from 'lucide-react';
import { getSupabase } from './lib/supabase';
import { translations, Language } from './lib/i18n';
import { Report } from './types';
import ReportForm from './components/ReportForm';
import ReportCard from './components/ReportCard';
import MapView from './components/MapView';
import ReportDetail from './components/ReportDetail';
import LandingPage from './components/LandingPage';
import LoadingScreen from './components/LoadingScreen';
import ShareModal from './components/ShareModal';
import { cn } from './lib/utils';

type AppState = 'landing' | 'loading' | 'platform';

export default function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [lang, setLang] = useState<Language>('bn');
  const [view, setView] = useState<'feed' | 'map'>('feed');
  const [showForm, setShowForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [shareReport, setShareReport] = useState<Report | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'upvotes' | 'downvotes'>('newest');

  const supabase = getSupabase();
  const t = translations[lang];

  const fetchReports = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          votes (vote_type)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const reportsWithVotes = data.map((r: any) => ({
        ...r,
        upvotes: r.votes.filter((v: any) => v.vote_type === 'up').length,
        downvotes: r.votes.filter((v: any) => v.vote_type === 'down').length
      }));

      setReports(reportsWithVotes);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appState === 'platform') {
      fetchReports();

      if (!supabase) return;

      const channel = supabase
        .channel('reports-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, () => {
          fetchReports();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [appState]);

  const handleEnterPlatform = () => {
    setAppState('loading');
    setTimeout(() => {
      setAppState('platform');
    }, 2500);
  };

  const filteredReports = reports
    .filter(r => 
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'upvotes') return (b.upvotes || 0) - (a.upvotes || 0);
      if (sortBy === 'downvotes') return (b.downvotes || 0) - (a.downvotes || 0);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  if (appState === 'landing') {
    return <LandingPage lang={lang} onEnter={handleEnterPlatform} onToggleLang={() => setLang(lang === 'bn' ? 'en' : 'bn')} />;
  }

  if (appState === 'loading') {
    return <LoadingScreen lang={lang} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-brand-black text-white py-4 shadow-xl">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-red rounded-xl shadow-lg shadow-red-900/20">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter leading-none">{t.title}</h1>
              <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">{t.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors text-xs font-bold"
            >
              <Languages size={14} />
              {lang === 'bn' ? 'English' : 'বাংলা'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar / Feed Controls */}
          <div className="w-full lg:w-80 space-y-6">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-200 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:ring-2 focus:ring-brand-red outline-none text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">{t.sortBy}</label>
                <div className="relative">
                  <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 focus:ring-2 focus:ring-brand-red outline-none text-xs font-bold appearance-none"
                  >
                    <option value="newest">{t.newest}</option>
                    <option value="upvotes">{t.mostUpvoted}</option>
                    <option value="downvotes">{t.mostDownvoted}</option>
                  </select>
                </div>
              </div>

              <div className="flex p-1 bg-zinc-100 rounded-xl">
                <button 
                  onClick={() => setView('feed')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all",
                    view === 'feed' ? "bg-white shadow-sm text-brand-red" : "text-zinc-500 hover:text-zinc-700"
                  )}
                >
                  <List size={16} />
                  {t.liveFeed}
                </button>
                <button 
                  onClick={() => setView('map')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all",
                    view === 'map' ? "bg-white shadow-sm text-brand-red" : "text-zinc-500 hover:text-zinc-700"
                  )}
                >
                  <MapIcon size={16} />
                  {t.mapView}
                </button>
              </div>

              <button 
                onClick={() => setShowForm(!showForm)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-brand-red text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-900/10"
              >
                <Plus size={20} />
                {t.reportCorruption}
              </button>
            </div>

            {/* Stats Card */}
            <div className="bg-brand-green p-6 rounded-2xl text-white shadow-lg shadow-green-900/10">
              <h3 className="text-sm font-bold uppercase tracking-widest opacity-80 mb-4">Platform Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-black">{reports.length}</p>
                  <p className="text-[10px] uppercase font-bold opacity-70">Total Reports</p>
                </div>
                <div>
                  <p className="text-2xl font-black">{reports.filter(r => r.status === 'verified').length}</p>
                  <p className="text-[10px] uppercase font-bold opacity-70">Verified Cases</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Display Area */}
          <div className="flex-1">
            {!supabase && (
              <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl mb-8 flex items-start gap-4">
                <AlertTriangle className="text-amber-600 shrink-0" />
                <div>
                  <h3 className="font-bold text-amber-900">Supabase Configuration Required</h3>
                  <p className="text-sm text-amber-800 mt-1">
                    Please set <strong>VITE_SUPABASE_URL</strong> and <strong>VITE_SUPABASE_ANON_KEY</strong> in the Secrets panel to enable the database.
                  </p>
                </div>
              </div>
            )}
            <AnimatePresence mode="wait">
              {selectedReport ? (
                <motion.div
                  key="detail"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <ReportDetail 
                    report={selectedReport} 
                    lang={lang} 
                    onBack={() => setSelectedReport(null)} 
                  />
                </motion.div>
              ) : showForm ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ReportForm lang={lang} onSuccess={() => {
                    setShowForm(false);
                    fetchReports();
                  }} />
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {view === 'feed' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="h-64 bg-zinc-100 animate-pulse rounded-2xl" />
                        ))
                      ) : filteredReports.length > 0 ? (
                        filteredReports.map((report: Report) => {
                          const Card = ReportCard as any;
                          return (
                            <div key={report.id} className="relative group">
                              <div onClick={() => setSelectedReport(report)} className="cursor-pointer">
                                <Card report={report} lang={lang} />
                              </div>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShareReport(report);
                                }}
                                className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg text-zinc-400 hover:text-brand-red transition-all opacity-0 group-hover:opacity-100"
                              >
                                <Share2 size={18} />
                              </button>
                            </div>
                          );
                        })
                      ) : (
                        <div className="col-span-full py-20 text-center text-zinc-400 font-bold">
                          {t.noReports}
                        </div>
                      )}
                    </div>
                  ) : (
                    <MapView 
                      reports={reports} 
                      lang={lang} 
                      onSelectReport={(r) => setSelectedReport(r)} 
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>

      {/* Share Modal */}
      <AnimatePresence>
        {shareReport && (
          <ShareModal 
            report={shareReport} 
            lang={lang} 
            onClose={() => setShareReport(null)} 
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-zinc-100 border-t border-zinc-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-zinc-500 font-medium">
            &copy; {new Date().getFullYear()} {t.title}. {t.subtitle}.
          </p>
          <div className="mt-4 flex items-center justify-center gap-6">
            <a href="#" className="text-xs font-bold text-zinc-400 hover:text-brand-red transition-colors uppercase tracking-widest">Privacy Policy</a>
            <a href="#" className="text-xs font-bold text-zinc-400 hover:text-brand-red transition-colors uppercase tracking-widest">Terms of Service</a>
            <a href="#" className="text-xs font-bold text-zinc-400 hover:text-brand-red transition-colors uppercase tracking-widest">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

