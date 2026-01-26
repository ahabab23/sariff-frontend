import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useState } from "react";

interface IconProps {
  icon: LucideIcon;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  variant?: "solid" | "gradient" | "duotone" | "outline" | "glass";
  gradient?: string;
  animated?: boolean;
  pulse?: boolean;
  bounce?: boolean;
  spin?: boolean;
  className?: string;
  glow?: boolean;
}

const sizes = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
  "2xl": "w-10 h-10",
};

export function Icon({
  icon: IconComponent,
  size = "md",
  variant = "solid",
  gradient = "from-violet-500 to-purple-600",
  animated = false,
  pulse = false,
  bounce = false,
  spin = false,
  className = "",
  glow = false,
}: IconProps) {
  const [isHovered, setIsHovered] = useState(false);

  const baseClasses = sizes[size];

  if (variant === "gradient") {
    return (
      <motion.div
        className="relative inline-flex items-center justify-center"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        animate={{
          scale: animated && isHovered ? 1.2 : 1,
          rotate: spin ? 360 : 0,
        }}
        transition={{
          scale: { type: "spring", stiffness: 400, damping: 17 },
          rotate: {
            duration: spin ? 2 : 0,
            repeat: spin ? Infinity : 0,
            ease: "linear",
          },
        }}
      >
        {glow && (
          <motion.div
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${gradient} blur-lg opacity-0`}
            animate={{
              opacity: isHovered ? 0.6 : 0,
              scale: isHovered ? 1.5 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
        )}
        <div
          className={`relative bg-gradient-to-br ${gradient} p-0.5 rounded-lg`}
        >
          <div className="bg-white dark:bg-slate-900 p-1 rounded-lg">
            <IconComponent
              className={`${baseClasses} bg-gradient-to-br ${gradient} text-transparent bg-clip-text ${className}`}
            />
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === "glass") {
    return (
      <motion.div
        className={`relative inline-flex items-center justify-center p-2 rounded-xl glass ${className}`}
        animate={{
          scale: pulse ? [1, 1.1, 1] : 1,
          y: bounce ? [0, -5, 0] : 0,
          rotate: spin ? 360 : 0,
        }}
        transition={{
          scale: { duration: 2, repeat: pulse ? Infinity : 0 },
          y: { duration: 2, repeat: bounce ? Infinity : 0 },
          rotate: {
            duration: spin ? 2 : 0,
            repeat: spin ? Infinity : 0,
            ease: "linear",
          },
        }}
      >
        <IconComponent
          className={`${baseClasses} text-violet-600 dark:text-violet-400`}
        />
      </motion.div>
    );
  }

  if (variant === "duotone") {
    return (
      <motion.div
        className="relative inline-flex"
        animate={{
          rotate: spin ? 360 : 0,
        }}
        transition={{
          rotate: {
            duration: spin ? 2 : 0,
            repeat: spin ? Infinity : 0,
            ease: "linear",
          },
        }}
      >
        <IconComponent
          className={`${baseClasses} text-violet-200 dark:text-violet-800 absolute ${className}`}
        />
        <IconComponent
          className={`${baseClasses} text-violet-600 dark:text-violet-400 ${className}`}
          strokeWidth={1.5}
        />
      </motion.div>
    );
  }

  if (variant === "outline") {
    return (
      <motion.div
        animate={{
          scale: pulse ? [1, 1.1, 1] : 1,
          y: bounce ? [0, -5, 0] : 0,
          rotate: spin ? 360 : 0,
        }}
        transition={{
          scale: { duration: 2, repeat: pulse ? Infinity : 0 },
          y: { duration: 2, repeat: bounce ? Infinity : 0 },
          rotate: {
            duration: spin ? 2 : 0,
            repeat: spin ? Infinity : 0,
            ease: "linear",
          },
        }}
      >
        <IconComponent
          className={`${baseClasses} ${className}`}
          strokeWidth={1.5}
        />
      </motion.div>
    );
  }

  // Solid variant (default)
  return (
    <motion.div
      animate={{
        scale: pulse ? [1, 1.1, 1] : 1,
        y: bounce ? [0, -5, 0] : 0,
        rotate: spin ? 360 : 0,
      }}
      transition={{
        scale: { duration: 2, repeat: pulse ? Infinity : 0 },
        y: { duration: 2, repeat: bounce ? Infinity : 0 },
        rotate: {
          duration: spin ? 2 : 0,
          repeat: spin ? Infinity : 0,
          ease: "linear",
        },
      }}
    >
      <IconComponent className={`${baseClasses} ${className}`} />
    </motion.div>
  );
}

// Icon in gradient box
interface IconBoxProps {
  icon: LucideIcon;
  gradient?: string;
  size?: "sm" | "md" | "lg" | "xl";
  rounded?: "lg" | "xl" | "2xl" | "full";
  animated?: boolean;
  className?: string;
}

const boxSizes = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
};

const iconSizesInBox = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
};

export function IconBox({
  icon: IconComponent,
  gradient = "from-violet-500 to-purple-600",
  size = "md",
  rounded = "xl",
  animated = true,
  className = "",
}: IconBoxProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`${boxSizes[size]} rounded-${rounded} bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg relative overflow-hidden ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={animated ? { scale: 1.1, rotate: 5 } : {}}
      whileTap={animated ? { scale: 0.95 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
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

      <IconComponent
        className={`${iconSizesInBox[size]} text-white relative z-10`}
      />
    </motion.div>
  );
}

// Floating icon with background
interface FloatingIconProps {
  icon: LucideIcon;
  gradient?: string;
  color?: string;
}

export function FloatingIcon({
  icon: IconComponent,
  gradient = "from-violet-500 to-purple-600",
  color,
}: FloatingIconProps) {
  return (
    <motion.div
      className="relative"
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Glow background */}
      <motion.div
        className={`absolute inset-0 rounded-full bg-gradient-to-br ${gradient} blur-xl opacity-40`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />

      {/* Icon */}
      <div
        className={`relative w-12 h-12 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
      >
        <IconComponent className="w-6 h-6 text-white" />
      </div>
    </motion.div>
  );
}

// Icon with notification badge
interface IconWithBadgeProps {
  icon: LucideIcon;
  count?: number;
  color?: string;
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
}

export function IconWithBadge({
  icon: IconComponent,
  count = 0,
  color = "bg-red-500",
  size = "md",
  pulse = true,
}: IconWithBadgeProps) {
  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-7 h-7",
  };

  return (
    <div className="relative inline-flex">
      <IconComponent
        className={`${iconSizes[size]} text-slate-600 dark:text-slate-400`}
      />

      {count > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] ${color} rounded-full flex items-center justify-center px-1`}
        >
          <span className="text-[10px] font-bold text-white">
            {count > 99 ? "99+" : count}
          </span>

          {pulse && (
            <motion.div
              className={`absolute inset-0 ${color} rounded-full`}
              animate={{
                scale: [1, 1.5, 1.5],
                opacity: [0.5, 0, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          )}
        </motion.div>
      )}
    </div>
  );
}

// Animated icon button
interface IconButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "gradient";
  gradient?: string;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  tooltip?: string;
}

export function IconButton({
  icon: IconComponent,
  onClick,
  variant = "secondary",
  gradient = "from-violet-500 to-purple-600",
  size = "md",
  loading = false,
  disabled = false,
  tooltip,
}: IconButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const buttonSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const variants = {
    primary: "bg-violet-600 hover:bg-violet-700 text-white",
    secondary:
      "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300",
    ghost:
      "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400",
    gradient: `bg-gradient-to-br ${gradient} text-white hover:shadow-lg`,
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${buttonSizes[size]} rounded-xl ${variants[variant]} flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden`}
      title={tooltip}
    >
      {/* Ripple effect */}
      {isHovered && !disabled && (
        <motion.div
          className="absolute inset-0 bg-white/20"
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}

      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={`${iconSizes[size]} border-2 border-current border-t-transparent rounded-full`}
        />
      ) : (
        <IconComponent className={iconSizes[size]} />
      )}
    </motion.button>
  );
}
