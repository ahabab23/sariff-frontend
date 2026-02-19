// import { useState, useEffect, useCallback } from "react";
// import {
//   Wallet,
//   DollarSign,
//   Search,
//   ArrowUpCircle,
//   ArrowDownCircle,
//   TrendingUp,
//   TrendingDown,
//   ChevronLeft,
//   ChevronRight,
//   Calendar,
//   X,
//   Building2,
//   FileText,
//   Download,
//   Printer,
//   Eye,
//   Filter,
//   Activity,
//   Loader2,
//   RefreshCw,
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast } from "sonner";
// import {
//   getCashAccounts,
//   getCashAccountStatement,
//   getCashStats,
//   CashAccountDto,
//   Currency,
// } from "@/lib/api";

// interface Transaction {
//   id: string;
//   date: string;
//   description: string;
//   type: "debit" | "credit";
//   currency: "KES" | "USD";
//   amount: number;
//   balance: number;
//   reference: string;
//   relatedAccount?: {
//     accountType: string;
//     accountName: string;
//     accountId: string;
//     effect: string;
//     balanceAfter: number;
//   };
// }

// interface CashStats {
//   balanceKES: number;
//   balanceUSD: number;
//   totalInKES: number;
//   totalInUSD: number;
//   totalOutKES: number;
//   totalOutUSD: number;
// }

// interface CashAccount {
//   id: string;
//   currency: "KES" | "USD";
//   balance: number;
//   openingBalance: number;
//   createdAt: string;
// }

// export function CashAtHand() {
//   // Data states
//   const [cashAccounts, setCashAccounts] = useState<CashAccount[]>([]);
//   const [stats, setStats] = useState<CashStats>({
//     balanceKES: 0,
//     balanceUSD: 0,
//     totalInKES: 0,
//     totalInUSD: 0,
//     totalOutKES: 0,
//     totalOutUSD: 0,
//   });
//   const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

//   // Loading states
//   const [isLoading, setIsLoading] = useState(true);
//   const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

//   // UI states
//   const [searchTerm, setSearchTerm] = useState("");
//   const [transactionsCurrentPage, setTransactionsCurrentPage] = useState(1);
//   const [selectedTransaction, setSelectedTransaction] =
//     useState<Transaction | null>(null);

//   // Filters
//   const [dateFilter, setDateFilter] = useState("all");
//   const [typeFilter, setTypeFilter] = useState("all");
//   const [currencyFilter, setCurrencyFilter] = useState("all");

//   // Map backend DTO to frontend CashAccount interface
//   const mapDtoToAccount = (dto: CashAccountDto): CashAccount => {
//     return {
//       id: dto.id,
//       currency: dto.currency === 0 ? "KES" : "USD",
//       balance: dto.balance,
//       openingBalance: dto.openingBalance,
//       createdAt: dto.createdAt || new Date().toISOString(),
//     };
//   };

//   // Fetch cash accounts
//   const fetchCashAccounts = useCallback(async () => {
//     try {
//       const response = await getCashAccounts();
//       if (response.success && response.data) {
//         const mappedAccounts = response.data.map(mapDtoToAccount);
//         setCashAccounts(mappedAccounts);
//       }
//     } catch (error) {
//       console.error("Error fetching cash accounts:", error);
//     }
//   }, []);

//   // Fetch cash stats
//   const fetchStats = useCallback(async () => {
//     try {
//       const response = await getCashStats();
//       if (response.success && response.data) {
//         setStats({
//           balanceKES: response.data.balanceKES || 0,
//           balanceUSD: response.data.balanceUSD || 0,
//           totalInKES: response.data.totalInKES || 0,
//           totalInUSD: response.data.totalInUSD || 0,
//           totalOutKES: response.data.totalOutKES || 0,
//           totalOutUSD: response.data.totalOutUSD || 0,
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching cash stats:", error);
//     }
//   }, []);

//   // Fetch transactions for both currencies
//   const fetchTransactions = useCallback(async () => {
//     setIsLoadingTransactions(true);
//     try {
//       // Fetch KES transactions (currency = 0)
//       const kesResponse = await getCashAccountStatement(0);
//       // Fetch USD transactions (currency = 1)
//       const usdResponse = await getCashAccountStatement(1);

//       const transactions: Transaction[] = [];

//       // Process KES transactions
//       if (kesResponse.success && kesResponse.data?.transactions) {
//         const kesTxns = kesResponse.data.transactions.map((txn: any) => ({
//           id: txn.id || txn.code,
//           date: new Date(txn.date || txn.createdAt).toLocaleString(),
//           description: txn.description || txn.narration || "Transaction",
//           type: txn.type === 0 || txn.type === "debit" ? "debit" : "credit",
//           currency: "KES" as const,
//           amount: Math.abs(txn.amount),
//           balance: txn.balanceAfter || txn.balance || 0,
//           reference: txn.reference || txn.code || "",
//           relatedAccount: txn.relatedAccount
//             ? {
//                 accountType:
//                   txn.relatedAccount.accountType ||
//                   txn.relatedAccountType ||
//                   "Unknown",
//                 accountName:
//                   txn.relatedAccount.accountName ||
//                   txn.relatedAccountName ||
//                   "Unknown",
//                 accountId:
//                   txn.relatedAccount.accountId || txn.relatedAccountId || "",
//                 effect:
//                   txn.relatedAccount.effect ||
//                   (txn.type === 0 ? "Credit" : "Debit"),
//                 balanceAfter:
//                   txn.relatedAccount.balanceAfter ||
//                   txn.relatedAccountBalanceAfter ||
//                   0,
//               }
//             : undefined,
//         }));
//         transactions.push(...kesTxns);
//       }

//       // Process USD transactions
//       if (usdResponse.success && usdResponse.data?.transactions) {
//         const usdTxns = usdResponse.data.transactions.map((txn: any) => ({
//           id: txn.id || txn.code,
//           date: new Date(txn.date || txn.createdAt).toLocaleString(),
//           description: txn.description || txn.narration || "Transaction",
//           type: txn.type === 0 || txn.type === "debit" ? "debit" : "credit",
//           currency: "USD" as const,
//           amount: Math.abs(txn.amount),
//           balance: txn.balanceAfter || txn.balance || 0,
//           reference: txn.reference || txn.code || "",
//           relatedAccount: txn.relatedAccount
//             ? {
//                 accountType:
//                   txn.relatedAccount.accountType ||
//                   txn.relatedAccountType ||
//                   "Unknown",
//                 accountName:
//                   txn.relatedAccount.accountName ||
//                   txn.relatedAccountName ||
//                   "Unknown",
//                 accountId:
//                   txn.relatedAccount.accountId || txn.relatedAccountId || "",
//                 effect:
//                   txn.relatedAccount.effect ||
//                   (txn.type === 0 ? "Credit" : "Debit"),
//                 balanceAfter:
//                   txn.relatedAccount.balanceAfter ||
//                   txn.relatedAccountBalanceAfter ||
//                   0,
//               }
//             : undefined,
//         }));
//         transactions.push(...usdTxns);
//       }

//       // Sort by date descending
//       transactions.sort(
//         (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
//       );
//       setAllTransactions(transactions);
//     } catch (error) {
//       console.error("Error fetching transactions:", error);
//       toast.error("Failed to fetch transactions");
//     } finally {
//       setIsLoadingTransactions(false);
//     }
//   }, []);

//   // Initial data fetch
//   useEffect(() => {
//     const loadData = async () => {
//       setIsLoading(true);
//       await Promise.all([
//         fetchCashAccounts(),
//         fetchStats(),
//         fetchTransactions(),
//       ]);
//       setIsLoading(false);
//     };
//     loadData();
//   }, [fetchCashAccounts, fetchStats, fetchTransactions]);

//   // Refresh all data
//   const handleRefresh = async () => {
//     setIsLoading(true);
//     await Promise.all([fetchCashAccounts(), fetchStats(), fetchTransactions()]);
//     setIsLoading(false);
//     toast.success("Data refreshed!");
//   };

//   // Use stats for summary cards
//   const kesDebit = stats.totalInKES;
//   const kesCredit = stats.totalOutKES;
//   const usdDebit = stats.totalInUSD;
//   const usdCredit = stats.totalOutUSD;

//   // Calculate net balance
//   const kesNet = kesDebit - kesCredit;
//   const usdNet = usdDebit - usdCredit;

//   // Apply filters
//   const filteredTransactions = allTransactions.filter((txn) => {
//     const matchesSearch =
//       txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       txn.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       txn.id.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesType = typeFilter === "all" || txn.type === typeFilter;
//     const matchesCurrency =
//       currencyFilter === "all" || txn.currency === currencyFilter;

//     let matchesDate = true;
//     if (dateFilter !== "all") {
//       const txnDate = new Date(txn.date);
//       const today = new Date();
//       if (dateFilter === "today") {
//         matchesDate = txnDate.toDateString() === today.toDateString();
//       } else if (dateFilter === "week") {
//         const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
//         matchesDate = txnDate >= weekAgo;
//       } else if (dateFilter === "month") {
//         matchesDate =
//           txnDate.getMonth() === today.getMonth() &&
//           txnDate.getFullYear() === today.getFullYear();
//       }
//     }

//     return matchesSearch && matchesType && matchesCurrency && matchesDate;
//   });

//   // Pagination
//   const transactionsPerPage = 15;
//   const indexOfLastTransaction = transactionsCurrentPage * transactionsPerPage;
//   const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
//   const currentTransactions = filteredTransactions.slice(
//     indexOfFirstTransaction,
//     indexOfLastTransaction
//   );
//   const totalTransactionPages = Math.ceil(
//     filteredTransactions.length / transactionsPerPage
//   );

//   const handleExport = () => {
//     toast.success("Cash at Hand statement exported successfully!");
//   };

//   const handlePrint = () => {
//     toast.success("Printing Cash at Hand statement...");
//   };

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6 flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
//           <p className="text-slate-600">Loading cash accounts...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6">
//       <div className="max-w-[1800px] mx-auto space-y-6">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
//         >
//           <div>
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent mb-2">
//               Cash at Hand
//             </h1>
//             <p className="text-slate-600 font-medium">
//               Physical cash available in the office • Main Office
//             </p>
//           </div>
//           <div className="flex gap-3">
//             <button
//               onClick={handleRefresh}
//               className="flex items-center gap-2 px-6 py-3 bg-slate-600 text-white font-bold hover:bg-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl"
//             >
//               <RefreshCw className="w-5 h-5" />
//               Refresh
//             </button>
//             <button
//               onClick={handleExport}
//               className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
//             >
//               <Download className="w-5 h-5" />
//               Export
//             </button>
//             <button
//               onClick={handlePrint}
//               className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
//             >
//               <Printer className="w-5 h-5" />
//               Print
//             </button>
//           </div>
//         </motion.div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {/* Total Debit - Both Currencies */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             whileHover={{ scale: 1.02 }}
//             className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-emerald-300 transition-all duration-300 group"
//           >
//             <div className="p-6">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="w-12 h-12 bg-emerald-100 flex items-center justify-center border-2 border-emerald-200 group-hover:bg-emerald-200 transition-colors">
//                   <TrendingUp className="w-6 h-6 text-emerald-600" />
//                 </div>
//                 <div className="bg-emerald-100 px-3 py-1 border border-emerald-200">
//                   <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
//                     Debit
//                   </span>
//                 </div>
//               </div>
//               <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
//                 Total Debit (Money In)
//               </p>

//               {/* KES Debit */}
//               <div className="mb-3">
//                 <p className="text-3xl font-bold text-emerald-600 tracking-tight mb-1">
//                   KES {kesDebit.toLocaleString()}
//                 </p>
//               </div>

//               <div className="pt-3 border-t-2 border-slate-100">
//                 {/* USD Debit */}
//                 <div className="flex items-center justify-between">
//                   <span className="text-[10px] text-slate-500 font-semibold">
//                     USD Debit
//                   </span>
//                   <span className="text-sm font-bold text-emerald-600">
//                     ${usdDebit.toLocaleString()}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </motion.div>

//           {/* Total Credit - Both Currencies */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.15 }}
//             whileHover={{ scale: 1.02 }}
//             className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-red-300 transition-all duration-300 group"
//           >
//             <div className="p-6">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="w-12 h-12 bg-red-100 flex items-center justify-center border-2 border-red-200 group-hover:bg-red-200 transition-colors">
//                   <TrendingDown className="w-6 h-6 text-red-600" />
//                 </div>
//                 <div className="bg-red-100 px-3 py-1 border border-red-200">
//                   <span className="text-[10px] font-bold text-red-700 uppercase tracking-wide">
//                     Credit
//                   </span>
//                 </div>
//               </div>
//               <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
//                 Total Credit (Money Out)
//               </p>

//               {/* KES Credit */}
//               <div className="mb-3">
//                 <p className="text-3xl font-bold text-red-600 tracking-tight mb-1">
//                   KES {kesCredit.toLocaleString()}
//                 </p>
//               </div>

//               <div className="pt-3 border-t-2 border-slate-100">
//                 {/* USD Credit */}
//                 <div className="flex items-center justify-between">
//                   <span className="text-[10px] text-slate-500 font-semibold">
//                     USD Credit
//                   </span>
//                   <span className="text-sm font-bold text-red-600">
//                     ${usdCredit.toLocaleString()}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </motion.div>

//           {/* Net Flow - Both Currencies */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             whileHover={{ scale: 1.02 }}
//             className="relative bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 text-white shadow-xl shadow-blue-500/20 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300"
//           >
//             {/* Background Pattern */}
//             <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

//             <div className="relative p-6">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="w-12 h-12 bg-white/10 backdrop-blur-sm flex items-center justify-center border-2 border-white/20">
//                   <Activity className="w-6 h-6" />
//                 </div>
//                 <div className="bg-white/20 backdrop-blur-sm px-3 py-1 border border-white/30">
//                   <span className="text-[10px] font-bold uppercase tracking-wide">
//                     Net
//                   </span>
//                 </div>
//               </div>
//               <p className="text-xs opacity-90 mb-1 uppercase tracking-wider font-semibold">
//                 Net Flow Balance
//               </p>

//               {/* KES Net Flow */}
//               <div className="mb-3">
//                 <p className="text-3xl font-bold tracking-tight mb-1">
//                   {kesNet >= 0 ? "+" : ""}KES {kesNet.toLocaleString()}
//                 </p>
//               </div>

//               <div className="pt-3 border-t border-white/20">
//                 {/* USD Net Flow */}
//                 <div className="flex items-center justify-between">
//                   <span className="text-[10px] opacity-75">USD Net</span>
//                   <span className="text-sm font-bold">
//                     {usdNet >= 0 ? "+$" : "-$"}
//                     {Math.abs(usdNet).toLocaleString()}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>

//         {/* Current Balances Card */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.25 }}
//           className="bg-white border-2 border-slate-200 shadow-lg p-6"
//         >
//           <h3 className="text-sm font-bold text-slate-700 uppercase mb-4 flex items-center gap-2">
//             <Wallet className="w-5 h-5 text-blue-600" />
//             Current Cash Balances
//           </h3>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="bg-emerald-50 border border-emerald-200 p-4">
//               <p className="text-xs text-slate-500 uppercase font-bold mb-1">
//                 KES Balance
//               </p>
//               <p className="text-2xl font-bold text-emerald-600">
//                 KES {stats.balanceKES.toLocaleString()}
//               </p>
//             </div>
//             <div className="bg-blue-50 border border-blue-200 p-4">
//               <p className="text-xs text-slate-500 uppercase font-bold mb-1">
//                 USD Balance
//               </p>
//               <p className="text-2xl font-bold text-blue-600">
//                 ${stats.balanceUSD.toLocaleString()}
//               </p>
//             </div>
//           </div>
//         </motion.div>

//         {/* Filters and Search */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//           className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-lg p-6"
//         >
//           <div className="flex items-center gap-3 mb-4">
//             <Filter className="w-5 h-5 text-slate-600" />
//             <h3 className="text-sm font-bold text-slate-700 uppercase">
//               Filters
//             </h3>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             {/* Search */}
//             <div className="md:col-span-1">
//               <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 border border-slate-200">
//                 <Search className="w-5 h-5 text-slate-400" />
//                 <input
//                   type="text"
//                   placeholder="Search..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="flex-1 outline-none text-slate-700 placeholder-slate-400 bg-transparent"
//                 />
//               </div>
//             </div>

//             {/* Date Filter */}
//             <div>
//               <select
//                 value={dateFilter}
//                 onChange={(e) => setDateFilter(e.target.value)}
//                 className="w-full px-4 py-3 border border-slate-200 bg-white text-slate-700 focus:border-blue-500 focus:outline-none"
//               >
//                 <option value="all">All Dates</option>
//                 <option value="today">Today</option>
//                 <option value="week">This Week</option>
//                 <option value="month">This Month</option>
//               </select>
//             </div>

//             {/* Type Filter */}
//             <div>
//               <select
//                 value={typeFilter}
//                 onChange={(e) => setTypeFilter(e.target.value)}
//                 className="w-full px-4 py-3 border border-slate-200 bg-white text-slate-700 focus:border-blue-500 focus:outline-none"
//               >
//                 <option value="all">All Types</option>
//                 <option value="debit">Debit (In)</option>
//                 <option value="credit">Credit (Out)</option>
//               </select>
//             </div>

//             {/* Currency Filter */}
//             <div>
//               <select
//                 value={currencyFilter}
//                 onChange={(e) => setCurrencyFilter(e.target.value)}
//                 className="w-full px-4 py-3 border border-slate-200 bg-white text-slate-700 focus:border-blue-500 focus:outline-none"
//               >
//                 <option value="all">All Currencies</option>
//                 <option value="KES">KES Only</option>
//                 <option value="USD">USD Only</option>
//               </select>
//             </div>
//           </div>
//         </motion.div>

//         {/* Transactions Table */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.5 }}
//           className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl overflow-hidden"
//         >
//           {isLoadingTransactions ? (
//             <div className="flex items-center justify-center py-12">
//               <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
//               <span className="text-slate-600">Loading transactions...</span>
//             </div>
//           ) : (
//             <>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
//                     <tr>
//                       <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
//                         Date
//                       </th>
//                       <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
//                         Reference
//                       </th>
//                       <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
//                         Description
//                       </th>
//                       <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
//                         Type
//                       </th>
//                       <th className="px-4 py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
//                         Amount
//                       </th>
//                       <th className="px-4 py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
//                         Balance
//                       </th>
//                       <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
//                         Related Account
//                       </th>
//                       <th className="px-4 py-4 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-200">
//                     {currentTransactions.length === 0 ? (
//                       <tr>
//                         <td
//                           colSpan={8}
//                           className="px-4 py-8 text-center text-slate-500"
//                         >
//                           No transactions found.
//                         </td>
//                       </tr>
//                     ) : (
//                       currentTransactions.map((txn, index) => (
//                         <motion.tr
//                           key={txn.id}
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: index * 0.02 }}
//                           className="hover:bg-blue-50/50 transition-colors"
//                         >
//                           <td className="px-4 py-4 text-sm text-slate-600 whitespace-nowrap">
//                             <div className="flex items-center gap-1.5">
//                               <Calendar className="w-3.5 h-3.5 text-slate-400" />
//                               {txn.date}
//                             </div>
//                           </td>
//                           <td className="px-4 py-4 whitespace-nowrap">
//                             <div className="flex items-center gap-1.5">
//                               <FileText className="w-3.5 h-3.5 text-slate-400" />
//                               <span className="text-sm font-semibold text-slate-700">
//                                 {txn.reference}
//                               </span>
//                             </div>
//                           </td>
//                           <td className="px-4 py-4 text-sm text-slate-900 font-semibold max-w-sm">
//                             {txn.description}
//                           </td>
//                           <td className="px-4 py-4 whitespace-nowrap">
//                             <span
//                               className={`inline-flex items-center gap-1.5 px-3 py-1 border-l-4 text-xs font-bold ${
//                                 txn.type === "debit"
//                                   ? "bg-emerald-50 text-emerald-700 border-emerald-500"
//                                   : "bg-red-50 text-red-700 border-red-500"
//                               }`}
//                             >
//                               {txn.type === "debit" ? (
//                                 <ArrowUpCircle className="w-3.5 h-3.5" />
//                               ) : (
//                                 <ArrowDownCircle className="w-3.5 h-3.5" />
//                               )}
//                               {txn.type.toUpperCase()}
//                             </span>
//                           </td>
//                           <td className="px-4 py-4 whitespace-nowrap text-right">
//                             <span
//                               className={`text-base font-bold ${
//                                 txn.type === "debit"
//                                   ? "text-emerald-600"
//                                   : "text-red-600"
//                               }`}
//                             >
//                               {txn.type === "debit" ? "+" : "-"}
//                               {txn.currency === "KES" ? "KES" : "$"}{" "}
//                               {txn.amount.toLocaleString()}
//                             </span>
//                           </td>
//                           <td className="px-4 py-4 text-base font-bold text-slate-900 whitespace-nowrap text-right">
//                             {txn.currency === "KES" ? "KES" : "$"}{" "}
//                             {txn.balance.toLocaleString()}
//                           </td>
//                           <td className="px-4 py-4">
//                             {txn.relatedAccount && (
//                               <div className="text-xs">
//                                 <div className="font-bold text-slate-900">
//                                   {txn.relatedAccount.accountName}
//                                 </div>
//                                 <div className="text-slate-600">
//                                   {txn.relatedAccount.accountType}
//                                 </div>
//                               </div>
//                             )}
//                           </td>
//                           <td className="px-4 py-4 whitespace-nowrap text-center">
//                             <button
//                               onClick={() => setSelectedTransaction(txn)}
//                               className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-all font-semibold text-sm"
//                             >
//                               <Eye className="w-4 h-4" />
//                               View
//                             </button>
//                           </td>
//                         </motion.tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination */}
//               {totalTransactionPages > 1 && (
//                 <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
//                   <div className="text-sm text-slate-600">
//                     Showing {indexOfFirstTransaction + 1} to{" "}
//                     {Math.min(
//                       indexOfLastTransaction,
//                       filteredTransactions.length
//                     )}{" "}
//                     of {filteredTransactions.length} transactions
//                   </div>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() =>
//                         setTransactionsCurrentPage((prev) =>
//                           Math.max(1, prev - 1)
//                         )
//                       }
//                       disabled={transactionsCurrentPage === 1}
//                       className="p-2 border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                     >
//                       <ChevronLeft className="w-4 h-4" />
//                     </button>
//                     <div className="flex items-center gap-1">
//                       {Array.from(
//                         { length: Math.min(5, totalTransactionPages) },
//                         (_, i) => {
//                           let pageNum;
//                           if (totalTransactionPages <= 5) {
//                             pageNum = i + 1;
//                           } else if (transactionsCurrentPage <= 3) {
//                             pageNum = i + 1;
//                           } else if (
//                             transactionsCurrentPage >=
//                             totalTransactionPages - 2
//                           ) {
//                             pageNum = totalTransactionPages - 4 + i;
//                           } else {
//                             pageNum = transactionsCurrentPage - 2 + i;
//                           }
//                           return (
//                             <button
//                               key={pageNum}
//                               onClick={() =>
//                                 setTransactionsCurrentPage(pageNum)
//                               }
//                               className={`px-4 py-2 border transition-all font-semibold text-sm ${
//                                 transactionsCurrentPage === pageNum
//                                   ? "bg-blue-600 text-white border-blue-600"
//                                   : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
//                               }`}
//                             >
//                               {pageNum}
//                             </button>
//                           );
//                         }
//                       )}
//                     </div>
//                     <button
//                       onClick={() =>
//                         setTransactionsCurrentPage((prev) =>
//                           Math.min(totalTransactionPages, prev + 1)
//                         )
//                       }
//                       disabled={
//                         transactionsCurrentPage === totalTransactionPages
//                       }
//                       className="p-2 border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                     >
//                       <ChevronRight className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </motion.div>
//       </div>

//       {/* Transaction Detail Card Modal */}
//       <AnimatePresence>
//         {selectedTransaction && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setSelectedTransaction(null)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white w-full max-w-2xl shadow-2xl"
//             >
//               {/* Card Header */}
//               <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 text-white">
//                 <div className="flex items-center justify-between mb-2">
//                   <h3 className="text-lg font-bold">Transaction Details</h3>
//                   <button
//                     onClick={() => setSelectedTransaction(null)}
//                     className="p-1.5 hover:bg-white/20 transition-colors"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//                 <p className="text-xs text-blue-100">
//                   Reference: {selectedTransaction.reference}
//                 </p>
//               </div>

//               {/* Card Body */}
//               <div className="p-6 space-y-4">
//                 {/* Transaction Amount - Highlight */}
//                 <div
//                   className={`p-4 border-l-4 ${
//                     selectedTransaction.type === "debit"
//                       ? "bg-emerald-50 border-emerald-500"
//                       : "bg-red-50 border-red-500"
//                   }`}
//                 >
//                   <p className="text-xs font-bold text-slate-500 uppercase mb-1">
//                     Transaction Amount
//                   </p>
//                   <p
//                     className={`text-3xl font-bold ${
//                       selectedTransaction.type === "debit"
//                         ? "text-emerald-600"
//                         : "text-red-600"
//                     }`}
//                   >
//                     {selectedTransaction.type === "debit" ? "+" : "-"}
//                     {selectedTransaction.currency === "KES" ? "KES" : "$"}{" "}
//                     {selectedTransaction.amount.toLocaleString()}
//                   </p>
//                   <p className="text-xs text-slate-600 mt-1">
//                     Balance After:{" "}
//                     {selectedTransaction.currency === "KES" ? "KES" : "$"}{" "}
//                     {selectedTransaction.balance.toLocaleString()}
//                   </p>
//                 </div>

//                 {/* Grid Info */}
//                 <div className="grid grid-cols-2 gap-3">
//                   <div className="bg-slate-50 p-3 border border-slate-200">
//                     <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">
//                       Transaction ID
//                     </p>
//                     <p className="text-sm font-bold text-slate-900">
//                       {selectedTransaction.id}
//                     </p>
//                   </div>
//                   <div className="bg-slate-50 p-3 border border-slate-200">
//                     <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">
//                       Date & Time
//                     </p>
//                     <p className="text-sm font-bold text-slate-900">
//                       {selectedTransaction.date}
//                     </p>
//                   </div>
//                   <div
//                     className={`p-3 border ${
//                       selectedTransaction.type === "debit"
//                         ? "bg-emerald-50 border-emerald-200"
//                         : "bg-red-50 border-red-200"
//                     }`}
//                   >
//                     <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">
//                       Type
//                     </p>
//                     <p
//                       className={`text-sm font-bold ${
//                         selectedTransaction.type === "debit"
//                           ? "text-emerald-700"
//                           : "text-red-700"
//                       }`}
//                     >
//                       {selectedTransaction.type.toUpperCase()} (
//                       {selectedTransaction.type === "debit"
//                         ? "Money In"
//                         : "Money Out"}
//                       )
//                     </p>
//                   </div>
//                   <div className="bg-slate-50 p-3 border border-slate-200">
//                     <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">
//                       Currency
//                     </p>
//                     <p className="text-sm font-bold text-slate-900">
//                       {selectedTransaction.currency}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Description */}
//                 <div className="bg-blue-50 p-3 border border-blue-200">
//                   <p className="text-[10px] font-bold text-blue-700 uppercase mb-1">
//                     Description
//                   </p>
//                   <p className="text-sm font-semibold text-slate-900">
//                     {selectedTransaction.description}
//                   </p>
//                 </div>

//                 {/* Related Account */}
//                 {selectedTransaction.relatedAccount && (
//                   <div className="bg-purple-50 border border-purple-200 p-3">
//                     <p className="text-[10px] font-bold text-purple-700 uppercase mb-2">
//                       Related Account (Double-Entry)
//                     </p>
//                     <div className="grid grid-cols-2 gap-2 text-xs">
//                       <div>
//                         <p className="text-slate-600">Account Type</p>
//                         <p className="font-bold text-slate-900">
//                           {selectedTransaction.relatedAccount.accountType}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-slate-600">Account Name</p>
//                         <p className="font-bold text-slate-900">
//                           {selectedTransaction.relatedAccount.accountName}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-slate-600">Effect</p>
//                         <p
//                           className={`font-bold ${
//                             selectedTransaction.relatedAccount.effect ===
//                             "Debit"
//                               ? "text-emerald-600"
//                               : "text-red-600"
//                           }`}
//                         >
//                           {selectedTransaction.relatedAccount.effect}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-slate-600">Balance After</p>
//                         <p className="font-bold text-slate-900">
//                           {selectedTransaction.currency === "KES" ? "KES" : "$"}{" "}
//                           {selectedTransaction.relatedAccount.balanceAfter.toLocaleString()}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Card Footer */}
//               <div className="border-t border-slate-200 bg-slate-50 p-4">
//                 <button
//                   onClick={() => setSelectedTransaction(null)}
//                   className="w-full px-4 py-2.5 bg-slate-700 text-white hover:bg-slate-800 transition-all font-semibold text-sm"
//                 >
//                   Close
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
import { useState, useEffect, useCallback } from "react";
import {
  Wallet,
  DollarSign,
  Search,
  ArrowUpCircle,
  ArrowDownCircle,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  X,
  Building2,
  FileText,
  Download,
  Printer,
  Eye,
  Filter,
  Activity,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  getCashAccounts,
  getCashAccountStatement,
  getCashStats,
  CashAccountDto,
  Currency,
  getAccountTypeLabel,
} from "@/lib/api";

// Updated Transaction interface to match backend StatementLineDto
interface Transaction {
  id: string;
  code: string;
  date: string;
  reference: string;
  description: string;
  transactionType: number;
  thisAccountAction: string; // "Debit" or "Credit"
  debit: number | null;
  credit: number | null;
  amount: number;
  currency: number;
  balanceBefore: number;
  balanceAfter: number;
  exchangeRate?: number;
  counterAmount?: number;
  counterCurrency?: number;
  notes?: string;
  reconciliationStatus: number;
  relatedAccount?: {
    accountId: string;
    accountType: number;
    accountName: string;
    accountCode: string;
    currency: number;
    action: string;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    clientCode?: string;
    clientPhone?: string;
  };
}

// Updated CashStats interface to match backend CashStatsDto
interface CashStats {
  balanceKES: number;
  openingBalanceKES: number;
  totalDebitKES: number;
  totalCreditKES: number;
  netMovementKES: number;
  balanceUSD: number;
  openingBalanceUSD: number;
  totalDebitUSD: number;
  totalCreditUSD: number;
  netMovementUSD: number;
}

// Updated CashAccount interface to match backend CashAccountDto
interface CashAccount {
  id: string;
  currency: number;
  balance: number;
  openingBalance: number;
  totalDebit: number;
  totalCredit: number;
  netMovement: number;
  createdAt: string;
}

export function CashAtHand() {
  // Data states
  const [cashAccounts, setCashAccounts] = useState<CashAccount[]>([]);
  const [stats, setStats] = useState<CashStats>({
    balanceKES: 0,
    openingBalanceKES: 0,
    totalDebitKES: 0,
    totalCreditKES: 0,
    netMovementKES: 0,
    balanceUSD: 0,
    openingBalanceUSD: 0,
    totalDebitUSD: 0,
    totalCreditUSD: 0,
    netMovementUSD: 0,
  });
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

  // UI states
  const [searchTerm, setSearchTerm] = useState("");
  const [transactionsCurrentPage, setTransactionsCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  // Filters
  const [dateFilter, setDateFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currencyFilter, setCurrencyFilter] = useState("all");

  // Map backend DTO to frontend CashAccount interface
  const mapDtoToAccount = (dto: any): CashAccount => {
    return {
      id: dto.id,
      currency: dto.currency,
      balance: dto.balance,
      openingBalance: dto.openingBalance,
      totalDebit: dto.totalDebit || 0,
      totalCredit: dto.totalCredit || 0,
      netMovement: dto.netMovement || 0,
      createdAt: dto.createdAt || new Date().toISOString(),
    };
  };

  // Map backend transaction to frontend Transaction interface
  const mapTransactionToDisplay = (txn: any, currency: number): Transaction => {
    return {
      id: txn.transactionId || txn.id || "",
      code: txn.transactionCode || txn.code || "",
      date: txn.date || txn.transactionDate || txn.createdAt || "",
      reference: txn.reference || txn.transactionCode || "",
      description: txn.description || "",
      transactionType: txn.transactionType ?? 0,
      thisAccountAction: txn.thisAccountAction || "",
      debit: txn.debit ?? null,
      credit: txn.credit ?? null,
      amount: txn.amount ?? 0,
      currency: txn.currency ?? currency,
      balanceBefore: txn.balanceBefore ?? 0,
      balanceAfter: txn.balanceAfter ?? 0,
      exchangeRate: txn.exchangeRate,
      counterAmount: txn.counterAmount,
      counterCurrency: txn.counterCurrency,
      notes: txn.notes,
      reconciliationStatus: txn.reconciliationStatus ?? 0,
      relatedAccount: txn.relatedAccount
        ? {
            accountId: txn.relatedAccount.accountId || "",
            accountType: txn.relatedAccount.accountType ?? 0,
            accountName: txn.relatedAccount.accountName || "Unknown Account",
            accountCode: txn.relatedAccount.accountCode || "",
            currency: txn.relatedAccount.currency ?? 0,
            action: txn.relatedAccount.action || "",
            amount: txn.relatedAccount.amount ?? 0,
            balanceBefore: txn.relatedAccount.balanceBefore ?? 0,
            balanceAfter: txn.relatedAccount.balanceAfter ?? 0,
            clientCode: txn.relatedAccount.clientCode,
            clientPhone: txn.relatedAccount.clientPhone,
          }
        : undefined,
    };
  };

  // Fetch cash accounts
  const fetchCashAccounts = useCallback(async () => {
    try {
      const response = await getCashAccounts();
      if (response.success && response.data) {
        const mappedAccounts = response.data.map(mapDtoToAccount);
        setCashAccounts(mappedAccounts);
      }
    } catch (error) {
      console.error("Error fetching cash accounts:", error);
    }
  }, []);

  // Fetch cash stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await getCashStats();
      if (response.success && response.data) {
        setStats({
          balanceKES: response.data.balanceKES || 0,
          openingBalanceKES: response.data.openingBalanceKES || 0,
          totalDebitKES: response.data.totalDebitKES || 0,
          totalCreditKES: response.data.totalCreditKES || 0,
          netMovementKES: response.data.netMovementKES || 0,
          balanceUSD: response.data.balanceUSD || 0,
          openingBalanceUSD: response.data.openingBalanceUSD || 0,
          totalDebitUSD: response.data.totalDebitUSD || 0,
          totalCreditUSD: response.data.totalCreditUSD || 0,
          netMovementUSD: response.data.netMovementUSD || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching cash stats:", error);
    }
  }, []);

  // Fetch transactions for both currencies
  const fetchTransactions = useCallback(async () => {
    setIsLoadingTransactions(true);
    try {
      // Fetch KES transactions (currency = 0)
      const kesResponse = await getCashAccountStatement(0);
      // Fetch USD transactions (currency = 1)
      const usdResponse = await getCashAccountStatement(1);

      const transactions: Transaction[] = [];

      // Process KES transactions
      if (kesResponse.success && kesResponse.data?.transactions) {
        const kesTxns = kesResponse.data.transactions.map((txn: any) =>
          mapTransactionToDisplay(txn, 0)
        );
        transactions.push(...kesTxns);
      }

      // Process USD transactions
      if (usdResponse.success && usdResponse.data?.transactions) {
        const usdTxns = usdResponse.data.transactions.map((txn: any) =>
          mapTransactionToDisplay(txn, 1)
        );
        transactions.push(...usdTxns);
      }

      // Sort by date descending
      transactions.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setAllTransactions(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to fetch transactions");
    } finally {
      setIsLoadingTransactions(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchCashAccounts(),
        fetchStats(),
        fetchTransactions(),
      ]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchCashAccounts, fetchStats, fetchTransactions]);

  // Refresh all data
  const handleRefresh = async () => {
    setIsLoading(true);
    await Promise.all([fetchCashAccounts(), fetchStats(), fetchTransactions()]);
    setIsLoading(false);
    toast.success("Data refreshed!");
  };

  // Get currency label helper
  const getCurrencySymbol = (currency: number): string => {
    return currency === 0 ? "KES" : "$";
  };

  const getCurrencyName = (currency: number): string => {
    return currency === 0 ? "KES" : "USD";
  };

  // Apply filters
  const filteredTransactions = allTransactions.filter((txn) => {
    const matchesSearch =
      txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.code.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by thisAccountAction (Debit = Money In, Credit = Money Out for Cash account)
    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "debit" && txn.thisAccountAction === "Debit") ||
      (typeFilter === "credit" && txn.thisAccountAction === "Credit");

    const matchesCurrency =
      currencyFilter === "all" ||
      (currencyFilter === "KES" && txn.currency === 0) ||
      (currencyFilter === "USD" && txn.currency === 1);

    let matchesDate = true;
    if (dateFilter !== "all") {
      const txnDate = new Date(txn.date);
      const today = new Date();
      if (dateFilter === "today") {
        matchesDate = txnDate.toDateString() === today.toDateString();
      } else if (dateFilter === "week") {
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = txnDate >= weekAgo;
      } else if (dateFilter === "month") {
        matchesDate =
          txnDate.getMonth() === today.getMonth() &&
          txnDate.getFullYear() === today.getFullYear();
      }
    }

    return matchesSearch && matchesType && matchesCurrency && matchesDate;
  });

  // Pagination
  const transactionsPerPage = 15;
  const indexOfLastTransaction = transactionsCurrentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const totalTransactionPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
  );

  const handleExport = () => {
    toast.success("Cash at Hand statement exported successfully!");
  };

  const handlePrint = () => {
    toast.success("Printing Cash at Hand statement...");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading cash accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent mb-2">
              Cash at Hand
            </h1>
            <p className="text-slate-600 font-medium">
              Physical cash available in the office • Main Office
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-6 py-3 bg-slate-600 text-white font-bold hover:bg-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Download className="w-5 h-5" />
              Export
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Printer className="w-5 h-5" />
              Print
            </button>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Debit - Both Currencies (Money In) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-emerald-300 transition-all duration-300 group"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-100 flex items-center justify-center border-2 border-emerald-200 group-hover:bg-emerald-200 transition-colors">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="bg-emerald-100 px-3 py-1 border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
                    Debit
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
                Total Debit (Money In)
              </p>

              {/* KES Debit */}
              <div className="mb-3">
                <p className="text-3xl font-bold text-emerald-600 tracking-tight mb-1">
                  KES {stats.totalDebitKES.toLocaleString()}
                </p>
              </div>

              <div className="pt-3 border-t-2 border-slate-100">
                {/* USD Debit */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-semibold">
                    USD Debit
                  </span>
                  <span className="text-sm font-bold text-emerald-600">
                    ${stats.totalDebitUSD.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Total Credit - Both Currencies (Money Out) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-red-300 transition-all duration-300 group"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 flex items-center justify-center border-2 border-red-200 group-hover:bg-red-200 transition-colors">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
                <div className="bg-red-100 px-3 py-1 border border-red-200">
                  <span className="text-[10px] font-bold text-red-700 uppercase tracking-wide">
                    Credit
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
                Total Credit (Money Out)
              </p>

              {/* KES Credit */}
              <div className="mb-3">
                <p className="text-3xl font-bold text-red-600 tracking-tight mb-1">
                  KES {stats.totalCreditKES.toLocaleString()}
                </p>
              </div>

              <div className="pt-3 border-t-2 border-slate-100">
                {/* USD Credit */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-semibold">
                    USD Credit
                  </span>
                  <span className="text-sm font-bold text-red-600">
                    ${stats.totalCreditUSD.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Net Movement - Both Currencies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="relative bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 text-white shadow-xl shadow-blue-500/20 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm flex items-center justify-center border-2 border-white/20">
                  <Activity className="w-6 h-6" />
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 border border-white/30">
                  <span className="text-[10px] font-bold uppercase tracking-wide">
                    Net
                  </span>
                </div>
              </div>
              <p className="text-xs opacity-90 mb-1 uppercase tracking-wider font-semibold">
                Net Movement
              </p>

              {/* KES Net Movement */}
              <div className="mb-3">
                <p className="text-3xl font-bold tracking-tight mb-1">
                  {stats.netMovementKES >= 0 ? "+" : ""}KES{" "}
                  {stats.netMovementKES.toLocaleString()}
                </p>
              </div>

              <div className="pt-3 border-t border-white/20">
                {/* USD Net Movement */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] opacity-75">USD Net</span>
                  <span className="text-sm font-bold">
                    {stats.netMovementUSD >= 0 ? "+$" : "-$"}
                    {Math.abs(stats.netMovementUSD).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Current Balances Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white border-2 border-slate-200 shadow-lg p-6"
        >
          <h3 className="text-sm font-bold text-slate-700 uppercase mb-4 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-blue-600" />
            Current Cash Balances
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 p-4">
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">
                KES Balance
              </p>
              <p className="text-2xl font-bold text-emerald-600">
                KES {stats.balanceKES.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Opening: KES {stats.openingBalanceKES.toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 p-4">
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">
                USD Balance
              </p>
              <p className="text-2xl font-bold text-blue-600">
                ${stats.balanceUSD.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Opening: ${stats.openingBalanceUSD.toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-slate-600" />
            <h3 className="text-sm font-bold text-slate-700 uppercase">
              Filters
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 border border-slate-200">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 outline-none text-slate-700 placeholder-slate-400 bg-transparent"
                />
              </div>
            </div>

            {/* Date Filter */}
            <div>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 bg-white text-slate-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 bg-white text-slate-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="debit">Debit (In)</option>
                <option value="credit">Credit (Out)</option>
              </select>
            </div>

            {/* Currency Filter */}
            <div>
              <select
                value={currencyFilter}
                onChange={(e) => setCurrencyFilter(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 bg-white text-slate-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Currencies</option>
                <option value="KES">KES Only</option>
                <option value="USD">USD Only</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Transactions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl overflow-hidden"
        >
          {isLoadingTransactions ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
              <span className="text-slate-600">Loading transactions...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                    <tr>
                      <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Reference
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-4 py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Debit (In)
                      </th>
                      <th className="px-4 py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Credit (Out)
                      </th>
                      <th className="px-4 py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Balance
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Related Account
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {currentTransactions.length === 0 ? (
                      <tr>
                        <td
                          colSpan={9}
                          className="px-4 py-8 text-center text-slate-500"
                        >
                          No transactions found.
                        </td>
                      </tr>
                    ) : (
                      currentTransactions.map((txn, index) => (
                        <motion.tr
                          key={txn.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.02 }}
                          className="hover:bg-blue-50/50 transition-colors"
                        >
                          <td className="px-4 py-4 text-sm text-slate-600 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {new Date(txn.date).toLocaleString()}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-sm font-semibold text-slate-700">
                                {txn.reference || txn.code}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-900 font-semibold max-w-sm">
                            {txn.description}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 border-l-4 text-xs font-bold ${
                                txn.thisAccountAction === "Debit"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-500"
                                  : "bg-red-50 text-red-700 border-red-500"
                              }`}
                            >
                              {txn.thisAccountAction === "Debit" ? (
                                <ArrowUpCircle className="w-3.5 h-3.5" />
                              ) : (
                                <ArrowDownCircle className="w-3.5 h-3.5" />
                              )}
                              {txn.thisAccountAction}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right">
                            {txn.debit !== null ? (
                              <span className="text-base font-bold text-emerald-600">
                                +{getCurrencySymbol(txn.currency)}{" "}
                                {txn.debit.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right">
                            {txn.credit !== null ? (
                              <span className="text-base font-bold text-red-600">
                                -{getCurrencySymbol(txn.currency)}{" "}
                                {txn.credit.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-base font-bold text-slate-900 whitespace-nowrap text-right">
                            {getCurrencySymbol(txn.currency)}{" "}
                            {txn.balanceAfter.toLocaleString()}
                          </td>
                          <td className="px-4 py-4">
                            {txn.relatedAccount && (
                              <div className="text-xs">
                                <div className="font-bold text-slate-900">
                                  {txn.relatedAccount.accountName}
                                </div>
                                <div className="text-slate-600">
                                  {getAccountTypeLabel(
                                    txn.relatedAccount.accountType
                                  )}{" "}
                                  • {txn.relatedAccount.action}
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <button
                              onClick={() => setSelectedTransaction(txn)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-all font-semibold text-sm"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalTransactionPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
                  <div className="text-sm text-slate-600">
                    Showing {indexOfFirstTransaction + 1} to{" "}
                    {Math.min(
                      indexOfLastTransaction,
                      filteredTransactions.length
                    )}{" "}
                    of {filteredTransactions.length} transactions
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setTransactionsCurrentPage((prev) =>
                          Math.max(1, prev - 1)
                        )
                      }
                      disabled={transactionsCurrentPage === 1}
                      className="p-2 border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(5, totalTransactionPages) },
                        (_, i) => {
                          let pageNum;
                          if (totalTransactionPages <= 5) {
                            pageNum = i + 1;
                          } else if (transactionsCurrentPage <= 3) {
                            pageNum = i + 1;
                          } else if (
                            transactionsCurrentPage >=
                            totalTransactionPages - 2
                          ) {
                            pageNum = totalTransactionPages - 4 + i;
                          } else {
                            pageNum = transactionsCurrentPage - 2 + i;
                          }
                          return (
                            <button
                              key={pageNum}
                              onClick={() =>
                                setTransactionsCurrentPage(pageNum)
                              }
                              className={`px-4 py-2 border transition-all font-semibold text-sm ${
                                transactionsCurrentPage === pageNum
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                    </div>
                    <button
                      onClick={() =>
                        setTransactionsCurrentPage((prev) =>
                          Math.min(totalTransactionPages, prev + 1)
                        )
                      }
                      disabled={
                        transactionsCurrentPage === totalTransactionPages
                      }
                      className="p-2 border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>

      {/* Transaction Detail Card Modal */}
      <AnimatePresence>
        {selectedTransaction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTransaction(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-2xl shadow-2xl"
            >
              {/* Card Header */}
              <div
                className={`p-4 text-white ${
                  selectedTransaction.thisAccountAction === "Debit"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600"
                    : "bg-gradient-to-r from-red-600 to-rose-600"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                      {selectedTransaction.thisAccountAction === "Debit" ? (
                        <ArrowUpCircle className="w-5 h-5" />
                      ) : (
                        <ArrowDownCircle className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Transaction Details</h3>
                      <p className="text-xs opacity-80">
                        {selectedTransaction.thisAccountAction === "Debit"
                          ? "Cash Received (Money In)"
                          : "Cash Paid Out (Money Out)"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTransaction(null)}
                    className="p-1.5 hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs opacity-80">
                  Reference:{" "}
                  {selectedTransaction.reference || selectedTransaction.code}
                </p>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                {/* Transaction Amount - Highlight */}
                <div
                  className={`p-4 border-l-4 ${
                    selectedTransaction.thisAccountAction === "Debit"
                      ? "bg-emerald-50 border-emerald-500"
                      : "bg-red-50 border-red-500"
                  }`}
                >
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                    Transaction Amount
                  </p>
                  <p
                    className={`text-3xl font-bold ${
                      selectedTransaction.thisAccountAction === "Debit"
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedTransaction.thisAccountAction === "Debit"
                      ? "+"
                      : "-"}
                    {getCurrencySymbol(selectedTransaction.currency)}{" "}
                    {selectedTransaction.amount.toLocaleString()}
                  </p>
                  <div className="flex gap-4 mt-2 text-xs text-slate-600">
                    <span>
                      Balance Before:{" "}
                      {getCurrencySymbol(selectedTransaction.currency)}{" "}
                      {selectedTransaction.balanceBefore.toLocaleString()}
                    </span>
                    <span>→</span>
                    <span className="font-bold">
                      Balance After:{" "}
                      {getCurrencySymbol(selectedTransaction.currency)}{" "}
                      {selectedTransaction.balanceAfter.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Debit/Credit Breakdown */}
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className={`p-3 border ${
                      selectedTransaction.debit !== null
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Debit (Money In)
                    </p>
                    <p
                      className={`text-lg font-bold ${
                        selectedTransaction.debit !== null
                          ? "text-emerald-600"
                          : "text-slate-400"
                      }`}
                    >
                      {selectedTransaction.debit !== null
                        ? `+${getCurrencySymbol(
                            selectedTransaction.currency
                          )} ${selectedTransaction.debit.toLocaleString()}`
                        : "-"}
                    </p>
                  </div>
                  <div
                    className={`p-3 border ${
                      selectedTransaction.credit !== null
                        ? "bg-red-50 border-red-200"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Credit (Money Out)
                    </p>
                    <p
                      className={`text-lg font-bold ${
                        selectedTransaction.credit !== null
                          ? "text-red-600"
                          : "text-slate-400"
                      }`}
                    >
                      {selectedTransaction.credit !== null
                        ? `-${getCurrencySymbol(
                            selectedTransaction.currency
                          )} ${selectedTransaction.credit.toLocaleString()}`
                        : "-"}
                    </p>
                  </div>
                </div>

                {/* Grid Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 border border-slate-200">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Transaction Code
                    </p>
                    <p className="text-sm font-bold text-slate-900 font-mono">
                      {selectedTransaction.code}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 border border-slate-200">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Date & Time
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {new Date(selectedTransaction.date).toLocaleString()}
                    </p>
                  </div>
                  <div
                    className={`p-3 border ${
                      selectedTransaction.thisAccountAction === "Debit"
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Account Action
                    </p>
                    <p
                      className={`text-sm font-bold ${
                        selectedTransaction.thisAccountAction === "Debit"
                          ? "text-emerald-700"
                          : "text-red-700"
                      }`}
                    >
                      {selectedTransaction.thisAccountAction} (
                      {selectedTransaction.thisAccountAction === "Debit"
                        ? "Money In"
                        : "Money Out"}
                      )
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 border border-slate-200">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Currency
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {getCurrencyName(selectedTransaction.currency)}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-blue-50 p-3 border border-blue-200">
                  <p className="text-[10px] font-bold text-blue-700 uppercase mb-1">
                    Description
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedTransaction.description}
                  </p>
                </div>

                {/* Notes if present */}
                {selectedTransaction.notes && (
                  <div className="bg-amber-50 p-3 border border-amber-200">
                    <p className="text-[10px] font-bold text-amber-700 uppercase mb-1">
                      Notes
                    </p>
                    <p className="text-sm text-slate-900">
                      {selectedTransaction.notes}
                    </p>
                  </div>
                )}

                {/* Related Account (Double-Entry) */}
                {selectedTransaction.relatedAccount && (
                  <div className="bg-purple-50 border border-purple-200 p-4">
                    <p className="text-[10px] font-bold text-purple-700 uppercase mb-3">
                      Related Account (Double-Entry Counterpart)
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-white p-2 border border-purple-100">
                        <p className="text-slate-500 mb-1">Account Type</p>
                        <p className="font-bold text-slate-900">
                          {getAccountTypeLabel(
                            selectedTransaction.relatedAccount.accountType
                          )}
                        </p>
                      </div>
                      <div className="bg-white p-2 border border-purple-100">
                        <p className="text-slate-500 mb-1">Account Name</p>
                        <p className="font-bold text-slate-900">
                          {selectedTransaction.relatedAccount.accountName}
                        </p>
                      </div>
                      <div className="bg-white p-2 border border-purple-100">
                        <p className="text-slate-500 mb-1">Account Code</p>
                        <p className="font-bold text-slate-900 font-mono">
                          {selectedTransaction.relatedAccount.accountCode}
                        </p>
                      </div>
                      <div
                        className={`p-2 border ${
                          selectedTransaction.relatedAccount.action === "Debit"
                            ? "bg-emerald-50 border-emerald-200"
                            : "bg-red-50 border-red-200"
                        }`}
                      >
                        <p className="text-slate-500 mb-1">Action</p>
                        <p
                          className={`font-bold ${
                            selectedTransaction.relatedAccount.action ===
                            "Debit"
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {selectedTransaction.relatedAccount.action}
                        </p>
                      </div>
                      <div className="bg-white p-2 border border-purple-100">
                        <p className="text-slate-500 mb-1">Amount</p>
                        <p className="font-bold text-slate-900">
                          {getCurrencySymbol(
                            selectedTransaction.relatedAccount.currency
                          )}{" "}
                          {selectedTransaction.relatedAccount.amount.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-white p-2 border border-purple-100">
                        <p className="text-slate-500 mb-1">Balance After</p>
                        <p className="font-bold text-slate-900">
                          {getCurrencySymbol(
                            selectedTransaction.relatedAccount.currency
                          )}{" "}
                          {selectedTransaction.relatedAccount.balanceAfter.toLocaleString()}
                        </p>
                      </div>
                      {selectedTransaction.relatedAccount.clientCode && (
                        <div className="bg-white p-2 border border-purple-100">
                          <p className="text-slate-500 mb-1">Client Code</p>
                          <p className="font-bold text-slate-900 font-mono">
                            {selectedTransaction.relatedAccount.clientCode}
                          </p>
                        </div>
                      )}
                      {selectedTransaction.relatedAccount.clientPhone && (
                        <div className="bg-white p-2 border border-purple-100">
                          <p className="text-slate-500 mb-1">Client Phone</p>
                          <p className="font-bold text-slate-900">
                            {selectedTransaction.relatedAccount.clientPhone}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="border-t border-slate-200 bg-slate-50 p-4">
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="w-full px-4 py-2.5 bg-slate-700 text-white hover:bg-slate-800 transition-all font-semibold text-sm"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
