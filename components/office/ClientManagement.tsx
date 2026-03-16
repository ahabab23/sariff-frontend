"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Eye,
  Wallet,
  DollarSign,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  Download,
  X,
  Calendar,
  FileText,
  ArrowUpCircle,
  ArrowDownCircle,
  Edit3,
  Trash2,
  UserCheck,
  Clock,
  RefreshCw,
  ArrowRight,
  Activity,
  Printer,
  SlidersHorizontal,
  User,
  Hash,
  CreditCard,
  Loader2,
  Key,
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ClientDto,
  CreateClientDto,
  UpdateClientDto,
  TransactionDto,
  PagedResult,
  ClientType,
  Currency,
  TransactionType,
  AccountType,
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getClientStatement,
  getClientStats,
  formatCurrency,
  getClientTypeLabel,
  getCurrencyLabel,
  getAccountTypeLabel,
  apiRequest,
} from "@/lib/api";

// ==============================================
// Additional DTOs matching backend
// ==============================================

interface ClientStatsDto {
  totalClients: number;
  permanentClients: number;
  temporaryClients: number;
  clientsWithDebit: number;
  clientsWithCredit: number;
  totalBalanceKES: number;
  totalBalanceUSD: number;
}

interface ConvertClientDto {
  password: string;
}

// DTO for updating a transaction
interface UpdateTransactionDto {
  description?: string;
  notes?: string;
  reference?: string;
}

// Local transaction type for display (matches backend StatementLineDto)
interface DisplayTransaction {
  id: string;
  code: string;
  reference: string;
  transactionDate: string;
  transactionType: number;
  thisAccountAction: string; // "Credit" or "Debit"
  debit: number | null;
  credit: number | null;
  amount: number;
  currency: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  notes?: string;
  exchangeRate?: number;
  counterAmount?: number;
  counterCurrency?: number;
  reconciliationStatus: number;
  createdAt: string;
  // Related account info from API
  relatedAccount?: {
    accountId: string;
    accountType: number;
    accountName: string;
    accountCode: string;
    currency: number;
    action: string; // "Debit" or "Credit"
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    clientCode?: string;
    clientPhone?: string;
  };
}

export function ClientManagement() {
  // ==============================================
  // State Management
  // ==============================================
  const [activeTab, setActiveTab] = useState<"all" | "debit" | "credit">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddClient, setShowAddClient] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientDto | null>(null);
  const [showStatement, setShowStatement] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);

  // Transaction-related states
  const [selectedTransaction, setSelectedTransaction] =
    useState<DisplayTransaction | null>(null);
  const [showTransactionDetail, setShowTransactionDetail] = useState(false);
  const [showEditTransaction, setShowEditTransaction] = useState(false);
  const [showDeleteTransaction, setShowDeleteTransaction] = useState(false);
  const [showRelatedAccount, setShowRelatedAccount] = useState(false);

  // Transaction edit form state
  const [editTransactionForm, setEditTransactionForm] = useState({
    description: "",
    notes: "",
    reference: "",
  });

  // Transaction filters
  const [transactionSearch, setTransactionSearch] = useState("");
  const [transactionFilter, setTransactionFilter] = useState<
    "all" | "credit" | "debit"
  >("all");
  const [currencyFilter, setCurrencyFilter] = useState<"all" | "KES" | "USD">(
    "all"
  );

  // Data states
  const [clients, setClients] = useState<ClientDto[]>([]);
  const [clientStats, setClientStats] = useState<ClientStatsDto | null>(null);
  const [clientTransactions, setClientTransactions] = useState<
    DisplayTransaction[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingStatement, setIsLoadingStatement] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(8);
  const calculatedTotalPages = Math.max(
    1,
    totalPages || 1,
    Math.ceil((totalCount || 0) / (pageSize || 1)) || 1
  );

  // Transaction pagination
  const [transactionsCurrentPage, setTransactionsCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(30);

  // Form states
  const [formData, setFormData] = useState<Partial<CreateClientDto>>({
    fullName: "",
    whatsAppNumber: "",
    email: "",
    idPassport: "",
    clientType: ClientType.Permanent,
    password: "",
    openingBalanceKES: 0,
    openingBalanceUSD: 0,
  });

  const [editFormData, setEditFormData] = useState<Partial<UpdateClientDto>>({
    fullName: "",
    email: "",
    whatsAppNumber: "",
    idPassport: "",
    isActive: true,
  });

  const [convertPassword, setConvertPassword] = useState("");

  // ==============================================
  // API Functions
  // ==============================================
  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    try {
      const filter = activeTab === "all" ? undefined : activeTab;

      // ✅ normalize search term (case-insensitive + remove extra spaces)
      const normalizedSearch = searchTerm?.trim().toLowerCase() || undefined;

      const result = await getClients(
        currentPage,
        pageSize,
        normalizedSearch,
        filter
      );

      if (result.success && result.data) {
        setClients(result.data.items);
        setTotalPages(result.data.totalPages);
        setTotalCount(result.data.totalCount);
      } else {
        toast.error(result.message || "Failed to fetch clients");
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("Failed to fetch clients");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchTerm, activeTab]);
  const fetchClientStats = useCallback(async () => {
    try {
      const result = await getClientStats();
      if (result.success && result.data) {
        setClientStats(result.data);
      }
    } catch (error) {
      console.error("Error fetching client stats:", error);
    }
  }, []);

  const fetchClientStatement = async (clientId: string) => {
    setIsLoadingStatement(true);
    try {
      const result = await getClientStatement(clientId);

      console.log("Client Statement Response:", result);

      if (result.success && result.data) {
        const data = result.data;
        console.log(data);
        let transactions: DisplayTransaction[] = [];

        // Handle different response structures
        if (Array.isArray(data)) {
          transactions = data.map(mapTransactionToDisplay);
        } else if (data.transactions && Array.isArray(data.transactions)) {
          transactions = data.transactions.map(mapTransactionToDisplay);
        } else if (data.items && Array.isArray(data.items)) {
          transactions = data.items.map(mapTransactionToDisplay);
        }

        setClientTransactions(transactions);
      } else {
        setClientTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching client statement:", error);
      toast.error("Failed to fetch client statement");
      setClientTransactions([]);
    } finally {
      setIsLoadingStatement(false);
    }
  };

  // Map API transaction to display format with related account info
  const mapTransactionToDisplay = (txn: any): DisplayTransaction => {
    return {
      id: txn.transactionId || txn.id || "",
      code: txn.transactionCode || txn.code || "",
      reference: txn.reference || txn.transactionCode || txn.code || "",
      transactionDate: txn.date || txn.transactionDate || txn.createdAt || "",
      transactionType: txn.transactionType ?? 0,
      thisAccountAction: txn.thisAccountAction || "",
      debit: txn.debit ?? null,
      credit: txn.credit ?? null,
      amount: txn.amount ?? 0,
      currency: txn.currency ?? 0,
      balanceBefore: txn.balanceBefore ?? 0,
      balanceAfter: txn.balanceAfter ?? 0,
      description: txn.description || "",
      notes: txn.notes,
      exchangeRate: txn.exchangeRate,
      counterAmount: txn.counterAmount,
      counterCurrency: txn.counterCurrency,
      reconciliationStatus: txn.reconciliationStatus ?? 0,
      createdAt: txn.date || txn.createdAt || "",
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

  // ==============================================
  // Effects
  // ==============================================

  useEffect(() => {
    fetchClients();
    fetchClientStats();
  }, [fetchClients, fetchClientStats]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  // Reset transaction pagination when filters change
  useEffect(() => {
    setTransactionsCurrentPage(1);
  }, [transactionSearch, transactionFilter, currencyFilter]);

  // ==============================================
  // Event Handlers - Clients
  // ==============================================

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.whatsAppNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const dto: CreateClientDto = {
        fullName: formData.fullName!,
        whatsAppNumber: formData.whatsAppNumber!,
        email: formData.email || undefined,
        idPassport: formData.idPassport || undefined,
        clientType: formData.clientType ?? ClientType.Permanent,
        password: formData.password || undefined,
        openingBalanceKES: formData.openingBalanceKES || 0,
        openingBalanceUSD: formData.openingBalanceUSD || 0,
      };

      const result = await createClient(dto);

      if (result.success) {
        toast.success("Client created successfully!");
        setShowAddClient(false);
        resetForm();
        fetchClients();
        fetchClientStats();
      } else {
        toast.error(result.message || "Failed to create client");
      }
    } catch (error) {
      console.error("Error creating client:", error);
      toast.error("Failed to create client");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClient) return;

    setIsSubmitting(true);
    try {
      const dto: UpdateClientDto = {
        fullName: editFormData.fullName || undefined,
        email: editFormData.email || undefined,
        whatsAppNumber: editFormData.whatsAppNumber || undefined,
        idPassport: editFormData.idPassport || undefined,
        isActive: editFormData.isActive,
      };

      const result = await updateClient(selectedClient.id, dto);

      if (result.success) {
        toast.success("Client updated successfully!");
        setShowEditModal(false);
        fetchClients();
        fetchClientStats();
      } else {
        toast.error(result.message || "Failed to update client");
      }
    } catch (error) {
      console.error("Error updating client:", error);
      toast.error("Failed to update client");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClient = async () => {
    if (!selectedClient) return;

    setIsSubmitting(true);
    try {
      const result = await deleteClient(selectedClient.id);

      if (result.success) {
        toast.success("Client deleted successfully!");
        setShowDeleteConfirm(false);
        setShowStatement(false);
        setSelectedClient(null);
        fetchClients();
        fetchClientStats();
      } else {
        toast.error(result.message || "Failed to delete client");
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Failed to delete client");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConvertToPermanent = async () => {
    if (!selectedClient || !convertPassword) {
      toast.error("Please enter a password");
      return;
    }

    setIsSubmitting(true);
    try {
      const dto: ConvertClientDto = { password: convertPassword };
      const result = await apiRequest<ClientDto>(
        `/api/client/${selectedClient.id}/convert`,
        {
          method: "POST",
          body: JSON.stringify(dto),
        }
      );

      if (result.success) {
        toast.success("Client converted to permanent successfully!");
        setShowConvertModal(false);
        setConvertPassword("");
        fetchClients();
        fetchClientStats();
      } else {
        toast.error(result.message || "Failed to convert client");
      }
    } catch (error) {
      console.error("Error converting client:", error);
      toast.error("Failed to convert client");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewClient = async (client: ClientDto) => {
    setSelectedClient(client);
    setShowStatement(true);
    setTransactionsCurrentPage(1);
    await fetchClientStatement(client.id);
  };

  const handleEditClient = (client: ClientDto) => {
    setSelectedClient(client);
    setEditFormData({
      fullName: client.fullName,
      email: client.email || "",
      whatsAppNumber: client.whatsAppNumber || "",
      idPassport: client.idPassport || "",
      isActive: client.isActive,
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      whatsAppNumber: "",
      email: "",
      idPassport: "",
      clientType: ClientType.Permanent,
      password: "",
      openingBalanceKES: 0,
      openingBalanceUSD: 0,
    });
  };

  // ==============================================
  // Event Handlers - Transactions
  // ==============================================

  const handleViewTransaction = (transaction: DisplayTransaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetail(true);
  };

  const handleEditTransaction = (transaction: DisplayTransaction) => {
    setSelectedTransaction(transaction);
    // Initialize the edit form with current values
    setEditTransactionForm({
      description: transaction.description || "",
      notes: transaction.notes || "",
      reference: transaction.reference || "",
    });
    setShowEditTransaction(true);
  };

  const handleDeleteTransaction = (transaction: DisplayTransaction) => {
    setSelectedTransaction(transaction);
    setShowDeleteTransaction(true);
  };

  // NEW: Actually update the transaction via API
  const confirmUpdateTransaction = async () => {
    if (!selectedTransaction) return;

    setIsSubmitting(true);
    try {
      const dto: UpdateTransactionDto = {
        description: editTransactionForm.description || undefined,
        notes: editTransactionForm.notes || undefined,
        reference: editTransactionForm.reference || undefined,
      };

      const result = await apiRequest<any>(
        `/api/transaction/${selectedTransaction.id}`,
        {
          method: "PUT",
          body: JSON.stringify(dto),
        }
      );

      if (result.success) {
        toast.success(
          `Transaction ${
            selectedTransaction.reference || selectedTransaction.code
          } updated successfully`
        );
        setShowEditTransaction(false);
        setSelectedTransaction(null);
        // Refresh transactions
        if (selectedClient) {
          await fetchClientStatement(selectedClient.id);
        }
      } else {
        toast.error(result.message || "Failed to update transaction");
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Failed to update transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteTransaction = async () => {
    if (!selectedTransaction) return;

    setIsSubmitting(true);
    try {
      // Call API to delete transaction
      const result = await apiRequest<boolean>(
        `/api/transaction/${selectedTransaction.id}`,
        {
          method: "DELETE",
          body: JSON.stringify({ reason: "User requested deletion" }),
        }
      );

      if (result.success) {
        toast.success(
          `Transaction ${selectedTransaction.reference} deleted successfully`
        );
        setShowDeleteTransaction(false);
        setSelectedTransaction(null);
        // Refresh transactions
        if (selectedClient) {
          await fetchClientStatement(selectedClient.id);
        }
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

  const handlePrintStatement = () => {
    toast.success("Preparing statement for printing...");
    window.print();
  };

  // ==============================================
  // Filter Transactions
  // ==============================================

  const getFilteredTransactions = () => {
    let transactions = [...clientTransactions];

    // Apply type filter
    if (transactionFilter !== "all") {
      transactions = transactions.filter((t) => {
        if (transactionFilter === "credit")
          return t.transactionType === TransactionType.Credit;
        if (transactionFilter === "debit")
          return t.transactionType === TransactionType.Debit;
        return true;
      });
    }

    // Apply currency filter
    if (currencyFilter !== "all") {
      transactions = transactions.filter((t) => {
        if (currencyFilter === "KES") return t.currency === Currency.KES;
        if (currencyFilter === "USD") return t.currency === Currency.USD;
        return true;
      });
    }

    // Apply search filter
    if (transactionSearch) {
      const search = transactionSearch.toLowerCase();
      transactions = transactions.filter(
        (t) =>
          t.description.toLowerCase().includes(search) ||
          t.reference.toLowerCase().includes(search) ||
          t.code.toLowerCase().includes(search)
      );
    }

    return transactions;
  };

  // Pagination for transactions
  const filteredTransactions = getFilteredTransactions();
  const totalTransactionPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
  );
  const indexOfLastTransaction = transactionsCurrentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  // ==============================================
  // PDF Export Functions
  // ==============================================

  const handleExportStatementPDF = () => {
    if (!selectedClient) return;

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Header
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, pageWidth, 40, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("SARIF", 14, 15);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Fintech Solutions", 14, 22);
      doc.text("Client Account Statement", 14, 29);

      doc.setFontSize(9);
      doc.text(
        `Generated: ${new Date().toLocaleString()}`,
        pageWidth - 14,
        15,
        { align: "right" }
      );

      // Client Information
      let yPos = 50;
      doc.setFillColor(241, 245, 249);
      doc.rect(14, yPos, pageWidth - 28, 35, "F");

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Client Information", 18, yPos + 7);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(`Client ID: ${selectedClient.code}`, 18, yPos + 14);
      doc.text(`Name: ${selectedClient.fullName}`, 18, yPos + 20);
      doc.text(
        `Type: ${getClientTypeLabel(selectedClient.clientType)}`,
        18,
        yPos + 26
      );

      doc.text(
        `Phone: ${selectedClient.whatsAppNumber}`,
        pageWidth / 2,
        yPos + 14
      );
      doc.text(
        `Email: ${selectedClient.email || "N/A"}`,
        pageWidth / 2,
        yPos + 20
      );
      doc.text(
        `Status: ${selectedClient.isActive ? "Active" : "Inactive"}`,
        pageWidth / 2,
        yPos + 26
      );

      // Account Summary
      yPos += 42;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Account Summary", 14, yPos);

      yPos += 7;
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.5);

      // KES Summary
      doc.rect(14, yPos, (pageWidth - 28) / 2 - 2, 25);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("KENYAN SHILLING (KES)", 18, yPos + 6);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(`Balance:`, 18, yPos + 12);
      doc.setTextColor(
        selectedClient.balanceKES >= 0 ? 5 : 220,
        selectedClient.balanceKES >= 0 ? 150 : 38,
        selectedClient.balanceKES >= 0 ? 105 : 38
      );
      doc.text(
        `KES ${selectedClient.balanceKES.toLocaleString()}`,
        55,
        yPos + 12
      );

      // USD Summary
      doc.setTextColor(0, 0, 0);
      doc.rect(pageWidth / 2 + 2, yPos, (pageWidth - 28) / 2 - 2, 25);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("US DOLLAR (USD)", pageWidth / 2 + 6, yPos + 6);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(`Balance:`, pageWidth / 2 + 6, yPos + 12);
      doc.setTextColor(
        selectedClient.balanceUSD >= 0 ? 5 : 220,
        selectedClient.balanceUSD >= 0 ? 150 : 38,
        selectedClient.balanceUSD >= 0 ? 105 : 38
      );
      doc.text(
        `$${selectedClient.balanceUSD.toLocaleString()}`,
        pageWidth / 2 + 6 + 37,
        yPos + 12
      );

      // Transaction History
      if (filteredTransactions.length > 0) {
        yPos += 33;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Transaction History", 14, yPos);

        const txnTableData = filteredTransactions.map((txn) => [
          new Date(txn.transactionDate || txn.createdAt).toLocaleDateString(),
          txn.reference || txn.code,
          txn.description.substring(0, 35) +
            (txn.description.length > 35 ? "..." : ""),
          txn.thisAccountAction ||
            (txn.transactionType === TransactionType.Debit
              ? "DEBIT"
              : "CREDIT"),
          txn.currency === Currency.KES ? "KES" : "USD",
          (txn.amount ?? 0).toLocaleString(),
        ]);

        autoTable(doc, {
          startY: yPos + 5,
          head: [
            ["Date", "Reference", "Description", "Type", "Currency", "Amount"],
          ],
          body: txnTableData,
          theme: "grid",
          headStyles: {
            fillColor: [37, 99, 235],
            textColor: [255, 255, 255],
            fontSize: 7,
            fontStyle: "bold",
          },
          bodyStyles: { fontSize: 7 },
          alternateRowStyles: { fillColor: [248, 250, 252] },
          margin: { left: 14, right: 14 },
          didDrawPage: (data: any) => {
            doc.setFontSize(8);
            doc.setTextColor(100);
            doc.text(
              `Page ${data.pageNumber}`,
              pageWidth / 2,
              pageHeight - 10,
              { align: "center" }
            );
          },
        });
      }

      const fileName = `Sarif_Statement_${selectedClient.code}_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      doc.save(fileName);
      toast.success("Statement PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating statement PDF:", error);
      toast.error("Failed to generate statement PDF");
    }
  };

  const handleExportClientsPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Header
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, pageWidth, 35, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("SARIF", 14, 15);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Fintech Solutions", 14, 22);
      doc.text("Client Management Report", 14, 28);

      doc.setFontSize(9);
      doc.text(
        `Generated: ${new Date().toLocaleString()}`,
        pageWidth - 14,
        15,
        { align: "right" }
      );
      doc.text(`Total Clients: ${totalCount}`, pageWidth - 14, 22, {
        align: "right",
      });

      // Summary Statistics
      if (clientStats) {
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Summary Statistics", 14, 45);

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        const yPos = 52;

        doc.text(`Total Clients: ${clientStats.totalClients}`, 14, yPos);
        doc.text(`Permanent: ${clientStats.permanentClients}`, 14, yPos + 6);
        doc.text(`Temporary: ${clientStats.temporaryClients}`, 14, yPos + 12);
        doc.text(
          `Total KES Balance: KES ${clientStats.totalBalanceKES.toLocaleString()}`,
          pageWidth / 2,
          yPos
        );
        doc.text(
          `Total USD Balance: $${clientStats.totalBalanceUSD.toLocaleString()}`,
          pageWidth / 2,
          yPos + 6
        );
      }

      // Client List Table
      const tableData = clients.map((client) => [
        client.code,
        client.fullName,
        getClientTypeLabel(client.clientType),
        client.whatsAppNumber,
        `KES ${client.balanceKES.toLocaleString()}`,
        `$${client.balanceUSD.toLocaleString()}`,
        client.isActive ? "Active" : "Inactive",
      ]);

      autoTable(doc, {
        startY: clientStats ? 75 : 45,
        head: [
          [
            "Code",
            "Name",
            "Type",
            "Phone",
            "KES Balance",
            "USD Balance",
            "Status",
          ],
        ],
        body: tableData,
        theme: "grid",
        headStyles: {
          fillColor: [37, 99, 235],
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: "bold",
        },
        bodyStyles: { fontSize: 7 },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        margin: { left: 14, right: 14 },
        didDrawPage: (data: any) => {
          doc.setFontSize(8);
          doc.setTextColor(100);
          doc.text(`Page ${data.pageNumber}`, pageWidth / 2, pageHeight - 10, {
            align: "center",
          });
        },
      });

      const fileName = `Sarif_Clients_Report_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      doc.save(fileName);
      toast.success("PDF report downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF report");
    }
  };

  // ==============================================
  // Computed Values
  // ==============================================

  const stats = clientStats || {
    totalClients: 0,
    permanentClients: 0,
    temporaryClients: 0,
    clientsWithDebit: 0,
    clientsWithCredit: 0,
    totalBalanceKES: 0,
    totalBalanceUSD: 0,
  };

  // ==============================================
  // Render
  // ==============================================

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Client Accounts
          </h1>
          <p className="text-slate-600 mt-1">
            {stats.permanentClients} Permanent • {stats.temporaryClients}{" "}
            Temporary Clients
          </p>
        </div>
        <button
          onClick={() => setShowAddClient(true)}
          className="flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <UserPlus className="w-5 h-5" />
          Add New Client
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* All Clients Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className="relative bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 text-white shadow-xl shadow-blue-500/20 overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300"
          onClick={() => setActiveTab("all")}
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm flex items-center justify-center border-2 border-white/20">
                <Users className="w-6 h-6" />
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 border border-white/30">
                <span className="text-[10px] font-bold uppercase tracking-wide">
                  Total
                </span>
              </div>
            </div>
            <p className="text-xs opacity-90 mb-1 uppercase tracking-wider font-semibold">
              Total Clients
            </p>
            <p className="text-4xl font-bold tracking-tight mb-4">
              {stats.totalClients}
            </p>
            <div className="pt-3 border-t border-white/20 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] opacity-75">KES Balance</span>
                <span className="text-sm font-bold">
                  KES {stats.totalBalanceKES.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] opacity-75">USD Balance</span>
                <span className="text-sm font-bold">
                  ${stats.totalBalanceUSD.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Clients with Credit Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-emerald-300 transition-all duration-300 cursor-pointer group"
          onClick={() => setActiveTab("debit")}
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 flex items-center justify-center border-2 border-emerald-200 group-hover:bg-emerald-200 transition-colors">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="bg-emerald-100 px-3 py-1 border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
                  Credit
                </span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
              Clients With Credit
            </p>
            <p className="text-3xl font-bold text-emerald-600 tracking-tight mb-4">
              {stats.clientsWithDebit}
            </p>
            <div className="pt-3 border-t-2 border-slate-100 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-semibold">
                  Positive Balances
                </span>
                <span className="text-sm font-bold text-emerald-600">
                  {stats.clientsWithDebit} clients
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Clients with Debit Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-red-300 transition-all duration-300 cursor-pointer group"
          onClick={() => setActiveTab("credit")}
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 flex items-center justify-center border-2 border-red-200 group-hover:bg-red-200 transition-colors">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="bg-red-100 px-3 py-1 border border-red-200">
                <span className="text-[10px] font-bold text-red-700 uppercase tracking-wide">
                  Debit
                </span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
              Clients With Debit
            </p>
            <p className="text-3xl font-bold text-red-600 tracking-tight mb-4">
              {stats.clientsWithCredit}
            </p>
            <div className="pt-3 border-t-2 border-slate-100 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-semibold">
                  Negative Balances
                </span>
                <span className="text-sm font-bold text-red-600">
                  {stats.clientsWithCredit} clients
                </span>
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
              ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30"
              : "bg-white text-slate-600 hover:bg-blue-50 border-2 border-slate-200 hover:border-blue-300"
          }`}
        >
          <Users className="w-5 h-5" />
          All Clients
          <span
            className={`px-2 py-0.5 text-xs font-bold ${
              activeTab === "all" ? "bg-white/20" : "bg-blue-100 text-blue-700"
            }`}
          >
            {stats.totalClients}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("debit")}
          className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all duration-300 ${
            activeTab === "debit"
              ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
              : "bg-white text-slate-600 hover:bg-emerald-50 border-2 border-slate-200 hover:border-emerald-300"
          }`}
        >
          <CheckCircle className="w-5 h-5" />
          With Credit
          <span
            className={`px-2 py-0.5 text-xs font-bold ${
              activeTab === "debit"
                ? "bg-white/20"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {stats.clientsWithDebit}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("credit")}
          className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all duration-300 ${
            activeTab === "credit"
              ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/30"
              : "bg-white text-slate-600 hover:bg-red-50 border-2 border-slate-200 hover:border-red-300"
          }`}
        >
          <AlertCircle className="w-5 h-5" />
          With Debit
          <span
            className={`px-2 py-0.5 text-xs font-bold ${
              activeTab === "credit" ? "bg-white/20" : "bg-red-100 text-red-700"
            }`}
          >
            {stats.clientsWithCredit}
          </span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border-2 border-slate-200 p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, phone, code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 text-sm font-medium focus:outline-none text-slate-600
               focus:border-blue-500 focus:bg-white focus:shadow-lg focus:shadow-blue-500/10 transition-all duration-300 placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => fetchClients()}
              className="flex items-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 transition-all font-medium text-slate-700"
            >
              <RefreshCw
                className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={handleExportClientsPDF}
              className="flex items-center gap-2 px-5 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 transition-all font-medium"
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white border-2 border-slate-200 shadow-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-3 text-slate-600 font-medium">
              Loading clients...
            </span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                      Client ID
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                      Client Details
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                      Client Type
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
                  {clients.map((client, index) => (
                    <motion.tr
                      key={client.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-blue-600 group-hover:text-blue-700">
                          {client.code}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <div className="font-bold text-slate-900 text-sm whitespace-nowrap">
                            {client.fullName}
                          </div>
                          <div className="flex flex-col gap-0.5 mt-1">
                            <span className="flex items-center gap-1.5 text-xs text-slate-600">
                              <Phone className="w-3 h-3" />
                              {client.whatsAppNumber}
                            </span>
                            {client.email && (
                              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                                <Mail className="w-3 h-3" />
                                {client.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {client.clientType === ClientType.Permanent ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border-2 bg-blue-100 text-blue-700 border-blue-200">
                            <UserCheck className="w-4 h-4" />
                            Permanent
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border-2 bg-amber-100 text-amber-700 border-amber-200">
                            <Clock className="w-4 h-4" />
                            Temporary
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        {client.totalDebitKES > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <ArrowDownCircle className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-bold text-red-600">
                              {client.totalDebitKES.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {client.totalCreditKES > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <ArrowUpCircle className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm font-bold text-emerald-600">
                              {client.totalCreditKES.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {client.totalDebitUSD > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <ArrowDownCircle className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-bold text-red-600">
                              ${client.totalDebitUSD.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {client.totalCreditUSD > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <ArrowUpCircle className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-bold text-blue-600">
                              ${client.totalCreditUSD.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div
                            className={`flex items-center gap-1 text-xs font-bold ${
                              client.netMovementKES +
                                client.openingBalanceKES >=
                              0
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                          >
                            <span>
                              KES{" "}
                              {(
                                client.netMovementKES + client.openingBalanceKES
                              ).toLocaleString()}
                            </span>
                          </div>
                          <div
                            className={`flex items-center gap-1 text-xs font-bold ${
                              client.netMovementUSD +
                                client.openingBalanceUSD >=
                              0
                                ? "text-blue-600"
                                : "text-red-600"
                            }`}
                          >
                            <span>
                              USD $
                              {(
                                client.netMovementUSD + client.openingBalanceUSD
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditClient(client)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 transition-all text-sm font-medium"
                          >
                            <Edit3 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleViewClient(client)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg transition-all text-sm font-semibold"
                          >
                            <FileText className="w-4 h-4" />
                            Statement
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {clients.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  No clients found
                </h3>
                <p className="text-slate-600">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}

            {/* Pagination */}
            {(totalCount > pageSize || totalPages > 1) && (
              <div className="border-t-2 border-slate-200 bg-slate-50 px-6 py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-slate-600">
                    Showing{" "}
                    <span className="font-bold text-slate-900">
                      {(currentPage - 1) * pageSize + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-bold text-slate-900">
                      {Math.min(currentPage * pageSize, totalCount)}
                    </span>{" "}
                    of{" "}
                    <span className="font-bold text-slate-900">
                      {totalCount}
                    </span>{" "}
                    clients
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50
                       disabled:cursor-not-allowed transition-all text-sm font-medium text-slate-700"
                    >
                      Previous
                    </button>

                    <div className="flex items-center gap-1">
                      {[...Array(calculatedTotalPages)].map((_, i) => {
                        const pageNumber = i + 1;
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 &&
                            pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => setCurrentPage(pageNumber)}
                              className={`px-3 py-2 text-sm font-medium transition-all ${
                                currentPage === pageNumber
                                  ? "bg-blue-600 text-white"
                                  : "bg-white border border-slate-300 hover:bg-slate-50 text-slate-400"
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        } else if (
                          pageNumber === currentPage - 2 ||
                          pageNumber === currentPage + 2
                        ) {
                          return (
                            <span
                              key={pageNumber}
                              className="px-2 text-slate-400"
                            >
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentPage((p) =>
                          Math.min(calculatedTotalPages, p + 1)
                        )
                      }
                      disabled={currentPage >= calculatedTotalPages}
                      className="px-3 py-2 border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50
                       disabled:cursor-not-allowed transition-all text-sm font-medium text-slate-700"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ============================================== */}
      {/* CLIENT STATEMENT MODAL  */}
      {/* ============================================== */}
      <AnimatePresence>
        {showStatement && selectedClient && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col"
            >
              {/* Header with Actions */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)`,
                      backgroundSize: "50px 50px",
                    }}
                  ></div>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h2 className="text-lg font-bold text-white mb-0.5">
                        {selectedClient.fullName}
                      </h2>
                      <div className="flex items-center gap-3 text-xs text-blue-100">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {selectedClient.whatsAppNumber}
                        </span>
                        {selectedClient.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {selectedClient.email}
                          </span>
                        )}
                        <span className="font-mono">
                          ID: {selectedClient.code}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedClient.clientType === ClientType.Permanent ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold bg-white/20 border border-white/30 text-white">
                          <UserCheck className="w-3 h-3" />
                          Permanent
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold bg-amber-500/30 border border-amber-400/40 text-amber-100">
                          <Clock className="w-3 h-3" />
                          Temporary
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 border text-xs font-bold ${
                          selectedClient.isActive
                            ? "bg-emerald-500/30 border-emerald-400/40 text-emerald-100"
                            : "bg-slate-500/30 border-slate-400/40 text-slate-100"
                        }`}
                      >
                        {selectedClient.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                      <button
                        onClick={() => {
                          setShowStatement(false);
                          setClientTransactions([]);
                        }}
                        className="p-1.5 bg-white/10 hover:bg-white/20 transition-all ml-2"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Balances */}
              <div className="bg-white border-b border-slate-200">
                <div className="px-6 py-2">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    {/* KES Account */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2.5 text-white border-l-4 border-blue-800">
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
                          <p className="text-xs opacity-75">Credit (In)</p>
                          <p className="font-bold text-sm text-emerald-200">
                            +{selectedClient.totalCreditKES?.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs opacity-75">Debit (Out)</p>
                          <p className="font-bold text-sm text-red-200">
                            -{selectedClient.totalDebitKES?.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs opacity-75">Balance</p>
                          <p
                            className={`font-bold ${
                              selectedClient.balanceKES >= 0
                                ? ""
                                : "text-red-200"
                            }`}
                          >
                            {selectedClient.balanceKES >= 0 ? "+" : ""}
                            {selectedClient.balanceKES.toLocaleString()}
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
                          <p className="text-xs opacity-75">Credit (In)</p>
                          <p className="font-bold text-sm text-cyan-200">
                            +${selectedClient.totalCreditUSD?.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs opacity-75">Debit (Out)</p>
                          <p className="font-bold text-sm text-red-200">
                            -${selectedClient.totalDebitUSD?.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs opacity-75">Balance</p>
                          <p
                            className={`font-bold ${
                              selectedClient.balanceUSD >= 0
                                ? ""
                                : "text-red-200"
                            }`}
                          >
                            {selectedClient.balanceUSD >= 0 ? "+$" : "-$"}
                            {Math.abs(
                              selectedClient.balanceUSD
                            )?.toLocaleString()}
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
                  <h3 className="text-xl font-bold text-slate-600 flex items-center gap-2">
                    <Activity className="w-6 h-6 text-blue-600" />
                    Transaction History
                  </h3>
                  <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold">
                    {filteredTransactions.length} of {clientTransactions.length}{" "}
                    Transactions
                  </span>
                </div>

                {/* Search, Filter, Export, Print */}
                <div className="bg-slate-50 border-b border-slate-200 p-4 mb-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                    {/* Search Bar */}
                    <div className="lg:col-span-4">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search transactions..."
                          value={transactionSearch}
                          onChange={(e) => setTransactionSearch(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-white border text-slate-600 border-slate-300 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                    </div>

                    {/* Type Filter */}
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
                          className="w-full pl-12 pr-4 py-3 bg-white border text-slate-600  border-slate-300 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer"
                        >
                          <option value="all">All Types</option>
                          <option value="credit">Credit</option>
                          <option value="debit">Debit</option>
                        </select>
                      </div>
                    </div>

                    {/* Currency Filter */}
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
                          className="w-full pl-12 pr-4 py-3 bg-white border text-slate-600 border-slate-300 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer"
                        >
                          <option value="all">All Currencies</option>
                          <option value="KES">KES Only</option>
                          <option value="USD">USD Only</option>
                        </select>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="lg:col-span-4 flex gap-2">
                      <button
                        onClick={handleExportStatementPDF}
                        disabled={filteredTransactions.length === 0}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white hover:bg-emerald-700 transition-all font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Export PDF</span>
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
                {isLoadingStatement ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <span className="ml-3 text-slate-600 font-medium">
                      Loading transactions...
                    </span>
                  </div>
                ) : currentTransactions.length > 0 ? (
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
                              key={txn.id || idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.03 }}
                              className="hover:bg-blue-50/50 transition-colors group"
                            >
                              <td className="px-4 py-4 text-sm text-slate-600 whitespace-nowrap font-medium">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-slate-400" />
                                  {txn.transactionDate
                                    ? new Date(
                                        txn.transactionDate
                                      ).toLocaleString()
                                    : txn.createdAt
                                    ? new Date(txn.createdAt).toLocaleString()
                                    : "N/A"}
                                </div>
                              </td>
                              <td className="px-4 py-4 text-sm text-slate-900 font-semibold">
                                {txn.description || "No description"}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-3 py-1 border-l-4 text-xs font-bold ${
                                    txn.thisAccountAction === "Credit"
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-500"
                                      : "bg-red-50 text-red-700 border-red-500"
                                  }`}
                                >
                                  {txn.thisAccountAction === "Credit" ? (
                                    <ArrowUpCircle className="w-3.5 h-3.5" />
                                  ) : (
                                    <ArrowDownCircle className="w-3.5 h-3.5" />
                                  )}
                                  {txn.thisAccountAction ||
                                    (txn.transactionType ===
                                    TransactionType.Credit
                                      ? "CREDIT"
                                      : "DEBIT")}
                                </span>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-right">
                                <span
                                  className={`text-base font-bold ${
                                    txn.thisAccountAction === "Credit"
                                      ? "text-emerald-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {txn.thisAccountAction === "Credit"
                                    ? "+"
                                    : "-"}
                                  {txn.currency === Currency.USD ? "$" : "KES "}
                                  {(txn.amount ?? 0).toLocaleString()}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-base font-bold text-slate-900 whitespace-nowrap text-right">
                                {txn.currency === Currency.USD ? "$ " : "KES "}
                                {txn.balanceAfter.toLocaleString()}
                              </td>
                              <td className="px-4 py-4 text-sm text-blue-600 font-mono whitespace-nowrap">
                                {txn.reference || txn.code || "N/A"}
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

                    {/* Transaction Pagination */}
                    {totalTransactionPages > 1 && (
                      <div className="border-t border-slate-200 bg-slate-50 px-6 py-3">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                          <p className="text-sm text-slate-600">
                            Showing{" "}
                            <span className="font-bold text-slate-900">
                              {indexOfFirstTransaction + 1}
                            </span>{" "}
                            to{" "}
                            <span className="font-bold text-slate-900">
                              {Math.min(
                                indexOfLastTransaction,
                                filteredTransactions.length
                              )}
                            </span>{" "}
                            of{" "}
                            <span className="font-bold text-slate-900">
                              {filteredTransactions.length}
                            </span>{" "}
                            transactions
                          </p>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                setTransactionsCurrentPage((p) =>
                                  Math.max(1, p - 1)
                                )
                              }
                              disabled={transactionsCurrentPage === 1}
                              className="px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-50
                              text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs font-medium"
                            >
                              Previous
                            </button>

                            <div className="flex items-center gap-1">
                              {[...Array(totalTransactionPages)].map((_, i) => {
                                const pageNumber = i + 1;
                                if (
                                  pageNumber === 1 ||
                                  pageNumber === totalTransactionPages ||
                                  (pageNumber >= transactionsCurrentPage - 1 &&
                                    pageNumber <= transactionsCurrentPage + 1)
                                ) {
                                  return (
                                    <button
                                      key={pageNumber}
                                      onClick={() =>
                                        setTransactionsCurrentPage(pageNumber)
                                      }
                                      className={`px-3 py-1.5 text-xs font-medium transition-all ${
                                        transactionsCurrentPage === pageNumber
                                          ? "bg-blue-600 text-white"
                                          : "bg-white border border-slate-300 hover:bg-slate-50 text-slate-400"
                                      }`}
                                    >
                                      {pageNumber}
                                    </button>
                                  );
                                } else if (
                                  pageNumber === transactionsCurrentPage - 2 ||
                                  pageNumber === transactionsCurrentPage + 2
                                ) {
                                  return (
                                    <span
                                      key={pageNumber}
                                      className="px-2 text-slate-400"
                                    >
                                      ...
                                    </span>
                                  );
                                }
                                return null;
                              })}
                            </div>

                            <button
                              onClick={() =>
                                setTransactionsCurrentPage((p) =>
                                  Math.min(totalTransactionPages, p + 1)
                                )
                              }
                              disabled={
                                transactionsCurrentPage ===
                                totalTransactionPages
                              }
                              className="px-3 py-1.5 border border-slate-300 bg-white 
                              text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs font-medium"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-slate-50">
                    <FileText className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-slate-900 mb-2">
                      No Transactions Found
                    </h4>
                    <p className="text-slate-600">
                      {clientTransactions.length === 0
                        ? "This client has no transaction history yet."
                        : "Try adjusting your search or filter criteria"}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================== */}
      {/* TRANSACTION DETAIL MODAL */}
      {/* ============================================== */}
      <AnimatePresence>
        {showTransactionDetail && selectedTransaction && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[70]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div
                className={`relative px-6 py-4 ${
                  selectedTransaction.thisAccountAction === "Debit"
                    ? "bg-gradient-to-r from-red-600 via-rose-600 to-red-700"
                    : "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700"
                }`}
              >
                <div className="relative flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
                      {selectedTransaction.thisAccountAction === "Credit" ? (
                        <ArrowUpCircle className="w-6 h-6 text-white" />
                      ) : (
                        <ArrowDownCircle className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white mb-0.5">
                        Transaction Details
                      </h2>
                      <p className="text-xs font-medium text-white/80">
                        {selectedTransaction.thisAccountAction === "Debit"
                          ? "Debit Transaction (Money Out)"
                          : "Credit Transaction (Money In)"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTransactionDetail(false)}
                    className="p-1.5 bg-white/10 hover:bg-white/20 transition-all backdrop-blur-sm"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-5 overflow-y-auto flex-1">
                <div className="space-y-4">
                  {/* Transaction Info Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3 border border-slate-200">
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                        Transaction ID
                      </p>
                      <p className="text-sm font-bold text-slate-900 font-mono">
                        {selectedTransaction.code || selectedTransaction.id}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-3 border border-slate-200">
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                        Reference
                      </p>
                      <p className="text-sm font-bold text-blue-600 font-mono">
                        {selectedTransaction.reference || "N/A"}
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
                        {selectedTransaction.transactionDate
                          ? new Date(
                              selectedTransaction.transactionDate
                            ).toLocaleString()
                          : selectedTransaction.createdAt
                          ? new Date(
                              selectedTransaction.createdAt
                            ).toLocaleString()
                          : "N/A"}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-3 border border-slate-200">
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                        Currency
                      </p>
                      <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        {selectedTransaction.currency === Currency.USD ? (
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
                      selectedTransaction.thisAccountAction === "Debit"
                        ? "bg-gradient-to-br from-red-600 to-rose-600"
                        : "bg-gradient-to-br from-emerald-600 to-teal-600"
                    }`}
                  >
                    <p className="text-xs opacity-90 mb-2">Description</p>
                    <p className="text-lg font-bold mb-4">
                      {selectedTransaction.description || "No description"}
                    </p>
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/20">
                      <div>
                        <p className="text-[10px] opacity-75 mb-1">Amount</p>
                        <p className="text-xl font-bold">
                          {selectedTransaction.thisAccountAction === "Debit"
                            ? "-"
                            : "+"}
                          {selectedTransaction.currency === Currency.USD
                            ? "$"
                            : "KES "}
                          {(selectedTransaction.amount ?? 0).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] opacity-75 mb-1">
                          Balance After
                        </p>
                        <p className="text-xl font-bold">
                          {selectedTransaction.currency === Currency.USD
                            ? "$"
                            : "KES "}
                          {(
                            selectedTransaction.balanceAfter ?? 0
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
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
                  {/* Transaction Type Badge */}
                  <div
                    className={`flex items-center justify-between p-3 border-2 ${
                      selectedTransaction.thisAccountAction === "Debit"
                        ? "bg-red-50 border-red-200"
                        : "bg-emerald-50 border-emerald-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 flex items-center justify-center ${
                          selectedTransaction.thisAccountAction === "Debit"
                            ? "bg-red-100"
                            : "bg-emerald-100"
                        }`}
                      >
                        <Activity
                          className={`w-4 h-4 ${
                            selectedTransaction.thisAccountAction === "Debit"
                              ? "text-red-600"
                              : "text-emerald-600"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          Transaction Type
                        </p>
                        <p
                          className={`text-xs font-bold ${
                            selectedTransaction.thisAccountAction === "Debit"
                              ? "text-red-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {selectedTransaction.thisAccountAction ||
                            (selectedTransaction.transactionType ===
                            TransactionType.Debit
                              ? "DEBIT"
                              : "CREDIT")}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        toast.success("Transaction receipt downloaded!")
                      }
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-white text-xs font-bold transition-all ${
                        selectedTransaction.thisAccountAction === "Debit"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-emerald-600 hover:bg-emerald-700"
                      }`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      Receipt
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-blue-50 border-t-2 border-slate-200 flex gap-3">
                <button
                  onClick={() => setShowTransactionDetail(false)}
                  className="flex-1 px-6 py-3 bg-white border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all font-bold text-slate-700 shadow-sm hover:shadow"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowTransactionDetail(false);
                    setShowRelatedAccount(true);
                  }}
                  className={`flex-1 px-6 py-3 text-white font-bold shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95 ${
                    selectedTransaction.thisAccountAction === "Debit"
                      ? "bg-gradient-to-r from-red-600 via-rose-600 to-red-700 shadow-red-500/30 hover:shadow-red-500/40"
                      : "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 shadow-emerald-500/30 hover:shadow-emerald-500/40"
                  }`}
                >
                  Related Account
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================== */}
      {/* EDIT TRANSACTION MODAL - FIXED */}
      {/* ============================================== */}
      <AnimatePresence>
        {showEditTransaction && selectedTransaction && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[70]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 px-6 py-4">
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
                        Update transaction details
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowEditTransaction(false)}
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
                        Transaction ID
                      </label>
                      <input
                        type="text"
                        value={
                          selectedTransaction.code || selectedTransaction.id
                        }
                        disabled
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 text-slate-500 font-mono text-sm cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">
                        Reference Number
                      </label>
                      <input
                        type="text"
                        value={editTransactionForm.reference}
                        onChange={(e) =>
                          setEditTransactionForm({
                            ...editTransactionForm,
                            reference: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-900 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">
                      Description *
                    </label>
                    <input
                      type="text"
                      value={editTransactionForm.description}
                      onChange={(e) =>
                        setEditTransactionForm({
                          ...editTransactionForm,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">
                        Type
                      </label>
                      <input
                        type="text"
                        value={
                          selectedTransaction.thisAccountAction ||
                          (selectedTransaction.transactionType ===
                          TransactionType.Credit
                            ? "Credit"
                            : "Debit")
                        }
                        disabled
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 text-slate-500 text-sm cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">
                        Currency
                      </label>
                      <input
                        type="text"
                        value={
                          selectedTransaction.currency === Currency.KES
                            ? "KES"
                            : "USD"
                        }
                        disabled
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 text-slate-500 text-sm cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">
                        Amount
                      </label>
                      <input
                        type="text"
                        value={(
                          selectedTransaction.amount ?? 0
                        ).toLocaleString()}
                        disabled
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 text-slate-500 text-sm font-bold cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">
                      Notes
                    </label>
                    <textarea
                      value={editTransactionForm.notes}
                      onChange={(e) =>
                        setEditTransactionForm({
                          ...editTransactionForm,
                          notes: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                      placeholder="Add notes about this transaction..."
                    />
                  </div>

                  {/* Info Box */}
                  <div className="bg-amber-50 border border-amber-200 p-3">
                    <p className="text-xs text-amber-700">
                      <strong>Note:</strong> You can only edit the description,
                      reference, and notes. Amount, currency, and type cannot be
                      changed after creation.
                    </p>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-blue-50 border-t-2 border-slate-200 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditTransaction(false)}
                  className="flex-1 px-6 py-3 bg-white border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all font-bold text-slate-700 shadow-sm hover:shadow"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmUpdateTransaction}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================== */}
      {/* DELETE TRANSACTION MODAL */}
      {/* ============================================== */}
      <AnimatePresence>
        {showDeleteTransaction && selectedTransaction && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[70]">
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
                    onClick={() => setShowDeleteTransaction(false)}
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

                {/* Transaction Details */}
                <div className="bg-red-50 border-2 border-red-200 p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-600 uppercase">
                      Reference:
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-900">
                      {selectedTransaction.reference ||
                        selectedTransaction.code}
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
                      {selectedTransaction.currency === Currency.USD
                        ? "$"
                        : "KES "}
                      {(selectedTransaction.amount ?? 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-red-50 border-t-2 border-slate-200 flex gap-3">
                <button
                  onClick={() => setShowDeleteTransaction(false)}
                  className="flex-1 px-6 py-3 bg-white border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all font-bold text-slate-700 shadow-sm hover:shadow"
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

      {/* ============================================== */}
      {/* RELATED ACCOUNT MODAL */}
      {/* ============================================== */}
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
                {/* Header */}
                <div
                  className={`relative px-6 py-4 ${
                    selectedTransaction.relatedAccount.action === "Credit"
                      ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700"
                      : "bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700"
                  }`}
                >
                  <div className="relative flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
                        {selectedTransaction.relatedAccount.action ===
                        "Debit" ? (
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
                        Account Type
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                          {getAccountTypeLabel(
                            selectedTransaction.relatedAccount.accountType
                          ) === "Cash" && (
                            <Wallet className="w-5 h-5 text-blue-600" />
                          )}
                          {getAccountTypeLabel(
                            selectedTransaction.relatedAccount.accountType
                          ) === "Bank" && (
                            <CreditCard className="w-5 h-5 text-blue-600" />
                          )}
                          {getAccountTypeLabel(
                            selectedTransaction.relatedAccount.accountType
                          ) === "M-Pesa" && (
                            <Phone className="w-5 h-5 text-blue-600" />
                          )}
                          {getAccountTypeLabel(
                            selectedTransaction.relatedAccount.accountType
                          ) === "Client" && (
                            <User className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-lg font-bold text-slate-900">
                            {getAccountTypeLabel(
                              selectedTransaction.relatedAccount.accountType
                            )}
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
                          Account Code
                        </p>
                        <p className="text-sm font-bold text-slate-900 font-mono">
                          {selectedTransaction.relatedAccount.accountCode ||
                            "N/A"}
                        </p>
                      </div>
                      <div className="bg-slate-50 p-3 border border-slate-200">
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1.5">
                          Transaction Ref
                        </p>
                        <p className="text-sm font-bold text-blue-600 font-mono">
                          {selectedTransaction.reference ||
                            selectedTransaction.code}
                        </p>
                      </div>
                    </div>

                    {/* How Account Was Affected */}
                    <div
                      className={`p-4 text-white ${
                        selectedTransaction.relatedAccount.action === "Credit"
                          ? "bg-gradient-to-br from-emerald-600 to-teal-600"
                          : "bg-gradient-to-br from-blue-600 to-cyan-600"
                      }`}
                    >
                      <p className="text-xs opacity-90 mb-2">
                        How This Account Was Affected
                      </p>
                      <div className="flex items-center gap-2 mb-4">
                        {selectedTransaction.relatedAccount.action ===
                        "Debit" ? (
                          <ArrowUpCircle className="w-6 h-6" />
                        ) : (
                          <ArrowDownCircle className="w-6 h-6" />
                        )}
                        <p className="text-2xl font-bold uppercase">
                          {selectedTransaction.relatedAccount.action}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/20">
                        <div>
                          <p className="text-[10px] opacity-75 mb-1">Amount</p>
                          <p className="text-xl font-bold">
                            {selectedTransaction.relatedAccount.action ===
                            "Credit"
                              ? "-"
                              : "+"}
                            {selectedTransaction.relatedAccount.currency ===
                            Currency.USD
                              ? "$"
                              : "KES "}
                            {(
                              selectedTransaction.relatedAccount.amount ?? 0
                            ).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] opacity-75 mb-1">
                            Balance After
                          </p>
                          <p className="text-xl font-bold">
                            {selectedTransaction.relatedAccount.currency ===
                            Currency.USD
                              ? "$"
                              : "KES "}
                            {(
                              selectedTransaction.relatedAccount.balanceAfter ??
                              0
                            ).toLocaleString()}
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
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <p className="text-xs font-bold text-slate-900">
                            Client Account
                          </p>
                          <p
                            className={`text-xs font-bold mt-1 ${
                              selectedTransaction.thisAccountAction === "Debit"
                                ? "text-red-600"
                                : "text-emerald-600"
                            }`}
                          >
                            {selectedTransaction.thisAccountAction ||
                              (selectedTransaction.transactionType ===
                              TransactionType.Debit
                                ? "DEBIT"
                                : "CREDIT")}
                          </p>
                        </div>

                        <div className="flex-1 mx-4">
                          <div className="flex items-center">
                            <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-300 to-emerald-300"></div>
                            <ArrowRight className="w-5 h-5 text-blue-600 mx-2" />
                            <div className="flex-1 h-0.5 bg-gradient-to-r from-emerald-300 to-blue-300"></div>
                          </div>
                          <p className="text-[10px] text-center text-slate-600 mt-1 font-semibold">
                            {selectedTransaction.currency === Currency.USD
                              ? "$"
                              : "KES "}
                            {(selectedTransaction.amount ?? 0).toLocaleString()}
                          </p>
                        </div>

                        <div className="text-center">
                          <div
                            className={`w-12 h-12 flex items-center justify-center mx-auto mb-2 ${
                              selectedTransaction.relatedAccount.action ===
                              "Credit"
                                ? "bg-emerald-100"
                                : "bg-blue-100"
                            }`}
                          >
                            {getAccountTypeLabel(
                              selectedTransaction.relatedAccount.accountType
                            ) === "Cash" && (
                              <Wallet className="w-6 h-6 text-blue-600" />
                            )}
                            {getAccountTypeLabel(
                              selectedTransaction.relatedAccount.accountType
                            ) === "Bank" && (
                              <CreditCard className="w-6 h-6 text-blue-600" />
                            )}
                            {getAccountTypeLabel(
                              selectedTransaction.relatedAccount.accountType
                            ) === "M-Pesa" && (
                              <Phone className="w-6 h-6 text-blue-600" />
                            )}
                            {getAccountTypeLabel(
                              selectedTransaction.relatedAccount.accountType
                            ) === "Client" && (
                              <User className="w-6 h-6 text-blue-600" />
                            )}
                          </div>
                          <p className="text-xs font-bold text-slate-900">
                            {getAccountTypeLabel(
                              selectedTransaction.relatedAccount.accountType
                            )}
                          </p>
                          <p
                            className={`text-xs font-bold mt-1 ${
                              selectedTransaction.relatedAccount.action ===
                              "Credit"
                                ? "text-emerald-600"
                                : "text-blue-600"
                            }`}
                          >
                            {selectedTransaction.relatedAccount.action}
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
              </motion.div>
            </div>
          )}
      </AnimatePresence>

      {/* ============================================== */}
      {/* ADD CLIENT MODAL */}
      {/* ============================================== */}
      <AnimatePresence>
        {showAddClient && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 20 }}
              className="bg-white shadow-2xl max-w-2xl w-full overflow-hidden border border-blue-600"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 p-4">
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.15)_25%,rgba(255,255,255,.15)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.15)_75%,rgba(255,255,255,.15))] bg-[length:20px_20px]"></div>
                <button
                  onClick={() => {
                    setShowAddClient(false);
                    resetForm();
                  }}
                  className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 transition-all duration-200 border border-white/20 hover:border-white/40 group"
                >
                  <X className="w-4 h-4 text-white group-hover:rotate-90 transition-transform duration-300" />
                </button>
                <div className="relative flex items-center gap-3">
                  <div className="w-11 h-11 bg-white/15 backdrop-blur-xl flex items-center justify-center border border-white/30 shadow-lg">
                    <UserPlus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white tracking-tight">
                      Add New Client
                    </h2>
                    <p className="text-blue-50 text-xs font-medium">
                      Complete client registration
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <form
                onSubmit={handleCreateClient}
                className="p-4 max-h-[calc(100vh-180px)] overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50/30"
              >
                <div className="space-y-4">
                  {/* Personal Information */}
                  <div>
                    <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-blue-500">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-sm">
                        <User className="w-3.5 h-3.5 text-white" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                        Personal Information
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3 bg-white p-3.5 border border-slate-200 shadow-sm">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                          <User className="w-3 h-3 text-blue-600" />
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fullName: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 focus:bg-white transition-all font-medium text-slate-900 text-sm placeholder:text-slate-400"
                          placeholder="John Kamau"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                          <Phone className="w-3 h-3 text-blue-600" />
                          WhatsApp Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.whatsAppNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              whatsAppNumber: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 focus:bg-white transition-all font-medium text-slate-900 text-sm placeholder:text-slate-400"
                          placeholder="+254712345678"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                          <Mail className="w-3 h-3 text-blue-600" />
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 focus:bg-white transition-all font-medium text-slate-900 text-sm placeholder:text-slate-400"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                          <Hash className="w-3 h-3 text-blue-600" />
                          ID / Passport
                        </label>
                        <input
                          type="text"
                          value={formData.idPassport}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              idPassport: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 focus:bg-white transition-all font-medium text-slate-900 text-sm placeholder:text-slate-400"
                          placeholder="12345678"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Account Type */}
                  <div>
                    <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-amber-500">
                      <div className="w-6 h-6 bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-sm">
                        <UserCheck className="w-3.5 h-3.5 text-white" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                        Account Type
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="group cursor-pointer">
                        <input
                          type="radio"
                          name="clientType"
                          checked={formData.clientType === ClientType.Permanent}
                          onChange={() =>
                            setFormData({
                              ...formData,
                              clientType: ClientType.Permanent,
                            })
                          }
                          className="peer sr-only"
                        />
                        <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 peer-checked:border-blue-600 peer-checked:shadow-md peer-checked:shadow-blue-500/20 transition-all hover:border-blue-400 hover:shadow-sm relative overflow-hidden group-hover:scale-[1.02] duration-200">
                          <div className="relative flex items-center gap-2 mb-1.5">
                            <div className="w-7 h-7 bg-blue-600 flex items-center justify-center shadow-sm">
                              <UserCheck className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div>
                              <span className="font-bold text-xs text-slate-900 block leading-tight">
                                PERMANENT
                              </span>
                              <span className="text-[9px] text-blue-600 font-semibold">
                                Standard
                              </span>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-600 font-medium leading-snug">
                            No expiry • Full access
                          </p>
                        </div>
                      </label>

                      <label className="group cursor-pointer">
                        <input
                          type="radio"
                          name="clientType"
                          checked={formData.clientType === ClientType.Temporary}
                          onChange={() =>
                            setFormData({
                              ...formData,
                              clientType: ClientType.Temporary,
                            })
                          }
                          className="peer sr-only"
                        />
                        <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 peer-checked:border-amber-600 peer-checked:shadow-md peer-checked:shadow-amber-500/20 transition-all hover:border-amber-400 hover:shadow-sm relative overflow-hidden group-hover:scale-[1.02] duration-200">
                          <div className="relative flex items-center gap-2 mb-1.5">
                            <div className="w-7 h-7 bg-amber-600 flex items-center justify-center shadow-sm">
                              <Clock className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div>
                              <span className="font-bold text-xs text-slate-900 block leading-tight">
                                TEMPORARY
                              </span>
                              <span className="text-[9px] text-amber-600 font-semibold">
                                Walk-In
                              </span>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-600 font-medium leading-snug">
                            Limited • Restricted
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Password (for Permanent clients) */}
                  {formData.clientType === ClientType.Permanent && (
                    <div>
                      <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-purple-500">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-sm">
                          <Key className="w-3.5 h-3.5 text-white" />
                        </div>
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                          Login Credentials
                        </h3>
                      </div>
                      <div className="bg-white p-3.5 border border-slate-200 shadow-sm">
                        <label className="block text-[10px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                          <Key className="w-3 h-3 text-purple-600" />
                          Password
                        </label>
                        <input
                          type="password"
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600/20 focus:bg-white transition-all font-medium text-slate-900 text-sm placeholder:text-slate-400"
                          placeholder="Enter password for client login"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">
                          Optional: Set a password for client portal access
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Opening Balance */}
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
                            step="0.01"
                            value={formData.openingBalanceKES}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                openingBalanceKES:
                                  parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full pl-12 pr-3 py-2 bg-emerald-50 border border-emerald-300 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 focus:bg-white transition-all font-semibold text-slate-900 text-sm placeholder:text-emerald-400/60"
                            placeholder="0.00"
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
                            step="0.01"
                            value={formData.openingBalanceUSD}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                openingBalanceUSD:
                                  parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full pl-12 pr-3 py-2 bg-blue-50 border border-blue-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 focus:bg-white transition-all font-semibold text-slate-900 text-sm placeholder:text-blue-400/60"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>

              {/* Footer */}
              <div className="border-t border-slate-200 p-4 bg-gradient-to-r from-slate-50 to-blue-50/30">
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddClient(false);
                      resetForm();
                    }}
                    className="flex-1 px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all font-semibold text-slate-700 text-sm tracking-wide shadow-sm hover:shadow"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleCreateClient}
                    disabled={isSubmitting}
                    className="flex-1 px-5 py-2.5 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2 text-sm tracking-wide border border-blue-700/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <UserPlus className="w-4 h-4" />
                    )}
                    {isSubmitting ? "Creating..." : "Create Client"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================== */}
      {/* EDIT CLIENT MODAL */}
      {/* ============================================== */}
      <AnimatePresence>
        {showEditModal && selectedClient && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white shadow-2xl max-w-xl w-full max-h-[85vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 px-6 py-4">
                <div className="relative flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
                      <Edit3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white mb-0.5">
                        Edit Client
                      </h2>
                      <p className="text-blue-100 text-xs font-medium">
                        Update client information
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-xs font-bold text-white">
                          <Hash className="w-3 h-3" />
                          {selectedClient.code}
                        </span>
                        {selectedClient.clientType === ClientType.Permanent ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/30 backdrop-blur-sm border border-emerald-400/40 rounded-lg text-xs font-bold text-emerald-100">
                            <UserCheck className="w-3 h-3" />
                            Permanent
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-500/30 backdrop-blur-sm border border-amber-400/40 rounded-lg text-xs font-bold text-amber-100">
                            <Clock className="w-3 h-3" />
                            Temporary
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Account Balance Preview */}
              <div className="px-6 py-3 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 border border-blue-200 shadow-sm">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Wallet className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                        KES
                      </span>
                    </div>
                    <p
                      className={`text-lg font-bold ${
                        selectedClient.balanceKES >= 0
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      KES {selectedClient.balanceKES.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white p-3 border border-cyan-200 shadow-sm">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-cyan-600" />
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                        USD
                      </span>
                    </div>
                    <p
                      className={`text-lg font-bold ${
                        selectedClient.balanceUSD >= 0
                          ? "text-blue-600"
                          : "text-red-600"
                      }`}
                    >
                      ${selectedClient.balanceUSD.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <form
                onSubmit={handleUpdateClient}
                className="px-6 py-5 overflow-y-auto flex-1"
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editFormData.fullName}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            fullName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        value={editFormData.whatsAppNumber}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            whatsAppNumber: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        placeholder="+254712345678"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={editFormData.email}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <Hash className="w-4 h-4 text-slate-400" />
                        ID / Passport
                      </label>
                      <input
                        type="text"
                        value={editFormData.idPassport}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            idPassport: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                    </div>
                  </div>

                  {/* Convert to Permanent (for Temporary clients) */}
                  {selectedClient.clientType === ClientType.Temporary && (
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
                          <RefreshCw className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-slate-900 mb-1">
                            Convert to Permanent Client
                          </h4>
                          <p className="text-xs text-slate-600 mb-3">
                            This client is currently{" "}
                            <span className="font-bold text-amber-600">
                              temporary
                            </span>
                            . Convert to permanent status for full access.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setShowEditModal(false);
                              setShowConvertModal(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
                          >
                            <UserCheck className="w-4 h-4" />
                            Convert to Permanent
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </form>

              {/* Footer */}
              <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-blue-50 border-t-2 border-slate-200 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setShowDeleteConfirm(true);
                  }}
                  className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold transition-all flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-6 py-3 bg-white border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all font-bold text-slate-700 shadow-sm hover:shadow"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleUpdateClient}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================== */}
      {/* DELETE CLIENT CONFIRMATION MODAL */}
      {/* ============================================== */}
      <AnimatePresence>
        {showDeleteConfirm && selectedClient && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white shadow-2xl max-w-md w-full overflow-hidden border border-red-200"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-6 py-5 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)`,
                      backgroundSize: "30px 30px",
                    }}
                  ></div>
                </div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>

                <div className="relative z-10 flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 shadow-lg">
                        <Trash2 className="w-7 h-7 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center border-2 border-white">
                        <span className="text-[8px] font-bold text-amber-900">
                          !
                        </span>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1 tracking-tight">
                        Delete Client
                      </h2>
                      <p className="text-red-100 text-xs font-medium">
                        This action is permanent and cannot be undone
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/20 backdrop-blur-sm border border-white/30 text-xs font-bold text-white">
                          <Hash className="w-3 h-3" />
                          {selectedClient.code}
                        </span>
                        {selectedClient.clientType === ClientType.Permanent ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/30 backdrop-blur-sm border border-emerald-400/40 text-xs font-bold text-emerald-100">
                            <UserCheck className="w-3 h-3" />
                            Permanent
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/30 backdrop-blur-sm border border-amber-400/40 text-xs font-bold text-amber-100">
                            <Clock className="w-3 h-3" />
                            Temporary
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="p-2 bg-white/10 hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20 hover:border-white/40"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Client Info Card */}
              <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-red-50/30 border-b border-slate-200">
                <div className="flex items-center gap-4 p-4 bg-white border-2 border-slate-200 shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-red-500/30">
                    {selectedClient.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-base">
                      {selectedClient.fullName}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Phone className="w-3 h-3" />
                        {selectedClient.whatsAppNumber}
                      </span>
                      {selectedClient.email && (
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Mail className="w-3 h-3" />
                          {selectedClient.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Balances */}
              <div className="px-6 py-4 bg-white border-b border-slate-200">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Account Balances to be Deleted
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-3 border border-blue-200">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Wallet className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                        KES Balance
                      </span>
                    </div>
                    <p
                      className={`text-lg font-bold ${
                        selectedClient.balanceKES >= 0
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      KES {selectedClient.balanceKES.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-50 to-cyan-50 p-3 border border-cyan-200">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-cyan-600" />
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                        USD Balance
                      </span>
                    </div>
                    <p
                      className={`text-lg font-bold ${
                        selectedClient.balanceUSD >= 0
                          ? "text-blue-600"
                          : "text-red-600"
                      }`}
                    >
                      ${selectedClient.balanceUSD.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning Section */}
              <div className="px-6 py-4 bg-white">
                <div className="relative overflow-hidden bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 p-4">
                  <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-red-100 rounded-full opacity-50"></div>

                  <div className="relative z-10 flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-red-100 flex items-center justify-center border border-red-200">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-red-800 mb-1">
                        Warning: Permanent Deletion
                      </h4>
                      <p className="text-xs text-red-700 leading-relaxed">
                        You are about to permanently delete{" "}
                        <span className="font-bold text-red-900">
                          {selectedClient.fullName}
                        </span>
                        . This will remove:
                      </p>
                      <ul className="mt-2 space-y-1">
                        <li className="flex items-center gap-2 text-xs text-red-700">
                          <X className="w-3 h-3 text-red-500" />
                          All account information
                        </li>
                        <li className="flex items-center gap-2 text-xs text-red-700">
                          <X className="w-3 h-3 text-red-500" />
                          Transaction history
                        </li>
                        <li className="flex items-center gap-2 text-xs text-red-700">
                          <X className="w-3 h-3 text-red-500" />
                          Balance records
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-red-50/30 border-t border-slate-200 flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-6 py-3 bg-white border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all font-bold text-slate-700 shadow-sm hover:shadow"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteClient}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-bold shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete Permanently
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================== */}
      {/* CONVERT TO PERMANENT MODAL */}
      {/* ============================================== */}
      <AnimatePresence>
        {showConvertModal && selectedClient && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <UserCheck className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Convert to Permanent
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Set a password for client login
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={convertPassword}
                  onChange={(e) => setConvertPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  placeholder="Enter password for client"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowConvertModal(false);
                    setConvertPassword("");
                  }}
                  className="flex-1 px-6 py-3 border-2 border-slate-300 rounded-xl hover:bg-slate-50 transition-all font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConvertToPermanent}
                  disabled={isSubmitting || !convertPassword}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <UserCheck className="w-4 h-4" />
                  )}
                  {isSubmitting ? "Converting..." : "Convert"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
