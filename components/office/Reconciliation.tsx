import { useState, useEffect } from "react";
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
  Upload,
  Search,
  Filter,
  RefreshCw,
  Eye,
  XCircle,
  TrendingUp,
  AlertCircle,
  Check,
  X,
  Clock,
  Building2,
  Wallet,
  Banknote,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

interface ReconciliationTransaction {
  id: string;
  date: string;
  description: string;
  expectedAmount: number;
  actualAmount?: number;
  status: "matched" | "unmatched" | "pending";
  category: string;
  reference?: string;
  type?: "debit" | "credit";
}

export function Reconciliation() {
  const [selectedAccount, setSelectedAccount] = useState<
    "bank" | "mpesa" | "cash"
  >("bank");
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [accounts, setAccounts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<ReconciliationTransaction[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "matched" | "unmatched" | "pending"
  >("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [actualBalance, setActualBalance] = useState<number>(0);
  const [showReconcileModal, setShowReconcileModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<ReconciliationTransaction | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Fetch accounts based on type
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      let endpoint = "";

      if (selectedAccount === "bank") {
        endpoint = "banks";
      } else if (selectedAccount === "mpesa") {
        endpoint = "agents";
      } else {
        endpoint = "accounts";
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-32ed8237/${endpoint}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        const accountList =
          selectedAccount === "cash"
            ? result.accounts.filter((acc: any) => acc.type === "Cash")
            : result.banks || result.agents || [];

        setAccounts(accountList);
        if (accountList.length > 0) {
          setSelectedAccountId(accountList[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast.error("Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };

  // Fetch transactions for reconciliation
  const fetchTransactions = async () => {
    if (!selectedAccountId) return;

    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-32ed8237/transactions`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        // Filter transactions related to selected account
        const accountTransactions = result.transactions
          .filter((txn: any) => {
            return (
              txn.primaryAccountId === selectedAccountId ||
              txn.secondaryId === selectedAccountId
            );
          })
          .map((txn: any) => ({
            id: txn.id,
            date: txn.date,
            description: txn.description,
            expectedAmount: txn.amount * (txn.type === "debit" ? 1 : -1), // For ASSET accounts: Debit = positive, Credit = negative
            actualAmount: undefined, // To be filled during reconciliation
            status: "pending" as const,
            category: txn.category || "General",
            reference: txn.id,
            type: txn.type,
          }));

        setTransactions(accountTransactions);
        toast.success(
          `Loaded ${accountTransactions.length} transactions for reconciliation`
        );
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccount]);

  useEffect(() => {
    if (selectedAccountId) {
      fetchTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccountId]);

  // Calculate statistics
  const selectedAccountData = accounts.find(
    (acc) => acc.id === selectedAccountId
  );
  const expectedBalance = selectedAccountData?.balance || 0;
  const difference = actualBalance - expectedBalance;
  const isBalanced = Math.abs(difference) < 0.01;

  // Filter transactions
  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || txn.status === statusFilter;
    const matchesDate =
      (!dateFrom || txn.date >= dateFrom) && (!dateTo || txn.date <= dateTo);

    return matchesSearch && matchesStatus && matchesDate;
  });

  const stats = {
    total: filteredTransactions.length,
    matched: filteredTransactions.filter((t) => t.status === "matched").length,
    unmatched: filteredTransactions.filter((t) => t.status === "unmatched")
      .length,
    pending: filteredTransactions.filter((t) => t.status === "pending").length,
  };

  const handleMarkAsMatched = (transaction: ReconciliationTransaction) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transaction.id
          ? { ...t, actualAmount: t.expectedAmount, status: "matched" as const }
          : t
      )
    );
    toast.success("✓ Transaction marked as matched");
  };

  const handleMarkAsUnmatched = (transaction: ReconciliationTransaction) => {
    setSelectedTransaction(transaction);
    setShowReconcileModal(true);
  };

  const handleViewDetails = (transaction: ReconciliationTransaction) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
  };

  const handleReconcileTransaction = (actualAmount: number) => {
    if (selectedTransaction) {
      const isMatched =
        Math.abs(actualAmount - selectedTransaction.expectedAmount) < 0.01;
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === selectedTransaction.id
            ? {
                ...t,
                actualAmount,
                status: (isMatched ? "matched" : "unmatched") as const,
              }
            : t
        )
      );
      toast.success(
        isMatched
          ? "✓ Transaction matched"
          : "⚠ Transaction marked as unmatched"
      );
      setShowReconcileModal(false);
      setSelectedTransaction(null);
    }
  };

  const handleAutoReconcile = () => {
    setTransactions((prev) =>
      prev.map((t) => ({
        ...t,
        actualAmount: t.expectedAmount,
        status: "matched" as const,
      }))
    );
    toast.success("✓ All transactions auto-reconciled");
  };

  const handleCompleteReconciliation = () => {
    const unmatchedCount = transactions.filter(
      (t) => t.status === "unmatched"
    ).length;
    const pendingCount = transactions.filter(
      (t) => t.status === "pending"
    ).length;

    if (pendingCount > 0) {
      toast.error(
        `❌ Cannot complete reconciliation. ${pendingCount} transactions are still pending.`
      );
      return;
    }

    if (unmatchedCount > 0) {
      toast.warning(
        `⚠ Reconciliation completed with ${unmatchedCount} unmatched transactions.`
      );
    } else {
      toast.success(
        "✓ Reconciliation completed successfully! All transactions matched."
      );
    }
  };

  const handleExportReport = () => {
    const csvData = [
      [
        "Transaction ID",
        "Date",
        "Description",
        "Category",
        "Expected Amount",
        "Actual Amount",
        "Difference",
        "Status",
      ],
      ...filteredTransactions.map((txn) => [
        txn.id,
        txn.date,
        txn.description,
        txn.category,
        txn.expectedAmount.toFixed(2),
        txn.actualAmount?.toFixed(2) || "-",
        txn.actualAmount
          ? (txn.actualAmount - txn.expectedAmount).toFixed(2)
          : "-",
        txn.status,
      ]),
    ];

    const csv = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reconciliation-${
      selectedAccountData?.accountName || "report"
    }-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("✓ Reconciliation report exported");
  };

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
              Account Reconciliation
            </h1>
            <p className="text-slate-600 font-medium">
              Match and verify account transactions with bank/M-Pesa statements
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchTransactions}
              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-blue-200 text-blue-600 font-bold shadow-md hover:shadow-lg hover:border-blue-300 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh
            </button>
            <button
              onClick={handleExportReport}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Download className="w-5 h-5" />
              Export Report
            </button>
          </div>
        </motion.div>

        {/* Account Type Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-4"
        >
          <button
            onClick={() => setSelectedAccount("bank")}
            className={`flex items-center gap-3 px-6 py-4 font-semibold transition-all ${
              selectedAccount === "bank"
                ? "bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white shadow-lg shadow-blue-500/30"
                : "bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-200"
            }`}
          >
            <Building2 className="w-5 h-5" />
            Bank Accounts
          </button>
          <button
            onClick={() => setSelectedAccount("mpesa")}
            className={`flex items-center gap-3 px-6 py-4 font-semibold transition-all ${
              selectedAccount === "mpesa"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
                : "bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-200"
            }`}
          >
            <Smartphone className="w-5 h-5" />
            M-Pesa Accounts
          </button>
          <button
            onClick={() => setSelectedAccount("cash")}
            className={`flex items-center gap-3 px-6 py-4 font-semibold transition-all ${
              selectedAccount === "cash"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
                : "bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-200"
            }`}
          >
            <Wallet className="w-5 h-5" />
            Cash at Hand
          </button>
        </motion.div>

        {/* Account Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border-2 border-slate-200 p-6 shadow-lg"
        >
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Select Account to Reconcile
          </label>
          <select
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-200 bg-white text-slate-900 font-medium focus:outline-none focus:border-blue-500 transition-colors"
          >
            {accounts.length === 0 ? (
              <option>No accounts available</option>
            ) : (
              accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name || acc.accountName} - {acc.currency} (
                  {acc.accountNumber || acc.phoneNumber})
                </option>
              ))
            )}
          </select>
        </motion.div>

        {/* Status Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Expected Balance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-blue-300 transition-all duration-300 group"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 flex items-center justify-center border-2 border-blue-200 group-hover:bg-blue-200 transition-colors">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="bg-blue-100 px-3 py-1 border border-blue-200">
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">
                    System
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
                Expected Balance
              </p>
              <p className="text-3xl font-bold text-blue-600 tracking-tight">
                {expectedBalance.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </p>
              <div className="mt-3 pt-3 border-t-2 border-slate-100">
                <p className="text-[10px] text-slate-500 font-semibold">
                  From System Records
                </p>
              </div>
            </div>
          </motion.div>

          {/* Actual Balance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-purple-300 transition-all duration-300 group"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 flex items-center justify-center border-2 border-purple-200 group-hover:bg-purple-200 transition-colors">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <div className="bg-purple-100 px-3 py-1 border border-purple-200">
                  <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wide">
                    Actual
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
                Actual Balance
              </p>
              <input
                type="number"
                value={actualBalance}
                onChange={(e) =>
                  setActualBalance(parseFloat(e.target.value) || 0)
                }
                placeholder="Enter actual balance"
                className="w-full text-3xl font-bold text-purple-700 bg-transparent border-b-2 border-purple-300 focus:border-purple-600 outline-none transition-colors"
                step="0.01"
              />
              <div className="mt-3 pt-3 border-t-2 border-slate-100">
                <p className="text-[10px] text-slate-500 font-semibold">
                  From Statement
                </p>
              </div>
            </div>
          </motion.div>

          {/* Difference */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className={`border-2 shadow-lg hover:shadow-xl transition-all duration-300 group ${
              isBalanced
                ? "bg-white hover:border-emerald-300"
                : "bg-white hover:border-red-300"
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                {isBalanced ? (
                  <div className="w-12 h-12 bg-emerald-100 flex items-center justify-center border-2 border-emerald-200 group-hover:bg-emerald-200 transition-colors">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-red-100 flex items-center justify-center border-2 border-red-200 group-hover:bg-red-200 transition-colors">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                )}
                <div
                  className={`px-3 py-1 border ${
                    isBalanced
                      ? "bg-emerald-100 border-emerald-200"
                      : "bg-red-100 border-red-200"
                  }`}
                >
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wide ${
                      isBalanced ? "text-emerald-700" : "text-red-700"
                    }`}
                  >
                    {isBalanced ? "Balanced" : "Variance"}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
                Difference
              </p>
              <p
                className={`text-3xl font-bold tracking-tight ${
                  isBalanced ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {difference >= 0 ? "+" : ""}
                {difference.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </p>
              <div className="mt-3 pt-3 border-t-2 border-slate-100">
                <p
                  className={`text-[10px] font-semibold ${
                    isBalanced ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {isBalanced ? "✓ Perfectly Balanced" : "⚠ Requires Attention"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Progress Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-amber-300 transition-all duration-300 group"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-amber-100 flex items-center justify-center border-2 border-amber-200 group-hover:bg-amber-200 transition-colors">
                  <TrendingUp className="w-6 h-6 text-amber-600" />
                </div>
                <div className="bg-amber-100 px-3 py-1 border border-amber-200">
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">
                    Progress
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mb-3 uppercase tracking-wider font-bold">
                Reconciliation Status
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600 font-medium">
                    Matched:
                  </span>
                  <span className="text-sm font-bold text-emerald-600">
                    {stats.matched}/{stats.total}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600 font-medium">
                    Unmatched:
                  </span>
                  <span className="text-sm font-bold text-red-600">
                    {stats.unmatched}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-600 font-medium">
                    Pending:
                  </span>
                  <span className="text-sm font-bold text-amber-600">
                    {stats.pending}
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
          transition={{ delay: 0.5 }}
          className="bg-white border-2 border-slate-200 p-6 shadow-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Search Transactions
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by description or reference..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Status Filter
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors"
              >
                <option value="all">All Statuses</option>
                <option value="matched">Matched</option>
                <option value="unmatched">Unmatched</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Quick Actions */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Quick Actions
              </label>
              <button
                onClick={handleAutoReconcile}
                className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
              >
                Auto Reconcile
              </button>
            </div>
          </div>
        </motion.div>

        {/* Transactions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/90 backdrop-blur-xl border-2 border-slate-200 shadow-2xl overflow-hidden"
        >
          <div className="p-6 border-b-2 border-slate-200 bg-gradient-to-r from-blue-50 to-cyan-50 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Transaction Details
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Showing {filteredTransactions.length} transactions
              </p>
            </div>
            <button
              onClick={handleCompleteReconciliation}
              disabled={stats.pending > 0}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-5 h-5" />
              Complete Reconciliation
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <FileText className="w-16 h-16 mb-4 text-slate-300" />
              <p className="text-lg font-medium">No transactions found</p>
              <p className="text-sm">Select an account to view transactions</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Expected
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Actual
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Difference
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredTransactions.map((txn, index) => {
                    const diff = (txn.actualAmount || 0) - txn.expectedAmount;
                    const isMatched = txn.status === "matched";

                    return (
                      <motion.tr
                        key={txn.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="hover:bg-blue-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          {new Date(txn.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900 font-medium max-w-xs">
                          <div className="truncate">{txn.description}</div>
                          {txn.reference && (
                            <div className="text-xs text-slate-500 font-mono">
                              {txn.reference}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {txn.type === "debit" ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase">
                              <ArrowUpCircle className="w-3 h-3" />
                              DEBIT
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 border border-red-200 text-xs font-bold uppercase">
                              <ArrowDownCircle className="w-3 h-3" />
                              CREDIT
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold">
                            {txn.category}
                          </span>
                        </td>
                        <td
                          className={`px-6 py-4 text-sm text-right font-bold ${
                            txn.expectedAmount >= 0
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {txn.expectedAmount >= 0 ? "+" : ""}
                          {txn.expectedAmount.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td
                          className={`px-6 py-4 text-sm text-right font-bold ${
                            !txn.actualAmount
                              ? "text-slate-400"
                              : txn.actualAmount >= 0
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {txn.actualAmount !== undefined
                            ? `${
                                txn.actualAmount >= 0 ? "+" : ""
                              }${txn.actualAmount.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                              })}`
                            : "-"}
                        </td>
                        <td
                          className={`px-6 py-4 text-sm text-right font-bold ${
                            !txn.actualAmount
                              ? "text-slate-400"
                              : Math.abs(diff) < 0.01
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {txn.actualAmount !== undefined
                            ? Math.abs(diff) < 0.01
                              ? "✓"
                              : diff.toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                })
                            : "-"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {txn.status === "matched" ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase">
                              <CheckCircle2 className="w-3 h-3" />
                              Matched
                            </span>
                          ) : txn.status === "unmatched" ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 border border-red-200 text-xs font-bold uppercase">
                              <AlertTriangle className="w-3 h-3" />
                              Unmatched
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold uppercase">
                              <Clock className="w-3 h-3" />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleViewDetails(txn)}
                              className="p-2 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all border border-blue-200"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {txn.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleMarkAsMatched(txn)}
                                  className="p-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-all border border-emerald-200"
                                  title="Mark as matched"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleMarkAsUnmatched(txn)}
                                  className="p-2 bg-amber-100 text-amber-700 hover:bg-amber-200 transition-all border border-amber-200"
                                  title="Enter actual amount"
                                >
                                  <AlertCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

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
              className="bg-white shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 p-6 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Reconcile Transaction</h3>
                  <button
                    onClick={() => setShowReconcileModal(false)}
                    className="p-2 hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Description
                  </label>
                  <p className="text-lg font-semibold text-slate-900">
                    {selectedTransaction.description}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Date
                  </label>
                  <p className="text-slate-900">
                    {new Date(selectedTransaction.date).toLocaleDateString(
                      "en-US",
                      { month: "long", day: "numeric", year: "numeric" }
                    )}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Expected Amount
                  </label>
                  <p
                    className={`text-2xl font-bold ${
                      selectedTransaction.expectedAmount >= 0
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedTransaction.expectedAmount >= 0 ? "+" : ""}
                    {selectedTransaction.expectedAmount.toLocaleString(
                      "en-US",
                      { minimumFractionDigits: 2 }
                    )}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase mb-2">
                    Enter Actual Amount
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    autoFocus
                    id="actualAmountInput"
                    className="w-full px-4 py-3 border-2 border-slate-300 focus:border-blue-500 focus:outline-none text-lg font-bold transition-colors"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const value = parseFloat(
                          (e.target as HTMLInputElement).value
                        );
                        if (!isNaN(value)) {
                          handleReconcileTransaction(value);
                        }
                      }
                    }}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() =>
                      handleReconcileTransaction(
                        selectedTransaction.expectedAmount
                      )
                    }
                    className="flex-1 px-4 py-3 bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors"
                  >
                    Match Expected
                  </button>
                  <button
                    onClick={() => {
                      const input = document.getElementById(
                        "actualAmountInput"
                      ) as HTMLInputElement;
                      const value = parseFloat(input.value);
                      if (!isNaN(value)) {
                        handleReconcileTransaction(value);
                      } else {
                        toast.error("Please enter a valid amount");
                      }
                    }}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
                  >
                    Save Actual
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transaction Detail Modal */}
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
              className="bg-white w-full max-w-3xl shadow-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 p-6 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Banknote className="w-8 h-8" />
                      <div>
                        <h2 className="text-2xl font-bold">
                          Transaction Details
                        </h2>
                        <p className="text-blue-100 text-sm flex items-center gap-1.5 mt-1">
                          <FileText className="w-3.5 h-3.5" />
                          {selectedTransaction.reference}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
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
                      Transaction Date
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      {new Date(selectedTransaction.date).toLocaleDateString(
                        "en-US",
                        { month: "long", day: "numeric", year: "numeric" }
                      )}
                    </p>
                  </div>
                  <div className="bg-slate-50 border-2 border-slate-200 p-4">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                      Category
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      {selectedTransaction.category}
                    </p>
                  </div>
                  <div className="col-span-2 bg-slate-50 border-2 border-slate-200 p-4">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                      Description
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      {selectedTransaction.description}
                    </p>
                  </div>
                </div>

                {/* Amounts */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 border-2 border-blue-200 p-4">
                    <p className="text-xs font-bold text-blue-700 uppercase mb-1">
                      Expected Amount
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        selectedTransaction.expectedAmount >= 0
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedTransaction.expectedAmount >= 0 ? "+" : ""}
                      {selectedTransaction.expectedAmount.toLocaleString(
                        "en-US",
                        { minimumFractionDigits: 2 }
                      )}
                    </p>
                  </div>
                  <div className="bg-purple-50 border-2 border-purple-200 p-4">
                    <p className="text-xs font-bold text-purple-700 uppercase mb-1">
                      Actual Amount
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        !selectedTransaction.actualAmount
                          ? "text-slate-400"
                          : selectedTransaction.actualAmount >= 0
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedTransaction.actualAmount !== undefined
                        ? `${
                            selectedTransaction.actualAmount >= 0 ? "+" : ""
                          }${selectedTransaction.actualAmount.toLocaleString(
                            "en-US",
                            { minimumFractionDigits: 2 }
                          )}`
                        : "Not Set"}
                    </p>
                  </div>
                  <div
                    className={`border-2 p-4 ${
                      !selectedTransaction.actualAmount
                        ? "bg-slate-50 border-slate-200"
                        : Math.abs(
                            (selectedTransaction.actualAmount || 0) -
                              selectedTransaction.expectedAmount
                          ) < 0.01
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-700 uppercase mb-1">
                      Difference
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        !selectedTransaction.actualAmount
                          ? "text-slate-400"
                          : Math.abs(
                              (selectedTransaction.actualAmount || 0) -
                                selectedTransaction.expectedAmount
                            ) < 0.01
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedTransaction.actualAmount !== undefined
                        ? Math.abs(
                            (selectedTransaction.actualAmount || 0) -
                              selectedTransaction.expectedAmount
                          ) < 0.01
                          ? "✓ Matched"
                          : (
                              (selectedTransaction.actualAmount || 0) -
                              selectedTransaction.expectedAmount
                            ).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })
                        : "-"}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex justify-center">
                  {selectedTransaction.status === "matched" ? (
                    <span className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-100 text-emerald-700 border-2 border-emerald-200 text-sm font-bold uppercase">
                      <CheckCircle2 className="w-5 h-5" />
                      Transaction Matched
                    </span>
                  ) : selectedTransaction.status === "unmatched" ? (
                    <span className="inline-flex items-center gap-2 px-6 py-3 bg-red-100 text-red-700 border-2 border-red-200 text-sm font-bold uppercase">
                      <AlertTriangle className="w-5 h-5" />
                      Transaction Unmatched
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-6 py-3 bg-amber-100 text-amber-700 border-2 border-amber-200 text-sm font-bold uppercase">
                      <Clock className="w-5 h-5" />
                      Pending Reconciliation
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setShowDetailModal(false)}
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
