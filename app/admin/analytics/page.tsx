"use client";
import { useAuth } from "@/providers/AuthProvider";
import { SuperAdminDashboard } from "@/components/SuperAdminDashboard";

export default function AdminAnalyticsPage() {
  const { user, logout } = useAuth();
  return (
    <SuperAdminDashboard
      userName={user?.name || "Super Admin"}
      onLogout={logout}
      activeTab="analytics"
    />
  );
}
