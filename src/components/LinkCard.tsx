import { motion } from "motion/react";
import * as Icons from "lucide-react";
import { SocialLink } from "../types";

interface LinkCardProps {
  link: SocialLink;
  count?: number;
  onTrack: (id: string) => void;
}

export default function LinkCard({ link, count, onTrack }: LinkCardProps) {
  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => onTrack(link.id)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative flex items-center justify-center w-full p-5 mb-3 rounded-xl transition-all duration-300 ${link.color} shadow-lg text-center`}
    >
      <span className="text-sm font-black tracking-[0.2em] uppercase text-white">
        {link.title}
      </span>
      
      {count !== undefined && (
        <div className="absolute right-4 hidden sm:flex items-center gap-2">
          <span className="bg-white/20 px-2 py-1 rounded text-[9px] font-bold text-white tracking-tighter">
            {count.toLocaleString()} CLICKS
          </span>
          <Icons.ChevronRight size={14} className="text-white/40" />
        </div>
      )}
    </motion.a>
  );
}
