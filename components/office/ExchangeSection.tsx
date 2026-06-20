"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buildExchangeMessage } from "@/lib/whatsapp";
import { SuccessShareModal } from "@/components/ui/SuccessShareModal";
import { PinModal, checkPinStatus } from "@/components/ui/PinModal";
import {
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  RefreshCw,
  Plus,
  Minus,
  Eye,
  X,
  Calculator,
  Clock,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Copy,
  Share2,
  FileText,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Settings,
  Download,
  BarChart3,
  PiggyBank,
  Banknote,
  Building2,
  Smartphone,
} from "lucide-react";
import { toast } from "sonner";
import {
  Currency,
  AccountType,
  ExchangeType,
  ExchangeDirection,
  ClientLookupDto,
  ExchangeRateDto,
  ExchangeFloatDto,
  ExchangeResponseDto,
  DailySummaryDto,
  UsdPositionDto,
  FloatAlertDto,
  BankAccountDto,
  MpesaAgentDto,
  CashAccountDto,
  PagedResult,
  // API Functions
  getCurrentExchangeRate,
  setExchangeRate,
  getExchangeRateHistory,
  getExchangeFloat,
  fundExchangeFloat,
  withdrawExchangeFloat,
  settleExchangeProfit,
  getFloatMovements,
  createExchange,
  getExchangeTransactions,
  getExchangeById,
  voidExchange,
  getExchangeTodaySummary,
  getExchangeDailySummaries,
  recordOpeningFloat,
  recordClosingFloat,
  getUsdPosition,
  getExchangeAlerts,
  calculateExchange,
  getClientLookup,
  getBankAccounts,
  getMpesaAgents,
  getCashAccounts,
  formatCurrency,
  formatNumber,
} from "@/lib/api";

// ==============================================
// Types
// ==============================================

interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: Currency;
}

// ==============================================
// Helper Functions
// ==============================================

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("en-KE", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateTime = (dateString: string) => {
  return `${formatDate(dateString)} ${formatTime(dateString)}`;
};

// ==============================================
// Main Component
// ==============================================

export function ExchangeSection() {
  // Loading states
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Data states
  const [currentRate, setCurrentRate] = useState<ExchangeRateDto | null>(null);
  const [rateHistory, setRateHistory] = useState<ExchangeRateDto[]>([]);
  const [exchangeFloat, setExchangeFloat] = useState<ExchangeFloatDto | null>(
    null,
  );
  const [transactions, setTransactions] = useState<ExchangeResponseDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [todaySummary, setTodaySummary] = useState<DailySummaryDto | null>(
    null,
  );
  const [floatHistory, setFloatHistory] = useState<DailySummaryDto[]>([]);
  const [showFloatHistory, setShowFloatHistory] = useState(false);
  const [usdPosition, setUsdPosition] = useState<UsdPositionDto | null>(null);
  const [alerts, setAlerts] = useState<FloatAlertDto[]>([]);
  const [clients, setClients] = useState<ClientLookupDto[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  // UI states
  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<
    "today" | "week" | "month" | "all"
  >("today");

  // Modal states
  const [showSetRateModal, setShowSetRateModal] = useState(false);
  const [showNewExchangeModal, setShowNewExchangeModal] = useState(false);
  const [exchShareModal, setExchShareModal] = useState<{
    show: boolean;
    title: string;
    details: { label: string; value: string }[];
    phone: string;
    message: string;
  }>({ show: false, title: "", details: [], phone: "", message: "" });
  const [showPin, setShowPin] = useState(false);
  const [pendingExchange, setPendingExchange] = useState<any>(null);
  const [showFundFloatModal, setShowFundFloatModal] = useState(false);
  const [showWithdrawFloatModal, setShowWithdrawFloatModal] = useState(false);
  const [showSettleProfitModal, setShowSettleProfitModal] = useState(false);
  const [showUsdPositionModal, setShowUsdPositionModal] = useState(false);
  const [showCalculatorModal, setShowCalculatorModal] = useState(false);
  const [showDayCloseModal, setShowDayCloseModal] = useState(false);
  const [showRateHistoryModal, setShowRateHistoryModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<ExchangeResponseDto | null>(null);

  // ==============================================
  // Data Loading
  // ==============================================

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Load all data in parallel
      const [
        rateRes,
        rateHistoryRes,
        floatRes,
        summaryRes,
        positionRes,
        alertsRes,
        clientsRes,
        bankRes,
        mpesaRes,
        cashRes,
      ] = await Promise.all([
        getCurrentExchangeRate(),
        getExchangeRateHistory(30),
        getExchangeFloat(),
        getExchangeTodaySummary(),
        getUsdPosition(),
        getExchangeAlerts(),
        getClientLookup(),
        getBankAccounts(),
        getMpesaAgents(),
        getCashAccounts(),
      ]);

      if (rateRes.success && rateRes.data) setCurrentRate(rateRes.data);
      if (rateHistoryRes.success && rateHistoryRes.data)
        setRateHistory(rateHistoryRes.data);
      if (floatRes.success && floatRes.data) setExchangeFloat(floatRes.data);
      if (summaryRes.success && summaryRes.data)
        setTodaySummary(summaryRes.data);
      if (positionRes.success && positionRes.data)
        setUsdPosition(positionRes.data);
      if (alertsRes.success && alertsRes.data) setAlerts(alertsRes.data);
      if (clientsRes.success && clientsRes.data) setClients(clientsRes.data);

      // Build accounts list
      const allAccounts: Account[] = [];
      if (bankRes.success && bankRes.data) {
        bankRes.data.forEach((b) => {
          allAccounts.push({
            id: b.id,
            name: `${b.bankName} - ${b.accountNumber}`,
            type: AccountType.Bank,
            balance: b.balance,
            currency: b.currency,
          });
        });
      }
      if (mpesaRes.success && mpesaRes.data) {
        mpesaRes.data.forEach((m) => {
          allAccounts.push({
            id: m.id,
            name: `M-Pesa - ${m.agentName}`,
            type: AccountType.Mpesa,
            balance: m.balance,
            currency: Currency.KES,
          });
        });
      }
      if (cashRes.success && cashRes.data) {
        cashRes.data.forEach((c) => {
          allAccounts.push({
            id: c.id,
            name: `Cash ${c.currency === Currency.KES ? "KES" : "USD"}`,
            type: AccountType.Cash,
            balance: c.balance,
            currency: c.currency,
          });
        });
      }
      setAccounts(allAccounts);

      // Load transactions
      await loadTransactions();
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load exchange data");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTransactions = useCallback(async () => {
    try {
      let from: string | undefined;
      let to: string | undefined;
      const now = new Date();

      if (dateFilter === "today") {
        from = now.toISOString().split("T")[0];
        to = from;
      } else if (dateFilter === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        from = weekAgo.toISOString().split("T")[0];
        to = now.toISOString().split("T")[0];
      } else if (dateFilter === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        from = monthAgo.toISOString().split("T")[0];
        to = now.toISOString().split("T")[0];
      }

      const res = await getExchangeTransactions(
        page,
        pageSize,
        searchTerm || undefined,
        undefined,
        from,
        to,
      );
      if (res.success && res.data) {
        setTransactions(res.data.items);
        setTotalCount(res.data.totalCount);
      }
    } catch (error) {
      console.error("Error loading transactions:", error);
      toast.error("Failed to load data. Please refresh.");
    }
  }, [page, pageSize, searchTerm, dateFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // ==============================================
  // Handlers
  // ==============================================

  const handleSetRate = async (buyRate: number, sellRate: number) => {
    setActionLoading(true);
    try {
      const res = await setExchangeRate({ buyRate, sellRate });
      if (res.success && res.data) {
        setCurrentRate(res.data);
        toast.success("Exchange rate updated successfully");
        setShowSetRateModal(false);
        loadData();
      } else {
        toast.error(res.message || "Failed to set exchange rate");
      }
    } catch (error) {
      toast.error("Failed to set exchange rate");
    } finally {
      setActionLoading(false);
    }
  };

  const handleNewExchange = async (data: {
    clientId?: string;
    clientName?: string;
    exchangeType: ExchangeType;
    direction: ExchangeDirection;
    amount: number;
    clientIdNumber?: string;
    notes?: string;
  }) => {
    setActionLoading(true);
    try {
      // Ensure clientId is properly formatted — send undefined instead of null/empty
      const dto: any = {
        exchangeType: data.exchangeType,
        direction: data.direction,
        amount: data.amount,
        clientIdNumber: data.clientIdNumber || undefined,
        notes: data.notes || undefined,
      };

      // Only include clientId if it's a real GUID, otherwise send clientName for walk-ins
      if (data.clientId && data.clientId.length > 10) {
        dto.clientId = data.clientId;
      } else if (data.clientName) {
        dto.clientName = data.clientName;
      }

      const res = await createExchange(dto);
      if (res.success && res.data) {
        const exchCode = res.data.code || "";
        const dirLabel =
          data.direction === ExchangeDirection.UsdToKes
            ? "USD → KES"
            : "KES → USD";
        toast.success(`Exchange completed! Code: ${exchCode}`);
        setShowNewExchangeModal(false);
        loadData();

        // WhatsApp share if client was involved
        if (data.clientId && clients.length > 0) {
          const client = clients.find((c) => c.id === data.clientId);
          if (client?.whatsAppNumber) {
            setExchShareModal({
              show: true,
              title: "Exchange Completed",
              details: [
                { label: "Reference", value: exchCode },
                {
                  label: "Client",
                  value: client.fullName || client.name || "",
                },
                { label: "Direction", value: dirLabel },
                {
                  label: "Given",
                  value: `${data.direction === 0 ? "USD" : "KES"} ${formatNumber(res.data.amountGiven || data.amount)}`,
                },
                {
                  label: "Received",
                  value: `${data.direction === 0 ? "KES" : "USD"} ${formatNumber(res.data.amountReceived || 0)}`,
                },
                { label: "Rate", value: String(res.data.exchangeRate || "") },
                {
                  label: "Profit",
                  value: `KES ${formatNumber(res.data.profit || 0)}`,
                },
              ],
              phone: client.whatsAppNumber,
              message: buildExchangeMessage({
                clientName: client.fullName || client.name || "Client",
                direction: dirLabel,
                amountGiven: formatNumber(res.data.amountGiven || data.amount),
                currencyGiven: data.direction === 0 ? "USD" : "KES",
                amountReceived: formatNumber(res.data.amountReceived || 0),
                currencyReceived: data.direction === 0 ? "KES" : "USD",
                rate: String(res.data.exchangeRate || ""),
                code: exchCode,
                date: new Date().toLocaleString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              }),
            });
          }
        }
      } else {
        toast.error(res.message || "Failed to create exchange");
      }
    } catch (error: any) {
      console.error("Exchange error:", error);
      toast.error(error?.message || "Failed to create exchange");
    } finally {
      setActionLoading(false);
    }
  };

  const handleFundFloat = async (data: {
    currency: Currency;
    amount: number;
    sourceType: AccountType;
    sourceAccountId: string;
    purchaseRate?: number;
    notes?: string;
  }) => {
    setActionLoading(true);
    try {
      const res = await fundExchangeFloat(data);
      if (res.success && res.data) {
        setExchangeFloat(res.data);
        toast.success("Float funded successfully");
        setShowFundFloatModal(false);
        loadData();
      } else {
        toast.error(res.message || "Failed to fund float");
      }
    } catch (error) {
      toast.error("Failed to fund float");
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdrawFloat = async (data: {
    currency: Currency;
    amount: number;
    destinationType: AccountType;
    destinationAccountId: string;
    notes?: string;
  }) => {
    setActionLoading(true);
    try {
      const res = await withdrawExchangeFloat(data);
      if (res.success && res.data) {
        setExchangeFloat(res.data);
        toast.success("Withdrawal successful");
        setShowWithdrawFloatModal(false);
        loadData();
      } else {
        toast.error(res.message || "Failed to withdraw from float");
      }
    } catch (error) {
      toast.error("Failed to withdraw from float");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSettleProfit = async (data: {
    currency: Currency;
    amount: number;
    destinationType: AccountType;
    destinationAccountId: string;
    notes?: string;
  }) => {
    setActionLoading(true);
    try {
      const res = await settleExchangeProfit(data);
      if (res.success && res.data) {
        setExchangeFloat(res.data);
        toast.success("Profit settled successfully");
        setShowSettleProfitModal(false);
        loadData();
      } else {
        toast.error(res.message || "Failed to settle profit");
      }
    } catch (error) {
      toast.error("Failed to settle profit");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRecordOpening = async (
    kesCount: number,
    usdCount: number,
    notes?: string,
  ) => {
    setActionLoading(true);
    try {
      const res = await recordOpeningFloat({ kesCount, usdCount, notes });
      if (res.success) {
        toast.success("Opening float recorded successfully");
        setShowDayCloseModal(false);
        loadData();
      } else {
        toast.error(res.message || "Failed to record opening");
      }
    } catch {
      toast.error("Failed to record opening");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRecordClosing = async (
    kesCount: number,
    usdCount: number,
    notes?: string,
  ) => {
    setActionLoading(true);
    try {
      const res = await recordClosingFloat({ kesCount, usdCount, notes });
      if (res.success && res.data) {
        setTodaySummary(res.data);
        toast.success("Day closed successfully");
        setShowDayCloseModal(false);
        loadData();
      } else {
        toast.error(res.message || "Failed to close day");
      }
    } catch (error) {
      toast.error("Failed to close day");
    } finally {
      setActionLoading(false);
    }
  };

  const handleVoidTransaction = async (id: string, reason: string) => {
    // Check PIN first
    const status = await checkPinStatus();
    if (status.isEnabled && status.hasPin) {
      setPendingVoid({ id, reason });
      setShowPin(true);
      return;
    }
    executeVoid(id, reason);
  };

  const [pendingVoid, setPendingVoid] = useState<{
    id: string;
    reason: string;
  } | null>(null);

  const executeVoid = async (id: string, reason: string) => {
    setActionLoading(true);
    try {
      const res = await voidExchange(id, reason);
      if (res.success) {
        toast.success("Transaction voided");
        setShowTransactionModal(false);
        setSelectedTransaction(null);
        loadData();
      } else {
        toast.error(res.message || "Failed to void transaction");
      }
    } catch (error) {
      toast.error("Failed to void transaction");
    } finally {
      setActionLoading(false);
    }
  };

  // ==============================================
  // Computed Values
  // ==============================================

  const spread = currentRate ? currentRate.sellRate - currentRate.buyRate : 0;
  const marginPercent =
    currentRate && currentRate.buyRate > 0
      ? ((spread / currentRate.buyRate) * 100).toFixed(2)
      : "0";
  const totalPages = Math.ceil(totalCount / pageSize);

  // ==============================================
  // Loading State
  // ==============================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading Exchange Account...</p>
        </div>
      </div>
    );
  }

  // ==============================================
  // Render
  // ==============================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Exchange Account
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Forex Bureau Operations
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowCalculatorModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <Calculator className="w-4 h-4" />
              Calculator
            </button>
            <button
              onClick={() => setShowRateHistoryModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <TrendingUp className="w-4 h-4" />
              Rate History
            </button>
            <button
              onClick={async () => {
                const now = new Date();
                const from = new Date(now.getFullYear(), now.getMonth(), 1)
                  .toISOString()
                  .split("T")[0];
                const to = now.toISOString().split("T")[0];
                const res = await getExchangeDailySummaries(from, to);
                if (res.success) setFloatHistory(res.data || []);
                setShowFloatHistory(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <Calendar className="w-4 h-4" />
              Float History
            </button>
            <button
              onClick={() => setShowDayCloseModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <Clock className="w-4 h-4" />
              Day Close
            </button>
            <button
              onClick={() => setShowNewExchangeModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              <ArrowLeftRight className="w-4 h-4" />
              New Exchange
            </button>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 text-amber-800"
            >
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{alert.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Current Rate Card */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <div className="lg:col-span-1 bg-gradient-to-br from-indigo-600 to-indigo-700 p-5 text-white">
          <div className="flex items-center justify-between mb-4">
            <span className="text-indigo-200 text-sm font-medium">
              Current Rate
            </span>
            <button
              onClick={() => setShowSetRateModal(true)}
              className="p-1.5 hover:bg-white/10 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
          {currentRate ? (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-indigo-200 text-xs mb-1">Buy Rate</p>
                  <p className="text-2xl font-bold">
                    {currentRate.buyRate.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-indigo-200 text-xs mb-1">Sell Rate</p>
                  <p className="text-2xl font-bold">
                    {currentRate.sellRate.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-indigo-200">
                  Spread: {spread.toFixed(2)}
                </span>
                <span className="bg-white/20 px-2 py-0.5 text-xs font-medium">
                  {marginPercent}% margin
                </span>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-indigo-200 text-sm mb-2">No rate set</p>
              <button
                onClick={() => setShowSetRateModal(true)}
                className="text-white underline text-sm"
              >
                Set Rate
              </button>
            </div>
          )}
        </div>

        {/* Float Balances */}
        <div className="bg-white border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-500 text-sm font-medium">KES Float</span>
            <Wallet className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(exchangeFloat?.kesBalance || 0, Currency.KES)}
          </p>
          {exchangeFloat && exchangeFloat.kesBalance < 50000 && (
            <p className="text-xs text-amber-600 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Low balance
            </p>
          )}
        </div>

        <div
          className="bg-white border border-gray-200 p-5 cursor-pointer hover:border-indigo-300 transition-colors"
          onClick={() => setShowUsdPositionModal(true)}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-500 text-sm font-medium">USD Float</span>
            <DollarSign className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            ${formatNumber(exchangeFloat?.usdBalance || 0)}
          </p>
          {usdPosition && (
            <p className="text-xs text-gray-500">
              Avg Cost: {usdPosition.averageCostPerUsd.toFixed(2)} KES
            </p>
          )}
        </div>

        {/* Today's Stats */}
        <div className="bg-white border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-500 text-sm font-medium">Today</span>
            <span
              className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                todaySummary?.isClosed
                  ? "bg-emerald-100 text-emerald-700"
                  : todaySummary?.openingKes
                    ? "bg-amber-100 text-amber-700"
                    : "bg-gray-100 text-gray-500"
              }`}
            >
              {todaySummary?.isClosed
                ? "✅ Closed"
                : todaySummary?.openingKes
                  ? "☀️ Open"
                  : "⏳ Not Started"}
            </span>
          </div>
          <p className="text-2xl font-bold text-emerald-600 mb-1">
            {formatCurrency(todaySummary?.kesProfit || 0, Currency.KES)}
          </p>
          <p className="text-xs text-gray-500 mb-1">
            {todaySummary?.exchangeCount || 0} exchanges | $
            {formatNumber(todaySummary?.usdProfit || 0)} USD profit
          </p>
          {todaySummary?.kesVariance != null &&
            todaySummary.kesVariance !== 0 && (
              <p className="text-xs text-amber-600 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Variance: KES {formatNumber(todaySummary.kesVariance)}
              </p>
            )}
        </div>
      </div>

      {/* Quick Actions & Profit Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <button
          onClick={() => setShowFundFloatModal(true)}
          className="flex items-center gap-3 p-4 bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
        >
          <div className="w-10 h-10 bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
            <Plus className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900">Fund Float</p>
            <p className="text-xs text-gray-500">Add KES or USD</p>
          </div>
        </button>

        <button
          onClick={() => setShowWithdrawFloatModal(true)}
          className="flex items-center gap-3 p-4 bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
        >
          <div className="w-10 h-10 bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
            <Minus className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900">Withdraw</p>
            <p className="text-xs text-gray-500">Transfer out</p>
          </div>
        </button>

        <button
          onClick={() => setShowSettleProfitModal(true)}
          className="flex items-center gap-3 p-4 bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
        >
          <div className="w-10 h-10 bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
            <PiggyBank className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900">Settle Profit</p>
            <p className="text-xs text-gray-500">
              KES {formatNumber(exchangeFloat?.kesProfit || 0)}
            </p>
          </div>
        </button>

        <button
          onClick={() => setShowUsdPositionModal(true)}
          className="flex items-center gap-3 p-4 bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
        >
          <div className="w-10 h-10 bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900">USD Position</p>
            <p className="text-xs text-gray-500">View P&L</p>
          </div>
        </button>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-gray-200">
        {/* Table Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Exchange Transactions
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              {/* Date Filter */}
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="all">All Time</option>
              </select>
              {/* Refresh */}
              <button
                onClick={loadTransactions}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <RefreshCw className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto max-w-full">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Given
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Received
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profit
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((txn) => (
                  <tr
                    key={txn.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      txn.isLargeTransaction ? "bg-amber-50" : ""
                    }`}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        {txn.isLargeTransaction && (
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        )}
                        {txn.code}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDateTime(txn.date)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {txn.clientName}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-medium ${
                          txn.exchangeType === ExchangeType.Cash
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {txn.exchangeType === ExchangeType.Cash
                          ? "Cash"
                          : "Account"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-emerald-600 font-medium">
                      +{formatCurrency(txn.amountGiven, txn.currencyGiven)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-red-600 font-medium">
                      -
                      {formatCurrency(txn.amountReceived, txn.currencyReceived)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900">
                      {txn.exchangeRate.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-emerald-600">
                      {formatCurrency(txn.profit, txn.profitCurrency)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => {
                          setSelectedTransaction(txn);
                          setShowTransactionModal(true);
                        }}
                        className="p-1 hover:bg-gray-200 transition-colors"
                      >
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * pageSize + 1} to{" "}
              {Math.min(page * pageSize, totalCount)} of {totalCount}{" "}
              transactions
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {/* Set Rate Modal */}
        {showSetRateModal && (
          <SetRateModal
            currentRate={currentRate}
            onClose={() => setShowSetRateModal(false)}
            onSubmit={handleSetRate}
            loading={actionLoading}
          />
        )}

        {/* New Exchange Modal */}
        {showNewExchangeModal && (
          <NewExchangeModal
            currentRate={currentRate}
            clients={clients}
            onClose={() => setShowNewExchangeModal(false)}
            onSubmit={async (data: any) => {
              const status = await checkPinStatus();
              if (status.isEnabled && status.hasPin) {
                setPendingExchange(data);
                setShowPin(true);
              } else {
                handleNewExchange(data);
              }
            }}
            loading={actionLoading}
          />
        )}

        {/* Fund Float Modal */}
        {showFundFloatModal && (
          <FundFloatModal
            accounts={accounts}
            onClose={() => setShowFundFloatModal(false)}
            onSubmit={handleFundFloat}
            loading={actionLoading}
          />
        )}

        {/* Withdraw Float Modal */}
        {showWithdrawFloatModal && (
          <WithdrawFloatModal
            accounts={accounts}
            exchangeFloat={exchangeFloat}
            onClose={() => setShowWithdrawFloatModal(false)}
            onSubmit={handleWithdrawFloat}
            loading={actionLoading}
          />
        )}

        {/* Settle Profit Modal */}
        {showSettleProfitModal && (
          <SettleProfitModal
            accounts={accounts}
            exchangeFloat={exchangeFloat}
            onClose={() => setShowSettleProfitModal(false)}
            onSubmit={handleSettleProfit}
            loading={actionLoading}
          />
        )}

        {/* USD Position Modal */}
        {showUsdPositionModal && usdPosition && (
          <UsdPositionModal
            position={usdPosition}
            onClose={() => setShowUsdPositionModal(false)}
          />
        )}

        {/* Calculator Modal */}
        {showCalculatorModal && currentRate && (
          <CalculatorModal
            currentRate={currentRate}
            onClose={() => setShowCalculatorModal(false)}
          />
        )}

        {/* Float History Modal */}
        {showFloatHistory && (
          <ModalWrapper onClose={() => setShowFloatHistory(false)}>
            <div className="bg-white w-full max-w-2xl">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  📅 Float History — This Month
                </h3>
                <button
                  onClick={() => setShowFloatHistory(false)}
                  className="p-1 hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                {floatHistory.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">
                    No daily records this month. Start by recording an opening
                    float.
                  </p>
                ) : (
                  <div className="overflow-x-auto max-w-full">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 text-left">
                          <th className="py-2 px-2 font-medium text-gray-600">
                            Date
                          </th>
                          <th className="py-2 px-2 font-medium text-gray-600 text-center">
                            Status
                          </th>
                          <th className="py-2 px-2 font-medium text-gray-600 text-right">
                            Exchanges
                          </th>
                          <th className="py-2 px-2 font-medium text-emerald-600 text-right">
                            KES Profit
                          </th>
                          <th className="py-2 px-2 font-medium text-blue-600 text-right">
                            USD Profit
                          </th>
                          <th className="py-2 px-2 font-medium text-gray-600 text-right">
                            KES Var
                          </th>
                          <th className="py-2 px-2 font-medium text-gray-600 text-right">
                            USD Var
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {floatHistory.map((day: any, i: number) => (
                          <tr
                            key={i}
                            className={`border-b border-gray-100 ${i === 0 ? "bg-indigo-50" : ""}`}
                          >
                            <td className="py-2 px-2 text-gray-700 font-medium">
                              {new Date(day.date).toLocaleDateString("en-GB", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                              })}
                            </td>
                            <td className="py-2 px-2 text-center">
                              <span
                                className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                                  day.isClosed
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-amber-100 text-amber-700"
                                }`}
                              >
                                {day.isClosed ? "Closed" : "Open"}
                              </span>
                            </td>
                            <td className="py-2 px-2 text-right text-gray-700">
                              {day.exchangeCount || 0}
                            </td>
                            <td className="py-2 px-2 text-right text-emerald-700 font-medium">
                              {formatNumber(day.kesProfit || 0)}
                            </td>
                            <td className="py-2 px-2 text-right text-blue-700 font-medium">
                              ${formatNumber(day.usdProfit || 0)}
                            </td>
                            <td
                              className={`py-2 px-2 text-right font-medium ${(day.kesVariance || 0) === 0 ? "text-gray-400" : (day.kesVariance || 0) > 0 ? "text-blue-600" : "text-red-600"}`}
                            >
                              {(day.kesVariance || 0) === 0
                                ? "—"
                                : formatNumber(day.kesVariance)}
                            </td>
                            <td
                              className={`py-2 px-2 text-right font-medium ${(day.usdVariance || 0) === 0 ? "text-gray-400" : (day.usdVariance || 0) > 0 ? "text-blue-600" : "text-red-600"}`}
                            >
                              {(day.usdVariance || 0) === 0
                                ? "—"
                                : formatNumber(day.usdVariance)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-gray-300 font-semibold bg-gray-50">
                          <td className="py-2 px-2 text-gray-700">Total</td>
                          <td className="py-2 px-2 text-center text-gray-500 text-xs">
                            {floatHistory.filter((d: any) => d.isClosed).length}
                            /{floatHistory.length} closed
                          </td>
                          <td className="py-2 px-2 text-right text-gray-700">
                            {floatHistory.reduce(
                              (s: number, d: any) => s + (d.exchangeCount || 0),
                              0,
                            )}
                          </td>
                          <td className="py-2 px-2 text-right text-emerald-700">
                            {formatNumber(
                              floatHistory.reduce(
                                (s: number, d: any) => s + (d.kesProfit || 0),
                                0,
                              ),
                            )}
                          </td>
                          <td className="py-2 px-2 text-right text-blue-700">
                            $
                            {formatNumber(
                              floatHistory.reduce(
                                (s: number, d: any) => s + (d.usdProfit || 0),
                                0,
                              ),
                            )}
                          </td>
                          <td className="py-2 px-2"></td>
                          <td className="py-2 px-2"></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </ModalWrapper>
        )}

        {/* Rate History Modal */}
        {showRateHistoryModal && (
          <ModalWrapper onClose={() => setShowRateHistoryModal(false)}>
            <div className="bg-white w-full max-w-lg">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Exchange Rate History
                </h3>
                <button
                  onClick={() => setShowRateHistoryModal(false)}
                  className="p-1 hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                {rateHistory.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">
                    No rate history available
                  </p>
                ) : (
                  <div className="overflow-x-auto max-w-full">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-2 font-medium text-gray-600">
                            Date
                          </th>
                          <th className="text-right py-2 px-2 font-medium text-emerald-600">
                            Buy Rate
                          </th>
                          <th className="text-right py-2 px-2 font-medium text-blue-600">
                            Sell Rate
                          </th>
                          <th className="text-right py-2 px-2 font-medium text-purple-600">
                            Spread
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {rateHistory.slice(0, 30).map((r: any, i: number) => (
                          <tr
                            key={i}
                            className={`border-b border-gray-100 ${i === 0 ? "bg-indigo-50 font-semibold" : ""}`}
                          >
                            <td className="py-2 px-2 text-gray-700">
                              {new Date(
                                r.effectiveFrom || r.createdAt,
                              ).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                              <span className="text-xs text-gray-400 ml-1">
                                {new Date(
                                  r.effectiveFrom || r.createdAt,
                                ).toLocaleTimeString("en-GB", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </td>
                            <td className="py-2 px-2 text-right text-emerald-700">
                              {(r.buyRate || 0).toFixed(2)}
                            </td>
                            <td className="py-2 px-2 text-right text-blue-700">
                              {(r.sellRate || 0).toFixed(2)}
                            </td>
                            <td className="py-2 px-2 text-right text-purple-700">
                              {((r.sellRate || 0) - (r.buyRate || 0)).toFixed(
                                2,
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </ModalWrapper>
        )}

        {/* Day Close Modal */}
        {showDayCloseModal && (
          <DayCloseModal
            exchangeFloat={exchangeFloat}
            todaySummary={todaySummary}
            onClose={() => setShowDayCloseModal(false)}
            onOpening={handleRecordOpening}
            onClosing={handleRecordClosing}
            loading={actionLoading}
          />
        )}

        {/* Transaction Detail Modal */}
        {showTransactionModal && selectedTransaction && (
          <TransactionDetailModal
            transaction={selectedTransaction}
            onClose={() => {
              setShowTransactionModal(false);
              setSelectedTransaction(null);
            }}
            onVoid={handleVoidTransaction}
            loading={actionLoading}
          />
        )}
      </AnimatePresence>
      <SuccessShareModal
        isOpen={exchShareModal.show}
        onClose={() => setExchShareModal((s) => ({ ...s, show: false }))}
        title={exchShareModal.title}
        details={exchShareModal.details}
        whatsappPhone={exchShareModal.phone}
        whatsappMessage={exchShareModal.message}
      />
      <PinModal
        isOpen={showPin}
        onClose={() => {
          setShowPin(false);
          setPendingExchange(null);
        }}
        onVerified={() => {
          setShowPin(false);
          if (pendingVoid) {
            executeVoid(pendingVoid.id, pendingVoid.reason);
            setPendingVoid(null);
          } else if (pendingExchange) {
            handleNewExchange(pendingExchange);
            setPendingExchange(null);
          }
        }}
        title="Enter Transaction PIN"
      />
    </div>
  );
}

// ==============================================
// Modal Components
// ==============================================

// Set Rate Modal
function SetRateModal({
  currentRate,
  onClose,
  onSubmit,
  loading,
}: {
  currentRate: ExchangeRateDto | null;
  onClose: () => void;
  onSubmit: (buyRate: number, sellRate: number) => void;
  loading: boolean;
}) {
  const [buyRate, setBuyRate] = useState(
    currentRate?.buyRate?.toString() || "130",
  );
  const [sellRate, setSellRate] = useState(
    currentRate?.sellRate?.toString() || "140",
  );

  const spread = parseFloat(sellRate || "0") - parseFloat(buyRate || "0");
  const isValid =
    parseFloat(buyRate) > 0 && parseFloat(sellRate) > parseFloat(buyRate);

  return (
    <ModalWrapper onClose={onClose}>
      <div className="bg-white w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Set Exchange Rate
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buy Rate (KES per USD)
            </label>
            <input
              type="number"
              step="0.01"
              value={buyRate}
              onChange={(e) => setBuyRate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="130.00"
            />
            <p className="text-xs text-gray-500 mt-1">
              Rate when client sells USD to you
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sell Rate (KES per USD)
            </label>
            <input
              type="number"
              step="0.01"
              value={sellRate}
              onChange={(e) => setSellRate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="140.00"
            />
            <p className="text-xs text-gray-500 mt-1">
              Rate when client buys USD from you
            </p>
          </div>
          {spread > 0 && (
            <div className="bg-indigo-50 p-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Spread:</span>
                <span className="font-semibold text-indigo-700">
                  {spread.toFixed(2)} KES
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Your profit per USD exchanged
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(parseFloat(buyRate), parseFloat(sellRate))}
            disabled={!isValid || loading}
            className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Set Rate
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}

// UPDATED: New Exchange Modal - supports walk-in clients for Cash type
function NewExchangeModal({
  currentRate,
  clients,
  onClose,
  onSubmit,
  loading,
}: {
  currentRate: ExchangeRateDto | null;
  clients: ClientLookupDto[];
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading: boolean;
}) {
  const [clientId, setClientId] = useState("");
  const [clientName, setClientName] = useState(""); // NEW: For walk-in clients
  const [exchangeType, setExchangeType] = useState<ExchangeType>(
    ExchangeType.Cash,
  );
  const [direction, setDirection] = useState<ExchangeDirection>(
    ExchangeDirection.UsdToKes,
  );
  const [amount, setAmount] = useState("");
  const [clientIdNumber, setClientIdNumber] = useState("");
  const [notes, setNotes] = useState("");

  const selectedClient = clients.find((c) => c.id === clientId);
  const rate =
    direction === ExchangeDirection.UsdToKes
      ? currentRate?.buyRate
      : currentRate?.sellRate;
  const spread = currentRate ? currentRate.sellRate - currentRate.buyRate : 0;

  const amountNum = parseFloat(amount) || 0;
  const receivedAmount =
    direction === ExchangeDirection.UsdToKes
      ? amountNum * (rate || 0)
      : amountNum / (rate || 1);
  const profit =
    direction === ExchangeDirection.UsdToKes
      ? spread * amountNum
      : spread * receivedAmount;

  // UPDATED: Validation logic - Cash can use clientName, Account requires clientId
  const isValid =
    (exchangeType === ExchangeType.Cash
      ? clientId || clientName.trim()
      : clientId) &&
    amountNum > 0 &&
    currentRate;

  return (
    <ModalWrapper onClose={onClose}>
      <div className="bg-white w-full max-w-lg">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">New Exchange</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          {/* Exchange Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exchange Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setExchangeType(ExchangeType.Cash);
                  // Don't clear clientId - user might want to select existing client
                }}
                className={`px-4 py-2 border text-sm font-medium ${
                  exchangeType === ExchangeType.Cash
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Banknote className="w-4 h-4 inline mr-2" />
                Cash
              </button>
              <button
                type="button"
                onClick={() => {
                  setExchangeType(ExchangeType.FromAccount);
                  setClientName(""); // Clear clientName when switching to Account
                }}
                className={`px-4 py-2 border text-sm font-medium ${
                  exchangeType === ExchangeType.FromAccount
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                From Account
              </button>
            </div>
          </div>

          {/* Client Selection - UPDATED */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client{" "}
              {exchangeType === ExchangeType.FromAccount && (
                <span className="text-red-500">*</span>
              )}
              {exchangeType === ExchangeType.Cash && (
                <span className="text-gray-400 text-xs ml-1">(Optional)</span>
              )}
            </label>
            <select
              value={clientId}
              onChange={(e) => {
                setClientId(e.target.value);
                const c = clients.find((cl) => cl.id === e.target.value);
                if (c?.idPassport) setClientIdNumber(c.idPassport);
                if (e.target.value) setClientName(""); // Clear clientName if selecting a client
              }}
              className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">
                {exchangeType === ExchangeType.Cash
                  ? "Select client or enter name below..."
                  : "Select client..."}
              </option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName} ({c.code})
                </option>
              ))}
            </select>
          </div>

          {/* NEW: Walk-in Client Name - Only for Cash when no client selected */}
          {exchangeType === ExchangeType.Cash && !clientId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter walk-in client name"
              />
              <p className="text-xs text-gray-500 mt-1">
                Required for walk-in cash customers without an account
              </p>
            </div>
          )}

          {/* Direction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Direction
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDirection(ExchangeDirection.UsdToKes)}
                className={`px-4 py-2 border text-sm font-medium ${
                  direction === ExchangeDirection.UsdToKes
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                USD → KES
              </button>
              <button
                type="button"
                onClick={() => setDirection(ExchangeDirection.KesToUsd)}
                className={`px-4 py-2 border text-sm font-medium ${
                  direction === ExchangeDirection.KesToUsd
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                KES → USD
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount ({direction === ExchangeDirection.UsdToKes ? "USD" : "KES"}
              )
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0.00"
            />
          </div>

          {/* ID Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client ID Number
            </label>
            <input
              type="text"
              value={clientIdNumber}
              onChange={(e) => setClientIdNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="ID/Passport number"
            />
          </div>

          {/* Calculation Preview */}
          {amountNum > 0 && rate && (
            <div className="bg-gray-50 p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Rate:</span>
                <span className="font-medium">{rate.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Client Receives:</span>
                <span className="font-semibold text-emerald-600">
                  {direction === ExchangeDirection.UsdToKes
                    ? `KES ${formatNumber(receivedAmount)}`
                    : `$${formatNumber(receivedAmount)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm border-t border-gray-200 pt-2 mt-2">
                <span className="text-gray-600">Your Profit:</span>
                <span className="font-bold text-indigo-600">
                  KES {formatNumber(profit)}
                </span>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={2}
              placeholder="Additional notes..."
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onSubmit({
                clientId: clientId || undefined,
                clientName:
                  !clientId && exchangeType === ExchangeType.Cash
                    ? clientName.trim()
                    : undefined,
                exchangeType,
                direction,
                amount: amountNum,
                clientIdNumber: clientIdNumber || undefined,
                notes: notes || undefined,
              })
            }
            disabled={!isValid || loading}
            className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Complete Exchange
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}

// Fund Float Modal
function FundFloatModal({
  accounts,
  onClose,
  onSubmit,
  loading,
}: {
  accounts: Account[];
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading: boolean;
}) {
  const [currency, setCurrency] = useState<Currency>(Currency.KES);
  const [amount, setAmount] = useState("");
  const [sourceAccountId, setSourceAccountId] = useState("");
  const [purchaseRate, setPurchaseRate] = useState("");
  const [notes, setNotes] = useState("");

  // Funding always pays in KES (a USD float is bought with KES at the purchase rate),
  // so the source account must be a KES account regardless of the float currency.
  const filteredAccounts = accounts.filter((a) => a.currency === Currency.KES);
  const selectedAccount = accounts.find((a) => a.id === sourceAccountId);

  const amountNum = parseFloat(amount) || 0;
  const deductAmount =
    currency === Currency.USD && purchaseRate
      ? amountNum * parseFloat(purchaseRate)
      : amountNum;

  const isValid =
    amountNum > 0 &&
    sourceAccountId &&
    (currency === Currency.KES || purchaseRate);

  return (
    <ModalWrapper onClose={onClose}>
      <div className="bg-white w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Fund Float</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCurrency(Currency.KES)}
                className={`px-4 py-2 border text-sm font-medium ${
                  currency === Currency.KES
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                KES
              </button>
              <button
                type="button"
                onClick={() => setCurrency(Currency.USD)}
                className={`px-4 py-2 border text-sm font-medium ${
                  currency === Currency.USD
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                USD
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0.00"
            />
          </div>

          {currency === Currency.USD && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Rate
              </label>
              <input
                type="number"
                step="0.01"
                value={purchaseRate}
                onChange={(e) => setPurchaseRate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Rate paid per USD"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source Account
            </label>
            <select
              value={sourceAccountId}
              onChange={(e) => setSourceAccountId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select source...</option>
              {filteredAccounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} - {formatCurrency(a.balance, a.currency)}
                </option>
              ))}
            </select>
          </div>

          {amountNum > 0 && selectedAccount && (
            <div className="bg-gray-50 p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Will deduct:</span>
                <span className="font-medium">
                  KES {formatNumber(deductAmount)}
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Optional notes"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onSubmit({
                currency,
                amount: amountNum,
                sourceType: selectedAccount?.type,
                sourceAccountId,
                purchaseRate:
                  currency === Currency.USD
                    ? parseFloat(purchaseRate)
                    : undefined,
                notes: notes || undefined,
              })
            }
            disabled={!isValid || loading}
            className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Fund Float
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}

// Withdraw Float Modal
function WithdrawFloatModal({
  accounts,
  exchangeFloat,
  onClose,
  onSubmit,
  loading,
}: {
  accounts: Account[];
  exchangeFloat: ExchangeFloatDto | null;
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading: boolean;
}) {
  const [currency, setCurrency] = useState<Currency>(Currency.KES);
  const [amount, setAmount] = useState("");
  const [destinationAccountId, setDestinationAccountId] = useState("");
  const [notes, setNotes] = useState("");

  const availableBalance =
    currency === Currency.KES
      ? exchangeFloat?.kesBalance || 0
      : exchangeFloat?.usdBalance || 0;

  // FIXED: Only allow accounts that match the withdrawal currency
  // This prevents currency mismatch issues
  const filteredAccounts = accounts.filter((a) => a.currency === currency);

  const selectedAccount = accounts.find((a) => a.id === destinationAccountId);

  // Reset destination when currency changes (to avoid mismatched selection)
  useEffect(() => {
    setDestinationAccountId("");
  }, [currency]);

  const amountNum = parseFloat(amount) || 0;

  // FIXED: Enhanced validation
  const isValid =
    amountNum > 0 &&
    amountNum <= availableBalance &&
    destinationAccountId &&
    selectedAccount &&
    selectedAccount.currency === currency; // Ensure currency match

  return (
    <ModalWrapper onClose={onClose}>
      <div className="bg-white w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Withdraw from Float
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCurrency(Currency.KES)}
                className={`px-4 py-2 border text-sm font-medium ${
                  currency === Currency.KES
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                KES ({formatNumber(exchangeFloat?.kesBalance || 0)})
              </button>
              <button
                type="button"
                onClick={() => setCurrency(Currency.USD)}
                className={`px-4 py-2 border text-sm font-medium ${
                  currency === Currency.USD
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                USD ({formatNumber(exchangeFloat?.usdBalance || 0)})
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (Available: {currency === Currency.KES ? "KES" : "$"}{" "}
              {formatNumber(availableBalance)})
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0.00"
            />
            {amountNum > availableBalance && (
              <p className="text-xs text-red-500 mt-1">
                Amount exceeds available balance
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination Account ({currency === Currency.KES ? "KES" : "USD"}{" "}
              accounts only)
            </label>
            <select
              value={destinationAccountId}
              onChange={(e) => setDestinationAccountId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select destination...</option>
              {filteredAccounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} (Balance: {currency === Currency.KES ? "KES" : "$"}{" "}
                  {formatNumber(a.balance)})
                </option>
              ))}
            </select>
            {filteredAccounts.length === 0 && (
              <p className="text-xs text-amber-600 mt-1">
                No {currency === Currency.KES ? "KES" : "USD"} accounts
                available
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Optional notes"
            />
          </div>

          {/* Summary */}
          {selectedAccount && amountNum > 0 && (
            <div className="bg-amber-50 border border-amber-200 p-3 space-y-1">
              <p className="text-sm font-medium text-amber-800">
                Transfer Summary
              </p>
              <p className="text-xs text-amber-700">
                From: Exchange Float (
                {currency === Currency.KES ? "KES" : "USD"})
              </p>
              <p className="text-xs text-amber-700">
                To: {selectedAccount.name}
              </p>
              <p className="text-xs text-amber-700 font-medium">
                Amount: {currency === Currency.KES ? "KES" : "$"}{" "}
                {formatNumber(amountNum)}
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!selectedAccount) {
                toast.error("Please select a valid destination account");
                return;
              }
              onSubmit({
                currency,
                amount: amountNum,
                destinationType: selectedAccount.type,
                destinationAccountId,
                notes: notes || undefined,
              });
            }}
            disabled={!isValid || loading}
            className="px-4 py-2 bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Withdraw
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}

// Settle Profit Modal
function SettleProfitModal({
  accounts,
  exchangeFloat,
  onClose,
  onSubmit,
  loading,
}: {
  accounts: Account[];
  exchangeFloat: ExchangeFloatDto | null;
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading: boolean;
}) {
  const [currency, setCurrency] = useState<Currency>(Currency.KES);
  const [amount, setAmount] = useState("");
  const [destinationAccountId, setDestinationAccountId] = useState("");
  const [notes, setNotes] = useState("");

  const availableProfit =
    currency === Currency.KES
      ? exchangeFloat?.kesProfit || 0
      : exchangeFloat?.usdProfit || 0;

  const filteredAccounts = accounts.filter((a) => a.currency === currency);
  const selectedAccount = accounts.find((a) => a.id === destinationAccountId);

  const amountNum = parseFloat(amount) || 0;
  const isValid =
    amountNum > 0 && amountNum <= availableProfit && destinationAccountId;

  return (
    <ModalWrapper onClose={onClose}>
      <div className="bg-white w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Settle Profit</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="bg-emerald-50 p-4">
            <p className="text-sm text-emerald-700 mb-2">Available Profit</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-emerald-600">KES</p>
                <p className="text-xl font-bold text-emerald-700">
                  {formatNumber(exchangeFloat?.kesProfit || 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-emerald-600">USD</p>
                <p className="text-xl font-bold text-emerald-700">
                  ${formatNumber(exchangeFloat?.usdProfit || 0)}
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCurrency(Currency.KES)}
                className={`px-4 py-2 border text-sm font-medium ${
                  currency === Currency.KES
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                KES
              </button>
              <button
                type="button"
                onClick={() => setCurrency(Currency.USD)}
                className={`px-4 py-2 border text-sm font-medium ${
                  currency === Currency.USD
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                USD
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (Available: {currency === Currency.KES ? "KES" : "$"}{" "}
              {formatNumber(availableProfit)})
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0.00"
            />
            <button
              type="button"
              onClick={() => setAmount(availableProfit.toString())}
              className="text-xs text-indigo-600 mt-1 hover:underline"
            >
              Settle all
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination Account
            </label>
            <select
              value={destinationAccountId}
              onChange={(e) => setDestinationAccountId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select destination...</option>
              {filteredAccounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Optional notes"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onSubmit({
                currency,
                amount: amountNum,
                destinationType: selectedAccount?.type,
                destinationAccountId,
                notes: notes || undefined,
              })
            }
            disabled={!isValid || loading}
            className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Settle Profit
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}

// USD Position Modal
function UsdPositionModal({
  position,
  onClose,
}: {
  position: UsdPositionDto;
  onClose: () => void;
}) {
  const isProfitable = position.unrealizedPnL >= 0;

  return (
    <ModalWrapper onClose={onClose}>
      <div className="bg-white w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">USD Position</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3">
              <p className="text-xs text-gray-500 mb-1">USD Balance</p>
              <p className="text-xl font-bold text-gray-900">
                ${formatNumber(position.usdBalance)}
              </p>
            </div>
            <div className="bg-gray-50 p-3">
              <p className="text-xs text-gray-500 mb-1">Average Cost</p>
              <p className="text-xl font-bold text-gray-900">
                {position.averageCostPerUsd.toFixed(2)} KES
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Cost Basis</span>
              <span className="font-medium">
                KES {formatNumber(position.totalCostBasis)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Current Market Rate</span>
              <span className="font-medium">
                {position.currentMarketRate.toFixed(2)} KES
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Current Market Value</span>
              <span className="font-medium">
                KES {formatNumber(position.currentMarketValue)}
              </span>
            </div>
          </div>

          <div
            className={`p-4 ${isProfitable ? "bg-emerald-50" : "bg-red-50"}`}
          >
            <div className="flex justify-between items-center">
              <span
                className={`text-sm ${
                  isProfitable ? "text-emerald-700" : "text-red-700"
                }`}
              >
                Unrealized P&L
              </span>
              <div className="text-right">
                <p
                  className={`text-xl font-bold ${
                    isProfitable ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {isProfitable ? "+" : ""}KES{" "}
                  {formatNumber(position.unrealizedPnL)}
                </p>
                <p
                  className={`text-sm ${
                    isProfitable ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  ({isProfitable ? "+" : ""}
                  {position.unrealizedPnLPercent.toFixed(2)}%)
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}

// Calculator Modal
function CalculatorModal({
  currentRate,
  onClose,
}: {
  currentRate: ExchangeRateDto;
  onClose: () => void;
}) {
  const [direction, setDirection] = useState<ExchangeDirection>(
    ExchangeDirection.UsdToKes,
  );
  const [amount, setAmount] = useState("");

  const rate =
    direction === ExchangeDirection.UsdToKes
      ? currentRate.buyRate
      : currentRate.sellRate;
  const spread = currentRate.sellRate - currentRate.buyRate;
  const amountNum = parseFloat(amount) || 0;

  const receivedAmount =
    direction === ExchangeDirection.UsdToKes
      ? amountNum * rate
      : amountNum / rate;

  const profit =
    direction === ExchangeDirection.UsdToKes
      ? spread * amountNum
      : spread * receivedAmount;

  return (
    <ModalWrapper onClose={onClose}>
      <div className="bg-white w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Quick Calculator
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setDirection(ExchangeDirection.UsdToKes)}
              className={`px-4 py-3 border text-sm font-medium ${
                direction === ExchangeDirection.UsdToKes
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 text-gray-700"
              }`}
            >
              USD → KES
            </button>
            <button
              onClick={() => setDirection(ExchangeDirection.KesToUsd)}
              className={`px-4 py-3 border text-sm font-medium ${
                direction === ExchangeDirection.KesToUsd
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 text-gray-700"
              }`}
            >
              KES → USD
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {direction === ExchangeDirection.UsdToKes
                ? "USD Amount"
                : "KES Amount"}
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-3 border border-gray-200 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0.00"
            />
          </div>

          <div className="bg-gray-50 p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Rate</span>
              <span className="font-semibold">{rate.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-gray-600">Client Receives</span>
              <span className="font-bold text-indigo-600">
                {direction === ExchangeDirection.UsdToKes
                  ? `KES ${formatNumber(receivedAmount)}`
                  : `$${formatNumber(receivedAmount)}`}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="text-gray-600">Your Profit</span>
              <span className="font-bold text-emerald-600">
                KES {formatNumber(profit)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-end p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}

// Day Close Modal
function DayCloseModal({
  exchangeFloat,
  todaySummary,
  onClose,
  onOpening,
  onClosing,
  loading,
}: {
  exchangeFloat: ExchangeFloatDto | null;
  todaySummary: DailySummaryDto | null;
  onClose: () => void;
  onOpening: (kesCount: number, usdCount: number, notes?: string) => void;
  onClosing: (kesCount: number, usdCount: number, notes?: string) => void;
  loading: boolean;
}) {
  const [mode, setMode] = useState<"opening" | "closing">("opening");
  const [kesCount, setKesCount] = useState("");
  const [usdCount, setUsdCount] = useState("");
  const [notes, setNotes] = useState("");

  const expectedKes = exchangeFloat?.kesBalance || 0;
  const expectedUsd = exchangeFloat?.usdBalance || 0;

  const kesCountNum = parseFloat(kesCount) || 0;
  const usdCountNum = parseFloat(usdCount) || 0;

  const kesVariance = kesCountNum - expectedKes;
  const usdVariance = usdCountNum - expectedUsd;

  const isValid = kesCount !== "" && usdCount !== "";

  return (
    <ModalWrapper onClose={onClose}>
      <div className="bg-white w-full max-w-lg">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Daily Float Verification
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          {/* Opening / Closing Toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setMode("opening")}
              className={`flex items-center justify-center gap-2 px-4 py-3 border text-sm font-medium transition-colors ${
                mode === "opening"
                  ? "border-amber-500 bg-amber-50 text-amber-700"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              ☀️ Record Opening
            </button>
            <button
              onClick={() => setMode("closing")}
              className={`flex items-center justify-center gap-2 px-4 py-3 border text-sm font-medium transition-colors ${
                mode === "closing"
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              🌙 Record Closing
            </button>
          </div>

          <p className="text-xs text-gray-500">
            {mode === "opening"
              ? "Count physical cash at the start of the day to verify overnight integrity."
              : "Count physical cash at end of day and compare with system balances."}
          </p>

          {/* Today's Summary — only show for closing */}
          {mode === "closing" && todaySummary && (
            <div className="bg-indigo-50 p-4 space-y-2">
              <h4 className="text-sm font-medium text-indigo-900">
                Today's Activity
              </h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-indigo-600">Exchanges</p>
                  <p className="font-semibold text-indigo-900">
                    {todaySummary.exchangeCount}
                  </p>
                </div>
                <div>
                  <p className="text-indigo-600">KES Profit</p>
                  <p className="font-semibold text-indigo-900">
                    {formatNumber(todaySummary.kesProfit)}
                  </p>
                </div>
                <div>
                  <p className="text-indigo-600">USD Profit</p>
                  <p className="font-semibold text-indigo-900">
                    ${formatNumber(todaySummary.usdProfit)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Expected vs Actual */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                KES Physical Count *
              </label>
              <input
                type="number"
                value={kesCount}
                onChange={(e) => setKesCount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Count physical KES"
              />
              <p className="text-xs text-gray-500 mt-1">
                System: KES {formatNumber(expectedKes)}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                USD Physical Count *
              </label>
              <input
                type="number"
                value={usdCount}
                onChange={(e) => setUsdCount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Count physical USD"
              />
              <p className="text-xs text-gray-500 mt-1">
                System: ${formatNumber(expectedUsd)}
              </p>
            </div>
          </div>

          {/* Variance — show for closing mode */}
          {mode === "closing" && kesCount !== "" && usdCount !== "" && (
            <div
              className={`p-4 ${kesVariance === 0 && usdVariance === 0 ? "bg-emerald-50" : "bg-amber-50"}`}
            >
              <h4 className="text-sm font-medium mb-2">Variance</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between">
                  <span className="text-sm">KES:</span>
                  <span
                    className={`font-medium ${kesVariance === 0 ? "text-emerald-600" : kesVariance > 0 ? "text-blue-600" : "text-red-600"}`}
                  >
                    {kesVariance > 0 ? "+" : ""}
                    {formatNumber(kesVariance)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">USD:</span>
                  <span
                    className={`font-medium ${usdVariance === 0 ? "text-emerald-600" : usdVariance > 0 ? "text-blue-600" : "text-red-600"}`}
                  >
                    {usdVariance > 0 ? "+" : ""}
                    {formatNumber(usdVariance)}
                  </span>
                </div>
              </div>
              {(kesVariance !== 0 || usdVariance !== 0) && (
                <p className="text-xs text-amber-700 mt-2">
                  <AlertTriangle className="w-3 h-3 inline mr-1" />
                  Variance detected. Please verify your count.
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={2}
              placeholder={
                mode === "opening"
                  ? "Opening notes..."
                  : "Closing notes, discrepancies..."
              }
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              mode === "opening"
                ? onOpening(kesCountNum, usdCountNum, notes || undefined)
                : onClosing(kesCountNum, usdCountNum, notes || undefined)
            }
            disabled={!isValid || loading}
            className={`px-6 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-2 ${
              mode === "opening"
                ? "bg-amber-600 hover:bg-amber-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
            {mode === "opening" ? "☀️ Record Opening" : "🌙 Record Closing"}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}

// Transaction Detail Modal
function TransactionDetailModal({
  transaction,
  onClose,
  onVoid,
  loading,
}: {
  transaction: ExchangeResponseDto;
  onClose: () => void;
  onVoid: (id: string, reason: string) => void;
  loading: boolean;
}) {
  const [showVoidForm, setShowVoidForm] = useState(false);
  const [voidReason, setVoidReason] = useState("");

  const handleCopy = () => {
    const text = `Exchange: ${transaction.code}\nDate: ${formatDateTime(
      transaction.date,
    )}\nClient: ${transaction.clientName}\nGiven: ${formatCurrency(
      transaction.amountGiven,
      transaction.currencyGiven,
    )}\nReceived: ${formatCurrency(
      transaction.amountReceived,
      transaction.currencyReceived,
    )}\nRate: ${transaction.exchangeRate}\nProfit: ${formatCurrency(
      transaction.profit,
      transaction.profitCurrency,
    )}`;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <ModalWrapper onClose={onClose}>
      <div className="bg-white w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {transaction.code}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          {transaction.isLargeTransaction && (
            <div className="flex items-center gap-2 p-2 bg-amber-50 text-amber-800 text-sm">
              <AlertTriangle className="w-4 h-4" />
              Large Transaction (Compliance Required)
            </div>
          )}

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Date</span>
              <span className="font-medium">
                {formatDateTime(transaction.date)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Client</span>
              <span className="font-medium">{transaction.clientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Type</span>
              <span
                className={`px-2 py-0.5 text-xs font-medium ${
                  transaction.exchangeType === ExchangeType.Cash
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {transaction.exchangeType === ExchangeType.Cash
                  ? "Cash"
                  : "From Account"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Direction</span>
              <span className="font-medium">
                {transaction.direction === ExchangeDirection.UsdToKes
                  ? "USD → KES"
                  : "KES → USD"}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-3 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Given</span>
              <span className="font-medium text-emerald-600">
                +
                {formatCurrency(
                  transaction.amountGiven,
                  transaction.currencyGiven,
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Received</span>
              <span className="font-medium text-red-600">
                -
                {formatCurrency(
                  transaction.amountReceived,
                  transaction.currencyReceived,
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Rate</span>
              <span className="font-medium">
                {transaction.exchangeRate.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between bg-emerald-50 p-2 -mx-2">
              <span className="text-emerald-700 font-medium">Profit</span>
              <span className="font-bold text-emerald-700">
                {formatCurrency(transaction.profit, transaction.profitCurrency)}
              </span>
            </div>
          </div>

          {transaction.notes && (
            <div className="border-t border-gray-200 pt-3">
              <p className="text-sm text-gray-500">Notes</p>
              <p className="text-sm">{transaction.notes}</p>
            </div>
          )}

          {transaction.status === "Voided" && (
            <div className="bg-red-50 p-3 text-red-800 text-sm">
              <p className="font-medium">This transaction has been voided</p>
            </div>
          )}

          {showVoidForm && transaction.status !== "Voided" && (
            <div className="border-t border-gray-200 pt-3 space-y-3">
              <p className="text-sm font-medium text-red-600">
                Void this transaction?
              </p>
              <input
                type="text"
                value={voidReason}
                onChange={(e) => setVoidReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Reason for voiding..."
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowVoidForm(false)}
                  className="flex-1 px-3 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onVoid(transaction.id, voidReason)}
                  disabled={!voidReason || loading}
                  className="flex-1 px-3 py-2 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Confirm Void
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-between p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-gray-100 transition-colors"
              title="Copy"
            >
              <Copy className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div className="flex gap-2">
            {transaction.status !== "Voided" && !showVoidForm && (
              <button
                onClick={() => setShowVoidForm(true)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 text-sm font-medium"
              >
                Void
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}

// Modal Wrapper
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
        className="w-full max-w-lg"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
