"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { motion } from "framer-motion";

export default function HomePage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && user) {
      // Redirect to appropriate dashboard based on role
      switch (user.role) {
        case "super-admin":
          router.push("/admin");
          break;
        case "office-user":
          router.push("/dashboard");
          break;
        case "client":
          router.push("/dashboard");
          break;
        default:
          router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Show loading state while checking auth
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-2xl"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="w-10 h-10 bg-white/90" />
        </motion.div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
          Sarif
        </h1>
        <p className="text-slate-600 font-medium">Loading...</p>
      </motion.div>
    </div>
  );
}
