"use client";
import { useAuth } from "@/providers/AuthProvider";
import { ClientUserDashboard } from "@/components/ClientUserDashboard";

export default function ClientAlertsPage() {
  const { user, logout } = useAuth();
  return (
    <ClientUserDashboard
      userName={user?.name || "Client"}
      onLogout={logout}
      activeView="alerts"
    />
  );
}
