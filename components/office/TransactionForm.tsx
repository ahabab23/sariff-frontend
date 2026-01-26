import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  CreditCard,
  Smartphone,
  ArrowLeftRight,
  Calendar,
  DollarSign,
  FileText,
  Hash,
  Building2,
  User,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

interface TransactionFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function TransactionForm({ onClose, onSuccess }: TransactionFormProps) {
  const [transactionType, setTransactionType] = useState<"debit" | "credit">(
    "debit"
  );
  const [method, setMethod] = useState<"cash" | "bank" | "mpesa" | "account">(
    "cash"
  );
  const [currency, setCurrency] = useState("KES");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const [primaryAccount, setPrimaryAccount] = useState(""); // Account to debit/credit
  const [dateValue, setDateValue] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateReference = () => {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `TXN-${year}-${random}`;
  };

  const [reference] = useState(generateReference());

  // Account options
  const accounts = [
    {
      id: "ACC-001",
      name: "Cash at Hand - KES",
      type: "Cash",
      currency: "KES",
    },
    {
      id: "ACC-002",
      name: "Cash at Hand - USD",
      type: "Cash",
      currency: "USD",
    },
    {
      id: "EXC-001",
      name: "Exchange Account - KES",
      type: "Exchange",
      currency: "KES",
    },
    {
      id: "EXC-002",
      name: "Exchange Account - USD",
      type: "Exchange",
      currency: "USD",
    },
    {
      id: "CLI-001",
      name: "John Doe - Client Account",
      type: "Client",
      currency: "KES",
    },
    {
      id: "CLI-002",
      name: "Jane Smith - Client Account",
      type: "Client",
      currency: "USD",
    },
    {
      id: "WALK-001",
      name: "Walk-in Holding - KES",
      type: "Walk-in",
      currency: "KES",
    },
    {
      id: "WALK-002",
      name: "Walk-in Holding - USD",
      type: "Walk-in",
      currency: "USD",
    },
  ];

  // Bank options
  const banks = [
    {
      id: "BNK-001",
      name: "Equity Bank - KES",
      accountNumber: "0123456789",
      currency: "KES",
    },
    {
      id: "BNK-002",
      name: "KCB Bank - KES",
      accountNumber: "9876543210",
      currency: "KES",
    },
    {
      id: "BNK-003",
      name: "NCBA Bank - USD",
      accountNumber: "5551234567",
      currency: "USD",
    },
    {
      id: "BNK-004",
      name: "Standard Chartered - USD",
      accountNumber: "7778889999",
      currency: "USD",
    },
  ];

  // M-Pesa Agent options (M-Pesa is KES only)
  const agents = [
    {
      id: "AGT-001",
      name: "Safaricom Agent - Downtown",
      agentNumber: "123456",
      currency: "KES",
    },
    {
      id: "AGT-002",
      name: "Safaricom Agent - Westlands",
      agentNumber: "234567",
      currency: "KES",
    },
    {
      id: "AGT-003",
      name: "M-Pesa Store - CBD",
      agentNumber: "345678",
      currency: "KES",
    },
    {
      id: "AGT-004",
      name: "Agent - Riverside",
      agentNumber: "456789",
      currency: "KES",
    },
  ];

  // Get selected item currency
  const getSelectedCurrency = () => {
    if (method === "account" && selectedAccount) {
      return accounts.find((acc) => acc.id === selectedAccount)?.currency || "";
    }
    if (method === "bank" && selectedBank) {
      return banks.find((bank) => bank.id === selectedBank)?.currency || "";
    }
    if (method === "mpesa" && selectedAgent) {
      return agents.find((agent) => agent.id === selectedAgent)?.currency || "";
    }
    return "";
  };

  // Check if exchange rate is needed
  const needsExchangeRate = () => {
    const selectedCurrency = getSelectedCurrency();
    return selectedCurrency && selectedCurrency !== currency;
  };

  // Get exchange rate label
  const getExchangeRateLabel = () => {
    const selectedCurrency = getSelectedCurrency();
    if (currency === "KES" && selectedCurrency === "USD") {
      return "1 USD = ? KES";
    }
    if (currency === "USD" && selectedCurrency === "KES") {
      return "1 KES = ? USD";
    }
    return "Exchange Rate";
  };

  const getNotesPlaceholder = () => {
    switch (method) {
      case "cash":
        return "Name & Telephone Number";
      case "bank":
      case "mpesa":
        return "Transaction message / reference details";
      case "account":
        return "Internal transfer notes";
      default:
        return "Enter notes";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!transactionType) {
        throw new Error("Please select transaction type (Debit or Credit)");
      }
      if (!primaryAccount) {
        throw new Error("Please select the account to debit/credit");
      }
      if (!method) {
        throw new Error("Please select payment method");
      }
      if (!amount || parseFloat(amount) <= 0) {
        throw new Error("Please enter a valid amount greater than 0");
      }
      if (!currency) {
        throw new Error("Please select currency");
      }
      if (!description || description.trim() === "") {
        throw new Error("Please enter a transaction description");
      }
      if (!dateValue) {
        throw new Error("Please select a transaction date");
      }

      // Validate method-specific fields
      if (method === "account" && !selectedAccount) {
        throw new Error("Please select an account for the transfer");
      }
      if (method === "bank" && !selectedBank) {
        throw new Error("Please select a bank for the transfer");
      }
      if (method === "mpesa" && !selectedAgent) {
        throw new Error("Please select an M-Pesa agent");
      }

      // Validate exchange rate if needed
      if (
        needsExchangeRate() &&
        (!exchangeRate || parseFloat(exchangeRate) <= 0)
      ) {
        throw new Error("Please enter a valid exchange rate");
      }

      const payload = {
        type: transactionType, // Changed from transactionType to type
        primaryAccountId: primaryAccount, // Changed from primaryAccount to primaryAccountId
        method,
        secondaryAccountId: method === "account" ? selectedAccount : null, // Changed from selectedAccount
        bankId: method === "bank" ? selectedBank : null, // Changed from selectedBank
        agentId: method === "mpesa" ? selectedAgent : null, // Changed from selectedAgent
        amount: parseFloat(amount),
        currency,
        description: description.trim(),
        category: notes.trim(), // Map notes to category
        date: dateValue,
        exchangeRate: needsExchangeRate() ? parseFloat(exchangeRate) : null,
      };

      console.log("Submitting transaction payload:", payload);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-32ed8237/transactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      console.log("Transaction response:", result);

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to process transaction");
      }

      toast.success(
        `✅ ${
          transactionType === "credit"
            ? "Credit (Money In)"
            : "Debit (Money Out)"
        } transaction completed! Transaction ID: ${result.transaction.id}`,
        { duration: 4000 }
      );

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      console.error("Transaction error:", error);
      toast.error(
        `❌ Transaction failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        { duration: 5000 }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 20 }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
        className="bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-200"
      >
        {/* Compact Header */}
        <div
          className={`relative p-5 bg-gradient-to-r ${
            transactionType === "credit"
              ? "from-emerald-600 to-teal-600"
              : "from-red-600 to-rose-600"
          } text-white transition-all duration-300`}
        >
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.15)_25%,rgba(255,255,255,.15)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.15)_75%,rgba(255,255,255,.15))] bg-[length:20px_20px]"></div>

          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 bg-white/15 backdrop-blur-xl flex items-center justify-center border border-white/20">
              {transactionType === "credit" ? (
                <ArrowUpCircle className="w-5 h-5" />
              ) : (
                <ArrowDownCircle className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold">New Transaction</h2>
              <p className="text-xs opacity-90">
                Process {transactionType} transaction
              </p>
            </div>
          </div>
        </div>

        {/* Compact Form */}
        <form
          onSubmit={handleSubmit}
          className="p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-180px)]"
        >
          {/* Transaction Type Toggle - Inline */}
          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
              Transaction Type *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTransactionType("credit")}
                className={`group relative p-3 border-2 transition-all duration-200 ${
                  transactionType === "credit"
                    ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md shadow-emerald-500/10"
                    : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 flex items-center justify-center transition-all ${
                      transactionType === "credit"
                        ? "bg-emerald-500 shadow-lg shadow-emerald-500/30"
                        : "bg-slate-100 group-hover:bg-emerald-100"
                    }`}
                  >
                    <ArrowUpCircle
                      className={`w-4 h-4 ${
                        transactionType === "credit"
                          ? "text-white"
                          : "text-slate-500"
                      }`}
                    />
                  </div>
                  <div className="text-left">
                    <div
                      className={`text-sm font-bold ${
                        transactionType === "credit"
                          ? "text-emerald-700"
                          : "text-slate-700"
                      }`}
                    >
                      Credit
                    </div>
                    <div className="text-[10px] text-slate-500">Money In</div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTransactionType("debit")}
                className={`group relative p-3 border-2 transition-all duration-200 ${
                  transactionType === "debit"
                    ? "border-red-500 bg-gradient-to-br from-red-50 to-rose-50 shadow-md shadow-red-500/10"
                    : "border-slate-200 bg-white hover:border-red-300 hover:bg-red-50/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 flex items-center justify-center transition-all ${
                      transactionType === "debit"
                        ? "bg-red-500 shadow-lg shadow-red-500/30"
                        : "bg-slate-100 group-hover:bg-red-100"
                    }`}
                  >
                    <ArrowDownCircle
                      className={`w-4 h-4 ${
                        transactionType === "debit"
                          ? "text-white"
                          : "text-slate-500"
                      }`}
                    />
                  </div>
                  <div className="text-left">
                    <div
                      className={`text-sm font-bold ${
                        transactionType === "debit"
                          ? "text-red-700"
                          : "text-slate-700"
                      }`}
                    >
                      Debit
                    </div>
                    <div className="text-[10px] text-slate-500">Money Out</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Primary Account to Debit/Credit */}
          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
              <Wallet className="w-3 h-3 inline mr-1" />
              Account to {transactionType === "debit" ? "Debit" : "Credit"} *
            </label>
            <select
              value={primaryAccount}
              onChange={(e) => {
                setPrimaryAccount(e.target.value);
                // Auto-set currency based on selected account
                const selectedAcc = accounts.find(
                  (acc) => acc.id === e.target.value
                );
                if (selectedAcc) {
                  setCurrency(selectedAcc.currency);
                }
              }}
              className={`w-full px-3 py-2.5 border-2 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:border-blue-500 font-semibold text-sm transition-all ${
                transactionType === "debit"
                  ? "border-emerald-300 focus:ring-emerald-500/20 bg-emerald-50/30"
                  : "border-red-300 focus:ring-red-500/20 bg-red-50/30"
              }`}
              required
            >
              <option value="" className="text-slate-500">
                Select account to {transactionType}...
              </option>
              {accounts.map((account) => (
                <option
                  key={account.id}
                  value={account.id}
                  className="text-slate-900"
                >
                  {account.name} ({account.type}) - {account.currency}
                </option>
              ))}
            </select>
            <p
              className={`text-[10px] mt-1.5 font-semibold flex items-center gap-1 ${
                transactionType === "credit"
                  ? "text-emerald-600"
                  : "text-red-600"
              }`}
            >
              {transactionType === "credit" ? "💰" : "💸"}
              <span>
                This account will be{" "}
                {transactionType === "credit"
                  ? "credited (money in)"
                  : "debited (money out)"}
              </span>
            </p>
          </div>

          {/* Description - Full Width - MOVED HERE FOR VISIBILITY */}
          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
              <FileText className="w-3 h-3 inline mr-1" />
              Transaction Description *
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 border-2 border-blue-300 text-slate-900 bg-blue-50/20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium transition-all"
              placeholder="e.g., Currency Exchange, Client Deposit, Withdrawal, etc."
              required
            />
            <p className="text-[10px] text-blue-600 mt-1.5 font-semibold">
              💡 Brief description of what this transaction is for
            </p>
          </div>

          {/* Amount & Currency - 2 Columns */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                <DollarSign className="w-3 h-3 inline mr-1" />
                Amount *
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-sm transition-all"
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                Currency *
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm transition-all"
                required
              >
                <option value="KES">KES</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          {/* Reference & Date - 2 Columns */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                <Hash className="w-3 h-3 inline mr-1" />
                Reference
              </label>
              <input
                type="text"
                value={reference}
                readOnly
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                <Calendar className="w-3 h-3 inline mr-1" />
                Date *
              </label>
              <input
                type="date"
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
                required
              />
            </div>
          </div>

          {/* Payment Method - Compact Grid */}
          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-2">
              Payment Method *
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setMethod("cash")}
                className={`group p-2.5 border-2 transition-all ${
                  method === "cash"
                    ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
                    : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
                }`}
              >
                <Wallet
                  className={`w-5 h-5 mx-auto mb-1 ${
                    method === "cash"
                      ? "text-blue-600"
                      : "text-slate-400 group-hover:text-blue-500"
                  }`}
                />
                <div
                  className={`text-[10px] font-bold ${
                    method === "cash" ? "text-blue-700" : "text-slate-600"
                  }`}
                >
                  Cash
                </div>
              </button>
              <button
                type="button"
                onClick={() => setMethod("bank")}
                className={`group p-2.5 border-2 transition-all ${
                  method === "bank"
                    ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
                    : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
                }`}
              >
                <CreditCard
                  className={`w-5 h-5 mx-auto mb-1 ${
                    method === "bank"
                      ? "text-blue-600"
                      : "text-slate-400 group-hover:text-blue-500"
                  }`}
                />
                <div
                  className={`text-[10px] font-bold ${
                    method === "bank" ? "text-blue-700" : "text-slate-600"
                  }`}
                >
                  Bank
                </div>
              </button>
              <button
                type="button"
                onClick={() => setMethod("mpesa")}
                className={`group p-2.5 border-2 transition-all ${
                  method === "mpesa"
                    ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
                    : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
                }`}
              >
                <Smartphone
                  className={`w-5 h-5 mx-auto mb-1 ${
                    method === "mpesa"
                      ? "text-blue-600"
                      : "text-slate-400 group-hover:text-blue-500"
                  }`}
                />
                <div
                  className={`text-[10px] font-bold ${
                    method === "mpesa" ? "text-blue-700" : "text-slate-600"
                  }`}
                >
                  M-Pesa
                </div>
              </button>
              <button
                type="button"
                onClick={() => setMethod("account")}
                className={`group p-2.5 border-2 transition-all ${
                  method === "account"
                    ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-500/20"
                    : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
                }`}
              >
                <ArrowLeftRight
                  className={`w-5 h-5 mx-auto mb-1 ${
                    method === "account"
                      ? "text-blue-600"
                      : "text-slate-400 group-hover:text-blue-500"
                  }`}
                />
                <div
                  className={`text-[10px] font-bold ${
                    method === "account" ? "text-blue-700" : "text-slate-600"
                  }`}
                >
                  Account
                </div>
              </button>
            </div>
          </div>

          {/* Conditional Selection Fields */}
          {method === "account" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                <ArrowLeftRight className="w-3 h-3 inline mr-1" />
                Select Account *
              </label>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm transition-all"
                required
              >
                <option value="" className="text-slate-500">
                  Choose an account...
                </option>
                {accounts.map((account) => (
                  <option
                    key={account.id}
                    value={account.id}
                    className="text-slate-900"
                  >
                    {account.name} ({account.type})
                  </option>
                ))}
              </select>
            </motion.div>
          )}

          {method === "bank" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                <Building2 className="w-3 h-3 inline mr-1" />
                Select Bank Account *
              </label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm transition-all"
                required
              >
                <option value="" className="text-slate-500">
                  Choose a bank...
                </option>
                {banks.map((bank) => (
                  <option
                    key={bank.id}
                    value={bank.id}
                    className="text-slate-900"
                  >
                    {bank.name} - A/C: {bank.accountNumber}
                  </option>
                ))}
              </select>
            </motion.div>
          )}

          {method === "mpesa" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                <User className="w-3 h-3 inline mr-1" />
                Select M-Pesa Agent *
              </label>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold text-sm transition-all"
                required
              >
                <option value="" className="text-slate-500">
                  Choose an agent...
                </option>
                {agents.map((agent) => (
                  <option
                    key={agent.id}
                    value={agent.id}
                    className="text-slate-900"
                  >
                    {agent.name} - Agent #{agent.agentNumber}
                  </option>
                ))}
              </select>
            </motion.div>
          )}

          {/* Exchange Rate Field */}
          {needsExchangeRate() && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {/* Currency Mismatch Alert */}
              <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500">
                <RefreshCw
                  className="w-4 h-4 text-amber-600 animate-spin"
                  style={{ animationDuration: "3s" }}
                />
                <div className="flex-1">
                  <p className="text-xs font-bold text-amber-900">
                    Currency Exchange Required
                  </p>
                  <p className="text-[10px] text-amber-700">
                    Transaction: {currency} → Account: {getSelectedCurrency()}
                  </p>
                </div>
              </div>

              {/* Exchange Rate Input */}
              <div>
                <label className="block text-[10px] font-bold text-amber-700 uppercase tracking-wide mb-1.5">
                  <RefreshCw className="w-3 h-3 inline mr-1" />
                  {getExchangeRateLabel()} *
                </label>
                <input
                  type="number"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(e.target.value)}
                  className="w-full px-3 py-2.5 border-2 border-amber-300 bg-amber-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold text-sm transition-all"
                  placeholder="Enter exchange rate"
                  step="0.0001"
                  required
                />
                <p className="text-[10px] text-amber-600 mt-1.5 font-semibold">
                  💱 This rate will be used to convert between {currency} and{" "}
                  {getSelectedCurrency()}
                </p>
              </div>
            </motion.div>
          )}

          {/* Notes - Compact */}
          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
              Notes *
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all resize-none"
              rows={2}
              placeholder={getNotesPlaceholder()}
              required
            />
            <p className="text-[10px] text-slate-500 mt-1.5 flex items-start gap-1">
              <span>💡</span>
              <span>
                {method === "cash" &&
                  "For cash transactions, include customer name and phone number"}
                {method === "bank" &&
                  "Include bank transaction reference or message"}
                {method === "mpesa" &&
                  "Include M-Pesa transaction code and details"}
                {method === "account" &&
                  "Specify source and destination account details"}
              </span>
            </p>
          </div>

          {/* Compact Summary */}
          <div
            className={`p-3 border-l-4 ${
              transactionType === "debit"
                ? "bg-red-50 border-red-500"
                : "bg-emerald-50 border-emerald-500"
            }`}
          >
            <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
              Summary
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Type:</span>
                <span
                  className={`font-bold ${
                    transactionType === "debit"
                      ? "text-red-600"
                      : "text-emerald-600"
                  }`}
                >
                  {transactionType === "debit" ? "Debit" : "Credit"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Method:</span>
                <span className="font-bold capitalize text-slate-900">
                  {method}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Amount:</span>
                <span className="font-bold text-slate-900">
                  {currency} {amount || "0.00"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Ref:</span>
                <span className="font-mono text-[10px] text-slate-700">
                  {reference}
                </span>
              </div>
            </div>
          </div>
        </form>

        {/* Compact Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border-2 border-slate-200 hover:bg-white hover:border-slate-300 transition-all font-semibold text-sm text-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${
              transactionType === "debit"
                ? "from-red-600 to-rose-600 hover:shadow-lg hover:shadow-red-500/30"
                : "from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/30"
            } text-white font-bold text-sm transition-all shadow-md`}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Processing..."
              : `Process ${transactionType === "debit" ? "Debit" : "Credit"}`}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
