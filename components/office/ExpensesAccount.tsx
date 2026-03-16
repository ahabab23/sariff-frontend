// "use client";

// import { useState, useEffect, useCallback } from "react";
// import {
//   Receipt,
//   Search,
//   Plus,
//   ChevronLeft,
//   ChevronRight,
//   Calendar,
//   X,
//   Download,
//   Printer,
//   Eye,
//   Tag,
//   DollarSign,
//   Wallet,
//   ArrowUpCircle,
//   ArrowDownCircle,
//   Edit,
//   Trash2,
//   Loader2,
//   RefreshCw,
//   Building2,
//   Smartphone,
//   Banknote,
//   AlertTriangle,
//   CheckCircle,
//   Filter,
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast } from "sonner";
// import {
//   getExpenseCategories,
//   getExpenses,
//   createExpense,
//   updateExpense,
//   deleteExpense,
//   getExpenseStats,
//   getCashAccounts,
//   getBankAccounts,
//   getMpesaAgents,
//   ExpenseDto,
//   CreateExpenseDto,
//   UpdateExpenseDto,
//   Currency,
//   PaymentMethod,
//   AccountType,
//   CashAccountDto,
//   BankAccountDto,
//   MpesaAgentDto,
// } from "@/lib/api";

// // ==============================================
// // Types
// // ==============================================

// interface ExpenseTransaction {
//   id: string;
//   code: string;
//   date: string;
//   description: string;
//   categoryId: string;
//   categoryName: string;
//   currency: "KES" | "USD";
//   amount: number;
//   reference: string;
//   paymentMethod: string;
//   vendor: string;
//   approvedBy: string;
// }

// interface ExpenseCategory {
//   id: string;
//   name: string;
//   description?: string;
//   kesTotal: number;
//   usdTotal: number;
//   transactionCount: number;
//   isActive: boolean;
// }

// interface ExpenseStats {
//   totalKES: number;
//   totalUSD: number;
//   thisMonthKES: number;
//   thisMonthUSD: number;
//   activeCategories: number;
// }

// interface FormData {
//   categoryId: string;
//   description: string;
//   amount: number;
//   currency: number;
//   vendor: string;
//   paymentMethod: number;
//   paymentAccountType: number;
//   paymentAccountId: string;
//   reference: string;
//   expenseDate: string;
// }

// interface EditFormData {
//   description: string;
//   vendor: string;
//   amount: number;
//   reference: string;
// }

// interface AccountOption {
//   id: string;
//   name: string;
//   type: number;
//   currency: number;
//   balance: number;
// }

// // ==============================================
// // Helper Functions
// // ==============================================

// const formatNumber = (num: number) => {
//   return new Intl.NumberFormat("en-KE").format(num);
// };

// const formatCurrency = (amount: number, currency: "KES" | "USD" | number) => {
//   const currencyCode =
//     typeof currency === "number" ? (currency === 0 ? "KES" : "USD") : currency;
//   return `${currencyCode} ${formatNumber(amount)}`;
// };

// // ==============================================
// // Modal Wrapper Component
// // ==============================================

// function ModalWrapper({
//   children,
//   onClose,
// }: {
//   children: React.ReactNode;
//   onClose: () => void;
// }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
//       onClick={(e) => {
//         if (e.target === e.currentTarget) onClose();
//       }}
//     >
//       <motion.div
//         initial={{ scale: 0.95, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         exit={{ scale: 0.95, opacity: 0 }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {children}
//       </motion.div>
//     </motion.div>
//   );
// }

// // ==============================================
// // Main Component
// // ==============================================

// export function ExpensesAccount() {
//   const [allCategories, setAllCategories] = useState<ExpenseCategory[]>([]);
//   const [allExpenses, setAllExpenses] = useState<ExpenseTransaction[]>([]);
//   const [stats, setStats] = useState<ExpenseStats>({
//     totalKES: 0,
//     totalUSD: 0,
//     thisMonthKES: 0,
//     thisMonthUSD: 0,
//     activeCategories: 0,
//   });
//   const [cashAccounts, setCashAccounts] = useState<CashAccountDto[]>([]);
//   const [bankAccounts, setBankAccounts] = useState<BankAccountDto[]>([]);
//   const [mpesaAgents, setMpesaAgents] = useState<MpesaAgentDto[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] =
//     useState<ExpenseCategory | null>(null);
//   const [transactionSearch, setTransactionSearch] = useState("");
//   const [categoriesCurrentPage, setCategoriesCurrentPage] = useState(1);
//   const [transactionsCurrentPage, setTransactionsCurrentPage] = useState(1);
//   const [showAddExpense, setShowAddExpense] = useState(false);
//   const [showEditExpense, setShowEditExpense] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedExpense, setSelectedExpense] =
//     useState<ExpenseTransaction | null>(null);
//   const [expenseToDelete, setExpenseToDelete] =
//     useState<ExpenseTransaction | null>(null);

//   const [formData, setFormData] = useState<FormData>({
//     categoryId: "",
//     description: "",
//     amount: 0,
//     currency: 0,
//     vendor: "",
//     paymentMethod: 0,
//     paymentAccountType: 0,
//     paymentAccountId: "",
//     reference: "",
//     expenseDate: new Date().toISOString().split("T")[0],
//   });

//   const [editFormData, setEditFormData] = useState<EditFormData>({
//     description: "",
//     vendor: "",
//     amount: 0,
//     reference: "",
//   });

//   // ==============================================
//   // Data Mapping
//   // ==============================================

//   const mapCategoryDto = (dto: any): ExpenseCategory => ({
//     id: dto.id,
//     name: dto.name,
//     description: dto.description,
//     kesTotal: dto.totalKES || 0,
//     usdTotal: dto.totalUSD || 0,
//     transactionCount: dto.transactionCount || 0,
//     isActive: dto.isActive ?? true,
//   });

//   const mapExpenseDto = (dto: ExpenseDto): ExpenseTransaction => {
//     const paymentMethodNames: { [key: number]: string } = {
//       0: "Cash",
//       1: "Bank Transfer",
//       2: "M-Pesa",
//       3: "Credit Card",
//       4: "Cheque",
//     };
//     return {
//       id: dto.id,
//       code: dto.code,
//       date: new Date(dto.expenseDate || dto.createdAt).toLocaleString(),
//       description: dto.description,
//       categoryId: dto.categoryId,
//       categoryName: dto.categoryName || "Unknown",
//       currency: dto.currency === 0 ? "KES" : "USD",
//       amount: dto.amount,
//       reference: dto.reference || dto.code,
//       paymentMethod: paymentMethodNames[dto.paymentMethod] || "Unknown",
//       vendor: dto.vendorPayee || "Unknown",
//       approvedBy: dto.createdByName || "System",
//     };
//   };

//   // ==============================================
//   // Data Fetching
//   // ==============================================

//   const fetchCategories = useCallback(async () => {
//     try {
//       const response = await getExpenseCategories();
//       if (response.success && response.data) {
//         setAllCategories(response.data.map(mapCategoryDto));
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   }, []);

//   const fetchExpenses = useCallback(async () => {
//     try {
//       const response = await getExpenses(1, 1000);
//       if (response.success && response.data) {
//         const expenses = response.data.items || response.data;
//         if (Array.isArray(expenses)) {
//           setAllExpenses(expenses.map(mapExpenseDto));
//         }
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   }, []);

//   const fetchStats = useCallback(async () => {
//     try {
//       const response = await getExpenseStats();
//       if (response.success && response.data) {
//         setStats({
//           totalKES: response.data.totalKES || 0,
//           totalUSD: response.data.totalUSD || 0,
//           thisMonthKES: response.data.thisMonthKES || 0,
//           thisMonthUSD: response.data.thisMonthUSD || 0,
//           activeCategories: response.data.activeCategories || 0,
//         });
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   }, []);

//   const fetchPaymentAccounts = useCallback(async () => {
//     try {
//       const [cashRes, bankRes, mpesaRes] = await Promise.all([
//         getCashAccounts(),
//         getBankAccounts(),
//         getMpesaAgents(),
//       ]);
//       if (cashRes.success && cashRes.data) setCashAccounts(cashRes.data);
//       if (bankRes.success && bankRes.data) setBankAccounts(bankRes.data);
//       if (mpesaRes.success && mpesaRes.data) setMpesaAgents(mpesaRes.data);
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   }, []);

//   useEffect(() => {
//     const loadData = async () => {
//       setIsLoading(true);
//       await Promise.all([
//         fetchCategories(),
//         fetchExpenses(),
//         fetchStats(),
//         fetchPaymentAccounts(),
//       ]);
//       setIsLoading(false);
//     };
//     loadData();
//   }, [fetchCategories, fetchExpenses, fetchStats, fetchPaymentAccounts]);

//   const handleRefresh = async () => {
//     setIsLoading(true);
//     await Promise.all([
//       fetchCategories(),
//       fetchExpenses(),
//       fetchStats(),
//       fetchPaymentAccounts(),
//     ]);
//     setIsLoading(false);
//     toast.success("Data refreshed!");
//   };

//   // ==============================================
//   // Account Helpers
//   // ==============================================

//   const getAvailableAccounts = useCallback((): AccountOption[] => {
//     const accounts: AccountOption[] = [];
//     if (formData.paymentAccountType === 0) {
//       cashAccounts
//         .filter((acc) => acc.currency === formData.currency && acc.isActive)
//         .forEach((acc) => {
//           accounts.push({
//             id: acc.id,
//             name: `Cash ${acc.currency === 0 ? "KES" : "USD"}`,
//             type: 0,
//             currency: acc.currency,
//             balance: acc.balance,
//           });
//         });
//     }
//     if (formData.paymentAccountType === 1) {
//       bankAccounts
//         .filter((acc) => acc.currency === formData.currency && acc.isActive)
//         .forEach((acc) => {
//           accounts.push({
//             id: acc.id,
//             name: `${acc.bankName} - ${acc.accountNumber}`,
//             type: 1,
//             currency: acc.currency,
//             balance: acc.balance,
//           });
//         });
//     }
//     if (formData.paymentAccountType === 2 && formData.currency === 0) {
//       mpesaAgents
//         .filter((acc) => acc.isActive)
//         .forEach((acc) => {
//           accounts.push({
//             id: acc.id,
//             name: `${acc.agentName} - ${acc.agentNumber}`,
//             type: 2,
//             currency: 0,
//             balance: acc.balance,
//           });
//         });
//     }
//     return accounts;
//   }, [
//     formData.paymentAccountType,
//     formData.currency,
//     cashAccounts,
//     bankAccounts,
//     mpesaAgents,
//   ]);

//   useEffect(() => {
//     const accounts = getAvailableAccounts();
//     if (accounts.length > 0) {
//       const valid = accounts.some(
//         (acc) => acc.id === formData.paymentAccountId
//       );
//       if (!formData.paymentAccountId || !valid) {
//         setFormData((prev) => ({ ...prev, paymentAccountId: accounts[0].id }));
//       }
//     } else {
//       setFormData((prev) => ({ ...prev, paymentAccountId: "" }));
//     }
//   }, [formData.paymentAccountType, formData.currency, getAvailableAccounts]);

//   // ==============================================
//   // CRUD Handlers
//   // ==============================================

//   const handleCreateExpense = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (
//       !formData.categoryId ||
//       !formData.description.trim() ||
//       formData.amount <= 0 ||
//       !formData.paymentAccountId
//     ) {
//       toast.error("Please fill in all required fields");
//       return;
//     }
//     setIsSubmitting(true);
//     try {
//       const createDto: CreateExpenseDto = {
//         categoryId: formData.categoryId,
//         description: formData.description.trim(),
//         vendorPayee: formData.vendor.trim() || undefined,
//         amount: formData.amount,
//         currency: formData.currency as Currency,
//         paymentMethod: formData.paymentMethod as PaymentMethod,
//         paymentAccountType: formData.paymentAccountType as AccountType,
//         paymentAccountId: formData.paymentAccountId,
//         reference: formData.reference.trim() || undefined,
//         expenseDate: new Date(
//           formData.expenseDate + "T12:00:00Z"
//         ).toISOString(),
//       };
//       const response = await createExpense(createDto);
//       if (response.success) {
//         toast.success("Expense recorded successfully!");
//         setShowAddExpense(false);
//         setFormData({
//           categoryId: "",
//           description: "",
//           amount: 0,
//           currency: 0,
//           vendor: "",
//           paymentMethod: 0,
//           paymentAccountType: 0,
//           paymentAccountId: "",
//           reference: "",
//           expenseDate: new Date().toISOString().split("T")[0],
//         });
//         await Promise.all([
//           fetchCategories(),
//           fetchExpenses(),
//           fetchStats(),
//           fetchPaymentAccounts(),
//         ]);
//       } else {
//         toast.error(response.message || "Failed to create expense");
//       }
//     } catch (error: any) {
//       toast.error(error?.message || "Failed to create expense");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleUpdateExpense = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (
//       !selectedExpense ||
//       !editFormData.description.trim() ||
//       editFormData.amount <= 0
//     ) {
//       toast.error("Please fill in all required fields");
//       return;
//     }
//     setIsSubmitting(true);
//     try {
//       const updateDto: UpdateExpenseDto = {
//         description: editFormData.description.trim(),
//         vendorPayee: editFormData.vendor.trim() || undefined,
//         amount: editFormData.amount,
//         reference: editFormData.reference.trim() || undefined,
//       };
//       const response = await updateExpense(selectedExpense.id, updateDto);
//       if (response.success) {
//         toast.success("Expense updated successfully!");
//         setShowEditExpense(false);
//         setSelectedExpense(null);
//         await Promise.all([
//           fetchCategories(),
//           fetchExpenses(),
//           fetchStats(),
//           fetchPaymentAccounts(),
//         ]);
//       } else {
//         toast.error(response.message || "Failed to update expense");
//       }
//     } catch (error: any) {
//       toast.error(error?.message || "Failed to update expense");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDeleteExpense = async () => {
//     if (!expenseToDelete) return;
//     setIsDeleting(true);
//     try {
//       const response = await deleteExpense(expenseToDelete.id);
//       if (response.success) {
//         toast.success(
//           `Expense deleted! ${
//             expenseToDelete.currency
//           } ${expenseToDelete.amount.toLocaleString()} restored.`
//         );
//         setShowDeleteModal(false);
//         setExpenseToDelete(null);
//         await Promise.all([
//           fetchCategories(),
//           fetchExpenses(),
//           fetchStats(),
//           fetchPaymentAccounts(),
//         ]);
//       } else {
//         toast.error(response.message || "Failed to delete expense");
//       }
//     } catch (error: any) {
//       toast.error(error?.message || "Failed to delete expense");
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const openEditModal = (expense: ExpenseTransaction) => {
//     setSelectedExpense(expense);
//     setEditFormData({
//       description: expense.description,
//       vendor: expense.vendor === "Unknown" ? "" : expense.vendor,
//       amount: expense.amount,
//       reference: expense.reference,
//     });
//     setShowEditExpense(true);
//   };

//   const openDeleteModal = (expense: ExpenseTransaction) => {
//     setExpenseToDelete(expense);
//     setShowDeleteModal(true);
//   };

//   // ==============================================
//   // Computed Values
//   // ==============================================

//   const getCategoryExpenses = (categoryId: string) =>
//     allExpenses.filter((exp) => exp.categoryId === categoryId);

//   const filteredCategories = allCategories.filter(
//     (cat) =>
//       cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       cat.id.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const categoriesPerPage = 10;
//   const currentCategories = filteredCategories.slice(
//     (categoriesCurrentPage - 1) * categoriesPerPage,
//     categoriesCurrentPage * categoriesPerPage
//   );
//   const totalCategoryPages = Math.ceil(
//     filteredCategories.length / categoriesPerPage
//   );

//   const totalKes =
//     stats.totalKES || allCategories.reduce((sum, cat) => sum + cat.kesTotal, 0);
//   const totalUsd =
//     stats.totalUSD || allCategories.reduce((sum, cat) => sum + cat.usdTotal, 0);

//   const categoryTransactions = selectedCategory
//     ? getCategoryExpenses(selectedCategory.id)
//     : [];
//   const filteredTransactions = categoryTransactions.filter(
//     (txn) =>
//       txn.description.toLowerCase().includes(transactionSearch.toLowerCase()) ||
//       txn.reference.toLowerCase().includes(transactionSearch.toLowerCase())
//   );

//   const transactionsPerPage = 10;
//   const currentTransactions = filteredTransactions.slice(
//     (transactionsCurrentPage - 1) * transactionsPerPage,
//     transactionsCurrentPage * transactionsPerPage
//   );
//   const totalTransactionPages = Math.ceil(
//     filteredTransactions.length / transactionsPerPage
//   );

//   const availableAccounts = getAvailableAccounts();
//   const hasCashAccounts = cashAccounts.some(
//     (acc) => acc.currency === formData.currency && acc.isActive
//   );
//   const hasBankAccounts = bankAccounts.some(
//     (acc) => acc.currency === formData.currency && acc.isActive
//   );
//   const hasMpesaAccounts =
//     formData.currency === 0 && mpesaAgents.some((acc) => acc.isActive);

//   // ==============================================
//   // Loading State
//   // ==============================================

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
//           <p className="text-gray-600">Loading expenses...</p>
//         </div>
//       </div>
//     );
//   }

//   // ==============================================
//   // Render
//   // ==============================================

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       <div className="max-w-[1800px] mx-auto space-y-6">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">
//               Expenses Account
//             </h1>
//             <p className="text-gray-500 text-sm mt-1">
//               Track and manage all business expenses by category
//             </p>
//           </div>
//           <div className="flex gap-3">
//             <button
//               onClick={handleRefresh}
//               className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
//             >
//               <RefreshCw className="w-4 h-4" />
//               Refresh
//             </button>
//             <button
//               onClick={() => setShowAddExpense(true)}
//               className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm font-medium"
//             >
//               <Plus className="w-4 h-4" />
//               Record Expense
//             </button>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           {/* Total KES Expenses */}
//           <div className="bg-white border border-gray-200 p-5">
//             <div className="flex items-center justify-between mb-3">
//               <span className="text-gray-500 text-sm font-medium">
//                 Total KES Expenses
//               </span>
//               <div className="w-10 h-10 bg-orange-100 flex items-center justify-center">
//                 <Receipt className="w-5 h-5 text-orange-600" />
//               </div>
//             </div>
//             <p className="text-2xl font-bold text-gray-900">
//               KES {formatNumber(totalKes)}
//             </p>
//             <p className="text-xs text-gray-500 mt-1">All time total</p>
//           </div>

//           {/* Total USD Expenses */}
//           <div className="bg-white border border-gray-200 p-5">
//             <div className="flex items-center justify-between mb-3">
//               <span className="text-gray-500 text-sm font-medium">
//                 Total USD Expenses
//               </span>
//               <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
//                 <DollarSign className="w-5 h-5 text-blue-600" />
//               </div>
//             </div>
//             <p className="text-2xl font-bold text-gray-900">
//               ${formatNumber(totalUsd)}
//             </p>
//             <p className="text-xs text-gray-500 mt-1">All time total</p>
//           </div>

//           {/* Active Categories */}
//           <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-5 text-white">
//             <div className="flex items-center justify-between mb-3">
//               <span className="text-indigo-200 text-sm font-medium">
//                 Active Categories
//               </span>
//               <div className="w-10 h-10 bg-white/20 flex items-center justify-center">
//                 <Tag className="w-5 h-5 text-white" />
//               </div>
//             </div>
//             <p className="text-2xl font-bold">
//               {stats.activeCategories || allCategories.length}
//             </p>
//             <p className="text-xs text-indigo-200 mt-1">Expense categories</p>
//           </div>

//           {/* Total Expenses Count */}
//           <div className="bg-white border border-gray-200 p-5">
//             <div className="flex items-center justify-between mb-3">
//               <span className="text-gray-500 text-sm font-medium">
//                 Total Expenses
//               </span>
//               <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
//                 <Receipt className="w-5 h-5 text-blue-600" />
//               </div>
//             </div>
//             <p className="text-2xl font-bold text-gray-900">
//               {allExpenses.length}
//             </p>
//             <p className="text-xs text-gray-500 mt-1">Total records</p>
//           </div>
//         </div>

//         {/* Categories Table */}
//         <div className="bg-white border border-gray-200">
//           <div className="p-4 border-b border-gray-200">
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//               <h2 className="text-lg font-semibold text-gray-900">
//                 Expense Categories
//               </h2>
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search categories..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-9 pr-4 py-2 border border-gray-200 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50 border-b border-gray-200">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     ID
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Name
//                   </th>
//                   <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     KES Total
//                   </th>
//                   <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     USD Total
//                   </th>
//                   <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Expenses
//                   </th>
//                   <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {currentCategories.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan={6}
//                       className="px-4 py-12 text-center text-gray-500"
//                     >
//                       No categories found
//                     </td>
//                   </tr>
//                 ) : (
//                   currentCategories.map((cat) => (
//                     <tr
//                       key={cat.id}
//                       className="hover:bg-gray-50 transition-colors"
//                     >
//                       <td className="px-4 py-3">
//                         <span className="text-sm font-mono font-medium text-indigo-600 bg-indigo-50 px-2 py-1">
//                           {cat.id.slice(0, 8).toUpperCase()}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3">
//                         <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-900">
//                           <Tag className="w-4 h-4 text-gray-400" />
//                           {cat.name}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
//                         {cat.kesTotal > 0
//                           ? `KES ${formatNumber(cat.kesTotal)}`
//                           : "-"}
//                       </td>
//                       <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
//                         {cat.usdTotal > 0
//                           ? `$${formatNumber(cat.usdTotal)}`
//                           : "-"}
//                       </td>
//                       <td className="px-4 py-3 text-center">
//                         <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm font-medium">
//                           {cat.transactionCount ||
//                             getCategoryExpenses(cat.id).length}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 text-center">
//                         <button
//                           onClick={() => {
//                             setSelectedCategory(cat);
//                             setTransactionsCurrentPage(1);
//                           }}
//                           className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
//                         >
//                           <Eye className="w-4 h-4" />
//                           View
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {totalCategoryPages > 1 && (
//             <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
//               <p className="text-sm text-gray-500">
//                 Page {categoriesCurrentPage} of {totalCategoryPages}
//               </p>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() =>
//                     setCategoriesCurrentPage((p) => Math.max(1, p - 1))
//                   }
//                   disabled={categoriesCurrentPage === 1}
//                   className="p-2 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//                 >
//                   <ChevronLeft className="w-4 h-4" />
//                 </button>
//                 <button
//                   onClick={() =>
//                     setCategoriesCurrentPage((p) =>
//                       Math.min(totalCategoryPages, p + 1)
//                     )
//                   }
//                   disabled={categoriesCurrentPage === totalCategoryPages}
//                   className="p-2 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//                 >
//                   <ChevronRight className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ==================== CATEGORY DETAIL MODAL ==================== */}
//       <AnimatePresence>
//         {selectedCategory && (
//           <ModalWrapper onClose={() => setSelectedCategory(null)}>
//             <div className="bg-white w-full max-w-4xl max-h-[90vh] flex flex-col">
//               {/* Header */}
//               <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-indigo-600 text-white">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-white/20 flex items-center justify-center">
//                     <Receipt className="w-5 h-5" />
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-semibold">
//                       {selectedCategory.name}
//                     </h3>
//                     <p className="text-indigo-200 text-sm">
//                       {getCategoryExpenses(selectedCategory.id).length} Expense
//                       Records
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setSelectedCategory(null)}
//                   className="p-2 hover:bg-white/10"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               {/* Summary Stats */}
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 border-b border-gray-200">
//                 <div className="bg-white border border-gray-200 p-3">
//                   <p className="text-xs text-gray-500 uppercase font-medium mb-1">
//                     KES Total
//                   </p>
//                   <p className="text-lg font-bold text-gray-900">
//                     KES {formatNumber(selectedCategory.kesTotal)}
//                   </p>
//                 </div>
//                 <div className="bg-white border border-gray-200 p-3">
//                   <p className="text-xs text-gray-500 uppercase font-medium mb-1">
//                     USD Total
//                   </p>
//                   <p className="text-lg font-bold text-gray-900">
//                     ${formatNumber(selectedCategory.usdTotal)}
//                   </p>
//                 </div>
//                 <div className="bg-white border border-gray-200 p-3">
//                   <p className="text-xs text-gray-500 uppercase font-medium mb-1">
//                     Total Count
//                   </p>
//                   <p className="text-lg font-bold text-indigo-600">
//                     {filteredTransactions.length}
//                   </p>
//                 </div>
//                 <div className="bg-indigo-600 p-3 text-white">
//                   <p className="text-xs text-indigo-200 uppercase font-medium mb-1">
//                     Category
//                   </p>
//                   <p className="text-lg font-bold truncate">
//                     {selectedCategory.name}
//                   </p>
//                 </div>
//               </div>

//               {/* Search */}
//               <div className="p-4 border-b border-gray-200">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Search expenses..."
//                     value={transactionSearch}
//                     onChange={(e) => setTransactionSearch(e.target.value)}
//                     className="w-full pl-9 pr-4 py-2 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   />
//                 </div>
//               </div>

//               {/* Transactions Table */}
//               <div className="flex-1 overflow-auto">
//                 {currentTransactions.length === 0 ? (
//                   <div className="p-12 text-center">
//                     <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
//                     <h3 className="text-lg font-semibold text-gray-700 mb-2">
//                       No Expenses Found
//                     </h3>
//                     <p className="text-gray-500">Try adjusting your search</p>
//                   </div>
//                 ) : (
//                   <table className="w-full">
//                     <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
//                       <tr>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                           Reference
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                           Date
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                           Description
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                           Vendor
//                         </th>
//                         <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
//                           Amount
//                         </th>
//                         <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
//                           Actions
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {currentTransactions.map((txn) => (
//                         <tr
//                           key={txn.id}
//                           className="hover:bg-gray-50 transition-colors"
//                         >
//                           <td className="px-4 py-3 text-sm font-medium text-gray-900">
//                             {txn.reference}
//                           </td>
//                           <td className="px-4 py-3 text-sm text-gray-500">
//                             {txn.date}
//                           </td>
//                           <td className="px-4 py-3 text-sm text-gray-900 max-w-[200px] truncate">
//                             {txn.description}
//                           </td>
//                           <td className="px-4 py-3 text-sm text-gray-500">
//                             {txn.vendor !== "Unknown" ? txn.vendor : "-"}
//                           </td>
//                           <td className="px-4 py-3 text-sm text-right font-bold text-gray-900">
//                             {txn.currency} {formatNumber(txn.amount)}
//                           </td>
//                           <td className="px-4 py-3">
//                             <div className="flex items-center justify-center gap-2">
//                               <button
//                                 onClick={() => openEditModal(txn)}
//                                 className="p-1.5 bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
//                                 title="Edit"
//                               >
//                                 <Edit className="w-4 h-4" />
//                               </button>
//                               <button
//                                 onClick={() => openDeleteModal(txn)}
//                                 className="p-1.5 bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
//                                 title="Delete"
//                               >
//                                 <Trash2 className="w-4 h-4" />
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 )}
//               </div>

//               {/* Pagination */}
//               {totalTransactionPages > 1 && (
//                 <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
//                   <p className="text-sm text-gray-500">
//                     Page {transactionsCurrentPage} of {totalTransactionPages} (
//                     {filteredTransactions.length} expenses)
//                   </p>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() =>
//                         setTransactionsCurrentPage((p) => Math.max(1, p - 1))
//                       }
//                       disabled={transactionsCurrentPage === 1}
//                       className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
//                     >
//                       <ChevronLeft className="w-4 h-4" />
//                       Previous
//                     </button>
//                     <button
//                       onClick={() =>
//                         setTransactionsCurrentPage((p) =>
//                           Math.min(totalTransactionPages, p + 1)
//                         )
//                       }
//                       disabled={
//                         transactionsCurrentPage === totalTransactionPages
//                       }
//                       className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
//                     >
//                       Next
//                       <ChevronRight className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Footer */}
//               <div className="flex gap-3 p-4 border-t border-gray-200 bg-gray-50">
//                 <button
//                   onClick={() => toast.success("Exported!")}
//                   className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
//                 >
//                   <Download className="w-4 h-4" />
//                   Download PDF
//                 </button>
//                 <button
//                   onClick={() => toast.success("Printing...")}
//                   className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
//                 >
//                   <Printer className="w-4 h-4" />
//                   Print Statement
//                 </button>
//               </div>
//             </div>
//           </ModalWrapper>
//         )}
//       </AnimatePresence>

//       {/* ==================== ADD EXPENSE MODAL ==================== */}
//       <AnimatePresence>
//         {showAddExpense && (
//           <ModalWrapper onClose={() => setShowAddExpense(false)}>
//             <div className="bg-white w-full max-w-xl max-h-[90vh] flex flex-col">
//               {/* Header */}
//               <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-emerald-600 text-white">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-white/20 flex items-center justify-center">
//                     <Plus className="w-5 h-5" />
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-semibold">
//                       Record New Expense
//                     </h3>
//                     <p className="text-emerald-200 text-sm">
//                       Double-entry accounting applied automatically
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setShowAddExpense(false)}
//                   className="p-2 hover:bg-white/10"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               {/* Form */}
//               <form
//                 onSubmit={handleCreateExpense}
//                 className="flex-1 overflow-auto p-4 space-y-4"
//               >
//                 {/* Category */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Expense Category <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={formData.categoryId}
//                     onChange={(e) =>
//                       setFormData({ ...formData, categoryId: e.target.value })
//                     }
//                     className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   >
//                     <option value="">Select category...</option>
//                     {allCategories.map((cat) => (
//                       <option key={cat.id} value={cat.id}>
//                         {cat.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Description <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.description}
//                     onChange={(e) =>
//                       setFormData({ ...formData, description: e.target.value })
//                     }
//                     className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     placeholder="Enter description"
//                   />
//                 </div>

//                 {/* Amount & Currency */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Amount <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       min="0"
//                       value={formData.amount || ""}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           amount: parseFloat(e.target.value) || 0,
//                         })
//                       }
//                       className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                       placeholder="0.00"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Currency <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       value={formData.currency}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           currency: parseInt(e.target.value),
//                           paymentAccountId: "",
//                           paymentAccountType:
//                             parseInt(e.target.value) === 1 &&
//                             formData.paymentAccountType === 2
//                               ? 0
//                               : formData.paymentAccountType,
//                         })
//                       }
//                       className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     >
//                       <option value={0}>KES - Kenyan Shilling</option>
//                       <option value={1}>USD - US Dollar</option>
//                     </select>
//                   </div>
//                 </div>

//                 {/* Vendor */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Vendor/Payee
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.vendor}
//                     onChange={(e) =>
//                       setFormData({ ...formData, vendor: e.target.value })
//                     }
//                     className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     placeholder="Enter vendor name"
//                   />
//                 </div>

//                 {/* Payment Account Type */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Payment Account Type <span className="text-red-500">*</span>
//                   </label>
//                   <div className="grid grid-cols-3 gap-2">
//                     {[
//                       {
//                         type: 0,
//                         icon: Banknote,
//                         label: "Cash",
//                         disabled: !hasCashAccounts,
//                       },
//                       {
//                         type: 1,
//                         icon: Building2,
//                         label: "Bank",
//                         disabled: !hasBankAccounts,
//                       },
//                       {
//                         type: 2,
//                         icon: Smartphone,
//                         label: "M-Pesa",
//                         disabled: formData.currency === 1 || !hasMpesaAccounts,
//                       },
//                     ].map(({ type, icon: Icon, label, disabled }) => (
//                       <button
//                         key={type}
//                         type="button"
//                         onClick={() =>
//                           setFormData({
//                             ...formData,
//                             paymentAccountType: type,
//                             paymentAccountId: "",
//                             ...(type === 2 ? { currency: 0 } : {}),
//                           })
//                         }
//                         disabled={disabled}
//                         className={`flex flex-col items-center gap-2 p-3 border transition-colors ${
//                           formData.paymentAccountType === type
//                             ? "border-indigo-500 bg-indigo-50 text-indigo-700"
//                             : disabled
//                             ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
//                             : "border-gray-200 text-gray-600 hover:bg-gray-50"
//                         }`}
//                       >
//                         <Icon className="w-5 h-5" />
//                         <span className="text-sm font-medium">{label}</span>
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Select Account */}
//                 {availableAccounts.length > 0 ? (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Select Account <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       value={formData.paymentAccountId}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           paymentAccountId: e.target.value,
//                         })
//                       }
//                       className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     >
//                       <option value="">Select account...</option>
//                       {availableAccounts.map((acc) => (
//                         <option key={acc.id} value={acc.id}>
//                           {acc.name} (Balance:{" "}
//                           {acc.currency === 0 ? "KES" : "$"}{" "}
//                           {formatNumber(acc.balance)})
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200">
//                     <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
//                     <div>
//                       <p className="font-medium text-amber-800">
//                         No Accounts Available
//                       </p>
//                       <p className="text-sm text-amber-700">
//                         Please create an account first.
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {/* Date & Reference */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Expense Date <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="date"
//                       value={formData.expenseDate}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           expenseDate: e.target.value,
//                         })
//                       }
//                       className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Reference
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.reference}
//                       onChange={(e) =>
//                         setFormData({ ...formData, reference: e.target.value })
//                       }
//                       className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                       placeholder="Optional reference"
//                     />
//                   </div>
//                 </div>

//                 {/* Double-Entry Preview */}
//                 <div className="bg-indigo-50 border border-indigo-200 p-4">
//                   <div className="flex items-center gap-2 mb-3">
//                     <Receipt className="w-5 h-5 text-indigo-600" />
//                     <h4 className="font-semibold text-indigo-900">
//                       Double-Entry Preview
//                     </h4>
//                   </div>
//                   <div className="space-y-2">
//                     <div className="flex items-center gap-3 p-3 bg-white border border-indigo-100">
//                       <div className="w-8 h-8 bg-red-100 flex items-center justify-center">
//                         <ArrowUpCircle className="w-4 h-4 text-red-600" />
//                       </div>
//                       <div className="flex-1">
//                         <p className="text-xs text-gray-500">
//                           Debit (Expense ↑)
//                         </p>
//                         <p className="text-sm font-medium text-gray-900">
//                           {allCategories.find(
//                             (c) => c.id === formData.categoryId
//                           )?.name || "Select Category"}
//                         </p>
//                       </div>
//                       <span className="text-sm font-bold text-red-600">
//                         +{formData.currency === 0 ? "KES" : "$"}{" "}
//                         {formatNumber(formData.amount)}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-3 p-3 bg-white border border-indigo-100">
//                       <div className="w-8 h-8 bg-emerald-100 flex items-center justify-center">
//                         <ArrowDownCircle className="w-4 h-4 text-emerald-600" />
//                       </div>
//                       <div className="flex-1">
//                         <p className="text-xs text-gray-500">
//                           Credit (Asset ↓)
//                         </p>
//                         <p className="text-sm font-medium text-gray-900">
//                           {
//                             ["Cash", "Bank", "M-Pesa"][
//                               formData.paymentAccountType
//                             ]
//                           }{" "}
//                           Account
//                         </p>
//                       </div>
//                       <span className="text-sm font-bold text-emerald-600">
//                         -{formData.currency === 0 ? "KES" : "$"}{" "}
//                         {formatNumber(formData.amount)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </form>

//               {/* Footer */}
//               <div className="flex gap-3 p-4 border-t border-gray-200 bg-gray-50">
//                 <button
//                   type="button"
//                   onClick={() => setShowAddExpense(false)}
//                   className="flex-1 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   onClick={handleCreateExpense}
//                   disabled={isSubmitting || !formData.paymentAccountId}
//                   className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                 >
//                   {isSubmitting ? (
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                   ) : (
//                     <CheckCircle className="w-4 h-4" />
//                   )}
//                   {isSubmitting ? "Recording..." : "Record Expense"}
//                 </button>
//               </div>
//             </div>
//           </ModalWrapper>
//         )}
//       </AnimatePresence>

//       {/* ==================== EDIT EXPENSE MODAL ==================== */}
//       <AnimatePresence>
//         {showEditExpense && selectedExpense && (
//           <ModalWrapper onClose={() => setShowEditExpense(false)}>
//             <div className="bg-white w-full max-w-md">
//               {/* Header */}
//               <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-amber-500 text-white">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-white/20 flex items-center justify-center">
//                     <Edit className="w-5 h-5" />
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-semibold">Edit Expense</h3>
//                     <p className="text-amber-100 text-sm">
//                       Reference: {selectedExpense.reference}
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setShowEditExpense(false)}
//                   className="p-2 hover:bg-white/10"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               {/* Form */}
//               <form onSubmit={handleUpdateExpense} className="p-4 space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Description <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={editFormData.description}
//                     onChange={(e) =>
//                       setEditFormData({
//                         ...editFormData,
//                         description: e.target.value,
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Amount <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       min="0"
//                       value={editFormData.amount || ""}
//                       onChange={(e) =>
//                         setEditFormData({
//                           ...editFormData,
//                           amount: parseFloat(e.target.value) || 0,
//                         })
//                       }
//                       className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Currency
//                     </label>
//                     <input
//                       type="text"
//                       value={selectedExpense.currency}
//                       disabled
//                       className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-500"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Vendor/Payee
//                   </label>
//                   <input
//                     type="text"
//                     value={editFormData.vendor}
//                     onChange={(e) =>
//                       setEditFormData({
//                         ...editFormData,
//                         vendor: e.target.value,
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Reference
//                   </label>
//                   <input
//                     type="text"
//                     value={editFormData.reference}
//                     onChange={(e) =>
//                       setEditFormData({
//                         ...editFormData,
//                         reference: e.target.value,
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   />
//                 </div>

//                 {/* Amount Change Warning */}
//                 {editFormData.amount !== selectedExpense.amount && (
//                   <div className="bg-amber-50 border border-amber-200 p-4">
//                     <div className="flex items-start gap-3">
//                       <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
//                       <div className="flex-1">
//                         <p className="font-medium text-amber-800">
//                           Amount Change Detected
//                         </p>
//                         <p className="text-sm text-amber-700 mt-1">
//                           This will adjust the payment account balance.
//                         </p>
//                         <div className="grid grid-cols-3 gap-2 mt-3">
//                           <div className="bg-white p-2 border border-amber-100 text-center">
//                             <p className="text-xs text-gray-500">Original</p>
//                             <p className="font-medium text-gray-700">
//                               {selectedExpense.currency}{" "}
//                               {formatNumber(selectedExpense.amount)}
//                             </p>
//                           </div>
//                           <div className="bg-white p-2 border border-amber-100 text-center">
//                             <p className="text-xs text-gray-500">New</p>
//                             <p className="font-medium text-blue-600">
//                               {selectedExpense.currency}{" "}
//                               {formatNumber(editFormData.amount)}
//                             </p>
//                           </div>
//                           <div className="bg-white p-2 border border-amber-100 text-center">
//                             <p className="text-xs text-gray-500">Difference</p>
//                             <p
//                               className={`font-medium ${
//                                 editFormData.amount > selectedExpense.amount
//                                   ? "text-red-600"
//                                   : "text-emerald-600"
//                               }`}
//                             >
//                               {editFormData.amount > selectedExpense.amount
//                                 ? "+"
//                                 : ""}
//                               {selectedExpense.currency}{" "}
//                               {formatNumber(
//                                 editFormData.amount - selectedExpense.amount
//                               )}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </form>

//               {/* Footer */}
//               <div className="flex gap-3 p-4 border-t border-gray-200 bg-gray-50">
//                 <button
//                   type="button"
//                   onClick={() => setShowEditExpense(false)}
//                   className="flex-1 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   onClick={handleUpdateExpense}
//                   disabled={isSubmitting}
//                   className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
//                 >
//                   {isSubmitting ? (
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                   ) : (
//                     <CheckCircle className="w-4 h-4" />
//                   )}
//                   {isSubmitting ? "Updating..." : "Update Expense"}
//                 </button>
//               </div>
//             </div>
//           </ModalWrapper>
//         )}
//       </AnimatePresence>

//       {/* ==================== DELETE CONFIRMATION MODAL ==================== */}
//       <AnimatePresence>
//         {showDeleteModal && expenseToDelete && (
//           <ModalWrapper onClose={() => setShowDeleteModal(false)}>
//             <div className="bg-white w-full max-w-md">
//               {/* Header */}
//               <div className="p-6 text-center bg-red-600 text-white">
//                 <div className="w-16 h-16 bg-white/20 flex items-center justify-center mx-auto mb-4">
//                   <AlertTriangle className="w-8 h-8" />
//                 </div>
//                 <h3 className="text-xl font-semibold">Delete Expense?</h3>
//                 <p className="text-red-200 text-sm mt-1">
//                   This action cannot be undone
//                 </p>
//               </div>

//               {/* Content */}
//               <div className="p-4 space-y-4">
//                 <div className="bg-gray-50 border border-gray-200 p-4">
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 bg-red-100 flex items-center justify-center flex-shrink-0">
//                       <Receipt className="w-6 h-6 text-red-600" />
//                     </div>
//                     <div className="flex-1">
//                       <p className="font-semibold text-gray-900">
//                         {expenseToDelete.description}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         Reference: {expenseToDelete.reference}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="border-t border-dashed border-gray-200 mt-4 pt-4 flex justify-between items-center">
//                     <span className="text-gray-600">Amount to Restore</span>
//                     <span className="text-xl font-bold text-gray-900">
//                       {expenseToDelete.currency}{" "}
//                       {formatNumber(expenseToDelete.amount)}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="bg-emerald-50 border border-emerald-200 p-4">
//                   <h4 className="font-semibold text-emerald-800 mb-3">
//                     What will happen:
//                   </h4>
//                   <ul className="space-y-2">
//                     {[
//                       "Expense record will be permanently deleted",
//                       "Associated transaction will be reversed",
//                       `${expenseToDelete.currency} ${formatNumber(
//                         expenseToDelete.amount
//                       )} will be restored to the payment account`,
//                     ].map((text, i) => (
//                       <li
//                         key={i}
//                         className="flex items-center gap-2 text-sm text-emerald-700"
//                       >
//                         <CheckCircle className="w-4 h-4 flex-shrink-0" />
//                         {text}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>

//               {/* Footer */}
//               <div className="flex gap-3 p-4 border-t border-gray-200 bg-gray-50">
//                 <button
//                   onClick={() => setShowDeleteModal(false)}
//                   className="flex-1 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleDeleteExpense}
//                   disabled={isDeleting}
//                   className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
//                 >
//                   {isDeleting ? (
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                   ) : (
//                     <Trash2 className="w-4 h-4" />
//                   )}
//                   {isDeleting ? "Deleting..." : "Delete Expense"}
//                 </button>
//               </div>
//             </div>
//           </ModalWrapper>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// export default ExpensesAccount;
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Receipt,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar,
  X,
  Download,
  Printer,
  Eye,
  Tag,
  DollarSign,
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  Edit,
  Trash2,
  Loader2,
  RefreshCw,
  Building2,
  Smartphone,
  Banknote,
  AlertTriangle,
  CheckCircle,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  getExpenseCategories,
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats,
  getCashAccounts,
  getBankAccounts,
  getMpesaAgents,
  ExpenseDto,
  CreateExpenseDto,
  UpdateExpenseDto,
  Currency,
  PaymentMethod,
  AccountType,
  CashAccountDto,
  BankAccountDto,
  MpesaAgentDto,
} from "@/lib/api";

// ==============================================
// Types
// ==============================================

interface ExpenseTransaction {
  id: string;
  code: string;
  date: string;
  description: string;
  categoryId: string;
  categoryName: string;
  currency: "KES" | "USD";
  amount: number;
  reference: string;
  paymentMethod: string;
  vendor: string;
  approvedBy: string;
}

interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
  kesTotal: number;
  usdTotal: number;
  transactionCount: number;
  isActive: boolean;
}

interface ExpenseStats {
  totalKES: number;
  totalUSD: number;
  thisMonthKES: number;
  thisMonthUSD: number;
  activeCategories: number;
}

interface FormData {
  categoryId: string;
  description: string;
  amount: number;
  currency: number;
  vendor: string;
  paymentMethod: number;
  paymentAccountType: number;
  paymentAccountId: string;
  reference: string;
  expenseDate: string;
}

interface EditFormData {
  description: string;
  vendor: string;
  amount: number;
  reference: string;
}

interface AccountOption {
  id: string;
  name: string;
  type: number;
  currency: number;
  balance: number;
}

// ==============================================
// Helper Functions
// ==============================================

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-KE").format(num);
};

const formatCurrency = (amount: number, currency: "KES" | "USD" | number) => {
  const currencyCode =
    typeof currency === "number" ? (currency === 0 ? "KES" : "USD") : currency;
  return `${currencyCode} ${formatNumber(amount)}`;
};

// ==============================================
// Modal Wrapper Component
// ==============================================

function ModalWrapper({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// ==============================================
// Main Component
// ==============================================

export function ExpensesAccount() {
  const [allCategories, setAllCategories] = useState<ExpenseCategory[]>([]);
  const [allExpenses, setAllExpenses] = useState<ExpenseTransaction[]>([]);
  const [stats, setStats] = useState<ExpenseStats>({
    totalKES: 0,
    totalUSD: 0,
    thisMonthKES: 0,
    thisMonthUSD: 0,
    activeCategories: 0,
  });
  const [cashAccounts, setCashAccounts] = useState<CashAccountDto[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccountDto[]>([]);
  const [mpesaAgents, setMpesaAgents] = useState<MpesaAgentDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ExpenseCategory | null>(null);
  const [transactionSearch, setTransactionSearch] = useState("");
  const [categoriesCurrentPage, setCategoriesCurrentPage] = useState(1);
  const [transactionsCurrentPage, setTransactionsCurrentPage] = useState(1);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showEditExpense, setShowEditExpense] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedExpense, setSelectedExpense] =
    useState<ExpenseTransaction | null>(null);
  const [expenseToDelete, setExpenseToDelete] =
    useState<ExpenseTransaction | null>(null);

  const [formData, setFormData] = useState<FormData>({
    categoryId: "",
    description: "",
    amount: 0,
    currency: 0,
    vendor: "",
    paymentMethod: 0,
    paymentAccountType: 0,
    paymentAccountId: "",
    reference: "",
    expenseDate: new Date().toISOString().split("T")[0],
  });

  const [editFormData, setEditFormData] = useState<EditFormData>({
    description: "",
    vendor: "",
    amount: 0,
    reference: "",
  });

  // ==============================================
  // Data Mapping
  // ==============================================

  const mapCategoryDto = (dto: any): ExpenseCategory => ({
    id: dto.id,
    name: dto.name,
    description: dto.description,
    kesTotal: dto.totalKES || 0,
    usdTotal: dto.totalUSD || 0,
    transactionCount: dto.transactionCount || 0,
    isActive: dto.isActive ?? true,
  });

  const mapExpenseDto = (dto: ExpenseDto): ExpenseTransaction => {
    const paymentMethodNames: { [key: number]: string } = {
      0: "Cash",
      1: "Bank Transfer",
      2: "M-Pesa",
      3: "Credit Card",
      4: "Cheque",
    };
    return {
      id: dto.id,
      code: dto.code,
      date: new Date(dto.expenseDate || dto.createdAt).toLocaleString(),
      description: dto.description,
      categoryId: dto.categoryId,
      categoryName: dto.categoryName || "Unknown",
      currency: dto.currency === 0 ? "KES" : "USD",
      amount: dto.amount,
      reference: dto.reference || dto.code,
      paymentMethod: paymentMethodNames[dto.paymentMethod] || "Unknown",
      vendor: dto.vendorPayee || "Unknown",
      approvedBy: dto.createdByName || "System",
    };
  };

  // ==============================================
  // Data Fetching
  // ==============================================

  const fetchCategories = useCallback(async () => {
    try {
      const response = await getExpenseCategories();
      if (response.success && response.data) {
        setAllCategories(response.data.map(mapCategoryDto));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  const fetchExpenses = useCallback(async () => {
    try {
      const response = await getExpenses(1, 1000);
      if (response.success && response.data) {
        const expenses = response.data.items || response.data;
        if (Array.isArray(expenses)) {
          setAllExpenses(expenses.map(mapExpenseDto));
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await getExpenseStats();
      if (response.success && response.data) {
        setStats({
          totalKES: response.data.totalKES || 0,
          totalUSD: response.data.totalUSD || 0,
          thisMonthKES: response.data.thisMonthKES || 0,
          thisMonthUSD: response.data.thisMonthUSD || 0,
          activeCategories: response.data.activeCategories || 0,
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  // FIXED: Handle both array and paginated response structures
  const fetchPaymentAccounts = useCallback(async () => {
    try {
      const [cashRes, bankRes, mpesaRes] = await Promise.all([
        getCashAccounts(),
        getBankAccounts(),
        getMpesaAgents(),
      ]);
      if (cashRes.success && cashRes.data) {
        const cashData = Array.isArray(cashRes.data)
          ? cashRes.data
          : cashRes.data.items || [];
        setCashAccounts(cashData);
      }
      if (bankRes.success && bankRes.data) {
        const bankData = Array.isArray(bankRes.data)
          ? bankRes.data
          : bankRes.data.items || [];
        setBankAccounts(bankData);
      }
      if (mpesaRes.success && mpesaRes.data) {
        const mpesaData = Array.isArray(mpesaRes.data)
          ? mpesaRes.data
          : mpesaRes.data.items || [];
        setMpesaAgents(mpesaData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchCategories(),
        fetchExpenses(),
        fetchStats(),
        fetchPaymentAccounts(),
      ]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchCategories, fetchExpenses, fetchStats, fetchPaymentAccounts]);

  const handleRefresh = async () => {
    setIsLoading(true);
    await Promise.all([
      fetchCategories(),
      fetchExpenses(),
      fetchStats(),
      fetchPaymentAccounts(),
    ]);
    setIsLoading(false);
    toast.success("Data refreshed!");
  };

  // ==============================================
  // Account Helpers - FIXED: Handle missing isActive property
  // ==============================================

  const getAvailableAccounts = useCallback((): AccountOption[] => {
    const accounts: AccountOption[] = [];
    if (formData.paymentAccountType === 0) {
      cashAccounts
        .filter(
          (acc) => acc.currency === formData.currency && acc.isActive !== false
        )
        .forEach((acc) => {
          accounts.push({
            id: acc.id,
            name: `Cash ${acc.currency === 0 ? "KES" : "USD"}`,
            type: 0,
            currency: acc.currency,
            balance: acc.balance,
          });
        });
    }
    if (formData.paymentAccountType === 1) {
      bankAccounts
        .filter(
          (acc) => acc.currency === formData.currency && acc.isActive !== false
        )
        .forEach((acc) => {
          accounts.push({
            id: acc.id,
            name: `${acc.bankName} - ${acc.accountNumber}`,
            type: 1,
            currency: acc.currency,
            balance: acc.balance,
          });
        });
    }
    if (formData.paymentAccountType === 2 && formData.currency === 0) {
      mpesaAgents
        .filter((acc) => acc.isActive !== false)
        .forEach((acc) => {
          accounts.push({
            id: acc.id,
            name: `${acc.agentName} - ${acc.agentNumber}`,
            type: 2,
            currency: 0,
            balance: acc.balance,
          });
        });
    }
    return accounts;
  }, [
    formData.paymentAccountType,
    formData.currency,
    cashAccounts,
    bankAccounts,
    mpesaAgents,
  ]);

  useEffect(() => {
    const accounts = getAvailableAccounts();
    if (accounts.length > 0) {
      const valid = accounts.some(
        (acc) => acc.id === formData.paymentAccountId
      );
      if (!formData.paymentAccountId || !valid) {
        setFormData((prev) => ({ ...prev, paymentAccountId: accounts[0].id }));
      }
    } else {
      setFormData((prev) => ({ ...prev, paymentAccountId: "" }));
    }
  }, [formData.paymentAccountType, formData.currency, getAvailableAccounts]);

  // ==============================================
  // CRUD Handlers
  // ==============================================

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.categoryId ||
      !formData.description.trim() ||
      formData.amount <= 0 ||
      !formData.paymentAccountId
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const createDto: CreateExpenseDto = {
        categoryId: formData.categoryId,
        description: formData.description.trim(),
        vendorPayee: formData.vendor.trim() || undefined,
        amount: formData.amount,
        currency: formData.currency as Currency,
        paymentMethod: formData.paymentMethod as PaymentMethod,
        paymentAccountType: formData.paymentAccountType as AccountType,
        paymentAccountId: formData.paymentAccountId,
        reference: formData.reference.trim() || undefined,
        expenseDate: new Date(
          formData.expenseDate + "T12:00:00Z"
        ).toISOString(),
      };
      const response = await createExpense(createDto);
      if (response.success) {
        toast.success("Expense recorded successfully!");
        setShowAddExpense(false);
        setFormData({
          categoryId: "",
          description: "",
          amount: 0,
          currency: 0,
          vendor: "",
          paymentMethod: 0,
          paymentAccountType: 0,
          paymentAccountId: "",
          reference: "",
          expenseDate: new Date().toISOString().split("T")[0],
        });
        await Promise.all([
          fetchCategories(),
          fetchExpenses(),
          fetchStats(),
          fetchPaymentAccounts(),
        ]);
      } else {
        toast.error(response.message || "Failed to create expense");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to create expense");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !selectedExpense ||
      !editFormData.description.trim() ||
      editFormData.amount <= 0
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const updateDto: UpdateExpenseDto = {
        description: editFormData.description.trim(),
        vendorPayee: editFormData.vendor.trim() || undefined,
        amount: editFormData.amount,
        reference: editFormData.reference.trim() || undefined,
      };
      const response = await updateExpense(selectedExpense.id, updateDto);
      if (response.success) {
        toast.success("Expense updated successfully!");
        setShowEditExpense(false);
        setSelectedExpense(null);
        await Promise.all([
          fetchCategories(),
          fetchExpenses(),
          fetchStats(),
          fetchPaymentAccounts(),
        ]);
      } else {
        toast.error(response.message || "Failed to update expense");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to update expense");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExpense = async () => {
    if (!expenseToDelete) return;
    setIsDeleting(true);
    try {
      const response = await deleteExpense(expenseToDelete.id);
      if (response.success) {
        toast.success(
          `Expense deleted! ${
            expenseToDelete.currency
          } ${expenseToDelete.amount.toLocaleString()} restored.`
        );
        setShowDeleteModal(false);
        setExpenseToDelete(null);
        await Promise.all([
          fetchCategories(),
          fetchExpenses(),
          fetchStats(),
          fetchPaymentAccounts(),
        ]);
      } else {
        toast.error(response.message || "Failed to delete expense");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete expense");
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditModal = (expense: ExpenseTransaction) => {
    setSelectedExpense(expense);
    setEditFormData({
      description: expense.description,
      vendor: expense.vendor === "Unknown" ? "" : expense.vendor,
      amount: expense.amount,
      reference: expense.reference,
    });
    setShowEditExpense(true);
  };

  const openDeleteModal = (expense: ExpenseTransaction) => {
    setExpenseToDelete(expense);
    setShowDeleteModal(true);
  };

  // ==============================================
  // Computed Values - FIXED: Handle missing isActive property
  // ==============================================

  const getCategoryExpenses = (categoryId: string) =>
    allExpenses.filter((exp) => exp.categoryId === categoryId);

  const filteredCategories = allCategories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categoriesPerPage = 10;
  const currentCategories = filteredCategories.slice(
    (categoriesCurrentPage - 1) * categoriesPerPage,
    categoriesCurrentPage * categoriesPerPage
  );
  const totalCategoryPages = Math.ceil(
    filteredCategories.length / categoriesPerPage
  );

  const totalKes =
    stats.totalKES || allCategories.reduce((sum, cat) => sum + cat.kesTotal, 0);
  const totalUsd =
    stats.totalUSD || allCategories.reduce((sum, cat) => sum + cat.usdTotal, 0);

  const categoryTransactions = selectedCategory
    ? getCategoryExpenses(selectedCategory.id)
    : [];
  const filteredTransactions = categoryTransactions.filter(
    (txn) =>
      txn.description.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      txn.reference.toLowerCase().includes(transactionSearch.toLowerCase())
  );

  const transactionsPerPage = 10;
  const currentTransactions = filteredTransactions.slice(
    (transactionsCurrentPage - 1) * transactionsPerPage,
    transactionsCurrentPage * transactionsPerPage
  );
  const totalTransactionPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
  );

  const availableAccounts = getAvailableAccounts();

  // FIXED: Use !== false to handle undefined isActive (default to true)
  const hasCashAccounts = cashAccounts.some(
    (acc) => acc.currency === formData.currency && acc.isActive !== false
  );
  const hasBankAccounts = bankAccounts.some(
    (acc) => acc.currency === formData.currency && acc.isActive !== false
  );
  const hasMpesaAccounts =
    formData.currency === 0 &&
    mpesaAgents.some((acc) => acc.isActive !== false);

  // ==============================================
  // Loading State
  // ==============================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading expenses...</p>
        </div>
      </div>
    );
  }

  // ==============================================
  // Render
  // ==============================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Expenses Account
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Track and manage all business expenses by category
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={() => setShowAddExpense(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Record Expense
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total KES Expenses */}
          <div className="bg-white border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-500 text-sm font-medium">
                Total KES Expenses
              </span>
              <div className="w-10 h-10 bg-orange-100 flex items-center justify-center">
                <Receipt className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              KES {formatNumber(totalKes)}
            </p>
            <p className="text-xs text-gray-500 mt-1">All time total</p>
          </div>

          {/* Total USD Expenses */}
          <div className="bg-white border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-500 text-sm font-medium">
                Total USD Expenses
              </span>
              <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${formatNumber(totalUsd)}
            </p>
            <p className="text-xs text-gray-500 mt-1">All time total</p>
          </div>

          {/* Active Categories */}
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-5 text-white">
            <div className="flex items-center justify-between mb-3">
              <span className="text-indigo-200 text-sm font-medium">
                Active Categories
              </span>
              <div className="w-10 h-10 bg-white/20 flex items-center justify-center">
                <Tag className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold">
              {stats.activeCategories || allCategories.length}
            </p>
            <p className="text-xs text-indigo-200 mt-1">Expense categories</p>
          </div>

          {/* Total Expenses Count */}
          <div className="bg-white border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-500 text-sm font-medium">
                Total Expenses
              </span>
              <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                <Receipt className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {allExpenses.length}
            </p>
            <p className="text-xs text-gray-500 mt-1">Total records</p>
          </div>
        </div>

        {/* Categories Table */}
        <div className="bg-white border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Expense Categories
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    KES Total
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    USD Total
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expenses
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentCategories.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-12 text-center text-gray-500"
                    >
                      No categories found
                    </td>
                  </tr>
                ) : (
                  currentCategories.map((cat) => (
                    <tr
                      key={cat.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="text-sm font-mono font-medium text-indigo-600 bg-indigo-50 px-2 py-1">
                          {cat.id.slice(0, 8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-900">
                          <Tag className="w-4 h-4 text-gray-400" />
                          {cat.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                        {cat.kesTotal > 0
                          ? `KES ${formatNumber(cat.kesTotal)}`
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                        {cat.usdTotal > 0
                          ? `$${formatNumber(cat.usdTotal)}`
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm font-medium">
                          {cat.transactionCount ||
                            getCategoryExpenses(cat.id).length}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => {
                            setSelectedCategory(cat);
                            setTransactionsCurrentPage(1);
                          }}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalCategoryPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Page {categoriesCurrentPage} of {totalCategoryPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCategoriesCurrentPage((p) => Math.max(1, p - 1))
                  }
                  disabled={categoriesCurrentPage === 1}
                  className="p-2 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setCategoriesCurrentPage((p) =>
                      Math.min(totalCategoryPages, p + 1)
                    )
                  }
                  disabled={categoriesCurrentPage === totalCategoryPages}
                  className="p-2 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==================== CATEGORY DETAIL MODAL ==================== */}
      <AnimatePresence>
        {selectedCategory && (
          <ModalWrapper onClose={() => setSelectedCategory(null)}>
            <div className="bg-white w-full max-w-4xl max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-indigo-600 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 flex items-center justify-center">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {selectedCategory.name}
                    </h3>
                    <p className="text-indigo-200 text-sm">
                      {getCategoryExpenses(selectedCategory.id).length} Expense
                      Records
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="p-2 hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 border-b border-gray-200">
                <div className="bg-white border border-gray-200 p-3">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                    KES Total
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    KES {formatNumber(selectedCategory.kesTotal)}
                  </p>
                </div>
                <div className="bg-white border border-gray-200 p-3">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                    USD Total
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    ${formatNumber(selectedCategory.usdTotal)}
                  </p>
                </div>
                <div className="bg-white border border-gray-200 p-3">
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                    Total Count
                  </p>
                  <p className="text-lg font-bold text-indigo-600">
                    {filteredTransactions.length}
                  </p>
                </div>
                <div className="bg-indigo-600 p-3 text-white">
                  <p className="text-xs text-indigo-200 uppercase font-medium mb-1">
                    Category
                  </p>
                  <p className="text-lg font-bold truncate">
                    {selectedCategory.name}
                  </p>
                </div>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search expenses..."
                    value={transactionSearch}
                    onChange={(e) => setTransactionSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Transactions Table */}
              <div className="flex-1 overflow-auto">
                {currentTransactions.length === 0 ? (
                  <div className="p-12 text-center">
                    <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      No Expenses Found
                    </h3>
                    <p className="text-gray-500">Try adjusting your search</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Reference
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Description
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Vendor
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentTransactions.map((txn) => (
                        <tr
                          key={txn.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {txn.reference}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {txn.date}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 max-w-[200px] truncate">
                            {txn.description}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {txn.vendor !== "Unknown" ? txn.vendor : "-"}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-bold text-gray-900">
                            {txn.currency} {formatNumber(txn.amount)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openEditModal(txn)}
                                className="p-1.5 bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openDeleteModal(txn)}
                                className="p-1.5 bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination */}
              {totalTransactionPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Page {transactionsCurrentPage} of {totalTransactionPages} (
                    {filteredTransactions.length} expenses)
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setTransactionsCurrentPage((p) => Math.max(1, p - 1))
                      }
                      disabled={transactionsCurrentPage === 1}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setTransactionsCurrentPage((p) =>
                          Math.min(totalTransactionPages, p + 1)
                        )
                      }
                      disabled={
                        transactionsCurrentPage === totalTransactionPages
                      }
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex gap-3 p-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => toast.success("Exported!")}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button
                  onClick={() => toast.success("Printing...")}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Print Statement
                </button>
              </div>
            </div>
          </ModalWrapper>
        )}
      </AnimatePresence>

      {/* ==================== ADD EXPENSE MODAL ==================== */}
      <AnimatePresence>
        {showAddExpense && (
          <ModalWrapper onClose={() => setShowAddExpense(false)}>
            <div className="bg-white w-full max-w-xl max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-emerald-600 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Record New Expense
                    </h3>
                    <p className="text-emerald-200 text-sm">
                      Double-entry accounting applied automatically
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddExpense(false)}
                  className="p-2 hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={handleCreateExpense}
                className="flex-1 overflow-auto p-4 space-y-4"
              >
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expense Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select category...</option>
                    {allCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter description"
                  />
                </div>

                {/* Amount & Currency */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.amount || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          amount: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          currency: parseInt(e.target.value),
                          paymentAccountId: "",
                          paymentAccountType:
                            parseInt(e.target.value) === 1 &&
                            formData.paymentAccountType === 2
                              ? 0
                              : formData.paymentAccountType,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value={0}>KES - Kenyan Shilling</option>
                      <option value={1}>USD - US Dollar</option>
                    </select>
                  </div>
                </div>

                {/* Vendor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vendor/Payee
                  </label>
                  <input
                    type="text"
                    value={formData.vendor}
                    onChange={(e) =>
                      setFormData({ ...formData, vendor: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter vendor name"
                  />
                </div>

                {/* Payment Account Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Account Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        type: 0,
                        icon: Banknote,
                        label: "Cash",
                        disabled: !hasCashAccounts,
                      },
                      {
                        type: 1,
                        icon: Building2,
                        label: "Bank",
                        disabled: !hasBankAccounts,
                      },
                      {
                        type: 2,
                        icon: Smartphone,
                        label: "M-Pesa",
                        disabled: formData.currency === 1 || !hasMpesaAccounts,
                      },
                    ].map(({ type, icon: Icon, label, disabled }) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            paymentAccountType: type,
                            paymentAccountId: "",
                            ...(type === 2 ? { currency: 0 } : {}),
                          })
                        }
                        disabled={disabled}
                        className={`flex flex-col items-center gap-2 p-3 border transition-colors ${
                          formData.paymentAccountType === type
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                            : disabled
                            ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Select Account */}
                {availableAccounts.length > 0 ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Account <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.paymentAccountId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentAccountId: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select account...</option>
                      {availableAccounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.name} (Balance:{" "}
                          {acc.currency === 0 ? "KES" : "$"}{" "}
                          {formatNumber(acc.balance)})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-amber-800">
                        No Accounts Available
                      </p>
                      <p className="text-sm text-amber-700">
                        Please create an account first.
                      </p>
                    </div>
                  </div>
                )}

                {/* Date & Reference */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expense Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.expenseDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          expenseDate: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reference
                    </label>
                    <input
                      type="text"
                      value={formData.reference}
                      onChange={(e) =>
                        setFormData({ ...formData, reference: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Optional reference"
                    />
                  </div>
                </div>

                {/* Double-Entry Preview */}
                <div className="bg-indigo-50 border border-indigo-200 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Receipt className="w-5 h-5 text-indigo-600" />
                    <h4 className="font-semibold text-indigo-900">
                      Double-Entry Preview
                    </h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-white border border-indigo-100">
                      <div className="w-8 h-8 bg-red-100 flex items-center justify-center">
                        <ArrowUpCircle className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">
                          Debit (Expense ↑)
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {allCategories.find(
                            (c) => c.id === formData.categoryId
                          )?.name || "Select Category"}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-red-600">
                        +{formData.currency === 0 ? "KES" : "$"}{" "}
                        {formatNumber(formData.amount)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white border border-indigo-100">
                      <div className="w-8 h-8 bg-emerald-100 flex items-center justify-center">
                        <ArrowDownCircle className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">
                          Credit (Asset ↓)
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {
                            ["Cash", "Bank", "M-Pesa"][
                              formData.paymentAccountType
                            ]
                          }{" "}
                          Account
                        </p>
                      </div>
                      <span className="text-sm font-bold text-emerald-600">
                        -{formData.currency === 0 ? "KES" : "$"}{" "}
                        {formatNumber(formData.amount)}
                      </span>
                    </div>
                  </div>
                </div>
              </form>

              {/* Footer */}
              <div className="flex gap-3 p-4 border-t border-gray-200 bg-gray-50">
                <button
                  type="button"
                  onClick={() => setShowAddExpense(false)}
                  className="flex-1 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleCreateExpense}
                  disabled={isSubmitting || !formData.paymentAccountId}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {isSubmitting ? "Recording..." : "Record Expense"}
                </button>
              </div>
            </div>
          </ModalWrapper>
        )}
      </AnimatePresence>

      {/* ==================== EDIT EXPENSE MODAL ==================== */}
      <AnimatePresence>
        {showEditExpense && selectedExpense && (
          <ModalWrapper onClose={() => setShowEditExpense(false)}>
            <div className="bg-white w-full max-w-md">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-amber-500 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 flex items-center justify-center">
                    <Edit className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Edit Expense</h3>
                    <p className="text-amber-100 text-sm">
                      Reference: {selectedExpense.reference}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEditExpense(false)}
                  className="p-2 hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleUpdateExpense} className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editFormData.description}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editFormData.amount || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          amount: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <input
                      type="text"
                      value={selectedExpense.currency}
                      disabled
                      className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vendor/Payee
                  </label>
                  <input
                    type="text"
                    value={editFormData.vendor}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        vendor: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reference
                  </label>
                  <input
                    type="text"
                    value={editFormData.reference}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        reference: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Amount Change Warning */}
                {editFormData.amount !== selectedExpense.amount && (
                  <div className="bg-amber-50 border border-amber-200 p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-amber-800">
                          Amount Change Detected
                        </p>
                        <p className="text-sm text-amber-700 mt-1">
                          This will adjust the payment account balance.
                        </p>
                        <div className="grid grid-cols-3 gap-2 mt-3">
                          <div className="bg-white p-2 border border-amber-100 text-center">
                            <p className="text-xs text-gray-500">Original</p>
                            <p className="font-medium text-gray-700">
                              {selectedExpense.currency}{" "}
                              {formatNumber(selectedExpense.amount)}
                            </p>
                          </div>
                          <div className="bg-white p-2 border border-amber-100 text-center">
                            <p className="text-xs text-gray-500">New</p>
                            <p className="font-medium text-blue-600">
                              {selectedExpense.currency}{" "}
                              {formatNumber(editFormData.amount)}
                            </p>
                          </div>
                          <div className="bg-white p-2 border border-amber-100 text-center">
                            <p className="text-xs text-gray-500">Difference</p>
                            <p
                              className={`font-medium ${
                                editFormData.amount > selectedExpense.amount
                                  ? "text-red-600"
                                  : "text-emerald-600"
                              }`}
                            >
                              {editFormData.amount > selectedExpense.amount
                                ? "+"
                                : ""}
                              {selectedExpense.currency}{" "}
                              {formatNumber(
                                editFormData.amount - selectedExpense.amount
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </form>

              {/* Footer */}
              <div className="flex gap-3 p-4 border-t border-gray-200 bg-gray-50">
                <button
                  type="button"
                  onClick={() => setShowEditExpense(false)}
                  className="flex-1 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleUpdateExpense}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {isSubmitting ? "Updating..." : "Update Expense"}
                </button>
              </div>
            </div>
          </ModalWrapper>
        )}
      </AnimatePresence>

      {/* ==================== DELETE CONFIRMATION MODAL ==================== */}
      <AnimatePresence>
        {showDeleteModal && expenseToDelete && (
          <ModalWrapper onClose={() => setShowDeleteModal(false)}>
            <div className="bg-white w-full max-w-md">
              {/* Header */}
              <div className="p-6 text-center bg-red-600 text-white">
                <div className="w-16 h-16 bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold">Delete Expense?</h3>
                <p className="text-red-200 text-sm mt-1">
                  This action cannot be undone
                </p>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                <div className="bg-gray-50 border border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 flex items-center justify-center flex-shrink-0">
                      <Receipt className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {expenseToDelete.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        Reference: {expenseToDelete.reference}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-dashed border-gray-200 mt-4 pt-4 flex justify-between items-center">
                    <span className="text-gray-600">Amount to Restore</span>
                    <span className="text-xl font-bold text-gray-900">
                      {expenseToDelete.currency}{" "}
                      {formatNumber(expenseToDelete.amount)}
                    </span>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-4">
                  <h4 className="font-semibold text-emerald-800 mb-3">
                    What will happen:
                  </h4>
                  <ul className="space-y-2">
                    {[
                      "Expense record will be permanently deleted",
                      "Associated transaction will be reversed",
                      `${expenseToDelete.currency} ${formatNumber(
                        expenseToDelete.amount
                      )} will be restored to the payment account`,
                    ].map((text, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-emerald-700"
                      >
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteExpense}
                  disabled={isDeleting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  {isDeleting ? "Deleting..." : "Delete Expense"}
                </button>
              </div>
            </div>
          </ModalWrapper>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ExpensesAccount;
