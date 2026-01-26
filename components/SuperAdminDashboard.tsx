import { useState } from "react";
import {
  LayoutDashboard,
  Store,
  Settings,
  ScrollText,
  UsersRound,
  CircleDollarSign,
  Activity,
  Menu,
  Search,
  RefreshCw,
  BellRing,
  LogOut,
  ShieldCheck,
  Plus,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Download,
  TrendingUp,
  Zap,
  Globe,
  DollarSign,
  Users,
  CreditCard,
  FileText,
  Database,
  Key,
  Shield,
  Lock,
  Server,
  HardDrive,
  Wifi,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Eye,
  Filter,
  Calendar,
  TrendingDown,
  Target,
  Layers,
  Briefcase,
  PieChart,
  LineChart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { StatCard } from "./StatCard";
import { OfficeManagement } from "./admin/OfficeManagement";
import { SystemSettings } from "./admin/SystemSettings";
import { AuditLogs } from "./admin/AuditLogs";
import { BackgroundPattern } from "./BackgroundPattern";

interface SuperAdminDashboardProps {
  userName: string;
  onLogout: () => void;
}

export function SuperAdminDashboard({
  userName,
  onLogout,
}: SuperAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeRange, setTimeRange] = useState("7days");
  const [selectedMetric, setSelectedMetric] = useState("all");

  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      gradient: "from-violet-500 to-purple-600",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      gradient: "from-blue-500 to-cyan-600",
      badge: "NEW",
    },
    {
      id: "offices",
      label: "Offices",
      icon: Store,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      id: "users",
      label: "Users",
      icon: UsersRound,
      gradient: "from-orange-500 to-red-600",
    },
    {
      id: "financial",
      label: "Financial",
      icon: DollarSign,
      gradient: "from-amber-500 to-yellow-600",
    },
    {
      id: "security",
      label: "Security",
      icon: Shield,
      gradient: "from-red-500 to-pink-600",
      badge: "!",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      gradient: "from-sky-500 to-blue-600",
    },
    {
      id: "audit",
      label: "Audit Logs",
      icon: ScrollText,
      gradient: "from-purple-500 to-fuchsia-600",
    },
  ];

  const stats = [
    {
      label: "Total Offices",
      value: "12",
      change: "+2",
      trend: "up" as const,
      icon: Store,
      gradient: "from-violet-500 to-purple-600",
      subtext: "Active locations",
      percentage: "+16.7%",
    },
    {
      label: "Active Users",
      value: "248",
      change: "+18%",
      trend: "up" as const,
      icon: UsersRound,
      gradient: "from-blue-500 to-cyan-600",
      subtext: "Logged in today",
      percentage: "+7.2%",
    },
    {
      label: "Monthly Volume",
      value: "$2.4M",
      change: "+12.5%",
      trend: "up" as const,
      icon: CircleDollarSign,
      gradient: "from-emerald-500 to-teal-600",
      subtext: "Total transactions",
      percentage: "+12.5%",
    },
    {
      label: "System Uptime",
      value: "99.9%",
      change: "Excellent",
      trend: "up" as const,
      icon: Activity,
      gradient: "from-amber-500 to-orange-600",
      subtext: "Last 30 days",
      percentage: "99.9%",
    },
  ];

  // Enhanced Analytics Data
  const analyticsMetrics = [
    {
      label: "Revenue Growth",
      value: "+24.5%",
      amount: "$2.4M",
      icon: TrendingUp,
      color: "emerald",
      change: "+$468K",
      period: "vs last month",
    },
    {
      label: "Transaction Success",
      value: "98.7%",
      amount: "12,489",
      icon: CheckCircle2,
      color: "blue",
      change: "+2.1%",
      period: "improved",
    },
    {
      label: "Average Transaction",
      value: "$192",
      amount: "12,489 txns",
      icon: DollarSign,
      color: "violet",
      change: "+$18",
      period: "vs last month",
    },
    {
      label: "New Clients",
      value: "+89",
      amount: "1,247 total",
      icon: Users,
      color: "orange",
      change: "+12.3%",
      period: "growth rate",
    },
  ];

  // System Health Metrics
  const systemHealth = [
    {
      metric: "API Response Time",
      value: "42ms",
      status: "excellent",
      icon: Zap,
      trend: "down",
      change: "-8ms",
    },
    {
      metric: "Database Performance",
      value: "99.2%",
      status: "good",
      icon: Database,
      trend: "stable",
      change: "0%",
    },
    {
      metric: "Server Load",
      value: "34%",
      status: "excellent",
      icon: Server,
      trend: "down",
      change: "-12%",
    },
    {
      metric: "Storage Used",
      value: "67%",
      status: "good",
      icon: HardDrive,
      trend: "up",
      change: "+5%",
    },
    {
      metric: "Active Connections",
      value: "248",
      status: "excellent",
      icon: Wifi,
      trend: "up",
      change: "+18",
    },
    {
      metric: "Error Rate",
      value: "0.3%",
      status: "excellent",
      icon: AlertCircle,
      trend: "down",
      change: "-0.2%",
    },
  ];

  // Top performing offices with detailed metrics
  const topOffices = [
    {
      name: "Nairobi Central",
      volume: "$456K",
      growth: "+15%",
      transactions: 2847,
      users: 89,
      status: "excellent",
      color: "violet",
    },
    {
      name: "Mombasa Branch",
      volume: "$342K",
      growth: "+8%",
      transactions: 2156,
      users: 67,
      status: "good",
      color: "blue",
    },
    {
      name: "Kisumu Office",
      volume: "$289K",
      growth: "+12%",
      transactions: 1893,
      users: 54,
      status: "good",
      color: "emerald",
    },
    {
      name: "Eldoret Branch",
      volume: "$234K",
      growth: "+5%",
      transactions: 1567,
      users: 45,
      status: "average",
      color: "amber",
    },
  ];

  // Recent critical alerts
  const criticalAlerts = [
    {
      type: "warning",
      title: "High Transaction Volume",
      message: "Nairobi Central processing 2.5x normal volume",
      time: "5 min ago",
      severity: "medium",
    },
    {
      type: "info",
      title: "System Update Available",
      message: "Version 2.4.1 ready to install",
      time: "1 hour ago",
      severity: "low",
    },
  ];

  // User activity breakdown
  const userActivity = [
    { role: "Office Users", count: 156, percentage: 63, color: "blue" },
    { role: "Clients", count: 89, percentage: 36, color: "violet" },
    { role: "Super Admins", count: 3, percentage: 1, color: "purple" },
  ];

  const recentActivities = [
    {
      office: "Nairobi Central",
      action: "New user registered",
      time: "5 min ago",
      user: "Sarah M.",
      type: "success",
      details: "Client account created",
    },
    {
      office: "Mombasa Branch",
      action: "Large transaction processed",
      time: "12 min ago",
      user: "John K.",
      type: "info",
      details: "$12,500 USD → KES",
    },
    {
      office: "Kisumu Office",
      action: "Settings updated",
      time: "1 hour ago",
      user: "Admin",
      type: "warning",
      details: "Exchange rates modified",
    },
    {
      office: "Eldoret Branch",
      action: "Daily reconciliation completed",
      time: "2 hours ago",
      user: "System",
      type: "success",
      details: "All transactions balanced",
    },
    {
      office: "Nakuru Office",
      action: "Security alert resolved",
      time: "3 hours ago",
      user: "Security Team",
      type: "warning",
      details: "Failed login attempts blocked",
    },
  ];

  const handleRefreshData = () => {
    toast.success("Dashboard data refreshed!");
  };

  const handleViewActivity = (activity: (typeof recentActivities)[0]) => {
    toast.info(`${activity.action} - ${activity.details}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "emerald";
      case "good":
        return "blue";
      case "average":
        return "amber";
      case "warning":
        return "orange";
      default:
        return "slate";
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <ArrowUpRight className="w-4 h-4" />;
    if (trend === "down") return <ArrowDownRight className="w-4 h-4" />;
    return <div className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-purple-50/20 relative">
      {/* Animated Background Pattern */}
      <BackgroundPattern />

      {/* Top Navigation */}
      <header className="sticky top-0 z-50 glass border-b border-white/20 shadow-lg backdrop-blur-xl">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Left: Logo & Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-violet-100/50 rounded-xl transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-700" />
            </button>

            <div className="flex items-center gap-3">
              <motion.div
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="w-5 h-5 rounded-lg bg-white/90" />
              </motion.div>
              <div>
                <span className="font-bold text-lg bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Sarif
                </span>
                <p className="text-xs text-slate-500 hidden lg:block">
                  Super Admin Panel
                </p>
              </div>
            </div>
          </div>

          {/* Center: Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
              <input
                type="text"
                placeholder="Search offices, users, transactions..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 text-sm focus:outline-none focus:border-violet-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Right: Actions & User */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshData}
              className="p-2 hover:bg-violet-50 transition-colors group"
              title="Refresh Data"
            >
              <RefreshCw className="w-5 h-5 text-slate-600 group-hover:text-violet-600 group-hover:rotate-180 transition-all duration-500" />
            </button>

            <button
              onClick={() => toast.info("Opening notifications...")}
              className="p-2 hover:bg-violet-50 transition-colors relative"
            >
              <BellRing className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </button>

            <div className="hidden sm:flex items-center gap-3 pl-3 ml-2 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">
                  {userName}
                </p>
                <p className="text-xs text-violet-600">Super Admin</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-violet-500/30">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-2 hover:bg-red-50 transition-colors text-slate-700 hover:text-red-600 ml-2"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 border-r border-slate-200 bg-white min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 font-medium transition-all relative ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30"
                    : "text-slate-700 hover:bg-violet-50 hover:text-violet-700"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      activeTab === item.id
                        ? "bg-white/20 text-white"
                        : item.badge === "!"
                        ? "bg-red-100 text-red-600"
                        : "bg-violet-100 text-violet-600"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="absolute bottom-6 left-4 right-4">
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200 p-4">
              <ShieldCheck className="w-8 h-8 text-violet-600 mb-2" />
              <p className="text-sm font-semibold text-violet-900 mb-1">
                System Secure
              </p>
              <p className="text-xs text-violet-700">All systems operational</p>
            </div>
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
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 25 }}
                className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-slate-200 z-50 lg:hidden shadow-2xl"
              >
                <nav className="p-4 space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 font-medium transition-all ${
                        activeTab === item.id
                          ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg"
                          : "text-slate-700 hover:bg-violet-50 hover:text-violet-700"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <span
                          className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            activeTab === item.id
                              ? "bg-white/20 text-white"
                              : "bg-violet-100 text-violet-600"
                          }`}
                        >
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
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Header with Time Range Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    Dashboard Overview
                  </h1>
                  <p className="text-slate-600 mt-1">
                    Welcome back, {userName} •{" "}
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <select
                    value={timeRange}
                    onChange={(e) => {
                      setTimeRange(e.target.value);
                      toast.success(
                        `Viewing ${
                          e.target.value === "7days"
                            ? "Last 7 Days"
                            : e.target.value === "30days"
                            ? "Last 30 Days"
                            : "Last 90 Days"
                        }`
                      );
                    }}
                    className="px-4 py-2.5 bg-white border-2 border-slate-200 text-slate-700 font-medium focus:outline-none focus:border-violet-500 transition-all"
                  >
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="90days">Last 90 Days</option>
                  </select>
                  <button
                    onClick={() => {
                      setActiveTab("offices");
                      toast.success("Opening office management...");
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:shadow-lg hover:shadow-violet-500/50 transition-all font-medium"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Office</span>
                  </button>
                </div>
              </div>

              {/* Main Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <StatCard key={index} {...stat} />
                ))}
              </div>

              {/* Analytics Metrics */}
              <div className="bg-white border-2 border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Performance Analytics
                    </h3>
                    <p className="text-sm text-slate-600">
                      Key business metrics and trends
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("analytics")}
                    className="text-sm font-medium text-violet-600 hover:text-violet-700 hover:underline flex items-center gap-1"
                  >
                    View Detailed Analytics <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {analyticsMetrics.map((metric, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`p-5 border-2 transition-all group cursor-pointer ${
                        metric.color === "emerald"
                          ? "bg-gradient-to-br from-emerald-50 to-white border-emerald-200 hover:border-emerald-400"
                          : metric.color === "blue"
                          ? "bg-gradient-to-br from-blue-50 to-white border-blue-200 hover:border-blue-400"
                          : metric.color === "violet"
                          ? "bg-gradient-to-br from-violet-50 to-white border-violet-200 hover:border-violet-400"
                          : "bg-gradient-to-br from-orange-50 to-white border-orange-200 hover:border-orange-400"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={`w-10 h-10 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ${
                            metric.color === "emerald"
                              ? "bg-emerald-500 shadow-emerald-500/30"
                              : metric.color === "blue"
                              ? "bg-blue-500 shadow-blue-500/30"
                              : metric.color === "violet"
                              ? "bg-violet-500 shadow-violet-500/30"
                              : "bg-orange-500 shadow-orange-500/30"
                          }`}
                        >
                          <metric.icon className="w-5 h-5 text-white" />
                        </div>
                        <div
                          className={`text-xs font-bold px-2 py-1 ${
                            metric.color === "emerald"
                              ? "bg-emerald-100 text-emerald-700"
                              : metric.color === "blue"
                              ? "bg-blue-100 text-blue-700"
                              : metric.color === "violet"
                              ? "bg-violet-100 text-violet-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {metric.value}
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-slate-700 mb-1">
                        {metric.label}
                      </p>
                      <p
                        className={`text-2xl font-bold mb-2 ${
                          metric.color === "emerald"
                            ? "text-emerald-600"
                            : metric.color === "blue"
                            ? "text-blue-600"
                            : metric.color === "violet"
                            ? "text-violet-600"
                            : "text-orange-600"
                        }`}
                      >
                        {metric.amount}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <span
                          className={`font-semibold ${
                            metric.color === "emerald"
                              ? "text-emerald-600"
                              : metric.color === "blue"
                              ? "text-blue-600"
                              : metric.color === "violet"
                              ? "text-violet-600"
                              : "text-orange-600"
                          }`}
                        >
                          {metric.change}
                        </span>
                        <span className="text-slate-500">{metric.period}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Critical Alerts */}
              {criticalAlerts.length > 0 && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                    <div>
                      <h3 className="text-lg font-bold text-amber-900">
                        Critical Alerts
                      </h3>
                      <p className="text-sm text-amber-700">
                        Requires attention
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {criticalAlerts.map((alert, idx) => (
                      <div
                        key={idx}
                        className="bg-white border-2 border-amber-200 p-4 flex items-start gap-4"
                      >
                        <div
                          className={`w-10 h-10 flex items-center justify-center ${
                            alert.severity === "high"
                              ? "bg-red-100 text-red-600"
                              : alert.severity === "medium"
                              ? "bg-amber-100 text-amber-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          <AlertCircle className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-semibold text-slate-900">
                                {alert.title}
                              </p>
                              <p className="text-sm text-slate-600">
                                {alert.message}
                              </p>
                            </div>
                            <span className="text-xs text-slate-500 whitespace-nowrap">
                              {alert.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Two Column Layout */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Activity Feed */}
                <div className="lg:col-span-2 bg-white border-2 border-slate-200 p-6 hover:border-violet-200 transition-all">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Recent Activity
                      </h3>
                      <p className="text-sm text-slate-600">
                        Real-time platform events
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("audit")}
                      className="text-sm font-medium text-violet-600 hover:text-violet-700 hover:underline"
                    >
                      View All →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {recentActivities.map((activity, index) => (
                      <button
                        key={index}
                        onClick={() => handleViewActivity(activity)}
                        className="w-full flex items-start gap-4 p-4 hover:bg-violet-50 transition-all border-2 border-transparent hover:border-violet-200 text-left"
                      >
                        <div
                          className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${
                            activity.type === "success"
                              ? "bg-emerald-100 text-emerald-600"
                              : activity.type === "warning"
                              ? "bg-amber-100 text-amber-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {activity.type === "success" ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : activity.type === "warning" ? (
                            <AlertCircle className="w-5 h-5" />
                          ) : (
                            <Activity className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-semibold text-slate-900">
                                {activity.office}
                              </p>
                              <p className="text-sm text-slate-600">
                                {activity.action}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                by {activity.user} • {activity.details}
                              </p>
                            </div>
                            <span className="text-xs text-slate-500 whitespace-nowrap">
                              {activity.time}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => toast.success("Exporting activity log...")}
                    className="w-full mt-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 border-2 border-slate-200 hover:border-violet-300 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export Activity Log
                  </button>
                </div>

                {/* Top Performers with Enhanced Details */}
                <div className="bg-white border-2 border-slate-200 p-6 hover:border-violet-200 transition-all">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900">
                      Top Performers
                    </h3>
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                  </div>

                  <div className="space-y-4">
                    {topOffices.map((office, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setActiveTab("offices");
                          toast.success(`Viewing ${office.name}`);
                        }}
                        className="w-full p-4 bg-gradient-to-br from-slate-50 to-violet-50 border-2 border-violet-100 hover:border-violet-300 transition-all text-left group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-slate-900 text-sm group-hover:text-violet-700 transition-colors">
                            {office.name}
                          </span>
                          <span
                            className={`text-xs font-bold px-2 py-1 ${
                              office.color === "violet"
                                ? "bg-violet-100 text-violet-700"
                                : office.color === "blue"
                                ? "bg-blue-100 text-blue-700"
                                : office.color === "emerald"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {office.growth}
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-violet-700 mb-2">
                          {office.volume}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-600 mb-3">
                          <span className="flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            {office.transactions} txns
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {office.users} users
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-1000 ${
                              office.color === "violet"
                                ? "bg-gradient-to-r from-violet-500 to-violet-600"
                                : office.color === "blue"
                                ? "bg-gradient-to-r from-blue-500 to-blue-600"
                                : office.color === "emerald"
                                ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                                : "bg-gradient-to-r from-amber-500 to-amber-600"
                            }`}
                            style={{ width: `${90 - idx * 15}%` }}
                          />
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setActiveTab("offices")}
                    className="w-full mt-4 py-3 text-sm font-medium text-violet-600 hover:bg-violet-50 border-2 border-violet-200 hover:border-violet-400 transition-all"
                  >
                    View All Offices →
                  </button>
                </div>
              </div>

              {/* System Health Dashboard */}
              <div className="bg-white border-2 border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      System Health
                    </h3>
                    <p className="text-sm text-slate-600">
                      Real-time infrastructure monitoring
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("security")}
                    className="text-sm font-medium text-violet-600 hover:text-violet-700 hover:underline flex items-center gap-1"
                  >
                    View Security Dashboard <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {systemHealth.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`p-4 border-2 ${
                        item.status === "excellent"
                          ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white"
                          : item.status === "good"
                          ? "border-blue-200 bg-gradient-to-br from-blue-50 to-white"
                          : "border-amber-200 bg-gradient-to-br from-amber-50 to-white"
                      } hover:border-violet-300 transition-all group cursor-pointer`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <item.icon
                          className={`w-5 h-5 ${
                            item.status === "excellent"
                              ? "text-emerald-600"
                              : item.status === "good"
                              ? "text-blue-600"
                              : "text-amber-600"
                          }`}
                        />
                        <div className="flex items-center gap-1 text-xs font-semibold">
                          {getTrendIcon(item.trend)}
                          <span
                            className={
                              item.trend === "down" &&
                              item.metric.includes("Error")
                                ? "text-emerald-600"
                                : item.trend === "up" &&
                                  item.metric.includes("Error")
                                ? "text-red-600"
                                : item.trend === "up"
                                ? "text-emerald-600"
                                : item.trend === "down"
                                ? "text-blue-600"
                                : "text-slate-600"
                            }
                          >
                            {item.change}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-slate-700 mb-1">
                        {item.metric}
                      </p>
                      <p
                        className={`text-2xl font-bold ${
                          item.status === "excellent"
                            ? "text-emerald-600"
                            : item.status === "good"
                            ? "text-blue-600"
                            : "text-amber-600"
                        }`}
                      >
                        {item.value}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* User Activity Breakdown */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border-2 border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">
                    User Distribution
                  </h3>
                  <div className="space-y-4">
                    {userActivity.map((item, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-slate-700">
                            {item.role}
                          </span>
                          <span className="text-sm font-bold text-slate-900">
                            {item.count}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percentage}%` }}
                            transition={{ duration: 1, delay: idx * 0.2 }}
                            className={`h-3 rounded-full ${
                              item.color === "blue"
                                ? "bg-gradient-to-r from-blue-500 to-blue-600"
                                : item.color === "violet"
                                ? "bg-gradient-to-r from-violet-500 to-violet-600"
                                : "bg-gradient-to-r from-purple-500 to-purple-600"
                            }`}
                          />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {item.percentage}% of total users
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200 p-6">
                  <h3 className="text-lg font-bold text-violet-900 mb-6">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setActiveTab("offices")}
                      className="p-4 bg-white border-2 border-violet-200 hover:border-violet-400 transition-all text-left group"
                    >
                      <Store className="w-6 h-6 text-violet-600 mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-sm font-semibold text-slate-900">
                        Manage Offices
                      </p>
                    </button>
                    <button
                      onClick={() => setActiveTab("users")}
                      className="p-4 bg-white border-2 border-violet-200 hover:border-violet-400 transition-all text-left group"
                    >
                      <Users className="w-6 h-6 text-violet-600 mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-sm font-semibold text-slate-900">
                        User Management
                      </p>
                    </button>
                    <button
                      onClick={() => setActiveTab("financial")}
                      className="p-4 bg-white border-2 border-violet-200 hover:border-violet-400 transition-all text-left group"
                    >
                      <DollarSign className="w-6 h-6 text-violet-600 mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-sm font-semibold text-slate-900">
                        Financial Reports
                      </p>
                    </button>
                    <button
                      onClick={() => setActiveTab("security")}
                      className="p-4 bg-white border-2 border-violet-200 hover:border-violet-400 transition-all text-left group"
                    >
                      <Shield className="w-6 h-6 text-violet-600 mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-sm font-semibold text-slate-900">
                        Security Center
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Advanced Analytics
                </h1>
                <p className="text-slate-600 mt-1">
                  Comprehensive platform insights and reporting
                </p>
              </div>
              <div className="bg-white border-2 border-slate-200 p-12 text-center">
                <BarChart3 className="w-16 h-16 text-violet-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Advanced Analytics Dashboard
                </h3>
                <p className="text-slate-600 mb-4">
                  Interactive charts, reports, and business intelligence
                </p>
                <p className="text-sm text-slate-500">
                  Coming soon: Real-time charts, custom reports, and export
                  functionality
                </p>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  User Management
                </h1>
                <p className="text-slate-600 mt-1">
                  Manage user accounts, roles, and permissions
                </p>
              </div>
              <div className="bg-white border-2 border-slate-200 p-12 text-center">
                <Users className="w-16 h-16 text-violet-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  User Management System
                </h3>
                <p className="text-slate-600 mb-4">
                  Create, edit, and manage user accounts across all offices
                </p>
                <p className="text-sm text-slate-500">
                  Features: Role management, permissions, bulk operations
                </p>
              </div>
            </div>
          )}

          {/* Financial Tab */}
          {activeTab === "financial" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Financial Reports
                </h1>
                <p className="text-slate-600 mt-1">
                  Comprehensive financial analytics and reporting
                </p>
              </div>
              <div className="bg-white border-2 border-slate-200 p-12 text-center">
                <DollarSign className="w-16 h-16 text-violet-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Financial Management
                </h3>
                <p className="text-slate-600 mb-4">
                  Revenue reports, transaction analytics, and financial insights
                </p>
                <p className="text-sm text-slate-500">
                  Track revenue, expenses, and profitability across all offices
                </p>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Security Center
                </h1>
                <p className="text-slate-600 mt-1">
                  Platform security, monitoring, and compliance
                </p>
              </div>
              <div className="bg-white border-2 border-slate-200 p-12 text-center">
                <Shield className="w-16 h-16 text-violet-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Security Dashboard
                </h3>
                <p className="text-slate-600 mb-4">
                  Monitor threats, manage access, and ensure compliance
                </p>
                <p className="text-sm text-slate-500">
                  Features: Threat detection, access logs, security policies
                </p>
              </div>
            </div>
          )}

          {activeTab === "offices" && <OfficeManagement />}
          {activeTab === "settings" && <SystemSettings />}
          {activeTab === "audit" && <AuditLogs />}
        </main>
      </div>
    </div>
  );
}
