// import { useState, useEffect } from "react";
// import Link from "next/link";
// import {
//   LayoutDashboard,
//   Users,
//   Wallet,
//   FileText,
//   BarChart3,
//   Settings,
//   LogOut,
//   Smartphone,
//   DollarSign,
//   ArrowUpCircle,
//   ArrowDownCircle,
//   Menu,
//   Plus,
//   Calendar,
//   Clock,
//   Eye,
//   RefreshCw,
//   Building2,
//   Repeat,
//   Receipt,
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast } from "sonner";
// import { ClientManagement } from "./office/ClientManagement";
// import { TransactionForm } from "./office/TransactionForm";
// import { Reconciliation } from "./office/Reconciliation";
// import InvoiceManagement from "./office/InvoiceManagement";
// import { Reports } from "./office/Reports";
// import { BankAccounts } from "./office/BankAccounts";
// import { MPesaAccounts } from "./office/MPesaAccounts";
// import { ExchangeSection } from "./office/ExchangeSection";
// import { OfficeSettings } from "./office/OfficeSettings";
// import { CashAtHand } from "./office/CashAtHand";
// import { ExpensesAccount } from "./office/ExpensesAccount";
// import {
//   getDashboardStats,
//   getRecentTransactions,
//   getCurrentExchangeRate,
//   DashboardStatsDto,
//   TransactionDto,
//   getTransactionTypeLabel,
//   getCurrencyLabel,
// } from "@/lib/api";
// import { useAuth } from "@/providers/AuthProvider";

// interface OfficeUserDashboardProps {
//   userName: string;
//   onLogout: () => void;
//   activeTab?: string;
// }

// interface DashboardStats {
//   cash: { kes: number; usd: number };
//   banks: { kes: number; usd: number };
//   mpesa: { total: number };
//   exchange: { kes: number; usd: number };
//   clients: { kes: number; usd: number };
//   walkin: { kes: number; usd: number };
//   daily: {
//     credits: number;
//     debits: number;
//     net: number;
//     byCurrency: {
//       kes: { credits: number; debits: number; net: number };
//       usd: { credits: number; debits: number; net: number };
//     };
//   };
//   totalAccounts: number;
//   totalTransactions: number;
//   todayTransactions: number;
// }

// interface Transaction {
//   id: string;
//   type: string;
//   amount: number;
//   currency: string;
//   description: string;
//   date: string;
//   createdAt: string;
//   primaryAccountName: string;
//   secondaryName: string;
// }

// export function OfficeUserDashboard({
//   userName,
//   onLogout,
//   activeTab: initialTab = "dashboard",
// }: OfficeUserDashboardProps) {
//   const [activeTab, setActiveTab] = useState(initialTab);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // NEW: for mobile drawer
//   const [showTransactionForm, setShowTransactionForm] = useState(false);
//   const [stats, setStats] = useState<DashboardStats | null>(null);
//   const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
//     []
//   );
//   const [loading, setLoading] = useState(true);
//   const [conversionCurrency, setConversionCurrency] = useState<"KES" | "USD">(
//     "USD"
//   );
//   const [exchangeRate, setExchangeRate] = useState(137.5);
//   const [profileImage, setProfileImage] = useState<string | null>(null);
//   const { user } = useAuth();
//   useEffect(() => {
//     setActiveTab(initialTab);
//   }, [initialTab]);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);

//       // Fetch dashboard stats from .NET backend
//       const statsResult = await getDashboardStats();
//       console.log(statsResult);

//       if (statsResult.success && statsResult.data) {
//         setStats(statsResult.data);
//       } else {
//         // Set default stats if API fails
//         setStats({
//           cash: { kes: 0, usd: 0 },
//           banks: { kes: 0, usd: 0 },
//           mpesa: { total: 0 },
//           exchange: { kes: 0, usd: 0 },
//           clients: { kes: 0, usd: 0 },
//           walkin: { kes: 0, usd: 0 },
//           daily: {
//             credits: 0,
//             debits: 0,
//             net: 0,
//             byCurrency: {
//               kes: { credits: 0, debits: 0, net: 0 },
//               usd: { credits: 0, debits: 0, net: 0 },
//             },
//           },
//           totalAccounts: 0,
//           totalTransactions: 0,
//           todayTransactions: 0,
//         });
//       }

//       // Fetch recent transactions
//       const transactionsResult = await getRecentTransactions();
//       if (transactionsResult.success && transactionsResult.data) {
//         // Map backend transaction format to component format
//         const mappedTransactions = transactionsResult.data.map(
//           (t: TransactionDto) => ({
//             id: t.code,
//             type: getTransactionTypeLabel(t.transactionType),
//             amount: t.amount,
//             currency: getCurrencyLabel(t.currency),
//             description: t.description,
//             date: t.createdAt,
//             createdAt: t.createdAt,
//             primaryAccountName: t.sourceAccountName || "N/A",
//             secondaryName: t.destAccountName || "N/A",
//           })
//         );
//         setRecentTransactions(mappedTransactions);
//       }

//       // Fetch current exchange rate
//       const rateResult = await getCurrentExchangeRate();
//       if (rateResult.success && rateResult.data) {
//         // Use average of buy and sell rate
//         const avgRate =
//           (rateResult.data.buyRate + rateResult.data.sellRate) / 2;
//         setExchangeRate(avgRate);
//       }
//     } catch (error) {
//       console.error("Error fetching dashboard data:", error);
//       toast.error("Failed to load dashboard data. Using default values.");
//       // Set default stats on error
//       setStats({
//         cash: { kes: 0, usd: 0 },
//         banks: { kes: 0, usd: 0 },
//         mpesa: { total: 0 },
//         exchange: { kes: 0, usd: 0 },
//         clients: { kes: 0, usd: 0 },
//         walkin: { kes: 0, usd: 0 },
//         daily: {
//           credits: 0,
//           debits: 0,
//           net: 0,
//           byCurrency: {
//             kes: { credits: 0, debits: 0, net: 0 },
//             usd: { credits: 0, debits: 0, net: 0 },
//           },
//         },
//         totalAccounts: 0,
//         totalTransactions: 0,
//         todayTransactions: 0,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//     // Refresh every 30 seconds
//     const interval = setInterval(fetchDashboardData, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   const handleTransactionSuccess = () => {
//     fetchDashboardData();
//   };
//   // console.log(user);
//   // Get time-based greeting
//   const getGreeting = () => {
//     const hour = new Date().getHours();
//     if (hour < 12) return "Good Morning";
//     if (hour < 18) return "Good Afternoon";
//     return "Good Evening";
//   };

//   // Calculate total in single currency
//   const calculateTotalInCurrency = () => {
//     if (!stats) return 0;

//     const kesTotal =
//       (stats.cash?.kes || 0) +
//       (stats.banks?.kes || 0) +
//       (stats.mpesa?.total || 0) +
//       (stats.exchange?.kes || 0);
//     const usdTotal =
//       (stats.cash?.usd || 0) +
//       (stats.banks?.usd || 0) +
//       (stats.exchange?.usd || 0);

//     if (conversionCurrency === "USD") {
//       return usdTotal + kesTotal / exchangeRate;
//     } else {
//       return kesTotal + usdTotal * exchangeRate;
//     }
//   };

//   const menuItems = [
//     {
//       id: "dashboard",
//       label: "Dashboard",
//       icon: LayoutDashboard,
//       href: "/office/dashboard",
//     },
//     { id: "clients", label: "Clients", icon: Users, href: "/office/clients" },
//     {
//       id: "cash-at-hand",
//       label: "Cash at Hand",
//       icon: Wallet,
//       href: "/office/cash",
//     },
//     {
//       id: "banks",
//       label: "Bank Accounts",
//       icon: Building2,
//       href: "/office/banks",
//     },
//     { id: "mpesa", label: "M-Pesa", icon: Smartphone, href: "/office/mpesa" },
//     {
//       id: "expenses",
//       label: "Expenses",
//       icon: Receipt,
//       href: "/office/expenses",
//     },
//     {
//       id: "exchange",
//       label: "Exchange",
//       icon: Repeat,
//       href: "/office/exchange",
//     },
//     {
//       id: "reconciliation",
//       label: "Reconciliation",
//       icon: FileText,
//       href: "/office/reconciliation",
//     },
//     {
//       id: "invoices",
//       label: "Invoices",
//       icon: FileText,
//       href: "/office/invoices",
//     },
//     {
//       id: "reports",
//       label: "Reports",
//       icon: BarChart3,
//       href: "/office/reports",
//     },
//     {
//       id: "settings",
//       label: "Settings",
//       icon: Settings,
//       href: "/office/settings",
//     },
//   ];
//   console.log(recentTransactions);
//   console.log(user);
//   const renderContent = () => {
//     switch (activeTab) {
//       case "clients":
//         return <ClientManagement />;
//       case "cash-at-hand":
//         return <CashAtHand />;
//       case "banks":
//         return <BankAccounts />;
//       case "mpesa":
//         return <MPesaAccounts />;
//       case "expenses":
//         return <ExpensesAccount />;
//       case "exchange":
//         return <ExchangeSection />;
//       case "reconciliation":
//         return <Reconciliation />;
//       case "invoices":
//         return <InvoiceManagement />;
//       case "reports":
//         return <Reports />;
//       case "settings":
//         return (
//           <OfficeSettings
//             userName={userName}
//             profileImage={profileImage}
//             onProfileImageChange={setProfileImage}
//           />
//         );
//       case "dashboard":
//       default:
//         return renderDashboard();
//     }
//   };

//   const renderDashboard = () => {
//     if (loading) {
//       return (
//         <div className="flex items-center justify-center h-96">
//           <div className="text-center">
//             <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
//             <p className="text-slate-600 font-medium">Loading dashboard...</p>
//           </div>
//         </div>
//       );
//     }

//     if (!stats) {
//       return (
//         <div className="flex items-center justify-center h-96">
//           <p className="text-slate-600">No data available</p>
//         </div>
//       );
//     }

//     return (
//       <div className="space-y-6">
//         {/* Header with Actions */}
//         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
//           <div>
//             <h2 className="text-2xl font-bold text-slate-900">
//               Dashboard Overview
//             </h2>
//             <p className="text-sm text-slate-600 mt-1">
//               Real-time financial overview and insights
//             </p>
//           </div>
//           <div className="flex gap-3">
//             <button
//               onClick={fetchDashboardData}
//               className="px-4 py-2 bg-white border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all flex items-center gap-2 text-sm font-semibold text-slate-700"
//             >
//               <RefreshCw className="w-4 h-4" />
//               Refresh
//             </button>
//             <button
//               onClick={() => setShowTransactionForm(true)}
//               className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2"
//             >
//               <Plus className="w-4 h-4" />
//               New Transaction
//             </button>
//           </div>
//         </div>

//         {/* Main Balance Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           {/* Cash at Hand - KES */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 p-6 shadow-xl hover:shadow-2xl transition-all border border-emerald-400/30"
//           >
//             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
//             <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>

//             <div className="relative">
//               <div className="flex items-center justify-between mb-3">
//                 <div className="w-10 h-10 bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30">
//                   <Wallet className="w-5 h-5 text-white" />
//                 </div>
//                 <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider">
//                   Cash - KES
//                 </span>
//               </div>
//               <div className="mb-1">
//                 <div className="text-2xl lg:text-3xl font-bold text-white">
//                   {(stats.cash?.kes || 0).toLocaleString("en-US", {
//                     minimumFractionDigits: 0,
//                     maximumFractionDigits: 0,
//                   })}
//                 </div>
//                 <div className="text-emerald-100 text-sm font-medium">
//                   Kenyan Shillings
//                 </div>
//               </div>
//             </div>
//           </motion.div>

//           {/* Cash at Hand - USD */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 p-6 shadow-xl hover:shadow-2xl transition-all border border-blue-400/30"
//           >
//             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
//             <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>

//             <div className="relative">
//               <div className="flex items-center justify-between mb-3">
//                 <div className="w-10 h-10 bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30">
//                   <DollarSign className="w-5 h-5 text-white" />
//                 </div>
//                 <span className="text-xs font-bold text-blue-100 uppercase tracking-wider">
//                   Cash - USD
//                 </span>
//               </div>
//               <div className="mb-1">
//                 <div className="text-2xl lg:text-3xl font-bold text-white">
//                   {(stats.cash?.usd || 0).toLocaleString("en-US", {
//                     minimumFractionDigits: 2,
//                     maximumFractionDigits: 2,
//                   })}
//                 </div>
//                 <div className="text-blue-100 text-sm font-medium">
//                   US Dollars
//                 </div>
//               </div>
//             </div>
//           </motion.div>

//           {/* M-Pesa Total */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-700 p-6 shadow-xl hover:shadow-2xl transition-all border border-green-500/30"
//           >
//             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
//             <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>

//             <div className="relative">
//               <div className="flex items-center justify-between mb-3">
//                 <div className="w-10 h-10 bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30">
//                   <Smartphone className="w-5 h-5 text-white" />
//                 </div>
//                 <span className="text-xs font-bold text-green-100 uppercase tracking-wider">
//                   M-Pesa
//                 </span>
//               </div>
//               <div className="mb-1">
//                 <div className="text-2xl lg:text-3xl font-bold text-white">
//                   {(stats.mpesa?.total || 0).toLocaleString("en-US", {
//                     minimumFractionDigits: 0,
//                     maximumFractionDigits: 0,
//                   })}
//                 </div>
//                 <div className="text-green-100 text-sm font-medium">
//                   All Agents (KES)
//                 </div>
//               </div>
//             </div>
//           </motion.div>

//           {/* Total Converted */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//             className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600 p-6 shadow-xl hover:shadow-2xl transition-all border border-purple-500/30"
//           >
//             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
//             <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>

//             <div className="relative">
//               <div className="flex items-center justify-between mb-3">
//                 <div className="w-10 h-10 bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30">
//                   <Repeat className="w-5 h-5 text-white" />
//                 </div>
//                 <select
//                   value={conversionCurrency}
//                   onChange={(e) =>
//                     setConversionCurrency(e.target.value as "KES" | "USD")
//                   }
//                   className="text-xs font-bold text-purple-100 bg-white/10 border border-white/30 px-2 py-1 uppercase tracking-wider"
//                 >
//                   <option value="USD">Convert to USD</option>
//                   <option value="KES">Convert to KES</option>
//                 </select>
//               </div>
//               <div className="mb-1">
//                 <div className="text-2xl lg:text-3xl font-bold text-white">
//                   {calculateTotalInCurrency().toLocaleString("en-US", {
//                     minimumFractionDigits: 2,
//                     maximumFractionDigits: 2,
//                   })}
//                 </div>
//                 <div className="text-purple-100 text-sm font-medium">
//                   Total in {conversionCurrency} @{" "}
//                   {conversionCurrency === "USD"
//                     ? exchangeRate
//                     : (1 / exchangeRate).toFixed(4)}
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>

//         {/* Bank Accounts Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//           {/* Banks KES */}
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.5 }}
//             className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 p-6 shadow-lg hover:shadow-xl transition-all"
//           >
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
//                   <Building2 className="w-6 h-6 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-bold text-slate-900">
//                     Total Banks - KES
//                   </h3>
//                   <p className="text-xs text-slate-600">
//                     All bank accounts combined
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="text-3xl lg:text-4xl font-bold text-cyan-600 mb-2">
//               {(stats.banks?.kes || 0).toLocaleString("en-US", {
//                 minimumFractionDigits: 0,
//                 maximumFractionDigits: 0,
//               })}
//             </div>
//             <div className="text-sm text-slate-600 font-medium">
//               Kenyan Shillings
//             </div>
//           </motion.div>

//           {/* Banks USD */}
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.6 }}
//             className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 p-6 shadow-lg hover:shadow-xl transition-all"
//           >
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
//                   <Building2 className="w-6 h-6 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-bold text-slate-900">
//                     Total Banks - USD
//                   </h3>
//                   <p className="text-xs text-slate-600">
//                     All bank accounts combined
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="text-3xl lg:text-4xl font-bold text-indigo-600 mb-2">
//               {(stats.banks?.usd || 0).toLocaleString("en-US", {
//                 minimumFractionDigits: 2,
//                 maximumFractionDigits: 2,
//               })}
//             </div>
//             <div className="text-sm text-slate-600 font-medium">US Dollars</div>
//           </motion.div>
//         </div>

//         {/* Daily Transactions Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.7 }}
//           className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 p-6 shadow-lg"
//         >
//           <h3 className="text-xl font-bold text-slate-900 mb-6 flex flex-col sm:flex-row sm:items-center gap-2">
//             <span className="flex items-center gap-2">
//               <Calendar className="w-6 h-6 text-blue-600" />
//               Today's Transactions
//             </span>
//             <span className="text-sm font-normal text-slate-600 sm:ml-auto">
//               {new Date().toLocaleDateString("en-US", {
//                 weekday: "long",
//                 year: "numeric",
//                 month: "long",
//                 day: "numeric",
//               })}
//             </span>
//           </h3>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//             {/* KES Daily Flow */}
//             <div className="space-y-4">
//               <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
//                 <div className="w-6 h-6 bg-emerald-100 flex items-center justify-center">
//                   <span className="text-emerald-700 font-bold text-xs">
//                     KES
//                   </span>
//                 </div>
//                 Kenyan Shillings
//               </h4>

//               <div className="grid grid-cols-2 gap-3">
//                 <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 p-4">
//                   <div className="flex items-center gap-2 mb-2">
//                     <ArrowUpCircle className="w-5 h-5 text-emerald-600" />
//                     <span className="text-xs font-bold text-emerald-700 uppercase">
//                       Debits In
//                     </span>
//                   </div>
//                   <div className="text-xl lg:text-2xl font-bold text-emerald-700">
//                     {(stats.daily?.byCurrency?.kes?.debits || 0).toLocaleString(
//                       "en-US",
//                       { minimumFractionDigits: 0 }
//                     )}
//                   </div>
//                 </div>

//                 <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 p-4">
//                   <div className="flex items-center gap-2 mb-2">
//                     <ArrowDownCircle className="w-5 h-5 text-red-600" />
//                     <span className="text-xs font-bold text-red-700 uppercase">
//                       Credits Out
//                     </span>
//                   </div>
//                   <div className="text-xl lg:text-2xl font-bold text-red-700">
//                     {(
//                       stats.daily?.byCurrency?.kes?.credits || 0
//                     ).toLocaleString("en-US", { minimumFractionDigits: 0 })}
//                   </div>
//                 </div>
//               </div>

//               <div
//                 className={`p-4 border-2 ${
//                   (stats.daily?.byCurrency?.kes?.net || 0) >= 0
//                     ? "bg-emerald-50 border-emerald-300"
//                     : "bg-red-50 border-red-300"
//                 }`}
//               >
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-bold text-slate-700">
//                     Net Flow (KES)
//                   </span>
//                   <div
//                     className={`text-xl lg:text-2xl font-bold ${
//                       (stats.daily?.byCurrency?.kes?.net || 0) >= 0
//                         ? "text-emerald-700"
//                         : "text-red-700"
//                     }`}
//                   >
//                     {(stats.daily?.byCurrency?.kes?.net || 0) >= 0 ? "+" : ""}
//                     {(stats.daily?.byCurrency?.kes?.net || 0).toLocaleString(
//                       "en-US",
//                       { minimumFractionDigits: 0 }
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* USD Daily Flow */}
//             <div className="space-y-4">
//               <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
//                 <div className="w-6 h-6 bg-blue-100 flex items-center justify-center">
//                   <span className="text-blue-700 font-bold text-xs">USD</span>
//                 </div>
//                 US Dollars
//               </h4>

//               <div className="grid grid-cols-2 gap-3">
//                 <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 p-4">
//                   <div className="flex items-center gap-2 mb-2">
//                     <ArrowUpCircle className="w-5 h-5 text-blue-600" />
//                     <span className="text-xs font-bold text-blue-700 uppercase">
//                       Debits In
//                     </span>
//                   </div>
//                   <div className="text-xl lg:text-2xl font-bold text-blue-700">
//                     {(stats.daily?.byCurrency?.usd?.debits || 0).toLocaleString(
//                       "en-US",
//                       { minimumFractionDigits: 2 }
//                     )}
//                   </div>
//                 </div>

//                 <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 p-4">
//                   <div className="flex items-center gap-2 mb-2">
//                     <ArrowDownCircle className="w-5 h-5 text-orange-600" />
//                     <span className="text-xs font-bold text-orange-700 uppercase">
//                       Credits Out
//                     </span>
//                   </div>
//                   <div className="text-xl lg:text-2xl font-bold text-orange-700">
//                     {(
//                       stats.daily?.byCurrency?.usd?.credits || 0
//                     ).toLocaleString("en-US", { minimumFractionDigits: 2 })}
//                   </div>
//                 </div>
//               </div>

//               <div
//                 className={`p-4 border-2 ${
//                   (stats.daily?.byCurrency?.usd?.net || 0) >= 0
//                     ? "bg-blue-50 border-blue-300"
//                     : "bg-orange-50 border-orange-300"
//                 }`}
//               >
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-bold text-slate-700">
//                     Net Flow (USD)
//                   </span>
//                   <div
//                     className={`text-xl lg:text-2xl font-bold ${
//                       (stats.daily?.byCurrency?.usd?.net || 0) >= 0
//                         ? "text-blue-700"
//                         : "text-orange-700"
//                     }`}
//                   >
//                     {(stats.daily?.byCurrency?.usd?.net || 0) >= 0 ? "+" : ""}
//                     {(stats.daily?.byCurrency?.usd?.net || 0).toLocaleString(
//                       "en-US",
//                       { minimumFractionDigits: 2 }
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Transaction Count */}
//           <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-200 p-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-slate-700 flex items-center justify-center">
//                   <FileText className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <div className="text-sm font-bold text-slate-700">
//                     Transactions Today
//                   </div>
//                   <div className="text-xs text-slate-600">
//                     Total processed transactions
//                   </div>
//                 </div>
//               </div>
//               <div className="text-3xl lg:text-4xl font-bold text-slate-900">
//                 {stats.todayTransactions}
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Currency Converter Tool */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.8 }}
//           className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 p-6 shadow-lg"
//         >
//           <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
//             <Repeat className="w-5 h-5 text-amber-600" />
//             Quick Currency Converter
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                 Exchange Rate
//               </label>
//               <input
//                 type="number"
//                 value={exchangeRate}
//                 onChange={(e) =>
//                   setExchangeRate(parseFloat(e.target.value) || 0)
//                 }
//                 className="w-full px-4 py-3 border-2 border-amber-300 bg-white text-slate-900 font-bold text-lg"
//                 step="0.01"
//               />
//               <p className="text-xs text-slate-600 mt-1">
//                 1 USD = {exchangeRate} KES
//               </p>
//             </div>
//             <div>
//               <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                 All Cash in USD
//               </label>
//               <div className="px-4 py-3 bg-white border-2 border-blue-300 text-blue-700 font-bold text-xl lg:text-2xl">
//                 $
//                 {(
//                   ((stats.cash?.kes || 0) +
//                     (stats.banks?.kes || 0) +
//                     (stats.mpesa?.total || 0)) /
//                     exchangeRate +
//                   (stats.cash?.usd || 0) +
//                   (stats.banks?.usd || 0)
//                 ).toLocaleString("en-US", { minimumFractionDigits: 2 })}
//               </div>
//             </div>
//             <div>
//               <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                 All Cash in KES
//               </label>
//               <div className="px-4 py-3 bg-white border-2 border-emerald-300 text-emerald-700 font-bold text-xl lg:text-2xl">
//                 KES{" "}
//                 {(
//                   ((stats.cash?.usd || 0) + (stats.banks?.usd || 0)) *
//                     exchangeRate +
//                   (stats.cash?.kes || 0) +
//                   (stats.banks?.kes || 0) +
//                   (stats.mpesa?.total || 0)
//                 ).toLocaleString("en-US", { minimumFractionDigits: 2 })}
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Recent Transactions Table */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.9 }}
//           className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 shadow-lg overflow-hidden"
//         >
//           <div className="p-6 border-b-2 border-slate-200 flex items-center justify-between">
//             <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
//               <Clock className="w-5 h-5 text-blue-600" />
//               Recent Transactions
//             </h3>
//             <button
//               onClick={() => setActiveTab("transactions")}
//               className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
//             >
//               View All
//               <Eye className="w-4 h-4" />
//             </button>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-slate-50 border-b-2 border-slate-200">
//                   <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                     ID
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                     Description
//                   </th>

//                   <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                     Account Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                     Type
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                     Payment Method
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                     Amount
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                     Date
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                     Status
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-slate-100">
//                 {recentTransactions?.slice(0, 10).map((txn) => (
//                   <tr
//                     key={txn.id}
//                     className="hover:bg-slate-50 transition-colors"
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-900">
//                       {txn.id}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-slate-900 font-medium max-w-xs truncate">
//                       {txn.description}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-slate-900 font-medium max-w-xs truncate">
//                       {txn.primaryAccountName}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold uppercase ${
//                           txn.type === "Debit (Money In)"
//                             ? "bg-emerald-100 text-emerald-700"
//                             : "bg-red-100 text-red-700"
//                         }`}
//                       >
//                         {txn.type === "Debit (Money In)" ? (
//                           <ArrowUpCircle className="w-3 h-3" />
//                         ) : (
//                           <ArrowDownCircle className="w-3 h-3" />
//                         )}
//                         {txn.type}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-slate-900 font-medium max-w-xs truncate">
//                       {txn.secondaryName}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm font-bold text-slate-900">
//                         {txn.currency}{" "}
//                         {txn.amount.toLocaleString("en-US", {
//                           minimumFractionDigits: 2,
//                         })}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
//                       {new Date(txn.date).toLocaleDateString("en-US", {
//                         month: "short",
//                         day: "numeric",
//                         year: "numeric",
//                       })}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase">
//                         Completed
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </motion.div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30">
//       {/* Desktop Sidebar - Hidden on Mobile */}
//       <motion.aside
//         initial={false}
//         animate={{ width: sidebarOpen ? 280 : 80 }}
//         className="hidden lg:block bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border-r border-slate-700/50 fixed left-0 top-0 h-screen z-50 overflow-hidden"
//       >
//         {/* Decorative gradient overlay */}
//         <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-600/10 pointer-events-none"></div>

//         {/* Logo */}
//         <div className="relative p-6 border-b border-slate-700/50">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-lg shadow-lg">
//               {userName[0]}
//             </div>
//             {sidebarOpen && (
//               <div>
//                 <h1 className="font-bold text-xl">
//                   {userName.trim().split(" ")[0]}
//                 </h1>
//                 <p className="text-xs text-slate-400">
//                   {userName.trim().split(" ").slice(1).join(" ")}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* User Greeting */}
//         <div className="relative p-6 border-b border-slate-700/50">
//           {sidebarOpen ? (
//             <div>
//               <p className="text-xs text-cyan-400 font-medium mb-1">
//                 {getGreeting()}
//               </p>
//               <div className="font-bold text-lg text-white">
//                 {user?.ownerName}
//               </div>
//             </div>
//           ) : (
//             <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-sm mx-auto">
//               {userName
//                 .split(" ")
//                 .map((n) => n[0])
//                 .join("")}
//             </div>
//           )}
//         </div>

//         {/* Navigation */}
//         <nav
//           className="relative flex-1 overflow-y-auto py-4"
//           style={{ maxHeight: "calc(100vh - 340px)" }}
//         >
//           {menuItems.map((item) => (
//             <Link
//               key={item.id}
//               href={item.href}
//               className={`w-full flex items-center gap-3 px-6 py-3 transition-all ${
//                 activeTab === item.id
//                   ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg border-l-4 border-cyan-400"
//                   : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
//               }`}
//             >
//               <item.icon className="w-5 h-5 flex-shrink-0" />
//               {sidebarOpen && (
//                 <span className="text-sm font-medium">{item.label}</span>
//               )}
//             </Link>
//           ))}
//         </nav>

//         {/* Sidebar Toggle & Logout - Fixed at Bottom */}
//         <div className="relative p-4 border-t border-slate-700/50 space-y-2">
//           <button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="w-full flex items-center gap-3 px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 transition-all"
//           >
//             <Menu className="w-5 h-5" />
//             {sidebarOpen && (
//               <span className="text-sm font-medium">Collapse</span>
//             )}
//           </button>
//           <button
//             onClick={onLogout}
//             className="w-full flex items-center gap-3 px-4 py-3 bg-red-600/80 hover:bg-red-600 transition-all"
//           >
//             <LogOut className="w-5 h-5" />
//             {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
//           </button>
//         </div>
//       </motion.aside>

//       {/* Mobile Top Header - Only visible on mobile */}
//       <header className="lg:hidden sticky top-0 z-40 backdrop-blur-xl bg-white/95 border-b-2 border-slate-200 shadow-lg">
//         <div className="flex items-center justify-between h-16 px-4">
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="p-2 hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 transition-all"
//             >
//               <Menu className="w-6 h-6 text-slate-700" />
//             </button>
//             <div className="flex items-center gap-2">
//               <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-bold shadow-lg">
//                 S
//               </div>
//               <div>
//                 <h1 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
//                   Sarif
//                 </h1>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               onClick={fetchDashboardData}
//               className="p-2 hover:bg-blue-50 transition-all"
//             >
//               <RefreshCw className="w-5 h-5 text-slate-600" />
//             </button>
//             <button
//               onClick={() => setShowTransactionForm(true)}
//               className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg transition-all"
//             >
//               <Plus className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Mobile Sidebar Drawer */}
//       <AnimatePresence>
//         {mobileMenuOpen && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
//               onClick={() => setMobileMenuOpen(false)}
//             />
//             <motion.aside
//               initial={{ x: -320 }}
//               animate={{ x: 0 }}
//               exit={{ x: -320 }}
//               transition={{ type: "spring", damping: 25, stiffness: 200 }}
//               className="fixed left-0 top-0 bottom-0 w-80 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white z-50 lg:hidden shadow-2xl overflow-y-auto"
//             >
//               {/* Decorative gradient overlay */}
//               <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-600/10 pointer-events-none"></div>

//               {/* Mobile Header */}
//               <div className="relative p-6 border-b border-slate-700/50">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-lg shadow-lg">
//                       S
//                     </div>
//                     <div>
//                       <h1 className="font-bold text-xl">Sarif</h1>
//                       <p className="text-xs text-slate-400">Money Exchange</p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => setMobileMenuOpen(false)}
//                     className="p-2 hover:bg-slate-700/50 transition-all"
//                   >
//                     <Menu className="w-5 h-5" />
//                   </button>
//                 </div>

//                 {/* User Info */}
//                 <div className="mt-4">
//                   <p className="text-xs text-cyan-400 font-medium mb-1">
//                     {getGreeting()}
//                   </p>
//                   <div className="font-bold text-lg text-white">{userName}</div>
//                   <p className="text-xs text-slate-400 mt-1">Office User</p>
//                 </div>
//               </div>

//               {/* Mobile Navigation */}
//               <nav className="relative p-4 space-y-2">
//                 {menuItems.map((item) => (
//                   <Link
//                     key={item.id}
//                     href={item.href}
//                     onClick={() => {
//                       setActiveTab(item.id);
//                       setMobileMenuOpen(false);
//                     }}
//                     className={`w-full flex items-center gap-3 px-4 py-3.5 font-semibold transition-all relative overflow-hidden ${
//                       activeTab === item.id
//                         ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
//                         : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
//                     }`}
//                   >
//                     <item.icon className="w-5 h-5 relative z-10" />
//                     <span className="relative z-10">{item.label}</span>
//                   </Link>
//                 ))}
//               </nav>

//               {/* Mobile Footer */}
//               <div className="relative p-4 mt-auto border-t border-slate-700/50">
//                 <button
//                   onClick={onLogout}
//                   className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-600/90 hover:bg-red-600 transition-all font-semibold"
//                 >
//                   <LogOut className="w-5 h-5" />
//                   <span>Logout</span>
//                 </button>
//               </div>
//             </motion.aside>
//           </>
//         )}
//       </AnimatePresence>

//       {/* Main Content - With proper left margin */}
//       <motion.main
//         initial={false}
//         animate={{ marginLeft: sidebarOpen ? 280 : 80 }}
//         transition={{ duration: 0.3, ease: "easeInOut" }}
//         className="min-h-screen lg:block hidden"
//       >
//         <div className="max-w-[1600px] mx-auto p-4 sm:p-8">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={activeTab}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.2 }}
//             >
//               {renderContent()}
//             </motion.div>
//           </AnimatePresence>
//         </div>
//       </motion.main>

//       {/* Mobile Main Content - No margin */}
//       <main className="lg:hidden min-h-screen">
//         <div className="max-w-[1600px] mx-auto p-4">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={activeTab}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.2 }}
//             >
//               {renderContent()}
//             </motion.div>
//           </AnimatePresence>
//         </div>
//       </main>

//       {/* Transaction Form Modal */}
//       <AnimatePresence>
//         {showTransactionForm && (
//           <TransactionForm
//             onClose={() => setShowTransactionForm(false)}
//             onSuccess={handleTransactionSuccess}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Wallet,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Smartphone,
  DollarSign,
  ArrowUpCircle,
  ArrowDownCircle,
  Menu,
  Plus,
  Calendar,
  Clock,
  Eye,
  RefreshCw,
  Building2,
  Repeat,
  Receipt,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ClientManagement } from "./office/ClientManagement";
import { TransactionForm } from "./office/TransactionForm";
import { Reconciliation } from "./office/Reconciliation";
import InvoiceManagement from "./office/InvoiceManagement";
import { Reports } from "./office/Reports";
import { BankAccounts } from "./office/BankAccounts";
import { MPesaAccounts } from "./office/MPesaAccounts";
import { ExchangeSection } from "./office/ExchangeSection";
import { OfficeSettings } from "./office/OfficeSettings";
import { CashAtHand } from "./office/CashAtHand";
import { ExpensesAccount } from "./office/ExpensesAccount";
import {
  getDashboardStats,
  getRecentTransactions,
  getCurrentExchangeRate,
  DashboardStatsDto,
  TransactionDto,
  getTransactionTypeLabel,
  getCurrencyLabel,
} from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";

interface OfficeUserDashboardProps {
  userName: string;
  onLogout: () => void;
  activeTab?: string;
}

interface DashboardStats {
  cash: { kes: number; usd: number };
  banks: { kes: number; usd: number };
  mpesa: { total: number };
  exchange: { kes: number; usd: number };
  clients: { kes: number; usd: number };
  walkin: { kes: number; usd: number };
  daily: {
    credits: number;
    debits: number;
    net: number;
    byCurrency: {
      kes: { credits: number; debits: number; net: number };
      usd: { credits: number; debits: number; net: number };
    };
  };
  totalAccounts: number;
  totalTransactions: number;
  todayTransactions: number;
}

interface Transaction {
  id: string;
  type: string;
  transactionType: number; // 0 = Debit, 1 = Credit
  amount: number;
  currency: string;
  description: string;
  date: string;
  createdAt: string;
  primaryAccountName: string;
  primaryAccountType: number; // Account type (3 = Client)
  secondaryName: string;
}

export function OfficeUserDashboard({
  userName,
  onLogout,
  activeTab: initialTab = "dashboard",
}: OfficeUserDashboardProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // NEW: for mobile drawer
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [conversionCurrency, setConversionCurrency] = useState<"KES" | "USD">(
    "USD"
  );
  const [exchangeRate, setExchangeRate] = useState(137.5);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { user } = useAuth();
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch dashboard stats from .NET backend
      const statsResult = await getDashboardStats();
      console.log(statsResult);

      if (statsResult.success && statsResult.data) {
        setStats(statsResult.data);
      } else {
        // Set default stats if API fails
        setStats({
          cash: { kes: 0, usd: 0 },
          banks: { kes: 0, usd: 0 },
          mpesa: { total: 0 },
          exchange: { kes: 0, usd: 0 },
          clients: { kes: 0, usd: 0 },
          walkin: { kes: 0, usd: 0 },
          daily: {
            credits: 0,
            debits: 0,
            net: 0,
            byCurrency: {
              kes: { credits: 0, debits: 0, net: 0 },
              usd: { credits: 0, debits: 0, net: 0 },
            },
          },
          totalAccounts: 0,
          totalTransactions: 0,
          todayTransactions: 0,
        });
      }

      // Fetch recent transactions
      const transactionsResult = await getRecentTransactions();
      if (transactionsResult.success && transactionsResult.data) {
        // Map backend transaction format to component format
        const mappedTransactions = transactionsResult.data.map(
          (t: TransactionDto) => ({
            id: t.code,
            type: getTransactionTypeLabel(t.transactionType),
            transactionType: t.transactionType,
            amount: t.amount,
            currency: getCurrencyLabel(t.currency),
            description: t.description,
            date: t.createdAt,
            createdAt: t.createdAt,
            primaryAccountName: t.sourceAccountName || "N/A",
            primaryAccountType: t.sourceAccountType ?? 0,
            secondaryName: t.destAccountName || "N/A",
          })
        );
        setRecentTransactions(mappedTransactions);
      }

      // Fetch current exchange rate
      const rateResult = await getCurrentExchangeRate();
      if (rateResult.success && rateResult.data) {
        // Use average of buy and sell rate
        const avgRate =
          (rateResult.data.buyRate + rateResult.data.sellRate) / 2;
        setExchangeRate(avgRate);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data. Using default values.");
      // Set default stats on error
      setStats({
        cash: { kes: 0, usd: 0 },
        banks: { kes: 0, usd: 0 },
        mpesa: { total: 0 },
        exchange: { kes: 0, usd: 0 },
        clients: { kes: 0, usd: 0 },
        walkin: { kes: 0, usd: 0 },
        daily: {
          credits: 0,
          debits: 0,
          net: 0,
          byCurrency: {
            kes: { credits: 0, debits: 0, net: 0 },
            usd: { credits: 0, debits: 0, net: 0 },
          },
        },
        totalAccounts: 0,
        totalTransactions: 0,
        todayTransactions: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleTransactionSuccess = () => {
    fetchDashboardData();
  };
  // console.log(user);
  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Calculate total in single currency
  const calculateTotalInCurrency = () => {
    if (!stats) return 0;

    const kesTotal =
      (stats.cash?.kes || 0) +
      (stats.banks?.kes || 0) +
      (stats.mpesa?.total || 0) +
      (stats.exchange?.kes || 0);
    const usdTotal =
      (stats.cash?.usd || 0) +
      (stats.banks?.usd || 0) +
      (stats.exchange?.usd || 0);

    if (conversionCurrency === "USD") {
      return usdTotal + kesTotal / exchangeRate;
    } else {
      return kesTotal + usdTotal * exchangeRate;
    }
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/office/dashboard",
    },
    { id: "clients", label: "Clients", icon: Users, href: "/office/clients" },
    {
      id: "cash-at-hand",
      label: "Cash at Hand",
      icon: Wallet,
      href: "/office/cash",
    },
    {
      id: "banks",
      label: "Bank Accounts",
      icon: Building2,
      href: "/office/banks",
    },
    { id: "mpesa", label: "M-Pesa", icon: Smartphone, href: "/office/mpesa" },
    {
      id: "expenses",
      label: "Expenses",
      icon: Receipt,
      href: "/office/expenses",
    },
    {
      id: "exchange",
      label: "Exchange",
      icon: Repeat,
      href: "/office/exchange",
    },
    {
      id: "reconciliation",
      label: "Reconciliation",
      icon: FileText,
      href: "/office/reconciliation",
    },
    {
      id: "invoices",
      label: "Invoices",
      icon: FileText,
      href: "/office/invoices",
    },
    {
      id: "reports",
      label: "Reports",
      icon: BarChart3,
      href: "/office/reports",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/office/settings",
    },
  ];
  console.log(recentTransactions);
  console.log(user);
  const renderContent = () => {
    switch (activeTab) {
      case "clients":
        return <ClientManagement />;
      case "cash-at-hand":
        return <CashAtHand />;
      case "banks":
        return <BankAccounts />;
      case "mpesa":
        return <MPesaAccounts />;
      case "expenses":
        return <ExpensesAccount />;
      case "exchange":
        return <ExchangeSection />;
      case "reconciliation":
        return <Reconciliation />;
      case "invoices":
        return <InvoiceManagement />;
      case "reports":
        return <Reports />;
      case "settings":
        return (
          <OfficeSettings
            userName={userName}
            profileImage={profileImage}
            onProfileImageChange={setProfileImage}
          />
        );
      case "dashboard":
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Loading dashboard...</p>
          </div>
        </div>
      );
    }

    if (!stats) {
      return (
        <div className="flex items-center justify-center h-96">
          <p className="text-slate-600">No data available</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Dashboard Overview
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Real-time financial overview and insights
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-white border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all flex items-center gap-2 text-sm font-semibold text-slate-700"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={() => setShowTransactionForm(true)}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Transaction
            </button>
          </div>
        </div>

        {/* Main Balance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Cash at Hand - KES */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 p-6 shadow-xl hover:shadow-2xl transition-all border border-emerald-400/30"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>

            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider">
                  Cash - KES
                </span>
              </div>
              <div className="mb-1">
                <div className="text-2xl lg:text-3xl font-bold text-white">
                  {(stats.cash?.kes || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </div>
                <div className="text-emerald-100 text-sm font-medium">
                  Kenyan Shillings
                </div>
              </div>
            </div>
          </motion.div>

          {/* Cash at Hand - USD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 p-6 shadow-xl hover:shadow-2xl transition-all border border-blue-400/30"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>

            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-bold text-blue-100 uppercase tracking-wider">
                  Cash - USD
                </span>
              </div>
              <div className="mb-1">
                <div className="text-2xl lg:text-3xl font-bold text-white">
                  {(stats.cash?.usd || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="text-blue-100 text-sm font-medium">
                  US Dollars
                </div>
              </div>
            </div>
          </motion.div>

          {/* M-Pesa Total */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-700 p-6 shadow-xl hover:shadow-2xl transition-all border border-green-500/30"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>

            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-bold text-green-100 uppercase tracking-wider">
                  M-Pesa
                </span>
              </div>
              <div className="mb-1">
                <div className="text-2xl lg:text-3xl font-bold text-white">
                  {(stats.mpesa?.total || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </div>
                <div className="text-green-100 text-sm font-medium">
                  All Agents (KES)
                </div>
              </div>
            </div>
          </motion.div>

          {/* Total Converted */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600 p-6 shadow-xl hover:shadow-2xl transition-all border border-purple-500/30"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>

            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30">
                  <Repeat className="w-5 h-5 text-white" />
                </div>
                <select
                  value={conversionCurrency}
                  onChange={(e) =>
                    setConversionCurrency(e.target.value as "KES" | "USD")
                  }
                  className="text-xs font-bold text-purple-100 bg-white/10 border border-white/30 px-2 py-1 uppercase tracking-wider"
                >
                  <option value="USD">Convert to USD</option>
                  <option value="KES">Convert to KES</option>
                </select>
              </div>
              <div className="mb-1">
                <div className="text-2xl lg:text-3xl font-bold text-white">
                  {calculateTotalInCurrency().toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="text-purple-100 text-sm font-medium">
                  Total in {conversionCurrency} @{" "}
                  {conversionCurrency === "USD"
                    ? exchangeRate
                    : (1 / exchangeRate).toFixed(4)}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bank Accounts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Banks KES */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Total Banks - KES
                  </h3>
                  <p className="text-xs text-slate-600">
                    All bank accounts combined
                  </p>
                </div>
              </div>
            </div>
            <div className="text-3xl lg:text-4xl font-bold text-cyan-600 mb-2">
              {(stats.banks?.kes || 0).toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </div>
            <div className="text-sm text-slate-600 font-medium">
              Kenyan Shillings
            </div>
          </motion.div>

          {/* Banks USD */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Total Banks - USD
                  </h3>
                  <p className="text-xs text-slate-600">
                    All bank accounts combined
                  </p>
                </div>
              </div>
            </div>
            <div className="text-3xl lg:text-4xl font-bold text-indigo-600 mb-2">
              {(stats.banks?.usd || 0).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="text-sm text-slate-600 font-medium">US Dollars</div>
          </motion.div>
        </div>

        {/* Daily Transactions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-600" />
              Today's Transactions
            </span>
            <span className="text-sm font-normal text-slate-600 sm:ml-auto">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* KES Daily Flow */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <div className="w-6 h-6 bg-emerald-100 flex items-center justify-center">
                  <span className="text-emerald-700 font-bold text-xs">
                    KES
                  </span>
                </div>
                Kenyan Shillings
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUpCircle className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-700 uppercase">
                      Debits In
                    </span>
                  </div>
                  <div className="text-xl lg:text-2xl font-bold text-emerald-700">
                    {(stats.daily?.byCurrency?.kes?.debits || 0).toLocaleString(
                      "en-US",
                      { minimumFractionDigits: 0 }
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowDownCircle className="w-5 h-5 text-red-600" />
                    <span className="text-xs font-bold text-red-700 uppercase">
                      Credits Out
                    </span>
                  </div>
                  <div className="text-xl lg:text-2xl font-bold text-red-700">
                    {(
                      stats.daily?.byCurrency?.kes?.credits || 0
                    ).toLocaleString("en-US", { minimumFractionDigits: 0 })}
                  </div>
                </div>
              </div>

              <div
                className={`p-4 border-2 ${
                  (stats.daily?.byCurrency?.kes?.net || 0) >= 0
                    ? "bg-emerald-50 border-emerald-300"
                    : "bg-red-50 border-red-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700">
                    Net Flow (KES)
                  </span>
                  <div
                    className={`text-xl lg:text-2xl font-bold ${
                      (stats.daily?.byCurrency?.kes?.net || 0) >= 0
                        ? "text-emerald-700"
                        : "text-red-700"
                    }`}
                  >
                    {(stats.daily?.byCurrency?.kes?.net || 0) >= 0 ? "+" : ""}
                    {(stats.daily?.byCurrency?.kes?.net || 0).toLocaleString(
                      "en-US",
                      { minimumFractionDigits: 0 }
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* USD Daily Flow */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-700 font-bold text-xs">USD</span>
                </div>
                US Dollars
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUpCircle className="w-5 h-5 text-blue-600" />
                    <span className="text-xs font-bold text-blue-700 uppercase">
                      Debits In
                    </span>
                  </div>
                  <div className="text-xl lg:text-2xl font-bold text-blue-700">
                    {(stats.daily?.byCurrency?.usd?.debits || 0).toLocaleString(
                      "en-US",
                      { minimumFractionDigits: 2 }
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowDownCircle className="w-5 h-5 text-orange-600" />
                    <span className="text-xs font-bold text-orange-700 uppercase">
                      Credits Out
                    </span>
                  </div>
                  <div className="text-xl lg:text-2xl font-bold text-orange-700">
                    {(
                      stats.daily?.byCurrency?.usd?.credits || 0
                    ).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              <div
                className={`p-4 border-2 ${
                  (stats.daily?.byCurrency?.usd?.net || 0) >= 0
                    ? "bg-blue-50 border-blue-300"
                    : "bg-orange-50 border-orange-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700">
                    Net Flow (USD)
                  </span>
                  <div
                    className={`text-xl lg:text-2xl font-bold ${
                      (stats.daily?.byCurrency?.usd?.net || 0) >= 0
                        ? "text-blue-700"
                        : "text-orange-700"
                    }`}
                  >
                    {(stats.daily?.byCurrency?.usd?.net || 0) >= 0 ? "+" : ""}
                    {(stats.daily?.byCurrency?.usd?.net || 0).toLocaleString(
                      "en-US",
                      { minimumFractionDigits: 2 }
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Count */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-700 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-700">
                    Transactions Today
                  </div>
                  <div className="text-xs text-slate-600">
                    Total processed transactions
                  </div>
                </div>
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-slate-900">
                {stats.todayTransactions}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Currency Converter Tool */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Repeat className="w-5 h-5 text-amber-600" />
            Quick Currency Converter
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Exchange Rate
              </label>
              <input
                type="number"
                value={exchangeRate}
                onChange={(e) =>
                  setExchangeRate(parseFloat(e.target.value) || 0)
                }
                className="w-full px-4 py-3 border-2 border-amber-300 bg-white text-slate-900 font-bold text-lg"
                step="0.01"
              />
              <p className="text-xs text-slate-600 mt-1">
                1 USD = {exchangeRate} KES
              </p>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                All Cash in USD
              </label>
              <div className="px-4 py-3 bg-white border-2 border-blue-300 text-blue-700 font-bold text-xl lg:text-2xl">
                $
                {(
                  ((stats.cash?.kes || 0) +
                    (stats.banks?.kes || 0) +
                    (stats.mpesa?.total || 0)) /
                    exchangeRate +
                  (stats.cash?.usd || 0) +
                  (stats.banks?.usd || 0)
                ).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                All Cash in KES
              </label>
              <div className="px-4 py-3 bg-white border-2 border-emerald-300 text-emerald-700 font-bold text-xl lg:text-2xl">
                KES{" "}
                {(
                  ((stats.cash?.usd || 0) + (stats.banks?.usd || 0)) *
                    exchangeRate +
                  (stats.cash?.kes || 0) +
                  (stats.banks?.kes || 0) +
                  (stats.mpesa?.total || 0)
                ).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Transactions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b-2 border-slate-200 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Recent Transactions
            </h3>
            <button
              onClick={() => setActiveTab("transactions")}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View All
              <Eye className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-200">
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Description
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Account Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {recentTransactions?.slice(0, 10).map((txn) => {
                  // For Client accounts (accountType === 3): Credit = positive (green), Debit = negative (red)
                  // For Asset accounts: Debit = positive (green), Credit = negative (red)
                  const isClientAccount = txn.primaryAccountType === 3;
                  const isDebit = txn.transactionType === 0;
                  const isPositive = isClientAccount ? !isDebit : isDebit;

                  return (
                    <tr
                      key={txn.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-900">
                        {txn.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 font-medium max-w-xs truncate">
                        {txn.description}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 font-medium max-w-xs truncate">
                        {txn.primaryAccountName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold uppercase ${
                            isPositive
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {isPositive ? (
                            <ArrowUpCircle className="w-3 h-3" />
                          ) : (
                            <ArrowDownCircle className="w-3 h-3" />
                          )}
                          {txn.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 font-medium max-w-xs truncate">
                        {txn.secondaryName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-slate-900">
                          {txn.currency}{" "}
                          {txn.amount.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {new Date(txn.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase">
                          Completed
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30">
      {/* Desktop Sidebar - Hidden on Mobile */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="hidden lg:block bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border-r border-slate-700/50 fixed left-0 top-0 h-screen z-50 overflow-hidden"
      >
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-600/10 pointer-events-none"></div>

        {/* Logo */}
        <div className="relative p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-lg shadow-lg">
              {userName[0]}
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-xl">
                  {userName.trim().split(" ")[0]}
                </h1>
                <p className="text-xs text-slate-400">
                  {userName.trim().split(" ").slice(1).join(" ")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* User Greeting */}
        <div className="relative p-6 border-b border-slate-700/50">
          {sidebarOpen ? (
            <div>
              <p className="text-xs text-cyan-400 font-medium mb-1">
                {getGreeting()}
              </p>
              <div className="font-bold text-lg text-white">
                {user?.ownerName}
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-sm mx-auto">
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav
          className="relative flex-1 overflow-y-auto py-4"
          style={{ maxHeight: "calc(100vh - 340px)" }}
        >
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`w-full flex items-center gap-3 px-6 py-3 transition-all ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg border-l-4 border-cyan-400"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Sidebar Toggle & Logout - Fixed at Bottom */}
        <div className="relative p-4 border-t border-slate-700/50 space-y-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-3 px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 transition-all"
          >
            <Menu className="w-5 h-5" />
            {sidebarOpen && (
              <span className="text-sm font-medium">Collapse</span>
            )}
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 bg-red-600/80 hover:bg-red-600 transition-all"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Top Header - Only visible on mobile */}
      <header className="lg:hidden sticky top-0 z-40 backdrop-blur-xl bg-white/95 border-b-2 border-slate-200 shadow-lg">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 transition-all"
            >
              <Menu className="w-6 h-6 text-slate-700" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-bold shadow-lg">
                S
              </div>
              <div>
                <h1 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Sarif
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchDashboardData}
              className="p-2 hover:bg-blue-50 transition-all"
            >
              <RefreshCw className="w-5 h-5 text-slate-600" />
            </button>
            <button
              onClick={() => setShowTransactionForm(true)}
              className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white z-50 lg:hidden shadow-2xl overflow-y-auto"
            >
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-600/10 pointer-events-none"></div>

              {/* Mobile Header */}
              <div className="relative p-6 border-b border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-lg shadow-lg">
                      S
                    </div>
                    <div>
                      <h1 className="font-bold text-xl">Sarif</h1>
                      <p className="text-xs text-slate-400">Money Exchange</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 hover:bg-slate-700/50 transition-all"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                </div>

                {/* User Info */}
                <div className="mt-4">
                  <p className="text-xs text-cyan-400 font-medium mb-1">
                    {getGreeting()}
                  </p>
                  <div className="font-bold text-lg text-white">{userName}</div>
                  <p className="text-xs text-slate-400 mt-1">Office User</p>
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="relative p-4 space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 font-semibold transition-all relative overflow-hidden ${
                      activeTab === item.id
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                        : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                ))}
              </nav>

              {/* Mobile Footer */}
              <div className="relative p-4 mt-auto border-t border-slate-700/50">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-600/90 hover:bg-red-600 transition-all font-semibold"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content - With proper left margin */}
      <motion.main
        initial={false}
        animate={{ marginLeft: sidebarOpen ? 280 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="min-h-screen lg:block hidden"
      >
        <div className="max-w-[1600px] mx-auto p-4 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>

      {/* Mobile Main Content - No margin */}
      <main className="lg:hidden min-h-screen">
        <div className="max-w-[1600px] mx-auto p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Transaction Form Modal */}
      <AnimatePresence>
        {showTransactionForm && (
          <TransactionForm
            onClose={() => setShowTransactionForm(false)}
            onSuccess={handleTransactionSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
