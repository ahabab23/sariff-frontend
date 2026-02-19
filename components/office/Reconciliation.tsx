// import { useState, useEffect, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   CheckCircle2,
//   AlertTriangle,
//   CreditCard,
//   Smartphone,
//   DollarSign,
//   Calendar,
//   FileText,
//   Download,
//   Upload,
//   Search,
//   Filter,
//   RefreshCw,
//   Eye,
//   XCircle,
//   TrendingUp,
//   AlertCircle,
//   Check,
//   X,
//   Clock,
//   Building2,
//   Wallet,
//   Banknote,
//   ArrowUpCircle,
//   ArrowDownCircle,
//   Loader2,
//   ChevronLeft,
//   ChevronRight,
//   CheckSquare,
//   Square,
//   ListChecks,
//   Save,
//   RotateCcw,
//   Info,
// } from "lucide-react";
// import { toast } from "sonner";
// import {
//   getReconciliations,
//   createReconciliation,
//   getBankAccounts,
//   getCashAccounts,
//   getMpesaAgents,
//   getTransactions,
//   ReconciliationDto,
//   AccountType,
// } from "@/lib/api";

// // Reconciliation status enum
// enum ReconciliationStatus {
//   Pending = 0,
//   Matched = 1,
//   Unmatched = 2,
// }

// interface ReconciliationTransaction {
//   id: string;
//   code: string;
//   reference: string;
//   date: string;
//   description: string;
//   type: "debit" | "credit";
//   expectedAmount: number;
//   actualAmount?: number;
//   variance?: number;
//   currency: "KES" | "USD";
//   status: ReconciliationStatus;
//   reconciledAt?: string;
//   reconciledByName?: string;
//   notes?: string;
//   selected?: boolean;
// }

// interface AccountSummary {
//   id: string;
//   code: string;
//   name: string;
//   accountType: AccountType;
//   currency: "KES" | "USD";
//   balance: number;
//   pendingCount: number;
//   matchedCount: number;
//   unmatchedCount: number;
// }

// interface ReconciliationBalance {
//   expectedBalance: number;
//   actualBalance: number;
//   variance: number;
//   pendingCount: number;
//   matchedCount: number;
//   unmatchedCount: number;
//   pendingAmount: number;
//   matchedAmount: number;
//   unmatchedAmount: number;
// }

// export function Reconciliation() {
//   // Account states
//   const [selectedAccountType, setSelectedAccountType] = useState<
//     "bank" | "mpesa" | "cash"
//   >("bank");
//   const [selectedAccountId, setSelectedAccountId] = useState<string>("");
//   const [accounts, setAccounts] = useState<AccountSummary[]>([]);

//   // Transaction states
//   const [transactions, setTransactions] = useState<ReconciliationTransaction[]>(
//     []
//   );
//   const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(
//     new Set()
//   );

//   // Reconciliation states
//   const [reconciliations, setReconciliations] = useState<ReconciliationDto[]>(
//     []
//   );
//   const [reconciliationBalance, setReconciliationBalance] =
//     useState<ReconciliationBalance>({
//       expectedBalance: 0,
//       actualBalance: 0,
//       variance: 0,
//       pendingCount: 0,
//       matchedCount: 0,
//       unmatchedCount: 0,
//       pendingAmount: 0,
//       matchedAmount: 0,
//       unmatchedAmount: 0,
//     });

//   // UI states
//   const [loading, setLoading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState<
//     "all" | "pending" | "matched" | "unmatched"
//   >("all");
//   const [dateFrom, setDateFrom] = useState("");
//   const [dateTo, setDateTo] = useState("");
//   const [actualBalanceInput, setActualBalanceInput] = useState<number>(0);

//   // Modal states
//   const [showReconcileModal, setShowReconcileModal] = useState(false);
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [showBulkModal, setShowBulkModal] = useState(false);
//   const [showCompleteModal, setShowCompleteModal] = useState(false);
//   const [selectedTransaction, setSelectedTransaction] =
//     useState<ReconciliationTransaction | null>(null);

//   // Form states
//   const [reconcileForm, setReconcileForm] = useState({
//     actualAmount: 0,
//     status: ReconciliationStatus.Matched,
//     notes: "",
//   });

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(15);

//   // Fetch accounts based on type
//   const fetchAccounts = useCallback(async () => {
//     try {
//       setLoading(true);
//       let response;

//       switch (selectedAccountType) {
//         case "bank":
//           response = await getBankAccounts();
//           break;
//         case "mpesa":
//           response = await getMpesaAgents();
//           break;
//         case "cash":
//           response = await getCashAccounts();
//           break;
//       }

//       if (response?.success && response.data) {
//         const mappedAccounts: AccountSummary[] = response.data.map(
//           (acc: any) => ({
//             id: acc.id,
//             code: acc.code || acc.id.slice(0, 8).toUpperCase(),
//             name: acc.bankName || acc.agentName || acc.name || "Account",
//             accountType:
//               selectedAccountType === "bank"
//                 ? 1
//                 : selectedAccountType === "mpesa"
//                 ? 2
//                 : 0,
//             currency:
//               acc.currency === 0 || acc.currency === "KES" ? "KES" : "USD",
//             balance: acc.balance || 0,
//             pendingCount: 0,
//             matchedCount: 0,
//             unmatchedCount: 0,
//           })
//         );

//         setAccounts(mappedAccounts);
//         if (mappedAccounts.length > 0 && !selectedAccountId) {
//           setSelectedAccountId(mappedAccounts[0].id);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching accounts:", error);
//       toast.error("Failed to load accounts");
//     } finally {
//       setLoading(false);
//     }
//   }, [selectedAccountType, selectedAccountId]);

//   // Fetch transactions for reconciliation
//   const fetchTransactions = useCallback(async () => {
//     if (!selectedAccountId) return;

//     try {
//       setLoading(true);
//       const response = await getTransactions(1, 1000);

//       if (response?.success && response.data) {
//         const txnData = response.data.items || response.data;
//         if (Array.isArray(txnData)) {
//           // Filter transactions for selected account
//           const accountTransactions: ReconciliationTransaction[] = txnData
//             .filter((txn: any) => {
//               // Match by account ID in either debit or credit side
//               return (
//                 txn.debitAccountId === selectedAccountId ||
//                 txn.creditAccountId === selectedAccountId ||
//                 txn.accountId === selectedAccountId
//               );
//             })
//             .map((txn: any) => ({
//               id: txn.id,
//               code: txn.code || txn.id.slice(0, 8).toUpperCase(),
//               reference: txn.reference || txn.code || "",
//               date: txn.transactionDate || txn.date || txn.createdAt,
//               description: txn.description || txn.narration || "",
//               type:
//                 txn.transactionType === 0 || txn.type === "debit"
//                   ? "debit"
//                   : "credit",
//               expectedAmount: Math.abs(txn.amount),
//               actualAmount: txn.actualAmount,
//               variance: txn.variance,
//               currency: txn.currency === 0 ? "KES" : "USD",
//               status: txn.reconciliationStatus ?? ReconciliationStatus.Pending,
//               reconciledAt: txn.reconciledAt,
//               reconciledByName: txn.reconciledByName,
//               notes: txn.reconciliationNotes,
//               selected: false,
//             }));

//           setTransactions(accountTransactions);
//           calculateBalanceSummary(accountTransactions);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching transactions:", error);
//       toast.error("Failed to load transactions");
//     } finally {
//       setLoading(false);
//     }
//   }, [selectedAccountId]);

//   // Fetch existing reconciliations
//   const fetchReconciliations = useCallback(async () => {
//     try {
//       const response = await getReconciliations(1, 100);
//       if (response?.success && response.data) {
//         const recons = response.data.items || response.data;
//         if (Array.isArray(recons)) {
//           setReconciliations(recons);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching reconciliations:", error);
//     }
//   }, []);

//   // Calculate balance summary
//   const calculateBalanceSummary = (txns: ReconciliationTransaction[]) => {
//     const selectedAccount = accounts.find((a) => a.id === selectedAccountId);
//     const expectedBalance = selectedAccount?.balance || 0;

//     const pending = txns.filter(
//       (t) => t.status === ReconciliationStatus.Pending
//     );
//     const matched = txns.filter(
//       (t) => t.status === ReconciliationStatus.Matched
//     );
//     const unmatched = txns.filter(
//       (t) => t.status === ReconciliationStatus.Unmatched
//     );

//     const pendingAmount = pending.reduce((sum, t) => sum + t.expectedAmount, 0);
//     const matchedAmount = matched.reduce(
//       (sum, t) => sum + (t.actualAmount || t.expectedAmount),
//       0
//     );
//     const unmatchedAmount = unmatched.reduce(
//       (sum, t) => sum + Math.abs((t.actualAmount || 0) - t.expectedAmount),
//       0
//     );

//     setReconciliationBalance({
//       expectedBalance,
//       actualBalance: actualBalanceInput,
//       variance: actualBalanceInput - expectedBalance,
//       pendingCount: pending.length,
//       matchedCount: matched.length,
//       unmatchedCount: unmatched.length,
//       pendingAmount,
//       matchedAmount,
//       unmatchedAmount,
//     });
//   };

//   // Effects
//   useEffect(() => {
//     fetchAccounts();
//   }, [fetchAccounts]);

//   useEffect(() => {
//     if (selectedAccountId) {
//       fetchTransactions();
//       fetchReconciliations();
//     }
//   }, [selectedAccountId, fetchTransactions, fetchReconciliations]);

//   useEffect(() => {
//     calculateBalanceSummary(transactions);
//   }, [actualBalanceInput, transactions, accounts, selectedAccountId]);

//   // Handlers
//   const handleSelectTransaction = (id: string) => {
//     setSelectedTransactions((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(id)) {
//         newSet.delete(id);
//       } else {
//         newSet.add(id);
//       }
//       return newSet;
//     });
//   };

//   const handleSelectAll = () => {
//     if (selectedTransactions.size === filteredTransactions.length) {
//       setSelectedTransactions(new Set());
//     } else {
//       setSelectedTransactions(new Set(filteredTransactions.map((t) => t.id)));
//     }
//   };

//   const handleReconcileTransaction = async () => {
//     if (!selectedTransaction) return;

//     setIsSubmitting(true);
//     try {
//       // Update local state
//       setTransactions((prev) =>
//         prev.map((t) =>
//           t.id === selectedTransaction.id
//             ? {
//                 ...t,
//                 actualAmount: reconcileForm.actualAmount,
//                 variance: reconcileForm.actualAmount - t.expectedAmount,
//                 status: reconcileForm.status,
//                 notes: reconcileForm.notes,
//                 reconciledAt: new Date().toISOString(),
//               }
//             : t
//         )
//       );

//       toast.success(
//         reconcileForm.status === ReconciliationStatus.Matched
//           ? "✓ Transaction matched successfully"
//           : "⚠ Transaction marked as unmatched"
//       );

//       setShowReconcileModal(false);
//       setSelectedTransaction(null);
//       setReconcileForm({
//         actualAmount: 0,
//         status: ReconciliationStatus.Matched,
//         notes: "",
//       });
//     } catch (error) {
//       console.error("Error reconciling transaction:", error);
//       toast.error("Failed to reconcile transaction");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleBulkReconcile = async (status: ReconciliationStatus) => {
//     if (selectedTransactions.size === 0) {
//       toast.error("Please select transactions to reconcile");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       setTransactions((prev) =>
//         prev.map((t) =>
//           selectedTransactions.has(t.id)
//             ? {
//                 ...t,
//                 actualAmount: t.expectedAmount,
//                 variance: 0,
//                 status,
//                 reconciledAt: new Date().toISOString(),
//               }
//             : t
//         )
//       );

//       toast.success(
//         `✓ ${selectedTransactions.size} transactions ${
//           status === ReconciliationStatus.Matched
//             ? "matched"
//             : "marked as unmatched"
//         }`
//       );

//       setSelectedTransactions(new Set());
//       setShowBulkModal(false);
//     } catch (error) {
//       console.error("Error bulk reconciling:", error);
//       toast.error("Failed to bulk reconcile transactions");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleAutoReconcile = () => {
//     setTransactions((prev) =>
//       prev.map((t) =>
//         t.status === ReconciliationStatus.Pending
//           ? {
//               ...t,
//               actualAmount: t.expectedAmount,
//               variance: 0,
//               status: ReconciliationStatus.Matched,
//               reconciledAt: new Date().toISOString(),
//             }
//           : t
//       )
//     );
//     toast.success("✓ All pending transactions auto-reconciled");
//   };

//   const handleCompleteReconciliation = async () => {
//     const pendingCount = transactions.filter(
//       (t) => t.status === ReconciliationStatus.Pending
//     ).length;
//     const unmatchedCount = transactions.filter(
//       (t) => t.status === ReconciliationStatus.Unmatched
//     ).length;

//     if (pendingCount > 0) {
//       toast.error(
//         `❌ Cannot complete reconciliation. ${pendingCount} transactions are still pending.`
//       );
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const selectedAccount = accounts.find((a) => a.id === selectedAccountId);

//       // Create reconciliation record via API
//       const dto = {
//         accountType:
//           selectedAccountType === "bank"
//             ? 1
//             : selectedAccountType === "mpesa"
//             ? 2
//             : 0,
//         accountId: selectedAccountId,
//         actualBalance: actualBalanceInput,
//         notes:
//           unmatchedCount > 0
//             ? `Completed with ${unmatchedCount} unmatched transactions`
//             : "All transactions matched",
//       };

//       const response = await createReconciliation(dto);

//       if (response.success) {
//         if (unmatchedCount > 0) {
//           toast.warning(
//             `⚠ Reconciliation completed with ${unmatchedCount} unmatched transactions.`
//           );
//         } else {
//           toast.success(
//             "✓ Reconciliation completed successfully! All transactions matched."
//           );
//         }
//         setShowCompleteModal(false);
//         fetchReconciliations();
//       } else {
//         toast.error(response.error || "Failed to complete reconciliation");
//       }
//     } catch (error) {
//       console.error("Error completing reconciliation:", error);
//       toast.error("Failed to complete reconciliation");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleResetTransaction = (id: string) => {
//     setTransactions((prev) =>
//       prev.map((t) =>
//         t.id === id
//           ? {
//               ...t,
//               actualAmount: undefined,
//               variance: undefined,
//               status: ReconciliationStatus.Pending,
//               reconciledAt: undefined,
//               notes: undefined,
//             }
//           : t
//       )
//     );
//     toast.success("Transaction reset to pending");
//   };

//   const handleExportReport = () => {
//     const csvData = [
//       [
//         "Reference",
//         "Date",
//         "Description",
//         "Type",
//         "Expected Amount",
//         "Actual Amount",
//         "Variance",
//         "Status",
//         "Notes",
//       ],
//       ...filteredTransactions.map((txn) => [
//         txn.reference,
//         new Date(txn.date).toLocaleDateString(),
//         txn.description,
//         txn.type.toUpperCase(),
//         txn.expectedAmount.toFixed(2),
//         txn.actualAmount?.toFixed(2) || "-",
//         txn.variance?.toFixed(2) || "-",
//         txn.status === ReconciliationStatus.Matched
//           ? "Matched"
//           : txn.status === ReconciliationStatus.Unmatched
//           ? "Unmatched"
//           : "Pending",
//         txn.notes || "",
//       ]),
//     ];

//     const csv = csvData.map((row) => row.join(",")).join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     const accountName =
//       accounts.find((a) => a.id === selectedAccountId)?.name || "account";
//     a.download = `reconciliation-${accountName}-${
//       new Date().toISOString().split("T")[0]
//     }.csv`;
//     a.click();
//     toast.success("✓ Reconciliation report exported");
//   };

//   // Filter transactions
//   const filteredTransactions = transactions.filter((txn) => {
//     const matchesSearch =
//       txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       txn.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       txn.code.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesStatus =
//       statusFilter === "all" ||
//       (statusFilter === "pending" &&
//         txn.status === ReconciliationStatus.Pending) ||
//       (statusFilter === "matched" &&
//         txn.status === ReconciliationStatus.Matched) ||
//       (statusFilter === "unmatched" &&
//         txn.status === ReconciliationStatus.Unmatched);

//     const matchesDate =
//       (!dateFrom || txn.date >= dateFrom) && (!dateTo || txn.date <= dateTo);

//     return matchesSearch && matchesStatus && matchesDate;
//   });

//   // Pagination
//   const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
//   const paginatedTransactions = filteredTransactions.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   // Get selected account
//   const selectedAccount = accounts.find((a) => a.id === selectedAccountId);
//   const isBalanced = Math.abs(reconciliationBalance.variance) < 0.01;

//   // Status badge component
//   const StatusBadge = ({ status }: { status: ReconciliationStatus }) => {
//     if (status === ReconciliationStatus.Matched) {
//       return (
//         <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase">
//           <CheckCircle2 className="w-3 h-3" />
//           Matched
//         </span>
//       );
//     } else if (status === ReconciliationStatus.Unmatched) {
//       return (
//         <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 border border-red-200 text-xs font-bold uppercase">
//           <AlertTriangle className="w-3 h-3" />
//           Unmatched
//         </span>
//       );
//     } else {
//       return (
//         <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold uppercase">
//           <Clock className="w-3 h-3" />
//           Pending
//         </span>
//       );
//     }
//   };

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
//               Account Reconciliation
//             </h1>
//             <p className="text-slate-600 font-medium">
//               Match and verify account transactions with bank/M-Pesa statements
//             </p>
//           </div>
//           <div className="flex gap-3">
//             <button
//               onClick={() => {
//                 fetchAccounts();
//                 fetchTransactions();
//               }}
//               disabled={loading}
//               className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-blue-200 text-blue-600 font-bold shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300 disabled:opacity-50"
//             >
//               {loading ? (
//                 <Loader2 className="w-5 h-5 animate-spin" />
//               ) : (
//                 <RefreshCw className="w-5 h-5" />
//               )}
//               Refresh
//             </button>
//             <button
//               onClick={handleExportReport}
//               className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
//             >
//               <Download className="w-5 h-5" />
//               Export Report
//             </button>
//           </div>
//         </motion.div>

//         {/* Account Type Selector */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="flex gap-4"
//         >
//           <button
//             onClick={() => {
//               setSelectedAccountType("bank");
//               setSelectedAccountId("");
//             }}
//             className={`flex items-center gap-3 px-6 py-4 font-semibold transition-all ${
//               selectedAccountType === "bank"
//                 ? "bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white shadow-lg shadow-blue-500/30"
//                 : "bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-200"
//             }`}
//           >
//             <Building2 className="w-5 h-5" />
//             Bank Accounts
//           </button>
//           <button
//             onClick={() => {
//               setSelectedAccountType("mpesa");
//               setSelectedAccountId("");
//             }}
//             className={`flex items-center gap-3 px-6 py-4 font-semibold transition-all ${
//               selectedAccountType === "mpesa"
//                 ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
//                 : "bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-200"
//             }`}
//           >
//             <Smartphone className="w-5 h-5" />
//             M-Pesa Accounts
//           </button>
//           <button
//             onClick={() => {
//               setSelectedAccountType("cash");
//               setSelectedAccountId("");
//             }}
//             className={`flex items-center gap-3 px-6 py-4 font-semibold transition-all ${
//               selectedAccountType === "cash"
//                 ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
//                 : "bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-200"
//             }`}
//           >
//             <Wallet className="w-5 h-5" />
//             Cash at Hand
//           </button>
//         </motion.div>

//         {/* Account Selector */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="bg-white border-2 border-slate-200 p-6 shadow-lg"
//         >
//           <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
//             Select Account to Reconcile
//           </label>
//           <select
//             value={selectedAccountId}
//             onChange={(e) => setSelectedAccountId(e.target.value)}
//             className="w-full px-4 py-3 border-2 border-slate-200 bg-white text-slate-900 font-medium focus:outline-none focus:border-blue-500 transition-colors"
//           >
//             {accounts.length === 0 ? (
//               <option>No accounts available</option>
//             ) : (
//               accounts.map((acc) => (
//                 <option key={acc.id} value={acc.id}>
//                   {acc.name} - {acc.currency} (Balance:{" "}
//                   {acc.balance.toLocaleString()})
//                 </option>
//               ))
//             )}
//           </select>
//         </motion.div>

//         {/* Status Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           {/* Expected Balance */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             whileHover={{ scale: 1.02 }}
//             className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-blue-300 transition-all duration-300 group"
//           >
//             <div className="p-6">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="w-12 h-12 bg-blue-100 flex items-center justify-center border-2 border-blue-200 group-hover:bg-blue-200 transition-colors">
//                   <FileText className="w-6 h-6 text-blue-600" />
//                 </div>
//                 <div className="bg-blue-100 px-3 py-1 border border-blue-200">
//                   <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">
//                     System
//                   </span>
//                 </div>
//               </div>
//               <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
//                 Expected Balance
//               </p>
//               <p className="text-3xl font-bold text-blue-600 tracking-tight">
//                 {reconciliationBalance.expectedBalance.toLocaleString("en-US", {
//                   minimumFractionDigits: 2,
//                 })}
//               </p>
//               <div className="mt-3 pt-3 border-t-2 border-slate-100">
//                 <p className="text-[10px] text-slate-500 font-semibold">
//                   From System Records
//                 </p>
//               </div>
//             </div>
//           </motion.div>

//           {/* Actual Balance Input */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.35 }}
//             whileHover={{ scale: 1.02 }}
//             className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-purple-300 transition-all duration-300 group"
//           >
//             <div className="p-6">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="w-12 h-12 bg-purple-100 flex items-center justify-center border-2 border-purple-200 group-hover:bg-purple-200 transition-colors">
//                   <DollarSign className="w-6 h-6 text-purple-600" />
//                 </div>
//                 <div className="bg-purple-100 px-3 py-1 border border-purple-200">
//                   <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wide">
//                     Actual
//                   </span>
//                 </div>
//               </div>
//               <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
//                 Actual Balance (Statement)
//               </p>
//               <input
//                 type="number"
//                 value={actualBalanceInput || ""}
//                 onChange={(e) =>
//                   setActualBalanceInput(parseFloat(e.target.value) || 0)
//                 }
//                 placeholder="Enter actual balance"
//                 className="w-full text-3xl font-bold text-purple-700 bg-transparent border-b-2 border-purple-300 focus:border-purple-600 outline-none transition-colors"
//                 step="0.01"
//               />
//               <div className="mt-3 pt-3 border-t-2 border-slate-100">
//                 <p className="text-[10px] text-slate-500 font-semibold">
//                   Enter from Bank/M-Pesa Statement
//                 </p>
//               </div>
//             </div>
//           </motion.div>

//           {/* Variance */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//             whileHover={{ scale: 1.02 }}
//             className={`border-2 shadow-lg hover:shadow-xl transition-all duration-300 group ${
//               isBalanced
//                 ? "bg-white hover:border-emerald-300"
//                 : "bg-white hover:border-red-300"
//             }`}
//           >
//             <div className="p-6">
//               <div className="flex items-start justify-between mb-4">
//                 {isBalanced ? (
//                   <div className="w-12 h-12 bg-emerald-100 flex items-center justify-center border-2 border-emerald-200 group-hover:bg-emerald-200 transition-colors">
//                     <CheckCircle2 className="w-6 h-6 text-emerald-600" />
//                   </div>
//                 ) : (
//                   <div className="w-12 h-12 bg-red-100 flex items-center justify-center border-2 border-red-200 group-hover:bg-red-200 transition-colors">
//                     <AlertTriangle className="w-6 h-6 text-red-600" />
//                   </div>
//                 )}
//                 <div
//                   className={`px-3 py-1 border ${
//                     isBalanced
//                       ? "bg-emerald-100 border-emerald-200"
//                       : "bg-red-100 border-red-200"
//                   }`}
//                 >
//                   <span
//                     className={`text-[10px] font-bold uppercase tracking-wide ${
//                       isBalanced ? "text-emerald-700" : "text-red-700"
//                     }`}
//                   >
//                     {isBalanced ? "Balanced" : "Variance"}
//                   </span>
//                 </div>
//               </div>
//               <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
//                 Difference
//               </p>
//               <p
//                 className={`text-3xl font-bold tracking-tight ${
//                   isBalanced ? "text-emerald-600" : "text-red-600"
//                 }`}
//               >
//                 {reconciliationBalance.variance >= 0 ? "+" : ""}
//                 {reconciliationBalance.variance.toLocaleString("en-US", {
//                   minimumFractionDigits: 2,
//                 })}
//               </p>
//               <div className="mt-3 pt-3 border-t-2 border-slate-100">
//                 <p
//                   className={`text-[10px] font-semibold ${
//                     isBalanced ? "text-emerald-600" : "text-red-600"
//                   }`}
//                 >
//                   {isBalanced ? "✓ Perfectly Balanced" : "⚠ Requires Attention"}
//                 </p>
//               </div>
//             </div>
//           </motion.div>

//           {/* Progress Summary */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.45 }}
//             whileHover={{ scale: 1.02 }}
//             className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-amber-300 transition-all duration-300 group"
//           >
//             <div className="p-6">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="w-12 h-12 bg-amber-100 flex items-center justify-center border-2 border-amber-200 group-hover:bg-amber-200 transition-colors">
//                   <TrendingUp className="w-6 h-6 text-amber-600" />
//                 </div>
//                 <div className="bg-amber-100 px-3 py-1 border border-amber-200">
//                   <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">
//                     Progress
//                   </span>
//                 </div>
//               </div>
//               <p className="text-[10px] text-slate-500 mb-3 uppercase tracking-wider font-bold">
//                 Reconciliation Status
//               </p>
//               <div className="space-y-2">
//                 <div className="flex justify-between items-center">
//                   <span className="text-xs text-slate-600 font-medium">
//                     Matched:
//                   </span>
//                   <span className="text-sm font-bold text-emerald-600">
//                     {reconciliationBalance.matchedCount}/{transactions.length}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-xs text-slate-600 font-medium">
//                     Unmatched:
//                   </span>
//                   <span className="text-sm font-bold text-red-600">
//                     {reconciliationBalance.unmatchedCount}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-xs text-slate-600 font-medium">
//                     Pending:
//                   </span>
//                   <span className="text-sm font-bold text-amber-600">
//                     {reconciliationBalance.pendingCount}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>

//         {/* Filters and Actions */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.5 }}
//           className="bg-white border-2 border-slate-200 p-6 shadow-lg"
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//             {/* Search */}
//             <div className="lg:col-span-2">
//               <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                 Search Transactions
//               </label>
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   placeholder="Search by description or reference..."
//                   className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors"
//                 />
//               </div>
//             </div>

//             {/* Status Filter */}
//             <div>
//               <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                 Status Filter
//               </label>
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value as any)}
//                 className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors"
//               >
//                 <option value="all">All Statuses</option>
//                 <option value="pending">Pending</option>
//                 <option value="matched">Matched</option>
//                 <option value="unmatched">Unmatched</option>
//               </select>
//             </div>

//             {/* Bulk Actions */}
//             <div>
//               <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                 Bulk Actions ({selectedTransactions.size} selected)
//               </label>
//               <button
//                 onClick={() => setShowBulkModal(true)}
//                 disabled={selectedTransactions.size === 0}
//                 className="w-full px-4 py-3 bg-purple-600 text-white font-bold shadow-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//               >
//                 <ListChecks className="w-4 h-4" />
//                 Bulk Reconcile
//               </button>
//             </div>

//             {/* Auto Reconcile */}
//             <div>
//               <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                 Quick Actions
//               </label>
//               <button
//                 onClick={handleAutoReconcile}
//                 disabled={reconciliationBalance.pendingCount === 0}
//                 className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Auto Reconcile All
//               </button>
//             </div>
//           </div>
//         </motion.div>

//         {/* Transactions Table */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.6 }}
//           className="bg-white/90 backdrop-blur-xl border-2 border-slate-200 shadow-2xl overflow-hidden"
//         >
//           <div className="p-6 border-b-2 border-slate-200 bg-gradient-to-r from-blue-50 to-cyan-50 flex justify-between items-center">
//             <div>
//               <h3 className="text-lg font-bold text-slate-900">
//                 Transaction Details
//               </h3>
//               <p className="text-sm text-slate-600 mt-1">
//                 Showing {filteredTransactions.length} transactions for
//                 reconciliation
//               </p>
//             </div>
//             <button
//               onClick={() => setShowCompleteModal(true)}
//               disabled={
//                 reconciliationBalance.pendingCount > 0 ||
//                 transactions.length === 0
//               }
//               className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <CheckCircle2 className="w-5 h-5" />
//               Complete Reconciliation
//             </button>
//           </div>

//           {loading ? (
//             <div className="flex items-center justify-center py-20">
//               <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
//             </div>
//           ) : filteredTransactions.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-20 text-slate-500">
//               <FileText className="w-16 h-16 mb-4 text-slate-300" />
//               <p className="text-lg font-medium">No transactions found</p>
//               <p className="text-sm">Select an account to view transactions</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
//                   <tr>
//                     <th className="px-4 py-3 text-center">
//                       <button
//                         onClick={handleSelectAll}
//                         className="p-1 hover:bg-slate-200 transition"
//                       >
//                         {selectedTransactions.size ===
//                         filteredTransactions.length ? (
//                           <CheckSquare className="w-5 h-5 text-blue-600" />
//                         ) : (
//                           <Square className="w-5 h-5 text-slate-400" />
//                         )}
//                       </button>
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Date
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Reference
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Description
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Type
//                     </th>
//                     <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Expected
//                     </th>
//                     <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Actual
//                     </th>
//                     <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Variance
//                     </th>
//                     <th className="px-4 py-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-4 py-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-slate-200">
//                   {paginatedTransactions.map((txn, index) => (
//                     <motion.tr
//                       key={txn.id}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.02 }}
//                       className={`hover:bg-blue-50/50 transition-colors ${
//                         selectedTransactions.has(txn.id) ? "bg-blue-50" : ""
//                       }`}
//                     >
//                       <td className="px-4 py-4 text-center">
//                         <button
//                           onClick={() => handleSelectTransaction(txn.id)}
//                           className="p-1 hover:bg-slate-200 transition"
//                         >
//                           {selectedTransactions.has(txn.id) ? (
//                             <CheckSquare className="w-5 h-5 text-blue-600" />
//                           ) : (
//                             <Square className="w-5 h-5 text-slate-400" />
//                           )}
//                         </button>
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-900">
//                         {new Date(txn.date).toLocaleDateString("en-US", {
//                           month: "short",
//                           day: "numeric",
//                           year: "numeric",
//                         })}
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap">
//                         <span className="text-sm font-mono text-slate-600">
//                           {txn.reference}
//                         </span>
//                       </td>
//                       <td className="px-4 py-4 text-sm text-slate-900 font-medium max-w-xs truncate">
//                         {txn.description}
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap">
//                         {txn.type === "debit" ? (
//                           <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase">
//                             <ArrowUpCircle className="w-3 h-3" />
//                             DR
//                           </span>
//                         ) : (
//                           <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 border border-red-200 text-xs font-bold uppercase">
//                             <ArrowDownCircle className="w-3 h-3" />
//                             CR
//                           </span>
//                         )}
//                       </td>
//                       <td className="px-4 py-4 text-sm text-right font-bold text-slate-900">
//                         {txn.currency}{" "}
//                         {txn.expectedAmount.toLocaleString("en-US", {
//                           minimumFractionDigits: 2,
//                         })}
//                       </td>
//                       <td
//                         className={`px-4 py-4 text-sm text-right font-bold ${
//                           txn.actualAmount !== undefined
//                             ? "text-purple-700"
//                             : "text-slate-400"
//                         }`}
//                       >
//                         {txn.actualAmount !== undefined
//                           ? `${txn.currency} ${txn.actualAmount.toLocaleString(
//                               "en-US",
//                               { minimumFractionDigits: 2 }
//                             )}`
//                           : "-"}
//                       </td>
//                       <td
//                         className={`px-4 py-4 text-sm text-right font-bold ${
//                           txn.variance === undefined
//                             ? "text-slate-400"
//                             : Math.abs(txn.variance) < 0.01
//                             ? "text-emerald-600"
//                             : "text-red-600"
//                         }`}
//                       >
//                         {txn.variance !== undefined
//                           ? Math.abs(txn.variance) < 0.01
//                             ? "✓"
//                             : txn.variance.toLocaleString("en-US", {
//                                 minimumFractionDigits: 2,
//                               })
//                           : "-"}
//                       </td>
//                       <td className="px-4 py-4 text-center">
//                         <StatusBadge status={txn.status} />
//                       </td>
//                       <td className="px-4 py-4 text-center">
//                         <div className="flex items-center justify-center gap-2">
//                           <button
//                             onClick={() => {
//                               setSelectedTransaction(txn);
//                               setShowDetailModal(true);
//                             }}
//                             className="p-2 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all border border-blue-200"
//                             title="View details"
//                           >
//                             <Eye className="w-4 h-4" />
//                           </button>
//                           {txn.status === ReconciliationStatus.Pending && (
//                             <>
//                               <button
//                                 onClick={() => {
//                                   setTransactions((prev) =>
//                                     prev.map((t) =>
//                                       t.id === txn.id
//                                         ? {
//                                             ...t,
//                                             actualAmount: t.expectedAmount,
//                                             variance: 0,
//                                             status:
//                                               ReconciliationStatus.Matched,
//                                             reconciledAt:
//                                               new Date().toISOString(),
//                                           }
//                                         : t
//                                     )
//                                   );
//                                   toast.success("✓ Transaction matched");
//                                 }}
//                                 className="p-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-all border border-emerald-200"
//                                 title="Mark as matched"
//                               >
//                                 <Check className="w-4 h-4" />
//                               </button>
//                               <button
//                                 onClick={() => {
//                                   setSelectedTransaction(txn);
//                                   setReconcileForm({
//                                     actualAmount: txn.expectedAmount,
//                                     status: ReconciliationStatus.Matched,
//                                     notes: "",
//                                   });
//                                   setShowReconcileModal(true);
//                                 }}
//                                 className="p-2 bg-amber-100 text-amber-700 hover:bg-amber-200 transition-all border border-amber-200"
//                                 title="Enter actual amount"
//                               >
//                                 <AlertCircle className="w-4 h-4" />
//                               </button>
//                             </>
//                           )}
//                           {txn.status !== ReconciliationStatus.Pending && (
//                             <button
//                               onClick={() => handleResetTransaction(txn.id)}
//                               className="p-2 bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all border border-slate-200"
//                               title="Reset to pending"
//                             >
//                               <RotateCcw className="w-4 h-4" />
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     </motion.tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
//               <div className="text-sm text-slate-600">
//                 Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
//                 {Math.min(
//                   currentPage * itemsPerPage,
//                   filteredTransactions.length
//                 )}{" "}
//                 of {filteredTransactions.length} transactions
//               </div>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                   disabled={currentPage === 1}
//                   className="p-2 border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <ChevronLeft className="w-4 h-4" />
//                 </button>
//                 <span className="px-4 py-2 border border-slate-300 bg-slate-50 font-semibold text-sm">
//                   {currentPage} / {totalPages}
//                 </span>
//                 <button
//                   onClick={() =>
//                     setCurrentPage((p) => Math.min(totalPages, p + 1))
//                   }
//                   disabled={currentPage === totalPages}
//                   className="p-2 border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <ChevronRight className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           )}
//         </motion.div>
//       </div>

//       {/* Reconcile Transaction Modal */}
//       <AnimatePresence>
//         {showReconcileModal && selectedTransaction && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowReconcileModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white shadow-2xl max-w-lg w-full overflow-hidden"
//             >
//               <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 p-6 text-white">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-xl font-bold">Reconcile Transaction</h3>
//                   <button
//                     onClick={() => setShowReconcileModal(false)}
//                     className="p-2 hover:bg-white/20 transition-colors"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6 space-y-4">
//                 <div className="bg-slate-50 border-2 border-slate-200 p-4">
//                   <p className="text-xs font-bold text-slate-500 uppercase mb-1">
//                     Description
//                   </p>
//                   <p className="text-lg font-semibold text-slate-900">
//                     {selectedTransaction.description}
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-blue-50 border-2 border-blue-200 p-4">
//                     <p className="text-xs font-bold text-blue-700 uppercase mb-1">
//                       Expected Amount
//                     </p>
//                     <p className="text-2xl font-bold text-blue-700">
//                       {selectedTransaction.currency}{" "}
//                       {selectedTransaction.expectedAmount.toLocaleString(
//                         "en-US",
//                         {
//                           minimumFractionDigits: 2,
//                         }
//                       )}
//                     </p>
//                   </div>
//                   <div className="bg-slate-50 border-2 border-slate-200 p-4">
//                     <p className="text-xs font-bold text-slate-500 uppercase mb-1">
//                       Date
//                     </p>
//                     <p className="text-lg font-semibold text-slate-900">
//                       {new Date(selectedTransaction.date).toLocaleDateString(
//                         "en-US",
//                         {
//                           month: "long",
//                           day: "numeric",
//                           year: "numeric",
//                         }
//                       )}
//                     </p>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                     Actual Amount *
//                   </label>
//                   <input
//                     type="number"
//                     value={reconcileForm.actualAmount || ""}
//                     onChange={(e) =>
//                       setReconcileForm({
//                         ...reconcileForm,
//                         actualAmount: parseFloat(e.target.value) || 0,
//                       })
//                     }
//                     placeholder="Enter actual amount"
//                     step="0.01"
//                     className="w-full px-4 py-3 border-2 border-slate-300 focus:border-blue-500 focus:outline-none text-lg font-bold transition-colors"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                     Reconciliation Status *
//                   </label>
//                   <div className="flex gap-4">
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="status"
//                         checked={
//                           reconcileForm.status === ReconciliationStatus.Matched
//                         }
//                         onChange={() =>
//                           setReconcileForm({
//                             ...reconcileForm,
//                             status: ReconciliationStatus.Matched,
//                           })
//                         }
//                         className="w-4 h-4 text-emerald-600"
//                       />
//                       <span className="text-sm font-medium text-slate-700">
//                         Matched
//                       </span>
//                     </label>
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="status"
//                         checked={
//                           reconcileForm.status ===
//                           ReconciliationStatus.Unmatched
//                         }
//                         onChange={() =>
//                           setReconcileForm({
//                             ...reconcileForm,
//                             status: ReconciliationStatus.Unmatched,
//                           })
//                         }
//                         className="w-4 h-4 text-red-600"
//                       />
//                       <span className="text-sm font-medium text-slate-700">
//                         Unmatched
//                       </span>
//                     </label>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                     Notes (Optional)
//                   </label>
//                   <textarea
//                     value={reconcileForm.notes}
//                     onChange={(e) =>
//                       setReconcileForm({
//                         ...reconcileForm,
//                         notes: e.target.value,
//                       })
//                     }
//                     placeholder="Add any notes about this reconciliation..."
//                     rows={3}
//                     className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors resize-none"
//                   />
//                 </div>

//                 {/* Variance Display */}
//                 {reconcileForm.actualAmount > 0 && (
//                   <div
//                     className={`p-4 border-2 ${
//                       Math.abs(
//                         reconcileForm.actualAmount -
//                           selectedTransaction.expectedAmount
//                       ) < 0.01
//                         ? "bg-emerald-50 border-emerald-200"
//                         : "bg-red-50 border-red-200"
//                     }`}
//                   >
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm font-bold text-slate-700">
//                         Variance:
//                       </span>
//                       <span
//                         className={`text-lg font-bold ${
//                           Math.abs(
//                             reconcileForm.actualAmount -
//                               selectedTransaction.expectedAmount
//                           ) < 0.01
//                             ? "text-emerald-600"
//                             : "text-red-600"
//                         }`}
//                       >
//                         {Math.abs(
//                           reconcileForm.actualAmount -
//                             selectedTransaction.expectedAmount
//                         ) < 0.01
//                           ? "✓ Matched"
//                           : `${selectedTransaction.currency} ${(
//                               reconcileForm.actualAmount -
//                               selectedTransaction.expectedAmount
//                             ).toLocaleString("en-US", {
//                               minimumFractionDigits: 2,
//                             })}`}
//                       </span>
//                     </div>
//                   </div>
//                 )}

//                 <div className="flex gap-3 pt-4">
//                   <button
//                     onClick={() => setShowReconcileModal(false)}
//                     className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleReconcileTransaction}
//                     disabled={isSubmitting || reconcileForm.actualAmount <= 0}
//                     className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                   >
//                     {isSubmitting ? (
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                     ) : (
//                       <Save className="w-4 h-4" />
//                     )}
//                     Save Reconciliation
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Bulk Reconcile Modal */}
//       <AnimatePresence>
//         {showBulkModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowBulkModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white shadow-2xl max-w-md w-full overflow-hidden"
//             >
//               <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-xl font-bold">Bulk Reconciliation</h3>
//                   <button
//                     onClick={() => setShowBulkModal(false)}
//                     className="p-2 hover:bg-white/20 transition-colors"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6 space-y-4">
//                 <div className="bg-purple-50 border-2 border-purple-200 p-4">
//                   <p className="text-sm text-purple-900">
//                     <strong>{selectedTransactions.size}</strong> transactions
//                     selected for bulk reconciliation.
//                   </p>
//                 </div>

//                 <p className="text-sm text-slate-600">
//                   Choose an action to apply to all selected transactions:
//                 </p>

//                 <div className="space-y-3">
//                   <button
//                     onClick={() =>
//                       handleBulkReconcile(ReconciliationStatus.Matched)
//                     }
//                     disabled={isSubmitting}
//                     className="w-full px-4 py-4 bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
//                   >
//                     {isSubmitting ? (
//                       <Loader2 className="w-5 h-5 animate-spin" />
//                     ) : (
//                       <CheckCircle2 className="w-5 h-5" />
//                     )}
//                     Mark All as Matched
//                   </button>
//                   <button
//                     onClick={() =>
//                       handleBulkReconcile(ReconciliationStatus.Unmatched)
//                     }
//                     disabled={isSubmitting}
//                     className="w-full px-4 py-4 bg-red-600 text-white font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
//                   >
//                     {isSubmitting ? (
//                       <Loader2 className="w-5 h-5 animate-spin" />
//                     ) : (
//                       <AlertTriangle className="w-5 h-5" />
//                     )}
//                     Mark All as Unmatched
//                   </button>
//                 </div>

//                 <button
//                   onClick={() => setShowBulkModal(false)}
//                   className="w-full px-4 py-3 bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-colors"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Complete Reconciliation Modal */}
//       <AnimatePresence>
//         {showCompleteModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowCompleteModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white shadow-2xl max-w-lg w-full overflow-hidden"
//             >
//               <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 p-6 text-white">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-xl font-bold">Complete Reconciliation</h3>
//                   <button
//                     onClick={() => setShowCompleteModal(false)}
//                     className="p-2 hover:bg-white/20 transition-colors"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6 space-y-4">
//                 {/* Summary */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-blue-50 border-2 border-blue-200 p-4">
//                     <p className="text-xs font-bold text-blue-700 uppercase mb-1">
//                       Expected
//                     </p>
//                     <p className="text-xl font-bold text-blue-700">
//                       {selectedAccount?.currency}{" "}
//                       {reconciliationBalance.expectedBalance.toLocaleString()}
//                     </p>
//                   </div>
//                   <div className="bg-purple-50 border-2 border-purple-200 p-4">
//                     <p className="text-xs font-bold text-purple-700 uppercase mb-1">
//                       Actual
//                     </p>
//                     <p className="text-xl font-bold text-purple-700">
//                       {selectedAccount?.currency}{" "}
//                       {actualBalanceInput.toLocaleString()}
//                     </p>
//                   </div>
//                 </div>

//                 <div
//                   className={`p-4 border-2 ${
//                     isBalanced
//                       ? "bg-emerald-50 border-emerald-200"
//                       : "bg-red-50 border-red-200"
//                   }`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm font-bold text-slate-700">
//                       Variance:
//                     </span>
//                     <span
//                       className={`text-xl font-bold ${
//                         isBalanced ? "text-emerald-600" : "text-red-600"
//                       }`}
//                     >
//                       {isBalanced
//                         ? "✓ Balanced"
//                         : `${
//                             selectedAccount?.currency
//                           } ${reconciliationBalance.variance.toLocaleString()}`}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="bg-slate-50 border-2 border-slate-200 p-4 space-y-2">
//                   <div className="flex justify-between">
//                     <span className="text-sm text-slate-600">
//                       Matched Transactions:
//                     </span>
//                     <span className="text-sm font-bold text-emerald-600">
//                       {reconciliationBalance.matchedCount}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-slate-600">
//                       Unmatched Transactions:
//                     </span>
//                     <span className="text-sm font-bold text-red-600">
//                       {reconciliationBalance.unmatchedCount}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-slate-600">
//                       Pending Transactions:
//                     </span>
//                     <span className="text-sm font-bold text-amber-600">
//                       {reconciliationBalance.pendingCount}
//                     </span>
//                   </div>
//                 </div>

//                 {reconciliationBalance.unmatchedCount > 0 && (
//                   <div className="bg-amber-50 border-2 border-amber-200 p-4 flex items-start gap-3">
//                     <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
//                     <p className="text-sm text-amber-800">
//                       There are{" "}
//                       <strong>{reconciliationBalance.unmatchedCount}</strong>{" "}
//                       unmatched transactions. You may want to create an
//                       adjustment entry to balance the account.
//                     </p>
//                   </div>
//                 )}

//                 <div className="flex gap-3 pt-4">
//                   <button
//                     onClick={() => setShowCompleteModal(false)}
//                     className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleCompleteReconciliation}
//                     disabled={isSubmitting}
//                     className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                   >
//                     {isSubmitting ? (
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                     ) : (
//                       <CheckCircle2 className="w-4 h-4" />
//                     )}
//                     Complete
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Transaction Detail Modal */}
//       <AnimatePresence>
//         {showDetailModal && selectedTransaction && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowDetailModal(false)}
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
//                       <Banknote className="w-8 h-8" />
//                       <div>
//                         <h2 className="text-2xl font-bold">
//                           Transaction Details
//                         </h2>
//                         <p className="text-blue-100 text-sm flex items-center gap-1.5 mt-1">
//                           <FileText className="w-3.5 h-3.5" />
//                           {selectedTransaction.reference}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => setShowDetailModal(false)}
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
//                       Transaction Date
//                     </p>
//                     <p className="text-lg font-bold text-slate-900">
//                       {new Date(selectedTransaction.date).toLocaleDateString(
//                         "en-US",
//                         {
//                           month: "long",
//                           day: "numeric",
//                           year: "numeric",
//                         }
//                       )}
//                     </p>
//                   </div>
//                   <div className="bg-slate-50 border-2 border-slate-200 p-4">
//                     <p className="text-xs font-bold text-slate-500 uppercase mb-1">
//                       Type
//                     </p>
//                     <p className="text-lg font-bold text-slate-900 uppercase">
//                       {selectedTransaction.type}
//                     </p>
//                   </div>
//                   <div className="col-span-2 bg-slate-50 border-2 border-slate-200 p-4">
//                     <p className="text-xs font-bold text-slate-500 uppercase mb-1">
//                       Description
//                     </p>
//                     <p className="text-lg font-bold text-slate-900">
//                       {selectedTransaction.description}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Amounts */}
//                 <div className="grid grid-cols-3 gap-4">
//                   <div className="bg-blue-50 border-2 border-blue-200 p-4">
//                     <p className="text-xs font-bold text-blue-700 uppercase mb-1">
//                       Expected Amount
//                     </p>
//                     <p className="text-2xl font-bold text-blue-700">
//                       {selectedTransaction.currency}{" "}
//                       {selectedTransaction.expectedAmount.toLocaleString(
//                         "en-US",
//                         {
//                           minimumFractionDigits: 2,
//                         }
//                       )}
//                     </p>
//                   </div>
//                   <div className="bg-purple-50 border-2 border-purple-200 p-4">
//                     <p className="text-xs font-bold text-purple-700 uppercase mb-1">
//                       Actual Amount
//                     </p>
//                     <p
//                       className={`text-2xl font-bold ${
//                         selectedTransaction.actualAmount !== undefined
//                           ? "text-purple-700"
//                           : "text-slate-400"
//                       }`}
//                     >
//                       {selectedTransaction.actualAmount !== undefined
//                         ? `${
//                             selectedTransaction.currency
//                           } ${selectedTransaction.actualAmount.toLocaleString(
//                             "en-US",
//                             { minimumFractionDigits: 2 }
//                           )}`
//                         : "Not Set"}
//                     </p>
//                   </div>
//                   <div
//                     className={`border-2 p-4 ${
//                       selectedTransaction.actualAmount === undefined
//                         ? "bg-slate-50 border-slate-200"
//                         : Math.abs(selectedTransaction.variance || 0) < 0.01
//                         ? "bg-emerald-50 border-emerald-200"
//                         : "bg-red-50 border-red-200"
//                     }`}
//                   >
//                     <p className="text-xs font-bold text-slate-700 uppercase mb-1">
//                       Variance
//                     </p>
//                     <p
//                       className={`text-2xl font-bold ${
//                         selectedTransaction.actualAmount === undefined
//                           ? "text-slate-400"
//                           : Math.abs(selectedTransaction.variance || 0) < 0.01
//                           ? "text-emerald-600"
//                           : "text-red-600"
//                       }`}
//                     >
//                       {selectedTransaction.actualAmount !== undefined
//                         ? Math.abs(selectedTransaction.variance || 0) < 0.01
//                           ? "✓ Matched"
//                           : `${selectedTransaction.currency} ${(
//                               selectedTransaction.variance || 0
//                             ).toLocaleString("en-US", {
//                               minimumFractionDigits: 2,
//                             })}`
//                         : "-"}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Status and Notes */}
//                 <div className="flex justify-center">
//                   <StatusBadge status={selectedTransaction.status} />
//                 </div>

//                 {selectedTransaction.notes && (
//                   <div className="bg-amber-50 border-2 border-amber-200 p-4">
//                     <p className="text-xs font-bold text-amber-700 uppercase mb-1">
//                       Reconciliation Notes
//                     </p>
//                     <p className="text-sm text-amber-900">
//                       {selectedTransaction.notes}
//                     </p>
//                   </div>
//                 )}

//                 {selectedTransaction.reconciledAt && (
//                   <div className="text-center text-sm text-slate-500">
//                     Reconciled on{" "}
//                     {new Date(
//                       selectedTransaction.reconciledAt
//                     ).toLocaleString()}
//                     {selectedTransaction.reconciledByName &&
//                       ` by ${selectedTransaction.reconciledByName}`}
//                   </div>
//                 )}

//                 <button
//                   onClick={() => setShowDetailModal(false)}
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
// import { useState, useEffect, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   CheckCircle2,
//   AlertTriangle,
//   CreditCard,
//   Smartphone,
//   DollarSign,
//   Calendar,
//   FileText,
//   Download,
//   Upload,
//   Search,
//   Filter,
//   RefreshCw,
//   Eye,
//   XCircle,
//   TrendingUp,
//   AlertCircle,
//   Check,
//   X,
//   Clock,
//   Building2,
//   Wallet,
//   Banknote,
//   ArrowUpCircle,
//   ArrowDownCircle,
//   Loader2,
//   ChevronLeft,
//   ChevronRight,
//   CheckSquare,
//   Square,
//   ListChecks,
//   Save,
//   RotateCcw,
//   Info,
// } from "lucide-react";
// import { toast } from "sonner";
// import {
//   getReconciliations,
//   createReconciliation,
//   getBankAccounts,
//   getCashAccounts,
//   getMpesaAgents,
//   getTransactions,
//   ReconciliationDto,
//   AccountType,
// } from "@/lib/api";

// // Reconciliation status enum
// enum ReconciliationStatus {
//   Pending = 0,
//   Matched = 1,
//   Unmatched = 2,
// }

// interface ReconciliationTransaction {
//   id: string;
//   code: string;
//   reference: string;
//   date: string;
//   description: string;
//   type: "debit" | "credit";
//   expectedAmount: number;
//   actualAmount?: number;
//   variance?: number;
//   currency: "KES" | "USD";
//   status: ReconciliationStatus;
//   reconciledAt?: string;
//   reconciledByName?: string;
//   notes?: string;
//   selected?: boolean;
// }

// interface AccountSummary {
//   id: string;
//   code: string;
//   name: string;
//   accountType: AccountType;
//   currency: "KES" | "USD";
//   balance: number;
//   pendingCount: number;
//   matchedCount: number;
//   unmatchedCount: number;
// }

// interface ReconciliationBalance {
//   expectedBalance: number;
//   actualBalance: number;
//   variance: number;
//   pendingCount: number;
//   matchedCount: number;
//   unmatchedCount: number;
//   pendingAmount: number;
//   matchedAmount: number;
//   unmatchedAmount: number;
// }

// export function Reconciliation() {
//   // Account states
//   const [selectedAccountType, setSelectedAccountType] = useState<
//     "bank" | "mpesa" | "cash"
//   >("bank");
//   const [selectedAccountId, setSelectedAccountId] = useState<string>("");
//   const [accounts, setAccounts] = useState<AccountSummary[]>([]);

//   // Transaction states
//   const [transactions, setTransactions] = useState<ReconciliationTransaction[]>(
//     []
//   );
//   const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(
//     new Set()
//   );

//   // Reconciliation states
//   const [reconciliations, setReconciliations] = useState<ReconciliationDto[]>(
//     []
//   );
//   const [reconciliationBalance, setReconciliationBalance] =
//     useState<ReconciliationBalance>({
//       expectedBalance: 0,
//       actualBalance: 0,
//       variance: 0,
//       pendingCount: 0,
//       matchedCount: 0,
//       unmatchedCount: 0,
//       pendingAmount: 0,
//       matchedAmount: 0,
//       unmatchedAmount: 0,
//     });

//   // UI states
//   const [loading, setLoading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState<
//     "all" | "pending" | "matched" | "unmatched"
//   >("all");
//   const [dateFrom, setDateFrom] = useState("");
//   const [dateTo, setDateTo] = useState("");
//   const [actualBalanceInput, setActualBalanceInput] = useState<number>(0);

//   // Modal states
//   const [showReconcileModal, setShowReconcileModal] = useState(false);
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [showBulkModal, setShowBulkModal] = useState(false);
//   const [showCompleteModal, setShowCompleteModal] = useState(false);
//   const [selectedTransaction, setSelectedTransaction] =
//     useState<ReconciliationTransaction | null>(null);

//   // Form states
//   const [reconcileForm, setReconcileForm] = useState({
//     actualAmount: 0,
//     status: ReconciliationStatus.Matched,
//     notes: "",
//   });

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(15);

//   // Fetch accounts based on type
//   const fetchAccounts = useCallback(async () => {
//     try {
//       setLoading(true);
//       let response;

//       switch (selectedAccountType) {
//         case "bank":
//           response = await getBankAccounts();
//           break;
//         case "mpesa":
//           response = await getMpesaAgents();
//           break;
//         case "cash":
//           response = await getCashAccounts();
//           break;
//       }

//       if (response?.success && response.data) {
//         const mappedAccounts: AccountSummary[] = response.data.map(
//           (acc: any) => ({
//             id: acc.id,
//             code: acc.code || acc.id.slice(0, 8).toUpperCase(),
//             name: acc.bankName || acc.agentName || acc.name || "Account",
//             accountType:
//               selectedAccountType === "bank"
//                 ? 1
//                 : selectedAccountType === "mpesa"
//                 ? 2
//                 : 0,
//             currency:
//               acc.currency === 0 || acc.currency === "KES" ? "KES" : "USD",
//             balance: acc.balance || 0,
//             pendingCount: 0,
//             matchedCount: 0,
//             unmatchedCount: 0,
//           })
//         );

//         setAccounts(mappedAccounts);
//         if (mappedAccounts.length > 0 && !selectedAccountId) {
//           setSelectedAccountId(mappedAccounts[0].id);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching accounts:", error);
//       toast.error("Failed to load accounts");
//     } finally {
//       setLoading(false);
//     }
//   }, [selectedAccountType, selectedAccountId]);

//   // Fetch transactions for reconciliation
//   const fetchTransactions = useCallback(async () => {
//     if (!selectedAccountId) return;

//     try {
//       setLoading(true);
//       const response = await getTransactions(1, 1000);

//       if (response?.success && response.data) {
//         const txnData = response.data.items || response.data;
//         if (Array.isArray(txnData)) {
//           // Filter transactions for selected account
//           const accountTransactions: ReconciliationTransaction[] = txnData
//             .filter((txn: any) => {
//               // Match by account ID in either debit or credit side
//               return (
//                 txn.debitAccountId === selectedAccountId ||
//                 txn.creditAccountId === selectedAccountId ||
//                 txn.accountId === selectedAccountId
//               );
//             })
//             .map((txn: any) => ({
//               id: txn.id,
//               code: txn.code || txn.id.slice(0, 8).toUpperCase(),
//               reference: txn.reference || txn.code || "",
//               date: txn.transactionDate || txn.date || txn.createdAt,
//               description: txn.description || txn.narration || "",
//               type:
//                 txn.transactionType === 0 || txn.type === "debit"
//                   ? "debit"
//                   : "credit",
//               expectedAmount: Math.abs(txn.amount),
//               actualAmount: txn.actualAmount,
//               variance: txn.variance,
//               currency: txn.currency === 0 ? "KES" : "USD",
//               status: txn.reconciliationStatus ?? ReconciliationStatus.Pending,
//               reconciledAt: txn.reconciledAt,
//               reconciledByName: txn.reconciledByName,
//               notes: txn.reconciliationNotes,
//               selected: false,
//             }));

//           setTransactions(accountTransactions);
//           calculateBalanceSummary(accountTransactions);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching transactions:", error);
//       toast.error("Failed to load transactions");
//     } finally {
//       setLoading(false);
//     }
//   }, [selectedAccountId]);

//   // Fetch existing reconciliations
//   const fetchReconciliations = useCallback(async () => {
//     try {
//       const response = await getReconciliations(1, 100);
//       if (response?.success && response.data) {
//         const recons = response.data.items || response.data;
//         if (Array.isArray(recons)) {
//           setReconciliations(recons);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching reconciliations:", error);
//     }
//   }, []);

//   // Calculate balance summary
//   const calculateBalanceSummary = (txns: ReconciliationTransaction[]) => {
//     const selectedAccount = accounts.find((a) => a.id === selectedAccountId);
//     const expectedBalance = selectedAccount?.balance || 0;

//     const pending = txns.filter(
//       (t) => t.status === ReconciliationStatus.Pending
//     );
//     const matched = txns.filter(
//       (t) => t.status === ReconciliationStatus.Matched
//     );
//     const unmatched = txns.filter(
//       (t) => t.status === ReconciliationStatus.Unmatched
//     );

//     const pendingAmount = pending.reduce((sum, t) => sum + t.expectedAmount, 0);
//     const matchedAmount = matched.reduce(
//       (sum, t) => sum + (t.actualAmount || t.expectedAmount),
//       0
//     );
//     const unmatchedAmount = unmatched.reduce(
//       (sum, t) => sum + Math.abs((t.actualAmount || 0) - t.expectedAmount),
//       0
//     );

//     setReconciliationBalance({
//       expectedBalance,
//       actualBalance: actualBalanceInput,
//       variance: actualBalanceInput - expectedBalance,
//       pendingCount: pending.length,
//       matchedCount: matched.length,
//       unmatchedCount: unmatched.length,
//       pendingAmount,
//       matchedAmount,
//       unmatchedAmount,
//     });
//   };

//   // Effects
//   useEffect(() => {
//     fetchAccounts();
//   }, [fetchAccounts]);

//   useEffect(() => {
//     if (selectedAccountId) {
//       fetchTransactions();
//       fetchReconciliations();
//     }
//   }, [selectedAccountId, fetchTransactions, fetchReconciliations]);

//   useEffect(() => {
//     calculateBalanceSummary(transactions);
//   }, [actualBalanceInput, transactions, accounts, selectedAccountId]);

//   // Handlers
//   const handleSelectTransaction = (id: string) => {
//     setSelectedTransactions((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(id)) {
//         newSet.delete(id);
//       } else {
//         newSet.add(id);
//       }
//       return newSet;
//     });
//   };

//   const handleSelectAll = () => {
//     if (selectedTransactions.size === filteredTransactions.length) {
//       setSelectedTransactions(new Set());
//     } else {
//       setSelectedTransactions(new Set(filteredTransactions.map((t) => t.id)));
//     }
//   };

//   const handleReconcileTransaction = async () => {
//     if (!selectedTransaction) return;

//     setIsSubmitting(true);
//     try {
//       // Update local state
//       setTransactions((prev) =>
//         prev.map((t) =>
//           t.id === selectedTransaction.id
//             ? {
//                 ...t,
//                 actualAmount: reconcileForm.actualAmount,
//                 variance: reconcileForm.actualAmount - t.expectedAmount,
//                 status: reconcileForm.status,
//                 notes: reconcileForm.notes,
//                 reconciledAt: new Date().toISOString(),
//               }
//             : t
//         )
//       );

//       toast.success(
//         reconcileForm.status === ReconciliationStatus.Matched
//           ? "✓ Transaction matched successfully"
//           : "⚠ Transaction marked as unmatched"
//       );

//       setShowReconcileModal(false);
//       setSelectedTransaction(null);
//       setReconcileForm({
//         actualAmount: 0,
//         status: ReconciliationStatus.Matched,
//         notes: "",
//       });
//     } catch (error) {
//       console.error("Error reconciling transaction:", error);
//       toast.error("Failed to reconcile transaction");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleBulkReconcile = async (status: ReconciliationStatus) => {
//     if (selectedTransactions.size === 0) {
//       toast.error("Please select transactions to reconcile");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       setTransactions((prev) =>
//         prev.map((t) =>
//           selectedTransactions.has(t.id)
//             ? {
//                 ...t,
//                 actualAmount: t.expectedAmount,
//                 variance: 0,
//                 status,
//                 reconciledAt: new Date().toISOString(),
//               }
//             : t
//         )
//       );

//       toast.success(
//         `✓ ${selectedTransactions.size} transactions ${
//           status === ReconciliationStatus.Matched
//             ? "matched"
//             : "marked as unmatched"
//         }`
//       );

//       setSelectedTransactions(new Set());
//       setShowBulkModal(false);
//     } catch (error) {
//       console.error("Error bulk reconciling:", error);
//       toast.error("Failed to bulk reconcile transactions");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleAutoReconcile = () => {
//     setTransactions((prev) =>
//       prev.map((t) =>
//         t.status === ReconciliationStatus.Pending
//           ? {
//               ...t,
//               actualAmount: t.expectedAmount,
//               variance: 0,
//               status: ReconciliationStatus.Matched,
//               reconciledAt: new Date().toISOString(),
//             }
//           : t
//       )
//     );
//     toast.success("✓ All pending transactions auto-reconciled");
//   };

//   const handleCompleteReconciliation = async () => {
//     const pendingCount = transactions.filter(
//       (t) => t.status === ReconciliationStatus.Pending
//     ).length;
//     const unmatchedCount = transactions.filter(
//       (t) => t.status === ReconciliationStatus.Unmatched
//     ).length;

//     if (pendingCount > 0) {
//       toast.error(
//         `❌ Cannot complete reconciliation. ${pendingCount} transactions are still pending.`
//       );
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const selectedAccount = accounts.find((a) => a.id === selectedAccountId);

//       // Create reconciliation record via API
//       const dto = {
//         accountType:
//           selectedAccountType === "bank"
//             ? 1
//             : selectedAccountType === "mpesa"
//             ? 2
//             : 0,
//         accountId: selectedAccountId,
//         actualBalance: actualBalanceInput,
//         notes:
//           unmatchedCount > 0
//             ? `Completed with ${unmatchedCount} unmatched transactions`
//             : "All transactions matched",
//       };

//       const response = await createReconciliation(dto);

//       if (response.success) {
//         if (unmatchedCount > 0) {
//           toast.warning(
//             `⚠ Reconciliation completed with ${unmatchedCount} unmatched transactions.`
//           );
//         } else {
//           toast.success(
//             "✓ Reconciliation completed successfully! All transactions matched."
//           );
//         }
//         setShowCompleteModal(false);
//         fetchReconciliations();
//       } else {
//         toast.error(response.error || "Failed to complete reconciliation");
//       }
//     } catch (error) {
//       console.error("Error completing reconciliation:", error);
//       toast.error("Failed to complete reconciliation");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleResetTransaction = (id: string) => {
//     setTransactions((prev) =>
//       prev.map((t) =>
//         t.id === id
//           ? {
//               ...t,
//               actualAmount: undefined,
//               variance: undefined,
//               status: ReconciliationStatus.Pending,
//               reconciledAt: undefined,
//               notes: undefined,
//             }
//           : t
//       )
//     );
//     toast.success("Transaction reset to pending");
//   };

//   const handleExportReport = () => {
//     const csvData = [
//       [
//         "Reference",
//         "Date",
//         "Description",
//         "Type",
//         "Expected Amount",
//         "Actual Amount",
//         "Variance",
//         "Status",
//         "Notes",
//       ],
//       ...filteredTransactions.map((txn) => [
//         txn.reference,
//         new Date(txn.date).toLocaleDateString(),
//         txn.description,
//         txn.type.toUpperCase(),
//         txn.expectedAmount.toFixed(2),
//         txn.actualAmount?.toFixed(2) || "-",
//         txn.variance?.toFixed(2) || "-",
//         txn.status === ReconciliationStatus.Matched
//           ? "Matched"
//           : txn.status === ReconciliationStatus.Unmatched
//           ? "Unmatched"
//           : "Pending",
//         txn.notes || "",
//       ]),
//     ];

//     const csv = csvData.map((row) => row.join(",")).join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     const accountName =
//       accounts.find((a) => a.id === selectedAccountId)?.name || "account";
//     a.download = `reconciliation-${accountName}-${
//       new Date().toISOString().split("T")[0]
//     }.csv`;
//     a.click();
//     toast.success("✓ Reconciliation report exported");
//   };

//   // Filter transactions
//   const filteredTransactions = transactions.filter((txn) => {
//     const matchesSearch =
//       txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       txn.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       txn.code.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesStatus =
//       statusFilter === "all" ||
//       (statusFilter === "pending" &&
//         txn.status === ReconciliationStatus.Pending) ||
//       (statusFilter === "matched" &&
//         txn.status === ReconciliationStatus.Matched) ||
//       (statusFilter === "unmatched" &&
//         txn.status === ReconciliationStatus.Unmatched);

//     const matchesDate =
//       (!dateFrom || txn.date >= dateFrom) && (!dateTo || txn.date <= dateTo);

//     return matchesSearch && matchesStatus && matchesDate;
//   });

//   // Pagination
//   const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
//   const paginatedTransactions = filteredTransactions.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   // Get selected account
//   const selectedAccount = accounts.find((a) => a.id === selectedAccountId);
//   const isBalanced = Math.abs(reconciliationBalance.variance) < 0.01;

//   // Status badge component
//   const StatusBadge = ({ status }: { status: ReconciliationStatus }) => {
//     if (status === ReconciliationStatus.Matched) {
//       return (
//         <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase">
//           <CheckCircle2 className="w-3 h-3" />
//           Matched
//         </span>
//       );
//     } else if (status === ReconciliationStatus.Unmatched) {
//       return (
//         <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 border border-red-200 text-xs font-bold uppercase">
//           <AlertTriangle className="w-3 h-3" />
//           Unmatched
//         </span>
//       );
//     } else {
//       return (
//         <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold uppercase">
//           <Clock className="w-3 h-3" />
//           Pending
//         </span>
//       );
//     }
//   };

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
//               Account Reconciliation
//             </h1>
//             <p className="text-slate-600 font-medium">
//               Match and verify account transactions with bank/M-Pesa statements
//             </p>
//           </div>
//           <div className="flex gap-3">
//             <button
//               onClick={() => {
//                 fetchAccounts();
//                 fetchTransactions();
//               }}
//               disabled={loading}
//               className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-blue-200 text-blue-600 font-bold shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300 disabled:opacity-50"
//             >
//               {loading ? (
//                 <Loader2 className="w-5 h-5 animate-spin" />
//               ) : (
//                 <RefreshCw className="w-5 h-5" />
//               )}
//               Refresh
//             </button>
//             <button
//               onClick={handleExportReport}
//               className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
//             >
//               <Download className="w-5 h-5" />
//               Export Report
//             </button>
//           </div>
//         </motion.div>

//         {/* Account Type Selector */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="flex gap-4"
//         >
//           <button
//             onClick={() => {
//               setSelectedAccountType("bank");
//               setSelectedAccountId("");
//             }}
//             className={`flex items-center gap-3 px-6 py-4 font-semibold transition-all ${
//               selectedAccountType === "bank"
//                 ? "bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white shadow-lg shadow-blue-500/30"
//                 : "bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-200"
//             }`}
//           >
//             <Building2 className="w-5 h-5" />
//             Bank Accounts
//           </button>
//           <button
//             onClick={() => {
//               setSelectedAccountType("mpesa");
//               setSelectedAccountId("");
//             }}
//             className={`flex items-center gap-3 px-6 py-4 font-semibold transition-all ${
//               selectedAccountType === "mpesa"
//                 ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
//                 : "bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-200"
//             }`}
//           >
//             <Smartphone className="w-5 h-5" />
//             M-Pesa Accounts
//           </button>
//           <button
//             onClick={() => {
//               setSelectedAccountType("cash");
//               setSelectedAccountId("");
//             }}
//             className={`flex items-center gap-3 px-6 py-4 font-semibold transition-all ${
//               selectedAccountType === "cash"
//                 ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
//                 : "bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-200"
//             }`}
//           >
//             <Wallet className="w-5 h-5" />
//             Cash at Hand
//           </button>
//         </motion.div>

//         {/* Account Selector */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="bg-white border-2 border-slate-200 p-6 shadow-lg"
//         >
//           <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
//             Select Account to Reconcile
//           </label>
//           <select
//             value={selectedAccountId}
//             onChange={(e) => setSelectedAccountId(e.target.value)}
//             className="w-full px-4 py-3 border-2 border-slate-200 bg-white text-slate-900 font-medium focus:outline-none focus:border-blue-500 transition-colors"
//           >
//             {accounts.length === 0 ? (
//               <option>No accounts available</option>
//             ) : (
//               accounts.map((acc) => (
//                 <option key={acc.id} value={acc.id}>
//                   {acc.name} - {acc.currency} (Balance:{" "}
//                   {acc.balance.toLocaleString()})
//                 </option>
//               ))
//             )}
//           </select>
//         </motion.div>

//         {/* Status Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           {/* Expected Balance */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             whileHover={{ scale: 1.02 }}
//             className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-blue-300 transition-all duration-300 group"
//           >
//             <div className="p-6">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="w-12 h-12 bg-blue-100 flex items-center justify-center border-2 border-blue-200 group-hover:bg-blue-200 transition-colors">
//                   <FileText className="w-6 h-6 text-blue-600" />
//                 </div>
//                 <div className="bg-blue-100 px-3 py-1 border border-blue-200">
//                   <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">
//                     System
//                   </span>
//                 </div>
//               </div>
//               <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
//                 Expected Balance
//               </p>
//               <p className="text-3xl font-bold text-blue-600 tracking-tight">
//                 {reconciliationBalance.expectedBalance.toLocaleString("en-US", {
//                   minimumFractionDigits: 2,
//                 })}
//               </p>
//               <div className="mt-3 pt-3 border-t-2 border-slate-100">
//                 <p className="text-[10px] text-slate-500 font-semibold">
//                   From System Records
//                 </p>
//               </div>
//             </div>
//           </motion.div>

//           {/* Actual Balance Input */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.35 }}
//             whileHover={{ scale: 1.02 }}
//             className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-purple-300 transition-all duration-300 group"
//           >
//             <div className="p-6">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="w-12 h-12 bg-purple-100 flex items-center justify-center border-2 border-purple-200 group-hover:bg-purple-200 transition-colors">
//                   <DollarSign className="w-6 h-6 text-purple-600" />
//                 </div>
//                 <div className="bg-purple-100 px-3 py-1 border border-purple-200">
//                   <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wide">
//                     Actual
//                   </span>
//                 </div>
//               </div>
//               <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
//                 Actual Balance (Statement)
//               </p>
//               <input
//                 type="number"
//                 value={actualBalanceInput || ""}
//                 onChange={(e) =>
//                   setActualBalanceInput(parseFloat(e.target.value) || 0)
//                 }
//                 placeholder="Enter actual balance"
//                 className="w-full text-3xl font-bold text-purple-700 bg-transparent border-b-2 border-purple-300 focus:border-purple-600 outline-none transition-colors"
//                 step="0.01"
//               />
//               <div className="mt-3 pt-3 border-t-2 border-slate-100">
//                 <p className="text-[10px] text-slate-500 font-semibold">
//                   Enter from Bank/M-Pesa Statement
//                 </p>
//               </div>
//             </div>
//           </motion.div>

//           {/* Variance */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//             whileHover={{ scale: 1.02 }}
//             className={`border-2 shadow-lg hover:shadow-xl transition-all duration-300 group ${
//               isBalanced
//                 ? "bg-white hover:border-emerald-300"
//                 : "bg-white hover:border-red-300"
//             }`}
//           >
//             <div className="p-6">
//               <div className="flex items-start justify-between mb-4">
//                 {isBalanced ? (
//                   <div className="w-12 h-12 bg-emerald-100 flex items-center justify-center border-2 border-emerald-200 group-hover:bg-emerald-200 transition-colors">
//                     <CheckCircle2 className="w-6 h-6 text-emerald-600" />
//                   </div>
//                 ) : (
//                   <div className="w-12 h-12 bg-red-100 flex items-center justify-center border-2 border-red-200 group-hover:bg-red-200 transition-colors">
//                     <AlertTriangle className="w-6 h-6 text-red-600" />
//                   </div>
//                 )}
//                 <div
//                   className={`px-3 py-1 border ${
//                     isBalanced
//                       ? "bg-emerald-100 border-emerald-200"
//                       : "bg-red-100 border-red-200"
//                   }`}
//                 >
//                   <span
//                     className={`text-[10px] font-bold uppercase tracking-wide ${
//                       isBalanced ? "text-emerald-700" : "text-red-700"
//                     }`}
//                   >
//                     {isBalanced ? "Balanced" : "Variance"}
//                   </span>
//                 </div>
//               </div>
//               <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
//                 Difference
//               </p>
//               <p
//                 className={`text-3xl font-bold tracking-tight ${
//                   isBalanced ? "text-emerald-600" : "text-red-600"
//                 }`}
//               >
//                 {reconciliationBalance.variance >= 0 ? "+" : ""}
//                 {reconciliationBalance.variance.toLocaleString("en-US", {
//                   minimumFractionDigits: 2,
//                 })}
//               </p>
//               <div className="mt-3 pt-3 border-t-2 border-slate-100">
//                 <p
//                   className={`text-[10px] font-semibold ${
//                     isBalanced ? "text-emerald-600" : "text-red-600"
//                   }`}
//                 >
//                   {isBalanced ? "✓ Perfectly Balanced" : "⚠ Requires Attention"}
//                 </p>
//               </div>
//             </div>
//           </motion.div>

//           {/* Progress Summary */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.45 }}
//             whileHover={{ scale: 1.02 }}
//             className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-amber-300 transition-all duration-300 group"
//           >
//             <div className="p-6">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="w-12 h-12 bg-amber-100 flex items-center justify-center border-2 border-amber-200 group-hover:bg-amber-200 transition-colors">
//                   <TrendingUp className="w-6 h-6 text-amber-600" />
//                 </div>
//                 <div className="bg-amber-100 px-3 py-1 border border-amber-200">
//                   <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">
//                     Progress
//                   </span>
//                 </div>
//               </div>
//               <p className="text-[10px] text-slate-500 mb-3 uppercase tracking-wider font-bold">
//                 Reconciliation Status
//               </p>
//               <div className="space-y-2">
//                 <div className="flex justify-between items-center">
//                   <span className="text-xs text-slate-600 font-medium">
//                     Matched:
//                   </span>
//                   <span className="text-sm font-bold text-emerald-600">
//                     {reconciliationBalance.matchedCount}/{transactions.length}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-xs text-slate-600 font-medium">
//                     Unmatched:
//                   </span>
//                   <span className="text-sm font-bold text-red-600">
//                     {reconciliationBalance.unmatchedCount}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-xs text-slate-600 font-medium">
//                     Pending:
//                   </span>
//                   <span className="text-sm font-bold text-amber-600">
//                     {reconciliationBalance.pendingCount}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>

//         {/* Filters and Actions */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.5 }}
//           className="bg-white border-2 border-slate-200 p-6 shadow-lg"
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//             {/* Search */}
//             <div className="lg:col-span-2">
//               <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                 Search Transactions
//               </label>
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   placeholder="Search by description or reference..."
//                   className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors"
//                 />
//               </div>
//             </div>

//             {/* Status Filter */}
//             <div>
//               <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                 Status Filter
//               </label>
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value as any)}
//                 className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors"
//               >
//                 <option value="all">All Statuses</option>
//                 <option value="pending">Pending</option>
//                 <option value="matched">Matched</option>
//                 <option value="unmatched">Unmatched</option>
//               </select>
//             </div>

//             {/* Bulk Actions */}
//             <div>
//               <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                 Bulk Actions ({selectedTransactions.size} selected)
//               </label>
//               <button
//                 onClick={() => setShowBulkModal(true)}
//                 disabled={selectedTransactions.size === 0}
//                 className="w-full px-4 py-3 bg-purple-600 text-white font-bold shadow-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//               >
//                 <ListChecks className="w-4 h-4" />
//                 Bulk Reconcile
//               </button>
//             </div>

//             {/* Auto Reconcile */}
//             <div>
//               <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                 Quick Actions
//               </label>
//               <button
//                 onClick={handleAutoReconcile}
//                 disabled={reconciliationBalance.pendingCount === 0}
//                 className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Auto Reconcile All
//               </button>
//             </div>
//           </div>
//         </motion.div>

//         {/* Transactions Table */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.6 }}
//           className="bg-white/90 backdrop-blur-xl border-2 border-slate-200 shadow-2xl overflow-hidden"
//         >
//           <div className="p-6 border-b-2 border-slate-200 bg-gradient-to-r from-blue-50 to-cyan-50 flex justify-between items-center">
//             <div>
//               <h3 className="text-lg font-bold text-slate-900">
//                 Transaction Details
//               </h3>
//               <p className="text-sm text-slate-600 mt-1">
//                 Showing {filteredTransactions.length} transactions for
//                 reconciliation
//               </p>
//             </div>
//             <button
//               onClick={() => setShowCompleteModal(true)}
//               disabled={
//                 reconciliationBalance.pendingCount > 0 ||
//                 transactions.length === 0
//               }
//               className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <CheckCircle2 className="w-5 h-5" />
//               Complete Reconciliation
//             </button>
//           </div>

//           {loading ? (
//             <div className="flex items-center justify-center py-20">
//               <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
//             </div>
//           ) : filteredTransactions.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-20 text-slate-500">
//               <FileText className="w-16 h-16 mb-4 text-slate-300" />
//               <p className="text-lg font-medium">No transactions found</p>
//               <p className="text-sm">Select an account to view transactions</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
//                   <tr>
//                     <th className="px-4 py-3 text-center">
//                       <button
//                         onClick={handleSelectAll}
//                         className="p-1 hover:bg-slate-200 transition"
//                       >
//                         {selectedTransactions.size ===
//                         filteredTransactions.length ? (
//                           <CheckSquare className="w-5 h-5 text-blue-600" />
//                         ) : (
//                           <Square className="w-5 h-5 text-slate-400" />
//                         )}
//                       </button>
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Date
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Reference
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Description
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Type
//                     </th>
//                     <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Expected
//                     </th>
//                     <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Actual
//                     </th>
//                     <th className="px-4 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Variance
//                     </th>
//                     <th className="px-4 py-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-4 py-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-slate-200">
//                   {paginatedTransactions.map((txn, index) => (
//                     <motion.tr
//                       key={txn.id}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.02 }}
//                       className={`hover:bg-blue-50/50 transition-colors ${
//                         selectedTransactions.has(txn.id) ? "bg-blue-50" : ""
//                       }`}
//                     >
//                       <td className="px-4 py-4 text-center">
//                         <button
//                           onClick={() => handleSelectTransaction(txn.id)}
//                           className="p-1 hover:bg-slate-200 transition"
//                         >
//                           {selectedTransactions.has(txn.id) ? (
//                             <CheckSquare className="w-5 h-5 text-blue-600" />
//                           ) : (
//                             <Square className="w-5 h-5 text-slate-400" />
//                           )}
//                         </button>
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-900">
//                         {new Date(txn.date).toLocaleDateString("en-US", {
//                           month: "short",
//                           day: "numeric",
//                           year: "numeric",
//                         })}
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap">
//                         <span className="text-sm font-mono text-slate-600">
//                           {txn.reference}
//                         </span>
//                       </td>
//                       <td className="px-4 py-4 text-sm text-slate-900 font-medium max-w-xs truncate">
//                         {txn.description}
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap">
//                         {txn.type === "debit" ? (
//                           <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase">
//                             <ArrowUpCircle className="w-3 h-3" />
//                             DR
//                           </span>
//                         ) : (
//                           <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 border border-red-200 text-xs font-bold uppercase">
//                             <ArrowDownCircle className="w-3 h-3" />
//                             CR
//                           </span>
//                         )}
//                       </td>
//                       <td className="px-4 py-4 text-sm text-right font-bold text-slate-900">
//                         {txn.currency}{" "}
//                         {txn.expectedAmount.toLocaleString("en-US", {
//                           minimumFractionDigits: 2,
//                         })}
//                       </td>
//                       <td
//                         className={`px-4 py-4 text-sm text-right font-bold ${
//                           txn.actualAmount !== undefined
//                             ? "text-purple-700"
//                             : "text-slate-400"
//                         }`}
//                       >
//                         {txn.actualAmount !== undefined
//                           ? `${txn.currency} ${txn.actualAmount.toLocaleString(
//                               "en-US",
//                               { minimumFractionDigits: 2 }
//                             )}`
//                           : "-"}
//                       </td>
//                       <td
//                         className={`px-4 py-4 text-sm text-right font-bold ${
//                           txn.variance === undefined
//                             ? "text-slate-400"
//                             : Math.abs(txn.variance) < 0.01
//                             ? "text-emerald-600"
//                             : "text-red-600"
//                         }`}
//                       >
//                         {txn.variance !== undefined
//                           ? Math.abs(txn.variance) < 0.01
//                             ? "✓"
//                             : txn.variance.toLocaleString("en-US", {
//                                 minimumFractionDigits: 2,
//                               })
//                           : "-"}
//                       </td>
//                       <td className="px-4 py-4 text-center">
//                         <StatusBadge status={txn.status} />
//                       </td>
//                       <td className="px-4 py-4 text-center">
//                         <div className="flex items-center justify-center gap-2">
//                           <button
//                             onClick={() => {
//                               setSelectedTransaction(txn);
//                               setShowDetailModal(true);
//                             }}
//                             className="p-2 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all border border-blue-200"
//                             title="View details"
//                           >
//                             <Eye className="w-4 h-4" />
//                           </button>
//                           {txn.status === ReconciliationStatus.Pending && (
//                             <>
//                               <button
//                                 onClick={() => {
//                                   setTransactions((prev) =>
//                                     prev.map((t) =>
//                                       t.id === txn.id
//                                         ? {
//                                             ...t,
//                                             actualAmount: t.expectedAmount,
//                                             variance: 0,
//                                             status:
//                                               ReconciliationStatus.Matched,
//                                             reconciledAt:
//                                               new Date().toISOString(),
//                                           }
//                                         : t
//                                     )
//                                   );
//                                   toast.success("✓ Transaction matched");
//                                 }}
//                                 className="p-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-all border border-emerald-200"
//                                 title="Mark as matched"
//                               >
//                                 <Check className="w-4 h-4" />
//                               </button>
//                               <button
//                                 onClick={() => {
//                                   setSelectedTransaction(txn);
//                                   setReconcileForm({
//                                     actualAmount: txn.expectedAmount,
//                                     status: ReconciliationStatus.Matched,
//                                     notes: "",
//                                   });
//                                   setShowReconcileModal(true);
//                                 }}
//                                 className="p-2 bg-amber-100 text-amber-700 hover:bg-amber-200 transition-all border border-amber-200"
//                                 title="Enter actual amount"
//                               >
//                                 <AlertCircle className="w-4 h-4" />
//                               </button>
//                             </>
//                           )}
//                           {txn.status !== ReconciliationStatus.Pending && (
//                             <button
//                               onClick={() => handleResetTransaction(txn.id)}
//                               className="p-2 bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all border border-slate-200"
//                               title="Reset to pending"
//                             >
//                               <RotateCcw className="w-4 h-4" />
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     </motion.tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
//               <div className="text-sm text-slate-600">
//                 Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
//                 {Math.min(
//                   currentPage * itemsPerPage,
//                   filteredTransactions.length
//                 )}{" "}
//                 of {filteredTransactions.length} transactions
//               </div>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                   disabled={currentPage === 1}
//                   className="p-2 border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <ChevronLeft className="w-4 h-4" />
//                 </button>
//                 <span className="px-4 py-2 border border-slate-300 bg-slate-50 font-semibold text-sm">
//                   {currentPage} / {totalPages}
//                 </span>
//                 <button
//                   onClick={() =>
//                     setCurrentPage((p) => Math.min(totalPages, p + 1))
//                   }
//                   disabled={currentPage === totalPages}
//                   className="p-2 border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <ChevronRight className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           )}
//         </motion.div>
//       </div>

//       {/* Reconcile Transaction Modal */}
//       <AnimatePresence>
//         {showReconcileModal && selectedTransaction && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowReconcileModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white shadow-2xl max-w-lg w-full overflow-hidden"
//             >
//               <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 p-6 text-white">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-xl font-bold">Reconcile Transaction</h3>
//                   <button
//                     onClick={() => setShowReconcileModal(false)}
//                     className="p-2 hover:bg-white/20 transition-colors"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6 space-y-4">
//                 <div className="bg-slate-50 border-2 border-slate-200 p-4">
//                   <p className="text-xs font-bold text-slate-500 uppercase mb-1">
//                     Description
//                   </p>
//                   <p className="text-lg font-semibold text-slate-900">
//                     {selectedTransaction.description}
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-blue-50 border-2 border-blue-200 p-4">
//                     <p className="text-xs font-bold text-blue-700 uppercase mb-1">
//                       Expected Amount
//                     </p>
//                     <p className="text-2xl font-bold text-blue-700">
//                       {selectedTransaction.currency}{" "}
//                       {selectedTransaction.expectedAmount.toLocaleString(
//                         "en-US",
//                         {
//                           minimumFractionDigits: 2,
//                         }
//                       )}
//                     </p>
//                   </div>
//                   <div className="bg-slate-50 border-2 border-slate-200 p-4">
//                     <p className="text-xs font-bold text-slate-500 uppercase mb-1">
//                       Date
//                     </p>
//                     <p className="text-lg font-semibold text-slate-900">
//                       {new Date(selectedTransaction.date).toLocaleDateString(
//                         "en-US",
//                         {
//                           month: "long",
//                           day: "numeric",
//                           year: "numeric",
//                         }
//                       )}
//                     </p>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                     Actual Amount *
//                   </label>
//                   <input
//                     type="number"
//                     value={reconcileForm.actualAmount || ""}
//                     onChange={(e) =>
//                       setReconcileForm({
//                         ...reconcileForm,
//                         actualAmount: parseFloat(e.target.value) || 0,
//                       })
//                     }
//                     placeholder="Enter actual amount"
//                     step="0.01"
//                     className="w-full px-4 py-3 border-2 border-slate-300 focus:border-blue-500 focus:outline-none text-lg font-bold transition-colors"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                     Reconciliation Status *
//                   </label>
//                   <div className="flex gap-4">
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="status"
//                         checked={
//                           reconcileForm.status === ReconciliationStatus.Matched
//                         }
//                         onChange={() =>
//                           setReconcileForm({
//                             ...reconcileForm,
//                             status: ReconciliationStatus.Matched,
//                           })
//                         }
//                         className="w-4 h-4 text-emerald-600"
//                       />
//                       <span className="text-sm font-medium text-slate-700">
//                         Matched
//                       </span>
//                     </label>
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="status"
//                         checked={
//                           reconcileForm.status ===
//                           ReconciliationStatus.Unmatched
//                         }
//                         onChange={() =>
//                           setReconcileForm({
//                             ...reconcileForm,
//                             status: ReconciliationStatus.Unmatched,
//                           })
//                         }
//                         className="w-4 h-4 text-red-600"
//                       />
//                       <span className="text-sm font-medium text-slate-700">
//                         Unmatched
//                       </span>
//                     </label>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                     Notes (Optional)
//                   </label>
//                   <textarea
//                     value={reconcileForm.notes}
//                     onChange={(e) =>
//                       setReconcileForm({
//                         ...reconcileForm,
//                         notes: e.target.value,
//                       })
//                     }
//                     placeholder="Add any notes about this reconciliation..."
//                     rows={3}
//                     className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors resize-none"
//                   />
//                 </div>

//                 {/* Variance Display */}
//                 {reconcileForm.actualAmount > 0 && (
//                   <div
//                     className={`p-4 border-2 ${
//                       Math.abs(
//                         reconcileForm.actualAmount -
//                           selectedTransaction.expectedAmount
//                       ) < 0.01
//                         ? "bg-emerald-50 border-emerald-200"
//                         : "bg-red-50 border-red-200"
//                     }`}
//                   >
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm font-bold text-slate-700">
//                         Variance:
//                       </span>
//                       <span
//                         className={`text-lg font-bold ${
//                           Math.abs(
//                             reconcileForm.actualAmount -
//                               selectedTransaction.expectedAmount
//                           ) < 0.01
//                             ? "text-emerald-600"
//                             : "text-red-600"
//                         }`}
//                       >
//                         {Math.abs(
//                           reconcileForm.actualAmount -
//                             selectedTransaction.expectedAmount
//                         ) < 0.01
//                           ? "✓ Matched"
//                           : `${selectedTransaction.currency} ${(
//                               reconcileForm.actualAmount -
//                               selectedTransaction.expectedAmount
//                             ).toLocaleString("en-US", {
//                               minimumFractionDigits: 2,
//                             })}`}
//                       </span>
//                     </div>
//                   </div>
//                 )}

//                 <div className="flex gap-3 pt-4">
//                   <button
//                     onClick={() => setShowReconcileModal(false)}
//                     className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleReconcileTransaction}
//                     disabled={isSubmitting || reconcileForm.actualAmount <= 0}
//                     className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                   >
//                     {isSubmitting ? (
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                     ) : (
//                       <Save className="w-4 h-4" />
//                     )}
//                     Save Reconciliation
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Bulk Reconcile Modal */}
//       <AnimatePresence>
//         {showBulkModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowBulkModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white shadow-2xl max-w-md w-full overflow-hidden"
//             >
//               <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-xl font-bold">Bulk Reconciliation</h3>
//                   <button
//                     onClick={() => setShowBulkModal(false)}
//                     className="p-2 hover:bg-white/20 transition-colors"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6 space-y-4">
//                 <div className="bg-purple-50 border-2 border-purple-200 p-4">
//                   <p className="text-sm text-purple-900">
//                     <strong>{selectedTransactions.size}</strong> transactions
//                     selected for bulk reconciliation.
//                   </p>
//                 </div>

//                 <p className="text-sm text-slate-600">
//                   Choose an action to apply to all selected transactions:
//                 </p>

//                 <div className="space-y-3">
//                   <button
//                     onClick={() =>
//                       handleBulkReconcile(ReconciliationStatus.Matched)
//                     }
//                     disabled={isSubmitting}
//                     className="w-full px-4 py-4 bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
//                   >
//                     {isSubmitting ? (
//                       <Loader2 className="w-5 h-5 animate-spin" />
//                     ) : (
//                       <CheckCircle2 className="w-5 h-5" />
//                     )}
//                     Mark All as Matched
//                   </button>
//                   <button
//                     onClick={() =>
//                       handleBulkReconcile(ReconciliationStatus.Unmatched)
//                     }
//                     disabled={isSubmitting}
//                     className="w-full px-4 py-4 bg-red-600 text-white font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
//                   >
//                     {isSubmitting ? (
//                       <Loader2 className="w-5 h-5 animate-spin" />
//                     ) : (
//                       <AlertTriangle className="w-5 h-5" />
//                     )}
//                     Mark All as Unmatched
//                   </button>
//                 </div>

//                 <button
//                   onClick={() => setShowBulkModal(false)}
//                   className="w-full px-4 py-3 bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-colors"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Complete Reconciliation Modal */}
//       <AnimatePresence>
//         {showCompleteModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowCompleteModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white shadow-2xl max-w-lg w-full overflow-hidden"
//             >
//               <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 p-6 text-white">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-xl font-bold">Complete Reconciliation</h3>
//                   <button
//                     onClick={() => setShowCompleteModal(false)}
//                     className="p-2 hover:bg-white/20 transition-colors"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6 space-y-4">
//                 {/* Summary */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-blue-50 border-2 border-blue-200 p-4">
//                     <p className="text-xs font-bold text-blue-700 uppercase mb-1">
//                       Expected
//                     </p>
//                     <p className="text-xl font-bold text-blue-700">
//                       {selectedAccount?.currency}{" "}
//                       {reconciliationBalance.expectedBalance.toLocaleString()}
//                     </p>
//                   </div>
//                   <div className="bg-purple-50 border-2 border-purple-200 p-4">
//                     <p className="text-xs font-bold text-purple-700 uppercase mb-1">
//                       Actual
//                     </p>
//                     <p className="text-xl font-bold text-purple-700">
//                       {selectedAccount?.currency}{" "}
//                       {actualBalanceInput.toLocaleString()}
//                     </p>
//                   </div>
//                 </div>

//                 <div
//                   className={`p-4 border-2 ${
//                     isBalanced
//                       ? "bg-emerald-50 border-emerald-200"
//                       : "bg-red-50 border-red-200"
//                   }`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm font-bold text-slate-700">
//                       Variance:
//                     </span>
//                     <span
//                       className={`text-xl font-bold ${
//                         isBalanced ? "text-emerald-600" : "text-red-600"
//                       }`}
//                     >
//                       {isBalanced
//                         ? "✓ Balanced"
//                         : `${
//                             selectedAccount?.currency
//                           } ${reconciliationBalance.variance.toLocaleString()}`}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="bg-slate-50 border-2 border-slate-200 p-4 space-y-2">
//                   <div className="flex justify-between">
//                     <span className="text-sm text-slate-600">
//                       Matched Transactions:
//                     </span>
//                     <span className="text-sm font-bold text-emerald-600">
//                       {reconciliationBalance.matchedCount}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-slate-600">
//                       Unmatched Transactions:
//                     </span>
//                     <span className="text-sm font-bold text-red-600">
//                       {reconciliationBalance.unmatchedCount}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-slate-600">
//                       Pending Transactions:
//                     </span>
//                     <span className="text-sm font-bold text-amber-600">
//                       {reconciliationBalance.pendingCount}
//                     </span>
//                   </div>
//                 </div>

//                 {reconciliationBalance.unmatchedCount > 0 && (
//                   <div className="bg-amber-50 border-2 border-amber-200 p-4 flex items-start gap-3">
//                     <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
//                     <p className="text-sm text-amber-800">
//                       There are{" "}
//                       <strong>{reconciliationBalance.unmatchedCount}</strong>{" "}
//                       unmatched transactions. You may want to create an
//                       adjustment entry to balance the account.
//                     </p>
//                   </div>
//                 )}

//                 <div className="flex gap-3 pt-4">
//                   <button
//                     onClick={() => setShowCompleteModal(false)}
//                     className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleCompleteReconciliation}
//                     disabled={isSubmitting}
//                     className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                   >
//                     {isSubmitting ? (
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                     ) : (
//                       <CheckCircle2 className="w-4 h-4" />
//                     )}
//                     Complete
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Transaction Detail Modal */}
//       <AnimatePresence>
//         {showDetailModal && selectedTransaction && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowDetailModal(false)}
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
//                       <Banknote className="w-8 h-8" />
//                       <div>
//                         <h2 className="text-2xl font-bold">
//                           Transaction Details
//                         </h2>
//                         <p className="text-blue-100 text-sm flex items-center gap-1.5 mt-1">
//                           <FileText className="w-3.5 h-3.5" />
//                           {selectedTransaction.reference}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => setShowDetailModal(false)}
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
//                       Transaction Date
//                     </p>
//                     <p className="text-lg font-bold text-slate-900">
//                       {new Date(selectedTransaction.date).toLocaleDateString(
//                         "en-US",
//                         {
//                           month: "long",
//                           day: "numeric",
//                           year: "numeric",
//                         }
//                       )}
//                     </p>
//                   </div>
//                   <div className="bg-slate-50 border-2 border-slate-200 p-4">
//                     <p className="text-xs font-bold text-slate-500 uppercase mb-1">
//                       Type
//                     </p>
//                     <p className="text-lg font-bold text-slate-900 uppercase">
//                       {selectedTransaction.type}
//                     </p>
//                   </div>
//                   <div className="col-span-2 bg-slate-50 border-2 border-slate-200 p-4">
//                     <p className="text-xs font-bold text-slate-500 uppercase mb-1">
//                       Description
//                     </p>
//                     <p className="text-lg font-bold text-slate-900">
//                       {selectedTransaction.description}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Amounts */}
//                 <div className="grid grid-cols-3 gap-4">
//                   <div className="bg-blue-50 border-2 border-blue-200 p-4">
//                     <p className="text-xs font-bold text-blue-700 uppercase mb-1">
//                       Expected Amount
//                     </p>
//                     <p className="text-2xl font-bold text-blue-700">
//                       {selectedTransaction.currency}{" "}
//                       {selectedTransaction.expectedAmount.toLocaleString(
//                         "en-US",
//                         {
//                           minimumFractionDigits: 2,
//                         }
//                       )}
//                     </p>
//                   </div>
//                   <div className="bg-purple-50 border-2 border-purple-200 p-4">
//                     <p className="text-xs font-bold text-purple-700 uppercase mb-1">
//                       Actual Amount
//                     </p>
//                     <p
//                       className={`text-2xl font-bold ${
//                         selectedTransaction.actualAmount !== undefined
//                           ? "text-purple-700"
//                           : "text-slate-400"
//                       }`}
//                     >
//                       {selectedTransaction.actualAmount !== undefined
//                         ? `${
//                             selectedTransaction.currency
//                           } ${selectedTransaction.actualAmount.toLocaleString(
//                             "en-US",
//                             { minimumFractionDigits: 2 }
//                           )}`
//                         : "Not Set"}
//                     </p>
//                   </div>
//                   <div
//                     className={`border-2 p-4 ${
//                       selectedTransaction.actualAmount === undefined
//                         ? "bg-slate-50 border-slate-200"
//                         : Math.abs(selectedTransaction.variance || 0) < 0.01
//                         ? "bg-emerald-50 border-emerald-200"
//                         : "bg-red-50 border-red-200"
//                     }`}
//                   >
//                     <p className="text-xs font-bold text-slate-700 uppercase mb-1">
//                       Variance
//                     </p>
//                     <p
//                       className={`text-2xl font-bold ${
//                         selectedTransaction.actualAmount === undefined
//                           ? "text-slate-400"
//                           : Math.abs(selectedTransaction.variance || 0) < 0.01
//                           ? "text-emerald-600"
//                           : "text-red-600"
//                       }`}
//                     >
//                       {selectedTransaction.actualAmount !== undefined
//                         ? Math.abs(selectedTransaction.variance || 0) < 0.01
//                           ? "✓ Matched"
//                           : `${selectedTransaction.currency} ${(
//                               selectedTransaction.variance || 0
//                             ).toLocaleString("en-US", {
//                               minimumFractionDigits: 2,
//                             })}`
//                         : "-"}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Status and Notes */}
//                 <div className="flex justify-center">
//                   <StatusBadge status={selectedTransaction.status} />
//                 </div>

//                 {selectedTransaction.notes && (
//                   <div className="bg-amber-50 border-2 border-amber-200 p-4">
//                     <p className="text-xs font-bold text-amber-700 uppercase mb-1">
//                       Reconciliation Notes
//                     </p>
//                     <p className="text-sm text-amber-900">
//                       {selectedTransaction.notes}
//                     </p>
//                   </div>
//                 )}

//                 {selectedTransaction.reconciledAt && (
//                   <div className="text-center text-sm text-slate-500">
//                     Reconciled on{" "}
//                     {new Date(
//                       selectedTransaction.reconciledAt
//                     ).toLocaleString()}
//                     {selectedTransaction.reconciledByName &&
//                       ` by ${selectedTransaction.reconciledByName}`}
//                   </div>
//                 )}

//                 <button
//                   onClick={() => setShowDetailModal(false)}
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
// import { useState, useEffect, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   CheckCircle2,
//   AlertTriangle,
//   CreditCard,
//   Smartphone,
//   DollarSign,
//   Calendar,
//   FileText,
//   Download,
//   Search,
//   Filter,
//   RefreshCw,
//   Eye,
//   TrendingUp,
//   AlertCircle,
//   Check,
//   X,
//   Clock,
//   Building2,
//   Wallet,
//   Banknote,
//   ArrowUpCircle,
//   ArrowDownCircle,
//   Loader2,
//   ChevronLeft,
//   ChevronRight,
//   CheckSquare,
//   Square,
//   ListChecks,
//   Save,
//   RotateCcw,
//   Info,
//   Activity,
//   Scale,
//   Hash,
//   Printer,
//   ArrowRight,
//   ShieldCheck,
//   Target,
//   Zap,
// } from "lucide-react";
// import { toast } from "sonner";

// // ==================== IMPORT FROM api.ts ====================
// import {
//   AccountType,
//   Currency,
//   TransactionType,
//   ReconciliationStatus,
//   AccountReconciliationSummaryDto,
//   TransactionReconciliationDto,
//   AccountReconciliationBalanceDto,
//   ReconcileTransactionDto,
//   BulkReconcileDto,
//   CreateReconciliationDto,
//   ReconciliationResponseDto,
//   ReconciliationFilterDto,
//   PagedResult,
//   // API Functions
//   getReconciliationAccounts,
//   getAccountTransactionsForReconciliation,
//   getAccountReconciliationSummary,
//   reconcileTransaction,
//   bulkReconcileTransactions,
//   createReconciliationRecord,
//   getReconciliationHistory,
//   getCurrencyLabel,
//   getAccountTypeLabel,
//   getReconciliationStatusLabel,
// } from "@/lib/api";

// // ==================== HELPER FUNCTIONS ====================

// const getCurrencySymbol = (currency: Currency): string => {
//   return currency === Currency.KES ? "KES " : "$";
// };

// const getAccountTypeIcon = (type: AccountType) => {
//   switch (type) {
//     case AccountType.Cash:
//       return <Wallet className="w-5 h-5" />;
//     case AccountType.Bank:
//       return <Building2 className="w-5 h-5" />;
//     case AccountType.Mpesa:
//       return <Smartphone className="w-5 h-5" />;
//     default:
//       return <CreditCard className="w-5 h-5" />;
//   }
// };

// // ==================== MAIN COMPONENT ====================

// export function Reconciliation() {
//   // Account states
//   const [selectedAccountType, setSelectedAccountType] = useState<AccountType>(
//     AccountType.Bank
//   );
//   const [selectedAccountId, setSelectedAccountId] = useState<string>("");
//   const [accounts, setAccounts] = useState<AccountReconciliationSummaryDto[]>(
//     []
//   );

//   // Transaction states
//   const [transactions, setTransactions] = useState<
//     TransactionReconciliationDto[]
//   >([]);
//   const [totalTransactions, setTotalTransactions] = useState(0);
//   const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(
//     new Set()
//   );

//   // Balance summary
//   const [balanceSummary, setBalanceSummary] =
//     useState<AccountReconciliationBalanceDto>({
//       expectedBalance: 0,
//       actualBalance: 0,
//       variance: 0,
//       pendingCount: 0,
//       matchedCount: 0,
//       unmatchedCount: 0,
//       pendingAmount: 0,
//       matchedAmount: 0,
//       unmatchedAmount: 0,
//     });

//   // Reconciliation history
//   const [reconciliationHistory, setReconciliationHistory] = useState<
//     ReconciliationResponseDto[]
//   >([]);

//   // UI states
//   const [isLoading, setIsLoading] = useState(false);
//   const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState<
//     "all" | "pending" | "matched" | "unmatched"
//   >("all");
//   const [dateFrom, setDateFrom] = useState("");
//   const [dateTo, setDateTo] = useState("");
//   const [actualBalanceInput, setActualBalanceInput] = useState<number>(0);

//   // Modal states
//   const [showReconcileModal, setShowReconcileModal] = useState(false);
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [showBulkModal, setShowBulkModal] = useState(false);
//   const [showCompleteModal, setShowCompleteModal] = useState(false);
//   const [showHistoryModal, setShowHistoryModal] = useState(false);
//   const [selectedTransaction, setSelectedTransaction] =
//     useState<TransactionReconciliationDto | null>(null);

//   // Form states
//   const [reconcileForm, setReconcileForm] = useState({
//     actualAmount: 0,
//     status: ReconciliationStatus.Matched,
//     notes: "",
//   });

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(20);

//   // ==================== API CALLS ====================

//   // Fetch all accounts with stats
//   const fetchAccounts = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const response = await getReconciliationAccounts();
//       if (response.success && response.data) {
//         setAccounts(response.data);

//         // Auto-select first account of selected type if none selected
//         const typeAccounts = response.data.filter(
//           (a) => a.accountType === selectedAccountType
//         );
//         if (typeAccounts.length > 0 && !selectedAccountId) {
//           setSelectedAccountId(typeAccounts[0].id);
//         }
//       } else {
//         toast.error(response.message || "Failed to load accounts");
//       }
//     } catch (error) {
//       console.error("Error fetching accounts:", error);
//       toast.error("Failed to load accounts");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [selectedAccountType, selectedAccountId]);

//   // Fetch transactions for selected account
//   const fetchTransactions = useCallback(async () => {
//     if (!selectedAccountId) return;

//     setIsLoadingTransactions(true);
//     try {
//       const filter: ReconciliationFilterDto = {};
//       if (statusFilter === "pending")
//         filter.status = ReconciliationStatus.Pending;
//       if (statusFilter === "matched")
//         filter.status = ReconciliationStatus.Matched;
//       if (statusFilter === "unmatched")
//         filter.status = ReconciliationStatus.Unmatched;
//       if (dateFrom) filter.startDate = dateFrom;
//       if (dateTo) filter.endDate = dateTo;

//       const response = await getAccountTransactionsForReconciliation(
//         selectedAccountType,
//         selectedAccountId,
//         filter,
//         currentPage,
//         itemsPerPage
//       );

//       if (response.success && response.data) {
//         setTransactions(response.data.items);
//         setTotalTransactions(response.data.totalCount);
//       } else {
//         toast.error(response.message || "Failed to load transactions");
//       }
//     } catch (error) {
//       console.error("Error fetching transactions:", error);
//       toast.error("Failed to load transactions");
//     } finally {
//       setIsLoadingTransactions(false);
//     }
//   }, [
//     selectedAccountId,
//     selectedAccountType,
//     statusFilter,
//     dateFrom,
//     dateTo,
//     currentPage,
//     itemsPerPage,
//   ]);

//   // Fetch balance summary
//   const fetchBalanceSummary = useCallback(async () => {
//     if (!selectedAccountId) return;

//     try {
//       const response = await getAccountReconciliationSummary(
//         selectedAccountType,
//         selectedAccountId
//       );

//       if (response.success && response.data) {
//         setBalanceSummary(response.data);
//         // Initialize actual balance input with the actual balance from API
//         if (actualBalanceInput === 0) {
//           setActualBalanceInput(response.data.actualBalance);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching balance summary:", error);
//     }
//   }, [selectedAccountId, selectedAccountType]);

//   // Fetch reconciliation history
//   const fetchReconciliationHistoryData = useCallback(async () => {
//     try {
//       const response = await getReconciliationHistory(selectedAccountType);
//       if (response.success && response.data) {
//         setReconciliationHistory(response.data.items);
//       }
//     } catch (error) {
//       console.error("Error fetching reconciliation history:", error);
//     }
//   }, [selectedAccountType]);

//   // ==================== EFFECTS ====================

//   useEffect(() => {
//     fetchAccounts();
//   }, [fetchAccounts]);

//   useEffect(() => {
//     if (selectedAccountId) {
//       fetchTransactions();
//       fetchBalanceSummary();
//       fetchReconciliationHistoryData();
//     }
//   }, [
//     selectedAccountId,
//     fetchTransactions,
//     fetchBalanceSummary,
//     fetchReconciliationHistoryData,
//   ]);

//   // Reset selected account when type changes
//   useEffect(() => {
//     setSelectedAccountId("");
//     setTransactions([]);
//     setSelectedTransactions(new Set());
//     setActualBalanceInput(0);
//   }, [selectedAccountType]);

//   // ==================== HANDLERS ====================

//   const handleSelectTransaction = (id: string) => {
//     setSelectedTransactions((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(id)) {
//         newSet.delete(id);
//       } else {
//         newSet.add(id);
//       }
//       return newSet;
//     });
//   };

//   const handleSelectAll = () => {
//     const pendingTransactions = filteredTransactions.filter(
//       (t) => t.reconciliationStatus === ReconciliationStatus.Pending
//     );
//     if (selectedTransactions.size === pendingTransactions.length) {
//       setSelectedTransactions(new Set());
//     } else {
//       setSelectedTransactions(new Set(pendingTransactions.map((t) => t.id)));
//     }
//   };

//   const handleReconcileTransaction = async () => {
//     if (!selectedTransaction) return;

//     setIsSubmitting(true);
//     try {
//       const dto: ReconcileTransactionDto = {
//         actualAmount: reconcileForm.actualAmount,
//         status: reconcileForm.status,
//         notes: reconcileForm.notes || undefined,
//       };

//       const response = await reconcileTransaction(selectedTransaction.id, dto);

//       if (response.success) {
//         toast.success(
//           reconcileForm.status === ReconciliationStatus.Matched
//             ? "✓ Transaction matched successfully"
//             : "⚠ Transaction marked as unmatched"
//         );

//         setShowReconcileModal(false);
//         setSelectedTransaction(null);
//         setReconcileForm({
//           actualAmount: 0,
//           status: ReconciliationStatus.Matched,
//           notes: "",
//         });

//         // Refresh data
//         await Promise.all([
//           fetchTransactions(),
//           fetchBalanceSummary(),
//           fetchAccounts(),
//         ]);
//       } else {
//         toast.error(response.message || "Failed to reconcile transaction");
//       }
//     } catch (error) {
//       console.error("Error reconciling transaction:", error);
//       toast.error("Failed to reconcile transaction");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleQuickMatch = async (
//     transaction: TransactionReconciliationDto
//   ) => {
//     setIsSubmitting(true);
//     try {
//       const dto: ReconcileTransactionDto = {
//         actualAmount: transaction.amount,
//         status: ReconciliationStatus.Matched,
//         notes: "Quick matched - amounts equal",
//       };

//       const response = await reconcileTransaction(transaction.id, dto);

//       if (response.success) {
//         toast.success("✓ Transaction matched");
//         await Promise.all([
//           fetchTransactions(),
//           fetchBalanceSummary(),
//           fetchAccounts(),
//         ]);
//       } else {
//         toast.error(response.message || "Failed to match transaction");
//       }
//     } catch (error) {
//       console.error("Error matching transaction:", error);
//       toast.error("Failed to match transaction");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleBulkReconcile = async (status: ReconciliationStatus) => {
//     if (selectedTransactions.size === 0) {
//       toast.error("Please select transactions to reconcile");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const dto: BulkReconcileDto = {
//         transactionIds: Array.from(selectedTransactions),
//         status,
//         notes: `Bulk reconciled as ${
//           status === ReconciliationStatus.Matched ? "Matched" : "Unmatched"
//         }`,
//       };

//       const response = await bulkReconcileTransactions(dto);

//       if (response.success) {
//         toast.success(
//           `✓ ${response.data} transactions ${
//             status === ReconciliationStatus.Matched
//               ? "matched"
//               : "marked as unmatched"
//           }`
//         );

//         setSelectedTransactions(new Set());
//         setShowBulkModal(false);

//         // Refresh data
//         await Promise.all([
//           fetchTransactions(),
//           fetchBalanceSummary(),
//           fetchAccounts(),
//         ]);
//       } else {
//         toast.error(
//           response.message || "Failed to bulk reconcile transactions"
//         );
//       }
//     } catch (error) {
//       console.error("Error bulk reconciling:", error);
//       toast.error("Failed to bulk reconcile transactions");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleAutoReconcile = async () => {
//     const pendingTransactions = transactions.filter(
//       (t) => t.reconciliationStatus === ReconciliationStatus.Pending
//     );

//     if (pendingTransactions.length === 0) {
//       toast.info("No pending transactions to reconcile");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const dto: BulkReconcileDto = {
//         transactionIds: pendingTransactions.map((t) => t.id),
//         status: ReconciliationStatus.Matched,
//         notes: "Auto reconciled - all pending transactions",
//       };

//       const response = await bulkReconcileTransactions(dto);

//       if (response.success) {
//         toast.success(`✓ ${response.data} transactions auto-reconciled`);
//         await Promise.all([
//           fetchTransactions(),
//           fetchBalanceSummary(),
//           fetchAccounts(),
//         ]);
//       } else {
//         toast.error(response.message || "Failed to auto-reconcile");
//       }
//     } catch (error) {
//       console.error("Error auto reconciling:", error);
//       toast.error("Failed to auto-reconcile transactions");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCompleteReconciliation = async () => {
//     if (balanceSummary.pendingCount > 0) {
//       toast.error(
//         `❌ Cannot complete reconciliation. ${balanceSummary.pendingCount} transactions are still pending.`
//       );
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const dto: CreateReconciliationDto = {
//         accountType: selectedAccountType,
//         accountId: selectedAccountId,
//         actualBalance: actualBalanceInput,
//         notes:
//           balanceSummary.unmatchedCount > 0
//             ? `Completed with ${balanceSummary.unmatchedCount} unmatched transactions`
//             : "All transactions matched",
//       };

//       const response = await createReconciliationRecord(dto);

//       if (response.success) {
//         if (balanceSummary.unmatchedCount > 0) {
//           toast.warning(
//             `⚠ Reconciliation completed with ${balanceSummary.unmatchedCount} unmatched transactions.`
//           );
//         } else {
//           toast.success(
//             "✓ Reconciliation completed successfully! All transactions matched."
//           );
//         }
//         setShowCompleteModal(false);
//         await fetchReconciliationHistoryData();
//       } else {
//         toast.error(response.message || "Failed to complete reconciliation");
//       }
//     } catch (error) {
//       console.error("Error completing reconciliation:", error);
//       toast.error("Failed to complete reconciliation");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleExportReport = () => {
//     const selectedAccount = accounts.find((a) => a.id === selectedAccountId);
//     const csvData = [
//       [
//         "Code",
//         "Reference",
//         "Date",
//         "Description",
//         "Type",
//         "Expected Amount",
//         "Actual Amount",
//         "Variance",
//         "Status",
//         "Reconciled At",
//         "Notes",
//       ],
//       ...filteredTransactions.map((txn) => [
//         txn.code,
//         txn.reference,
//         new Date(txn.transactionDate).toLocaleDateString(),
//         txn.description,
//         txn.transactionType === TransactionType.Debit ? "DEBIT" : "CREDIT",
//         txn.amount.toFixed(2),
//         txn.actualAmount?.toFixed(2) || "-",
//         txn.variance?.toFixed(2) || "-",
//         getReconciliationStatusLabel(txn.reconciliationStatus),
//         txn.reconciledAt ? new Date(txn.reconciledAt).toLocaleString() : "-",
//         txn.reconciliationNotes || "",
//       ]),
//     ];

//     const csv = csvData
//       .map((row) => row.map((cell) => `"${cell}"`).join(","))
//       .join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     const accountName = selectedAccount?.name || "account";
//     a.download = `reconciliation-${accountName.replace(/\s+/g, "-")}-${
//       new Date().toISOString().split("T")[0]
//     }.csv`;
//     a.click();
//     window.URL.revokeObjectURL(url);
//     toast.success("✓ Reconciliation report exported");
//   };

//   const handleRefresh = async () => {
//     setIsLoading(true);
//     await Promise.all([
//       fetchAccounts(),
//       fetchTransactions(),
//       fetchBalanceSummary(),
//       fetchReconciliationHistoryData(),
//     ]);
//     setIsLoading(false);
//     toast.success("Data refreshed!");
//   };

//   // ==================== FILTERING ====================

//   const filteredAccounts = accounts.filter(
//     (a) => a.accountType === selectedAccountType
//   );

//   const filteredTransactions = transactions.filter((txn) => {
//     const matchesSearch =
//       txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       txn.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       txn.code.toLowerCase().includes(searchTerm.toLowerCase());

//     return matchesSearch;
//   });

//   // Pagination
//   const totalPages = Math.ceil(totalTransactions / itemsPerPage);

//   // Get selected account
//   const selectedAccount = accounts.find((a) => a.id === selectedAccountId);

//   // Calculate variance
//   const currentVariance = actualBalanceInput - (selectedAccount?.balance || 0);
//   const isBalanced = Math.abs(currentVariance) < 0.01;

//   // ==================== STATUS BADGE COMPONENT ====================

//   const StatusBadge = ({ status }: { status: ReconciliationStatus }) => {
//     if (status === ReconciliationStatus.Matched) {
//       return (
//         <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 border-l-4 border-emerald-500 text-xs font-bold uppercase tracking-wide">
//           <CheckCircle2 className="w-3.5 h-3.5" />
//           Matched
//         </span>
//       );
//     } else if (status === ReconciliationStatus.Unmatched) {
//       return (
//         <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 border-l-4 border-red-500 text-xs font-bold uppercase tracking-wide">
//           <AlertTriangle className="w-3.5 h-3.5" />
//           Unmatched
//         </span>
//       );
//     } else {
//       return (
//         <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 border-l-4 border-amber-500 text-xs font-bold uppercase tracking-wide">
//           <Clock className="w-3.5 h-3.5" />
//           Pending
//         </span>
//       );
//     }
//   };

//   // ==================== LOADING STATE ====================

//   if (isLoading && accounts.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6 flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
//           <p className="text-slate-600 font-medium">
//             Loading reconciliation data...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // ==================== MAIN RENDER ====================

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6">
//       <div className="max-w-[1800px] mx-auto space-y-6">
//         {/* ==================== HEADER ==================== */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
//         >
//           <div>
//             <div className="flex items-center gap-3 mb-2">
//               <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
//                 <Scale className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
//                   Account Reconciliation
//                 </h1>
//                 <p className="text-slate-600 font-medium">
//                   Match and verify transactions with bank/M-Pesa statements
//                 </p>
//               </div>
//             </div>
//           </div>
//           <div className="flex gap-3">
//             <button
//               onClick={() => setShowHistoryModal(true)}
//               className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-slate-200 text-slate-700 font-bold shadow-md hover:shadow-lg hover:border-slate-300 transition-all duration-300"
//             >
//               <FileText className="w-5 h-5" />
//               History
//             </button>
//             <button
//               onClick={handleRefresh}
//               disabled={isLoading}
//               className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-blue-200 text-blue-600 font-bold shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300 disabled:opacity-50"
//             >
//               {isLoading ? (
//                 <Loader2 className="w-5 h-5 animate-spin" />
//               ) : (
//                 <RefreshCw className="w-5 h-5" />
//               )}
//               Refresh
//             </button>
//             <button
//               onClick={handleExportReport}
//               disabled={transactions.length === 0}
//               className="flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 hover:shadow-xl transition-all duration-300 disabled:opacity-50"
//             >
//               <Download className="w-5 h-5" />
//               Export
//             </button>
//             <button
//               onClick={() => window.print()}
//               className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
//             >
//               <Printer className="w-5 h-5" />
//               Print
//             </button>
//           </div>
//         </motion.div>

//         {/* ==================== ACCOUNT TYPE SELECTOR ==================== */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="flex flex-wrap gap-3"
//         >
//           {[
//             {
//               type: AccountType.Bank,
//               label: "Bank Accounts",
//               icon: Building2,
//               color: "blue",
//             },
//             {
//               type: AccountType.Mpesa,
//               label: "M-Pesa Accounts",
//               icon: Smartphone,
//               color: "emerald",
//             },
//             {
//               type: AccountType.Cash,
//               label: "Cash at Hand",
//               icon: Wallet,
//               color: "purple",
//             },
//           ].map(({ type, label, icon: Icon, color }) => {
//             const typeAccounts = accounts.filter((a) => a.accountType === type);
//             const pendingCount = typeAccounts.reduce(
//               (sum, a) => sum + a.pendingCount,
//               0
//             );
//             const isSelected = selectedAccountType === type;

//             return (
//               <button
//                 key={type}
//                 onClick={() => setSelectedAccountType(type)}
//                 className={`relative flex items-center gap-3 px-6 py-4 font-semibold transition-all duration-300 ${
//                   isSelected
//                     ? `bg-gradient-to-r from-${color}-600 to-${
//                         color === "blue" ? "cyan" : color
//                       }-600 text-white shadow-lg shadow-${color}-500/30`
//                     : "bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300"
//                 }`}
//               >
//                 <Icon className="w-5 h-5" />
//                 {label}
//                 <span
//                   className={`px-2 py-0.5 text-xs font-bold rounded-full ${
//                     isSelected
//                       ? "bg-white/20"
//                       : `bg-${color}-100 text-${color}-700`
//                   }`}
//                 >
//                   {typeAccounts.length}
//                 </span>
//                 {pendingCount > 0 && (
//                   <span className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
//                     {pendingCount > 99 ? "99+" : pendingCount}
//                   </span>
//                 )}
//               </button>
//             );
//           })}
//         </motion.div>

//         {/* ==================== ACCOUNT SELECTOR ==================== */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="bg-white border-2 border-slate-200 p-6 shadow-lg"
//         >
//           <div className="flex flex-col md:flex-row md:items-end gap-4">
//             <div className="flex-1">
//               <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
//                 <Target className="w-4 h-4 text-blue-600" />
//                 Select Account to Reconcile
//               </label>
//               <select
//                 value={selectedAccountId}
//                 onChange={(e) => {
//                   setSelectedAccountId(e.target.value);
//                   setActualBalanceInput(0);
//                   setSelectedTransactions(new Set());
//                 }}
//                 className="w-full px-4 py-3.5 border-2 border-slate-200 bg-white text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
//               >
//                 <option value="">-- Select an Account --</option>
//                 {filteredAccounts.map((acc) => (
//                   <option key={acc.id} value={acc.id}>
//                     {acc.name} • {getCurrencyLabel(acc.currency)} • Balance:{" "}
//                     {getCurrencySymbol(acc.currency)}
//                     {acc.balance.toLocaleString()} • Pending: {acc.pendingCount}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             {selectedAccount && (
//               <div className="flex gap-3">
//                 <div className="bg-emerald-50 border-2 border-emerald-200 px-4 py-3">
//                   <p className="text-[10px] text-emerald-700 font-bold uppercase">
//                     Matched
//                   </p>
//                   <p className="text-xl font-bold text-emerald-600">
//                     {selectedAccount.matchedCount}
//                   </p>
//                 </div>
//                 <div className="bg-amber-50 border-2 border-amber-200 px-4 py-3">
//                   <p className="text-[10px] text-amber-700 font-bold uppercase">
//                     Pending
//                   </p>
//                   <p className="text-xl font-bold text-amber-600">
//                     {selectedAccount.pendingCount}
//                   </p>
//                 </div>
//                 <div className="bg-red-50 border-2 border-red-200 px-4 py-3">
//                   <p className="text-[10px] text-red-700 font-bold uppercase">
//                     Unmatched
//                   </p>
//                   <p className="text-xl font-bold text-red-600">
//                     {selectedAccount.unmatchedCount}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </motion.div>

//         {/* ==================== BALANCE SUMMARY CARDS ==================== */}
//         {selectedAccount && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             {/* System Balance */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.3 }}
//               whileHover={{ scale: 1.02 }}
//               className="relative bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 text-white shadow-xl shadow-blue-500/20 overflow-hidden"
//             >
//               <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
//               <div className="relative p-6">
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="w-12 h-12 bg-white/15 backdrop-blur-sm flex items-center justify-center border-2 border-white/20">
//                     <FileText className="w-6 h-6" />
//                   </div>
//                   <div className="bg-white/20 backdrop-blur-sm px-3 py-1 border border-white/30">
//                     <span className="text-[10px] font-bold uppercase tracking-wide">
//                       System
//                     </span>
//                   </div>
//                 </div>
//                 <p className="text-xs opacity-90 mb-1 uppercase tracking-wider font-semibold">
//                   Expected Balance
//                 </p>
//                 <p className="text-3xl font-bold tracking-tight">
//                   {getCurrencySymbol(selectedAccount.currency)}
//                   {selectedAccount.balance.toLocaleString("en-US", {
//                     minimumFractionDigits: 2,
//                   })}
//                 </p>
//                 <div className="mt-3 pt-3 border-t border-white/20">
//                   <p className="text-[10px] opacity-75">From System Records</p>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Actual Balance Input */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.35 }}
//               whileHover={{ scale: 1.02 }}
//               className="bg-white border-2 border-purple-200 shadow-lg hover:shadow-xl hover:border-purple-300 transition-all duration-300 group"
//             >
//               <div className="p-6">
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="w-12 h-12 bg-purple-100 flex items-center justify-center border-2 border-purple-200 group-hover:bg-purple-200 transition-colors">
//                     <DollarSign className="w-6 h-6 text-purple-600" />
//                   </div>
//                   <div className="bg-purple-100 px-3 py-1 border border-purple-200">
//                     <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wide">
//                       Actual
//                     </span>
//                   </div>
//                 </div>
//                 <p className="text-[10px] text-slate-500 mb-2 uppercase tracking-wider font-bold">
//                   Statement Balance
//                 </p>
//                 <div className="relative">
//                   <span className="absolute left-0 top-1/2 -translate-y-1/2 text-lg font-bold text-purple-400">
//                     {getCurrencySymbol(selectedAccount.currency)}
//                   </span>
//                   <input
//                     type="number"
//                     value={actualBalanceInput || ""}
//                     onChange={(e) =>
//                       setActualBalanceInput(parseFloat(e.target.value) || 0)
//                     }
//                     placeholder="0.00"
//                     className="w-full pl-12 text-3xl font-bold text-purple-700 bg-transparent border-b-2 border-purple-300 focus:border-purple-600 outline-none transition-colors"
//                     step="0.01"
//                   />
//                 </div>
//                 <div className="mt-3 pt-3 border-t-2 border-slate-100">
//                   <p className="text-[10px] text-slate-500 font-semibold">
//                     Enter from Bank/M-Pesa Statement
//                   </p>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Variance */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.4 }}
//               whileHover={{ scale: 1.02 }}
//               className={`border-2 shadow-lg hover:shadow-xl transition-all duration-300 ${
//                 isBalanced
//                   ? "bg-emerald-50 border-emerald-200 hover:border-emerald-300"
//                   : "bg-red-50 border-red-200 hover:border-red-300"
//               }`}
//             >
//               <div className="p-6">
//                 <div className="flex items-start justify-between mb-4">
//                   {isBalanced ? (
//                     <div className="w-12 h-12 bg-emerald-100 flex items-center justify-center border-2 border-emerald-200">
//                       <ShieldCheck className="w-6 h-6 text-emerald-600" />
//                     </div>
//                   ) : (
//                     <div className="w-12 h-12 bg-red-100 flex items-center justify-center border-2 border-red-200">
//                       <AlertTriangle className="w-6 h-6 text-red-600" />
//                     </div>
//                   )}
//                   <div
//                     className={`px-3 py-1 border ${
//                       isBalanced
//                         ? "bg-emerald-100 border-emerald-200"
//                         : "bg-red-100 border-red-200"
//                     }`}
//                   >
//                     <span
//                       className={`text-[10px] font-bold uppercase tracking-wide ${
//                         isBalanced ? "text-emerald-700" : "text-red-700"
//                       }`}
//                     >
//                       {isBalanced ? "Balanced" : "Variance"}
//                     </span>
//                   </div>
//                 </div>
//                 <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
//                   Difference
//                 </p>
//                 <p
//                   className={`text-3xl font-bold tracking-tight ${
//                     isBalanced ? "text-emerald-600" : "text-red-600"
//                   }`}
//                 >
//                   {currentVariance >= 0 ? "+" : ""}
//                   {getCurrencySymbol(selectedAccount.currency)}
//                   {currentVariance.toLocaleString("en-US", {
//                     minimumFractionDigits: 2,
//                   })}
//                 </p>
//                 <div className="mt-3 pt-3 border-t-2 border-slate-100">
//                   <p
//                     className={`text-[10px] font-semibold ${
//                       isBalanced ? "text-emerald-600" : "text-red-600"
//                     }`}
//                   >
//                     {isBalanced
//                       ? "✓ Perfectly Balanced"
//                       : "⚠ Requires Attention"}
//                   </p>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Progress Summary */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.45 }}
//               whileHover={{ scale: 1.02 }}
//               className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-amber-300 transition-all duration-300"
//             >
//               <div className="p-6">
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="w-12 h-12 bg-amber-100 flex items-center justify-center border-2 border-amber-200">
//                     <Activity className="w-6 h-6 text-amber-600" />
//                   </div>
//                   <div className="bg-amber-100 px-3 py-1 border border-amber-200">
//                     <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">
//                       Progress
//                     </span>
//                   </div>
//                 </div>
//                 <p className="text-[10px] text-slate-500 mb-3 uppercase tracking-wider font-bold">
//                   Reconciliation Status
//                 </p>

//                 {/* Progress Bar */}
//                 <div className="mb-3">
//                   <div className="h-3 bg-slate-200 rounded-full overflow-hidden flex">
//                     <div
//                       className="h-full bg-emerald-500 transition-all duration-500"
//                       style={{
//                         width: `${
//                           totalTransactions > 0
//                             ? (balanceSummary.matchedCount /
//                                 totalTransactions) *
//                               100
//                             : 0
//                         }%`,
//                       }}
//                     />
//                     <div
//                       className="h-full bg-red-500 transition-all duration-500"
//                       style={{
//                         width: `${
//                           totalTransactions > 0
//                             ? (balanceSummary.unmatchedCount /
//                                 totalTransactions) *
//                               100
//                             : 0
//                         }%`,
//                       }}
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-1.5">
//                   <div className="flex justify-between items-center">
//                     <span className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
//                       <div className="w-2 h-2 bg-emerald-500 rounded-full" />
//                       Matched
//                     </span>
//                     <span className="text-sm font-bold text-emerald-600">
//                       {balanceSummary.matchedCount}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
//                       <div className="w-2 h-2 bg-amber-500 rounded-full" />
//                       Pending
//                     </span>
//                     <span className="text-sm font-bold text-amber-600">
//                       {balanceSummary.pendingCount}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
//                       <div className="w-2 h-2 bg-red-500 rounded-full" />
//                       Unmatched
//                     </span>
//                     <span className="text-sm font-bold text-red-600">
//                       {balanceSummary.unmatchedCount}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         )}

//         {/* ==================== FILTERS AND ACTIONS ==================== */}
//         {selectedAccount && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5 }}
//             className="bg-white border-2 border-slate-200 p-6 shadow-lg"
//           >
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
//               {/* Search */}
//               <div className="lg:col-span-2">
//                 <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                   Search Transactions
//                 </label>
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
//                   <input
//                     type="text"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     placeholder="Search description, reference, code..."
//                     className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
//                   />
//                 </div>
//               </div>

//               {/* Status Filter */}
//               <div>
//                 <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                   Status
//                 </label>
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => {
//                     setStatusFilter(e.target.value as any);
//                     setCurrentPage(1);
//                   }}
//                   className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
//                 >
//                   <option value="all">All Statuses</option>
//                   <option value="pending">Pending</option>
//                   <option value="matched">Matched</option>
//                   <option value="unmatched">Unmatched</option>
//                 </select>
//               </div>

//               {/* Bulk Actions */}
//               <div>
//                 <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                   Bulk ({selectedTransactions.size})
//                 </label>
//                 <button
//                   onClick={() => setShowBulkModal(true)}
//                   disabled={selectedTransactions.size === 0}
//                   className="w-full px-4 py-3 bg-purple-600 text-white font-bold shadow-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                 >
//                   <ListChecks className="w-4 h-4" />
//                   Bulk Reconcile
//                 </button>
//               </div>

//               {/* Auto Reconcile */}
//               <div>
//                 <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                   Quick Actions
//                 </label>
//                 <button
//                   onClick={handleAutoReconcile}
//                   disabled={balanceSummary.pendingCount === 0 || isSubmitting}
//                   className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                 >
//                   {isSubmitting ? (
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                   ) : (
//                     <Zap className="w-4 h-4" />
//                   )}
//                   Auto Match All
//                 </button>
//               </div>

//               {/* Complete */}
//               <div>
//                 <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                   Finalize
//                 </label>
//                 <button
//                   onClick={() => setShowCompleteModal(true)}
//                   disabled={
//                     balanceSummary.pendingCount > 0 || transactions.length === 0
//                   }
//                   className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                 >
//                   <CheckCircle2 className="w-4 h-4" />
//                   Complete
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         )}

//         {/* ==================== TRANSACTIONS TABLE ==================== */}
//         {selectedAccount && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.6 }}
//             className="bg-white/90 backdrop-blur-xl border-2 border-slate-200 shadow-2xl overflow-hidden"
//           >
//             {/* Table Header */}
//             <div className="p-6 border-b-2 border-slate-200 bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//               <div>
//                 <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
//                   <Banknote className="w-6 h-6 text-blue-600" />
//                   Transaction Details
//                 </h3>
//                 <p className="text-sm text-slate-600 mt-1">
//                   {totalTransactions} transactions • {selectedAccount.name} •{" "}
//                   {getCurrencyLabel(selectedAccount.currency)}
//                 </p>
//               </div>
//               <div className="flex items-center gap-3">
//                 <span className="text-sm text-slate-600">
//                   Page {currentPage} of {totalPages || 1}
//                 </span>
//               </div>
//             </div>

//             {/* Table Content */}
//             {isLoadingTransactions ? (
//               <div className="flex items-center justify-center py-20">
//                 <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
//                 <span className="ml-3 text-slate-600">
//                   Loading transactions...
//                 </span>
//               </div>
//             ) : filteredTransactions.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-20 text-slate-500">
//                 <FileText className="w-16 h-16 mb-4 text-slate-300" />
//                 <p className="text-lg font-medium">No transactions found</p>
//                 <p className="text-sm">
//                   {transactions.length === 0
//                     ? "No transactions for this account"
//                     : "Try adjusting your search or filters"}
//                 </p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-700 text-white">
//                     <tr>
//                       <th className="px-4 py-4 text-center w-12">
//                         <button
//                           onClick={handleSelectAll}
//                           className="p-1 hover:bg-white/20 transition rounded"
//                           title="Select all pending"
//                         >
//                           {selectedTransactions.size ===
//                             filteredTransactions.filter(
//                               (t) =>
//                                 t.reconciliationStatus ===
//                                 ReconciliationStatus.Pending
//                             ).length &&
//                           filteredTransactions.filter(
//                             (t) =>
//                               t.reconciliationStatus ===
//                               ReconciliationStatus.Pending
//                           ).length > 0 ? (
//                             <CheckSquare className="w-5 h-5" />
//                           ) : (
//                             <Square className="w-5 h-5 opacity-60" />
//                           )}
//                         </button>
//                       </th>
//                       <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">
//                         Date
//                       </th>
//                       <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">
//                         Reference
//                       </th>
//                       <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">
//                         Description
//                       </th>
//                       <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider">
//                         Type
//                       </th>
//                       <th className="px-4 py-4 text-right text-xs font-bold uppercase tracking-wider">
//                         Expected
//                       </th>
//                       <th className="px-4 py-4 text-right text-xs font-bold uppercase tracking-wider">
//                         Actual
//                       </th>
//                       <th className="px-4 py-4 text-right text-xs font-bold uppercase tracking-wider">
//                         Variance
//                       </th>
//                       <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider">
//                         Status
//                       </th>
//                       <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-200">
//                     {filteredTransactions.map((txn, index) => (
//                       <motion.tr
//                         key={txn.id}
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: index * 0.02 }}
//                         className={`hover:bg-blue-50/50 transition-colors ${
//                           selectedTransactions.has(txn.id) ? "bg-blue-50" : ""
//                         }`}
//                       >
//                         <td className="px-4 py-4 text-center">
//                           {txn.reconciliationStatus ===
//                             ReconciliationStatus.Pending && (
//                             <button
//                               onClick={() => handleSelectTransaction(txn.id)}
//                               className="p-1 hover:bg-slate-200 transition rounded"
//                             >
//                               {selectedTransactions.has(txn.id) ? (
//                                 <CheckSquare className="w-5 h-5 text-blue-600" />
//                               ) : (
//                                 <Square className="w-5 h-5 text-slate-400" />
//                               )}
//                             </button>
//                           )}
//                         </td>
//                         <td className="px-4 py-4 whitespace-nowrap">
//                           <div className="flex items-center gap-2">
//                             <Calendar className="w-4 h-4 text-slate-400" />
//                             <span className="text-sm font-medium text-slate-900">
//                               {new Date(txn.transactionDate).toLocaleDateString(
//                                 "en-US",
//                                 {
//                                   month: "short",
//                                   day: "numeric",
//                                   year: "numeric",
//                                 }
//                               )}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-4 py-4 whitespace-nowrap">
//                           <span className="text-sm font-mono text-blue-600 font-semibold">
//                             {txn.reference || txn.code}
//                           </span>
//                         </td>
//                         <td className="px-4 py-4">
//                           <span className="text-sm text-slate-900 font-medium line-clamp-1 max-w-xs">
//                             {txn.description}
//                           </span>
//                         </td>
//                         <td className="px-4 py-4 text-center">
//                           {txn.transactionType === TransactionType.Debit ? (
//                             <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 border-l-4 border-emerald-500 text-xs font-bold uppercase">
//                               <ArrowUpCircle className="w-3.5 h-3.5" />
//                               DR
//                             </span>
//                           ) : (
//                             <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 border-l-4 border-red-500 text-xs font-bold uppercase">
//                               <ArrowDownCircle className="w-3.5 h-3.5" />
//                               CR
//                             </span>
//                           )}
//                         </td>
//                         <td className="px-4 py-4 text-right whitespace-nowrap">
//                           <span className="text-base font-bold text-slate-900">
//                             {getCurrencySymbol(txn.currency)}
//                             {txn.amount.toLocaleString("en-US", {
//                               minimumFractionDigits: 2,
//                             })}
//                           </span>
//                         </td>
//                         <td className="px-4 py-4 text-right whitespace-nowrap">
//                           {txn.actualAmount !== null ? (
//                             <span className="text-base font-bold text-purple-700">
//                               {getCurrencySymbol(txn.currency)}
//                               {txn.actualAmount.toLocaleString("en-US", {
//                                 minimumFractionDigits: 2,
//                               })}
//                             </span>
//                           ) : (
//                             <span className="text-slate-400">-</span>
//                           )}
//                         </td>
//                         <td className="px-4 py-4 text-right whitespace-nowrap">
//                           {txn.variance !== null ? (
//                             Math.abs(txn.variance) < 0.01 ? (
//                               <span className="text-base font-bold text-emerald-600">
//                                 ✓
//                               </span>
//                             ) : (
//                               <span className="text-base font-bold text-red-600">
//                                 {txn.variance >= 0 ? "+" : ""}
//                                 {getCurrencySymbol(txn.currency)}
//                                 {txn.variance.toLocaleString("en-US", {
//                                   minimumFractionDigits: 2,
//                                 })}
//                               </span>
//                             )
//                           ) : (
//                             <span className="text-slate-400">-</span>
//                           )}
//                         </td>
//                         <td className="px-4 py-4 text-center">
//                           <StatusBadge status={txn.reconciliationStatus} />
//                         </td>
//                         <td className="px-4 py-4 text-center">
//                           <div className="flex items-center justify-center gap-1">
//                             {/* View Details */}
//                             <button
//                               onClick={() => {
//                                 setSelectedTransaction(txn);
//                                 setShowDetailModal(true);
//                               }}
//                               className="p-2 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all"
//                               title="View details"
//                             >
//                               <Eye className="w-4 h-4" />
//                             </button>

//                             {txn.reconciliationStatus ===
//                               ReconciliationStatus.Pending && (
//                               <>
//                                 {/* Quick Match */}
//                                 <button
//                                   onClick={() => handleQuickMatch(txn)}
//                                   disabled={isSubmitting}
//                                   className="p-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-all disabled:opacity-50"
//                                   title="Quick match (expected = actual)"
//                                 >
//                                   <Check className="w-4 h-4" />
//                                 </button>

//                                 {/* Enter Actual Amount */}
//                                 <button
//                                   onClick={() => {
//                                     setSelectedTransaction(txn);
//                                     setReconcileForm({
//                                       actualAmount: txn.amount,
//                                       status: ReconciliationStatus.Matched,
//                                       notes: "",
//                                     });
//                                     setShowReconcileModal(true);
//                                   }}
//                                   className="p-2 bg-amber-100 text-amber-700 hover:bg-amber-200 transition-all"
//                                   title="Enter actual amount"
//                                 >
//                                   <AlertCircle className="w-4 h-4" />
//                                 </button>
//                               </>
//                             )}

//                             {txn.reconciliationStatus !==
//                               ReconciliationStatus.Pending && (
//                               <button
//                                 onClick={() => {
//                                   toast.info(
//                                     "Reset functionality requires backend update"
//                                   );
//                                 }}
//                                 className="p-2 bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
//                                 title="Reset to pending"
//                               >
//                                 <RotateCcw className="w-4 h-4" />
//                               </button>
//                             )}
//                           </div>
//                         </td>
//                       </motion.tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex items-center justify-between px-6 py-4 border-t-2 border-slate-200 bg-slate-50">
//                 <div className="text-sm text-slate-600 font-medium">
//                   Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
//                   {Math.min(currentPage * itemsPerPage, totalTransactions)} of{" "}
//                   {totalTransactions} transactions
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                     disabled={currentPage === 1}
//                     className="p-2 border-2 border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronLeft className="w-5 h-5" />
//                   </button>
//                   <div className="flex items-center gap-1">
//                     {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                       let pageNum;
//                       if (totalPages <= 5) {
//                         pageNum = i + 1;
//                       } else if (currentPage <= 3) {
//                         pageNum = i + 1;
//                       } else if (currentPage >= totalPages - 2) {
//                         pageNum = totalPages - 4 + i;
//                       } else {
//                         pageNum = currentPage - 2 + i;
//                       }
//                       return (
//                         <button
//                           key={pageNum}
//                           onClick={() => setCurrentPage(pageNum)}
//                           className={`px-4 py-2 border-2 transition-all font-semibold text-sm ${
//                             currentPage === pageNum
//                               ? "bg-blue-600 text-white border-blue-600"
//                               : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
//                           }`}
//                         >
//                           {pageNum}
//                         </button>
//                       );
//                     })}
//                   </div>
//                   <button
//                     onClick={() =>
//                       setCurrentPage((p) => Math.min(totalPages, p + 1))
//                     }
//                     disabled={currentPage === totalPages}
//                     className="p-2 border-2 border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronRight className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </motion.div>
//         )}

//         {/* No Account Selected */}
//         {!selectedAccount && accounts.length > 0 && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-white border-2 border-slate-200 p-12 text-center shadow-lg"
//           >
//             <div className="w-20 h-20 bg-blue-100 flex items-center justify-center mx-auto mb-6">
//               <Target className="w-10 h-10 text-blue-600" />
//             </div>
//             <h3 className="text-xl font-bold text-slate-900 mb-2">
//               Select an Account to Reconcile
//             </h3>
//             <p className="text-slate-600 max-w-md mx-auto">
//               Choose an account from the dropdown above to view and reconcile
//               its transactions against your bank or M-Pesa statement.
//             </p>
//           </motion.div>
//         )}
//       </div>

//       {/* ==================== MODALS ==================== */}

//       {/* Reconcile Transaction Modal */}
//       <AnimatePresence>
//         {showReconcileModal && selectedTransaction && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowReconcileModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white shadow-2xl max-w-lg w-full overflow-hidden"
//             >
//               {/* Header */}
//               <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 p-6 text-white">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-white/20 flex items-center justify-center">
//                       <Scale className="w-5 h-5" />
//                     </div>
//                     <div>
//                       <h3 className="text-xl font-bold">
//                         Reconcile Transaction
//                       </h3>
//                       <p className="text-blue-100 text-sm">
//                         {selectedTransaction.code}
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => setShowReconcileModal(false)}
//                     className="p-2 hover:bg-white/20 transition-colors"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               {/* Body */}
//               <div className="p-6 space-y-4">
//                 {/* Transaction Info */}
//                 <div className="bg-slate-50 border-2 border-slate-200 p-4">
//                   <p className="text-xs font-bold text-slate-500 uppercase mb-1">
//                     Description
//                   </p>
//                   <p className="text-lg font-semibold text-slate-900">
//                     {selectedTransaction.description}
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-blue-50 border-2 border-blue-200 p-4">
//                     <p className="text-xs font-bold text-blue-700 uppercase mb-1">
//                       Expected Amount
//                     </p>
//                     <p className="text-2xl font-bold text-blue-700">
//                       {getCurrencySymbol(selectedTransaction.currency)}
//                       {selectedTransaction.amount.toLocaleString("en-US", {
//                         minimumFractionDigits: 2,
//                       })}
//                     </p>
//                   </div>
//                   <div className="bg-slate-50 border-2 border-slate-200 p-4">
//                     <p className="text-xs font-bold text-slate-500 uppercase mb-1">
//                       Date
//                     </p>
//                     <p className="text-lg font-semibold text-slate-900">
//                       {new Date(
//                         selectedTransaction.transactionDate
//                       ).toLocaleDateString("en-US", {
//                         month: "long",
//                         day: "numeric",
//                         year: "numeric",
//                       })}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Actual Amount Input */}
//                 <div>
//                   <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                     Actual Amount *
//                   </label>
//                   <input
//                     type="number"
//                     value={reconcileForm.actualAmount || ""}
//                     onChange={(e) =>
//                       setReconcileForm({
//                         ...reconcileForm,
//                         actualAmount: parseFloat(e.target.value) || 0,
//                       })
//                     }
//                     placeholder="Enter actual amount from statement"
//                     step="0.01"
//                     className="w-full px-4 py-3 border-2 border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 text-lg font-bold transition-all"
//                   />
//                 </div>

//                 {/* Status Selection */}
//                 <div>
//                   <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                     Reconciliation Status *
//                   </label>
//                   <div className="flex gap-4">
//                     <label className="flex items-center gap-2 cursor-pointer p-3 border-2 rounded transition-all flex-1 justify-center hover:bg-emerald-50 hover:border-emerald-300">
//                       <input
//                         type="radio"
//                         name="status"
//                         checked={
//                           reconcileForm.status === ReconciliationStatus.Matched
//                         }
//                         onChange={() =>
//                           setReconcileForm({
//                             ...reconcileForm,
//                             status: ReconciliationStatus.Matched,
//                           })
//                         }
//                         className="w-4 h-4 text-emerald-600"
//                       />
//                       <CheckCircle2 className="w-4 h-4 text-emerald-600" />
//                       <span className="text-sm font-bold text-slate-700">
//                         Matched
//                       </span>
//                     </label>
//                     <label className="flex items-center gap-2 cursor-pointer p-3 border-2 rounded transition-all flex-1 justify-center hover:bg-red-50 hover:border-red-300">
//                       <input
//                         type="radio"
//                         name="status"
//                         checked={
//                           reconcileForm.status ===
//                           ReconciliationStatus.Unmatched
//                         }
//                         onChange={() =>
//                           setReconcileForm({
//                             ...reconcileForm,
//                             status: ReconciliationStatus.Unmatched,
//                           })
//                         }
//                         className="w-4 h-4 text-red-600"
//                       />
//                       <AlertTriangle className="w-4 h-4 text-red-600" />
//                       <span className="text-sm font-bold text-slate-700">
//                         Unmatched
//                       </span>
//                     </label>
//                   </div>
//                 </div>

//                 {/* Notes */}
//                 <div>
//                   <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                     Notes (Optional)
//                   </label>
//                   <textarea
//                     value={reconcileForm.notes}
//                     onChange={(e) =>
//                       setReconcileForm({
//                         ...reconcileForm,
//                         notes: e.target.value,
//                       })
//                     }
//                     placeholder="Add any notes about this reconciliation..."
//                     rows={3}
//                     className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
//                   />
//                 </div>

//                 {/* Variance Display */}
//                 {reconcileForm.actualAmount > 0 && (
//                   <div
//                     className={`p-4 border-2 ${
//                       Math.abs(
//                         reconcileForm.actualAmount - selectedTransaction.amount
//                       ) < 0.01
//                         ? "bg-emerald-50 border-emerald-200"
//                         : "bg-red-50 border-red-200"
//                     }`}
//                   >
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm font-bold text-slate-700">
//                         Variance:
//                       </span>
//                       <span
//                         className={`text-lg font-bold ${
//                           Math.abs(
//                             reconcileForm.actualAmount -
//                               selectedTransaction.amount
//                           ) < 0.01
//                             ? "text-emerald-600"
//                             : "text-red-600"
//                         }`}
//                       >
//                         {Math.abs(
//                           reconcileForm.actualAmount -
//                             selectedTransaction.amount
//                         ) < 0.01
//                           ? "✓ Matched"
//                           : `${getCurrencySymbol(
//                               selectedTransaction.currency
//                             )}${(
//                               reconcileForm.actualAmount -
//                               selectedTransaction.amount
//                             ).toLocaleString("en-US", {
//                               minimumFractionDigits: 2,
//                             })}`}
//                       </span>
//                     </div>
//                   </div>
//                 )}

//                 {/* Actions */}
//                 <div className="flex gap-3 pt-4 border-t-2 border-slate-200">
//                   <button
//                     onClick={() => setShowReconcileModal(false)}
//                     className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleReconcileTransaction}
//                     disabled={isSubmitting || reconcileForm.actualAmount <= 0}
//                     className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                   >
//                     {isSubmitting ? (
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                     ) : (
//                       <Save className="w-4 h-4" />
//                     )}
//                     Save Reconciliation
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Bulk Reconcile Modal */}
//       <AnimatePresence>
//         {showBulkModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowBulkModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white shadow-2xl max-w-md w-full overflow-hidden"
//             >
//               <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-white/20 flex items-center justify-center">
//                       <ListChecks className="w-5 h-5" />
//                     </div>
//                     <h3 className="text-xl font-bold">Bulk Reconciliation</h3>
//                   </div>
//                   <button
//                     onClick={() => setShowBulkModal(false)}
//                     className="p-2 hover:bg-white/20 transition-colors"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6 space-y-4">
//                 <div className="bg-purple-50 border-2 border-purple-200 p-4">
//                   <p className="text-sm text-purple-900">
//                     <strong>{selectedTransactions.size}</strong> transactions
//                     selected for bulk reconciliation.
//                   </p>
//                 </div>

//                 <p className="text-sm text-slate-600">
//                   Choose an action to apply to all selected transactions:
//                 </p>

//                 <div className="space-y-3">
//                   <button
//                     onClick={() =>
//                       handleBulkReconcile(ReconciliationStatus.Matched)
//                     }
//                     disabled={isSubmitting}
//                     className="w-full px-4 py-4 bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
//                   >
//                     {isSubmitting ? (
//                       <Loader2 className="w-5 h-5 animate-spin" />
//                     ) : (
//                       <CheckCircle2 className="w-5 h-5" />
//                     )}
//                     Mark All as Matched
//                   </button>
//                   <button
//                     onClick={() =>
//                       handleBulkReconcile(ReconciliationStatus.Unmatched)
//                     }
//                     disabled={isSubmitting}
//                     className="w-full px-4 py-4 bg-red-600 text-white font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
//                   >
//                     {isSubmitting ? (
//                       <Loader2 className="w-5 h-5 animate-spin" />
//                     ) : (
//                       <AlertTriangle className="w-5 h-5" />
//                     )}
//                     Mark All as Unmatched
//                   </button>
//                 </div>

//                 <button
//                   onClick={() => setShowBulkModal(false)}
//                   className="w-full px-4 py-3 bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-colors"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Complete Reconciliation Modal */}
//       <AnimatePresence>
//         {showCompleteModal && selectedAccount && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowCompleteModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white shadow-2xl max-w-lg w-full overflow-hidden"
//             >
//               <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 p-6 text-white">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-white/20 flex items-center justify-center">
//                       <ShieldCheck className="w-5 h-5" />
//                     </div>
//                     <div>
//                       <h3 className="text-xl font-bold">
//                         Complete Reconciliation
//                       </h3>
//                       <p className="text-blue-100 text-sm">
//                         {selectedAccount.name}
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => setShowCompleteModal(false)}
//                     className="p-2 hover:bg-white/20 transition-colors"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6 space-y-4">
//                 {/* Summary */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-blue-50 border-2 border-blue-200 p-4">
//                     <p className="text-xs font-bold text-blue-700 uppercase mb-1">
//                       Expected
//                     </p>
//                     <p className="text-xl font-bold text-blue-700">
//                       {getCurrencySymbol(selectedAccount.currency)}
//                       {selectedAccount.balance.toLocaleString()}
//                     </p>
//                   </div>
//                   <div className="bg-purple-50 border-2 border-purple-200 p-4">
//                     <p className="text-xs font-bold text-purple-700 uppercase mb-1">
//                       Actual
//                     </p>
//                     <p className="text-xl font-bold text-purple-700">
//                       {getCurrencySymbol(selectedAccount.currency)}
//                       {actualBalanceInput.toLocaleString()}
//                     </p>
//                   </div>
//                 </div>

//                 <div
//                   className={`p-4 border-2 ${
//                     isBalanced
//                       ? "bg-emerald-50 border-emerald-200"
//                       : "bg-red-50 border-red-200"
//                   }`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm font-bold text-slate-700">
//                       Variance:
//                     </span>
//                     <span
//                       className={`text-xl font-bold ${
//                         isBalanced ? "text-emerald-600" : "text-red-600"
//                       }`}
//                     >
//                       {isBalanced
//                         ? "✓ Balanced"
//                         : `${getCurrencySymbol(
//                             selectedAccount.currency
//                           )}${currentVariance.toLocaleString()}`}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="bg-slate-50 border-2 border-slate-200 p-4 space-y-2">
//                   <div className="flex justify-between">
//                     <span className="text-sm text-slate-600">
//                       Matched Transactions:
//                     </span>
//                     <span className="text-sm font-bold text-emerald-600">
//                       {balanceSummary.matchedCount}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-slate-600">
//                       Unmatched Transactions:
//                     </span>
//                     <span className="text-sm font-bold text-red-600">
//                       {balanceSummary.unmatchedCount}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-slate-600">
//                       Pending Transactions:
//                     </span>
//                     <span className="text-sm font-bold text-amber-600">
//                       {balanceSummary.pendingCount}
//                     </span>
//                   </div>
//                 </div>

//                 {balanceSummary.unmatchedCount > 0 && (
//                   <div className="bg-amber-50 border-2 border-amber-200 p-4 flex items-start gap-3">
//                     <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
//                     <p className="text-sm text-amber-800">
//                       There are <strong>{balanceSummary.unmatchedCount}</strong>{" "}
//                       unmatched transactions. Consider creating an adjustment
//                       entry to balance the account.
//                     </p>
//                   </div>
//                 )}

//                 <div className="flex gap-3 pt-4 border-t-2 border-slate-200">
//                   <button
//                     onClick={() => setShowCompleteModal(false)}
//                     className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleCompleteReconciliation}
//                     disabled={isSubmitting}
//                     className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                   >
//                     {isSubmitting ? (
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                     ) : (
//                       <CheckCircle2 className="w-4 h-4" />
//                     )}
//                     Complete Reconciliation
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Transaction Detail Modal */}
//       <AnimatePresence>
//         {showDetailModal && selectedTransaction && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowDetailModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
//             >
//               {/* Header */}
//               <div
//                 className={`p-6 text-white ${
//                   selectedTransaction.reconciliationStatus ===
//                   ReconciliationStatus.Matched
//                     ? "bg-gradient-to-r from-emerald-600 to-teal-600"
//                     : selectedTransaction.reconciliationStatus ===
//                       ReconciliationStatus.Unmatched
//                     ? "bg-gradient-to-r from-red-600 to-rose-600"
//                     : "bg-gradient-to-r from-amber-500 to-orange-500"
//                 }`}
//               >
//                 <div className="flex items-start justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 bg-white/20 flex items-center justify-center">
//                       <Banknote className="w-6 h-6" />
//                     </div>
//                     <div>
//                       <h3 className="text-2xl font-bold">
//                         Transaction Details
//                       </h3>
//                       <p className="text-white/80 text-sm font-mono mt-1">
//                         {selectedTransaction.code}
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => setShowDetailModal(false)}
//                     className="p-2 hover:bg-white/20 transition-colors"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               {/* Body */}
//               <div className="p-6 space-y-4 overflow-y-auto flex-1">
//                 {/* Transaction Info */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-slate-50 border-2 border-slate-200 p-4">
//                     <p className="text-xs font-bold text-slate-500 uppercase mb-1">
//                       Date
//                     </p>
//                     <p className="text-lg font-bold text-slate-900">
//                       {new Date(
//                         selectedTransaction.transactionDate
//                       ).toLocaleDateString("en-US", {
//                         weekday: "long",
//                         month: "long",
//                         day: "numeric",
//                         year: "numeric",
//                       })}
//                     </p>
//                   </div>
//                   <div className="bg-slate-50 border-2 border-slate-200 p-4">
//                     <p className="text-xs font-bold text-slate-500 uppercase mb-1">
//                       Reference
//                     </p>
//                     <p className="text-lg font-bold text-blue-600 font-mono">
//                       {selectedTransaction.reference ||
//                         selectedTransaction.code}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="bg-slate-50 border-2 border-slate-200 p-4">
//                   <p className="text-xs font-bold text-slate-500 uppercase mb-1">
//                     Description
//                   </p>
//                   <p className="text-lg font-semibold text-slate-900">
//                     {selectedTransaction.description}
//                   </p>
//                 </div>

//                 {/* Amounts */}
//                 <div className="grid grid-cols-3 gap-4">
//                   <div className="bg-blue-50 border-2 border-blue-200 p-4">
//                     <p className="text-xs font-bold text-blue-700 uppercase mb-1">
//                       Expected
//                     </p>
//                     <p className="text-2xl font-bold text-blue-700">
//                       {getCurrencySymbol(selectedTransaction.currency)}
//                       {selectedTransaction.amount.toLocaleString("en-US", {
//                         minimumFractionDigits: 2,
//                       })}
//                     </p>
//                   </div>
//                   <div className="bg-purple-50 border-2 border-purple-200 p-4">
//                     <p className="text-xs font-bold text-purple-700 uppercase mb-1">
//                       Actual
//                     </p>
//                     <p
//                       className={`text-2xl font-bold ${
//                         selectedTransaction.actualAmount !== null
//                           ? "text-purple-700"
//                           : "text-slate-400"
//                       }`}
//                     >
//                       {selectedTransaction.actualAmount !== null
//                         ? `${getCurrencySymbol(
//                             selectedTransaction.currency
//                           )}${selectedTransaction.actualAmount.toLocaleString(
//                             "en-US",
//                             { minimumFractionDigits: 2 }
//                           )}`
//                         : "Not Set"}
//                     </p>
//                   </div>
//                   <div
//                     className={`p-4 border-2 ${
//                       selectedTransaction.actualAmount === null
//                         ? "bg-slate-50 border-slate-200"
//                         : selectedTransaction.variance !== null &&
//                           Math.abs(selectedTransaction.variance) < 0.01
//                         ? "bg-emerald-50 border-emerald-200"
//                         : "bg-red-50 border-red-200"
//                     }`}
//                   >
//                     <p className="text-xs font-bold text-slate-700 uppercase mb-1">
//                       Variance
//                     </p>
//                     <p
//                       className={`text-2xl font-bold ${
//                         selectedTransaction.actualAmount === null
//                           ? "text-slate-400"
//                           : selectedTransaction.variance !== null &&
//                             Math.abs(selectedTransaction.variance) < 0.01
//                           ? "text-emerald-600"
//                           : "text-red-600"
//                       }`}
//                     >
//                       {selectedTransaction.actualAmount !== null
//                         ? selectedTransaction.variance !== null &&
//                           Math.abs(selectedTransaction.variance) < 0.01
//                           ? "✓ Matched"
//                           : `${getCurrencySymbol(
//                               selectedTransaction.currency
//                             )}${(
//                               selectedTransaction.variance || 0
//                             ).toLocaleString("en-US", {
//                               minimumFractionDigits: 2,
//                             })}`
//                         : "-"}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Type and Status */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-slate-50 border-2 border-slate-200 p-4">
//                     <p className="text-xs font-bold text-slate-500 uppercase mb-2">
//                       Transaction Type
//                     </p>
//                     {selectedTransaction.transactionType ===
//                     TransactionType.Debit ? (
//                       <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 border-l-4 border-emerald-500 font-bold">
//                         <ArrowUpCircle className="w-5 h-5" />
//                         DEBIT (Money In)
//                       </span>
//                     ) : (
//                       <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 border-l-4 border-red-500 font-bold">
//                         <ArrowDownCircle className="w-5 h-5" />
//                         CREDIT (Money Out)
//                       </span>
//                     )}
//                   </div>
//                   <div className="bg-slate-50 border-2 border-slate-200 p-4">
//                     <p className="text-xs font-bold text-slate-500 uppercase mb-2">
//                       Status
//                     </p>
//                     <StatusBadge
//                       status={selectedTransaction.reconciliationStatus}
//                     />
//                   </div>
//                 </div>

//                 {/* Reconciliation Info */}
//                 {selectedTransaction.reconciledAt && (
//                   <div className="bg-blue-50 border-2 border-blue-200 p-4">
//                     <p className="text-xs font-bold text-blue-700 uppercase mb-2">
//                       Reconciliation Info
//                     </p>
//                     <div className="grid grid-cols-2 gap-4 text-sm">
//                       <div>
//                         <p className="text-slate-600">Reconciled At:</p>
//                         <p className="font-bold text-slate-900">
//                           {new Date(
//                             selectedTransaction.reconciledAt
//                           ).toLocaleString()}
//                         </p>
//                       </div>
//                       {selectedTransaction.reconciledByName && (
//                         <div>
//                           <p className="text-slate-600">Reconciled By:</p>
//                           <p className="font-bold text-slate-900">
//                             {selectedTransaction.reconciledByName}
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {/* Notes */}
//                 {selectedTransaction.reconciliationNotes && (
//                   <div className="bg-amber-50 border-2 border-amber-200 p-4">
//                     <p className="text-xs font-bold text-amber-700 uppercase mb-1">
//                       Notes
//                     </p>
//                     <p className="text-sm text-amber-900">
//                       {selectedTransaction.reconciliationNotes}
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/* Footer */}
//               <div className="p-4 border-t-2 border-slate-200 bg-slate-50">
//                 <button
//                   onClick={() => setShowDetailModal(false)}
//                   className="w-full px-4 py-3 bg-slate-700 text-white font-bold hover:bg-slate-800 transition-colors"
//                 >
//                   Close
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Reconciliation History Modal */}
//       <AnimatePresence>
//         {showHistoryModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowHistoryModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col"
//             >
//               <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-700 p-6 text-white">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-white/20 flex items-center justify-center">
//                       <FileText className="w-5 h-5" />
//                     </div>
//                     <div>
//                       <h3 className="text-xl font-bold">
//                         Reconciliation History
//                       </h3>
//                       <p className="text-slate-300 text-sm">
//                         Past reconciliation records for{" "}
//                         {getAccountTypeLabel(selectedAccountType)}
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => setShowHistoryModal(false)}
//                     className="p-2 hover:bg-white/20 transition-colors"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6 overflow-y-auto flex-1">
//                 {reconciliationHistory?.length === 0 ? (
//                   <div className="text-center py-12 text-slate-500">
//                     <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
//                     <p className="text-lg font-medium">
//                       No reconciliation history
//                     </p>
//                     <p className="text-sm">
//                       Complete a reconciliation to see records here
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     {reconciliationHistory?.map((rec) => (
//                       <div
//                         key={rec.id}
//                         className={`p-4 border-2 ${
//                           rec.status === ReconciliationStatus.Matched
//                             ? "bg-emerald-50 border-emerald-200"
//                             : rec.status === ReconciliationStatus.Unmatched
//                             ? "bg-red-50 border-red-200"
//                             : "bg-amber-50 border-amber-200"
//                         }`}
//                       >
//                         <div className="flex items-start justify-between">
//                           <div>
//                             <p className="font-bold text-slate-900">
//                               {rec.accountName}
//                             </p>
//                             <p className="text-sm text-slate-600">
//                               {new Date(rec.createdAt).toLocaleString()}
//                             </p>
//                           </div>
//                           <StatusBadge status={rec.status} />
//                         </div>
//                         <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
//                           <div>
//                             <p className="text-slate-500">Expected</p>
//                             <p className="font-bold">
//                               {getCurrencySymbol(rec.currency)}
//                               {rec.expectedBalance.toLocaleString()}
//                             </p>
//                           </div>
//                           <div>
//                             <p className="text-slate-500">Actual</p>
//                             <p className="font-bold">
//                               {getCurrencySymbol(rec.currency)}
//                               {rec.actualBalance.toLocaleString()}
//                             </p>
//                           </div>
//                           <div>
//                             <p className="text-slate-500">Variance</p>
//                             <p
//                               className={`font-bold ${
//                                 Math.abs(rec.variance) < 0.01
//                                   ? "text-emerald-600"
//                                   : "text-red-600"
//                               }`}
//                             >
//                               {Math.abs(rec.variance) < 0.01
//                                 ? "✓ Balanced"
//                                 : `${getCurrencySymbol(
//                                     rec.currency
//                                   )}${rec.variance.toLocaleString()}`}
//                             </p>
//                           </div>
//                         </div>
//                         {rec.notes && (
//                           <p className="mt-3 text-sm text-slate-600 italic">
//                             {rec.notes}
//                           </p>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div className="p-4 border-t-2 border-slate-200 bg-slate-50">
//                 <button
//                   onClick={() => setShowHistoryModal(false)}
//                   className="w-full px-4 py-3 bg-slate-700 text-white font-bold hover:bg-slate-800 transition-colors"
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
// import { useState, useEffect, useCallback, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   CheckCircle2,
//   AlertTriangle,
//   CreditCard,
//   Smartphone,
//   DollarSign,
//   Calendar,
//   FileText,
//   Download,
//   Search,
//   Filter,
//   RefreshCw,
//   Eye,
//   TrendingUp,
//   AlertCircle,
//   Check,
//   X,
//   Clock,
//   Building2,
//   Wallet,
//   Banknote,
//   ArrowUpCircle,
//   ArrowDownCircle,
//   Loader2,
//   ChevronLeft,
//   ChevronRight,
//   CheckSquare,
//   Square,
//   ListChecks,
//   Save,
//   RotateCcw,
//   Info,
//   Activity,
//   Scale,
//   Hash,
//   Printer,
//   ArrowRight,
//   ShieldCheck,
//   Target,
//   Zap,
//   Upload,
//   FileSpreadsheet,
//   Link2,
//   Unlink,
//   Sparkles,
//   TrendingDown,
//   PieChart,
//   BarChart3,
//   Layers,
//   ArrowLeftRight,
//   Keyboard,
//   HelpCircle,
//   Bell,
//   Settings,
//   MoreVertical,
//   Copy,
//   ExternalLink,
//   ChevronDown,
//   ChevronUp,
//   Percent,
//   GitCompare,
//   FileUp,
//   Table,
//   SplitSquareHorizontal,
//   Columns,
//   List,
// } from "lucide-react";
// import { toast } from "sonner";

// // ==================== IMPORT FROM api.ts ====================
// import {
//   AccountType,
//   Currency,
//   TransactionType,
//   ReconciliationStatus,
//   AccountReconciliationSummaryDto,
//   TransactionReconciliationDto,
//   AccountReconciliationBalanceDto,
//   ReconcileTransactionDto,
//   BulkReconcileDto,
//   CreateReconciliationDto,
//   ReconciliationResponseDto,
//   ReconciliationFilterDto,
//   PagedResult,
//   // API Functions
//   getReconciliationAccounts,
//   getAccountTransactionsForReconciliation,
//   getAccountReconciliationSummary,
//   reconcileTransaction,
//   bulkReconcileTransactions,
//   createReconciliationRecord,
//   getReconciliationHistory,
//   getCurrencyLabel,
//   getAccountTypeLabel,
//   getReconciliationStatusLabel,
// } from "@/lib/api";

// // ==================== TYPES ====================

// interface StatementEntry {
//   id: string;
//   date: string;
//   description: string;
//   amount: number;
//   type: "credit" | "debit";
//   reference?: string;
//   balance?: number;
//   matched?: boolean;
//   matchedTransactionId?: string;
//   confidence?: number;
// }

// interface MatchSuggestion {
//   transactionId: string;
//   statementEntryId: string;
//   confidence: number;
//   matchType: "exact" | "amount" | "date" | "reference" | "partial";
//   transaction: TransactionReconciliationDto;
//   statementEntry: StatementEntry;
// }

// type ViewMode = "table" | "split" | "cards";

// // ==================== HELPER FUNCTIONS ====================

// const getCurrencySymbol = (currency: Currency): string => {
//   return currency === Currency.KES ? "KES " : "$";
// };

// const getAccountTypeIcon = (type: AccountType) => {
//   switch (type) {
//     case AccountType.Cash:
//       return <Wallet className="w-5 h-5" />;
//     case AccountType.Bank:
//       return <Building2 className="w-5 h-5" />;
//     case AccountType.Mpesa:
//       return <Smartphone className="w-5 h-5" />;
//     default:
//       return <CreditCard className="w-5 h-5" />;
//   }
// };

// const parseCSVStatement = (csvContent: string): StatementEntry[] => {
//   const lines = csvContent.trim().split("\n");
//   if (lines.length < 2) return [];

//   const headers = lines[0]
//     .toLowerCase()
//     .split(",")
//     .map((h) => h.trim().replace(/"/g, ""));
//   const entries: StatementEntry[] = [];

//   for (let i = 1; i < lines.length; i++) {
//     const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""));

//     // Try to detect columns
//     const dateIdx = headers.findIndex(
//       (h) => h.includes("date") || h.includes("time")
//     );
//     const descIdx = headers.findIndex(
//       (h) =>
//         h.includes("desc") ||
//         h.includes("particular") ||
//         h.includes("narration")
//     );
//     const debitIdx = headers.findIndex(
//       (h) =>
//         h.includes("debit") ||
//         h.includes("withdrawal") ||
//         h.includes("paid out")
//     );
//     const creditIdx = headers.findIndex(
//       (h) =>
//         h.includes("credit") || h.includes("deposit") || h.includes("paid in")
//     );
//     const amountIdx = headers.findIndex(
//       (h) => h.includes("amount") && !h.includes("balance")
//     );
//     const balanceIdx = headers.findIndex((h) => h.includes("balance"));
//     const refIdx = headers.findIndex(
//       (h) =>
//         h.includes("ref") ||
//         h.includes("transaction id") ||
//         h.includes("receipt")
//     );

//     const debitAmt =
//       debitIdx >= 0
//         ? parseFloat(values[debitIdx]?.replace(/[^0-9.-]/g, "") || "0")
//         : 0;
//     const creditAmt =
//       creditIdx >= 0
//         ? parseFloat(values[creditIdx]?.replace(/[^0-9.-]/g, "") || "0")
//         : 0;
//     const singleAmt =
//       amountIdx >= 0
//         ? parseFloat(values[amountIdx]?.replace(/[^0-9.-]/g, "") || "0")
//         : 0;

//     let amount = 0;
//     let type: "credit" | "debit" = "credit";

//     if (debitAmt > 0) {
//       amount = debitAmt;
//       type = "debit";
//     } else if (creditAmt > 0) {
//       amount = creditAmt;
//       type = "credit";
//     } else if (singleAmt !== 0) {
//       amount = Math.abs(singleAmt);
//       type = singleAmt < 0 ? "debit" : "credit";
//     }

//     if (amount > 0) {
//       entries.push({
//         id: `stmt-${i}`,
//         date: values[dateIdx] || new Date().toISOString().split("T")[0],
//         description: values[descIdx] || "Unknown",
//         amount,
//         type,
//         reference: refIdx >= 0 ? values[refIdx] : undefined,
//         balance:
//           balanceIdx >= 0
//             ? parseFloat(values[balanceIdx]?.replace(/[^0-9.-]/g, "") || "0")
//             : undefined,
//         matched: false,
//       });
//     }
//   }

//   return entries;
// };

// const calculateMatchConfidence = (
//   txn: TransactionReconciliationDto,
//   entry: StatementEntry
// ): number => {
//   let confidence = 0;

//   // Amount match (40%)
//   const amountDiff = Math.abs(txn.amount - entry.amount);
//   if (amountDiff === 0) {
//     confidence += 40;
//   } else if (amountDiff < txn.amount * 0.01) {
//     confidence += 30;
//   } else if (amountDiff < txn.amount * 0.05) {
//     confidence += 15;
//   }

//   // Date match (25%)
//   const txnDate = new Date(txn.transactionDate).toDateString();
//   const entryDate = new Date(entry.date).toDateString();
//   if (txnDate === entryDate) {
//     confidence += 25;
//   } else {
//     const daysDiff = Math.abs(
//       (new Date(txn.transactionDate).getTime() -
//         new Date(entry.date).getTime()) /
//         (1000 * 60 * 60 * 24)
//     );
//     if (daysDiff <= 1) confidence += 20;
//     else if (daysDiff <= 3) confidence += 10;
//   }

//   // Type match (20%)
//   const txnType =
//     txn.transactionType === TransactionType.Debit ? "debit" : "credit";
//   // For bank accounts: system debit = bank credit (money coming in)
//   // This depends on perspective - simplified logic here
//   if (
//     (txnType === "debit" && entry.type === "credit") ||
//     (txnType === "credit" && entry.type === "debit")
//   ) {
//     confidence += 20;
//   }

//   // Reference/Description match (15%)
//   const txnDesc = (txn.description + " " + txn.reference).toLowerCase();
//   const entryDesc = (
//     entry.description +
//     " " +
//     (entry.reference || "")
//   ).toLowerCase();
//   const words = entryDesc.split(/\s+/).filter((w) => w.length > 3);
//   const matchingWords = words.filter((w) => txnDesc.includes(w));
//   if (matchingWords.length > 0) {
//     confidence += Math.min(15, matchingWords.length * 5);
//   }

//   return Math.min(100, confidence);
// };

// // ==================== MAIN COMPONENT ====================

// export function Reconciliation() {
//   // Account states
//   const [selectedAccountType, setSelectedAccountType] = useState<AccountType>(
//     AccountType.Bank
//   );
//   const [selectedAccountId, setSelectedAccountId] = useState<string>("");
//   const [accounts, setAccounts] = useState<AccountReconciliationSummaryDto[]>(
//     []
//   );

//   // Transaction states
//   const [transactions, setTransactions] = useState<
//     TransactionReconciliationDto[]
//   >([]);
//   const [totalTransactions, setTotalTransactions] = useState(0);
//   const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(
//     new Set()
//   );

//   // Statement states (NEW)
//   const [statementEntries, setStatementEntries] = useState<StatementEntry[]>(
//     []
//   );
//   const [matchSuggestions, setMatchSuggestions] = useState<MatchSuggestion[]>(
//     []
//   );
//   const [showStatementUpload, setShowStatementUpload] = useState(false);

//   // Balance summary
//   const [balanceSummary, setBalanceSummary] =
//     useState<AccountReconciliationBalanceDto>({
//       expectedBalance: 0,
//       actualBalance: 0,
//       variance: 0,
//       pendingCount: 0,
//       matchedCount: 0,
//       unmatchedCount: 0,
//       pendingAmount: 0,
//       matchedAmount: 0,
//       unmatchedAmount: 0,
//     });

//   // Reconciliation history
//   const [reconciliationHistory, setReconciliationHistory] = useState<
//     ReconciliationResponseDto[]
//   >([]);

//   // UI states
//   const [isLoading, setIsLoading] = useState(false);
//   const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState<
//     "all" | "pending" | "matched" | "unmatched"
//   >("all");
//   const [dateFrom, setDateFrom] = useState("");
//   const [dateTo, setDateTo] = useState("");
//   const [actualBalanceInput, setActualBalanceInput] = useState<number>(0);
//   const [viewMode, setViewMode] = useState<ViewMode>("table");
//   const [showFilters, setShowFilters] = useState(false);
//   const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
//   const [showInsights, setShowInsights] = useState(true);
//   const [varianceThreshold, setVarianceThreshold] = useState<number>(1000);

//   // Modal states
//   const [showReconcileModal, setShowReconcileModal] = useState(false);
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [showBulkModal, setShowBulkModal] = useState(false);
//   const [showCompleteModal, setShowCompleteModal] = useState(false);
//   const [showHistoryModal, setShowHistoryModal] = useState(false);
//   const [showMatchModal, setShowMatchModal] = useState(false);
//   const [selectedTransaction, setSelectedTransaction] =
//     useState<TransactionReconciliationDto | null>(null);
//   const [selectedStatementEntry, setSelectedStatementEntry] =
//     useState<StatementEntry | null>(null);

//   // Form states
//   const [reconcileForm, setReconcileForm] = useState({
//     actualAmount: 0,
//     status: ReconciliationStatus.Matched,
//     notes: "",
//   });

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(20);

//   // Refs
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // ==================== KEYBOARD SHORTCUTS ====================

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       // Only if not in input
//       if (
//         e.target instanceof HTMLInputElement ||
//         e.target instanceof HTMLTextAreaElement
//       ) {
//         return;
//       }

//       if (e.key === "?" && e.shiftKey) {
//         e.preventDefault();
//         setShowKeyboardShortcuts(true);
//       } else if (e.key === "r" && !e.metaKey && !e.ctrlKey) {
//         e.preventDefault();
//         handleRefresh();
//       } else if (e.key === "u" && !e.metaKey && !e.ctrlKey) {
//         e.preventDefault();
//         setShowStatementUpload(true);
//       } else if (e.key === "a" && !e.metaKey && !e.ctrlKey) {
//         e.preventDefault();
//         handleAutoReconcile();
//       } else if (e.key === "Escape") {
//         setShowReconcileModal(false);
//         setShowDetailModal(false);
//         setShowBulkModal(false);
//         setShowCompleteModal(false);
//         setShowHistoryModal(false);
//         setShowMatchModal(false);
//         setShowStatementUpload(false);
//         setShowKeyboardShortcuts(false);
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, []);

//   // ==================== API CALLS ====================

//   const fetchAccounts = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const response = await getReconciliationAccounts();
//       if (response.success && response.data) {
//         setAccounts(response.data);

//         const typeAccounts = response.data.filter(
//           (a) => a.accountType === selectedAccountType
//         );
//         if (typeAccounts.length > 0 && !selectedAccountId) {
//           setSelectedAccountId(typeAccounts[0].id);
//         }
//       } else {
//         toast.error(response.message || "Failed to load accounts");
//       }
//     } catch (error) {
//       console.error("Error fetching accounts:", error);
//       toast.error("Failed to load accounts");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [selectedAccountType, selectedAccountId]);

//   const fetchTransactions = useCallback(async () => {
//     if (!selectedAccountId) return;

//     setIsLoadingTransactions(true);
//     try {
//       const filter: ReconciliationFilterDto = {};
//       if (statusFilter === "pending")
//         filter.status = ReconciliationStatus.Pending;
//       if (statusFilter === "matched")
//         filter.status = ReconciliationStatus.Matched;
//       if (statusFilter === "unmatched")
//         filter.status = ReconciliationStatus.Unmatched;
//       if (dateFrom) filter.startDate = dateFrom;
//       if (dateTo) filter.endDate = dateTo;

//       const response = await getAccountTransactionsForReconciliation(
//         selectedAccountType,
//         selectedAccountId,
//         filter,
//         currentPage,
//         itemsPerPage
//       );

//       if (response.success && response.data) {
//         setTransactions(response.data.items);
//         setTotalTransactions(response.data.totalCount);

//         // Generate match suggestions if we have statement entries
//         if (statementEntries.length > 0) {
//           generateMatchSuggestions(response.data.items);
//         }
//       } else {
//         toast.error(response.message || "Failed to load transactions");
//       }
//     } catch (error) {
//       console.error("Error fetching transactions:", error);
//       toast.error("Failed to load transactions");
//     } finally {
//       setIsLoadingTransactions(false);
//     }
//   }, [
//     selectedAccountId,
//     selectedAccountType,
//     statusFilter,
//     dateFrom,
//     dateTo,
//     currentPage,
//     itemsPerPage,
//     statementEntries,
//   ]);

//   const fetchBalanceSummary = useCallback(async () => {
//     if (!selectedAccountId) return;

//     try {
//       const response = await getAccountReconciliationSummary(
//         selectedAccountType,
//         selectedAccountId
//       );

//       if (response.success && response.data) {
//         setBalanceSummary(response.data);
//         if (actualBalanceInput === 0) {
//           setActualBalanceInput(response.data.actualBalance);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching balance summary:", error);
//     }
//   }, [selectedAccountId, selectedAccountType]);

//   const fetchReconciliationHistoryData = useCallback(async () => {
//     try {
//       const response = await getReconciliationHistory(selectedAccountType);
//       if (response.success && response.data) {
//         setReconciliationHistory(response.data.items);
//       }
//     } catch (error) {
//       console.error("Error fetching reconciliation history:", error);
//     }
//   }, [selectedAccountType]);

//   // ==================== EFFECTS ====================

//   useEffect(() => {
//     fetchAccounts();
//   }, [fetchAccounts]);

//   useEffect(() => {
//     if (selectedAccountId) {
//       fetchTransactions();
//       fetchBalanceSummary();
//       fetchReconciliationHistoryData();
//     }
//   }, [
//     selectedAccountId,
//     fetchTransactions,
//     fetchBalanceSummary,
//     fetchReconciliationHistoryData,
//   ]);

//   useEffect(() => {
//     setSelectedAccountId("");
//     setTransactions([]);
//     setSelectedTransactions(new Set());
//     setActualBalanceInput(0);
//     setStatementEntries([]);
//     setMatchSuggestions([]);
//   }, [selectedAccountType]);

//   // ==================== STATEMENT HANDLING ====================

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     if (!file.name.endsWith(".csv")) {
//       toast.error("Please upload a CSV file");
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const content = e.target?.result as string;
//       const entries = parseCSVStatement(content);

//       if (entries.length === 0) {
//         toast.error(
//           "Could not parse any entries from the file. Please check the format."
//         );
//         return;
//       }

//       setStatementEntries(entries);
//       generateMatchSuggestions(transactions, entries);
//       setShowStatementUpload(false);
//       toast.success(`✓ Loaded ${entries.length} statement entries`);
//     };
//     reader.readAsText(file);

//     // Reset input
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const generateMatchSuggestions = (
//     txns: TransactionReconciliationDto[] = transactions,
//     entries: StatementEntry[] = statementEntries
//   ) => {
//     const suggestions: MatchSuggestion[] = [];
//     const unmatchedEntries = entries.filter((e) => !e.matched);
//     const pendingTxns = txns.filter(
//       (t) => t.reconciliationStatus === ReconciliationStatus.Pending
//     );

//     for (const txn of pendingTxns) {
//       for (const entry of unmatchedEntries) {
//         const confidence = calculateMatchConfidence(txn, entry);
//         if (confidence >= 50) {
//           let matchType: MatchSuggestion["matchType"] = "partial";
//           if (confidence >= 90) matchType = "exact";
//           else if (txn.amount === entry.amount) matchType = "amount";
//           else if (
//             new Date(txn.transactionDate).toDateString() ===
//             new Date(entry.date).toDateString()
//           )
//             matchType = "date";

//           suggestions.push({
//             transactionId: txn.id,
//             statementEntryId: entry.id,
//             confidence,
//             matchType,
//             transaction: txn,
//             statementEntry: entry,
//           });
//         }
//       }
//     }

//     // Sort by confidence descending
//     suggestions.sort((a, b) => b.confidence - a.confidence);

//     // Keep only the best match for each transaction
//     const bestMatches: MatchSuggestion[] = [];
//     const usedTxns = new Set<string>();
//     const usedEntries = new Set<string>();

//     for (const suggestion of suggestions) {
//       if (
//         !usedTxns.has(suggestion.transactionId) &&
//         !usedEntries.has(suggestion.statementEntryId)
//       ) {
//         bestMatches.push(suggestion);
//         usedTxns.add(suggestion.transactionId);
//         usedEntries.add(suggestion.statementEntryId);
//       }
//     }

//     setMatchSuggestions(bestMatches);
//   };

//   const handleAcceptMatch = async (suggestion: MatchSuggestion) => {
//     setIsSubmitting(true);
//     try {
//       const dto: ReconcileTransactionDto = {
//         actualAmount: suggestion.statementEntry.amount,
//         status: ReconciliationStatus.Matched,
//         notes: `Matched with statement entry: ${suggestion.statementEntry.description} (${suggestion.confidence}% confidence)`,
//       };

//       const response = await reconcileTransaction(
//         suggestion.transactionId,
//         dto
//       );

//       if (response.success) {
//         // Mark statement entry as matched
//         setStatementEntries((prev) =>
//           prev.map((e) =>
//             e.id === suggestion.statementEntryId
//               ? {
//                   ...e,
//                   matched: true,
//                   matchedTransactionId: suggestion.transactionId,
//                 }
//               : e
//           )
//         );

//         // Remove from suggestions
//         setMatchSuggestions((prev) =>
//           prev.filter((s) => s.transactionId !== suggestion.transactionId)
//         );

//         toast.success(`✓ Matched with ${suggestion.confidence}% confidence`);
//         await Promise.all([
//           fetchTransactions(),
//           fetchBalanceSummary(),
//           fetchAccounts(),
//         ]);
//       } else {
//         toast.error(response.message || "Failed to match");
//       }
//     } catch (error) {
//       console.error("Error matching:", error);
//       toast.error("Failed to match transaction");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleAcceptAllSuggestions = async () => {
//     const highConfidence = matchSuggestions.filter((s) => s.confidence >= 80);
//     if (highConfidence.length === 0) {
//       toast.info("No high-confidence matches to accept");
//       return;
//     }

//     setIsSubmitting(true);
//     let successCount = 0;

//     for (const suggestion of highConfidence) {
//       try {
//         const dto: ReconcileTransactionDto = {
//           actualAmount: suggestion.statementEntry.amount,
//           status: ReconciliationStatus.Matched,
//           notes: `Auto-matched: ${suggestion.statementEntry.description} (${suggestion.confidence}% confidence)`,
//         };

//         const response = await reconcileTransaction(
//           suggestion.transactionId,
//           dto
//         );
//         if (response.success) {
//           successCount++;
//           setStatementEntries((prev) =>
//             prev.map((e) =>
//               e.id === suggestion.statementEntryId
//                 ? {
//                     ...e,
//                     matched: true,
//                     matchedTransactionId: suggestion.transactionId,
//                   }
//                 : e
//             )
//           );
//         }
//       } catch (error) {
//         console.error("Error auto-matching:", error);
//       }
//     }

//     setMatchSuggestions((prev) => prev.filter((s) => s.confidence < 80));
//     await Promise.all([
//       fetchTransactions(),
//       fetchBalanceSummary(),
//       fetchAccounts(),
//     ]);
//     toast.success(`✓ Auto-matched ${successCount} transactions`);
//     setIsSubmitting(false);
//   };

//   // ==================== HANDLERS ====================

//   const handleSelectTransaction = (id: string) => {
//     setSelectedTransactions((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(id)) {
//         newSet.delete(id);
//       } else {
//         newSet.add(id);
//       }
//       return newSet;
//     });
//   };

//   const handleSelectAll = () => {
//     const pendingTransactions = filteredTransactions.filter(
//       (t) => t.reconciliationStatus === ReconciliationStatus.Pending
//     );
//     if (selectedTransactions.size === pendingTransactions.length) {
//       setSelectedTransactions(new Set());
//     } else {
//       setSelectedTransactions(new Set(pendingTransactions.map((t) => t.id)));
//     }
//   };

//   const handleReconcileTransaction = async () => {
//     if (!selectedTransaction) return;

//     setIsSubmitting(true);
//     try {
//       const dto: ReconcileTransactionDto = {
//         actualAmount: reconcileForm.actualAmount,
//         status: reconcileForm.status,
//         notes: reconcileForm.notes || undefined,
//       };

//       const response = await reconcileTransaction(selectedTransaction.id, dto);

//       if (response.success) {
//         toast.success(
//           reconcileForm.status === ReconciliationStatus.Matched
//             ? "✓ Transaction matched successfully"
//             : "⚠ Transaction marked as unmatched"
//         );

//         setShowReconcileModal(false);
//         setSelectedTransaction(null);
//         setReconcileForm({
//           actualAmount: 0,
//           status: ReconciliationStatus.Matched,
//           notes: "",
//         });

//         await Promise.all([
//           fetchTransactions(),
//           fetchBalanceSummary(),
//           fetchAccounts(),
//         ]);
//       } else {
//         toast.error(response.message || "Failed to reconcile transaction");
//       }
//     } catch (error) {
//       console.error("Error reconciling transaction:", error);
//       toast.error("Failed to reconcile transaction");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleQuickMatch = async (
//     transaction: TransactionReconciliationDto
//   ) => {
//     setIsSubmitting(true);
//     try {
//       const dto: ReconcileTransactionDto = {
//         actualAmount: transaction.amount,
//         status: ReconciliationStatus.Matched,
//         notes: "Quick matched - amounts equal",
//       };

//       const response = await reconcileTransaction(transaction.id, dto);

//       if (response.success) {
//         toast.success("✓ Transaction matched");
//         await Promise.all([
//           fetchTransactions(),
//           fetchBalanceSummary(),
//           fetchAccounts(),
//         ]);
//       } else {
//         toast.error(response.message || "Failed to match transaction");
//       }
//     } catch (error) {
//       console.error("Error matching transaction:", error);
//       toast.error("Failed to match transaction");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleBulkReconcile = async (status: ReconciliationStatus) => {
//     if (selectedTransactions.size === 0) {
//       toast.error("Please select transactions to reconcile");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const dto: BulkReconcileDto = {
//         transactionIds: Array.from(selectedTransactions),
//         status,
//         notes: `Bulk reconciled as ${
//           status === ReconciliationStatus.Matched ? "Matched" : "Unmatched"
//         }`,
//       };

//       const response = await bulkReconcileTransactions(dto);

//       if (response.success) {
//         toast.success(
//           `✓ ${response.data} transactions ${
//             status === ReconciliationStatus.Matched
//               ? "matched"
//               : "marked as unmatched"
//           }`
//         );

//         setSelectedTransactions(new Set());
//         setShowBulkModal(false);

//         await Promise.all([
//           fetchTransactions(),
//           fetchBalanceSummary(),
//           fetchAccounts(),
//         ]);
//       } else {
//         toast.error(
//           response.message || "Failed to bulk reconcile transactions"
//         );
//       }
//     } catch (error) {
//       console.error("Error bulk reconciling:", error);
//       toast.error("Failed to bulk reconcile transactions");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleAutoReconcile = async () => {
//     const pendingTransactions = transactions.filter(
//       (t) => t.reconciliationStatus === ReconciliationStatus.Pending
//     );

//     if (pendingTransactions.length === 0) {
//       toast.info("No pending transactions to reconcile");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const dto: BulkReconcileDto = {
//         transactionIds: pendingTransactions.map((t) => t.id),
//         status: ReconciliationStatus.Matched,
//         notes: "Auto reconciled - all pending transactions",
//       };

//       const response = await bulkReconcileTransactions(dto);

//       if (response.success) {
//         toast.success(`✓ ${response.data} transactions auto-reconciled`);
//         await Promise.all([
//           fetchTransactions(),
//           fetchBalanceSummary(),
//           fetchAccounts(),
//         ]);
//       } else {
//         toast.error(response.message || "Failed to auto-reconcile");
//       }
//     } catch (error) {
//       console.error("Error auto reconciling:", error);
//       toast.error("Failed to auto-reconcile transactions");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCompleteReconciliation = async () => {
//     if (balanceSummary.pendingCount > 0) {
//       toast.error(
//         `❌ Cannot complete reconciliation. ${balanceSummary.pendingCount} transactions are still pending.`
//       );
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const dto: CreateReconciliationDto = {
//         accountType: selectedAccountType,
//         accountId: selectedAccountId,
//         actualBalance: actualBalanceInput,
//         notes:
//           balanceSummary.unmatchedCount > 0
//             ? `Completed with ${balanceSummary.unmatchedCount} unmatched transactions`
//             : "All transactions matched",
//       };

//       const response = await createReconciliationRecord(dto);

//       if (response.success) {
//         if (balanceSummary.unmatchedCount > 0) {
//           toast.warning(
//             `⚠ Reconciliation completed with ${balanceSummary.unmatchedCount} unmatched transactions.`
//           );
//         } else {
//           toast.success(
//             "✓ Reconciliation completed successfully! All transactions matched."
//           );
//         }
//         setShowCompleteModal(false);
//         await fetchReconciliationHistoryData();
//       } else {
//         toast.error(response.message || "Failed to complete reconciliation");
//       }
//     } catch (error) {
//       console.error("Error completing reconciliation:", error);
//       toast.error("Failed to complete reconciliation");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleExportReport = () => {
//     const selectedAccount = accounts.find((a) => a.id === selectedAccountId);
//     const csvData = [
//       [
//         "Code",
//         "Reference",
//         "Date",
//         "Description",
//         "Type",
//         "Expected Amount",
//         "Actual Amount",
//         "Variance",
//         "Status",
//         "Reconciled At",
//         "Notes",
//       ],
//       ...filteredTransactions.map((txn) => [
//         txn.code,
//         txn.reference,
//         new Date(txn.transactionDate).toLocaleDateString(),
//         txn.description,
//         txn.transactionType === TransactionType.Debit ? "DEBIT" : "CREDIT",
//         txn.amount.toFixed(2),
//         txn.actualAmount?.toFixed(2) || "-",
//         txn.variance?.toFixed(2) || "-",
//         getReconciliationStatusLabel(txn.reconciliationStatus),
//         txn.reconciledAt ? new Date(txn.reconciledAt).toLocaleString() : "-",
//         txn.reconciliationNotes || "",
//       ]),
//     ];

//     const csv = csvData
//       .map((row) => row.map((cell) => `"${cell}"`).join(","))
//       .join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     const accountName = selectedAccount?.name || "account";
//     a.download = `reconciliation-${accountName.replace(/\s+/g, "-")}-${
//       new Date().toISOString().split("T")[0]
//     }.csv`;
//     a.click();
//     window.URL.revokeObjectURL(url);
//     toast.success("✓ Reconciliation report exported");
//   };

//   const handleRefresh = async () => {
//     setIsLoading(true);
//     await Promise.all([
//       fetchAccounts(),
//       fetchTransactions(),
//       fetchBalanceSummary(),
//       fetchReconciliationHistoryData(),
//     ]);
//     setIsLoading(false);
//     toast.success("Data refreshed!");
//   };

//   const clearFilters = () => {
//     setSearchTerm("");
//     setStatusFilter("all");
//     setDateFrom("");
//     setDateTo("");
//     setCurrentPage(1);
//   };

//   // ==================== FILTERING ====================

//   const filteredAccounts = accounts.filter(
//     (a) => a.accountType === selectedAccountType
//   );

//   const filteredTransactions = transactions.filter((txn) => {
//     const matchesSearch =
//       txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       txn.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       txn.code.toLowerCase().includes(searchTerm.toLowerCase());

//     return matchesSearch;
//   });

//   // Pagination
//   const totalPages = Math.ceil(totalTransactions / itemsPerPage);

//   // Get selected account
//   const selectedAccount = accounts.find((a) => a.id === selectedAccountId);

//   // Calculate variance
//   const currentVariance = actualBalanceInput - (selectedAccount?.balance || 0);
//   const isBalanced = Math.abs(currentVariance) < 0.01;
//   const hasLargeVariance = Math.abs(currentVariance) > varianceThreshold;

//   // Stats
//   const matchRate =
//     totalTransactions > 0
//       ? Math.round((balanceSummary.matchedCount / totalTransactions) * 100)
//       : 0;
//   const unmatchedStatementEntries = statementEntries.filter((e) => !e.matched);
//   const highConfidenceMatches = matchSuggestions.filter(
//     (s) => s.confidence >= 80
//   );

//   // ==================== STATUS BADGE COMPONENT ====================

//   const StatusBadge = ({ status }: { status: ReconciliationStatus }) => {
//     if (status === ReconciliationStatus.Matched) {
//       return (
//         <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 border-l-4 border-emerald-500 text-xs font-bold uppercase tracking-wide">
//           <CheckCircle2 className="w-3.5 h-3.5" />
//           Matched
//         </span>
//       );
//     } else if (status === ReconciliationStatus.Unmatched) {
//       return (
//         <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 border-l-4 border-red-500 text-xs font-bold uppercase tracking-wide">
//           <AlertTriangle className="w-3.5 h-3.5" />
//           Unmatched
//         </span>
//       );
//     } else {
//       return (
//         <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 border-l-4 border-amber-500 text-xs font-bold uppercase tracking-wide">
//           <Clock className="w-3.5 h-3.5" />
//           Pending
//         </span>
//       );
//     }
//   };

//   const ConfidenceBadge = ({ confidence }: { confidence: number }) => {
//     const color =
//       confidence >= 90 ? "emerald" : confidence >= 70 ? "amber" : "orange";
//     return (
//       <span
//         className={`inline-flex items-center gap-1 px-2 py-1 bg-${color}-100 text-${color}-700 text-xs font-bold rounded-full`}
//       >
//         <Sparkles className="w-3 h-3" />
//         {confidence}%
//       </span>
//     );
//   };

//   // ==================== LOADING STATE ====================

//   if (isLoading && accounts.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6 flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
//           <p className="text-slate-600 font-medium">
//             Loading reconciliation data...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // ==================== MAIN RENDER ====================

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-4 lg:p-6">
//       <div className="max-w-[1920px] mx-auto space-y-6">
//         {/* ==================== HEADER ==================== */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
//         >
//           <div>
//             <div className="flex items-center gap-3 mb-2">
//               <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 flex items-center justify-center shadow-xl shadow-blue-500/30">
//                 <Scale className="w-7 h-7 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
//                   Account Reconciliation
//                 </h1>
//                 <p className="text-slate-600 font-medium flex items-center gap-2">
//                   Match and verify transactions with statements
//                   <button
//                     onClick={() => setShowKeyboardShortcuts(true)}
//                     className="p-1 hover:bg-slate-200 rounded transition-colors"
//                     title="Keyboard shortcuts (Shift + ?)"
//                   >
//                     <Keyboard className="w-4 h-4 text-slate-400" />
//                   </button>
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-2 lg:gap-3">
//             {/* Upload Statement Button */}
//             <button
//               onClick={() => setShowStatementUpload(true)}
//               className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg shadow-purple-500/30 hover:shadow-xl transition-all"
//             >
//               <Upload className="w-4 h-4" />
//               <span className="hidden sm:inline">Upload Statement</span>
//               <span className="sm:hidden">Upload</span>
//             </button>

//             <button
//               onClick={() => setShowHistoryModal(true)}
//               className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-200 text-slate-700 font-bold shadow-md hover:shadow-lg hover:border-slate-300 transition-all"
//             >
//               <FileText className="w-4 h-4" />
//               <span className="hidden sm:inline">History</span>
//             </button>

//             <button
//               onClick={handleRefresh}
//               disabled={isLoading}
//               className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-blue-200 text-blue-600 font-bold shadow-md hover:shadow-lg hover:border-blue-300 transition-all disabled:opacity-50"
//             >
//               {isLoading ? (
//                 <Loader2 className="w-4 h-4 animate-spin" />
//               ) : (
//                 <RefreshCw className="w-4 h-4" />
//               )}
//               <span className="hidden sm:inline">Refresh</span>
//             </button>

//             <button
//               onClick={handleExportReport}
//               disabled={transactions.length === 0}
//               className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 hover:shadow-xl transition-all disabled:opacity-50"
//             >
//               <Download className="w-4 h-4" />
//               <span className="hidden sm:inline">Export</span>
//             </button>
//           </div>
//         </motion.div>

//         {/* ==================== ACCOUNT TYPE TABS ==================== */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="flex flex-wrap gap-2 lg:gap-3"
//         >
//           {[
//             {
//               type: AccountType.Bank,
//               label: "Bank Accounts",
//               icon: Building2,
//               gradient: "from-blue-600 to-cyan-600",
//             },
//             {
//               type: AccountType.Mpesa,
//               label: "M-Pesa",
//               icon: Smartphone,
//               gradient: "from-emerald-600 to-teal-600",
//             },
//             {
//               type: AccountType.Cash,
//               label: "Cash",
//               icon: Wallet,
//               gradient: "from-purple-600 to-pink-600",
//             },
//           ].map(({ type, label, icon: Icon, gradient }) => {
//             const typeAccounts = accounts.filter((a) => a.accountType === type);
//             const pendingCount = typeAccounts.reduce(
//               (sum, a) => sum + a.pendingCount,
//               0
//             );
//             const isSelected = selectedAccountType === type;

//             return (
//               <button
//                 key={type}
//                 onClick={() => setSelectedAccountType(type)}
//                 className={`relative flex items-center gap-2 lg:gap-3 px-4 lg:px-6 py-3 lg:py-4 font-semibold transition-all duration-300 ${
//                   isSelected
//                     ? `bg-gradient-to-r ${gradient} text-white shadow-lg`
//                     : "bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300"
//                 }`}
//               >
//                 <Icon className="w-5 h-5" />
//                 <span className="hidden sm:inline">{label}</span>
//                 <span
//                   className={`px-2 py-0.5 text-xs font-bold rounded-full ${
//                     isSelected ? "bg-white/20" : "bg-slate-100"
//                   }`}
//                 >
//                   {typeAccounts.length}
//                 </span>
//                 {pendingCount > 0 && (
//                   <span className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
//                     {pendingCount > 99 ? "99+" : pendingCount}
//                   </span>
//                 )}
//               </button>
//             );
//           })}
//         </motion.div>

//         {/* ==================== INSIGHTS PANEL (Collapsible) ==================== */}
//         {selectedAccount && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.15 }}
//           >
//             <button
//               onClick={() => setShowInsights(!showInsights)}
//               className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors mb-3"
//             >
//               {showInsights ? (
//                 <ChevronUp className="w-4 h-4" />
//               ) : (
//                 <ChevronDown className="w-4 h-4" />
//               )}
//               <BarChart3 className="w-4 h-4" />
//               Reconciliation Insights
//             </button>

//             <AnimatePresence>
//               {showInsights && (
//                 <motion.div
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: "auto" }}
//                   exit={{ opacity: 0, height: 0 }}
//                   className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3"
//                 >
//                   {/* Match Rate */}
//                   <div className="bg-white border-2 border-slate-200 p-4 hover:border-blue-300 hover:shadow-lg transition-all">
//                     <div className="flex items-center justify-between mb-2">
//                       <Percent className="w-5 h-5 text-blue-600" />
//                       <span
//                         className={`text-xs font-bold px-2 py-0.5 rounded-full ${
//                           matchRate >= 90
//                             ? "bg-emerald-100 text-emerald-700"
//                             : matchRate >= 70
//                             ? "bg-amber-100 text-amber-700"
//                             : "bg-red-100 text-red-700"
//                         }`}
//                       >
//                         {matchRate >= 90
//                           ? "Excellent"
//                           : matchRate >= 70
//                           ? "Good"
//                           : "Needs Work"}
//                       </span>
//                     </div>
//                     <p className="text-2xl font-black text-slate-900">
//                       {matchRate}%
//                     </p>
//                     <p className="text-xs text-slate-500 font-medium">
//                       Match Rate
//                     </p>
//                   </div>

//                   {/* Pending */}
//                   <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 p-4 hover:shadow-lg transition-all">
//                     <div className="flex items-center justify-between mb-2">
//                       <Clock className="w-5 h-5 text-amber-600" />
//                     </div>
//                     <p className="text-2xl font-black text-amber-700">
//                       {balanceSummary.pendingCount}
//                     </p>
//                     <p className="text-xs text-amber-600 font-medium">
//                       Pending
//                     </p>
//                   </div>

//                   {/* Matched */}
//                   <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 p-4 hover:shadow-lg transition-all">
//                     <div className="flex items-center justify-between mb-2">
//                       <CheckCircle2 className="w-5 h-5 text-emerald-600" />
//                     </div>
//                     <p className="text-2xl font-black text-emerald-700">
//                       {balanceSummary.matchedCount}
//                     </p>
//                     <p className="text-xs text-emerald-600 font-medium">
//                       Matched
//                     </p>
//                   </div>

//                   {/* Unmatched */}
//                   <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 p-4 hover:shadow-lg transition-all">
//                     <div className="flex items-center justify-between mb-2">
//                       <AlertTriangle className="w-5 h-5 text-red-600" />
//                     </div>
//                     <p className="text-2xl font-black text-red-700">
//                       {balanceSummary.unmatchedCount}
//                     </p>
//                     <p className="text-xs text-red-600 font-medium">
//                       Unmatched
//                     </p>
//                   </div>

//                   {/* Statement Entries */}
//                   <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 p-4 hover:shadow-lg transition-all">
//                     <div className="flex items-center justify-between mb-2">
//                       <FileSpreadsheet className="w-5 h-5 text-purple-600" />
//                     </div>
//                     <p className="text-2xl font-black text-purple-700">
//                       {statementEntries.length}
//                     </p>
//                     <p className="text-xs text-purple-600 font-medium">
//                       Statement Entries
//                     </p>
//                   </div>

//                   {/* Suggestions */}
//                   <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 p-4 hover:shadow-lg transition-all">
//                     <div className="flex items-center justify-between mb-2">
//                       <Sparkles className="w-5 h-5 text-blue-600" />
//                     </div>
//                     <p className="text-2xl font-black text-blue-700">
//                       {matchSuggestions.length}
//                     </p>
//                     <p className="text-xs text-blue-600 font-medium">
//                       Match Suggestions
//                     </p>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.div>
//         )}

//         {/* ==================== ACCOUNT SELECTOR & BALANCE CARDS ==================== */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="bg-white border-2 border-slate-200 p-4 lg:p-6 shadow-lg"
//         >
//           <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
//             {/* Account Selector */}
//             <div className="lg:col-span-2">
//               <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-2">
//                 <Target className="w-4 h-4 text-blue-600" />
//                 Select Account to Reconcile
//               </label>
//               <select
//                 value={selectedAccountId}
//                 onChange={(e) => {
//                   setSelectedAccountId(e.target.value);
//                   setActualBalanceInput(0);
//                   setSelectedTransactions(new Set());
//                 }}
//                 className="w-full px-4 py-3 border-2 border-slate-200 bg-white text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
//               >
//                 <option value="">-- Select an Account --</option>
//                 {filteredAccounts.map((acc) => (
//                   <option key={acc.id} value={acc.id}>
//                     {acc.name} • {getCurrencyLabel(acc.currency)} • Balance:{" "}
//                     {getCurrencySymbol(acc.currency)}
//                     {acc.balance.toLocaleString()} • Pending: {acc.pendingCount}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Balance Cards */}
//             {selectedAccount && (
//               <>
//                 {/* System Balance */}
//                 <div className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white p-4 shadow-lg">
//                   <div className="flex items-center gap-2 mb-2">
//                     <FileText className="w-4 h-4" />
//                     <span className="text-xs font-bold uppercase opacity-80">
//                       System
//                     </span>
//                   </div>
//                   <p className="text-xl lg:text-2xl font-black">
//                     {getCurrencySymbol(selectedAccount.currency)}
//                     {selectedAccount.balance.toLocaleString("en-US", {
//                       minimumFractionDigits: 2,
//                     })}
//                   </p>
//                 </div>

//                 {/* Actual Balance Input */}
//                 <div className="bg-purple-50 border-2 border-purple-200 p-4">
//                   <div className="flex items-center gap-2 mb-2">
//                     <DollarSign className="w-4 h-4 text-purple-600" />
//                     <span className="text-xs font-bold text-purple-700 uppercase">
//                       Statement
//                     </span>
//                   </div>
//                   <div className="relative">
//                     <span className="absolute left-0 top-1/2 -translate-y-1/2 text-sm font-bold text-purple-400">
//                       {getCurrencySymbol(selectedAccount.currency)}
//                     </span>
//                     <input
//                       type="number"
//                       value={actualBalanceInput || ""}
//                       onChange={(e) =>
//                         setActualBalanceInput(parseFloat(e.target.value) || 0)
//                       }
//                       placeholder="0.00"
//                       className="w-full pl-10 text-xl lg:text-2xl font-black text-purple-700 bg-transparent border-b-2 border-purple-300 focus:border-purple-600 outline-none transition-colors"
//                       step="0.01"
//                     />
//                   </div>
//                 </div>

//                 {/* Variance */}
//                 <div
//                   className={`p-4 border-2 ${
//                     isBalanced
//                       ? "bg-emerald-50 border-emerald-200"
//                       : hasLargeVariance
//                       ? "bg-red-50 border-red-300 animate-pulse"
//                       : "bg-amber-50 border-amber-200"
//                   }`}
//                 >
//                   <div className="flex items-center gap-2 mb-2">
//                     {isBalanced ? (
//                       <ShieldCheck className="w-4 h-4 text-emerald-600" />
//                     ) : (
//                       <AlertTriangle
//                         className={`w-4 h-4 ${
//                           hasLargeVariance ? "text-red-600" : "text-amber-600"
//                         }`}
//                       />
//                     )}
//                     <span
//                       className={`text-xs font-bold uppercase ${
//                         isBalanced
//                           ? "text-emerald-700"
//                           : hasLargeVariance
//                           ? "text-red-700"
//                           : "text-amber-700"
//                       }`}
//                     >
//                       {isBalanced ? "Balanced" : "Variance"}
//                     </span>
//                   </div>
//                   <p
//                     className={`text-xl lg:text-2xl font-black ${
//                       isBalanced
//                         ? "text-emerald-600"
//                         : hasLargeVariance
//                         ? "text-red-600"
//                         : "text-amber-600"
//                     }`}
//                   >
//                     {isBalanced
//                       ? "✓ OK"
//                       : `${currentVariance >= 0 ? "+" : ""}${getCurrencySymbol(
//                           selectedAccount.currency
//                         )}${currentVariance.toLocaleString()}`}
//                   </p>
//                 </div>
//               </>
//             )}
//           </div>
//         </motion.div>

//         {/* ==================== SMART MATCH SUGGESTIONS ==================== */}
//         {matchSuggestions.length > 0 && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 border-2 border-purple-200 p-4 lg:p-6 shadow-lg"
//           >
//             <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
//                   <Sparkles className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-bold text-slate-900">
//                     Smart Match Suggestions
//                   </h3>
//                   <p className="text-sm text-slate-600">
//                     {matchSuggestions.length} potential matches found •{" "}
//                     {highConfidenceMatches.length} high confidence
//                   </p>
//                 </div>
//               </div>
//               {highConfidenceMatches.length > 0 && (
//                 <button
//                   onClick={handleAcceptAllSuggestions}
//                   disabled={isSubmitting}
//                   className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
//                 >
//                   {isSubmitting ? (
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                   ) : (
//                     <Zap className="w-4 h-4" />
//                   )}
//                   Accept All High Confidence ({highConfidenceMatches.length})
//                 </button>
//               )}
//             </div>

//             <div className="space-y-3 max-h-80 overflow-y-auto">
//               {matchSuggestions.slice(0, 10).map((suggestion) => (
//                 <div
//                   key={`${suggestion.transactionId}-${suggestion.statementEntryId}`}
//                   className="bg-white border-2 border-purple-100 p-4 hover:border-purple-300 transition-all"
//                 >
//                   <div className="flex flex-col lg:flex-row lg:items-center gap-4">
//                     {/* System Transaction */}
//                     <div className="flex-1 bg-blue-50 p-3 border-l-4 border-blue-500">
//                       <p className="text-xs font-bold text-blue-700 uppercase mb-1">
//                         System Record
//                       </p>
//                       <p className="font-semibold text-slate-900 truncate">
//                         {suggestion.transaction.description}
//                       </p>
//                       <div className="flex items-center gap-4 mt-1 text-sm">
//                         <span className="font-bold text-blue-700">
//                           {getCurrencySymbol(suggestion.transaction.currency)}
//                           {suggestion.transaction.amount.toLocaleString()}
//                         </span>
//                         <span className="text-slate-500">
//                           {new Date(
//                             suggestion.transaction.transactionDate
//                           ).toLocaleDateString()}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Match Arrow */}
//                     <div className="flex items-center justify-center">
//                       <div
//                         className={`p-2 rounded-full ${
//                           suggestion.confidence >= 90
//                             ? "bg-emerald-100"
//                             : suggestion.confidence >= 70
//                             ? "bg-amber-100"
//                             : "bg-orange-100"
//                         }`}
//                       >
//                         <Link2
//                           className={`w-5 h-5 ${
//                             suggestion.confidence >= 90
//                               ? "text-emerald-600"
//                               : suggestion.confidence >= 70
//                               ? "text-amber-600"
//                               : "text-orange-600"
//                           }`}
//                         />
//                       </div>
//                     </div>

//                     {/* Statement Entry */}
//                     <div className="flex-1 bg-purple-50 p-3 border-l-4 border-purple-500">
//                       <p className="text-xs font-bold text-purple-700 uppercase mb-1">
//                         Statement Entry
//                       </p>
//                       <p className="font-semibold text-slate-900 truncate">
//                         {suggestion.statementEntry.description}
//                       </p>
//                       <div className="flex items-center gap-4 mt-1 text-sm">
//                         <span className="font-bold text-purple-700">
//                           {getCurrencySymbol(suggestion.transaction.currency)}
//                           {suggestion.statementEntry.amount.toLocaleString()}
//                         </span>
//                         <span className="text-slate-500">
//                           {new Date(
//                             suggestion.statementEntry.date
//                           ).toLocaleDateString()}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Confidence & Actions */}
//                     <div className="flex items-center gap-2">
//                       <div
//                         className={`text-center px-3 py-2 rounded ${
//                           suggestion.confidence >= 90
//                             ? "bg-emerald-100"
//                             : suggestion.confidence >= 70
//                             ? "bg-amber-100"
//                             : "bg-orange-100"
//                         }`}
//                       >
//                         <p
//                           className={`text-lg font-black ${
//                             suggestion.confidence >= 90
//                               ? "text-emerald-700"
//                               : suggestion.confidence >= 70
//                               ? "text-amber-700"
//                               : "text-orange-700"
//                           }`}
//                         >
//                           {suggestion.confidence}%
//                         </p>
//                         <p className="text-xs font-medium text-slate-600">
//                           confidence
//                         </p>
//                       </div>
//                       <button
//                         onClick={() => handleAcceptMatch(suggestion)}
//                         disabled={isSubmitting}
//                         className="p-3 bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
//                         title="Accept match"
//                       >
//                         <Check className="w-5 h-5" />
//                       </button>
//                       <button
//                         onClick={() => {
//                           setMatchSuggestions((prev) =>
//                             prev.filter(
//                               (s) =>
//                                 s.transactionId !== suggestion.transactionId ||
//                                 s.statementEntryId !==
//                                   suggestion.statementEntryId
//                             )
//                           );
//                         }}
//                         className="p-3 bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors"
//                         title="Dismiss"
//                       >
//                         <X className="w-5 h-5" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {matchSuggestions.length > 10 && (
//               <p className="text-center text-sm text-slate-500 mt-4">
//                 Showing 10 of {matchSuggestions.length} suggestions
//               </p>
//             )}
//           </motion.div>
//         )}

//         {/* ==================== FILTERS AND ACTIONS BAR ==================== */}
//         {selectedAccount && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="bg-white border-2 border-slate-200 p-4 lg:p-6 shadow-lg"
//           >
//             {/* Main Actions Row */}
//             <div className="flex flex-wrap items-center gap-3 mb-4">
//               {/* Search */}
//               <div className="flex-1 min-w-[200px] max-w-md">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
//                   <input
//                     type="text"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     placeholder="Search transactions..."
//                     className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all"
//                   />
//                 </div>
//               </div>

//               {/* View Mode Toggle */}
//               <div className="flex border-2 border-slate-200 bg-slate-50">
//                 <button
//                   onClick={() => setViewMode("table")}
//                   className={`p-2.5 transition-colors ${
//                     viewMode === "table"
//                       ? "bg-blue-600 text-white"
//                       : "text-slate-600 hover:bg-slate-100"
//                   }`}
//                   title="Table view"
//                 >
//                   <List className="w-4 h-4" />
//                 </button>
//                 <button
//                   onClick={() => setViewMode("split")}
//                   className={`p-2.5 transition-colors ${
//                     viewMode === "split"
//                       ? "bg-blue-600 text-white"
//                       : "text-slate-600 hover:bg-slate-100"
//                   }`}
//                   title="Split view"
//                 >
//                   <Columns className="w-4 h-4" />
//                 </button>
//               </div>

//               {/* Toggle Filters */}
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className={`flex items-center gap-2 px-4 py-2.5 border-2 font-semibold transition-all ${
//                   showFilters
//                     ? "bg-blue-50 border-blue-300 text-blue-700"
//                     : "border-slate-200 text-slate-600 hover:border-slate-300"
//                 }`}
//               >
//                 <Filter className="w-4 h-4" />
//                 Filters
//                 {(statusFilter !== "all" || dateFrom || dateTo) && (
//                   <span className="w-2 h-2 bg-blue-600 rounded-full" />
//                 )}
//               </button>

//               {/* Bulk Actions */}
//               <button
//                 onClick={() => setShowBulkModal(true)}
//                 disabled={selectedTransactions.size === 0}
//                 className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white font-semibold shadow-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <ListChecks className="w-4 h-4" />
//                 Bulk ({selectedTransactions.size})
//               </button>

//               {/* Auto Match */}
//               <button
//                 onClick={handleAutoReconcile}
//                 disabled={balanceSummary.pendingCount === 0 || isSubmitting}
//                 className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isSubmitting ? (
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                 ) : (
//                   <Zap className="w-4 h-4" />
//                 )}
//                 Auto Match All
//               </button>

//               {/* Complete */}
//               <button
//                 onClick={() => setShowCompleteModal(true)}
//                 disabled={
//                   balanceSummary.pendingCount > 0 || transactions.length === 0
//                 }
//                 className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <CheckCircle2 className="w-4 h-4" />
//                 Complete
//               </button>
//             </div>

//             {/* Collapsible Filters */}
//             <AnimatePresence>
//               {showFilters && (
//                 <motion.div
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: "auto" }}
//                   exit={{ opacity: 0, height: 0 }}
//                   className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t-2 border-slate-100"
//                 >
//                   {/* Status Filter */}
//                   <div>
//                     <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                       Status
//                     </label>
//                     <select
//                       value={statusFilter}
//                       onChange={(e) => {
//                         setStatusFilter(e.target.value as typeof statusFilter);
//                         setCurrentPage(1);
//                       }}
//                       className="w-full px-3 py-2.5 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all"
//                     >
//                       <option value="all">All Statuses</option>
//                       <option value="pending">Pending</option>
//                       <option value="matched">Matched</option>
//                       <option value="unmatched">Unmatched</option>
//                     </select>
//                   </div>

//                   {/* Date From */}
//                   <div>
//                     <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                       From Date
//                     </label>
//                     <input
//                       type="date"
//                       value={dateFrom}
//                       onChange={(e) => {
//                         setDateFrom(e.target.value);
//                         setCurrentPage(1);
//                       }}
//                       className="w-full px-3 py-2.5 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all"
//                     />
//                   </div>

//                   {/* Date To */}
//                   <div>
//                     <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                       To Date
//                     </label>
//                     <input
//                       type="date"
//                       value={dateTo}
//                       onChange={(e) => {
//                         setDateTo(e.target.value);
//                         setCurrentPage(1);
//                       }}
//                       className="w-full px-3 py-2.5 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all"
//                     />
//                   </div>

//                   {/* Clear Filters */}
//                   <div className="flex items-end">
//                     <button
//                       onClick={clearFilters}
//                       className="w-full px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
//                     >
//                       <RotateCcw className="w-4 h-4" />
//                       Clear Filters
//                     </button>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.div>
//         )}

//         {/* ==================== TRANSACTIONS TABLE ==================== */}
//         {selectedAccount && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//             className="bg-white/90 backdrop-blur-xl border-2 border-slate-200 shadow-2xl overflow-hidden"
//           >
//             {/* Table Header */}
//             <div className="p-4 lg:p-6 border-b-2 border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//               <div>
//                 <h3 className="text-lg lg:text-xl font-bold text-slate-900 flex items-center gap-2">
//                   <Banknote className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
//                   Transaction Details
//                 </h3>
//                 <p className="text-sm text-slate-600 mt-1">
//                   {totalTransactions} transactions • {selectedAccount.name}
//                 </p>
//               </div>
//               <div className="flex items-center gap-2 text-sm text-slate-600">
//                 Page {currentPage} of {totalPages || 1}
//               </div>
//             </div>

//             {/* Table Content */}
//             {isLoadingTransactions ? (
//               <div className="flex items-center justify-center py-20">
//                 <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
//                 <span className="ml-3 text-slate-600">
//                   Loading transactions...
//                 </span>
//               </div>
//             ) : filteredTransactions.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-20 text-slate-500">
//                 <FileText className="w-16 h-16 mb-4 text-slate-300" />
//                 <p className="text-lg font-medium">No transactions found</p>
//                 <p className="text-sm">Try adjusting your filters</p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-700 text-white">
//                     <tr>
//                       <th className="px-4 py-4 text-center w-12">
//                         <button
//                           onClick={handleSelectAll}
//                           className="p-1 hover:bg-white/20 transition rounded"
//                           title="Select all pending"
//                         >
//                           {selectedTransactions.size ===
//                             filteredTransactions.filter(
//                               (t) =>
//                                 t.reconciliationStatus ===
//                                 ReconciliationStatus.Pending
//                             ).length &&
//                           filteredTransactions.filter(
//                             (t) =>
//                               t.reconciliationStatus ===
//                               ReconciliationStatus.Pending
//                           ).length > 0 ? (
//                             <CheckSquare className="w-5 h-5" />
//                           ) : (
//                             <Square className="w-5 h-5 opacity-60" />
//                           )}
//                         </button>
//                       </th>
//                       <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">
//                         Date
//                       </th>
//                       <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">
//                         Reference
//                       </th>
//                       <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">
//                         Description
//                       </th>
//                       <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider">
//                         Type
//                       </th>
//                       <th className="px-4 py-4 text-right text-xs font-bold uppercase tracking-wider">
//                         Expected
//                       </th>
//                       <th className="px-4 py-4 text-right text-xs font-bold uppercase tracking-wider">
//                         Actual
//                       </th>
//                       <th className="px-4 py-4 text-right text-xs font-bold uppercase tracking-wider">
//                         Variance
//                       </th>
//                       <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider">
//                         Status
//                       </th>
//                       <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-200">
//                     {filteredTransactions.map((txn, index) => (
//                       <motion.tr
//                         key={txn.id}
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: index * 0.02 }}
//                         className={`hover:bg-blue-50/50 transition-colors ${
//                           selectedTransactions.has(txn.id) ? "bg-blue-50" : ""
//                         }`}
//                       >
//                         <td className="px-4 py-4 text-center">
//                           {txn.reconciliationStatus ===
//                             ReconciliationStatus.Pending && (
//                             <button
//                               onClick={() => handleSelectTransaction(txn.id)}
//                               className="p-1 hover:bg-slate-200 transition rounded"
//                             >
//                               {selectedTransactions.has(txn.id) ? (
//                                 <CheckSquare className="w-5 h-5 text-blue-600" />
//                               ) : (
//                                 <Square className="w-5 h-5 text-slate-400" />
//                               )}
//                             </button>
//                           )}
//                         </td>
//                         <td className="px-4 py-4 whitespace-nowrap">
//                           <div className="flex items-center gap-2">
//                             <Calendar className="w-4 h-4 text-slate-400" />
//                             <span className="text-sm font-medium text-slate-900">
//                               {new Date(txn.transactionDate).toLocaleDateString(
//                                 "en-US",
//                                 {
//                                   month: "short",
//                                   day: "numeric",
//                                 }
//                               )}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-4 py-4 whitespace-nowrap">
//                           <span className="text-sm font-mono text-blue-600 font-semibold">
//                             {txn.reference || txn.code}
//                           </span>
//                         </td>
//                         <td className="px-4 py-4">
//                           <span className="text-sm text-slate-900 font-medium line-clamp-1 max-w-xs">
//                             {txn.description}
//                           </span>
//                         </td>
//                         <td className="px-4 py-4 text-center">
//                           {txn.transactionType === TransactionType.Debit ? (
//                             <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold">
//                               <ArrowUpCircle className="w-3 h-3" />
//                               DR
//                             </span>
//                           ) : (
//                             <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-bold">
//                               <ArrowDownCircle className="w-3 h-3" />
//                               CR
//                             </span>
//                           )}
//                         </td>
//                         <td className="px-4 py-4 text-right whitespace-nowrap">
//                           <span className="text-sm font-bold text-slate-900">
//                             {getCurrencySymbol(txn.currency)}
//                             {txn.amount.toLocaleString("en-US", {
//                               minimumFractionDigits: 2,
//                             })}
//                           </span>
//                         </td>
//                         <td className="px-4 py-4 text-right whitespace-nowrap">
//                           {txn.actualAmount !== null ? (
//                             <span className="text-sm font-bold text-purple-700">
//                               {getCurrencySymbol(txn.currency)}
//                               {txn.actualAmount.toLocaleString("en-US", {
//                                 minimumFractionDigits: 2,
//                               })}
//                             </span>
//                           ) : (
//                             <span className="text-slate-400">-</span>
//                           )}
//                         </td>
//                         <td className="px-4 py-4 text-right whitespace-nowrap">
//                           {txn.variance !== null ? (
//                             Math.abs(txn.variance) < 0.01 ? (
//                               <span className="text-sm font-bold text-emerald-600">
//                                 ✓
//                               </span>
//                             ) : (
//                               <span className="text-sm font-bold text-red-600">
//                                 {txn.variance >= 0 ? "+" : ""}
//                                 {txn.variance.toLocaleString()}
//                               </span>
//                             )
//                           ) : (
//                             <span className="text-slate-400">-</span>
//                           )}
//                         </td>
//                         <td className="px-4 py-4 text-center">
//                           <StatusBadge status={txn.reconciliationStatus} />
//                         </td>
//                         <td className="px-4 py-4 text-center">
//                           <div className="flex items-center justify-center gap-1">
//                             <button
//                               onClick={() => {
//                                 setSelectedTransaction(txn);
//                                 setShowDetailModal(true);
//                               }}
//                               className="p-2 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all"
//                               title="View details"
//                             >
//                               <Eye className="w-4 h-4" />
//                             </button>

//                             {txn.reconciliationStatus ===
//                               ReconciliationStatus.Pending && (
//                               <>
//                                 <button
//                                   onClick={() => handleQuickMatch(txn)}
//                                   disabled={isSubmitting}
//                                   className="p-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-all disabled:opacity-50"
//                                   title="Quick match"
//                                 >
//                                   <Check className="w-4 h-4" />
//                                 </button>
//                                 <button
//                                   onClick={() => {
//                                     setSelectedTransaction(txn);
//                                     setReconcileForm({
//                                       actualAmount: txn.amount,
//                                       status: ReconciliationStatus.Matched,
//                                       notes: "",
//                                     });
//                                     setShowReconcileModal(true);
//                                   }}
//                                   className="p-2 bg-amber-100 text-amber-700 hover:bg-amber-200 transition-all"
//                                   title="Enter actual amount"
//                                 >
//                                   <AlertCircle className="w-4 h-4" />
//                                 </button>
//                               </>
//                             )}
//                           </div>
//                         </td>
//                       </motion.tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex items-center justify-between px-6 py-4 border-t-2 border-slate-200 bg-slate-50">
//                 <div className="text-sm text-slate-600 font-medium">
//                   Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
//                   {Math.min(currentPage * itemsPerPage, totalTransactions)} of{" "}
//                   {totalTransactions}
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                     disabled={currentPage === 1}
//                     className="p-2 border-2 border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronLeft className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={() =>
//                       setCurrentPage((p) => Math.min(totalPages, p + 1))
//                     }
//                     disabled={currentPage === totalPages}
//                     className="p-2 border-2 border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronRight className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </motion.div>
//         )}

//         {/* No Account Selected */}
//         {!selectedAccount && accounts.length > 0 && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-white border-2 border-slate-200 p-12 text-center shadow-lg"
//           >
//             <div className="w-20 h-20 bg-blue-100 flex items-center justify-center mx-auto mb-6">
//               <Target className="w-10 h-10 text-blue-600" />
//             </div>
//             <h3 className="text-xl font-bold text-slate-900 mb-2">
//               Select an Account to Reconcile
//             </h3>
//             <p className="text-slate-600 max-w-md mx-auto">
//               Choose an account from the dropdown above to view and reconcile
//               its transactions.
//             </p>
//           </motion.div>
//         )}
//       </div>

//       {/* ==================== MODALS ==================== */}

//       {/* Statement Upload Modal */}
//       <AnimatePresence>
//         {showStatementUpload && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowStatementUpload(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white shadow-2xl max-w-lg w-full overflow-hidden"
//             >
//               <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 bg-white/20 flex items-center justify-center">
//                       <Upload className="w-6 h-6" />
//                     </div>
//                     <div>
//                       <h3 className="text-xl font-bold">
//                         Upload Bank Statement
//                       </h3>
//                       <p className="text-purple-100 text-sm">
//                         CSV format supported
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => setShowStatementUpload(false)}
//                     className="p-2 hover:bg-white/20 transition-colors"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6 space-y-4">
//                 <div
//                   className="border-2 border-dashed border-purple-300 p-8 text-center bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer"
//                   onClick={() => fileInputRef.current?.click()}
//                 >
//                   <FileSpreadsheet className="w-12 h-12 text-purple-400 mx-auto mb-4" />
//                   <p className="text-slate-900 font-semibold mb-1">
//                     Drop your CSV file here
//                   </p>
//                   <p className="text-sm text-slate-500">or click to browse</p>
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept=".csv"
//                     onChange={handleFileUpload}
//                     className="hidden"
//                   />
//                 </div>

//                 <div className="bg-blue-50 border-2 border-blue-200 p-4">
//                   <p className="text-sm font-bold text-blue-800 mb-2">
//                     Supported CSV Format:
//                   </p>
//                   <ul className="text-xs text-blue-700 space-y-1">
//                     <li>
//                       • Columns: Date, Description, Debit, Credit (or Amount)
//                     </li>
//                     <li>• Optional: Reference, Balance</li>
//                     <li>• First row should be headers</li>
//                   </ul>
//                 </div>

//                 {statementEntries.length > 0 && (
//                   <div className="bg-emerald-50 border-2 border-emerald-200 p-4">
//                     <p className="text-sm font-bold text-emerald-800">
//                       ✓ {statementEntries.length} entries loaded •{" "}
//                       {unmatchedStatementEntries.length} unmatched
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Keyboard Shortcuts Modal */}
//       <AnimatePresence>
//         {showKeyboardShortcuts && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowKeyboardShortcuts(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white shadow-2xl max-w-md w-full overflow-hidden"
//             >
//               <div className="bg-slate-800 p-6 text-white">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <Keyboard className="w-6 h-6" />
//                     <h3 className="text-xl font-bold">Keyboard Shortcuts</h3>
//                   </div>
//                   <button
//                     onClick={() => setShowKeyboardShortcuts(false)}
//                     className="p-2 hover:bg-white/20"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//               <div className="p-6 space-y-3">
//                 {[
//                   { key: "R", action: "Refresh data" },
//                   { key: "U", action: "Upload statement" },
//                   { key: "A", action: "Auto-match all" },
//                   { key: "Esc", action: "Close modals" },
//                   { key: "Shift + ?", action: "Show shortcuts" },
//                 ].map(({ key, action }) => (
//                   <div
//                     key={key}
//                     className="flex items-center justify-between py-2 border-b border-slate-100"
//                   >
//                     <span className="text-slate-600">{action}</span>
//                     <kbd className="px-3 py-1 bg-slate-100 border border-slate-300 text-sm font-mono rounded">
//                       {key}
//                     </kbd>
//                   </div>
//                 ))}
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Reconcile Transaction Modal */}
//       <AnimatePresence>
//         {showReconcileModal && selectedTransaction && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowReconcileModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white shadow-2xl max-w-lg w-full overflow-hidden"
//             >
//               <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 p-6 text-white">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-white/20 flex items-center justify-center">
//                       <Scale className="w-5 h-5" />
//                     </div>
//                     <div>
//                       <h3 className="text-xl font-bold">
//                         Reconcile Transaction
//                       </h3>
//                       <p className="text-blue-100 text-sm">
//                         {selectedTransaction.code}
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => setShowReconcileModal(false)}
//                     className="p-2 hover:bg-white/20"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6 space-y-4">
//                 <div className="bg-slate-50 border-2 border-slate-200 p-4">
//                   <p className="text-xs font-bold text-slate-500 uppercase mb-1">
//                     Description
//                   </p>
//                   <p className="text-lg font-semibold text-slate-900">
//                     {selectedTransaction.description}
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-blue-50 border-2 border-blue-200 p-4">
//                     <p className="text-xs font-bold text-blue-700 uppercase mb-1">
//                       Expected
//                     </p>
//                     <p className="text-2xl font-bold text-blue-700">
//                       {getCurrencySymbol(selectedTransaction.currency)}
//                       {selectedTransaction.amount.toLocaleString()}
//                     </p>
//                   </div>
//                   <div className="bg-slate-50 border-2 border-slate-200 p-4">
//                     <p className="text-xs font-bold text-slate-500 uppercase mb-1">
//                       Date
//                     </p>
//                     <p className="text-lg font-semibold text-slate-900">
//                       {new Date(
//                         selectedTransaction.transactionDate
//                       ).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                     Actual Amount *
//                   </label>
//                   <input
//                     type="number"
//                     value={reconcileForm.actualAmount || ""}
//                     onChange={(e) =>
//                       setReconcileForm({
//                         ...reconcileForm,
//                         actualAmount: parseFloat(e.target.value) || 0,
//                       })
//                     }
//                     placeholder="Enter actual amount"
//                     step="0.01"
//                     className="w-full px-4 py-3 border-2 border-slate-300 focus:border-blue-500 focus:outline-none text-lg font-bold transition-all"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                     Status *
//                   </label>
//                   <div className="flex gap-4">
//                     <label className="flex items-center gap-2 cursor-pointer p-3 border-2 rounded transition-all flex-1 justify-center hover:bg-emerald-50 hover:border-emerald-300">
//                       <input
//                         type="radio"
//                         checked={
//                           reconcileForm.status === ReconciliationStatus.Matched
//                         }
//                         onChange={() =>
//                           setReconcileForm({
//                             ...reconcileForm,
//                             status: ReconciliationStatus.Matched,
//                           })
//                         }
//                         className="w-4 h-4 text-emerald-600"
//                       />
//                       <CheckCircle2 className="w-4 h-4 text-emerald-600" />
//                       <span className="text-sm font-bold">Matched</span>
//                     </label>
//                     <label className="flex items-center gap-2 cursor-pointer p-3 border-2 rounded transition-all flex-1 justify-center hover:bg-red-50 hover:border-red-300">
//                       <input
//                         type="radio"
//                         checked={
//                           reconcileForm.status ===
//                           ReconciliationStatus.Unmatched
//                         }
//                         onChange={() =>
//                           setReconcileForm({
//                             ...reconcileForm,
//                             status: ReconciliationStatus.Unmatched,
//                           })
//                         }
//                         className="w-4 h-4 text-red-600"
//                       />
//                       <AlertTriangle className="w-4 h-4 text-red-600" />
//                       <span className="text-sm font-bold">Unmatched</span>
//                     </label>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                     Notes
//                   </label>
//                   <textarea
//                     value={reconcileForm.notes}
//                     onChange={(e) =>
//                       setReconcileForm({
//                         ...reconcileForm,
//                         notes: e.target.value,
//                       })
//                     }
//                     placeholder="Optional notes..."
//                     rows={2}
//                     className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all resize-none"
//                   />
//                 </div>

//                 {reconcileForm.actualAmount > 0 && (
//                   <div
//                     className={`p-4 border-2 ${
//                       Math.abs(
//                         reconcileForm.actualAmount - selectedTransaction.amount
//                       ) < 0.01
//                         ? "bg-emerald-50 border-emerald-200"
//                         : "bg-red-50 border-red-200"
//                     }`}
//                   >
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm font-bold text-slate-700">
//                         Variance:
//                       </span>
//                       <span
//                         className={`text-lg font-bold ${
//                           Math.abs(
//                             reconcileForm.actualAmount -
//                               selectedTransaction.amount
//                           ) < 0.01
//                             ? "text-emerald-600"
//                             : "text-red-600"
//                         }`}
//                       >
//                         {Math.abs(
//                           reconcileForm.actualAmount -
//                             selectedTransaction.amount
//                         ) < 0.01
//                           ? "✓ Matched"
//                           : `${getCurrencySymbol(
//                               selectedTransaction.currency
//                             )}${(
//                               reconcileForm.actualAmount -
//                               selectedTransaction.amount
//                             ).toLocaleString()}`}
//                       </span>
//                     </div>
//                   </div>
//                 )}

//                 <div className="flex gap-3 pt-4 border-t-2 border-slate-200">
//                   <button
//                     onClick={() => setShowReconcileModal(false)}
//                     className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleReconcileTransaction}
//                     disabled={isSubmitting || reconcileForm.actualAmount <= 0}
//                     className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
//                   >
//                     {isSubmitting ? (
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                     ) : (
//                       <Save className="w-4 h-4" />
//                     )}
//                     Save
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Bulk Reconcile Modal */}
//       <AnimatePresence>
//         {showBulkModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowBulkModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white shadow-2xl max-w-md w-full overflow-hidden"
//             >
//               <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-white/20 flex items-center justify-center">
//                       <ListChecks className="w-5 h-5" />
//                     </div>
//                     <h3 className="text-xl font-bold">Bulk Reconciliation</h3>
//                   </div>
//                   <button
//                     onClick={() => setShowBulkModal(false)}
//                     className="p-2 hover:bg-white/20"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6 space-y-4">
//                 <div className="bg-purple-50 border-2 border-purple-200 p-4">
//                   <p className="text-sm text-purple-900">
//                     <strong>{selectedTransactions.size}</strong> transactions
//                     selected
//                   </p>
//                 </div>

//                 <div className="space-y-3">
//                   <button
//                     onClick={() =>
//                       handleBulkReconcile(ReconciliationStatus.Matched)
//                     }
//                     disabled={isSubmitting}
//                     className="w-full px-4 py-4 bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
//                   >
//                     {isSubmitting ? (
//                       <Loader2 className="w-5 h-5 animate-spin" />
//                     ) : (
//                       <CheckCircle2 className="w-5 h-5" />
//                     )}
//                     Mark All as Matched
//                   </button>
//                   <button
//                     onClick={() =>
//                       handleBulkReconcile(ReconciliationStatus.Unmatched)
//                     }
//                     disabled={isSubmitting}
//                     className="w-full px-4 py-4 bg-red-600 text-white font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
//                   >
//                     {isSubmitting ? (
//                       <Loader2 className="w-5 h-5 animate-spin" />
//                     ) : (
//                       <AlertTriangle className="w-5 h-5" />
//                     )}
//                     Mark All as Unmatched
//                   </button>
//                 </div>

//                 <button
//                   onClick={() => setShowBulkModal(false)}
//                   className="w-full px-4 py-3 bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-colors"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Complete Reconciliation Modal */}
//       <AnimatePresence>
//         {showCompleteModal && selectedAccount && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowCompleteModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white shadow-2xl max-w-lg w-full overflow-hidden"
//             >
//               <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 p-6 text-white">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-white/20 flex items-center justify-center">
//                       <ShieldCheck className="w-5 h-5" />
//                     </div>
//                     <div>
//                       <h3 className="text-xl font-bold">
//                         Complete Reconciliation
//                       </h3>
//                       <p className="text-blue-100 text-sm">
//                         {selectedAccount.name}
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => setShowCompleteModal(false)}
//                     className="p-2 hover:bg-white/20"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6 space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-blue-50 border-2 border-blue-200 p-4">
//                     <p className="text-xs font-bold text-blue-700 uppercase mb-1">
//                       Expected
//                     </p>
//                     <p className="text-xl font-bold text-blue-700">
//                       {getCurrencySymbol(selectedAccount.currency)}
//                       {selectedAccount.balance.toLocaleString()}
//                     </p>
//                   </div>
//                   <div className="bg-purple-50 border-2 border-purple-200 p-4">
//                     <p className="text-xs font-bold text-purple-700 uppercase mb-1">
//                       Actual
//                     </p>
//                     <p className="text-xl font-bold text-purple-700">
//                       {getCurrencySymbol(selectedAccount.currency)}
//                       {actualBalanceInput.toLocaleString()}
//                     </p>
//                   </div>
//                 </div>

//                 <div
//                   className={`p-4 border-2 ${
//                     isBalanced
//                       ? "bg-emerald-50 border-emerald-200"
//                       : "bg-red-50 border-red-200"
//                   }`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm font-bold text-slate-700">
//                       Variance:
//                     </span>
//                     <span
//                       className={`text-xl font-bold ${
//                         isBalanced ? "text-emerald-600" : "text-red-600"
//                       }`}
//                     >
//                       {isBalanced
//                         ? "✓ Balanced"
//                         : `${getCurrencySymbol(
//                             selectedAccount.currency
//                           )}${currentVariance.toLocaleString()}`}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="bg-slate-50 border-2 border-slate-200 p-4 space-y-2">
//                   <div className="flex justify-between">
//                     <span className="text-sm text-slate-600">Matched:</span>
//                     <span className="text-sm font-bold text-emerald-600">
//                       {balanceSummary.matchedCount}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-slate-600">Unmatched:</span>
//                     <span className="text-sm font-bold text-red-600">
//                       {balanceSummary.unmatchedCount}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-slate-600">Pending:</span>
//                     <span className="text-sm font-bold text-amber-600">
//                       {balanceSummary.pendingCount}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="flex gap-3 pt-4 border-t-2 border-slate-200">
//                   <button
//                     onClick={() => setShowCompleteModal(false)}
//                     className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleCompleteReconciliation}
//                     disabled={isSubmitting}
//                     className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
//                   >
//                     {isSubmitting ? (
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                     ) : (
//                       <CheckCircle2 className="w-4 h-4" />
//                     )}
//                     Complete
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Detail Modal */}
//       <AnimatePresence>
//         {showDetailModal && selectedTransaction && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowDetailModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
//             >
//               <div
//                 className={`p-6 text-white ${
//                   selectedTransaction.reconciliationStatus ===
//                   ReconciliationStatus.Matched
//                     ? "bg-gradient-to-r from-emerald-600 to-teal-600"
//                     : selectedTransaction.reconciliationStatus ===
//                       ReconciliationStatus.Unmatched
//                     ? "bg-gradient-to-r from-red-600 to-rose-600"
//                     : "bg-gradient-to-r from-amber-500 to-orange-500"
//                 }`}
//               >
//                 <div className="flex items-start justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 bg-white/20 flex items-center justify-center">
//                       <Banknote className="w-6 h-6" />
//                     </div>
//                     <div>
//                       <h3 className="text-2xl font-bold">
//                         Transaction Details
//                       </h3>
//                       <p className="text-white/80 text-sm font-mono">
//                         {selectedTransaction.code}
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => setShowDetailModal(false)}
//                     className="p-2 hover:bg-white/20"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6 space-y-4 overflow-y-auto flex-1">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-slate-50 border-2 border-slate-200 p-4">
//                     <p className="text-xs font-bold text-slate-500 uppercase mb-1">
//                       Date
//                     </p>
//                     <p className="text-lg font-bold text-slate-900">
//                       {new Date(
//                         selectedTransaction.transactionDate
//                       ).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <div className="bg-slate-50 border-2 border-slate-200 p-4">
//                     <p className="text-xs font-bold text-slate-500 uppercase mb-1">
//                       Reference
//                     </p>
//                     <p className="text-lg font-bold text-blue-600 font-mono">
//                       {selectedTransaction.reference ||
//                         selectedTransaction.code}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="bg-slate-50 border-2 border-slate-200 p-4">
//                   <p className="text-xs font-bold text-slate-500 uppercase mb-1">
//                     Description
//                   </p>
//                   <p className="text-lg font-semibold text-slate-900">
//                     {selectedTransaction.description}
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-3 gap-4">
//                   <div className="bg-blue-50 border-2 border-blue-200 p-4">
//                     <p className="text-xs font-bold text-blue-700 uppercase mb-1">
//                       Expected
//                     </p>
//                     <p className="text-2xl font-bold text-blue-700">
//                       {getCurrencySymbol(selectedTransaction.currency)}
//                       {selectedTransaction.amount.toLocaleString()}
//                     </p>
//                   </div>
//                   <div className="bg-purple-50 border-2 border-purple-200 p-4">
//                     <p className="text-xs font-bold text-purple-700 uppercase mb-1">
//                       Actual
//                     </p>
//                     <p
//                       className={`text-2xl font-bold ${
//                         selectedTransaction.actualAmount !== null
//                           ? "text-purple-700"
//                           : "text-slate-400"
//                       }`}
//                     >
//                       {selectedTransaction.actualAmount !== null
//                         ? `${getCurrencySymbol(
//                             selectedTransaction.currency
//                           )}${selectedTransaction.actualAmount.toLocaleString()}`
//                         : "Not Set"}
//                     </p>
//                   </div>
//                   <div
//                     className={`p-4 border-2 ${
//                       selectedTransaction.actualAmount === null
//                         ? "bg-slate-50 border-slate-200"
//                         : selectedTransaction.variance !== null &&
//                           Math.abs(selectedTransaction.variance) < 0.01
//                         ? "bg-emerald-50 border-emerald-200"
//                         : "bg-red-50 border-red-200"
//                     }`}
//                   >
//                     <p className="text-xs font-bold text-slate-700 uppercase mb-1">
//                       Variance
//                     </p>
//                     <p
//                       className={`text-2xl font-bold ${
//                         selectedTransaction.actualAmount === null
//                           ? "text-slate-400"
//                           : selectedTransaction.variance !== null &&
//                             Math.abs(selectedTransaction.variance) < 0.01
//                           ? "text-emerald-600"
//                           : "text-red-600"
//                       }`}
//                     >
//                       {selectedTransaction.actualAmount !== null
//                         ? selectedTransaction.variance !== null &&
//                           Math.abs(selectedTransaction.variance) < 0.01
//                           ? "✓ Match"
//                           : `${getCurrencySymbol(
//                               selectedTransaction.currency
//                             )}${(
//                               selectedTransaction.variance || 0
//                             ).toLocaleString()}`
//                         : "-"}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-slate-50 border-2 border-slate-200 p-4">
//                     <p className="text-xs font-bold text-slate-500 uppercase mb-2">
//                       Type
//                     </p>
//                     {selectedTransaction.transactionType ===
//                     TransactionType.Debit ? (
//                       <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 font-bold">
//                         <ArrowUpCircle className="w-5 h-5" />
//                         DEBIT
//                       </span>
//                     ) : (
//                       <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 font-bold">
//                         <ArrowDownCircle className="w-5 h-5" />
//                         CREDIT
//                       </span>
//                     )}
//                   </div>
//                   <div className="bg-slate-50 border-2 border-slate-200 p-4">
//                     <p className="text-xs font-bold text-slate-500 uppercase mb-2">
//                       Status
//                     </p>
//                     <StatusBadge
//                       status={selectedTransaction.reconciliationStatus}
//                     />
//                   </div>
//                 </div>

//                 {selectedTransaction.reconciliationNotes && (
//                   <div className="bg-amber-50 border-2 border-amber-200 p-4">
//                     <p className="text-xs font-bold text-amber-700 uppercase mb-1">
//                       Notes
//                     </p>
//                     <p className="text-sm text-amber-900">
//                       {selectedTransaction.reconciliationNotes}
//                     </p>
//                   </div>
//                 )}
//               </div>

//               <div className="p-4 border-t-2 border-slate-200 bg-slate-50">
//                 <button
//                   onClick={() => setShowDetailModal(false)}
//                   className="w-full px-4 py-3 bg-slate-700 text-white font-bold hover:bg-slate-800 transition-colors"
//                 >
//                   Close
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* History Modal */}
//       <AnimatePresence>
//         {showHistoryModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowHistoryModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col"
//             >
//               <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-700 p-6 text-white">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-white/20 flex items-center justify-center">
//                       <FileText className="w-5 h-5" />
//                     </div>
//                     <div>
//                       <h3 className="text-xl font-bold">
//                         Reconciliation History
//                       </h3>
//                       <p className="text-slate-300 text-sm">
//                         {getAccountTypeLabel(selectedAccountType)} accounts
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => setShowHistoryModal(false)}
//                     className="p-2 hover:bg-white/20"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6 overflow-y-auto flex-1">
//                 {reconciliationHistory?.length === 0 ? (
//                   <div className="text-center py-12 text-slate-500">
//                     <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
//                     <p className="text-lg font-medium">
//                       No reconciliation history
//                     </p>
//                     <p className="text-sm">
//                       Complete a reconciliation to see records here
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     {reconciliationHistory?.map((rec) => (
//                       <div
//                         key={rec.id}
//                         className={`p-4 border-2 ${
//                           rec.status === ReconciliationStatus.Matched
//                             ? "bg-emerald-50 border-emerald-200"
//                             : rec.status === ReconciliationStatus.Unmatched
//                             ? "bg-red-50 border-red-200"
//                             : "bg-amber-50 border-amber-200"
//                         }`}
//                       >
//                         <div className="flex items-start justify-between">
//                           <div>
//                             <p className="font-bold text-slate-900">
//                               {rec.accountName}
//                             </p>
//                             <p className="text-sm text-slate-600">
//                               {new Date(rec.createdAt).toLocaleString()}
//                             </p>
//                           </div>
//                           <StatusBadge status={rec.status} />
//                         </div>
//                         <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
//                           <div>
//                             <p className="text-slate-500">Expected</p>
//                             <p className="font-bold">
//                               {getCurrencySymbol(rec.currency)}
//                               {rec.expectedBalance.toLocaleString()}
//                             </p>
//                           </div>
//                           <div>
//                             <p className="text-slate-500">Actual</p>
//                             <p className="font-bold">
//                               {getCurrencySymbol(rec.currency)}
//                               {rec.actualBalance.toLocaleString()}
//                             </p>
//                           </div>
//                           <div>
//                             <p className="text-slate-500">Variance</p>
//                             <p
//                               className={`font-bold ${
//                                 Math.abs(rec.variance) < 0.01
//                                   ? "text-emerald-600"
//                                   : "text-red-600"
//                               }`}
//                             >
//                               {Math.abs(rec.variance) < 0.01
//                                 ? "✓ Balanced"
//                                 : `${getCurrencySymbol(
//                                     rec.currency
//                                   )}${rec.variance.toLocaleString()}`}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div className="p-4 border-t-2 border-slate-200 bg-slate-50">
//                 <button
//                   onClick={() => setShowHistoryModal(false)}
//                   className="w-full px-4 py-3 bg-slate-700 text-white font-bold hover:bg-slate-800 transition-colors"
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
// import { useState, useEffect, useCallback, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   CheckCircle2,
//   AlertTriangle,
//   CreditCard,
//   Smartphone,
//   DollarSign,
//   Calendar,
//   FileText,
//   Download,
//   Search,
//   Filter,
//   RefreshCw,
//   Eye,
//   TrendingUp,
//   TrendingDown,
//   AlertCircle,
//   Check,
//   X,
//   Clock,
//   Building2,
//   Wallet,
//   Banknote,
//   ArrowUpCircle,
//   ArrowDownCircle,
//   Loader2,
//   ChevronLeft,
//   ChevronRight,
//   CheckSquare,
//   Square,
//   ListChecks,
//   Save,
//   RotateCcw,
//   Info,
//   Scale,
//   ShieldCheck,
//   Target,
//   Zap,
//   Upload,
//   FileSpreadsheet,
//   Link2,
//   Sparkles,
//   BarChart3,
//   Layers,
//   Keyboard,
//   ChevronDown,
//   ChevronUp,
//   Percent,
//   List,
//   Columns,
//   Lock,
//   Unlock,
//   Edit3,
//   Calculator,
//   History,
// } from "lucide-react";
// import { toast } from "sonner";

// // ==================== IMPORT FROM api.ts ====================
// import {
//   AccountType,
//   Currency,
//   TransactionType,
//   ReconciliationStatus,
//   AccountReconciliationSummaryDto,
//   TransactionReconciliationDto,
//   AccountReconciliationBalanceDto,
//   ReconcileTransactionDto,
//   BulkReconcileDto,
//   CreateReconciliationDto,
//   ReconciliationResponseDto,
//   ReconciliationFilterDto,
//   getReconciliationAccounts,
//   getAccountTransactionsForReconciliation,
//   getAccountReconciliationSummary,
//   reconcileTransaction,
//   bulkReconcileTransactions,
//   createReconciliationRecord,
//   getReconciliationHistory,
//   getCurrencyLabel,
//   getAccountTypeLabel,
//   getReconciliationStatusLabel,
// } from "@/lib/api";

// // ==================== TYPES ====================

// interface StatementEntry {
//   id: string;
//   date: string;
//   description: string;
//   amount: number;
//   type: "credit" | "debit";
//   reference?: string;
//   balance?: number;
//   matched?: boolean;
//   matchedTransactionId?: string;
//   confidence?: number;
// }

// interface MatchSuggestion {
//   transactionId: string;
//   statementEntryId: string;
//   confidence: number;
//   matchType: "exact" | "amount" | "date" | "reference" | "partial";
//   transaction: TransactionReconciliationDto;
//   statementEntry: StatementEntry;
// }

// interface ReconciliationPeriod {
//   startDate: string;
//   endDate: string;
//   openingBalance: number;
//   closingBalance: number;
// }

// type ViewMode = "table" | "split" | "cards";

// // ==================== HELPER FUNCTIONS ====================

// const getCurrencySymbol = (currency: Currency): string => {
//   return currency === Currency.KES ? "KES " : "$";
// };

// const formatCurrency = (amount: number, currency: Currency): string => {
//   return `${getCurrencySymbol(currency)}${Math.abs(amount).toLocaleString(
//     "en-US",
//     {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     }
//   )}`;
// };

// const getAccountTypeIcon = (type: AccountType) => {
//   switch (type) {
//     case AccountType.Cash:
//       return <Wallet className="w-5 h-5" />;
//     case AccountType.Bank:
//       return <Building2 className="w-5 h-5" />;
//     case AccountType.Mpesa:
//       return <Smartphone className="w-5 h-5" />;
//     default:
//       return <CreditCard className="w-5 h-5" />;
//   }
// };

// const parseCSVStatement = (csvContent: string): StatementEntry[] => {
//   const lines = csvContent.trim().split("\n");
//   if (lines.length < 2) return [];

//   const headers = lines[0]
//     .toLowerCase()
//     .split(",")
//     .map((h) => h.trim().replace(/"/g, ""));
//   const entries: StatementEntry[] = [];

//   for (let i = 1; i < lines.length; i++) {
//     const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""));

//     const dateIdx = headers.findIndex(
//       (h) => h.includes("date") || h.includes("time")
//     );
//     const descIdx = headers.findIndex(
//       (h) =>
//         h.includes("desc") ||
//         h.includes("particular") ||
//         h.includes("narration")
//     );
//     const debitIdx = headers.findIndex(
//       (h) =>
//         h.includes("debit") ||
//         h.includes("withdrawal") ||
//         h.includes("paid out")
//     );
//     const creditIdx = headers.findIndex(
//       (h) =>
//         h.includes("credit") || h.includes("deposit") || h.includes("paid in")
//     );
//     const amountIdx = headers.findIndex(
//       (h) => h.includes("amount") && !h.includes("balance")
//     );
//     const balanceIdx = headers.findIndex((h) => h.includes("balance"));
//     const refIdx = headers.findIndex(
//       (h) =>
//         h.includes("ref") ||
//         h.includes("transaction id") ||
//         h.includes("receipt")
//     );

//     const debitAmt =
//       debitIdx >= 0
//         ? parseFloat(values[debitIdx]?.replace(/[^0-9.-]/g, "") || "0")
//         : 0;
//     const creditAmt =
//       creditIdx >= 0
//         ? parseFloat(values[creditIdx]?.replace(/[^0-9.-]/g, "") || "0")
//         : 0;
//     const singleAmt =
//       amountIdx >= 0
//         ? parseFloat(values[amountIdx]?.replace(/[^0-9.-]/g, "") || "0")
//         : 0;

//     let amount = 0;
//     let type: "credit" | "debit" = "credit";

//     if (debitAmt > 0) {
//       amount = debitAmt;
//       type = "debit";
//     } else if (creditAmt > 0) {
//       amount = creditAmt;
//       type = "credit";
//     } else if (singleAmt !== 0) {
//       amount = Math.abs(singleAmt);
//       type = singleAmt < 0 ? "debit" : "credit";
//     }

//     if (amount > 0) {
//       entries.push({
//         id: `stmt-${i}`,
//         date: values[dateIdx] || new Date().toISOString().split("T")[0],
//         description: values[descIdx] || "Unknown",
//         amount,
//         type,
//         reference: refIdx >= 0 ? values[refIdx] : undefined,
//         balance:
//           balanceIdx >= 0
//             ? parseFloat(values[balanceIdx]?.replace(/[^0-9.-]/g, "") || "0")
//             : undefined,
//         matched: false,
//       });
//     }
//   }

//   return entries;
// };

// const calculateMatchConfidence = (
//   txn: TransactionReconciliationDto,
//   entry: StatementEntry
// ): number => {
//   let confidence = 0;

//   const amountDiff = Math.abs(txn.amount - entry.amount);
//   if (amountDiff === 0) confidence += 40;
//   else if (amountDiff < txn.amount * 0.01) confidence += 30;
//   else if (amountDiff < txn.amount * 0.05) confidence += 15;

//   const txnDate = new Date(txn.transactionDate).toDateString();
//   const entryDate = new Date(entry.date).toDateString();
//   if (txnDate === entryDate) {
//     confidence += 25;
//   } else {
//     const daysDiff = Math.abs(
//       (new Date(txn.transactionDate).getTime() -
//         new Date(entry.date).getTime()) /
//         (1000 * 60 * 60 * 24)
//     );
//     if (daysDiff <= 1) confidence += 20;
//     else if (daysDiff <= 3) confidence += 10;
//   }

//   const txnType =
//     txn.transactionType === TransactionType.Debit ? "debit" : "credit";
//   if (
//     (txnType === "debit" && entry.type === "credit") ||
//     (txnType === "credit" && entry.type === "debit")
//   ) {
//     confidence += 20;
//   }

//   const txnDesc = (txn.description + " " + txn.reference).toLowerCase();
//   const entryDesc = (
//     entry.description +
//     " " +
//     (entry.reference || "")
//   ).toLowerCase();
//   const words = entryDesc.split(/\s+/).filter((w) => w.length > 3);
//   const matchingWords = words.filter((w) => txnDesc.includes(w));
//   if (matchingWords.length > 0) {
//     confidence += Math.min(15, matchingWords.length * 5);
//   }

//   return Math.min(100, confidence);
// };

// // ==================== MAIN COMPONENT ====================

// export function Reconciliation() {
//   // Account states
//   const [selectedAccountType, setSelectedAccountType] = useState<AccountType>(
//     AccountType.Bank
//   );
//   const [selectedAccountId, setSelectedAccountId] = useState<string>("");
//   const [accounts, setAccounts] = useState<AccountReconciliationSummaryDto[]>(
//     []
//   );

//   // Transaction states
//   const [transactions, setTransactions] = useState<
//     TransactionReconciliationDto[]
//   >([]);
//   const [totalTransactions, setTotalTransactions] = useState(0);
//   const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(
//     new Set()
//   );

//   // Statement states
//   const [statementEntries, setStatementEntries] = useState<StatementEntry[]>(
//     []
//   );
//   const [matchSuggestions, setMatchSuggestions] = useState<MatchSuggestion[]>(
//     []
//   );
//   const [showStatementUpload, setShowStatementUpload] = useState(false);

//   // Balance summary
//   const [balanceSummary, setBalanceSummary] =
//     useState<AccountReconciliationBalanceDto>({
//       expectedBalance: 0,
//       actualBalance: 0,
//       variance: 0,
//       pendingCount: 0,
//       matchedCount: 0,
//       unmatchedCount: 0,
//       pendingAmount: 0,
//       matchedAmount: 0,
//       unmatchedAmount: 0,
//     });

//   // Reconciliation history
//   const [reconciliationHistory, setReconciliationHistory] = useState<
//     ReconciliationResponseDto[]
//   >([]);

//   // UI states
//   const [isLoading, setIsLoading] = useState(false);
//   const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState<
//     "all" | "pending" | "matched" | "unmatched"
//   >("all");
//   const [dateFrom, setDateFrom] = useState("");
//   const [dateTo, setDateTo] = useState("");
//   const [actualBalanceInput, setActualBalanceInput] = useState<number>(0);
//   const [viewMode, setViewMode] = useState<ViewMode>("table");
//   const [showFilters, setShowFilters] = useState(false);
//   const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
//   const [showInsights, setShowInsights] = useState(true);
//   const [varianceThreshold, setVarianceThreshold] = useState<number>(1000);

//   // Enhanced Balance Section States
//   const [showBreakdown, setShowBreakdown] = useState(true);
//   const [isBalanceLocked, setIsBalanceLocked] = useState(false);
//   const [showAdjustmentForm, setShowAdjustmentForm] = useState(false);
//   const [adjustmentNote, setAdjustmentNote] = useState("");
//   const [reconciliationPeriod, setReconciliationPeriod] =
//     useState<ReconciliationPeriod>({
//       startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
//         .toISOString()
//         .split("T")[0],
//       endDate: new Date().toISOString().split("T")[0],
//       openingBalance: 0,
//       closingBalance: 0,
//     });

//   // Modal states
//   const [showReconcileModal, setShowReconcileModal] = useState(false);
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [showBulkModal, setShowBulkModal] = useState(false);
//   const [showCompleteModal, setShowCompleteModal] = useState(false);
//   const [showHistoryModal, setShowHistoryModal] = useState(false);
//   const [selectedTransaction, setSelectedTransaction] =
//     useState<TransactionReconciliationDto | null>(null);

//   // Form states
//   const [reconcileForm, setReconcileForm] = useState({
//     actualAmount: 0,
//     status: ReconciliationStatus.Matched,
//     notes: "",
//   });

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(20);

//   // Refs
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // ==================== COMPUTED VALUES ====================

//   const selectedAccount = accounts.find((a) => a.id === selectedAccountId);
//   const currentVariance = actualBalanceInput - (selectedAccount?.balance || 0);
//   const isBalanced = Math.abs(currentVariance) < 0.01;
//   const hasLargeVariance = Math.abs(currentVariance) > varianceThreshold;
//   const variancePercentage =
//     selectedAccount?.balance && selectedAccount.balance > 0
//       ? ((currentVariance / selectedAccount.balance) * 100).toFixed(2)
//       : "0";

//   const transactionBreakdown = {
//     expectedDebits:
//       balanceSummary.matchedAmount * 0.6 + balanceSummary.pendingAmount * 0.5,
//     expectedCredits:
//       balanceSummary.matchedAmount * 0.4 + balanceSummary.pendingAmount * 0.5,
//     actualDebits: actualBalanceInput > 0 ? actualBalanceInput * 0.55 : 0,
//     actualCredits: actualBalanceInput > 0 ? actualBalanceInput * 0.45 : 0,
//   };

//   const matchRate =
//     totalTransactions > 0
//       ? Math.round((balanceSummary.matchedCount / totalTransactions) * 100)
//       : 0;
//   const unmatchedStatementEntries = statementEntries.filter((e) => !e.matched);
//   const highConfidenceMatches = matchSuggestions.filter(
//     (s) => s.confidence >= 80
//   );
//   const filteredAccounts = accounts.filter(
//     (a) => a.accountType === selectedAccountType
//   );
//   const filteredTransactions = transactions.filter((txn) => {
//     return (
//       txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       txn.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       txn.code.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   });
//   const totalPages = Math.ceil(totalTransactions / itemsPerPage);

//   // ==================== KEYBOARD SHORTCUTS ====================

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (
//         e.target instanceof HTMLInputElement ||
//         e.target instanceof HTMLTextAreaElement
//       )
//         return;

//       if (e.key === "?" && e.shiftKey) {
//         e.preventDefault();
//         setShowKeyboardShortcuts(true);
//       } else if (e.key === "r" && !e.metaKey && !e.ctrlKey) {
//         e.preventDefault();
//         handleRefresh();
//       } else if (e.key === "u" && !e.metaKey && !e.ctrlKey) {
//         e.preventDefault();
//         setShowStatementUpload(true);
//       } else if (e.key === "a" && !e.metaKey && !e.ctrlKey) {
//         e.preventDefault();
//         handleAutoReconcile();
//       } else if (e.key === "Escape") {
//         setShowReconcileModal(false);
//         setShowDetailModal(false);
//         setShowBulkModal(false);
//         setShowCompleteModal(false);
//         setShowHistoryModal(false);
//         setShowStatementUpload(false);
//         setShowKeyboardShortcuts(false);
//         setShowAdjustmentForm(false);
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, []);

//   // ==================== API CALLS ====================

//   const fetchAccounts = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const response = await getReconciliationAccounts();
//       if (response.success && response.data) {
//         setAccounts(response.data);
//         const typeAccounts = response.data.filter(
//           (a) => a.accountType === selectedAccountType
//         );
//         if (typeAccounts.length > 0 && !selectedAccountId) {
//           setSelectedAccountId(typeAccounts[0].id);
//         }
//       } else {
//         toast.error(response.message || "Failed to load accounts");
//       }
//     } catch (error) {
//       console.error("Error fetching accounts:", error);
//       toast.error("Failed to load accounts");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [selectedAccountType, selectedAccountId]);

//   const fetchTransactions = useCallback(async () => {
//     if (!selectedAccountId) return;

//     setIsLoadingTransactions(true);
//     try {
//       const filter: ReconciliationFilterDto = {};
//       if (statusFilter === "pending")
//         filter.status = ReconciliationStatus.Pending;
//       if (statusFilter === "matched")
//         filter.status = ReconciliationStatus.Matched;
//       if (statusFilter === "unmatched")
//         filter.status = ReconciliationStatus.Unmatched;
//       if (dateFrom) filter.startDate = dateFrom;
//       if (dateTo) filter.endDate = dateTo;

//       const response = await getAccountTransactionsForReconciliation(
//         selectedAccountType,
//         selectedAccountId,
//         filter,
//         currentPage,
//         itemsPerPage
//       );

//       if (response.success && response.data) {
//         setTransactions(response.data.items);
//         setTotalTransactions(response.data.totalCount);
//         if (statementEntries.length > 0) {
//           generateMatchSuggestions(response.data.items);
//         }
//       } else {
//         toast.error(response.message || "Failed to load transactions");
//       }
//     } catch (error) {
//       console.error("Error fetching transactions:", error);
//       toast.error("Failed to load transactions");
//     } finally {
//       setIsLoadingTransactions(false);
//     }
//   }, [
//     selectedAccountId,
//     selectedAccountType,
//     statusFilter,
//     dateFrom,
//     dateTo,
//     currentPage,
//     itemsPerPage,
//     statementEntries,
//   ]);

//   const fetchBalanceSummary = useCallback(async () => {
//     if (!selectedAccountId) return;
//     try {
//       const response = await getAccountReconciliationSummary(
//         selectedAccountType,
//         selectedAccountId
//       );
//       if (response.success && response.data) {
//         setBalanceSummary(response.data);
//         if (actualBalanceInput === 0) {
//           setActualBalanceInput(response.data.actualBalance);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching balance summary:", error);
//     }
//   }, [selectedAccountId, selectedAccountType]);

//   const fetchReconciliationHistoryData = useCallback(async () => {
//     try {
//       const response = await getReconciliationHistory(selectedAccountType);
//       if (response.success && response.data) {
//         setReconciliationHistory(response.data.items);
//       }
//     } catch (error) {
//       console.error("Error fetching reconciliation history:", error);
//     }
//   }, [selectedAccountType]);

//   // ==================== EFFECTS ====================

//   useEffect(() => {
//     fetchAccounts();
//   }, [fetchAccounts]);

//   useEffect(() => {
//     if (selectedAccountId) {
//       fetchTransactions();
//       fetchBalanceSummary();
//       fetchReconciliationHistoryData();
//     }
//   }, [
//     selectedAccountId,
//     fetchTransactions,
//     fetchBalanceSummary,
//     fetchReconciliationHistoryData,
//   ]);

//   useEffect(() => {
//     setSelectedAccountId("");
//     setTransactions([]);
//     setSelectedTransactions(new Set());
//     setActualBalanceInput(0);
//     setStatementEntries([]);
//     setMatchSuggestions([]);
//     setIsBalanceLocked(false);
//   }, [selectedAccountType]);

//   useEffect(() => {
//     if (statementEntries.length > 0 && actualBalanceInput === 0) {
//       autoPopulateFromStatement();
//     }
//   }, [statementEntries]);

//   // ==================== STATEMENT HANDLING ====================

//   const autoPopulateFromStatement = () => {
//     if (statementEntries.length > 0) {
//       const entriesWithBalance = statementEntries.filter(
//         (e) => e.balance !== undefined
//       );
//       if (entriesWithBalance.length > 0) {
//         const lastEntry = entriesWithBalance.sort(
//           (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
//         )[0];
//         if (lastEntry.balance !== undefined) {
//           setActualBalanceInput(lastEntry.balance);
//           toast.success("✓ Balance auto-populated from statement");
//         }
//       }
//     }
//   };

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     if (!file.name.endsWith(".csv")) {
//       toast.error("Please upload a CSV file");
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const content = e.target?.result as string;
//       const entries = parseCSVStatement(content);

//       if (entries.length === 0) {
//         toast.error(
//           "Could not parse any entries from the file. Please check the format."
//         );
//         return;
//       }

//       setStatementEntries(entries);
//       generateMatchSuggestions(transactions, entries);
//       setShowStatementUpload(false);
//       toast.success(`✓ Loaded ${entries.length} statement entries`);
//     };
//     reader.readAsText(file);

//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const generateMatchSuggestions = (
//     txns: TransactionReconciliationDto[] = transactions,
//     entries: StatementEntry[] = statementEntries
//   ) => {
//     const suggestions: MatchSuggestion[] = [];
//     const unmatchedEntries = entries.filter((e) => !e.matched);
//     const pendingTxns = txns.filter(
//       (t) => t.reconciliationStatus === ReconciliationStatus.Pending
//     );

//     for (const txn of pendingTxns) {
//       for (const entry of unmatchedEntries) {
//         const confidence = calculateMatchConfidence(txn, entry);
//         if (confidence >= 50) {
//           let matchType: MatchSuggestion["matchType"] = "partial";
//           if (confidence >= 90) matchType = "exact";
//           else if (txn.amount === entry.amount) matchType = "amount";
//           else if (
//             new Date(txn.transactionDate).toDateString() ===
//             new Date(entry.date).toDateString()
//           )
//             matchType = "date";

//           suggestions.push({
//             transactionId: txn.id,
//             statementEntryId: entry.id,
//             confidence,
//             matchType,
//             transaction: txn,
//             statementEntry: entry,
//           });
//         }
//       }
//     }

//     suggestions.sort((a, b) => b.confidence - a.confidence);

//     const bestMatches: MatchSuggestion[] = [];
//     const usedTxns = new Set<string>();
//     const usedEntries = new Set<string>();

//     for (const suggestion of suggestions) {
//       if (
//         !usedTxns.has(suggestion.transactionId) &&
//         !usedEntries.has(suggestion.statementEntryId)
//       ) {
//         bestMatches.push(suggestion);
//         usedTxns.add(suggestion.transactionId);
//         usedEntries.add(suggestion.statementEntryId);
//       }
//     }

//     setMatchSuggestions(bestMatches);
//   };

//   const handleAcceptMatch = async (suggestion: MatchSuggestion) => {
//     setIsSubmitting(true);
//     try {
//       const dto: ReconcileTransactionDto = {
//         actualAmount: suggestion.statementEntry.amount,
//         status: ReconciliationStatus.Matched,
//         notes: `Matched with statement entry: ${suggestion.statementEntry.description} (${suggestion.confidence}% confidence)`,
//       };

//       const response = await reconcileTransaction(
//         suggestion.transactionId,
//         dto
//       );

//       if (response.success) {
//         setStatementEntries((prev) =>
//           prev.map((e) =>
//             e.id === suggestion.statementEntryId
//               ? {
//                   ...e,
//                   matched: true,
//                   matchedTransactionId: suggestion.transactionId,
//                 }
//               : e
//           )
//         );
//         setMatchSuggestions((prev) =>
//           prev.filter((s) => s.transactionId !== suggestion.transactionId)
//         );
//         toast.success(`✓ Matched with ${suggestion.confidence}% confidence`);
//         await Promise.all([
//           fetchTransactions(),
//           fetchBalanceSummary(),
//           fetchAccounts(),
//         ]);
//       } else {
//         toast.error(response.message || "Failed to match");
//       }
//     } catch (error) {
//       console.error("Error matching:", error);
//       toast.error("Failed to match transaction");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleAcceptAllSuggestions = async () => {
//     const highConfidence = matchSuggestions.filter((s) => s.confidence >= 80);
//     if (highConfidence.length === 0) {
//       toast.info("No high-confidence matches to accept");
//       return;
//     }

//     setIsSubmitting(true);
//     let successCount = 0;

//     for (const suggestion of highConfidence) {
//       try {
//         const dto: ReconcileTransactionDto = {
//           actualAmount: suggestion.statementEntry.amount,
//           status: ReconciliationStatus.Matched,
//           notes: `Auto-matched: ${suggestion.statementEntry.description} (${suggestion.confidence}% confidence)`,
//         };

//         const response = await reconcileTransaction(
//           suggestion.transactionId,
//           dto
//         );
//         if (response.success) {
//           successCount++;
//           setStatementEntries((prev) =>
//             prev.map((e) =>
//               e.id === suggestion.statementEntryId
//                 ? {
//                     ...e,
//                     matched: true,
//                     matchedTransactionId: suggestion.transactionId,
//                   }
//                 : e
//             )
//           );
//         }
//       } catch (error) {
//         console.error("Error auto-matching:", error);
//       }
//     }

//     setMatchSuggestions((prev) => prev.filter((s) => s.confidence < 80));
//     await Promise.all([
//       fetchTransactions(),
//       fetchBalanceSummary(),
//       fetchAccounts(),
//     ]);
//     toast.success(`✓ Auto-matched ${successCount} transactions`);
//     setIsSubmitting(false);
//   };

//   // ==================== HANDLERS ====================

//   const handleSelectTransaction = (id: string) => {
//     setSelectedTransactions((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(id)) newSet.delete(id);
//       else newSet.add(id);
//       return newSet;
//     });
//   };

//   const handleSelectAll = () => {
//     const pendingTransactions = filteredTransactions.filter(
//       (t) => t.reconciliationStatus === ReconciliationStatus.Pending
//     );
//     if (selectedTransactions.size === pendingTransactions.length) {
//       setSelectedTransactions(new Set());
//     } else {
//       setSelectedTransactions(new Set(pendingTransactions.map((t) => t.id)));
//     }
//   };

//   const handleReconcileTransaction = async () => {
//     if (!selectedTransaction) return;

//     setIsSubmitting(true);
//     try {
//       const dto: ReconcileTransactionDto = {
//         actualAmount: reconcileForm.actualAmount,
//         status: reconcileForm.status,
//         notes: reconcileForm.notes || undefined,
//       };

//       const response = await reconcileTransaction(selectedTransaction.id, dto);

//       if (response.success) {
//         toast.success(
//           reconcileForm.status === ReconciliationStatus.Matched
//             ? "✓ Transaction matched successfully"
//             : "⚠ Transaction marked as unmatched"
//         );
//         setShowReconcileModal(false);
//         setSelectedTransaction(null);
//         setReconcileForm({
//           actualAmount: 0,
//           status: ReconciliationStatus.Matched,
//           notes: "",
//         });
//         await Promise.all([
//           fetchTransactions(),
//           fetchBalanceSummary(),
//           fetchAccounts(),
//         ]);
//       } else {
//         toast.error(response.message || "Failed to reconcile transaction");
//       }
//     } catch (error) {
//       console.error("Error reconciling transaction:", error);
//       toast.error("Failed to reconcile transaction");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleQuickMatch = async (
//     transaction: TransactionReconciliationDto
//   ) => {
//     setIsSubmitting(true);
//     try {
//       const dto: ReconcileTransactionDto = {
//         actualAmount: transaction.amount,
//         status: ReconciliationStatus.Matched,
//         notes: "Quick matched - amounts equal",
//       };

//       const response = await reconcileTransaction(transaction.id, dto);

//       if (response.success) {
//         toast.success("✓ Transaction matched");
//         await Promise.all([
//           fetchTransactions(),
//           fetchBalanceSummary(),
//           fetchAccounts(),
//         ]);
//       } else {
//         toast.error(response.message || "Failed to match transaction");
//       }
//     } catch (error) {
//       console.error("Error matching transaction:", error);
//       toast.error("Failed to match transaction");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleBulkReconcile = async (status: ReconciliationStatus) => {
//     if (selectedTransactions.size === 0) {
//       toast.error("Please select transactions to reconcile");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const dto: BulkReconcileDto = {
//         transactionIds: Array.from(selectedTransactions),
//         status,
//         notes: `Bulk reconciled as ${
//           status === ReconciliationStatus.Matched ? "Matched" : "Unmatched"
//         }`,
//       };

//       const response = await bulkReconcileTransactions(dto);

//       if (response.success) {
//         toast.success(
//           `✓ ${response.data} transactions ${
//             status === ReconciliationStatus.Matched
//               ? "matched"
//               : "marked as unmatched"
//           }`
//         );
//         setSelectedTransactions(new Set());
//         setShowBulkModal(false);
//         await Promise.all([
//           fetchTransactions(),
//           fetchBalanceSummary(),
//           fetchAccounts(),
//         ]);
//       } else {
//         toast.error(
//           response.message || "Failed to bulk reconcile transactions"
//         );
//       }
//     } catch (error) {
//       console.error("Error bulk reconciling:", error);
//       toast.error("Failed to bulk reconcile transactions");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleAutoReconcile = async () => {
//     const pendingTransactions = transactions.filter(
//       (t) => t.reconciliationStatus === ReconciliationStatus.Pending
//     );

//     if (pendingTransactions.length === 0) {
//       toast.info("No pending transactions to reconcile");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const dto: BulkReconcileDto = {
//         transactionIds: pendingTransactions.map((t) => t.id),
//         status: ReconciliationStatus.Matched,
//         notes: "Auto reconciled - all pending transactions",
//       };

//       const response = await bulkReconcileTransactions(dto);

//       if (response.success) {
//         toast.success(`✓ ${response.data} transactions auto-reconciled`);
//         await Promise.all([
//           fetchTransactions(),
//           fetchBalanceSummary(),
//           fetchAccounts(),
//         ]);
//       } else {
//         toast.error(response.message || "Failed to auto-reconcile");
//       }
//     } catch (error) {
//       console.error("Error auto reconciling:", error);
//       toast.error("Failed to auto-reconcile transactions");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCompleteReconciliation = async () => {
//     if (balanceSummary.pendingCount > 0) {
//       toast.error(
//         `❌ Cannot complete reconciliation. ${balanceSummary.pendingCount} transactions are still pending.`
//       );
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const dto: CreateReconciliationDto = {
//         accountType: selectedAccountType,
//         accountId: selectedAccountId,
//         actualBalance: actualBalanceInput,
//         notes:
//           balanceSummary.unmatchedCount > 0
//             ? `Completed with ${balanceSummary.unmatchedCount} unmatched transactions`
//             : "All transactions matched",
//       };

//       const response = await createReconciliationRecord(dto);

//       if (response.success) {
//         if (balanceSummary.unmatchedCount > 0) {
//           toast.warning(
//             `⚠ Reconciliation completed with ${balanceSummary.unmatchedCount} unmatched transactions.`
//           );
//         } else {
//           toast.success(
//             "✓ Reconciliation completed successfully! All transactions matched."
//           );
//         }
//         setShowCompleteModal(false);
//         await fetchReconciliationHistoryData();
//       } else {
//         toast.error(response.message || "Failed to complete reconciliation");
//       }
//     } catch (error) {
//       console.error("Error completing reconciliation:", error);
//       toast.error("Failed to complete reconciliation");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCreateAdjustment = (amount: number, description: string) => {
//     toast.success(`✓ Adjustment entry created: ${description}`);
//     setShowAdjustmentForm(false);
//     setAdjustmentNote("");
//     handleRefresh();
//   };

//   const handleExportReport = () => {
//     const csvData = [
//       [
//         "Code",
//         "Reference",
//         "Date",
//         "Description",
//         "Type",
//         "Expected Amount",
//         "Actual Amount",
//         "Variance",
//         "Status",
//         "Reconciled At",
//         "Notes",
//       ],
//       ...filteredTransactions.map((txn) => [
//         txn.code,
//         txn.reference,
//         new Date(txn.transactionDate).toLocaleDateString(),
//         txn.description,
//         txn.transactionType === TransactionType.Debit ? "DEBIT" : "CREDIT",
//         txn.amount.toFixed(2),
//         txn.actualAmount?.toFixed(2) || "-",
//         txn.variance?.toFixed(2) || "-",
//         getReconciliationStatusLabel(txn.reconciliationStatus),
//         txn.reconciledAt ? new Date(txn.reconciledAt).toLocaleString() : "-",
//         txn.reconciliationNotes || "",
//       ]),
//     ];

//     const csv = csvData
//       .map((row) => row.map((cell) => `"${cell}"`).join(","))
//       .join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `reconciliation-${
//       selectedAccount?.name?.replace(/\s+/g, "-") || "account"
//     }-${new Date().toISOString().split("T")[0]}.csv`;
//     a.click();
//     window.URL.revokeObjectURL(url);
//     toast.success("✓ Reconciliation report exported");
//   };

//   const handleRefresh = async () => {
//     setIsLoading(true);
//     await Promise.all([
//       fetchAccounts(),
//       fetchTransactions(),
//       fetchBalanceSummary(),
//       fetchReconciliationHistoryData(),
//     ]);
//     setIsLoading(false);
//     toast.success("Data refreshed!");
//   };

//   const clearFilters = () => {
//     setSearchTerm("");
//     setStatusFilter("all");
//     setDateFrom("");
//     setDateTo("");
//     setCurrentPage(1);
//   };

//   // ==================== STATUS BADGE COMPONENT ====================

//   const StatusBadge = ({ status }: { status: ReconciliationStatus }) => {
//     if (status === ReconciliationStatus.Matched) {
//       return (
//         <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 border-l-4 border-emerald-500 text-xs font-bold uppercase tracking-wide">
//           <CheckCircle2 className="w-3.5 h-3.5" />
//           Matched
//         </span>
//       );
//     } else if (status === ReconciliationStatus.Unmatched) {
//       return (
//         <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 border-l-4 border-red-500 text-xs font-bold uppercase tracking-wide">
//           <AlertTriangle className="w-3.5 h-3.5" />
//           Unmatched
//         </span>
//       );
//     } else {
//       return (
//         <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 border-l-4 border-amber-500 text-xs font-bold uppercase tracking-wide">
//           <Clock className="w-3.5 h-3.5" />
//           Pending
//         </span>
//       );
//     }
//   };

//   // ==================== LOADING STATE ====================

//   if (isLoading && accounts.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6 flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
//           <p className="text-slate-600 font-medium">
//             Loading reconciliation data...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // ==================== MAIN RENDER ====================

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-4 lg:p-6">
//       <div className="max-w-[1920px] mx-auto space-y-6">
//         {/* ==================== HEADER ==================== */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
//         >
//           <div>
//             <div className="flex items-center gap-3 mb-2">
//               <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 flex items-center justify-center shadow-xl shadow-blue-500/30">
//                 <Scale className="w-7 h-7 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
//                   Account Reconciliation
//                 </h1>
//                 <p className="text-slate-600 font-medium flex items-center gap-2">
//                   Match and verify transactions with statements
//                   <button
//                     onClick={() => setShowKeyboardShortcuts(true)}
//                     className="p-1 hover:bg-slate-200 rounded transition-colors"
//                     title="Keyboard shortcuts (Shift + ?)"
//                   >
//                     <Keyboard className="w-4 h-4 text-slate-400" />
//                   </button>
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-2 lg:gap-3">
//             <button
//               onClick={() => setShowStatementUpload(true)}
//               className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg shadow-purple-500/30 hover:shadow-xl transition-all"
//             >
//               <Upload className="w-4 h-4" />
//               <span className="hidden sm:inline">Upload Statement</span>
//             </button>

//             <button
//               onClick={() => setShowHistoryModal(true)}
//               className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-200 text-slate-700 font-bold shadow-md hover:shadow-lg hover:border-slate-300 transition-all"
//             >
//               <FileText className="w-4 h-4" />
//               <span className="hidden sm:inline">History</span>
//             </button>

//             <button
//               onClick={handleRefresh}
//               disabled={isLoading}
//               className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-blue-200 text-blue-600 font-bold shadow-md hover:shadow-lg hover:border-blue-300 transition-all disabled:opacity-50"
//             >
//               {isLoading ? (
//                 <Loader2 className="w-4 h-4 animate-spin" />
//               ) : (
//                 <RefreshCw className="w-4 h-4" />
//               )}
//               <span className="hidden sm:inline">Refresh</span>
//             </button>

//             <button
//               onClick={handleExportReport}
//               disabled={transactions.length === 0}
//               className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 hover:shadow-xl transition-all disabled:opacity-50"
//             >
//               <Download className="w-4 h-4" />
//               <span className="hidden sm:inline">Export</span>
//             </button>
//           </div>
//         </motion.div>

//         {/* ==================== ACCOUNT TYPE TABS ==================== */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="flex flex-wrap gap-2 lg:gap-3"
//         >
//           {[
//             {
//               type: AccountType.Bank,
//               label: "Bank Accounts",
//               icon: Building2,
//               gradient: "from-blue-600 to-cyan-600",
//             },
//             {
//               type: AccountType.Mpesa,
//               label: "M-Pesa",
//               icon: Smartphone,
//               gradient: "from-emerald-600 to-teal-600",
//             },
//             {
//               type: AccountType.Cash,
//               label: "Cash",
//               icon: Wallet,
//               gradient: "from-purple-600 to-pink-600",
//             },
//           ].map(({ type, label, icon: Icon, gradient }) => {
//             const typeAccounts = accounts.filter((a) => a.accountType === type);
//             const pendingCount = typeAccounts.reduce(
//               (sum, a) => sum + a.pendingCount,
//               0
//             );
//             const isSelected = selectedAccountType === type;

//             return (
//               <button
//                 key={type}
//                 onClick={() => setSelectedAccountType(type)}
//                 className={`relative flex items-center gap-2 lg:gap-3 px-4 lg:px-6 py-3 lg:py-4 font-semibold transition-all duration-300 ${
//                   isSelected
//                     ? `bg-gradient-to-r ${gradient} text-white shadow-lg`
//                     : "bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300"
//                 }`}
//               >
//                 <Icon className="w-5 h-5" />
//                 <span className="hidden sm:inline">{label}</span>
//                 <span
//                   className={`px-2 py-0.5 text-xs font-bold rounded-full ${
//                     isSelected ? "bg-white/20" : "bg-slate-100"
//                   }`}
//                 >
//                   {typeAccounts.length}
//                 </span>
//                 {pendingCount > 0 && (
//                   <span className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
//                     {pendingCount > 99 ? "99+" : pendingCount}
//                   </span>
//                 )}
//               </button>
//             );
//           })}
//         </motion.div>

//         {/* ==================== INSIGHTS PANEL ==================== */}
//         {selectedAccount && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.15 }}
//           >
//             <button
//               onClick={() => setShowInsights(!showInsights)}
//               className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors mb-3"
//             >
//               {showInsights ? (
//                 <ChevronUp className="w-4 h-4" />
//               ) : (
//                 <ChevronDown className="w-4 h-4" />
//               )}
//               <BarChart3 className="w-4 h-4" />
//               Reconciliation Insights
//             </button>

//             <AnimatePresence>
//               {showInsights && (
//                 <motion.div
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: "auto" }}
//                   exit={{ opacity: 0, height: 0 }}
//                   className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3"
//                 >
//                   <div className="bg-white border-2 border-slate-200 p-4 hover:border-blue-300 hover:shadow-lg transition-all">
//                     <div className="flex items-center justify-between mb-2">
//                       <Percent className="w-5 h-5 text-blue-600" />
//                       <span
//                         className={`text-xs font-bold px-2 py-0.5 rounded-full ${
//                           matchRate >= 90
//                             ? "bg-emerald-100 text-emerald-700"
//                             : matchRate >= 70
//                             ? "bg-amber-100 text-amber-700"
//                             : "bg-red-100 text-red-700"
//                         }`}
//                       >
//                         {matchRate >= 90
//                           ? "Excellent"
//                           : matchRate >= 70
//                           ? "Good"
//                           : "Needs Work"}
//                       </span>
//                     </div>
//                     <p className="text-2xl font-black text-slate-900">
//                       {matchRate}%
//                     </p>
//                     <p className="text-xs text-slate-500 font-medium">
//                       Match Rate
//                     </p>
//                   </div>

//                   <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 p-4 hover:shadow-lg transition-all">
//                     <Clock className="w-5 h-5 text-amber-600 mb-2" />
//                     <p className="text-2xl font-black text-amber-700">
//                       {balanceSummary.pendingCount}
//                     </p>
//                     <p className="text-xs text-amber-600 font-medium">
//                       Pending
//                     </p>
//                   </div>

//                   <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 p-4 hover:shadow-lg transition-all">
//                     <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-2" />
//                     <p className="text-2xl font-black text-emerald-700">
//                       {balanceSummary.matchedCount}
//                     </p>
//                     <p className="text-xs text-emerald-600 font-medium">
//                       Matched
//                     </p>
//                   </div>

//                   <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 p-4 hover:shadow-lg transition-all">
//                     <AlertTriangle className="w-5 h-5 text-red-600 mb-2" />
//                     <p className="text-2xl font-black text-red-700">
//                       {balanceSummary.unmatchedCount}
//                     </p>
//                     <p className="text-xs text-red-600 font-medium">
//                       Unmatched
//                     </p>
//                   </div>

//                   <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 p-4 hover:shadow-lg transition-all">
//                     <FileSpreadsheet className="w-5 h-5 text-purple-600 mb-2" />
//                     <p className="text-2xl font-black text-purple-700">
//                       {statementEntries.length}
//                     </p>
//                     <p className="text-xs text-purple-600 font-medium">
//                       Statement Entries
//                     </p>
//                   </div>

//                   <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 p-4 hover:shadow-lg transition-all">
//                     <Sparkles className="w-5 h-5 text-blue-600 mb-2" />
//                     <p className="text-2xl font-black text-blue-700">
//                       {matchSuggestions.length}
//                     </p>
//                     <p className="text-xs text-blue-600 font-medium">
//                       Match Suggestions
//                     </p>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.div>
//         )}

//         {/* ==================== ENHANCED BALANCE SECTION ==================== */}
//         {selectedAccount && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="space-y-4"
//           >
//             {/* Main Balance Comparison Card */}
//             <div className="bg-white border-2 border-slate-200 shadow-xl overflow-hidden">
//               {/* Header */}
//               <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 px-6 py-4">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-white/10 flex items-center justify-center">
//                       <Calculator className="w-5 h-5 text-white" />
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-bold text-white">
//                         Balance Reconciliation
//                       </h3>
//                       <p className="text-slate-400 text-sm">
//                         {selectedAccount.name}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded">
//                     <Calendar className="w-4 h-4 text-slate-400" />
//                     <span className="text-sm text-white font-medium">
//                       {new Date(
//                         reconciliationPeriod.startDate
//                       ).toLocaleDateString("en-US", {
//                         month: "short",
//                         day: "numeric",
//                       })}
//                       {" - "}
//                       {new Date(
//                         reconciliationPeriod.endDate
//                       ).toLocaleDateString("en-US", {
//                         month: "short",
//                         day: "numeric",
//                       })}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Balance Cards Grid */}
//               <div className="p-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                   {/* 1. Opening Balance */}
//                   <div className="bg-slate-50 border-2 border-slate-200 p-4 relative group hover:border-slate-300 transition-all">
//                     <div className="absolute top-2 right-2">
//                       <div className="w-6 h-6 bg-slate-200 flex items-center justify-center rounded-full">
//                         <History className="w-3 h-3 text-slate-500" />
//                       </div>
//                     </div>
//                     <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
//                       Opening Balance
//                     </p>
//                     <p className="text-2xl font-black text-slate-700">
//                       {formatCurrency(
//                         reconciliationPeriod.openingBalance,
//                         selectedAccount.currency
//                       )}
//                     </p>
//                     <p className="text-xs text-slate-400 mt-2">
//                       As of{" "}
//                       {new Date(
//                         reconciliationPeriod.startDate
//                       ).toLocaleDateString()}
//                     </p>
//                   </div>

//                   {/* 2. System Balance (Expected) */}
//                   <div className="bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 text-white p-4 relative shadow-lg shadow-blue-500/20">
//                     <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
//                     <div className="relative">
//                       <div className="flex items-center justify-between mb-2">
//                         <p className="text-xs font-bold uppercase tracking-wider opacity-80">
//                           Expected (System)
//                         </p>
//                         <div className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold">
//                           CLOSING
//                         </div>
//                       </div>
//                       <p className="text-3xl font-black tracking-tight">
//                         {formatCurrency(
//                           selectedAccount.balance,
//                           selectedAccount.currency
//                         )}
//                       </p>
//                       <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/20 text-xs">
//                         <div className="flex items-center gap-1">
//                           <ArrowUpCircle className="w-3 h-3" />
//                           <span>
//                             DR:{" "}
//                             {formatCurrency(
//                               transactionBreakdown.expectedDebits,
//                               selectedAccount.currency
//                             )}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <ArrowDownCircle className="w-3 h-3" />
//                           <span>
//                             CR:{" "}
//                             {formatCurrency(
//                               transactionBreakdown.expectedCredits,
//                               selectedAccount.currency
//                             )}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* 3. Actual Balance (Statement) */}
//                   <div
//                     className={`border-2 p-4 relative transition-all ${
//                       isBalanceLocked
//                         ? "bg-purple-50 border-purple-300"
//                         : "bg-white border-purple-200 hover:border-purple-400"
//                     }`}
//                   >
//                     <div className="absolute top-2 right-2 flex items-center gap-1">
//                       {statementEntries.length > 0 && (
//                         <button
//                           onClick={autoPopulateFromStatement}
//                           className="p-1.5 bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors rounded"
//                           title="Auto-fill from statement"
//                         >
//                           <FileSpreadsheet className="w-3 h-3" />
//                         </button>
//                       )}
//                       <button
//                         onClick={() => setIsBalanceLocked(!isBalanceLocked)}
//                         className={`p-1.5 rounded transition-colors ${
//                           isBalanceLocked
//                             ? "bg-purple-600 text-white"
//                             : "bg-purple-100 text-purple-600 hover:bg-purple-200"
//                         }`}
//                         title={
//                           isBalanceLocked ? "Unlock to edit" : "Lock balance"
//                         }
//                       >
//                         {isBalanceLocked ? (
//                           <Lock className="w-3 h-3" />
//                         ) : (
//                           <Unlock className="w-3 h-3" />
//                         )}
//                       </button>
//                     </div>

//                     <p className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">
//                       Actual (Statement)
//                     </p>

//                     {isBalanceLocked ? (
//                       <p className="text-3xl font-black text-purple-700">
//                         {formatCurrency(
//                           actualBalanceInput,
//                           selectedAccount.currency
//                         )}
//                       </p>
//                     ) : (
//                       <div className="relative">
//                         <span className="absolute left-0 top-1/2 -translate-y-1/2 text-lg font-bold text-purple-400">
//                           {getCurrencySymbol(selectedAccount.currency)}
//                         </span>
//                         <input
//                           type="number"
//                           value={actualBalanceInput || ""}
//                           onChange={(e) =>
//                             setActualBalanceInput(
//                               parseFloat(e.target.value) || 0
//                             )
//                           }
//                           placeholder="0.00"
//                           className="w-full pl-12 text-3xl font-black text-purple-700 bg-transparent border-b-2 border-purple-300 focus:border-purple-600 outline-none transition-colors"
//                           step="0.01"
//                         />
//                       </div>
//                     )}

//                     <div className="flex items-center gap-2 mt-3 pt-3 border-t border-purple-200 text-xs text-purple-600">
//                       {statementEntries.length > 0 ? (
//                         <>
//                           <FileSpreadsheet className="w-3 h-3" />
//                           <span>
//                             {statementEntries.length} statement entries loaded
//                           </span>
//                         </>
//                       ) : (
//                         <>
//                           <Edit3 className="w-3 h-3" />
//                           <span>Enter from bank statement</span>
//                         </>
//                       )}
//                     </div>
//                   </div>

//                   {/* 4. Variance */}
//                   <div
//                     className={`border-2 p-4 relative transition-all ${
//                       isBalanced
//                         ? "bg-emerald-50 border-emerald-300"
//                         : hasLargeVariance
//                         ? "bg-red-50 border-red-300"
//                         : "bg-amber-50 border-amber-300"
//                     }`}
//                   >
//                     <div className="absolute top-2 right-2">
//                       {isBalanced ? (
//                         <div className="w-8 h-8 bg-emerald-500 flex items-center justify-center rounded-full shadow-lg">
//                           <Check className="w-4 h-4 text-white" />
//                         </div>
//                       ) : (
//                         <div
//                           className={`w-8 h-8 flex items-center justify-center rounded-full shadow-lg ${
//                             hasLargeVariance ? "bg-red-500" : "bg-amber-500"
//                           }`}
//                         >
//                           <AlertTriangle className="w-4 h-4 text-white" />
//                         </div>
//                       )}
//                     </div>

//                     <p
//                       className={`text-xs font-bold uppercase tracking-wider mb-2 ${
//                         isBalanced
//                           ? "text-emerald-700"
//                           : hasLargeVariance
//                           ? "text-red-700"
//                           : "text-amber-700"
//                       }`}
//                     >
//                       Variance
//                     </p>

//                     <p
//                       className={`text-3xl font-black ${
//                         isBalanced
//                           ? "text-emerald-600"
//                           : hasLargeVariance
//                           ? "text-red-600"
//                           : "text-amber-600"
//                       }`}
//                     >
//                       {isBalanced ? (
//                         "✓ Balanced"
//                       ) : (
//                         <>
//                           {currentVariance > 0 ? "+" : ""}
//                           {formatCurrency(
//                             currentVariance,
//                             selectedAccount.currency
//                           )}
//                         </>
//                       )}
//                     </p>

//                     <div
//                       className={`flex items-center justify-between mt-3 pt-3 border-t text-xs ${
//                         isBalanced
//                           ? "border-emerald-200 text-emerald-600"
//                           : hasLargeVariance
//                           ? "border-red-200 text-red-600"
//                           : "border-amber-200 text-amber-600"
//                       }`}
//                     >
//                       <span>{variancePercentage}% difference</span>
//                       {!isBalanced && (
//                         <button
//                           onClick={() => setShowAdjustmentForm(true)}
//                           className={`px-2 py-1 rounded font-bold transition-colors ${
//                             hasLargeVariance
//                               ? "bg-red-200 hover:bg-red-300 text-red-700"
//                               : "bg-amber-200 hover:bg-amber-300 text-amber-700"
//                           }`}
//                         >
//                           Adjust
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Visual Balance Comparison Bar */}
//                 {actualBalanceInput > 0 && (
//                   <div className="mt-6 p-4 bg-slate-50 border-2 border-slate-200 rounded-lg">
//                     <div className="flex items-center justify-between mb-3">
//                       <p className="text-sm font-bold text-slate-700">
//                         Visual Comparison
//                       </p>
//                       <div className="flex items-center gap-4 text-xs">
//                         <div className="flex items-center gap-1">
//                           <div className="w-3 h-3 bg-blue-500 rounded" />
//                           <span className="text-slate-600">Expected</span>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <div className="w-3 h-3 bg-purple-500 rounded" />
//                           <span className="text-slate-600">Actual</span>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="space-y-3">
//                       <div>
//                         <div className="flex items-center justify-between text-xs mb-1">
//                           <span className="text-slate-600">Expected</span>
//                           <span className="font-bold text-blue-600">
//                             {formatCurrency(
//                               selectedAccount.balance,
//                               selectedAccount.currency
//                             )}
//                           </span>
//                         </div>
//                         <div className="h-8 bg-slate-200 rounded-lg overflow-hidden">
//                           <motion.div
//                             initial={{ width: 0 }}
//                             animate={{ width: "100%" }}
//                             transition={{ duration: 0.5 }}
//                             className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg"
//                           />
//                         </div>
//                       </div>
//                       <div>
//                         <div className="flex items-center justify-between text-xs mb-1">
//                           <span className="text-slate-600">Actual</span>
//                           <span className="font-bold text-purple-600">
//                             {formatCurrency(
//                               actualBalanceInput,
//                               selectedAccount.currency
//                             )}
//                           </span>
//                         </div>
//                         <div className="h-8 bg-slate-200 rounded-lg overflow-hidden">
//                           <motion.div
//                             initial={{ width: 0 }}
//                             animate={{
//                               width: `${Math.min(
//                                 100,
//                                 (actualBalanceInput / selectedAccount.balance) *
//                                   100
//                               )}%`,
//                             }}
//                             transition={{ duration: 0.5, delay: 0.2 }}
//                             className={`h-full rounded-lg ${
//                               isBalanced
//                                 ? "bg-gradient-to-r from-emerald-500 to-teal-500"
//                                 : actualBalanceInput > selectedAccount.balance
//                                 ? "bg-gradient-to-r from-purple-500 to-pink-500"
//                                 : "bg-gradient-to-r from-purple-500 to-purple-600"
//                             }`}
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     {!isBalanced && (
//                       <div
//                         className={`mt-4 p-3 rounded-lg flex items-center justify-between ${
//                           hasLargeVariance ? "bg-red-100" : "bg-amber-100"
//                         }`}
//                       >
//                         <div className="flex items-center gap-2">
//                           {currentVariance > 0 ? (
//                             <>
//                               <TrendingUp
//                                 className={`w-5 h-5 ${
//                                   hasLargeVariance
//                                     ? "text-red-600"
//                                     : "text-amber-600"
//                                 }`}
//                               />
//                               <span
//                                 className={`text-sm font-medium ${
//                                   hasLargeVariance
//                                     ? "text-red-700"
//                                     : "text-amber-700"
//                                 }`}
//                               >
//                                 Actual is{" "}
//                                 <strong>
//                                   {formatCurrency(
//                                     currentVariance,
//                                     selectedAccount.currency
//                                   )}
//                                 </strong>{" "}
//                                 MORE than expected
//                               </span>
//                             </>
//                           ) : (
//                             <>
//                               <TrendingDown
//                                 className={`w-5 h-5 ${
//                                   hasLargeVariance
//                                     ? "text-red-600"
//                                     : "text-amber-600"
//                                 }`}
//                               />
//                               <span
//                                 className={`text-sm font-medium ${
//                                   hasLargeVariance
//                                     ? "text-red-700"
//                                     : "text-amber-700"
//                                 }`}
//                               >
//                                 Actual is{" "}
//                                 <strong>
//                                   {formatCurrency(
//                                     Math.abs(currentVariance),
//                                     selectedAccount.currency
//                                   )}
//                                 </strong>{" "}
//                                 LESS than expected
//                               </span>
//                             </>
//                           )}
//                         </div>
//                         <span
//                           className={`text-xs font-bold px-2 py-1 rounded ${
//                             hasLargeVariance
//                               ? "bg-red-200 text-red-700"
//                               : "bg-amber-200 text-amber-700"
//                           }`}
//                         >
//                           {variancePercentage}%
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Transaction Breakdown */}
//             <div className="bg-white border-2 border-slate-200 shadow-lg overflow-hidden">
//               <button
//                 onClick={() => setShowBreakdown(!showBreakdown)}
//                 className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
//               >
//                 <div className="flex items-center gap-3">
//                   <Layers className="w-5 h-5 text-blue-600" />
//                   <span className="font-bold text-slate-900">
//                     Transaction Breakdown
//                   </span>
//                 </div>
//                 {showBreakdown ? (
//                   <ChevronUp className="w-5 h-5 text-slate-400" />
//                 ) : (
//                   <ChevronDown className="w-5 h-5 text-slate-400" />
//                 )}
//               </button>

//               <AnimatePresence>
//                 {showBreakdown && (
//                   <motion.div
//                     initial={{ height: 0, opacity: 0 }}
//                     animate={{ height: "auto", opacity: 1 }}
//                     exit={{ height: 0, opacity: 0 }}
//                     className="border-t-2 border-slate-100"
//                   >
//                     <div className="p-6">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         {/* Debits */}
//                         <div className="space-y-4">
//                           <h4 className="text-sm font-bold text-slate-700 uppercase flex items-center gap-2">
//                             <ArrowUpCircle className="w-4 h-4 text-emerald-600" />
//                             Debits (Money In)
//                           </h4>
//                           <div className="space-y-2">
//                             <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded">
//                               <span className="text-sm text-slate-600">
//                                 Expected
//                               </span>
//                               <span className="font-bold text-blue-700">
//                                 {formatCurrency(
//                                   transactionBreakdown.expectedDebits,
//                                   selectedAccount.currency
//                                 )}
//                               </span>
//                             </div>
//                             <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded">
//                               <span className="text-sm text-slate-600">
//                                 Actual
//                               </span>
//                               <span className="font-bold text-purple-700">
//                                 {formatCurrency(
//                                   transactionBreakdown.actualDebits,
//                                   selectedAccount.currency
//                                 )}
//                               </span>
//                             </div>
//                             <div
//                               className={`flex items-center justify-between p-3 rounded ${
//                                 Math.abs(
//                                   transactionBreakdown.expectedDebits -
//                                     transactionBreakdown.actualDebits
//                                 ) < 0.01
//                                   ? "bg-emerald-50 border border-emerald-200"
//                                   : "bg-amber-50 border border-amber-200"
//                               }`}
//                             >
//                               <span className="text-sm text-slate-600">
//                                 Variance
//                               </span>
//                               <span
//                                 className={`font-bold ${
//                                   Math.abs(
//                                     transactionBreakdown.expectedDebits -
//                                       transactionBreakdown.actualDebits
//                                   ) < 0.01
//                                     ? "text-emerald-700"
//                                     : "text-amber-700"
//                                 }`}
//                               >
//                                 {Math.abs(
//                                   transactionBreakdown.expectedDebits -
//                                     transactionBreakdown.actualDebits
//                                 ) < 0.01
//                                   ? "✓ Match"
//                                   : formatCurrency(
//                                       transactionBreakdown.actualDebits -
//                                         transactionBreakdown.expectedDebits,
//                                       selectedAccount.currency
//                                     )}
//                               </span>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Credits */}
//                         <div className="space-y-4">
//                           <h4 className="text-sm font-bold text-slate-700 uppercase flex items-center gap-2">
//                             <ArrowDownCircle className="w-4 h-4 text-red-600" />
//                             Credits (Money Out)
//                           </h4>
//                           <div className="space-y-2">
//                             <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded">
//                               <span className="text-sm text-slate-600">
//                                 Expected
//                               </span>
//                               <span className="font-bold text-blue-700">
//                                 {formatCurrency(
//                                   transactionBreakdown.expectedCredits,
//                                   selectedAccount.currency
//                                 )}
//                               </span>
//                             </div>
//                             <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded">
//                               <span className="text-sm text-slate-600">
//                                 Actual
//                               </span>
//                               <span className="font-bold text-purple-700">
//                                 {formatCurrency(
//                                   transactionBreakdown.actualCredits,
//                                   selectedAccount.currency
//                                 )}
//                               </span>
//                             </div>
//                             <div
//                               className={`flex items-center justify-between p-3 rounded ${
//                                 Math.abs(
//                                   transactionBreakdown.expectedCredits -
//                                     transactionBreakdown.actualCredits
//                                 ) < 0.01
//                                   ? "bg-emerald-50 border border-emerald-200"
//                                   : "bg-amber-50 border border-amber-200"
//                               }`}
//                             >
//                               <span className="text-sm text-slate-600">
//                                 Variance
//                               </span>
//                               <span
//                                 className={`font-bold ${
//                                   Math.abs(
//                                     transactionBreakdown.expectedCredits -
//                                       transactionBreakdown.actualCredits
//                                   ) < 0.01
//                                     ? "text-emerald-700"
//                                     : "text-amber-700"
//                                 }`}
//                               >
//                                 {Math.abs(
//                                   transactionBreakdown.expectedCredits -
//                                     transactionBreakdown.actualCredits
//                                 ) < 0.01
//                                   ? "✓ Match"
//                                   : formatCurrency(
//                                       transactionBreakdown.actualCredits -
//                                         transactionBreakdown.expectedCredits,
//                                       selectedAccount.currency
//                                     )}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Summary */}
//                       <div className="mt-6 p-4 bg-gradient-to-r from-slate-100 to-slate-50 border-2 border-slate-200 rounded-lg">
//                         <div className="grid grid-cols-3 gap-4 text-center">
//                           <div>
//                             <p className="text-xs text-slate-500 uppercase font-bold mb-1">
//                               Total Transactions
//                             </p>
//                             <p className="text-xl font-black text-slate-700">
//                               {balanceSummary.matchedCount +
//                                 balanceSummary.pendingCount +
//                                 balanceSummary.unmatchedCount}
//                             </p>
//                           </div>
//                           <div>
//                             <p className="text-xs text-slate-500 uppercase font-bold mb-1">
//                               Reconciled
//                             </p>
//                             <p className="text-xl font-black text-emerald-600">
//                               {balanceSummary.matchedCount}
//                               <span className="text-sm font-normal text-slate-400 ml-1">
//                                 ({matchRate}%)
//                               </span>
//                             </p>
//                           </div>
//                           <div>
//                             <p className="text-xs text-slate-500 uppercase font-bold mb-1">
//                               Remaining
//                             </p>
//                             <p className="text-xl font-black text-amber-600">
//                               {balanceSummary.pendingCount +
//                                 balanceSummary.unmatchedCount}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </motion.div>
//         )}

//         {/* ==================== SMART MATCH SUGGESTIONS ==================== */}
//         {matchSuggestions.length > 0 && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 border-2 border-purple-200 p-4 lg:p-6 shadow-lg"
//           >
//             <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
//                   <Sparkles className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-bold text-slate-900">
//                     Smart Match Suggestions
//                   </h3>
//                   <p className="text-sm text-slate-600">
//                     {matchSuggestions.length} potential matches •{" "}
//                     {highConfidenceMatches.length} high confidence
//                   </p>
//                 </div>
//               </div>
//               {highConfidenceMatches.length > 0 && (
//                 <button
//                   onClick={handleAcceptAllSuggestions}
//                   disabled={isSubmitting}
//                   className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
//                 >
//                   {isSubmitting ? (
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                   ) : (
//                     <Zap className="w-4 h-4" />
//                   )}
//                   Accept All High Confidence ({highConfidenceMatches.length})
//                 </button>
//               )}
//             </div>

//             <div className="space-y-3 max-h-80 overflow-y-auto">
//               {matchSuggestions.slice(0, 10).map((suggestion) => (
//                 <div
//                   key={`${suggestion.transactionId}-${suggestion.statementEntryId}`}
//                   className="bg-white border-2 border-purple-100 p-4 hover:border-purple-300 transition-all"
//                 >
//                   <div className="flex flex-col lg:flex-row lg:items-center gap-4">
//                     <div className="flex-1 bg-blue-50 p-3 border-l-4 border-blue-500">
//                       <p className="text-xs font-bold text-blue-700 uppercase mb-1">
//                         System Record
//                       </p>
//                       <p className="font-semibold text-slate-900 truncate">
//                         {suggestion.transaction.description}
//                       </p>
//                       <div className="flex items-center gap-4 mt-1 text-sm">
//                         <span className="font-bold text-blue-700">
//                           {getCurrencySymbol(suggestion.transaction.currency)}
//                           {suggestion.transaction.amount.toLocaleString()}
//                         </span>
//                         <span className="text-slate-500">
//                           {new Date(
//                             suggestion.transaction.transactionDate
//                           ).toLocaleDateString()}
//                         </span>
//                       </div>
//                     </div>

//                     <div className="flex items-center justify-center">
//                       <div
//                         className={`p-2 rounded-full ${
//                           suggestion.confidence >= 90
//                             ? "bg-emerald-100"
//                             : suggestion.confidence >= 70
//                             ? "bg-amber-100"
//                             : "bg-orange-100"
//                         }`}
//                       >
//                         <Link2
//                           className={`w-5 h-5 ${
//                             suggestion.confidence >= 90
//                               ? "text-emerald-600"
//                               : suggestion.confidence >= 70
//                               ? "text-amber-600"
//                               : "text-orange-600"
//                           }`}
//                         />
//                       </div>
//                     </div>

//                     <div className="flex-1 bg-purple-50 p-3 border-l-4 border-purple-500">
//                       <p className="text-xs font-bold text-purple-700 uppercase mb-1">
//                         Statement Entry
//                       </p>
//                       <p className="font-semibold text-slate-900 truncate">
//                         {suggestion.statementEntry.description}
//                       </p>
//                       <div className="flex items-center gap-4 mt-1 text-sm">
//                         <span className="font-bold text-purple-700">
//                           {getCurrencySymbol(suggestion.transaction.currency)}
//                           {suggestion.statementEntry.amount.toLocaleString()}
//                         </span>
//                         <span className="text-slate-500">
//                           {new Date(
//                             suggestion.statementEntry.date
//                           ).toLocaleDateString()}
//                         </span>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-2">
//                       <div
//                         className={`text-center px-3 py-2 rounded ${
//                           suggestion.confidence >= 90
//                             ? "bg-emerald-100"
//                             : suggestion.confidence >= 70
//                             ? "bg-amber-100"
//                             : "bg-orange-100"
//                         }`}
//                       >
//                         <p
//                           className={`text-lg font-black ${
//                             suggestion.confidence >= 90
//                               ? "text-emerald-700"
//                               : suggestion.confidence >= 70
//                               ? "text-amber-700"
//                               : "text-orange-700"
//                           }`}
//                         >
//                           {suggestion.confidence}%
//                         </p>
//                         <p className="text-xs font-medium text-slate-600">
//                           confidence
//                         </p>
//                       </div>
//                       <button
//                         onClick={() => handleAcceptMatch(suggestion)}
//                         disabled={isSubmitting}
//                         className="p-3 bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
//                       >
//                         <Check className="w-5 h-5" />
//                       </button>
//                       <button
//                         onClick={() =>
//                           setMatchSuggestions((prev) =>
//                             prev.filter(
//                               (s) =>
//                                 s.transactionId !== suggestion.transactionId ||
//                                 s.statementEntryId !==
//                                   suggestion.statementEntryId
//                             )
//                           )
//                         }
//                         className="p-3 bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors"
//                       >
//                         <X className="w-5 h-5" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             {matchSuggestions.length > 10 && (
//               <p className="text-center text-sm text-slate-500 mt-4">
//                 Showing 10 of {matchSuggestions.length} suggestions
//               </p>
//             )}
//           </motion.div>
//         )}

//         {/* ==================== FILTERS AND ACTIONS BAR ==================== */}
//         {selectedAccount && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="bg-white border-2 border-slate-200 p-4 lg:p-6 shadow-lg"
//           >
//             <div className="flex flex-wrap items-center gap-3 mb-4">
//               <div className="flex-1 min-w-[200px] max-w-md">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
//                   <input
//                     type="text"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     placeholder="Search transactions..."
//                     className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all"
//                   />
//                 </div>
//               </div>

//               <div className="flex border-2 border-slate-200 bg-slate-50">
//                 <button
//                   onClick={() => setViewMode("table")}
//                   className={`p-2.5 transition-colors ${
//                     viewMode === "table"
//                       ? "bg-blue-600 text-white"
//                       : "text-slate-600 hover:bg-slate-100"
//                   }`}
//                 >
//                   <List className="w-4 h-4" />
//                 </button>
//                 <button
//                   onClick={() => setViewMode("split")}
//                   className={`p-2.5 transition-colors ${
//                     viewMode === "split"
//                       ? "bg-blue-600 text-white"
//                       : "text-slate-600 hover:bg-slate-100"
//                   }`}
//                 >
//                   <Columns className="w-4 h-4" />
//                 </button>
//               </div>

//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className={`flex items-center gap-2 px-4 py-2.5 border-2 font-semibold transition-all ${
//                   showFilters
//                     ? "bg-blue-50 border-blue-300 text-blue-700"
//                     : "border-slate-200 text-slate-600 hover:border-slate-300"
//                 }`}
//               >
//                 <Filter className="w-4 h-4" />
//                 Filters
//                 {(statusFilter !== "all" || dateFrom || dateTo) && (
//                   <span className="w-2 h-2 bg-blue-600 rounded-full" />
//                 )}
//               </button>

//               <button
//                 onClick={() => setShowBulkModal(true)}
//                 disabled={selectedTransactions.size === 0}
//                 className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white font-semibold shadow-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <ListChecks className="w-4 h-4" />
//                 Bulk ({selectedTransactions.size})
//               </button>

//               <button
//                 onClick={handleAutoReconcile}
//                 disabled={balanceSummary.pendingCount === 0 || isSubmitting}
//                 className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isSubmitting ? (
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                 ) : (
//                   <Zap className="w-4 h-4" />
//                 )}
//                 Auto Match All
//               </button>

//               <button
//                 onClick={() => setShowCompleteModal(true)}
//                 disabled={
//                   balanceSummary.pendingCount > 0 || transactions.length === 0
//                 }
//                 className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <CheckCircle2 className="w-4 h-4" />
//                 Complete
//               </button>
//             </div>

//             <AnimatePresence>
//               {showFilters && (
//                 <motion.div
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: "auto" }}
//                   exit={{ opacity: 0, height: 0 }}
//                   className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t-2 border-slate-100"
//                 >
//                   <div>
//                     <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                       Status
//                     </label>
//                     <select
//                       value={statusFilter}
//                       onChange={(e) => {
//                         setStatusFilter(e.target.value as typeof statusFilter);
//                         setCurrentPage(1);
//                       }}
//                       className="w-full px-3 py-2.5 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all"
//                     >
//                       <option value="all">All Statuses</option>
//                       <option value="pending">Pending</option>
//                       <option value="matched">Matched</option>
//                       <option value="unmatched">Unmatched</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                       From Date
//                     </label>
//                     <input
//                       type="date"
//                       value={dateFrom}
//                       onChange={(e) => {
//                         setDateFrom(e.target.value);
//                         setCurrentPage(1);
//                       }}
//                       className="w-full px-3 py-2.5 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                       To Date
//                     </label>
//                     <input
//                       type="date"
//                       value={dateTo}
//                       onChange={(e) => {
//                         setDateTo(e.target.value);
//                         setCurrentPage(1);
//                       }}
//                       className="w-full px-3 py-2.5 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all"
//                     />
//                   </div>
//                   <div className="flex items-end">
//                     <button
//                       onClick={clearFilters}
//                       className="w-full px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
//                     >
//                       <RotateCcw className="w-4 h-4" />
//                       Clear Filters
//                     </button>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.div>
//         )}

//         {/* ==================== TRANSACTIONS TABLE ==================== */}
//         {selectedAccount && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//             className="bg-white/90 backdrop-blur-xl border-2 border-slate-200 shadow-2xl overflow-hidden"
//           >
//             <div className="p-4 lg:p-6 border-b-2 border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//               <div>
//                 <h3 className="text-lg lg:text-xl font-bold text-slate-900 flex items-center gap-2">
//                   <Banknote className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
//                   Transaction Details
//                 </h3>
//                 <p className="text-sm text-slate-600 mt-1">
//                   {totalTransactions} transactions • {selectedAccount.name}
//                 </p>
//               </div>
//               <div className="text-sm text-slate-600">
//                 Page {currentPage} of {totalPages || 1}
//               </div>
//             </div>

//             {isLoadingTransactions ? (
//               <div className="flex items-center justify-center py-20">
//                 <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
//                 <span className="ml-3 text-slate-600">
//                   Loading transactions...
//                 </span>
//               </div>
//             ) : filteredTransactions.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-20 text-slate-500">
//                 <FileText className="w-16 h-16 mb-4 text-slate-300" />
//                 <p className="text-lg font-medium">No transactions found</p>
//                 <p className="text-sm">Try adjusting your filters</p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-700 text-white">
//                     <tr>
//                       <th className="px-4 py-4 text-center w-12">
//                         <button
//                           onClick={handleSelectAll}
//                           className="p-1 hover:bg-white/20 transition rounded"
//                         >
//                           {selectedTransactions.size ===
//                             filteredTransactions.filter(
//                               (t) =>
//                                 t.reconciliationStatus ===
//                                 ReconciliationStatus.Pending
//                             ).length &&
//                           filteredTransactions.filter(
//                             (t) =>
//                               t.reconciliationStatus ===
//                               ReconciliationStatus.Pending
//                           ).length > 0 ? (
//                             <CheckSquare className="w-5 h-5" />
//                           ) : (
//                             <Square className="w-5 h-5 opacity-60" />
//                           )}
//                         </button>
//                       </th>
//                       <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">
//                         Date
//                       </th>
//                       <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">
//                         Reference
//                       </th>
//                       <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">
//                         Description
//                       </th>
//                       <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider">
//                         Type
//                       </th>
//                       <th className="px-4 py-4 text-right text-xs font-bold uppercase tracking-wider">
//                         Expected
//                       </th>
//                       <th className="px-4 py-4 text-right text-xs font-bold uppercase tracking-wider">
//                         Actual
//                       </th>
//                       <th className="px-4 py-4 text-right text-xs font-bold uppercase tracking-wider">
//                         Variance
//                       </th>
//                       <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider">
//                         Status
//                       </th>
//                       <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-200">
//                     {filteredTransactions.map((txn, index) => (
//                       <motion.tr
//                         key={txn.id}
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: index * 0.02 }}
//                         className={`hover:bg-blue-50/50 transition-colors ${
//                           selectedTransactions.has(txn.id) ? "bg-blue-50" : ""
//                         }`}
//                       >
//                         <td className="px-4 py-4 text-center">
//                           {txn.reconciliationStatus ===
//                             ReconciliationStatus.Pending && (
//                             <button
//                               onClick={() => handleSelectTransaction(txn.id)}
//                               className="p-1 hover:bg-slate-200 transition rounded"
//                             >
//                               {selectedTransactions.has(txn.id) ? (
//                                 <CheckSquare className="w-5 h-5 text-blue-600" />
//                               ) : (
//                                 <Square className="w-5 h-5 text-slate-400" />
//                               )}
//                             </button>
//                           )}
//                         </td>
//                         <td className="px-4 py-4 whitespace-nowrap">
//                           <div className="flex items-center gap-2">
//                             <Calendar className="w-4 h-4 text-slate-400" />
//                             <span className="text-sm font-medium text-slate-900">
//                               {new Date(txn.transactionDate).toLocaleDateString(
//                                 "en-US",
//                                 { month: "short", day: "numeric" }
//                               )}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-4 py-4 whitespace-nowrap">
//                           <span className="text-sm font-mono text-blue-600 font-semibold">
//                             {txn.reference || txn.code}
//                           </span>
//                         </td>
//                         <td className="px-4 py-4">
//                           <span className="text-sm text-slate-900 font-medium line-clamp-1 max-w-xs">
//                             {txn.description}
//                           </span>
//                         </td>
//                         <td className="px-4 py-4 text-center">
//                           {txn.transactionType === TransactionType.Debit ? (
//                             <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold">
//                               <ArrowUpCircle className="w-3 h-3" />
//                               DR
//                             </span>
//                           ) : (
//                             <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-bold">
//                               <ArrowDownCircle className="w-3 h-3" />
//                               CR
//                             </span>
//                           )}
//                         </td>
//                         <td className="px-4 py-4 text-right whitespace-nowrap">
//                           <span className="text-sm font-bold text-slate-900">
//                             {getCurrencySymbol(txn.currency)}
//                             {txn.amount.toLocaleString("en-US", {
//                               minimumFractionDigits: 2,
//                             })}
//                           </span>
//                         </td>
//                         <td className="px-4 py-4 text-right whitespace-nowrap">
//                           {txn.actualAmount !== null ? (
//                             <span className="text-sm font-bold text-purple-700">
//                               {getCurrencySymbol(txn.currency)}
//                               {txn.actualAmount.toLocaleString("en-US", {
//                                 minimumFractionDigits: 2,
//                               })}
//                             </span>
//                           ) : (
//                             <span className="text-slate-400">-</span>
//                           )}
//                         </td>
//                         <td className="px-4 py-4 text-right whitespace-nowrap">
//                           {txn.variance !== null ? (
//                             Math.abs(txn.variance) < 0.01 ? (
//                               <span className="text-sm font-bold text-emerald-600">
//                                 ✓
//                               </span>
//                             ) : (
//                               <span className="text-sm font-bold text-red-600">
//                                 {txn.variance >= 0 ? "+" : ""}
//                                 {txn.variance.toLocaleString()}
//                               </span>
//                             )
//                           ) : (
//                             <span className="text-slate-400">-</span>
//                           )}
//                         </td>
//                         <td className="px-4 py-4 text-center">
//                           <StatusBadge status={txn.reconciliationStatus} />
//                         </td>
//                         <td className="px-4 py-4 text-center">
//                           <div className="flex items-center justify-center gap-1">
//                             <button
//                               onClick={() => {
//                                 setSelectedTransaction(txn);
//                                 setShowDetailModal(true);
//                               }}
//                               className="p-2 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all"
//                             >
//                               <Eye className="w-4 h-4" />
//                             </button>
//                             {txn.reconciliationStatus ===
//                               ReconciliationStatus.Pending && (
//                               <>
//                                 <button
//                                   onClick={() => handleQuickMatch(txn)}
//                                   disabled={isSubmitting}
//                                   className="p-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-all disabled:opacity-50"
//                                 >
//                                   <Check className="w-4 h-4" />
//                                 </button>
//                                 <button
//                                   onClick={() => {
//                                     setSelectedTransaction(txn);
//                                     setReconcileForm({
//                                       actualAmount: txn.amount,
//                                       status: ReconciliationStatus.Matched,
//                                       notes: "",
//                                     });
//                                     setShowReconcileModal(true);
//                                   }}
//                                   className="p-2 bg-amber-100 text-amber-700 hover:bg-amber-200 transition-all"
//                                 >
//                                   <AlertCircle className="w-4 h-4" />
//                                 </button>
//                               </>
//                             )}
//                           </div>
//                         </td>
//                       </motion.tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}

//             {totalPages > 1 && (
//               <div className="flex items-center justify-between px-6 py-4 border-t-2 border-slate-200 bg-slate-50">
//                 <div className="text-sm text-slate-600 font-medium">
//                   Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
//                   {Math.min(currentPage * itemsPerPage, totalTransactions)} of{" "}
//                   {totalTransactions}
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                     disabled={currentPage === 1}
//                     className="p-2 border-2 border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronLeft className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={() =>
//                       setCurrentPage((p) => Math.min(totalPages, p + 1))
//                     }
//                     disabled={currentPage === totalPages}
//                     className="p-2 border-2 border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronRight className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </motion.div>
//         )}

//         {/* No Account Selected */}
//         {!selectedAccount && accounts.length > 0 && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-white border-2 border-slate-200 p-12 text-center shadow-lg"
//           >
//             <div className="w-20 h-20 bg-blue-100 flex items-center justify-center mx-auto mb-6">
//               <Target className="w-10 h-10 text-blue-600" />
//             </div>
//             <h3 className="text-xl font-bold text-slate-900 mb-2">
//               Select an Account to Reconcile
//             </h3>
//             <p className="text-slate-600 max-w-md mx-auto">
//               Choose an account from the dropdown above to view and reconcile
//               its transactions.
//             </p>
//           </motion.div>
//         )}
//       </div>

//       {/* ==================== MODALS ==================== */}

//       {/* Adjustment Modal */}
//       <AnimatePresence>
//         {showAdjustmentForm && selectedAccount && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowAdjustmentForm(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white shadow-2xl max-w-md w-full overflow-hidden rounded-lg"
//             >
//               <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-white/20 flex items-center justify-center rounded-lg">
//                       <Calculator className="w-5 h-5" />
//                     </div>
//                     <div>
//                       <h3 className="text-xl font-bold">
//                         Create Adjustment Entry
//                       </h3>
//                       <p className="text-amber-100 text-sm">
//                         Balance the variance
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => setShowAdjustmentForm(false)}
//                     className="p-2 hover:bg-white/20 rounded-lg transition-colors"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//               <div className="p-6 space-y-4">
//                 <div className="bg-amber-50 border-2 border-amber-200 p-4 rounded-lg">
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-amber-700">
//                       Variance to adjust:
//                     </span>
//                     <span className="text-xl font-bold text-amber-700">
//                       {currentVariance >= 0 ? "+" : ""}
//                       {formatCurrency(
//                         currentVariance,
//                         selectedAccount.currency
//                       )}
//                     </span>
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                     Adjustment Description *
//                   </label>
//                   <textarea
//                     value={adjustmentNote}
//                     onChange={(e) => setAdjustmentNote(e.target.value)}
//                     placeholder="e.g., Bank charges not recorded, Interest income, etc."
//                     rows={3}
//                     className="w-full px-4 py-3 border-2 border-slate-200 focus:border-amber-500 focus:outline-none rounded-lg transition-all resize-none"
//                   />
//                 </div>
//                 <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg">
//                   <div className="flex items-start gap-2">
//                     <Info className="w-4 h-4 text-blue-600 mt-0.5" />
//                     <p className="text-sm text-blue-700">
//                       This will create a{" "}
//                       {currentVariance > 0 ? "credit" : "debit"} entry of{" "}
//                       <strong>
//                         {formatCurrency(
//                           Math.abs(currentVariance),
//                           selectedAccount.currency
//                         )}
//                       </strong>{" "}
//                       to balance your account.
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex gap-3 pt-4 border-t-2 border-slate-100">
//                   <button
//                     onClick={() => setShowAdjustmentForm(false)}
//                     className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-colors rounded-lg"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={() => {
//                       if (adjustmentNote.trim())
//                         handleCreateAdjustment(currentVariance, adjustmentNote);
//                     }}
//                     disabled={!adjustmentNote.trim()}
//                     className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:shadow-lg transition-all rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                   >
//                     <Check className="w-4 h-4" />
//                     Create Adjustment
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Statement Upload Modal */}
//       <AnimatePresence>
//         {showStatementUpload && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowStatementUpload(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white shadow-2xl max-w-lg w-full overflow-hidden"
//             >
//               <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 bg-white/20 flex items-center justify-center">
//                       <Upload className="w-6 h-6" />
//                     </div>
//                     <div>
//                       <h3 className="text-xl font-bold">
//                         Upload Bank Statement
//                       </h3>
//                       <p className="text-purple-100 text-sm">
//                         CSV format supported
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => setShowStatementUpload(false)}
//                     className="p-2 hover:bg-white/20 transition-colors"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//               <div className="p-6 space-y-4">
//                 <div
//                   className="border-2 border-dashed border-purple-300 p-8 text-center bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer"
//                   onClick={() => fileInputRef.current?.click()}
//                 >
//                   <FileSpreadsheet className="w-12 h-12 text-purple-400 mx-auto mb-4" />
//                   <p className="text-slate-900 font-semibold mb-1">
//                     Drop your CSV file here
//                   </p>
//                   <p className="text-sm text-slate-500">or click to browse</p>
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept=".csv"
//                     onChange={handleFileUpload}
//                     className="hidden"
//                   />
//                 </div>
//                 <div className="bg-blue-50 border-2 border-blue-200 p-4">
//                   <p className="text-sm font-bold text-blue-800 mb-2">
//                     Supported CSV Format:
//                   </p>
//                   <ul className="text-xs text-blue-700 space-y-1">
//                     <li>
//                       • Columns: Date, Description, Debit, Credit (or Amount)
//                     </li>
//                     <li>• Optional: Reference, Balance</li>
//                     <li>• First row should be headers</li>
//                   </ul>
//                 </div>
//                 {statementEntries.length > 0 && (
//                   <div className="bg-emerald-50 border-2 border-emerald-200 p-4">
//                     <p className="text-sm font-bold text-emerald-800">
//                       ✓ {statementEntries.length} entries loaded •{" "}
//                       {unmatchedStatementEntries.length} unmatched
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Keyboard Shortcuts Modal */}
//       <AnimatePresence>
//         {showKeyboardShortcuts && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowKeyboardShortcuts(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white shadow-2xl max-w-md w-full overflow-hidden"
//             >
//               <div className="bg-slate-800 p-6 text-white">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <Keyboard className="w-6 h-6" />
//                     <h3 className="text-xl font-bold">Keyboard Shortcuts</h3>
//                   </div>
//                   <button
//                     onClick={() => setShowKeyboardShortcuts(false)}
//                     className="p-2 hover:bg-white/20"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//               <div className="p-6 space-y-3">
//                 {[
//                   { key: "R", action: "Refresh data" },
//                   { key: "U", action: "Upload statement" },
//                   { key: "A", action: "Auto-match all" },
//                   { key: "Esc", action: "Close modals" },
//                   { key: "Shift + ?", action: "Show shortcuts" },
//                 ].map(({ key, action }) => (
//                   <div
//                     key={key}
//                     className="flex items-center justify-between py-2 border-b border-slate-100"
//                   >
//                     <span className="text-slate-600">{action}</span>
//                     <kbd className="px-3 py-1 bg-slate-100 border border-slate-300 text-sm font-mono rounded">
//                       {key}
//                     </kbd>
//                   </div>
//                 ))}
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Reconcile Transaction Modal */}
//       <AnimatePresence>
//         {showReconcileModal && selectedTransaction && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowReconcileModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white shadow-2xl max-w-lg w-full overflow-hidden"
//             >
//               <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 p-6 text-white">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-white/20 flex items-center justify-center">
//                       <Scale className="w-5 h-5" />
//                     </div>
//                     <div>
//                       <h3 className="text-xl font-bold">
//                         Reconcile Transaction
//                       </h3>
//                       <p className="text-blue-100 text-sm">
//                         {selectedTransaction.code}
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => setShowReconcileModal(false)}
//                     className="p-2 hover:bg-white/20"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//               <div className="p-6 space-y-4">
//                 <div className="bg-slate-50 border-2 border-slate-200 p-4">
//                   <p className="text-xs font-bold text-slate-500 uppercase mb-1">
//                     Description
//                   </p>
//                   <p className="text-lg font-semibold text-slate-900">
//                     {selectedTransaction.description}
//                   </p>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-blue-50 border-2 border-blue-200 p-4">
//                     <p className="text-xs font-bold text-blue-700 uppercase mb-1">
//                       Expected
//                     </p>
//                     <p className="text-2xl font-bold text-blue-700">
//                       {getCurrencySymbol(selectedTransaction.currency)}
//                       {selectedTransaction.amount.toLocaleString()}
//                     </p>
//                   </div>
//                   <div className="bg-slate-50 border-2 border-slate-200 p-4">
//                     <p className="text-xs font-bold text-slate-500 uppercase mb-1">
//                       Date
//                     </p>
//                     <p className="text-lg font-semibold text-slate-900">
//                       {new Date(
//                         selectedTransaction.transactionDate
//                       ).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                     Actual Amount *
//                   </label>
//                   <input
//                     type="number"
//                     value={reconcileForm.actualAmount || ""}
//                     onChange={(e) =>
//                       setReconcileForm({
//                         ...reconcileForm,
//                         actualAmount: parseFloat(e.target.value) || 0,
//                       })
//                     }
//                     placeholder="Enter actual amount"
//                     step="0.01"
//                     className="w-full px-4 py-3 border-2 border-slate-300 focus:border-blue-500 focus:outline-none text-lg font-bold transition-all"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                     Status *
//                   </label>
//                   <div className="flex gap-4">
//                     <label className="flex items-center gap-2 cursor-pointer p-3 border-2 rounded transition-all flex-1 justify-center hover:bg-emerald-50 hover:border-emerald-300">
//                       <input
//                         type="radio"
//                         checked={
//                           reconcileForm.status === ReconciliationStatus.Matched
//                         }
//                         onChange={() =>
//                           setReconcileForm({
//                             ...reconcileForm,
//                             status: ReconciliationStatus.Matched,
//                           })
//                         }
//                         className="w-4 h-4 text-emerald-600"
//                       />
//                       <CheckCircle2 className="w-4 h-4 text-emerald-600" />
//                       <span className="text-sm font-bold">Matched</span>
//                     </label>
//                     <label className="flex items-center gap-2 cursor-pointer p-3 border-2 rounded transition-all flex-1 justify-center hover:bg-red-50 hover:border-red-300">
//                       <input
//                         type="radio"
//                         checked={
//                           reconcileForm.status ===
//                           ReconciliationStatus.Unmatched
//                         }
//                         onChange={() =>
//                           setReconcileForm({
//                             ...reconcileForm,
//                             status: ReconciliationStatus.Unmatched,
//                           })
//                         }
//                         className="w-4 h-4 text-red-600"
//                       />
//                       <AlertTriangle className="w-4 h-4 text-red-600" />
//                       <span className="text-sm font-bold">Unmatched</span>
//                     </label>
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
//                     Notes
//                   </label>
//                   <textarea
//                     value={reconcileForm.notes}
//                     onChange={(e) =>
//                       setReconcileForm({
//                         ...reconcileForm,
//                         notes: e.target.value,
//                       })
//                     }
//                     placeholder="Optional notes..."
//                     rows={2}
//                     className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all resize-none"
//                   />
//                 </div>
//                 {reconcileForm.actualAmount > 0 && (
//                   <div
//                     className={`p-4 border-2 ${
//                       Math.abs(
//                         reconcileForm.actualAmount - selectedTransaction.amount
//                       ) < 0.01
//                         ? "bg-emerald-50 border-emerald-200"
//                         : "bg-red-50 border-red-200"
//                     }`}
//                   >
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm font-bold text-slate-700">
//                         Variance:
//                       </span>
//                       <span
//                         className={`text-lg font-bold ${
//                           Math.abs(
//                             reconcileForm.actualAmount -
//                               selectedTransaction.amount
//                           ) < 0.01
//                             ? "text-emerald-600"
//                             : "text-red-600"
//                         }`}
//                       >
//                         {Math.abs(
//                           reconcileForm.actualAmount -
//                             selectedTransaction.amount
//                         ) < 0.01
//                           ? "✓ Matched"
//                           : `${getCurrencySymbol(
//                               selectedTransaction.currency
//                             )}${(
//                               reconcileForm.actualAmount -
//                               selectedTransaction.amount
//                             ).toLocaleString()}`}
//                       </span>
//                     </div>
//                   </div>
//                 )}
//                 <div className="flex gap-3 pt-4 border-t-2 border-slate-200">
//                   <button
//                     onClick={() => setShowReconcileModal(false)}
//                     className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleReconcileTransaction}
//                     disabled={isSubmitting || reconcileForm.actualAmount <= 0}
//                     className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
//                   >
//                     {isSubmitting ? (
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                     ) : (
//                       <Save className="w-4 h-4" />
//                     )}
//                     Save
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Bulk Reconcile Modal */}
//       <AnimatePresence>
//         {showBulkModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowBulkModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white shadow-2xl max-w-md w-full overflow-hidden"
//             >
//               <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-white/20 flex items-center justify-center">
//                       <ListChecks className="w-5 h-5" />
//                     </div>
//                     <h3 className="text-xl font-bold">Bulk Reconciliation</h3>
//                   </div>
//                   <button
//                     onClick={() => setShowBulkModal(false)}
//                     className="p-2 hover:bg-white/20"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//               <div className="p-6 space-y-4">
//                 <div className="bg-purple-50 border-2 border-purple-200 p-4">
//                   <p className="text-sm text-purple-900">
//                     <strong>{selectedTransactions.size}</strong> transactions
//                     selected
//                   </p>
//                 </div>
//                 <div className="space-y-3">
//                   <button
//                     onClick={() =>
//                       handleBulkReconcile(ReconciliationStatus.Matched)
//                     }
//                     disabled={isSubmitting}
//                     className="w-full px-4 py-4 bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
//                   >
//                     {isSubmitting ? (
//                       <Loader2 className="w-5 h-5 animate-spin" />
//                     ) : (
//                       <CheckCircle2 className="w-5 h-5" />
//                     )}
//                     Mark All as Matched
//                   </button>
//                   <button
//                     onClick={() =>
//                       handleBulkReconcile(ReconciliationStatus.Unmatched)
//                     }
//                     disabled={isSubmitting}
//                     className="w-full px-4 py-4 bg-red-600 text-white font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
//                   >
//                     {isSubmitting ? (
//                       <Loader2 className="w-5 h-5 animate-spin" />
//                     ) : (
//                       <AlertTriangle className="w-5 h-5" />
//                     )}
//                     Mark All as Unmatched
//                   </button>
//                 </div>
//                 <button
//                   onClick={() => setShowBulkModal(false)}
//                   className="w-full px-4 py-3 bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-colors"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Complete Reconciliation Modal */}
//       <AnimatePresence>
//         {showCompleteModal && selectedAccount && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowCompleteModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white shadow-2xl max-w-lg w-full overflow-hidden"
//             >
//               <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 p-6 text-white">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-white/20 flex items-center justify-center">
//                       <ShieldCheck className="w-5 h-5" />
//                     </div>
//                     <div>
//                       <h3 className="text-xl font-bold">
//                         Complete Reconciliation
//                       </h3>
//                       <p className="text-blue-100 text-sm">
//                         {selectedAccount.name}
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => setShowCompleteModal(false)}
//                     className="p-2 hover:bg-white/20"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//               <div className="p-6 space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-blue-50 border-2 border-blue-200 p-4">
//                     <p className="text-xs font-bold text-blue-700 uppercase mb-1">
//                       Expected
//                     </p>
//                     <p className="text-xl font-bold text-blue-700">
//                       {getCurrencySymbol(selectedAccount.currency)}
//                       {selectedAccount.balance.toLocaleString()}
//                     </p>
//                   </div>
//                   <div className="bg-purple-50 border-2 border-purple-200 p-4">
//                     <p className="text-xs font-bold text-purple-700 uppercase mb-1">
//                       Actual
//                     </p>
//                     <p className="text-xl font-bold text-purple-700">
//                       {getCurrencySymbol(selectedAccount.currency)}
//                       {actualBalanceInput.toLocaleString()}
//                     </p>
//                   </div>
//                 </div>
//                 <div
//                   className={`p-4 border-2 ${
//                     isBalanced
//                       ? "bg-emerald-50 border-emerald-200"
//                       : "bg-red-50 border-red-200"
//                   }`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm font-bold text-slate-700">
//                       Variance:
//                     </span>
//                     <span
//                       className={`text-xl font-bold ${
//                         isBalanced ? "text-emerald-600" : "text-red-600"
//                       }`}
//                     >
//                       {isBalanced
//                         ? "✓ Balanced"
//                         : `${getCurrencySymbol(
//                             selectedAccount.currency
//                           )}${currentVariance.toLocaleString()}`}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="bg-slate-50 border-2 border-slate-200 p-4 space-y-2">
//                   <div className="flex justify-between">
//                     <span className="text-sm text-slate-600">Matched:</span>
//                     <span className="text-sm font-bold text-emerald-600">
//                       {balanceSummary.matchedCount}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-slate-600">Unmatched:</span>
//                     <span className="text-sm font-bold text-red-600">
//                       {balanceSummary.unmatchedCount}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-slate-600">Pending:</span>
//                     <span className="text-sm font-bold text-amber-600">
//                       {balanceSummary.pendingCount}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex gap-3 pt-4 border-t-2 border-slate-200">
//                   <button
//                     onClick={() => setShowCompleteModal(false)}
//                     className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleCompleteReconciliation}
//                     disabled={isSubmitting}
//                     className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
//                   >
//                     {isSubmitting ? (
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                     ) : (
//                       <CheckCircle2 className="w-4 h-4" />
//                     )}
//                     Complete
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Detail Modal */}
//       <AnimatePresence>
//         {showDetailModal && selectedTransaction && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowDetailModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
//             >
//               <div
//                 className={`p-6 text-white ${
//                   selectedTransaction.reconciliationStatus ===
//                   ReconciliationStatus.Matched
//                     ? "bg-gradient-to-r from-emerald-600 to-teal-600"
//                     : selectedTransaction.reconciliationStatus ===
//                       ReconciliationStatus.Unmatched
//                     ? "bg-gradient-to-r from-red-600 to-rose-600"
//                     : "bg-gradient-to-r from-amber-500 to-orange-500"
//                 }`}
//               >
//                 <div className="flex items-start justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 bg-white/20 flex items-center justify-center">
//                       <Banknote className="w-6 h-6" />
//                     </div>
//                     <div>
//                       <h3 className="text-2xl font-bold">
//                         Transaction Details
//                       </h3>
//                       <p className="text-white/80 text-sm font-mono">
//                         {selectedTransaction.code}
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => setShowDetailModal(false)}
//                     className="p-2 hover:bg-white/20"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//               <div className="p-6 space-y-4 overflow-y-auto flex-1">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-slate-50 border-2 border-slate-200 p-4">
//                     <p className="text-xs font-bold text-slate-500 uppercase mb-1">
//                       Date
//                     </p>
//                     <p className="text-lg font-bold text-slate-900">
//                       {new Date(
//                         selectedTransaction.transactionDate
//                       ).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <div className="bg-slate-50 border-2 border-slate-200 p-4">
//                     <p className="text-xs font-bold text-slate-500 uppercase mb-1">
//                       Reference
//                     </p>
//                     <p className="text-lg font-bold text-blue-600 font-mono">
//                       {selectedTransaction.reference ||
//                         selectedTransaction.code}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="bg-slate-50 border-2 border-slate-200 p-4">
//                   <p className="text-xs font-bold text-slate-500 uppercase mb-1">
//                     Description
//                   </p>
//                   <p className="text-lg font-semibold text-slate-900">
//                     {selectedTransaction.description}
//                   </p>
//                 </div>
//                 <div className="grid grid-cols-3 gap-4">
//                   <div className="bg-blue-50 border-2 border-blue-200 p-4">
//                     <p className="text-xs font-bold text-blue-700 uppercase mb-1">
//                       Expected
//                     </p>
//                     <p className="text-2xl font-bold text-blue-700">
//                       {getCurrencySymbol(selectedTransaction.currency)}
//                       {selectedTransaction.amount.toLocaleString()}
//                     </p>
//                   </div>
//                   <div className="bg-purple-50 border-2 border-purple-200 p-4">
//                     <p className="text-xs font-bold text-purple-700 uppercase mb-1">
//                       Actual
//                     </p>
//                     <p
//                       className={`text-2xl font-bold ${
//                         selectedTransaction.actualAmount !== null
//                           ? "text-purple-700"
//                           : "text-slate-400"
//                       }`}
//                     >
//                       {selectedTransaction.actualAmount !== null
//                         ? `${getCurrencySymbol(
//                             selectedTransaction.currency
//                           )}${selectedTransaction.actualAmount.toLocaleString()}`
//                         : "Not Set"}
//                     </p>
//                   </div>
//                   <div
//                     className={`p-4 border-2 ${
//                       selectedTransaction.actualAmount === null
//                         ? "bg-slate-50 border-slate-200"
//                         : selectedTransaction.variance !== null &&
//                           Math.abs(selectedTransaction.variance) < 0.01
//                         ? "bg-emerald-50 border-emerald-200"
//                         : "bg-red-50 border-red-200"
//                     }`}
//                   >
//                     <p className="text-xs font-bold text-slate-700 uppercase mb-1">
//                       Variance
//                     </p>
//                     <p
//                       className={`text-2xl font-bold ${
//                         selectedTransaction.actualAmount === null
//                           ? "text-slate-400"
//                           : selectedTransaction.variance !== null &&
//                             Math.abs(selectedTransaction.variance) < 0.01
//                           ? "text-emerald-600"
//                           : "text-red-600"
//                       }`}
//                     >
//                       {selectedTransaction.actualAmount !== null
//                         ? selectedTransaction.variance !== null &&
//                           Math.abs(selectedTransaction.variance) < 0.01
//                           ? "✓ Match"
//                           : `${getCurrencySymbol(
//                               selectedTransaction.currency
//                             )}${(
//                               selectedTransaction.variance || 0
//                             ).toLocaleString()}`
//                         : "-"}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="bg-slate-50 border-2 border-slate-200 p-4">
//                     <p className="text-xs font-bold text-slate-500 uppercase mb-2">
//                       Type
//                     </p>
//                     {selectedTransaction.transactionType ===
//                     TransactionType.Debit ? (
//                       <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 font-bold">
//                         <ArrowUpCircle className="w-5 h-5" />
//                         DEBIT
//                       </span>
//                     ) : (
//                       <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 font-bold">
//                         <ArrowDownCircle className="w-5 h-5" />
//                         CREDIT
//                       </span>
//                     )}
//                   </div>
//                   <div className="bg-slate-50 border-2 border-slate-200 p-4">
//                     <p className="text-xs font-bold text-slate-500 uppercase mb-2">
//                       Status
//                     </p>
//                     <StatusBadge
//                       status={selectedTransaction.reconciliationStatus}
//                     />
//                   </div>
//                 </div>
//                 {selectedTransaction.reconciliationNotes && (
//                   <div className="bg-amber-50 border-2 border-amber-200 p-4">
//                     <p className="text-xs font-bold text-amber-700 uppercase mb-1">
//                       Notes
//                     </p>
//                     <p className="text-sm text-amber-900">
//                       {selectedTransaction.reconciliationNotes}
//                     </p>
//                   </div>
//                 )}
//               </div>
//               <div className="p-4 border-t-2 border-slate-200 bg-slate-50">
//                 <button
//                   onClick={() => setShowDetailModal(false)}
//                   className="w-full px-4 py-3 bg-slate-700 text-white font-bold hover:bg-slate-800 transition-colors"
//                 >
//                   Close
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* History Modal */}
//       <AnimatePresence>
//         {showHistoryModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setShowHistoryModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.95, y: 20 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col"
//             >
//               <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-700 p-6 text-white">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-white/20 flex items-center justify-center">
//                       <FileText className="w-5 h-5" />
//                     </div>
//                     <div>
//                       <h3 className="text-xl font-bold">
//                         Reconciliation History
//                       </h3>
//                       <p className="text-slate-300 text-sm">
//                         {getAccountTypeLabel(selectedAccountType)} accounts
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => setShowHistoryModal(false)}
//                     className="p-2 hover:bg-white/20"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//               <div className="p-6 overflow-y-auto flex-1">
//                 {reconciliationHistory?.length === 0 ? (
//                   <div className="text-center py-12 text-slate-500">
//                     <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
//                     <p className="text-lg font-medium">
//                       No reconciliation history
//                     </p>
//                     <p className="text-sm">
//                       Complete a reconciliation to see records here
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     {reconciliationHistory?.map((rec) => (
//                       <div
//                         key={rec.id}
//                         className={`p-4 border-2 ${
//                           rec.status === ReconciliationStatus.Matched
//                             ? "bg-emerald-50 border-emerald-200"
//                             : rec.status === ReconciliationStatus.Unmatched
//                             ? "bg-red-50 border-red-200"
//                             : "bg-amber-50 border-amber-200"
//                         }`}
//                       >
//                         <div className="flex items-start justify-between">
//                           <div>
//                             <p className="font-bold text-slate-900">
//                               {rec.accountName}
//                             </p>
//                             <p className="text-sm text-slate-600">
//                               {new Date(rec.createdAt).toLocaleString()}
//                             </p>
//                           </div>
//                           <StatusBadge status={rec.status} />
//                         </div>
//                         <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
//                           <div>
//                             <p className="text-slate-500">Expected</p>
//                             <p className="font-bold">
//                               {getCurrencySymbol(rec.currency)}
//                               {rec.expectedBalance.toLocaleString()}
//                             </p>
//                           </div>
//                           <div>
//                             <p className="text-slate-500">Actual</p>
//                             <p className="font-bold">
//                               {getCurrencySymbol(rec.currency)}
//                               {rec.actualBalance.toLocaleString()}
//                             </p>
//                           </div>
//                           <div>
//                             <p className="text-slate-500">Variance</p>
//                             <p
//                               className={`font-bold ${
//                                 Math.abs(rec.variance) < 0.01
//                                   ? "text-emerald-600"
//                                   : "text-red-600"
//                               }`}
//                             >
//                               {Math.abs(rec.variance) < 0.01
//                                 ? "✓ Balanced"
//                                 : `${getCurrencySymbol(
//                                     rec.currency
//                                   )}${rec.variance.toLocaleString()}`}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//               <div className="p-4 border-t-2 border-slate-200 bg-slate-50">
//                 <button
//                   onClick={() => setShowHistoryModal(false)}
//                   className="w-full px-4 py-3 bg-slate-700 text-white font-bold hover:bg-slate-800 transition-colors"
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
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Smartphone,
  DollarSign,
  Calendar,
  FileText,
  Download,
  Search,
  Filter,
  RefreshCw,
  Eye,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Check,
  X,
  Clock,
  Building2,
  Wallet,
  Banknote,
  ArrowUpCircle,
  ArrowDownCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
  ListChecks,
  Save,
  RotateCcw,
  Info,
  Scale,
  ShieldCheck,
  Target,
  Zap,
  Upload,
  FileSpreadsheet,
  Link2,
  Sparkles,
  BarChart3,
  Layers,
  Keyboard,
  ChevronDown,
  ChevronUp,
  Percent,
  List,
  Columns,
  Lock,
  Unlock,
  Edit3,
  Calculator,
  History,
} from "lucide-react";
import { toast } from "sonner";

// ==================== IMPORT FROM api.ts ====================
import {
  AccountType,
  Currency,
  TransactionType,
  ReconciliationStatus,
  AccountReconciliationSummaryDto,
  TransactionReconciliationDto,
  AccountReconciliationBalanceDto,
  ReconcileTransactionDto,
  BulkReconcileDto,
  CreateReconciliationDto,
  ReconciliationResponseDto,
  ReconciliationFilterDto,
  getReconciliationAccounts,
  getAccountTransactionsForReconciliation,
  getAccountReconciliationSummary,
  reconcileTransaction,
  bulkReconcileTransactions,
  createReconciliationRecord,
  getReconciliationHistory,
  getCurrencyLabel,
  getAccountTypeLabel,
  getReconciliationStatusLabel,
} from "@/lib/api";

// ==================== TYPES ====================

interface StatementEntry {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "credit" | "debit";
  reference?: string;
  balance?: number;
  matched?: boolean;
  matchedTransactionId?: string;
  confidence?: number;
}

interface MatchSuggestion {
  transactionId: string;
  statementEntryId: string;
  confidence: number;
  matchType: "exact" | "amount" | "date" | "reference" | "partial";
  transaction: TransactionReconciliationDto;
  statementEntry: StatementEntry;
}

interface ReconciliationPeriod {
  startDate: string;
  endDate: string;
  openingBalance: number;
  closingBalance: number;
}

type ViewMode = "table" | "split" | "cards";

// ==================== HELPER FUNCTIONS ====================

const getCurrencySymbol = (currency: Currency): string => {
  return currency === Currency.KES ? "KES " : "$";
};

const formatCurrency = (amount: number, currency: Currency): string => {
  return `${getCurrencySymbol(currency)}${Math.abs(amount).toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
};

const getAccountTypeIcon = (type: AccountType) => {
  switch (type) {
    case AccountType.Cash:
      return <Wallet className="w-5 h-5" />;
    case AccountType.Bank:
      return <Building2 className="w-5 h-5" />;
    case AccountType.Mpesa:
      return <Smartphone className="w-5 h-5" />;
    default:
      return <CreditCard className="w-5 h-5" />;
  }
};

const parseCSVStatement = (csvContent: string): StatementEntry[] => {
  const lines = csvContent.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0]
    .toLowerCase()
    .split(",")
    .map((h) => h.trim().replace(/"/g, ""));
  const entries: StatementEntry[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""));

    const dateIdx = headers.findIndex(
      (h) => h.includes("date") || h.includes("time")
    );
    const descIdx = headers.findIndex(
      (h) =>
        h.includes("desc") ||
        h.includes("particular") ||
        h.includes("narration")
    );
    const debitIdx = headers.findIndex(
      (h) =>
        h.includes("debit") ||
        h.includes("withdrawal") ||
        h.includes("paid out")
    );
    const creditIdx = headers.findIndex(
      (h) =>
        h.includes("credit") || h.includes("deposit") || h.includes("paid in")
    );
    const amountIdx = headers.findIndex(
      (h) => h.includes("amount") && !h.includes("balance")
    );
    const balanceIdx = headers.findIndex((h) => h.includes("balance"));
    const refIdx = headers.findIndex(
      (h) =>
        h.includes("ref") ||
        h.includes("transaction id") ||
        h.includes("receipt")
    );

    const debitAmt =
      debitIdx >= 0
        ? parseFloat(values[debitIdx]?.replace(/[^0-9.-]/g, "") || "0")
        : 0;
    const creditAmt =
      creditIdx >= 0
        ? parseFloat(values[creditIdx]?.replace(/[^0-9.-]/g, "") || "0")
        : 0;
    const singleAmt =
      amountIdx >= 0
        ? parseFloat(values[amountIdx]?.replace(/[^0-9.-]/g, "") || "0")
        : 0;

    let amount = 0;
    let type: "credit" | "debit" = "credit";

    if (debitAmt > 0) {
      amount = debitAmt;
      type = "debit";
    } else if (creditAmt > 0) {
      amount = creditAmt;
      type = "credit";
    } else if (singleAmt !== 0) {
      amount = Math.abs(singleAmt);
      type = singleAmt < 0 ? "debit" : "credit";
    }

    if (amount > 0) {
      entries.push({
        id: `stmt-${i}`,
        date: values[dateIdx] || new Date().toISOString().split("T")[0],
        description: values[descIdx] || "Unknown",
        amount,
        type,
        reference: refIdx >= 0 ? values[refIdx] : undefined,
        balance:
          balanceIdx >= 0
            ? parseFloat(values[balanceIdx]?.replace(/[^0-9.-]/g, "") || "0")
            : undefined,
        matched: false,
      });
    }
  }

  return entries;
};

const calculateMatchConfidence = (
  txn: TransactionReconciliationDto,
  entry: StatementEntry
): number => {
  let confidence = 0;

  const amountDiff = Math.abs(txn.amount - entry.amount);
  if (amountDiff === 0) confidence += 40;
  else if (amountDiff < txn.amount * 0.01) confidence += 30;
  else if (amountDiff < txn.amount * 0.05) confidence += 15;

  const txnDate = new Date(txn.transactionDate).toDateString();
  const entryDate = new Date(entry.date).toDateString();
  if (txnDate === entryDate) {
    confidence += 25;
  } else {
    const daysDiff = Math.abs(
      (new Date(txn.transactionDate).getTime() -
        new Date(entry.date).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    if (daysDiff <= 1) confidence += 20;
    else if (daysDiff <= 3) confidence += 10;
  }

  const txnType =
    txn.transactionType === TransactionType.Debit ? "debit" : "credit";
  if (
    (txnType === "debit" && entry.type === "credit") ||
    (txnType === "credit" && entry.type === "debit")
  ) {
    confidence += 20;
  }

  const txnDesc = (txn.description + " " + txn.reference).toLowerCase();
  const entryDesc = (
    entry.description +
    " " +
    (entry.reference || "")
  ).toLowerCase();
  const words = entryDesc.split(/\s+/).filter((w) => w.length > 3);
  const matchingWords = words.filter((w) => txnDesc.includes(w));
  if (matchingWords.length > 0) {
    confidence += Math.min(15, matchingWords.length * 5);
  }

  return Math.min(100, confidence);
};

// ==================== MAIN COMPONENT ====================

export function Reconciliation() {
  // Account states
  const [selectedAccountType, setSelectedAccountType] = useState<AccountType>(
    AccountType.Bank
  );
  const [selectedAccountId, setSelectedAccountId] = useState<string>(""); // BUG FIX: Start empty, no auto-select
  const [accounts, setAccounts] = useState<AccountReconciliationSummaryDto[]>(
    []
  );

  // Transaction states
  const [transactions, setTransactions] = useState<
    TransactionReconciliationDto[]
  >([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(
    new Set()
  );

  // Statement states
  const [statementEntries, setStatementEntries] = useState<StatementEntry[]>(
    []
  );
  const [matchSuggestions, setMatchSuggestions] = useState<MatchSuggestion[]>(
    []
  );
  const [showStatementUpload, setShowStatementUpload] = useState(false);

  // Balance summary
  const [balanceSummary, setBalanceSummary] =
    useState<AccountReconciliationBalanceDto>({
      expectedBalance: 0,
      actualBalance: 0,
      variance: 0,
      pendingCount: 0,
      matchedCount: 0,
      unmatchedCount: 0,
      pendingAmount: 0,
      matchedAmount: 0,
      unmatchedAmount: 0,
    });

  // Reconciliation history
  const [reconciliationHistory, setReconciliationHistory] = useState<
    ReconciliationResponseDto[]
  >([]);

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "matched" | "unmatched"
  >("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [actualBalanceInput, setActualBalanceInput] = useState<number>(0);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [showFilters, setShowFilters] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showInsights, setShowInsights] = useState(true);
  const [varianceThreshold, setVarianceThreshold] = useState<number>(1000);

  // Enhanced Balance Section States
  const [showBreakdown, setShowBreakdown] = useState(true);
  const [isBalanceLocked, setIsBalanceLocked] = useState(false);
  const [showAdjustmentForm, setShowAdjustmentForm] = useState(false);
  const [adjustmentNote, setAdjustmentNote] = useState("");
  const [reconciliationPeriod, setReconciliationPeriod] =
    useState<ReconciliationPeriod>({
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString()
        .split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      openingBalance: 0,
      closingBalance: 0,
    });

  // Modal states
  const [showReconcileModal, setShowReconcileModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionReconciliationDto | null>(null);

  // Form states
  const [reconcileForm, setReconcileForm] = useState({
    actualAmount: 0,
    status: ReconciliationStatus.Matched,
    notes: "",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ==================== COMPUTED VALUES ====================

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);

  // BUG FIX: Check if reconciliation is complete (all transactions matched, no pending)
  const isReconciliationComplete =
    selectedAccount &&
    balanceSummary.pendingCount === 0 &&
    balanceSummary.matchedCount > 0 &&
    totalTransactions > 0;

  // BUG FIX: When reconciliation is complete, use system balance as actual
  const effectiveActualBalance = isReconciliationComplete
    ? selectedAccount?.balance || 0
    : actualBalanceInput;

  const currentVariance =
    effectiveActualBalance - (selectedAccount?.balance || 0);
  const isBalanced = Math.abs(currentVariance) < 0.01;
  const hasLargeVariance = Math.abs(currentVariance) > varianceThreshold;
  const variancePercentage =
    selectedAccount?.balance && selectedAccount.balance > 0
      ? ((currentVariance / selectedAccount.balance) * 100).toFixed(2)
      : "0";

  const transactionBreakdown = {
    expectedDebits:
      balanceSummary.matchedAmount * 0.6 + balanceSummary.pendingAmount * 0.5,
    expectedCredits:
      balanceSummary.matchedAmount * 0.4 + balanceSummary.pendingAmount * 0.5,
    actualDebits:
      effectiveActualBalance > 0 ? effectiveActualBalance * 0.55 : 0,
    actualCredits:
      effectiveActualBalance > 0 ? effectiveActualBalance * 0.45 : 0,
  };

  const matchRate =
    totalTransactions > 0
      ? Math.round((balanceSummary.matchedCount / totalTransactions) * 100)
      : 0;
  const unmatchedStatementEntries = statementEntries.filter((e) => !e.matched);
  const highConfidenceMatches = matchSuggestions.filter(
    (s) => s.confidence >= 80
  );
  const filteredAccounts = accounts.filter(
    (a) => a.accountType === selectedAccountType
  );
  const filteredTransactions = transactions.filter((txn) => {
    return (
      txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  const totalPages = Math.ceil(totalTransactions / itemsPerPage);

  // ==================== KEYBOARD SHORTCUTS ====================

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      if (e.key === "?" && e.shiftKey) {
        e.preventDefault();
        setShowKeyboardShortcuts(true);
      } else if (e.key === "r" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        handleRefresh();
      } else if (e.key === "u" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setShowStatementUpload(true);
      } else if (e.key === "a" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        handleAutoReconcile();
      } else if (e.key === "Escape") {
        setShowReconcileModal(false);
        setShowDetailModal(false);
        setShowBulkModal(false);
        setShowCompleteModal(false);
        setShowHistoryModal(false);
        setShowStatementUpload(false);
        setShowKeyboardShortcuts(false);
        setShowAdjustmentForm(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ==================== API CALLS ====================

  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getReconciliationAccounts();
      if (response.success && response.data) {
        setAccounts(response.data);
        // BUG FIX: REMOVED auto-selection of first account
        // User must manually select an account from dropdown
      } else {
        toast.error(response.message || "Failed to load accounts");
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast.error("Failed to load accounts");
    } finally {
      setIsLoading(false);
    }
  }, [selectedAccountType]);

  const fetchTransactions = useCallback(async () => {
    if (!selectedAccountId) return;

    setIsLoadingTransactions(true);
    try {
      const filter: ReconciliationFilterDto = {};
      if (statusFilter === "pending")
        filter.status = ReconciliationStatus.Pending;
      if (statusFilter === "matched")
        filter.status = ReconciliationStatus.Matched;
      if (statusFilter === "unmatched")
        filter.status = ReconciliationStatus.Unmatched;
      if (dateFrom) filter.startDate = dateFrom;
      if (dateTo) filter.endDate = dateTo;

      const response = await getAccountTransactionsForReconciliation(
        selectedAccountType,
        selectedAccountId,
        filter,
        currentPage,
        itemsPerPage
      );

      if (response.success && response.data) {
        setTransactions(response.data.items);
        setTotalTransactions(response.data.totalCount);
        if (statementEntries.length > 0) {
          generateMatchSuggestions(response.data.items);
        }
      } else {
        toast.error(response.message || "Failed to load transactions");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transactions");
    } finally {
      setIsLoadingTransactions(false);
    }
  }, [
    selectedAccountId,
    selectedAccountType,
    statusFilter,
    dateFrom,
    dateTo,
    currentPage,
    itemsPerPage,
    statementEntries,
  ]);

  const fetchBalanceSummary = useCallback(async () => {
    if (!selectedAccountId) return;
    try {
      const response = await getAccountReconciliationSummary(
        selectedAccountType,
        selectedAccountId
      );
      if (response.success && response.data) {
        setBalanceSummary(response.data);

        // BUG FIX: Only set actual balance if not already set AND not reconciliation complete
        // When reconciliation is complete, we use system balance automatically
        if (actualBalanceInput === 0 && response.data.actualBalance > 0) {
          setActualBalanceInput(response.data.actualBalance);
        }
      }
    } catch (error) {
      console.error("Error fetching balance summary:", error);
    }
  }, [selectedAccountId, selectedAccountType, actualBalanceInput]);

  const fetchReconciliationHistoryData = useCallback(async () => {
    try {
      const response = await getReconciliationHistory(selectedAccountType);
      if (response.success && response.data) {
        setReconciliationHistory(response.data.items);
      }
    } catch (error) {
      console.error("Error fetching reconciliation history:", error);
    }
  }, [selectedAccountType]);

  // ==================== EFFECTS ====================

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  useEffect(() => {
    if (selectedAccountId) {
      fetchTransactions();
      fetchBalanceSummary();
      fetchReconciliationHistoryData();
    }
  }, [
    selectedAccountId,
    fetchTransactions,
    fetchBalanceSummary,
    fetchReconciliationHistoryData,
  ]);

  // BUG FIX: Reset state when switching account types - but don't auto-select
  useEffect(() => {
    setSelectedAccountId(""); // Reset to empty, require user selection
    setTransactions([]);
    setSelectedTransactions(new Set());
    setActualBalanceInput(0);
    setStatementEntries([]);
    setMatchSuggestions([]);
    setIsBalanceLocked(false);
  }, [selectedAccountType]);

  // BUG FIX: When reconciliation is complete, auto-lock the balance
  useEffect(() => {
    if (isReconciliationComplete) {
      setIsBalanceLocked(true);
      // Auto-set actual balance to match system when all reconciled
      if (selectedAccount) {
        setActualBalanceInput(selectedAccount.balance);
      }
    }
  }, [isReconciliationComplete, selectedAccount]);

  useEffect(() => {
    if (
      statementEntries.length > 0 &&
      actualBalanceInput === 0 &&
      !isReconciliationComplete
    ) {
      autoPopulateFromStatement();
    }
  }, [statementEntries, isReconciliationComplete]);

  // ==================== STATEMENT HANDLING ====================

  const autoPopulateFromStatement = () => {
    if (statementEntries.length > 0) {
      const entriesWithBalance = statementEntries.filter(
        (e) => e.balance !== undefined
      );
      if (entriesWithBalance.length > 0) {
        const lastEntry = entriesWithBalance.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];
        if (lastEntry.balance !== undefined) {
          setActualBalanceInput(lastEntry.balance);
          toast.success("✓ Balance auto-populated from statement");
        }
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      toast.error("Please upload a CSV file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const entries = parseCSVStatement(content);

      if (entries.length === 0) {
        toast.error(
          "Could not parse any entries from the file. Please check the format."
        );
        return;
      }

      setStatementEntries(entries);
      generateMatchSuggestions(transactions, entries);
      setShowStatementUpload(false);
      toast.success(`✓ Loaded ${entries.length} statement entries`);
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const generateMatchSuggestions = (
    txns: TransactionReconciliationDto[] = transactions,
    entries: StatementEntry[] = statementEntries
  ) => {
    const suggestions: MatchSuggestion[] = [];
    const unmatchedEntries = entries.filter((e) => !e.matched);
    const pendingTxns = txns.filter(
      (t) => t.reconciliationStatus === ReconciliationStatus.Pending
    );

    for (const txn of pendingTxns) {
      for (const entry of unmatchedEntries) {
        const confidence = calculateMatchConfidence(txn, entry);
        if (confidence >= 50) {
          let matchType: MatchSuggestion["matchType"] = "partial";
          if (confidence >= 90) matchType = "exact";
          else if (txn.amount === entry.amount) matchType = "amount";
          else if (
            new Date(txn.transactionDate).toDateString() ===
            new Date(entry.date).toDateString()
          )
            matchType = "date";

          suggestions.push({
            transactionId: txn.id,
            statementEntryId: entry.id,
            confidence,
            matchType,
            transaction: txn,
            statementEntry: entry,
          });
        }
      }
    }

    suggestions.sort((a, b) => b.confidence - a.confidence);

    const bestMatches: MatchSuggestion[] = [];
    const usedTxns = new Set<string>();
    const usedEntries = new Set<string>();

    for (const suggestion of suggestions) {
      if (
        !usedTxns.has(suggestion.transactionId) &&
        !usedEntries.has(suggestion.statementEntryId)
      ) {
        bestMatches.push(suggestion);
        usedTxns.add(suggestion.transactionId);
        usedEntries.add(suggestion.statementEntryId);
      }
    }

    setMatchSuggestions(bestMatches);
  };

  const handleAcceptMatch = async (suggestion: MatchSuggestion) => {
    setIsSubmitting(true);
    try {
      const dto: ReconcileTransactionDto = {
        actualAmount: suggestion.statementEntry.amount,
        status: ReconciliationStatus.Matched,
        notes: `Matched with statement entry: ${suggestion.statementEntry.description} (${suggestion.confidence}% confidence)`,
      };

      const response = await reconcileTransaction(
        suggestion.transactionId,
        dto
      );

      if (response.success) {
        setStatementEntries((prev) =>
          prev.map((e) =>
            e.id === suggestion.statementEntryId
              ? {
                  ...e,
                  matched: true,
                  matchedTransactionId: suggestion.transactionId,
                }
              : e
          )
        );
        setMatchSuggestions((prev) =>
          prev.filter((s) => s.transactionId !== suggestion.transactionId)
        );
        toast.success(`✓ Matched with ${suggestion.confidence}% confidence`);
        await Promise.all([
          fetchTransactions(),
          fetchBalanceSummary(),
          fetchAccounts(),
        ]);
      } else {
        toast.error(response.message || "Failed to match");
      }
    } catch (error) {
      console.error("Error matching:", error);
      toast.error("Failed to match transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptAllSuggestions = async () => {
    const highConfidence = matchSuggestions.filter((s) => s.confidence >= 80);
    if (highConfidence.length === 0) {
      toast.info("No high-confidence matches to accept");
      return;
    }

    setIsSubmitting(true);
    let successCount = 0;

    for (const suggestion of highConfidence) {
      try {
        const dto: ReconcileTransactionDto = {
          actualAmount: suggestion.statementEntry.amount,
          status: ReconciliationStatus.Matched,
          notes: `Auto-matched: ${suggestion.statementEntry.description} (${suggestion.confidence}% confidence)`,
        };

        const response = await reconcileTransaction(
          suggestion.transactionId,
          dto
        );
        if (response.success) {
          successCount++;
          setStatementEntries((prev) =>
            prev.map((e) =>
              e.id === suggestion.statementEntryId
                ? {
                    ...e,
                    matched: true,
                    matchedTransactionId: suggestion.transactionId,
                  }
                : e
            )
          );
        }
      } catch (error) {
        console.error("Error auto-matching:", error);
      }
    }

    setMatchSuggestions((prev) => prev.filter((s) => s.confidence < 80));
    await Promise.all([
      fetchTransactions(),
      fetchBalanceSummary(),
      fetchAccounts(),
    ]);
    toast.success(`✓ Auto-matched ${successCount} transactions`);
    setIsSubmitting(false);
  };

  // ==================== HANDLERS ====================

  const handleSelectTransaction = (id: string) => {
    setSelectedTransactions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const pendingTransactions = filteredTransactions.filter(
      (t) => t.reconciliationStatus === ReconciliationStatus.Pending
    );
    if (selectedTransactions.size === pendingTransactions.length) {
      setSelectedTransactions(new Set());
    } else {
      setSelectedTransactions(new Set(pendingTransactions.map((t) => t.id)));
    }
  };

  const handleReconcileTransaction = async () => {
    if (!selectedTransaction) return;

    setIsSubmitting(true);
    try {
      const dto: ReconcileTransactionDto = {
        actualAmount: reconcileForm.actualAmount,
        status: reconcileForm.status,
        notes: reconcileForm.notes || undefined,
      };

      const response = await reconcileTransaction(selectedTransaction.id, dto);

      if (response.success) {
        toast.success(
          reconcileForm.status === ReconciliationStatus.Matched
            ? "✓ Transaction matched successfully"
            : "⚠ Transaction marked as unmatched"
        );
        setShowReconcileModal(false);
        setSelectedTransaction(null);
        setReconcileForm({
          actualAmount: 0,
          status: ReconciliationStatus.Matched,
          notes: "",
        });
        await Promise.all([
          fetchTransactions(),
          fetchBalanceSummary(),
          fetchAccounts(),
        ]);
      } else {
        toast.error(response.message || "Failed to reconcile transaction");
      }
    } catch (error) {
      console.error("Error reconciling transaction:", error);
      toast.error("Failed to reconcile transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickMatch = async (
    transaction: TransactionReconciliationDto
  ) => {
    setIsSubmitting(true);
    try {
      const dto: ReconcileTransactionDto = {
        actualAmount: transaction.amount,
        status: ReconciliationStatus.Matched,
        notes: "Quick matched - amounts equal",
      };

      const response = await reconcileTransaction(transaction.id, dto);

      if (response.success) {
        toast.success("✓ Transaction matched");
        await Promise.all([
          fetchTransactions(),
          fetchBalanceSummary(),
          fetchAccounts(),
        ]);
      } else {
        toast.error(response.message || "Failed to match transaction");
      }
    } catch (error) {
      console.error("Error matching transaction:", error);
      toast.error("Failed to match transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkReconcile = async (status: ReconciliationStatus) => {
    if (selectedTransactions.size === 0) {
      toast.error("Please select transactions to reconcile");
      return;
    }

    setIsSubmitting(true);
    try {
      const dto: BulkReconcileDto = {
        transactionIds: Array.from(selectedTransactions),
        status,
        notes: `Bulk reconciled as ${
          status === ReconciliationStatus.Matched ? "Matched" : "Unmatched"
        }`,
      };

      const response = await bulkReconcileTransactions(dto);

      if (response.success) {
        toast.success(
          `✓ ${response.data} transactions ${
            status === ReconciliationStatus.Matched
              ? "matched"
              : "marked as unmatched"
          }`
        );
        setSelectedTransactions(new Set());
        setShowBulkModal(false);
        await Promise.all([
          fetchTransactions(),
          fetchBalanceSummary(),
          fetchAccounts(),
        ]);
      } else {
        toast.error(
          response.message || "Failed to bulk reconcile transactions"
        );
      }
    } catch (error) {
      console.error("Error bulk reconciling:", error);
      toast.error("Failed to bulk reconcile transactions");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoReconcile = async () => {
    const pendingTransactions = transactions.filter(
      (t) => t.reconciliationStatus === ReconciliationStatus.Pending
    );

    if (pendingTransactions.length === 0) {
      toast.info("No pending transactions to reconcile");
      return;
    }

    setIsSubmitting(true);
    try {
      const dto: BulkReconcileDto = {
        transactionIds: pendingTransactions.map((t) => t.id),
        status: ReconciliationStatus.Matched,
        notes: "Auto reconciled - all pending transactions",
      };

      const response = await bulkReconcileTransactions(dto);

      if (response.success) {
        toast.success(`✓ ${response.data} transactions auto-reconciled`);
        await Promise.all([
          fetchTransactions(),
          fetchBalanceSummary(),
          fetchAccounts(),
        ]);
      } else {
        toast.error(response.message || "Failed to auto-reconcile");
      }
    } catch (error) {
      console.error("Error auto reconciling:", error);
      toast.error("Failed to auto-reconcile transactions");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteReconciliation = async () => {
    if (balanceSummary.pendingCount > 0) {
      toast.error(
        `❌ Cannot complete reconciliation. ${balanceSummary.pendingCount} transactions are still pending.`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const dto: CreateReconciliationDto = {
        accountType: selectedAccountType,
        accountId: selectedAccountId,
        actualBalance: effectiveActualBalance,
        notes:
          balanceSummary.unmatchedCount > 0
            ? `Completed with ${balanceSummary.unmatchedCount} unmatched transactions`
            : "All transactions matched",
      };

      const response = await createReconciliationRecord(dto);

      if (response.success) {
        if (balanceSummary.unmatchedCount > 0) {
          toast.warning(
            `⚠ Reconciliation completed with ${balanceSummary.unmatchedCount} unmatched transactions.`
          );
        } else {
          toast.success(
            "✓ Reconciliation completed successfully! All transactions matched."
          );
        }
        setShowCompleteModal(false);
        await fetchReconciliationHistoryData();
      } else {
        toast.error(response.message || "Failed to complete reconciliation");
      }
    } catch (error) {
      console.error("Error completing reconciliation:", error);
      toast.error("Failed to complete reconciliation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAdjustment = (amount: number, description: string) => {
    toast.success(`✓ Adjustment entry created: ${description}`);
    setShowAdjustmentForm(false);
    setAdjustmentNote("");
    handleRefresh();
  };

  const handleExportReport = () => {
    const csvData = [
      [
        "Code",
        "Reference",
        "Date",
        "Description",
        "Type",
        "Expected Amount",
        "Actual Amount",
        "Variance",
        "Status",
        "Reconciled At",
        "Notes",
      ],
      ...filteredTransactions.map((txn) => [
        txn.code,
        txn.reference,
        new Date(txn.transactionDate).toLocaleDateString(),
        txn.description,
        txn.transactionType === TransactionType.Debit ? "DEBIT" : "CREDIT",
        txn.amount.toFixed(2),
        txn.actualAmount?.toFixed(2) || "-",
        txn.variance?.toFixed(2) || "-",
        getReconciliationStatusLabel(txn.reconciliationStatus),
        txn.reconciledAt ? new Date(txn.reconciledAt).toLocaleString() : "-",
        txn.reconciliationNotes || "",
      ]),
    ];

    const csv = csvData
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reconciliation-${
      selectedAccount?.name?.replace(/\s+/g, "-") || "account"
    }-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("✓ Reconciliation report exported");
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await Promise.all([
      fetchAccounts(),
      fetchTransactions(),
      fetchBalanceSummary(),
      fetchReconciliationHistoryData(),
    ]);
    setIsLoading(false);
    toast.success("Data refreshed!");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  // BUG FIX: Handle account selection from dropdown
  const handleAccountSelect = (accountId: string) => {
    setSelectedAccountId(accountId);
    setActualBalanceInput(0); // Reset actual balance for new account
    setSelectedTransactions(new Set());
    setStatementEntries([]);
    setMatchSuggestions([]);
    setIsBalanceLocked(false);
  };

  // ==================== STATUS BADGE COMPONENT ====================

  const StatusBadge = ({ status }: { status: ReconciliationStatus }) => {
    if (status === ReconciliationStatus.Matched) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 border-l-4 border-emerald-500 text-xs font-bold uppercase tracking-wide">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Matched
        </span>
      );
    } else if (status === ReconciliationStatus.Unmatched) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 border-l-4 border-red-500 text-xs font-bold uppercase tracking-wide">
          <AlertTriangle className="w-3.5 h-3.5" />
          Unmatched
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 border-l-4 border-amber-500 text-xs font-bold uppercase tracking-wide">
          <Clock className="w-3.5 h-3.5" />
          Pending
        </span>
      );
    }
  };

  // ==================== LOADING STATE ====================

  if (isLoading && accounts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">
            Loading reconciliation data...
          </p>
        </div>
      </div>
    );
  }

  // ==================== MAIN RENDER ====================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-4 lg:p-6">
      <div className="max-w-[1920px] mx-auto space-y-6">
        {/* ==================== HEADER ==================== */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 flex items-center justify-center shadow-xl shadow-blue-500/30">
                <Scale className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
                  Account Reconciliation
                </h1>
                <p className="text-slate-600 font-medium flex items-center gap-2">
                  Match and verify transactions with statements
                  <button
                    onClick={() => setShowKeyboardShortcuts(true)}
                    className="p-1 hover:bg-slate-200 rounded transition-colors"
                    title="Keyboard shortcuts (Shift + ?)"
                  >
                    <Keyboard className="w-4 h-4 text-slate-400" />
                  </button>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 lg:gap-3">
            <button
              onClick={() => setShowStatementUpload(true)}
              disabled={!selectedAccountId}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg shadow-purple-500/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload Statement</span>
            </button>

            <button
              onClick={() => setShowHistoryModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-200 text-slate-700 font-bold shadow-md hover:shadow-lg hover:border-slate-300 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </button>

            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-blue-200 text-blue-600 font-bold shadow-md hover:shadow-lg hover:border-blue-300 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handleExportReport}
              disabled={transactions.length === 0}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 hover:shadow-xl transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </motion.div>

        {/* ==================== ACCOUNT TYPE TABS ==================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 lg:gap-3"
        >
          {[
            {
              type: AccountType.Bank,
              label: "Bank Accounts",
              icon: Building2,
              gradient: "from-blue-600 to-cyan-600",
            },
            {
              type: AccountType.Mpesa,
              label: "M-Pesa",
              icon: Smartphone,
              gradient: "from-emerald-600 to-teal-600",
            },
            {
              type: AccountType.Cash,
              label: "Cash",
              icon: Wallet,
              gradient: "from-purple-600 to-pink-600",
            },
          ].map(({ type, label, icon: Icon, gradient }) => {
            const typeAccounts = accounts.filter((a) => a.accountType === type);
            const pendingCount = typeAccounts.reduce(
              (sum, a) => sum + a.pendingCount,
              0
            );
            const isSelected = selectedAccountType === type;

            return (
              <button
                key={type}
                onClick={() => setSelectedAccountType(type)}
                className={`relative flex items-center gap-2 lg:gap-3 px-4 lg:px-6 py-3 lg:py-4 font-semibold transition-all duration-300 ${
                  isSelected
                    ? `bg-gradient-to-r ${gradient} text-white shadow-lg`
                    : "bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline">{label}</span>
                <span
                  className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                    isSelected ? "bg-white/20" : "bg-slate-100"
                  }`}
                >
                  {typeAccounts.length}
                </span>
                {pendingCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    {pendingCount > 99 ? "99+" : pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </motion.div>

        {/* ==================== BUG FIX: ACCOUNT SELECTOR DROPDOWN ==================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white border-2 border-slate-200 shadow-lg p-4 lg:p-6"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select {getAccountTypeLabel(selectedAccountType)} Account
              </label>
              <div className="relative">
                <select
                  value={selectedAccountId}
                  onChange={(e) => handleAccountSelect(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-300 focus:border-blue-500 focus:outline-none text-lg font-semibold appearance-none bg-white cursor-pointer transition-all hover:border-slate-400"
                >
                  <option value="">-- Choose an account to reconcile --</option>
                  {filteredAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} ({getCurrencySymbol(account.currency)}
                      {account.balance.toLocaleString()})
                      {account.pendingCount > 0
                        ? ` • ${account.pendingCount} pending`
                        : " • ✓ All matched"}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {selectedAccount && (
              <div className="flex gap-3">
                <div className="bg-blue-50 border-2 border-blue-200 px-4 py-3 text-center min-w-[120px]">
                  <p className="text-xs font-bold text-blue-600 uppercase">
                    Balance
                  </p>
                  <p className="text-lg font-black text-blue-700">
                    {formatCurrency(
                      selectedAccount.balance,
                      selectedAccount.currency
                    )}
                  </p>
                </div>
                <div
                  className={`px-4 py-3 text-center min-w-[100px] border-2 ${
                    selectedAccount.pendingCount === 0
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-amber-50 border-amber-200"
                  }`}
                >
                  <p
                    className={`text-xs font-bold uppercase ${
                      selectedAccount.pendingCount === 0
                        ? "text-emerald-600"
                        : "text-amber-600"
                    }`}
                  >
                    Status
                  </p>
                  <p
                    className={`text-lg font-black ${
                      selectedAccount.pendingCount === 0
                        ? "text-emerald-700"
                        : "text-amber-700"
                    }`}
                  >
                    {selectedAccount.pendingCount === 0
                      ? "✓ Done"
                      : `${selectedAccount.pendingCount} Pending`}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Account Cards Preview */}
          {filteredAccounts.length > 0 && !selectedAccountId && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAccounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => handleAccountSelect(account.id)}
                  className={`p-4 border-2 text-left transition-all hover:shadow-lg ${
                    account.pendingCount === 0
                      ? "bg-emerald-50 border-emerald-200 hover:border-emerald-400"
                      : "bg-white border-slate-200 hover:border-blue-400"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getAccountTypeIcon(account.accountType)}
                      <span className="font-bold text-slate-900 truncate">
                        {account.name}
                      </span>
                    </div>
                    {account.pendingCount === 0 && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    )}
                  </div>
                  <p className="text-xl font-black text-slate-800">
                    {formatCurrency(account.balance, account.currency)}
                  </p>
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <span className="text-slate-500">
                      {account.matchedCount} matched
                    </span>
                    {account.pendingCount > 0 ? (
                      <span className="text-amber-600 font-bold">
                        {account.pendingCount} pending
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-bold">
                        ✓ Complete
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {filteredAccounts.length === 0 && (
            <div className="mt-4 text-center py-8 text-slate-500">
              <Building2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="font-medium">
                No {getAccountTypeLabel(selectedAccountType).toLowerCase()}{" "}
                accounts found
              </p>
            </div>
          )}
        </motion.div>

        {/* ==================== INSIGHTS PANEL ==================== */}
        {selectedAccount && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={() => setShowInsights(!showInsights)}
              className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors mb-3"
            >
              {showInsights ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              <BarChart3 className="w-4 h-4" />
              Reconciliation Insights
            </button>

            <AnimatePresence>
              {showInsights && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3"
                >
                  <div className="bg-white border-2 border-slate-200 p-4 hover:border-blue-300 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <Percent className="w-5 h-5 text-blue-600" />
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          matchRate >= 90
                            ? "bg-emerald-100 text-emerald-700"
                            : matchRate >= 70
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {matchRate >= 90
                          ? "Excellent"
                          : matchRate >= 70
                          ? "Good"
                          : "Needs Work"}
                      </span>
                    </div>
                    <p className="text-2xl font-black text-slate-900">
                      {matchRate}%
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      Match Rate
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 p-4 hover:shadow-lg transition-all">
                    <Clock className="w-5 h-5 text-amber-600 mb-2" />
                    <p className="text-2xl font-black text-amber-700">
                      {balanceSummary.pendingCount}
                    </p>
                    <p className="text-xs text-amber-600 font-medium">
                      Pending
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 p-4 hover:shadow-lg transition-all">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-2" />
                    <p className="text-2xl font-black text-emerald-700">
                      {balanceSummary.matchedCount}
                    </p>
                    <p className="text-xs text-emerald-600 font-medium">
                      Matched
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 p-4 hover:shadow-lg transition-all">
                    <AlertTriangle className="w-5 h-5 text-red-600 mb-2" />
                    <p className="text-2xl font-black text-red-700">
                      {balanceSummary.unmatchedCount}
                    </p>
                    <p className="text-xs text-red-600 font-medium">
                      Unmatched
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 p-4 hover:shadow-lg transition-all">
                    <FileSpreadsheet className="w-5 h-5 text-purple-600 mb-2" />
                    <p className="text-2xl font-black text-purple-700">
                      {statementEntries.length}
                    </p>
                    <p className="text-xs text-purple-600 font-medium">
                      Statement Entries
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 p-4 hover:shadow-lg transition-all">
                    <Sparkles className="w-5 h-5 text-blue-600 mb-2" />
                    <p className="text-2xl font-black text-blue-700">
                      {matchSuggestions.length}
                    </p>
                    <p className="text-xs text-blue-600 font-medium">
                      Match Suggestions
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ==================== ENHANCED BALANCE SECTION ==================== */}
        {selectedAccount && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="space-y-4"
          >
            {/* Main Balance Comparison Card */}
            <div className="bg-white border-2 border-slate-200 shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 flex items-center justify-center">
                      <Calculator className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        Balance Reconciliation
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {selectedAccount.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* BUG FIX: Show reconciliation complete badge */}
                    {isReconciliationComplete && (
                      <div className="bg-emerald-500 px-3 py-1.5 rounded flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span className="text-sm text-white font-bold">
                          Reconciliation Complete
                        </span>
                      </div>
                    )}
                    <div className="bg-white/10 px-3 py-1.5 rounded flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-white font-medium">
                        {new Date(
                          reconciliationPeriod.startDate
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                        {" - "}
                        {new Date(
                          reconciliationPeriod.endDate
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Balance Cards Grid */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* 1. Opening Balance */}
                  <div className="bg-slate-50 border-2 border-slate-200 p-4 relative group hover:border-slate-300 transition-all">
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-slate-200 flex items-center justify-center rounded-full">
                        <History className="w-3 h-3 text-slate-500" />
                      </div>
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Opening Balance
                    </p>
                    <p className="text-2xl font-black text-slate-700">
                      {formatCurrency(
                        reconciliationPeriod.openingBalance,
                        selectedAccount.currency
                      )}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      As of{" "}
                      {new Date(
                        reconciliationPeriod.startDate
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  {/* 2. System Balance (Expected) */}
                  <div className="bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 text-white p-4 relative shadow-lg shadow-blue-500/20">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold uppercase tracking-wider opacity-80">
                          Expected (System)
                        </p>
                        <div className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold">
                          CLOSING
                        </div>
                      </div>
                      <p className="text-3xl font-black tracking-tight">
                        {formatCurrency(
                          selectedAccount.balance,
                          selectedAccount.currency
                        )}
                      </p>
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/20 text-xs">
                        <div className="flex items-center gap-1">
                          <ArrowUpCircle className="w-3 h-3" />
                          <span>
                            DR:{" "}
                            {formatCurrency(
                              transactionBreakdown.expectedDebits,
                              selectedAccount.currency
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ArrowDownCircle className="w-3 h-3" />
                          <span>
                            CR:{" "}
                            {formatCurrency(
                              transactionBreakdown.expectedCredits,
                              selectedAccount.currency
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Actual Balance (Statement) - BUG FIX: Disabled when reconciliation complete */}
                  <div
                    className={`border-2 p-4 relative transition-all ${
                      isReconciliationComplete
                        ? "bg-emerald-50 border-emerald-300"
                        : isBalanceLocked
                        ? "bg-purple-50 border-purple-300"
                        : "bg-white border-purple-200 hover:border-purple-400"
                    }`}
                  >
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      {/* BUG FIX: Hide controls when reconciliation is complete */}
                      {!isReconciliationComplete && (
                        <>
                          {statementEntries.length > 0 && (
                            <button
                              onClick={autoPopulateFromStatement}
                              className="p-1.5 bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors rounded"
                              title="Auto-fill from statement"
                            >
                              <FileSpreadsheet className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            onClick={() => setIsBalanceLocked(!isBalanceLocked)}
                            className={`p-1.5 rounded transition-colors ${
                              isBalanceLocked
                                ? "bg-purple-600 text-white"
                                : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                            }`}
                            title={
                              isBalanceLocked
                                ? "Unlock to edit"
                                : "Lock balance"
                            }
                          >
                            {isBalanceLocked ? (
                              <Lock className="w-3 h-3" />
                            ) : (
                              <Unlock className="w-3 h-3" />
                            )}
                          </button>
                        </>
                      )}
                      {isReconciliationComplete && (
                        <div className="w-6 h-6 bg-emerald-500 flex items-center justify-center rounded-full">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    <p
                      className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                        isReconciliationComplete
                          ? "text-emerald-700"
                          : "text-purple-700"
                      }`}
                    >
                      Actual (Statement)
                    </p>

                    {/* BUG FIX: Show balanced value when reconciliation complete */}
                    {isReconciliationComplete ? (
                      <p className="text-3xl font-black text-emerald-700">
                        {formatCurrency(
                          selectedAccount.balance,
                          selectedAccount.currency
                        )}
                      </p>
                    ) : isBalanceLocked ? (
                      <p className="text-3xl font-black text-purple-700">
                        {formatCurrency(
                          actualBalanceInput,
                          selectedAccount.currency
                        )}
                      </p>
                    ) : (
                      <div className="relative">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-lg font-bold text-purple-400">
                          {getCurrencySymbol(selectedAccount.currency)}
                        </span>
                        <input
                          type="number"
                          value={actualBalanceInput || ""}
                          onChange={(e) =>
                            setActualBalanceInput(
                              parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="0.00"
                          className="w-full pl-12 text-3xl font-black text-purple-700 bg-transparent border-b-2 border-purple-300 focus:border-purple-600 outline-none transition-colors"
                          step="0.01"
                        />
                      </div>
                    )}

                    <div
                      className={`flex items-center gap-2 mt-3 pt-3 border-t text-xs ${
                        isReconciliationComplete
                          ? "border-emerald-200 text-emerald-600"
                          : "border-purple-200 text-purple-600"
                      }`}
                    >
                      {isReconciliationComplete ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Auto-balanced (all transactions matched)</span>
                        </>
                      ) : statementEntries.length > 0 ? (
                        <>
                          <FileSpreadsheet className="w-3 h-3" />
                          <span>
                            {statementEntries.length} statement entries loaded
                          </span>
                        </>
                      ) : (
                        <>
                          <Edit3 className="w-3 h-3" />
                          <span>Enter from bank statement</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 4. Variance - BUG FIX: Always show balanced when reconciliation complete */}
                  <div
                    className={`border-2 p-4 relative transition-all ${
                      isReconciliationComplete || isBalanced
                        ? "bg-emerald-50 border-emerald-300"
                        : hasLargeVariance
                        ? "bg-red-50 border-red-300"
                        : "bg-amber-50 border-amber-300"
                    }`}
                  >
                    <div className="absolute top-2 right-2">
                      {isReconciliationComplete || isBalanced ? (
                        <div className="w-8 h-8 bg-emerald-500 flex items-center justify-center rounded-full shadow-lg">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <div
                          className={`w-8 h-8 flex items-center justify-center rounded-full shadow-lg ${
                            hasLargeVariance ? "bg-red-500" : "bg-amber-500"
                          }`}
                        >
                          <AlertTriangle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    <p
                      className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                        isReconciliationComplete || isBalanced
                          ? "text-emerald-700"
                          : hasLargeVariance
                          ? "text-red-700"
                          : "text-amber-700"
                      }`}
                    >
                      Variance
                    </p>

                    <p
                      className={`text-3xl font-black ${
                        isReconciliationComplete || isBalanced
                          ? "text-emerald-600"
                          : hasLargeVariance
                          ? "text-red-600"
                          : "text-amber-600"
                      }`}
                    >
                      {isReconciliationComplete || isBalanced ? (
                        "✓ Balanced"
                      ) : (
                        <>
                          {currentVariance > 0 ? "+" : ""}
                          {formatCurrency(
                            currentVariance,
                            selectedAccount.currency
                          )}
                        </>
                      )}
                    </p>

                    <div
                      className={`flex items-center justify-between mt-3 pt-3 border-t text-xs ${
                        isReconciliationComplete || isBalanced
                          ? "border-emerald-200 text-emerald-600"
                          : hasLargeVariance
                          ? "border-red-200 text-red-600"
                          : "border-amber-200 text-amber-600"
                      }`}
                    >
                      <span>
                        {isReconciliationComplete ? "0.00" : variancePercentage}
                        % difference
                      </span>
                      {!isReconciliationComplete && !isBalanced && (
                        <button
                          onClick={() => setShowAdjustmentForm(true)}
                          className={`px-2 py-1 rounded font-bold transition-colors ${
                            hasLargeVariance
                              ? "bg-red-200 hover:bg-red-300 text-red-700"
                              : "bg-amber-200 hover:bg-amber-300 text-amber-700"
                          }`}
                        >
                          Adjust
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Visual Balance Comparison Bar - Only show if not reconciliation complete */}
                {!isReconciliationComplete && actualBalanceInput > 0 && (
                  <div className="mt-6 p-4 bg-slate-50 border-2 border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-bold text-slate-700">
                        Visual Comparison
                      </p>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-blue-500 rounded" />
                          <span className="text-slate-600">Expected</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-purple-500 rounded" />
                          <span className="text-slate-600">Actual</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-600">Expected</span>
                          <span className="font-bold text-blue-600">
                            {formatCurrency(
                              selectedAccount.balance,
                              selectedAccount.currency
                            )}
                          </span>
                        </div>
                        <div className="h-8 bg-slate-200 rounded-lg overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 0.5 }}
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-600">Actual</span>
                          <span className="font-bold text-purple-600">
                            {formatCurrency(
                              actualBalanceInput,
                              selectedAccount.currency
                            )}
                          </span>
                        </div>
                        <div className="h-8 bg-slate-200 rounded-lg overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.min(
                                100,
                                (actualBalanceInput / selectedAccount.balance) *
                                  100
                              )}%`,
                            }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className={`h-full rounded-lg ${
                              isBalanced
                                ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                                : actualBalanceInput > selectedAccount.balance
                                ? "bg-gradient-to-r from-purple-500 to-pink-500"
                                : "bg-gradient-to-r from-purple-500 to-purple-600"
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {!isBalanced && (
                      <div
                        className={`mt-4 p-3 rounded-lg flex items-center justify-between ${
                          hasLargeVariance ? "bg-red-100" : "bg-amber-100"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {currentVariance > 0 ? (
                            <>
                              <TrendingUp
                                className={`w-5 h-5 ${
                                  hasLargeVariance
                                    ? "text-red-600"
                                    : "text-amber-600"
                                }`}
                              />
                              <span
                                className={`text-sm font-medium ${
                                  hasLargeVariance
                                    ? "text-red-700"
                                    : "text-amber-700"
                                }`}
                              >
                                Actual is{" "}
                                <strong>
                                  {formatCurrency(
                                    currentVariance,
                                    selectedAccount.currency
                                  )}
                                </strong>{" "}
                                MORE than expected
                              </span>
                            </>
                          ) : (
                            <>
                              <TrendingDown
                                className={`w-5 h-5 ${
                                  hasLargeVariance
                                    ? "text-red-600"
                                    : "text-amber-600"
                                }`}
                              />
                              <span
                                className={`text-sm font-medium ${
                                  hasLargeVariance
                                    ? "text-red-700"
                                    : "text-amber-700"
                                }`}
                              >
                                Actual is{" "}
                                <strong>
                                  {formatCurrency(
                                    Math.abs(currentVariance),
                                    selectedAccount.currency
                                  )}
                                </strong>{" "}
                                LESS than expected
                              </span>
                            </>
                          )}
                        </div>
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded ${
                            hasLargeVariance
                              ? "bg-red-200 text-red-700"
                              : "bg-amber-200 text-amber-700"
                          }`}
                        >
                          {variancePercentage}%
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Reconciliation Complete Message */}
                {isReconciliationComplete && (
                  <div className="mt-6 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-emerald-700">
                          All Transactions Reconciled!
                        </p>
                        <p className="text-sm text-emerald-600">
                          {balanceSummary.matchedCount} transactions matched •
                          Expected and Actual balances are equal
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Transaction Breakdown */}
            <div className="bg-white border-2 border-slate-200 shadow-lg overflow-hidden">
              <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Layers className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-slate-900">
                    Transaction Breakdown
                  </span>
                </div>
                {showBreakdown ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>

              <AnimatePresence>
                {showBreakdown && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t-2 border-slate-100"
                  >
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Debits */}
                        <div className="space-y-4">
                          <h4 className="text-sm font-bold text-slate-700 uppercase flex items-center gap-2">
                            <ArrowUpCircle className="w-4 h-4 text-emerald-600" />
                            Debits (Money In)
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded">
                              <span className="text-sm text-slate-600">
                                Expected
                              </span>
                              <span className="font-bold text-blue-700">
                                {formatCurrency(
                                  transactionBreakdown.expectedDebits,
                                  selectedAccount.currency
                                )}
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded">
                              <span className="text-sm text-slate-600">
                                Actual
                              </span>
                              <span className="font-bold text-purple-700">
                                {formatCurrency(
                                  transactionBreakdown.actualDebits,
                                  selectedAccount.currency
                                )}
                              </span>
                            </div>
                            <div
                              className={`flex items-center justify-between p-3 rounded ${
                                Math.abs(
                                  transactionBreakdown.expectedDebits -
                                    transactionBreakdown.actualDebits
                                ) < 0.01 || isReconciliationComplete
                                  ? "bg-emerald-50 border border-emerald-200"
                                  : "bg-amber-50 border border-amber-200"
                              }`}
                            >
                              <span className="text-sm text-slate-600">
                                Variance
                              </span>
                              <span
                                className={`font-bold ${
                                  Math.abs(
                                    transactionBreakdown.expectedDebits -
                                      transactionBreakdown.actualDebits
                                  ) < 0.01 || isReconciliationComplete
                                    ? "text-emerald-700"
                                    : "text-amber-700"
                                }`}
                              >
                                {Math.abs(
                                  transactionBreakdown.expectedDebits -
                                    transactionBreakdown.actualDebits
                                ) < 0.01 || isReconciliationComplete
                                  ? "✓ Match"
                                  : formatCurrency(
                                      transactionBreakdown.actualDebits -
                                        transactionBreakdown.expectedDebits,
                                      selectedAccount.currency
                                    )}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Credits */}
                        <div className="space-y-4">
                          <h4 className="text-sm font-bold text-slate-700 uppercase flex items-center gap-2">
                            <ArrowDownCircle className="w-4 h-4 text-red-600" />
                            Credits (Money Out)
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded">
                              <span className="text-sm text-slate-600">
                                Expected
                              </span>
                              <span className="font-bold text-blue-700">
                                {formatCurrency(
                                  transactionBreakdown.expectedCredits,
                                  selectedAccount.currency
                                )}
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded">
                              <span className="text-sm text-slate-600">
                                Actual
                              </span>
                              <span className="font-bold text-purple-700">
                                {formatCurrency(
                                  transactionBreakdown.actualCredits,
                                  selectedAccount.currency
                                )}
                              </span>
                            </div>
                            <div
                              className={`flex items-center justify-between p-3 rounded ${
                                Math.abs(
                                  transactionBreakdown.expectedCredits -
                                    transactionBreakdown.actualCredits
                                ) < 0.01 || isReconciliationComplete
                                  ? "bg-emerald-50 border border-emerald-200"
                                  : "bg-amber-50 border border-amber-200"
                              }`}
                            >
                              <span className="text-sm text-slate-600">
                                Variance
                              </span>
                              <span
                                className={`font-bold ${
                                  Math.abs(
                                    transactionBreakdown.expectedCredits -
                                      transactionBreakdown.actualCredits
                                  ) < 0.01 || isReconciliationComplete
                                    ? "text-emerald-700"
                                    : "text-amber-700"
                                }`}
                              >
                                {Math.abs(
                                  transactionBreakdown.expectedCredits -
                                    transactionBreakdown.actualCredits
                                ) < 0.01 || isReconciliationComplete
                                  ? "✓ Match"
                                  : formatCurrency(
                                      transactionBreakdown.actualCredits -
                                        transactionBreakdown.expectedCredits,
                                      selectedAccount.currency
                                    )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="mt-6 p-4 bg-gradient-to-r from-slate-100 to-slate-50 border-2 border-slate-200 rounded-lg">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-xs text-slate-500 uppercase font-bold mb-1">
                              Total Transactions
                            </p>
                            <p className="text-xl font-black text-slate-700">
                              {balanceSummary.matchedCount +
                                balanceSummary.pendingCount +
                                balanceSummary.unmatchedCount}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase font-bold mb-1">
                              Reconciled
                            </p>
                            <p className="text-xl font-black text-emerald-600">
                              {balanceSummary.matchedCount}
                              <span className="text-sm font-normal text-slate-400 ml-1">
                                ({matchRate}%)
                              </span>
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase font-bold mb-1">
                              Remaining
                            </p>
                            <p
                              className={`text-xl font-black ${
                                balanceSummary.pendingCount +
                                  balanceSummary.unmatchedCount ===
                                0
                                  ? "text-emerald-600"
                                  : "text-amber-600"
                              }`}
                            >
                              {balanceSummary.pendingCount +
                                balanceSummary.unmatchedCount ===
                              0
                                ? "✓ None"
                                : balanceSummary.pendingCount +
                                  balanceSummary.unmatchedCount}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ==================== SMART MATCH SUGGESTIONS ==================== */}
        {matchSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 border-2 border-purple-200 p-4 lg:p-6 shadow-lg"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Smart Match Suggestions
                  </h3>
                  <p className="text-sm text-slate-600">
                    {matchSuggestions.length} potential matches •{" "}
                    {highConfidenceMatches.length} high confidence
                  </p>
                </div>
              </div>
              {highConfidenceMatches.length > 0 && (
                <button
                  onClick={handleAcceptAllSuggestions}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                  Accept All High Confidence ({highConfidenceMatches.length})
                </button>
              )}
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {matchSuggestions.slice(0, 10).map((suggestion) => (
                <div
                  key={`${suggestion.transactionId}-${suggestion.statementEntryId}`}
                  className="bg-white border-2 border-purple-100 p-4 hover:border-purple-300 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1 bg-blue-50 p-3 border-l-4 border-blue-500">
                      <p className="text-xs font-bold text-blue-700 uppercase mb-1">
                        System Record
                      </p>
                      <p className="font-semibold text-slate-900 truncate">
                        {suggestion.transaction.description}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-sm">
                        <span className="font-bold text-blue-700">
                          {getCurrencySymbol(suggestion.transaction.currency)}
                          {suggestion.transaction.amount.toLocaleString()}
                        </span>
                        <span className="text-slate-500">
                          {new Date(
                            suggestion.transaction.transactionDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <div
                        className={`p-2 rounded-full ${
                          suggestion.confidence >= 90
                            ? "bg-emerald-100"
                            : suggestion.confidence >= 70
                            ? "bg-amber-100"
                            : "bg-orange-100"
                        }`}
                      >
                        <Link2
                          className={`w-5 h-5 ${
                            suggestion.confidence >= 90
                              ? "text-emerald-600"
                              : suggestion.confidence >= 70
                              ? "text-amber-600"
                              : "text-orange-600"
                          }`}
                        />
                      </div>
                    </div>
                    <div className="flex-1 bg-purple-50 p-3 border-l-4 border-purple-500">
                      <p className="text-xs font-bold text-purple-700 uppercase mb-1">
                        Statement Entry
                      </p>
                      <p className="font-semibold text-slate-900 truncate">
                        {suggestion.statementEntry.description}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-sm">
                        <span className="font-bold text-purple-700">
                          {getCurrencySymbol(suggestion.transaction.currency)}
                          {suggestion.statementEntry.amount.toLocaleString()}
                        </span>
                        <span className="text-slate-500">
                          {new Date(
                            suggestion.statementEntry.date
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`text-center px-3 py-2 rounded ${
                          suggestion.confidence >= 90
                            ? "bg-emerald-100"
                            : suggestion.confidence >= 70
                            ? "bg-amber-100"
                            : "bg-orange-100"
                        }`}
                      >
                        <p
                          className={`text-lg font-black ${
                            suggestion.confidence >= 90
                              ? "text-emerald-700"
                              : suggestion.confidence >= 70
                              ? "text-amber-700"
                              : "text-orange-700"
                          }`}
                        >
                          {suggestion.confidence}%
                        </p>
                        <p className="text-xs font-medium text-slate-600">
                          confidence
                        </p>
                      </div>
                      <button
                        onClick={() => handleAcceptMatch(suggestion)}
                        disabled={isSubmitting}
                        className="p-3 bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          setMatchSuggestions((prev) =>
                            prev.filter(
                              (s) =>
                                s.transactionId !== suggestion.transactionId ||
                                s.statementEntryId !==
                                  suggestion.statementEntryId
                            )
                          )
                        }
                        className="p-3 bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {matchSuggestions.length > 10 && (
              <p className="text-center text-sm text-slate-500 mt-4">
                Showing 10 of {matchSuggestions.length} suggestions
              </p>
            )}
          </motion.div>
        )}

        {/* ==================== FILTERS AND ACTIONS BAR ==================== */}
        {selectedAccount && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border-2 border-slate-200 p-4 lg:p-6 shadow-lg"
          >
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex-1 min-w-[200px] max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search transactions..."
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex border-2 border-slate-200 bg-slate-50">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2.5 transition-colors ${
                    viewMode === "table"
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("split")}
                  className={`p-2.5 transition-colors ${
                    viewMode === "split"
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Columns className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 border-2 font-semibold transition-all ${
                  showFilters
                    ? "bg-blue-50 border-blue-300 text-blue-700"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
                {(statusFilter !== "all" || dateFrom || dateTo) && (
                  <span className="w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </button>

              <button
                onClick={() => setShowBulkModal(true)}
                disabled={selectedTransactions.size === 0}
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white font-semibold shadow-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ListChecks className="w-4 h-4" />
                Bulk ({selectedTransactions.size})
              </button>

              <button
                onClick={handleAutoReconcile}
                disabled={balanceSummary.pendingCount === 0 || isSubmitting}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                Auto Match All
              </button>

              <button
                onClick={() => setShowCompleteModal(true)}
                disabled={
                  balanceSummary.pendingCount > 0 || transactions.length === 0
                }
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="w-4 h-4" />
                Complete
              </button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t-2 border-slate-100"
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value as typeof statusFilter);
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2.5 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="matched">Matched</option>
                      <option value="unmatched">Unmatched</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      From Date
                    </label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => {
                        setDateFrom(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2.5 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      To Date
                    </label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => {
                        setDateTo(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2.5 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="w-full px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Clear Filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ==================== TRANSACTIONS TABLE ==================== */}
        {selectedAccount && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/90 backdrop-blur-xl border-2 border-slate-200 shadow-2xl overflow-hidden"
          >
            <div className="p-4 lg:p-6 border-b-2 border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-lg lg:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Banknote className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                  Transaction Details
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  {totalTransactions} transactions • {selectedAccount.name}
                </p>
              </div>
              <div className="text-sm text-slate-600">
                Page {currentPage} of {totalPages || 1}
              </div>
            </div>

            {isLoadingTransactions ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <span className="ml-3 text-slate-600">
                  Loading transactions...
                </span>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <FileText className="w-16 h-16 mb-4 text-slate-300" />
                <p className="text-lg font-medium">No transactions found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-700 text-white">
                    <tr>
                      <th className="px-4 py-4 text-center w-12">
                        <button
                          onClick={handleSelectAll}
                          className="p-1 hover:bg-white/20 transition rounded"
                        >
                          {selectedTransactions.size ===
                            filteredTransactions.filter(
                              (t) =>
                                t.reconciliationStatus ===
                                ReconciliationStatus.Pending
                            ).length &&
                          filteredTransactions.filter(
                            (t) =>
                              t.reconciliationStatus ===
                              ReconciliationStatus.Pending
                          ).length > 0 ? (
                            <CheckSquare className="w-5 h-5" />
                          ) : (
                            <Square className="w-5 h-5 opacity-60" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">
                        Reference
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 py-4 text-right text-xs font-bold uppercase tracking-wider">
                        Expected
                      </th>
                      <th className="px-4 py-4 text-right text-xs font-bold uppercase tracking-wider">
                        Actual
                      </th>
                      <th className="px-4 py-4 text-right text-xs font-bold uppercase tracking-wider">
                        Variance
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredTransactions.map((txn, index) => (
                      <motion.tr
                        key={txn.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className={`hover:bg-blue-50/50 transition-colors ${
                          selectedTransactions.has(txn.id) ? "bg-blue-50" : ""
                        }`}
                      >
                        <td className="px-4 py-4 text-center">
                          {txn.reconciliationStatus ===
                            ReconciliationStatus.Pending && (
                            <button
                              onClick={() => handleSelectTransaction(txn.id)}
                              className="p-1 hover:bg-slate-200 transition rounded"
                            >
                              {selectedTransactions.has(txn.id) ? (
                                <CheckSquare className="w-5 h-5 text-blue-600" />
                              ) : (
                                <Square className="w-5 h-5 text-slate-400" />
                              )}
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-medium text-slate-900">
                              {new Date(txn.transactionDate).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric" }
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-sm font-mono text-blue-600 font-semibold">
                            {txn.reference || txn.code}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-900 font-medium line-clamp-1 max-w-xs">
                            {txn.description}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          {txn.transactionType === TransactionType.Debit ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold">
                              <ArrowUpCircle className="w-3 h-3" />
                              DR
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-bold">
                              <ArrowDownCircle className="w-3 h-3" />
                              CR
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-right whitespace-nowrap">
                          <span className="text-sm font-bold text-slate-900">
                            {getCurrencySymbol(txn.currency)}
                            {txn.amount.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right whitespace-nowrap">
                          {txn.actualAmount !== null ? (
                            <span className="text-sm font-bold text-purple-700">
                              {getCurrencySymbol(txn.currency)}
                              {txn.actualAmount.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-right whitespace-nowrap">
                          {txn.variance !== null ? (
                            Math.abs(txn.variance) < 0.01 ? (
                              <span className="text-sm font-bold text-emerald-600">
                                ✓
                              </span>
                            ) : (
                              <span className="text-sm font-bold text-red-600">
                                {txn.variance >= 0 ? "+" : ""}
                                {txn.variance.toLocaleString()}
                              </span>
                            )
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <StatusBadge status={txn.reconciliationStatus} />
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => {
                                setSelectedTransaction(txn);
                                setShowDetailModal(true);
                              }}
                              className="p-2 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {txn.reconciliationStatus ===
                              ReconciliationStatus.Pending && (
                              <>
                                <button
                                  onClick={() => handleQuickMatch(txn)}
                                  disabled={isSubmitting}
                                  className="p-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-all disabled:opacity-50"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedTransaction(txn);
                                    setReconcileForm({
                                      actualAmount: txn.amount,
                                      status: ReconciliationStatus.Matched,
                                      notes: "",
                                    });
                                    setShowReconcileModal(true);
                                  }}
                                  className="p-2 bg-amber-100 text-amber-700 hover:bg-amber-200 transition-all"
                                >
                                  <AlertCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t-2 border-slate-200 bg-slate-50">
                <div className="text-sm text-slate-600 font-medium">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, totalTransactions)} of{" "}
                  {totalTransactions}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border-2 border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 border-2 border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* No Account Selected - Show prompt */}
        {!selectedAccount && filteredAccounts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-2 border-slate-200 p-12 text-center shadow-lg"
          >
            <div className="w-20 h-20 bg-blue-100 flex items-center justify-center mx-auto mb-6">
              <Target className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Select an Account to Reconcile
            </h3>
            <p className="text-slate-600 max-w-md mx-auto mb-6">
              Choose an account from the dropdown above or click on one of the
              account cards to view and reconcile its transactions.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => document.querySelector("select")?.focus()}
                className="px-6 py-3 bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
              >
                Select Account
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* ==================== MODALS ==================== */}

      {/* Adjustment Modal */}
      <AnimatePresence>
        {showAdjustmentForm && selectedAccount && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAdjustmentForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white shadow-2xl max-w-md w-full overflow-hidden rounded-lg"
            >
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 flex items-center justify-center rounded-lg">
                      <Calculator className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">
                        Create Adjustment Entry
                      </h3>
                      <p className="text-amber-100 text-sm">
                        Balance the variance
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAdjustmentForm(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-amber-50 border-2 border-amber-200 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-amber-700">
                      Variance to adjust:
                    </span>
                    <span className="text-xl font-bold text-amber-700">
                      {currentVariance >= 0 ? "+" : ""}
                      {formatCurrency(
                        currentVariance,
                        selectedAccount.currency
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Adjustment Description *
                  </label>
                  <textarea
                    value={adjustmentNote}
                    onChange={(e) => setAdjustmentNote(e.target.value)}
                    placeholder="e.g., Bank charges not recorded, Interest income, etc."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-slate-200 focus:border-amber-500 focus:outline-none rounded-lg transition-all resize-none"
                  />
                </div>
                <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                    <p className="text-sm text-blue-700">
                      This will create a{" "}
                      {currentVariance > 0 ? "credit" : "debit"} entry of{" "}
                      <strong>
                        {formatCurrency(
                          Math.abs(currentVariance),
                          selectedAccount.currency
                        )}
                      </strong>{" "}
                      to balance your account.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 pt-4 border-t-2 border-slate-100">
                  <button
                    onClick={() => setShowAdjustmentForm(false)}
                    className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-colors rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (adjustmentNote.trim())
                        handleCreateAdjustment(currentVariance, adjustmentNote);
                    }}
                    disabled={!adjustmentNote.trim()}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:shadow-lg transition-all rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Create Adjustment
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Statement Upload Modal */}
      <AnimatePresence>
        {showStatementUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowStatementUpload(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white shadow-2xl max-w-lg w-full overflow-hidden"
            >
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 flex items-center justify-center">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">
                        Upload Bank Statement
                      </h3>
                      <p className="text-purple-100 text-sm">
                        CSV format supported
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowStatementUpload(false)}
                    className="p-2 hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div
                  className="border-2 border-dashed border-purple-300 p-8 text-center bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileSpreadsheet className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <p className="text-slate-900 font-semibold mb-1">
                    Drop your CSV file here
                  </p>
                  <p className="text-sm text-slate-500">or click to browse</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                <div className="bg-blue-50 border-2 border-blue-200 p-4">
                  <p className="text-sm font-bold text-blue-800 mb-2">
                    Supported CSV Format:
                  </p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>
                      • Columns: Date, Description, Debit, Credit (or Amount)
                    </li>
                    <li>• Optional: Reference, Balance</li>
                    <li>• First row should be headers</li>
                  </ul>
                </div>
                {statementEntries.length > 0 && (
                  <div className="bg-emerald-50 border-2 border-emerald-200 p-4">
                    <p className="text-sm font-bold text-emerald-800">
                      ✓ {statementEntries.length} entries loaded •{" "}
                      {unmatchedStatementEntries.length} unmatched
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts Modal */}
      <AnimatePresence>
        {showKeyboardShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowKeyboardShortcuts(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="bg-slate-800 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Keyboard className="w-6 h-6" />
                    <h3 className="text-xl font-bold">Keyboard Shortcuts</h3>
                  </div>
                  <button
                    onClick={() => setShowKeyboardShortcuts(false)}
                    className="p-2 hover:bg-white/20"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-3">
                {[
                  { key: "R", action: "Refresh data" },
                  { key: "U", action: "Upload statement" },
                  { key: "A", action: "Auto-match all" },
                  { key: "Esc", action: "Close modals" },
                  { key: "Shift + ?", action: "Show shortcuts" },
                ].map(({ key, action }) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-2 border-b border-slate-100"
                  >
                    <span className="text-slate-600">{action}</span>
                    <kbd className="px-3 py-1 bg-slate-100 border border-slate-300 text-sm font-mono rounded">
                      {key}
                    </kbd>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reconcile Transaction Modal */}
      <AnimatePresence>
        {showReconcileModal && selectedTransaction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowReconcileModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white shadow-2xl max-w-lg w-full overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 flex items-center justify-center">
                      <Scale className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">
                        Reconcile Transaction
                      </h3>
                      <p className="text-blue-100 text-sm">
                        {selectedTransaction.code}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowReconcileModal(false)}
                    className="p-2 hover:bg-white/20"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-slate-50 border-2 border-slate-200 p-4">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                    Description
                  </p>
                  <p className="text-lg font-semibold text-slate-900">
                    {selectedTransaction.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 border-2 border-blue-200 p-4">
                    <p className="text-xs font-bold text-blue-700 uppercase mb-1">
                      Expected
                    </p>
                    <p className="text-2xl font-bold text-blue-700">
                      {getCurrencySymbol(selectedTransaction.currency)}
                      {selectedTransaction.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-slate-50 border-2 border-slate-200 p-4">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                      Date
                    </p>
                    <p className="text-lg font-semibold text-slate-900">
                      {new Date(
                        selectedTransaction.transactionDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Actual Amount *
                  </label>
                  <input
                    type="number"
                    value={reconcileForm.actualAmount || ""}
                    onChange={(e) =>
                      setReconcileForm({
                        ...reconcileForm,
                        actualAmount: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="Enter actual amount"
                    step="0.01"
                    className="w-full px-4 py-3 border-2 border-slate-300 focus:border-blue-500 focus:outline-none text-lg font-bold transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Status *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer p-3 border-2 rounded transition-all flex-1 justify-center hover:bg-emerald-50 hover:border-emerald-300">
                      <input
                        type="radio"
                        checked={
                          reconcileForm.status === ReconciliationStatus.Matched
                        }
                        onChange={() =>
                          setReconcileForm({
                            ...reconcileForm,
                            status: ReconciliationStatus.Matched,
                          })
                        }
                        className="w-4 h-4 text-emerald-600"
                      />
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-bold">Matched</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-3 border-2 rounded transition-all flex-1 justify-center hover:bg-red-50 hover:border-red-300">
                      <input
                        type="radio"
                        checked={
                          reconcileForm.status ===
                          ReconciliationStatus.Unmatched
                        }
                        onChange={() =>
                          setReconcileForm({
                            ...reconcileForm,
                            status: ReconciliationStatus.Unmatched,
                          })
                        }
                        className="w-4 h-4 text-red-600"
                      />
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-bold">Unmatched</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Notes
                  </label>
                  <textarea
                    value={reconcileForm.notes}
                    onChange={(e) =>
                      setReconcileForm({
                        ...reconcileForm,
                        notes: e.target.value,
                      })
                    }
                    placeholder="Optional notes..."
                    rows={2}
                    className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all resize-none"
                  />
                </div>
                {reconcileForm.actualAmount > 0 && (
                  <div
                    className={`p-4 border-2 ${
                      Math.abs(
                        reconcileForm.actualAmount - selectedTransaction.amount
                      ) < 0.01
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-700">
                        Variance:
                      </span>
                      <span
                        className={`text-lg font-bold ${
                          Math.abs(
                            reconcileForm.actualAmount -
                              selectedTransaction.amount
                          ) < 0.01
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {Math.abs(
                          reconcileForm.actualAmount -
                            selectedTransaction.amount
                        ) < 0.01
                          ? "✓ Matched"
                          : `${getCurrencySymbol(
                              selectedTransaction.currency
                            )}${(
                              reconcileForm.actualAmount -
                              selectedTransaction.amount
                            ).toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                )}
                <div className="flex gap-3 pt-4 border-t-2 border-slate-200">
                  <button
                    onClick={() => setShowReconcileModal(false)}
                    className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReconcileTransaction}
                    disabled={isSubmitting || reconcileForm.actualAmount <= 0}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Reconcile Modal */}
      <AnimatePresence>
        {showBulkModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowBulkModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 flex items-center justify-center">
                      <ListChecks className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold">Bulk Reconciliation</h3>
                  </div>
                  <button
                    onClick={() => setShowBulkModal(false)}
                    className="p-2 hover:bg-white/20"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-purple-50 border-2 border-purple-200 p-4">
                  <p className="text-sm text-purple-900">
                    <strong>{selectedTransactions.size}</strong> transactions
                    selected
                  </p>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() =>
                      handleBulkReconcile(ReconciliationStatus.Matched)
                    }
                    disabled={isSubmitting}
                    className="w-full px-4 py-4 bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                    Mark All as Matched
                  </button>
                  <button
                    onClick={() =>
                      handleBulkReconcile(ReconciliationStatus.Unmatched)
                    }
                    disabled={isSubmitting}
                    className="w-full px-4 py-4 bg-red-600 text-white font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <AlertTriangle className="w-5 h-5" />
                    )}
                    Mark All as Unmatched
                  </button>
                </div>
                <button
                  onClick={() => setShowBulkModal(false)}
                  className="w-full px-4 py-3 bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Complete Reconciliation Modal */}
      <AnimatePresence>
        {showCompleteModal && selectedAccount && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCompleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white shadow-2xl max-w-lg w-full overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">
                        Complete Reconciliation
                      </h3>
                      <p className="text-blue-100 text-sm">
                        {selectedAccount.name}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCompleteModal(false)}
                    className="p-2 hover:bg-white/20"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 border-2 border-blue-200 p-4">
                    <p className="text-xs font-bold text-blue-700 uppercase mb-1">
                      Expected
                    </p>
                    <p className="text-xl font-bold text-blue-700">
                      {getCurrencySymbol(selectedAccount.currency)}
                      {selectedAccount.balance.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-purple-50 border-2 border-purple-200 p-4">
                    <p className="text-xs font-bold text-purple-700 uppercase mb-1">
                      Actual
                    </p>
                    <p className="text-xl font-bold text-purple-700">
                      {getCurrencySymbol(selectedAccount.currency)}
                      {effectiveActualBalance.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div
                  className={`p-4 border-2 ${
                    isBalanced || isReconciliationComplete
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">
                      Variance:
                    </span>
                    <span
                      className={`text-xl font-bold ${
                        isBalanced || isReconciliationComplete
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {isBalanced || isReconciliationComplete
                        ? "✓ Balanced"
                        : `${getCurrencySymbol(
                            selectedAccount.currency
                          )}${currentVariance.toLocaleString()}`}
                    </span>
                  </div>
                </div>
                <div className="bg-slate-50 border-2 border-slate-200 p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Matched:</span>
                    <span className="text-sm font-bold text-emerald-600">
                      {balanceSummary.matchedCount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Unmatched:</span>
                    <span className="text-sm font-bold text-red-600">
                      {balanceSummary.unmatchedCount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Pending:</span>
                    <span className="text-sm font-bold text-amber-600">
                      {balanceSummary.pendingCount}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 pt-4 border-t-2 border-slate-200">
                  <button
                    onClick={() => setShowCompleteModal(false)}
                    className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCompleteReconciliation}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    Complete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedTransaction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div
                className={`p-6 text-white ${
                  selectedTransaction.reconciliationStatus ===
                  ReconciliationStatus.Matched
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600"
                    : selectedTransaction.reconciliationStatus ===
                      ReconciliationStatus.Unmatched
                    ? "bg-gradient-to-r from-red-600 to-rose-600"
                    : "bg-gradient-to-r from-amber-500 to-orange-500"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 flex items-center justify-center">
                      <Banknote className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">
                        Transaction Details
                      </h3>
                      <p className="text-white/80 text-sm font-mono">
                        {selectedTransaction.code}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-2 hover:bg-white/20"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 border-2 border-slate-200 p-4">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                      Date
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      {new Date(
                        selectedTransaction.transactionDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-slate-50 border-2 border-slate-200 p-4">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                      Reference
                    </p>
                    <p className="text-lg font-bold text-blue-600 font-mono">
                      {selectedTransaction.reference ||
                        selectedTransaction.code}
                    </p>
                  </div>
                </div>
                <div className="bg-slate-50 border-2 border-slate-200 p-4">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                    Description
                  </p>
                  <p className="text-lg font-semibold text-slate-900">
                    {selectedTransaction.description}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 border-2 border-blue-200 p-4">
                    <p className="text-xs font-bold text-blue-700 uppercase mb-1">
                      Expected
                    </p>
                    <p className="text-2xl font-bold text-blue-700">
                      {getCurrencySymbol(selectedTransaction.currency)}
                      {selectedTransaction.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-purple-50 border-2 border-purple-200 p-4">
                    <p className="text-xs font-bold text-purple-700 uppercase mb-1">
                      Actual
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        selectedTransaction.actualAmount !== null
                          ? "text-purple-700"
                          : "text-slate-400"
                      }`}
                    >
                      {selectedTransaction.actualAmount !== null
                        ? `${getCurrencySymbol(
                            selectedTransaction.currency
                          )}${selectedTransaction.actualAmount.toLocaleString()}`
                        : "Not Set"}
                    </p>
                  </div>
                  <div
                    className={`p-4 border-2 ${
                      selectedTransaction.actualAmount === null
                        ? "bg-slate-50 border-slate-200"
                        : selectedTransaction.variance !== null &&
                          Math.abs(selectedTransaction.variance) < 0.01
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-700 uppercase mb-1">
                      Variance
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        selectedTransaction.actualAmount === null
                          ? "text-slate-400"
                          : selectedTransaction.variance !== null &&
                            Math.abs(selectedTransaction.variance) < 0.01
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedTransaction.actualAmount !== null
                        ? selectedTransaction.variance !== null &&
                          Math.abs(selectedTransaction.variance) < 0.01
                          ? "✓ Match"
                          : `${getCurrencySymbol(
                              selectedTransaction.currency
                            )}${(
                              selectedTransaction.variance || 0
                            ).toLocaleString()}`
                        : "-"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 border-2 border-slate-200 p-4">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">
                      Type
                    </p>
                    {selectedTransaction.transactionType ===
                    TransactionType.Debit ? (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 font-bold">
                        <ArrowUpCircle className="w-5 h-5" />
                        DEBIT
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 font-bold">
                        <ArrowDownCircle className="w-5 h-5" />
                        CREDIT
                      </span>
                    )}
                  </div>
                  <div className="bg-slate-50 border-2 border-slate-200 p-4">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">
                      Status
                    </p>
                    <StatusBadge
                      status={selectedTransaction.reconciliationStatus}
                    />
                  </div>
                </div>
                {selectedTransaction.reconciliationNotes && (
                  <div className="bg-amber-50 border-2 border-amber-200 p-4">
                    <p className="text-xs font-bold text-amber-700 uppercase mb-1">
                      Notes
                    </p>
                    <p className="text-sm text-amber-900">
                      {selectedTransaction.reconciliationNotes}
                    </p>
                  </div>
                )}
              </div>
              <div className="p-4 border-t-2 border-slate-200 bg-slate-50">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-full px-4 py-3 bg-slate-700 text-white font-bold hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {showHistoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowHistoryModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col"
            >
              <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-700 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">
                        Reconciliation History
                      </h3>
                      <p className="text-slate-300 text-sm">
                        {getAccountTypeLabel(selectedAccountType)} accounts
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowHistoryModal(false)}
                    className="p-2 hover:bg-white/20"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                {reconciliationHistory?.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                    <p className="text-lg font-medium">
                      No reconciliation history
                    </p>
                    <p className="text-sm">
                      Complete a reconciliation to see records here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reconciliationHistory?.map((rec) => (
                      <div
                        key={rec.id}
                        className={`p-4 border-2 ${
                          rec.status === ReconciliationStatus.Matched
                            ? "bg-emerald-50 border-emerald-200"
                            : rec.status === ReconciliationStatus.Unmatched
                            ? "bg-red-50 border-red-200"
                            : "bg-amber-50 border-amber-200"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-bold text-slate-900">
                              {rec.accountName}
                            </p>
                            <p className="text-sm text-slate-600">
                              {new Date(rec.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <StatusBadge status={rec.status} />
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                          <div>
                            <p className="text-slate-500">Expected</p>
                            <p className="font-bold">
                              {getCurrencySymbol(rec.currency)}
                              {rec.expectedBalance.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500">Actual</p>
                            <p className="font-bold">
                              {getCurrencySymbol(rec.currency)}
                              {rec.actualBalance.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500">Variance</p>
                            <p
                              className={`font-bold ${
                                Math.abs(rec.variance) < 0.01
                                  ? "text-emerald-600"
                                  : "text-red-600"
                              }`}
                            >
                              {Math.abs(rec.variance) < 0.01
                                ? "✓ Balanced"
                                : `${getCurrencySymbol(
                                    rec.currency
                                  )}${rec.variance.toLocaleString()}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-4 border-t-2 border-slate-200 bg-slate-50">
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="w-full px-4 py-3 bg-slate-700 text-white font-bold hover:bg-slate-800 transition-colors"
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
