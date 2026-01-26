import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";

interface MiniChartProps {
  data: number[];
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  color: string;
}

export function MiniChart({
  data,
  label,
  value,
  change,
  trend,
  color,
}: MiniChartProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl border-2 border-slate-200 hover:border-slate-300 p-6 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-600 mb-1">{label}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
            trend === "up"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {trend === "up" ? (
            <TrendingUp className="w-3.5 h-3.5" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" />
          )}
          <span>{change}</span>
        </div>
      </div>

      {/* Mini sparkline chart */}
      <div className="relative h-16 overflow-hidden">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* Area fill */}
          <motion.path
            d={`M0,100 L${points} L100,100 Z`}
            fill={`url(#gradient-${label})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 0.6 }}
          />

          {/* Line */}
          <motion.polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="group-hover:stroke-[3] transition-all"
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient
              id={`gradient-${label}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Animated dots */}
        {data.map((_, index) => {
          if (index === 0 || index === data.length - 1) return null;
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - ((data[index] - min) / range) * 100;

          return (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              className="absolute w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                backgroundColor: color,
                transform: "translate(-50%, -50%)",
              }}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

// Sample data for visualization
export const chartData = {
  daily: [45, 52, 48, 65, 58, 72, 68],
  weekly: [320, 380, 360, 420, 450, 480, 520],
  monthly: [12400, 13200, 12800, 14500, 15200, 16800, 17400],
};
