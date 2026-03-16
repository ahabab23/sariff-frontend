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
  Plus,
  Edit3,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Banknote,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  getCashAccounts,
  getCashAccountStatement,
  getCashStats,
  createCashAccount,
  updateCashAccount,
  deleteCashAccount,
  CashAccountResponseDto,
  CreateCashAccountDto,
  UpdateCashAccountDto,
  Currency,
  getAccountTypeLabel,
} from "@/lib/api";

// Transaction interface to match backend StatementLineDto
interface Transaction {
  id: string;
  code: string;
  date: string;
  reference: string;
  description: string;
  transactionType: number;
  thisAccountAction: string;
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

// CashStats interface to match backend CashStatsDto
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

// CashAccount interface to match backend CashAccountResponseDto
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

// Modal types
type ModalType = "add" | "edit" | "delete" | "view" | null;

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // UI states
  const [searchTerm, setSearchTerm] = useState("");
  const [transactionsCurrentPage, setTransactionsCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  // Modal states
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedAccount, setSelectedAccount] = useState<CashAccount | null>(
    null
  );

  // Form states
  const [formData, setFormData] = useState({
    currency: 0 as Currency,
    openingBalance: 0,
  });

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
      const kesResponse = await getCashAccountStatement(0);
      const usdResponse = await getCashAccountStatement(1);

      const transactions: Transaction[] = [];

      if (kesResponse.success && kesResponse.data?.transactions) {
        const kesTxns = kesResponse.data.transactions.map((txn: any) =>
          mapTransactionToDisplay(txn, 0)
        );
        transactions.push(...kesTxns);
      }

      if (usdResponse.success && usdResponse.data?.transactions) {
        const usdTxns = usdResponse.data.transactions.map((txn: any) =>
          mapTransactionToDisplay(txn, 1)
        );
        transactions.push(...usdTxns);
      }

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

  // Check if currency account exists
  const hasKESAccount = cashAccounts.some((a) => a.currency === 0);
  const hasUSDAccount = cashAccounts.some((a) => a.currency === 1);

  // Modal handlers
  const openAddModal = () => {
    setFormData({
      currency: hasKESAccount ? 1 : 0, // Default to missing currency
      openingBalance: 0,
    });
    setSelectedAccount(null);
    setModalType("add");
  };

  const openEditModal = (account: CashAccount) => {
    setSelectedAccount(account);
    setFormData({
      currency: account.currency,
      openingBalance: account.openingBalance,
    });
    setModalType("edit");
  };

  const openDeleteModal = (account: CashAccount) => {
    setSelectedAccount(account);
    setModalType("delete");
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedAccount(null);
    setFormData({ currency: 0, openingBalance: 0 });
  };

  // Form handlers
  const handleCreateAccount = async () => {
    if (formData.openingBalance < 0) {
      toast.error("Opening balance cannot be negative");
      return;
    }

    setIsSubmitting(true);
    try {
      const dto: CreateCashAccountDto = {
        currency: formData.currency,
        openingBalance: formData.openingBalance,
      };

      const response = await createCashAccount(dto);
      if (response.success) {
        toast.success(
          `Cash account for ${getCurrencyName(
            formData.currency
          )} created successfully!`
        );
        closeModal();
        await Promise.all([fetchCashAccounts(), fetchStats()]);
      } else {
        toast.error(response.message || "Failed to create cash account");
      }
    } catch (error) {
      console.error("Error creating cash account:", error);
      toast.error("Failed to create cash account");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateAccount = async () => {
    if (!selectedAccount) return;

    if (formData.openingBalance < 0) {
      toast.error("Opening balance cannot be negative");
      return;
    }

    setIsSubmitting(true);
    try {
      const dto: UpdateCashAccountDto = {
        openingBalance: formData.openingBalance,
      };

      const response = await updateCashAccount(selectedAccount.id, dto);
      if (response.success) {
        toast.success("Cash account updated successfully!");
        closeModal();
        await Promise.all([
          fetchCashAccounts(),
          fetchStats(),
          fetchTransactions(),
        ]);
      } else {
        toast.error(response.message || "Failed to update cash account");
      }
    } catch (error) {
      console.error("Error updating cash account:", error);
      toast.error("Failed to update cash account");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!selectedAccount) return;

    setIsSubmitting(true);
    try {
      const response = await deleteCashAccount(selectedAccount.id);
      if (response.success) {
        toast.success("Cash account deleted successfully!");
        closeModal();
        await Promise.all([
          fetchCashAccounts(),
          fetchStats(),
          fetchTransactions(),
        ]);
      } else {
        toast.error(response.message || "Failed to delete cash account");
      }
    } catch (error) {
      console.error("Error deleting cash account:", error);
      toast.error("Failed to delete cash account");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Apply filters
  const filteredTransactions = allTransactions.filter((txn) => {
    const matchesSearch =
      txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.code.toLowerCase().includes(searchTerm.toLowerCase());

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
          <div className="flex flex-wrap gap-3">
            <button
              onClick={openAddModal}
              disabled={hasKESAccount && hasUSDAccount}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
              Add Account
            </button>
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

        {/* Cash Account Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {cashAccounts.map((account, index) => (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white border-2 shadow-lg hover:shadow-xl transition-all duration-300 ${
                account.currency === 0
                  ? "border-emerald-200 hover:border-emerald-400"
                  : "border-blue-200 hover:border-blue-400"
              }`}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 flex items-center justify-center border-2 ${
                        account.currency === 0
                          ? "bg-emerald-100 border-emerald-200"
                          : "bg-blue-100 border-blue-200"
                      }`}
                    >
                      <Banknote
                        className={`w-6 h-6 ${
                          account.currency === 0
                            ? "text-emerald-600"
                            : "text-blue-600"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Cash {getCurrencyName(account.currency)}
                      </h3>
                      <p className="text-xs text-slate-500">
                        CASH-{getCurrencyName(account.currency)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(account)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4 text-slate-600" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(account)}
                      className="p-2 bg-red-50 hover:bg-red-100 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Balance */}
                <div
                  className={`p-4 mb-4 border-l-4 ${
                    account.currency === 0
                      ? "bg-emerald-50 border-emerald-500"
                      : "bg-blue-50 border-blue-500"
                  }`}
                >
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">
                    Current Balance
                  </p>
                  <p
                    className={`text-3xl font-bold ${
                      account.currency === 0
                        ? "text-emerald-600"
                        : "text-blue-600"
                    }`}
                  >
                    {getCurrencySymbol(account.currency)}{" "}
                    {account.balance.toLocaleString()}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 border border-slate-200">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">
                      Opening Balance
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {getCurrencySymbol(account.currency)}{" "}
                      {account.openingBalance.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 border border-slate-200">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">
                      Net Movement
                    </p>
                    <p
                      className={`text-sm font-bold ${
                        account.netMovement >= 0
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {account.netMovement >= 0 ? "+" : ""}
                      {getCurrencySymbol(account.currency)}{" "}
                      {account.netMovement.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-emerald-50 p-3 border border-emerald-200">
                    <p className="text-[10px] text-emerald-700 uppercase font-bold">
                      Total Debit (In)
                    </p>
                    <p className="text-sm font-bold text-emerald-600">
                      +{getCurrencySymbol(account.currency)}{" "}
                      {account.totalDebit.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-red-50 p-3 border border-red-200">
                    <p className="text-[10px] text-red-700 uppercase font-bold">
                      Total Credit (Out)
                    </p>
                    <p className="text-sm font-bold text-red-600">
                      -{getCurrencySymbol(account.currency)}{" "}
                      {account.totalCredit.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    Created: {new Date(account.createdAt).toLocaleDateString()}
                  </span>
                  <span
                    className={`px-2 py-1 font-bold ${
                      account.currency === 0
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {getCurrencyName(account.currency)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Empty State - Show when no accounts exist */}
          {cashAccounts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full bg-white border-2 border-dashed border-slate-300 p-12 text-center"
            >
              <Wallet className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-700 mb-2">
                No Cash Accounts
              </h3>
              <p className="text-slate-500 mb-6">
                Create your first cash account to start tracking physical cash.
              </p>
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Cash Account
              </button>
            </motion.div>
          )}

          {/* Prompt to add missing currency */}
          {cashAccounts.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-dashed border-slate-300 p-8 flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 bg-slate-200 flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">
                Add {hasKESAccount ? "USD" : "KES"} Cash Account
              </h3>
              <p className="text-sm text-slate-500 mb-4 text-center">
                Track your {hasKESAccount ? "USD" : "KES"} cash separately
              </p>
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Account
              </button>
            </motion.div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Debit */}
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

              <div className="mb-3">
                <p className="text-3xl font-bold text-emerald-600 tracking-tight mb-1">
                  KES {stats.totalDebitKES.toLocaleString()}
                </p>
              </div>

              <div className="pt-3 border-t-2 border-slate-100">
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

          {/* Total Credit */}
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

              <div className="mb-3">
                <p className="text-3xl font-bold text-red-600 tracking-tight mb-1">
                  KES {stats.totalCreditKES.toLocaleString()}
                </p>
              </div>

              <div className="pt-3 border-t-2 border-slate-100">
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

          {/* Net Movement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="relative bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 text-white shadow-xl shadow-blue-500/20 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300"
          >
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

              <div className="mb-3">
                <p className="text-3xl font-bold tracking-tight mb-1">
                  {stats.netMovementKES >= 0 ? "+" : ""}KES{" "}
                  {stats.netMovementKES.toLocaleString()}
                </p>
              </div>

              <div className="pt-3 border-t border-white/20">
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
              Transaction Filters
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                      <ChevronLeft className="w-4 h-4 text-slate-600" />
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
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>

      {/* ==================== MODALS ==================== */}

      {/* Add Cash Account Modal */}
      <AnimatePresence>
        {modalType === "add" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Add Cash Account</h3>
                      <p className="text-xs opacity-80">
                        Create a new cash drawer
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                {/* Currency Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                    Currency *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, currency: 0 })}
                      disabled={hasKESAccount}
                      className={`p-4 border-2 transition-all ${
                        formData.currency === 0
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-slate-200 hover:border-emerald-300"
                      } ${
                        hasKESAccount ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <Banknote
                        className={`w-6 h-6 mx-auto mb-2 ${
                          formData.currency === 0
                            ? "text-emerald-600"
                            : "text-slate-400"
                        }`}
                      />
                      <p
                        className={`text-sm font-bold ${
                          formData.currency === 0
                            ? "text-emerald-700"
                            : "text-slate-700"
                        }`}
                      >
                        KES
                      </p>
                      <p className="text-xs text-slate-500">Kenyan Shilling</p>
                      {hasKESAccount && (
                        <p className="text-[10px] text-amber-600 mt-1">
                          Already exists
                        </p>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, currency: 1 })}
                      disabled={hasUSDAccount}
                      className={`p-4 border-2 transition-all ${
                        formData.currency === 1
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:border-blue-300"
                      } ${
                        hasUSDAccount ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <DollarSign
                        className={`w-6 h-6 mx-auto mb-2 ${
                          formData.currency === 1
                            ? "text-blue-600"
                            : "text-slate-400"
                        }`}
                      />
                      <p
                        className={`text-sm font-bold ${
                          formData.currency === 1
                            ? "text-blue-700"
                            : "text-slate-700"
                        }`}
                      >
                        USD
                      </p>
                      <p className="text-xs text-slate-500">US Dollar</p>
                      {hasUSDAccount && (
                        <p className="text-[10px] text-amber-600 mt-1">
                          Already exists
                        </p>
                      )}
                    </button>
                  </div>
                </div>

                {/* Opening Balance */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                    Opening Balance *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">
                      {formData.currency === 0 ? "KES" : "$"}
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.openingBalance}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          openingBalance: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full pl-14 pr-4 py-3 border-2 border-slate-200 focus:border-indigo-500 focus:outline-none text-lg font-bold"
                      placeholder="0.00"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter the starting cash amount in the drawer
                  </p>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 p-4">
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">What happens next?</p>
                      <p className="text-xs">
                        The cash account will be created with the opening
                        balance you specify. All transactions will be tracked
                        from this starting point.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-slate-200 bg-slate-50 p-4 flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAccount}
                  disabled={
                    isSubmitting ||
                    (hasKESAccount && formData.currency === 0) ||
                    (hasUSDAccount && formData.currency === 1)
                  }
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Account
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Cash Account Modal */}
      <AnimatePresence>
        {modalType === "edit" && selectedAccount && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div
                className={`p-4 text-white ${
                  selectedAccount.currency === 0
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600"
                    : "bg-gradient-to-r from-blue-600 to-cyan-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Edit3 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Edit Cash Account</h3>
                      <p className="text-xs opacity-80">
                        Cash {getCurrencyName(selectedAccount.currency)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                {/* Current Balance Display */}
                <div
                  className={`p-4 border-l-4 ${
                    selectedAccount.currency === 0
                      ? "bg-emerald-50 border-emerald-500"
                      : "bg-blue-50 border-blue-500"
                  }`}
                >
                  <p className="text-xs text-slate-500 uppercase font-bold">
                    Current Balance
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      selectedAccount.currency === 0
                        ? "text-emerald-600"
                        : "text-blue-600"
                    }`}
                  >
                    {getCurrencySymbol(selectedAccount.currency)}{" "}
                    {selectedAccount.balance.toLocaleString()}
                  </p>
                </div>

                {/* Opening Balance */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                    Opening Balance *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">
                      {selectedAccount.currency === 0 ? "KES" : "$"}
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.openingBalance}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          openingBalance: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full pl-14 pr-4 py-3 border-2 border-slate-200 focus:border-indigo-500 focus:outline-none text-lg font-bold"
                      placeholder="0.00"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Changing the opening balance will adjust the current balance
                    accordingly
                  </p>
                </div>

                {/* Balance Adjustment Preview */}
                {formData.openingBalance !== selectedAccount.openingBalance && (
                  <div className="bg-amber-50 border border-amber-200 p-4">
                    <div className="flex gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-amber-800">
                        <p className="font-semibold mb-1">
                          Balance Adjustment Preview
                        </p>
                        <div className="text-xs space-y-1">
                          <p>
                            Opening:{" "}
                            {getCurrencySymbol(selectedAccount.currency)}{" "}
                            {selectedAccount.openingBalance.toLocaleString()} →{" "}
                            {getCurrencySymbol(selectedAccount.currency)}{" "}
                            {formData.openingBalance.toLocaleString()}
                          </p>
                          <p className="font-bold">
                            New Balance:{" "}
                            {getCurrencySymbol(selectedAccount.currency)}{" "}
                            {(
                              selectedAccount.balance +
                              (formData.openingBalance -
                                selectedAccount.openingBalance)
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-slate-200 bg-slate-50 p-4 flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateAccount}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {modalType === "delete" && selectedAccount && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-red-600 to-rose-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Trash2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Delete Cash Account</h3>
                      <p className="text-xs opacity-80">
                        This action cannot be undone
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                {/* Account Info */}
                <div className="bg-slate-50 border border-slate-200 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-10 h-10 flex items-center justify-center ${
                        selectedAccount.currency === 0
                          ? "bg-emerald-100"
                          : "bg-blue-100"
                      }`}
                    >
                      <Banknote
                        className={`w-5 h-5 ${
                          selectedAccount.currency === 0
                            ? "text-emerald-600"
                            : "text-blue-600"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">
                        Cash {getCurrencyName(selectedAccount.currency)}
                      </p>
                      <p className="text-xs text-slate-500">
                        CASH-{getCurrencyName(selectedAccount.currency)}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-500">Current Balance</p>
                      <p className="font-bold text-slate-900">
                        {getCurrencySymbol(selectedAccount.currency)}{" "}
                        {selectedAccount.balance.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Opening Balance</p>
                      <p className="font-bold text-slate-900">
                        {getCurrencySymbol(selectedAccount.currency)}{" "}
                        {selectedAccount.openingBalance.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Warning */}
                <div className="bg-red-50 border border-red-200 p-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-red-800">
                      <p className="font-semibold mb-1">Warning</p>
                      <p className="text-xs">
                        You can only delete a cash account if it has no
                        transactions. All existing transactions must be deleted
                        or reversed first.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-600 text-center">
                  Are you sure you want to delete this cash account?
                </p>
              </div>

              {/* Footer */}
              <div className="border-t border-slate-200 bg-slate-50 p-4 flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete Account
                    </>
                  )}
                </button>
              </div>
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={() => setSelectedTransaction(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-lg shadow-2xl rounded-lg overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Card Header */}
              <div
                className={`p-3 sm:p-4 text-white flex-shrink-0 ${
                  selectedTransaction.thisAccountAction === "Debit"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600"
                    : "bg-gradient-to-r from-red-600 to-rose-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm flex items-center justify-center rounded-lg">
                      {selectedTransaction.thisAccountAction === "Debit" ? (
                        <ArrowUpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <ArrowDownCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold">
                        Transaction Details
                      </h3>
                      <p className="text-[10px] sm:text-xs opacity-80">
                        {selectedTransaction.reference ||
                          selectedTransaction.code}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTransaction(null)}
                    className="p-1.5 hover:bg-white/20 transition-colors rounded-lg"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* Card Body - Scrollable */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
                {/* Transaction Amount */}
                <div
                  className={`p-3 border-l-4 rounded-r-lg ${
                    selectedTransaction.thisAccountAction === "Debit"
                      ? "bg-emerald-50 border-emerald-500"
                      : "bg-red-50 border-red-500"
                  }`}
                >
                  <p className="text-[10px] font-bold text-slate-500 uppercase">
                    Amount
                  </p>
                  <p
                    className={`text-xl sm:text-2xl font-bold ${
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
                  <div className="flex flex-wrap gap-2 mt-1 text-[10px] sm:text-xs text-slate-600">
                    <span>
                      Before: {getCurrencySymbol(selectedTransaction.currency)}{" "}
                      {selectedTransaction.balanceBefore.toLocaleString()}
                    </span>
                    <span>→</span>
                    <span className="font-bold">
                      After: {getCurrencySymbol(selectedTransaction.currency)}{" "}
                      {selectedTransaction.balanceAfter.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Debit/Credit */}
                <div className="grid grid-cols-2 gap-2">
                  <div
                    className={`p-2 sm:p-3 border rounded-lg ${
                      selectedTransaction.debit !== null
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase">
                      Debit (In)
                    </p>
                    <p
                      className={`text-sm sm:text-base font-bold ${
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
                    className={`p-2 sm:p-3 border rounded-lg ${
                      selectedTransaction.credit !== null
                        ? "bg-red-50 border-red-200"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase">
                      Credit (Out)
                    </p>
                    <p
                      className={`text-sm sm:text-base font-bold ${
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

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-50 p-2 border border-slate-200 rounded-lg">
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase">
                      Code
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 font-mono truncate">
                      {selectedTransaction.code}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-2 border border-slate-200 rounded-lg">
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase">
                      Date
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">
                      {new Date(selectedTransaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div
                    className={`p-2 border rounded-lg ${
                      selectedTransaction.thisAccountAction === "Debit"
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase">
                      Action
                    </p>
                    <p
                      className={`text-xs sm:text-sm font-bold ${
                        selectedTransaction.thisAccountAction === "Debit"
                          ? "text-emerald-700"
                          : "text-red-700"
                      }`}
                    >
                      {selectedTransaction.thisAccountAction}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-2 border border-slate-200 rounded-lg">
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase">
                      Currency
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">
                      {getCurrencyName(selectedTransaction.currency)}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-blue-50 p-2 sm:p-3 border border-blue-200 rounded-lg">
                  <p className="text-[9px] sm:text-[10px] font-bold text-blue-700 uppercase">
                    Description
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900">
                    {selectedTransaction.description}
                  </p>
                </div>

                {/* Notes */}
                {selectedTransaction.notes && (
                  <div className="bg-amber-50 p-2 sm:p-3 border border-amber-200 rounded-lg">
                    <p className="text-[9px] sm:text-[10px] font-bold text-amber-700 uppercase">
                      Notes
                    </p>
                    <p className="text-xs sm:text-sm text-slate-900">
                      {selectedTransaction.notes}
                    </p>
                  </div>
                )}

                {/* Related Account */}
                {selectedTransaction.relatedAccount && (
                  <div className="bg-purple-50 border border-purple-200 p-2 sm:p-3 rounded-lg">
                    <p className="text-[9px] sm:text-[10px] font-bold text-purple-700 uppercase mb-2">
                      Related Account
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
                      <div className="bg-white p-1.5 sm:p-2 border border-purple-100 rounded">
                        <p className="text-slate-500">Type</p>
                        <p className="font-bold text-slate-900 truncate">
                          {getAccountTypeLabel(
                            selectedTransaction.relatedAccount.accountType
                          )}
                        </p>
                      </div>
                      <div className="bg-white p-1.5 sm:p-2 border border-purple-100 rounded">
                        <p className="text-slate-500">Name</p>
                        <p className="font-bold text-slate-900 truncate">
                          {selectedTransaction.relatedAccount.accountName}
                        </p>
                      </div>
                      <div
                        className={`p-1.5 sm:p-2 border rounded ${
                          selectedTransaction.relatedAccount.action === "Debit"
                            ? "bg-emerald-50 border-emerald-200"
                            : "bg-red-50 border-red-200"
                        }`}
                      >
                        <p className="text-slate-500">Action</p>
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
                      <div className="bg-white p-1.5 sm:p-2 border border-purple-100 rounded">
                        <p className="text-slate-500">Amount</p>
                        <p className="font-bold text-slate-900">
                          {getCurrencySymbol(
                            selectedTransaction.relatedAccount.currency
                          )}{" "}
                          {selectedTransaction.relatedAccount.amount.toLocaleString()}
                        </p>
                      </div>
                      {selectedTransaction.relatedAccount.clientCode && (
                        <div className="bg-white p-1.5 sm:p-2 border border-purple-100 rounded col-span-2">
                          <p className="text-slate-500">Client</p>
                          <p className="font-bold text-slate-900 font-mono">
                            {selectedTransaction.relatedAccount.clientCode}{" "}
                            {selectedTransaction.relatedAccount.clientPhone &&
                              `• ${selectedTransaction.relatedAccount.clientPhone}`}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="border-t border-slate-200 bg-slate-50 p-3 flex-shrink-0">
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="w-full px-4 py-2 bg-slate-700 text-white hover:bg-slate-800 transition-all font-semibold text-sm rounded-lg"
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
