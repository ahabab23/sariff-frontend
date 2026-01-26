import { motion } from "framer-motion";
import {
  X,
  Check,
  AlertTriangle,
  Info,
  Zap,
  Star,
  Crown,
  Shield,
} from "lucide-react";

interface BadgeProps {
  variant?:
    | "default"
    | "success"
    | "error"
    | "warning"
    | "info"
    | "premium"
    | "vip";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  pulse?: boolean;
  glow?: boolean;
}

export function Badge({
  variant = "default",
  size = "md",
  children,
  icon,
  removable = false,
  onRemove,
  pulse = false,
  glow = false,
}: BadgeProps) {
  const variants = {
    default: {
      bg: "from-slate-100 to-slate-200",
      border: "border-slate-300",
      text: "text-slate-700",
      glow: "shadow-slate-500/50",
    },
    success: {
      bg: "from-emerald-500 to-teal-500",
      border: "border-emerald-400",
      text: "text-white",
      glow: "shadow-emerald-500/50",
    },
    error: {
      bg: "from-red-500 to-rose-500",
      border: "border-red-400",
      text: "text-white",
      glow: "shadow-red-500/50",
    },
    warning: {
      bg: "from-amber-500 to-orange-500",
      border: "border-amber-400",
      text: "text-white",
      glow: "shadow-amber-500/50",
    },
    info: {
      bg: "from-blue-500 to-cyan-500",
      border: "border-blue-400",
      text: "text-white",
      glow: "shadow-blue-500/50",
    },
    premium: {
      bg: "from-violet-500 to-purple-600",
      border: "border-violet-400",
      text: "text-white",
      glow: "shadow-violet-500/50",
    },
    vip: {
      bg: "from-amber-400 to-yellow-500",
      border: "border-amber-300",
      text: "text-slate-900",
      glow: "shadow-amber-500/50",
    },
  };

  const sizes = {
    sm: "text-xs px-2 py-1 gap-1",
    md: "text-sm px-3 py-1.5 gap-1.5",
    lg: "text-base px-4 py-2 gap-2",
  };

  const style = variants[variant];

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center ${
        sizes[size]
      } rounded-full font-bold bg-gradient-to-r ${style.bg} ${
        style.text
      } border-2 ${style.border} ${
        glow ? `shadow-lg ${style.glow}` : ""
      } relative overflow-hidden`}
    >
      {/* Animated shine effect */}
      {glow && (
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
          }}
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Pulse effect */}
      {pulse && (
        <motion.div
          className={`absolute inset-0 rounded-full bg-gradient-to-r ${style.bg}`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      <span className="relative z-10 flex items-center gap-1">
        {icon}
        {children}
      </span>

      {removable && onRemove && (
        <motion.button
          whileHover={{ scale: 1.2, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="relative z-10 ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
        >
          <X className="w-3 h-3" />
        </motion.button>
      )}
    </motion.div>
  );
}

// Preset badge variants
export function SuccessBadge({
  children,
  ...props
}: Omit<BadgeProps, "variant">) {
  return (
    <Badge variant="success" icon={<Check className="w-3 h-3" />} {...props}>
      {children}
    </Badge>
  );
}

export function ErrorBadge({
  children,
  ...props
}: Omit<BadgeProps, "variant">) {
  return (
    <Badge variant="error" icon={<X className="w-3 h-3" />} {...props}>
      {children}
    </Badge>
  );
}

export function WarningBadge({
  children,
  ...props
}: Omit<BadgeProps, "variant">) {
  return (
    <Badge
      variant="warning"
      icon={<AlertTriangle className="w-3 h-3" />}
      {...props}
    >
      {children}
    </Badge>
  );
}

export function InfoBadge({ children, ...props }: Omit<BadgeProps, "variant">) {
  return (
    <Badge variant="info" icon={<Info className="w-3 h-3" />} {...props}>
      {children}
    </Badge>
  );
}

export function PremiumBadge({
  children,
  ...props
}: Omit<BadgeProps, "variant">) {
  return (
    <Badge
      variant="premium"
      icon={<Crown className="w-3 h-3" />}
      glow
      pulse
      {...props}
    >
      {children}
    </Badge>
  );
}

export function VIPBadge({ children, ...props }: Omit<BadgeProps, "variant">) {
  return (
    <Badge
      variant="vip"
      icon={<Star className="w-3 h-3" />}
      glow
      pulse
      {...props}
    >
      {children}
    </Badge>
  );
}

// Status indicator dot
interface StatusDotProps {
  status: "online" | "offline" | "busy" | "away";
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function StatusDot({ status, label, size = "md" }: StatusDotProps) {
  const colors = {
    online: "bg-emerald-500",
    offline: "bg-slate-400",
    busy: "bg-red-500",
    away: "bg-amber-500",
  };

  const sizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  return (
    <div className="inline-flex items-center gap-2">
      <motion.div
        className="relative"
        animate={
          status === "online" || status === "busy"
            ? {
                scale: [1, 1.2, 1],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className={`${sizes[size]} rounded-full ${colors[status]}`} />
        {(status === "online" || status === "busy") && (
          <motion.div
            className={`absolute inset-0 rounded-full ${colors[status]}`}
            animate={{
              scale: [1, 2, 2],
              opacity: [0.5, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.div>
      {label && (
        <span className="text-sm text-slate-600 font-medium">{label}</span>
      )}
    </div>
  );
}

// Count badge (for notifications)
interface CountBadgeProps {
  count: number;
  max?: number;
  variant?: "primary" | "success" | "error" | "warning";
}

export function CountBadge({
  count,
  max = 99,
  variant = "error",
}: CountBadgeProps) {
  const displayCount = count > max ? `${max}+` : count;

  const variants = {
    primary: "from-blue-500 to-cyan-500",
    success: "from-emerald-500 to-teal-500",
    error: "from-red-500 to-rose-500",
    warning: "from-amber-500 to-orange-500",
  };

  if (count === 0) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-gradient-to-r ${variants[variant]} text-white text-xs font-bold shadow-lg`}
    >
      <motion.span
        key={displayCount}
        initial={{ scale: 1.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 500 }}
      >
        {displayCount}
      </motion.span>
    </motion.div>
  );
}
