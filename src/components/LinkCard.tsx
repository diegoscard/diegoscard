import { motion } from "motion/react";
import * as Icons from "lucide-react";
import { SocialLink } from "../types";

interface LinkCardProps {
  link: SocialLink;
  onTrack: (id: string) => void;
}

export default function LinkCard({ link, onTrack }: LinkCardProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (Icons as any)[link.icon] || Icons.Link;

  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => onTrack(link.id)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative flex items-center w-full p-4 mb-4 rounded-2xl border border-white/10 backdrop-blur-md transition-all duration-300 ${link.color} hover:shadow-lg hover:border-white/20`}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 text-white group-hover:scale-110 transition-transform">
        <IconComponent size={24} />
      </div>
      <div className="flex-1 text-center pr-12">
        <span className="text-lg font-semibold text-white tracking-wide">
          {link.title}
        </span>
      </div>
      <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Icons.ExternalLink size={18} className="text-white/60" />
      </div>
    </motion.a>
  );
}
