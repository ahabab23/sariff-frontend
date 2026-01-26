import { useState } from "react";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  relatedAccount?: {
    accountType: string;
    accountName: string;
    accountId: string;
    effect: string;
    balanceAfter: number;
  };
}

export function CashAtHand() {
  const [searchTerm, setSearchTerm] = useState("");
  const [transactionsCurrentPage, setTransactionsCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  // Filters
  const [dateFilter, setDateFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currencyFilter, setCurrencyFilter] = useState("all");

  // Single Cash at Hand Account
  const cashAccount = {
    id: "CASH-001",
    name: "Cash at Hand",
    location: "Main Office - Nairobi",
    kesDebit: 456000,
    kesCredit: 234500,
    usdDebit: 8900,
    usdCredit: 3450,
    lastActivity: "5 min ago",
  };

  // All transactions affecting Cash at Hand
  const allTransactions: Transaction[] = [
    {
      id: "TXN-CH-0013",
      date: "2026-01-13 14:30",
      description: "Client Payment Received - Sarah Wanjiru",
      type: "debit",
      currency: "KES",
      amount: 85000,
      balance: 456000,
      reference: "CLT-PAY-2026-089",
      relatedAccount: {
        accountType: "Client Account",
        accountName: "Sarah Wanjiru",
        accountId: "CL-2024-234",
        effect: "Credit",
        balanceAfter: 285000,
      },
    },
    {
      id: "TXN-CH-0012",
      date: "2026-01-13 11:15",
      description: "Client Payment Received - USD",
      type: "debit",
      currency: "USD",
      amount: 2500,
      balance: 8900,
      reference: "CLT-PAY-2026-088",
      relatedAccount: {
        accountType: "Client Account",
        accountName: "David Omondi",
        accountId: "CL-2024-198",
        effect: "Credit",
        balanceAfter: 12450,
      },
    },
    {
      id: "TXN-CH-0011",
      date: "2026-01-13 09:45",
      description: "Rent Payment - January",
      type: "credit",
      currency: "KES",
      amount: 150000,
      balance: 371000,
      reference: "EXP-RENT-JAN-2026",
      relatedAccount: {
        accountType: "Expense Account",
        accountName: "Rent & Utilities",
        accountId: "EXP-001",
        effect: "Debit",
        balanceAfter: 150000,
      },
    },
    {
      id: "TXN-CH-0010",
      date: "2026-01-12 16:20",
      description: "Bank Deposit - Equity Bank",
      type: "credit",
      currency: "KES",
      amount: 200000,
      balance: 521000,
      reference: "BNK-DEP-2026-045",
      relatedAccount: {
        accountType: "Bank Account",
        accountName: "Equity Bank - KES",
        accountId: "BA-001",
        effect: "Debit",
        balanceAfter: 1234500,
      },
    },
    {
      id: "TXN-CH-0009",
      date: "2026-01-12 14:30",
      description: "M-Pesa Withdrawal",
      type: "debit",
      currency: "KES",
      amount: 120000,
      balance: 721000,
      reference: "MP-WTH-2026-123",
      relatedAccount: {
        accountType: "M-Pesa Account",
        accountName: "Agent CBD",
        accountId: "MP-001",
        effect: "Credit",
        balanceAfter: 234500,
      },
    },
    {
      id: "TXN-CH-0008",
      date: "2026-01-12 10:15",
      description: "USD Exchange - Sold to Client",
      type: "credit",
      currency: "USD",
      amount: 1500,
      balance: 6400,
      reference: "EXC-2026-067",
      relatedAccount: {
        accountType: "Exchange Account",
        accountName: "Exchange USD",
        accountId: "EXC-USD-001",
        effect: "Debit",
        balanceAfter: 12890,
      },
    },
    {
      id: "TXN-CH-0007",
      date: "2026-01-11 15:45",
      description: "Salary Payment - Staff",
      type: "credit",
      currency: "KES",
      amount: 85000,
      balance: 601000,
      reference: "EXP-SAL-JAN-2026",
      relatedAccount: {
        accountType: "Expense Account",
        accountName: "Salaries & Wages",
        accountId: "EXP-002",
        effect: "Debit",
        balanceAfter: 85000,
      },
    },
    {
      id: "TXN-CH-0006",
      date: "2026-01-11 13:20",
      description: "Client Withdrawal - KES",
      type: "credit",
      currency: "KES",
      amount: 45000,
      balance: 686000,
      reference: "CLT-WTH-2026-234",
      relatedAccount: {
        accountType: "Client Account",
        accountName: "Jane Muthoni",
        accountId: "CL-2024-167",
        effect: "Debit",
        balanceAfter: 89450,
      },
    },
    {
      id: "TXN-CH-0005",
      date: "2026-01-11 09:30",
      description: "Walk-in Deposit - KES",
      type: "debit",
      currency: "KES",
      amount: 95000,
      balance: 731000,
      reference: "WLK-DEP-2026-089",
      relatedAccount: {
        accountType: "Walk-in Holding",
        accountName: "Walk-in Customer",
        accountId: "WLK-2026-089",
        effect: "Credit",
        balanceAfter: 95000,
      },
    },
    {
      id: "TXN-CH-0004",
      date: "2026-01-10 16:00",
      description: "Bank Withdrawal - USD",
      type: "debit",
      currency: "USD",
      amount: 3000,
      balance: 7900,
      reference: "BNK-WTH-2026-034",
      relatedAccount: {
        accountType: "Bank Account",
        accountName: "KCB Bank - USD",
        accountId: "BA-002",
        effect: "Credit",
        balanceAfter: 45670,
      },
    },
    {
      id: "TXN-CH-0003",
      date: "2026-01-10 11:45",
      description: "Office Supplies Purchase",
      type: "credit",
      currency: "KES",
      amount: 28000,
      balance: 636000,
      reference: "EXP-SUP-2026-012",
      relatedAccount: {
        accountType: "Expense Account",
        accountName: "Office Supplies",
        accountId: "EXP-003",
        effect: "Debit",
        balanceAfter: 28000,
      },
    },
    {
      id: "TXN-CH-0002",
      date: "2026-01-09 14:20",
      description: "Exchange KES Purchase",
      type: "debit",
      currency: "KES",
      amount: 175000,
      balance: 664000,
      reference: "EXC-2026-056",
      relatedAccount: {
        accountType: "Exchange Account",
        accountName: "Exchange KES",
        accountId: "EXC-KES-001",
        effect: "Credit",
        balanceAfter: 567890,
      },
    },
    {
      id: "TXN-CH-0001",
      date: "2026-01-09 09:00",
      description: "Client Payment - USD",
      type: "debit",
      currency: "USD",
      amount: 1900,
      balance: 4900,
      reference: "CLT-PAY-2026-078",
      relatedAccount: {
        accountType: "Client Account",
        accountName: "Peter Kimani",
        accountId: "CL-2024-145",
        effect: "Credit",
        balanceAfter: 7800,
      },
    },
  ];

  // Apply filters
  const filteredTransactions = allTransactions.filter((txn) => {
    const matchesSearch =
      txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || txn.type === typeFilter;
    const matchesCurrency =
      currencyFilter === "all" || txn.currency === currencyFilter;

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

  // Calculate net balance
  const kesNet = cashAccount.kesDebit - cashAccount.kesCredit;
  const usdNet = cashAccount.usdDebit - cashAccount.usdCredit;

  const handleExport = () => {
    toast.success("Cash at Hand statement exported successfully!");
  };

  const handlePrint = () => {
    toast.success("Printing Cash at Hand statement...");
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
              Cash at Hand
            </h1>
            <p className="text-slate-600 font-medium">
              Physical cash available in the office • {cashAccount.location}
            </p>
          </div>
          <div className="flex gap-3">
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
          {/* Total Debit - Both Currencies */}
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
                  KES {cashAccount.kesDebit.toLocaleString()}
                </p>
              </div>

              <div className="pt-3 border-t-2 border-slate-100">
                {/* USD Debit */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-semibold">
                    USD Debit
                  </span>
                  <span className="text-sm font-bold text-emerald-600">
                    ${cashAccount.usdDebit.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Total Credit - Both Currencies */}
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
                  KES {cashAccount.kesCredit.toLocaleString()}
                </p>
              </div>

              <div className="pt-3 border-t-2 border-slate-100">
                {/* USD Credit */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-semibold">
                    USD Credit
                  </span>
                  <span className="text-sm font-bold text-red-600">
                    ${cashAccount.usdCredit.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Net Flow - Both Currencies */}
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
                Net Flow Balance
              </p>

              {/* KES Net Flow */}
              <div className="mb-3">
                <p className="text-3xl font-bold tracking-tight mb-1">
                  {kesNet >= 0 ? "+" : ""}KES {kesNet.toLocaleString()}
                </p>
              </div>

              <div className="pt-3 border-t border-white/20">
                {/* USD Net Flow */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] opacity-75">USD Net</span>
                  <span className="text-sm font-bold">
                    {usdNet >= 0 ? "+$" : "-$"}
                    {Math.abs(usdNet).toLocaleString()}
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
                    Type
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Amount
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
                {currentTransactions.map((txn, index) => (
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
                        {txn.date}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-sm font-semibold text-slate-700">
                          {txn.reference}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-900 font-semibold max-w-sm">
                      {txn.description}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 border-l-4 text-xs font-bold ${
                          txn.type === "debit"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-500"
                            : "bg-red-50 text-red-700 border-red-500"
                        }`}
                      >
                        {txn.type === "debit" ? (
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
                          txn.type === "debit"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {txn.type === "debit" ? "+" : "-"}
                        {txn.currency === "KES" ? "KES" : "$"}{" "}
                        {txn.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-base font-bold text-slate-900 whitespace-nowrap text-right">
                      {txn.currency === "KES" ? "KES" : "$"}{" "}
                      {txn.balance.toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      {txn.relatedAccount && (
                        <div className="text-xs">
                          <div className="font-bold text-slate-900">
                            {txn.relatedAccount.accountName}
                          </div>
                          <div className="text-slate-600">
                            {txn.relatedAccount.accountType}
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
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalTransactionPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
              <div className="text-sm text-slate-600">
                Showing {indexOfFirstTransaction + 1} to{" "}
                {Math.min(indexOfLastTransaction, filteredTransactions.length)}{" "}
                of {filteredTransactions.length} transactions
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setTransactionsCurrentPage((prev) => Math.max(1, prev - 1))
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
                          onClick={() => setTransactionsCurrentPage(pageNum)}
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
                  disabled={transactionsCurrentPage === totalTransactionPages}
                  className="p-2 border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
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
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold">Transaction Details</h3>
                  <button
                    onClick={() => setSelectedTransaction(null)}
                    className="p-1.5 hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-blue-100">
                  Reference: {selectedTransaction.reference}
                </p>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                {/* Transaction Amount - Highlight */}
                <div
                  className={`p-4 border-l-4 ${
                    selectedTransaction.type === "debit"
                      ? "bg-emerald-50 border-emerald-500"
                      : "bg-red-50 border-red-500"
                  }`}
                >
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                    Transaction Amount
                  </p>
                  <p
                    className={`text-3xl font-bold ${
                      selectedTransaction.type === "debit"
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedTransaction.type === "debit" ? "+" : "-"}
                    {selectedTransaction.currency === "KES" ? "KES" : "$"}{" "}
                    {selectedTransaction.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    Balance After:{" "}
                    {selectedTransaction.currency === "KES" ? "KES" : "$"}{" "}
                    {selectedTransaction.balance.toLocaleString()}
                  </p>
                </div>

                {/* Grid Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 border border-slate-200">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Transaction ID
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {selectedTransaction.id}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 border border-slate-200">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Date & Time
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {selectedTransaction.date}
                    </p>
                  </div>
                  <div
                    className={`p-3 border ${
                      selectedTransaction.type === "debit"
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Type
                    </p>
                    <p
                      className={`text-sm font-bold ${
                        selectedTransaction.type === "debit"
                          ? "text-emerald-700"
                          : "text-red-700"
                      }`}
                    >
                      {selectedTransaction.type.toUpperCase()} (
                      {selectedTransaction.type === "debit"
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
                      {selectedTransaction.currency}
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

                {/* Related Account */}
                {selectedTransaction.relatedAccount && (
                  <div className="bg-purple-50 border border-purple-200 p-3">
                    <p className="text-[10px] font-bold text-purple-700 uppercase mb-2">
                      Related Account (Double-Entry)
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-slate-600">Account Type</p>
                        <p className="font-bold text-slate-900">
                          {selectedTransaction.relatedAccount.accountType}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-600">Account Name</p>
                        <p className="font-bold text-slate-900">
                          {selectedTransaction.relatedAccount.accountName}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-600">Effect</p>
                        <p
                          className={`font-bold ${
                            selectedTransaction.relatedAccount.effect ===
                            "Debit"
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {selectedTransaction.relatedAccount.effect}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-600">Balance After</p>
                        <p className="font-bold text-slate-900">
                          {selectedTransaction.currency === "KES" ? "KES" : "$"}{" "}
                          {selectedTransaction.relatedAccount.balanceAfter.toLocaleString()}
                        </p>
                      </div>
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
