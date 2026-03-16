// import { useState, useEffect, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Smartphone,
//   Plus,
//   Search,
//   Filter,
//   Eye,
//   Wallet,
//   Phone,
//   TrendingUp,
//   TrendingDown,
//   AlertCircle,
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
//   User,
//   Hash,
//   Zap,
//   CreditCard,
//   RefreshCw,
//   ArrowRight,
//   Loader2,
// } from "lucide-react";
// import { toast } from "sonner";
// import {
//   getMpesaAgents,
//   getMpesaAgentById,
//   createMpesaAgent,
//   updateMpesaAgent,
//   deleteMpesaAgent,
//   getMpesaAgentStatement,
//   getMpesaStats,
//   MpesaAgentDto,
//   CreateMpesaAgentDto,
// } from "@/lib/api";

// interface Transaction {
//   id: string;
//   date: string;
//   description: string;
//   type: "debit" | "credit";
//   currency: "KES";
//   amount: number;
//   balance: number;
//   reference: string;
//   relatedAccount?: {
//     accountType: string;
//     accountName: string;
//     accountId: string;
//     effect: "debit" | "credit";
//     balanceAfter: number;
//   };
// }

// interface MPesaAgent {
//   id: string;
//   code: string;
//   agentName: string;
//   phoneNumber: string;
//   agentNumber: string;
//   storeNumber: string;
//   agentType: number;
//   balance: number;
//   openingBalance: number;
//   kesDebit: number;
//   kesCredit: number;
//   status: "active" | "inactive";
//   registered: string;
//   lastActivity: string;
//   transactions: Transaction[];
// }

// interface MpesaStats {
//   totalAgents: number;
//   totalBalance: number;
//   totalDebit: number;
//   totalCredit: number;
// }

// interface FormData {
//   agentName: string;
//   phoneNumber: string;
//   agentNumber: string;
//   storeNumber: string;
//   agentType: number;
//   openingBalance: number;
// }

// interface EditFormData {
//   agentName: string;
//   storeNumber: string;
//   agentType: number;
//   isActive: boolean;
// }

// export function MPesaAccounts() {
//   // Data states
//   const [allAgents, setAllAgents] = useState<MPesaAgent[]>([]);
//   const [stats, setStats] = useState<MpesaStats>({
//     totalAgents: 0,
//     totalBalance: 0,
//     totalDebit: 0,
//     totalCredit: 0,
//   });
//   const [statementTransactions, setStatementTransactions] = useState<
//     Transaction[]
//   >([]);

//   // Loading states
//   const [isLoading, setIsLoading] = useState(true);
//   const [isLoadingStatement, setIsLoadingStatement] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // UI states
//   const [activeTab, setActiveTab] = useState<"all" | "outstanding">("all");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showAddAgent, setShowAddAgent] = useState(false);
//   const [selectedAgent, setSelectedAgent] = useState<MPesaAgent | null>(null);
//   const [selectedTransaction, setSelectedTransaction] =
//     useState<Transaction | null>(null);
//   const [showViewTransaction, setShowViewTransaction] = useState(false);
//   const [showEditTransaction, setShowEditTransaction] = useState(false);
//   const [showDeleteTransaction, setShowDeleteTransaction] = useState(false);
//   const [showRelatedAccount, setShowRelatedAccount] = useState(false);
//   const [showEditAgent, setShowEditAgent] = useState(false);
//   const [showDeleteAgent, setShowDeleteAgent] = useState(false);
//   const [transactionSearch, setTransactionSearch] = useState("");
//   const [transactionFilter, setTransactionFilter] = useState<
//     "all" | "credit" | "debit"
//   >("all");
//   const [agentsCurrentPage, setAgentsCurrentPage] = useState(1);
//   const [agentsPerPage] = useState(10);
//   const [transactionsCurrentPage, setTransactionsCurrentPage] = useState(1);
//   const [transactionsPerPage] = useState(15);

//   // Form states
//   const [formData, setFormData] = useState<FormData>({
//     agentName: "",
//     phoneNumber: "",
//     agentNumber: "",
//     storeNumber: "",
//     agentType: 0,
//     openingBalance: 0,
//   });

//   const [editFormData, setEditFormData] = useState<EditFormData>({
//     agentName: "",
//     storeNumber: "",
//     agentType: 0,
//     isActive: true,
//   });

//   // Map backend DTO to frontend MPesaAgent interface
//   const mapDtoToAgent = (dto: MpesaAgentDto): MPesaAgent => {
//     return {
//       id: dto.id,
//       code: dto.code,
//       agentName: dto.agentName,
//       phoneNumber: dto.phoneNumber,
//       agentNumber: dto.agentNumber,
//       storeNumber: dto.storeNumber || dto.tillNumber || "",
//       agentType: dto.agentType || 0,
//       balance: dto.balance,
//       openingBalance: dto.openingBalance,
//       kesDebit: 0, // Will be populated from stats or statement
//       kesCredit: 0, // Will be populated from stats or statement
//       status: dto.isActive ? "active" : "inactive",
//       registered: new Date(dto.createdAt).toLocaleDateString(),
//       lastActivity: "Recently",
//       transactions: [],
//     };
//   };

//   // Fetch all M-Pesa agents
//   const fetchAgents = useCallback(async () => {
//     try {
//       const response = await getMpesaAgents();
//       if (response.success && response.data) {
//         const mappedAgents = response.data.map(mapDtoToAgent);
//         setAllAgents(mappedAgents);
//       }
//     } catch (error) {
//       console.error("Error fetching M-Pesa agents:", error);
//       toast.error("Failed to fetch M-Pesa agents");
//     }
//   }, []);

//   // Fetch M-Pesa stats
//   const fetchStats = useCallback(async () => {
//     try {
//       const response = await getMpesaStats();
//       if (response.success && response.data) {
//         setStats({
//           totalAgents: response.data.totalAgents || 0,
//           totalBalance: response.data.totalBalance || 0,
//           totalDebit: response.data.totalDebit || 0,
//           totalCredit: response.data.totalCredit || 0,
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching M-Pesa stats:", error);
//     }
//   }, []);

//   // Fetch agent statement/transactions
//   const fetchAgentStatement = useCallback(async (agentId: string) => {
//     setIsLoadingStatement(true);
//     try {
//       const response = await getMpesaAgentStatement(agentId);
//       if (response.success && response.data) {
//         const transactions: Transaction[] = (
//           response.data.transactions || []
//         ).map((txn: any) => ({
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
//                 accountType: txn.relatedAccount.accountType || "Unknown",
//                 accountName: txn.relatedAccount.accountName || "Unknown",
//                 accountId: txn.relatedAccount.accountId || "",
//                 effect:
//                   txn.relatedAccount.effect === "debit" ? "debit" : "credit",
//                 balanceAfter: txn.relatedAccount.balanceAfter || 0,
//               }
//             : undefined,
//         }));
//         setStatementTransactions(transactions);
//       }
//     } catch (error) {
//       console.error("Error fetching agent statement:", error);
//       toast.error("Failed to fetch agent statement");
//     } finally {
//       setIsLoadingStatement(false);
//     }
//   }, []);

//   // Initial data fetch
//   useEffect(() => {
//     const loadData = async () => {
//       setIsLoading(true);
//       await Promise.all([fetchAgents(), fetchStats()]);
//       setIsLoading(false);
//     };
//     loadData();
//   }, [fetchAgents, fetchStats]);

//   // Fetch statement when agent is selected
//   useEffect(() => {
//     if (selectedAgent) {
//       fetchAgentStatement(selectedAgent.id);
//     }
//   }, [selectedAgent, fetchAgentStatement]);

//   // Refresh all data
//   const handleRefresh = async () => {
//     setIsLoading(true);
//     await Promise.all([fetchAgents(), fetchStats()]);
//     setIsLoading(false);
//     toast.success("Data refreshed!");
//   };

//   // Create new M-Pesa agent
//   const handleCreateAgent = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.agentName || !formData.phoneNumber || !formData.agentNumber) {
//       toast.error("Please fill in all required fields");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const createDto: CreateMpesaAgentDto = {
//         agentName: formData.agentName,
//         phoneNumber: formData.phoneNumber,
//         agentNumber: formData.agentNumber,
//         storeNumber: formData.storeNumber || undefined,
//         agentType: formData.agentType,
//         openingBalance: formData.openingBalance,
//       };

//       const response = await createMpesaAgent(createDto);
//       if (response.success) {
//         toast.success("M-Pesa Agent created successfully!");
//         setShowAddAgent(false);
//         setFormData({
//           agentName: "",
//           phoneNumber: "",
//           agentNumber: "",
//           storeNumber: "",
//           agentType: 0,
//           openingBalance: 0,
//         });
//         await Promise.all([fetchAgents(), fetchStats()]);
//       } else {
//         toast.error(response.error || "Failed to create M-Pesa agent");
//       }
//     } catch (error) {
//       console.error("Error creating M-Pesa agent:", error);
//       toast.error("Failed to create M-Pesa agent");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Update M-Pesa agent
//   const handleUpdateAgent = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedAgent) return;

//     setIsSubmitting(true);
//     try {
//       const updateDto = {
//         agentName: editFormData.agentName || undefined,
//         storeNumber: editFormData.storeNumber || undefined,
//         agentType: editFormData.agentType,
//         isActive: editFormData.isActive,
//       };

//       const response = await updateMpesaAgent(selectedAgent.id, updateDto);
//       if (response.success) {
//         toast.success("M-Pesa Agent updated successfully!");
//         setShowEditAgent(false);
//         setSelectedAgent(null);
//         await Promise.all([fetchAgents(), fetchStats()]);
//       } else {
//         toast.error(response.error || "Failed to update M-Pesa agent");
//       }
//     } catch (error) {
//       console.error("Error updating M-Pesa agent:", error);
//       toast.error("Failed to update M-Pesa agent");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Delete M-Pesa agent
//   const handleDeleteAgent = async () => {
//     if (!selectedAgent) return;

//     setIsSubmitting(true);
//     try {
//       const response = await deleteMpesaAgent(selectedAgent.id);
//       if (response.success) {
//         toast.success("M-Pesa Agent deleted successfully!");
//         setShowDeleteAgent(false);
//         setSelectedAgent(null);
//         await Promise.all([fetchAgents(), fetchStats()]);
//       } else {
//         toast.error(response.error || "Failed to delete M-Pesa agent");
//       }
//     } catch (error) {
//       console.error("Error deleting M-Pesa agent:", error);
//       toast.error("Failed to delete M-Pesa agent");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Use stats for summary cards
//   const totalKesDebit = stats.totalDebit;
//   const totalKesCredit = stats.totalCredit;

//   // Filtered agents based on tab
//   const agentsWithOutstanding = allAgents.filter((agent) => agent.balance > 0);

//   const displayedAgents =
//     activeTab === "outstanding" ? agentsWithOutstanding : allAgents;

//   // Search filter
//   const filteredAgents = displayedAgents.filter(
//     (agent) =>
//       agent.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       agent.phoneNumber.includes(searchTerm) ||
//       agent.agentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       agent.storeNumber.includes(searchTerm) ||
//       agent.code.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Pagination for agents
//   const indexOfLastAgent = agentsCurrentPage * agentsPerPage;
//   const indexOfFirstAgent = indexOfLastAgent - agentsPerPage;
//   const currentAgents = filteredAgents.slice(
//     indexOfFirstAgent,
//     indexOfLastAgent
//   );
//   const totalAgentPages = Math.ceil(filteredAgents.length / agentsPerPage);

//   // Calculate net balance (debit - credit)
//   const getNetBalance = (agent: MPesaAgent) => {
//     return {
//       kesNet: agent.balance,
//     };
//   };

//   // Transaction filtering
//   const filteredTransactions = statementTransactions.filter((txn) => {
//     const matchesSearch =
//       txn.description.toLowerCase().includes(transactionSearch.toLowerCase()) ||
//       txn.reference.toLowerCase().includes(transactionSearch.toLowerCase());
//     const matchesType =
//       transactionFilter === "all" || txn.type === transactionFilter;
//     return matchesSearch && matchesType;
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
//     toast.success("Statement exported successfully!");
//   };

//   const handlePrintStatement = () => {
//     toast.success("Printing statement...");
//   };

//   const handleEditAgent = (agent: MPesaAgent) => {
//     setSelectedAgent(agent);
//     setEditFormData({
//       agentName: agent.agentName,
//       storeNumber: agent.storeNumber,
//       agentType: agent.agentType,
//       isActive: agent.status === "active",
//     });
//     setShowEditAgent(true);
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

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 p-6 flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="w-8 h-8 animate-spin text-cyan-600 mx-auto mb-4" />
//           <p className="text-slate-600">Loading M-Pesa agents...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
//             M-Pesa Agents
//           </h2>
//           <p className="text-slate-600 mt-1">
//             Manage M-Pesa agents and transactions
//           </p>
//         </div>
//         <div className="flex gap-3">
//           <button
//             onClick={handleRefresh}
//             className="flex items-center gap-2 px-5 py-3 bg-slate-600 text-white font-semibold shadow-lg hover:bg-slate-700 transition-all"
//           >
//             <RefreshCw className="w-5 h-5" />
//             Refresh
//           </button>
//           <button
//             onClick={() => setShowAddAgent(true)}
//             className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transform hover:scale-105 transition-all"
//           >
//             <Plus className="w-5 h-5" />
//             Add M-Pesa Agent
//           </button>
//         </div>
//       </div>

//       {/* Summary Cards - PREMIUM SHARP DESIGN */}
//       <div className="grid md:grid-cols-4 gap-4">
//         {/* Total Agents Card */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="relative bg-gradient-to-br from-cyan-600 via-blue-600 to-cyan-700 text-white shadow-xl shadow-cyan-500/20 overflow-hidden group hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300"
//         >
//           {/* Background Pattern */}
//           <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

//           <div className="relative p-6">
//             <div className="flex items-start justify-between mb-4">
//               <div className="w-12 h-12 bg-white/10 backdrop-blur-sm flex items-center justify-center border-2 border-white/20">
//                 <Phone className="w-6 h-6" />
//               </div>
//               <div className="bg-white/20 backdrop-blur-sm px-3 py-1 border border-white/30">
//                 <span className="text-[10px] font-bold uppercase tracking-wide">
//                   Total
//                 </span>
//               </div>
//             </div>
//             <p className="text-xs opacity-90 mb-1 uppercase tracking-wider font-semibold">
//               Total Agents
//             </p>
//             <p className="text-4xl font-bold tracking-tight">
//               {stats.totalAgents || allAgents.length}
//             </p>
//             <div className="mt-3 pt-3 border-t border-white/20">
//               <p className="text-[10px] opacity-75">All M-Pesa Agents</p>
//             </div>
//           </div>
//         </motion.div>

//         {/* Total Debit Card (Money IN for M-Pesa) */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-emerald-300 transition-all duration-300 group"
//         >
//           <div className="p-6">
//             <div className="flex items-start justify-between mb-4">
//               <div className="w-12 h-12 bg-emerald-100 flex items-center justify-center border-2 border-emerald-200 group-hover:bg-emerald-200 transition-colors">
//                 <TrendingUp className="w-6 h-6 text-emerald-600" />
//               </div>
//               <div className="bg-emerald-100 px-3 py-1 border border-emerald-200">
//                 <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
//                   Debit
//                 </span>
//               </div>
//             </div>
//             <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
//               KES Total Debit (Money In)
//             </p>
//             <p className="text-3xl font-bold text-emerald-600 tracking-tight">
//               KES {totalKesDebit.toLocaleString()}
//             </p>
//             <div className="mt-3 pt-3 border-t-2 border-slate-100">
//               <div className="flex items-center justify-between">
//                 <p className="text-[10px] text-slate-500 font-semibold">
//                   Money In
//                 </p>
//                 <TrendingUp className="w-4 h-4 text-emerald-500" />
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Total Credit Card (Money OUT for M-Pesa) */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-red-300 transition-all duration-300 group"
//         >
//           <div className="p-6">
//             <div className="flex items-start justify-between mb-4">
//               <div className="w-12 h-12 bg-red-100 flex items-center justify-center border-2 border-red-200 group-hover:bg-red-200 transition-colors">
//                 <TrendingDown className="w-6 h-6 text-red-600" />
//               </div>
//               <div className="bg-red-100 px-3 py-1 border border-red-200">
//                 <span className="text-[10px] font-bold text-red-700 uppercase tracking-wide">
//                   Credit
//                 </span>
//               </div>
//             </div>
//             <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
//               KES Total Credit (Money Out)
//             </p>
//             <p className="text-3xl font-bold text-red-600 tracking-tight">
//               KES {totalKesCredit.toLocaleString()}
//             </p>
//             <div className="mt-3 pt-3 border-t-2 border-slate-100">
//               <div className="flex items-center justify-between">
//                 <p className="text-[10px] text-slate-500 font-semibold">
//                   Money Out
//                 </p>
//                 <TrendingDown className="w-4 h-4 text-red-500" />
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Net Balance Card */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-cyan-300 transition-all duration-300 group"
//         >
//           <div className="p-6">
//             <div className="flex items-start justify-between mb-4">
//               <div className="w-12 h-12 bg-cyan-100 flex items-center justify-center border-2 border-cyan-200 group-hover:bg-cyan-200 transition-colors">
//                 <Activity className="w-6 h-6 text-cyan-600" />
//               </div>
//               <div className="bg-cyan-100 px-3 py-1 border border-cyan-200">
//                 <span className="text-[10px] font-bold text-cyan-700 uppercase tracking-wide">
//                   Net
//                 </span>
//               </div>
//             </div>
//             <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
//               Net Balance
//             </p>
//             <p
//               className={`text-3xl font-bold tracking-tight ${
//                 totalKesDebit - totalKesCredit >= 0
//                   ? "text-emerald-600"
//                   : "text-red-600"
//               }`}
//             >
//               {totalKesDebit - totalKesCredit >= 0 ? "+" : ""}KES{" "}
//               {(totalKesDebit - totalKesCredit).toLocaleString()}
//             </p>
//             <div className="mt-3 pt-3 border-t-2 border-slate-100">
//               <div className="flex items-center justify-between text-[10px]">
//                 <span className="text-slate-500 font-semibold">
//                   Debit - Credit
//                 </span>
//                 <Activity className="w-4 h-4 text-cyan-500" />
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </div>

//       {/* Tabs */}
//       <div className="flex flex-wrap gap-3">
//         <button
//           onClick={() => setActiveTab("all")}
//           className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all duration-300 ${
//             activeTab === "all"
//               ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30"
//               : "bg-white text-slate-600 hover:bg-cyan-50 border-2 border-slate-200 hover:border-cyan-300"
//           }`}
//         >
//           <Smartphone className="w-5 h-5" />
//           All Agents
//           <span
//             className={`px-2 py-0.5 rounded-full text-xs font-bold ${
//               activeTab === "all" ? "bg-white/20" : "bg-cyan-100 text-cyan-700"
//             }`}
//           >
//             {allAgents.length}
//           </span>
//         </button>

//         <button
//           onClick={() => setActiveTab("outstanding")}
//           className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all duration-300 ${
//             activeTab === "outstanding"
//               ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/30"
//               : "bg-white text-slate-600 hover:bg-red-50 border-2 border-slate-200 hover:border-red-300"
//           }`}
//         >
//           <AlertCircle className="w-5 h-5" />
//           With Balance
//           <span
//             className={`px-2 py-0.5 rounded-full text-xs font-bold ${
//               activeTab === "outstanding"
//                 ? "bg-white/20"
//                 : "bg-red-100 text-red-700"
//             }`}
//           >
//             {agentsWithOutstanding.length}
//           </span>
//         </button>
//       </div>

//       {/* Search & Filters */}
//       <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-lg">
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="relative flex-1">
//             <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
//             <input
//               type="text"
//               placeholder="Search by agent name, phone, store number, or agent number..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-cyan-500 focus:bg-white focus:shadow-lg focus:shadow-cyan-500/10 transition-all duration-300 placeholder:text-slate-400"
//             />
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={() => toast.info("Opening filter options...")}
//               className="flex items-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all font-medium text-slate-700"
//             >
//               <Filter className="w-5 h-5" />
//               <span className="hidden sm:inline">Filters</span>
//             </button>
//             <button
//               onClick={() => toast.success("Exporting M-Pesa agents list...")}
//               className="flex items-center gap-2 px-5 py-3 bg-cyan-100 hover:bg-cyan-200 text-cyan-700 rounded-xl transition-all font-medium"
//             >
//               <Download className="w-5 h-5" />
//               <span className="hidden sm:inline">Export</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* M-Pesa Agents Table */}
//       <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-xl overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
//               <tr>
//                 <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
//                   Agent Code
//                 </th>
//                 <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
//                   Agent Details
//                 </th>
//                 <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
//                   Store Info
//                 </th>
//                 <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
//                   Balance
//                 </th>
//                 <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
//                   Status
//                 </th>
//                 <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-200">
//               {currentAgents.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={6}
//                     className="px-4 py-8 text-center text-slate-500"
//                   >
//                     No M-Pesa agents found.
//                   </td>
//                 </tr>
//               ) : (
//                 currentAgents.map((agent, index) => {
//                   const { kesNet } = getNetBalance(agent);
//                   return (
//                     <motion.tr
//                       key={agent.id}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.03 }}
//                       className="hover:bg-cyan-50/50 transition-all duration-200 cursor-pointer group"
//                     >
//                       <td className="px-4 py-4 whitespace-nowrap">
//                         <span className="text-sm font-bold text-cyan-600 group-hover:text-cyan-700">
//                           {agent.code}
//                         </span>
//                       </td>
//                       <td className="px-4 py-4">
//                         <div>
//                           <div className="font-bold text-slate-900 text-sm whitespace-nowrap">
//                             {agent.agentName}
//                           </div>
//                           <div className="flex flex-col gap-0.5 mt-1">
//                             <span className="flex items-center gap-1.5 text-xs text-slate-600">
//                               <Phone className="w-3 h-3" />
//                               {agent.phoneNumber}
//                             </span>
//                             <span className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
//                               <User className="w-3 h-3" />
//                               {agent.agentNumber}
//                             </span>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap">
//                         {agent.storeNumber ? (
//                           <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-100 text-cyan-700">
//                             <Zap className="w-3 h-3" />
//                             {agent.storeNumber}
//                           </span>
//                         ) : (
//                           <span className="text-xs text-slate-400">-</span>
//                         )}
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap">
//                         <span
//                           className={`text-sm font-bold ${
//                             kesNet >= 0 ? "text-emerald-600" : "text-red-600"
//                           }`}
//                         >
//                           KES {kesNet.toLocaleString()}
//                         </span>
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap">
//                         <span
//                           className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold ${
//                             agent.status === "active"
//                               ? "bg-emerald-100 text-emerald-700"
//                               : "bg-red-100 text-red-700"
//                           }`}
//                         >
//                           {agent.status.toUpperCase()}
//                         </span>
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap">
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => setSelectedAgent(agent)}
//                             className="flex items-center gap-1.5 px-3 py-2 bg-cyan-600 text-white hover:bg-cyan-700 transition-all text-xs font-medium rounded-lg"
//                           >
//                             <FileText className="w-3.5 h-3.5" />
//                             Statement
//                           </button>
//                           <button
//                             onClick={() => handleEditAgent(agent)}
//                             className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white hover:bg-emerald-700 transition-all text-xs font-medium rounded-lg"
//                           >
//                             <Edit3 className="w-3.5 h-3.5" />
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => {
//                               setSelectedAgent(agent);
//                               setShowDeleteAgent(true);
//                             }}
//                             className="flex items-center gap-1.5 px-3 py-2 bg-red-600 text-white hover:bg-red-700 transition-all text-xs font-medium rounded-lg"
//                           >
//                             <Trash2 className="w-3.5 h-3.5" />
//                           </button>
//                         </div>
//                       </td>
//                     </motion.tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {totalAgentPages > 1 && (
//           <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
//             <p className="text-sm text-slate-600">
//               Showing {indexOfFirstAgent + 1} to{" "}
//               {Math.min(indexOfLastAgent, filteredAgents.length)} of{" "}
//               {filteredAgents.length} agents
//             </p>
//             <div className="flex gap-2">
//               <button
//                 onClick={() =>
//                   setAgentsCurrentPage((prev) => Math.max(prev - 1, 1))
//                 }
//                 disabled={agentsCurrentPage === 1}
//                 className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
//               >
//                 Previous
//               </button>
//               <button
//                 onClick={() =>
//                   setAgentsCurrentPage((prev) =>
//                     Math.min(prev + 1, totalAgentPages)
//                   )
//                 }
//                 disabled={agentsCurrentPage === totalAgentPages}
//                 className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Agent Statement Modal */}
//       <AnimatePresence>
//         {selectedAgent && !showEditAgent && !showDeleteAgent && (
//           <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.95, y: 20 }}
//               transition={{ type: "spring", damping: 30, stiffness: 400 }}
//               className="bg-white max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl flex flex-col"
//             >
//               {/* Agent Header */}
//               <div className="relative bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 text-white p-8">
//                 <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.2)_25%,rgba(255,255,255,.2)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.2)_75%,rgba(255,255,255,.2))] bg-[length:60px_60px]"></div>

//                 <button
//                   onClick={() => {
//                     setSelectedAgent(null);
//                     setStatementTransactions([]);
//                   }}
//                   className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 border border-white/30 transition-all"
//                   title="Close"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>

//                 <div className="relative">
//                   <div className="flex items-start gap-6">
//                     <div className="w-20 h-20 bg-white/15 backdrop-blur-xl flex items-center justify-center border border-white/30 shadow-xl">
//                       <Smartphone className="w-10 h-10 text-white" />
//                     </div>

//                     <div className="flex-1">
//                       <div className="flex items-center gap-3 mb-2">
//                         <h2 className="text-3xl font-bold">
//                           {selectedAgent.agentName}
//                         </h2>
//                         <span
//                           className={`px-3 py-1 text-xs font-bold rounded-full ${
//                             selectedAgent.status === "active"
//                               ? "bg-emerald-500/20 text-emerald-100 border border-emerald-400/30"
//                               : "bg-red-500/20 text-red-100 border border-red-400/30"
//                           }`}
//                         >
//                           {selectedAgent.status.toUpperCase()}
//                         </span>
//                       </div>

//                       <p className="text-cyan-100 mb-4">
//                         {selectedAgent.phoneNumber}
//                       </p>

//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
//                         <div className="flex items-center gap-2">
//                           <User className="w-4 h-4 text-cyan-200" />
//                           <div>
//                             <p className="text-cyan-200 text-xs">
//                               Agent Number
//                             </p>
//                             <p className="font-mono font-semibold">
//                               {selectedAgent.agentNumber}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Zap className="w-4 h-4 text-cyan-200" />
//                           <div>
//                             <p className="text-cyan-200 text-xs">
//                               Store Number
//                             </p>
//                             <p className="font-semibold">
//                               {selectedAgent.storeNumber || "-"}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Calendar className="w-4 h-4 text-cyan-200" />
//                           <div>
//                             <p className="text-cyan-200 text-xs">Registered</p>
//                             <p className="font-semibold">
//                               {selectedAgent.registered}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Balance Card - KES Only */}
//                   <div className="mt-6">
//                     <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-3 text-white border-l-4 border-emerald-800">
//                       <div className="flex items-center justify-between mb-2">
//                         <div className="flex items-center gap-2">
//                           <Wallet className="w-4 h-4" />
//                           <span className="text-sm font-bold uppercase tracking-wide">
//                             KES Account
//                           </span>
//                         </div>
//                         <span className="text-xs opacity-75">
//                           Kenya Shillings Only
//                         </span>
//                       </div>
//                       <div className="grid grid-cols-3 gap-4">
//                         <div>
//                           <p className="text-xs opacity-75 mb-1">
//                             Opening Balance
//                           </p>
//                           <p className="font-bold text-lg">
//                             {selectedAgent.openingBalance.toLocaleString()}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-xs opacity-75 mb-1">
//                             Current Balance
//                           </p>
//                           <p className="font-bold text-lg">
//                             {selectedAgent.balance.toLocaleString()}
//                           </p>
//                         </div>
//                         <div className="text-right">
//                           <p className="text-xs opacity-75 mb-1">Net Change</p>
//                           <p
//                             className={`font-bold text-lg ${
//                               selectedAgent.balance -
//                                 selectedAgent.openingBalance >=
//                               0
//                                 ? ""
//                                 : "text-red-200"
//                             }`}
//                           >
//                             {selectedAgent.balance -
//                               selectedAgent.openingBalance >=
//                             0
//                               ? "+"
//                               : ""}
//                             {(
//                               selectedAgent.balance -
//                               selectedAgent.openingBalance
//                             ).toLocaleString()}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Transaction History */}
//               <div className="p-8 overflow-y-auto flex-1 bg-white">
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
//                     <Activity className="w-6 h-6 text-cyan-600" />
//                     Transaction History
//                   </h3>
//                   <span className="px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-lg text-sm font-bold">
//                     {filteredTransactions.length} Transactions
//                   </span>
//                 </div>

//                 {/* Search, Filter, Export, Print */}
//                 <div className="bg-slate-50 border-b border-slate-200 p-4 mb-6">
//                   <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
//                     <div className="lg:col-span-6">
//                       <div className="relative">
//                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
//                         <input
//                           type="text"
//                           placeholder="Search transactions..."
//                           value={transactionSearch}
//                           onChange={(e) => setTransactionSearch(e.target.value)}
//                           className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 text-sm font-medium focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
//                         />
//                       </div>
//                     </div>
//                     <div className="lg:col-span-2">
//                       <div className="relative">
//                         <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
//                         <select
//                           value={transactionFilter}
//                           onChange={(e) =>
//                             setTransactionFilter(
//                               e.target.value as "all" | "credit" | "debit"
//                             )
//                           }
//                           className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 text-sm font-medium focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all appearance-none cursor-pointer"
//                         >
//                           <option value="all">All Types</option>
//                           <option value="debit">Debit (Money In)</option>
//                           <option value="credit">Credit (Money Out)</option>
//                         </select>
//                       </div>
//                     </div>
//                     <div className="lg:col-span-4 flex gap-2">
//                       <button
//                         onClick={handleExportStatement}
//                         className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white hover:bg-emerald-700 transition-all font-semibold text-sm"
//                       >
//                         <Download className="w-4 h-4" />
//                         <span className="hidden sm:inline">Export</span>
//                       </button>
//                       <button
//                         onClick={handlePrintStatement}
//                         className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-cyan-600 text-white hover:bg-cyan-700 transition-all font-semibold text-sm"
//                       >
//                         <Printer className="w-4 h-4" />
//                         <span className="hidden sm:inline">Print</span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Transactions Table */}
//                 <div className="bg-white border border-slate-200 overflow-hidden shadow-sm">
//                   {isLoadingStatement ? (
//                     <div className="flex items-center justify-center py-12">
//                       <Loader2 className="w-6 h-6 animate-spin text-cyan-600 mr-2" />
//                       <span className="text-slate-600">
//                         Loading transactions...
//                       </span>
//                     </div>
//                   ) : (
//                     <div className="overflow-x-auto">
//                       <table className="w-full">
//                         <thead className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-b border-slate-300">
//                           <tr>
//                             <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
//                               Date & Time
//                             </th>
//                             <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
//                               Description
//                             </th>
//                             <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
//                               Type
//                             </th>
//                             <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">
//                               Amount
//                             </th>
//                             <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">
//                               Balance
//                             </th>
//                             <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
//                               Reference
//                             </th>
//                             <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">
//                               Actions
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-slate-200">
//                           {currentTransactions.length === 0 ? (
//                             <tr>
//                               <td
//                                 colSpan={7}
//                                 className="px-4 py-8 text-center text-slate-500"
//                               >
//                                 No transactions found.
//                               </td>
//                             </tr>
//                           ) : (
//                             currentTransactions.map((txn, idx) => (
//                               <motion.tr
//                                 key={txn.id}
//                                 initial={{ opacity: 0, x: -20 }}
//                                 animate={{ opacity: 1, x: 0 }}
//                                 transition={{ delay: idx * 0.03 }}
//                                 className="hover:bg-cyan-50/50 transition-colors group"
//                               >
//                                 <td className="px-4 py-4 text-sm text-slate-600 whitespace-nowrap font-medium">
//                                   <div className="flex items-center gap-2">
//                                     <Calendar className="w-4 h-4 text-slate-400" />
//                                     {txn.date}
//                                   </div>
//                                 </td>
//                                 <td className="px-4 py-4 text-sm text-slate-900 font-semibold">
//                                   {txn.description}
//                                 </td>
//                                 <td className="px-4 py-4 whitespace-nowrap">
//                                   <span
//                                     className={`inline-flex items-center gap-1.5 px-3 py-1 border-l-4 text-xs font-bold ${
//                                       txn.type === "debit"
//                                         ? "bg-emerald-50 text-emerald-700 border-emerald-500"
//                                         : "bg-red-50 text-red-700 border-red-500"
//                                     }`}
//                                   >
//                                     {txn.type === "debit" ? (
//                                       <ArrowUpCircle className="w-3.5 h-3.5" />
//                                     ) : (
//                                       <ArrowDownCircle className="w-3.5 h-3.5" />
//                                     )}
//                                     {txn.type.toUpperCase()}
//                                   </span>
//                                 </td>
//                                 <td className="px-4 py-4 whitespace-nowrap text-right">
//                                   <span
//                                     className={`text-base font-bold ${
//                                       txn.type === "debit"
//                                         ? "text-emerald-600"
//                                         : "text-red-600"
//                                     }`}
//                                   >
//                                     {txn.type === "debit" ? "+" : "-"}KES{" "}
//                                     {txn.amount.toLocaleString()}
//                                   </span>
//                                 </td>
//                                 <td className="px-4 py-4 text-base font-bold text-slate-900 whitespace-nowrap text-right">
//                                   KES {txn.balance.toLocaleString()}
//                                 </td>
//                                 <td className="px-4 py-4 text-sm text-cyan-600 font-mono whitespace-nowrap">
//                                   {txn.reference}
//                                 </td>
//                                 <td className="px-4 py-4 whitespace-nowrap">
//                                   <div className="flex items-center justify-center gap-1">
//                                     <button
//                                       onClick={() => handleViewTransaction(txn)}
//                                       className="p-2 bg-cyan-600 text-white hover:bg-cyan-700 transition-all"
//                                       title="View Details"
//                                     >
//                                       <Eye className="w-4 h-4" />
//                                     </button>
//                                     <button
//                                       onClick={() => handleEditTransaction(txn)}
//                                       className="p-2 bg-emerald-600 text-white hover:bg-emerald-700 transition-all"
//                                       title="Edit Transaction"
//                                     >
//                                       <Edit3 className="w-4 h-4" />
//                                     </button>
//                                     <button
//                                       onClick={() =>
//                                         handleDeleteTransaction(txn)
//                                       }
//                                       className="p-2 bg-red-600 text-white hover:bg-red-700 transition-all"
//                                       title="Delete Transaction"
//                                     >
//                                       <Trash2 className="w-4 h-4" />
//                                     </button>
//                                   </div>
//                                 </td>
//                               </motion.tr>
//                             ))
//                           )}
//                         </tbody>
//                       </table>
//                     </div>
//                   )}
//                 </div>

//                 {/* Pagination */}
//                 {totalTransactionPages > 1 && (
//                   <div className="mt-6 flex items-center justify-between">
//                     <p className="text-sm text-slate-600">
//                       Showing {indexOfFirstTransaction + 1} to{" "}
//                       {Math.min(
//                         indexOfLastTransaction,
//                         filteredTransactions.length
//                       )}{" "}
//                       of {filteredTransactions.length} transactions
//                     </p>
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() =>
//                           setTransactionsCurrentPage((prev) =>
//                             Math.max(prev - 1, 1)
//                           )
//                         }
//                         disabled={transactionsCurrentPage === 1}
//                         className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
//                       >
//                         Previous
//                       </button>
//                       <button
//                         onClick={() =>
//                           setTransactionsCurrentPage((prev) =>
//                             Math.min(prev + 1, totalTransactionPages)
//                           )
//                         }
//                         disabled={
//                           transactionsCurrentPage === totalTransactionPages
//                         }
//                         className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
//                       >
//                         Next
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>

//       {/* Add M-Pesa Agent Modal */}
//       <AnimatePresence>
//         {showAddAgent && (
//           <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.97, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.97, y: 20 }}
//               transition={{ type: "spring", damping: 30, stiffness: 400 }}
//               className="bg-white shadow-2xl max-w-2xl w-full overflow-hidden border border-cyan-600"
//             >
//               <div className="relative bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 p-4">
//                 <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.15)_25%,rgba(255,255,255,.15)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.15)_75%,rgba(255,255,255,.15))] bg-[length:20px_20px]"></div>
//                 <button
//                   onClick={() => setShowAddAgent(false)}
//                   className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 transition-all duration-200 border border-white/20 hover:border-white/40 group"
//                   title="Close"
//                 >
//                   <X className="w-4 h-4 text-white group-hover:rotate-90 transition-transform duration-300" />
//                 </button>
//                 <div className="relative flex items-center gap-3">
//                   <div className="w-11 h-11 bg-white/15 backdrop-blur-xl flex items-center justify-center border border-white/30 shadow-lg">
//                     <Smartphone className="w-5 h-5 text-white" />
//                   </div>
//                   <div>
//                     <h2 className="font-bold text-white tracking-tight">
//                       Add M-Pesa Agent
//                     </h2>
//                     <p className="text-cyan-50 text-xs font-medium">
//                       Register new M-Pesa agent
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <form onSubmit={handleCreateAgent}>
//                 <div className="p-4 max-h-[calc(100vh-180px)] overflow-y-auto bg-gradient-to-br from-slate-50 to-cyan-50/30">
//                   <div className="space-y-4">
//                     <div>
//                       <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-cyan-500">
//                         <div className="w-6 h-6 bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center shadow-sm">
//                           <User className="w-3.5 h-3.5 text-white" />
//                         </div>
//                         <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
//                           Agent Details
//                         </h3>
//                       </div>
//                       <div className="grid grid-cols-2 gap-3 bg-white p-3.5 border border-slate-200 shadow-sm">
//                         <div>
//                           <label className="block text-[10px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide flex items-center gap-1">
//                             <User className="w-3 h-3 text-cyan-600" />
//                             Agent Name *
//                           </label>
//                           <input
//                             type="text"
//                             value={formData.agentName}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 agentName: e.target.value,
//                               })
//                             }
//                             className="w-full px-3 py-2 bg-slate-50 border border-slate-300 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600/20 focus:bg-white transition-all font-medium text-slate-900 text-sm placeholder:text-slate-400"
//                             placeholder="Sarif Exchange Agent - CBD"
//                             required
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-[10px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide flex items-center gap-1">
//                             <Phone className="w-3 h-3 text-cyan-600" />
//                             Phone Number *
//                           </label>
//                           <input
//                             type="tel"
//                             value={formData.phoneNumber}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 phoneNumber: e.target.value,
//                               })
//                             }
//                             className="w-full px-3 py-2 bg-slate-50 border border-slate-300 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600/20 focus:bg-white transition-all font-medium text-slate-900 text-sm placeholder:text-slate-400"
//                             placeholder="+254 712 345 678"
//                             required
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-[10px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide flex items-center gap-1">
//                             <Hash className="w-3 h-3 text-cyan-600" />
//                             Agent Number *
//                           </label>
//                           <input
//                             type="text"
//                             value={formData.agentNumber}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 agentNumber: e.target.value,
//                               })
//                             }
//                             className="w-full px-3 py-2 bg-slate-50 border border-slate-300 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600/20 focus:bg-white transition-all font-medium text-slate-900 text-sm placeholder:text-slate-400"
//                             placeholder="AGT-001"
//                             required
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-[10px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide flex items-center gap-1">
//                             <Zap className="w-3 h-3 text-cyan-600" />
//                             Store Number
//                           </label>
//                           <input
//                             type="text"
//                             value={formData.storeNumber}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 storeNumber: e.target.value,
//                               })
//                             }
//                             className="w-full px-3 py-2 bg-slate-50 border border-slate-300 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600/20 focus:bg-white transition-all font-medium text-slate-900 text-sm placeholder:text-slate-400"
//                             placeholder="567890"
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     <div>
//                       <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-amber-500">
//                         <div className="w-6 h-6 bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-sm">
//                           <Wallet className="w-3.5 h-3.5 text-white" />
//                         </div>
//                         <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
//                           Agent Type
//                         </h3>
//                       </div>
//                       <div className="grid grid-cols-2 gap-3">
//                         <label className="group cursor-pointer">
//                           <input
//                             type="radio"
//                             name="agentType"
//                             value="0"
//                             checked={formData.agentType === 0}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 agentType: parseInt(e.target.value),
//                               })
//                             }
//                             className="peer sr-only"
//                           />
//                           <div className="p-3 bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 peer-checked:border-cyan-600 peer-checked:shadow-md peer-checked:shadow-cyan-500/20 transition-all hover:border-cyan-400 hover:shadow-sm relative overflow-hidden group-hover:scale-[1.02] duration-200">
//                             <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/5 to-blue-600/5 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
//                             <div className="relative flex items-center gap-2 mb-1.5">
//                               <div className="w-7 h-7 bg-cyan-600 flex items-center justify-center shadow-sm">
//                                 <Smartphone className="w-3.5 h-3.5 text-white" />
//                               </div>
//                               <div>
//                                 <span className="font-bold text-xs text-slate-900 block leading-tight">
//                                   STANDARD AGENT
//                                 </span>
//                                 <span className="text-[9px] text-cyan-600 font-semibold">
//                                   Regular
//                                 </span>
//                               </div>
//                             </div>
//                             <p className="text-[10px] text-slate-600 font-medium leading-snug relative">
//                               Standard transactions
//                             </p>
//                           </div>
//                         </label>

//                         <label className="group cursor-pointer">
//                           <input
//                             type="radio"
//                             name="agentType"
//                             value="1"
//                             checked={formData.agentType === 1}
//                             onChange={(e) =>
//                               setFormData({
//                                 ...formData,
//                                 agentType: parseInt(e.target.value),
//                               })
//                             }
//                             className="peer sr-only"
//                           />
//                           <div className="p-3 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 peer-checked:border-purple-600 peer-checked:shadow-md peer-checked:shadow-purple-500/20 transition-all hover:border-purple-400 hover:shadow-sm relative overflow-hidden group-hover:scale-[1.02] duration-200">
//                             <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-indigo-600/5 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
//                             <div className="relative flex items-center gap-2 mb-1.5">
//                               <div className="w-7 h-7 bg-purple-600 flex items-center justify-center shadow-sm">
//                                 <Zap className="w-3.5 h-3.5 text-white" />
//                               </div>
//                               <div>
//                                 <span className="font-bold text-xs text-slate-900 block leading-tight">
//                                   SUPER AGENT
//                                 </span>
//                                 <span className="text-[9px] text-purple-600 font-semibold">
//                                   Premium
//                                 </span>
//                               </div>
//                             </div>
//                             <p className="text-[10px] text-slate-600 font-medium leading-snug relative">
//                               High volume transactions
//                             </p>
//                           </div>
//                         </label>
//                       </div>
//                     </div>

//                     <div>
//                       <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-emerald-500">
//                         <div className="w-6 h-6 bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-sm">
//                           <Wallet className="w-3.5 h-3.5 text-white" />
//                         </div>
//                         <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
//                           Opening Balance (KES Only)
//                         </h3>
//                       </div>
//                       <div className="bg-white p-3.5 border border-slate-200 shadow-sm">
//                         <div>
//                           <label className="block text-[10px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide flex items-center gap-1">
//                             <Wallet className="w-3 h-3 text-emerald-600" />
//                             KES Amount
//                           </label>
//                           <div className="relative">
//                             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-700 font-bold text-[10px]">
//                               KES
//                             </span>
//                             <input
//                               type="number"
//                               value={formData.openingBalance}
//                               onChange={(e) =>
//                                 setFormData({
//                                   ...formData,
//                                   openingBalance:
//                                     parseFloat(e.target.value) || 0,
//                                 })
//                               }
//                               className="w-full pl-12 pr-3 py-2 bg-emerald-50 border border-emerald-300 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 focus:bg-white transition-all font-semibold text-slate-900 text-sm placeholder:text-emerald-400/60"
//                               placeholder="0.00"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="border-t border-slate-200 p-4 bg-gradient-to-r from-slate-50 to-cyan-50/30">
//                   <div className="flex gap-2.5">
//                     <button
//                       type="button"
//                       onClick={() => setShowAddAgent(false)}
//                       className="flex-1 px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all font-semibold text-slate-700 text-sm tracking-wide shadow-sm hover:shadow"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       disabled={isSubmitting}
//                       className="flex-1 px-5 py-2.5 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/50 transition-all flex items-center justify-center gap-2 text-sm tracking-wide border border-cyan-700/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {isSubmitting ? (
//                         <Loader2 className="w-4 h-4 animate-spin" />
//                       ) : (
//                         <Plus className="w-4 h-4" />
//                       )}
//                       {isSubmitting ? "Adding..." : "Add Agent"}
//                     </button>
//                   </div>
//                 </div>
//               </form>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>

//       {/* Edit Agent Modal */}
//       <AnimatePresence>
//         {showEditAgent && selectedAgent && (
//           <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.95, y: 20 }}
//               className="bg-white shadow-2xl max-w-xl w-full max-h-[85vh] overflow-hidden flex flex-col"
//             >
//               {/* Premium Header with Gradient Background */}
//               <div className="relative bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 px-6 py-4">
//                 <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

//                 <div className="relative flex items-start justify-between">
//                   <div className="flex items-start gap-3">
//                     <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
//                       <Edit3 className="w-6 h-6 text-white" />
//                     </div>
//                     <div>
//                       <h2 className="text-xl font-bold text-white mb-0.5">
//                         Edit M-Pesa Agent
//                       </h2>
//                       <p className="text-cyan-100 text-xs font-medium">
//                         Update agent information and settings
//                       </p>
//                       <div className="flex items-center gap-2 mt-2">
//                         <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-xs font-bold text-white">
//                           <Hash className="w-3 h-3" />
//                           {selectedAgent.code}
//                         </span>
//                         <span
//                           className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 backdrop-blur-sm border rounded-lg text-xs font-bold ${
//                             selectedAgent.status === "active"
//                               ? "bg-emerald-500/30 border-emerald-400/40 text-emerald-100"
//                               : "bg-red-500/30 border-red-400/40 text-red-100"
//                           }`}
//                         >
//                           <Zap className="w-3 h-3" />
//                           {selectedAgent.status.toUpperCase()}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => {
//                       setShowEditAgent(false);
//                       setSelectedAgent(null);
//                     }}
//                     className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm"
//                   >
//                     <X className="w-4 h-4 text-white" />
//                   </button>
//                 </div>
//               </div>

//               {/* Account Balance Preview */}
//               <div className="px-6 py-3 bg-gradient-to-r from-slate-50 to-cyan-50 border-b border-slate-200">
//                 <div className="grid grid-cols-1 gap-3">
//                   {/* KES Balance */}
//                   <div className="bg-white p-3 border border-cyan-200 shadow-sm">
//                     <div className="flex items-center gap-1.5 mb-1.5">
//                       <Wallet className="w-3.5 h-3.5 text-cyan-600" />
//                       <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
//                         KES M-Pesa Account
//                       </span>
//                     </div>
//                     <div className="flex items-baseline gap-2 text-xs">
//                       <div>
//                         <p className="text-[10px] text-slate-500 mb-0.5">
//                           Opening Balance
//                         </p>
//                         <p className="text-xs font-bold text-emerald-600">
//                           {selectedAgent.openingBalance.toLocaleString()}
//                         </p>
//                       </div>
//                       <div className="ml-auto text-right">
//                         <p className="text-[10px] text-slate-500 mb-0.5">
//                           Current Balance
//                         </p>
//                         <p className="text-sm font-bold text-cyan-600">
//                           KES {selectedAgent.balance.toLocaleString()}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Scrollable Form Content */}
//               <form
//                 onSubmit={handleUpdateAgent}
//                 className="flex flex-col flex-1 overflow-hidden"
//               >
//                 <div className="px-6 py-5 overflow-y-auto flex-1">
//                   <div className="space-y-6">
//                     {/* Agent Information Section */}
//                     <div className="space-y-4">
//                       <div className="flex items-center gap-2 mb-4">
//                         <div className="w-1 h-6 bg-gradient-to-b from-cyan-600 to-blue-600 rounded-full"></div>
//                         <h3 className="text-lg font-bold text-slate-900">
//                           Agent Information
//                         </h3>
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {/* Agent Name */}
//                         <div className="md:col-span-2">
//                           <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
//                             <Smartphone className="w-4 h-4 text-slate-400" />
//                             Agent Name
//                             <span className="text-red-500">*</span>
//                           </label>
//                           <input
//                             type="text"
//                             value={editFormData.agentName}
//                             onChange={(e) =>
//                               setEditFormData({
//                                 ...editFormData,
//                                 agentName: e.target.value,
//                               })
//                             }
//                             placeholder="Enter agent name"
//                             className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all"
//                           />
//                         </div>

//                         {/* Phone Number - Read Only */}
//                         <div className="group">
//                           <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
//                             <Phone className="w-4 h-4 text-slate-400" />
//                             Phone Number
//                           </label>
//                           <input
//                             type="tel"
//                             value={selectedAgent.phoneNumber}
//                             disabled
//                             className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 text-slate-500 font-medium cursor-not-allowed"
//                           />
//                         </div>

//                         {/* Agent Number - Read Only */}
//                         <div className="group">
//                           <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
//                             <Hash className="w-4 h-4 text-slate-400" />
//                             Agent Number
//                           </label>
//                           <input
//                             type="text"
//                             value={selectedAgent.agentNumber}
//                             disabled
//                             className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 text-slate-500 font-medium cursor-not-allowed"
//                           />
//                         </div>
//                       </div>

//                       {/* Store Number and Status */}
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="group">
//                           <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
//                             <Hash className="w-4 h-4 text-slate-400" />
//                             Store Number
//                           </label>
//                           <input
//                             type="text"
//                             value={editFormData.storeNumber}
//                             onChange={(e) =>
//                               setEditFormData({
//                                 ...editFormData,
//                                 storeNumber: e.target.value,
//                               })
//                             }
//                             placeholder="567890"
//                             className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all"
//                           />
//                         </div>

//                         <div className="group">
//                           <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
//                             <Activity className="w-4 h-4 text-slate-400" />
//                             Account Status
//                           </label>
//                           <select
//                             value={
//                               editFormData.isActive ? "active" : "inactive"
//                             }
//                             onChange={(e) =>
//                               setEditFormData({
//                                 ...editFormData,
//                                 isActive: e.target.value === "active",
//                               })
//                             }
//                             className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all appearance-none cursor-pointer"
//                           >
//                             <option value="active">Active</option>
//                             <option value="inactive">Inactive</option>
//                           </select>
//                         </div>
//                       </div>

//                       {/* Agent Type */}
//                       <div className="group">
//                         <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
//                           <Zap className="w-4 h-4 text-slate-400" />
//                           Agent Type
//                         </label>
//                         <select
//                           value={editFormData.agentType}
//                           onChange={(e) =>
//                             setEditFormData({
//                               ...editFormData,
//                               agentType: parseInt(e.target.value),
//                             })
//                           }
//                           className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all appearance-none cursor-pointer"
//                         >
//                           <option value="0">Standard Agent</option>
//                           <option value="1">Super Agent</option>
//                         </select>
//                       </div>

//                       {/* Registered Date */}
//                       <div className="group">
//                         <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
//                           <Calendar className="w-4 h-4 text-slate-400" />
//                           Registered Since
//                         </label>
//                         <input
//                           type="text"
//                           value={selectedAgent.registered}
//                           disabled
//                           className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 text-slate-500 font-medium cursor-not-allowed"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Fixed Footer with Action Buttons */}
//                 <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-cyan-50 border-t-2 border-slate-200 flex gap-3">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowEditAgent(false);
//                       setSelectedAgent(null);
//                     }}
//                     className="flex-1 px-6 py-3.5 bg-white border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all font-bold text-slate-700 shadow-sm hover:shadow"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="flex-1 px-6 py-3.5 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 text-white font-bold shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                   >
//                     {isSubmitting ? (
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                     ) : null}
//                     {isSubmitting ? "Saving..." : "Save Changes"}
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>

//       {/* Delete Agent Confirmation Modal */}
//       <AnimatePresence>
//         {showDeleteAgent && selectedAgent && (
//           <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.95, y: 20 }}
//               className="bg-white shadow-2xl max-w-md w-full overflow-hidden flex flex-col"
//             >
//               {/* Premium Header with Gradient Background */}
//               <div className="relative bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-6 py-4">
//                 <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

//                 <div className="relative flex items-start justify-between">
//                   <div className="flex items-start gap-3">
//                     <div className="w-12 h-12 bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
//                       <Trash2 className="w-6 h-6 text-white" />
//                     </div>
//                     <div>
//                       <h2 className="text-xl font-bold text-white mb-0.5">
//                         Delete M-Pesa Agent
//                       </h2>
//                       <p className="text-red-100 text-xs font-medium">
//                         This action cannot be undone
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => {
//                       setShowDeleteAgent(false);
//                       setSelectedAgent(null);
//                     }}
//                     className="p-1.5 bg-white/10 hover:bg-white/20 transition-all backdrop-blur-sm"
//                   >
//                     <X className="w-4 h-4 text-white" />
//                   </button>
//                 </div>
//               </div>

//               {/* Content */}
//               <div className="px-6 py-5">
//                 {/* Warning Icon */}
//                 <div className="flex items-center justify-center mb-4">
//                   <div className="w-16 h-16 bg-red-100 flex items-center justify-center">
//                     <AlertCircle className="w-8 h-8 text-red-600" />
//                   </div>
//                 </div>

//                 <h4 className="text-lg font-bold text-slate-900 text-center mb-2">
//                   Are you sure you want to delete this agent?
//                 </h4>
//                 <p className="text-sm text-slate-600 text-center mb-4">
//                   This will permanently remove the agent and all associated data
//                   from the system.
//                 </p>

//                 {/* Agent Details */}
//                 <div className="bg-red-50 border-2 border-red-200 p-4 space-y-2">
//                   <div className="flex justify-between items-center">
//                     <span className="text-xs font-bold text-slate-600 uppercase">
//                       Agent Code:
//                     </span>
//                     <span className="text-xs font-mono font-bold text-slate-900">
//                       {selectedAgent.code}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-xs font-bold text-slate-600 uppercase">
//                       Agent Name:
//                     </span>
//                     <span className="text-xs font-bold text-slate-900">
//                       {selectedAgent.agentName}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-xs font-bold text-slate-600 uppercase">
//                       Phone:
//                     </span>
//                     <span className="text-xs font-bold text-slate-900">
//                       {selectedAgent.phoneNumber}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center pt-2 border-t border-red-300">
//                     <span className="text-xs font-bold text-slate-600 uppercase">
//                       Balance:
//                     </span>
//                     <span className="text-sm font-bold text-red-600">
//                       KES {selectedAgent.balance.toLocaleString()}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Fixed Footer with Action Buttons */}
//               <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-red-50 border-t-2 border-slate-200 flex gap-3">
//                 <button
//                   onClick={() => {
//                     setShowDeleteAgent(false);
//                     setSelectedAgent(null);
//                   }}
//                   className="flex-1 px-6 py-3 bg-white border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all font-bold text-slate-700 shadow-sm hover:shadow"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleDeleteAgent}
//                   disabled={isSubmitting}
//                   className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-bold shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                 >
//                   {isSubmitting ? (
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                   ) : null}
//                   {isSubmitting ? "Deleting..." : "Delete"}
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>

//       {/* View Transaction Modal - PREMIUM DESIGN */}
//       <AnimatePresence>
//         {showViewTransaction && selectedTransaction && (
//           <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.95, y: 20 }}
//               className="bg-white shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col"
//             >
//               {/* Premium Header with Gradient Background */}
//               <div
//                 className={`relative px-6 py-4 ${
//                   selectedTransaction.type === "debit"
//                     ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700"
//                     : "bg-gradient-to-r from-red-600 via-rose-600 to-red-700"
//                 }`}
//               >
//                 <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

//                 <div className="relative flex items-start justify-between">
//                   <div className="flex items-start gap-3">
//                     <div className="w-12 h-12 bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
//                       {selectedTransaction.type === "debit" ? (
//                         <ArrowUpCircle className="w-6 h-6 text-white" />
//                       ) : (
//                         <ArrowDownCircle className="w-6 h-6 text-white" />
//                       )}
//                     </div>
//                     <div>
//                       <h2 className="text-xl font-bold text-white mb-0.5">
//                         Transaction Details
//                       </h2>
//                       <p
//                         className={`text-xs font-medium ${
//                           selectedTransaction.type === "debit"
//                             ? "text-emerald-100"
//                             : "text-red-100"
//                         }`}
//                       >
//                         {selectedTransaction.type === "debit"
//                           ? "Debit Transaction (Money In)"
//                           : "Credit Transaction (Money Out)"}
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => {
//                       setShowViewTransaction(false);
//                       setSelectedTransaction(null);
//                     }}
//                     className="p-1.5 bg-white/10 hover:bg-white/20 transition-all backdrop-blur-sm"
//                   >
//                     <X className="w-4 h-4 text-white" />
//                   </button>
//                 </div>
//               </div>

//               {/* Scrollable Content */}
//               <div className="px-6 py-5 overflow-y-auto flex-1">
//                 <div className="space-y-4">
//                   {/* Transaction Info Grid */}
//                   <div className="grid grid-cols-2 gap-3">
//                     <div className="bg-slate-50 p-3 border border-slate-200">
//                       <p className="text-[10px] font-bold text-slate-500 uppercase mb-1.5">
//                         Transaction ID
//                       </p>
//                       <p className="text-sm font-bold text-slate-900 font-mono">
//                         {selectedTransaction.id}
//                       </p>
//                     </div>
//                     <div className="bg-slate-50 p-3 border border-slate-200">
//                       <p className="text-[10px] font-bold text-slate-500 uppercase mb-1.5">
//                         Reference
//                       </p>
//                       <p className="text-sm font-bold text-cyan-600 font-mono">
//                         {selectedTransaction.reference}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-3">
//                     <div className="bg-slate-50 p-3 border border-slate-200">
//                       <p className="text-[10px] font-bold text-slate-500 uppercase mb-1.5">
//                         Date & Time
//                       </p>
//                       <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
//                         <Calendar className="w-3.5 h-3.5 text-slate-400" />
//                         {selectedTransaction.date}
//                       </p>
//                     </div>
//                     <div className="bg-slate-50 p-3 border border-slate-200">
//                       <p className="text-[10px] font-bold text-slate-500 uppercase mb-1.5">
//                         Currency
//                       </p>
//                       <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
//                         <Wallet className="w-3.5 h-3.5 text-emerald-600" /> KES
//                       </p>
//                     </div>
//                   </div>

//                   {/* Description & Amount Card */}
//                   <div
//                     className={`p-4 text-white ${
//                       selectedTransaction.type === "debit"
//                         ? "bg-gradient-to-br from-emerald-600 to-teal-600"
//                         : "bg-gradient-to-br from-red-600 to-rose-600"
//                     }`}
//                   >
//                     <p className="text-xs opacity-90 mb-2">Description</p>
//                     <p className="text-lg font-bold mb-4">
//                       {selectedTransaction.description}
//                     </p>
//                     <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/20">
//                       <div>
//                         <p className="text-[10px] opacity-75 mb-1">Amount</p>
//                         <p className="text-xl font-bold">
//                           {selectedTransaction.type === "debit" ? "+" : "-"}KES{" "}
//                           {selectedTransaction.amount.toLocaleString()}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[10px] opacity-75 mb-1">
//                           Balance After
//                         </p>
//                         <p className="text-xl font-bold">
//                           KES {selectedTransaction.balance.toLocaleString()}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Transaction Type Badge */}
//                   <div
//                     className={`flex items-center justify-between p-3 border-2 ${
//                       selectedTransaction.type === "debit"
//                         ? "bg-emerald-50 border-emerald-200"
//                         : "bg-red-50 border-red-200"
//                     }`}
//                   >
//                     <div className="flex items-center gap-2">
//                       <div
//                         className={`w-8 h-8 flex items-center justify-center ${
//                           selectedTransaction.type === "debit"
//                             ? "bg-emerald-100"
//                             : "bg-red-100"
//                         }`}
//                       >
//                         <Activity
//                           className={`w-4 h-4 ${
//                             selectedTransaction.type === "debit"
//                               ? "text-emerald-600"
//                               : "text-red-600"
//                           }`}
//                         />
//                       </div>
//                       <div>
//                         <p className="text-xs font-bold text-slate-900">
//                           Transaction Type
//                         </p>
//                         <p
//                           className={`text-xs font-bold ${
//                             selectedTransaction.type === "debit"
//                               ? "text-emerald-600"
//                               : "text-red-600"
//                           }`}
//                         >
//                           {selectedTransaction.type.toUpperCase()}
//                         </p>
//                       </div>
//                     </div>
//                     <button
//                       onClick={() =>
//                         toast.success("Transaction receipt downloaded!")
//                       }
//                       className={`flex items-center gap-1.5 px-3 py-1.5 text-white text-xs font-bold transition-all ${
//                         selectedTransaction.type === "debit"
//                           ? "bg-emerald-600 hover:bg-emerald-700"
//                           : "bg-red-600 hover:bg-red-700"
//                       }`}
//                     >
//                       <Download className="w-3.5 h-3.5" />
//                       Receipt
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Fixed Footer with Action Buttons */}
//               <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-cyan-50 border-t-2 border-slate-200 flex gap-3">
//                 <button
//                   onClick={() => {
//                     setShowViewTransaction(false);
//                     setSelectedTransaction(null);
//                   }}
//                   className="flex-1 px-6 py-3 bg-white border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all font-bold text-slate-700 shadow-sm hover:shadow"
//                 >
//                   Close
//                 </button>
//                 {selectedTransaction.relatedAccount && (
//                   <button
//                     onClick={() => {
//                       setShowViewTransaction(false);
//                       setShowRelatedAccount(true);
//                     }}
//                     className={`flex-1 px-6 py-3 text-white font-bold shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95 ${
//                       selectedTransaction.type === "credit"
//                         ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 shadow-emerald-500/30 hover:shadow-emerald-500/40"
//                         : "bg-gradient-to-r from-red-600 via-rose-600 to-red-700 shadow-red-500/30 hover:shadow-red-500/40"
//                     }`}
//                   >
//                     Related Account
//                   </button>
//                 )}
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>

//       {/* Edit Transaction Modal */}
//       <AnimatePresence>
//         {showEditTransaction && selectedTransaction && (
//           <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.95, y: 20 }}
//               className="bg-white shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col"
//             >
//               {/* Header */}
//               <div className="relative bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 px-6 py-4">
//                 <div className="relative flex items-start justify-between">
//                   <div className="flex items-start gap-3">
//                     <div className="w-12 h-12 bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
//                       <Edit3 className="w-6 h-6 text-white" />
//                     </div>
//                     <div>
//                       <h2 className="text-xl font-bold text-white mb-0.5">
//                         Edit Transaction
//                       </h2>
//                       <p className="text-cyan-100 text-xs font-medium">
//                         Update M-Pesa transaction details
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => {
//                       setShowEditTransaction(false);
//                       setSelectedTransaction(null);
//                     }}
//                     className="p-1.5 bg-white/10 hover:bg-white/20 transition-all backdrop-blur-sm"
//                   >
//                     <X className="w-4 h-4 text-white" />
//                   </button>
//                 </div>
//               </div>

//               {/* Form Content */}
//               <div className="px-6 py-5 overflow-y-auto flex-1">
//                 <form className="space-y-4">
//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">
//                         Transaction ID
//                       </label>
//                       <input
//                         type="text"
//                         defaultValue={selectedTransaction.id}
//                         disabled
//                         className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 text-slate-500 font-mono text-sm cursor-not-allowed"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">
//                         Reference
//                       </label>
//                       <input
//                         type="text"
//                         defaultValue={selectedTransaction.reference}
//                         className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-900 font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-xs font-bold text-slate-700 mb-2 uppercase flex items-center gap-1">
//                       Description
//                       <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       defaultValue={selectedTransaction.description}
//                       className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all"
//                     />
//                   </div>

//                   <div className="grid grid-cols-3 gap-3">
//                     <div>
//                       <label className="block text-xs font-bold text-slate-700 mb-2 uppercase flex items-center gap-1">
//                         Type
//                         <span className="text-red-500">*</span>
//                       </label>
//                       <select
//                         defaultValue={selectedTransaction.type}
//                         className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all appearance-none cursor-pointer"
//                       >
//                         <option value="credit">Credit</option>
//                         <option value="debit">Debit</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">
//                         Currency
//                       </label>
//                       <input
//                         type="text"
//                         value="KES"
//                         disabled
//                         className="w-full px-4 py-3 bg-emerald-50 border-2 border-emerald-200 text-emerald-700 text-sm font-bold cursor-not-allowed"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs font-bold text-slate-700 mb-2 uppercase flex items-center gap-1">
//                         Amount
//                         <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="number"
//                         defaultValue={selectedTransaction.amount}
//                         className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-900 text-sm font-bold focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all"
//                       />
//                     </div>
//                   </div>
//                 </form>
//               </div>

//               {/* Footer */}
//               <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-cyan-50 border-t-2 border-slate-200 flex gap-3">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowEditTransaction(false);
//                     setSelectedTransaction(null);
//                   }}
//                   className="flex-1 px-6 py-3 bg-white border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all font-bold text-slate-700 shadow-sm hover:shadow"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     toast.success(
//                       `Transaction ${selectedTransaction.reference} updated successfully!`
//                     );
//                     setShowEditTransaction(false);
//                     setSelectedTransaction(null);
//                   }}
//                   className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 text-white font-bold shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all hover:scale-105 active:scale-95"
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
//           <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.95, y: 20 }}
//               className="bg-white shadow-2xl max-w-md w-full overflow-hidden flex flex-col"
//             >
//               {/* Header */}
//               <div className="relative bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-6 py-4">
//                 <div className="relative flex items-start justify-between">
//                   <div className="flex items-start gap-3">
//                     <div className="w-12 h-12 bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
//                       <Trash2 className="w-6 h-6 text-white" />
//                     </div>
//                     <div>
//                       <h2 className="text-xl font-bold text-white mb-0.5">
//                         Delete Transaction
//                       </h2>
//                       <p className="text-red-100 text-xs font-medium">
//                         This action cannot be undone
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => {
//                       setShowDeleteTransaction(false);
//                       setSelectedTransaction(null);
//                     }}
//                     className="p-1.5 bg-white/10 hover:bg-white/20 transition-all backdrop-blur-sm"
//                   >
//                     <X className="w-4 h-4 text-white" />
//                   </button>
//                 </div>
//               </div>

//               {/* Content */}
//               <div className="px-6 py-5">
//                 <div className="flex items-center justify-center mb-4">
//                   <div className="w-16 h-16 bg-red-100 flex items-center justify-center">
//                     <AlertCircle className="w-8 h-8 text-red-600" />
//                   </div>
//                 </div>

//                 <h4 className="text-lg font-bold text-slate-900 text-center mb-2">
//                   Are you sure you want to delete this transaction?
//                 </h4>
//                 <p className="text-sm text-slate-600 text-center mb-4">
//                   This will permanently remove the transaction from the system.
//                 </p>

//                 <div className="bg-red-50 border-2 border-red-200 p-4 space-y-2">
//                   <div className="flex justify-between items-center">
//                     <span className="text-xs font-bold text-slate-600 uppercase">
//                       Transaction ID:
//                     </span>
//                     <span className="text-xs font-mono font-bold text-slate-900">
//                       {selectedTransaction.id}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-xs font-bold text-slate-600 uppercase">
//                       Reference:
//                     </span>
//                     <span className="text-xs font-mono font-bold text-slate-900">
//                       {selectedTransaction.reference}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-xs font-bold text-slate-600 uppercase">
//                       Description:
//                     </span>
//                     <span className="text-xs font-bold text-slate-900 text-right">
//                       {selectedTransaction.description}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center pt-2 border-t border-red-300">
//                     <span className="text-xs font-bold text-slate-600 uppercase">
//                       Amount:
//                     </span>
//                     <span className="text-sm font-bold text-red-600">
//                       KES {selectedTransaction.amount.toLocaleString()}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Footer */}
//               <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-red-50 border-t-2 border-slate-200 flex gap-3">
//                 <button
//                   onClick={() => {
//                     setShowDeleteTransaction(false);
//                     setSelectedTransaction(null);
//                   }}
//                   className="flex-1 px-6 py-3 bg-white border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all font-bold text-slate-700 shadow-sm hover:shadow"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={confirmDeleteTransaction}
//                   className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-bold shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all hover:scale-105 active:scale-95"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>

//       {/* Related Account Modal */}
//       <AnimatePresence>
//         {showRelatedAccount &&
//           selectedTransaction &&
//           selectedTransaction.relatedAccount && (
//             <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[70]">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95, y: 20 }}
//                 animate={{ opacity: 1, scale: 1, y: 0 }}
//                 exit={{ opacity: 0, scale: 0.95, y: 20 }}
//                 className="bg-white shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col"
//               >
//                 {/* Header */}
//                 <div
//                   className={`relative px-6 py-4 ${
//                     selectedTransaction.relatedAccount.effect === "credit"
//                       ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700"
//                       : "bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700"
//                   }`}
//                 >
//                   <div className="relative flex items-start justify-between">
//                     <div className="flex items-start gap-3">
//                       <div className="w-12 h-12 bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
//                         {selectedTransaction.relatedAccount.effect ===
//                         "credit" ? (
//                           <ArrowUpCircle className="w-6 h-6 text-white" />
//                         ) : (
//                           <ArrowDownCircle className="w-6 h-6 text-white" />
//                         )}
//                       </div>
//                       <div>
//                         <h2 className="text-xl font-bold text-white mb-0.5">
//                           Related Account
//                         </h2>
//                         <p
//                           className={`text-xs font-medium ${
//                             selectedTransaction.relatedAccount.effect ===
//                             "credit"
//                               ? "text-emerald-100"
//                               : "text-blue-100"
//                           }`}
//                         >
//                           Double-Entry Counterpart
//                         </p>
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => setShowRelatedAccount(false)}
//                       className="p-1.5 bg-white/10 hover:bg-white/20 transition-all backdrop-blur-sm"
//                     >
//                       <X className="w-4 h-4 text-white" />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Content */}
//                 <div className="px-6 py-5 overflow-y-auto flex-1">
//                   <div className="space-y-4">
//                     {/* Account Type Badge */}
//                     <div className="bg-slate-50 p-4 border-2 border-slate-200">
//                       <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">
//                         Account Type
//                       </p>
//                       <div className="flex items-center gap-2">
//                         <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
//                           <User className="w-5 h-5 text-blue-600" />
//                         </div>
//                         <div>
//                           <p className="text-lg font-bold text-slate-900">
//                             {selectedTransaction.relatedAccount.accountType}
//                           </p>
//                           <p className="text-xs text-slate-600">
//                             {selectedTransaction.relatedAccount.accountName}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Account Details */}
//                     <div className="grid grid-cols-2 gap-3">
//                       <div className="bg-slate-50 p-3 border border-slate-200">
//                         <p className="text-[10px] font-bold text-slate-500 uppercase mb-1.5">
//                           Account ID
//                         </p>
//                         <p className="text-sm font-bold text-slate-900 font-mono">
//                           {selectedTransaction.relatedAccount.accountId}
//                         </p>
//                       </div>
//                       <div className="bg-slate-50 p-3 border border-slate-200">
//                         <p className="text-[10px] font-bold text-slate-500 uppercase mb-1.5">
//                           Transaction Ref
//                         </p>
//                         <p className="text-sm font-bold text-blue-600 font-mono">
//                           {selectedTransaction.reference}
//                         </p>
//                       </div>
//                     </div>

//                     {/* How Account Was Affected */}
//                     <div
//                       className={`p-4 text-white ${
//                         selectedTransaction.relatedAccount.effect === "credit"
//                           ? "bg-gradient-to-br from-emerald-600 to-teal-600"
//                           : "bg-gradient-to-br from-blue-600 to-cyan-600"
//                       }`}
//                     >
//                       <p className="text-xs opacity-90 mb-2">
//                         How This Account Was Affected
//                       </p>
//                       <div className="flex items-center gap-2 mb-4">
//                         {selectedTransaction.relatedAccount.effect ===
//                         "credit" ? (
//                           <ArrowUpCircle className="w-6 h-6" />
//                         ) : (
//                           <ArrowDownCircle className="w-6 h-6" />
//                         )}
//                         <p className="text-2xl font-bold uppercase">
//                           {selectedTransaction.relatedAccount.effect}
//                         </p>
//                       </div>
//                       <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/20">
//                         <div>
//                           <p className="text-[10px] opacity-75 mb-1">Amount</p>
//                           <p className="text-xl font-bold">
//                             {selectedTransaction.relatedAccount.effect ===
//                             "credit"
//                               ? "+"
//                               : "-"}
//                             KES {selectedTransaction.amount.toLocaleString()}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-[10px] opacity-75 mb-1">
//                             Balance After
//                           </p>
//                           <p className="text-xl font-bold">
//                             KES{" "}
//                             {selectedTransaction.relatedAccount.balanceAfter.toLocaleString()}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Transaction Flow */}
//                     <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 border-2 border-slate-200">
//                       <p className="text-xs font-bold text-slate-700 uppercase mb-3">
//                         Transaction Flow
//                       </p>
//                       <div className="flex items-center justify-between">
//                         <div className="text-center">
//                           <div className="w-12 h-12 bg-emerald-100 flex items-center justify-center mx-auto mb-2">
//                             <Phone className="w-6 h-6 text-emerald-600" />
//                           </div>
//                           <p className="text-xs font-bold text-slate-900">
//                             M-Pesa Account
//                           </p>
//                           <p
//                             className={`text-xs font-bold mt-1 ${
//                               selectedTransaction.type === "credit"
//                                 ? "text-emerald-600"
//                                 : "text-red-600"
//                             }`}
//                           >
//                             {selectedTransaction.type.toUpperCase()}
//                           </p>
//                         </div>

//                         <div className="flex-1 mx-4">
//                           <div className="flex items-center">
//                             <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-300 to-emerald-300"></div>
//                             <ArrowRight className="w-5 h-5 text-blue-600 mx-2" />
//                             <div className="flex-1 h-0.5 bg-gradient-to-r from-emerald-300 to-blue-300"></div>
//                           </div>
//                           <p className="text-[10px] text-center text-slate-600 mt-1 font-semibold">
//                             KES {selectedTransaction.amount.toLocaleString()}
//                           </p>
//                         </div>

//                         <div className="text-center">
//                           <div
//                             className={`w-12 h-12 flex items-center justify-center mx-auto mb-2 ${
//                               selectedTransaction.relatedAccount.effect ===
//                               "credit"
//                                 ? "bg-emerald-100"
//                                 : "bg-blue-100"
//                             }`}
//                           >
//                             <User className="w-6 h-6 text-blue-600" />
//                           </div>
//                           <p className="text-xs font-bold text-slate-900">
//                             {selectedTransaction.relatedAccount.accountType}
//                           </p>
//                           <p
//                             className={`text-xs font-bold mt-1 ${
//                               selectedTransaction.relatedAccount.effect ===
//                               "credit"
//                                 ? "text-emerald-600"
//                                 : "text-blue-600"
//                             }`}
//                           >
//                             {selectedTransaction.relatedAccount.effect.toUpperCase()}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Footer */}
//                 <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-blue-50 border-t-2 border-slate-200">
//                   <button
//                     onClick={() => setShowRelatedAccount(false)}
//                     className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all hover:scale-105 active:scale-95"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </motion.div>
//             </div>
//           )}
//       </AnimatePresence>
//     </div>
//   );
// }
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  Plus,
  Search,
  Filter,
  Eye,
  Wallet,
  Phone,
  TrendingUp,
  TrendingDown,
  AlertCircle,
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
  User,
  Hash,
  Zap,
  CreditCard,
  RefreshCw,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  getMpesaAgents,
  getMpesaAgentById,
  createMpesaAgent,
  updateMpesaAgent,
  deleteMpesaAgent,
  getMpesaAgentStatement,
  getMpesaStats,
  MpesaAgentDto,
  CreateMpesaAgentDto,
  getAccountTypeLabel,
  apiRequest,
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
  exchangeRate?: number | null;
  counterAmount?: number | null;
  counterCurrency?: number | null;
  notes?: string | null;
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
    clientCode?: string | null;
    clientPhone?: string | null;
  };
}

// Updated MPesaAgent interface to match backend MpesaAgentDto
interface MPesaAgent {
  id: string;
  code: string;
  agentName: string;
  phoneNumber: string;
  agentNumber: string;
  storeNumber: string;
  agentType: number;
  balance: number;
  openingBalance: number;
  totalDebit: number;
  totalCredit: number;
  netMovement: number;
  isActive: boolean;
  createdAt: string;
}

// Updated MpesaStats interface to match backend
interface MpesaStats {
  totalAgents: number;
  totalBalance: number;
  totalDebit: number;
  totalCredit: number;
  netMovement: number;
}

interface FormData {
  agentName: string;
  phoneNumber: string;
  agentNumber: string;
  storeNumber: string;
  agentType: number;
  openingBalance: number;
}

interface EditFormData {
  agentName: string;
  storeNumber: string;
  agentType: number;
  isActive: boolean;
}

export function MPesaAccounts() {
  // Data states
  const [allAgents, setAllAgents] = useState<MPesaAgent[]>([]);
  const [stats, setStats] = useState<MpesaStats>({
    totalAgents: 0,
    totalBalance: 0,
    totalDebit: 0,
    totalCredit: 0,
    netMovement: 0,
  });
  const [statementTransactions, setStatementTransactions] = useState<
    Transaction[]
  >([]);
  const [statementData, setStatementData] = useState<{
    accountName: string;
    accountCode: string;
    currency: number;
    openingBalance: number;
    closingBalance: number;
    totalDebit: number;
    totalCredit: number;
    netMovement: number;
  } | null>(null);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStatement, setIsLoadingStatement] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // UI states
  const [activeTab, setActiveTab] = useState<"all" | "outstanding">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<MPesaAgent | null>(null);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showViewTransaction, setShowViewTransaction] = useState(false);
  const [showEditTransaction, setShowEditTransaction] = useState(false);
  const [showDeleteTransaction, setShowDeleteTransaction] = useState(false);
  const [showRelatedAccount, setShowRelatedAccount] = useState(false);
  const [showEditAgent, setShowEditAgent] = useState(false);
  const [showDeleteAgent, setShowDeleteAgent] = useState(false);
  const [transactionSearch, setTransactionSearch] = useState("");
  const [transactionFilter, setTransactionFilter] = useState<
    "all" | "credit" | "debit"
  >("all");
  const [agentsCurrentPage, setAgentsCurrentPage] = useState(1);
  const [agentsPerPage] = useState(10);
  const [transactionsCurrentPage, setTransactionsCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(15);

  // Form states
  const [formData, setFormData] = useState<FormData>({
    agentName: "",
    phoneNumber: "",
    agentNumber: "",
    storeNumber: "",
    agentType: 0,
    openingBalance: 0,
  });

  const [editFormData, setEditFormData] = useState<EditFormData>({
    agentName: "",
    storeNumber: "",
    agentType: 0,
    isActive: true,
  });

  // Map backend DTO to frontend MPesaAgent interface
  const mapDtoToAgent = (dto: any): MPesaAgent => {
    return {
      id: dto.id,
      code: dto.code,
      agentName: dto.agentName,
      phoneNumber: dto.phoneNumber,
      agentNumber: dto.agentNumber,
      storeNumber: dto.storeNumber || dto.tillNumber || "",
      agentType: dto.agentType || 0,
      balance: dto.balance,
      openingBalance: dto.openingBalance,
      totalDebit: dto.totalDebit || 0,
      totalCredit: dto.totalCredit || 0,
      netMovement: dto.netMovement || 0,
      isActive: dto.isActive,
      createdAt: dto.createdAt || new Date().toISOString(),
    };
  };

  // Map backend transaction to frontend Transaction interface
  const mapTransactionToDisplay = (txn: any): Transaction => {
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
      currency: txn.currency ?? 0,
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

  // Fetch all M-Pesa agents
  const fetchAgents = useCallback(async () => {
    try {
      const response = await getMpesaAgents();
      if (response.success && response.data) {
        const mappedAgents = response.data.map(mapDtoToAgent);
        setAllAgents(mappedAgents);
      }
    } catch (error) {
      console.error("Error fetching M-Pesa agents:", error);
      toast.error("Failed to fetch M-Pesa agents");
    }
  }, []);

  // Fetch M-Pesa stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await getMpesaStats();
      if (response.success && response.data) {
        setStats({
          totalAgents: response.data.totalAgents || 0,
          totalBalance: response.data.totalBalance || 0,
          totalDebit: response.data.totalDebit || 0,
          totalCredit: response.data.totalCredit || 0,
          netMovement: response.data.netMovement || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching M-Pesa stats:", error);
    }
  }, []);

  // Fetch agent statement/transactions
  const fetchAgentStatement = useCallback(async (agentId: string) => {
    setIsLoadingStatement(true);
    try {
      const response = await getMpesaAgentStatement(agentId);
      if (response.success && response.data) {
        // Store statement summary data
        setStatementData({
          accountName: response.data.accountName || "",
          accountCode: response.data.accountCode || "",
          currency: response.data.currency ?? 0,
          openingBalance: response.data.openingBalance || 0,
          closingBalance: response.data.closingBalance || 0,
          totalDebit: response.data.totalDebit || 0,
          totalCredit: response.data.totalCredit || 0,
          netMovement: response.data.netMovement || 0,
        });

        // Map statement transactions
        const transactions: Transaction[] = (
          response.data.transactions || []
        ).map((txn: any) => mapTransactionToDisplay(txn));

        setStatementTransactions(transactions);
      }
    } catch (error) {
      console.error("Error fetching agent statement:", error);
      toast.error("Failed to fetch agent statement");
    } finally {
      setIsLoadingStatement(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchAgents(), fetchStats()]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchAgents, fetchStats]);

  // Fetch statement when agent is selected
  useEffect(() => {
    if (selectedAgent) {
      fetchAgentStatement(selectedAgent.id);
    } else {
      setStatementTransactions([]);
      setStatementData(null);
    }
  }, [selectedAgent, fetchAgentStatement]);

  // Refresh all data
  const handleRefresh = async () => {
    setIsLoading(true);
    await Promise.all([fetchAgents(), fetchStats()]);
    setIsLoading(false);
    toast.success("Data refreshed!");
  };

  // Create new M-Pesa agent
  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agentName || !formData.phoneNumber || !formData.agentNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const createDto: CreateMpesaAgentDto = {
        agentName: formData.agentName,
        phoneNumber: formData.phoneNumber,
        agentNumber: formData.agentNumber,
        storeNumber: formData.storeNumber || undefined,
        agentType: formData.agentType,
        openingBalance: formData.openingBalance,
      };

      const response = await createMpesaAgent(createDto);
      if (response.success) {
        toast.success("M-Pesa Agent created successfully!");
        setShowAddAgent(false);
        setFormData({
          agentName: "",
          phoneNumber: "",
          agentNumber: "",
          storeNumber: "",
          agentType: 0,
          openingBalance: 0,
        });
        await Promise.all([fetchAgents(), fetchStats()]);
      } else {
        toast.error(response.error || "Failed to create M-Pesa agent");
      }
    } catch (error) {
      console.error("Error creating M-Pesa agent:", error);
      toast.error("Failed to create M-Pesa agent");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update M-Pesa agent
  const handleUpdateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgent) return;

    setIsSubmitting(true);
    try {
      const updateDto = {
        agentName: editFormData.agentName || undefined,
        storeNumber: editFormData.storeNumber || undefined,
        agentType: editFormData.agentType,
        isActive: editFormData.isActive,
      };

      const response = await updateMpesaAgent(selectedAgent.id, updateDto);
      if (response.success) {
        toast.success("M-Pesa Agent updated successfully!");
        setShowEditAgent(false);
        setSelectedAgent(null);
        await Promise.all([fetchAgents(), fetchStats()]);
      } else {
        toast.error(response.error || "Failed to update M-Pesa agent");
      }
    } catch (error) {
      console.error("Error updating M-Pesa agent:", error);
      toast.error("Failed to update M-Pesa agent");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete M-Pesa agent
  const handleDeleteAgent = async () => {
    if (!selectedAgent) return;

    setIsSubmitting(true);
    try {
      const response = await deleteMpesaAgent(selectedAgent.id);
      if (response.success) {
        toast.success("M-Pesa Agent deleted successfully!");
        setShowDeleteAgent(false);
        setSelectedAgent(null);
        await Promise.all([fetchAgents(), fetchStats()]);
      } else {
        toast.error(response.error || "Failed to delete M-Pesa agent");
      }
    } catch (error) {
      console.error("Error deleting M-Pesa agent:", error);
      toast.error("Failed to delete M-Pesa agent");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered agents based on tab - accounts with outstanding balances
  const agentsWithOutstanding = allAgents.filter(
    (agent) => agent.balance !== 0
  );

  const displayedAgents =
    activeTab === "outstanding" ? agentsWithOutstanding : allAgents;

  // Search filter
  const filteredAgents = displayedAgents.filter(
    (agent) =>
      agent.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.phoneNumber.includes(searchTerm) ||
      agent.agentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.storeNumber.includes(searchTerm) ||
      agent.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination for agents
  const indexOfLastAgent = agentsCurrentPage * agentsPerPage;
  const indexOfFirstAgent = indexOfLastAgent - agentsPerPage;
  const currentAgents = filteredAgents.slice(
    indexOfFirstAgent,
    indexOfLastAgent
  );
  const totalAgentPages = Math.ceil(filteredAgents.length / agentsPerPage);

  // Transaction filtering - use thisAccountAction for type filtering
  const filteredTransactions = statementTransactions.filter((txn) => {
    const matchesSearch =
      txn.description.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      txn.reference.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      txn.code.toLowerCase().includes(transactionSearch.toLowerCase());

    // Filter by thisAccountAction
    const matchesType =
      transactionFilter === "all" ||
      (transactionFilter === "debit" && txn.thisAccountAction === "Debit") ||
      (transactionFilter === "credit" && txn.thisAccountAction === "Credit");

    return matchesSearch && matchesType;
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
    toast.success("Statement exported successfully!");
  };

  const handlePrintStatement = () => {
    toast.success("Printing statement...");
  };

  const handleEditAgent = (agent: MPesaAgent) => {
    setSelectedAgent(agent);
    setEditFormData({
      agentName: agent.agentName,
      storeNumber: agent.storeNumber,
      agentType: agent.agentType,
      isActive: agent.isActive,
    });
    setShowEditAgent(true);
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
    if (!selectedTransaction) return;

    setIsSubmitting(true);
    try {
      const result = await apiRequest<boolean>(
        `/api/transaction/${selectedTransaction.id}`,
        {
          method: "DELETE",
          body: JSON.stringify({ reason: "User requested deletion" }),
        }
      );

      if (result.success) {
        toast.success(
          `Transaction ${
            selectedTransaction.reference || selectedTransaction.code
          } deleted successfully!`
        );
        setShowDeleteTransaction(false);
        setSelectedTransaction(null);
        // Refresh the agent statement
        if (selectedAgent) {
          await fetchAgentStatement(selectedAgent.id);
        }
        // Also refresh stats
        fetchStats();
      } else {
        toast.error(result.message || "Failed to delete transaction");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading M-Pesa agents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            M-Pesa Agents
          </h2>
          <p className="text-slate-600 mt-1">
            Manage M-Pesa agents and transactions
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-5 py-3 bg-slate-600 text-white font-semibold shadow-lg hover:bg-slate-700 transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </button>
          <button
            onClick={() => setShowAddAgent(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transform hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add M-Pesa Agent
          </button>
        </div>
      </div>

      {/* Summary Cards - PREMIUM SHARP DESIGN */}
      <div className="grid md:grid-cols-4 gap-4">
        {/* Total Agents Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-br from-cyan-600 via-blue-600 to-cyan-700 text-white shadow-xl shadow-cyan-500/20 overflow-hidden group hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm flex items-center justify-center border-2 border-white/20">
                <Phone className="w-6 h-6" />
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 border border-white/30">
                <span className="text-[10px] font-bold uppercase tracking-wide">
                  Total
                </span>
              </div>
            </div>
            <p className="text-xs opacity-90 mb-1 uppercase tracking-wider font-semibold">
              Total Agents
            </p>
            <p className="text-4xl font-bold tracking-tight">
              {stats.totalAgents || allAgents.length}
            </p>
            <div className="mt-3 pt-3 border-t border-white/20">
              <p className="text-[10px] opacity-75">All M-Pesa Agents</p>
            </div>
          </div>
        </motion.div>

        {/* Total Debit Card (Money IN for M-Pesa) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-emerald-300 transition-all duration-300 group"
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 flex items-center justify-center border-2 border-emerald-200 group-hover:bg-emerald-200 transition-colors">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="bg-emerald-100 px-3 py-1 border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
                  Debit - Money In
                </span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
              KES Total Debit
            </p>
            <p className="text-3xl font-bold text-emerald-600 tracking-tight">
              KES {stats.totalDebit.toLocaleString()}
            </p>
            <div className="mt-3 pt-3 border-t-2 border-slate-100">
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-slate-500 font-semibold">
                  Money In
                </p>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Total Credit Card (Money OUT for M-Pesa) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-red-300 transition-all duration-300 group"
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 flex items-center justify-center border-2 border-red-200 group-hover:bg-red-200 transition-colors">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div className="bg-red-100 px-3 py-1 border border-red-200">
                <span className="text-[10px] font-bold text-red-700 uppercase tracking-wide">
                  Credit - Money Out
                </span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
              KES Total Credit
            </p>
            <p className="text-3xl font-bold text-red-600 tracking-tight">
              KES {stats.totalCredit.toLocaleString()}
            </p>
            <div className="mt-3 pt-3 border-t-2 border-slate-100">
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-slate-500 font-semibold">
                  Money Out
                </p>
                <TrendingDown className="w-4 h-4 text-red-500" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Net Movement Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-cyan-300 transition-all duration-300 group"
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-cyan-100 flex items-center justify-center border-2 border-cyan-200 group-hover:bg-cyan-200 transition-colors">
                <Activity className="w-6 h-6 text-cyan-600" />
              </div>
              <div className="bg-cyan-100 px-3 py-1 border border-cyan-200">
                <span className="text-[10px] font-bold text-cyan-700 uppercase tracking-wide">
                  Net Movement
                </span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
              Net Movement
            </p>
            <p
              className={`text-3xl font-bold tracking-tight ${
                stats.netMovement >= 0 ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {stats.netMovement >= 0 ? "+" : ""}KES{" "}
              {stats.netMovement.toLocaleString()}
            </p>
            <div className="mt-3 pt-3 border-t-2 border-slate-100">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-500 font-semibold">
                  Debit - Credit
                </span>
                <Activity className="w-4 h-4 text-cyan-500" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all duration-300 ${
            activeTab === "all"
              ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30"
              : "bg-white text-slate-600 hover:bg-cyan-50 border-2 border-slate-200 hover:border-cyan-300"
          }`}
        >
          <Smartphone className="w-5 h-5" />
          All Agents
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === "all" ? "bg-white/20" : "bg-cyan-100 text-cyan-700"
            }`}
          >
            {allAgents.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("outstanding")}
          className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all duration-300 ${
            activeTab === "outstanding"
              ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/30"
              : "bg-white text-slate-600 hover:bg-red-50 border-2 border-slate-200 hover:border-red-300"
          }`}
        >
          <AlertCircle className="w-5 h-5" />
          With Balance
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === "outstanding"
                ? "bg-white/20"
                : "bg-red-100 text-red-700"
            }`}
          >
            {agentsWithOutstanding.length}
          </span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by agent name, phone, store number, or agent number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 text-slate-400 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-cyan-500 focus:bg-white focus:shadow-lg focus:shadow-cyan-500/10 transition-all duration-300 placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => toast.info("Opening filter options...")}
              className="flex items-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all font-medium text-slate-700"
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
            <button
              onClick={() => toast.success("Exporting M-Pesa agents list...")}
              className="flex items-center gap-2 px-5 py-3 bg-cyan-100 hover:bg-cyan-200 text-cyan-700 rounded-xl transition-all font-medium"
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* M-Pesa Agents Table */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                  Agent Code
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                  Agent Details
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                  Store Info
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                  Balance
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                  Net Movement
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentAgents.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    No M-Pesa agents found.
                  </td>
                </tr>
              ) : (
                currentAgents.map((agent, index) => (
                  <motion.tr
                    key={agent.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-cyan-50/50 transition-all duration-200 cursor-pointer group"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-cyan-600 group-hover:text-cyan-700">
                        {agent.code}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="font-bold text-slate-900 text-sm whitespace-nowrap">
                          {agent.agentName}
                        </div>
                        <div className="flex flex-col gap-0.5 mt-1">
                          <span className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Phone className="w-3 h-3" />
                            {agent.phoneNumber}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                            <User className="w-3 h-3" />
                            {agent.agentNumber}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {agent.storeNumber ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-100 text-cyan-700">
                          <Zap className="w-3 h-3" />
                          {agent.storeNumber}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-bold ${
                          agent.balance >= 0
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        KES {agent.balance.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-bold ${
                          agent.netMovement >= 0
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {agent.netMovement >= 0 ? "+" : ""}KES{" "}
                        {agent.netMovement.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold ${
                          agent.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {agent.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedAgent(agent)}
                          className="flex items-center gap-1.5 px-3 py-2 bg-cyan-600 text-white hover:bg-cyan-700 transition-all text-xs font-medium rounded-lg"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Statement
                        </button>
                        <button
                          onClick={() => handleEditAgent(agent)}
                          className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white hover:bg-emerald-700 transition-all text-xs font-medium rounded-lg"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAgent(agent);
                            setShowDeleteAgent(true);
                          }}
                          className="flex items-center gap-1.5 px-3 py-2 bg-red-600 text-white hover:bg-red-700 transition-all text-xs font-medium rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
        {totalAgentPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
            <p className="text-sm text-slate-600">
              Showing {indexOfFirstAgent + 1} to{" "}
              {Math.min(indexOfLastAgent, filteredAgents.length)} of{" "}
              {filteredAgents.length} agents
            </p>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  setAgentsCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={agentsCurrentPage === 1}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100
                   !text-slate-400 hover:!text-slate-600
                   disabled:opacity-50 disabled:cursor-not-allowed
                   disabled:text-slate-300 text-sm font-medium"
              >
                Previous
              </button>

              <button
                onClick={() =>
                  setAgentsCurrentPage((prev) =>
                    Math.min(prev + 1, totalAgentPages)
                  )
                }
                disabled={agentsCurrentPage === totalAgentPages}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100
                   !text-slate-400 hover:!text-slate-600
                   disabled:opacity-50 disabled:cursor-not-allowed
                   disabled:text-slate-300 text-sm font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Agent Statement Modal */}
      <AnimatePresence>
        {selectedAgent && !showEditAgent && !showDeleteAgent && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              className="bg-white max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Agent Header */}
              <div className="relative bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 text-white p-8">
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.2)_25%,rgba(255,255,255,.2)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.2)_75%,rgba(255,255,255,.2))] bg-[length:60px_60px]"></div>

                <button
                  onClick={() => {
                    setSelectedAgent(null);
                    setStatementTransactions([]);
                    setStatementData(null);
                  }}
                  className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 border border-white/30 transition-all"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="relative">
                  <div className="flex items-start gap-6">
                    <div className="w-20 h-20 bg-white/15 backdrop-blur-xl flex items-center justify-center border border-white/30 shadow-xl">
                      <Smartphone className="w-10 h-10 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-3xl font-bold">
                          {selectedAgent.agentName}
                        </h2>
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded-full ${
                            selectedAgent.isActive
                              ? "bg-emerald-500/20 text-emerald-100 border border-emerald-400/30"
                              : "bg-red-500/20 text-red-100 border border-red-400/30"
                          }`}
                        >
                          {selectedAgent.isActive ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </div>

                      <p className="text-cyan-100 mb-4">
                        {selectedAgent.phoneNumber}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-cyan-200" />
                          <div>
                            <p className="text-cyan-200 text-xs">
                              Agent Number
                            </p>
                            <p className="font-mono font-semibold">
                              {selectedAgent.agentNumber}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-cyan-200" />
                          <div>
                            <p className="text-cyan-200 text-xs">
                              Store Number
                            </p>
                            <p className="font-semibold">
                              {selectedAgent.storeNumber || "-"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-cyan-200" />
                          <div>
                            <p className="text-cyan-200 text-xs">Agent Code</p>
                            <p className="font-semibold">
                              {selectedAgent.code}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-cyan-200" />
                          <div>
                            <p className="text-cyan-200 text-xs">Registered</p>
                            <p className="font-semibold">
                              {new Date(
                                selectedAgent.createdAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Balance Card - KES Only */}
                  <div className="mt-6 grid grid-cols-4 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm p-4 border border-white/20">
                      <p className="text-xs text-cyan-200 mb-1">
                        Opening Balance
                      </p>
                      <p className="text-2xl font-bold">
                        KES {selectedAgent.openingBalance.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 border border-white/20">
                      <p className="text-xs text-cyan-200 mb-1">
                        Current Balance
                      </p>
                      <p className="text-2xl font-bold">
                        KES {selectedAgent.balance.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 border border-white/20">
                      <p className="text-xs text-cyan-200 mb-1">Total Debit</p>
                      <p className="text-2xl font-bold text-emerald-300">
                        +KES {selectedAgent.totalDebit.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 border border-white/20">
                      <p className="text-xs text-cyan-200 mb-1">Total Credit</p>
                      <p className="text-2xl font-bold text-red-300">
                        -KES {selectedAgent.totalCredit.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction History */}
              <div className="p-8 overflow-y-auto flex-1 bg-white">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="w-6 h-6 text-cyan-600" />
                    Transaction History
                  </h3>
                  <span className="px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-lg text-sm font-bold">
                    {filteredTransactions.length} Transactions
                  </span>
                </div>

                {/* Search, Filter, Export, Print */}
                <div className="bg-slate-50 border-b border-slate-200 p-4 mb-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                    <div className="lg:col-span-6">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search transactions..."
                          value={transactionSearch}
                          onChange={(e) => setTransactionSearch(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 text-slate-400 bg-white border border-slate-300 text-sm font-medium focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
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
                          className="w-full pl-12 pr-4 py-3 text-slate-400 bg-white border border-slate-300 text-sm font-medium focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all appearance-none cursor-pointer"
                        >
                          <option value="all">All Types</option>
                          <option value="debit">Debit (Money In)</option>
                          <option value="credit">Credit (Money Out)</option>
                        </select>
                      </div>
                    </div>
                    <div className="lg:col-span-4 flex gap-2">
                      <button
                        onClick={handleExportStatement}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white hover:bg-emerald-700 transition-all font-semibold text-sm"
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Export</span>
                      </button>
                      <button
                        onClick={handlePrintStatement}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-cyan-600 text-white hover:bg-cyan-700 transition-all font-semibold text-sm"
                      >
                        <Printer className="w-4 h-4" />
                        <span className="hidden sm:inline">Print</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white border border-slate-200 overflow-hidden shadow-sm">
                  {isLoadingStatement ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-6 h-6 animate-spin text-cyan-600 mr-2" />
                      <span className="text-slate-600">
                        Loading transactions...
                      </span>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-b border-slate-300">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                              Date & Time
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                              Description
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                              Action
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">
                              Debit (In)
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">
                              Credit (Out)
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
                              <td
                                colSpan={8}
                                className="px-4 py-8 text-center text-slate-500"
                              >
                                No transactions found.
                              </td>
                            </tr>
                          ) : (
                            currentTransactions.map((txn, idx) => (
                              <motion.tr
                                key={txn.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                className="hover:bg-cyan-50/50 transition-colors group"
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
                                      +KES {txn.debit.toLocaleString()}
                                    </span>
                                  ) : (
                                    <span className="text-slate-400">-</span>
                                  )}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-right">
                                  {txn.credit !== null ? (
                                    <span className="text-base font-bold text-red-600">
                                      -KES {txn.credit.toLocaleString()}
                                    </span>
                                  ) : (
                                    <span className="text-slate-400">-</span>
                                  )}
                                </td>
                                <td className="px-4 py-4 text-base font-bold text-slate-900 whitespace-nowrap text-right">
                                  KES {txn.balanceAfter.toLocaleString()}
                                </td>
                                <td className="px-4 py-4 text-sm text-cyan-600 font-mono whitespace-nowrap">
                                  {txn.reference || txn.code}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <div className="flex items-center justify-center gap-1">
                                    <button
                                      onClick={() => handleViewTransaction(txn)}
                                      className="p-2 bg-cyan-600 text-white hover:bg-cyan-700 transition-all"
                                      title="View Details"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleEditTransaction(txn)}
                                      className="p-2 bg-emerald-600 text-white hover:bg-emerald-700 transition-all"
                                      title="Edit Transaction"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteTransaction(txn)
                                      }
                                      className="p-2 bg-red-600 text-white hover:bg-red-700 transition-all"
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
                  )}
                </div>

                {/* Pagination */}
                {totalTransactionPages > 1 && (
                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm text-slate-600">
                      Showing {indexOfFirstTransaction + 1} to{" "}
                      {Math.min(
                        indexOfLastTransaction,
                        filteredTransactions.length
                      )}{" "}
                      of {filteredTransactions.length} transactions
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setTransactionsCurrentPage((prev) =>
                            Math.max(prev - 1, 1)
                          )
                        }
                        disabled={transactionsCurrentPage === 1}
                        className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() =>
                          setTransactionsCurrentPage((prev) =>
                            Math.min(prev + 1, totalTransactionPages)
                          )
                        }
                        disabled={
                          transactionsCurrentPage === totalTransactionPages
                        }
                        className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add M-Pesa Agent Modal */}
      <AnimatePresence>
        {showAddAgent && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              className="bg-white shadow-2xl max-w-2xl w-full overflow-hidden border border-cyan-600"
            >
              <div className="relative bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 p-4">
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.15)_25%,rgba(255,255,255,.15)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.15)_75%,rgba(255,255,255,.15))] bg-[length:20px_20px]"></div>
                <button
                  onClick={() => setShowAddAgent(false)}
                  className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 transition-all duration-200 border border-white/20 hover:border-white/40 group"
                  title="Close"
                >
                  <X className="w-4 h-4 text-white group-hover:rotate-90 transition-transform duration-300" />
                </button>
                <div className="relative flex items-center gap-3">
                  <div className="w-11 h-11 bg-white/15 backdrop-blur-xl flex items-center justify-center border border-white/30 shadow-lg">
                    <Smartphone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white tracking-tight">
                      Add M-Pesa Agent
                    </h2>
                    <p className="text-cyan-50 text-xs font-medium">
                      Register new M-Pesa agent
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleCreateAgent}>
                <div className="p-4 max-h-[calc(100vh-180px)] overflow-y-auto bg-gradient-to-br from-slate-50 to-cyan-50/30">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-cyan-500">
                        <div className="w-6 h-6 bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center shadow-sm">
                          <User className="w-3.5 h-3.5 text-white" />
                        </div>
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                          Agent Details
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3 bg-white p-3.5 border border-slate-200 shadow-sm">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                            <User className="w-3 h-3 text-cyan-600" />
                            Agent Name *
                          </label>
                          <input
                            type="text"
                            value={formData.agentName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                agentName: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600/20 focus:bg-white transition-all font-medium text-slate-900 text-sm placeholder:text-slate-400"
                            placeholder="Sarif Exchange Agent - CBD"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                            <Phone className="w-3 h-3 text-cyan-600" />
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phoneNumber: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600/20 focus:bg-white transition-all font-medium text-slate-900 text-sm placeholder:text-slate-400"
                            placeholder="+254 712 345 678"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                            <Hash className="w-3 h-3 text-cyan-600" />
                            Agent Number *
                          </label>
                          <input
                            type="text"
                            value={formData.agentNumber}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                agentNumber: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600/20 focus:bg-white transition-all font-medium text-slate-900 text-sm placeholder:text-slate-400"
                            placeholder="AGT-001"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                            <Zap className="w-3 h-3 text-cyan-600" />
                            Store Number
                          </label>
                          <input
                            type="text"
                            value={formData.storeNumber}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                storeNumber: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600/20 focus:bg-white transition-all font-medium text-slate-900 text-sm placeholder:text-slate-400"
                            placeholder="567890"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-amber-500">
                        <div className="w-6 h-6 bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-sm">
                          <Wallet className="w-3.5 h-3.5 text-white" />
                        </div>
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                          Agent Type
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="group cursor-pointer">
                          <input
                            type="radio"
                            name="agentType"
                            value="0"
                            checked={formData.agentType === 0}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                agentType: parseInt(e.target.value),
                              })
                            }
                            className="peer sr-only"
                          />
                          <div className="p-3 bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 peer-checked:border-cyan-600 peer-checked:shadow-md peer-checked:shadow-cyan-500/20 transition-all hover:border-cyan-400 hover:shadow-sm relative overflow-hidden group-hover:scale-[1.02] duration-200">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/5 to-blue-600/5 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                            <div className="relative flex items-center gap-2 mb-1.5">
                              <div className="w-7 h-7 bg-cyan-600 flex items-center justify-center shadow-sm">
                                <Smartphone className="w-3.5 h-3.5 text-white" />
                              </div>
                              <div>
                                <span className="font-bold text-xs text-slate-900 block leading-tight">
                                  STANDARD AGENT
                                </span>
                                <span className="text-[9px] text-cyan-600 font-semibold">
                                  Regular
                                </span>
                              </div>
                            </div>
                            <p className="text-[10px] text-slate-600 font-medium leading-snug relative">
                              Standard transactions
                            </p>
                          </div>
                        </label>

                        <label className="group cursor-pointer">
                          <input
                            type="radio"
                            name="agentType"
                            value="1"
                            checked={formData.agentType === 1}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                agentType: parseInt(e.target.value),
                              })
                            }
                            className="peer sr-only"
                          />
                          <div className="p-3 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 peer-checked:border-purple-600 peer-checked:shadow-md peer-checked:shadow-purple-500/20 transition-all hover:border-purple-400 hover:shadow-sm relative overflow-hidden group-hover:scale-[1.02] duration-200">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-indigo-600/5 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                            <div className="relative flex items-center gap-2 mb-1.5">
                              <div className="w-7 h-7 bg-purple-600 flex items-center justify-center shadow-sm">
                                <Zap className="w-3.5 h-3.5 text-white" />
                              </div>
                              <div>
                                <span className="font-bold text-xs text-slate-900 block leading-tight">
                                  SUPER AGENT
                                </span>
                                <span className="text-[9px] text-purple-600 font-semibold">
                                  Premium
                                </span>
                              </div>
                            </div>
                            <p className="text-[10px] text-slate-600 font-medium leading-snug relative">
                              High volume transactions
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-emerald-500">
                        <div className="w-6 h-6 bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-sm">
                          <Wallet className="w-3.5 h-3.5 text-white" />
                        </div>
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                          Opening Balance (KES Only)
                        </h3>
                      </div>
                      <div className="bg-white p-3.5 border border-slate-200 shadow-sm">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                            <Wallet className="w-3 h-3 text-emerald-600" />
                            KES Amount
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-700 font-bold text-[10px]">
                              KES
                            </span>
                            <input
                              type="number"
                              value={formData.openingBalance}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  openingBalance:
                                    parseFloat(e.target.value) || 0,
                                })
                              }
                              className="w-full pl-12 pr-3 py-2 bg-emerald-50 border border-emerald-300 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 focus:bg-white transition-all font-semibold text-slate-900 text-sm placeholder:text-emerald-400/60"
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 p-4 bg-gradient-to-r from-slate-50 to-cyan-50/30">
                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      onClick={() => setShowAddAgent(false)}
                      className="flex-1 px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all font-semibold text-slate-700 text-sm tracking-wide shadow-sm hover:shadow"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-5 py-2.5 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/50 transition-all flex items-center justify-center gap-2 text-sm tracking-wide border border-cyan-700/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      {isSubmitting ? "Adding..." : "Add Agent"}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Agent Modal */}
      <AnimatePresence>
        {showEditAgent && selectedAgent && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white shadow-2xl max-w-xl w-full max-h-[85vh] overflow-hidden flex flex-col"
            >
              {/* Premium Header with Gradient Background */}
              <div className="relative bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 px-6 py-4">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

                <div className="relative flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
                      <Edit3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white mb-0.5">
                        Edit M-Pesa Agent
                      </h2>
                      <p className="text-cyan-100 text-xs font-medium">
                        Update agent information and settings
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-xs font-bold text-white">
                          <Hash className="w-3 h-3" />
                          {selectedAgent.code}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 backdrop-blur-sm border rounded-lg text-xs font-bold ${
                            selectedAgent.isActive
                              ? "bg-emerald-500/30 border-emerald-400/40 text-emerald-100"
                              : "bg-red-500/30 border-red-400/40 text-red-100"
                          }`}
                        >
                          <Zap className="w-3 h-3" />
                          {selectedAgent.isActive ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowEditAgent(false);
                      setSelectedAgent(null);
                    }}
                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Account Balance Preview */}
              <div className="px-6 py-3 bg-gradient-to-r from-slate-50 to-cyan-50 border-b border-slate-200">
                <div className="grid grid-cols-1 gap-3">
                  {/* KES Balance */}
                  <div className="bg-white p-3 border border-cyan-200 shadow-sm">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Wallet className="w-3.5 h-3.5 text-cyan-600" />
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                        KES M-Pesa Account
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 text-xs">
                      <div>
                        <p className="text-[10px] text-slate-500 mb-0.5">
                          Opening Balance
                        </p>
                        <p className="text-xs font-bold text-emerald-600">
                          {selectedAgent.openingBalance.toLocaleString()}
                        </p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-[10px] text-slate-500 mb-0.5">
                          Current Balance
                        </p>
                        <p className="text-sm font-bold text-cyan-600">
                          KES {selectedAgent.balance.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scrollable Form Content */}
              <form
                onSubmit={handleUpdateAgent}
                className="flex flex-col flex-1 overflow-hidden"
              >
                <div className="px-6 py-5 overflow-y-auto flex-1">
                  <div className="space-y-6">
                    {/* Agent Information Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-6 bg-gradient-to-b from-cyan-600 to-blue-600 rounded-full"></div>
                        <h3 className="text-lg font-bold text-slate-900">
                          Agent Information
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Agent Name */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                            <Smartphone className="w-4 h-4 text-slate-400" />
                            Agent Name
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={editFormData.agentName}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                agentName: e.target.value,
                              })
                            }
                            placeholder="Enter agent name"
                            className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                          />
                        </div>

                        {/* Phone Number - Read Only */}
                        <div className="group">
                          <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-400" />
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={selectedAgent.phoneNumber}
                            disabled
                            className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 text-slate-500 font-medium cursor-not-allowed"
                          />
                        </div>

                        {/* Agent Number - Read Only */}
                        <div className="group">
                          <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                            <Hash className="w-4 h-4 text-slate-400" />
                            Agent Number
                          </label>
                          <input
                            type="text"
                            value={selectedAgent.agentNumber}
                            disabled
                            className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 text-slate-500 font-medium cursor-not-allowed"
                          />
                        </div>
                      </div>

                      {/* Store Number and Status */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="group">
                          <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                            <Hash className="w-4 h-4 text-slate-400" />
                            Store Number
                          </label>
                          <input
                            type="text"
                            value={editFormData.storeNumber}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                storeNumber: e.target.value,
                              })
                            }
                            placeholder="567890"
                            className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                          />
                        </div>

                        <div className="group">
                          <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-slate-400" />
                            Account Status
                          </label>
                          <select
                            value={
                              editFormData.isActive ? "active" : "inactive"
                            }
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                isActive: e.target.value === "active",
                              })
                            }
                            className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all appearance-none cursor-pointer"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                      </div>

                      {/* Agent Type */}
                      <div className="group">
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                          <Zap className="w-4 h-4 text-slate-400" />
                          Agent Type
                        </label>
                        <select
                          value={editFormData.agentType}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              agentType: parseInt(e.target.value),
                            })
                          }
                          className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all appearance-none cursor-pointer"
                        >
                          <option value="0">Standard Agent</option>
                          <option value="1">Super Agent</option>
                        </select>
                      </div>

                      {/* Registered Date */}
                      <div className="group">
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          Registered Since
                        </label>
                        <input
                          type="text"
                          value={new Date(
                            selectedAgent.createdAt
                          ).toLocaleDateString()}
                          disabled
                          className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 text-slate-500 font-medium cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fixed Footer with Action Buttons */}
                <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-cyan-50 border-t-2 border-slate-200 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditAgent(false);
                      setSelectedAgent(null);
                    }}
                    className="flex-1 px-6 py-3.5 bg-white border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all font-bold text-slate-700 shadow-sm hover:shadow"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3.5 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 text-white font-bold shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : null}
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Agent Confirmation Modal */}
      <AnimatePresence>
        {showDeleteAgent && selectedAgent && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white shadow-2xl max-w-md w-full overflow-hidden flex flex-col"
            >
              {/* Premium Header with Gradient Background */}
              <div className="relative bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-6 py-4">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

                <div className="relative flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
                      <Trash2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white mb-0.5">
                        Delete M-Pesa Agent
                      </h2>
                      <p className="text-red-100 text-xs font-medium">
                        This action cannot be undone
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowDeleteAgent(false);
                      setSelectedAgent(null);
                    }}
                    className="p-1.5 bg-white/10 hover:bg-white/20 transition-all backdrop-blur-sm"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-5">
                {/* Warning Icon */}
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-red-100 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                </div>

                <h4 className="text-lg font-bold text-slate-900 text-center mb-2">
                  Are you sure you want to delete this agent?
                </h4>
                <p className="text-sm text-slate-600 text-center mb-4">
                  This will permanently remove the agent and all associated data
                  from the system.
                </p>

                {/* Agent Details */}
                <div className="bg-red-50 border-2 border-red-200 p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-600 uppercase">
                      Agent Code:
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-900">
                      {selectedAgent.code}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-600 uppercase">
                      Agent Name:
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {selectedAgent.agentName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-600 uppercase">
                      Phone:
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {selectedAgent.phoneNumber}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-red-300">
                    <span className="text-xs font-bold text-slate-600 uppercase">
                      Balance:
                    </span>
                    <span className="text-sm font-bold text-red-600">
                      KES {selectedAgent.balance.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Fixed Footer with Action Buttons */}
              <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-red-50 border-t-2 border-slate-200 flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteAgent(false);
                    setSelectedAgent(null);
                  }}
                  className="flex-1 px-6 py-3 bg-white border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all font-bold text-slate-700 shadow-sm hover:shadow"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAgent}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-bold shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
                  {isSubmitting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Transaction Modal - PREMIUM DESIGN */}
      <AnimatePresence>
        {showViewTransaction && selectedTransaction && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col"
            >
              {/* Premium Header with Gradient Background */}
              <div
                className={`relative px-6 py-4 ${
                  selectedTransaction.thisAccountAction === "Debit"
                    ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700"
                    : "bg-gradient-to-r from-red-600 via-rose-600 to-red-700"
                }`}
              >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

                <div className="relative flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
                      {selectedTransaction.thisAccountAction === "Debit" ? (
                        <ArrowUpCircle className="w-6 h-6 text-white" />
                      ) : (
                        <ArrowDownCircle className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white mb-0.5">
                        Transaction Details
                      </h2>
                      <p
                        className={`text-xs font-medium ${
                          selectedTransaction.thisAccountAction === "Debit"
                            ? "text-emerald-100"
                            : "text-red-100"
                        }`}
                      >
                        {selectedTransaction.thisAccountAction === "Debit"
                          ? "Debit Transaction (Money In)"
                          : "Credit Transaction (Money Out)"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowViewTransaction(false);
                      setSelectedTransaction(null);
                    }}
                    className="p-1.5 bg-white/10 hover:bg-white/20 transition-all backdrop-blur-sm"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="px-6 py-5 overflow-y-auto flex-1">
                <div className="space-y-4">
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
                      KES {selectedTransaction.amount.toLocaleString()}
                    </p>
                    <div className="flex gap-4 mt-2 text-xs text-slate-600">
                      <span>
                        Balance Before: KES{" "}
                        {selectedTransaction.balanceBefore.toLocaleString()}
                      </span>
                      <span>→</span>
                      <span className="font-bold">
                        Balance After: KES{" "}
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
                          ? `+KES ${selectedTransaction.debit.toLocaleString()}`
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
                          ? `-KES ${selectedTransaction.credit.toLocaleString()}`
                          : "-"}
                      </p>
                    </div>
                  </div>

                  {/* Transaction Info Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3 border border-slate-200">
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                        Transaction Code
                      </p>
                      <p className="text-sm font-bold text-slate-900 font-mono">
                        {selectedTransaction.code}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-3 border border-slate-200">
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                        Reference
                      </p>
                      <p className="text-sm font-bold text-cyan-600 font-mono">
                        {selectedTransaction.reference}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3 border border-slate-200">
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                        Date & Time
                      </p>
                      <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(selectedTransaction.date).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-3 border border-slate-200">
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                        Currency
                      </p>
                      <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <Wallet className="w-3.5 h-3.5 text-emerald-600" /> KES
                      </p>
                    </div>
                  </div>

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
                </div>
              </div>

              {/* Fixed Footer with Action Buttons */}
              <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-cyan-50 border-t-2 border-slate-200 flex gap-3">
                <button
                  onClick={() => {
                    setShowViewTransaction(false);
                    setSelectedTransaction(null);
                  }}
                  className="flex-1 px-6 py-3 bg-white border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all font-bold text-slate-700 shadow-sm hover:shadow"
                >
                  Close
                </button>
                {selectedTransaction.relatedAccount && (
                  <button
                    onClick={() => {
                      setShowViewTransaction(false);
                      setShowRelatedAccount(true);
                    }}
                    className={`flex-1 px-6 py-3 text-white font-bold shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95 ${
                      selectedTransaction.thisAccountAction === "Debit"
                        ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 shadow-emerald-500/30 hover:shadow-emerald-500/40"
                        : "bg-gradient-to-r from-red-600 via-rose-600 to-red-700 shadow-red-500/30 hover:shadow-red-500/40"
                    }`}
                  >
                    Related Account
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Transaction Modal */}
      <AnimatePresence>
        {showEditTransaction && selectedTransaction && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 px-6 py-4">
                <div className="relative flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
                      <Edit3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white mb-0.5">
                        Edit Transaction
                      </h2>
                      <p className="text-cyan-100 text-xs font-medium">
                        Update M-Pesa transaction details
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowEditTransaction(false);
                      setSelectedTransaction(null);
                    }}
                    className="p-1.5 bg-white/10 hover:bg-white/20 transition-all backdrop-blur-sm"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className="px-6 py-5 overflow-y-auto flex-1">
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">
                        Transaction Code
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedTransaction.code}
                        disabled
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 text-slate-500 font-mono text-sm cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">
                        Reference
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedTransaction.reference}
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-900 font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase flex items-center gap-1">
                      Description
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedTransaction.description}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 uppercase flex items-center gap-1">
                        Action
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        defaultValue={selectedTransaction.thisAccountAction}
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all appearance-none cursor-pointer"
                      >
                        <option value="Credit">Credit</option>
                        <option value="Debit">Debit</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">
                        Currency
                      </label>
                      <input
                        type="text"
                        value="KES"
                        disabled
                        className="w-full px-4 py-3 bg-emerald-50 border-2 border-emerald-200 text-emerald-700 text-sm font-bold cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 uppercase flex items-center gap-1">
                        Amount
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        defaultValue={selectedTransaction.amount}
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-900 text-sm font-bold focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-cyan-50 border-t-2 border-slate-200 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditTransaction(false);
                    setSelectedTransaction(null);
                  }}
                  className="flex-1 px-6 py-3 bg-white border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all font-bold text-slate-700 shadow-sm hover:shadow"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.success(
                      `Transaction ${selectedTransaction.reference} updated successfully!`
                    );
                    setShowEditTransaction(false);
                    setSelectedTransaction(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 text-white font-bold shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all hover:scale-105 active:scale-95"
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white shadow-2xl max-w-md w-full overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-6 py-4">
                <div className="relative flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
                      <Trash2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white mb-0.5">
                        Delete Transaction
                      </h2>
                      <p className="text-red-100 text-xs font-medium">
                        This action cannot be undone
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowDeleteTransaction(false);
                      setSelectedTransaction(null);
                    }}
                    className="p-1.5 bg-white/10 hover:bg-white/20 transition-all backdrop-blur-sm"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-5">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-red-100 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                </div>

                <h4 className="text-lg font-bold text-slate-900 text-center mb-2">
                  Are you sure you want to delete this transaction?
                </h4>
                <p className="text-sm text-slate-600 text-center mb-4">
                  This will permanently remove the transaction from the system.
                </p>

                <div className="bg-red-50 border-2 border-red-200 p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-600 uppercase">
                      Transaction Code:
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-900">
                      {selectedTransaction.code}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-600 uppercase">
                      Reference:
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-900">
                      {selectedTransaction.reference}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-600 uppercase">
                      Description:
                    </span>
                    <span className="text-xs font-bold text-slate-900 text-right">
                      {selectedTransaction.description}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-red-300">
                    <span className="text-xs font-bold text-slate-600 uppercase">
                      Amount:
                    </span>
                    <span className="text-sm font-bold text-red-600">
                      KES {selectedTransaction.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-red-50 border-t-2 border-slate-200 flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteTransaction(false);
                    setSelectedTransaction(null);
                  }}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-white border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all font-bold text-slate-700 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteTransaction}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-bold shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
                  {isSubmitting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Related Account Modal */}
      <AnimatePresence>
        {showRelatedAccount &&
          selectedTransaction &&
          selectedTransaction.relatedAccount && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[70]">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col"
              >
                {/* 
                  Logic for display:
                  - Client accounts (accountType === 3): Credit = positive (green), Debit = negative (red)
                  - Other accounts (Bank, MPesa, Cash): Debit = positive (green), Credit = negative (red)
                */}
                {(() => {
                  const isClientAccount =
                    selectedTransaction.relatedAccount!.accountType === 3;
                  const action = selectedTransaction.relatedAccount!.action;

                  // Determine if this is a positive action for the account
                  const isPositive = isClientAccount
                    ? action === "Credit" // For clients: Credit increases their balance
                    : action === "Debit"; // For assets: Debit increases their balance

                  return (
                    <>
                      {/* Header */}
                      <div
                        className={`relative px-6 py-4 ${
                          isPositive
                            ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700"
                            : "bg-gradient-to-r from-red-600 via-rose-600 to-red-700"
                        }`}
                      >
                        <div className="relative flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
                              {isPositive ? (
                                <ArrowUpCircle className="w-6 h-6 text-white" />
                              ) : (
                                <ArrowDownCircle className="w-6 h-6 text-white" />
                              )}
                            </div>
                            <div>
                              <h2 className="text-xl font-bold text-white mb-0.5">
                                Related Account
                              </h2>
                              <p className="text-xs font-medium text-white/80">
                                Double-Entry Counterpart
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setShowRelatedAccount(false)}
                            className="p-1.5 bg-white/10 hover:bg-white/20 transition-all backdrop-blur-sm"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="px-6 py-5 overflow-y-auto flex-1">
                        <div className="space-y-4">
                          {/* Account Type Badge */}
                          <div className="bg-slate-50 p-4 border-2 border-slate-200">
                            <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">
                              Account Details
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                                {isClientAccount ? (
                                  <User className="w-5 h-5 text-blue-600" />
                                ) : (
                                  <Wallet className="w-5 h-5 text-blue-600" />
                                )}
                              </div>
                              <div>
                                <p className="text-lg font-bold text-slate-900">
                                  {getAccountTypeLabel(
                                    selectedTransaction.relatedAccount!
                                      .accountType
                                  )}
                                </p>
                                <p className="text-xs text-slate-600">
                                  {
                                    selectedTransaction.relatedAccount!
                                      .accountName
                                  }
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Account Details */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-50 p-3 border border-slate-200">
                              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                                Account Code
                              </p>
                              <p className="text-sm font-bold text-slate-900 font-mono">
                                {
                                  selectedTransaction.relatedAccount!
                                    .accountCode
                                }
                              </p>
                            </div>
                            <div className="bg-slate-50 p-3 border border-slate-200">
                              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                                Transaction Ref
                              </p>
                              <p className="text-sm font-bold text-blue-600 font-mono">
                                {selectedTransaction.reference}
                              </p>
                            </div>
                          </div>

                          {/* How Account Was Affected */}
                          <div
                            className={`p-4 text-white ${
                              isPositive
                                ? "bg-gradient-to-br from-emerald-600 to-teal-600"
                                : "bg-gradient-to-br from-red-600 to-rose-600"
                            }`}
                          >
                            <p className="text-xs opacity-90 mb-2">
                              How This Account Was Affected
                            </p>
                            <div className="flex items-center gap-2 mb-4">
                              {isPositive ? (
                                <ArrowUpCircle className="w-6 h-6" />
                              ) : (
                                <ArrowDownCircle className="w-6 h-6" />
                              )}
                              <p className="text-2xl font-bold uppercase">
                                {selectedTransaction.relatedAccount!.action}
                              </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/20">
                              <div>
                                <p className="text-[10px] opacity-75 mb-1">
                                  Amount
                                </p>
                                <p className="text-xl font-bold">
                                  {isPositive ? "+" : "-"}
                                  KES{" "}
                                  {selectedTransaction.relatedAccount!.amount.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] opacity-75 mb-1">
                                  Balance After
                                </p>
                                <p className="text-xl font-bold">
                                  KES{" "}
                                  {selectedTransaction.relatedAccount!.balanceAfter.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Client Info if present */}
                          {(selectedTransaction.relatedAccount!.clientCode ||
                            selectedTransaction.relatedAccount!
                              .clientPhone) && (
                            <div className="bg-purple-50 border border-purple-200 p-3">
                              <p className="text-[10px] font-bold text-purple-700 uppercase mb-2">
                                Client Information
                              </p>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                {selectedTransaction.relatedAccount!
                                  .clientCode && (
                                  <div>
                                    <p className="text-slate-500">
                                      Client Code
                                    </p>
                                    <p className="font-bold text-slate-900 font-mono">
                                      {
                                        selectedTransaction.relatedAccount!
                                          .clientCode
                                      }
                                    </p>
                                  </div>
                                )}
                                {selectedTransaction.relatedAccount!
                                  .clientPhone && (
                                  <div>
                                    <p className="text-slate-500">
                                      Client Phone
                                    </p>
                                    <p className="font-bold text-slate-900">
                                      {
                                        selectedTransaction.relatedAccount!
                                          .clientPhone
                                      }
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Transaction Flow */}
                          <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 border-2 border-slate-200">
                            <p className="text-xs font-bold text-slate-700 uppercase mb-3">
                              Transaction Flow
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="text-center">
                                <div className="w-12 h-12 bg-emerald-100 flex items-center justify-center mx-auto mb-2">
                                  <Phone className="w-6 h-6 text-emerald-600" />
                                </div>
                                <p className="text-xs font-bold text-slate-900">
                                  M-Pesa Account
                                </p>
                                <p
                                  className={`text-xs font-bold mt-1 ${
                                    selectedTransaction.thisAccountAction ===
                                    "Debit"
                                      ? "text-emerald-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {selectedTransaction.thisAccountAction}
                                </p>
                              </div>

                              <div className="flex-1 mx-4">
                                <div className="flex items-center">
                                  <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-300 to-emerald-300"></div>
                                  <ArrowRight className="w-5 h-5 text-blue-600 mx-2" />
                                  <div className="flex-1 h-0.5 bg-gradient-to-r from-emerald-300 to-blue-300"></div>
                                </div>
                                <p className="text-[10px] text-center text-slate-600 mt-1 font-semibold">
                                  KES{" "}
                                  {selectedTransaction.amount.toLocaleString()}
                                </p>
                              </div>

                              <div className="text-center">
                                <div
                                  className={`w-12 h-12 flex items-center justify-center mx-auto mb-2 ${
                                    isPositive ? "bg-emerald-100" : "bg-red-100"
                                  }`}
                                >
                                  {isClientAccount ? (
                                    <User className="w-6 h-6 text-blue-600" />
                                  ) : (
                                    <Wallet className="w-6 h-6 text-blue-600" />
                                  )}
                                </div>
                                <p className="text-xs font-bold text-slate-900">
                                  {getAccountTypeLabel(
                                    selectedTransaction.relatedAccount!
                                      .accountType
                                  )}
                                </p>
                                <p
                                  className={`text-xs font-bold mt-1 ${
                                    isPositive
                                      ? "text-emerald-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {selectedTransaction.relatedAccount!.action}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-blue-50 border-t-2 border-slate-200">
                        <button
                          onClick={() => setShowRelatedAccount(false)}
                          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all hover:scale-105 active:scale-95"
                        >
                          Close
                        </button>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            </div>
          )}
      </AnimatePresence>
    </div>
  );
}
