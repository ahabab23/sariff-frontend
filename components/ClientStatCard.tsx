import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ClientStatCardProps {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  gradient: string;
}

export function ClientStatCard({
  label,
  value,
  change,
  trend,
  icon: Icon,
  gradient,
}: ClientStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative group"
    >
      {/* Premium card with backdrop blur and gradients */}
      <div className="bg-white/70 backdrop-blur-sm border-2 border-slate-200 group-hover:border-blue-300 transition-all duration-300 overflow-hidden shadow-xl hover:shadow-2xl relative">
        {/* Animated gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
        />

        <div className="p-6 relative z-10">
          {/* Top section with icon */}
          <div className="flex items-start justify-between mb-4">
            <div
              className={`w-14 h-14 bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300 relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50" />
              <Icon className="w-7 h-7 text-white relative z-10" />
            </div>

            {/* Change badge with premium styling */}
            <div
              className={`px-3 py-2 flex items-center gap-2 shadow-lg ${
                trend === "up"
                  ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-2 border-emerald-300"
                  : "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-2 border-red-300"
              }`}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {trend === "up" ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                )}
              </svg>
              <span className="text-xs font-black">{change}</span>
            </div>
          </div>

          {/* Label */}
          <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">
            {label}
          </p>

          {/* Value - with gradient text */}
          <p
            className={`text-3xl font-black font-mono tracking-tight text-transparent bg-gradient-to-r ${gradient} bg-clip-text mb-4`}
          >
            {value}
          </p>

          {/* Bottom section - enhanced */}
          <div className="pt-4 border-t-2 border-slate-200">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">Last updated</span>
              <span className="font-black text-slate-700 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Just now
              </span>
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          className={`h-1 bg-gradient-to-r ${gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-300`}
        />
      </div>
    </motion.div>
  );
}
