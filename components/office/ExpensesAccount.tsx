import { useState } from "react";
import {
  Receipt,
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  X,
  FileText,
  Download,
  Printer,
  Eye,
  Tag,
  DollarSign,
  Wallet,
  Info,
  ArrowUpCircle,
  ArrowDownCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface ExpenseTransaction {
  id: string;
  date: string;
  description: string;
  category: string;
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
  kesTotal: number;
  usdTotal: number;
  transactions: ExpenseTransaction[];
  color: string;
}

export function ExpensesAccount() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ExpenseCategory | null>(null);
  const [transactionSearch, setTransactionSearch] = useState("");
  const [categoriesCurrentPage, setCategoriesCurrentPage] = useState(1);
  const [transactionsCurrentPage, setTransactionsCurrentPage] = useState(1);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showEditExpense, setShowEditExpense] = useState(false);
  const [selectedExpense, setSelectedExpense] =
    useState<ExpenseTransaction | null>(null);

  // Mock data
  const allCategories: ExpenseCategory[] = [
    {
      id: "EXP-001",
      name: "Rent & Utilities",
      kesTotal: 185000,
      usdTotal: 0,
      color: "purple",
      transactions: [
        {
          id: "TXN-E001",
          date: "2026-01-01 10:00",
          description: "Monthly Office Rent",
          category: "Rent & Utilities",
          currency: "KES",
          amount: 150000,
          reference: "RENT-JAN-2026",
          paymentMethod: "Bank Transfer",
          vendor: "Prime Properties Ltd",
          approvedBy: "John Kamau",
        },
        {
          id: "TXN-E002",
          date: "2026-01-05 14:30",
          description: "Electricity Bill",
          category: "Rent & Utilities",
          currency: "KES",
          amount: 25000,
          reference: "KPLC-12345",
          paymentMethod: "M-Pesa",
          vendor: "Kenya Power",
          approvedBy: "Sarah Wanjiku",
        },
        {
          id: "TXN-E003",
          date: "2026-01-08 09:15",
          description: "Water Bill",
          category: "Rent & Utilities",
          currency: "KES",
          amount: 10000,
          reference: "NCWSC-67890",
          paymentMethod: "Bank Transfer",
          vendor: "Nairobi Water",
          approvedBy: "John Kamau",
        },
      ],
    },
    {
      id: "EXP-002",
      name: "Salaries & Wages",
      kesTotal: 450000,
      usdTotal: 1500,
      color: "blue",
      transactions: [
        {
          id: "TXN-E004",
          date: "2026-01-10 08:00",
          description: "Staff Salaries - January",
          category: "Salaries & Wages",
          currency: "KES",
          amount: 450000,
          reference: "SAL-JAN-2026",
          paymentMethod: "Bank Transfer",
          vendor: "Internal",
          approvedBy: "Managing Director",
        },
        {
          id: "TXN-E005",
          date: "2026-01-10 08:30",
          description: "Consultant Fee - IT Support",
          category: "Salaries & Wages",
          currency: "USD",
          amount: 1500,
          reference: "CONS-IT-JAN",
          paymentMethod: "Bank Transfer",
          vendor: "TechPro Solutions",
          approvedBy: "John Kamau",
        },
      ],
    },
    {
      id: "EXP-003",
      name: "Office Supplies",
      kesTotal: 45000,
      usdTotal: 0,
      color: "emerald",
      transactions: [
        {
          id: "TXN-E006",
          date: "2026-01-07 11:20",
          description: "Stationery Purchase",
          category: "Office Supplies",
          currency: "KES",
          amount: 25000,
          reference: "STAT-2026-001",
          paymentMethod: "Cash",
          vendor: "Office Mart",
          approvedBy: "Sarah Wanjiku",
        },
        {
          id: "TXN-E007",
          date: "2026-01-12 15:45",
          description: "Printer Ink & Paper",
          category: "Office Supplies",
          currency: "KES",
          amount: 20000,
          reference: "STAT-2026-002",
          paymentMethod: "M-Pesa",
          vendor: "Quick Print Supplies",
          approvedBy: "John Kamau",
        },
      ],
    },
    {
      id: "EXP-004",
      name: "Marketing & Advertising",
      kesTotal: 120000,
      usdTotal: 800,
      color: "pink",
      transactions: [
        {
          id: "TXN-E008",
          date: "2026-01-03 10:30",
          description: "Facebook Ads Campaign",
          category: "Marketing & Advertising",
          currency: "USD",
          amount: 500,
          reference: "FB-ADS-JAN",
          paymentMethod: "Credit Card",
          vendor: "Meta Platforms",
          approvedBy: "Marketing Manager",
        },
        {
          id: "TXN-E009",
          date: "2026-01-09 13:00",
          description: "Billboard Advertisement",
          category: "Marketing & Advertising",
          currency: "KES",
          amount: 120000,
          reference: "BILL-CBD-JAN",
          paymentMethod: "Bank Transfer",
          vendor: "CityAds Kenya",
          approvedBy: "Managing Director",
        },
        {
          id: "TXN-E010",
          date: "2026-01-11 16:20",
          description: "Google Ads Campaign",
          category: "Marketing & Advertising",
          currency: "USD",
          amount: 300,
          reference: "GOOG-ADS-JAN",
          paymentMethod: "Credit Card",
          vendor: "Google LLC",
          approvedBy: "Marketing Manager",
        },
      ],
    },
    {
      id: "EXP-005",
      name: "Insurance",
      kesTotal: 75000,
      usdTotal: 0,
      color: "indigo",
      transactions: [
        {
          id: "TXN-E011",
          date: "2026-01-02 09:00",
          description: "Business Insurance Premium",
          category: "Insurance",
          currency: "KES",
          amount: 75000,
          reference: "INS-Q1-2026",
          paymentMethod: "Bank Transfer",
          vendor: "Shield Insurance Co.",
          approvedBy: "Managing Director",
        },
      ],
    },
    {
      id: "EXP-006",
      name: "Bank Charges & Fees",
      kesTotal: 12500,
      usdTotal: 45,
      color: "amber",
      transactions: [
        {
          id: "TXN-E012",
          date: "2026-01-06 00:00",
          description: "Monthly Bank Charges",
          category: "Bank Charges & Fees",
          currency: "KES",
          amount: 8500,
          reference: "BANK-FEE-JAN",
          paymentMethod: "Auto Debit",
          vendor: "Equity Bank",
          approvedBy: "System",
        },
        {
          id: "TXN-E013",
          date: "2026-01-06 00:00",
          description: "Transaction Fees",
          category: "Bank Charges & Fees",
          currency: "KES",
          amount: 4000,
          reference: "TXN-FEE-JAN",
          paymentMethod: "Auto Debit",
          vendor: "KCB Bank",
          approvedBy: "System",
        },
        {
          id: "TXN-E014",
          date: "2026-01-06 00:00",
          description: "International Transfer Fee",
          category: "Bank Charges & Fees",
          currency: "USD",
          amount: 45,
          reference: "SWIFT-FEE-JAN",
          paymentMethod: "Auto Debit",
          vendor: "KCB Bank",
          approvedBy: "System",
        },
      ],
    },
    {
      id: "EXP-007",
      name: "Transport & Fuel",
      kesTotal: 68000,
      usdTotal: 0,
      color: "orange",
      transactions: [
        {
          id: "TXN-E015",
          date: "2026-01-04 12:00",
          description: "Fuel Purchase",
          category: "Transport & Fuel",
          currency: "KES",
          amount: 35000,
          reference: "FUEL-JAN-001",
          paymentMethod: "Cash",
          vendor: "Shell Petrol Station",
          approvedBy: "Operations Manager",
        },
        {
          id: "TXN-E016",
          date: "2026-01-10 10:30",
          description: "Vehicle Maintenance",
          category: "Transport & Fuel",
          currency: "KES",
          amount: 33000,
          reference: "MAINT-JAN-001",
          paymentMethod: "M-Pesa",
          vendor: "AutoCare Garage",
          approvedBy: "Operations Manager",
        },
      ],
    },
    {
      id: "EXP-008",
      name: "Technology & Software",
      kesTotal: 25000,
      usdTotal: 650,
      color: "cyan",
      transactions: [
        {
          id: "TXN-E017",
          date: "2026-01-01 00:00",
          description: "Microsoft 365 Subscription",
          category: "Technology & Software",
          currency: "USD",
          amount: 250,
          reference: "MS365-JAN",
          paymentMethod: "Credit Card",
          vendor: "Microsoft Corporation",
          approvedBy: "IT Manager",
        },
        {
          id: "TXN-E018",
          date: "2026-01-01 00:00",
          description: "Accounting Software License",
          category: "Technology & Software",
          currency: "USD",
          amount: 400,
          reference: "ACCT-SW-JAN",
          paymentMethod: "Credit Card",
          vendor: "QuickBooks",
          approvedBy: "Finance Manager",
        },
        {
          id: "TXN-E019",
          date: "2026-01-08 14:00",
          description: "Internet Service",
          category: "Technology & Software",
          currency: "KES",
          amount: 25000,
          reference: "INET-JAN-2026",
          paymentMethod: "M-Pesa",
          vendor: "Safaricom Business",
          approvedBy: "IT Manager",
        },
      ],
    },
  ];

  // Filter categories
  const filteredCategories = allCategories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination for categories
  const categoriesPerPage = 10;
  const indexOfLastCategory = categoriesCurrentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );
  const totalCategoryPages = Math.ceil(
    filteredCategories.length / categoriesPerPage
  );

  // Calculate totals
  const totalKes = allCategories.reduce((sum, cat) => sum + cat.kesTotal, 0);
  const totalUsd = allCategories.reduce((sum, cat) => sum + cat.usdTotal, 0);

  // Transaction filtering
  const filteredTransactions =
    selectedCategory?.transactions.filter((txn) => {
      const matchesSearch =
        txn.description
          .toLowerCase()
          .includes(transactionSearch.toLowerCase()) ||
        txn.reference.toLowerCase().includes(transactionSearch.toLowerCase()) ||
        txn.vendor.toLowerCase().includes(transactionSearch.toLowerCase());
      return matchesSearch;
    }) || [];

  // Pagination for transactions
  const transactionsPerPage = 10;
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
    toast.success("Expense report exported successfully!");
  };

  const handlePrintStatement = () => {
    toast.success("Printing expense report...");
  };

  const getColorClasses = (color: string) => {
    const colorMap: {
      [key: string]: { bg: string; text: string; border: string };
    } = {
      purple: {
        bg: "bg-purple-100",
        text: "text-purple-700",
        border: "border-purple-200",
      },
      blue: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        border: "border-blue-200",
      },
      emerald: {
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        border: "border-emerald-200",
      },
      pink: {
        bg: "bg-pink-100",
        text: "text-pink-700",
        border: "border-pink-200",
      },
      indigo: {
        bg: "bg-indigo-100",
        text: "text-indigo-700",
        border: "border-indigo-200",
      },
      amber: {
        bg: "bg-amber-100",
        text: "text-amber-700",
        border: "border-amber-200",
      },
      orange: {
        bg: "bg-orange-100",
        text: "text-orange-700",
        border: "border-orange-200",
      },
      cyan: {
        bg: "bg-cyan-100",
        text: "text-cyan-700",
        border: "border-cyan-200",
      },
    };
    return colorMap[color] || colorMap.blue;
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
              Expenses Account
            </h1>
            <p className="text-slate-600 font-medium">
              Track and manage all business expenses by category
            </p>
          </div>
          <button
            onClick={() => setShowAddExpense(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Record Expense
          </button>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total KES Expenses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
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
                    KES
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
                Total KES Expenses
              </p>
              <p className="text-3xl font-bold text-red-600 tracking-tight">
                KES {totalKes.toLocaleString()}
              </p>
              <div className="mt-3 pt-3 border-t-2 border-slate-100">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-slate-500 font-semibold">
                    All Categories
                  </p>
                  <TrendingDown className="w-4 h-4 text-red-500" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Total USD Expenses */}
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
                    USD
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
                Total USD Expenses
              </p>
              <p className="text-3xl font-bold text-red-600 tracking-tight">
                ${totalUsd.toLocaleString()}
              </p>
              <div className="mt-3 pt-3 border-t-2 border-slate-100">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-slate-500 font-semibold">
                    All Categories
                  </p>
                  <TrendingDown className="w-4 h-4 text-red-500" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Categories Count */}
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
                  <Tag className="w-6 h-6" />
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 border border-white/30">
                  <span className="text-[10px] font-bold uppercase tracking-wide">
                    Categories
                  </span>
                </div>
              </div>
              <p className="text-xs opacity-90 mb-1 uppercase tracking-wider font-semibold">
                Active Categories
              </p>
              <p className="text-4xl font-bold tracking-tight">
                {allCategories.length}
              </p>
              <div className="mt-3 pt-3 border-t border-white/20">
                <p className="text-[10px] opacity-75">Expense Types</p>
              </div>
            </div>
          </motion.div>

          {/* Total Transactions */}
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
                  <Receipt className="w-6 h-6 text-blue-600" />
                </div>
                <div className="bg-blue-100 px-3 py-1 border border-blue-200">
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">
                    Transactions
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
                Total Expenses
              </p>
              <p className="text-3xl font-bold text-blue-600 tracking-tight">
                {allCategories.reduce(
                  (sum, cat) => sum + cat.transactions.length,
                  0
                )}
              </p>
              <div className="mt-3 pt-3 border-t-2 border-slate-100">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-slate-500 font-semibold">
                    This Month
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
                placeholder="Search by category name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 outline-none text-slate-700 placeholder-slate-400 bg-transparent"
              />
            </div>
          </div>

          {/* Categories Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                    Category ID
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                    Category Name
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                    KES Total
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                    USD Total
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                    Transactions
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentCategories.map((category, index) => {
                  const colors = getColorClasses(category.color);
                  return (
                    <motion.tr
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-blue-600 group-hover:text-blue-700">
                          {category.id}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex items-center px-3 py-1 ${colors.bg} ${colors.text} border ${colors.border} font-bold text-xs uppercase tracking-wide`}
                          >
                            <Tag className="w-3 h-3 mr-1.5" />
                            {category.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                        {category.kesTotal > 0
                          ? `-KES ${category.kesTotal.toLocaleString()}`
                          : "-"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                        {category.usdTotal > 0
                          ? `-$${category.usdTotal.toLocaleString()}`
                          : "-"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs">
                          {category.transactions.length} expenses
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedCategory(category)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-all font-semibold text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalCategoryPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
              <div className="text-sm text-slate-600">
                Showing {indexOfFirstCategory + 1} to{" "}
                {Math.min(indexOfLastCategory, filteredCategories.length)} of{" "}
                {filteredCategories.length} categories
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCategoriesCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={categoriesCurrentPage === 1}
                  className="p-2 border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: totalCategoryPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCategoriesCurrentPage(page)}
                      className={`px-4 py-2 border transition-all font-semibold text-sm ${
                        categoriesCurrentPage === page
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() =>
                    setCategoriesCurrentPage((prev) =>
                      Math.min(totalCategoryPages, prev + 1)
                    )
                  }
                  disabled={categoriesCurrentPage === totalCategoryPages}
                  className="p-2 border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Category Detail Modal */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCategory(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-7xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 p-6 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Receipt className="w-8 h-8" />
                      <div>
                        <h2 className="text-2xl font-bold">
                          {selectedCategory.name}
                        </h2>
                        <p className="text-blue-100 text-sm flex items-center gap-1.5 mt-1">
                          <Tag className="w-3.5 h-3.5" />
                          {selectedCategory.id} •{" "}
                          {selectedCategory.transactions.length} Expenses
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="p-2 hover:bg-white/20 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* KES Total */}
                  <div className="bg-white/10 backdrop-blur-lg p-3 text-white border-l-4 border-red-400">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <Wallet className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wide">
                          KES Expenses
                        </span>
                      </div>
                    </div>
                    <p className="text-2xl font-bold">
                      -KES {selectedCategory.kesTotal.toLocaleString()}
                    </p>
                  </div>

                  {/* USD Total */}
                  <div className="bg-white/10 backdrop-blur-lg p-3 text-white border-l-4 border-red-400">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wide">
                          USD Expenses
                        </span>
                      </div>
                    </div>
                    <p className="text-2xl font-bold">
                      -${selectedCategory.usdTotal.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Transaction History */}
              <div className="p-8 overflow-y-auto flex-1 bg-white">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    Expense Transactions
                  </h3>

                  {/* Transaction Search */}
                  <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 border border-slate-200">
                    <Search className="w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search expenses..."
                      value={transactionSearch}
                      onChange={(e) => setTransactionSearch(e.target.value)}
                      className="flex-1 outline-none text-slate-700 placeholder-slate-400 bg-transparent"
                    />
                  </div>
                </div>

                {/* Transactions Table */}
                <div className="border border-slate-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-100 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">
                          Reference
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">
                          Description
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">
                          Vendor
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">
                          Payment
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-bold text-slate-600 uppercase">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase">
                          Approved By
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {currentTransactions.map((txn, index) => (
                        <motion.tr
                          key={txn.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.02 }}
                          className="hover:bg-slate-50 transition-colors"
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
                          <td className="px-4 py-4 text-sm text-slate-900 font-semibold">
                            {txn.description}
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-700">
                            {txn.vendor}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold">
                              {txn.paymentMethod}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right">
                            <span className="text-base font-bold text-red-600">
                              -{txn.currency === "KES" ? "KES" : "$"}{" "}
                              {txn.amount.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-600">
                            {txn.approvedBy}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedExpense(txn);
                                  setShowEditExpense(true);
                                }}
                                className="p-2 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all border border-blue-200"
                                title="Edit Expense"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (
                                    confirm(
                                      `Are you sure you want to delete expense ${txn.reference}? This will reverse the double-entry transaction.`
                                    )
                                  ) {
                                    toast.success(
                                      `Expense ${txn.reference} deleted and reversed!`
                                    );
                                  }
                                }}
                                className="p-2 bg-red-100 text-red-700 hover:bg-red-200 transition-all border border-red-200"
                                title="Delete Expense"
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

                {/* Transaction Pagination */}
                {totalTransactionPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-slate-600">
                      Showing {indexOfFirstTransaction + 1} to{" "}
                      {Math.min(
                        indexOfLastTransaction,
                        filteredTransactions.length
                      )}{" "}
                      of {filteredTransactions.length} expenses
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setTransactionsCurrentPage((prev) =>
                            Math.max(1, prev - 1)
                          )
                        }
                        disabled={transactionsCurrentPage === 1}
                        className="p-2 border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 border border-slate-300 bg-slate-50 font-semibold text-sm">
                        {transactionsCurrentPage} / {totalTransactionPages}
                      </span>
                      <button
                        onClick={() =>
                          setTransactionsCurrentPage((prev) =>
                            Math.min(totalTransactionPages, prev + 1)
                          )
                        }
                        disabled={
                          transactionsCurrentPage === totalTransactionPages
                        }
                        className="p-2 border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="border-t border-slate-200 bg-slate-50 p-6">
                <div className="flex gap-3">
                  <button
                    onClick={handleExportStatement}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white hover:bg-emerald-700 transition-all font-semibold text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Export Report
                  </button>
                  <button
                    onClick={handlePrintStatement}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 transition-all font-semibold text-sm"
                  >
                    <Printer className="w-4 h-4" />
                    Print Report
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {showAddExpense && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddExpense(false)}
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
                  <h2 className="text-xl font-bold">Record New Expense</h2>
                  <button
                    onClick={() => setShowAddExpense(false)}
                    className="p-2 hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-blue-100 text-sm mt-2">
                  Double-entry accounting will be applied automatically
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const expenseData = {
                    category: formData.get("category"),
                    description: formData.get("description"),
                    amount: formData.get("amount"),
                    currency: formData.get("currency"),
                    vendor: formData.get("vendor"),
                    paymentMethod: formData.get("paymentMethod"),
                    reference: formData.get("reference"),
                  };

                  // Double-entry logic:
                  // Debit: Expense Account (increases expense)
                  // Credit: Cash/Bank/M-Pesa (decreases asset)

                  toast.success(
                    `Expense recorded! Double-entry applied:\nDebit: ${expenseData.category} (+${expenseData.currency} ${expenseData.amount})\nCredit: ${expenseData.paymentMethod} (-${expenseData.currency} ${expenseData.amount})`
                  );
                  setShowAddExpense(false);
                }}
                className="p-6 space-y-4 max-h-[70vh] overflow-y-auto"
              >
                {/* Expense Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Expense Category *
                  </label>
                  <select
                    name="category"
                    required
                    className="w-full px-4 py-3 border-2 border-slate-200 bg-white text-slate-900 focus:border-purple-500 focus:outline-none transition-colors"
                  >
                    <option value="">Select category...</option>
                    <option value="Rent & Utilities">Rent & Utilities</option>
                    <option value="Salaries & Wages">Salaries & Wages</option>
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Marketing & Advertising">
                      Marketing & Advertising
                    </option>
                    <option value="Insurance">Insurance</option>
                    <option value="Bank Charges & Fees">
                      Bank Charges & Fees
                    </option>
                    <option value="Transport & Fuel">Transport & Fuel</option>
                    <option value="Technology & Software">
                      Technology & Software
                    </option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Description *
                  </label>
                  <input
                    type="text"
                    name="description"
                    required
                    placeholder="e.g., Monthly office rent payment"
                    className="w-full px-4 py-3 border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Amount and Currency */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Amount *
                    </label>
                    <input
                      type="number"
                      name="amount"
                      required
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="w-full px-4 py-3 border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Currency *
                    </label>
                    <select
                      name="currency"
                      required
                      className="w-full px-4 py-3 border-2 border-slate-200 bg-white text-slate-900 focus:border-purple-500 focus:outline-none transition-colors"
                    >
                      <option value="KES">KES</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                </div>

                {/* Vendor */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Vendor/Payee *
                  </label>
                  <input
                    type="text"
                    name="vendor"
                    required
                    placeholder="e.g., Prime Properties Ltd"
                    className="w-full px-4 py-3 border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Payment Method * (Credit Account)
                  </label>
                  <select
                    name="paymentMethod"
                    required
                    className="w-full px-4 py-3 border-2 border-slate-200 bg-white text-slate-900 focus:border-purple-500 focus:outline-none transition-colors"
                  >
                    <option value="">Select payment method...</option>
                    <option value="Cash at Hand">Cash at Hand</option>
                    <option value="Bank Transfer - Equity">
                      Bank Transfer - Equity Bank
                    </option>
                    <option value="Bank Transfer - KCB">
                      Bank Transfer - KCB Bank
                    </option>
                    <option value="M-Pesa">M-Pesa</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                  <p className="text-xs text-slate-500 mt-1">
                    This account will be credited (money out)
                  </p>
                </div>

                {/* Reference */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Reference Number
                  </label>
                  <input
                    type="text"
                    name="reference"
                    placeholder="e.g., INV-2026-001 or auto-generated"
                    className="w-full px-4 py-3 border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Double Entry Explanation */}
                <div className="bg-purple-50 border-2 border-purple-200 p-4">
                  <h4 className="text-sm font-bold text-purple-900 mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Double-Entry Accounting
                  </h4>
                  <div className="space-y-1 text-xs text-purple-800">
                    <div className="flex items-center gap-2">
                      <ArrowUpCircle className="w-3.5 h-3.5 text-purple-600" />
                      <span>
                        <strong>Debit:</strong> Selected Expense Category
                        (increases expense)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowDownCircle className="w-3.5 h-3.5 text-red-600" />
                      <span>
                        <strong>Credit:</strong> Selected Payment Method
                        (decreases asset)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddExpense(false)}
                    className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 hover:bg-slate-300 transition-all font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
                  >
                    Record Expense
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Expense Modal */}
      <AnimatePresence>
        {showEditExpense && selectedExpense && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditExpense(false)}
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
                  <h2 className="text-xl font-bold">Edit Expense</h2>
                  <button
                    onClick={() => setShowEditExpense(false)}
                    className="p-2 hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-blue-100 text-sm mt-2">
                  Double-entry accounting will be applied automatically
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const expenseData = {
                    category: formData.get("category"),
                    description: formData.get("description"),
                    amount: formData.get("amount"),
                    currency: formData.get("currency"),
                    vendor: formData.get("vendor"),
                    paymentMethod: formData.get("paymentMethod"),
                    reference: formData.get("reference"),
                  };

                  // Double-entry logic:
                  // Debit: Expense Account (increases expense)
                  // Credit: Cash/Bank/M-Pesa (decreases asset)

                  toast.success(
                    `Expense updated! Double-entry applied:\nDebit: ${expenseData.category} (+${expenseData.currency} ${expenseData.amount})\nCredit: ${expenseData.paymentMethod} (-${expenseData.currency} ${expenseData.amount})`
                  );
                  setShowEditExpense(false);
                }}
                className="p-6 space-y-4 max-h-[70vh] overflow-y-auto"
              >
                {/* Expense Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Expense Category *
                  </label>
                  <select
                    name="category"
                    required
                    className="w-full px-4 py-3 border-2 border-slate-200 bg-white text-slate-900 focus:border-purple-500 focus:outline-none transition-colors"
                  >
                    <option value="">Select category...</option>
                    <option value="Rent & Utilities">Rent & Utilities</option>
                    <option value="Salaries & Wages">Salaries & Wages</option>
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Marketing & Advertising">
                      Marketing & Advertising
                    </option>
                    <option value="Insurance">Insurance</option>
                    <option value="Bank Charges & Fees">
                      Bank Charges & Fees
                    </option>
                    <option value="Transport & Fuel">Transport & Fuel</option>
                    <option value="Technology & Software">
                      Technology & Software
                    </option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Description *
                  </label>
                  <input
                    type="text"
                    name="description"
                    required
                    placeholder="e.g., Monthly office rent payment"
                    className="w-full px-4 py-3 border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Amount and Currency */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Amount *
                    </label>
                    <input
                      type="number"
                      name="amount"
                      required
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="w-full px-4 py-3 border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Currency *
                    </label>
                    <select
                      name="currency"
                      required
                      className="w-full px-4 py-3 border-2 border-slate-200 bg-white text-slate-900 focus:border-purple-500 focus:outline-none transition-colors"
                    >
                      <option value="KES">KES</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                </div>

                {/* Vendor */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Vendor/Payee *
                  </label>
                  <input
                    type="text"
                    name="vendor"
                    required
                    placeholder="e.g., Prime Properties Ltd"
                    className="w-full px-4 py-3 border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Payment Method * (Credit Account)
                  </label>
                  <select
                    name="paymentMethod"
                    required
                    className="w-full px-4 py-3 border-2 border-slate-200 bg-white text-slate-900 focus:border-purple-500 focus:outline-none transition-colors"
                  >
                    <option value="">Select payment method...</option>
                    <option value="Cash at Hand">Cash at Hand</option>
                    <option value="Bank Transfer - Equity">
                      Bank Transfer - Equity Bank
                    </option>
                    <option value="Bank Transfer - KCB">
                      Bank Transfer - KCB Bank
                    </option>
                    <option value="M-Pesa">M-Pesa</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                  <p className="text-xs text-slate-500 mt-1">
                    This account will be credited (money out)
                  </p>
                </div>

                {/* Reference */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Reference Number
                  </label>
                  <input
                    type="text"
                    name="reference"
                    placeholder="e.g., INV-2026-001 or auto-generated"
                    className="w-full px-4 py-3 border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Double Entry Explanation */}
                <div className="bg-purple-50 border-2 border-purple-200 p-4">
                  <h4 className="text-sm font-bold text-purple-900 mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Double-Entry Accounting
                  </h4>
                  <div className="space-y-1 text-xs text-purple-800">
                    <div className="flex items-center gap-2">
                      <ArrowUpCircle className="w-3.5 h-3.5 text-purple-600" />
                      <span>
                        <strong>Debit:</strong> Selected Expense Category
                        (increases expense)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowDownCircle className="w-3.5 h-3.5 text-red-600" />
                      <span>
                        <strong>Credit:</strong> Selected Payment Method
                        (decreases asset)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditExpense(false)}
                    className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 hover:bg-slate-300 transition-all font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white shadow-lg hover:shadow-xl transition-all font-semibold"
                  >
                    Update Expense
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
