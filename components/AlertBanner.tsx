import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface AlertBannerProps {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  onClose?: () => void;
  autoClose?: number; // milliseconds
}

export function AlertBanner({
  type,
  title,
  message,
  onClose,
  autoClose,
}: AlertBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const styles = {
    success: {
      bg: "from-emerald-50 to-teal-50",
      border: "border-emerald-300",
      iconBg: "bg-emerald-500",
      text: "text-emerald-900",
      subtext: "text-emerald-700",
    },
    error: {
      bg: "from-red-50 to-rose-50",
      border: "border-red-300",
      iconBg: "bg-red-500",
      text: "text-red-900",
      subtext: "text-red-700",
    },
    warning: {
      bg: "from-amber-50 to-orange-50",
      border: "border-amber-300",
      iconBg: "bg-amber-500",
      text: "text-amber-900",
      subtext: "text-amber-700",
    },
    info: {
      bg: "from-blue-50 to-cyan-50",
      border: "border-blue-300",
      iconBg: "bg-blue-500",
      text: "text-blue-900",
      subtext: "text-blue-700",
    },
  };

  const Icon = icons[type];
  const style = styles[type];

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  if (autoClose) {
    setTimeout(handleClose, autoClose);
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={`relative bg-gradient-to-r ${style.bg} border-2 ${style.border} rounded-2xl p-4 shadow-lg overflow-hidden`}
        >
          {/* Animated background shine */}
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)",
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

          <div className="relative flex items-start gap-3">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className={`w-10 h-10 rounded-xl ${style.iconBg} flex items-center justify-center flex-shrink-0 shadow-lg`}
            >
              <Icon className="w-5 h-5 text-white" />
            </motion.div>

            <div className="flex-1 min-w-0">
              <h4 className={`font-bold ${style.text} mb-1`}>{title}</h4>
              <p className={`text-sm ${style.subtext}`}>{message}</p>
            </div>

            {onClose && (
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className={`p-1 rounded-lg hover:bg-white/50 transition-colors flex-shrink-0 ${style.text}`}
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Floating notification component
interface FloatingNotificationProps {
  title: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  avatar?: string;
  onDismiss: () => void;
}

export function FloatingNotification({
  title,
  message,
  type,
  avatar,
  onDismiss,
}: FloatingNotificationProps) {
  const styles = {
    success: "from-emerald-500 to-teal-500",
    error: "from-red-500 to-rose-500",
    warning: "from-amber-500 to-orange-500",
    info: "from-blue-500 to-cyan-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: 100 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="bg-white rounded-2xl shadow-2xl border-2 border-slate-200 p-4 max-w-sm overflow-hidden cursor-pointer"
      onClick={onDismiss}
      whileHover={{ scale: 1.02 }}
    >
      {/* Top accent bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${styles[type]}`}
      />

      <div className="flex items-start gap-3 mt-1">
        {avatar && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`w-10 h-10 rounded-full bg-gradient-to-br ${styles[type]} flex items-center justify-center text-white font-bold shadow-lg`}
          >
            {avatar}
          </motion.div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-900 mb-1">{title}</p>
          <p className="text-sm text-slate-600">{message}</p>
          <p className="text-xs text-slate-500 mt-2">Just now</p>
        </div>
      </div>
    </motion.div>
  );
}
