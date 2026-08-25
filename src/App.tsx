import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, BarChart3, X, Instagram, Facebook, Youtube } from "lucide-react";
import LinkCard from "./components/LinkCard";
import { UserProfile } from "./types";

const INITIAL_PROFILE: UserProfile = {
  name: "Diego Scard",
  bio: "Videomaker Mobile & Estrategista Digital +20 anos criando resultados",
  links: [
    {
      id: "instagram",
      title: "INSTAGRAM",
      url: "https://www.instagram.com/srscard/",
      icon: "Instagram",
      color: "bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045]",
      hoverColor: "hover:opacity-90",
    },
    {
      id: "tiktok",
      title: "TIKTOK",
      url: "https://www.tiktok.com/@diego.scard?lang=pt-BR",
      icon: "Music2",
      color: "bg-zinc-900",
      hoverColor: "hover:bg-black",
    },
    {
      id: "facebook",
      title: "FACEBOOK",
      url: "https://www.facebook.com/diego.c.dasilva.9/",
      icon: "Facebook",
      color: "bg-[#1877F2]",
      hoverColor: "hover:bg-[#0C63D4]",
    },
    {
      id: "whatsapp",
      title: "WHATSAPP",
      url: "https://wa.me/5541988745822",
      icon: "MessageCircle",
      color: "bg-[#25D366]",
      hoverColor: "hover:bg-[#1DA851]",
    },
    {
      id: "iptv",
      title: "SCARD PLAY IPTV",
      url: "https://scard-play.vercel.app/",
      icon: "Tv",
      color: "bg-red-600",
      hoverColor: "hover:bg-red-700",
    },
  ],
};

export default function App() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Error fetching stats:", err));
    
    const localStats = localStorage.getItem("bio_link_stats");
    if (localStats) {
      setStats(prev => ({ ...prev, ...JSON.parse(localStats) }));
    }
  }, []);

  const trackClick = async (linkId: string) => {
    const newStats = { ...stats, [linkId]: (stats[linkId] || 0) + 1 };
    setStats(newStats);
    localStorage.setItem("bio_link_stats", JSON.stringify(newStats));

    try {
      const response = await fetch("/api/track-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkId }),
      });
      const data = await response.json();
      if (data.success) {
        setStats(prev => ({ ...prev, [linkId]: data.count }));
      }
    } catch (err) {
      console.error("Failed to track click on server:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-red-500/30 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-red-900/30 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-zinc-900/50 rounded-full blur-[150px]" />
      </div>

      <main className="relative max-w-lg mx-auto px-6 pt-20 pb-24">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center mb-12"
        >
          <div className="relative mb-10">
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-red-600 via-red-500 to-black p-[3px] shadow-[0_0_50px_-12px_rgba(220,38,38,0.5)]">
              <div className="w-full h-full rounded-full bg-[#0F0F0F] flex items-center justify-center overflow-hidden border-4 border-[#050505]">
                <div className="text-3xl font-black text-white italic tracking-tighter">SCARD</div>
              </div>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="absolute bottom-1 right-1 w-7 h-7 bg-green-500 border-4 border-[#050505] rounded-full shadow-lg shadow-green-500/20"
            />
          </div>
          
          <div className="relative mb-6 group">
            <div className="absolute inset-0 bg-white/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
            <div className="relative bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
              <h1 className="text-4xl font-black tracking-tighter uppercase px-8 py-2">
                {INITIAL_PROFILE.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-1.5 bg-red-600/10 border border-red-500/20 rounded-full mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[9px] font-black tracking-[0.2em] text-red-500 uppercase">
              CRIADOR DE CONTEÚDO DIGITAL
            </span>
          </div>

          <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-[0.15em] leading-relaxed max-w-xs opacity-80">
            {INITIAL_PROFILE.bio}
          </p>
        </motion.div>

        {/* Links List */}
        <div className="space-y-3">
          {INITIAL_PROFILE.links.map((link, index) => (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <LinkCard 
                link={link} 
                count={stats[link.id]} 
                onTrack={trackClick} 
              />
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-10 border-t border-zinc-900 text-center">
          
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">
            © 2026 Scard Play • All Systems Operational
          </p>
        </footer>

        {/* Floating Stats Button */}
        <button
          onClick={() => setShowStats(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center hover:bg-red-700 transition-all shadow-xl shadow-red-600/30 group"
        >
          <BarChart3 size={24} className="text-white group-hover:scale-110 transition-transform" />
        </button>

        {/* Stats Modal - Dashboard Style */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/80 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.95, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 30 }}
                className="w-full max-w-md bg-[#0F0F0F] border-2 border-zinc-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-24 bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="flex justify-between items-center mb-10 relative">
                  <div>
                    <h2 className="text-[10px] font-black tracking-[0.2em] text-red-500 uppercase mb-1">
                      Metrics Center
                    </h2>
                    <h3 className="text-2xl font-black tracking-tight uppercase">
                      Performance <span className="text-zinc-600">Stats</span>
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowStats(false)}
                    className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                    <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Total Engagement</p>
                    <p className="text-2xl font-black text-green-500">
                      {Object.values(stats).reduce((a: number, b: number) => a + b, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                    <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Active Sources</p>
                    <p className="text-2xl font-black text-white">{INITIAL_PROFILE.links.length}</p>
                  </div>
                </div>

                <div className="space-y-3 relative">
                  {INITIAL_PROFILE.links.map((link) => (
                    <div key={link.id} className="flex items-center justify-between p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-xl hover:border-zinc-700 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${link.color.split(' ')[0] === 'bg-gradient-to-r' ? 'bg-pink-500' : link.color}`} />
                        <span className="text-[10px] font-black tracking-widest uppercase">{link.title}</span>
                      </div>
                      <span className="text-lg font-mono font-black text-white">
                        {stats[link.id] || 0}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-10 flex items-center justify-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-[8px] text-zinc-600 font-black uppercase tracking-[0.2em]">
                    Real-time analysis active
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
