import { useState } from "react";
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
  Mail,
  Phone,
  MessageCircle,
  RefreshCw,
  CreditCard,
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
  Send,
  Copy,
  Zap,
  Shield,
  Award,
  Star,
  TrendingDown,
  Target,
  Sparkles,
  Globe,
  ChevronRight,
  ExternalLink,
  Lock,
  Unlock,
  CircleDollarSign,
  Banknote,
  Receipt,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
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

export function ClientUserDashboard({
  userName,
  onLogout,
}: ClientUserDashboardProps) {
  const [activeView, setActiveView] = useState<ClientView>("dashboard");
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<
    (typeof transactions)[0] | null
  >(null);
  const [selectedAlert, setSelectedAlert] = useState<(typeof alerts)[0] | null>(
    null
  );
  const [currencyFilter, setCurrencyFilter] = useState<"all" | "KES" | "USD">(
    "all"
  );

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

  const transactions = [
    {
      id: "TXN-2026-108",
      date: "2026-01-19",
      time: "14:32",
      type: "Credit",
      description: "M-Pesa Deposit",
      amount: "KES 5,000",
      balance: "KES 125,400",
      reference: "MPESA-REF-12345",
      category: "Deposit",
      status: "Completed",
    },
    {
      id: "TXN-2026-107",
      date: "2026-01-18",
      time: "11:15",
      type: "Debit",
      description: "Cash Withdrawal",
      amount: "KES 10,000",
      balance: "KES 120,400",
      reference: "CASH-WD-456",
      category: "Withdrawal",
      status: "Completed",
    },
    {
      id: "TXN-2026-106",
      date: "2026-01-17",
      time: "16:45",
      type: "Credit",
      description: "Bank Transfer",
      amount: "KES 50,000",
      balance: "KES 130,400",
      reference: "BANK-TRF-789",
      category: "Transfer",
      status: "Completed",
    },
    {
      id: "TXN-2026-105",
      date: "2026-01-16",
      time: "09:20",
      type: "Debit",
      description: "USD Exchange",
      amount: "$50",
      balance: "$892.50",
      reference: "EXCH-USD-321",
      category: "Exchange",
      status: "Completed",
    },
    {
      id: "TXN-2026-104",
      date: "2026-01-15",
      time: "13:55",
      type: "Credit",
      description: "Account Transfer",
      amount: "KES 20,000",
      balance: "KES 80,400",
      reference: "ACC-TRF-654",
      category: "Transfer",
      status: "Completed",
    },
    {
      id: "TXN-2026-103",
      date: "2026-01-14",
      time: "10:30",
      type: "Debit",
      description: "Service Fee",
      amount: "KES 200",
      balance: "KES 60,400",
      reference: "FEE-SRV-789",
      category: "Fee",
      status: "Completed",
    },
  ];

  const alerts = [
    {
      id: 1,
      type: "success",
      title: "Transaction Completed",
      message:
        "Your M-Pesa deposit of KES 5,000 has been credited to your account.",
      time: "2 hours ago",
      icon: CheckCircle,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      id: 2,
      type: "info",
      title: "Statement Available",
      message:
        "Your monthly statement for December 2025 is now available for download.",
      time: "1 day ago",
      icon: Info,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: 3,
      type: "warning",
      title: "Low Balance Alert",
      message: "Your USD balance is below $1,000. Consider topping up.",
      time: "2 days ago",
      icon: AlertCircle,
      gradient: "from-amber-500 to-orange-500",
    },
    {
      id: 4,
      type: "success",
      title: "Security Update",
      message: "Your account security settings have been updated successfully.",
      time: "3 days ago",
      icon: Shield,
      gradient: "from-emerald-500 to-teal-500",
    },
  ];

  // Calculate totals based on currency filter
  const getFilteredTransactions = () => {
    if (currencyFilter === "all") return transactions;
    return transactions.filter((txn) =>
      txn.amount.includes(currencyFilter === "KES" ? "KES" : "$")
    );
  };

  const calculateTotals = () => {
    const filtered = getFilteredTransactions();
    const credits = filtered.filter((t) => t.type === "Credit");
    const debits = filtered.filter((t) => t.type === "Debit");

    const totalIn = credits.reduce((sum, t) => {
      const amount = parseFloat(t.amount.replace(/[^0-9.]/g, ""));
      return sum + amount;
    }, 0);

    const totalOut = debits.reduce((sum, t) => {
      const amount = parseFloat(t.amount.replace(/[^0-9.]/g, ""));
      return sum + amount;
    }, 0);

    const balance = totalIn - totalOut;

    return {
      totalIn,
      totalOut,
      balance,
      currency: currencyFilter === "USD" ? "$" : "KES",
    };
  };

  const totals = calculateTotals();

  const balances = [
    {
      label: "Total In",
      value:
        currencyFilter === "USD"
          ? `$${totals.totalIn.toFixed(2)}`
          : `KES ${totals.totalIn.toLocaleString()}`,
      change: "+12.5%",
      trend: "up" as const,
      icon: ArrowDownCircle,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      label: "Total Out",
      value:
        currencyFilter === "USD"
          ? `$${totals.totalOut.toFixed(2)}`
          : `KES ${totals.totalOut.toLocaleString()}`,
      change: "-8.2%",
      trend: "down" as const,
      icon: ArrowUpCircle,
      gradient: "from-red-500 to-rose-500",
    },
    {
      label: "Balance",
      value:
        currencyFilter === "USD"
          ? `$${totals.balance.toFixed(2)}`
          : `KES ${totals.balance.toLocaleString()}`,
      change: "+4.3%",
      trend: "up" as const,
      icon: Wallet,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      label: "This Month",
      value: "KES 45,000",
      change: "+12.5%",
      trend: "up" as const,
      icon: TrendingUp,
      gradient: "from-violet-500 to-purple-500",
    },
  ];

  // Analytics Data
  const monthlyData = [
    { month: "Jan", income: 85000, expenses: 45000, balance: 40000 },
    { month: "Feb", income: 92000, expenses: 52000, balance: 40000 },
    { month: "Mar", income: 78000, expenses: 48000, balance: 30000 },
    { month: "Apr", income: 95000, expenses: 55000, balance: 40000 },
    { month: "May", income: 105000, expenses: 60000, balance: 45000 },
    { month: "Jun", income: 98000, expenses: 58000, balance: 40000 },
  ];

  const categoryData = [
    { name: "Deposits", value: 45, color: "#3b82f6" },
    { name: "Withdrawals", value: 25, color: "#ef4444" },
    { name: "Transfers", value: 20, color: "#8b5cf6" },
    { name: "Exchanges", value: 10, color: "#10b981" },
  ];

  const weeklyActivity = [
    { day: "Mon", transactions: 12 },
    { day: "Tue", transactions: 19 },
    { day: "Wed", transactions: 15 },
    { day: "Thu", transactions: 25 },
    { day: "Fri", transactions: 22 },
    { day: "Sat", transactions: 8 },
    { day: "Sun", transactions: 5 },
  ];

  const handleDownloadStatement = () => {
    toast.success("Downloading your statement as PDF...", {
      description: "Your file will be ready in a moment",
      icon: <FileDown className="w-4 h-4" />,
    });
  };

  const handlePrintStatement = () => {
    toast.info("Opening print preview...", {
      icon: <Printer className="w-4 h-4" />,
    });
  };

  const handleShareStatement = () => {
    toast.success("Share link copied to clipboard!", {
      description: "Share your statement securely",
      icon: <Share2 className="w-4 h-4" />,
    });
  };

  const handleContactSupport = () => {
    toast.info("Opening support chat...", {
      description: "We're here to help 24/7",
      icon: <MessageCircle className="w-4 h-4" />,
    });
  };

  const handleRefresh = () => {
    toast.success("Account data refreshed!", {
      description: "All information is up to date",
      icon: <RefreshCw className="w-4 h-4" />,
    });
  };

  const handleViewTransaction = (txn: (typeof transactions)[0]) => {
    setSelectedTransaction(txn);
  };

  const handleExportData = () => {
    toast.success("Exporting data...", {
      description: "CSV file will download shortly",
      icon: <Download className="w-4 h-4" />,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30">
      {/* Animated Background Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Top Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b-2 border-slate-200/50 shadow-lg shadow-slate-200/50">
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
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/40 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Sparkles className="w-5 h-5 text-white relative z-10" />
              </div>
              <div>
                <span className="font-bold text-lg bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
                  Sarif
                </span>
                <p className="text-xs font-medium text-transparent bg-gradient-to-r from-slate-500 to-slate-600 bg-clip-text hidden lg:block">
                  Premium Client Portal
                </p>
              </div>
            </div>
          </div>

          {/* Center */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200/50 shadow-inner">
            <Shield className="w-4 h-4 text-blue-600" />
            <p className="text-sm font-bold text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">
              ID: CL-2024-145
            </p>
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 transition-all group relative overflow-hidden"
              title="Refresh"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <RefreshCw className="w-5 h-5 text-slate-600 group-hover:text-blue-600 group-hover:rotate-180 transition-all duration-500 relative z-10" />
            </button>

            <button
              onClick={() => {
                setActiveView("alerts");
                toast.info("Opening notifications...");
              }}
              className="p-2 hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50 transition-all relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Bell className="w-5 h-5 text-slate-600 group-hover:text-amber-600 transition-colors relative z-10" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50" />
            </button>

            <div className="hidden sm:flex items-center gap-3 pl-3 ml-2 border-l-2 border-slate-200/50">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">{userName}</p>
                <p className="text-xs font-semibold text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">
                  Premium Client
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-500/40 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-2 hover:bg-gradient-to-br hover:from-red-50 hover:to-rose-50 transition-all text-slate-700 hover:text-red-600 ml-2 group relative overflow-hidden"
              title="Logout"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <LogOut className="w-5 h-5 relative z-10" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-72 border-r-2 border-slate-200/50 bg-white/60 backdrop-blur-xl min-h-[calc(100vh-4rem)] relative">
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
                {activeView === item.id && (
                  <ChevronRight className="w-4 h-4 ml-auto relative z-10" />
                )}
              </button>
            ))}
          </nav>

          {/* Quick Stats in Sidebar */}
          <div className="p-4 mt-4 relative z-10">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 mb-3">
              Quick Stats
            </p>
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200/50 hover:border-emerald-400/50 transition-all group">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-600">
                    +12.5%
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-1">This Month</p>
                <p className="text-lg font-bold text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text">
                  KES 45,000
                </p>
              </div>

              <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200/50 hover:border-violet-400/50 transition-all group">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-5 h-5 text-violet-600" />
                  <span className="text-xs font-bold text-violet-600">
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-1">Transactions</p>
                <p className="text-lg font-bold text-transparent bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text">
                  106 Total
                </p>
              </div>
            </div>
          </div>

          {/* Support Section */}
          <div className="p-4 mt-auto relative z-10">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 mb-3">
              Need Help?
            </p>
            <button
              onClick={handleContactSupport}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 border-2 border-blue-300/50 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition-all text-left group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <MessageCircle className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform relative z-10" />
              <div className="relative z-10">
                <p className="text-sm font-bold text-blue-900">24/7 Support</p>
                <p className="text-xs text-blue-700">We're here to help</p>
              </div>
              <ExternalLink className="w-4 h-4 ml-auto text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity relative z-10" />
            </button>
          </div>
        </aside>

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
                        Welcome back, {userName}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Last login: Today at 9:24 AM
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleExportData}
                      className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 border-2 border-slate-300 hover:border-slate-400 shadow-lg hover:shadow-xl transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>

                {/* Currency Filters */}
                <div className="bg-white/70 backdrop-blur-sm border-2 border-slate-200 p-4 shadow-xl">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Filter className="w-5 h-5 text-slate-600" />
                      <span className="text-sm font-bold text-slate-700">
                        Filter by Currency:
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrencyFilter("all")}
                        className={`px-5 py-2.5 text-sm font-bold transition-all ${
                          currencyFilter === "all"
                            ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
                            : "bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-300"
                        }`}
                      >
                        All Currencies
                      </button>
                      <button
                        onClick={() => setCurrencyFilter("KES")}
                        className={`px-5 py-2.5 text-sm font-bold transition-all flex items-center gap-2 ${
                          currencyFilter === "KES"
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                            : "bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-300"
                        }`}
                      >
                        <Banknote className="w-4 h-4" />
                        KES Only
                      </button>
                      <button
                        onClick={() => setCurrencyFilter("USD")}
                        className={`px-5 py-2.5 text-sm font-bold transition-all flex items-center gap-2 ${
                          currencyFilter === "USD"
                            ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/30"
                            : "bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-300"
                        }`}
                      >
                        <DollarSign className="w-4 h-4" />
                        USD Only
                      </button>
                    </div>
                  </div>
                </div>

                {/* Balances - 4 Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {balances.map((balance, index) => (
                    <ClientStatCard key={index} {...balance} />
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={handleDownloadStatement}
                    className="bg-white/70 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 p-6 text-left transition-all group relative overflow-hidden shadow-lg hover:shadow-xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30 relative z-10">
                      <Download className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1 relative z-10">
                      Download Statement
                    </h3>
                    <p className="text-sm text-slate-600 relative z-10">
                      Get your latest PDF
                    </p>
                  </button>

                  <button
                    onClick={() => setActiveView("statements")}
                    className="bg-white/70 backdrop-blur-sm border-2 border-violet-200 hover:border-violet-400 hover:bg-gradient-to-br hover:from-violet-50 hover:to-purple-50 p-6 text-left transition-all group relative overflow-hidden shadow-lg hover:shadow-xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-violet-500/30 relative z-10">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1 relative z-10">
                      View Transactions
                    </h3>
                    <p className="text-sm text-slate-600 relative z-10">
                      See full history
                    </p>
                  </button>

                  <button
                    onClick={handleShareStatement}
                    className="bg-white/70 backdrop-blur-sm border-2 border-emerald-200 hover:border-emerald-400 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50 p-6 text-left transition-all group relative overflow-hidden shadow-lg hover:shadow-xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/30 relative z-10">
                      <Share2 className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1 relative z-10">
                      Share Statement
                    </h3>
                    <p className="text-sm text-slate-600 relative z-10">
                      Export and send
                    </p>
                  </button>

                  <button
                    onClick={() => setActiveView("analytics")}
                    className="bg-white/70 backdrop-blur-sm border-2 border-pink-200 hover:border-pink-400 hover:bg-gradient-to-br hover:from-pink-50 hover:to-rose-50 p-6 text-left transition-all group relative overflow-hidden shadow-lg hover:shadow-xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-pink-500/30 relative z-10">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1 relative z-10">
                      View Analytics
                    </h3>
                    <p className="text-sm text-slate-600 relative z-10">
                      Detailed insights
                    </p>
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

                  {/* Mobile Cards */}
                  <div className="lg:hidden divide-y-2 divide-slate-200">
                    {getFilteredTransactions()
                      .slice(0, 5)
                      .map((txn) => (
                        <button
                          key={txn.id}
                          onClick={() => handleViewTransaction(txn)}
                          className="w-full p-5 hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-cyan-50/50 transition-all text-left group"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {txn.description}
                              </p>
                              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {txn.date} • {txn.time}
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
                              {txn.amount}
                            </span>
                            <span className="text-sm font-semibold text-slate-600">
                              Bal:{" "}
                              <span className="text-slate-900">
                                {txn.balance}
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
                            Category
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
                        {getFilteredTransactions()
                          .slice(0, 5)
                          .map((txn) => (
                            <tr
                              key={txn.id}
                              className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-cyan-50/30 transition-all group cursor-pointer"
                              onClick={() => handleViewTransaction(txn)}
                            >
                              <td className="px-6 py-4 text-sm">
                                <div className="font-semibold text-slate-900">
                                  {txn.date}
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
                              <td className="px-6 py-4">
                                <span className="text-xs font-semibold text-slate-600 px-2 py-1 bg-slate-100">
                                  {txn.category}
                                </span>
                              </td>
                              <td
                                className={`px-6 py-4 text-base font-black font-mono ${
                                  txn.type === "Debit"
                                    ? "text-transparent bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text"
                                    : "text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text"
                                }`}
                              >
                                {txn.type === "Debit" ? "-" : "+"}
                                {txn.amount}
                              </td>
                              <td className="px-6 py-4 text-sm font-bold text-slate-900 font-mono">
                                {txn.balance}
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 text-xs font-bold border-2 border-emerald-300">
                                  <CheckCircle className="w-3 h-3" />
                                  {txn.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mini Analytics Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Weekly Activity */}
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
                        <BarChart data={weeklyActivity}>
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
                      {alerts.slice(0, 2).map((alert) => (
                        <button
                          key={alert.id}
                          onClick={() => setSelectedAlert(alert)}
                          className={`w-full flex items-start gap-3 p-4 bg-gradient-to-r ${
                            alert.type === "success"
                              ? "from-emerald-50 to-teal-50 border-emerald-300"
                              : alert.type === "warning"
                              ? "from-amber-50 to-orange-50 border-amber-300"
                              : "from-blue-50 to-cyan-50 border-blue-300"
                          } hover:shadow-lg border-2 transition-all text-left group`}
                        >
                          <alert.icon
                            className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                              alert.type === "success"
                                ? "text-emerald-600"
                                : alert.type === "warning"
                                ? "text-amber-600"
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
                              {alert.time}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

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
                      View and download your complete transaction history
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
                      onClick={handleExportData}
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

                    {/* Currency Filters for Statements */}
                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t-2 border-slate-200">
                      <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-slate-600" />
                        <span className="text-sm font-bold text-slate-700">
                          Currency:
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCurrencyFilter("all")}
                          className={`px-4 py-2 text-sm font-bold transition-all ${
                            currencyFilter === "all"
                              ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
                              : "bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-300"
                          }`}
                        >
                          All
                        </button>
                        <button
                          onClick={() => setCurrencyFilter("KES")}
                          className={`px-4 py-2 text-sm font-bold transition-all flex items-center gap-2 ${
                            currencyFilter === "KES"
                              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                              : "bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-300"
                          }`}
                        >
                          <Banknote className="w-3.5 h-3.5" />
                          KES
                        </button>
                        <button
                          onClick={() => setCurrencyFilter("USD")}
                          className={`px-4 py-2 text-sm font-bold transition-all flex items-center gap-2 ${
                            currencyFilter === "USD"
                              ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/30"
                              : "bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-300"
                          }`}
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          USD
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white/70 backdrop-blur-sm border-2 border-slate-200 shadow-xl">
                  {/* Mobile Cards */}
                  <div className="lg:hidden divide-y-2 divide-slate-200">
                    {getFilteredTransactions().map((txn) => (
                      <button
                        key={txn.id}
                        onClick={() => handleViewTransaction(txn)}
                        className="w-full p-5 hover:bg-gradient-to-br hover:from-violet-50/50 hover:to-purple-50/50 transition-all text-left group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-xs font-bold text-slate-500 mb-1">
                              {txn.id}
                            </p>
                            <p className="font-bold text-slate-900 group-hover:text-violet-600 transition-colors">
                              {txn.description}
                            </p>
                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {txn.date} • {txn.time}
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
                              {txn.amount}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-500 mb-1 font-semibold">
                              Balance
                            </p>
                            <p className="text-sm font-bold text-slate-900">
                              {txn.balance}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <p className="text-xs text-slate-500">
                            <span className="font-semibold">Ref:</span>{" "}
                            {txn.reference}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs font-semibold text-slate-600 px-2 py-1 bg-slate-100">
                              {txn.category}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 text-xs font-bold border border-emerald-300">
                              <CheckCircle className="w-3 h-3" />
                              {txn.status}
                            </span>
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
                            Category
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
                        {getFilteredTransactions().map((txn) => (
                          <tr
                            key={txn.id}
                            className="hover:bg-gradient-to-r hover:from-violet-50/30 hover:to-purple-50/30 transition-all cursor-pointer group"
                            onClick={() => handleViewTransaction(txn)}
                          >
                            <td className="px-6 py-4 text-sm font-bold text-slate-900">
                              {txn.id}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <div className="font-semibold text-slate-900">
                                {txn.date}
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
                            <td className="px-6 py-4">
                              <span className="text-xs font-semibold text-slate-600 px-2 py-1 bg-slate-100">
                                {txn.category}
                              </span>
                            </td>
                            <td
                              className={`px-6 py-4 text-base font-black font-mono ${
                                txn.type === "Debit"
                                  ? "text-transparent bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text"
                                  : "text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text"
                              }`}
                            >
                              {txn.type === "Debit" ? "-" : "+"}
                              {txn.amount}
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-slate-900 font-mono">
                              {txn.balance}
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 text-xs font-bold border-2 border-emerald-300">
                                <CheckCircle className="w-3 h-3" />
                                {txn.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeView === "alerts" && (
              <motion.div
                key="alerts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-4xl font-black text-transparent bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text">
                    Notifications & Alerts
                  </h1>
                  <p className="text-slate-600 mt-2">
                    Stay updated with your account activity and important
                    notifications
                  </p>
                </div>

                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <button
                      key={alert.id}
                      onClick={() => setSelectedAlert(alert)}
                      className={`w-full bg-white/70 backdrop-blur-sm border-2 hover:shadow-2xl p-6 transition-all text-left group relative overflow-hidden ${
                        alert.type === "success"
                          ? "border-emerald-300 hover:border-emerald-400"
                          : alert.type === "warning"
                          ? "border-amber-300 hover:border-amber-400"
                          : "border-blue-300 hover:border-blue-400"
                      }`}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${alert.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}
                      />
                      <div className="flex items-start gap-4 relative z-10">
                        <div
                          className={`w-12 h-12 flex items-center justify-center shadow-lg ${
                            alert.type === "success"
                              ? "bg-gradient-to-br from-emerald-500 to-teal-500"
                              : alert.type === "warning"
                              ? "bg-gradient-to-br from-amber-500 to-orange-500"
                              : "bg-gradient-to-br from-blue-500 to-cyan-500"
                          }`}
                        >
                          <alert.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-black text-slate-900 mb-2 text-lg group-hover:text-blue-600 transition-colors">
                            {alert.title}
                          </h4>
                          <p className="text-slate-600 mb-3 leading-relaxed">
                            {alert.message}
                          </p>
                          <p className="text-sm text-slate-500 flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {alert.time}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

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
                    Deep insights into your financial performance and patterns
                  </p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white/70 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-400 p-6 transition-all shadow-xl group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                        <ArrowUpCircle className="w-4 h-4" />
                        +8.2%
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Avg. Monthly Growth
                    </p>
                    <p className="text-2xl font-black text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">
                      KES 12,450
                    </p>
                  </div>

                  <div className="bg-white/70 backdrop-blur-sm border-2 border-violet-200 hover:border-violet-400 p-6 transition-all shadow-xl group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
                        <Activity className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-bold text-violet-600">
                        Active
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Total Transactions
                    </p>
                    <p className="text-2xl font-black text-transparent bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text">
                      106
                    </p>
                  </div>

                  <div className="bg-white/70 backdrop-blur-sm border-2 border-emerald-200 hover:border-emerald-400 p-6 transition-all shadow-xl group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                        <CircleDollarSign className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                        <ArrowUpCircle className="w-4 h-4" />
                        +4.3%
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Net Income
                    </p>
                    <p className="text-2xl font-black text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text">
                      KES 89,500
                    </p>
                  </div>

                  <div className="bg-white/70 backdrop-blur-sm border-2 border-pink-200 hover:border-pink-400 p-6 transition-all shadow-xl group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
                        <Banknote className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-bold text-pink-600">
                        Tracked
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Avg. Transaction
                    </p>
                    <p className="text-2xl font-black text-transparent bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text">
                      KES 8,450
                    </p>
                  </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Monthly Income vs Expenses */}
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
                        <AreaChart data={monthlyData}>
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
                              fontWeight: "bold",
                            }}
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

                  {/* Transaction Categories */}
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
                            data={categoryData}
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
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              background: "white",
                              border: "2px solid #cbd5e1",
                              borderRadius: "0px",
                              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                              fontWeight: "bold",
                            }}
                          />
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
                        <LineChart data={monthlyData}>
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
                              fontWeight: "bold",
                            }}
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
                        <BarChart data={weeklyActivity}>
                          <XAxis dataKey="day" stroke="#94a3b8" />
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
                              fontWeight: "bold",
                            }}
                          />
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

                {/* Insights Section */}
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
                        Your account activity is 23% higher than last month.
                        Great momentum!
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
                        Financial Goal
                      </h3>
                      <p className="text-emerald-50 leading-relaxed">
                        You're on track to reach your savings target by March
                        2026!
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

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
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-3xl font-black text-white mb-2">
                        {userName}
                      </h2>
                      <p className="text-blue-100 font-semibold mb-4">
                        Premium Client • ID: CL-2024-145
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        <span className="px-4 py-2 bg-white/90 text-blue-600 text-xs font-bold flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Verified Account
                        </span>
                        <span className="px-4 py-2 bg-white/90 text-emerald-600 text-xs font-bold flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Protected
                        </span>
                        <span className="px-4 py-2 bg-white/90 text-amber-600 text-xs font-bold flex items-center gap-2">
                          <Star className="w-4 h-4 fill-amber-600" />
                          Premium Tier
                        </span>
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
                      Your account details and contact information
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
                          {userName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-violet-50/30 border-2 border-slate-200 hover:border-violet-300 transition-all group">
                      <Mail className="w-6 h-6 text-violet-600 group-hover:scale-110 transition-transform" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Email Address
                        </p>
                        <p className="text-base font-bold text-slate-900">
                          client@sarif.co.ke
                        </p>
                      </div>
                      <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold border-2 border-emerald-300">
                        Verified
                      </span>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-emerald-50/30 border-2 border-slate-200 hover:border-emerald-300 transition-all group">
                      <Phone className="w-6 h-6 text-emerald-600 group-hover:scale-110 transition-transform" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Phone Number
                        </p>
                        <p className="text-base font-bold text-slate-900">
                          +254 712 345 678
                        </p>
                      </div>
                      <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold border-2 border-emerald-300">
                        Verified
                      </span>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-amber-50/30 border-2 border-slate-200 hover:border-amber-300 transition-all group">
                      <Globe className="w-6 h-6 text-amber-600 group-hover:scale-110 transition-transform" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Country
                        </p>
                        <p className="text-base font-bold text-slate-900">
                          Kenya
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white/70 backdrop-blur-sm border-2 border-slate-200 hover:border-emerald-200 transition-all shadow-xl">
                  <div className="p-6 border-b-2 border-slate-200">
                    <h3 className="text-xl font-black text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text">
                      Security & Privacy
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Manage your account security settings
                    </p>
                  </div>
                  <div className="p-6 space-y-4">
                    <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 hover:border-emerald-400 hover:shadow-lg transition-all group">
                      <div className="flex items-center gap-4">
                        <Lock className="w-6 h-6 text-emerald-600 group-hover:scale-110 transition-transform" />
                        <div className="text-left">
                          <p className="font-bold text-slate-900">
                            Change Password
                          </p>
                          <p className="text-xs text-slate-600">
                            Last changed 30 days ago
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 hover:border-blue-400 hover:shadow-lg transition-all group">
                      <div className="flex items-center gap-4">
                        <Shield className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                        <div className="text-left">
                          <p className="font-bold text-slate-900">
                            Two-Factor Authentication
                          </p>
                          <p className="text-xs text-slate-600">
                            Extra layer of security
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold border-2 border-emerald-300">
                        Enabled
                      </span>
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white font-bold hover:shadow-2xl hover:shadow-blue-500/50 transition-all">
                    <Settings className="w-5 h-5" />
                    Edit Profile
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-white text-slate-700 font-bold border-2 border-slate-300 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-all">
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Transaction Detail Modal */}
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
                      {selectedTransaction.id}
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
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-black text-emerald-900">
                        Transaction {selectedTransaction.status}
                      </p>
                      <p className="text-sm text-emerald-700">
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
                      Category
                    </p>
                    <span className="inline-flex px-3 py-2 bg-slate-200 text-slate-900 text-sm font-black">
                      {selectedTransaction.category}
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 border-2 border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Date & Time
                    </p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-600" />
                      <p className="font-bold text-slate-900">
                        {selectedTransaction.date}
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
                          selectedTransaction.reference
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
                        {selectedTransaction.amount}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Balance After
                      </p>
                      <p className="text-3xl font-black font-mono text-slate-900">
                        {selectedTransaction.balance}
                      </p>
                    </div>
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
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      toast.success("Downloading receipt...");
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold hover:shadow-lg transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download Receipt
                  </button>
                  <button
                    onClick={() => {
                      toast.success("Opening share options...");
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

      {/* Alert Detail Modal */}
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
              {/* Header */}
              <div
                className={`sticky top-0 bg-gradient-to-r ${
                  selectedAlert.gradient
                } p-6 border-b-2 ${
                  selectedAlert.type === "success"
                    ? "border-emerald-400"
                    : selectedAlert.type === "warning"
                    ? "border-amber-400"
                    : "border-blue-400"
                } relative overflow-hidden z-10`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/90 flex items-center justify-center shadow-lg">
                      <selectedAlert.icon
                        className={`w-7 h-7 ${
                          selectedAlert.type === "success"
                            ? "text-emerald-600"
                            : selectedAlert.type === "warning"
                            ? "text-amber-600"
                            : "text-blue-600"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">
                        {selectedAlert.title}
                      </h3>
                      <p className="text-white/80 text-sm font-semibold flex items-center gap-1.5 mt-1">
                        <Clock className="w-3.5 h-3.5" />
                        {selectedAlert.time}
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
                {/* Message */}
                <div className="p-5 bg-slate-50 border-2 border-slate-200">
                  <p className="text-base leading-relaxed text-slate-900 font-medium">
                    {selectedAlert.message}
                  </p>
                </div>

                {/* Alert Type Badge */}
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
                          : "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-300"
                      }`}
                    >
                      {selectedAlert.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Alert ID
                    </p>
                    <p className="font-black text-slate-900 font-mono">
                      ALT-{String(selectedAlert.id).padStart(5, "0")}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedAlert(null);
                      toast.success("Alert marked as read");
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r ${selectedAlert.gradient} text-white font-bold hover:shadow-lg transition-all`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Read
                  </button>
                  <button
                    onClick={() => setSelectedAlert(null)}
                    className="px-4 py-3 bg-white text-slate-700 font-bold border-2 border-slate-300 hover:border-slate-400 transition-all"
                  >
                    Close
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
