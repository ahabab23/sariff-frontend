import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Zap,
  Users,
  FileText,
  TrendingUp,
  Send,
  Download,
} from "lucide-react";
import { toast } from "sonner";

interface FABAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
}

interface FloatingActionButtonProps {
  actions: FABAction[];
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

export function FloatingActionButton({
  actions,
  position = "bottom-right",
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const positions = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-20 right-6",
    "top-left": "top-20 left-6",
  };

  return (
    <div className={`fixed ${positions[position]} z-40`}>
      {/* Action Buttons */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="flex flex-col gap-3 mb-4"
          >
            {actions.map((action, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{
                  scale: 1.1,
                  x: position.includes("right") ? -5 : 5,
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
                className="group flex items-center gap-3"
              >
                {/* Label */}
                <motion.span
                  className={`px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl shadow-lg text-sm font-medium whitespace-nowrap border-2 border-slate-200 dark:border-slate-700 ${
                    position.includes("left") ? "order-2" : "order-1"
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  {action.label}
                </motion.span>

                {/* Icon Button */}
                <div
                  className={`w-12 h-12 rounded-full ${
                    action.color ||
                    "bg-gradient-to-br from-violet-500 to-purple-600"
                  } flex items-center justify-center shadow-lg text-white ${
                    position.includes("left") ? "order-1" : "order-2"
                  }`}
                >
                  {action.icon}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 shadow-2xl flex items-center justify-center text-white relative overflow-hidden group"
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
          animate={{
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />

        {/* Icon with rotation */}
        <motion.div
          animate={{
            rotate: isOpen ? 45 : 0,
          }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          {isOpen ? <X className="w-7 h-7" /> : <Plus className="w-7 h-7" />}
        </motion.div>

        {/* Pulse rings */}
        {!isOpen && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-violet-400"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-purple-400"
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.3,
              }}
            />
          </>
        )}
      </motion.button>
    </div>
  );
}

// Pre-configured FAB for Office Users
export function OfficeUserFAB({
  onNewTransaction,
}: {
  onNewTransaction: () => void;
}) {
  const actions: FABAction[] = [
    {
      icon: <Zap className="w-5 h-5" />,
      label: "Quick Transaction",
      onClick: onNewTransaction,
      color: "bg-gradient-to-br from-emerald-500 to-teal-600",
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Add Client",
      onClick: () => toast.success("Opening new client form..."),
      color: "bg-gradient-to-br from-blue-500 to-cyan-600",
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: "Create Invoice",
      onClick: () => toast.success("Opening invoice creator..."),
      color: "bg-gradient-to-br from-amber-500 to-orange-600",
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Reconciliation",
      onClick: () => toast.info("Opening reconciliation..."),
      color: "bg-gradient-to-br from-violet-500 to-purple-600",
    },
  ];

  return <FloatingActionButton actions={actions} />;
}

// Speed Dial variant
export function SpeedDial({ actions }: { actions: FABAction[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-20 right-0 flex flex-col gap-2"
          >
            {actions.map((action, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 group"
              >
                <span className="px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {action.label}
                </span>
                <div
                  className={`w-12 h-12 rounded-full ${
                    action.color || "bg-violet-500"
                  } flex items-center justify-center shadow-lg text-white`}
                >
                  {action.icon}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 shadow-xl flex items-center justify-center text-white"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Plus className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </div>
  );
}
