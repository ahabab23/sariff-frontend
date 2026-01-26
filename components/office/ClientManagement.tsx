import { useState, useEffect } from "react";
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
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  BarChart3,
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
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
      | "Bank Account"
      | "M-Pesa"
      | "Exchange"
      | "Walk-In";
    accountName: string;
    accountId: string;
    effect: "debit" | "credit";
    balanceAfter: number;
  };
}

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  clientType: "Permanent" | "Temporary";
  kesDebit: number;
  kesCredit: number;
  usdDebit: number;
  usdCredit: number;
  status: "active" | "inactive";
  joined: string;
  lastActivity: string;
  expiryDays?: number; // Only for temporary clients
  transactions: Transaction[];
}

export function ClientManagement() {
  const [activeTab, setActiveTab] = useState<
    "all" | "outstanding" | "positive"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddClient, setShowAddClient] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showStatement, setShowStatement] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showTransactionDetail, setShowTransactionDetail] = useState(false);
  const [showEditTransaction, setShowEditTransaction] = useState(false);
  const [showDeleteTransaction, setShowDeleteTransaction] = useState(false);
  const [showRelatedAccount, setShowRelatedAccount] = useState(false);
  const [transactionSearch, setTransactionSearch] = useState("");
  const [transactionFilter, setTransactionFilter] = useState<
    "all" | "credit" | "debit"
  >("all");
  const [currencyFilter, setCurrencyFilter] = useState<"all" | "KES" | "USD">(
    "all"
  );

  // Pagination state
  const [clientsCurrentPage, setClientsCurrentPage] = useState(1);
  const [clientsPerPage] = useState(10);
  const [transactionsCurrentPage, setTransactionsCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(15);

  // Enhanced client data with Permanent/Temporary types
  const allClients: Client[] = [
    {
      id: "CL-2024-145",
      name: "John Kamau",
      phone: "+254 712 345 678",
      email: "john.kamau@email.com",
      clientType: "Permanent",
      kesDebit: 0,
      kesCredit: 125400,
      usdDebit: 0,
      usdCredit: 842.5,
      status: "active",
      joined: "2024-03-15",
      lastActivity: "2 hours ago",
      transactions: [
        {
          id: "TXN-001",
          date: "2026-01-08 10:30",
          description: "Exchange USD to KES",
          type: "credit",
          currency: "KES",
          amount: 15000,
          balance: 125400,
          reference: "EXC-2024-089",
          relatedAccount: {
            accountType: "Cash at Hand",
            accountName: "Cash KES - Main Office",
            accountId: "CASH-KES-001",
            effect: "debit",
            balanceAfter: 145230,
          },
        },
        {
          id: "TXN-002",
          date: "2026-01-07 14:20",
          description: "Deposit",
          type: "credit",
          currency: "USD",
          amount: 500,
          balance: 842.5,
          reference: "DEP-2024-112",
          relatedAccount: {
            accountType: "Bank Account",
            accountName: "Equity Bank USD",
            accountId: "BA-003",
            effect: "debit",
            balanceAfter: 12450.75,
          },
        },
        {
          id: "TXN-003",
          date: "2026-01-05 09:15",
          description: "Wire Transfer",
          type: "credit",
          currency: "KES",
          amount: 50000,
          balance: 110400,
          reference: "WIR-2024-045",
          relatedAccount: {
            accountType: "Bank Account",
            accountName: "Equity Bank KES",
            accountId: "BA-001",
            effect: "debit",
            balanceAfter: 406780,
          },
        },
        {
          id: "TXN-004",
          date: "2026-01-03 11:45",
          description: "Exchange KES to USD",
          type: "debit",
          currency: "KES",
          amount: 20000,
          balance: 60400,
          reference: "EXC-2024-078",
          relatedAccount: {
            accountType: "Exchange",
            accountName: "Exchange Account KES",
            accountId: "EXC-KES-001",
            effect: "credit",
            balanceAfter: 89450,
          },
        },
      ],
    },
    {
      id: "CL-2024-132",
      name: "Sarah Wanjiku",
      phone: "+254 723 456 789",
      email: "sarah.w@email.com",
      clientType: "Permanent",
      kesDebit: 45000,
      kesCredit: 89200,
      usdDebit: 0,
      usdCredit: 1250.0,
      status: "active",
      joined: "2024-02-10",
      lastActivity: "1 day ago",
      transactions: [
        {
          id: "TXN-005",
          date: "2026-01-07 11:45",
          description: "Business Payment",
          type: "debit",
          currency: "KES",
          amount: 45000,
          balance: 44200,
          reference: "PAY-2024-156",
          relatedAccount: {
            accountType: "M-Pesa",
            accountName: "M-Pesa Agent CBD",
            accountId: "MP-001",
            effect: "credit",
            balanceAfter: 89200,
          },
        },
        {
          id: "TXN-006",
          date: "2026-01-06 16:30",
          description: "Client Payment Received",
          type: "credit",
          currency: "KES",
          amount: 89200,
          balance: 89200,
          reference: "REC-2024-223",
          relatedAccount: {
            accountType: "Cash at Hand",
            accountName: "Cash KES - Main Office",
            accountId: "CASH-KES-001",
            effect: "debit",
            balanceAfter: 234500,
          },
        },
        {
          id: "TXN-007",
          date: "2026-01-04 13:10",
          description: "USD Deposit",
          type: "credit",
          currency: "USD",
          amount: 1250,
          balance: 1250,
          reference: "DEP-2024-134",
          relatedAccount: {
            accountType: "Bank Account",
            accountName: "Equity Bank USD",
            accountId: "BA-003",
            effect: "debit",
            balanceAfter: 13560.5,
          },
        },
      ],
    },
    {
      id: "TMP-2024-089",
      name: "Michael Ochieng",
      phone: "+254 734 567 890",
      email: "michael.o@email.com",
      clientType: "Temporary",
      kesDebit: 0,
      kesCredit: 45800,
      usdDebit: 0,
      usdCredit: 0,
      status: "active",
      joined: "2026-01-05",
      lastActivity: "3 hours ago",
      expiryDays: 3,
      transactions: [
        {
          id: "TXN-008",
          date: "2026-01-08 08:00",
          description: "Walk-in Exchange",
          type: "credit",
          currency: "KES",
          amount: 45800,
          balance: 45800,
          reference: "WLK-2024-067",
          relatedAccount: {
            accountType: "Walk-In",
            accountName: "Walk-In Holding Account",
            accountId: "WLK-001",
            effect: "debit",
            balanceAfter: 123400,
          },
        },
      ],
    },
    {
      id: "CL-2024-067",
      name: "Grace Akinyi",
      phone: "+254 745 678 901",
      email: "grace.a@email.com",
      clientType: "Permanent",
      kesDebit: 12500,
      kesCredit: 45600,
      usdDebit: 0,
      usdCredit: 180.0,
      status: "active",
      joined: "2023-12-20",
      lastActivity: "2 weeks ago",
      transactions: [
        {
          id: "TXN-009",
          date: "2025-12-28 10:20",
          description: "Loan Disbursement",
          type: "debit",
          currency: "KES",
          amount: 12500,
          balance: 33100,
          reference: "LON-2024-023",
          relatedAccount: {
            accountType: "Cash at Hand",
            accountName: "Cash KES - Main Office",
            accountId: "CASH-KES-001",
            effect: "credit",
            balanceAfter: 167890,
          },
        },
        {
          id: "TXN-010",
          date: "2025-12-20 15:30",
          description: "Salary Deposit",
          type: "credit",
          currency: "KES",
          amount: 45600,
          balance: 45600,
          reference: "SAL-2024-089",
          relatedAccount: {
            accountType: "Bank Account",
            accountName: "Equity Bank KES",
            accountId: "BA-001",
            effect: "debit",
            balanceAfter: 512390,
          },
        },
      ],
    },
    {
      id: "TMP-2024-091",
      name: "David Mwangi",
      phone: "+254 756 789 012",
      email: "david.m@email.com",
      clientType: "Temporary",
      kesDebit: 0,
      kesCredit: 78900,
      usdDebit: 0,
      usdCredit: 365.0,
      status: "active",
      joined: "2026-01-06",
      lastActivity: "5 hours ago",
      expiryDays: 4,
      transactions: [
        {
          id: "TXN-011",
          date: "2026-01-08 07:15",
          description: "Temporary Holding",
          type: "credit",
          currency: "KES",
          amount: 78900,
          balance: 78900,
          reference: "TMP-2024-045",
          relatedAccount: {
            accountType: "Cash at Hand",
            accountName: "Cash KES - Main Office",
            accountId: "CASH-KES-001",
            effect: "debit",
            balanceAfter: 156780,
          },
        },
        {
          id: "TXN-012",
          date: "2026-01-07 09:30",
          description: "USD Exchange Hold",
          type: "credit",
          currency: "USD",
          amount: 365,
          balance: 365,
          reference: "TMP-2024-112",
          relatedAccount: {
            accountType: "Exchange",
            accountName: "Exchange Account USD",
            accountId: "EXC-USD-001",
            effect: "debit",
            balanceAfter: 4890.75,
          },
        },
      ],
    },
    {
      id: "CL-2024-023",
      name: "Lucy Njeri",
      phone: "+254 767 890 123",
      email: "lucy.n@email.com",
      clientType: "Permanent",
      kesDebit: 28000,
      kesCredit: 34500,
      usdDebit: 0,
      usdCredit: 215.0,
      status: "active",
      joined: "2023-10-08",
      lastActivity: "1 week ago",
      transactions: [
        {
          id: "TXN-013",
          date: "2026-01-02 11:40",
          description: "Emergency Withdrawal",
          type: "debit",
          currency: "KES",
          amount: 28000,
          balance: 6500,
          reference: "WTH-2024-078",
          relatedAccount: {
            accountType: "Cash at Hand",
            accountName: "Cash KES - Main Office",
            accountId: "CASH-KES-001",
            effect: "credit",
            balanceAfter: 223450,
          },
        },
        {
          id: "TXN-014",
          date: "2025-12-30 14:20",
          description: "Monthly Savings",
          type: "credit",
          currency: "KES",
          amount: 34500,
          balance: 34500,
          reference: "SAV-2024-156",
          relatedAccount: {
            accountType: "Bank Account",
            accountName: "Equity Bank KES",
            accountId: "BA-001",
            effect: "debit",
            balanceAfter: 478950,
          },
        },
      ],
    },
    {
      id: "CL-2023-198",
      name: "Peter Otieno",
      phone: "+254 778 901 234",
      email: "peter.o@email.com",
      clientType: "Permanent",
      kesDebit: 0,
      kesCredit: 312000,
      usdDebit: 0,
      usdCredit: 1840.0,
      status: "active",
      joined: "2023-09-20",
      lastActivity: "30 mins ago",
      transactions: [
        {
          id: "TXN-015",
          date: "2026-01-08 11:20",
          description: "Large Transfer",
          type: "credit",
          currency: "KES",
          amount: 50000,
          balance: 312000,
          reference: "TRF-2024-034",
        },
        {
          id: "TXN-016",
          date: "2026-01-07 16:45",
          description: "Foreign Exchange",
          type: "credit",
          currency: "USD",
          amount: 1840,
          balance: 1840,
          reference: "FEX-2024-201",
        },
      ],
    },
    {
      id: "TMP-2024-093",
      name: "Ann Wambui",
      phone: "+254 789 012 345",
      email: "ann.w@email.com",
      clientType: "Temporary",
      kesDebit: 8900,
      kesCredit: 67800,
      usdDebit: 0,
      usdCredit: 420.0,
      status: "active",
      joined: "2026-01-07",
      lastActivity: "3 days ago",
      expiryDays: 2,
      transactions: [
        {
          id: "TXN-017",
          date: "2026-01-05 10:30",
          description: "Walk-in Payment",
          type: "debit",
          currency: "KES",
          amount: 8900,
          balance: 58900,
          reference: "WLK-2024-089",
        },
        {
          id: "TXN-018",
          date: "2026-01-03 13:15",
          description: "Temporary Hold",
          type: "credit",
          currency: "KES",
          amount: 67800,
          balance: 67800,
          reference: "TMP-2024-145",
        },
      ],
    },
  ];

  // Calculate net balance (credit - debit) for client liability accounts
  const getNetBalance = (client: Client) => {
    const kesNet = client.kesCredit - client.kesDebit;
    const usdNet = client.usdCredit - client.usdDebit;
    return { kesNet, usdNet };
  };

  // Filter clients based on active tab
  const clientsWithOutstanding = allClients.filter((client) => {
    const { kesNet, usdNet } = getNetBalance(client);
    return (
      kesNet < 0 || usdNet < 0 || client.kesDebit > 0 || client.usdDebit > 0
    );
  });

  const clientsWithPositive = allClients.filter((client) => {
    const { kesNet, usdNet } = getNetBalance(client);
    return (
      (kesNet > 0 || usdNet > 0) &&
      client.kesDebit === 0 &&
      client.usdDebit === 0
    );
  });

  // Calculate totals
  const totalKesOutstanding = allClients.reduce(
    (sum, client) => sum + client.kesDebit,
    0
  );
  const totalUsdOutstanding = allClients.reduce(
    (sum, client) => sum + client.usdDebit,
    0
  );
  const totalKesCredit = allClients.reduce(
    (sum, client) => sum + client.kesCredit,
    0
  );
  const totalUsdCredit = allClients.reduce(
    (sum, client) => sum + client.usdCredit,
    0
  );

  // Count client types
  const permanentCount = allClients.filter(
    (c) => c.clientType === "Permanent"
  ).length;
  const temporaryCount = allClients.filter(
    (c) => c.clientType === "Temporary"
  ).length;

  // Reset clients pagination when filters change
  useEffect(() => {
    setClientsCurrentPage(1);
  }, [activeTab, searchTerm]);

  // Reset transactions pagination when filters change
  useEffect(() => {
    setTransactionsCurrentPage(1);
  }, [transactionSearch, transactionFilter, currencyFilter]);

  // Get filtered list based on active tab
  const getFilteredClients = () => {
    let clients = allClients;

    if (activeTab === "outstanding") {
      clients = clientsWithOutstanding;
    } else if (activeTab === "positive") {
      clients = clientsWithPositive;
    }

    // Apply search filter
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm) ||
        client.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.clientType.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredClients = getFilteredClients();

  // Pagination for clients
  const totalClientsPages = Math.ceil(filteredClients.length / clientsPerPage);
  const indexOfLastClient = clientsCurrentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(
    indexOfFirstClient,
    indexOfLastClient
  );

  // Reset to page 1 when filters change
  const handlePageChange = (pageNumber: number) => {
    setClientsCurrentPage(pageNumber);
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setShowStatement(true);
    setTransactionsCurrentPage(1); // Reset transaction pagination when opening statement
  };

  const handleEditClient = () => {
    setShowEditModal(true);
  };

  const handleDeleteClient = () => {
    setShowDeleteConfirm(true);
  };

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetail(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowEditTransaction(true);
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDeleteTransaction(true);
  };

  const confirmDeleteTransaction = () => {
    if (selectedTransaction) {
      toast.success(
        `Transaction ${selectedTransaction.reference} deleted successfully`
      );
      setShowDeleteTransaction(false);
      setSelectedTransaction(null);
    }
  };

  const handlePrintStatement = () => {
    toast.success("Preparing statement for printing...");
    window.print();
  };

  const handleExportStatement = () => {
    toast.success("Exporting statement to Excel...");
  };

  // Export client statement to PDF
  const handleExportStatementPDF = () => {
    if (!selectedClient) return;

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Header with Sarif branding
      doc.setFillColor(37, 99, 235); // Blue-600
      doc.rect(0, 0, pageWidth, 40, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("SARIF", 14, 15);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Fintech Solutions", 14, 22);
      doc.text("Client Account Statement", 14, 29);
      doc.text("Money Exchange & Account Management", 14, 35);

      // Date and time
      doc.setFontSize(9);
      doc.text(
        `Generated: ${new Date().toLocaleString()}`,
        pageWidth - 14,
        15,
        { align: "right" }
      );
      doc.text(
        `Statement Date: ${new Date().toLocaleDateString()}`,
        pageWidth - 14,
        22,
        { align: "right" }
      );

      // Client Information Section
      let yPos = 50;
      doc.setFillColor(241, 245, 249); // Slate-100
      doc.rect(14, yPos, pageWidth - 28, 35, "F");

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Client Information", 18, yPos + 7);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(`Client ID: ${selectedClient.clientId}`, 18, yPos + 14);
      doc.text(`Name: ${selectedClient.clientName}`, 18, yPos + 20);
      doc.text(`Type: ${selectedClient.clientType}`, 18, yPos + 26);

      doc.text(`Phone: ${selectedClient.phone}`, pageWidth / 2, yPos + 14);
      doc.text(`Email: ${selectedClient.email}`, pageWidth / 2, yPos + 20);
      doc.text(`Status: ${selectedClient.status}`, pageWidth / 2, yPos + 26);

      // Account Summary Section
      yPos += 42;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Account Summary", 14, yPos);

      yPos += 7;
      doc.setDrawColor(203, 213, 225); // Slate-300
      doc.setLineWidth(0.5);

      // KES Summary
      doc.rect(14, yPos, (pageWidth - 28) / 2 - 2, 30);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("KENYAN SHILLING (KES)", 18, yPos + 6);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(`Total Debits:`, 18, yPos + 12);
      doc.setTextColor(220, 38, 38); // Red-600
      doc.text(
        `KES ${selectedClient.kesDebit.toLocaleString()}`,
        55,
        yPos + 12
      );

      doc.setTextColor(0, 0, 0);
      doc.text(`Total Credits:`, 18, yPos + 18);
      doc.setTextColor(5, 150, 105); // Emerald-600
      doc.text(
        `KES ${selectedClient.kesCredit.toLocaleString()}`,
        55,
        yPos + 18
      );

      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text(`Net Balance:`, 18, yPos + 24);
      const kesBalance = selectedClient.kesDebit - selectedClient.kesCredit;
      doc.setTextColor(
        kesBalance >= 0 ? 5 : 220,
        kesBalance >= 0 ? 150 : 38,
        kesBalance >= 0 ? 105 : 38
      );
      doc.text(
        `KES ${kesBalance >= 0 ? "+" : ""}${kesBalance.toLocaleString()}`,
        55,
        yPos + 24
      );

      // USD Summary
      doc.setTextColor(0, 0, 0);
      doc.rect(pageWidth / 2 + 2, yPos, (pageWidth - 28) / 2 - 2, 30);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("US DOLLAR (USD)", pageWidth / 2 + 6, yPos + 6);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(`Total Debits:`, pageWidth / 2 + 6, yPos + 12);
      doc.setTextColor(220, 38, 38); // Red-600
      doc.text(
        `$${selectedClient.usdDebit.toLocaleString()}`,
        pageWidth / 2 + 6 + 37,
        yPos + 12
      );

      doc.setTextColor(0, 0, 0);
      doc.text(`Total Credits:`, pageWidth / 2 + 6, yPos + 18);
      doc.setTextColor(5, 150, 105); // Emerald-600
      doc.text(
        `$${selectedClient.usdCredit.toLocaleString()}`,
        pageWidth / 2 + 6 + 37,
        yPos + 18
      );

      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text(`Net Balance:`, pageWidth / 2 + 6, yPos + 24);
      const usdBalance = selectedClient.usdDebit - selectedClient.usdCredit;
      doc.setTextColor(
        usdBalance >= 0 ? 5 : 220,
        usdBalance >= 0 ? 150 : 38,
        usdBalance >= 0 ? 105 : 38
      );
      doc.text(
        `$${usdBalance >= 0 ? "+" : ""}${usdBalance.toLocaleString()}`,
        pageWidth / 2 + 6 + 37,
        yPos + 24
      );

      // Transaction History
      yPos += 38;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Transaction History", 14, yPos);

      const filteredTxns = getFilteredTransactions();

      // Prepare transaction table data
      const txnTableData = filteredTxns.map((txn) => [
        new Date(txn.date).toLocaleDateString(),
        txn.reference,
        txn.description.substring(0, 35) +
          (txn.description.length > 35 ? "..." : ""),
        txn.type.toUpperCase(),
        txn.currency,
        txn.type === "debit" ? txn.amount.toLocaleString() : "",
        txn.type === "credit" ? txn.amount.toLocaleString() : "",
        txn.balance.toLocaleString(),
      ]);

      autoTable(doc, {
        startY: yPos + 5,
        head: [
          [
            "Date",
            "Reference",
            "Description",
            "Type",
            "Curr",
            "Debit",
            "Credit",
            "Balance",
          ],
        ],
        body: txnTableData,
        theme: "grid",
        headStyles: {
          fillColor: [37, 99, 235], // Blue-600
          textColor: [255, 255, 255],
          fontSize: 7,
          fontStyle: "bold",
          halign: "left",
        },
        bodyStyles: {
          fontSize: 7,
          textColor: [0, 0, 0],
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252], // Slate-50
        },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 22 },
          2: { cellWidth: 50 },
          3: { cellWidth: 15, halign: "center" },
          4: { cellWidth: 12, halign: "center" },
          5: { cellWidth: 20, halign: "right" },
          6: { cellWidth: 20, halign: "right" },
          7: { cellWidth: 20, halign: "right" },
        },
        margin: { left: 14, right: 14 },
        didDrawPage: (data: any) => {
          // Footer
          doc.setFontSize(8);
          doc.setTextColor(100);
          doc.setFont("helvetica", "normal");

          // Page number
          doc.text(`Page ${data.pageNumber}`, pageWidth / 2, pageHeight - 10, {
            align: "center",
          });

          // Confidential notice
          doc.setFontSize(7);
          doc.text(
            "This is a computer-generated statement and does not require a signature.",
            pageWidth / 2,
            pageHeight - 5,
            { align: "center" }
          );
        },
      });

      // Save the PDF
      const fileName = `Sarif_Statement_${selectedClient.clientId}_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      doc.save(fileName);

      toast.success("Statement PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating statement PDF:", error);
      toast.error("Failed to generate statement PDF");
    }
  };

  // Export clients to PDF
  const handleExportClientsPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Header with Sarif branding
      doc.setFillColor(37, 99, 235); // Blue-600
      doc.rect(0, 0, pageWidth, 35, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("SARIF", 14, 15);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Fintech Solutions", 14, 22);
      doc.text("Client Management Report", 14, 28);

      // Date and time
      doc.setFontSize(9);
      doc.text(
        `Generated: ${new Date().toLocaleString()}`,
        pageWidth - 14,
        15,
        { align: "right" }
      );
      doc.text(`Total Clients: ${filteredClients.length}`, pageWidth - 14, 22, {
        align: "right",
      });

      // Summary Statistics
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Summary Statistics", 14, 45);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      let yPos = 52;

      // Summary boxes
      doc.setDrawColor(203, 213, 225); // Slate-300
      doc.setLineWidth(0.5);

      // All Clients box
      doc.rect(14, yPos, 60, 25);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("TOTAL CLIENTS", 16, yPos + 5);
      doc.setFontSize(16);
      doc.setTextColor(37, 99, 235); // Blue-600
      doc.text(allClients.length.toString(), 16, yPos + 14);
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      doc.text(`KES: ${totalKesCredit.toLocaleString()}`, 16, yPos + 19);
      doc.text(`USD: $${totalUsdCredit.toLocaleString()}`, 16, yPos + 23);

      // Outstanding box
      doc.rect(78, yPos, 60, 25);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("OUTSTANDING DEBITS", 80, yPos + 5);
      doc.setFontSize(16);
      doc.setTextColor(220, 38, 38); // Red-600
      doc.text(clientsWithOutstanding.length.toString(), 80, yPos + 14);
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      doc.text(`KES: ${totalKesOutstanding.toLocaleString()}`, 80, yPos + 19);
      doc.text(`USD: $${totalUsdOutstanding.toLocaleString()}`, 80, yPos + 23);

      // Pure Credit box
      doc.rect(142, yPos, 54, 25);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("PURE CREDIT", 144, yPos + 5);
      doc.setFontSize(16);
      doc.setTextColor(5, 150, 105); // Emerald-600
      doc.text(clientsWithPositive.length.toString(), 144, yPos + 14);
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      doc.text(
        `KES: ${(totalKesCredit - totalKesOutstanding).toLocaleString()}`,
        144,
        yPos + 19
      );
      doc.text(
        `USD: $${(totalUsdCredit - totalUsdOutstanding).toLocaleString()}`,
        144,
        yPos + 23
      );

      // Client List Table
      yPos += 35;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Client List", 14, yPos);

      // Prepare table data
      const tableData = filteredClients.map((client) => [
        client.clientId,
        client.clientName,
        client.clientType,
        client.phone,
        `KES ${client.kesDebit.toLocaleString()}`,
        `KES ${client.kesCredit.toLocaleString()}`,
        `$${client.usdDebit.toLocaleString()}`,
        `$${client.usdCredit.toLocaleString()}`,
      ]);

      autoTable(doc, {
        startY: yPos + 5,
        head: [
          [
            "ID",
            "Name",
            "Type",
            "Phone",
            "KES Debit",
            "KES Credit",
            "USD Debit",
            "USD Credit",
          ],
        ],
        body: tableData,
        theme: "grid",
        headStyles: {
          fillColor: [37, 99, 235], // Blue-600
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: "bold",
          halign: "left",
        },
        bodyStyles: {
          fontSize: 7,
          textColor: [0, 0, 0],
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252], // Slate-50
        },
        columnStyles: {
          0: { cellWidth: 18 },
          1: { cellWidth: 30 },
          2: { cellWidth: 20 },
          3: { cellWidth: 25 },
          4: { cellWidth: 22, halign: "right" },
          5: { cellWidth: 22, halign: "right" },
          6: { cellWidth: 20, halign: "right" },
          7: { cellWidth: 20, halign: "right" },
        },
        margin: { left: 14, right: 14 },
        didDrawPage: (data: any) => {
          // Footer
          doc.setFontSize(8);
          doc.setTextColor(100);
          doc.text(`Page ${data.pageNumber}`, pageWidth / 2, pageHeight - 10, {
            align: "center",
          });
        },
      });

      // Save the PDF
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

  // Filter transactions based on search and filter
  const getFilteredTransactions = () => {
    if (!selectedClient) return [];

    let transactions = selectedClient.transactions;

    // Apply type filter
    if (transactionFilter !== "all") {
      transactions = transactions.filter((t) => t.type === transactionFilter);
    }

    // Apply currency filter
    if (currencyFilter !== "all") {
      transactions = transactions.filter((t) => t.currency === currencyFilter);
    }

    // Apply search filter
    if (transactionSearch) {
      transactions = transactions.filter(
        (t) =>
          t.description
            .toLowerCase()
            .includes(transactionSearch.toLowerCase()) ||
          t.reference.toLowerCase().includes(transactionSearch.toLowerCase()) ||
          t.id.toLowerCase().includes(transactionSearch.toLowerCase())
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

  const handleTransactionPageChange = (pageNumber: number) => {
    setTransactionsCurrentPage(pageNumber);
  };

  const handleConvertToPermanent = (client: Client) => {
    toast.success(`${client.name} converted to Permanent client!`);
    setShowEditModal(false);
  };

  const confirmDelete = () => {
    if (selectedClient) {
      toast.success(`${selectedClient.name} has been deleted successfully`);
      setShowDeleteConfirm(false);
      setShowStatement(false);
      setSelectedClient(null);
    }
  };

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
            {permanentCount} Permanent • {temporaryCount} Temporary Clients
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

      {/* Summary Cards - PREMIUM SHARP DESIGN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* All Clients Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className="relative bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 text-white shadow-xl shadow-blue-500/20 overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300"
          onClick={() => setActiveTab("all")}
        >
          {/* Background Pattern */}
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
              {allClients.length}
            </p>
            <div className="pt-3 border-t border-white/20 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] opacity-75">KES Credit</span>
                <span className="text-sm font-bold">
                  KES {totalKesCredit.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] opacity-75">USD Credit</span>
                <span className="text-sm font-bold">
                  ${totalUsdCredit.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Outstanding Debits Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-red-300 transition-all duration-300 cursor-pointer group"
          onClick={() => setActiveTab("outstanding")}
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 flex items-center justify-center border-2 border-red-200 group-hover:bg-red-200 transition-colors">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="bg-red-100 px-3 py-1 border border-red-200">
                <span className="text-[10px] font-bold text-red-700 uppercase tracking-wide">
                  Debits
                </span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-bold">
              Outstanding Debits
            </p>
            <p className="text-3xl font-bold text-red-600 tracking-tight mb-4">
              {clientsWithOutstanding.length}
            </p>
            <div className="pt-3 border-t-2 border-slate-100 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-semibold">
                  KES Debits
                </span>
                <span className="text-sm font-bold text-red-600">
                  KES {totalKesOutstanding.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-semibold">
                  USD Debits
                </span>
                <span className="text-sm font-bold text-red-600">
                  ${totalUsdOutstanding.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pure Credit Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl hover:border-emerald-300 transition-all duration-300 cursor-pointer group"
          onClick={() => setActiveTab("positive")}
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
              Pure Credit
            </p>
            <p className="text-3xl font-bold text-emerald-600 tracking-tight mb-4">
              {clientsWithPositive.length}
            </p>
            <div className="pt-3 border-t-2 border-slate-100 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-semibold">
                  KES Net
                </span>
                <span className="text-sm font-bold text-emerald-600">
                  KES {(totalKesCredit - totalKesOutstanding).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-semibold">
                  USD Net
                </span>
                <span className="text-sm font-bold text-emerald-600">
                  ${(totalUsdCredit - totalUsdOutstanding).toLocaleString()}
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
            {allClients.length}
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
            className={`px-2 py-0.5 text-xs font-bold ${
              activeTab === "outstanding"
                ? "bg-white/20"
                : "bg-red-100 text-red-700"
            }`}
          >
            {clientsWithOutstanding.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("positive")}
          className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all duration-300 ${
            activeTab === "positive"
              ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
              : "bg-white text-slate-600 hover:bg-emerald-50 border-2 border-slate-200 hover:border-emerald-300"
          }`}
        >
          <CheckCircle className="w-5 h-5" />
          Credit Only
          <span
            className={`px-2 py-0.5 text-xs font-bold ${
              activeTab === "positive"
                ? "bg-white/20"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {clientsWithPositive.length}
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
              placeholder="Search by name, phone, ID, or client type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-lg focus:shadow-blue-500/10 transition-all duration-300 placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => toast.info("Opening filter options...")}
              className="flex items-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 transition-all font-medium text-slate-700"
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
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
              {currentClients.map((client, index) => {
                const { kesNet, usdNet } = getNetBalance(client);
                return (
                  <motion.tr
                    key={client.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-blue-600 group-hover:text-blue-700">
                        {client.id}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="font-bold text-slate-900 text-sm whitespace-nowrap">
                          {client.name}
                        </div>
                        <div className="flex flex-col gap-0.5 mt-1">
                          <span className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Phone className="w-3 h-3" />
                            {client.phone}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {client.clientType === "Permanent" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border-2 bg-blue-100 text-blue-700 border-blue-200">
                          <UserCheck className="w-4 h-4" />
                          Permanent
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border-2 bg-amber-100 text-amber-700 border-amber-200">
                          <Clock className="w-4 h-4" />
                          Temporary
                          {client.expiryDays && (
                            <span className="ml-1 px-1.5 py-0.5 bg-amber-200 rounded-full text-[10px]">
                              {client.expiryDays}d
                            </span>
                          )}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {client.kesDebit > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <ArrowDownCircle className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-bold text-red-600">
                            {client.kesDebit.toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {client.kesCredit > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <ArrowUpCircle className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm font-bold text-emerald-600">
                            {client.kesCredit.toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {client.usdDebit > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <ArrowDownCircle className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-bold text-red-600">
                            ${client.usdDebit.toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {client.usdCredit > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <ArrowUpCircle className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-bold text-blue-600">
                            ${client.usdCredit.toLocaleString()}
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
                            kesNet >= 0 ? "text-emerald-600" : "text-red-600"
                          }`}
                        >
                          <span>KES {kesNet.toLocaleString()}</span>
                        </div>
                        <div
                          className={`flex items-center gap-1 text-xs font-bold ${
                            usdNet >= 0 ? "text-blue-600" : "text-red-600"
                          }`}
                        >
                          <span>USD ${usdNet.toLocaleString()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedClient(client);
                            handleEditClient();
                          }}
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
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredClients.length === 0 && (
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

        {/* Table Footer with Pagination */}
        <div className="border-t-2 border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-600">
              Showing{" "}
              <span className="font-bold text-slate-900">
                {indexOfFirstClient + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-slate-900">
                {Math.min(indexOfLastClient, filteredClients.length)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-900">
                {filteredClients.length}
              </span>{" "}
              clients
            </p>

            {/* Pagination Controls */}
            {totalClientsPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(clientsCurrentPage - 1)}
                  disabled={clientsCurrentPage === 1}
                  className="px-3 py-2 border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(totalClientsPages)].map((_, i) => {
                    const pageNumber = i + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalClientsPages ||
                      (pageNumber >= clientsCurrentPage - 1 &&
                        pageNumber <= clientsCurrentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-3 py-2 text-sm font-medium transition-all ${
                            clientsCurrentPage === pageNumber
                              ? "bg-blue-600 text-white"
                              : "bg-white border border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === clientsCurrentPage - 2 ||
                      pageNumber === clientsCurrentPage + 2
                    ) {
                      return (
                        <span key={pageNumber} className="px-2 text-slate-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(clientsCurrentPage + 1)}
                  disabled={clientsCurrentPage === totalClientsPages}
                  className="px-3 py-2 border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Client Statement Modal - PREMIUM DESIGN */}
      <AnimatePresence>
        {showStatement && selectedClient && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col"
            >
              {/* Premium Header with Actions */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-8 relative overflow-hidden">
                {/* Background Pattern */}
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
                  {/* Compact Blue Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h2 className="text-lg font-bold text-white mb-0.5">
                        {selectedClient.name}
                      </h2>
                      <div className="flex items-center gap-3 text-xs text-blue-100">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {selectedClient.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {selectedClient.email}
                        </span>
                        <span className="font-mono">
                          ID: {selectedClient.id}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedClient.clientType === "Permanent" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold bg-white/20 border border-white/30 text-white">
                          <UserCheck className="w-3 h-3" />
                          Permanent
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold bg-amber-500/30 border border-amber-400/40 text-amber-100">
                          <Clock className="w-3 h-3" />
                          {selectedClient.expiryDays}d left
                        </span>
                      )}
                      <span className="px-2 py-0.5 bg-emerald-500/30 border border-emerald-400/40 text-xs font-bold text-emerald-100">
                        {selectedClient.status.toUpperCase()}
                      </span>
                      <button
                        onClick={() => setShowStatement(false)}
                        className="p-1.5 bg-white/10 hover:bg-white/20 transition-all ml-2"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Balances - Compact Blue Design */}
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
                            +{selectedClient.kesCredit.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs opacity-75">Debit (Out)</p>
                          <p className="font-bold text-sm text-red-200">
                            -{selectedClient.kesDebit.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs opacity-75">Net</p>
                          <p
                            className={`font-bold ${
                              getNetBalance(selectedClient).kesNet >= 0
                                ? ""
                                : "text-red-200"
                            }`}
                          >
                            {getNetBalance(selectedClient).kesNet >= 0
                              ? "+"
                              : ""}
                            {getNetBalance(
                              selectedClient
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
                          <p className="text-xs opacity-75">Credit (In)</p>
                          <p className="font-bold text-sm text-cyan-200">
                            +${selectedClient.usdCredit.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs opacity-75">Debit (Out)</p>
                          <p className="font-bold text-sm text-red-200">
                            -${selectedClient.usdDebit.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs opacity-75">Net</p>
                          <p
                            className={`font-bold ${
                              getNetBalance(selectedClient).usdNet >= 0
                                ? ""
                                : "text-red-200"
                            }`}
                          >
                            {getNetBalance(selectedClient).usdNet >= 0
                              ? "+$"
                              : "-$"}
                            {Math.abs(
                              getNetBalance(selectedClient).usdNet
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction History - Comprehensive */}
              <div className="p-8 overflow-y-auto flex-1 bg-white">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="w-6 h-6 text-blue-600" />
                    Transaction History
                  </h3>
                  <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold">
                    {filteredTransactions.length} of{" "}
                    {selectedClient.transactions.length} Transactions
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
                          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                    </div>

                    {/* Type Filter Dropdown */}
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
                          <option value="credit">Credit</option>
                          <option value="debit">Debit</option>
                        </select>
                      </div>
                    </div>

                    {/* Currency Filter Dropdown */}
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

                    {/* Action Buttons */}
                    <div className="lg:col-span-4 flex gap-2">
                      <button
                        onClick={handleExportStatementPDF}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white hover:bg-emerald-700 transition-all font-semibold text-sm"
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

                  {filteredTransactions.length === 0 && (
                    <div className="text-center py-16 bg-slate-50">
                      <FileText className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                      <h4 className="text-xl font-bold text-slate-900 mb-2">
                        No Transactions Found
                      </h4>
                      <p className="text-slate-600">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  )}

                  {/* Table Footer with Pagination */}
                  {filteredTransactions.length > 0 && (
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

                        {/* Pagination Controls */}
                        {totalTransactionPages > 1 && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleTransactionPageChange(
                                  transactionsCurrentPage - 1
                                )
                              }
                              disabled={transactionsCurrentPage === 1}
                              className="px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs font-medium"
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
                                        handleTransactionPageChange(pageNumber)
                                      }
                                      className={`px-3 py-1.5 text-xs font-medium transition-all ${
                                        transactionsCurrentPage === pageNumber
                                          ? "bg-blue-600 text-white"
                                          : "bg-white border border-slate-300 hover:bg-slate-50"
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
                                handleTransactionPageChange(
                                  transactionsCurrentPage + 1
                                )
                              }
                              disabled={
                                transactionsCurrentPage ===
                                totalTransactionPages
                              }
                              className="px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs font-medium"
                            >
                              Next
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && selectedClient && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                  <Trash2 className="w-7 h-7 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Delete Client
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-slate-700">
                  Are you sure you want to delete{" "}
                  <span className="font-bold text-slate-900">
                    {selectedClient.name}
                  </span>
                  ? All transaction history and account data will be permanently
                  removed.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-6 py-3 border-2 border-slate-300 rounded-xl hover:bg-slate-50 transition-all font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all"
                >
                  Delete Client
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Client Modal */}
      <AnimatePresence>
        {showEditModal && selectedClient && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white shadow-2xl max-w-xl w-full max-h-[85vh] overflow-hidden flex flex-col"
            >
              {/* Premium Header with Gradient Background */}
              <div className="relative bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 px-6 py-4">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

                <div className="relative flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
                      <Edit3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white mb-0.5">
                        Edit Client Account
                      </h2>
                      <p className="text-blue-100 text-xs font-medium">
                        Update client information and account settings
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-xs font-bold text-white">
                          <Hash className="w-3 h-3" />
                          {selectedClient.id}
                        </span>
                        {selectedClient.clientType === "Permanent" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/30 backdrop-blur-sm border border-emerald-400/40 rounded-lg text-xs font-bold text-emerald-100">
                            <UserCheck className="w-3 h-3" />
                            Permanent
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-500/30 backdrop-blur-sm border border-amber-400/40 rounded-lg text-xs font-bold text-amber-100">
                            <Clock className="w-3 h-3" />
                            {selectedClient.expiryDays}d left
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
                          Credit (In)
                        </p>
                        <p className="text-xs font-bold text-emerald-600">
                          +{selectedClient.kesCredit.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 mb-0.5">
                          Debit (Out)
                        </p>
                        <p className="text-xs font-bold text-red-600">
                          -{selectedClient.kesDebit.toLocaleString()}
                        </p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-[10px] text-slate-500 mb-0.5">Net</p>
                        <p
                          className={`text-sm font-bold ${
                            getNetBalance(selectedClient).kesNet >= 0
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {getNetBalance(selectedClient).kesNet >= 0 ? "+" : ""}
                          {getNetBalance(
                            selectedClient
                          ).kesNet.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* USD Balance */}
                  <div className="bg-white p-3 border border-cyan-200 shadow-sm">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-cyan-600" />
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                        USD
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 text-xs">
                      <div>
                        <p className="text-[10px] text-slate-500 mb-0.5">
                          Credit (In)
                        </p>
                        <p className="text-xs font-bold text-blue-600">
                          +${selectedClient.usdCredit.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 mb-0.5">
                          Debit (Out)
                        </p>
                        <p className="text-xs font-bold text-red-600">
                          -${selectedClient.usdDebit.toLocaleString()}
                        </p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-[10px] text-slate-500 mb-0.5">Net</p>
                        <p
                          className={`text-sm font-bold ${
                            getNetBalance(selectedClient).usdNet >= 0
                              ? "text-blue-600"
                              : "text-red-600"
                          }`}
                        >
                          {getNetBalance(selectedClient).usdNet >= 0
                            ? "+$"
                            : "-$"}
                          {Math.abs(
                            getNetBalance(selectedClient).usdNet
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
                  {/* Personal Information Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full"></div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Personal Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div className="group">
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          Full Name
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          defaultValue={selectedClient.name}
                          placeholder="Enter full name"
                          className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        />
                      </div>

                      {/* Phone Number */}
                      <div className="group">
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-400" />
                          Phone Number
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          defaultValue={selectedClient.phone}
                          placeholder="+254 712 345 678"
                          className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div className="group">
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        Email Address
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        defaultValue={selectedClient.email}
                        placeholder="client@example.com"
                        className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                    </div>

                    {/* Account Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="group">
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-slate-400" />
                          Account Status
                        </label>
                        <select
                          defaultValue={selectedClient.status}
                          className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>

                      <div className="group">
                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          Member Since
                        </label>
                        <input
                          type="text"
                          value={selectedClient.joined}
                          disabled
                          className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 text-slate-500 font-medium cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Convert to Permanent Section - Enhanced */}
                  {selectedClient.clientType === "Temporary" && (
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-2xl"></div>
                      <div className="relative bg-white border-2 border-blue-200 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
                            <RefreshCw className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-slate-900 mb-2">
                              Convert to Permanent Client
                            </h4>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                              This client is currently{" "}
                              <span className="font-bold text-amber-600">
                                temporary
                              </span>{" "}
                              with{" "}
                              <span className="font-bold text-amber-600">
                                {selectedClient.expiryDays} days remaining
                              </span>
                              . Convert to permanent status for unlimited
                              account access and remove expiry limitations.
                            </p>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() =>
                                  handleConvertToPermanent(selectedClient)
                                }
                                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all hover:scale-105 active:scale-95"
                              >
                                <UserCheck className="w-5 h-5" />
                                Convert to Permanent
                              </button>
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <AlertCircle className="w-4 h-4" />
                                <span>This action is permanent</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* Fixed Footer with Action Buttons */}
              <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-blue-50 border-t-2 border-slate-200 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-6 py-3.5 bg-white border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all font-bold text-slate-700 shadow-sm hover:shadow"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.success("Client information updated successfully!");
                    setShowEditModal(false);
                  }}
                  className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all hover:scale-105 active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Transaction Detail Modal - PREMIUM DESIGN */}
      <AnimatePresence>
        {showTransactionDetail && selectedTransaction && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[70]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col"
            >
              {/* Premium Header with Gradient Background */}
              <div
                className={`relative px-6 py-4 ${
                  selectedTransaction.type === "debit"
                    ? "bg-gradient-to-r from-red-600 via-rose-600 to-red-700"
                    : "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700"
                }`}
              >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

                <div className="relative flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
                      {selectedTransaction.type === "credit" ? (
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
                            ? "text-red-100"
                            : "text-emerald-100"
                        }`}
                      >
                        {selectedTransaction.type === "debit"
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
                        ? "bg-gradient-to-br from-red-600 to-rose-600"
                        : "bg-gradient-to-br from-emerald-600 to-teal-600"
                    }`}
                  >
                    <p className="text-xs opacity-90 mb-2">Description</p>
                    <p className="text-lg font-bold mb-4">
                      {selectedTransaction.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4 pt-3 border-white/20">
                      <div>
                        <p className="text-[10px] opacity-75 mb-1">Amount</p>
                        <p className="text-xl font-bold">
                          {selectedTransaction.type === "debit" ? "-" : "+"}
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
                        ? "bg-red-50 border-red-200"
                        : "bg-emerald-50 border-emerald-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 flex items-center justify-center ${
                          selectedTransaction.type === "debit"
                            ? "bg-red-100"
                            : "bg-emerald-100"
                        }`}
                      >
                        <Activity
                          className={`w-4 h-4 ${
                            selectedTransaction.type === "debit"
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
                            selectedTransaction.type === "debit"
                              ? "text-red-600"
                              : "text-emerald-600"
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

              {/* Fixed Footer with Action Buttons */}
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
                    selectedTransaction.type === "debit"
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

      {/* Edit Transaction Modal - PREMIUM DESIGN */}
      <AnimatePresence>
        {showEditTransaction && selectedTransaction && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[70]">
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
                        Update transaction details and information
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
                        Reference Number
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
                  onClick={() => setShowEditTransaction(false)}
                  className="flex-1 px-6 py-3 bg-white border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all font-bold text-slate-700 shadow-sm hover:shadow"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.success("Transaction updated successfully!");
                    setShowEditTransaction(false);
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

      {/* Delete Transaction Confirmation Modal - PREMIUM DESIGN */}
      <AnimatePresence>
        {showDeleteTransaction && selectedTransaction && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[70]">
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
                    onClick={() => setShowDeleteTransaction(false)}
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
                  onClick={() => setShowDeleteTransaction(false)}
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
                        "debit" ? (
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
                            "Bank Account" && (
                            <CreditCard className="w-5 h-5 text-blue-600" />
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
                        "debit" ? (
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
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <p className="text-xs font-bold text-slate-900">
                            Client Account
                          </p>
                          <p
                            className={`text-xs font-bold mt-1 ${
                              selectedTransaction.type === "debit"
                                ? "text-red-600"
                                : "text-emerald-600"
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
                              "Bank Account" && (
                              <CreditCard className="w-6 h-6 text-blue-600" />
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

      {/* Add Client Modal - Premium Design */}
      <AnimatePresence>
        {showAddClient && (
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
                  onClick={() => setShowAddClient(false)}
                  className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 transition-all duration-200 border border-white/20 hover:border-white/40 group"
                  title="Close"
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
              <div className="p-4 max-h-[calc(100vh-180px)] overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50/30">
                <form className="space-y-4">
                  {/* Personal Information Section */}
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
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 focus:bg-white transition-all font-medium text-slate-900 text-sm placeholder:text-slate-400"
                          placeholder="John Kamau"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                          <Phone className="w-3 h-3 text-blue-600" />
                          Phone *
                        </label>
                        <input
                          type="tel"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 focus:bg-white transition-all font-medium text-slate-900 text-sm placeholder:text-slate-400"
                          placeholder="+254 712 345 678"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                          <Mail className="w-3 h-3 text-blue-600" />
                          Email *
                        </label>
                        <input
                          type="email"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 focus:bg-white transition-all font-medium text-slate-900 text-sm placeholder:text-slate-400"
                          placeholder="john.kamau@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                          <Hash className="w-3 h-3 text-blue-600" />
                          ID / Passport *
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 focus:bg-white transition-all font-medium text-slate-900 text-sm placeholder:text-slate-400"
                          placeholder="12345678"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Account Type Section */}
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
                      {/* Permanent Client Card */}
                      <label className="group cursor-pointer">
                        <input
                          type="radio"
                          name="clientType"
                          value="permanent"
                          className="peer sr-only"
                          defaultChecked
                        />
                        <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 peer-checked:border-blue-600 peer-checked:shadow-md peer-checked:shadow-blue-500/20 transition-all hover:border-blue-400 hover:shadow-sm relative overflow-hidden group-hover:scale-[1.02] duration-200">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-cyan-600/5 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
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
                          <p className="text-[10px] text-slate-600 font-medium leading-snug relative">
                            No expiry • Full access
                          </p>
                        </div>
                      </label>

                      {/* Temporary Client Card */}
                      <label className="group cursor-pointer">
                        <input
                          type="radio"
                          name="clientType"
                          value="temporary"
                          className="peer sr-only"
                        />
                        <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 peer-checked:border-amber-600 peer-checked:shadow-md peer-checked:shadow-amber-500/20 transition-all hover:border-amber-400 hover:shadow-sm relative overflow-hidden group-hover:scale-[1.02] duration-200">
                          <div className="absolute inset-0 bg-gradient-to-r from-amber-600/5 to-orange-600/5 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
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
                          <p className="text-[10px] text-slate-600 font-medium leading-snug relative">
                            Limited • Restricted
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Initial Balance Section */}
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
                    onClick={() => setShowAddClient(false)}
                    className="flex-1 px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all font-semibold text-slate-700 text-sm tracking-wide shadow-sm hover:shadow"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      toast.success("✓ Client Account Created Successfully!");
                      setShowAddClient(false);
                    }}
                    className="flex-1 px-5 py-2.5 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2 text-sm tracking-wide border border-blue-700/50 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <UserPlus className="w-4 h-4" />
                    Create Account
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
