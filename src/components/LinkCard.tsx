import { motion } from "motion/react";
import * as Icons from "lucide-react";
import { SocialLink } from "../types";

interface LinkCardProps {
  link: SocialLink;
  count?: number;
  onTrack: (id: string) => void;
}

export default function LinkCard({ link, count, onTrack }: LinkCardProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (Icons as any)[link.icon] || Icons.Link;

  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => onTrack(link.id)}
      whileHover={{ scale: 1.01, x: 5 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative flex items-center justify-between w-full p-5 mb-3 rounded-xl transition-all duration-300 border-2 border-transparent ${link.color} shadow-lg`}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 text-white group-hover:bg-white/20 transition-colors">
          <IconComponent size={20} />
        </div>
        <span className="text-sm font-black tracking-widest uppercase text-white">
          {link.title}
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        {count !== undefined && (
          <span className="bg-white/20 px-2 py-1 rounded text-[10px] font-bold text-white tracking-tighter">
            {count.toLocaleString()} CLICKS
          </span>
        )}
        <Icons.ChevronRight size={16} className="text-white/40 group-hover:text-white transition-colors" />
      </div>
    </motion.a>
  );
}
