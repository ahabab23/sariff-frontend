"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard,
  FileText,
  Bell,
  LogOut,
  Wallet,
  DollarSign,
  ArrowUpCircle,
  ArrowDownCircle,
  Download,
  Printer,
  Filter,
  Menu,
  X,
  Search,
  Calendar,
  TrendingUp,
  Eye,
  Share2,
  MessageCircle,
  RefreshCw,
  PieChart,
  BarChart3,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Settings,
  User,
  FileDown,
  Copy,
  Zap,
  Shield,
  Star,
  Target,
  Sparkles,
  Globe,
  ChevronRight,
  ExternalLink,
  Lock,
  CircleDollarSign,
  Banknote,
  Receipt,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartPieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { ClientStatCard } from "./ClientStatCard";

// Import API functions and types
import {
  getClientDashboard,
  getClientTransactions,
  getClientAnalytics,
  getClientAlerts,
  markAlertAsRead,
  markAllAlertsAsRead,
  downloadTransactionReceipt,
  exportTransactionsCsv,
  downloadStatementPdf,
  changeClientPassword,
  updateClientProfile,
  getStoredAuth,
  Currency,
  TransactionType,
  ReconciliationStatus,
  ClientType,
  ClientDashboardDto,
  ClientTransactionDto,
  ClientAlertDto,
  ClientAnalyticsDto,
  ClientProfileDto,
  QuickStatsDto,
  PortalTransactionFilters,
  ChangePasswordDto,
  PagedResult,
} from "@/lib/api";

interface ClientUserDashboardProps {
  userName: string;
  onLogout: () => void;
}

type ClientView =
  | "dashboard"
  | "statements"
  | "alerts"
  | "analytics"
  | "profile";

// ============ HELPER FUNCTIONS ============

const formatCurrency = (amount: number, currency: Currency): string => {
  const symbol = currency === Currency.KES ? "KES" : "USD";
  return `${symbol} ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusBadgeClass = (status: ReconciliationStatus): string => {
  switch (status) {
    case ReconciliationStatus.Matched:
      return "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-300";
    case ReconciliationStatus.Pending:
      return "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-300";
    case ReconciliationStatus.Unmatched:
      return "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-300";
    default:
      return "bg-slate-100 text-slate-700 border-slate-300";
  }
};

const getStatusLabel = (status: ReconciliationStatus): string => {
  switch (status) {
    case ReconciliationStatus.Matched:
      return "Completed";
    case ReconciliationStatus.Pending:
      return "Pending";
    case ReconciliationStatus.Unmatched:
      return "Unmatched";
    default:
      return "Unknown";
  }
};

const getAlertIcon = (type: string) => {
  switch (type) {
    case "success":
      return CheckCircle;
    case "warning":
      return AlertCircle;
    case "error":
      return AlertCircle;
    default:
      return Info;
  }
};

const getAlertGradient = (type: string): string => {
  switch (type) {
    case "success":
      return "from-emerald-500 to-teal-500";
    case "warning":
      return "from-amber-500 to-orange-500";
    case "error":
      return "from-red-500 to-rose-500";
    default:
      return "from-blue-500 to-cyan-500";
  }
};

const getAlertBorderClass = (type: string): string => {
  switch (type) {
    case "success":
      return "border-emerald-300 hover:border-emerald-400";
    case "warning":
      return "border-amber-300 hover:border-amber-400";
    case "error":
      return "border-red-300 hover:border-red-400";
    default:
      return "border-blue-300 hover:border-blue-400";
  }
};

const getClientTypeLabel = (type: ClientType): string => {
  return type === ClientType.Permanent ? "Premium Client" : "Standard Client";
};

// ============ MAIN COMPONENT ============

export function ClientUserDashboard({
  userName,
  onLogout,
}: ClientUserDashboardProps) {
  // View State
  const [activeView, setActiveView] = useState<ClientView>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data State
  const [dashboard, setDashboard] = useState<ClientDashboardDto | null>(null);
  const [profile, setProfile] = useState<ClientProfileDto | null>(null);
  const [quickStats, setQuickStats] = useState<QuickStatsDto | null>(null);
  const [transactions, setTransactions] = useState<ClientTransactionDto[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<
    ClientTransactionDto[]
  >([]);
  const [alerts, setAlerts] = useState<ClientAlertDto[]>([]);
  const [analytics, setAnalytics] = useState<ClientAnalyticsDto | null>(null);

  // Loading & Error State
  const [loading, setLoading] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [loadingAlerts, setLoadingAlerts] = useState(false);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;

  // Filter State
  const [currencyFilter, setCurrencyFilter] = useState<Currency | undefined>(
    undefined,
  );
  const [typeFilter, setTypeFilter] = useState<TransactionType | undefined>(
    undefined,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("all");

  // Alert Pagination
  const [alertPage, setAlertPage] = useState(1);
  const [alertTotalPages, setAlertTotalPages] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);

  // Modal State
  const [selectedTransaction, setSelectedTransaction] =
    useState<ClientTransactionDto | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<ClientAlertDto | null>(
    null,
  );
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState<ChangePasswordDto>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Menu Items
  const menuItems = [
    {
      id: "dashboard" as ClientView,
      label: "Dashboard",
      icon: LayoutDashboard,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "statements" as ClientView,
      label: "Statements",
      icon: FileText,
      gradient: "from-violet-500 to-purple-500",
    },
    {
      id: "alerts" as ClientView,
      label: "Alerts",
      icon: Bell,
      gradient: "from-amber-500 to-orange-500",
      badge: quickStats?.unreadAlerts,
    },
    {
      id: "analytics" as ClientView,
      label: "Analytics",
      icon: PieChart,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      id: "profile" as ClientView,
      label: "Profile",
      icon: User,
      gradient: "from-pink-500 to-rose-500",
    },
  ];

  // ============ DATA FETCHING ============

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getClientDashboard();
      if (result.success && result.data) {
        setDashboard(result.data);
        setProfile(result.data.profile);
        setQuickStats(result.data.quickStats);
        setRecentTransactions(result.data.recentTransactions);
        setAlerts(result.data.recentAlerts);
      } else {
        setError(result.message || "Failed to load dashboard");
        toast.error(result.message || "Failed to load dashboard");
      }
    } catch (err) {
      setError("Failed to load dashboard");
      toast.error("Failed to load dashboard");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoadingTransactions(true);
      const filters: Partial<PortalTransactionFilters> = {};

      if (currencyFilter !== undefined) filters.currency = currencyFilter;
      if (typeFilter !== undefined) filters.type = typeFilter;
      if (searchQuery) filters.search = searchQuery;

      // Date filters based on period
      if (filterPeriod === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filters.startDate = weekAgo.toISOString().split("T")[0];
      } else if (filterPeriod === "month") {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        filters.startDate = monthAgo.toISOString().split("T")[0];
      }

      const result = await getClientTransactions(
        currentPage,
        pageSize,
        filters,
      );
      if (result.success && result.data) {
        setTransactions(result.data.items);
        setTotalCount(result.data.totalCount);
        setTotalPages(Math.ceil(result.data.totalCount / pageSize));
      }
    } catch (err) {
      console.error("Failed to fetch transactions", err);
      toast.error("Failed to fetch transactions");
    } finally {
      setLoadingTransactions(false);
    }
  }, [currentPage, currencyFilter, typeFilter, searchQuery, filterPeriod]);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoadingAlerts(true);
      const result = await getClientAlerts(alertPage, 20, unreadOnly);
      if (result.success && result.data) {
        setAlerts(result.data.items);
        setAlertTotalPages(Math.ceil(result.data.totalCount / 20));
      }
    } catch (err) {
      console.error("Failed to fetch alerts", err);
    } finally {
      setLoadingAlerts(false);
    }
  }, [alertPage, unreadOnly]);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoadingAnalytics(true);
      const result = await getClientAnalytics(6);
      if (result.success && result.data) {
        setAnalytics(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch analytics", err);
    } finally {
      setLoadingAnalytics(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Fetch transactions when filters change
  useEffect(() => {
    if (activeView === "statements") {
      fetchTransactions();
    }
  }, [activeView, fetchTransactions]);

  // Fetch alerts when viewing alerts
  useEffect(() => {
    if (activeView === "alerts") {
      fetchAlerts();
    }
  }, [activeView, fetchAlerts]);

  // Fetch analytics when viewing analytics
  useEffect(() => {
    if (activeView === "analytics") {
      fetchAnalytics();
    }
  }, [activeView, fetchAnalytics]);

  // ============ ACTIONS ============

  const handleRefresh = async () => {
    toast.info("Refreshing data...");
    await fetchDashboard();
    if (activeView === "statements") await fetchTransactions();
    if (activeView === "alerts") await fetchAlerts();
    if (activeView === "analytics") await fetchAnalytics();
    toast.success("Data refreshed!");
  };

  const handleMarkAlertRead = async (alertId: string) => {
    try {
      const result = await markAlertAsRead(alertId);
      if (result.success) {
        setAlerts((prev) =>
          prev.map((a) => (a.id === alertId ? { ...a, isRead: true } : a)),
        );
        if (quickStats) {
          setQuickStats({
            ...quickStats,
            unreadAlerts: quickStats.unreadAlerts - 1,
          });
        }
        toast.success("Alert marked as read");
      }
    } catch (err) {
      toast.error("Failed to mark alert as read");
    }
  };

  const handleMarkAllAlertsRead = async () => {
    try {
      const result = await markAllAlertsAsRead();
      if (result.success) {
        setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
        if (quickStats) {
          setQuickStats({ ...quickStats, unreadAlerts: 0 });
        }
        toast.success("All alerts marked as read");
      }
    } catch (err) {
      toast.error("Failed to mark alerts as read");
    }
  };

  const handleDownloadReceipt = async (transactionId: string, code: string) => {
    try {
      toast.info("Downloading receipt...");
      const blob = await downloadTransactionReceipt(transactionId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${code}.txt`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Receipt downloaded!");
    } catch (err) {
      toast.error("Failed to download receipt");
    }
  };

  const handleExportCsv = async () => {
    try {
      toast.info("Exporting transactions...");
      const blob = await exportTransactionsCsv();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("CSV exported!");
    } catch (err) {
      toast.error("Failed to export CSV");
    }
  };

  const handleDownloadStatement = () => {
    if (!profile) {
      toast.error("Profile data not loaded");
      return;
    }

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Get company info
      const auth = getStoredAuth();
      const companyName = auth?.user?.companyName || "Money Exchange";

      // Safe profile data
      const clientName = profile.fullName || userName || "Client";
      const clientCode = profile.code || "N/A";
      const clientPhone = profile.whatsAppNumber || "N/A";
      const clientEmail = profile.email || "N/A";
      const kesBalance = profile.balanceKES ?? 0;
      const usdBalance = profile.balanceUSD ?? 0;

      // ========== CORPORATE HEADER ==========
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, pageWidth, 4, "F");

      doc.setFillColor(250, 250, 250);
      doc.rect(0, 4, pageWidth, 36, "F");

      doc.setFillColor(37, 99, 235);
      doc.rect(14, 10, 24, 24, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(companyName.charAt(0).toUpperCase(), 26, 26, {
        align: "center",
      });

      doc.setTextColor(17, 24, 39);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(companyName, 44, 18);

      doc.setTextColor(107, 114, 128);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("Client Account Statement", 44, 26);

      doc.setTextColor(107, 114, 128);
      doc.setFontSize(8);
      doc.text("Statement Date", pageWidth - 14, 14, { align: "right" });
      doc.setTextColor(17, 24, 39);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(
        new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
        pageWidth - 14,
        21,
        { align: "right" },
      );

      doc.setTextColor(107, 114, 128);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("Account Reference", pageWidth - 14, 28, { align: "right" });
      doc.setTextColor(17, 24, 39);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(clientCode, pageWidth - 14, 35, { align: "right" });

      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.5);
      doc.line(14, 42, pageWidth - 14, 42);

      // ========== CLIENT INFORMATION ==========
      let yPos = 50;

      doc.setTextColor(17, 24, 39);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("ACCOUNT HOLDER", 14, yPos);

      yPos += 6;
      doc.setFillColor(249, 250, 251);
      doc.rect(14, yPos, pageWidth - 28, 28, "F");

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(17, 24, 39);
      doc.text(clientName, 18, yPos + 8);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(107, 114, 128);
      doc.text(`Phone: ${clientPhone}`, 18, yPos + 15);
      doc.text(`Email: ${clientEmail}`, 18, yPos + 21);

      // ========== ACCOUNT BALANCES ==========
      yPos += 36;
      doc.setTextColor(17, 24, 39);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("ACCOUNT BALANCES", 14, yPos);

      yPos += 6;
      const balanceWidth = (pageWidth - 32) / 2;

      // KES Balance Box
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.5);
      doc.rect(14, yPos, balanceWidth, 22, "S");

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(107, 114, 128);
      doc.text("Kenyan Shilling (KES)", 18, yPos + 7);

      const kesPositive = kesBalance >= 0;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(
        kesPositive ? 22 : 185,
        kesPositive ? 163 : 28,
        kesPositive ? 74 : 28,
      );
      doc.text(
        `${kesPositive ? "" : "-"}KES ${Math.abs(kesBalance).toLocaleString()}`,
        18,
        yPos + 16,
      );

      // USD Balance Box
      doc.rect(18 + balanceWidth, yPos, balanceWidth, 22, "S");

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(107, 114, 128);
      doc.text("US Dollar (USD)", 22 + balanceWidth, yPos + 7);

      const usdPositive = usdBalance >= 0;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(
        usdPositive ? 22 : 185,
        usdPositive ? 163 : 28,
        usdPositive ? 74 : 28,
      );
      doc.text(
        `${usdPositive ? "" : "-"}USD ${Math.abs(usdBalance).toLocaleString()}`,
        22 + balanceWidth,
        yPos + 16,
      );

      // ========== TRANSACTION HISTORY ==========
      if (transactions && transactions.length > 0) {
        yPos += 32;
        doc.setTextColor(17, 24, 39);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("TRANSACTION HISTORY", 14, yPos);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(107, 114, 128);
        doc.setFontSize(9);
        doc.text(`${transactions.length} transactions`, pageWidth - 14, yPos, {
          align: "right",
        });

        const txnTableData = transactions.slice(0, 50).map((txn) => {
          const isCredit = txn.type === TransactionType.Credit;
          const currency = txn.currency === Currency.KES ? "KES" : "USD";
          const runningBalance = txn.balanceAfter ?? 0;
          const desc = txn.description || "";
          const dateStr = txn.date || new Date().toISOString();

          return [
            new Date(dateStr).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "2-digit",
            }),
            txn.reference || txn.code || "-",
            desc.substring(0, 28) + (desc.length > 28 ? "..." : ""),
            isCredit ? "CR" : "DR",
            currency,
            (txn.amount ?? 0).toLocaleString(),
            `${runningBalance >= 0 ? "" : "-"}${Math.abs(
              runningBalance,
            ).toLocaleString()}`,
          ];
        });

        autoTable(doc, {
          startY: yPos + 4,
          head: [
            [
              "Date",
              "Reference",
              "Description",
              "Type",
              "Curr",
              "Amount",
              "Balance",
            ],
          ],
          body: txnTableData,
          theme: "plain",
          styles: { fontSize: 8, cellPadding: 3 },
          headStyles: {
            fillColor: [249, 250, 251],
            textColor: [75, 85, 99],
            fontStyle: "bold",
            lineWidth: 0.1,
            lineColor: [229, 231, 235],
          },
          bodyStyles: { lineWidth: 0.1, lineColor: [243, 244, 246] },
          columnStyles: {
            0: { cellWidth: 22 },
            1: { cellWidth: 26 },
            2: { cellWidth: 48 },
            3: { cellWidth: 12, halign: "center" },
            4: { cellWidth: 14, halign: "center" },
            5: { cellWidth: 26, halign: "right" },
            6: { cellWidth: 28, halign: "right" },
          },
          alternateRowStyles: { fillColor: [249, 250, 251] },
          margin: { left: 14, right: 14 },
          didParseCell: (data: any) => {
            if (data.section === "body" && data.column.index === 3) {
              data.cell.styles.textColor =
                data.cell.raw === "CR" ? [22, 163, 74] : [220, 38, 38];
              data.cell.styles.fontStyle = "bold";
            }
            if (data.section === "body" && data.column.index === 6) {
              const cellVal = String(data.cell.raw || "");
              const isNegative = cellVal.startsWith("-");
              data.cell.styles.textColor = isNegative
                ? [185, 28, 28]
                : [22, 163, 74];
              data.cell.styles.fontStyle = "bold";
            }
          },
          didDrawPage: (data: any) => {
            doc.setDrawColor(229, 231, 235);
            doc.line(14, pageHeight - 20, pageWidth - 14, pageHeight - 20);
            doc.setFontSize(7);
            doc.setTextColor(156, 163, 175);
            doc.text(companyName, 14, pageHeight - 12);
            doc.text(
              `Page ${data.pageNumber}`,
              pageWidth / 2,
              pageHeight - 12,
              { align: "center" },
            );
            doc.text(
              "Computer-generated statement",
              pageWidth - 14,
              pageHeight - 12,
              { align: "right" },
            );
          },
        });
      }

      const fileName = `${companyName.replace(
        /\s+/g,
        "_",
      )}_Statement_${clientCode}_${new Date().toISOString().split("T")[0]}.pdf`;
      doc.save(fileName);
      toast.success("Statement exported successfully!");
    } catch (error) {
      console.error("Error generating statement PDF:", error);
      toast.error("Failed to generate statement PDF");
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setPasswordLoading(true);
      const result = await changeClientPassword(passwordForm);
      if (result.success) {
        toast.success("Password changed successfully!");
        setShowPasswordModal(false);
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(result.message || "Failed to change password");
      }
    } catch (err) {
      toast.error("Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePrintStatement = () => {
    if (!profile) {
      toast.error("Profile data not loaded");
      return;
    }

    const auth = getStoredAuth();
    const companyName = auth?.user?.companyName || "Money Exchange";
    const clientName = profile.fullName || userName || "Client";
    const clientCode = profile.code || "N/A";
    const clientPhone = profile.phoneNumber || "N/A";
    const clientEmail = profile.email || "N/A";
    const kesBalance = profile.balanceKES ?? 0;
    const usdBalance = profile.balanceUSD ?? 0;

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Account Statement - ${clientName}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #111827; font-size: 12px; }
          .header { border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 20px; }
          .header-top { display: flex; justify-content: space-between; align-items: flex-start; }
          .company-name { font-size: 24px; font-weight: bold; color: #111827; }
          .doc-title { color: #6b7280; font-size: 14px; margin-top: 4px; }
          .doc-info { text-align: right; }
          .doc-info label { color: #6b7280; font-size: 10px; display: block; }
          .doc-info span { font-weight: bold; color: #111827; }
          .client-box { background: #f9fafb; padding: 16px; margin-bottom: 20px; }
          .client-name { font-size: 16px; font-weight: bold; margin-bottom: 8px; }
          .client-details { color: #6b7280; }
          .summary-row { display: flex; gap: 16px; margin-bottom: 20px; }
          .summary-card { flex: 1; border: 1px solid #e5e7eb; padding: 12px; }
          .summary-card label { color: #6b7280; font-size: 10px; display: block; margin-bottom: 4px; }
          .summary-card .value { font-size: 16px; font-weight: bold; }
          .positive { color: #16a34a; }
          .negative { color: #dc2626; }
          table { width: 100%; border-collapse: collapse; }
          th { background: #f9fafb; color: #4b5563; font-weight: 600; text-align: left; padding: 10px 8px; border-bottom: 1px solid #e5e7eb; }
          td { padding: 10px 8px; border-bottom: 1px solid #f3f4f6; }
          tr:nth-child(even) { background: #f9fafb; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .cr { color: #16a34a; font-weight: 600; }
          .dr { color: #dc2626; font-weight: 600; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 10px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-top">
            <div>
              <div class="company-name">${companyName}</div>
              <div class="doc-title">Client Account Statement</div>
            </div>
            <div class="doc-info">
              <label>Statement Date</label>
              <span>${new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}</span>
              <br/><br/>
              <label>Account Reference</label>
              <span>${clientCode}</span>
            </div>
          </div>
        </div>

        <div class="client-box">
          <div class="client-name">${clientName}</div>
          <div class="client-details">
            Phone: ${clientPhone} | Email: ${clientEmail}
          </div>
        </div>

        <div class="summary-row">
          <div class="summary-card">
            <label>KES Balance</label>
            <div class="value ${kesBalance >= 0 ? "positive" : "negative"}">${
              kesBalance >= 0 ? "" : "-"
            }KES ${Math.abs(kesBalance).toLocaleString()}</div>
          </div>
          <div class="summary-card">
            <label>USD Balance</label>
            <div class="value ${usdBalance >= 0 ? "positive" : "negative"}">${
              usdBalance >= 0 ? "" : "-"
            }USD ${Math.abs(usdBalance).toLocaleString()}</div>
          </div>
        </div>

        <h3 style="margin-bottom: 10px;">Transaction History</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Reference</th>
              <th>Description</th>
              <th class="text-center">Type</th>
              <th class="text-center">Currency</th>
              <th class="text-right">Amount</th>
              <th class="text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            ${transactions
              .slice(0, 50)
              .map((txn) => {
                const isCredit = txn.type === TransactionType.Credit;
                const currency = txn.currency === Currency.KES ? "KES" : "USD";
                const bal = txn.balanceAfter ?? 0;
                return `
              <tr>
                <td>${new Date(txn.date || new Date()).toLocaleDateString(
                  "en-GB",
                  { day: "2-digit", month: "short", year: "2-digit" },
                )}</td>
                <td>${txn.reference || txn.code || "-"}</td>
                <td>${(txn.description || "").substring(0, 35)}${
                  (txn.description || "").length > 35 ? "..." : ""
                }</td>
                <td class="text-center ${isCredit ? "cr" : "dr"}">${
                  isCredit ? "CR" : "DR"
                }</td>
                <td class="text-center">${currency}</td>
                <td class="text-right">${(
                  txn.amount ?? 0
                ).toLocaleString()}</td>
                <td class="text-right ${bal >= 0 ? "positive" : "negative"}">${
                  bal >= 0 ? "" : "-"
                }${Math.abs(bal).toLocaleString()}</td>
              </tr>
            `;
              })
              .join("")}
          </tbody>
        </table>

        <div class="footer">
          <p>This is a computer-generated statement and does not require a signature.</p>
          <p>${companyName} • Generated on ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 250);
    }
    toast.success("Print preview opened!");
  };

  const handleShareStatement = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Share link copied to clipboard!");
  };

  const handleContactSupport = () => {
    window.open("https://wa.me/254700000000", "_blank");
    toast.info("Opening WhatsApp support...");
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [currencyFilter, typeFilter, searchQuery, filterPeriod]);

  // ============ COMPUTED VALUES ============

  const balanceCards = profile
    ? [
        {
          label: "KES Balance",
          value: formatCurrency(profile.balanceKES, Currency.KES),
          change: profile.totalInKES > profile.totalOutKES ? "+ve" : "-ve",
          trend: (profile.totalInKES > profile.totalOutKES ? "up" : "down") as
            | "up"
            | "down",
          icon: Banknote,
          gradient: "from-emerald-500 to-teal-500",
        },
        {
          label: "USD Balance",
          value: formatCurrency(profile.balanceUSD, Currency.USD),
          change: profile.totalInUSD > profile.totalOutUSD ? "+ve" : "-ve",
          trend: (profile.totalInUSD > profile.totalOutUSD ? "up" : "down") as
            | "up"
            | "down",
          icon: DollarSign,
          gradient: "from-violet-500 to-purple-500",
        },
        {
          label: "Total In (KES)",
          value: formatCurrency(profile.totalInKES, Currency.KES),
          change: "",
          trend: "up" as const,
          icon: ArrowDownCircle,
          gradient: "from-blue-500 to-cyan-500",
        },
        {
          label: "Total Out (KES)",
          value: formatCurrency(profile.totalOutKES, Currency.KES),
          change: "",
          trend: "down" as const,
          icon: ArrowUpCircle,
          gradient: "from-red-500 to-rose-500",
        },
      ]
    : [];

  // Prepare chart data from analytics
  const monthlyChartData =
    analytics?.monthlyData.map((m) => ({
      month: m.month,
      income: m.incomeKES,
      expenses: m.expensesKES,
      balance: m.balanceKES,
    })) || [];

  const categoryChartData =
    analytics?.categoryBreakdown.map((c, i) => ({
      name: c.category,
      value: c.count,
      color: ["#3b82f6", "#ef4444", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899"][
        i % 6
      ],
    })) || [];

  const weeklyChartData = analytics?.weeklyActivity || [];

  // ============ LOADING STATE ============

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error && !dashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button
            onClick={fetchDashboard}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ============ RENDER ============
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30">
      {/* Animated Background Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Top Navigation - Fixed */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b-2 border-slate-200/50 shadow-lg shadow-slate-200/50">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 transition-all group"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-700 group-hover:text-blue-600 transition-colors" />
              ) : (
                <Menu className="w-5 h-5 text-slate-700 group-hover:text-blue-600 transition-colors" />
              )}
            </button>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/40">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
                  Sarif
                </span>
                <p className="text-xs font-medium text-slate-500 hidden lg:block">
                  {getClientTypeLabel(
                    profile?.clientType ?? ClientType.Temporary,
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Center - Client ID */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200/50 shadow-inner">
            <Shield className="w-4 h-4 text-blue-600" />
            <p className="text-sm font-bold text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">
              ID: {profile?.code || "Loading..."}
            </p>
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 transition-all group"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5 text-slate-600 group-hover:text-blue-600 group-hover:rotate-180 transition-all duration-500" />
            </button>

            <button
              onClick={() => setActiveView("alerts")}
              className="p-2 hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50 transition-all relative group"
            >
              <Bell className="w-5 h-5 text-slate-600 group-hover:text-amber-600 transition-colors" />
              {(quickStats?.unreadAlerts ?? 0) > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-rose-500 rounded-full text-white text-xs font-bold flex items-center justify-center">
                  {quickStats?.unreadAlerts}
                </span>
              )}
            </button>

            <div className="hidden sm:flex items-center gap-3 pl-3 ml-2 border-l-2 border-slate-200/50">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">
                  {profile?.fullName || userName}
                </p>
                <p className="text-xs font-semibold text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">
                  {getClientTypeLabel(
                    profile?.clientType ?? ClientType.Temporary,
                  )}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-500/40">
                {(profile?.fullName || userName).charAt(0).toUpperCase()}
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-2 hover:bg-gradient-to-br hover:from-red-50 hover:to-rose-50 transition-all text-slate-700 hover:text-red-600 ml-2"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main layout with padding-top for fixed header */}
      <div className="flex pt-16">
        {/* Sidebar - Fixed */}
        <aside className="hidden lg:flex lg:flex-col lg:fixed lg:top-16 lg:left-0 lg:bottom-0 w-72 border-r-2 border-slate-200/50 bg-white/60 backdrop-blur-xl z-30 overflow-y-auto">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 via-transparent to-cyan-50/30 pointer-events-none" />

          <nav className="p-4 space-y-2 relative z-10">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 font-semibold transition-all relative overflow-hidden group ${
                  activeView === item.id
                    ? "text-white shadow-lg"
                    : "text-slate-700 hover:text-blue-700"
                }`}
              >
                {activeView === item.id ? (
                  <>
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-100`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-50" />
                  </>
                ) : (
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
                  />
                )}
                <item.icon
                  className={`w-5 h-5 relative z-10 ${
                    activeView === item.id ? "animate-pulse" : ""
                  }`}
                />
                <span className="relative z-10">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="ml-auto relative z-10 w-6 h-6 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
                {activeView === item.id && (
                  <ChevronRight className="w-4 h-4 ml-auto relative z-10" />
                )}
              </button>
            ))}
          </nav>

          {/* Quick Stats in Sidebar */}
          {quickStats && (
            <div className="p-4 mt-4 relative z-10">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 mb-3">
                Quick Stats
              </p>
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200/50 hover:border-emerald-400/50 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-600">
                      This Month
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-1">Income</p>
                  <p className="text-lg font-bold text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text">
                    {formatCurrency(quickStats.thisMonthInKES, Currency.KES)}
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200/50 hover:border-violet-400/50 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="w-5 h-5 text-violet-600" />
                    <span className="text-xs font-bold text-violet-600">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-1">Transactions</p>
                  <p className="text-lg font-bold text-transparent bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text">
                    {quickStats.transactionCount} Total
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Support Section - pushed to bottom */}
          <div className="p-4 mt-auto relative z-10">
            <button
              onClick={handleContactSupport}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 border-2 border-blue-300/50 hover:border-blue-500/50 hover:shadow-lg transition-all text-left group"
            >
              <MessageCircle className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-sm font-bold text-blue-900">24/7 Support</p>
                <p className="text-xs text-blue-700">We're here to help</p>
              </div>
              <ExternalLink className="w-4 h-4 ml-auto text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </aside>

        {/* Sidebar spacer for fixed sidebar */}
        <div className="hidden lg:block w-72 flex-shrink-0" />

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.aside
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed left-0 top-16 bottom-0 w-72 bg-white/95 backdrop-blur-xl border-r-2 border-slate-200/50 z-50 lg:hidden shadow-2xl"
              >
                <nav className="p-4 space-y-2">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveView(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 font-semibold transition-all relative overflow-hidden ${
                        activeView === item.id
                          ? "text-white shadow-lg"
                          : "text-slate-700"
                      }`}
                    >
                      {activeView === item.id && (
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${item.gradient}`}
                        />
                      )}
                      <item.icon className="w-5 h-5 relative z-10" />
                      <span className="relative z-10">{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <span className="ml-auto relative z-10 w-6 h-6 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full relative z-10">
          <AnimatePresence mode="wait">
            {/* ============ DASHBOARD VIEW ============ */}
            {activeView === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-4xl font-black text-transparent bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text">
                      Account Overview
                    </h1>
                    <p className="text-slate-600 mt-2 flex items-center gap-2">
                      <span className="font-medium">
                        Welcome back, {profile?.fullName || userName}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {profile?.lastLoginAt
                          ? `Last login: ${formatDate(profile.lastLoginAt)}`
                          : "Welcome!"}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleExportCsv}
                      className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 border-2 border-slate-300 hover:border-slate-400 shadow-lg hover:shadow-xl transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>

                {/* Balance Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {balanceCards.map((balance, index) => (
                    <ClientStatCard key={index} {...balance} />
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={handleDownloadStatement}
                    className="bg-white/70 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 p-6 text-left transition-all group shadow-lg hover:shadow-xl"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
                      <Download className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1">
                      Download Statement
                    </h3>
                    <p className="text-sm text-slate-600">
                      Get your latest PDF
                    </p>
                  </button>

                  <button
                    onClick={() => setActiveView("statements")}
                    className="bg-white/70 backdrop-blur-sm border-2 border-violet-200 hover:border-violet-400 hover:bg-gradient-to-br hover:from-violet-50 hover:to-purple-50 p-6 text-left transition-all group shadow-lg hover:shadow-xl"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-violet-500/30">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1">
                      View Transactions
                    </h3>
                    <p className="text-sm text-slate-600">See full history</p>
                  </button>

                  <button
                    onClick={handleShareStatement}
                    className="bg-white/70 backdrop-blur-sm border-2 border-emerald-200 hover:border-emerald-400 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50 p-6 text-left transition-all group shadow-lg hover:shadow-xl"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/30">
                      <Share2 className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1">
                      Share Statement
                    </h3>
                    <p className="text-sm text-slate-600">Export and send</p>
                  </button>

                  <button
                    onClick={() => setActiveView("analytics")}
                    className="bg-white/70 backdrop-blur-sm border-2 border-pink-200 hover:border-pink-400 hover:bg-gradient-to-br hover:from-pink-50 hover:to-rose-50 p-6 text-left transition-all group shadow-lg hover:shadow-xl"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-pink-500/30">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1">
                      View Analytics
                    </h3>
                    <p className="text-sm text-slate-600">Detailed insights</p>
                  </button>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white/70 backdrop-blur-sm border-2 border-slate-200 hover:border-blue-200 transition-all shadow-xl">
                  <div className="p-6 border-b-2 border-slate-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-black text-slate-900">
                          Recent Transactions
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">
                          Your latest activity
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveView("statements")}
                        className="flex items-center gap-2 text-sm font-bold text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text hover:underline group"
                      >
                        View All
                        <ChevronRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {recentTransactions.length === 0 ? (
                    <div className="p-12 text-center">
                      <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500">No transactions yet</p>
                    </div>
                  ) : (
                    <>
                      {/* Mobile Cards */}
                      <div className="lg:hidden divide-y-2 divide-slate-200">
                        {recentTransactions.slice(0, 5).map((txn) => (
                          <button
                            key={txn.id}
                            onClick={() => setSelectedTransaction(txn)}
                            className="w-full p-5 hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-cyan-50/50 transition-all text-left group"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                  {txn.description}
                                </p>
                                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatDate(txn.date)} • {txn.time}
                                </p>
                              </div>
                              <span
                                className={`px-3 py-1.5 text-xs font-bold border-2 ${
                                  txn.type === "Debit"
                                    ? "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-300"
                                    : "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-300"
                                }`}
                              >
                                {txn.type}
                              </span>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                              <span
                                className={`text-xl font-black font-mono ${
                                  txn.type === "Debit"
                                    ? "text-transparent bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text"
                                    : "text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text"
                                }`}
                              >
                                {txn.type === "Debit" ? "-" : "+"}
                                {formatCurrency(txn.amount, txn.currency)}
                              </span>
                              <span className="text-sm font-semibold text-slate-600">
                                Bal:{" "}
                                <span className="text-slate-900">
                                  {formatCurrency(
                                    txn.balanceAfter,
                                    txn.currency,
                                  )}
                                </span>
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Desktop Table */}
                      <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gradient-to-r from-slate-50 to-blue-50/30 border-b-2 border-slate-200">
                            <tr>
                              <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">
                                Type
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">
                                Description
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">
                                Amount
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">
                                Balance
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y-2 divide-slate-200">
                            {recentTransactions.slice(0, 5).map((txn) => (
                              <tr
                                key={txn.id}
                                className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-cyan-50/30 transition-all group cursor-pointer"
                                onClick={() => setSelectedTransaction(txn)}
                              >
                                <td className="px-6 py-4 text-sm">
                                  <div className="font-semibold text-slate-900">
                                    {formatDate(txn.date)}
                                  </div>
                                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                    <Clock className="w-3 h-3" />
                                    {txn.time}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span
                                    className={`inline-flex px-3 py-1.5 text-xs font-bold border-2 ${
                                      txn.type === "Debit"
                                        ? "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-300"
                                        : "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-300"
                                    }`}
                                  >
                                    {txn.type}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                    {txn.description}
                                  </div>
                                  <div className="text-xs text-slate-500 mt-0.5">
                                    {txn.reference}
                                  </div>
                                </td>
                                <td
                                  className={`px-6 py-4 text-base font-black font-mono ${
                                    txn.type === "Debit"
                                      ? "text-transparent bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text"
                                      : "text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text"
                                  }`}
                                >
                                  {txn.type === "Debit" ? "-" : "+"}
                                  {formatCurrency(txn.amount, txn.currency)}
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-slate-900 font-mono">
                                  {formatCurrency(
                                    txn.balanceAfter,
                                    txn.currency,
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border-2 ${getStatusBadgeClass(
                                      txn.status,
                                    )}`}
                                  >
                                    <CheckCircle className="w-3 h-3" />
                                    {getStatusLabel(txn.status)}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>

                {/* Mini Analytics & Alerts Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Weekly Activity Preview */}
                  {analytics && (
                    <div className="bg-white/70 backdrop-blur-sm border-2 border-violet-200 hover:border-violet-300 transition-all shadow-xl">
                      <div className="p-6 border-b-2 border-slate-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-black text-transparent bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text">
                              Weekly Activity
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">
                              Transaction volume
                            </p>
                          </div>
                          <Activity className="w-6 h-6 text-violet-600" />
                        </div>
                      </div>
                      <div className="p-6">
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={weeklyChartData}>
                            <XAxis dataKey="day" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                              contentStyle={{
                                background: "white",
                                border: "2px solid #cbd5e1",
                                borderRadius: "0px",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                              }}
                            />
                            <Bar
                              dataKey="transactions"
                              fill="url(#violetGradient)"
                            />
                            <defs>
                              <linearGradient
                                id="violetGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop offset="0%" stopColor="#8b5cf6" />
                                <stop offset="100%" stopColor="#a78bfa" />
                              </linearGradient>
                            </defs>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* Alerts Preview */}
                  <div className="bg-white/70 backdrop-blur-sm border-2 border-amber-200 hover:border-amber-300 transition-all shadow-xl">
                    <div className="p-6 border-b-2 border-slate-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-black text-transparent bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text">
                            Recent Alerts
                          </h3>
                          <p className="text-sm text-slate-600 mt-1">
                            Important updates
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveView("alerts")}
                          className="flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 hover:underline group"
                        >
                          View All
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                    <div className="p-6 space-y-3">
                      {alerts.length === 0 ? (
                        <div className="text-center py-8">
                          <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                          <p className="text-slate-500">No alerts</p>
                        </div>
                      ) : (
                        alerts.slice(0, 2).map((alert) => {
                          const AlertIcon = getAlertIcon(alert.type);
                          return (
                            <button
                              key={alert.id}
                              onClick={() => setSelectedAlert(alert)}
                              className={`w-full flex items-start gap-3 p-4 bg-gradient-to-r ${
                                alert.type === "success"
                                  ? "from-emerald-50 to-teal-50 border-emerald-300"
                                  : alert.type === "warning"
                                    ? "from-amber-50 to-orange-50 border-amber-300"
                                    : alert.type === "error"
                                      ? "from-red-50 to-rose-50 border-red-300"
                                      : "from-blue-50 to-cyan-50 border-blue-300"
                              } hover:shadow-lg border-2 transition-all text-left group ${
                                alert.isRead ? "opacity-60" : ""
                              }`}
                            >
                              <AlertIcon
                                className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                                  alert.type === "success"
                                    ? "text-emerald-600"
                                    : alert.type === "warning"
                                      ? "text-amber-600"
                                      : alert.type === "error"
                                        ? "text-red-600"
                                        : "text-blue-600"
                                }`}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                                  {alert.title}
                                </p>
                                <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                                  {alert.message}
                                </p>
                                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatDate(alert.createdAt)}
                                </p>
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            {/* ============ STATEMENTS VIEW ============ */}
            {activeView === "statements" && (
              <motion.div
                key="statements"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-4xl font-black text-transparent bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 bg-clip-text">
                      Account Statements
                    </h1>
                    <p className="text-slate-600 mt-2">
                      View and download your complete transaction history (
                      {totalCount} total)
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDownloadStatement}
                      className="flex items-center gap-2 px-5 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 hover:shadow-2xl hover:shadow-blue-500/50 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                    <button
                      onClick={handlePrintStatement}
                      className="flex items-center gap-2 px-5 py-3 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-blue-300 shadow-lg transition-all"
                    >
                      <Printer className="w-4 h-4" />
                      <span className="hidden sm:inline">Print</span>
                    </button>
                    <button
                      onClick={handleExportCsv}
                      className="flex items-center gap-2 px-5 py-3 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-emerald-300 shadow-lg transition-all"
                    >
                      <FileDown className="w-4 h-4" />
                      <span className="hidden sm:inline">CSV</span>
                    </button>
                  </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white/70 backdrop-blur-sm border-2 border-slate-200 p-6 shadow-xl">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search transactions..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 border-2 border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-slate-900 placeholder-slate-400 transition-all font-medium"
                        />
                      </div>
                      <div className="flex gap-2">
                        {["all", "month", "week"].map((period) => (
                          <button
                            key={period}
                            onClick={() => setFilterPeriod(period)}
                            className={`px-5 py-3 text-sm font-bold transition-all ${
                              filterPeriod === period
                                ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/30"
                                : "bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-300"
                            }`}
                          >
                            {period === "all"
                              ? "All Time"
                              : period === "month"
                                ? "This Month"
                                : "This Week"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Currency & Type Filters */}
                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t-2 border-slate-200">
                      <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-slate-600" />
                        <span className="text-sm font-bold text-slate-700">
                          Currency:
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCurrencyFilter(undefined)}
                          className={`px-4 py-2 text-sm font-bold transition-all ${
                            currencyFilter === undefined
                              ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
                              : "bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-300"
                          }`}
                        >
                          All
                        </button>
                        <button
                          onClick={() => setCurrencyFilter(Currency.KES)}
                          className={`px-4 py-2 text-sm font-bold transition-all flex items-center gap-2 ${
                            currencyFilter === Currency.KES
                              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                              : "bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-300"
                          }`}
                        >
                          <Banknote className="w-3.5 h-3.5" />
                          KES
                        </button>
                        <button
                          onClick={() => setCurrencyFilter(Currency.USD)}
                          className={`px-4 py-2 text-sm font-bold transition-all flex items-center gap-2 ${
                            currencyFilter === Currency.USD
                              ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/30"
                              : "bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-300"
                          }`}
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          USD
                        </button>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <span className="text-sm font-bold text-slate-700">
                          Type:
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setTypeFilter(undefined)}
                          className={`px-4 py-2 text-sm font-bold transition-all ${
                            typeFilter === undefined
                              ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                              : "bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-300"
                          }`}
                        >
                          All
                        </button>
                        <button
                          onClick={() => setTypeFilter(TransactionType.Credit)}
                          className={`px-4 py-2 text-sm font-bold transition-all ${
                            typeFilter === TransactionType.Credit
                              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
                              : "bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-300"
                          }`}
                        >
                          Credit
                        </button>
                        <button
                          onClick={() => setTypeFilter(TransactionType.Debit)}
                          className={`px-4 py-2 text-sm font-bold transition-all ${
                            typeFilter === TransactionType.Debit
                              ? "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg"
                              : "bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-300"
                          }`}
                        >
                          Debit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white/70 backdrop-blur-sm border-2 border-slate-200 shadow-xl">
                  {loadingTransactions ? (
                    <div className="p-12 text-center">
                      <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
                      <p className="text-slate-500">Loading transactions...</p>
                    </div>
                  ) : transactions.length === 0 ? (
                    <div className="p-12 text-center">
                      <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500">No transactions found</p>
                    </div>
                  ) : (
                    <>
                      {/* Mobile Cards */}
                      <div className="lg:hidden divide-y-2 divide-slate-200">
                        {transactions.map((txn) => (
                          <button
                            key={txn.id}
                            onClick={() => setSelectedTransaction(txn)}
                            className="w-full p-5 hover:bg-gradient-to-br hover:from-violet-50/50 hover:to-purple-50/50 transition-all text-left group"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <p className="text-xs font-bold text-slate-500 mb-1">
                                  {txn.code}
                                </p>
                                <p className="font-bold text-slate-900 group-hover:text-violet-600 transition-colors">
                                  {txn.description}
                                </p>
                                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatDate(txn.date)} • {txn.time}
                                </p>
                              </div>
                              <span
                                className={`px-3 py-1.5 text-xs font-bold border-2 ${
                                  txn.type === "Debit"
                                    ? "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-300"
                                    : "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-300"
                                }`}
                              >
                                {txn.type}
                              </span>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t-2 border-slate-200">
                              <div>
                                <p className="text-xs text-slate-500 mb-1 font-semibold">
                                  Amount
                                </p>
                                <p
                                  className={`text-lg font-black font-mono ${
                                    txn.type === "Debit"
                                      ? "text-transparent bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text"
                                      : "text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text"
                                  }`}
                                >
                                  {txn.type === "Debit" ? "-" : "+"}
                                  {formatCurrency(txn.amount, txn.currency)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-slate-500 mb-1 font-semibold">
                                  Balance
                                </p>
                                <p className="text-sm font-bold text-slate-900">
                                  {formatCurrency(
                                    txn.balanceAfter,
                                    txn.currency,
                                  )}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Desktop Table */}
                      <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gradient-to-r from-slate-50 to-violet-50/30 border-b-2 border-slate-200">
                            <tr>
                              <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">
                                Reference
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">
                                Date & Time
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">
                                Type
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">
                                Description
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">
                                Amount
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">
                                Balance
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y-2 divide-slate-200">
                            {transactions.map((txn) => (
                              <tr
                                key={txn.id}
                                className="hover:bg-gradient-to-r hover:from-violet-50/30 hover:to-purple-50/30 transition-all cursor-pointer group"
                                onClick={() => setSelectedTransaction(txn)}
                              >
                                <td className="px-6 py-4 text-sm font-bold text-slate-900">
                                  {txn.code}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                  <div className="font-semibold text-slate-900">
                                    {formatDate(txn.date)}
                                  </div>
                                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                    <Clock className="w-3 h-3" />
                                    {txn.time}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span
                                    className={`inline-flex px-3 py-1.5 text-xs font-bold border-2 ${
                                      txn.type === "Debit"
                                        ? "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-300"
                                        : "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-300"
                                    }`}
                                  >
                                    {txn.type}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold text-slate-900 group-hover:text-violet-600 transition-colors">
                                  {txn.description}
                                </td>
                                <td
                                  className={`px-6 py-4 text-base font-black font-mono ${
                                    txn.type === "Debit"
                                      ? "text-transparent bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text"
                                      : "text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text"
                                  }`}
                                >
                                  {txn.type === "Debit" ? "-" : "+"}
                                  {formatCurrency(txn.amount, txn.currency)}
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-slate-900 font-mono">
                                  {formatCurrency(
                                    txn.balanceAfter,
                                    txn.currency,
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border-2 ${getStatusBadgeClass(
                                      txn.status,
                                    )}`}
                                  >
                                    <CheckCircle className="w-3 h-3" />
                                    {getStatusLabel(txn.status)}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="p-4 border-t-2 border-slate-200 flex items-center justify-between">
                          <p className="text-sm text-slate-600">
                            Page {currentPage} of {totalPages} ({totalCount}{" "}
                            transactions)
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                setCurrentPage((p) => Math.max(1, p - 1))
                              }
                              disabled={currentPage === 1}
                              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 bg-white border-2 border-slate-300 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                              <ChevronLeft className="w-4 h-4" />
                              Previous
                            </button>
                            <button
                              onClick={() =>
                                setCurrentPage((p) =>
                                  Math.min(totalPages, p + 1),
                                )
                              }
                              disabled={currentPage === totalPages}
                              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 bg-white border-2 border-slate-300 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                              Next
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {/* ============ ALERTS VIEW ============ */}
            {activeView === "alerts" && (
              <motion.div
                key="alerts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-4xl font-black text-transparent bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text">
                      Notifications & Alerts
                    </h1>
                    <p className="text-slate-600 mt-2">
                      Stay updated with your account activity
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setUnreadOnly(!unreadOnly)}
                      className={`px-5 py-3 text-sm font-bold transition-all ${
                        unreadOnly
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                          : "bg-white text-slate-700 border-2 border-slate-300"
                      }`}
                    >
                      {unreadOnly ? "Showing Unread" : "Show Unread Only"}
                    </button>
                    <button
                      onClick={handleMarkAllAlertsRead}
                      className="px-5 py-3 text-sm font-bold text-slate-700 bg-white border-2 border-slate-300 hover:border-emerald-300 hover:bg-emerald-50 transition-all"
                    >
                      Mark All Read
                    </button>
                  </div>
                </div>

                {loadingAlerts ? (
                  <div className="p-12 text-center">
                    <Loader2 className="w-10 h-10 text-amber-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-500">Loading alerts...</p>
                  </div>
                ) : alerts.length === 0 ? (
                  <div className="bg-white/70 backdrop-blur-sm border-2 border-slate-200 p-12 text-center shadow-xl">
                    <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-700 mb-2">
                      No Alerts
                    </h3>
                    <p className="text-slate-500">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {alerts.map((alert) => {
                      const AlertIcon = getAlertIcon(alert.type);
                      const gradient = getAlertGradient(alert.type);
                      const borderClass = getAlertBorderClass(alert.type);

                      return (
                        <button
                          key={alert.id}
                          onClick={() => setSelectedAlert(alert)}
                          className={`w-full bg-white/70 backdrop-blur-sm border-2 hover:shadow-2xl p-6 transition-all text-left group relative overflow-hidden ${borderClass} ${
                            alert.isRead ? "opacity-60" : ""
                          }`}
                        >
                          <div
                            className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-5 transition-opacity`}
                          />
                          <div className="flex items-start gap-4 relative z-10">
                            <div
                              className={`w-12 h-12 flex items-center justify-center shadow-lg bg-gradient-to-br ${gradient}`}
                            >
                              <AlertIcon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-black text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                                  {alert.title}
                                </h4>
                                {!alert.isRead && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                )}
                              </div>
                              <p className="text-slate-600 mb-3 leading-relaxed">
                                {alert.message}
                              </p>
                              <p className="text-sm text-slate-500 flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                {formatDate(alert.createdAt)}
                              </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                          </div>
                        </button>
                      );
                    })}

                    {/* Alert Pagination */}
                    {alertTotalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 pt-4">
                        <button
                          onClick={() =>
                            setAlertPage((p) => Math.max(1, p - 1))
                          }
                          disabled={alertPage === 1}
                          className="px-4 py-2 text-sm font-bold text-slate-700 bg-white border-2 border-slate-300 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <span className="text-sm text-slate-600">
                          Page {alertPage} of {alertTotalPages}
                        </span>
                        <button
                          onClick={() =>
                            setAlertPage((p) =>
                              Math.min(alertTotalPages, p + 1),
                            )
                          }
                          disabled={alertPage === alertTotalPages}
                          className="px-4 py-2 text-sm font-bold text-slate-700 bg-white border-2 border-slate-300 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* ============ ANALYTICS VIEW ============ */}
            {activeView === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-4xl font-black text-transparent bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text">
                    Account Analytics
                  </h1>
                  <p className="text-slate-600 mt-2">
                    Deep insights into your financial performance
                  </p>
                </div>

                {loadingAnalytics ? (
                  <div className="p-12 text-center">
                    <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-500">Loading analytics...</p>
                  </div>
                ) : !analytics ? (
                  <div className="bg-white/70 backdrop-blur-sm border-2 border-slate-200 p-12 text-center shadow-xl">
                    <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-700 mb-2">
                      No Analytics Data
                    </h3>
                    <p className="text-slate-500">
                      Start making transactions to see analytics
                    </p>
                  </div>
                ) : (
                  <>
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-white/70 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-400 p-6 transition-all shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                            <TrendingUp className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                            {analytics.totals.growthPercentage > 0 ? "+" : ""}
                            {analytics.totals.growthPercentage.toFixed(1)}%
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Growth
                        </p>
                        <p className="text-2xl font-black text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">
                          {formatCurrency(
                            analytics.totals.netIncomeKES,
                            Currency.KES,
                          )}
                        </p>
                      </div>

                      <div className="bg-white/70 backdrop-blur-sm border-2 border-violet-200 hover:border-violet-400 p-6 transition-all shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
                            <Activity className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-xs font-bold text-violet-600">
                            Active
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Total Transactions
                        </p>
                        <p className="text-2xl font-black text-transparent bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text">
                          {analytics.totals.totalTransactions}
                        </p>
                      </div>

                      <div className="bg-white/70 backdrop-blur-sm border-2 border-emerald-200 hover:border-emerald-400 p-6 transition-all shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                            <CircleDollarSign className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Net Income (KES)
                        </p>
                        <p className="text-2xl font-black text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text">
                          {formatCurrency(
                            analytics.totals.netIncomeKES,
                            Currency.KES,
                          )}
                        </p>
                      </div>

                      <div className="bg-white/70 backdrop-blur-sm border-2 border-pink-200 hover:border-pink-400 p-6 transition-all shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
                            <Banknote className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Avg Transaction
                        </p>
                        <p className="text-2xl font-black text-transparent bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text">
                          {formatCurrency(
                            analytics.totals.avgTransactionKES,
                            Currency.KES,
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Monthly Performance */}
                      <div className="bg-white/70 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-300 transition-all shadow-xl">
                        <div className="p-6 border-b-2 border-slate-200">
                          <h3 className="text-lg font-black text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">
                            Monthly Performance
                          </h3>
                          <p className="text-sm text-slate-600 mt-1">
                            Income vs Expenses trend
                          </p>
                        </div>
                        <div className="p-6">
                          <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={monthlyChartData}>
                              <defs>
                                <linearGradient
                                  id="incomeGradient"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="0%"
                                    stopColor="#10b981"
                                    stopOpacity={0.8}
                                  />
                                  <stop
                                    offset="100%"
                                    stopColor="#10b981"
                                    stopOpacity={0}
                                  />
                                </linearGradient>
                                <linearGradient
                                  id="expenseGradient"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="0%"
                                    stopColor="#ef4444"
                                    stopOpacity={0.8}
                                  />
                                  <stop
                                    offset="100%"
                                    stopColor="#ef4444"
                                    stopOpacity={0}
                                  />
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="month" stroke="#94a3b8" />
                              <YAxis stroke="#94a3b8" />
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#e2e8f0"
                              />
                              <Tooltip
                                contentStyle={{
                                  background: "white",
                                  border: "2px solid #cbd5e1",
                                  borderRadius: "0px",
                                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                                }}
                                formatter={(value: number) =>
                                  formatCurrency(value, Currency.KES)
                                }
                              />
                              <Area
                                type="monotone"
                                dataKey="income"
                                stroke="#10b981"
                                fillOpacity={1}
                                fill="url(#incomeGradient)"
                                strokeWidth={3}
                              />
                              <Area
                                type="monotone"
                                dataKey="expenses"
                                stroke="#ef4444"
                                fillOpacity={1}
                                fill="url(#expenseGradient)"
                                strokeWidth={3}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Category Breakdown */}
                      <div className="bg-white/70 backdrop-blur-sm border-2 border-violet-200 hover:border-violet-300 transition-all shadow-xl">
                        <div className="p-6 border-b-2 border-slate-200">
                          <h3 className="text-lg font-black text-transparent bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text">
                            Transaction Breakdown
                          </h3>
                          <p className="text-sm text-slate-600 mt-1">
                            By category distribution
                          </p>
                        </div>
                        <div className="p-6">
                          <ResponsiveContainer width="100%" height={300}>
                            <RechartPieChart>
                              <Pie
                                data={categoryChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) =>
                                  `${name} ${(percent * 100).toFixed(0)}%`
                                }
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {categoryChartData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                  />
                                ))}
                              </Pie>
                              <Tooltip />
                            </RechartPieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Balance Growth */}
                      <div className="bg-white/70 backdrop-blur-sm border-2 border-emerald-200 hover:border-emerald-300 transition-all shadow-xl">
                        <div className="p-6 border-b-2 border-slate-200">
                          <h3 className="text-lg font-black text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text">
                            Balance Growth
                          </h3>
                          <p className="text-sm text-slate-600 mt-1">
                            6-month trend analysis
                          </p>
                        </div>
                        <div className="p-6">
                          <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthlyChartData}>
                              <XAxis dataKey="month" stroke="#94a3b8" />
                              <YAxis stroke="#94a3b8" />
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#e2e8f0"
                              />
                              <Tooltip
                                formatter={(value: number) =>
                                  formatCurrency(value, Currency.KES)
                                }
                              />
                              <Line
                                type="monotone"
                                dataKey="balance"
                                stroke="#10b981"
                                strokeWidth={4}
                                dot={{ fill: "#10b981", r: 6 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Weekly Activity */}
                      <div className="bg-white/70 backdrop-blur-sm border-2 border-pink-200 hover:border-pink-300 transition-all shadow-xl">
                        <div className="p-6 border-b-2 border-slate-200">
                          <h3 className="text-lg font-black text-transparent bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text">
                            Weekly Activity
                          </h3>
                          <p className="text-sm text-slate-600 mt-1">
                            Transaction volume by day
                          </p>
                        </div>
                        <div className="p-6">
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={weeklyChartData}>
                              <XAxis dataKey="day" stroke="#94a3b8" />
                              <YAxis stroke="#94a3b8" />
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#e2e8f0"
                              />
                              <Tooltip />
                              <Bar
                                dataKey="transactions"
                                fill="url(#pinkGradient)"
                              />
                              <defs>
                                <linearGradient
                                  id="pinkGradient"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop offset="0%" stopColor="#ec4899" />
                                  <stop offset="100%" stopColor="#f43f5e" />
                                </linearGradient>
                              </defs>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    {/* Insights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 p-6 border-2 border-blue-400 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                        <div className="relative z-10">
                          <div className="w-12 h-12 bg-white/90 flex items-center justify-center mb-4">
                            <Zap className="w-6 h-6 text-blue-600" />
                          </div>
                          <h3 className="text-xl font-black text-white mb-2">
                            Smart Insight
                          </h3>
                          <p className="text-blue-50 leading-relaxed">
                            {analytics.totals.growthPercentage > 0
                              ? `Your account is growing! ${analytics.totals.growthPercentage.toFixed(
                                  1,
                                )}% increase this month.`
                              : "Your account activity is steady. Keep tracking your transactions!"}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 p-6 border-2 border-emerald-400 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                        <div className="relative z-10">
                          <div className="w-12 h-12 bg-white/90 flex items-center justify-center mb-4">
                            <Target className="w-6 h-6 text-emerald-600" />
                          </div>
                          <h3 className="text-xl font-black text-white mb-2">
                            Summary
                          </h3>
                          <p className="text-emerald-50 leading-relaxed">
                            {analytics.totals.totalTransactions} total
                            transactions with an average of{" "}
                            {formatCurrency(
                              analytics.totals.avgTransactionKES,
                              Currency.KES,
                            )}{" "}
                            per transaction.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}
            {/* ============ PROFILE VIEW ============ */}
            {activeView === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-4xl font-black text-transparent bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 bg-clip-text">
                    Profile Settings
                  </h1>
                  <p className="text-slate-600 mt-2">
                    Manage your account information and preferences
                  </p>
                </div>

                {/* Profile Header Card */}
                <div className="bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 p-8 border-2 border-blue-400 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 bg-white flex items-center justify-center text-blue-600 text-3xl font-black shadow-2xl">
                      {(profile?.fullName || userName).charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-3xl font-black text-white mb-2">
                        {profile?.fullName || userName}
                      </h2>
                      <p className="text-blue-100 font-semibold mb-4">
                        {getClientTypeLabel(
                          profile?.clientType ?? ClientType.Temporary,
                        )}{" "}
                        • ID: {profile?.code || "Loading..."}
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        <span className="px-4 py-2 bg-white/90 text-blue-600 text-xs font-bold flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          {profile?.isActive ? "Active Account" : "Inactive"}
                        </span>
                        <span className="px-4 py-2 bg-white/90 text-emerald-600 text-xs font-bold flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Protected
                        </span>
                        {profile?.clientType === ClientType.Permanent && (
                          <span className="px-4 py-2 bg-white/90 text-amber-600 text-xs font-bold flex items-center gap-2">
                            <Star className="w-4 h-4 fill-amber-600" />
                            Premium
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="bg-white/70 backdrop-blur-sm border-2 border-slate-200 hover:border-pink-200 transition-all shadow-xl">
                  <div className="p-6 border-b-2 border-slate-200">
                    <h3 className="text-xl font-black text-transparent bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text">
                      Personal Information
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Your account details
                    </p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-blue-50/30 border-2 border-slate-200 hover:border-blue-300 transition-all group">
                      <User className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Full Name
                        </p>
                        <p className="text-base font-bold text-slate-900">
                          {profile?.fullName || "Loading..."}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-violet-50/30 border-2 border-slate-200 hover:border-violet-300 transition-all group">
                      <Receipt className="w-6 h-6 text-violet-600 group-hover:scale-110 transition-transform" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Client Code
                        </p>
                        <p className="text-base font-bold text-slate-900 font-mono">
                          {profile?.code || "Loading..."}
                        </p>
                      </div>
                    </div>

                    {profile?.email && (
                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-emerald-50/30 border-2 border-slate-200 hover:border-emerald-300 transition-all group">
                        <Globe className="w-6 h-6 text-emerald-600 group-hover:scale-110 transition-transform" />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                            Email Address
                          </p>
                          <p className="text-base font-bold text-slate-900">
                            {profile.email}
                          </p>
                        </div>
                        <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold border-2 border-emerald-300">
                          Verified
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-amber-50/30 border-2 border-slate-200 hover:border-amber-300 transition-all group">
                      <MessageCircle className="w-6 h-6 text-amber-600 group-hover:scale-110 transition-transform" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                          WhatsApp Number
                        </p>
                        <p className="text-base font-bold text-slate-900">
                          {profile?.whatsAppNumber || "Loading..."}
                        </p>
                      </div>
                      <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold border-2 border-emerald-300">
                        Verified
                      </span>
                    </div>

                    {profile?.idPassport && (
                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-pink-50/30 border-2 border-slate-200 hover:border-pink-300 transition-all group">
                        <Shield className="w-6 h-6 text-pink-600 group-hover:scale-110 transition-transform" />
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                            ID/Passport
                          </p>
                          <p className="text-base font-bold text-slate-900">
                            {profile.idPassport}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-cyan-50/30 border-2 border-slate-200 hover:border-cyan-300 transition-all group">
                      <Calendar className="w-6 h-6 text-cyan-600 group-hover:scale-110 transition-transform" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Member Since
                        </p>
                        <p className="text-base font-bold text-slate-900">
                          {profile?.createdAt
                            ? formatDate(profile.createdAt)
                            : "Loading..."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Balances */}
                <div className="bg-white/70 backdrop-blur-sm border-2 border-slate-200 hover:border-emerald-200 transition-all shadow-xl">
                  <div className="p-6 border-b-2 border-slate-200">
                    <h3 className="text-xl font-black text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text">
                      Account Balances
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Your current balances
                    </p>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200">
                      <div className="flex items-center gap-3 mb-3">
                        <Banknote className="w-8 h-8 text-emerald-600" />
                        <span className="text-sm font-bold text-emerald-700">
                          KES Balance
                        </span>
                      </div>
                      <p className="text-3xl font-black text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text">
                        {formatCurrency(profile?.balanceKES ?? 0, Currency.KES)}
                      </p>
                      <p className="text-xs text-slate-500 mt-2">
                        Opening:{" "}
                        {formatCurrency(
                          profile?.openingBalanceKES ?? 0,
                          Currency.KES,
                        )}
                      </p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200">
                      <div className="flex items-center gap-3 mb-3">
                        <DollarSign className="w-8 h-8 text-violet-600" />
                        <span className="text-sm font-bold text-violet-700">
                          USD Balance
                        </span>
                      </div>
                      <p className="text-3xl font-black text-transparent bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text">
                        {formatCurrency(profile?.balanceUSD ?? 0, Currency.USD)}
                      </p>
                      <p className="text-xs text-slate-500 mt-2">
                        Opening:{" "}
                        {formatCurrency(
                          profile?.openingBalanceUSD ?? 0,
                          Currency.USD,
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                {profile?.clientType === ClientType.Permanent && (
                  <div className="bg-white/70 backdrop-blur-sm border-2 border-slate-200 hover:border-blue-200 transition-all shadow-xl">
                    <div className="p-6 border-b-2 border-slate-200">
                      <h3 className="text-xl font-black text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">
                        Security & Privacy
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        Manage your account security
                      </p>
                    </div>
                    <div className="p-6 space-y-4">
                      <button
                        onClick={() => setShowPasswordModal(true)}
                        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 hover:border-blue-400 hover:shadow-lg transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <Lock className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                          <div className="text-left">
                            <p className="font-bold text-slate-900">
                              Change Password
                            </p>
                            <p className="text-xs text-slate-600">
                              Update your login password
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleContactSupport}
                    className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white font-bold hover:shadow-2xl hover:shadow-blue-500/50 transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Contact Support
                  </button>
                  <button
                    onClick={onLogout}
                    className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-white text-slate-700 font-bold border-2 border-slate-300 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* ============ TRANSACTION DETAIL MODAL ============ */}
      <AnimatePresence>
        {selectedTransaction && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setSelectedTransaction(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white shadow-2xl z-50 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 p-6 border-b-2 border-blue-400 relative overflow-hidden z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-white mb-1">
                      Transaction Details
                    </h3>
                    <p className="text-blue-100 font-semibold">
                      {selectedTransaction.code}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedTransaction(null)}
                    className="p-2 hover:bg-white/20 transition-all"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Status Banner */}
                <div
                  className={`p-4 border-2 ${getStatusBadgeClass(
                    selectedTransaction.status,
                  )}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900">
                        Transaction {getStatusLabel(selectedTransaction.status)}
                      </p>
                      <p className="text-sm text-slate-600">
                        Processed successfully
                      </p>
                    </div>
                  </div>
                </div>

                {/* Transaction Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 border-2 border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Transaction Type
                    </p>
                    <span
                      className={`inline-flex px-3 py-2 text-sm font-black border-2 ${
                        selectedTransaction.type === "Debit"
                          ? "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-300"
                          : "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-300"
                      }`}
                    >
                      {selectedTransaction.type}
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 border-2 border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Currency
                    </p>
                    <span className="inline-flex px-3 py-2 bg-slate-200 text-slate-900 text-sm font-black">
                      {selectedTransaction.currency === Currency.KES
                        ? "KES"
                        : "USD"}
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 border-2 border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Date & Time
                    </p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-600" />
                      <p className="font-bold text-slate-900">
                        {formatDate(selectedTransaction.date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-slate-600" />
                      <p className="font-bold text-slate-900">
                        {selectedTransaction.time}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border-2 border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Reference Number
                    </p>
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-slate-600" />
                      <p className="font-bold text-slate-900 font-mono text-sm">
                        {selectedTransaction.reference}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          selectedTransaction.reference,
                        );
                        toast.success("Reference copied!");
                      }}
                      className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </button>
                  </div>
                </div>

                {/* Amount Section */}
                <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50/30 border-2 border-slate-200">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Amount
                      </p>
                      <p
                        className={`text-3xl font-black font-mono ${
                          selectedTransaction.type === "Debit"
                            ? "text-transparent bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text"
                            : "text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text"
                        }`}
                      >
                        {selectedTransaction.type === "Debit" ? "-" : "+"}
                        {formatCurrency(
                          selectedTransaction.amount,
                          selectedTransaction.currency,
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Balance After
                      </p>
                      <p className="text-3xl font-black font-mono text-slate-900">
                        {formatCurrency(
                          selectedTransaction.balanceAfter,
                          selectedTransaction.currency,
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Balance Before
                    </p>
                    <p className="text-lg font-bold font-mono text-slate-600">
                      {formatCurrency(
                        selectedTransaction.balanceBefore,
                        selectedTransaction.currency,
                      )}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="p-4 bg-slate-50 border-2 border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Description
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {selectedTransaction.description}
                  </p>
                  {selectedTransaction.notes && (
                    <p className="text-sm text-slate-600 mt-2">
                      {selectedTransaction.notes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      handleDownloadReceipt(
                        selectedTransaction.id,
                        selectedTransaction.code,
                      )
                    }
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold hover:shadow-lg transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download Receipt
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `Transaction: ${
                          selectedTransaction.code
                        }\nAmount: ${formatCurrency(
                          selectedTransaction.amount,
                          selectedTransaction.currency,
                        )}\nDate: ${formatDate(selectedTransaction.date)}`,
                      );
                      toast.success("Transaction details copied!");
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-slate-700 font-bold border-2 border-slate-300 hover:border-blue-300 transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ============ ALERT DETAIL MODAL ============ */}
      <AnimatePresence>
        {selectedAlert && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setSelectedAlert(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white shadow-2xl z-50 max-h-[90vh] overflow-y-auto"
            >
              {(() => {
                const AlertIcon = getAlertIcon(selectedAlert.type);
                const gradient = getAlertGradient(selectedAlert.type);
                return (
                  <>
                    {/* Header */}
                    <div
                      className={`sticky top-0 bg-gradient-to-r ${gradient} p-6 border-b-2 relative overflow-hidden z-10`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white/90 flex items-center justify-center shadow-lg">
                            <AlertIcon className="w-7 h-7 text-slate-700" />
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-white">
                              {selectedAlert.title}
                            </h3>
                            <p className="text-white/80 text-sm font-semibold flex items-center gap-1.5 mt-1">
                              <Clock className="w-3.5 h-3.5" />
                              {formatDate(selectedAlert.createdAt)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedAlert(null)}
                          className="p-2 hover:bg-white/20 transition-all"
                        >
                          <X className="w-6 h-6 text-white" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                      <div className="p-5 bg-slate-50 border-2 border-slate-200">
                        <p className="text-base leading-relaxed text-slate-900 font-medium">
                          {selectedAlert.message}
                        </p>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50/30 border-2 border-slate-200">
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                            Alert Type
                          </p>
                          <span
                            className={`inline-flex px-3 py-2 text-sm font-black border-2 ${
                              selectedAlert.type === "success"
                                ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-300"
                                : selectedAlert.type === "warning"
                                  ? "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-300"
                                  : selectedAlert.type === "error"
                                    ? "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-300"
                                    : "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-300"
                            }`}
                          >
                            {selectedAlert.type.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                            Status
                          </p>
                          <span
                            className={`inline-flex px-3 py-2 text-sm font-black ${
                              selectedAlert.isRead
                                ? "bg-slate-100 text-slate-600 border-2 border-slate-300"
                                : "bg-blue-100 text-blue-700 border-2 border-blue-300"
                            }`}
                          >
                            {selectedAlert.isRead ? "Read" : "Unread"}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        {!selectedAlert.isRead && (
                          <button
                            onClick={() => {
                              handleMarkAlertRead(selectedAlert.id);
                              setSelectedAlert({
                                ...selectedAlert,
                                isRead: true,
                              });
                            }}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r ${gradient} text-white font-bold hover:shadow-lg transition-all`}
                          >
                            <CheckCircle className="w-4 h-4" />
                            Mark as Read
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedAlert(null)}
                          className={`${
                            selectedAlert.isRead ? "flex-1" : ""
                          } px-4 py-3 bg-white text-slate-700 font-bold border-2 border-slate-300 hover:border-slate-400 transition-all`}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ============ PASSWORD CHANGE MODAL ============ */}
      <AnimatePresence>
        {showPasswordModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowPasswordModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white shadow-2xl z-50"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 p-6 border-b-2 border-blue-400">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="w-6 h-6 text-white" />
                    <h3 className="text-xl font-black text-white">
                      Change Password
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="p-2 hover:bg-white/20 transition-all"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-medium"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-medium"
                    placeholder="Enter new password (min 6 characters)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-medium"
                    placeholder="Confirm new password"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleChangePassword}
                    disabled={passwordLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {passwordLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                    {passwordLoading ? "Changing..." : "Change Password"}
                  </button>
                  <button
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordForm({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                    className="px-4 py-3 bg-white text-slate-700 font-bold border-2 border-slate-300 hover:border-slate-400 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
