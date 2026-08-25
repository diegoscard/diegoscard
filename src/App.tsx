import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, BarChart3, X, Instagram, Facebook, Youtube } from "lucide-react";
import LinkCard from "./components/LinkCard";
import { UserProfile } from "./types";

const INITIAL_PROFILE: UserProfile = {
  name: "Diego Scard",
  bio: "Especialista em Marketing Digital & Estratégia Visual. Transformando ideias em resultados.",
  links: [
    {
      id: "instagram",
      title: "Instagram",
      url: "https://www.instagram.com/srscard/",
      icon: "Instagram",
      color: "bg-gradient-to-r from-purple-600 to-pink-500",
      hoverColor: "hover:from-purple-700 hover:to-pink-600",
    },
    {
      id: "tiktok",
      title: "TikTok",
      url: "https://www.tiktok.com/@diego.scard?lang=pt-BR",
      icon: "Music2",
      color: "bg-black",
      hoverColor: "hover:bg-zinc-900",
    },
    {
      id: "facebook",
      title: "Facebook",
      url: "https://www.facebook.com/diego.c.dasilva.9/",
      icon: "Facebook",
      color: "bg-[#1877F2]",
      hoverColor: "hover:bg-[#0C63D4]",
    },
    {
      id: "whatsapp",
      title: "WhatsApp",
      url: "https://wa.me/5541988745822",
      icon: "MessageCircle",
      color: "bg-[#25D366]",
      hoverColor: "hover:bg-[#1DA851]",
    },
    {
      id: "portfolio",
      title: "Meu Portfólio",
      url: "#",
      icon: "Globe",
      color: "bg-zinc-800",
      hoverColor: "hover:bg-zinc-700",
    },
  ],
};

export default function App() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    // Carregar stats iniciais do servidor
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Error fetching stats:", err));
    
    // Carregar do localStorage como backup/cache
    const localStats = localStorage.getItem("bio_link_stats");
    if (localStats) {
      setStats(prev => ({ ...prev, ...JSON.parse(localStats) }));
    }
  }, []);

  const trackClick = async (linkId: string) => {
    // 1. Atualizar UI imediatamente
    const newStats = { ...stats, [linkId]: (stats[linkId] || 0) + 1 };
    setStats(newStats);
    localStorage.setItem("bio_link_stats", JSON.stringify(newStats));

    // 2. Tentar enviar para o servidor
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
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 font-sans selection:bg-purple-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]" />
      </div>

      <main className="relative max-w-md mx-auto px-6 pt-16 pb-24">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 p-1">
              <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center overflow-hidden">
                <User size={48} className="text-zinc-400" />
              </div>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-zinc-900 rounded-full"
            />
          </div>
          
          <h1 className="text-2xl font-bold mb-2 tracking-tight">
            {INITIAL_PROFILE.name}
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-[280px] mx-auto">
            {INITIAL_PROFILE.bio}
          </p>
        </motion.div>

        {/* Links List */}
        <div className="space-y-2">
          {INITIAL_PROFILE.links.map((link, index) => (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <LinkCard link={link} onTrack={trackClick} />
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="flex justify-center space-x-6 mb-8 text-zinc-500">
             <Instagram size={20} className="hover:text-white cursor-pointer transition-colors" />
             <Youtube size={20} className="hover:text-white cursor-pointer transition-colors" />
             <Facebook size={20} className="hover:text-white cursor-pointer transition-colors" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-medium">
            © 2026 Bio Link Pro • Design by Scard
          </p>
        </footer>

        {/* Floating Stats Button */}
        <button
          onClick={() => setShowStats(true)}
          className="fixed bottom-6 right-6 w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-all backdrop-blur-md"
        >
          <BarChart3 size={20} className="text-zinc-400" />
        </button>

        {/* Stats Modal */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-black/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <BarChart3 size={22} className="text-purple-500" />
                    Análise de Cliques
                  </h2>
                  <button
                    onClick={() => setShowStats(false)}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  {INITIAL_PROFILE.links.map((link) => (
                    <div key={link.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${link.color}`} />
                        <span className="text-sm font-medium">{link.title}</span>
                      </div>
                      <span className="text-lg font-mono font-bold text-purple-400">
                        {stats[link.id] || 0}
                      </span>
                    </div>
                  ))}
                  
                  {Object.keys(stats).length === 0 && (
                    <p className="text-center text-zinc-500 py-8 italic">
                      Nenhum clique registrado ainda.
                    </p>
                  )}
                </div>
                
                <p className="mt-8 text-[10px] text-zinc-500 text-center uppercase tracking-wider">
                  Dados salvos localmente nesta sessão
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
