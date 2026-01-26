import { motion } from "framer-motion";

interface LoadingSkeletonProps {
  count?: number;
  type?: "card" | "table" | "stat" | "text";
}

export function LoadingSkeleton({
  count = 1,
  type = "card",
}: LoadingSkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  const shimmer = {
    background: `linear-gradient(90deg, 
      rgba(241, 245, 249, 0) 0%, 
      rgba(226, 232, 240, 0.8) 50%, 
      rgba(241, 245, 249, 0) 100%)`,
  };

  if (type === "stat") {
    return (
      <>
        {skeletons.map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl border-2 border-slate-200 p-6 relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0"
              style={shimmer}
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-slate-200 rounded-xl" />
              <div className="w-16 h-7 bg-slate-200 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="w-24 h-4 bg-slate-200 rounded" />
              <div className="w-32 h-8 bg-slate-200 rounded" />
            </div>
          </motion.div>
        ))}
      </>
    );
  }

  if (type === "table") {
    return (
      <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="w-48 h-6 bg-slate-200 rounded" />
        </div>
        <div className="divide-y divide-slate-200">
          {skeletons.map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="p-6 relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0"
                style={shimmer}
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.1,
                }}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-slate-200 rounded-lg" />
                  <div className="space-y-2">
                    <div className="w-32 h-4 bg-slate-200 rounded" />
                    <div className="w-24 h-3 bg-slate-200 rounded" />
                  </div>
                </div>
                <div className="w-20 h-4 bg-slate-200 rounded" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "text") {
    return (
      <>
        {skeletons.map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0"
              style={shimmer}
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.1,
              }}
            />
            <div className="w-full h-4 bg-slate-200 rounded" />
          </motion.div>
        ))}
      </>
    );
  }

  // Default: card type
  return (
    <>
      {skeletons.map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white rounded-2xl border-2 border-slate-200 p-6 relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0"
            style={shimmer}
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.1,
            }}
          />
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-200 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="w-3/4 h-5 bg-slate-200 rounded" />
                <div className="w-1/2 h-4 bg-slate-200 rounded" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-4 bg-slate-200 rounded" />
              <div className="w-5/6 h-4 bg-slate-200 rounded" />
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
}
