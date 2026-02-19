// import { useState } from "react";
// import {
//   ArrowLeftRight,
//   TrendingUp,
//   TrendingDown,
//   DollarSign,
//   Plus,
//   X,
//   Wallet,
//   Receipt,
//   Search,
//   ChevronLeft,
//   ChevronRight,
//   Eye,
//   Calendar,
//   Info,
//   ArrowUpCircle,
//   ArrowDownCircle,
//   RefreshCw,
//   Banknote,
// } from "lucide-react";
// import { toast } from "sonner";
// import { motion, AnimatePresence } from "framer-motion";

// interface ExchangeRate {
//   id: string;
//   currency: "USD";
//   buyRate: number; // Rate we buy USD (lower)
//   sellRate: number; // Rate we sell USD (higher)
//   setDate: string;
//   setBy: string;
// }

// interface ExchangeTransaction {
//   id: string;
//   date: string;
//   transactionType: "BUY_USD" | "SELL_USD"; // BUY_USD = Client gives KES, gets USD | SELL_USD = Client gives USD, gets KES
//   clientName: string;
//   usdAmount: number;
//   kesAmount: number;
//   rateApplied: number;
//   profit: number; // Profit in KES
//   reference: string;
//   processedBy: string;
// }

// export function ExchangeSection() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showSetRate, setShowSetRate] = useState(false);
//   const [showNewExchange, setShowNewExchange] = useState(false);
//   const [selectedTransaction, setSelectedTransaction] =
//     useState<ExchangeTransaction | null>(null);

//   // Current Exchange Rates
//   const currentRates: ExchangeRate = {
//     id: "RATE-001",
//     currency: "USD",
//     buyRate: 131.5, // We buy USD at this rate (client sells USD to us)
//     sellRate: 132.5, // We sell USD at this rate (client buys USD from us)
//     setDate: "2026-01-13 08:00",
//     setBy: "John Kamau",
//   };

//   // Mock Exchange Transactions
//   const allTransactions: ExchangeTransaction[] = [
//     {
//       id: "EXC-2026-001",
//       date: "2026-01-13 14:30",
//       transactionType: "SELL_USD",
//       clientName: "Sarah Wanjiku",
//       usdAmount: 500,
//       kesAmount: 66250, // 500 * 132.50
//       rateApplied: 132.5,
//       profit: 500, // (132.50 - 131.50) * 500
//       reference: "EXC-REF-001",
//       processedBy: "John Kamau",
//     },
//     {
//       id: "EXC-2026-002",
//       date: "2026-01-13 13:15",
//       transactionType: "BUY_USD",
//       clientName: "David Ochieng",
//       usdAmount: 1000,
//       kesAmount: 131500, // 1000 * 131.50
//       rateApplied: 131.5,
//       profit: 1000, // Spread profit
//       reference: "EXC-REF-002",
//       processedBy: "Sarah Wanjiku",
//     },
//     {
//       id: "EXC-2026-003",
//       date: "2026-01-13 12:00",
//       transactionType: "SELL_USD",
//       clientName: "Mary Akinyi",
//       usdAmount: 750,
//       kesAmount: 99375,
//       rateApplied: 132.5,
//       profit: 750,
//       reference: "EXC-REF-003",
//       processedBy: "John Kamau",
//     },
//     {
//       id: "EXC-2026-004",
//       date: "2026-01-13 11:30",
//       transactionType: "BUY_USD",
//       clientName: "Peter Mwangi",
//       usdAmount: 2000,
//       kesAmount: 263000,
//       rateApplied: 131.5,
//       profit: 2000,
//       reference: "EXC-REF-004",
//       processedBy: "Sarah Wanjiku",
//     },
//     {
//       id: "EXC-2026-005",
//       date: "2026-01-13 10:45",
//       transactionType: "SELL_USD",
//       clientName: "Grace Njeri",
//       usdAmount: 300,
//       kesAmount: 39750,
//       rateApplied: 132.5,
//       profit: 300,
//       reference: "EXC-REF-005",
//       processedBy: "John Kamau",
//     },
//   ];

//   // Calculate totals
//   const totalProfit = allTransactions.reduce((sum, txn) => sum + txn.profit, 0);
//   const totalUsdSold = allTransactions
//     .filter((txn) => txn.transactionType === "SELL_USD")
//     .reduce((sum, txn) => sum + txn.usdAmount, 0);
//   const totalUsdBought = allTransactions
//     .filter((txn) => txn.transactionType === "BUY_USD")
//     .reduce((sum, txn) => sum + txn.usdAmount, 0);

//   // Filter and pagination
//   const filteredTransactions = allTransactions.filter(
//     (txn) =>
//       txn.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       txn.reference.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const transactionsPerPage = 10;
//   const indexOfLastTransaction = currentPage * transactionsPerPage;
//   const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
//   const currentTransactions = filteredTransactions.slice(
//     indexOfFirstTransaction,
//     indexOfLastTransaction
//   );
//   const totalPages = Math.ceil(
//     filteredTransactions.length / transactionsPerPage
//   );

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
//               Currency Exchange
//             </h1>
//             <p className="text-slate-600 font-medium">
//               Manage exchange rates, process transactions, and track profit/loss
//             </p>
//           </div>
//           <div className="flex gap-3">
//             <button
//               onClick={() => setShowSetRate(true)}
//               className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-blue-200 text-blue-600 font-bold shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300 hover:scale-105 active:scale-95"
//             >
//               <RefreshCw className="w-5 h-5" />
//               Set Rates
//             </button>
//             <button
//               onClick={() => setShowNewExchange(true)}
//               className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 active:scale-95"
//             >
//               <Plus className="w-5 h-5" />
//               New Exchange
//             </button>
//           </div>
//         </motion.div>

//         {/* Current Exchange Rates & Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           {/* Buy Rate Card */}
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
//                     Buy USD
//                   </span>
//                 </div>
//               </div>
//               <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
//                 We Buy USD At
//               </p>
//               <p className="text-3xl font-bold text-emerald-600 tracking-tight">
//                 KES {currentRates.buyRate.toFixed(2)}
//               </p>
//               <div className="mt-3 pt-3 border-t-2 border-slate-100">
//                 <div className="flex items-center justify-between">
//                   <p className="text-[10px] text-slate-500 font-semibold">
//                     Per 1 USD
//                   </p>
//                   <DollarSign className="w-4 h-4 text-emerald-500" />
//                 </div>
//               </div>
//             </div>
//           </motion.div>

//           {/* Sell Rate Card */}
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
//                     Sell USD
//                   </span>
//                 </div>
//               </div>
//               <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
//                 We Sell USD At
//               </p>
//               <p className="text-3xl font-bold text-red-600 tracking-tight">
//                 KES {currentRates.sellRate.toFixed(2)}
//               </p>
//               <div className="mt-3 pt-3 border-t-2 border-slate-100">
//                 <div className="flex items-center justify-between">
//                   <p className="text-[10px] text-slate-500 font-semibold">
//                     Per 1 USD
//                   </p>
//                   <DollarSign className="w-4 h-4 text-red-500" />
//                 </div>
//               </div>
//             </div>
//           </motion.div>

//           {/* Total Profit Card */}
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
//                   <Wallet className="w-6 h-6" />
//                 </div>
//                 <div className="bg-white/20 backdrop-blur-sm px-3 py-1 border border-white/30">
//                   <span className="text-[10px] font-bold uppercase tracking-wide">
//                     Profit
//                   </span>
//                 </div>
//               </div>
//               <p className="text-xs opacity-90 mb-1 uppercase tracking-wider font-semibold">
//                 Total Profit (Today)
//               </p>
//               <p className="text-4xl font-bold tracking-tight">
//                 KES {totalProfit.toLocaleString()}
//               </p>
//               <div className="mt-3 pt-3 border-t border-white/20">
//                 <p className="text-[10px] opacity-75">Exchange Spread</p>
//               </div>
//             </div>
//           </motion.div>

//           {/* Total Transactions Card */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.25 }}
//             whileHover={{ scale: 1.02 }}
//             className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-blue-300 transition-all duration-300 group"
//           >
//             <div className="p-6">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="w-12 h-12 bg-blue-100 flex items-center justify-center border-2 border-blue-200 group-hover:bg-blue-200 transition-colors">
//                   <ArrowLeftRight className="w-6 h-6 text-blue-600" />
//                 </div>
//                 <div className="bg-blue-100 px-3 py-1 border border-blue-200">
//                   <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">
//                     Exchanges
//                   </span>
//                 </div>
//               </div>
//               <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
//                 Total Transactions
//               </p>
//               <p className="text-3xl font-bold text-blue-600 tracking-tight">
//                 {allTransactions.length}
//               </p>
//               <div className="mt-3 pt-3 border-t-2 border-slate-100">
//                 <div className="flex items-center justify-between">
//                   <p className="text-[10px] text-slate-500 font-semibold">
//                     Today
//                   </p>
//                   <Receipt className="w-4 h-4 text-blue-500" />
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>

//         {/* Main Content */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl overflow-hidden"
//         >
//           {/* Search Bar */}
//           <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-cyan-50">
//             <div className="flex items-center gap-3 bg-white px-4 py-3 border border-slate-200 shadow-sm">
//               <Search className="w-5 h-5 text-slate-400" />
//               <input
//                 type="text"
//                 placeholder="Search by client, transaction ID, or reference..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="flex-1 outline-none text-slate-700 placeholder-slate-400 bg-transparent"
//               />
//             </div>
//           </div>

//           {/* Transactions Table */}
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
//                 <tr>
//                   <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
//                     Transaction ID
//                   </th>
//                   <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
//                     Date & Time
//                   </th>
//                   <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
//                     Client Name
//                   </th>
//                   <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
//                     Type
//                   </th>
//                   <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
//                     USD Amount
//                   </th>
//                   <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
//                     KES Amount
//                   </th>
//                   <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
//                     Rate
//                   </th>
//                   <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
//                     Profit
//                   </th>
//                   <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-200">
//                 {currentTransactions.map((transaction, index) => (
//                   <motion.tr
//                     key={transaction.id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: index * 0.03 }}
//                     className="hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group"
//                   >
//                     <td className="px-4 py-4 whitespace-nowrap">
//                       <span className="text-sm font-bold text-blue-600 group-hover:text-blue-700">
//                         {transaction.id}
//                       </span>
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap">
//                       <div className="flex items-center gap-2">
//                         <Calendar className="w-4 h-4 text-slate-400" />
//                         <span className="text-sm text-slate-600">
//                           {transaction.date}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap">
//                       <span className="text-sm font-semibold text-slate-900">
//                         {transaction.clientName}
//                       </span>
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap">
//                       {transaction.transactionType === "BUY_USD" ? (
//                         <span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs">
//                           <TrendingUp className="w-3 h-3 mr-1.5" />
//                           BUY USD
//                         </span>
//                       ) : (
//                         <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 border border-red-200 font-bold text-xs">
//                           <TrendingDown className="w-3 h-3 mr-1.5" />
//                           SELL USD
//                         </span>
//                       )}
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
//                       ${transaction.usdAmount.toLocaleString()}
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">
//                       KES {transaction.kesAmount.toLocaleString()}
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600 font-semibold">
//                       {transaction.rateApplied.toFixed(2)}
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">
//                       +KES {transaction.profit.toLocaleString()}
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap">
//                       <button
//                         onClick={() => setSelectedTransaction(transaction)}
//                         className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-all font-semibold text-sm"
//                       >
//                         <Eye className="w-4 h-4" />
//                         View
//                       </button>
//                     </td>
//                   </motion.tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
//               <div className="text-sm text-slate-600">
//                 Showing {indexOfFirstTransaction + 1} to{" "}
//                 {Math.min(indexOfLastTransaction, filteredTransactions.length)}{" "}
//                 of {filteredTransactions.length} transactions
//               </div>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() =>
//                     setCurrentPage((prev) => Math.max(1, prev - 1))
//                   }
//                   disabled={currentPage === 1}
//                   className="p-2 border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                 >
//                   <ChevronLeft className="w-4 h-4" />
//                 </button>
//                 <div className="flex items-center gap-1">
//                   {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                     (page) => (
//                       <button
//                         key={page}
//                         onClick={() => setCurrentPage(page)}
//                         className={`px-4 py-2 border transition-all font-semibold text-sm ${
//                           currentPage === page
//                             ? "bg-blue-600 text-white border-blue-600"
//                             : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
//                         }`}
//                       >
//                         {page}
//                       </button>
//                     )
//                   )}
//                 </div>
//                 <button
//                   onClick={() =>
//                     setCurrentPage((prev) => Math.min(totalPages, prev + 1))
//                   }
//                   disabled={currentPage === totalPages}
//                   className="p-2 border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                 >
//                   <ChevronRight className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           )}
//         </motion.div>
//       </div>

//       {/* Set Exchange Rate Modal */}
//       <AnimatePresence>
//         {showSetRate && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowSetRate(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white w-full max-w-2xl shadow-2xl overflow-hidden"
//             >
//               <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 p-6 text-white">
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-xl font-bold">Set Exchange Rates</h2>
//                   <button
//                     onClick={() => setShowSetRate(false)}
//                     className="p-2 hover:bg-white/20 transition-colors"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//                 <p className="text-blue-100 text-sm mt-2">
//                   Define the rates for buying and selling USD
//                 </p>
//               </div>

//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   const formData = new FormData(e.currentTarget);
//                   toast.success(
//                     `Exchange rates updated!\nBuy: KES ${formData.get(
//                       "buyRate"
//                     )}\nSell: KES ${formData.get("sellRate")}`
//                   );
//                   setShowSetRate(false);
//                 }}
//                 className="p-6 space-y-6"
//               >
//                 {/* Info Box */}
//                 <div className="bg-blue-50 border-2 border-blue-200 p-4">
//                   <div className="flex items-start gap-3">
//                     <Info className="w-5 h-5 text-blue-600 mt-0.5" />
//                     <div className="text-sm text-blue-800">
//                       <p className="font-bold mb-1">
//                         Exchange Rate Explanation:
//                       </p>
//                       <ul className="space-y-1 text-xs">
//                         <li>
//                           • <strong>Buy Rate:</strong> Rate at which YOU buy USD
//                           from clients (lower rate)
//                         </li>
//                         <li>
//                           • <strong>Sell Rate:</strong> Rate at which YOU sell
//                           USD to clients (higher rate)
//                         </li>
//                         <li>
//                           • <strong>Spread:</strong> Difference between sell and
//                           buy = your profit per USD
//                         </li>
//                       </ul>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Buy Rate */}
//                 <div>
//                   <label className="block text-xs font-bold text-slate-700 uppercase mb-2 flex items-center gap-2">
//                     <TrendingUp className="w-4 h-4 text-emerald-600" />
//                     Buy Rate (We Buy USD) *
//                   </label>
//                   <div className="flex items-center gap-3">
//                     <span className="text-lg font-bold text-slate-600">
//                       KES
//                     </span>
//                     <input
//                       type="number"
//                       name="buyRate"
//                       step="0.01"
//                       required
//                       defaultValue={currentRates.buyRate}
//                       placeholder="131.50"
//                       className="flex-1 px-4 py-3 border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-colors text-lg font-semibold"
//                     />
//                     <span className="text-sm text-slate-500 font-semibold">
//                       per USD
//                     </span>
//                   </div>
//                 </div>

//                 {/* Sell Rate */}
//                 <div>
//                   <label className="block text-xs font-bold text-slate-700 uppercase mb-2 flex items-center gap-2">
//                     <TrendingDown className="w-4 h-4 text-red-600" />
//                     Sell Rate (We Sell USD) *
//                   </label>
//                   <div className="flex items-center gap-3">
//                     <span className="text-lg font-bold text-slate-600">
//                       KES
//                     </span>
//                     <input
//                       type="number"
//                       name="sellRate"
//                       step="0.01"
//                       required
//                       defaultValue={currentRates.sellRate}
//                       placeholder="132.50"
//                       className="flex-1 px-4 py-3 border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-colors text-lg font-semibold"
//                     />
//                     <span className="text-sm text-slate-500 font-semibold">
//                       per USD
//                     </span>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex gap-3 pt-4 border-t-2 border-slate-100">
//                   <button
//                     type="button"
//                     onClick={() => setShowSetRate(false)}
//                     className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 hover:bg-slate-300 transition-all font-semibold"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
//                   >
//                     Update Rates
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* New Exchange Transaction Modal */}
//       <AnimatePresence>
//         {showNewExchange && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowNewExchange(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white w-full max-w-3xl shadow-2xl overflow-hidden"
//             >
//               <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 p-6 text-white">
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-xl font-bold">
//                     New Exchange Transaction
//                   </h2>
//                   <button
//                     onClick={() => setShowNewExchange(false)}
//                     className="p-2 hover:bg-white/20 transition-colors"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//                 <p className="text-blue-100 text-sm mt-2">
//                   Double-entry accounting will affect Cash at Hand and Exchange
//                   Account
//                 </p>
//               </div>

//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   const formData = new FormData(e.currentTarget);
//                   const type = formData.get("type");
//                   const usdAmount = formData.get("usdAmount");
//                   const kesAmount = formData.get("kesAmount");

//                   // Double-entry explanation
//                   if (type === "BUY_USD") {
//                     toast.success(
//                       `Exchange recorded!\n\nDouble-Entry:\nDebit: USD Cash at Hand (+$${usdAmount})\nCredit: KES Cash at Hand (-KES ${kesAmount})\nDebit: Exchange Account (Profit)\nCredit: Exchange Revenue`
//                     );
//                   } else {
//                     toast.success(
//                       `Exchange recorded!\n\nDouble-Entry:\nDebit: KES Cash at Hand (+KES ${kesAmount})\nCredit: USD Cash at Hand (-$${usdAmount})\nDebit: Exchange Account (Profit)\nCredit: Exchange Revenue`
//                     );
//                   }
//                   setShowNewExchange(false);
//                 }}
//                 className="p-6 space-y-4 max-h-[70vh] overflow-y-auto"
//               >
//                 {/* Client Name */}
//                 <div>
//                   <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                     Client Name *
//                   </label>
//                   <input
//                     type="text"
//                     name="clientName"
//                     required
//                     placeholder="e.g., John Kamau"
//                     className="w-full px-4 py-3 border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-colors"
//                   />
//                 </div>

//                 {/* Transaction Type */}
//                 <div>
//                   <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                     Transaction Type *
//                   </label>
//                   <select
//                     name="type"
//                     required
//                     className="w-full px-4 py-3 border-2 border-slate-200 bg-white text-slate-900 focus:border-blue-500 focus:outline-none transition-colors"
//                   >
//                     <option value="">Select transaction type...</option>
//                     <option value="BUY_USD">
//                       BUY USD (Client sells USD to us)
//                     </option>
//                     <option value="SELL_USD">
//                       SELL USD (Client buys USD from us)
//                     </option>
//                   </select>
//                 </div>

//                 {/* Amount Section */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                       USD Amount *
//                     </label>
//                     <input
//                       type="number"
//                       name="usdAmount"
//                       step="0.01"
//                       required
//                       placeholder="0.00"
//                       className="w-full px-4 py-3 border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-colors"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                       KES Amount *
//                     </label>
//                     <input
//                       type="number"
//                       name="kesAmount"
//                       step="0.01"
//                       required
//                       placeholder="0.00"
//                       className="w-full px-4 py-3 border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-colors"
//                     />
//                   </div>
//                 </div>

//                 {/* Rate Applied */}
//                 <div>
//                   <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                     Rate Applied
//                   </label>
//                   <input
//                     type="number"
//                     name="rate"
//                     step="0.01"
//                     placeholder="Auto-calculated or manual"
//                     className="w-full px-4 py-3 border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-colors"
//                   />
//                 </div>

//                 {/* Reference */}
//                 <div>
//                   <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                     Reference Number
//                   </label>
//                   <input
//                     type="text"
//                     name="reference"
//                     placeholder="e.g., EXC-REF-001"
//                     className="w-full px-4 py-3 border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-colors"
//                   />
//                 </div>

//                 {/* Double-Entry Info */}
//                 <div className="bg-blue-50 border-2 border-blue-200 p-4">
//                   <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">
//                     Double-Entry Accounting
//                   </h4>
//                   <div className="space-y-1 text-xs text-blue-800">
//                     <div className="flex items-center gap-2">
//                       <ArrowUpCircle className="w-3.5 h-3.5 text-blue-600" />
//                       <span>
//                         <strong>Affects:</strong> Cash at Hand (USD & KES) +
//                         Exchange Account
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Wallet className="w-3.5 h-3.5 text-emerald-600" />
//                       <span>
//                         <strong>Profit:</strong> Automatically calculated and
//                         recorded
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex gap-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowNewExchange(false)}
//                     className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 hover:bg-slate-300 transition-all font-semibold"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
//                   >
//                     Process Exchange
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Transaction Detail Modal */}
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
//               className="bg-white w-full max-w-3xl shadow-2xl overflow-hidden"
//             >
//               <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 p-6 text-white">
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-3 mb-2">
//                       <ArrowLeftRight className="w-8 h-8" />
//                       <div>
//                         <h2 className="text-2xl font-bold">
//                           Exchange Transaction Details
//                         </h2>
//                         <p className="text-blue-100 text-sm flex items-center gap-1.5 mt-1">
//                           <Receipt className="w-3.5 h-3.5" />
//                           {selectedTransaction.id} •{" "}
//                           {selectedTransaction.reference}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => setSelectedTransaction(null)}
//                     className="p-2 hover:bg-white/20 transition-colors"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6 space-y-6">
//                 {/* Transaction Summary */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-slate-50 border-2 border-slate-200 p-4">
//                     <p className="text-xs font-bold text-slate-500 uppercase mb-1">
//                       Client Name
//                     </p>
//                     <p className="text-lg font-bold text-slate-900">
//                       {selectedTransaction.clientName}
//                     </p>
//                   </div>
//                   <div className="bg-slate-50 border-2 border-slate-200 p-4">
//                     <p className="text-xs font-bold text-slate-500 uppercase mb-1">
//                       Transaction Type
//                     </p>
//                     <p className="text-lg font-bold text-blue-600">
//                       {selectedTransaction.transactionType === "BUY_USD"
//                         ? "BUY USD"
//                         : "SELL USD"}
//                     </p>
//                   </div>
//                   <div className="bg-blue-50 border-2 border-blue-200 p-4">
//                     <p className="text-xs font-bold text-blue-700 uppercase mb-1">
//                       USD Amount
//                     </p>
//                     <p className="text-2xl font-bold text-blue-600">
//                       ${selectedTransaction.usdAmount.toLocaleString()}
//                     </p>
//                   </div>
//                   <div className="bg-emerald-50 border-2 border-emerald-200 p-4">
//                     <p className="text-xs font-bold text-emerald-700 uppercase mb-1">
//                       KES Amount
//                     </p>
//                     <p className="text-2xl font-bold text-emerald-600">
//                       KES {selectedTransaction.kesAmount.toLocaleString()}
//                     </p>
//                   </div>
//                   <div className="bg-slate-50 border-2 border-slate-200 p-4">
//                     <p className="text-xs font-bold text-slate-500 uppercase mb-1">
//                       Rate Applied
//                     </p>
//                     <p className="text-lg font-bold text-slate-900">
//                       {selectedTransaction.rateApplied.toFixed(2)}
//                     </p>
//                   </div>
//                   <div className="bg-emerald-50 border-2 border-emerald-200 p-4">
//                     <p className="text-xs font-bold text-emerald-700 uppercase mb-1">
//                       Profit Generated
//                     </p>
//                     <p className="text-2xl font-bold text-emerald-600">
//                       +KES {selectedTransaction.profit.toLocaleString()}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Double-Entry Breakdown */}
//                 <div className="bg-blue-50 border-2 border-blue-200 p-4">
//                   <h3 className="text-sm font-bold text-blue-900 uppercase mb-3 flex items-center gap-2">
//                     <Banknote className="w-4 h-4" />
//                     Double-Entry Accounting Impact
//                   </h3>
//                   <div className="space-y-2 text-sm">
//                     {selectedTransaction.transactionType === "BUY_USD" ? (
//                       <>
//                         <div className="flex items-start gap-2 text-blue-800">
//                           <ArrowUpCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
//                           <span>
//                             <strong>Debit:</strong> USD Cash at Hand (+$
//                             {selectedTransaction.usdAmount.toLocaleString()})
//                           </span>
//                         </div>
//                         <div className="flex items-start gap-2 text-blue-800">
//                           <ArrowDownCircle className="w-4 h-4 text-red-600 mt-0.5" />
//                           <span>
//                             <strong>Credit:</strong> KES Cash at Hand (-KES{" "}
//                             {selectedTransaction.kesAmount.toLocaleString()})
//                           </span>
//                         </div>
//                         <div className="flex items-start gap-2 text-blue-800">
//                           <ArrowUpCircle className="w-4 h-4 text-cyan-600 mt-0.5" />
//                           <span>
//                             <strong>Debit:</strong> Exchange Account Profit
//                             (+KES {selectedTransaction.profit.toLocaleString()})
//                           </span>
//                         </div>
//                       </>
//                     ) : (
//                       <>
//                         <div className="flex items-start gap-2 text-blue-800">
//                           <ArrowUpCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
//                           <span>
//                             <strong>Debit:</strong> KES Cash at Hand (+KES{" "}
//                             {selectedTransaction.kesAmount.toLocaleString()})
//                           </span>
//                         </div>
//                         <div className="flex items-start gap-2 text-blue-800">
//                           <ArrowDownCircle className="w-4 h-4 text-red-600 mt-0.5" />
//                           <span>
//                             <strong>Credit:</strong> USD Cash at Hand (-$
//                             {selectedTransaction.usdAmount.toLocaleString()})
//                           </span>
//                         </div>
//                         <div className="flex items-start gap-2 text-blue-800">
//                           <ArrowUpCircle className="w-4 h-4 text-cyan-600 mt-0.5" />
//                           <span>
//                             <strong>Debit:</strong> Exchange Account Profit
//                             (+KES {selectedTransaction.profit.toLocaleString()})
//                           </span>
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 {/* Metadata */}
//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div>
//                     <p className="text-xs font-bold text-slate-500 uppercase mb-1">
//                       Processed By
//                     </p>
//                     <p className="text-slate-900 font-semibold">
//                       {selectedTransaction.processedBy}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-xs font-bold text-slate-500 uppercase mb-1">
//                       Date & Time
//                     </p>
//                     <p className="text-slate-900 font-semibold">
//                       {selectedTransaction.date}
//                     </p>
//                   </div>
//                 </div>

//                 <button
//                   onClick={() => setSelectedTransaction(null)}
//                   className="w-full px-4 py-3 bg-slate-200 text-slate-700 hover:bg-slate-300 transition-all font-semibold"
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
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus,
  X,
  Wallet,
  Receipt,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Calendar,
  Info,
  ArrowUpCircle,
  ArrowDownCircle,
  RefreshCw,
  Banknote,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  getCurrentExchangeRate,
  setExchangeRate,
  getExchangeRateHistory,
  createExchangeTransaction,
  getTransactions,
  ExchangeRateDto,
  SetExchangeRateDto,
} from "@/lib/api";

interface ExchangeRate {
  id: string;
  currency: "USD";
  buyRate: number;
  sellRate: number;
  setDate: string;
  setBy: string;
}

interface ExchangeTransaction {
  id: string;
  date: string;
  transactionType: "BUY_USD" | "SELL_USD";
  clientName: string;
  usdAmount: number;
  kesAmount: number;
  rateApplied: number;
  profit: number;
  reference: string;
  processedBy: string;
}

export function ExchangeSection() {
  // Data states
  const [currentRates, setCurrentRates] = useState<ExchangeRate>({
    id: "",
    currency: "USD",
    buyRate: 0,
    sellRate: 0,
    setDate: "",
    setBy: "",
  });
  const [allTransactions, setAllTransactions] = useState<ExchangeTransaction[]>(
    []
  );

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // UI states
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showSetRate, setShowSetRate] = useState(false);
  const [showNewExchange, setShowNewExchange] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<ExchangeTransaction | null>(null);

  // Form states
  const [rateForm, setRateForm] = useState({ buyRate: 0, sellRate: 0 });
  const [exchangeForm, setExchangeForm] = useState({
    clientName: "",
    type: "" as "" | "BUY_USD" | "SELL_USD",
    usdAmount: 0,
    kesAmount: 0,
    rate: 0,
    reference: "",
  });

  // Fetch current exchange rate
  const fetchCurrentRate = useCallback(async () => {
    try {
      const response = await getCurrentExchangeRate();
      if (response.success && response.data) {
        setCurrentRates({
          id: response.data.id || "",
          currency: "USD",
          buyRate: response.data.buyRate || 0,
          sellRate: response.data.sellRate || 0,
          setDate: response.data.effectiveFrom
            ? new Date(response.data.effectiveFrom).toLocaleString()
            : new Date().toLocaleString(),
          setBy: response.data.createdByName || "System",
        });
        setRateForm({
          buyRate: response.data.buyRate || 0,
          sellRate: response.data.sellRate || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching current rate:", error);
    }
  }, []);

  // Fetch exchange transactions
  const fetchTransactions = useCallback(async () => {
    try {
      const response = await getTransactions(1, 1000);
      if (response.success && response.data) {
        const txnData = response.data.items || response.data;
        if (Array.isArray(txnData)) {
          // Filter and map exchange-related transactions
          const exchangeTransactions: ExchangeTransaction[] = txnData
            .filter((txn: any) => {
              const desc = (
                txn.description ||
                txn.narration ||
                ""
              ).toLowerCase();
              return (
                desc.includes("exchange") ||
                desc.includes("convert") ||
                desc.includes("buy usd") ||
                desc.includes("sell usd") ||
                txn.category === "Exchange" ||
                txn.transactionCategory === "Exchange"
              );
            })
            .map((txn: any) => {
              const isBuyUsd =
                (txn.description || "").toLowerCase().includes("buy") ||
                txn.transactionType === "BUY_USD";
              const usdAmount = txn.usdAmount || txn.amount || 0;
              const kesAmount = txn.kesAmount || txn.localAmount || 0;
              const rate =
                txn.rateApplied ||
                txn.exchangeRate ||
                kesAmount / usdAmount ||
                0;

              return {
                id: txn.id || txn.code || "",
                date: txn.transactionDate || txn.date || txn.createdAt || "",
                transactionType: isBuyUsd ? "BUY_USD" : "SELL_USD",
                clientName:
                  txn.clientName ||
                  txn.counterpartyName ||
                  txn.description ||
                  "",
                usdAmount: Math.abs(usdAmount),
                kesAmount: Math.abs(kesAmount),
                rateApplied: rate,
                profit: txn.profit || Math.abs(usdAmount) * 1, // Default spread profit
                reference: txn.reference || txn.code || "",
                processedBy: txn.processedBy || txn.createdByName || "System",
              };
            });

          setAllTransactions(exchangeTransactions);
        }
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchCurrentRate(), fetchTransactions()]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchCurrentRate, fetchTransactions]);

  // Refresh data
  const handleRefresh = async () => {
    setIsLoading(true);
    await Promise.all([fetchCurrentRate(), fetchTransactions()]);
    setIsLoading(false);
    toast.success("Data refreshed successfully!");
  };

  // Set exchange rate
  const handleSetRate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const buyRate = parseFloat(formData.get("buyRate") as string) || 0;
    const sellRate = parseFloat(formData.get("sellRate") as string) || 0;

    if (buyRate <= 0 || sellRate <= 0) {
      toast.error("Please enter valid rates");
      return;
    }

    if (buyRate >= sellRate) {
      toast.error("Sell rate must be higher than buy rate");
      return;
    }

    setIsSubmitting(true);
    try {
      const dto: SetExchangeRateDto = { buyRate, sellRate };
      const response = await setExchangeRate(dto);

      if (response.success) {
        toast.success(
          `Exchange rates updated!\nBuy: KES ${buyRate}\nSell: KES ${sellRate}`
        );
        setShowSetRate(false);
        fetchCurrentRate();
      } else {
        toast.error(response.error || "Failed to update exchange rates");
      }
    } catch (error) {
      console.error("Error setting rate:", error);
      toast.error("Failed to update exchange rates");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create new exchange transaction
  const handleNewExchange = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const clientName = formData.get("clientName") as string;
    const type = formData.get("type") as string;
    const usdAmount = parseFloat(formData.get("usdAmount") as string) || 0;
    const kesAmount = parseFloat(formData.get("kesAmount") as string) || 0;
    const rate =
      parseFloat(formData.get("rate") as string) || kesAmount / usdAmount;
    const reference = formData.get("reference") as string;

    if (!clientName || !type || usdAmount <= 0 || kesAmount <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const dto = {
        clientName,
        transactionType: type,
        usdAmount,
        kesAmount,
        exchangeRate: rate,
        reference,
        currencyFrom: type === "BUY_USD" ? 1 : 0, // 1 = USD, 0 = KES
        currencyTo: type === "BUY_USD" ? 0 : 1,
        amountFrom: type === "BUY_USD" ? usdAmount : kesAmount,
      };

      const response = await createExchangeTransaction(dto);

      if (response.success) {
        if (type === "BUY_USD") {
          toast.success(
            `Exchange recorded!\n\nDouble-Entry:\nDebit: USD Cash at Hand (+$${usdAmount})\nCredit: KES Cash at Hand (-KES ${kesAmount})\nDebit: Exchange Account (Profit)\nCredit: Exchange Revenue`
          );
        } else {
          toast.success(
            `Exchange recorded!\n\nDouble-Entry:\nDebit: KES Cash at Hand (+KES ${kesAmount})\nCredit: USD Cash at Hand (-$${usdAmount})\nDebit: Exchange Account (Profit)\nCredit: Exchange Revenue`
          );
        }
        setShowNewExchange(false);
        fetchTransactions();
      } else {
        toast.error(response.error || "Failed to process exchange");
      }
    } catch (error) {
      console.error("Error creating exchange:", error);
      toast.error("Failed to process exchange");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate totals
  const totalProfit = allTransactions.reduce((sum, txn) => sum + txn.profit, 0);
  const totalUsdSold = allTransactions
    .filter((txn) => txn.transactionType === "SELL_USD")
    .reduce((sum, txn) => sum + txn.usdAmount, 0);
  const totalUsdBought = allTransactions
    .filter((txn) => txn.transactionType === "BUY_USD")
    .reduce((sum, txn) => sum + txn.usdAmount, 0);

  // Filter and pagination
  const filteredTransactions = allTransactions.filter(
    (txn) =>
      txn.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const transactionsPerPage = 10;
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading exchange data...</p>
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
              Currency Exchange
            </h1>
            <p className="text-slate-600 font-medium">
              Manage exchange rates, process transactions, and track profit/loss
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-3 bg-white border-2 border-slate-200 text-slate-600 font-bold shadow-md hover:shadow-lg hover:border-slate-300 transition-all duration-300"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <RefreshCw className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setShowSetRate(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-blue-200 text-blue-600 font-bold shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <RefreshCw className="w-5 h-5" />
              Set Rates
            </button>
            <button
              onClick={() => setShowNewExchange(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              New Exchange
            </button>
          </div>
        </motion.div>

        {/* Current Exchange Rates & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Buy Rate Card */}
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
                    Buy USD
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
                We Buy USD At
              </p>
              <p className="text-3xl font-bold text-emerald-600 tracking-tight">
                KES {currentRates.buyRate.toFixed(2)}
              </p>
              <div className="mt-3 pt-3 border-t-2 border-slate-100">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-slate-500 font-semibold">
                    Per 1 USD
                  </p>
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sell Rate Card */}
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
                    Sell USD
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
                We Sell USD At
              </p>
              <p className="text-3xl font-bold text-red-600 tracking-tight">
                KES {currentRates.sellRate.toFixed(2)}
              </p>
              <div className="mt-3 pt-3 border-t-2 border-slate-100">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-slate-500 font-semibold">
                    Per 1 USD
                  </p>
                  <DollarSign className="w-4 h-4 text-red-500" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Total Profit Card */}
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
                  <Wallet className="w-6 h-6" />
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 border border-white/30">
                  <span className="text-[10px] font-bold uppercase tracking-wide">
                    Profit
                  </span>
                </div>
              </div>
              <p className="text-xs opacity-90 mb-1 uppercase tracking-wider font-semibold">
                Total Profit (Today)
              </p>
              <p className="text-4xl font-bold tracking-tight">
                KES {totalProfit.toLocaleString()}
              </p>
              <div className="mt-3 pt-3 border-t border-white/20">
                <p className="text-[10px] opacity-75">Exchange Spread</p>
              </div>
            </div>
          </motion.div>

          {/* Total Transactions Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-blue-300 transition-all duration-300 group"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 flex items-center justify-center border-2 border-blue-200 group-hover:bg-blue-200 transition-colors">
                  <ArrowLeftRight className="w-6 h-6 text-blue-600" />
                </div>
                <div className="bg-blue-100 px-3 py-1 border border-blue-200">
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">
                    Exchanges
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
                Total Transactions
              </p>
              <p className="text-3xl font-bold text-blue-600 tracking-tight">
                {allTransactions.length}
              </p>
              <div className="mt-3 pt-3 border-t-2 border-slate-100">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-slate-500 font-semibold">
                    Today
                  </p>
                  <Receipt className="w-4 h-4 text-blue-500" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl overflow-hidden"
        >
          {/* Search Bar */}
          <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-cyan-50">
            <div className="flex items-center gap-3 bg-white px-4 py-3 border border-slate-200 shadow-sm">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by client, transaction ID, or reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 outline-none text-slate-700 placeholder-slate-400 bg-transparent"
              />
            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                    Transaction ID
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                    Date & Time
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                    Client Name
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                    Type
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                    USD Amount
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                    KES Amount
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                    Rate
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                    Profit
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center">
                      <ArrowLeftRight className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-600 font-medium">
                        No exchange transactions found
                      </p>
                      <p className="text-slate-500 text-sm">
                        Click "New Exchange" to process your first transaction
                      </p>
                    </td>
                  </tr>
                ) : (
                  currentTransactions.map((transaction, index) => (
                    <motion.tr
                      key={transaction.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-blue-600 group-hover:text-blue-700">
                          {transaction.id}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-600">
                            {transaction.date
                              ? new Date(transaction.date).toLocaleString()
                              : "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-slate-900">
                          {transaction.clientName}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {transaction.transactionType === "BUY_USD" ? (
                          <span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs">
                            <TrendingUp className="w-3 h-3 mr-1.5" />
                            BUY USD
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 border border-red-200 font-bold text-xs">
                            <TrendingDown className="w-3 h-3 mr-1.5" />
                            SELL USD
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                        ${transaction.usdAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">
                        KES {transaction.kesAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600 font-semibold">
                        {transaction.rateApplied.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">
                        +KES {transaction.profit.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedTransaction(transaction)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-all font-semibold text-sm"
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
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
              <div className="text-sm text-slate-600">
                Showing {indexOfFirstTransaction + 1} to{" "}
                {Math.min(indexOfLastTransaction, filteredTransactions.length)}{" "}
                of {filteredTransactions.length} transactions
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 border transition-all font-semibold text-sm ${
                          currentPage === page
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Set Exchange Rate Modal */}
      <AnimatePresence>
        {showSetRate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSetRate(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-2xl shadow-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 p-6 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Set Exchange Rates</h2>
                  <button
                    onClick={() => setShowSetRate(false)}
                    className="p-2 hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-blue-100 text-sm mt-2">
                  Define the rates for buying and selling USD
                </p>
              </div>

              <form onSubmit={handleSetRate} className="p-6 space-y-6">
                {/* Info Box */}
                <div className="bg-blue-50 border-2 border-blue-200 p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-bold mb-1">
                        Exchange Rate Explanation:
                      </p>
                      <ul className="space-y-1 text-xs">
                        <li>
                          • <strong>Buy Rate:</strong> Rate at which YOU buy USD
                          from clients (lower rate)
                        </li>
                        <li>
                          • <strong>Sell Rate:</strong> Rate at which YOU sell
                          USD to clients (higher rate)
                        </li>
                        <li>
                          • <strong>Spread:</strong> Difference between sell and
                          buy = your profit per USD
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Buy Rate */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    Buy Rate (We Buy USD) *
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-slate-600">
                      KES
                    </span>
                    <input
                      type="number"
                      name="buyRate"
                      step="0.01"
                      required
                      defaultValue={currentRates.buyRate || ""}
                      placeholder="131.50"
                      className="flex-1 px-4 py-3 border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-colors text-lg font-semibold"
                    />
                    <span className="text-sm text-slate-500 font-semibold">
                      per USD
                    </span>
                  </div>
                </div>

                {/* Sell Rate */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2 flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-red-600" />
                    Sell Rate (We Sell USD) *
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-slate-600">
                      KES
                    </span>
                    <input
                      type="number"
                      name="sellRate"
                      step="0.01"
                      required
                      defaultValue={currentRates.sellRate || ""}
                      placeholder="132.50"
                      className="flex-1 px-4 py-3 border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-colors text-lg font-semibold"
                    />
                    <span className="text-sm text-slate-500 font-semibold">
                      per USD
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t-2 border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowSetRate(false)}
                    className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 hover:bg-slate-300 transition-all font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white shadow-lg hover:shadow-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    {isSubmitting ? "Updating..." : "Update Rates"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Exchange Transaction Modal */}
      <AnimatePresence>
        {showNewExchange && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewExchange(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-3xl shadow-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 p-6 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">
                    New Exchange Transaction
                  </h2>
                  <button
                    onClick={() => setShowNewExchange(false)}
                    className="p-2 hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-blue-100 text-sm mt-2">
                  Double-entry accounting will affect Cash at Hand and Exchange
                  Account
                </p>
              </div>

              <form
                onSubmit={handleNewExchange}
                className="p-6 space-y-4 max-h-[70vh] overflow-y-auto"
              >
                {/* Client Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    required
                    placeholder="e.g., John Kamau"
                    className="w-full px-4 py-3 border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Transaction Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Transaction Type *
                  </label>
                  <select
                    name="type"
                    required
                    className="w-full px-4 py-3 border-2 border-slate-200 bg-white text-slate-900 focus:border-blue-500 focus:outline-none transition-colors"
                  >
                    <option value="">Select transaction type...</option>
                    <option value="BUY_USD">
                      BUY USD (Client sells USD to us)
                    </option>
                    <option value="SELL_USD">
                      SELL USD (Client buys USD from us)
                    </option>
                  </select>
                </div>

                {/* Amount Section */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      USD Amount *
                    </label>
                    <input
                      type="number"
                      name="usdAmount"
                      step="0.01"
                      required
                      placeholder="0.00"
                      className="w-full px-4 py-3 border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      KES Amount *
                    </label>
                    <input
                      type="number"
                      name="kesAmount"
                      step="0.01"
                      required
                      placeholder="0.00"
                      className="w-full px-4 py-3 border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Rate Applied */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Rate Applied
                  </label>
                  <input
                    type="number"
                    name="rate"
                    step="0.01"
                    placeholder="Auto-calculated or manual"
                    className="w-full px-4 py-3 border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Reference */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Reference Number
                  </label>
                  <input
                    type="text"
                    name="reference"
                    placeholder="e.g., EXC-REF-001"
                    className="w-full px-4 py-3 border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Double-Entry Info */}
                <div className="bg-blue-50 border-2 border-blue-200 p-4">
                  <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">
                    Double-Entry Accounting
                  </h4>
                  <div className="space-y-1 text-xs text-blue-800">
                    <div className="flex items-center gap-2">
                      <ArrowUpCircle className="w-3.5 h-3.5 text-blue-600" />
                      <span>
                        <strong>Affects:</strong> Cash at Hand (USD & KES) +
                        Exchange Account
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        <strong>Profit:</strong> Automatically calculated and
                        recorded
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewExchange(false)}
                    className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 hover:bg-slate-300 transition-all font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white shadow-lg hover:shadow-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ArrowLeftRight className="w-4 h-4" />
                    )}
                    {isSubmitting ? "Processing..." : "Process Exchange"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transaction Detail Modal */}
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
              className="bg-white w-full max-w-3xl shadow-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 p-6 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <ArrowLeftRight className="w-8 h-8" />
                      <div>
                        <h2 className="text-2xl font-bold">
                          Exchange Transaction Details
                        </h2>
                        <p className="text-blue-100 text-sm flex items-center gap-1.5 mt-1">
                          <Receipt className="w-3.5 h-3.5" />
                          {selectedTransaction.id} •{" "}
                          {selectedTransaction.reference}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTransaction(null)}
                    className="p-2 hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Transaction Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 border-2 border-slate-200 p-4">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                      Client Name
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      {selectedTransaction.clientName}
                    </p>
                  </div>
                  <div className="bg-slate-50 border-2 border-slate-200 p-4">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                      Transaction Type
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                      {selectedTransaction.transactionType === "BUY_USD"
                        ? "BUY USD"
                        : "SELL USD"}
                    </p>
                  </div>
                  <div className="bg-blue-50 border-2 border-blue-200 p-4">
                    <p className="text-xs font-bold text-blue-700 uppercase mb-1">
                      USD Amount
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      ${selectedTransaction.usdAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-emerald-50 border-2 border-emerald-200 p-4">
                    <p className="text-xs font-bold text-emerald-700 uppercase mb-1">
                      KES Amount
                    </p>
                    <p className="text-2xl font-bold text-emerald-600">
                      KES {selectedTransaction.kesAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-slate-50 border-2 border-slate-200 p-4">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                      Rate Applied
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      {selectedTransaction.rateApplied.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-emerald-50 border-2 border-emerald-200 p-4">
                    <p className="text-xs font-bold text-emerald-700 uppercase mb-1">
                      Profit Generated
                    </p>
                    <p className="text-2xl font-bold text-emerald-600">
                      +KES {selectedTransaction.profit.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Double-Entry Breakdown */}
                <div className="bg-blue-50 border-2 border-blue-200 p-4">
                  <h3 className="text-sm font-bold text-blue-900 uppercase mb-3 flex items-center gap-2">
                    <Banknote className="w-4 h-4" />
                    Double-Entry Accounting Impact
                  </h3>
                  <div className="space-y-2 text-sm">
                    {selectedTransaction.transactionType === "BUY_USD" ? (
                      <>
                        <div className="flex items-start gap-2 text-blue-800">
                          <ArrowUpCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
                          <span>
                            <strong>Debit:</strong> USD Cash at Hand (+$
                            {selectedTransaction.usdAmount.toLocaleString()})
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-blue-800">
                          <ArrowDownCircle className="w-4 h-4 text-red-600 mt-0.5" />
                          <span>
                            <strong>Credit:</strong> KES Cash at Hand (-KES{" "}
                            {selectedTransaction.kesAmount.toLocaleString()})
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-blue-800">
                          <ArrowUpCircle className="w-4 h-4 text-cyan-600 mt-0.5" />
                          <span>
                            <strong>Debit:</strong> Exchange Account Profit
                            (+KES {selectedTransaction.profit.toLocaleString()})
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start gap-2 text-blue-800">
                          <ArrowUpCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
                          <span>
                            <strong>Debit:</strong> KES Cash at Hand (+KES{" "}
                            {selectedTransaction.kesAmount.toLocaleString()})
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-blue-800">
                          <ArrowDownCircle className="w-4 h-4 text-red-600 mt-0.5" />
                          <span>
                            <strong>Credit:</strong> USD Cash at Hand (-$
                            {selectedTransaction.usdAmount.toLocaleString()})
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-blue-800">
                          <ArrowUpCircle className="w-4 h-4 text-cyan-600 mt-0.5" />
                          <span>
                            <strong>Debit:</strong> Exchange Account Profit
                            (+KES {selectedTransaction.profit.toLocaleString()})
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                      Processed By
                    </p>
                    <p className="text-slate-900 font-semibold">
                      {selectedTransaction.processedBy}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                      Date & Time
                    </p>
                    <p className="text-slate-900 font-semibold">
                      {selectedTransaction.date
                        ? new Date(selectedTransaction.date).toLocaleString()
                        : "-"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="w-full px-4 py-3 bg-slate-200 text-slate-700 hover:bg-slate-300 transition-all font-semibold"
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
