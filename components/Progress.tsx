import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ProgressStepProps {
  steps: Array<{
    title: string;
    description: string;
    completed: boolean;
  }>;
  currentStep: number;
}

export function ProgressSteps({ steps, currentStep }: ProgressStepProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const isCompleted = step.completed;
        const isCurrent = index === currentStep;
        const isUpcoming = index > currentStep;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <div className="flex items-start gap-4">
              {/* Step indicator */}
              <div className="relative">
                <motion.div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border-2 ${
                    isCompleted
                      ? "bg-gradient-to-br from-emerald-500 to-teal-500 border-emerald-500 text-white"
                      : isCurrent
                      ? "bg-gradient-to-br from-blue-500 to-cyan-500 border-blue-500 text-white"
                      : "bg-slate-100 border-slate-300 text-slate-400"
                  }`}
                  animate={{
                    scale: isCurrent ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: isCurrent ? Infinity : 0,
                  }}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <Check className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    index + 1
                  )}
                </motion.div>

                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 top-12 w-0.5 h-8 -ml-px bg-slate-200">
                    <motion.div
                      className="w-full bg-gradient-to-b from-emerald-500 to-teal-500"
                      initial={{ height: "0%" }}
                      animate={{ height: isCompleted ? "100%" : "0%" }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </div>
                )}
              </div>

              {/* Step content */}
              <div className="flex-1 pb-8">
                <motion.h4
                  className={`font-bold mb-1 ${
                    isCompleted || isCurrent
                      ? "text-slate-900"
                      : "text-slate-500"
                  }`}
                  animate={{
                    x: isCurrent ? [0, 5, 0] : 0,
                  }}
                  transition={{
                    duration: 2,
                    repeat: isCurrent ? Infinity : 0,
                  }}
                >
                  {step.title}
                </motion.h4>
                <p
                  className={`text-sm ${
                    isCompleted || isCurrent
                      ? "text-slate-600"
                      : "text-slate-400"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// Circular progress indicator
interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  gradient?: string;
}

export function CircularProgress({
  percentage,
  size = 120,
  strokeWidth = 8,
  label,
  gradient = "from-violet-500 to-purple-600",
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgb(226, 232, 240)"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradient.split(" ")[1]} />
            <stop offset="100%" stopColor={gradient.split(" ")[3]} />
          </linearGradient>
        </defs>
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.p
          className="text-3xl font-bold text-slate-900"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        >
          {percentage}%
        </motion.p>
        {label && (
          <p className="text-xs text-slate-600 mt-1 font-medium">{label}</p>
        )}
      </div>
    </div>
  );
}

// Linear progress bar
interface LinearProgressProps {
  percentage: number;
  label?: string;
  showPercentage?: boolean;
  gradient?: string;
  height?: string;
}

export function LinearProgress({
  percentage,
  label,
  showPercentage = true,
  gradient = "from-violet-500 to-purple-600",
  height = "h-3",
}: LinearProgressProps) {
  return (
    <div>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <p className="text-sm font-medium text-slate-700">{label}</p>
          )}
          {showPercentage && (
            <motion.p
              className="text-sm font-bold text-slate-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {percentage}%
            </motion.p>
          )}
        </div>
      )}

      <div
        className={`w-full bg-slate-200 rounded-full ${height} overflow-hidden relative`}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)",
          }}
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Progress bar */}
        <motion.div
          className={`${height} bg-gradient-to-r ${gradient} rounded-full relative overflow-hidden`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Glowing effect */}
          <motion.div
            className="absolute inset-0 bg-white opacity-30"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
