"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SuperAdminDashboard } from "../components/SuperAdminDashboard";
import { OfficeUserDashboard } from "../components/OfficeUserDashboard";
import { ClientUserDashboard } from "../components/ClientUserDashboard";
import { LoginScreen } from "../components/LoginScreen";
import { projectId, publicAnonKey } from "../utils/supabase/info";

export type UserRole = "super-admin" | "office-user" | "client" | null;

export default function HomePage() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userName, setUserName] = useState("");
  const [dataInitialized, setDataInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  // Initialize backend data on first load
  useEffect(() => {
    const initializeData = async () => {
      try {
        console.log("🔄 Attempting to initialize backend...");

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-32ed8237/initialize`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${publicAnonKey}`,
            },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(
            `Backend returned ${response.status}: ${response.statusText}`
          );
        }

        const result = await response.json();
        if (result.success) {
          console.log("✅ Backend data initialized successfully");
          setDataInitialized(true);
          setInitError(null);
        } else {
          throw new Error(result.error || "Initialization failed");
        }
      } catch (error: any) {
        console.warn("⚠️  Backend initialization failed:", error.message);
        console.log("📝 App will continue without backend initialization");

        // Set error message but still allow app to load
        if (error.name === "AbortError") {
          setInitError("Backend initialization timed out - continuing anyway");
        } else {
          setInitError(`Backend unavailable: ${error.message}`);
        }

        // Always set as initialized to allow app to load
        setDataInitialized(true);
      }
    };

    // Only initialize once
    if (!dataInitialized) {
      initializeData();
    }
  }, [dataInitialized]);

  const handleLogin = (role: UserRole, name: string) => {
    setUserRole(role);
    setUserName(name);
  };

  const handleLogout = () => {
    setUserRole(null);
    setUserName("");
  };

  return (
    <div className="relative z-10">
      {/* Show initialization warning if there was an error */}
      {initError && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-2xl">
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg shadow-lg">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <p className="font-semibold text-sm">
                  Backend Connection Issue
                </p>
                <p className="text-xs mt-1">{initError}</p>
                <p className="text-xs mt-1 text-amber-600">
                  App is running in offline mode. Some features may be limited.
                </p>
              </div>
              <button
                onClick={() => setInitError(null)}
                className="text-amber-600 hover:text-amber-800"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!userRole ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <LoginScreen onLogin={handleLogin} />
          </motion.div>
        ) : (
          <motion.div
            key={`dashboard-${userRole}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen"
          >
            {userRole === "super-admin" && (
              <SuperAdminDashboard
                userName={userName}
                onLogout={handleLogout}
              />
            )}
            {userRole === "office-user" && (
              <OfficeUserDashboard
                userName={userName}
                onLogout={handleLogout}
              />
            )}
            {userRole === "client" && (
              <ClientUserDashboard
                userName={userName}
                onLogout={handleLogout}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
