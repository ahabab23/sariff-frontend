// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   RefreshCw,
//   Search,
//   Eye,
//   Wallet,
//   DollarSign,
//   BarChart3,
//   Download,
//   X,
//   Calendar,
//   FileText,
//   ArrowUpCircle,
//   ArrowDownCircle,
//   Edit3,
//   Trash2,
//   Activity,
//   Printer,
//   SlidersHorizontal,
//   TrendingUp,
//   TrendingDown,
//   AlertCircle,
// } from "lucide-react";
// import { toast } from "sonner";

// interface Transaction {
//   id: string;
//   date: string;
//   description: string;
//   type: "debit" | "credit";
//   currency: "KES" | "USD";
//   amount: number;
//   balance: number;
//   reference: string;
// }

// interface ExchangeAccount {
//   id: string;
//   name: string;
//   kesDebit: number;
//   kesCredit: number;
//   usdDebit: number;
//   usdCredit: number;
//   status: "active";
//   opened: string;
//   lastActivity: string;
//   transactions: Transaction[];
// }

// export function ExchangeAccount() {
//   const [transactionSearch, setTransactionSearch] = useState("");
//   const [transactionFilter, setTransactionFilter] = useState<
//     "all" | "credit" | "debit"
//   >("all");
//   const [currencyFilter, setCurrencyFilter] = useState<"all" | "KES" | "USD">(
//     "all"
//   );
//   const [transactionsCurrentPage, setTransactionsCurrentPage] = useState(1);
//   const [transactionsPerPage] = useState(15);
//   const [selectedTransaction, setSelectedTransaction] =
//     useState<Transaction | null>(null);
//   const [showViewTransaction, setShowViewTransaction] = useState(false);
//   const [showEditTransaction, setShowEditTransaction] = useState(false);
//   const [showDeleteTransaction, setShowDeleteTransaction] = useState(false);

//   // Exchange Account - Single Client with both KES and USD
//   const exchangeAccount: ExchangeAccount = {
//     id: "EXC-001",
//     name: "Sarif Exchange Account",
//     kesDebit: 125000,
//     kesCredit: 2456000,
//     usdDebit: 8500,
//     usdCredit: 45600,
//     status: "active",
//     opened: "2024-01-01",
//     lastActivity: "5 minutes ago",
//     transactions: [
//       {
//         id: "TXN-E001",
//         date: "2026-01-08 14:30",
//         description: "USD to KES Exchange - Client Walk-in",
//         type: "credit",
//         currency: "KES",
//         amount: 165000,
//         balance: 2456000,
//         reference: "EXC-2024-445",
//       },
//       {
//         id: "TXN-E002",
//         date: "2026-01-08 14:30",
//         description: "USD to KES Exchange - Client Walk-in",
//         type: "debit",
//         currency: "USD",
//         amount: 1200,
//         balance: 45600,
//         reference: "EXC-2024-445",
//       },
//       {
//         id: "TXN-E003",
//         date: "2026-01-08 11:45",
//         description: "KES to USD Exchange - Corporate Client",
//         type: "debit",
//         currency: "KES",
//         amount: 275000,
//         balance: 2291000,
//         reference: "EXC-2024-444",
//       },
//       {
//         id: "TXN-E004",
//         date: "2026-01-08 11:45",
//         description: "KES to USD Exchange - Corporate Client",
//         type: "credit",
//         currency: "USD",
//         amount: 2000,
//         balance: 46800,
//         reference: "EXC-2024-444",
//       },
//       {
//         id: "TXN-E005",
//         date: "2026-01-08 09:20",
//         description: "USD to KES Exchange - Regular Client",
//         type: "credit",
//         currency: "KES",
//         amount: 82500,
//         balance: 2566000,
//         reference: "EXC-2024-443",
//       },
//       {
//         id: "TXN-E006",
//         date: "2026-01-08 09:20",
//         description: "USD to KES Exchange - Regular Client",
//         type: "debit",
//         currency: "USD",
//         amount: 600,
//         balance: 44800,
//         reference: "EXC-2024-443",
//       },
//       {
//         id: "TXN-E007",
//         date: "2026-01-07 16:15",
//         description: "Exchange Rate Adjustment",
//         type: "credit",
//         currency: "KES",
//         amount: 5000,
//         balance: 2483500,
//         reference: "ADJ-2024-089",
//       },
//       {
//         id: "TXN-E008",
//         date: "2026-01-07 14:30",
//         description: "KES to USD Exchange - Walk-in",
//         type: "debit",
//         currency: "KES",
//         amount: 137500,
//         balance: 2478500,
//         reference: "EXC-2024-442",
//       },
//       {
//         id: "TXN-E009",
//         date: "2026-01-07 14:30",
//         description: "KES to USD Exchange - Walk-in",
//         type: "credit",
//         currency: "USD",
//         amount: 1000,
//         balance: 45400,
//         reference: "EXC-2024-442",
//       },
//       {
//         id: "TXN-E010",
//         date: "2026-01-07 10:45",
//         description: "USD to KES Exchange - Business",
//         type: "credit",
//         currency: "KES",
//         amount: 412500,
//         balance: 2616000,
//         reference: "EXC-2024-441",
//       },
//       {
//         id: "TXN-E011",
//         date: "2026-01-07 10:45",
//         description: "USD to KES Exchange - Business",
//         type: "debit",
//         currency: "USD",
//         amount: 3000,
//         balance: 44400,
//         reference: "EXC-2024-441",
//       },
//       {
//         id: "TXN-E012",
//         date: "2026-01-06 15:30",
//         description: "KES to USD Exchange",
//         type: "debit",
//         currency: "KES",
//         amount: 206250,
//         balance: 2203500,
//         reference: "EXC-2024-440",
//       },
//       {
//         id: "TXN-E013",
//         date: "2026-01-06 15:30",
//         description: "KES to USD Exchange",
//         type: "credit",
//         currency: "USD",
//         amount: 1500,
//         balance: 47400,
//         reference: "EXC-2024-440",
//       },
//     ],
//   };

//   // Calculate net balance
//   const getNetBalance = () => {
//     return {
//       kesNet: exchangeAccount.kesCredit - exchangeAccount.kesDebit,
//       usdNet: exchangeAccount.usdCredit - exchangeAccount.usdDebit,
//     };
//   };

//   const { kesNet, usdNet } = getNetBalance();

//   // Transaction filtering
//   const filteredTransactions = exchangeAccount.transactions.filter((txn) => {
//     const matchesSearch =
//       txn.description.toLowerCase().includes(transactionSearch.toLowerCase()) ||
//       txn.reference.toLowerCase().includes(transactionSearch.toLowerCase());
//     const matchesType =
//       transactionFilter === "all" || txn.type === transactionFilter;
//     const matchesCurrency =
//       currencyFilter === "all" || txn.currency === currencyFilter;
//     return matchesSearch && matchesType && matchesCurrency;
//   });

//   // Pagination for transactions
//   const indexOfLastTransaction = transactionsCurrentPage * transactionsPerPage;
//   const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
//   const currentTransactions = filteredTransactions.slice(
//     indexOfFirstTransaction,
//     indexOfLastTransaction
//   );
//   const totalTransactionPages = Math.ceil(
//     filteredTransactions.length / transactionsPerPage
//   );

//   const handleExportStatement = () => {
//     toast.success("Exchange statement exported successfully!");
//   };

//   const handlePrintStatement = () => {
//     toast.success("Printing exchange statement...");
//   };

//   const handleViewTransaction = (txn: Transaction) => {
//     setSelectedTransaction(txn);
//     setShowViewTransaction(true);
//   };

//   const handleEditTransaction = (txn: Transaction) => {
//     setSelectedTransaction(txn);
//     setShowEditTransaction(true);
//   };

//   const handleDeleteTransaction = (txn: Transaction) => {
//     setSelectedTransaction(txn);
//     setShowDeleteTransaction(true);
//   };

//   const confirmDeleteTransaction = () => {
//     toast.success(
//       `Transaction ${selectedTransaction?.reference} deleted successfully!`
//     );
//     setShowDeleteTransaction(false);
//     setSelectedTransaction(null);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//             Exchange Account
//           </h2>
//           <p className="text-slate-600 mt-1">
//             Monitor exchange transactions and balances
//           </p>
//         </div>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid md:grid-cols-4 gap-4">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-6 rounded-2xl shadow-xl"
//         >
//           <div className="flex items-center justify-between mb-2">
//             <RefreshCw className="w-8 h-8 opacity-80" />
//             <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
//               Exchange
//             </span>
//           </div>
//           <p className="text-sm opacity-90 mb-1">Total Transactions</p>
//           <p className="text-3xl font-bold">
//             {exchangeAccount.transactions.length}
//           </p>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="bg-white border-2 border-emerald-200 p-6 rounded-2xl shadow-lg"
//         >
//           <div className="flex items-center justify-between mb-2">
//             <Wallet className="w-8 h-8 text-emerald-600" />
//             <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
//               KES
//             </span>
//           </div>
//           <p className="text-sm text-slate-600 mb-1">KES Net Balance</p>
//           <p
//             className={`text-2xl font-bold ${
//               kesNet >= 0 ? "text-emerald-600" : "text-red-600"
//             }`}
//           >
//             KES {kesNet.toLocaleString()}
//           </p>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="bg-white border-2 border-blue-200 p-6 rounded-2xl shadow-lg"
//         >
//           <div className="flex items-center justify-between mb-2">
//             <DollarSign className="w-8 h-8 text-blue-600" />
//             <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
//               USD
//             </span>
//           </div>
//           <p className="text-sm text-slate-600 mb-1">USD Net Balance</p>
//           <p
//             className={`text-2xl font-bold ${
//               usdNet >= 0 ? "text-emerald-600" : "text-red-600"
//             }`}
//           >
//             ${usdNet.toLocaleString()}
//           </p>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           className="bg-white border-2 border-purple-200 p-6 rounded-2xl shadow-lg"
//         >
//           <div className="flex items-center justify-between mb-2">
//             <BarChart3 className="w-8 h-8 text-purple-600" />
//             <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
//               Status
//             </span>
//           </div>
//           <p className="text-sm text-slate-600 mb-1">Account Status</p>
//           <p className="text-2xl font-bold text-emerald-600">ACTIVE</p>
//         </motion.div>
//       </div>

//       {/* Account Overview Card */}
//       <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
//         <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.2)_25%,rgba(255,255,255,.2)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.2)_75%,rgba(255,255,255,.2))] bg-[length:60px_60px]"></div>

//         <div className="relative">
//           <div className="flex items-start gap-6 mb-6">
//             <div className="w-20 h-20 bg-white/15 backdrop-blur-xl flex items-center justify-center border border-white/30 shadow-xl rounded-xl">
//               <RefreshCw className="w-10 h-10 text-white" />
//             </div>

//             <div className="flex-1">
//               <h3 className="text-3xl font-bold mb-2">
//                 {exchangeAccount.name}
//               </h3>
//               <p className="text-purple-100 mb-4">
//                 Client ID: {exchangeAccount.id}
//               </p>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
//                 <div className="flex items-center gap-2">
//                   <Calendar className="w-4 h-4 text-purple-200" />
//                   <div>
//                     <p className="text-purple-200 text-xs">Opened</p>
//                     <p className="font-semibold">{exchangeAccount.opened}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Activity className="w-4 h-4 text-purple-200" />
//                   <div>
//                     <p className="text-purple-200 text-xs">Last Activity</p>
//                     <p className="font-semibold">
//                       {exchangeAccount.lastActivity}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <FileText className="w-4 h-4 text-purple-200" />
//                   <div>
//                     <p className="text-purple-200 text-xs">Status</p>
//                     <p className="font-semibold">
//                       {exchangeAccount.status.toUpperCase()}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Balance Cards */}
//           <div className="grid grid-cols-2 gap-4">
//             {/* KES Account */}
//             <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 rounded-xl border-l-4 border-emerald-800">
//               <div className="flex items-center justify-between mb-3">
//                 <div className="flex items-center gap-2">
//                   <Wallet className="w-5 h-5" />
//                   <span className="text-sm font-bold uppercase tracking-wide">
//                     KES Account
//                   </span>
//                 </div>
//                 <span className="text-xs opacity-75">Kenya Shillings</span>
//               </div>
//               <div className="grid grid-cols-3 gap-3">
//                 <div>
//                   <p className="text-xs opacity-75 mb-1">Credit</p>
//                   <p className="font-bold text-lg">
//                     +{exchangeAccount.kesCredit.toLocaleString()}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-xs opacity-75 mb-1">Debit</p>
//                   <p className="font-bold text-lg text-red-200">
//                     -{exchangeAccount.kesDebit.toLocaleString()}
//                   </p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-xs opacity-75 mb-1">Net</p>
//                   <p
//                     className={`font-bold text-lg ${
//                       kesNet >= 0 ? "" : "text-red-200"
//                     }`}
//                   >
//                     {kesNet >= 0 ? "+" : ""}
//                     {kesNet.toLocaleString()}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* USD Account */}
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl border-l-4 border-blue-800">
//               <div className="flex items-center justify-between mb-3">
//                 <div className="flex items-center gap-2">
//                   <DollarSign className="w-5 h-5" />
//                   <span className="text-sm font-bold uppercase tracking-wide">
//                     USD Account
//                   </span>
//                 </div>
//                 <span className="text-xs opacity-75">US Dollar</span>
//               </div>
//               <div className="grid grid-cols-3 gap-3">
//                 <div>
//                   <p className="text-xs opacity-75 mb-1">Credit</p>
//                   <p className="font-bold text-lg">
//                     +${exchangeAccount.usdCredit.toLocaleString()}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-xs opacity-75 mb-1">Debit</p>
//                   <p className="font-bold text-lg text-red-200">
//                     -${exchangeAccount.usdDebit.toLocaleString()}
//                   </p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-xs opacity-75 mb-1">Net</p>
//                   <p
//                     className={`font-bold text-lg ${
//                       usdNet >= 0 ? "" : "text-red-200"
//                     }`}
//                   >
//                     {usdNet >= 0 ? "+$" : "-$"}
//                     {Math.abs(usdNet).toLocaleString()}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Transaction History */}
//       <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-xl overflow-hidden">
//         <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-pink-50">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
//               <Activity className="w-6 h-6 text-purple-600" />
//               Transaction History
//             </h3>
//             <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-bold">
//               {filteredTransactions.length} of{" "}
//               {exchangeAccount.transactions.length} Transactions
//             </span>
//           </div>

//           {/* Search, Filter, Export, Print */}
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
//             <div className="lg:col-span-4">
//               <div className="relative">
//                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
//                 <input
//                   type="text"
//                   placeholder="Search transactions..."
//                   value={transactionSearch}
//                   onChange={(e) => setTransactionSearch(e.target.value)}
//                   className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
//                 />
//               </div>
//             </div>

//             <div className="lg:col-span-2">
//               <div className="relative">
//                 <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
//                 <select
//                   value={transactionFilter}
//                   onChange={(e) =>
//                     setTransactionFilter(
//                       e.target.value as "all" | "credit" | "debit"
//                     )
//                   }
//                   className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all appearance-none cursor-pointer"
//                 >
//                   <option value="all">All Types</option>
//                   <option value="credit">Credit</option>
//                   <option value="debit">Debit</option>
//                 </select>
//               </div>
//             </div>

//             <div className="lg:col-span-2">
//               <div className="relative">
//                 <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
//                 <select
//                   value={currencyFilter}
//                   onChange={(e) =>
//                     setCurrencyFilter(e.target.value as "all" | "KES" | "USD")
//                   }
//                   className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all appearance-none cursor-pointer"
//                 >
//                   <option value="all">All Currencies</option>
//                   <option value="KES">KES Only</option>
//                   <option value="USD">USD Only</option>
//                 </select>
//               </div>
//             </div>

//             <div className="lg:col-span-4 flex gap-2">
//               <button
//                 onClick={handleExportStatement}
//                 className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white hover:bg-emerald-700 transition-all font-semibold text-sm rounded-lg"
//               >
//                 <Download className="w-4 h-4" />
//                 <span className="hidden sm:inline">Export</span>
//               </button>
//               <button
//                 onClick={handlePrintStatement}
//                 className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white hover:bg-purple-700 transition-all font-semibold text-sm rounded-lg"
//               >
//                 <Printer className="w-4 h-4" />
//                 <span className="hidden sm:inline">Print</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Transactions Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-b border-slate-300">
//               <tr>
//                 <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
//                   Date & Time
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
//                   Description
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
//                   Type
//                 </th>
//                 <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">
//                   Amount
//                 </th>
//                 <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">
//                   Balance
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
//                   Reference
//                 </th>
//                 <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-200">
//               {currentTransactions.map((txn, idx) => (
//                 <motion.tr
//                   key={txn.id}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: idx * 0.03 }}
//                   className="hover:bg-purple-50/50 transition-colors group"
//                 >
//                   <td className="px-4 py-4 text-sm text-slate-600 whitespace-nowrap font-medium">
//                     <div className="flex items-center gap-2">
//                       <Calendar className="w-4 h-4 text-slate-400" />
//                       {txn.date}
//                     </div>
//                   </td>
//                   <td className="px-4 py-4 text-sm text-slate-900 font-semibold">
//                     {txn.description}
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap">
//                     <span
//                       className={`inline-flex items-center gap-1.5 px-3 py-1 border-l-4 text-xs font-bold ${
//                         txn.type === "credit"
//                           ? "bg-emerald-50 text-emerald-700 border-emerald-500"
//                           : "bg-red-50 text-red-700 border-red-500"
//                       }`}
//                     >
//                       {txn.type === "credit" ? (
//                         <ArrowUpCircle className="w-3.5 h-3.5" />
//                       ) : (
//                         <ArrowDownCircle className="w-3.5 h-3.5" />
//                       )}
//                       {txn.type.toUpperCase()}
//                     </span>
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap text-right">
//                     <span
//                       className={`text-base font-bold ${
//                         txn.type === "credit"
//                           ? "text-emerald-600"
//                           : "text-red-600"
//                       }`}
//                     >
//                       {txn.type === "credit" ? "+" : "-"}
//                       {txn.currency} {txn.currency === "USD" ? "$" : ""}
//                       {txn.amount.toLocaleString()}
//                     </span>
//                   </td>
//                   <td className="px-4 py-4 text-base font-bold text-slate-900 whitespace-nowrap text-right">
//                     {txn.currency} {txn.currency === "USD" ? "$" : ""}
//                     {txn.balance.toLocaleString()}
//                   </td>
//                   <td className="px-4 py-4 text-sm text-purple-600 font-mono whitespace-nowrap">
//                     {txn.reference}
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap">
//                     <div className="flex items-center justify-center gap-1">
//                       <button
//                         onClick={() => handleViewTransaction(txn)}
//                         className="p-2 bg-purple-600 text-white hover:bg-purple-700 transition-all rounded"
//                         title="View Details"
//                       >
//                         <Eye className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => handleEditTransaction(txn)}
//                         className="p-2 bg-emerald-600 text-white hover:bg-emerald-700 transition-all rounded"
//                         title="Edit Transaction"
//                       >
//                         <Edit3 className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => handleDeleteTransaction(txn)}
//                         className="p-2 bg-red-600 text-white hover:bg-red-700 transition-all rounded"
//                         title="Delete Transaction"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </motion.tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {totalTransactionPages > 1 && (
//           <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
//             <p className="text-sm text-slate-600">
//               Showing {indexOfFirstTransaction + 1} to{" "}
//               {Math.min(indexOfLastTransaction, filteredTransactions.length)} of{" "}
//               {filteredTransactions.length} transactions
//             </p>
//             <div className="flex gap-2">
//               <button
//                 onClick={() =>
//                   setTransactionsCurrentPage((prev) => Math.max(prev - 1, 1))
//                 }
//                 disabled={transactionsCurrentPage === 1}
//                 className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
//               >
//                 Previous
//               </button>
//               <button
//                 onClick={() =>
//                   setTransactionsCurrentPage((prev) =>
//                     Math.min(prev + 1, totalTransactionPages)
//                   )
//                 }
//                 disabled={transactionsCurrentPage === totalTransactionPages}
//                 className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* View Transaction Modal */}
//       <AnimatePresence>
//         {showViewTransaction && selectedTransaction && (
//           <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//               className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border-2 border-purple-600"
//             >
//               <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-xl relative">
//                 <button
//                   onClick={() => {
//                     setShowViewTransaction(false);
//                     setSelectedTransaction(null);
//                   }}
//                   className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
//                 >
//                   <X className="w-5 h-5 text-white" />
//                 </button>
//                 <h3 className="text-2xl font-bold text-white flex items-center gap-3">
//                   <Eye className="w-6 h-6" />
//                   Transaction Details
//                 </h3>
//               </div>

//               <div className="p-6 space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-xs font-semibold text-slate-600 uppercase">
//                       Transaction ID
//                     </label>
//                     <p className="text-lg font-bold text-purple-600 mt-1">
//                       {selectedTransaction.id}
//                     </p>
//                   </div>
//                   <div>
//                     <label className="text-xs font-semibold text-slate-600 uppercase">
//                       Reference
//                     </label>
//                     <p className="text-lg font-mono font-bold text-slate-900 mt-1">
//                       {selectedTransaction.reference}
//                     </p>
//                   </div>
//                   <div>
//                     <label className="text-xs font-semibold text-slate-600 uppercase">
//                       Date & Time
//                     </label>
//                     <p className="text-base font-semibold text-slate-900 mt-1">
//                       {selectedTransaction.date}
//                     </p>
//                   </div>
//                   <div>
//                     <label className="text-xs font-semibold text-slate-600 uppercase">
//                       Type
//                     </label>
//                     <div className="mt-1">
//                       <span
//                         className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-bold ${
//                           selectedTransaction.type === "credit"
//                             ? "bg-emerald-100 text-emerald-700"
//                             : "bg-red-100 text-red-700"
//                         }`}
//                       >
//                         {selectedTransaction.type === "credit" ? (
//                           <ArrowUpCircle className="w-4 h-4" />
//                         ) : (
//                           <ArrowDownCircle className="w-4 h-4" />
//                         )}
//                         {selectedTransaction.type.toUpperCase()}
//                       </span>
//                     </div>
//                   </div>
//                   <div>
//                     <label className="text-xs font-semibold text-slate-600 uppercase">
//                       Currency
//                     </label>
//                     <p className="text-base font-bold text-slate-900 mt-1">
//                       {selectedTransaction.currency}
//                     </p>
//                   </div>
//                   <div>
//                     <label className="text-xs font-semibold text-slate-600 uppercase">
//                       Amount
//                     </label>
//                     <p
//                       className={`text-xl font-bold mt-1 ${
//                         selectedTransaction.type === "credit"
//                           ? "text-emerald-600"
//                           : "text-red-600"
//                       }`}
//                     >
//                       {selectedTransaction.type === "credit" ? "+" : "-"}
//                       {selectedTransaction.currency}{" "}
//                       {selectedTransaction.currency === "USD" ? "$" : ""}
//                       {selectedTransaction.amount.toLocaleString()}
//                     </p>
//                   </div>
//                   <div className="col-span-2">
//                     <label className="text-xs font-semibold text-slate-600 uppercase">
//                       Description
//                     </label>
//                     <p className="text-base font-semibold text-slate-900 mt-1">
//                       {selectedTransaction.description}
//                     </p>
//                   </div>
//                   <div>
//                     <label className="text-xs font-semibold text-slate-600 uppercase">
//                       Balance After
//                     </label>
//                     <p className="text-lg font-bold text-slate-900 mt-1">
//                       {selectedTransaction.currency}{" "}
//                       {selectedTransaction.currency === "USD" ? "$" : ""}
//                       {selectedTransaction.balance.toLocaleString()}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="p-4 bg-slate-50 rounded-b-xl border-t border-slate-200">
//                 <button
//                   onClick={() => {
//                     setShowViewTransaction(false);
//                     setSelectedTransaction(null);
//                   }}
//                   className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all"
//                 >
//                   Close
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>

//       {/* Edit Transaction Modal */}
//       <AnimatePresence>
//         {showEditTransaction && selectedTransaction && (
//           <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//               className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border-2 border-emerald-600"
//             >
//               <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-t-xl relative">
//                 <button
//                   onClick={() => {
//                     setShowEditTransaction(false);
//                     setSelectedTransaction(null);
//                   }}
//                   className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
//                 >
//                   <X className="w-5 h-5 text-white" />
//                 </button>
//                 <h3 className="text-2xl font-bold text-white flex items-center gap-3">
//                   <Edit3 className="w-6 h-6" />
//                   Edit Transaction
//                 </h3>
//               </div>

//               <form className="p-6 space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase">
//                       Transaction ID
//                     </label>
//                     <input
//                       type="text"
//                       defaultValue={selectedTransaction.id}
//                       disabled
//                       className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-lg font-mono text-slate-600"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase">
//                       Reference
//                     </label>
//                     <input
//                       type="text"
//                       defaultValue={selectedTransaction.reference}
//                       className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none font-mono"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase">
//                       Date & Time
//                     </label>
//                     <input
//                       type="text"
//                       defaultValue={selectedTransaction.date}
//                       className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase">
//                       Type
//                     </label>
//                     <select
//                       defaultValue={selectedTransaction.type}
//                       className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none font-semibold"
//                     >
//                       <option value="credit">CREDIT</option>
//                       <option value="debit">DEBIT</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase">
//                       Currency
//                     </label>
//                     <select
//                       defaultValue={selectedTransaction.currency}
//                       className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none font-semibold"
//                     >
//                       <option value="KES">KES</option>
//                       <option value="USD">USD</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase">
//                       Amount
//                     </label>
//                     <input
//                       type="number"
//                       defaultValue={selectedTransaction.amount}
//                       className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none font-bold"
//                     />
//                   </div>
//                   <div className="col-span-2">
//                     <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase">
//                       Description
//                     </label>
//                     <input
//                       type="text"
//                       defaultValue={selectedTransaction.description}
//                       className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none"
//                     />
//                   </div>
//                 </div>
//               </form>

//               <div className="p-4 bg-slate-50 rounded-b-xl border-t border-slate-200 flex gap-3">
//                 <button
//                   onClick={() => {
//                     setShowEditTransaction(false);
//                     setSelectedTransaction(null);
//                   }}
//                   className="flex-1 px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-100 transition-all"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     toast.success(
//                       `Transaction ${selectedTransaction.reference} updated successfully!`
//                     );
//                     setShowEditTransaction(false);
//                     setSelectedTransaction(null);
//                   }}
//                   className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all"
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>

//       {/* Delete Transaction Modal */}
//       <AnimatePresence>
//         {showDeleteTransaction && selectedTransaction && (
//           <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//               className="bg-white rounded-xl shadow-2xl max-w-md w-full border-2 border-red-600"
//             >
//               <div className="bg-gradient-to-r from-red-600 to-rose-600 p-6 rounded-t-xl relative">
//                 <button
//                   onClick={() => {
//                     setShowDeleteTransaction(false);
//                     setSelectedTransaction(null);
//                   }}
//                   className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
//                 >
//                   <X className="w-5 h-5 text-white" />
//                 </button>
//                 <h3 className="text-2xl font-bold text-white flex items-center gap-3">
//                   <Trash2 className="w-6 h-6" />
//                   Delete Transaction
//                 </h3>
//               </div>

//               <div className="p-6">
//                 <div className="flex items-center justify-center mb-4">
//                   <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
//                     <AlertCircle className="w-8 h-8 text-red-600" />
//                   </div>
//                 </div>
//                 <h4 className="text-lg font-bold text-slate-900 text-center mb-2">
//                   Are you sure you want to delete this transaction?
//                 </h4>
//                 <p className="text-slate-600 text-center mb-4">
//                   This action cannot be undone. The transaction will be
//                   permanently removed.
//                 </p>
//                 <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
//                   <div className="flex justify-between">
//                     <span className="text-xs font-semibold text-slate-600">
//                       Transaction ID:
//                     </span>
//                     <span className="text-xs font-bold text-red-600">
//                       {selectedTransaction.id}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-xs font-semibold text-slate-600">
//                       Reference:
//                     </span>
//                     <span className="text-xs font-mono font-bold text-slate-900">
//                       {selectedTransaction.reference}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-xs font-semibold text-slate-600">
//                       Amount:
//                     </span>
//                     <span className="text-xs font-bold text-slate-900">
//                       {selectedTransaction.currency}{" "}
//                       {selectedTransaction.currency === "USD" ? "$" : ""}
//                       {selectedTransaction.amount.toLocaleString()}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="p-4 bg-slate-50 rounded-b-xl border-t border-slate-200 flex gap-3">
//                 <button
//                   onClick={() => {
//                     setShowDeleteTransaction(false);
//                     setSelectedTransaction(null);
//                   }}
//                   className="flex-1 px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-100 transition-all"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={confirmDeleteTransaction}
//                   className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all"
//                 >
//                   Delete Transaction
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  Search,
  Eye,
  Wallet,
  DollarSign,
  BarChart3,
  Download,
  X,
  Calendar,
  FileText,
  ArrowUpCircle,
  ArrowDownCircle,
  Edit3,
  Trash2,
  Activity,
  Printer,
  SlidersHorizontal,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Loader2,
  Plus,
  ArrowRightLeft,
} from "lucide-react";
import { toast } from "sonner";
import {
  getCurrentExchangeRate,
  getExchangeRateHistory,
  setExchangeRate,
  createExchangeTransaction,
  convertCurrency,
  getTransactions,
  ExchangeRateDto,
  SetExchangeRateDto,
} from "@/lib/api";

interface Transaction {
  id: string;
  code: string;
  date: string;
  description: string;
  type: "debit" | "credit";
  currency: "KES" | "USD";
  amount: number;
  balance: number;
  reference: string;
}

interface ExchangeAccountSummary {
  kesDebit: number;
  kesCredit: number;
  usdDebit: number;
  usdCredit: number;
  totalTransactions: number;
  lastActivity: string;
}

export function ExchangeAccount() {
  // Data states
  const [currentRate, setCurrentRate] = useState<ExchangeRateDto | null>(null);
  const [rateHistory, setRateHistory] = useState<ExchangeRateDto[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accountSummary, setAccountSummary] = useState<ExchangeAccountSummary>({
    kesDebit: 0,
    kesCredit: 0,
    usdDebit: 0,
    usdCredit: 0,
    totalTransactions: 0,
    lastActivity: "N/A",
  });

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter states
  const [transactionSearch, setTransactionSearch] = useState("");
  const [transactionFilter, setTransactionFilter] = useState<
    "all" | "credit" | "debit"
  >("all");
  const [currencyFilter, setCurrencyFilter] = useState<"all" | "KES" | "USD">(
    "all"
  );

  // Pagination
  const [transactionsCurrentPage, setTransactionsCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(15);

  // Modal states
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showViewTransaction, setShowViewTransaction] = useState(false);
  const [showEditTransaction, setShowEditTransaction] = useState(false);
  const [showDeleteTransaction, setShowDeleteTransaction] = useState(false);
  const [showSetRateModal, setShowSetRateModal] = useState(false);
  const [showNewExchangeModal, setShowNewExchangeModal] = useState(false);

  // Form states
  const [rateForm, setRateForm] = useState<SetExchangeRateDto>({
    buyRate: 0,
    sellRate: 0,
  });
  const [exchangeForm, setExchangeForm] = useState({
    clientId: "",
    amountFrom: 0,
    currencyFrom: 0, // 0 = KES, 1 = USD
    currencyTo: 1,
    exchangeRate: 0,
  });

  // Fetch current exchange rate
  const fetchCurrentRate = useCallback(async () => {
    try {
      const response = await getCurrentExchangeRate();
      if (response.success && response.data) {
        setCurrentRate(response.data);
        setRateForm({
          buyRate: response.data.buyRate,
          sellRate: response.data.sellRate,
        });
      }
    } catch (error) {
      console.error("Error fetching current rate:", error);
    }
  }, []);

  // Fetch exchange rate history
  const fetchRateHistory = useCallback(async () => {
    try {
      const response = await getExchangeRateHistory();
      if (response.success && response.data) {
        setRateHistory(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error("Error fetching rate history:", error);
    }
  }, []);

  // Fetch transactions (filter for exchange-related)
  const fetchTransactions = useCallback(async () => {
    try {
      const response = await getTransactions(1, 1000);
      if (response.success && response.data) {
        const txnData = response.data.items || response.data;
        if (Array.isArray(txnData)) {
          // Map and filter exchange-related transactions
          const exchangeTransactions: Transaction[] = txnData
            .filter((txn: any) => {
              // Filter for exchange transactions (you may adjust this filter)
              const desc = (
                txn.description ||
                txn.narration ||
                ""
              ).toLowerCase();
              return (
                desc.includes("exchange") ||
                desc.includes("convert") ||
                txn.category === "Exchange" ||
                txn.transactionCategory === "Exchange"
              );
            })
            .map((txn: any) => ({
              id: txn.id,
              code:
                txn.code || txn.reference || txn.id?.slice(0, 8).toUpperCase(),
              date: txn.transactionDate || txn.date || txn.createdAt,
              description: txn.description || txn.narration || "",
              type:
                txn.transactionType === 0 ||
                txn.type === 0 ||
                txn.type === "debit"
                  ? "debit"
                  : "credit",
              currency:
                txn.currency === 0 || txn.currency === "KES" ? "KES" : "USD",
              amount: Math.abs(txn.amount),
              balance: txn.runningBalance || txn.balance || 0,
              reference: txn.reference || txn.code || "",
            }));

          setTransactions(exchangeTransactions);

          // Calculate account summary from transactions
          const summary = exchangeTransactions.reduce(
            (acc, txn) => {
              if (txn.currency === "KES") {
                if (txn.type === "debit") acc.kesDebit += txn.amount;
                else acc.kesCredit += txn.amount;
              } else {
                if (txn.type === "debit") acc.usdDebit += txn.amount;
                else acc.usdCredit += txn.amount;
              }
              return acc;
            },
            { kesDebit: 0, kesCredit: 0, usdDebit: 0, usdCredit: 0 }
          );

          setAccountSummary({
            ...summary,
            totalTransactions: exchangeTransactions.length,
            lastActivity:
              exchangeTransactions.length > 0
                ? new Date(exchangeTransactions[0].date).toLocaleString()
                : "N/A",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transactions");
    }
  }, []);

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchCurrentRate(),
        fetchRateHistory(),
        fetchTransactions(),
      ]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchCurrentRate, fetchRateHistory, fetchTransactions]);

  // Refresh all data
  const handleRefresh = async () => {
    setIsLoading(true);
    await Promise.all([
      fetchCurrentRate(),
      fetchRateHistory(),
      fetchTransactions(),
    ]);
    setIsLoading(false);
    toast.success("Data refreshed successfully!");
  };

  // Set new exchange rate
  const handleSetRate = async () => {
    if (rateForm.buyRate <= 0 || rateForm.sellRate <= 0) {
      toast.error("Please enter valid rates");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await setExchangeRate(rateForm);
      if (response.success) {
        toast.success("Exchange rate updated successfully!");
        setShowSetRateModal(false);
        fetchCurrentRate();
        fetchRateHistory();
      } else {
        toast.error(response.error || "Failed to update exchange rate");
      }
    } catch (error) {
      console.error("Error setting rate:", error);
      toast.error("Failed to update exchange rate");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create new exchange transaction
  const handleCreateExchange = async () => {
    if (exchangeForm.amountFrom <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);
    try {
      const dto = {
        clientId: exchangeForm.clientId || undefined,
        amountFrom: exchangeForm.amountFrom,
        currencyFrom: exchangeForm.currencyFrom,
        currencyTo: exchangeForm.currencyTo,
        exchangeRate: exchangeForm.exchangeRate || currentRate?.buyRate || 0,
      };

      const response = await createExchangeTransaction(dto);
      if (response.success) {
        toast.success("Exchange transaction created successfully!");
        setShowNewExchangeModal(false);
        setExchangeForm({
          clientId: "",
          amountFrom: 0,
          currencyFrom: 0,
          currencyTo: 1,
          exchangeRate: 0,
        });
        fetchTransactions();
      } else {
        toast.error(response.error || "Failed to create exchange transaction");
      }
    } catch (error) {
      console.error("Error creating exchange:", error);
      toast.error("Failed to create exchange transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate net balance
  const kesNet = accountSummary.kesCredit - accountSummary.kesDebit;
  const usdNet = accountSummary.usdCredit - accountSummary.usdDebit;

  // Transaction filtering
  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.description.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      txn.reference.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      txn.code.toLowerCase().includes(transactionSearch.toLowerCase());
    const matchesType =
      transactionFilter === "all" || txn.type === transactionFilter;
    const matchesCurrency =
      currencyFilter === "all" || txn.currency === currencyFilter;
    return matchesSearch && matchesType && matchesCurrency;
  });

  // Pagination for transactions
  const indexOfLastTransaction = transactionsCurrentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const totalTransactionPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
  );

  const handleExportStatement = () => {
    const csvData = [
      [
        "Date",
        "Reference",
        "Description",
        "Type",
        "Currency",
        "Amount",
        "Balance",
      ],
      ...filteredTransactions.map((txn) => [
        new Date(txn.date).toLocaleString(),
        txn.reference,
        txn.description,
        txn.type.toUpperCase(),
        txn.currency,
        txn.amount.toFixed(2),
        txn.balance.toFixed(2),
      ]),
    ];
    const csv = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `exchange-statement-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    toast.success("Exchange statement exported successfully!");
  };

  const handlePrintStatement = () => {
    window.print();
    toast.success("Printing exchange statement...");
  };

  const handleViewTransaction = (txn: Transaction) => {
    setSelectedTransaction(txn);
    setShowViewTransaction(true);
  };

  const handleEditTransaction = (txn: Transaction) => {
    setSelectedTransaction(txn);
    setShowEditTransaction(true);
  };

  const handleDeleteTransaction = (txn: Transaction) => {
    setSelectedTransaction(txn);
    setShowDeleteTransaction(true);
  };

  const confirmDeleteTransaction = async () => {
    // In production, call delete API
    toast.success(
      `Transaction ${selectedTransaction?.reference} deleted successfully!`
    );
    setShowDeleteTransaction(false);
    setSelectedTransaction(null);
    fetchTransactions();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading exchange data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Exchange Account
          </h2>
          <p className="text-slate-600 mt-1">
            Monitor exchange transactions and balances
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-all"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Refresh
          </button>
          <button
            onClick={() => setShowSetRateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all"
          >
            <TrendingUp className="w-4 h-4" />
            Set Rate
          </button>
          <button
            onClick={() => setShowNewExchangeModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg text-white font-medium rounded-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            New Exchange
          </button>
        </div>
      </div>

      {/* Current Exchange Rate Card */}
      {currentRate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <ArrowRightLeft className="w-8 h-8" />
              <div>
                <h3 className="text-lg font-bold">Current Exchange Rate</h3>
                <p className="text-sm text-indigo-100">
                  Effective from:{" "}
                  {new Date(currentRate.effectiveFrom).toLocaleString()}
                </p>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                currentRate.isActive ? "bg-emerald-500" : "bg-red-500"
              }`}
            >
              {currentRate.isActive ? "ACTIVE" : "INACTIVE"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <p className="text-sm text-indigo-100 mb-1">
                Buy Rate (USD → KES)
              </p>
              <p className="text-3xl font-bold">
                KES {currentRate.buyRate.toLocaleString()}
              </p>
              <p className="text-xs text-indigo-200 mt-1">Per 1 USD</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <p className="text-sm text-indigo-100 mb-1">
                Sell Rate (KES → USD)
              </p>
              <p className="text-3xl font-bold">
                KES {currentRate.sellRate.toLocaleString()}
              </p>
              <p className="text-xs text-indigo-200 mt-1">Per 1 USD</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-6 rounded-2xl shadow-xl"
        >
          <div className="flex items-center justify-between mb-2">
            <RefreshCw className="w-8 h-8 opacity-80" />
            <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
              Exchange
            </span>
          </div>
          <p className="text-sm opacity-90 mb-1">Total Transactions</p>
          <p className="text-3xl font-bold">
            {accountSummary.totalTransactions}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border-2 border-emerald-200 p-6 rounded-2xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <Wallet className="w-8 h-8 text-emerald-600" />
            <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
              KES
            </span>
          </div>
          <p className="text-sm text-slate-600 mb-1">KES Net Balance</p>
          <p
            className={`text-2xl font-bold ${
              kesNet >= 0 ? "text-emerald-600" : "text-red-600"
            }`}
          >
            KES {kesNet.toLocaleString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border-2 border-blue-200 p-6 rounded-2xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-blue-600" />
            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              USD
            </span>
          </div>
          <p className="text-sm text-slate-600 mb-1">USD Net Balance</p>
          <p
            className={`text-2xl font-bold ${
              usdNet >= 0 ? "text-emerald-600" : "text-red-600"
            }`}
          >
            ${usdNet.toLocaleString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border-2 border-purple-200 p-6 rounded-2xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-8 h-8 text-purple-600" />
            <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
              Status
            </span>
          </div>
          <p className="text-sm text-slate-600 mb-1">Account Status</p>
          <p className="text-2xl font-bold text-emerald-600">ACTIVE</p>
        </motion.div>
      </div>

      {/* Account Overview Card */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.2)_25%,rgba(255,255,255,.2)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.2)_75%,rgba(255,255,255,.2))] bg-[length:60px_60px]"></div>

        <div className="relative">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-20 h-20 bg-white/15 backdrop-blur-xl flex items-center justify-center border border-white/30 shadow-xl rounded-xl">
              <RefreshCw className="w-10 h-10 text-white" />
            </div>

            <div className="flex-1">
              <h3 className="text-3xl font-bold mb-2">
                Sarif Exchange Account
              </h3>
              <p className="text-purple-100 mb-4">Client ID: EXC-001</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-200" />
                  <div>
                    <p className="text-purple-200 text-xs">Opened</p>
                    <p className="font-semibold">2024-01-01</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-200" />
                  <div>
                    <p className="text-purple-200 text-xs">Last Activity</p>
                    <p className="font-semibold">
                      {accountSummary.lastActivity}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-200" />
                  <div>
                    <p className="text-purple-200 text-xs">Status</p>
                    <p className="font-semibold">ACTIVE</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* KES Account */}
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 rounded-xl border-l-4 border-emerald-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase tracking-wide">
                    KES Account
                  </span>
                </div>
                <span className="text-xs opacity-75">Kenya Shillings</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-xs opacity-75 mb-1">Credit</p>
                  <p className="font-bold text-lg">
                    +{accountSummary.kesCredit.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs opacity-75 mb-1">Debit</p>
                  <p className="font-bold text-lg text-red-200">
                    -{accountSummary.kesDebit.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-75 mb-1">Net</p>
                  <p
                    className={`font-bold text-lg ${
                      kesNet >= 0 ? "" : "text-red-200"
                    }`}
                  >
                    {kesNet >= 0 ? "+" : ""}
                    {kesNet.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* USD Account */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl border-l-4 border-blue-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase tracking-wide">
                    USD Account
                  </span>
                </div>
                <span className="text-xs opacity-75">US Dollar</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-xs opacity-75 mb-1">Credit</p>
                  <p className="font-bold text-lg">
                    +${accountSummary.usdCredit.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs opacity-75 mb-1">Debit</p>
                  <p className="font-bold text-lg text-red-200">
                    -${accountSummary.usdDebit.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-75 mb-1">Net</p>
                  <p
                    className={`font-bold text-lg ${
                      usdNet >= 0 ? "" : "text-red-200"
                    }`}
                  >
                    {usdNet >= 0 ? "+$" : "-$"}
                    {Math.abs(usdNet).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-6 h-6 text-purple-600" />
              Transaction History
            </h3>
            <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-bold">
              {filteredTransactions.length} of {transactions.length}{" "}
              Transactions
            </span>
          </div>

          {/* Search, Filter, Export, Print */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            <div className="lg:col-span-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={transactionSearch}
                  onChange={(e) => setTransactionSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="relative">
                <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={transactionFilter}
                  onChange={(e) =>
                    setTransactionFilter(
                      e.target.value as "all" | "credit" | "debit"
                    )
                  }
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="all">All Types</option>
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={currencyFilter}
                  onChange={(e) =>
                    setCurrencyFilter(e.target.value as "all" | "KES" | "USD")
                  }
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="all">All Currencies</option>
                  <option value="KES">KES Only</option>
                  <option value="USD">USD Only</option>
                </select>
              </div>
            </div>

            <div className="lg:col-span-4 flex gap-2">
              <button
                onClick={handleExportStatement}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white hover:bg-emerald-700 transition-all font-semibold text-sm rounded-lg"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button
                onClick={handlePrintStatement}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white hover:bg-purple-700 transition-all font-semibold text-sm rounded-lg"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print</span>
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-b border-slate-300">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600 font-medium">
                      No exchange transactions found
                    </p>
                    <p className="text-slate-500 text-sm">
                      Exchange transactions will appear here
                    </p>
                  </td>
                </tr>
              ) : (
                currentTransactions.map((txn, idx) => (
                  <motion.tr
                    key={txn.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="hover:bg-purple-50/50 transition-colors group"
                  >
                    <td className="px-4 py-4 text-sm text-slate-600 whitespace-nowrap font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {new Date(txn.date).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-900 font-semibold">
                      {txn.description}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 border-l-4 text-xs font-bold ${
                          txn.type === "credit"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-500"
                            : "bg-red-50 text-red-700 border-red-500"
                        }`}
                      >
                        {txn.type === "credit" ? (
                          <ArrowUpCircle className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowDownCircle className="w-3.5 h-3.5" />
                        )}
                        {txn.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <span
                        className={`text-base font-bold ${
                          txn.type === "credit"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {txn.type === "credit" ? "+" : "-"}
                        {txn.currency === "USD" ? "$" : "KES "}
                        {txn.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-base font-bold text-slate-900 whitespace-nowrap text-right">
                      {txn.currency === "USD" ? "$" : "KES "}
                      {txn.balance.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-sm text-purple-600 font-mono whitespace-nowrap">
                      {txn.reference}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleViewTransaction(txn)}
                          className="p-2 bg-purple-600 text-white hover:bg-purple-700 transition-all rounded"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditTransaction(txn)}
                          className="p-2 bg-emerald-600 text-white hover:bg-emerald-700 transition-all rounded"
                          title="Edit Transaction"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTransaction(txn)}
                          className="p-2 bg-red-600 text-white hover:bg-red-700 transition-all rounded"
                          title="Delete Transaction"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalTransactionPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
            <p className="text-sm text-slate-600">
              Showing {indexOfFirstTransaction + 1} to{" "}
              {Math.min(indexOfLastTransaction, filteredTransactions.length)} of{" "}
              {filteredTransactions.length} transactions
            </p>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setTransactionsCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={transactionsCurrentPage === 1}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setTransactionsCurrentPage((prev) =>
                    Math.min(prev + 1, totalTransactionPages)
                  )
                }
                disabled={transactionsCurrentPage === totalTransactionPages}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Set Exchange Rate Modal */}
      <AnimatePresence>
        {showSetRateModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full border-2 border-indigo-600"
            >
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-xl relative">
                <button
                  onClick={() => setShowSetRateModal(false)}
                  className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <TrendingUp className="w-6 h-6" />
                  Set Exchange Rate
                </h3>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase">
                    Buy Rate (USD → KES)
                  </label>
                  <input
                    type="number"
                    value={rateForm.buyRate || ""}
                    onChange={(e) =>
                      setRateForm({
                        ...rateForm,
                        buyRate: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="e.g., 137.50"
                    step="0.01"
                    className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-lg focus:border-indigo-500 focus:outline-none text-lg font-bold"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Rate when buying USD from clients (paying in KES)
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase">
                    Sell Rate (KES → USD)
                  </label>
                  <input
                    type="number"
                    value={rateForm.sellRate || ""}
                    onChange={(e) =>
                      setRateForm({
                        ...rateForm,
                        sellRate: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="e.g., 140.00"
                    step="0.01"
                    className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-lg focus:border-indigo-500 focus:outline-none text-lg font-bold"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Rate when selling USD to clients (receiving KES)
                  </p>
                </div>

                {rateForm.buyRate > 0 && rateForm.sellRate > 0 && (
                  <div className="bg-indigo-50 border-2 border-indigo-200 p-4 rounded-lg">
                    <p className="text-sm font-bold text-indigo-700 mb-2">
                      Spread Preview
                    </p>
                    <p className="text-lg font-bold text-indigo-900">
                      KES {(rateForm.sellRate - rateForm.buyRate).toFixed(2)} (
                      {(
                        ((rateForm.sellRate - rateForm.buyRate) /
                          rateForm.buyRate) *
                        100
                      ).toFixed(2)}
                      %)
                    </p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-50 rounded-b-xl border-t border-slate-200 flex gap-3">
                <button
                  onClick={() => setShowSetRateModal(false)}
                  className="flex-1 px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSetRate}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <TrendingUp className="w-4 h-4" />
                  )}
                  {isSubmitting ? "Saving..." : "Set Rate"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* New Exchange Transaction Modal */}
      <AnimatePresence>
        {showNewExchangeModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl max-w-lg w-full border-2 border-purple-600"
            >
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-xl relative">
                <button
                  onClick={() => setShowNewExchangeModal(false)}
                  className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <ArrowRightLeft className="w-6 h-6" />
                  New Exchange Transaction
                </h3>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase">
                      From Currency
                    </label>
                    <select
                      value={exchangeForm.currencyFrom}
                      onChange={(e) =>
                        setExchangeForm({
                          ...exchangeForm,
                          currencyFrom: parseInt(e.target.value),
                          currencyTo: parseInt(e.target.value) === 0 ? 1 : 0,
                        })
                      }
                      className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                    >
                      <option value={0}>KES</option>
                      <option value={1}>USD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase">
                      To Currency
                    </label>
                    <select
                      value={exchangeForm.currencyTo}
                      onChange={(e) =>
                        setExchangeForm({
                          ...exchangeForm,
                          currencyTo: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-lg focus:border-purple-500 focus:outline-none font-semibold"
                    >
                      <option value={0}>KES</option>
                      <option value={1}>USD</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase">
                    Amount ({exchangeForm.currencyFrom === 0 ? "KES" : "USD"})
                  </label>
                  <input
                    type="number"
                    value={exchangeForm.amountFrom || ""}
                    onChange={(e) =>
                      setExchangeForm({
                        ...exchangeForm,
                        amountFrom: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="Enter amount"
                    step="0.01"
                    className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-lg focus:border-purple-500 focus:outline-none text-lg font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase">
                    Exchange Rate (Optional - uses current rate if empty)
                  </label>
                  <input
                    type="number"
                    value={exchangeForm.exchangeRate || ""}
                    onChange={(e) =>
                      setExchangeForm({
                        ...exchangeForm,
                        exchangeRate: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder={`Current: ${currentRate?.buyRate || "N/A"}`}
                    step="0.01"
                    className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                </div>

                {exchangeForm.amountFrom > 0 && currentRate && (
                  <div className="bg-purple-50 border-2 border-purple-200 p-4 rounded-lg">
                    <p className="text-sm font-bold text-purple-700 mb-2">
                      Conversion Preview
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-purple-900">
                        {exchangeForm.currencyFrom === 0 ? "KES" : "$"}{" "}
                        {exchangeForm.amountFrom.toLocaleString()}
                      </span>
                      <ArrowRightLeft className="w-5 h-5 text-purple-600" />
                      <span className="text-lg font-bold text-purple-900">
                        {exchangeForm.currencyTo === 0 ? "KES" : "$"}{" "}
                        {(
                          exchangeForm.amountFrom *
                          (exchangeForm.currencyFrom === 0
                            ? 1 /
                              (exchangeForm.exchangeRate ||
                                currentRate.sellRate)
                            : exchangeForm.exchangeRate || currentRate.buyRate)
                        ).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-50 rounded-b-xl border-t border-slate-200 flex gap-3">
                <button
                  onClick={() => setShowNewExchangeModal(false)}
                  className="flex-1 px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateExchange}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowRightLeft className="w-4 h-4" />
                  )}
                  {isSubmitting ? "Creating..." : "Create Exchange"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Transaction Modal */}
      <AnimatePresence>
        {showViewTransaction && selectedTransaction && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border-2 border-purple-600"
            >
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-xl relative">
                <button
                  onClick={() => {
                    setShowViewTransaction(false);
                    setSelectedTransaction(null);
                  }}
                  className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Eye className="w-6 h-6" />
                  Transaction Details
                </h3>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase">
                      Transaction ID
                    </label>
                    <p className="text-lg font-bold text-purple-600 mt-1">
                      {selectedTransaction.id}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase">
                      Reference
                    </label>
                    <p className="text-lg font-mono font-bold text-slate-900 mt-1">
                      {selectedTransaction.reference}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase">
                      Date & Time
                    </label>
                    <p className="text-base font-semibold text-slate-900 mt-1">
                      {new Date(selectedTransaction.date).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase">
                      Type
                    </label>
                    <div className="mt-1">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-bold ${
                          selectedTransaction.type === "credit"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {selectedTransaction.type === "credit" ? (
                          <ArrowUpCircle className="w-4 h-4" />
                        ) : (
                          <ArrowDownCircle className="w-4 h-4" />
                        )}
                        {selectedTransaction.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase">
                      Currency
                    </label>
                    <p className="text-base font-bold text-slate-900 mt-1">
                      {selectedTransaction.currency}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase">
                      Amount
                    </label>
                    <p
                      className={`text-xl font-bold mt-1 ${
                        selectedTransaction.type === "credit"
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedTransaction.type === "credit" ? "+" : "-"}
                      {selectedTransaction.currency === "USD" ? "$" : "KES "}
                      {selectedTransaction.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-slate-600 uppercase">
                      Description
                    </label>
                    <p className="text-base font-semibold text-slate-900 mt-1">
                      {selectedTransaction.description}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase">
                      Balance After
                    </label>
                    <p className="text-lg font-bold text-slate-900 mt-1">
                      {selectedTransaction.currency === "USD" ? "$" : "KES "}
                      {selectedTransaction.balance.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-b-xl border-t border-slate-200">
                <button
                  onClick={() => {
                    setShowViewTransaction(false);
                    setSelectedTransaction(null);
                  }}
                  className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Transaction Modal */}
      <AnimatePresence>
        {showEditTransaction && selectedTransaction && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border-2 border-emerald-600"
            >
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-t-xl relative">
                <button
                  onClick={() => {
                    setShowEditTransaction(false);
                    setSelectedTransaction(null);
                  }}
                  className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Edit3 className="w-6 h-6" />
                  Edit Transaction
                </h3>
              </div>

              <form className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase">
                      Transaction ID
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedTransaction.id}
                      disabled
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-lg font-mono text-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase">
                      Reference
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedTransaction.reference}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase">
                      Date & Time
                    </label>
                    <input
                      type="text"
                      defaultValue={new Date(
                        selectedTransaction.date
                      ).toLocaleString()}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase">
                      Type
                    </label>
                    <select
                      defaultValue={selectedTransaction.type}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none font-semibold"
                    >
                      <option value="credit">CREDIT</option>
                      <option value="debit">DEBIT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase">
                      Currency
                    </label>
                    <select
                      defaultValue={selectedTransaction.currency}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none font-semibold"
                    >
                      <option value="KES">KES</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase">
                      Amount
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedTransaction.amount}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none font-bold"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase">
                      Description
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedTransaction.description}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </form>

              <div className="p-4 bg-slate-50 rounded-b-xl border-t border-slate-200 flex gap-3">
                <button
                  onClick={() => {
                    setShowEditTransaction(false);
                    setSelectedTransaction(null);
                  }}
                  className="flex-1 px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toast.success(
                      `Transaction ${selectedTransaction.reference} updated successfully!`
                    );
                    setShowEditTransaction(false);
                    setSelectedTransaction(null);
                  }}
                  className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Transaction Modal */}
      <AnimatePresence>
        {showDeleteTransaction && selectedTransaction && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full border-2 border-red-600"
            >
              <div className="bg-gradient-to-r from-red-600 to-rose-600 p-6 rounded-t-xl relative">
                <button
                  onClick={() => {
                    setShowDeleteTransaction(false);
                    setSelectedTransaction(null);
                  }}
                  className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Trash2 className="w-6 h-6" />
                  Delete Transaction
                </h3>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                </div>
                <h4 className="text-lg font-bold text-slate-900 text-center mb-2">
                  Are you sure you want to delete this transaction?
                </h4>
                <p className="text-slate-600 text-center mb-4">
                  This action cannot be undone. The transaction will be
                  permanently removed.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs font-semibold text-slate-600">
                      Transaction ID:
                    </span>
                    <span className="text-xs font-bold text-red-600">
                      {selectedTransaction.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs font-semibold text-slate-600">
                      Reference:
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-900">
                      {selectedTransaction.reference}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs font-semibold text-slate-600">
                      Amount:
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {selectedTransaction.currency === "USD" ? "$" : "KES "}
                      {selectedTransaction.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-b-xl border-t border-slate-200 flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteTransaction(false);
                    setSelectedTransaction(null);
                  }}
                  className="flex-1 px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteTransaction}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all"
                >
                  Delete Transaction
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
