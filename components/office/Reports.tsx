import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  Printer,
  Calendar,
  TrendingUp,
  Users,
  ArrowLeftRight,
  Wallet,
  BarChart3,
  PieChart,
  Filter,
  Search,
  RefreshCw,
  Eye,
  DollarSign,
  Building2,
  Smartphone,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  FileSpreadsheet,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

type ReportType =
  | "transactions"
  | "clients"
  | "exchange"
  | "cashflow"
  | "accounts"
  | "daily"
  | "profit";
type ExportFormat = "pdf" | "excel" | "csv";

export function Reports() {
  const [reportType, setReportType] = useState<ReportType>("transactions");
  const [dateRange, setDateRange] = useState("today");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currencyFilter, setCurrencyFilter] = useState<"all" | "KES" | "USD">(
    "all"
  );
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<
    "all" | "debit" | "credit"
  >("all");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // Real data states
  const [transactions, setTransactions] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [statistics, setStatistics] = useState({
    totalTransactions: 0,
    totalDebits: 0,
    totalCredits: 0,
    totalClients: 0,
    totalRevenue: 0,
    activeAccounts: 0,
    kesTotal: 0,
    usdTotal: 0,
  });

  useEffect(() => {
    fetchReportData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportType, dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);

      // Fetch transactions
      const txnResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-32ed8237/transactions`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      const txnResult = await txnResponse.json();

      // Fetch accounts
      const accResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-32ed8237/accounts`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      const accResult = await accResponse.json();

      if (txnResult.success) {
        setTransactions(txnResult.transactions);

        // Calculate statistics
        const debits = txnResult.transactions.filter(
          (t: any) => t.type === "debit"
        );
        const credits = txnResult.transactions.filter(
          (t: any) => t.type === "credit"
        );
        const totalDebits = debits.reduce(
          (sum: number, t: any) => sum + t.amount,
          0
        );
        const totalCredits = credits.reduce(
          (sum: number, t: any) => sum + t.amount,
          0
        );

        setStatistics({
          totalTransactions: txnResult.transactions.length,
          totalDebits,
          totalCredits,
          totalClients:
            accResult.accounts?.filter((a: any) => a.type === "Client")
              .length || 0,
          totalRevenue: totalDebits - totalCredits, // For double-entry: Net = Debits - Credits
          activeAccounts: accResult.accounts?.length || 0,
          kesTotal:
            accResult.accounts
              ?.filter((a: any) => a.currency === "KES")
              .reduce((sum: number, a: any) => sum + a.balance, 0) || 0,
          usdTotal:
            accResult.accounts
              ?.filter((a: any) => a.currency === "USD")
              .reduce((sum: number, a: any) => sum + a.balance, 0) || 0,
        });
      }

      if (accResult.success) {
        setAccounts(accResult.accounts);
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
      toast.error("Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  const reportCards = [
    {
      id: "transactions" as const,
      title: "Transaction Report",
      description: "All debit & credit transactions",
      icon: ArrowLeftRight,
      gradient: "from-blue-600 to-cyan-600",
      count: `${statistics.totalTransactions} transactions`,
      bgColor: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
    },
    {
      id: "clients" as const,
      title: "Client Balances",
      description: "Client account balances",
      icon: Users,
      gradient: "from-purple-600 to-pink-600",
      count: `${statistics.totalClients} clients`,
      bgColor: "from-purple-50 to-pink-50",
      borderColor: "border-purple-200",
    },
    {
      id: "exchange" as const,
      title: "Exchange Summary",
      description: "Currency exchange analysis",
      icon: TrendingUp,
      gradient: "from-emerald-600 to-teal-600",
      count: "Exchange data",
      bgColor: "from-emerald-50 to-teal-50",
      borderColor: "border-emerald-200",
    },
    {
      id: "cashflow" as const,
      title: "Cash Flow Report",
      description: "Money in vs money out",
      icon: Wallet,
      gradient: "from-amber-600 to-orange-600",
      count:
        statistics.totalRevenue >= 0
          ? `+KES ${statistics.totalRevenue.toLocaleString()}`
          : `-KES ${Math.abs(statistics.totalRevenue).toLocaleString()}`,
      bgColor: "from-amber-50 to-orange-50",
      borderColor: "border-amber-200",
    },
    {
      id: "accounts" as const,
      title: "Account Summary",
      description: "All account balances",
      icon: Building2,
      gradient: "from-indigo-600 to-purple-600",
      count: `${statistics.activeAccounts} accounts`,
      bgColor: "from-indigo-50 to-purple-50",
      borderColor: "border-indigo-200",
    },
    {
      id: "daily" as const,
      title: "Daily Summary",
      description: "Today's activity overview",
      icon: Activity,
      gradient: "from-red-600 to-rose-600",
      count: "Daily report",
      bgColor: "from-red-50 to-rose-50",
      borderColor: "border-red-200",
    },
    {
      id: "profit" as const,
      title: "Profit & Loss",
      description: "Revenue and expenses",
      icon: BarChart3,
      gradient: "from-green-600 to-emerald-600",
      count: "P&L Statement",
      bgColor: "from-green-50 to-emerald-50",
      borderColor: "border-green-200",
    },
  ];

  // Filter transactions
  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCurrency =
      currencyFilter === "all" || txn.currency === currencyFilter;
    const matchesType =
      transactionTypeFilter === "all" || txn.type === transactionTypeFilter;

    return matchesSearch && matchesCurrency && matchesType;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, currencyFilter, transactionTypeFilter, reportType]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Prepare chart data
  const transactionChartData = [
    { name: "Mon", debits: 45000, credits: 65000 },
    { name: "Tue", debits: 52000, credits: 48000 },
    { name: "Wed", debits: 38000, credits: 72000 },
    { name: "Thu", debits: 61000, credits: 55000 },
    { name: "Fri", debits: 48000, credits: 89000 },
    { name: "Sat", debits: 35000, credits: 42000 },
    { name: "Sun", debits: 29000, credits: 38000 },
  ];

  const currencyDistribution = [
    { name: "KES Accounts", value: statistics.kesTotal, color: "#10b981" },
    {
      name: "USD Accounts",
      value: statistics.usdTotal * 130,
      color: "#3b82f6",
    }, // Convert to KES for comparison
  ];

  const accountTypeData = accounts.reduce((acc: any[], account: any) => {
    const existing = acc.find((item) => item.name === account.type);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: account.type, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
  ];

  const handleExport = (format: ExportFormat) => {
    toast.success(`Exporting report as ${format.toUpperCase()}...`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Reports & Analytics
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Comprehensive business intelligence and insights
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => fetchReportData()}
            className="px-4 py-2 bg-white border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center gap-2 text-sm font-semibold text-slate-700"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-white border-2 border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all flex items-center gap-2 text-sm font-semibold text-slate-700 print:hidden"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <div className="relative group">
            <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:shadow-lg transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-2xl border-2 border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={() => handleExport("pdf")}
                className="w-full px-4 py-3 hover:bg-blue-50 text-left flex items-center gap-2 text-sm font-medium text-slate-700"
              >
                <FileText className="w-4 h-4" />
                Export as PDF
              </button>
              <button
                onClick={() => handleExport("excel")}
                className="w-full px-4 py-3 hover:bg-emerald-50 text-left flex items-center gap-2 text-sm font-medium text-slate-700"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Export as Excel
              </button>
              <button
                onClick={() => handleExport("csv")}
                className="w-full px-4 py-3 hover:bg-purple-50 text-left flex items-center gap-2 text-sm font-medium text-slate-700"
              >
                <FileText className="w-4 h-4" />
                Export as CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-emerald-600 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-bold text-emerald-700 uppercase">
              Debits
            </span>
          </div>
          <div className="text-3xl font-bold text-emerald-700 mb-1">
            {statistics.totalDebits.toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })}
          </div>
          <div className="text-sm text-slate-600">
            Total debit transactions (KES)
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-red-600 flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-bold text-red-700 uppercase">
              Credits
            </span>
          </div>
          <div className="text-3xl font-bold text-red-700 mb-1">
            {statistics.totalCredits.toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })}
          </div>
          <div className="text-sm text-slate-600">
            Total credit transactions (KES)
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-bold text-blue-700 uppercase">
              Net Activity
            </span>
          </div>
          <div
            className={`text-3xl font-bold mb-1 ${
              statistics.totalRevenue >= 0 ? "text-blue-700" : "text-slate-700"
            }`}
          >
            {statistics.totalRevenue >= 0 ? "+" : ""}
            {statistics.totalRevenue.toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })}
          </div>
          <div className="text-sm text-slate-600">Debits - Credits (KES)</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-600 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-bold text-purple-700 uppercase">
              Transactions
            </span>
          </div>
          <div className="text-3xl font-bold text-purple-700 mb-1">
            {statistics.totalTransactions}
          </div>
          <div className="text-sm text-slate-600">Total transactions count</div>
        </motion.div>
      </div>

      {/* Report Type Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {reportCards.map((report) => (
          <motion.button
            key={report.id}
            onClick={() => setReportType(report.id)}
            whileHover={{ scale: 1.02, y: -2 }}
            className={`text-left bg-gradient-to-br ${
              report.bgColor
            } border-2 ${report.borderColor} p-5 shadow-lg transition-all ${
              reportType === report.id
                ? "ring-4 ring-blue-500 ring-opacity-50 scale-105"
                : "hover:shadow-xl"
            }`}
          >
            <div
              className={`w-10 h-10 bg-gradient-to-br ${report.gradient} flex items-center justify-center mb-3`}
            >
              <report.icon className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">
              {report.title}
            </h4>
            <p className="text-xs text-slate-600 mb-2">{report.description}</p>
            <p className="text-xs font-bold text-slate-700">{report.count}</p>
          </motion.button>
        ))}
      </div>

      {/* Date Range & Filters */}
      <div className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date Range */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 outline-none bg-white"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search transactions..."
                className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 focus:border-blue-500 outline-none bg-white"
              />
            </div>
          </div>

          {/* Currency Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Currency
            </label>
            <select
              value={currencyFilter}
              onChange={(e) => setCurrencyFilter(e.target.value as any)}
              className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 outline-none bg-white"
            >
              <option value="all">All Currencies</option>
              <option value="KES">KES Only</option>
              <option value="USD">USD Only</option>
            </select>
          </div>

          {/* Transaction Type Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Type
            </label>
            <select
              value={transactionTypeFilter}
              onChange={(e) => setTransactionTypeFilter(e.target.value as any)}
              className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 outline-none bg-white"
            >
              <option value="all">All Types</option>
              <option value="debit">Debits Only</option>
              <option value="credit">Credits Only</option>
            </select>
          </div>
        </div>

        {/* Custom Date Range */}
        {dateRange === "custom" && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                From Date
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 outline-none bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                To Date
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 outline-none bg-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* Charts Section */}
      {(reportType === "transactions" ||
        reportType === "cashflow" ||
        reportType === "daily") && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 p-6 shadow-lg">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Weekly Transaction Volume
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={transactionChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "2px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend />
                <Bar dataKey="debits" fill="#10b981" name="Debits (KES)" />
                <Bar dataKey="credits" fill="#ef4444" name="Credits (KES)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 p-6 shadow-lg">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-600" />
              Account Type Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={accountTypeData}
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
                  {accountTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "2px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Report Content */}
      <div className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 shadow-lg overflow-hidden">
        <div className="p-6 border-b-2 border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {(() => {
                const currentReport = reportCards.find(
                  (r) => r.id === reportType
                );
                const IconComponent = currentReport?.icon;
                return (
                  <>
                    <div
                      className={`w-10 h-10 bg-gradient-to-br ${currentReport?.gradient} flex items-center justify-center`}
                    >
                      {IconComponent && (
                        <IconComponent className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {currentReport?.title}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        Showing {filteredTransactions.length} results for{" "}
                        {dateRange}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Generated on</p>
              <p className="text-sm font-bold text-slate-900">
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-slate-600">Loading report data...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Transactions Report */}
            {reportType === "transactions" && (
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b-2 border-slate-200">
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Reference
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-slate-900">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Currency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Category
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-600">No transactions found</p>
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((txn) => (
                      <tr
                        key={txn.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          {new Date(txn.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-mono text-slate-600">
                            {txn.id}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900 max-w-xs truncate">
                          {txn.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold uppercase ${
                              txn.type === "debit"
                                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                : "bg-red-100 text-red-700 border border-red-200"
                            }`}
                          >
                            {txn.type === "debit" ? (
                              <ArrowUpRight className="w-3 h-3" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3" />
                            )}
                            {txn.type}
                          </span>
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-slate-900`}
                        >
                          {txn.amount.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-semibold">
                          {txn.currency}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium">
                            {txn.category || "General"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                {currentItems.length > 0 && (
                  <tfoot className="bg-slate-50 border-t-2 border-slate-300">
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-4 text-right font-bold text-slate-900"
                      >
                        TOTALS:
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-sm font-bold text-emerald-600">
                          Debits:{" "}
                          {filteredTransactions
                            .filter((t) => t.type === "debit")
                            .reduce((sum, t) => sum + t.amount, 0)
                            .toLocaleString()}
                        </div>
                        <div className="text-sm font-bold text-red-600">
                          Credits:{" "}
                          {filteredTransactions
                            .filter((t) => t.type === "credit")
                            .reduce((sum, t) => sum + t.amount, 0)
                            .toLocaleString()}
                        </div>
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            )}

            {/* Client Balances Report */}
            {reportType === "clients" && (
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b-2 border-slate-200">
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Client ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Currency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {accounts
                    .filter((acc) => acc.type === "Client")
                    .map((client) => (
                      <tr
                        key={client.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-mono text-slate-600">
                            {client.id}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                          {client.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-emerald-600">
                          {client.balance.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-700">
                          {client.currency}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {new Date(client.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" }
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}

            {/* Account Summary Report */}
            {reportType === "accounts" && (
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b-2 border-slate-200">
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Account ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Currency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {accounts.map((account) => (
                    <tr
                      key={account.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-slate-600">
                          {account.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                        {account.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium">
                          {account.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-slate-900">
                        {account.balance.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-700">
                        {account.currency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {new Date(account.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" }
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Other report types can be added here */}
            {(reportType === "exchange" ||
              reportType === "cashflow" ||
              reportType === "daily" ||
              reportType === "profit") && (
              <div className="flex flex-col items-center justify-center py-20">
                <BarChart3 className="w-16 h-16 text-slate-300 mb-4" />
                <p className="text-lg font-medium text-slate-600">
                  Report in development
                </p>
                <p className="text-sm text-slate-500">
                  This report type will be available soon
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <div className="flex items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center gap-2 text-sm font-semibold text-slate-700"
            >
              <ArrowLeftRight className="w-4 h-4 rotate-180" />
              Previous
            </button>
            <div className="mx-4">
              <p className="text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </p>
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center gap-2 text-sm font-semibold text-slate-700"
            >
              Next
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
