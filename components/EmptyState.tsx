import { motion } from "framer-motion";
import { LucideIcon, Plus, Search, Inbox, FileText } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  gradient?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  gradient = "from-slate-300 to-slate-400",
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      {/* Animated icon */}
      <div className="relative mb-6">
        {/* Pulsing background circles */}
        <motion.div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-2xl`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            width: "140px",
            height: "140px",
            left: "-20px",
            top: "-20px",
          }}
        />

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          className={`relative w-24 h-24 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-xl`}
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon className="w-12 h-12 text-white" />
          </motion.div>
        </motion.div>

        {/* Floating particles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-slate-400 rounded-full"
            style={{
              left: `${20 + i * 30}px`,
              top: `${10 + i * 20}px`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold text-slate-900 mb-2"
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-slate-600 max-w-md mb-6"
      >
        {description}
      </motion.p>

      {/* Action button */}
      {actionLabel && onAction && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${gradient} text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all`}
        >
          <Plus className="w-5 h-5" />
          <span>{actionLabel}</span>
        </motion.button>
      )}
    </motion.div>
  );
}

// No results state
interface NoResultsProps {
  searchTerm?: string;
  onClear?: () => void;
}

export function NoResults({ searchTerm, onClear }: NoResultsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <motion.div
        animate={{
          rotate: [0, -10, 10, -10, 0],
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
        className="w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center mb-6"
      >
        <Search className="w-12 h-12 text-slate-500" />
      </motion.div>

      <h3 className="text-2xl font-bold text-slate-900 mb-2">
        No results found
      </h3>

      {searchTerm && (
        <p className="text-slate-600 mb-4">
          We couldn't find anything matching{" "}
          <span className="font-semibold text-slate-900">"{searchTerm}"</span>
        </p>
      )}

      <p className="text-slate-600 mb-6">
        Try adjusting your search or filters
      </p>

      {onClear && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClear}
          className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all"
        >
          Clear search
        </motion.button>
      )}
    </motion.div>
  );
}

// Loading state
export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      {/* Animated loader */}
      <div className="relative w-24 h-24 mb-6">
        <motion.div className="absolute inset-0 rounded-full border-4 border-slate-200" />
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-500 border-r-purple-500"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-4 border-transparent border-b-violet-400 border-l-purple-400"
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <motion.h3
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="text-xl font-bold text-slate-900 mb-2"
      >
        {message}
      </motion.h3>

      {/* Loading dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-violet-500"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
