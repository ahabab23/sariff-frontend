import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  Eye,
  Wallet,
  DollarSign,
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
  Building2,
  Hash,
  User,
  RefreshCw,
  ArrowRight,
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
  // Related account information for double-entry
  relatedAccount: {
    accountType:
      | "Cash at Hand"
      | "Client Account"
      | "M-Pesa"
      | "Exchange"
      | "Walk-In";
    accountName: string;
    accountId: string;
    effect: "debit" | "credit";
    balanceAfter: number;
  };
}

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  branchCode?: string;
  currency: "KES" | "USD";
  kesDebit: number;
  kesCredit: number;
  usdDebit: number;
  usdCredit: number;
  status: "active" | "inactive";
  opened: string;
  lastActivity: string;
  transactions: Transaction[];
}

export function BankAccounts() {
  const [activeTab, setActiveTab] = useState<"all" | "outstanding">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(
    null
  );
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showViewTransaction, setShowViewTransaction] = useState(false);
  const [showEditTransaction, setShowEditTransaction] = useState(false);
  const [showDeleteTransaction, setShowDeleteTransaction] = useState(false);
  const [showRelatedAccount, setShowRelatedAccount] = useState(false);
  const [showEditAccount, setShowEditAccount] = useState(false);
  const [transactionSearch, setTransactionSearch] = useState("");
  const [transactionFilter, setTransactionFilter] = useState<
    "all" | "credit" | "debit"
  >("all");
  const [currencyFilter, setCurrencyFilter] = useState<"all" | "KES" | "USD">(
    "all"
  );
  const [accountsCurrentPage, setAccountsCurrentPage] = useState(1);
  const [accountsPerPage] = useState(10);
  const [transactionsCurrentPage, setTransactionsCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(15);
  const [newAccountCurrency, setNewAccountCurrency] = useState<"KES" | "USD">(
    "KES"
  );

  // Bank accounts data
  const allAccounts: BankAccount[] = [
    {
      id: "BA-001",
      bankName: "Equity Bank",
      accountNumber: "0123456789",
      accountName: "Sarif Exchange - KES",
      branchCode: "068",
      currency: "KES",
      kesDebit: 50000,
      kesCredit: 45000,
      usdDebit: 0,
      usdCredit: 0,
      status: "active",
      opened: "2024-01-15",
      lastActivity: "2 hours ago",
      transactions: [
        {
          id: "TXN-B001",
          date: "2026-01-08 10:30",
          description: "Client Deposit - John K.",
          type: "debit",
          currency: "KES",
          amount: 50000,
          balance: 456780,
          reference: "DEP-2024-089",
          relatedAccount: {
            accountType: "Client Account",
            accountName: "John Kamau",
            accountId: "CL-2024-145",
            effect: "credit",
            balanceAfter: 110400,
          },
        },
        {
          id: "TXN-B002",
          date: "2026-01-07 14:20",
          description: "Supplier Payment",
          type: "credit",
          currency: "KES",
          amount: 25000,
          balance: 406780,
          reference: "PAY-2024-112",
          relatedAccount: {
            accountType: "Cash at Hand",
            accountName: "Cash KES - Main Office",
            accountId: "CASH-KES-001",
            effect: "debit",
            balanceAfter: 189450,
          },
        },
        {
          id: "TXN-B003",
          date: "2026-01-05 09:15",
          description: "Client Withdrawal",
          type: "credit",
          currency: "KES",
          amount: 20000,
          balance: 431780,
          reference: "WTH-2024-045",
          relatedAccount: {
            accountType: "Client Account",
            accountName: "Sarah Wanjiku",
            accountId: "CL-2024-132",
            effect: "debit",
            balanceAfter: 89200,
          },
        },
      ],
    },
    {
      id: "BA-002",
      bankName: "KCB Bank",
      accountNumber: "9876543421",
      accountName: "Sarif Exchange - USD",
      branchCode: "045",
      currency: "USD",
      kesDebit: 0,
      kesCredit: 0,
      usdDebit: 2000,
      usdCredit: 5000,
      status: "active",
      opened: "2024-02-10",
      lastActivity: "5 hours ago",
      transactions: [
        {
          id: "TXN-B004",
          date: "2026-01-07 11:45",
          description: "USD Exchange Settlement",
          type: "credit",
          currency: "USD",
          amount: 5000,
          balance: 14450,
          reference: "EXC-2024-156",
          relatedAccount: {
            accountType: "Exchange",
            accountName: "Exchange Account USD",
            accountId: "EXC-USD-001",
            effect: "debit",
            balanceAfter: 4890.75,
          },
        },
        {
          id: "TXN-B005",
          date: "2026-01-06 16:30",
          description: "International Transfer",
          type: "debit",
          currency: "USD",
          amount: 2000,
          balance: 9450,
          reference: "INT-2024-223",
          relatedAccount: {
            accountType: "Client Account",
            accountName: "David Mwangi",
            accountId: "TMP-2024-091",
            effect: "credit",
            balanceAfter: 365,
          },
        },
      ],
    },
    {
      id: "BA-003",
      bankName: "Co-operative Bank",
      accountNumber: "5544338892",
      accountName: "Sarif Exchange - Operations",
      branchCode: "011",
      currency: "KES",
      kesDebit: 75000,
      kesCredit: 0,
      usdDebit: 0,
      usdCredit: 0,
      status: "active",
      opened: "2024-03-05",
      lastActivity: "1 day ago",
      transactions: [
        {
          id: "TXN-B006",
          date: "2026-01-06 13:10",
          description: "Transfer from M-Pesa",
          type: "debit",
          currency: "KES",
          amount: 75000,
          balance: 234500,
          reference: "MPE-2024-134",
          relatedAccount: {
            accountType: "M-Pesa",
            accountName: "M-Pesa Agent CBD",
            accountId: "MP-001",
            effect: "credit",
            balanceAfter: 89200,
          },
        },
      ],
    },
  ];

  // Filtered accounts based on tab
  const accountsWithOutstanding = allAccounts.filter(
    (acc) => acc.kesDebit > 0 || acc.usdDebit > 0
  );

  const displayedAccounts =
    activeTab === "outstanding" ? accountsWithOutstanding : allAccounts;

  // Search filter
  const filteredAccounts = displayedAccounts.filter(
    (account) =>
      account.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.accountNumber.includes(searchTerm) ||
      account.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination for accounts
  const indexOfLastAccount = accountsCurrentPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccounts = filteredAccounts.slice(
    indexOfFirstAccount,
    indexOfLastAccount
  );
  const totalAccountPages = Math.ceil(
    filteredAccounts.length / accountsPerPage
  );

  // Calculate net balance (debit - credit)
  const getNetBalance = (account: BankAccount) => {
    return {
      kesNet: account.kesDebit - account.kesCredit,
      usdNet: account.usdDebit - account.usdCredit,
    };
  };

  // Calculate totals
  const totalKesDebit = allAccounts.reduce((sum, acc) => sum + acc.kesDebit, 0);
  const totalKesCredit = allAccounts.reduce(
    (sum, acc) => sum + acc.kesCredit,
    0
  );
  const totalUsdDebit = allAccounts.reduce((sum, acc) => sum + acc.usdDebit, 0);
  const totalUsdCredit = allAccounts.reduce(
    (sum, acc) => sum + acc.usdCredit,
    0
  );

  // Transaction filtering
  const filteredTransactions =
    selectedAccount?.transactions.filter((txn) => {
      const matchesSearch =
        txn.description
          .toLowerCase()
          .includes(transactionSearch.toLowerCase()) ||
        txn.reference.toLowerCase().includes(transactionSearch.toLowerCase());
      const matchesType =
        transactionFilter === "all" || txn.type === transactionFilter;
      const matchesCurrency =
        currencyFilter === "all" || txn.currency === currencyFilter;
      return matchesSearch && matchesType && matchesCurrency;
    }) || [];

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

  const handleEditAccount = (account: BankAccount) => {
    setSelectedAccount(account);
    setShowEditAccount(true);
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
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Bank Accounts
          </h2>
          <p className="text-slate-600 mt-1">
            Manage bank accounts and transactions
          </p>
        </div>
        <button
          onClick={() => setShowAddAccount(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Bank Account
        </button>
      </div>

      {/* Summary Cards - PREMIUM SHARP DESIGN */}
      <div className="grid md:grid-cols-4 gap-4">
        {/* Total Accounts Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 text-white shadow-xl shadow-blue-500/20 overflow-hidden group hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm flex items-center justify-center border-2 border-white/20">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 border border-white/30">
                <span className="text-[10px] font-bold uppercase tracking-wide">
                  Total
                </span>
              </div>
            </div>
            <p className="text-xs opacity-90 mb-1 uppercase tracking-wider font-semibold">
              Total Accounts
            </p>
            <p className="text-4xl font-bold tracking-tight">
              {allAccounts.length}
            </p>
            <div className="mt-3 pt-3 border-t border-white/20">
              <p className="text-[10px] opacity-75">All Bank Accounts</p>
            </div>
          </div>
        </motion.div>

        {/* Total Debit - Both Currencies (Money IN for Banks) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl p-6 border border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-100 px-3 py-1 border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
                Debit - Money In
              </span>
            </div>
            <TrendingUp className="w-6 h-6 text-emerald-500" />
          </div>

          {/* KES Debit */}
          <div className="mb-4 pb-4 border-b-2 border-emerald-100">
            <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
              KES Total Debit
            </p>
            <p className="text-3xl font-bold text-emerald-600 tracking-tight">
              KES {totalKesDebit.toLocaleString()}
            </p>
          </div>

          {/* USD Debit */}
          <div>
            <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
              USD Total Debit
            </p>
            <p className="text-3xl font-bold text-emerald-600 tracking-tight">
              ${totalUsdDebit.toLocaleString()}
            </p>
          </div>
        </motion.div>

        {/* Total Credit - Both Currencies (Money OUT for Banks) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white/80 backdrop-blur-xl p-6 border border-red-200 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-100 px-3 py-1 border border-red-200">
              <span className="text-[10px] font-bold text-red-700 uppercase tracking-wide">
                Credit - Money Out
              </span>
            </div>
            <TrendingDown className="w-6 h-6 text-red-500" />
          </div>

          {/* KES Credit */}
          <div className="mb-4 pb-4 border-b-2 border-red-100">
            <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
              KES Total Credit
            </p>
            <p className="text-3xl font-bold text-red-600 tracking-tight">
              KES {totalKesCredit.toLocaleString()}
            </p>
          </div>

          {/* USD Credit */}
          <div>
            <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
              USD Total Credit
            </p>
            <p className="text-3xl font-bold text-red-600 tracking-tight">
              ${totalUsdCredit.toLocaleString()}
            </p>
          </div>
        </motion.div>

        {/* Net Flow - Both Currencies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl p-6 border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 px-3 py-1 border border-blue-200">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">
                Net Flow
              </span>
            </div>
            <Activity className="w-6 h-6 text-blue-500" />
          </div>

          {/* KES Net Flow */}
          <div className="mb-4 pb-4 border-b-2 border-blue-100">
            <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
              KES Net Balance
            </p>
            <p
              className={`text-3xl font-bold tracking-tight ${
                totalKesDebit - totalKesCredit >= 0
                  ? "text-emerald-600"
                  : "text-red-600"
              }`}
            >
              {totalKesDebit - totalKesCredit >= 0 ? "+" : ""}KES{" "}
              {(totalKesDebit - totalKesCredit).toLocaleString()}
            </p>
            <p className="text-xs text-slate-600 mt-1">Debit - Credit</p>
          </div>

          {/* USD Net Flow */}
          <div>
            <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
              USD Net Balance
            </p>
            <p
              className={`text-3xl font-bold tracking-tight ${
                totalUsdDebit - totalUsdCredit >= 0
                  ? "text-emerald-600"
                  : "text-red-600"
              }`}
            >
              {totalUsdDebit - totalUsdCredit >= 0 ? "+$" : "-$"}
              {Math.abs(totalUsdDebit - totalUsdCredit).toLocaleString()}
            </p>
            <p className="text-xs text-slate-600 mt-1">Debit - Credit</p>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all duration-300 ${
            activeTab === "all"
              ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30"
              : "bg-white text-slate-600 hover:bg-blue-50 border-2 border-slate-200 hover:border-blue-300"
          }`}
        >
          <CreditCard className="w-5 h-5" />
          All Accounts
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === "all" ? "bg-white/20" : "bg-blue-100 text-blue-700"
            }`}
          >
            {allAccounts.length}
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
          With Debits
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === "outstanding"
                ? "bg-white/20"
                : "bg-red-100 text-red-700"
            }`}
          >
            {accountsWithOutstanding.length}
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
              placeholder="Search by bank name, account number, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-lg focus:shadow-blue-500/10 transition-all duration-300 placeholder:text-slate-400"
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
              onClick={() => toast.success("Exporting bank accounts list...")}
              className="flex items-center gap-2 px-5 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-all font-medium"
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bank Accounts Table */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                  Account ID
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                  Bank Details
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                  Currency
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                  KES Debit
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                  KES Credit
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                  USD Debit
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                  USD Credit
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                  Net Balance
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentAccounts.map((account, index) => {
                const { kesNet, usdNet } = getNetBalance(account);
                return (
                  <motion.tr
                    key={account.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-blue-600 group-hover:text-blue-700">
                        {account.id}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="font-bold text-slate-900 text-sm whitespace-nowrap">
                          {account.bankName}
                        </div>
                        <div className="flex flex-col gap-0.5 mt-1">
                          <span className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Building2 className="w-3 h-3" />
                            {account.accountName}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                            <Hash className="w-3 h-3" />
                            {account.accountNumber}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          account.currency === "KES"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {account.currency}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">
                      {account.kesDebit > 0
                        ? `+KES ${account.kesDebit.toLocaleString()}`
                        : "-"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                      {account.kesCredit > 0
                        ? `-KES ${account.kesCredit.toLocaleString()}`
                        : "-"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                      {account.usdDebit > 0
                        ? `+$${account.usdDebit.toLocaleString()}`
                        : "-"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-orange-600">
                      {account.usdCredit > 0
                        ? `-$${account.usdCredit.toLocaleString()}`
                        : "-"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        {kesNet !== 0 && (
                          <span
                            className={`text-xs font-bold ${
                              kesNet >= 0 ? "text-emerald-600" : "text-red-600"
                            }`}
                          >
                            {kesNet >= 0 ? "+" : ""}KES{" "}
                            {kesNet.toLocaleString()}
                          </span>
                        )}
                        {usdNet !== 0 && (
                          <span
                            className={`text-xs font-bold ${
                              usdNet >= 0 ? "text-blue-600" : "text-red-600"
                            }`}
                          >
                            {usdNet >= 0 ? "+$" : "-$"}
                            {Math.abs(usdNet).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedAccount(account)}
                          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-all text-xs font-medium rounded-lg"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Statement
                        </button>
                        <button
                          onClick={() => handleEditAccount(account)}
                          className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white hover:bg-emerald-700 transition-all text-xs font-medium rounded-lg"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalAccountPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
            <p className="text-sm text-slate-600">
              Showing {indexOfFirstAccount + 1} to{" "}
              {Math.min(indexOfLastAccount, filteredAccounts.length)} of{" "}
              {filteredAccounts.length} accounts
            </p>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setAccountsCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={accountsCurrentPage === 1}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setAccountsCurrentPage((prev) =>
                    Math.min(prev + 1, totalAccountPages)
                  )
                }
                disabled={accountsCurrentPage === totalAccountPages}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Account Statement Modal */}
      <AnimatePresence>
        {selectedAccount && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              className="bg-white max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Account Header */}
              <div className="relative bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white p-8">
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.2)_25%,rgba(255,255,255,.2)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.2)_75%,rgba(255,255,255,.2))] bg-[length:60px_60px]"></div>

                <button
                  onClick={() => setSelectedAccount(null)}
                  className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 border border-white/30 transition-all"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="relative">
                  <div className="flex items-start gap-6">
                    <div className="w-20 h-20 bg-white/15 backdrop-blur-xl flex items-center justify-center border border-white/30 shadow-xl">
                      <CreditCard className="w-10 h-10 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-3xl font-bold">
                          {selectedAccount.bankName}
                        </h2>
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded-full ${
                            selectedAccount.status === "active"
                              ? "bg-emerald-500/20 text-emerald-100 border border-emerald-400/30"
                              : "bg-red-500/20 text-red-100 border border-red-400/30"
                          }`}
                        >
                          {selectedAccount.status.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-blue-100 mb-4">
                        {selectedAccount.accountName}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-blue-200" />
                          <div>
                            <p className="text-blue-200 text-xs">
                              Account Number
                            </p>
                            <p className="font-mono font-semibold">
                              {selectedAccount.accountNumber}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-200" />
                          <div>
                            <p className="text-blue-200 text-xs">Account ID</p>
                            <p className="font-semibold">
                              {selectedAccount.id}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-200" />
                          <div>
                            <p className="text-blue-200 text-xs">Opened</p>
                            <p className="font-semibold">
                              {selectedAccount.opened}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Balance Cards */}
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    {/* KES Account */}
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-2.5 text-white border-l-4 border-emerald-800">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <Wallet className="w-3.5 h-3.5" />
                          <span className="text-xs font-bold uppercase tracking-wide">
                            KES
                          </span>
                        </div>
                        <span className="text-xs opacity-75">
                          Kenya Shillings
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-xs opacity-75">Debit (In)</p>
                          <p className="font-bold text-sm">
                            +{selectedAccount.kesDebit.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs opacity-75">Credit (Out)</p>
                          <p className="font-bold text-sm text-red-200">
                            -{selectedAccount.kesCredit.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs opacity-75">Net</p>
                          <p
                            className={`font-bold ${
                              getNetBalance(selectedAccount).kesNet >= 0
                                ? ""
                                : "text-red-200"
                            }`}
                          >
                            {getNetBalance(selectedAccount).kesNet >= 0
                              ? "+"
                              : ""}
                            {getNetBalance(
                              selectedAccount
                            ).kesNet.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* USD Account */}
                    <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-2.5 text-white border-l-4 border-cyan-800">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5" />
                          <span className="text-xs font-bold uppercase tracking-wide">
                            USD
                          </span>
                        </div>
                        <span className="text-xs opacity-75">US Dollar</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-xs opacity-75">Debit (In)</p>
                          <p className="font-bold text-sm">
                            +${selectedAccount.usdDebit.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs opacity-75">Credit (Out)</p>
                          <p className="font-bold text-sm text-red-200">
                            -${selectedAccount.usdCredit.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs opacity-75">Net</p>
                          <p
                            className={`font-bold ${
                              getNetBalance(selectedAccount).usdNet >= 0
                                ? ""
                                : "text-red-200"
                            }`}
                          >
                            {getNetBalance(selectedAccount).usdNet >= 0
                              ? "+$"
                              : "-$"}
                            {Math.abs(
                              getNetBalance(selectedAccount).usdNet
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction History */}
              <div className="p-8 overflow-y-auto flex-1 bg-white">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="w-6 h-6 text-blue-600" />
                    Transaction History
                  </h3>
                  <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold">
                    {filteredTransactions.length} of{" "}
                    {selectedAccount.transactions.length} Transactions
                  </span>
                </div>

                {/* Search, Filter, Export, Print */}
                <div className="bg-slate-50 border-b border-slate-200 p-4 mb-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                    <div className="lg:col-span-4">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search transactions..."
                          value={transactionSearch}
                          onChange={(e) => setTransactionSearch(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
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
                          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer"
                        >
                          <option value="all">All Types</option>
                          <option value="debit">Debit (Money In)</option>
                          <option value="credit">Credit (Money Out)</option>
                        </select>
                      </div>
                    </div>

                    <div className="lg:col-span-2">
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <select
                          value={currencyFilter}
                          onChange={(e) =>
                            setCurrencyFilter(
                              e.target.value as "all" | "KES" | "USD"
                            )
                          }
                          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer"
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
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white hover:bg-emerald-700 transition-all font-semibold text-sm"
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Export</span>
                      </button>
                      <button
                        onClick={handlePrintStatement}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 transition-all font-semibold text-sm"
                      >
                        <Printer className="w-4 h-4" />
                        <span className="hidden sm:inline">Print</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white border border-slate-200 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-b border-slate-300">
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
                            className="hover:bg-blue-50/50 transition-colors group"
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
                                {txn.currency}{" "}
                                {txn.currency === "USD" ? "$" : ""}
                                {txn.amount.toLocaleString()}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-base font-bold text-slate-900 whitespace-nowrap text-right">
                              {txn.currency} {txn.currency === "USD" ? "$" : ""}
                              {txn.balance.toLocaleString()}
                            </td>
                            <td className="px-4 py-4 text-sm text-blue-600 font-mono whitespace-nowrap">
                              {txn.reference}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => handleViewTransaction(txn)}
                                  className="p-2 bg-blue-600 text-white hover:bg-blue-700 transition-all"
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
                                  onClick={() => handleDeleteTransaction(txn)}
                                  className="p-2 bg-red-600 text-white hover:bg-red-700 transition-all"
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
                        disabled={
                          transactionsCurrentPage === totalTransactionPages
                        }
                        className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
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

      {/* Add Bank Account Modal */}
      <AnimatePresence>
        {showAddAccount && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              className="bg-white shadow-2xl max-w-2xl w-full overflow-hidden border border-blue-600"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 p-4">
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.15)_25%,rgba(255,255,255,.15)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.15)_75%,rgba(255,255,255,.15))] bg-[length:20px_20px]"></div>
                <button
                  onClick={() => setShowAddAccount(false)}
                  className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 transition-all duration-200 border border-white/20 hover:border-white/40 group"
                  title="Close"
                >
                  <X className="w-4 h-4 text-white group-hover:rotate-90 transition-transform duration-300" />
                </button>
                <div className="relative flex items-center gap-3">
                  <div className="w-11 h-11 bg-white/15 backdrop-blur-xl flex items-center justify-center border border-white/30 shadow-lg">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white tracking-tight">
                      Add Bank Account
                    </h2>
                    <p className="text-blue-50 text-xs font-medium">
                      Register new bank account
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-4 max-h-[calc(100vh-180px)] overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50/30">
                <form className="space-y-4">
                  {/* Bank Details Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-blue-500">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-sm">
                        <Building2 className="w-3.5 h-3.5 text-white" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                        Bank Details
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3 bg-white p-3.5 border border-slate-200 shadow-sm">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-blue-600" />
                          Bank Name *
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 focus:bg-white transition-all font-medium text-slate-900 text-sm placeholder:text-slate-400"
                          placeholder="Equity Bank"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                          <Hash className="w-3 h-3 text-blue-600" />
                          Account Number *
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 focus:bg-white transition-all font-medium text-slate-900 text-sm placeholder:text-slate-400"
                          placeholder="1234567890"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                          <CreditCard className="w-3 h-3 text-blue-600" />
                          Account Name *
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 focus:bg-white transition-all font-medium text-slate-900 text-sm placeholder:text-slate-400"
                          placeholder="Sarif Exchange"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                          <Phone className="w-3 h-3 text-blue-600" />
                          Branch Code
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 focus:bg-white transition-all font-medium text-slate-900 text-sm placeholder:text-slate-400"
                          placeholder="068"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Account Type Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-amber-500">
                      <div className="w-6 h-6 bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-sm">
                        <Wallet className="w-3.5 h-3.5 text-white" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                        Account Type
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {/* KES Account Card */}
                      <label className="group cursor-pointer">
                        <input
                          type="radio"
                          name="accountCurrency"
                          value="kes"
                          className="peer sr-only"
                          defaultChecked
                        />
                        <div className="p-3 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 peer-checked:border-emerald-600 peer-checked:shadow-md peer-checked:shadow-emerald-500/20 transition-all hover:border-emerald-400 hover:shadow-sm relative overflow-hidden group-hover:scale-[1.02] duration-200">
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-green-600/5 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                          <div className="relative flex items-center gap-2 mb-1.5">
                            <div className="w-7 h-7 bg-emerald-600 flex items-center justify-center shadow-sm">
                              <Wallet className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div>
                              <span className="font-bold text-xs text-slate-900 block leading-tight">
                                KES ACCOUNT
                              </span>
                              <span className="text-[9px] text-emerald-600 font-semibold">
                                Kenyan Shilling
                              </span>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-600 font-medium leading-snug relative">
                            Local currency • Standard
                          </p>
                        </div>
                      </label>

                      {/* USD Account Card */}
                      <label className="group cursor-pointer">
                        <input
                          type="radio"
                          name="accountCurrency"
                          value="usd"
                          className="peer sr-only"
                        />
                        <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 peer-checked:border-blue-600 peer-checked:shadow-md peer-checked:shadow-blue-500/20 transition-all hover:border-blue-400 hover:shadow-sm relative overflow-hidden group-hover:scale-[1.02] duration-200">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-cyan-600/5 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                          <div className="relative flex items-center gap-2 mb-1.5">
                            <div className="w-7 h-7 bg-blue-600 flex items-center justify-center shadow-sm">
                              <DollarSign className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div>
                              <span className="font-bold text-xs text-slate-900 block leading-tight">
                                USD ACCOUNT
                              </span>
                              <span className="text-[9px] text-blue-600 font-semibold">
                                US Dollar
                              </span>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-600 font-medium leading-snug relative">
                            Foreign currency • Premium
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Opening Balance Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-emerald-500">
                      <div className="w-6 h-6 bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-sm">
                        <DollarSign className="w-3.5 h-3.5 text-white" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                        Opening Balance
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3 bg-white p-3.5 border border-slate-200 shadow-sm">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                          <Wallet className="w-3 h-3 text-emerald-600" />
                          KES
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-700 font-bold text-[10px]">
                            KES
                          </span>
                          <input
                            type="number"
                            className="w-full pl-12 pr-3 py-2 bg-emerald-50 border border-emerald-300 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 focus:bg-white transition-all font-semibold text-slate-900 text-sm placeholder:text-emerald-400/60"
                            placeholder="0.00"
                            defaultValue="0"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-blue-600" />
                          USD
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-700 font-bold text-[10px]">
                            USD
                          </span>
                          <input
                            type="number"
                            className="w-full pl-12 pr-3 py-2 bg-blue-50 border border-blue-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 focus:bg-white transition-all font-semibold text-slate-900 text-sm placeholder:text-blue-400/60"
                            placeholder="0.00"
                            defaultValue="0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="border-t border-slate-200 p-4 bg-gradient-to-r from-slate-50 to-blue-50/30">
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowAddAccount(false)}
                    className="flex-1 px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all font-semibold text-slate-700 text-sm tracking-wide shadow-sm hover:shadow"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      toast.success("✓ Bank Account Added Successfully!");
                      setShowAddAccount(false);
                    }}
                    className="flex-1 px-5 py-2.5 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2 text-sm tracking-wide border border-blue-700/50 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Plus className="w-4 h-4" />
                    Add Account
                  </button>
                </div>
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
                  selectedTransaction.type === "credit"
                    ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700"
                    : "bg-gradient-to-r from-red-600 via-rose-600 to-red-700"
                }`}
              >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

                <div className="relative flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
                      {selectedTransaction.type === "debit" ? (
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
                          selectedTransaction.type === "debit"
                            ? "text-emerald-100"
                            : "text-red-100"
                        }`}
                      >
                        {selectedTransaction.type === "debit"
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
                  {/* Transaction Info Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3 border border-slate-200">
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                        Transaction ID
                      </p>
                      <p className="text-sm font-bold text-slate-900 font-mono">
                        {selectedTransaction.id}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-3 border border-slate-200">
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                        Reference
                      </p>
                      <p className="text-sm font-bold text-blue-600 font-mono">
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
                        {selectedTransaction.date}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-3 border border-slate-200">
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                        Currency
                      </p>
                      <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        {selectedTransaction.currency === "USD" ? (
                          <>
                            <DollarSign className="w-3.5 h-3.5 text-blue-600" />{" "}
                            USD
                          </>
                        ) : (
                          <>
                            <Wallet className="w-3.5 h-3.5 text-emerald-600" />{" "}
                            KES
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Description & Amount Card */}
                  <div
                    className={`p-4 text-white ${
                      selectedTransaction.type === "debit"
                        ? "bg-gradient-to-br from-emerald-600 to-teal-600"
                        : "bg-gradient-to-br from-red-600 to-rose-600"
                    }`}
                  >
                    <p className="text-xs opacity-90 mb-2">Description</p>
                    <p className="text-lg font-bold mb-4">
                      {selectedTransaction.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/20">
                      <div>
                        <p className="text-[10px] opacity-75 mb-1">Amount</p>
                        <p className="text-xl font-bold">
                          {selectedTransaction.type === "debit" ? "+" : "-"}
                          {selectedTransaction.currency === "USD"
                            ? "$"
                            : "KES "}
                          {selectedTransaction.amount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] opacity-75 mb-1">
                          Balance After
                        </p>
                        <p className="text-xl font-bold">
                          {selectedTransaction.currency === "USD"
                            ? "$"
                            : "KES "}
                          {selectedTransaction.balance.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Type Badge */}
                  <div
                    className={`flex items-center justify-between p-3 border-2 ${
                      selectedTransaction.type === "debit"
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 flex items-center justify-center ${
                          selectedTransaction.type === "debit"
                            ? "bg-emerald-100"
                            : "bg-red-100"
                        }`}
                      >
                        <Activity
                          className={`w-4 h-4 ${
                            selectedTransaction.type === "debit"
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          Transaction Type
                        </p>
                        <p
                          className={`text-xs font-bold ${
                            selectedTransaction.type === "debit"
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {selectedTransaction.type.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        toast.success("Transaction receipt downloaded!")
                      }
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-white text-xs font-bold transition-all ${
                        selectedTransaction.type === "debit"
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      Receipt
                    </button>
                  </div>
                </div>
              </div>

              {/* Fixed Footer with Action Buttons */}
              <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-blue-50 border-t-2 border-slate-200 flex gap-3">
                <button
                  onClick={() => {
                    setShowViewTransaction(false);
                    setSelectedTransaction(null);
                  }}
                  className="flex-1 px-6 py-3 bg-white border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all font-bold text-slate-700 shadow-sm hover:shadow"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowViewTransaction(false);
                    setShowRelatedAccount(true);
                  }}
                  className={`flex-1 px-6 py-3 text-white font-bold shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95 ${
                    selectedTransaction.type === "credit"
                      ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 shadow-emerald-500/30 hover:shadow-emerald-500/40"
                      : "bg-gradient-to-r from-red-600 via-rose-600 to-red-700 shadow-red-500/30 hover:shadow-red-500/40"
                  }`}
                >
                  Related Account
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Transaction Modal - PREMIUM DESIGN */}
      <AnimatePresence>
        {showEditTransaction && selectedTransaction && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col"
            >
              {/* Premium Header with Gradient Background */}
              <div className="relative bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 px-6 py-4">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

                <div className="relative flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
                      <Edit3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white mb-0.5">
                        Edit Transaction
                      </h2>
                      <p className="text-blue-100 text-xs font-medium">
                        Update bank transaction details
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

              {/* Scrollable Form Content */}
              <div className="px-6 py-5 overflow-y-auto flex-1">
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">
                        Transaction ID
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedTransaction.id}
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
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-900 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
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
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 uppercase flex items-center gap-1">
                        Type
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        defaultValue={selectedTransaction.type}
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
                      >
                        <option value="credit">Credit</option>
                        <option value="debit">Debit</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 uppercase flex items-center gap-1">
                        Currency
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        defaultValue={selectedTransaction.currency}
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
                      >
                        <option value="KES">KES</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 uppercase flex items-center gap-1">
                        Amount
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        defaultValue={selectedTransaction.amount}
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-900 text-sm font-bold focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Fixed Footer with Action Buttons */}
              <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-blue-50 border-t-2 border-slate-200 flex gap-3">
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
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all hover:scale-105 active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Transaction Modal - PREMIUM DESIGN */}
      <AnimatePresence>
        {showDeleteTransaction && selectedTransaction && (
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
                {/* Warning Icon */}
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

                {/* Transaction Details */}
                <div className="bg-red-50 border-2 border-red-200 p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-600 uppercase">
                      Transaction ID:
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-900">
                      {selectedTransaction.id}
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
                      {selectedTransaction.currency}{" "}
                      {selectedTransaction.currency === "USD" ? "$" : ""}
                      {selectedTransaction.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Fixed Footer with Action Buttons */}
              <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-red-50 border-t-2 border-slate-200 flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteTransaction(false);
                    setSelectedTransaction(null);
                  }}
                  className="flex-1 px-6 py-3 bg-white border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all font-bold text-slate-700 shadow-sm hover:shadow"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteTransaction}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-bold shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all hover:scale-105 active:scale-95"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Related Account Modal - PREMIUM DESIGN */}
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
                {/* Premium Header */}
                <div
                  className={`relative px-6 py-4 ${
                    selectedTransaction.relatedAccount.effect === "credit"
                      ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700"
                      : "bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700"
                  }`}
                >
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

                  <div className="relative flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
                        {selectedTransaction.relatedAccount.effect ===
                        "credit" ? (
                          <ArrowUpCircle className="w-6 h-6 text-white" />
                        ) : (
                          <ArrowDownCircle className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white mb-0.5">
                          Related Account
                        </h2>
                        <p
                          className={`text-xs font-medium ${
                            selectedTransaction.relatedAccount.effect ===
                            "credit"
                              ? "text-emerald-100"
                              : "text-blue-100"
                          }`}
                        >
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

                {/* Scrollable Content */}
                <div className="px-6 py-5 overflow-y-auto flex-1">
                  <div className="space-y-4">
                    {/* Account Type Badge */}
                    <div className="bg-slate-50 p-4 border-2 border-slate-200">
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">
                        Account Type
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                          {selectedTransaction.relatedAccount.accountType ===
                            "Cash at Hand" && (
                            <Wallet className="w-5 h-5 text-blue-600" />
                          )}
                          {selectedTransaction.relatedAccount.accountType ===
                            "Client Account" && (
                            <User className="w-5 h-5 text-blue-600" />
                          )}
                          {selectedTransaction.relatedAccount.accountType ===
                            "M-Pesa" && (
                            <Phone className="w-5 h-5 text-blue-600" />
                          )}
                          {selectedTransaction.relatedAccount.accountType ===
                            "Exchange" && (
                            <RefreshCw className="w-5 h-5 text-blue-600" />
                          )}
                          {selectedTransaction.relatedAccount.accountType ===
                            "Walk-In" && (
                            <User className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-lg font-bold text-slate-900">
                            {selectedTransaction.relatedAccount.accountType}
                          </p>
                          <p className="text-xs text-slate-600">
                            {selectedTransaction.relatedAccount.accountName}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Account Details */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-3 border border-slate-200">
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                          Account ID
                        </p>
                        <p className="text-sm font-bold text-slate-900 font-mono">
                          {selectedTransaction.relatedAccount.accountId}
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
                        selectedTransaction.relatedAccount.effect === "credit"
                          ? "bg-gradient-to-br from-emerald-600 to-teal-600"
                          : "bg-gradient-to-br from-blue-600 to-cyan-600"
                      }`}
                    >
                      <p className="text-xs opacity-90 mb-2">
                        How This Account Was Affected
                      </p>
                      <div className="flex items-center gap-2 mb-4">
                        {selectedTransaction.relatedAccount.effect ===
                        "credit" ? (
                          <ArrowUpCircle className="w-6 h-6" />
                        ) : (
                          <ArrowDownCircle className="w-6 h-6" />
                        )}
                        <p className="text-2xl font-bold uppercase">
                          {selectedTransaction.relatedAccount.effect}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/20">
                        <div>
                          <p className="text-[10px] opacity-75 mb-1">Amount</p>
                          <p className="text-xl font-bold">
                            {selectedTransaction.relatedAccount.effect ===
                            "credit"
                              ? "+"
                              : "-"}
                            {selectedTransaction.currency === "USD"
                              ? "$"
                              : "KES "}
                            {selectedTransaction.amount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] opacity-75 mb-1">
                            Balance After
                          </p>
                          <p className="text-xl font-bold">
                            {selectedTransaction.currency === "USD"
                              ? "$"
                              : "KES "}
                            {selectedTransaction.relatedAccount.balanceAfter.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Transaction Flow */}
                    <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 border-2 border-slate-200">
                      <p className="text-xs font-bold text-slate-700 uppercase mb-3">
                        Transaction Flow
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-blue-100 flex items-center justify-center mx-auto mb-2">
                            <Building2 className="w-6 h-6 text-blue-600" />
                          </div>
                          <p className="text-xs font-bold text-slate-900">
                            Bank Account
                          </p>
                          <p
                            className={`text-xs font-bold mt-1 ${
                              selectedTransaction.type === "credit"
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                          >
                            {selectedTransaction.type.toUpperCase()}
                          </p>
                        </div>

                        <div className="flex-1 mx-4">
                          <div className="flex items-center">
                            <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-300 to-emerald-300"></div>
                            <ArrowRight className="w-5 h-5 text-blue-600 mx-2" />
                            <div className="flex-1 h-0.5 bg-gradient-to-r from-emerald-300 to-blue-300"></div>
                          </div>
                          <p className="text-[10px] text-center text-slate-600 mt-1 font-semibold">
                            {selectedTransaction.currency}{" "}
                            {selectedTransaction.amount.toLocaleString()}
                          </p>
                        </div>

                        <div className="text-center">
                          <div
                            className={`w-12 h-12 flex items-center justify-center mx-auto mb-2 ${
                              selectedTransaction.relatedAccount.effect ===
                              "credit"
                                ? "bg-emerald-100"
                                : "bg-blue-100"
                            }`}
                          >
                            {selectedTransaction.relatedAccount.accountType ===
                              "Cash at Hand" && (
                              <Wallet className="w-6 h-6 text-blue-600" />
                            )}
                            {selectedTransaction.relatedAccount.accountType ===
                              "Client Account" && (
                              <User className="w-6 h-6 text-blue-600" />
                            )}
                            {selectedTransaction.relatedAccount.accountType ===
                              "M-Pesa" && (
                              <Phone className="w-6 h-6 text-blue-600" />
                            )}
                          </div>
                          <p className="text-xs font-bold text-slate-900">
                            {selectedTransaction.relatedAccount.accountType}
                          </p>
                          <p
                            className={`text-xs font-bold mt-1 ${
                              selectedTransaction.relatedAccount.effect ===
                              "credit"
                                ? "text-emerald-600"
                                : "text-blue-600"
                            }`}
                          >
                            {selectedTransaction.relatedAccount.effect.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fixed Footer */}
                <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-blue-50 border-t-2 border-slate-200">
                  <button
                    onClick={() => setShowRelatedAccount(false)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all hover:scale-105 active:scale-95"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
      </AnimatePresence>

      {/* Edit Bank Account Modal */}
      <AnimatePresence>
        {showEditAccount && selectedAccount && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white shadow-2xl max-w-xl w-full max-h-[85vh] overflow-hidden flex flex-col"
            >
              {/* Premium Header with Gradient Background */}
              <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-6 py-4">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

                <div className="relative flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
                      <Edit3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white mb-0.5">
                        Edit Bank Account
                      </h2>
                      <p className="text-blue-100 text-xs font-medium">
                        Update bank account information and settings
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-xs font-bold text-white">
                          <Hash className="w-3 h-3" />
                          {selectedAccount.id}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 backdrop-blur-sm border rounded-lg text-xs font-bold ${
                            selectedAccount.status === "active"
                              ? "bg-emerald-500/30 border-emerald-400/40 text-emerald-100"
                              : "bg-red-500/30 border-red-400/40 text-red-100"
                          }`}
                        >
                          <Activity className="w-3 h-3" />
                          {selectedAccount.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowEditAccount(false)}
                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Account Balance Preview */}
              <div className="px-6 py-3 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
                <div className="grid grid-cols-2 gap-3">
                  {/* KES Balance */}
                  <div className="bg-white p-3 border border-blue-200 shadow-sm">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Wallet className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                        KES
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 text-xs">
                      <div>
                        <p className="text-[10px] text-slate-500 mb-0.5">
                          Credit
                        </p>
                        <p className="text-xs font-bold text-emerald-600">
                          +{selectedAccount.kesCredit.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 mb-0.5">
                          Debit
                        </p>
                        <p className="text-xs font-bold text-red-600">
                          -{selectedAccount.kesDebit.toLocaleString()}
                        </p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-[10px] text-slate-500 mb-0.5">Net</p>
                        <p
                          className={`text-sm font-bold ${
                            selectedAccount.kesCredit -
                              selectedAccount.kesDebit >=
                            0
                              ? "text-blue-600"
                              : "text-red-600"
                          }`}
                        >
                          {selectedAccount.kesCredit -
                            selectedAccount.kesDebit >=
                          0
                            ? "+"
                            : ""}
                          {(
                            selectedAccount.kesCredit - selectedAccount.kesDebit
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* USD Balance */}
                  <div className="bg-white p-3 border border-indigo-200 shadow-sm">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                        USD
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 text-xs">
                      <div>
                        <p className="text-[10px] text-slate-500 mb-0.5">
                          Credit
                        </p>
                        <p className="text-xs font-bold text-emerald-600">
                          +${selectedAccount.usdCredit.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 mb-0.5">
                          Debit
                        </p>
                        <p className="text-xs font-bold text-red-600">
                          -${selectedAccount.usdDebit.toLocaleString()}
                        </p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-[10px] text-slate-500 mb-0.5">Net</p>
                        <p
                          className={`text-sm font-bold ${
                            selectedAccount.usdCredit -
                              selectedAccount.usdDebit >=
                            0
                              ? "text-indigo-600"
                              : "text-red-600"
                          }`}
                        >
                          {selectedAccount.usdCredit -
                            selectedAccount.usdDebit >=
                          0
                            ? "+$"
                            : "-$"}
                          {Math.abs(
                            selectedAccount.usdCredit - selectedAccount.usdDebit
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scrollable Form Content */}
              <div className="px-6 py-5 overflow-y-auto flex-1">
                <form className="space-y-6">
                  {/* Bank Account Information Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Bank Account Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Bank Name */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-slate-400" />
                          Bank Name
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          defaultValue={selectedAccount.bankName}
                          placeholder="Enter bank name"
                          className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        />
                      </div>

                      {/* Account Number */}
                      <div className="group">
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-slate-400" />
                          Account Number
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          defaultValue={selectedAccount.accountNumber}
                          placeholder="0123456789"
                          className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        />
                      </div>

                      {/* Branch Code */}
                      <div className="group">
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                          <Hash className="w-4 h-4 text-slate-400" />
                          Branch Code
                        </label>
                        <input
                          type="text"
                          defaultValue={selectedAccount.branchCode}
                          placeholder="068"
                          className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        />
                      </div>
                    </div>

                    {/* Account Name */}
                    <div className="group">
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-slate-400" />
                        Account Name
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedAccount.accountName}
                        placeholder="Sarif Exchange - KES"
                        className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                    </div>

                    {/* Currency and Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="group">
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-slate-400" />
                          Primary Currency
                        </label>
                        <select
                          defaultValue={selectedAccount.currency}
                          className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
                        >
                          <option value="KES">KES - Kenya Shillings</option>
                          <option value="USD">USD - US Dollar</option>
                        </select>
                      </div>

                      <div className="group">
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-slate-400" />
                          Account Status
                        </label>
                        <select
                          defaultValue={selectedAccount.status}
                          className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    {/* Opened Date */}
                    <div className="group">
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        Account Opened
                      </label>
                      <input
                        type="text"
                        value={selectedAccount.opened}
                        disabled
                        className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 text-slate-500 font-medium cursor-not-allowed"
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Fixed Footer with Action Buttons */}
              <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-blue-50 border-t-2 border-slate-200 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditAccount(false)}
                  className="flex-1 px-6 py-3.5 bg-white border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all font-bold text-slate-700 shadow-sm hover:shadow"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.success("Bank account updated successfully!");
                    setShowEditAccount(false);
                  }}
                  className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all hover:scale-105 active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Bank Account Modal */}
      <AnimatePresence>
        {showAddAccount && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 px-6 py-4 border-b-4 border-blue-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Plus className="w-6 h-6" />
                      Add New Bank Account
                    </h3>
                    <p className="text-xs text-blue-100 mt-1">
                      Create a new bank account record
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddAccount(false)}
                    className="p-2 hover:bg-white/20 transition-all"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <form className="space-y-4">
                  {/* Bank Details Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Bank Name */}
                    <div className="group">
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        Bank Name
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Equity Bank"
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                    </div>

                    {/* Account Number */}
                    <div className="group">
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <Hash className="w-4 h-4 text-slate-400" />
                        Account Number
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="0123456789"
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                    </div>

                    {/* Branch Code */}
                    <div className="group">
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <Hash className="w-4 h-4 text-slate-400" />
                        Branch Code
                      </label>
                      <input
                        type="text"
                        placeholder="068"
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                    </div>

                    {/* Account Type/Currency */}
                    <div className="group">
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-slate-400" />
                        Account Type/Currency
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newAccountCurrency}
                        onChange={(e) =>
                          setNewAccountCurrency(e.target.value as "KES" | "USD")
                        }
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
                      >
                        <option value="KES">KES - Kenya Shillings</option>
                        <option value="USD">USD - US Dollar</option>
                      </select>
                    </div>
                  </div>

                  {/* Account Name */}
                  <div className="group">
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-slate-400" />
                      Account Name
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Sarif Exchange - KES"
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>

                  {/* Opening Balance Section */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 border-2 border-blue-200">
                    <p className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      Opening Balance (Credit)
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      {/* KES Opening Balance */}
                      <div className="group">
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          Opening Balance KES
                          {newAccountCurrency === "KES" && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          disabled={newAccountCurrency === "USD"}
                          className={`w-full px-4 py-3 border-2 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none transition-all ${
                            newAccountCurrency === "USD"
                              ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                              : "bg-white border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                          }`}
                        />
                        {newAccountCurrency === "USD" && (
                          <p className="text-xs text-slate-500 mt-1">
                            Disabled for USD accounts
                          </p>
                        )}
                      </div>

                      {/* USD Opening Balance */}
                      <div className="group">
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          Opening Balance USD
                          {newAccountCurrency === "USD" && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          disabled={newAccountCurrency === "KES"}
                          className={`w-full px-4 py-3 border-2 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none transition-all ${
                            newAccountCurrency === "KES"
                              ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                              : "bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                          }`}
                        />
                        {newAccountCurrency === "KES" && (
                          <p className="text-xs text-slate-500 mt-1">
                            Disabled for KES accounts
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 p-3 bg-blue-100/50 border border-blue-200">
                      <p className="text-xs text-blue-800 font-semibold">
                        💡 Opening balance is recorded as{" "}
                        <strong>Credit (Money In)</strong> for bank accounts
                      </p>
                    </div>
                  </div>

                  {/* Account Status */}
                  <div className="group">
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-slate-400" />
                      Account Status
                    </label>
                    <select
                      defaultValue="active"
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 px-6 py-4 bg-gradient-to-r from-slate-50 to-blue-50 border-t-2 border-slate-200 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddAccount(false)}
                  className="flex-1 px-6 py-3 bg-white border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all font-bold text-slate-700 shadow-sm hover:shadow"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.success("Bank account added successfully!");
                    setShowAddAccount(false);
                    setNewAccountCurrency("KES");
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all hover:scale-105 active:scale-95"
                >
                  Add Bank Account
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
