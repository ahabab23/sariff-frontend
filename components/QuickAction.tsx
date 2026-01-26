import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useState } from "react";

interface QuickActionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  onClick: () => void;
  badge?: string;
}

export function QuickAction({
  icon: Icon,
  title,
  description,
  gradient,
  onClick,
  badge,
}: QuickActionProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onTapStart={() => setIsPressed(true)}
      onTap={() => setIsPressed(false)}
      onTapCancel={() => setIsPressed(false)}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.97 }}
      className="relative bg-white border-2 border-slate-200 hover:border-slate-300 rounded-2xl p-6 text-left transition-all group overflow-hidden"
    >
      {/* Background gradient on hover */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity`}
      />

      {/* Animated shine effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)",
        }}
        initial={{ x: "-100%" }}
        whileHover={{
          x: "100%",
          transition: { duration: 0.6 },
        }}
      />

      {/* Badge */}
      {badge && (
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          className="absolute top-4 right-4 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg shadow-lg"
        >
          {badge}
        </motion.div>
      )}

      <div className="relative z-10">
        <motion.div
          animate={{
            scale: isPressed ? 0.9 : 1,
            rotate: isPressed ? -5 : 0,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}
        >
          <Icon className="w-7 h-7 text-white" />
        </motion.div>

        <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-600 transition-all">
          {title}
        </h3>
        <p className="text-sm text-slate-600">{description}</p>

        {/* Arrow indicator */}
        <motion.div
          className="mt-3 flex items-center gap-1 text-sm font-medium text-slate-500 group-hover:text-slate-900"
          animate={{
            x: isPressed ? 5 : 0,
          }}
        >
          <span>Take action</span>
          <motion.svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{
              x: [0, 3, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </motion.svg>
        </motion.div>
      </div>

      {/* Bottom highlight on press */}
      <motion.div
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isPressed ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ transformOrigin: "left" }}
      />
    </motion.button>
  );
}

// Grid layout for quick actions
interface QuickActionsGridProps {
  actions: Array<{
    icon: LucideIcon;
    title: string;
    description: string;
    gradient: string;
    onClick: () => void;
    badge?: string;
  }>;
}

export function QuickActionsGrid({ actions }: QuickActionsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {actions.map((action, index) => (
        <motion.div
          key={action.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <QuickAction {...action} />
        </motion.div>
      ))}
    </div>
  );
}
