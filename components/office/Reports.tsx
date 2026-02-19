// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FileText,
//   Download,
//   Printer,
//   Calendar,
//   TrendingUp,
//   Users,
//   ArrowLeftRight,
//   Wallet,
//   BarChart3,
//   PieChart,
//   Filter,
//   Search,
//   RefreshCw,
//   Eye,
//   DollarSign,
//   Building2,
//   Smartphone,
//   CreditCard,
//   ArrowUpRight,
//   ArrowDownRight,
//   Activity,
//   CheckCircle,
//   XCircle,
//   Clock,
//   FileSpreadsheet,
//   Send,
// } from "lucide-react";
// import { toast } from "sonner";
// import { projectId, publicAnonKey } from "../../utils/supabase/info";
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   PieChart as RechartsPieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   Area,
//   AreaChart,
// } from "recharts";

// type ReportType =
//   | "transactions"
//   | "clients"
//   | "exchange"
//   | "cashflow"
//   | "accounts"
//   | "daily"
//   | "profit";
// type ExportFormat = "pdf" | "excel" | "csv";

// export function Reports() {
//   const [reportType, setReportType] = useState<ReportType>("transactions");
//   const [dateRange, setDateRange] = useState("today");
//   const [dateFrom, setDateFrom] = useState("");
//   const [dateTo, setDateTo] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currencyFilter, setCurrencyFilter] = useState<"all" | "KES" | "USD">(
//     "all"
//   );
//   const [transactionTypeFilter, setTransactionTypeFilter] = useState<
//     "all" | "debit" | "credit"
//   >("all");

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(20);

//   // Real data states
//   const [transactions, setTransactions] = useState<any[]>([]);
//   const [accounts, setAccounts] = useState<any[]>([]);
//   const [statistics, setStatistics] = useState({
//     totalTransactions: 0,
//     totalDebits: 0,
//     totalCredits: 0,
//     totalClients: 0,
//     totalRevenue: 0,
//     activeAccounts: 0,
//     kesTotal: 0,
//     usdTotal: 0,
//   });

//   useEffect(() => {
//     fetchReportData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [reportType, dateRange]);

//   const fetchReportData = async () => {
//     try {
//       setLoading(true);

//       // Fetch transactions
//       const txnResponse = await fetch(
//         `https://${projectId}.supabase.co/functions/v1/make-server-32ed8237/transactions`,
//         {
//           headers: {
//             Authorization: `Bearer ${publicAnonKey}`,
//           },
//         }
//       );
//       const txnResult = await txnResponse.json();

//       // Fetch accounts
//       const accResponse = await fetch(
//         `https://${projectId}.supabase.co/functions/v1/make-server-32ed8237/accounts`,
//         {
//           headers: {
//             Authorization: `Bearer ${publicAnonKey}`,
//           },
//         }
//       );
//       const accResult = await accResponse.json();

//       if (txnResult.success) {
//         setTransactions(txnResult.transactions);

//         // Calculate statistics
//         const debits = txnResult.transactions.filter(
//           (t: any) => t.type === "debit"
//         );
//         const credits = txnResult.transactions.filter(
//           (t: any) => t.type === "credit"
//         );
//         const totalDebits = debits.reduce(
//           (sum: number, t: any) => sum + t.amount,
//           0
//         );
//         const totalCredits = credits.reduce(
//           (sum: number, t: any) => sum + t.amount,
//           0
//         );

//         setStatistics({
//           totalTransactions: txnResult.transactions.length,
//           totalDebits,
//           totalCredits,
//           totalClients:
//             accResult.accounts?.filter((a: any) => a.type === "Client")
//               .length || 0,
//           totalRevenue: totalDebits - totalCredits, // For double-entry: Net = Debits - Credits
//           activeAccounts: accResult.accounts?.length || 0,
//           kesTotal:
//             accResult.accounts
//               ?.filter((a: any) => a.currency === "KES")
//               .reduce((sum: number, a: any) => sum + a.balance, 0) || 0,
//           usdTotal:
//             accResult.accounts
//               ?.filter((a: any) => a.currency === "USD")
//               .reduce((sum: number, a: any) => sum + a.balance, 0) || 0,
//         });
//       }

//       if (accResult.success) {
//         setAccounts(accResult.accounts);
//       }
//     } catch (error) {
//       console.error("Error fetching report data:", error);
//       toast.error("Failed to load report data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const reportCards = [
//     {
//       id: "transactions" as const,
//       title: "Transaction Report",
//       description: "All debit & credit transactions",
//       icon: ArrowLeftRight,
//       gradient: "from-blue-600 to-cyan-600",
//       count: `${statistics.totalTransactions} transactions`,
//       bgColor: "from-blue-50 to-cyan-50",
//       borderColor: "border-blue-200",
//     },
//     {
//       id: "clients" as const,
//       title: "Client Balances",
//       description: "Client account balances",
//       icon: Users,
//       gradient: "from-purple-600 to-pink-600",
//       count: `${statistics.totalClients} clients`,
//       bgColor: "from-purple-50 to-pink-50",
//       borderColor: "border-purple-200",
//     },
//     {
//       id: "exchange" as const,
//       title: "Exchange Summary",
//       description: "Currency exchange analysis",
//       icon: TrendingUp,
//       gradient: "from-emerald-600 to-teal-600",
//       count: "Exchange data",
//       bgColor: "from-emerald-50 to-teal-50",
//       borderColor: "border-emerald-200",
//     },
//     {
//       id: "cashflow" as const,
//       title: "Cash Flow Report",
//       description: "Money in vs money out",
//       icon: Wallet,
//       gradient: "from-amber-600 to-orange-600",
//       count:
//         statistics.totalRevenue >= 0
//           ? `+KES ${statistics.totalRevenue.toLocaleString()}`
//           : `-KES ${Math.abs(statistics.totalRevenue).toLocaleString()}`,
//       bgColor: "from-amber-50 to-orange-50",
//       borderColor: "border-amber-200",
//     },
//     {
//       id: "accounts" as const,
//       title: "Account Summary",
//       description: "All account balances",
//       icon: Building2,
//       gradient: "from-indigo-600 to-purple-600",
//       count: `${statistics.activeAccounts} accounts`,
//       bgColor: "from-indigo-50 to-purple-50",
//       borderColor: "border-indigo-200",
//     },
//     {
//       id: "daily" as const,
//       title: "Daily Summary",
//       description: "Today's activity overview",
//       icon: Activity,
//       gradient: "from-red-600 to-rose-600",
//       count: "Daily report",
//       bgColor: "from-red-50 to-rose-50",
//       borderColor: "border-red-200",
//     },
//     {
//       id: "profit" as const,
//       title: "Profit & Loss",
//       description: "Revenue and expenses",
//       icon: BarChart3,
//       gradient: "from-green-600 to-emerald-600",
//       count: "P&L Statement",
//       bgColor: "from-green-50 to-emerald-50",
//       borderColor: "border-green-200",
//     },
//   ];

//   // Filter transactions
//   const filteredTransactions = transactions.filter((txn) => {
//     const matchesSearch =
//       txn.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       txn.id?.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCurrency =
//       currencyFilter === "all" || txn.currency === currencyFilter;
//     const matchesType =
//       transactionTypeFilter === "all" || txn.type === transactionTypeFilter;

//     return matchesSearch && matchesCurrency && matchesType;
//   });

//   // Pagination logic
//   const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredTransactions.slice(
//     indexOfFirstItem,
//     indexOfLastItem
//   );

//   // Reset to page 1 when filters change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, currencyFilter, transactionTypeFilter, reportType]);

//   const handlePageChange = (pageNumber: number) => {
//     setCurrentPage(pageNumber);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // Prepare chart data
//   const transactionChartData = [
//     { name: "Mon", debits: 45000, credits: 65000 },
//     { name: "Tue", debits: 52000, credits: 48000 },
//     { name: "Wed", debits: 38000, credits: 72000 },
//     { name: "Thu", debits: 61000, credits: 55000 },
//     { name: "Fri", debits: 48000, credits: 89000 },
//     { name: "Sat", debits: 35000, credits: 42000 },
//     { name: "Sun", debits: 29000, credits: 38000 },
//   ];

//   const currencyDistribution = [
//     { name: "KES Accounts", value: statistics.kesTotal, color: "#10b981" },
//     {
//       name: "USD Accounts",
//       value: statistics.usdTotal * 130,
//       color: "#3b82f6",
//     }, // Convert to KES for comparison
//   ];

//   const accountTypeData = accounts.reduce((acc: any[], account: any) => {
//     const existing = acc.find((item) => item.name === account.type);
//     if (existing) {
//       existing.value += 1;
//     } else {
//       acc.push({ name: account.type, value: 1 });
//     }
//     return acc;
//   }, []);

//   const COLORS = [
//     "#3b82f6",
//     "#10b981",
//     "#f59e0b",
//     "#ef4444",
//     "#8b5cf6",
//     "#ec4899",
//   ];

//   const handleExport = (format: ExportFormat) => {
//     toast.success(`Exporting report as ${format.toUpperCase()}...`);
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="space-y-6"
//     >
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h2 className="text-2xl font-bold text-slate-900">
//             Reports & Analytics
//           </h2>
//           <p className="text-sm text-slate-600 mt-1">
//             Comprehensive business intelligence and insights
//           </p>
//         </div>
//         <div className="flex gap-3">
//           <button
//             onClick={() => fetchReportData()}
//             className="px-4 py-2 bg-white border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center gap-2 text-sm font-semibold text-slate-700"
//           >
//             <RefreshCw className="w-4 h-4" />
//             Refresh
//           </button>
//           <button
//             onClick={handlePrint}
//             className="px-4 py-2 bg-white border-2 border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all flex items-center gap-2 text-sm font-semibold text-slate-700 print:hidden"
//           >
//             <Printer className="w-4 h-4" />
//             Print
//           </button>
//           <div className="relative group">
//             <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:shadow-lg transition-all flex items-center gap-2">
//               <Download className="w-4 h-4" />
//               Export
//             </button>
//             <div className="absolute right-0 mt-2 w-48 bg-white shadow-2xl border-2 border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
//               <button
//                 onClick={() => handleExport("pdf")}
//                 className="w-full px-4 py-3 hover:bg-blue-50 text-left flex items-center gap-2 text-sm font-medium text-slate-700"
//               >
//                 <FileText className="w-4 h-4" />
//                 Export as PDF
//               </button>
//               <button
//                 onClick={() => handleExport("excel")}
//                 className="w-full px-4 py-3 hover:bg-emerald-50 text-left flex items-center gap-2 text-sm font-medium text-slate-700"
//               >
//                 <FileSpreadsheet className="w-4 h-4" />
//                 Export as Excel
//               </button>
//               <button
//                 onClick={() => handleExport("csv")}
//                 className="w-full px-4 py-3 hover:bg-purple-50 text-left flex items-center gap-2 text-sm font-medium text-slate-700"
//               >
//                 <FileText className="w-4 h-4" />
//                 Export as CSV
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Statistics Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 p-6 shadow-lg"
//         >
//           <div className="flex items-center justify-between mb-3">
//             <div className="w-10 h-10 bg-emerald-600 flex items-center justify-center">
//               <ArrowUpRight className="w-5 h-5 text-white" />
//             </div>
//             <span className="text-xs font-bold text-emerald-700 uppercase">
//               Debits
//             </span>
//           </div>
//           <div className="text-3xl font-bold text-emerald-700 mb-1">
//             {statistics.totalDebits.toLocaleString("en-US", {
//               maximumFractionDigits: 0,
//             })}
//           </div>
//           <div className="text-sm text-slate-600">
//             Total debit transactions (KES)
//           </div>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 p-6 shadow-lg"
//         >
//           <div className="flex items-center justify-between mb-3">
//             <div className="w-10 h-10 bg-red-600 flex items-center justify-center">
//               <ArrowDownRight className="w-5 h-5 text-white" />
//             </div>
//             <span className="text-xs font-bold text-red-700 uppercase">
//               Credits
//             </span>
//           </div>
//           <div className="text-3xl font-bold text-red-700 mb-1">
//             {statistics.totalCredits.toLocaleString("en-US", {
//               maximumFractionDigits: 0,
//             })}
//           </div>
//           <div className="text-sm text-slate-600">
//             Total credit transactions (KES)
//           </div>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 p-6 shadow-lg"
//         >
//           <div className="flex items-center justify-between mb-3">
//             <div className="w-10 h-10 bg-blue-600 flex items-center justify-center">
//               <TrendingUp className="w-5 h-5 text-white" />
//             </div>
//             <span className="text-xs font-bold text-blue-700 uppercase">
//               Net Activity
//             </span>
//           </div>
//           <div
//             className={`text-3xl font-bold mb-1 ${
//               statistics.totalRevenue >= 0 ? "text-blue-700" : "text-slate-700"
//             }`}
//           >
//             {statistics.totalRevenue >= 0 ? "+" : ""}
//             {statistics.totalRevenue.toLocaleString("en-US", {
//               maximumFractionDigits: 0,
//             })}
//           </div>
//           <div className="text-sm text-slate-600">Debits - Credits (KES)</div>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//           className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 p-6 shadow-lg"
//         >
//           <div className="flex items-center justify-between mb-3">
//             <div className="w-10 h-10 bg-purple-600 flex items-center justify-center">
//               <Activity className="w-5 h-5 text-white" />
//             </div>
//             <span className="text-xs font-bold text-purple-700 uppercase">
//               Transactions
//             </span>
//           </div>
//           <div className="text-3xl font-bold text-purple-700 mb-1">
//             {statistics.totalTransactions}
//           </div>
//           <div className="text-sm text-slate-600">Total transactions count</div>
//         </motion.div>
//       </div>

//       {/* Report Type Selector */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
//         {reportCards.map((report) => (
//           <motion.button
//             key={report.id}
//             onClick={() => setReportType(report.id)}
//             whileHover={{ scale: 1.02, y: -2 }}
//             className={`text-left bg-gradient-to-br ${
//               report.bgColor
//             } border-2 ${report.borderColor} p-5 shadow-lg transition-all ${
//               reportType === report.id
//                 ? "ring-4 ring-blue-500 ring-opacity-50 scale-105"
//                 : "hover:shadow-xl"
//             }`}
//           >
//             <div
//               className={`w-10 h-10 bg-gradient-to-br ${report.gradient} flex items-center justify-center mb-3`}
//             >
//               <report.icon className="w-5 h-5 text-white" />
//             </div>
//             <h4 className="text-sm font-bold text-slate-900 mb-1">
//               {report.title}
//             </h4>
//             <p className="text-xs text-slate-600 mb-2">{report.description}</p>
//             <p className="text-xs font-bold text-slate-700">{report.count}</p>
//           </motion.button>
//         ))}
//       </div>

//       {/* Date Range & Filters */}
//       <div className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 p-6 shadow-lg">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           {/* Date Range */}
//           <div>
//             <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//               Date Range
//             </label>
//             <select
//               value={dateRange}
//               onChange={(e) => setDateRange(e.target.value)}
//               className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 outline-none bg-white"
//             >
//               <option value="today">Today</option>
//               <option value="week">This Week</option>
//               <option value="month">This Month</option>
//               <option value="year">This Year</option>
//               <option value="custom">Custom Range</option>
//             </select>
//           </div>

//           {/* Search */}
//           <div>
//             <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//               Search
//             </label>
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search transactions..."
//                 className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 focus:border-blue-500 outline-none bg-white"
//               />
//             </div>
//           </div>

//           {/* Currency Filter */}
//           <div>
//             <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//               Currency
//             </label>
//             <select
//               value={currencyFilter}
//               onChange={(e) => setCurrencyFilter(e.target.value as any)}
//               className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 outline-none bg-white"
//             >
//               <option value="all">All Currencies</option>
//               <option value="KES">KES Only</option>
//               <option value="USD">USD Only</option>
//             </select>
//           </div>

//           {/* Transaction Type Filter */}
//           <div>
//             <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//               Type
//             </label>
//             <select
//               value={transactionTypeFilter}
//               onChange={(e) => setTransactionTypeFilter(e.target.value as any)}
//               className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 outline-none bg-white"
//             >
//               <option value="all">All Types</option>
//               <option value="debit">Debits Only</option>
//               <option value="credit">Credits Only</option>
//             </select>
//           </div>
//         </div>

//         {/* Custom Date Range */}
//         {dateRange === "custom" && (
//           <div className="grid grid-cols-2 gap-4 mt-4">
//             <div>
//               <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                 From Date
//               </label>
//               <input
//                 type="date"
//                 value={dateFrom}
//                 onChange={(e) => setDateFrom(e.target.value)}
//                 className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 outline-none bg-white"
//               />
//             </div>
//             <div>
//               <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                 To Date
//               </label>
//               <input
//                 type="date"
//                 value={dateTo}
//                 onChange={(e) => setDateTo(e.target.value)}
//                 className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 outline-none bg-white"
//               />
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Charts Section */}
//       {(reportType === "transactions" ||
//         reportType === "cashflow" ||
//         reportType === "daily") && (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Bar Chart */}
//           <div className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 p-6 shadow-lg">
//             <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
//               <BarChart3 className="w-5 h-5 text-blue-600" />
//               Weekly Transaction Volume
//             </h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={transactionChartData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//                 <XAxis dataKey="name" stroke="#64748b" />
//                 <YAxis stroke="#64748b" />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: "#fff",
//                     border: "2px solid #e2e8f0",
//                     borderRadius: "8px",
//                     boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//                   }}
//                 />
//                 <Legend />
//                 <Bar dataKey="debits" fill="#10b981" name="Debits (KES)" />
//                 <Bar dataKey="credits" fill="#ef4444" name="Credits (KES)" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Pie Chart */}
//           <div className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 p-6 shadow-lg">
//             <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
//               <PieChart className="w-5 h-5 text-purple-600" />
//               Account Type Distribution
//             </h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <RechartsPieChart>
//                 <Pie
//                   data={accountTypeData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={({ name, percent }) =>
//                     `${name} ${(percent * 100).toFixed(0)}%`
//                   }
//                   outerRadius={100}
//                   fill="#8884d8"
//                   dataKey="value"
//                 >
//                   {accountTypeData.map((entry, index) => (
//                     <Cell
//                       key={`cell-${index}`}
//                       fill={COLORS[index % COLORS.length]}
//                     />
//                   ))}
//                 </Pie>
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: "#fff",
//                     border: "2px solid #e2e8f0",
//                     borderRadius: "8px",
//                   }}
//                 />
//               </RechartsPieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       )}

//       {/* Report Content */}
//       <div className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 shadow-lg overflow-hidden">
//         <div className="p-6 border-b-2 border-slate-200">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               {(() => {
//                 const currentReport = reportCards.find(
//                   (r) => r.id === reportType
//                 );
//                 const IconComponent = currentReport?.icon;
//                 return (
//                   <>
//                     <div
//                       className={`w-10 h-10 bg-gradient-to-br ${currentReport?.gradient} flex items-center justify-center`}
//                     >
//                       {IconComponent && (
//                         <IconComponent className="w-5 h-5 text-white" />
//                       )}
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-bold text-slate-900">
//                         {currentReport?.title}
//                       </h3>
//                       <p className="text-sm text-slate-600 mt-1">
//                         Showing {filteredTransactions.length} results for{" "}
//                         {dateRange}
//                       </p>
//                     </div>
//                   </>
//                 );
//               })()}
//             </div>
//             <div className="text-right">
//               <p className="text-sm text-slate-600">Generated on</p>
//               <p className="text-sm font-bold text-slate-900">
//                 {new Date().toLocaleDateString("en-US", {
//                   month: "long",
//                   day: "numeric",
//                   year: "numeric",
//                 })}
//               </p>
//             </div>
//           </div>
//         </div>

//         {loading ? (
//           <div className="flex items-center justify-center py-20">
//             <div className="text-center">
//               <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
//               <p className="text-slate-600">Loading report data...</p>
//             </div>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             {/* Transactions Report */}
//             {reportType === "transactions" && (
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-slate-50 border-b-2 border-slate-200">
//                     <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Date
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Reference
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Description
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Type
//                     </th>
//                     <th className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-slate-900">
//                       Amount
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Currency
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Category
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-slate-100">
//                   {currentItems.length === 0 ? (
//                     <tr>
//                       <td colSpan={7} className="px-6 py-12 text-center">
//                         <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
//                         <p className="text-slate-600">No transactions found</p>
//                       </td>
//                     </tr>
//                   ) : (
//                     currentItems.map((txn) => (
//                       <tr
//                         key={txn.id}
//                         className="hover:bg-slate-50 transition-colors"
//                       >
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
//                           {new Date(txn.date).toLocaleDateString("en-US", {
//                             month: "short",
//                             day: "numeric",
//                             year: "numeric",
//                           })}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="text-sm font-mono text-slate-600">
//                             {txn.id}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 text-sm text-slate-900 max-w-xs truncate">
//                           {txn.description}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span
//                             className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold uppercase ${
//                               txn.type === "debit"
//                                 ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
//                                 : "bg-red-100 text-red-700 border border-red-200"
//                             }`}
//                           >
//                             {txn.type === "debit" ? (
//                               <ArrowUpRight className="w-3 h-3" />
//                             ) : (
//                               <ArrowDownRight className="w-3 h-3" />
//                             )}
//                             {txn.type}
//                           </span>
//                         </td>
//                         <td
//                           className={`px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-slate-900`}
//                         >
//                           {txn.amount.toLocaleString("en-US", {
//                             minimumFractionDigits: 2,
//                           })}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-semibold">
//                           {txn.currency}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium">
//                             {txn.category || "General"}
//                           </span>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//                 {currentItems.length > 0 && (
//                   <tfoot className="bg-slate-50 border-t-2 border-slate-300">
//                     <tr>
//                       <td
//                         colSpan={4}
//                         className="px-6 py-4 text-right font-bold text-slate-900"
//                       >
//                         TOTALS:
//                       </td>
//                       <td className="px-6 py-4 text-right">
//                         <div className="text-sm font-bold text-emerald-600">
//                           Debits:{" "}
//                           {filteredTransactions
//                             .filter((t) => t.type === "debit")
//                             .reduce((sum, t) => sum + t.amount, 0)
//                             .toLocaleString()}
//                         </div>
//                         <div className="text-sm font-bold text-red-600">
//                           Credits:{" "}
//                           {filteredTransactions
//                             .filter((t) => t.type === "credit")
//                             .reduce((sum, t) => sum + t.amount, 0)
//                             .toLocaleString()}
//                         </div>
//                       </td>
//                       <td colSpan={2}></td>
//                     </tr>
//                   </tfoot>
//                 )}
//               </table>
//             )}

//             {/* Client Balances Report */}
//             {reportType === "clients" && (
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-slate-50 border-b-2 border-slate-200">
//                     <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Client ID
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Name
//                     </th>
//                     <th className="px-6 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Balance
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Currency
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Created
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-slate-100">
//                   {accounts
//                     .filter((acc) => acc.type === "Client")
//                     .map((client) => (
//                       <tr
//                         key={client.id}
//                         className="hover:bg-slate-50 transition-colors"
//                       >
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="text-sm font-mono text-slate-600">
//                             {client.id}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
//                           {client.name}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-emerald-600">
//                           {client.balance.toLocaleString("en-US", {
//                             minimumFractionDigits: 2,
//                           })}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-700">
//                           {client.currency}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase">
//                             <CheckCircle className="w-3 h-3" />
//                             Active
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
//                           {new Date(client.createdAt).toLocaleDateString(
//                             "en-US",
//                             { month: "short", day: "numeric", year: "numeric" }
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                 </tbody>
//               </table>
//             )}

//             {/* Account Summary Report */}
//             {reportType === "accounts" && (
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-slate-50 border-b-2 border-slate-200">
//                     <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Account ID
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Name
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Type
//                     </th>
//                     <th className="px-6 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Balance
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Currency
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Created
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-slate-100">
//                   {accounts.map((account) => (
//                     <tr
//                       key={account.id}
//                       className="hover:bg-slate-50 transition-colors"
//                     >
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="text-sm font-mono text-slate-600">
//                           {account.id}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
//                         {account.name}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium">
//                           {account.type}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-slate-900">
//                         {account.balance.toLocaleString("en-US", {
//                           minimumFractionDigits: 2,
//                         })}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-700">
//                         {account.currency}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
//                         {new Date(account.createdAt).toLocaleDateString(
//                           "en-US",
//                           { month: "short", day: "numeric", year: "numeric" }
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}

//             {/* Other report types can be added here */}
//             {(reportType === "exchange" ||
//               reportType === "cashflow" ||
//               reportType === "daily" ||
//               reportType === "profit") && (
//               <div className="flex flex-col items-center justify-center py-20">
//                 <BarChart3 className="w-16 h-16 text-slate-300 mb-4" />
//                 <p className="text-lg font-medium text-slate-600">
//                   Report in development
//                 </p>
//                 <p className="text-sm text-slate-500">
//                   This report type will be available soon
//                 </p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center mt-4">
//           <div className="flex items-center">
//             <button
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//               className="px-4 py-2 bg-white border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center gap-2 text-sm font-semibold text-slate-700"
//             >
//               <ArrowLeftRight className="w-4 h-4 rotate-180" />
//               Previous
//             </button>
//             <div className="mx-4">
//               <p className="text-sm text-slate-600">
//                 Page {currentPage} of {totalPages}
//               </p>
//             </div>
//             <button
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className="px-4 py-2 bg-white border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center gap-2 text-sm font-semibold text-slate-700"
//             >
//               Next
//               <ArrowLeftRight className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       )}
//     </motion.div>
//   );
// }
import { useState, useEffect, useCallback } from "react";
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
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  getDailyReport,
  getMonthlyReport,
  getClientStatementReport,
  getClients,
  getBankAccounts,
  getCashAccounts,
  getMpesaAgents,
  getTransactions,
} from "@/lib/api";
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

interface DailyReportData {
  date: string;
  openingBalances: {
    cashKES: number;
    cashUSD: number;
    bankKES: number;
    bankUSD: number;
    mpesa: number;
  };
  transactionSummary: {
    totalDebits: number;
    totalCredits: number;
    transactionCount: number;
  };
  closingBalances: {
    cashKES: number;
    cashUSD: number;
    bankKES: number;
    bankUSD: number;
    mpesa: number;
  };
  transactions: any[];
}

interface ClientBalance {
  id: string;
  name: string;
  whatsAppNumber: string;
  balanceKES: number;
  balanceUSD: number;
  balanceType: string;
}

interface AccountSummary {
  cashAccounts: any[];
  bankAccounts: any[];
  mpesaAgents: any[];
  totalCashKES: number;
  totalCashUSD: number;
  totalBankKES: number;
  totalBankUSD: number;
  totalMpesa: number;
}

export function Reports() {
  const [reportType, setReportType] = useState<ReportType>("daily");
  const [dateRange, setDateRange] = useState("today");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
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

  // Data states
  const [dailyReport, setDailyReport] = useState<DailyReportData | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [clientBalances, setClientBalances] = useState<ClientBalance[]>([]);
  const [accountSummary, setAccountSummary] = useState<AccountSummary | null>(
    null
  );
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

  // Fetch daily report
  const fetchDailyReport = useCallback(async (date: string) => {
    try {
      const response = await getDailyReport(date);
      if (response.success && response.data) {
        setDailyReport({
          date: response.data.date,
          openingBalances: {
            cashKES: response.data.openingBalances?.cashKES || 0,
            cashUSD: response.data.openingBalances?.cashUSD || 0,
            bankKES: response.data.openingBalances?.bankKES || 0,
            bankUSD: response.data.openingBalances?.bankUSD || 0,
            mpesa: response.data.openingBalances?.mpesa || 0,
          },
          transactionSummary: {
            totalDebits: response.data.transactionSummary?.totalDebits || 0,
            totalCredits: response.data.transactionSummary?.totalCredits || 0,
            transactionCount:
              response.data.transactionSummary?.transactionCount || 0,
          },
          closingBalances: {
            cashKES: response.data.closingBalances?.cashKES || 0,
            cashUSD: response.data.closingBalances?.cashUSD || 0,
            bankKES: response.data.closingBalances?.bankKES || 0,
            bankUSD: response.data.closingBalances?.bankUSD || 0,
            mpesa: response.data.closingBalances?.mpesa || 0,
          },
          transactions: response.data.transactions || [],
        });

        // Update statistics from daily report
        setStatistics((prev) => ({
          ...prev,
          totalDebits: response.data.transactionSummary?.totalDebits || 0,
          totalCredits: response.data.transactionSummary?.totalCredits || 0,
          totalTransactions:
            response.data.transactionSummary?.transactionCount || 0,
          totalRevenue:
            (response.data.transactionSummary?.totalDebits || 0) -
            (response.data.transactionSummary?.totalCredits || 0),
        }));

        // Set transactions from daily report
        if (response.data.transactions) {
          setTransactions(
            response.data.transactions.map((txn: any) => ({
              id: txn.id || txn.code,
              date: txn.date || txn.createdAt,
              description: txn.description || txn.narration,
              type: txn.type === 0 || txn.type === "debit" ? "debit" : "credit",
              amount: Math.abs(txn.amount),
              currency: txn.currency === 0 ? "KES" : "USD",
              category: txn.category || "General",
              reference: txn.reference || txn.code,
            }))
          );
        }
      }
    } catch (error) {
      console.error("Error fetching daily report:", error);
    }
  }, []);

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    try {
      const response = await getTransactions(1, 1000);
      if (response.success && response.data) {
        const txnData = response.data.items || response.data;
        if (Array.isArray(txnData)) {
          const mappedTransactions = txnData.map((txn: any) => ({
            id: txn.id || txn.code,
            date: txn.date || txn.createdAt,
            description: txn.description || txn.narration,
            type: txn.type === 0 || txn.type === "debit" ? "debit" : "credit",
            amount: Math.abs(txn.amount),
            currency: txn.currency === 0 ? "KES" : "USD",
            category: txn.category || "General",
            reference: txn.reference || txn.code,
          }));
          setTransactions(mappedTransactions);

          // Calculate statistics
          const debits = mappedTransactions.filter(
            (t: any) => t.type === "debit"
          );
          const credits = mappedTransactions.filter(
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

          setStatistics((prev) => ({
            ...prev,
            totalTransactions: mappedTransactions.length,
            totalDebits,
            totalCredits,
            totalRevenue: totalDebits - totalCredits,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, []);

  // Fetch client balances
  const fetchClientBalances = useCallback(async () => {
    try {
      const response = await getClients();
      if (response.success && response.data) {
        const clients = response.data.map((client: any) => ({
          id: client.id,
          name: client.name,
          whatsAppNumber: client.whatsAppNumber || "",
          balanceKES: client.balanceKES || 0,
          balanceUSD: client.balanceUSD || 0,
          balanceType:
            (client.balanceKES || 0) >= 0 && (client.balanceUSD || 0) >= 0
              ? "Credit"
              : "Debit",
        }));
        setClientBalances(clients);
        setStatistics((prev) => ({
          ...prev,
          totalClients: clients.length,
        }));
      }
    } catch (error) {
      console.error("Error fetching client balances:", error);
    }
  }, []);

  // Fetch account summary
  const fetchAccountSummary = useCallback(async () => {
    try {
      const [cashRes, bankRes, mpesaRes] = await Promise.all([
        getCashAccounts(),
        getBankAccounts(),
        getMpesaAgents(),
      ]);

      const cashAccounts = cashRes.success && cashRes.data ? cashRes.data : [];
      const bankAccounts = bankRes.success && bankRes.data ? bankRes.data : [];
      const mpesaAgents =
        mpesaRes.success && mpesaRes.data ? mpesaRes.data : [];

      // Calculate totals
      const totalCashKES = cashAccounts
        .filter((a: any) => a.currency === 0 || a.currency === "KES")
        .reduce((sum: number, a: any) => sum + (a.balance || 0), 0);
      const totalCashUSD = cashAccounts
        .filter((a: any) => a.currency === 1 || a.currency === "USD")
        .reduce((sum: number, a: any) => sum + (a.balance || 0), 0);
      const totalBankKES = bankAccounts
        .filter((a: any) => a.currency === 0 || a.currency === "KES")
        .reduce((sum: number, a: any) => sum + (a.balance || 0), 0);
      const totalBankUSD = bankAccounts
        .filter((a: any) => a.currency === 1 || a.currency === "USD")
        .reduce((sum: number, a: any) => sum + (a.balance || 0), 0);
      const totalMpesa = mpesaAgents.reduce(
        (sum: number, a: any) => sum + (a.balance || 0),
        0
      );

      setAccountSummary({
        cashAccounts,
        bankAccounts,
        mpesaAgents,
        totalCashKES,
        totalCashUSD,
        totalBankKES,
        totalBankUSD,
        totalMpesa,
      });

      setStatistics((prev) => ({
        ...prev,
        activeAccounts:
          cashAccounts.length + bankAccounts.length + mpesaAgents.length,
        kesTotal: totalCashKES + totalBankKES + totalMpesa,
        usdTotal: totalCashUSD + totalBankUSD,
      }));
    } catch (error) {
      console.error("Error fetching account summary:", error);
    }
  }, []);

  // Main fetch function
  const fetchReportData = useCallback(async () => {
    setLoading(true);
    try {
      switch (reportType) {
        case "daily":
          await fetchDailyReport(selectedDate);
          break;
        case "transactions":
          await fetchTransactions();
          break;
        case "clients":
          await fetchClientBalances();
          break;
        case "accounts":
          await fetchAccountSummary();
          break;
        case "cashflow":
          await Promise.all([fetchAccountSummary(), fetchTransactions()]);
          break;
        default:
          await Promise.all([
            fetchDailyReport(selectedDate),
            fetchTransactions(),
            fetchClientBalances(),
            fetchAccountSummary(),
          ]);
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
      toast.error("Failed to load report data");
    } finally {
      setLoading(false);
    }
  }, [
    reportType,
    selectedDate,
    fetchDailyReport,
    fetchTransactions,
    fetchClientBalances,
    fetchAccountSummary,
  ]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const reportCards = [
    {
      id: "daily" as const,
      title: "Daily Summary",
      description: "Today's activity overview",
      icon: Activity,
      gradient: "from-red-600 to-rose-600",
      count: dailyReport
        ? `${dailyReport.transactionSummary.transactionCount} transactions`
        : "Daily report",
      bgColor: "from-red-50 to-rose-50",
      borderColor: "border-red-200",
    },
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
      txn.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.reference?.toLowerCase().includes(searchTerm.toLowerCase());
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

  // Prepare chart data from real data
  const transactionChartData = (() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const chartData = days.map((day) => ({ name: day, debits: 0, credits: 0 }));

    transactions.forEach((txn) => {
      const date = new Date(txn.date);
      const dayIndex = date.getDay();
      if (txn.type === "debit") {
        chartData[dayIndex].debits += txn.amount;
      } else {
        chartData[dayIndex].credits += txn.amount;
      }
    });

    return chartData;
  })();

  const currencyDistribution = [
    { name: "KES Accounts", value: statistics.kesTotal, color: "#10b981" },
    {
      name: "USD Accounts",
      value: statistics.usdTotal * 130,
      color: "#3b82f6",
    },
  ];

  const accountTypeData = (() => {
    const data: { name: string; value: number }[] = [];
    if (accountSummary) {
      if (accountSummary.cashAccounts.length > 0) {
        data.push({ name: "Cash", value: accountSummary.cashAccounts.length });
      }
      if (accountSummary.bankAccounts.length > 0) {
        data.push({ name: "Bank", value: accountSummary.bankAccounts.length });
      }
      if (accountSummary.mpesaAgents.length > 0) {
        data.push({ name: "M-Pesa", value: accountSummary.mpesaAgents.length });
      }
    }
    return data;
  })();

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
            disabled={loading}
            className="px-4 py-2 bg-white border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center gap-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Report Date (for daily report) */}
          {reportType === "daily" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Report Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 outline-none bg-white"
              />
            </div>
          )}

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

      {/* Daily Report Content */}
      {reportType === "daily" && dailyReport && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Opening Balances */}
          <div className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 p-6 shadow-lg">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-blue-600" />
              Opening Balances
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-emerald-50 border border-emerald-200">
                <span className="text-sm font-medium text-slate-700">
                  Cash KES
                </span>
                <span className="text-sm font-bold text-emerald-700">
                  KES {dailyReport.openingBalances.cashKES.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200">
                <span className="text-sm font-medium text-slate-700">
                  Cash USD
                </span>
                <span className="text-sm font-bold text-blue-700">
                  ${dailyReport.openingBalances.cashUSD.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 border border-purple-200">
                <span className="text-sm font-medium text-slate-700">
                  Bank KES
                </span>
                <span className="text-sm font-bold text-purple-700">
                  KES {dailyReport.openingBalances.bankKES.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-indigo-50 border border-indigo-200">
                <span className="text-sm font-medium text-slate-700">
                  Bank USD
                </span>
                <span className="text-sm font-bold text-indigo-700">
                  ${dailyReport.openingBalances.bankUSD.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-cyan-50 border border-cyan-200">
                <span className="text-sm font-medium text-slate-700">
                  M-Pesa
                </span>
                <span className="text-sm font-bold text-cyan-700">
                  KES {dailyReport.openingBalances.mpesa.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Closing Balances */}
          <div className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 p-6 shadow-lg">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-600" />
              Closing Balances
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-emerald-50 border border-emerald-200">
                <span className="text-sm font-medium text-slate-700">
                  Cash KES
                </span>
                <span className="text-sm font-bold text-emerald-700">
                  KES {dailyReport.closingBalances.cashKES.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200">
                <span className="text-sm font-medium text-slate-700">
                  Cash USD
                </span>
                <span className="text-sm font-bold text-blue-700">
                  ${dailyReport.closingBalances.cashUSD.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 border border-purple-200">
                <span className="text-sm font-medium text-slate-700">
                  Bank KES
                </span>
                <span className="text-sm font-bold text-purple-700">
                  KES {dailyReport.closingBalances.bankKES.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-indigo-50 border border-indigo-200">
                <span className="text-sm font-medium text-slate-700">
                  Bank USD
                </span>
                <span className="text-sm font-bold text-indigo-700">
                  ${dailyReport.closingBalances.bankUSD.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-cyan-50 border border-cyan-200">
                <span className="text-sm font-medium text-slate-700">
                  M-Pesa
                </span>
                <span className="text-sm font-bold text-cyan-700">
                  KES {dailyReport.closingBalances.mpesa.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

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
                        {reportType === "transactions" &&
                          `Showing ${filteredTransactions.length} results`}
                        {reportType === "clients" &&
                          `Showing ${clientBalances.length} clients`}
                        {reportType === "accounts" &&
                          accountSummary &&
                          `Showing ${
                            accountSummary.cashAccounts.length +
                            accountSummary.bankAccounts.length +
                            accountSummary.mpesaAgents.length
                          } accounts`}
                        {reportType === "daily" &&
                          dailyReport &&
                          `Report for ${new Date(
                            dailyReport.date
                          ).toLocaleDateString()}`}
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
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
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
                            {txn.reference}
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
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-slate-900">
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

            {/* Daily Report Transactions */}
            {reportType === "daily" && dailyReport && (
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b-2 border-slate-200">
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Time
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
                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Currency
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {dailyReport.transactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-600">
                          No transactions for this date
                        </p>
                      </td>
                    </tr>
                  ) : (
                    dailyReport.transactions.map((txn: any, index: number) => (
                      <tr
                        key={txn.id || index}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          {new Date(
                            txn.date || txn.createdAt
                          ).toLocaleTimeString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-mono text-slate-600">
                            {txn.reference || txn.code}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900 max-w-xs truncate">
                          {txn.description || txn.narration}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold uppercase ${
                              txn.type === 0 || txn.type === "debit"
                                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                : "bg-red-100 text-red-700 border border-red-200"
                            }`}
                          >
                            {txn.type === 0 || txn.type === "debit" ? (
                              <ArrowUpRight className="w-3 h-3" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3" />
                            )}
                            {txn.type === 0 || txn.type === "debit"
                              ? "Debit"
                              : "Credit"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-slate-900">
                          {Math.abs(txn.amount).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-semibold">
                          {txn.currency === 0 ? "KES" : "USD"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
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
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      WhatsApp
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Balance KES
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Balance USD
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {clientBalances.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-600">No clients found</p>
                      </td>
                    </tr>
                  ) : (
                    clientBalances.map((client) => (
                      <tr
                        key={client.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-mono text-slate-600">
                            {client.id.slice(0, 8).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                          {client.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {client.whatsAppNumber || "-"}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-right text-sm font-bold ${
                            client.balanceKES >= 0
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          KES{" "}
                          {client.balanceKES.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-right text-sm font-bold ${
                            client.balanceUSD >= 0
                              ? "text-blue-600"
                              : "text-red-600"
                          }`}
                        >
                          $
                          {client.balanceUSD.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold uppercase ${
                              client.balanceType === "Credit"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {client.balanceType === "Credit" ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                            {client.balanceType}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* Account Summary Report */}
            {reportType === "accounts" && accountSummary && (
              <div className="p-6 space-y-6">
                {/* Cash Accounts */}
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-emerald-600" />
                    Cash Accounts
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {accountSummary.cashAccounts.map((account: any) => (
                      <div
                        key={account.id}
                        className="p-4 bg-emerald-50 border border-emerald-200"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-700">
                            {account.currency === 0 ? "KES" : "USD"} Account
                          </span>
                          <span className="text-lg font-bold text-emerald-700">
                            {account.currency === 0 ? "KES" : "$"}{" "}
                            {account.balance.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-3 bg-emerald-100 border border-emerald-300">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">
                        Total Cash
                      </span>
                      <div className="text-right">
                        <div className="font-bold text-emerald-700">
                          KES {accountSummary.totalCashKES.toLocaleString()}
                        </div>
                        <div className="font-bold text-blue-700">
                          ${accountSummary.totalCashUSD.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bank Accounts */}
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    Bank Accounts
                  </h4>
                  <table className="w-full border border-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-bold text-slate-700 uppercase">
                          Bank
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-slate-700 uppercase">
                          Account
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-slate-700 uppercase">
                          Currency
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-bold text-slate-700 uppercase">
                          Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {accountSummary.bankAccounts.map((account: any) => (
                        <tr key={account.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                            {account.bankName}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {account.accountNumber}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700">
                            {account.currency === 0 ? "KES" : "USD"}
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-right text-blue-700">
                            {account.currency === 0 ? "KES" : "$"}{" "}
                            {account.balance.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-blue-50 border-t-2 border-blue-200">
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-3 font-bold text-slate-900"
                        >
                          Total Bank
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="font-bold text-blue-700">
                            KES {accountSummary.totalBankKES.toLocaleString()}
                          </div>
                          <div className="font-bold text-indigo-700">
                            ${accountSummary.totalBankUSD.toLocaleString()}
                          </div>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* M-Pesa Agents */}
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-cyan-600" />
                    M-Pesa Agents
                  </h4>
                  <table className="w-full border border-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-bold text-slate-700 uppercase">
                          Agent Name
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-slate-700 uppercase">
                          Phone
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-bold text-slate-700 uppercase">
                          Balance (KES)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {accountSummary.mpesaAgents.map((agent: any) => (
                        <tr key={agent.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                            {agent.agentName}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {agent.phoneNumber}
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-right text-cyan-700">
                            KES {agent.balance.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-cyan-50 border-t-2 border-cyan-200">
                      <tr>
                        <td
                          colSpan={2}
                          className="px-4 py-3 font-bold text-slate-900"
                        >
                          Total M-Pesa
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-cyan-700">
                          KES {accountSummary.totalMpesa.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {/* Cash Flow Report */}
            {reportType === "cashflow" && accountSummary && (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-6 bg-emerald-50 border-2 border-emerald-200">
                    <h4 className="text-sm font-bold text-slate-700 uppercase mb-2">
                      Total Inflows (Debits)
                    </h4>
                    <p className="text-3xl font-bold text-emerald-700">
                      KES {statistics.totalDebits.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-6 bg-red-50 border-2 border-red-200">
                    <h4 className="text-sm font-bold text-slate-700 uppercase mb-2">
                      Total Outflows (Credits)
                    </h4>
                    <p className="text-3xl font-bold text-red-700">
                      KES {statistics.totalCredits.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-6 bg-blue-50 border-2 border-blue-200">
                    <h4 className="text-sm font-bold text-slate-700 uppercase mb-2">
                      Net Cash Flow
                    </h4>
                    <p
                      className={`text-3xl font-bold ${
                        statistics.totalRevenue >= 0
                          ? "text-blue-700"
                          : "text-red-700"
                      }`}
                    >
                      {statistics.totalRevenue >= 0 ? "+" : ""}KES{" "}
                      {statistics.totalRevenue.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 border-2 border-slate-200">
                  <h4 className="text-lg font-bold text-slate-900 mb-4">
                    Current Holdings
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-white border border-slate-200">
                      <p className="text-sm text-slate-600 mb-1">Cash KES</p>
                      <p className="text-xl font-bold text-emerald-700">
                        KES {accountSummary.totalCashKES.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-4 bg-white border border-slate-200">
                      <p className="text-sm text-slate-600 mb-1">Cash USD</p>
                      <p className="text-xl font-bold text-blue-700">
                        ${accountSummary.totalCashUSD.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-4 bg-white border border-slate-200">
                      <p className="text-sm text-slate-600 mb-1">Bank KES</p>
                      <p className="text-xl font-bold text-purple-700">
                        KES {accountSummary.totalBankKES.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-4 bg-white border border-slate-200">
                      <p className="text-sm text-slate-600 mb-1">M-Pesa</p>
                      <p className="text-xl font-bold text-cyan-700">
                        KES {accountSummary.totalMpesa.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other report types placeholder */}
            {(reportType === "exchange" || reportType === "profit") && (
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
      {reportType === "transactions" && totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center gap-2 text-sm font-semibold text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <div className="px-4 py-2 bg-slate-100 border-2 border-slate-200">
              <p className="text-sm font-semibold text-slate-700">
                Page {currentPage} of {totalPages}
              </p>
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center gap-2 text-sm font-semibold text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
