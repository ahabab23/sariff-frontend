"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { shareViaWhatsApp, buildCredentialMessage } from "@/lib/whatsapp";
import {
  LayoutDashboard,
  Building2,
  Shield,
  DollarSign,
  BarChart3,
  ScrollText,
  Server,
  Menu,
  X,
  Search,
  Bell,
  LogOut,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Ban,
  CheckCircle2,
  Key,
  Lock,
  AlertTriangle,
  AlertCircle,
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Database,
  Calendar,
  Download,
  Plus,
  Trash2,
  Edit,
  Phone,
  CreditCard,
  Wallet,
  Crown,
  ShieldCheck,
  ShieldAlert,
  History,
  Mail,
  Loader2,
} from "lucide-react";

import * as api from "@/lib/superadmin-api";
import type {
  SuperAdminDashboard as DashboardData,
  CompanyStats,
  CompanyDetail,
  SystemHealth,
  SecurityOverview,
  SecurityAlert,
  IPWhitelist,
  FinancialOverview,
  PaymentHistory,
  AnalyticsOverview,
  AuditLog,
  LoginHistory,
  SystemLog,
  PagedResult,
} from "@/lib/superadmin-api";

// ==================== TYPES ====================

type TabId =
  | "overview"
  | "companies"
  | "security"
  | "financial"
  | "analytics"
  | "audit"
  | "system";

interface ModalState {
  companyDetails: boolean;
  resetPassword: boolean;
  suspendCompany: boolean;
  updateSubscription: boolean;
  blockIP: boolean;
  addWhitelist: boolean;
  recordPayment: boolean;
  resolveAlert: boolean;
  createCompany: boolean;
  editCompany: boolean;
  logout: boolean;
}

// ==================== HELPERS ====================

const formatCurrency = (amount: number, currency = "KES") =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);

const formatNumber = (num: number) =>
  new Intl.NumberFormat("en-KE").format(num);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const formatDateTime = (date: string) =>
  new Date(date).toLocaleString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const timeAgo = (date: string) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(date);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "Trial":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "Expired":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "Suspended":
    case "Cancelled":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-slate-500/20 text-slate-400 border-slate-500/30";
  }
};

const getPlanColor = (plan: string) => {
  switch (plan) {
    case "Enterprise":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    case "Professional":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "Starter":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    default:
      return "bg-slate-500/20 text-slate-400 border-slate-500/30";
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity?.toLowerCase()) {
    case "critical":
      return "bg-red-500/20 text-red-400";
    case "warning":
      return "bg-amber-500/20 text-amber-400";
    case "info":
      return "bg-blue-500/20 text-blue-400";
    default:
      return "bg-slate-500/20 text-slate-400";
  }
};

const getLogLevelColor = (level: string) => {
  switch (level?.toLowerCase()) {
    case "error":
    case "critical":
      return "text-red-400 bg-red-500/10";
    case "warning":
      return "text-amber-400 bg-amber-500/10";
    case "info":
      return "text-blue-400 bg-blue-500/10";
    default:
      return "text-slate-400 bg-slate-500/10";
  }
};

const getHealthColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "healthy":
      return "text-emerald-400";
    case "degraded":
      return "text-amber-400";
    case "down":
      return "text-red-400";
    default:
      return "text-slate-400";
  }
};

// ==================== TAB CONFIG ====================

const TABS: { id: TabId; label: string; icon: any; color: string }[] = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    color: "from-violet-600 to-purple-700",
  },
  {
    id: "companies",
    label: "Companies",
    icon: Building2,
    color: "from-emerald-600 to-teal-700",
  },
  {
    id: "security",
    label: "Security",
    icon: Shield,
    color: "from-red-600 to-rose-700",
  },
  {
    id: "financial",
    label: "Financial",
    icon: DollarSign,
    color: "from-amber-600 to-orange-700",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    color: "from-blue-600 to-cyan-700",
  },
  {
    id: "audit",
    label: "Audit Logs",
    icon: ScrollText,
    color: "from-slate-600 to-slate-800",
  },
  {
    id: "system",
    label: "System",
    icon: Server,
    color: "from-indigo-600 to-purple-700",
  },
];

// ==================== MAIN COMPONENT ====================

// Props interface
interface SuperAdminDashboardProps {
  userName?: string;
  onLogout?: () => void;
  activeTab?: TabId;
}

export function SuperAdminDashboard({
  userName = "Super Admin",
  onLogout,
  activeTab: initialTab = "overview",
}: SuperAdminDashboardProps) {
  // Router for navigation
  const router = useRouter();

  // Navigation
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Data state
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [companies, setCompanies] = useState<PagedResult<CompanyStats> | null>(
    null,
  );
  const [selectedCompany, setSelectedCompany] = useState<CompanyDetail | null>(
    null,
  );
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [security, setSecurity] = useState<SecurityOverview | null>(null);
  const [alerts, setAlerts] = useState<PagedResult<SecurityAlert> | null>(null);
  const [whitelist, setWhitelist] = useState<IPWhitelist[]>([]);
  const [financial, setFinancial] = useState<FinancialOverview | null>(null);
  const [payments, setPayments] = useState<PagedResult<PaymentHistory> | null>(
    null,
  );
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [auditLogs, setAuditLogs] = useState<PagedResult<AuditLog> | null>(
    null,
  );
  const [loginHistory, setLoginHistory] =
    useState<PagedResult<LoginHistory> | null>(null);
  const [systemLogs, setSystemLogs] = useState<PagedResult<SystemLog> | null>(
    null,
  );

  // UI state
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination
  const [companiesPage, setCompaniesPage] = useState(1);
  const [alertsPage, setAlertsPage] = useState(1);
  const [paymentsPage, setPaymentsPage] = useState(1);
  const [auditPage, setAuditPage] = useState(1);
  const [loginPage, setLoginPage] = useState(1);
  const [systemLogsPage, setSystemLogsPage] = useState(1);

  // Filters
  const [companyStatus, setCompanyStatus] = useState("all");
  const [alertStatus, setAlertStatus] = useState("all");
  const [logLevel, setLogLevel] = useState("all");
  const [auditAction, setAuditAction] = useState("all");

  // Modals
  const [modals, setModals] = useState<ModalState>({
    companyDetails: false,
    resetPassword: false,
    suspendCompany: false,
    updateSubscription: false,
    blockIP: false,
    addWhitelist: false,
    recordPayment: false,
    resolveAlert: false,
    createCompany: false,
    editCompany: false,
    logout: false,
  });

  // Form state
  const [formData, setFormData] = useState<any>({});
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null,
  );

  // ==================== DATA FETCHING ====================

  const fetchDashboard = useCallback(async () => {
    const res = await api.getDashboard();
    if (res.success) setDashboard(res.data);
  }, []);

  const fetchCompanies = useCallback(async () => {
    const res = await api.getCompanies({
      page: companiesPage,
      pageSize: 10,
      search: searchTerm,
      status: companyStatus,
    });
    if (res.success) setCompanies(res.data);
  }, [companiesPage, searchTerm, companyStatus]);

  const fetchSystemHealth = useCallback(async () => {
    const res = await api.getSystemHealth();
    if (res.success) setSystemHealth(res.data);
  }, []);

  const fetchSecurity = useCallback(async () => {
    const [secRes, alertRes, whiteRes] = await Promise.all([
      api.getSecurityOverview(),
      api.getSecurityAlerts({
        page: alertsPage,
        pageSize: 10,
        resolved:
          alertStatus === "resolved"
            ? true
            : alertStatus === "active"
              ? false
              : undefined,
      }),
      api.getIPWhitelist(),
    ]);
    if (secRes.success) setSecurity(secRes.data);
    if (alertRes.success) setAlerts(alertRes.data);
    if (whiteRes.success) setWhitelist(whiteRes.data);
  }, [alertsPage, alertStatus]);

  const fetchFinancial = useCallback(async () => {
    const [finRes, payRes] = await Promise.all([
      api.getFinancialOverview(),
      api.getPayments({ page: paymentsPage, pageSize: 10 }),
    ]);
    if (finRes.success) setFinancial(finRes.data);
    if (payRes.success) setPayments(payRes.data);
  }, [paymentsPage]);

  const fetchAnalytics = useCallback(async () => {
    const res = await api.getAnalytics();
    if (res.success) setAnalytics(res.data);
  }, []);

  const fetchAuditLogs = useCallback(async () => {
    const [auditRes, loginRes] = await Promise.all([
      api.getAuditLogs({
        page: auditPage,
        pageSize: 15,
        action: auditAction !== "all" ? auditAction : undefined,
      }),
      api.getLoginHistory({ page: loginPage, pageSize: 10 }),
    ]);
    if (auditRes.success) setAuditLogs(auditRes.data);
    if (loginRes.success) setLoginHistory(loginRes.data);
  }, [auditPage, loginPage, auditAction]);

  const fetchSystemLogs = useCallback(async () => {
    const res = await api.getSystemLogs({
      page: systemLogsPage,
      pageSize: 20,
      level: logLevel,
    });
    if (res.success) setSystemLogs(res.data);
  }, [systemLogsPage, logLevel]);

  const refreshAll = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchDashboard(),
      activeTab === "companies" && fetchCompanies(),
      activeTab === "security" && fetchSecurity(),
      activeTab === "financial" && fetchFinancial(),
      activeTab === "analytics" && fetchAnalytics(),
      activeTab === "audit" && fetchAuditLogs(),
      activeTab === "system" &&
        Promise.all([fetchSystemHealth(), fetchSystemLogs()]),
    ]);
    setRefreshing(false);
    toast.success("Data refreshed");
  };

  // Initial load
  useEffect(() => {
    setLoading(true);
    fetchDashboard().finally(() => setLoading(false));
  }, [fetchDashboard]);

  // Collapse sidebar to icons below laptop width (more room for content tables)
  useEffect(() => {
    const applySidebarForWidth = () =>
      setSidebarOpen(window.innerWidth >= 1024);
    applySidebarForWidth();
    window.addEventListener("resize", applySidebarForWidth);
    return () => window.removeEventListener("resize", applySidebarForWidth);
  }, []);

  // Tab-specific data
  useEffect(() => {
    switch (activeTab) {
      case "companies":
        fetchCompanies();
        break;
      case "security":
        fetchSecurity();
        break;
      case "financial":
        fetchFinancial();
        break;
      case "analytics":
        fetchAnalytics();
        break;
      case "audit":
        fetchAuditLogs();
        break;
      case "system":
        fetchSystemHealth();
        fetchSystemLogs();
        break;
    }
  }, [
    activeTab,
    fetchCompanies,
    fetchSecurity,
    fetchFinancial,
    fetchAnalytics,
    fetchAuditLogs,
    fetchSystemHealth,
    fetchSystemLogs,
  ]);

  // ==================== ACTIONS ====================

  const openModal = (modal: keyof ModalState, data?: any) => {
    setFormData(data || {});
    setModals((prev) => ({ ...prev, [modal]: true }));
  };

  const closeModal = (modal: keyof ModalState) => {
    setModals((prev) => ({ ...prev, [modal]: false }));
    setFormData({});
  };

  // FIXED: Working logout with proper redirect
  const handleLogout = () => {
    // Close modal first
    closeModal("logout");

    // Clear all auth data first (regardless of onLogout)
    localStorage.removeItem("sariff_auth");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    sessionStorage.clear();

    // Show success message
    toast.success("Logged out successfully");

    // Call auth provider's logout if available
    if (onLogout) {
      try {
        onLogout();
      } catch (e) {
        console.error("onLogout failed:", e);
      }
    }

    // Force redirect after a brief delay (ensures redirect happens)
    setTimeout(() => {
      window.location.href = "/login";
    }, 150);
  };

  const viewCompanyDetails = async (id: string) => {
    const res = await api.getCompanyDetails(id);
    if (res.success) {
      setSelectedCompany(res.data);
      setSelectedCompanyId(id);
      openModal("companyDetails");
    } else {
      toast.error("Failed to load company details");
    }
  };

  const handleSuspendCompany = async () => {
    if (!selectedCompanyId || !formData.reason) {
      toast.error("Please provide a reason");
      return;
    }
    setIsSubmitting(true);
    const res = await api.suspendCompany(selectedCompanyId, formData.reason);
    setIsSubmitting(false);
    if (res.success) {
      toast.success("Company suspended");
      closeModal("suspendCompany");
      closeModal("companyDetails");
      fetchCompanies();
      fetchDashboard();
    } else {
      toast.error(res.message);
    }
  };

  const handleActivateCompany = async (id: string) => {
    const res = await api.activateCompany(id);
    if (res.success) {
      toast.success("Company activated");
      fetchCompanies();
      fetchDashboard();
      if (modals.companyDetails) viewCompanyDetails(id);
    } else {
      toast.error(res.message);
    }
  };

  const handleResetPassword = async () => {
    if (!selectedCompanyId) return;
    if (!formData.password || formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsSubmitting(true);
    const res = await api.resetPassword(selectedCompanyId, formData.password);
    setIsSubmitting(false);
    if (res.success) {
      toast.success("Password reset successfully");
      closeModal("resetPassword");
    } else {
      toast.error(res.message);
    }
  };

  // FIXED: Now includes status field
  const handleUpdateSubscription = async () => {
    if (!selectedCompanyId) return;
    setIsSubmitting(true);
    const res = await api.updateSubscription(selectedCompanyId, {
      plan: formData.plan || "Free",
      status: formData.status || "Active",
      monthlyFee: parseFloat(formData.monthlyFee) || 0,
      expiresAt: formData.expiresAt,
    });
    setIsSubmitting(false);
    if (res.success) {
      toast.success("Subscription updated");
      closeModal("updateSubscription");
      fetchCompanies();
      if (modals.companyDetails) viewCompanyDetails(selectedCompanyId);
    } else {
      toast.error(res.message);
    }
  };

  // NEW: Edit Company
  const handleEditCompany = async () => {
    if (!selectedCompanyId) return;
    setIsSubmitting(true);
    const res = await api.updateCompany(selectedCompanyId, {
      name: formData.name,
      ownerName: formData.ownerName,
      email: formData.email,
      taxId: formData.taxId,
      website: formData.website,
      address: formData.address,
    });
    setIsSubmitting(false);
    if (res.success) {
      toast.success("Company updated");
      closeModal("editCompany");
      fetchCompanies();
      if (selectedCompanyId) viewCompanyDetails(selectedCompanyId);
    } else {
      toast.error(res.message);
    }
  };

  const handleResolveAlert = async () => {
    if (!selectedAlertId) return;
    setIsSubmitting(true);
    const res = await api.resolveAlert(selectedAlertId, formData.notes);
    setIsSubmitting(false);
    if (res.success) {
      toast.success("Alert resolved");
      closeModal("resolveAlert");
      fetchSecurity();
    } else {
      toast.error(res.message);
    }
  };

  const handleBlockIP = async () => {
    if (!formData.ipAddress || !formData.reason) {
      toast.error("IP address and reason required");
      return;
    }
    setIsSubmitting(true);
    const res = await api.blockIP({
      ipAddress: formData.ipAddress,
      reason: formData.reason,
      blockUntil: formData.blockUntil,
    });
    setIsSubmitting(false);
    if (res.success) {
      toast.success("IP blocked");
      closeModal("blockIP");
      fetchSecurity();
    } else {
      toast.error(res.message);
    }
  };

  const handleAddWhitelist = async () => {
    if (!formData.ipAddress) {
      toast.error("IP address required");
      return;
    }
    setIsSubmitting(true);
    const res = await api.addIPToWhitelist({
      ipAddress: formData.ipAddress,
      description: formData.description,
    });
    setIsSubmitting(false);
    if (res.success) {
      toast.success("IP added to whitelist");
      closeModal("addWhitelist");
      fetchSecurity();
    } else {
      toast.error(res.message);
    }
  };

  const handleRemoveWhitelist = async (id: string) => {
    const res = await api.removeIPFromWhitelist(id);
    if (res.success) {
      toast.success("IP removed from whitelist");
      fetchSecurity();
    } else {
      toast.error(res.message);
    }
  };

  const handleRecordPayment = async () => {
    if (!formData.companyId || !formData.amount) {
      toast.error("Company and amount required");
      return;
    }
    setIsSubmitting(true);
    const res = await api.recordPayment({
      companyId: formData.companyId,
      amount: parseFloat(formData.amount),
      currency: formData.currency || "KES",
      paymentMethod: formData.paymentMethod || "M-Pesa",
      reference: formData.reference,
      notes: formData.notes,
    });
    setIsSubmitting(false);
    if (res.success) {
      toast.success("Payment recorded");
      closeModal("recordPayment");
      fetchFinancial();
      fetchDashboard();
    } else {
      toast.error(res.message);
    }
  };

  const handleCreateCompany = async () => {
    if (
      !formData.name ||
      !formData.ownerName ||
      !formData.whatsAppNumber ||
      !formData.password
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setIsSubmitting(true);
    const res = await api.createCompany({
      name: formData.name,
      ownerName: formData.ownerName,
      whatsAppNumber: formData.whatsAppNumber,
      email: formData.email,
      password: formData.password,
    });
    setIsSubmitting(false);
    if (res.success) {
      const companyCode = res.data?.code || "";
      closeModal("createCompany");
      fetchCompanies();
      fetchDashboard();
      // Offer to share credentials via WhatsApp
      if (formData.whatsAppNumber && formData.password) {
        toast.success("Company created successfully", {
          duration: 8000,
          action: {
            label: "📱 Share Credentials",
            onClick: () =>
              shareViaWhatsApp(
                formData.whatsAppNumber,
                buildCredentialMessage({
                  role: "office",
                  fullName: formData.ownerName,
                  code: companyCode,
                  password: formData.password,
                  companyName: formData.name,
                }),
              ),
          },
        });
      } else {
        toast.success("Company created successfully");
      }
    } else {
      toast.error(res.message);
    }
  };

  const handleExportAuditLogs = async () => {
    const blob = await api.exportAuditLogs();
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Audit logs exported");
    } else {
      toast.error("Failed to export");
    }
  };

  // ==================== RENDER ====================

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/5 transition-colors md:hidden"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">
                  SARIFF Admin
                </h1>
                <p className="text-xs text-slate-500">{userName}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshAll}
              disabled={refreshing}
              className="p-2.5 hover:bg-white/5 transition-colors"
            >
              <RefreshCw
                className={`w-5 h-5 text-slate-400 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />
            </button>
            <button className="p-2.5 hover:bg-white/5 transition-colors relative">
              <Bell className="w-5 h-5 text-slate-400" />
              {dashboard?.securityAlertsActive ? (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-[10px] text-white flex items-center justify-center font-bold">
                  {dashboard.securityAlertsActive}
                </span>
              ) : null}
            </button>
            <button
              onClick={() => openModal("logout")}
              className="p-2.5 hover:bg-red-500/10 transition-colors group"
            >
              <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-400" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "w-64" : "w-20"
          } transition-all duration-300 bg-slate-950/50 backdrop-blur-xl border-r border-white/5 min-h-[calc(100vh-73px)] sticky top-[73px] flex flex-col`}
        >
          <nav className="p-4 space-y-1 flex-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center py-3 transition-all ${
                  sidebarOpen ? "gap-3 px-4" : "justify-center px-0"
                } ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-violet-500/20`
                    : "text-slate-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <tab.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="font-medium text-sm">{tab.label}</span>
                )}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-white/5">
            <button
              onClick={() => openModal("logout")}
              className={`w-full flex items-center py-3 text-red-400 hover:bg-red-500/10 transition-all ${
                sidebarOpen ? "gap-3 px-4" : "justify-center px-0"
              }`}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <span className="font-medium text-sm">Logout</span>
              )}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-6 overflow-x-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {/* OVERVIEW TAB */}
                {activeTab === "overview" && dashboard && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">
                      Dashboard Overview
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <StatCard
                        title="Total Companies"
                        value={dashboard.totalCompanies}
                        subValue={`${dashboard.activeCompanies} active`}
                        icon={Building2}
                        trend={dashboard.companiesGrowth}
                        color="violet"
                      />
                      <StatCard
                        title="Total Users"
                        value={dashboard.totalUsers}
                        subValue={`${dashboard.activeUsersToday} active today`}
                        icon={Users}
                        trend={dashboard.usersGrowth}
                        color="blue"
                      />
                      <StatCard
                        title="Monthly Revenue"
                        value={formatCurrency(
                          dashboard.monthlyRecurringRevenue,
                        )}
                        subValue={`${formatCurrency(
                          dashboard.totalRevenue,
                        )} total`}
                        icon={DollarSign}
                        trend={dashboard.revenueGrowth}
                        color="emerald"
                      />
                      <StatCard
                        title="Monthly Volume"
                        value={formatCurrency(
                          dashboard.monthlyTransactionsVolume,
                        )}
                        subValue={`${formatNumber(
                          dashboard.monthlyTransactionsCount,
                        )} transactions`}
                        icon={Activity}
                        trend={dashboard.volumeGrowth}
                        color="amber"
                      />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="bg-white/[0.02] border border-white/5 p-6">
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                          <Server className="w-5 h-5 text-violet-400" /> System
                          Status
                        </h3>
                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className={`w-3 h-3 ${
                              dashboard.systemStatus === "Healthy"
                                ? "bg-emerald-500"
                                : dashboard.systemStatus === "Degraded"
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                            } animate-pulse`}
                          />
                          <span className="text-white text-lg font-medium">
                            {dashboard.systemStatus}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-slate-500">Errors (24h)</p>
                            <p className="text-white font-semibold text-xl">
                              {dashboard.errorsLast24h}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500">Security Alerts</p>
                            <p className="text-white font-semibold text-xl">
                              {dashboard.securityAlertsActive}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 p-6">
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-emerald-400" />{" "}
                          Company Status
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500">Active</span>
                            <span className="text-emerald-400 font-bold text-lg">
                              {dashboard.activeCompanies}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500">Trial</span>
                            <span className="text-blue-400 font-bold text-lg">
                              {dashboard.trialCompanies}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500">Expired</span>
                            <span className="text-amber-400 font-bold text-lg">
                              {dashboard.expiredCompanies}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500">Suspended</span>
                            <span className="text-red-400 font-bold text-lg">
                              {dashboard.suspendedCompanies}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 p-6">
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-amber-400" /> Top
                          by Volume
                        </h3>
                        <div className="space-y-3">
                          {dashboard.topCompaniesByVolume
                            .slice(0, 4)
                            .map((company, idx) => (
                              <div
                                key={company.id}
                                className="flex items-center gap-3"
                              >
                                <span className="w-6 h-6 bg-violet-500/20 text-violet-400 text-xs flex items-center justify-center font-bold">
                                  {idx + 1}
                                </span>
                                <span className="text-white text-sm flex-1 truncate">
                                  {company.name}
                                </span>
                                <span className="text-slate-500 text-sm">
                                  {formatCurrency(company.value)}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="bg-white/[0.02] border border-white/5 p-6">
                        <h3 className="text-white font-semibold mb-4">
                          Recent Signups
                        </h3>
                        <div className="space-y-2">
                          {dashboard.recentSignups
                            .slice(0, 5)
                            .map((company) => (
                              <div
                                key={company.id}
                                className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5"
                              >
                                <div>
                                  <p className="text-white font-medium">
                                    {company.name}
                                  </p>
                                  <p className="text-slate-500 text-sm">
                                    {company.code}
                                  </p>
                                </div>
                                <span className="text-slate-500 text-sm">
                                  {timeAgo(company.createdAt)}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 p-6">
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-amber-500" />{" "}
                          Expiring Subscriptions
                        </h3>
                        <div className="space-y-2">
                          {dashboard.expiringSubscriptions.length > 0 ? (
                            dashboard.expiringSubscriptions
                              .slice(0, 5)
                              .map((company) => (
                                <div
                                  key={company.id}
                                  className="flex items-center justify-between p-3 bg-amber-500/5 border border-amber-500/20"
                                >
                                  <div>
                                    <p className="text-white font-medium">
                                      {company.name}
                                    </p>
                                    <p className="text-amber-400 text-sm">
                                      Expires:{" "}
                                      {company.subscriptionExpiresAt
                                        ? formatDate(
                                            company.subscriptionExpiresAt,
                                          )
                                        : "N/A"}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => {
                                      setSelectedCompanyId(company.id);
                                      openModal("updateSubscription", {
                                        plan: company.subscriptionPlan,
                                        status: company.subscriptionStatus,
                                        monthlyFee: company.monthlyFee,
                                      });
                                    }}
                                    className="px-3 py-1.5 bg-amber-500 text-black text-sm font-medium hover:bg-amber-400 transition-colors"
                                  >
                                    Renew
                                  </button>
                                </div>
                              ))
                          ) : (
                            <p className="text-slate-500 text-center py-4">
                              No expiring subscriptions
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* COMPANIES TAB */}
                {activeTab === "companies" && (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <h2 className="text-2xl font-bold text-white">
                        Companies Management
                      </h2>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openModal("createCompany")}
                          className="px-4 py-2.5 bg-emerald-600 text-white font-medium hover:bg-emerald-500 flex items-center gap-2 transition-colors"
                        >
                          <Plus className="w-4 h-4" /> Create Company
                        </button>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input
                            type="text"
                            placeholder="Search companies..."
                            value={searchTerm}
                            onChange={(e: any) => {
                              setSearchTerm(e.target.value);
                              setCompaniesPage(1);
                            }}
                            className="pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 w-64"
                          />
                        </div>
                        <select
                          value={companyStatus}
                          onChange={(e: any) => {
                            setCompanyStatus(e.target.value);
                            setCompaniesPage(1);
                          }}
                          className="px-4 py-2.5 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500"
                        >
                          <option value="all">All Status</option>
                          <option value="active">Active</option>
                          <option value="trial">Trial</option>
                          <option value="expired">Expired</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </div>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 overflow-hidden">
                      <div className="overflow-x-auto max-w-full">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                              <th className="text-left px-6 py-4 text-slate-500 font-medium text-xs uppercase tracking-wider">
                                Company
                              </th>
                              <th className="text-left px-6 py-4 text-slate-500 font-medium text-xs uppercase tracking-wider">
                                Plan
                              </th>
                              <th className="text-left px-6 py-4 text-slate-500 font-medium text-xs uppercase tracking-wider">
                                Status
                              </th>
                              <th className="text-left px-6 py-4 text-slate-500 font-medium text-xs uppercase tracking-wider">
                                Users
                              </th>
                              <th className="text-left px-6 py-4 text-slate-500 font-medium text-xs uppercase tracking-wider">
                                Volume
                              </th>
                              <th className="text-left px-6 py-4 text-slate-500 font-medium text-xs uppercase tracking-wider">
                                Revenue
                              </th>
                              <th className="text-center px-6 py-4 text-slate-500 font-medium text-xs uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {companies?.items.map((company) => (
                              <tr
                                key={company.id}
                                className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                              >
                                <td className="px-6 py-4">
                                  <div>
                                    <p className="text-white font-medium">
                                      {company.name}
                                    </p>
                                    <p className="text-slate-500 text-sm">
                                      {company.code} • {company.ownerName}
                                    </p>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span
                                    className={`px-2.5 py-1 text-xs font-medium border ${getPlanColor(
                                      company.subscriptionPlan,
                                    )}`}
                                  >
                                    {company.subscriptionPlan}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span
                                    className={`px-2.5 py-1 text-xs font-medium border ${getStatusColor(
                                      company.subscriptionStatus,
                                    )}`}
                                  >
                                    {company.subscriptionStatus}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <p className="text-white">
                                    {company.totalUsers}
                                  </p>
                                  <p className="text-slate-500 text-sm">
                                    {company.totalClients} clients
                                  </p>
                                </td>
                                <td className="px-6 py-4">
                                  <p className="text-white">
                                    {formatCurrency(company.monthlyVolume)}
                                  </p>
                                  <p className="text-slate-500 text-sm">
                                    {company.monthlyTransactions} txns
                                  </p>
                                </td>
                                <td className="px-6 py-4">
                                  <p className="text-white">
                                    {formatCurrency(company.monthlyFee)}/mo
                                  </p>
                                  <p className="text-slate-500 text-sm">
                                    {formatCurrency(company.totalPaid)} paid
                                  </p>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center justify-center gap-1">
                                    <button
                                      onClick={() =>
                                        viewCompanyDetails(company.id)
                                      }
                                      className="p-2 hover:bg-violet-500/20 transition-colors"
                                      title="View"
                                    >
                                      <Eye className="w-4 h-4 text-violet-400" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSelectedCompanyId(company.id);
                                        openModal("resetPassword");
                                      }}
                                      className="p-2 hover:bg-blue-500/20 transition-colors"
                                      title="Reset Password"
                                    >
                                      <Key className="w-4 h-4 text-blue-400" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSelectedCompanyId(company.id);
                                        openModal("updateSubscription", {
                                          plan: company.subscriptionPlan,
                                          status: company.subscriptionStatus,
                                          monthlyFee: company.monthlyFee,
                                        });
                                      }}
                                      className="p-2 hover:bg-amber-500/20 transition-colors"
                                      title="Subscription"
                                    >
                                      <CreditCard className="w-4 h-4 text-amber-400" />
                                    </button>
                                    {company.isActive ? (
                                      <button
                                        onClick={() => {
                                          setSelectedCompanyId(company.id);
                                          openModal("suspendCompany");
                                        }}
                                        className="p-2 hover:bg-red-500/20 transition-colors"
                                        title="Suspend"
                                      >
                                        <Ban className="w-4 h-4 text-red-400" />
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() =>
                                          handleActivateCompany(company.id)
                                        }
                                        className="p-2 hover:bg-emerald-500/20 transition-colors"
                                        title="Activate"
                                      >
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {companies && companies.totalCount > 10 && (
                        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
                          <p className="text-slate-500 text-sm">
                            Showing {(companiesPage - 1) * 10 + 1} to{" "}
                            {Math.min(companiesPage * 10, companies.totalCount)}{" "}
                            of {companies.totalCount}
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                setCompaniesPage((p) => Math.max(1, p - 1))
                              }
                              disabled={companiesPage === 1}
                              className="p-2 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <ChevronLeft className="w-5 h-5 text-white" />
                            </button>
                            <span className="text-white px-4 font-medium">
                              {companiesPage}
                            </span>
                            <button
                              onClick={() => setCompaniesPage((p) => p + 1)}
                              disabled={
                                companiesPage * 10 >= companies.totalCount
                              }
                              className="p-2 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <ChevronRight className="w-5 h-5 text-white" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* SECURITY TAB */}
                {activeTab === "security" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">
                      Security Center
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white/[0.02] border border-white/5 p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-red-500/10">
                            <ShieldAlert className="w-5 h-5 text-red-400" />
                          </div>
                          <span className="text-slate-500 text-sm">
                            Failed Logins (24h)
                          </span>
                        </div>
                        <p className="text-3xl font-bold text-white">
                          {security?.failedLoginsLast24h || 0}
                        </p>
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-amber-500/10">
                            <Lock className="w-5 h-5 text-amber-400" />
                          </div>
                          <span className="text-slate-500 text-sm">
                            Locked Accounts
                          </span>
                        </div>
                        <p className="text-3xl font-bold text-white">
                          {security?.lockedAccounts || 0}
                        </p>
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-purple-500/10">
                            <Ban className="w-5 h-5 text-purple-400" />
                          </div>
                          <span className="text-slate-500 text-sm">
                            Blocked IPs
                          </span>
                        </div>
                        <p className="text-3xl font-bold text-white">
                          {security?.blockedIPs || 0}
                        </p>
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-blue-500/10">
                            <AlertTriangle className="w-5 h-5 text-blue-400" />
                          </div>
                          <span className="text-slate-500 text-sm">
                            Active Alerts
                          </span>
                        </div>
                        <p className="text-3xl font-bold text-white">
                          {security?.activeAlerts || 0}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white/[0.02] border border-white/5 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-white font-semibold">
                            Security Alerts
                          </h3>
                          <select
                            value={alertStatus}
                            onChange={(e: any) => {
                              setAlertStatus(e.target.value);
                              setAlertsPage(1);
                            }}
                            className="px-3 py-1.5 bg-white/5 border border-white/10 text-white text-sm"
                          >
                            <option value="all">All</option>
                            <option value="active">Active</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </div>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {alerts?.items && alerts.items.length > 0 ? (
                            alerts.items.map((alert) => (
                              <div
                                key={alert.id}
                                className={`p-4 border ${
                                  alert.isResolved
                                    ? "bg-white/[0.02] border-white/5"
                                    : "bg-red-500/5 border-red-500/20"
                                }`}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span
                                        className={`px-2 py-0.5 text-xs font-medium ${getSeverityColor(
                                          alert.severity,
                                        )}`}
                                      >
                                        {alert.severity}
                                      </span>
                                      <span className="text-slate-500 text-xs">
                                        {alert.alertType}
                                      </span>
                                    </div>
                                    <p className="text-white text-sm">
                                      {alert.message}
                                    </p>
                                    <p className="text-slate-500 text-xs mt-1">
                                      {alert.ipAddress &&
                                        `IP: ${alert.ipAddress} • `}
                                      {timeAgo(alert.createdAt)}
                                    </p>
                                  </div>
                                  {!alert.isResolved && (
                                    <button
                                      onClick={() => {
                                        setSelectedAlertId(alert.id);
                                        openModal("resolveAlert");
                                      }}
                                      className="px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 transition-colors flex-shrink-0"
                                    >
                                      Resolve
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-slate-500 text-center py-8">
                              No alerts found
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="bg-white/[0.02] border border-white/5 p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-semibold">
                              Block IP Address
                            </h3>
                            <button
                              onClick={() => openModal("blockIP")}
                              className="px-4 py-2 bg-red-600 text-white font-medium hover:bg-red-500 flex items-center gap-2 transition-colors"
                            >
                              <Plus className="w-4 h-4" /> Block IP
                            </button>
                          </div>
                          <p className="text-slate-500 text-sm">
                            Block malicious IP addresses from accessing the
                            platform.
                          </p>
                        </div>
                        <div className="bg-white/[0.02] border border-white/5 p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-semibold">
                              IP Whitelist
                            </h3>
                            <button
                              onClick={() => openModal("addWhitelist")}
                              className="px-4 py-2 bg-emerald-600 text-white font-medium hover:bg-emerald-500 flex items-center gap-2 transition-colors"
                            >
                              <Plus className="w-4 h-4" /> Add IP
                            </button>
                          </div>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {whitelist && whitelist.length > 0 ? (
                              whitelist.map((ip) => (
                                <div
                                  key={ip.id}
                                  className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5"
                                >
                                  <div>
                                    <p className="text-white font-mono text-sm">
                                      {ip.ipAddress}
                                    </p>
                                    <p className="text-slate-500 text-xs">
                                      {ip.description || "No description"}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveWhitelist(ip.id)}
                                    className="p-2 hover:bg-red-500/20 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                  </button>
                                </div>
                              ))
                            ) : (
                              <p className="text-slate-500 text-center py-4">
                                No whitelisted IPs
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {security?.recentFailedLogins &&
                      security.recentFailedLogins.length > 0 && (
                        <div className="bg-white/[0.02] border border-white/5 p-6">
                          <h3 className="text-white font-semibold mb-4">
                            Recent Failed Logins
                          </h3>
                          <div className="overflow-x-auto max-w-full">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-white/5">
                                  <th className="text-left px-4 py-3 text-slate-500 text-xs uppercase tracking-wider">
                                    Time
                                  </th>
                                  <th className="text-left px-4 py-3 text-slate-500 text-xs uppercase tracking-wider">
                                    User
                                  </th>
                                  <th className="text-left px-4 py-3 text-slate-500 text-xs uppercase tracking-wider">
                                    IP Address
                                  </th>
                                  <th className="text-left px-4 py-3 text-slate-500 text-xs uppercase tracking-wider">
                                    Reason
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {security.recentFailedLogins
                                  .slice(0, 10)
                                  .map((login) => (
                                    <tr
                                      key={login.id}
                                      className="border-b border-white/5"
                                    >
                                      <td className="px-4 py-3 text-white text-sm">
                                        {timeAgo(login.loginAt)}
                                      </td>
                                      <td className="px-4 py-3 text-white text-sm">
                                        {login.userName ||
                                          login.companyName ||
                                          "Unknown"}
                                      </td>
                                      <td className="px-4 py-3 text-slate-400 text-sm font-mono">
                                        {login.ipAddress}
                                      </td>
                                      <td className="px-4 py-3 text-red-400 text-sm">
                                        {login.failureReason ||
                                          "Invalid credentials"}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                  </div>
                )}

                {/* FINANCIAL TAB */}
                {activeTab === "financial" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-white">
                        Financial Overview
                      </h2>
                      <button
                        onClick={() => openModal("recordPayment")}
                        className="px-4 py-2.5 bg-emerald-600 text-white font-medium hover:bg-emerald-500 flex items-center gap-2 transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Record Payment
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/20 p-6">
                        <p className="text-emerald-300 text-sm mb-1">
                          Monthly Revenue
                        </p>
                        <p className="text-3xl font-bold text-white">
                          {formatCurrency(financial?.monthlyRevenue || 0)}
                        </p>
                        {financial?.revenueGrowth !== undefined && (
                          <p className="text-emerald-300 text-sm mt-2 flex items-center gap-1">
                            {financial.revenueGrowth >= 0 ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingDown className="w-4 h-4" />
                            )}
                            {financial.revenueGrowth.toFixed(1)}% vs last month
                          </p>
                        )}
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 p-6">
                        <p className="text-slate-500 text-sm mb-1">
                          Yearly Revenue
                        </p>
                        <p className="text-3xl font-bold text-white">
                          {formatCurrency(financial?.yearlyRevenue || 0)}
                        </p>
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 p-6">
                        <p className="text-slate-500 text-sm mb-1">
                          Total Revenue
                        </p>
                        <p className="text-3xl font-bold text-white">
                          {formatCurrency(financial?.totalRevenue || 0)}
                        </p>
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 p-6">
                        <p className="text-slate-500 text-sm mb-1">
                          Pending Payments
                        </p>
                        <p className="text-3xl font-bold text-amber-400">
                          {formatCurrency(financial?.pendingPayments || 0)}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white/[0.02] border border-white/5 p-6">
                        <h3 className="text-white font-semibold mb-4">
                          Revenue by Plan
                        </h3>
                        <div className="space-y-4">
                          {financial?.revenueByPlan?.map((plan) => (
                            <div key={plan.plan}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-white">{plan.plan}</span>
                                <span className="text-slate-400">
                                  {formatCurrency(plan.revenue)} (
                                  {plan.companyCount} companies)
                                </span>
                              </div>
                              <div className="h-2 bg-white/5 overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-violet-600 to-purple-600"
                                  style={{ width: `${plan.percentage}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 p-6">
                        <h3 className="text-white font-semibold mb-4">
                          Transaction Volume
                        </h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-slate-500 text-sm">
                              Total Volume
                            </p>
                            <p className="text-2xl font-bold text-white">
                              {formatCurrency(
                                financial?.totalTransactionsVolume || 0,
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-sm">
                              Monthly Volume
                            </p>
                            <p className="text-2xl font-bold text-white">
                              {formatCurrency(
                                financial?.monthlyTransactionsVolume || 0,
                              )}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-slate-500 text-sm mb-2">
                            Avg Transaction Size
                          </p>
                          <p className="text-xl font-bold text-white">
                            {formatCurrency(financial?.avgTransactionSize || 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 p-6">
                      <h3 className="text-white font-semibold mb-4">
                        Recent Payments
                      </h3>
                      <div className="overflow-x-auto max-w-full">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-white/5">
                              <th className="text-left px-4 py-3 text-slate-500 text-xs uppercase tracking-wider">
                                Date
                              </th>
                              <th className="text-left px-4 py-3 text-slate-500 text-xs uppercase tracking-wider">
                                Company
                              </th>
                              <th className="text-left px-4 py-3 text-slate-500 text-xs uppercase tracking-wider">
                                Amount
                              </th>
                              <th className="text-left px-4 py-3 text-slate-500 text-xs uppercase tracking-wider">
                                Method
                              </th>
                              <th className="text-left px-4 py-3 text-slate-500 text-xs uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {payments?.items?.map((payment) => (
                              <tr
                                key={payment.id}
                                className="border-b border-white/5"
                              >
                                <td className="px-4 py-3 text-white text-sm">
                                  {payment.paidAt
                                    ? formatDate(payment.paidAt)
                                    : "Pending"}
                                </td>
                                <td className="px-4 py-3 text-white text-sm">
                                  {payment.companyName}
                                </td>
                                <td className="px-4 py-3 text-emerald-400 text-sm font-medium">
                                  {formatCurrency(
                                    payment.amount,
                                    payment.currency,
                                  )}
                                </td>
                                <td className="px-4 py-3 text-slate-400 text-sm">
                                  {payment.paymentMethod}
                                </td>
                                <td className="px-4 py-3">
                                  <span
                                    className={`px-2 py-1 text-xs font-medium ${
                                      payment.status === "Completed"
                                        ? "bg-emerald-500/20 text-emerald-400"
                                        : "bg-amber-500/20 text-amber-400"
                                    }`}
                                  >
                                    {payment.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* ANALYTICS TAB */}
                {activeTab === "analytics" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">
                      Analytics & Insights
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white/[0.02] border border-white/5 p-6">
                        <p className="text-slate-500 text-sm mb-1">
                          Daily Active Users
                        </p>
                        <p className="text-3xl font-bold text-white">
                          {formatNumber(analytics?.dailyActiveUsers || 0)}
                        </p>
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 p-6">
                        <p className="text-slate-500 text-sm mb-1">
                          Weekly Active Users
                        </p>
                        <p className="text-3xl font-bold text-white">
                          {formatNumber(analytics?.weeklyActiveUsers || 0)}
                        </p>
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 p-6">
                        <p className="text-slate-500 text-sm mb-1">
                          Monthly Active Users
                        </p>
                        <p className="text-3xl font-bold text-white">
                          {formatNumber(analytics?.monthlyActiveUsers || 0)}
                        </p>
                      </div>
                      <div className="bg-white/[0.02] border border-white/5 p-6">
                        <p className="text-slate-500 text-sm mb-1">
                          Avg Session Duration
                        </p>
                        <p className="text-3xl font-bold text-white">
                          {Math.floor(
                            (analytics?.avgSessionDurationSeconds || 0) / 60,
                          )}
                          m
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 p-6">
                      <h3 className="text-white font-semibold mb-4">
                        Feature Usage
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {analytics?.featureUsage?.map((feature) => (
                          <div
                            key={feature.feature}
                            className="p-4 bg-white/[0.02] border border-white/5"
                          >
                            <p className="text-white font-medium">
                              {feature.feature}
                            </p>
                            <p className="text-2xl font-bold text-violet-400">
                              {formatNumber(feature.totalUses)}
                            </p>
                            <p className="text-slate-500 text-sm">
                              {feature.uniqueUsers} unique users
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* AUDIT TAB */}
                {activeTab === "audit" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-white">
                        Audit Logs
                      </h2>
                      <button
                        onClick={handleExportAuditLogs}
                        className="px-4 py-2.5 bg-violet-600 text-white font-medium hover:bg-violet-500 flex items-center gap-2 transition-colors"
                      >
                        <Download className="w-4 h-4" /> Export CSV
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={auditAction}
                        onChange={(e: any) => {
                          setAuditAction(e.target.value);
                          setAuditPage(1);
                        }}
                        className="px-4 py-2.5 bg-white/5 border border-white/10 text-white"
                      >
                        <option value="all">All Actions</option>
                        <option value="Create">Create</option>
                        <option value="Update">Update</option>
                        <option value="Delete">Delete</option>
                        <option value="Login">Login</option>
                      </select>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 overflow-hidden">
                      <div className="overflow-x-auto max-w-full">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                              <th className="text-left px-4 py-3 text-slate-500 text-xs uppercase tracking-wider">
                                Timestamp
                              </th>
                              <th className="text-left px-4 py-3 text-slate-500 text-xs uppercase tracking-wider">
                                User
                              </th>
                              <th className="text-left px-4 py-3 text-slate-500 text-xs uppercase tracking-wider">
                                Company
                              </th>
                              <th className="text-left px-4 py-3 text-slate-500 text-xs uppercase tracking-wider">
                                Action
                              </th>
                              <th className="text-left px-4 py-3 text-slate-500 text-xs uppercase tracking-wider">
                                Entity
                              </th>
                              <th className="text-left px-4 py-3 text-slate-500 text-xs uppercase tracking-wider">
                                Details
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {auditLogs?.items?.map((log) => (
                              <tr
                                key={log.id}
                                className="border-b border-white/5 hover:bg-white/[0.02]"
                              >
                                <td className="px-4 py-3 text-white text-sm">
                                  {formatDateTime(log.createdAt)}
                                </td>
                                <td className="px-4 py-3 text-white text-sm">
                                  {log.userName || "System"}
                                </td>
                                <td className="px-4 py-3 text-slate-400 text-sm">
                                  {log.companyName || "-"}
                                </td>
                                <td className="px-4 py-3">
                                  <span
                                    className={`px-2 py-1 text-xs font-medium ${
                                      log.action === "Create"
                                        ? "bg-emerald-500/20 text-emerald-400"
                                        : log.action === "Update"
                                          ? "bg-blue-500/20 text-blue-400"
                                          : log.action === "Delete"
                                            ? "bg-red-500/20 text-red-400"
                                            : "bg-slate-500/20 text-slate-400"
                                    }`}
                                  >
                                    {log.action}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-slate-400 text-sm">
                                  {log.entityType}
                                </td>
                                <td className="px-4 py-3 text-slate-400 text-sm max-w-xs truncate">
                                  {log.newValues || "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {auditLogs && auditLogs.totalCount > 15 && (
                        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
                          <p className="text-slate-500 text-sm">
                            Page {auditPage} of{" "}
                            {Math.ceil(auditLogs.totalCount / 15)}
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                setAuditPage((p) => Math.max(1, p - 1))
                              }
                              disabled={auditPage === 1}
                              className="p-2 hover:bg-white/5 disabled:opacity-30"
                            >
                              <ChevronLeft className="w-5 h-5 text-white" />
                            </button>
                            <button
                              onClick={() => setAuditPage((p) => p + 1)}
                              disabled={auditPage * 15 >= auditLogs.totalCount}
                              className="p-2 hover:bg-white/5 disabled:opacity-30"
                            >
                              <ChevronRight className="w-5 h-5 text-white" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 p-6">
                      <h3 className="text-white font-semibold mb-4">
                        Login History
                      </h3>
                      <div className="space-y-2">
                        {loginHistory?.items?.slice(0, 10).map((login) => (
                          <div
                            key={login.id}
                            className={`flex items-center justify-between p-3 ${
                              login.isSuccessful
                                ? "bg-white/[0.02] border border-white/5"
                                : "bg-red-500/5 border border-red-500/20"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {login.isSuccessful ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              ) : (
                                <X className="w-5 h-5 text-red-400" />
                              )}
                              <div>
                                <p className="text-white text-sm">
                                  {login.userName ||
                                    login.companyName ||
                                    "Unknown"}
                                </p>
                                <p className="text-slate-500 text-xs">
                                  {login.userRole} • {login.ipAddress}
                                </p>
                              </div>
                            </div>
                            <span className="text-slate-500 text-sm">
                              {timeAgo(login.loginAt)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* SYSTEM TAB */}
                {activeTab === "system" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">
                      System Health
                    </h2>
                    <div className="bg-white/[0.02] border border-white/5 p-6">
                      <div className="flex items-center gap-4 mb-6">
                        <div
                          className={`w-16 h-16 flex items-center justify-center ${
                            systemHealth?.overallStatus === "Healthy"
                              ? "bg-emerald-500/10"
                              : systemHealth?.overallStatus === "Degraded"
                                ? "bg-amber-500/10"
                                : "bg-red-500/10"
                          }`}
                        >
                          {systemHealth?.overallStatus === "Healthy" ? (
                            <ShieldCheck
                              className={`w-8 h-8 ${getHealthColor(
                                systemHealth?.overallStatus || "",
                              )}`}
                            />
                          ) : (
                            <AlertTriangle
                              className={`w-8 h-8 ${getHealthColor(
                                systemHealth?.overallStatus || "",
                              )}`}
                            />
                          )}
                        </div>
                        <div>
                          <h3
                            className={`text-2xl font-bold ${getHealthColor(
                              systemHealth?.overallStatus || "",
                            )}`}
                          >
                            {systemHealth?.overallStatus || "Unknown"}
                          </h3>
                          <p className="text-slate-500">
                            Last checked:{" "}
                            {systemHealth?.lastCheckedAt
                              ? timeAgo(systemHealth.lastCheckedAt)
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 bg-white/[0.02] border border-white/5">
                          <div className="flex items-center gap-2 mb-3">
                            <Zap className="w-5 h-5 text-blue-400" />
                            <span className="text-white font-medium">API</span>
                            <span
                              className={`ml-auto px-2 py-0.5 text-xs ${getHealthColor(
                                systemHealth?.apiStatus || "",
                              )}`}
                            >
                              {systemHealth?.apiStatus}
                            </span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-500">
                                Response Time
                              </span>
                              <span className="text-white">
                                {systemHealth?.apiResponseTimeMs}ms
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">
                                Requests/min
                              </span>
                              <span className="text-white">
                                {systemHealth?.apiRequestsPerMinute}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Error Rate</span>
                              <span
                                className={
                                  systemHealth?.apiErrorRate &&
                                  systemHealth.apiErrorRate > 1
                                    ? "text-red-400"
                                    : "text-white"
                                }
                              >
                                {systemHealth?.apiErrorRate?.toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 bg-white/[0.02] border border-white/5">
                          <div className="flex items-center gap-2 mb-3">
                            <Database className="w-5 h-5 text-violet-400" />
                            <span className="text-white font-medium">
                              Database
                            </span>
                            <span
                              className={`ml-auto px-2 py-0.5 text-xs ${getHealthColor(
                                systemHealth?.databaseStatus || "",
                              )}`}
                            >
                              {systemHealth?.databaseStatus}
                            </span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Latency</span>
                              <span className="text-white">
                                {systemHealth?.databaseLatencyMs}ms
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">
                                Connections
                              </span>
                              <span className="text-white">
                                {systemHealth?.databaseConnections}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 bg-white/[0.02] border border-white/5">
                          <div className="flex items-center gap-2 mb-3">
                            <Server className="w-5 h-5 text-emerald-400" />
                            <span className="text-white font-medium">
                              Server
                            </span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-500">CPU</span>
                              <span
                                className={
                                  systemHealth?.serverCpuUsage &&
                                  systemHealth.serverCpuUsage > 80
                                    ? "text-red-400"
                                    : "text-white"
                                }
                              >
                                {systemHealth?.serverCpuUsage}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Memory</span>
                              <span
                                className={
                                  systemHealth?.serverMemoryUsage &&
                                  systemHealth.serverMemoryUsage > 80
                                    ? "text-red-400"
                                    : "text-white"
                                }
                              >
                                {systemHealth?.serverMemoryUsage}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Disk</span>
                              <span
                                className={
                                  systemHealth?.serverDiskUsage &&
                                  systemHealth.serverDiskUsage > 80
                                    ? "text-amber-400"
                                    : "text-white"
                                }
                              >
                                {systemHealth?.serverDiskUsage}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold">
                          System Logs
                        </h3>
                        <select
                          value={logLevel}
                          onChange={(e: any) => {
                            setLogLevel(e.target.value);
                            setSystemLogsPage(1);
                          }}
                          className="px-3 py-1.5 bg-white/5 border border-white/10 text-white text-sm"
                        >
                          <option value="all">All Levels</option>
                          <option value="Error">Error</option>
                          <option value="Warning">Warning</option>
                          <option value="Info">Info</option>
                        </select>
                      </div>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {systemLogs?.items && systemLogs.items.length > 0 ? (
                          systemLogs.items.map((log) => (
                            <div
                              key={log.id}
                              className={`p-3 ${getLogLevelColor(log.level)}`}
                            >
                              <div className="flex items-start gap-3">
                                <span
                                  className={`px-2 py-0.5 text-xs font-bold uppercase ${
                                    log.level === "Error"
                                      ? "bg-red-500 text-white"
                                      : log.level === "Warning"
                                        ? "bg-amber-500 text-black"
                                        : "bg-blue-500 text-white"
                                  }`}
                                >
                                  {log.level}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-white">
                                    {log.message}
                                  </p>
                                  <p className="text-xs text-slate-500 mt-1">
                                    {log.source} • {timeAgo(log.createdAt)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-500 text-center py-8">
                            No system logs found
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>

      {/* ==================== MODALS ==================== */}

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {modals.logout && (
          <Modal onClose={() => closeModal("logout")} title="Confirm Logout">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/20">
                <div className="w-12 h-12 bg-red-500/20 flex items-center justify-center">
                  <LogOut className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <p className="font-medium text-white">
                    Are you sure you want to logout?
                  </p>
                  <p className="text-sm text-slate-400">
                    You will be redirected to the login page.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => closeModal("logout")}
                  className="flex-1 px-4 py-3 bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-3 bg-red-600 text-white font-medium hover:bg-red-500 flex items-center justify-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Company Details Modal */}
      <AnimatePresence>
        {modals.companyDetails && selectedCompany && (
          <Modal
            onClose={() => closeModal("companyDetails")}
            title={selectedCompany.name}
            size="lg"
          >
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-400">
                    {selectedCompany.code} • {selectedCompany.ownerName}
                  </p>
                  <p className="text-slate-400">
                    {selectedCompany.email} • {selectedCompany.whatsAppNumber}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span
                    className={`px-3 py-1 text-sm font-medium border ${getStatusColor(
                      selectedCompany.subscriptionStatus,
                    )}`}
                  >
                    {selectedCompany.subscriptionStatus}
                  </span>
                  <span
                    className={`px-3 py-1 text-sm font-medium border ${getPlanColor(
                      selectedCompany.subscriptionPlan,
                    )}`}
                  >
                    {selectedCompany.subscriptionPlan}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-800 text-center">
                  <p className="text-2xl font-bold text-white">
                    {selectedCompany.totalUsers}
                  </p>
                  <p className="text-sm text-slate-400">Users</p>
                </div>
                <div className="p-4 bg-slate-800 text-center">
                  <p className="text-2xl font-bold text-white">
                    {selectedCompany.totalClients}
                  </p>
                  <p className="text-sm text-slate-400">Clients</p>
                </div>
                <div className="p-4 bg-slate-800 text-center">
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(selectedCompany.monthlyVolume)}
                  </p>
                  <p className="text-sm text-slate-400">Monthly Volume</p>
                </div>
                <div className="p-4 bg-slate-800 text-center">
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(selectedCompany.totalPaid)}
                  </p>
                  <p className="text-sm text-slate-400">Total Paid</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/50">
                  <h4 className="font-medium text-white mb-2">Cash Balances</h4>
                  <p className="text-slate-300">
                    KES: {formatCurrency(selectedCompany.totalCashBalanceKES)}
                  </p>
                  <p className="text-slate-300">
                    USD:{" "}
                    {formatCurrency(selectedCompany.totalCashBalanceUSD, "USD")}
                  </p>
                </div>
                <div className="p-4 bg-slate-800/50">
                  <h4 className="font-medium text-white mb-2">Bank & M-Pesa</h4>
                  <p className="text-slate-300">
                    Bank KES:{" "}
                    {formatCurrency(selectedCompany.totalBankBalanceKES)}
                  </p>
                  <p className="text-slate-300">
                    M-Pesa: {formatCurrency(selectedCompany.totalMpesaBalance)}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    openModal("editCompany", {
                      name: selectedCompany.name,
                      ownerName: selectedCompany.ownerName,
                      email: selectedCompany.email,
                      taxId: selectedCompany.taxId,
                      website: selectedCompany.website,
                      address: selectedCompany.address,
                    });
                  }}
                  className="px-4 py-2.5 bg-violet-600 text-white font-medium hover:bg-violet-500 flex items-center gap-2 transition-colors"
                >
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => {
                    closeModal("companyDetails");
                    openModal("resetPassword");
                  }}
                  className="px-4 py-2.5 bg-blue-600 text-white font-medium hover:bg-blue-500 flex items-center gap-2 transition-colors"
                >
                  <Key className="w-4 h-4" /> Reset Password
                </button>
                <button
                  onClick={() => {
                    closeModal("companyDetails");
                    openModal("updateSubscription", {
                      plan: selectedCompany.subscriptionPlan,
                      status: selectedCompany.subscriptionStatus,
                      monthlyFee: selectedCompany.monthlyFee,
                    });
                  }}
                  className="px-4 py-2.5 bg-amber-600 text-white font-medium hover:bg-amber-500 flex items-center gap-2 transition-colors"
                >
                  <CreditCard className="w-4 h-4" /> Subscription
                </button>
                {selectedCompany.isActive ? (
                  <button
                    onClick={() => {
                      closeModal("companyDetails");
                      openModal("suspendCompany");
                    }}
                    className="px-4 py-2.5 bg-red-600 text-white font-medium hover:bg-red-500 flex items-center gap-2 transition-colors"
                  >
                    <Ban className="w-4 h-4" /> Suspend
                  </button>
                ) : (
                  <button
                    onClick={() => handleActivateCompany(selectedCompany.id)}
                    className="px-4 py-2.5 bg-emerald-600 text-white font-medium hover:bg-emerald-500 flex items-center gap-2 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Activate
                  </button>
                )}
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Edit Company Modal */}
      <AnimatePresence>
        {modals.editCompany && (
          <Modal
            onClose={() => closeModal("editCompany")}
            title="Edit Company Details"
            size="lg"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e: any) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Owner Name *
                  </label>
                  <input
                    type="text"
                    value={formData.ownerName || ""}
                    onChange={(e: any) =>
                      setFormData({ ...formData, ownerName: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e: any) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-violet-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tax ID
                  </label>
                  <input
                    type="text"
                    value={formData.taxId || ""}
                    onChange={(e: any) =>
                      setFormData({ ...formData, taxId: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website || ""}
                    onChange={(e: any) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Address
                </label>
                <textarea
                  value={formData.address || ""}
                  onChange={(e: any) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-violet-500"
                  rows={2}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => closeModal("editCompany")}
                  className="flex-1 px-4 py-3 bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditCompany}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-violet-600 text-white font-medium hover:bg-violet-500 flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  Save Changes
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Update Subscription Modal - FIXED with status field */}
      <AnimatePresence>
        {modals.updateSubscription && (
          <Modal
            onClose={() => closeModal("updateSubscription")}
            title="Update Subscription"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Plan
                </label>
                <select
                  value={formData.plan || ""}
                  onChange={(e: any) =>
                    setFormData({ ...formData, plan: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="Free">Free</option>
                  <option value="Starter">Starter</option>
                  <option value="Professional">Professional</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status || ""}
                  onChange={(e: any) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="Active">Active</option>
                  <option value="Trial">Trial</option>
                  <option value="Expired">Expired</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Monthly Fee (KES)
                </label>
                <input
                  type="number"
                  value={formData.monthlyFee || ""}
                  onChange={(e: any) =>
                    setFormData({ ...formData, monthlyFee: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-violet-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Expires At
                </label>
                <input
                  type="date"
                  value={formData.expiresAt || ""}
                  onChange={(e: any) =>
                    setFormData({ ...formData, expiresAt: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-violet-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => closeModal("updateSubscription")}
                  className="flex-1 px-4 py-3 bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateSubscription}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-violet-600 text-white font-medium hover:bg-violet-500 flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  Update
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Reset Password Modal */}
      <AnimatePresence>
        {modals.resetPassword && (
          <Modal
            onClose={() => closeModal("resetPassword")}
            title="Reset Password"
          >
            <div className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/20 p-4">
                <div className="flex gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <p className="text-sm text-amber-200">
                    This will reset the Office User's password.
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={formData.password || ""}
                  onChange={(e: any) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword || ""}
                  onChange={(e: any) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Confirm password"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => closeModal("resetPassword")}
                  className="flex-1 px-4 py-3 bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetPassword}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium hover:bg-blue-500 flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Key className="w-4 h-4" />
                  )}
                  Reset Password
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Suspend Company Modal */}
      <AnimatePresence>
        {modals.suspendCompany && (
          <Modal
            onClose={() => closeModal("suspendCompany")}
            title="Suspend Company"
          >
            <div className="space-y-4">
              <p className="text-slate-400">
                Are you sure you want to suspend this company? They will lose
                access immediately.
              </p>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Reason for suspension
                </label>
                <textarea
                  value={formData.reason || ""}
                  onChange={(e: any) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-red-500"
                  rows={3}
                  placeholder="Enter reason..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => closeModal("suspendCompany")}
                  className="flex-1 px-4 py-3 bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSuspendCompany}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-red-600 text-white font-medium hover:bg-red-500 flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Ban className="w-4 h-4" />
                  )}
                  Suspend
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Create Company Modal */}
      <AnimatePresence>
        {modals.createCompany && (
          <Modal
            onClose={() => closeModal("createCompany")}
            title="Create New Company"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e: any) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Owner Name *
                </label>
                <input
                  type="text"
                  value={formData.ownerName || ""}
                  onChange={(e: any) =>
                    setFormData({ ...formData, ownerName: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Owner name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  WhatsApp Number *
                </label>
                <input
                  type="text"
                  value={formData.whatsAppNumber || ""}
                  onChange={(e: any) =>
                    setFormData({ ...formData, whatsAppNumber: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                  placeholder="+254..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e: any) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                  placeholder="email@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  value={formData.password || ""}
                  onChange={(e: any) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Min 6 characters"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => closeModal("createCompany")}
                  className="flex-1 px-4 py-3 bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCompany}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-emerald-600 text-white font-medium hover:bg-emerald-500 flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  Create
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Block IP Modal */}
      <AnimatePresence>
        {modals.blockIP && (
          <Modal onClose={() => closeModal("blockIP")} title="Block IP Address">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  IP Address *
                </label>
                <input
                  type="text"
                  value={formData.ipAddress || ""}
                  onChange={(e: any) =>
                    setFormData({ ...formData, ipAddress: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-red-500"
                  placeholder="192.168.1.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Reason *
                </label>
                <textarea
                  value={formData.reason || ""}
                  onChange={(e: any) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-red-500"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Block Until (optional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.blockUntil || ""}
                  onChange={(e: any) =>
                    setFormData({ ...formData, blockUntil: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-red-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => closeModal("blockIP")}
                  className="flex-1 px-4 py-3 bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBlockIP}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-red-600 text-white font-medium hover:bg-red-500 flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Ban className="w-4 h-4" />
                  )}
                  Block IP
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Add Whitelist Modal */}
      <AnimatePresence>
        {modals.addWhitelist && (
          <Modal
            onClose={() => closeModal("addWhitelist")}
            title="Add IP to Whitelist"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  IP Address *
                </label>
                <input
                  type="text"
                  value={formData.ipAddress || ""}
                  onChange={(e: any) =>
                    setFormData({ ...formData, ipAddress: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                  placeholder="192.168.1.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description || ""}
                  onChange={(e: any) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Office IP"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => closeModal("addWhitelist")}
                  className="flex-1 px-4 py-3 bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddWhitelist}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-emerald-600 text-white font-medium hover:bg-emerald-500 flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  Add
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Record Payment Modal */}
      <AnimatePresence>
        {modals.recordPayment && (
          <Modal
            onClose={() => closeModal("recordPayment")}
            title="Record Payment"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Company *
                </label>
                <select
                  value={formData.companyId || ""}
                  onChange={(e: any) =>
                    setFormData({ ...formData, companyId: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Select company...</option>
                  {dashboard?.companies?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Amount *
                  </label>
                  <input
                    type="number"
                    value={formData.amount || ""}
                    onChange={(e: any) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Currency
                  </label>
                  <select
                    value={formData.currency || "KES"}
                    onChange={(e: any) =>
                      setFormData({ ...formData, currency: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="KES">KES</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Payment Method
                </label>
                <select
                  value={formData.paymentMethod || "M-Pesa"}
                  onChange={(e: any) =>
                    setFormData({ ...formData, paymentMethod: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="M-Pesa">M-Pesa</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Reference
                </label>
                <input
                  type="text"
                  value={formData.reference || ""}
                  onChange={(e: any) =>
                    setFormData({ ...formData, reference: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Transaction ref"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => closeModal("recordPayment")}
                  className="flex-1 px-4 py-3 bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRecordPayment}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-emerald-600 text-white font-medium hover:bg-emerald-500 flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <DollarSign className="w-4 h-4" />
                  )}
                  Record
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Resolve Alert Modal */}
      <AnimatePresence>
        {modals.resolveAlert && (
          <Modal
            onClose={() => closeModal("resolveAlert")}
            title="Resolve Alert"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Resolution Notes
                </label>
                <textarea
                  value={formData.notes || ""}
                  onChange={(e: any) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                  rows={3}
                  placeholder="How was this resolved..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => closeModal("resolveAlert")}
                  className="flex-1 px-4 py-3 bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResolveAlert}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-emerald-600 text-white font-medium hover:bg-emerald-500 flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  Resolve
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== SUB-COMPONENTS ====================

function StatCard({
  title,
  value,
  subValue,
  icon: Icon,
  trend,
  color,
}: {
  title: string;
  value: string | number;
  subValue?: string;
  icon: any;
  trend?: number;
  color: string;
}) {
  const colors: Record<string, string> = {
    violet: "from-violet-600/20 to-purple-600/20 border-violet-500/20",
    blue: "from-blue-600/20 to-cyan-600/20 border-blue-500/20",
    emerald: "from-emerald-600/20 to-teal-600/20 border-emerald-500/20",
    amber: "from-amber-600/20 to-orange-600/20 border-amber-500/20",
  };
  const iconColors: Record<string, string> = {
    violet: "text-violet-400",
    blue: "text-blue-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} border p-6`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-white/5">
          <Icon className={`w-5 h-5 ${iconColors[color]}`} />
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              trend >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {trend >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      {subValue && <p className="text-slate-500 text-sm mt-1">{subValue}</p>}
      <p className="text-slate-500 text-sm mt-2">{title}</p>
    </div>
  );
}

function Modal({
  onClose,
  title,
  size = "md",
  children,
}: {
  onClose: () => void;
  title: string;
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}) {
  const sizeClasses = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-2xl" };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e: any) => e.stopPropagation()}
        className={`bg-slate-900 border border-white/10 shadow-2xl w-full ${sizeClasses[size]} overflow-hidden`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/50">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </motion.div>
  );
}

export default SuperAdminDashboard;
