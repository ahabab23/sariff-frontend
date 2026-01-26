import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { useState } from "react";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  gradient: string;
}

export function StatCard({
  label,
  value,
  change,
  trend,
  icon: Icon,
  gradient,
}: StatCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group cursor-pointer"
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${gradient.split(" ")[1]} 0%, ${
            gradient.split(" ")[3]
          } 100%)`,
        }}
        animate={{
          opacity: isHovered ? 0.3 : 0,
        }}
      />

      <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border-2 border-white/60 dark:border-slate-800 group-hover:border-violet-300 dark:group-hover:border-slate-700 p-6 transition-all duration-300 overflow-hidden shadow-lg shadow-slate-200/50">
        {/* Background pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 dark:opacity-10">
          <div
            className={`w-full h-full bg-gradient-to-br ${gradient} rounded-full blur-2xl`}
          />
        </div>

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
            linear-gradient(to right, rgb(139, 92, 246) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(139, 92, 246) 1px, transparent 1px)
          `,
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            {/* Icon with gradient background */}
            <motion.div
              className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg overflow-hidden`}
              animate={{
                scale: isHovered ? 1.1 : 1,
                rotate: isHovered ? 5 : 0,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: "-100%" }}
                animate={{
                  x: isHovered ? "100%" : "-100%",
                }}
                transition={{ duration: 0.6 }}
              />
              <Icon className="w-7 h-7 text-white relative z-10" />
            </motion.div>

            {/* Trend badge */}
            <motion.div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                trend === "up"
                  ? "bg-blue-50 text-blue-700 border-2 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                  : "bg-red-50 text-red-700 border-2 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
              }`}
              animate={{
                scale: isHovered ? 1.05 : 1,
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {trend === "up" ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{change}</span>
            </motion.div>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wider">
              {label}
            </p>
            <motion.p
              className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-2"
              animate={{
                scale: isHovered ? 1.05 : 1,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              {value}
            </motion.p>

            {/* View details link on hover */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                height: isHovered ? "auto" : 0,
              }}
              className="overflow-hidden"
            >
              <div
                className={`flex items-center gap-1 text-sm font-medium bg-gradient-to-r ${gradient} bg-clip-text text-transparent group-hover:text-violet-600 mt-2`}
              >
                <span>View details</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-violet-600" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom accent gradient line */}
        <motion.div
          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ transformOrigin: "left" }}
        />
      </div>
    </motion.div>
  );
}
