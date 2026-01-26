import { useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";

interface Transaction {
  id: string;
  date: string;
  description: string;
  type: "debit" | "credit";
  currency: "KES" | "USD";
  amount: number;
  balance: number;
  reference: string;
}

interface ExchangeAccount {
  id: string;
  name: string;
  kesDebit: number;
  kesCredit: number;
  usdDebit: number;
  usdCredit: number;
  status: "active";
  opened: string;
  lastActivity: string;
  transactions: Transaction[];
}

export function ExchangeAccount() {
  const [transactionSearch, setTransactionSearch] = useState("");
  const [transactionFilter, setTransactionFilter] = useState<
    "all" | "credit" | "debit"
  >("all");
  const [currencyFilter, setCurrencyFilter] = useState<"all" | "KES" | "USD">(
    "all"
  );
  const [transactionsCurrentPage, setTransactionsCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(15);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showViewTransaction, setShowViewTransaction] = useState(false);
  const [showEditTransaction, setShowEditTransaction] = useState(false);
  const [showDeleteTransaction, setShowDeleteTransaction] = useState(false);

  // Exchange Account - Single Client with both KES and USD
  const exchangeAccount: ExchangeAccount = {
    id: "EXC-001",
    name: "Sarif Exchange Account",
    kesDebit: 125000,
    kesCredit: 2456000,
    usdDebit: 8500,
    usdCredit: 45600,
    status: "active",
    opened: "2024-01-01",
    lastActivity: "5 minutes ago",
    transactions: [
      {
        id: "TXN-E001",
        date: "2026-01-08 14:30",
        description: "USD to KES Exchange - Client Walk-in",
        type: "credit",
        currency: "KES",
        amount: 165000,
        balance: 2456000,
        reference: "EXC-2024-445",
      },
      {
        id: "TXN-E002",
        date: "2026-01-08 14:30",
        description: "USD to KES Exchange - Client Walk-in",
        type: "debit",
        currency: "USD",
        amount: 1200,
        balance: 45600,
        reference: "EXC-2024-445",
      },
      {
        id: "TXN-E003",
        date: "2026-01-08 11:45",
        description: "KES to USD Exchange - Corporate Client",
        type: "debit",
        currency: "KES",
        amount: 275000,
        balance: 2291000,
        reference: "EXC-2024-444",
      },
      {
        id: "TXN-E004",
        date: "2026-01-08 11:45",
        description: "KES to USD Exchange - Corporate Client",
        type: "credit",
        currency: "USD",
        amount: 2000,
        balance: 46800,
        reference: "EXC-2024-444",
      },
      {
        id: "TXN-E005",
        date: "2026-01-08 09:20",
        description: "USD to KES Exchange - Regular Client",
        type: "credit",
        currency: "KES",
        amount: 82500,
        balance: 2566000,
        reference: "EXC-2024-443",
      },
      {
        id: "TXN-E006",
        date: "2026-01-08 09:20",
        description: "USD to KES Exchange - Regular Client",
        type: "debit",
        currency: "USD",
        amount: 600,
        balance: 44800,
        reference: "EXC-2024-443",
      },
      {
        id: "TXN-E007",
        date: "2026-01-07 16:15",
        description: "Exchange Rate Adjustment",
        type: "credit",
        currency: "KES",
        amount: 5000,
        balance: 2483500,
        reference: "ADJ-2024-089",
      },
      {
        id: "TXN-E008",
        date: "2026-01-07 14:30",
        description: "KES to USD Exchange - Walk-in",
        type: "debit",
        currency: "KES",
        amount: 137500,
        balance: 2478500,
        reference: "EXC-2024-442",
      },
      {
        id: "TXN-E009",
        date: "2026-01-07 14:30",
        description: "KES to USD Exchange - Walk-in",
        type: "credit",
        currency: "USD",
        amount: 1000,
        balance: 45400,
        reference: "EXC-2024-442",
      },
      {
        id: "TXN-E010",
        date: "2026-01-07 10:45",
        description: "USD to KES Exchange - Business",
        type: "credit",
        currency: "KES",
        amount: 412500,
        balance: 2616000,
        reference: "EXC-2024-441",
      },
      {
        id: "TXN-E011",
        date: "2026-01-07 10:45",
        description: "USD to KES Exchange - Business",
        type: "debit",
        currency: "USD",
        amount: 3000,
        balance: 44400,
        reference: "EXC-2024-441",
      },
      {
        id: "TXN-E012",
        date: "2026-01-06 15:30",
        description: "KES to USD Exchange",
        type: "debit",
        currency: "KES",
        amount: 206250,
        balance: 2203500,
        reference: "EXC-2024-440",
      },
      {
        id: "TXN-E013",
        date: "2026-01-06 15:30",
        description: "KES to USD Exchange",
        type: "credit",
        currency: "USD",
        amount: 1500,
        balance: 47400,
        reference: "EXC-2024-440",
      },
    ],
  };

  // Calculate net balance
  const getNetBalance = () => {
    return {
      kesNet: exchangeAccount.kesCredit - exchangeAccount.kesDebit,
      usdNet: exchangeAccount.usdCredit - exchangeAccount.usdDebit,
    };
  };

  const { kesNet, usdNet } = getNetBalance();

  // Transaction filtering
  const filteredTransactions = exchangeAccount.transactions.filter((txn) => {
    const matchesSearch =
      txn.description.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      txn.reference.toLowerCase().includes(transactionSearch.toLowerCase());
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
    toast.success("Exchange statement exported successfully!");
  };

  const handlePrintStatement = () => {
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

  const confirmDeleteTransaction = () => {
    toast.success(
      `Transaction ${selectedTransaction?.reference} deleted successfully!`
    );
    setShowDeleteTransaction(false);
    setSelectedTransaction(null);
  };

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
      </div>

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
            {exchangeAccount.transactions.length}
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
                {exchangeAccount.name}
              </h3>
              <p className="text-purple-100 mb-4">
                Client ID: {exchangeAccount.id}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-200" />
                  <div>
                    <p className="text-purple-200 text-xs">Opened</p>
                    <p className="font-semibold">{exchangeAccount.opened}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-200" />
                  <div>
                    <p className="text-purple-200 text-xs">Last Activity</p>
                    <p className="font-semibold">
                      {exchangeAccount.lastActivity}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-200" />
                  <div>
                    <p className="text-purple-200 text-xs">Status</p>
                    <p className="font-semibold">
                      {exchangeAccount.status.toUpperCase()}
                    </p>
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
                    +{exchangeAccount.kesCredit.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs opacity-75 mb-1">Debit</p>
                  <p className="font-bold text-lg text-red-200">
                    -{exchangeAccount.kesDebit.toLocaleString()}
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
                    +${exchangeAccount.usdCredit.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs opacity-75 mb-1">Debit</p>
                  <p className="font-bold text-lg text-red-200">
                    -${exchangeAccount.usdDebit.toLocaleString()}
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
              {filteredTransactions.length} of{" "}
              {exchangeAccount.transactions.length} Transactions
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
              {currentTransactions.map((txn, idx) => (
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
                      {txn.date}
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
                      {txn.currency} {txn.currency === "USD" ? "$" : ""}
                      {txn.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-base font-bold text-slate-900 whitespace-nowrap text-right">
                    {txn.currency} {txn.currency === "USD" ? "$" : ""}
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
              ))}
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
                      {selectedTransaction.date}
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
                      {selectedTransaction.currency}{" "}
                      {selectedTransaction.currency === "USD" ? "$" : ""}
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
                      {selectedTransaction.currency}{" "}
                      {selectedTransaction.currency === "USD" ? "$" : ""}
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
                      defaultValue={selectedTransaction.date}
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
                      {selectedTransaction.currency}{" "}
                      {selectedTransaction.currency === "USD" ? "$" : ""}
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
