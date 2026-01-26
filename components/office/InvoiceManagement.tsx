import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Download,
  Edit3,
  Trash2,
  X,
  Calendar,
  DollarSign,
  User,
  Building,
  Mail,
  Phone,
  Hash,
  CheckCircle,
  Clock,
  AlertCircle,
  Image as ImageIcon,
  Upload,
  Save,
  Copy,
  Send,
  Printer,
  LayoutTemplate,
  Sparkles,
  XCircle,
  ArrowRight,
  Zap,
  TrendingUp,
  FileCheck,
  AlertOctagon,
  ShoppingCart,
  CreditCard,
  Receipt,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  currency: "KES" | "USD";
  notes: string;
  createdAt: string;
}

interface CompanyInfo {
  name: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
}

// Premium Invoice Templates
const INVOICE_TEMPLATES = [
  {
    id: "modern-blue",
    name: "Modern Blue",
    color: "#2563eb",
    description: "Clean and professional",
    gradient: "from-blue-600 to-blue-700",
    accent: "#3b82f6",
  },
  {
    id: "elegant-purple",
    name: "Elegant Purple",
    color: "#7c3aed",
    description: "Sophisticated design",
    gradient: "from-purple-600 to-violet-700",
    accent: "#8b5cf6",
  },
  {
    id: "classic-black",
    name: "Classic Black",
    color: "#1f2937",
    description: "Timeless minimalist",
    gradient: "from-gray-800 to-gray-900",
    accent: "#374151",
  },
  {
    id: "fresh-green",
    name: "Fresh Green",
    color: "#059669",
    description: "Modern eco-friendly",
    gradient: "from-emerald-600 to-green-700",
    accent: "#10b981",
  },
  {
    id: "bold-red",
    name: "Bold Red",
    color: "#dc2626",
    description: "Eye-catching statement",
    gradient: "from-red-600 to-rose-700",
    accent: "#ef4444",
  },
  {
    id: "corporate-navy",
    name: "Corporate Navy",
    color: "#1e40af",
    description: "Professional corporate",
    gradient: "from-blue-800 to-indigo-900",
    accent: "#3730a3",
  },
  {
    id: "creative-orange",
    name: "Creative Orange",
    color: "#ea580c",
    description: "Energetic creative",
    gradient: "from-orange-600 to-amber-700",
    accent: "#f97316",
  },
  {
    id: "minimal-gray",
    name: "Minimal Gray",
    color: "#6b7280",
    description: "Subtle professional",
    gradient: "from-slate-600 to-gray-700",
    accent: "#64748b",
  },
  {
    id: "premium-gold",
    name: "Premium Gold",
    color: "#d97706",
    description: "Luxury premium",
    gradient: "from-amber-600 to-yellow-700",
    accent: "#f59e0b",
  },
  {
    id: "tech-cyan",
    name: "Tech Cyan",
    color: "#0891b2",
    description: "Modern technology",
    gradient: "from-cyan-600 to-teal-700",
    accent: "#06b6d4",
  },
  {
    id: "royal-indigo",
    name: "Royal Indigo",
    color: "#4f46e5",
    description: "Distinguished elegant",
    gradient: "from-indigo-600 to-purple-700",
    accent: "#6366f1",
  },
  {
    id: "vibrant-pink",
    name: "Vibrant Pink",
    color: "#db2777",
    description: "Bold contemporary",
    gradient: "from-pink-600 to-rose-700",
    accent: "#ec4899",
  },
];

export default function InvoiceManagement() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currencyFilter, setCurrencyFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCompanySettings, setShowCompanySettings] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("modern-blue");
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "SARIF FINTECH",
    logo: "",
    address: "Westlands, Nairobi, Kenya",
    phone: "+254 700 000 000",
    email: "invoices@sarif.co.ke",
    website: "www.sarif.co.ke",
    taxId: "KRA-P051234567X",
  });

  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    currency: "KES" as "KES" | "USD",
    items: [
      { id: "1", description: "", quantity: 1, unitPrice: 0, amount: 0 },
    ] as InvoiceItem[],
    tax: 0,
    discount: 0,
    notes: "Thank you for your business! Payment is due within 30 days.",
  });

  // Load mock data
  useEffect(() => {
    loadMockInvoices();
  }, []);

  const loadMockInvoices = () => {
    const mockInvoices: Invoice[] = [
      {
        id: "1",
        invoiceNumber: "INV-2024-001",
        date: "2024-01-15",
        dueDate: "2024-02-15",
        clientName: "John Mwangi Enterprises",
        clientEmail: "john.mwangi@business.co.ke",
        clientPhone: "+254 712 345 678",
        clientAddress: "Westlands Business Park, Nairobi",
        items: [
          {
            id: "1",
            description: "Currency Exchange Service - USD to KES",
            quantity: 1000,
            unitPrice: 150,
            amount: 150000,
          },
          {
            id: "2",
            description: "Transaction Processing Fee",
            quantity: 1,
            unitPrice: 2500,
            amount: 2500,
          },
        ],
        subtotal: 152500,
        tax: 0,
        discount: 2500,
        total: 150000,
        status: "paid",
        currency: "KES",
        notes:
          "Thank you for your business! We appreciate your prompt payment.",
        createdAt: "2024-01-15T10:00:00",
      },
      {
        id: "2",
        invoiceNumber: "INV-2024-002",
        date: "2024-01-20",
        dueDate: "2024-02-20",
        clientName: "Sarah Akinyi Trading Ltd",
        clientEmail: "sarah@tradingltd.co.ke",
        clientPhone: "+254 723 456 789",
        clientAddress: "Karen Business Center, Nairobi",
        items: [
          {
            id: "1",
            description: "International Money Transfer Service",
            quantity: 1,
            unitPrice: 500,
            amount: 500,
          },
          {
            id: "2",
            description: "Exchange Rate Premium",
            quantity: 1,
            unitPrice: 150,
            amount: 150,
          },
        ],
        subtotal: 650,
        tax: 0,
        discount: 50,
        total: 600,
        status: "sent",
        currency: "USD",
        notes:
          "Payment due within 30 days. Bank details available upon request.",
        createdAt: "2024-01-20T14:30:00",
      },
      {
        id: "3",
        invoiceNumber: "INV-2024-003",
        date: "2024-01-22",
        dueDate: "2024-02-22",
        clientName: "Mohamed Hassan Imports",
        clientEmail: "moh.hassan@imports.com",
        clientPhone: "+254 734 567 890",
        clientAddress: "Industrial Area, Mombasa",
        items: [
          {
            id: "1",
            description: "Bulk Currency Exchange - KES to USD",
            quantity: 5000,
            unitPrice: 0.0073,
            amount: 36.5,
          },
        ],
        subtotal: 36.5,
        tax: 0,
        discount: 0,
        total: 36.5,
        status: "overdue",
        currency: "USD",
        notes: "URGENT: Payment overdue. Please settle immediately.",
        createdAt: "2024-01-22T09:15:00",
      },
      {
        id: "4",
        invoiceNumber: "INV-2024-004",
        date: "2024-01-25",
        dueDate: "2024-02-25",
        clientName: "Grace Wanjiru Solutions",
        clientEmail: "grace@solutions.co.ke",
        clientPhone: "+254 745 678 901",
        clientAddress: "Kilimani, Nairobi",
        items: [
          {
            id: "1",
            description: "M-Pesa Business Integration Setup",
            quantity: 1,
            unitPrice: 15000,
            amount: 15000,
          },
        ],
        subtotal: 15000,
        tax: 0,
        discount: 0,
        total: 15000,
        status: "draft",
        currency: "KES",
        notes: "Draft - Pending client approval.",
        createdAt: "2024-01-25T16:45:00",
      },
    ];
    setInvoices(mockInvoices);
  };

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = (subtotal * formData.tax) / 100;
    const total = subtotal + taxAmount - formData.discount;
    return { subtotal, taxAmount, total };
  };

  // Add invoice item
  const addInvoiceItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    };
    setFormData({ ...formData, items: [...formData.items, newItem] });
  };

  // Update invoice item
  const updateInvoiceItem = (
    id: string,
    field: keyof InvoiceItem,
    value: any
  ) => {
    const updatedItems = formData.items.map((item) => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === "quantity" || field === "unitPrice") {
          updated.amount = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return item;
    });
    setFormData({ ...formData, items: updatedItems });
  };

  // Remove invoice item
  const removeInvoiceItem = (id: string) => {
    if (formData.items.length > 1) {
      setFormData({
        ...formData,
        items: formData.items.filter((item) => item.id !== id),
      });
    }
  };

  // Create invoice
  const handleCreateInvoice = () => {
    if (!formData.clientName || !formData.clientEmail) {
      toast.error("Please fill in client name and email");
      return;
    }

    if (
      formData.items.some((item) => !item.description || item.quantity <= 0)
    ) {
      toast.error("Please complete all invoice items");
      return;
    }

    const { subtotal, taxAmount, total } = calculateTotals();

    const newInvoice: Invoice = {
      id: Date.now().toString(),
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(
        invoices.length + 1
      ).padStart(3, "0")}`,
      date: formData.date,
      dueDate: formData.dueDate,
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      clientPhone: formData.clientPhone,
      clientAddress: formData.clientAddress,
      items: formData.items,
      subtotal,
      tax: taxAmount,
      discount: formData.discount,
      total,
      status: "draft",
      currency: formData.currency,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
    };

    setInvoices([newInvoice, ...invoices]);
    setShowCreateModal(false);
    resetForm();
    toast.success("✨ Invoice created successfully!", {
      description: `Invoice ${newInvoice.invoiceNumber} for ${formData.clientName}`,
    });
  };

  const resetForm = () => {
    setFormData({
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      clientAddress: "",
      date: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      currency: "KES",
      items: [
        { id: "1", description: "", quantity: 1, unitPrice: 0, amount: 0 },
      ],
      tax: 0,
      discount: 0,
      notes: "Thank you for your business! Payment is due within 30 days.",
    });
  };

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyInfo({ ...companyInfo, logo: reader.result as string });
        toast.success("✨ Logo uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  // Export to PDF
  const exportToPDF = (invoice: Invoice) => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const template = INVOICE_TEMPLATES.find((t) => t.id === selectedTemplate);
      const primaryColor = template?.color || "#2563eb";

      // Convert hex to RGB
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
          ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
            }
          : { r: 37, g: 99, b: 235 };
      };

      const rgb = hexToRgb(primaryColor);

      // Premium Header Background with gradient effect
      doc.setFillColor(rgb.r, rgb.g, rgb.b);
      doc.rect(0, 0, pageWidth, 55, "F");

      // Subtle accent bar
      doc.setFillColor(
        Math.min(rgb.r + 30, 255),
        Math.min(rgb.g + 30, 255),
        Math.min(rgb.b + 30, 255)
      );
      doc.rect(0, 52, pageWidth, 3, "F");

      // Company Logo
      if (companyInfo.logo) {
        try {
          doc.addImage(companyInfo.logo, "PNG", 14, 10, 35, 35);
        } catch (e) {
          console.log("Logo not added");
        }
      }

      // Company Info - Premium Typography
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(26);
      doc.setFont("helvetica", "bold");
      doc.text(companyInfo.name, companyInfo.logo ? 55 : 14, 18);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(companyInfo.address, companyInfo.logo ? 55 : 14, 27);
      doc.text(
        `${companyInfo.phone} | ${companyInfo.email}`,
        companyInfo.logo ? 55 : 14,
        33
      );
      doc.text(
        `${companyInfo.website} | Tax ID: ${companyInfo.taxId}`,
        companyInfo.logo ? 55 : 14,
        39
      );

      // INVOICE Title - Right Side
      doc.setFontSize(32);
      doc.setFont("helvetica", "bold");
      doc.text("INVOICE", pageWidth - 14, 22, { align: "right" });

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(invoice.invoiceNumber, pageWidth - 14, 30, { align: "right" });

      // Premium Status Badge
      doc.setFontSize(9);
      const statusColors: any = {
        draft: [156, 163, 175],
        sent: [59, 130, 246],
        paid: [16, 185, 129],
        overdue: [239, 68, 68],
        cancelled: [107, 114, 128],
      };
      const statusColor = statusColors[invoice.status];
      doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.rect(pageWidth - 45, 34, 31, 7, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text(invoice.status.toUpperCase(), pageWidth - 29.5, 39, {
        align: "center",
      });

      // Bill To & Invoice Details Section
      let yPos = 68;

      // Left Side - Bill To
      doc.setFillColor(248, 250, 252);
      doc.rect(14, yPos, (pageWidth - 28) / 2 - 3, 42, "F");
      doc.setDrawColor(rgb.r, rgb.g, rgb.b);
      doc.setLineWidth(0.5);
      doc.rect(14, yPos, (pageWidth - 28) / 2 - 3, 42, "S");

      doc.setTextColor(rgb.r, rgb.g, rgb.b);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("BILL TO", 18, yPos + 6);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(invoice.clientName, 18, yPos + 14);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(invoice.clientAddress, 18, yPos + 21);
      doc.text(invoice.clientPhone, 18, yPos + 27);
      doc.text(invoice.clientEmail, 18, yPos + 33);

      // Right Side - Invoice Details
      const rightX = pageWidth / 2 + 3;
      doc.setFillColor(248, 250, 252);
      doc.rect(rightX, yPos, (pageWidth - 28) / 2 - 3, 42, "F");
      doc.setDrawColor(rgb.r, rgb.g, rgb.b);
      doc.rect(rightX, yPos, (pageWidth - 28) / 2 - 3, 42, "S");

      doc.setTextColor(rgb.r, rgb.g, rgb.b);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("INVOICE DETAILS", rightX + 4, yPos + 6);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");

      doc.text("Invoice Date:", rightX + 4, yPos + 16);
      doc.setFont("helvetica", "normal");
      doc.text(
        new Date(invoice.date).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        pageWidth - 18,
        yPos + 16,
        { align: "right" }
      );

      doc.setFont("helvetica", "bold");
      doc.text("Due Date:", rightX + 4, yPos + 23);
      doc.setFont("helvetica", "normal");
      doc.text(
        new Date(invoice.dueDate).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        pageWidth - 18,
        yPos + 23,
        { align: "right" }
      );

      doc.setFont("helvetica", "bold");
      doc.text("Currency:", rightX + 4, yPos + 30);
      doc.setFont("helvetica", "normal");
      doc.text(invoice.currency, pageWidth - 18, yPos + 30, { align: "right" });

      doc.setFont("helvetica", "bold");
      doc.text("Amount Due:", rightX + 4, yPos + 37);
      doc.setTextColor(rgb.r, rgb.g, rgb.b);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(
        `${invoice.currency} ${invoice.total.toLocaleString()}`,
        pageWidth - 18,
        yPos + 37,
        { align: "right" }
      );

      // Items Table with Premium Styling
      yPos += 50;
      const tableData = invoice.items.map((item) => [
        item.description,
        item.quantity.toString(),
        `${invoice.currency} ${item.unitPrice.toLocaleString()}`,
        `${invoice.currency} ${item.amount.toLocaleString()}`,
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [["DESCRIPTION", "QTY", "UNIT PRICE", "AMOUNT"]],
        body: tableData,
        theme: "grid",
        headStyles: {
          fillColor: [rgb.r, rgb.g, rgb.b],
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: "bold",
          halign: "left",
          cellPadding: 4,
        },
        bodyStyles: {
          fontSize: 9,
          textColor: [0, 0, 0],
          cellPadding: 3,
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        columnStyles: {
          0: { cellWidth: 95 },
          1: { cellWidth: 20, halign: "center" },
          2: { cellWidth: 32, halign: "right" },
          3: { cellWidth: 32, halign: "right" },
        },
        margin: { left: 14, right: 14 },
      });

      // Premium Totals Section
      const finalY = (doc as any).lastAutoTable.finalY + 8;
      const totalsX = pageWidth - 75;

      doc.setDrawColor(rgb.r, rgb.g, rgb.b);
      doc.setLineWidth(0.3);

      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");

      doc.text("Subtotal:", totalsX, finalY);
      doc.text(
        `${invoice.currency} ${invoice.subtotal.toLocaleString()}`,
        pageWidth - 14,
        finalY,
        { align: "right" }
      );

      if (invoice.tax > 0) {
        doc.text("Tax:", totalsX, finalY + 6);
        doc.text(
          `${invoice.currency} ${invoice.tax.toLocaleString()}`,
          pageWidth - 14,
          finalY + 6,
          { align: "right" }
        );
      }

      if (invoice.discount > 0) {
        doc.setTextColor(220, 38, 38);
        doc.text("Discount:", totalsX, finalY + 12);
        doc.text(
          `-${invoice.currency} ${invoice.discount.toLocaleString()}`,
          pageWidth - 14,
          finalY + 12,
          { align: "right" }
        );
      }

      // Grand Total - Premium Style
      doc.setFillColor(rgb.r, rgb.g, rgb.b);
      doc.rect(
        totalsX - 5,
        finalY + (invoice.discount > 0 ? 16 : 10),
        pageWidth - totalsX - 9,
        10,
        "F"
      );

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(
        "TOTAL DUE:",
        totalsX,
        finalY + (invoice.discount > 0 ? 23 : 17)
      );
      doc.setFontSize(13);
      doc.text(
        `${invoice.currency} ${invoice.total.toLocaleString()}`,
        pageWidth - 14,
        finalY + (invoice.discount > 0 ? 23 : 17),
        { align: "right" }
      );

      // Notes Section
      if (invoice.notes) {
        const notesY = finalY + (invoice.discount > 0 ? 32 : 26);
        doc.setTextColor(rgb.r, rgb.g, rgb.b);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("NOTES & TERMS", 14, notesY);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        const splitNotes = doc.splitTextToSize(invoice.notes, pageWidth - 28);
        doc.text(splitNotes, 14, notesY + 6);
      }

      // Premium Footer
      doc.setDrawColor(rgb.r, rgb.g, rgb.b);
      doc.setLineWidth(0.5);
      doc.line(14, pageHeight - 20, pageWidth - 14, pageHeight - 20);

      doc.setFontSize(7);
      doc.setTextColor(100);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Generated by Sarif Fintech on ${new Date().toLocaleDateString(
          "en-US",
          { month: "long", day: "numeric", year: "numeric" }
        )}`,
        pageWidth / 2,
        pageHeight - 12,
        { align: "center" }
      );
      doc.text(
        "This is a computer-generated invoice and is valid without signature.",
        pageWidth / 2,
        pageHeight - 8,
        { align: "center" }
      );

      doc.save(
        `${invoice.invoiceNumber}_${invoice.clientName.replace(
          /\s+/g,
          "_"
        )}.pdf`
      );
      toast.success("✨ Invoice PDF downloaded!", {
        description: `${invoice.invoiceNumber} using ${template?.name} template`,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    }
  };

  // Filter invoices
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;
    const matchesCurrency =
      currencyFilter === "all" || invoice.currency === currencyFilter;

    return matchesSearch && matchesStatus && matchesCurrency;
  });

  // Stats
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter((i) => i.status === "paid").length;
  const pendingInvoices = invoices.filter((i) => i.status === "sent").length;
  const overdueInvoices = invoices.filter((i) => i.status === "overdue").length;
  const draftInvoices = invoices.filter((i) => i.status === "draft").length;
  const totalRevenue = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.total, 0);
  const pendingRevenue = invoices
    .filter((i) => i.status === "sent" || i.status === "overdue")
    .reduce((sum, i) => sum + i.total, 0);

  const { subtotal, taxAmount, total } = calculateTotals();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-cyan-50/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Premium Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-white shadow-2xl border-2 border-blue-100"
        >
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-cyan-600/5 to-blue-600/5" />

          <div className="relative p-8 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute w-96 h-96 bg-white/5 rounded-full -top-48 -right-48 animate-pulse" />
              <div
                className="absolute w-64 h-64 bg-white/5 rounded-full -bottom-32 -left-32 animate-pulse"
                style={{ animationDelay: "1s" }}
              />
            </div>

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-6">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="p-5 bg-white/20 backdrop-blur-xl border-2 border-white/30 shadow-2xl"
                >
                  <FileText className="w-12 h-12 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                    Invoice Management
                  </h1>
                  <p className="text-blue-100 text-lg">
                    Create professional invoices with premium templates
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCompanySettings(true)}
                className="px-6 py-3 bg-white/20 backdrop-blur-xl border-2 border-white/30 text-white hover:bg-white/30 transition-all font-semibold flex items-center gap-3 shadow-xl"
              >
                <Building className="w-5 h-5" />
                <span>Company Settings</span>
              </motion.button>
            </div>
          </div>

          {/* Premium Stats Bar */}
          <div className="relative bg-white/80 backdrop-blur-xl border-t-2 border-blue-100 p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
              {[
                {
                  label: "Total",
                  value: totalInvoices,
                  icon: FileText,
                  color: "blue",
                  gradient: "from-blue-500 to-blue-600",
                },
                {
                  label: "Paid",
                  value: paidInvoices,
                  icon: CheckCircle,
                  color: "emerald",
                  gradient: "from-emerald-500 to-emerald-600",
                },
                {
                  label: "Sent",
                  value: pendingInvoices,
                  icon: Send,
                  color: "cyan",
                  gradient: "from-cyan-500 to-cyan-600",
                },
                {
                  label: "Overdue",
                  value: overdueInvoices,
                  icon: AlertOctagon,
                  color: "red",
                  gradient: "from-red-500 to-red-600",
                },
                {
                  label: "Draft",
                  value: draftInvoices,
                  icon: Edit3,
                  color: "amber",
                  gradient: "from-amber-500 to-amber-600",
                },
                {
                  label: "Revenue",
                  value: `KES ${(totalRevenue / 1000).toFixed(0)}K`,
                  icon: TrendingUp,
                  color: "purple",
                  gradient: "from-purple-500 to-purple-600",
                },
                {
                  label: "Pending",
                  value: `KES ${(pendingRevenue / 1000).toFixed(0)}K`,
                  icon: Clock,
                  color: "orange",
                  gradient: "from-orange-500 to-orange-600",
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className={`bg-gradient-to-br ${stat.gradient} p-4 shadow-lg hover:shadow-xl transition-all group cursor-pointer`}
                >
                  <div className="flex items-center gap-3">
                    <stat.icon className="w-5 h-5 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {stat.value}
                      </div>
                      <div className="text-xs font-medium text-white/80 uppercase tracking-wider">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Premium Actions Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white shadow-xl border-2 border-slate-200 p-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by invoice #, client name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all text-slate-900 placeholder-slate-400 font-medium"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-5 py-4 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all font-semibold text-slate-700 min-w-[140px]"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={currencyFilter}
                onChange={(e) => setCurrencyFilter(e.target.value)}
                className="px-5 py-4 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all font-semibold text-slate-700 min-w-[120px]"
              >
                <option value="all">All Currency</option>
                <option value="KES">KES</option>
                <option value="USD">USD</option>
              </select>
            </div>

            {/* Create Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 text-white hover:from-blue-700 hover:via-cyan-700 hover:to-blue-700 transition-all font-bold text-sm flex items-center gap-3 justify-center shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 bg-[length:200%_100%] bg-left hover:bg-right"
              style={{
                backgroundPosition: "left",
                transition: "all 0.3s ease",
              }}
            >
              <Plus className="w-5 h-5" />
              <span>Create Invoice</span>
              <Sparkles className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* Premium Invoices Grid/Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white shadow-xl overflow-hidden border-2 border-slate-200"
        >
          {filteredInvoices.length === 0 ? (
            <div className="p-20 text-center">
              <div className="inline-block p-6 bg-slate-100 mb-4">
                <FileText className="w-16 h-16 text-slate-400 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                No Invoices Found
              </h3>
              <p className="text-slate-600 mb-6">
                Create your first invoice to get started
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Invoice
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-300">
                    <th className="px-6 py-5 text-left text-xs font-black text-slate-700 uppercase tracking-wider">
                      Invoice
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-black text-slate-700 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-black text-slate-700 uppercase tracking-wider">
                      Issue Date
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-black text-slate-700 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-black text-slate-700 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-black text-slate-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-black text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInvoices.map((invoice, index) => (
                    <motion.tr
                      key={invoice.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      whileHover={{
                        backgroundColor: "rgba(241, 245, 249, 0.5)",
                      }}
                      className="group cursor-pointer transition-all"
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Hash className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">
                              {invoice.invoiceNumber}
                            </div>
                            <div className="text-xs text-slate-500">
                              {new Date(invoice.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-semibold text-slate-900">
                          {invoice.clientName}
                        </div>
                        <div className="text-sm text-slate-600 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {invoice.clientEmail}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-slate-700">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {new Date(invoice.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-slate-700">
                          <Clock className="w-4 h-4 text-slate-400" />
                          {new Date(invoice.dueDate).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" }
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="font-bold text-lg text-slate-900">
                          {invoice.currency} {invoice.total.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-500">
                          {invoice.items.length} item
                          {invoice.items.length !== 1 ? "s" : ""}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-lg ${
                            invoice.status === "paid"
                              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                              : invoice.status === "sent"
                              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                              : invoice.status === "overdue"
                              ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                              : invoice.status === "cancelled"
                              ? "bg-gradient-to-r from-slate-500 to-slate-600 text-white"
                              : "bg-gradient-to-r from-amber-500 to-amber-600 text-white"
                          }`}
                        >
                          {invoice.status === "paid" && (
                            <CheckCircle className="w-3 h-3" />
                          )}
                          {invoice.status === "sent" && (
                            <Send className="w-3 h-3" />
                          )}
                          {invoice.status === "overdue" && (
                            <AlertCircle className="w-3 h-3" />
                          )}
                          {invoice.status === "draft" && (
                            <Edit3 className="w-3 h-3" />
                          )}
                          {invoice.status === "cancelled" && (
                            <XCircle className="w-3 h-3" />
                          )}
                          {invoice.status}
                        </motion.span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setShowViewModal(true);
                            }}
                            className="p-3 text-blue-600 hover:bg-blue-50 transition-all border-2 border-transparent hover:border-blue-200"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setShowTemplateSelector(true);
                            }}
                            className="p-3 text-emerald-600 hover:bg-emerald-50 transition-all border-2 border-transparent hover:border-emerald-200"
                            title="Download PDF"
                          >
                            <Download className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              const newInvoice = {
                                ...invoice,
                                id: Date.now().toString(),
                                invoiceNumber: `INV-${new Date().getFullYear()}-${String(
                                  invoices.length + 1
                                ).padStart(3, "0")}`,
                                status: "draft" as const,
                              };
                              setInvoices([newInvoice, ...invoices]);
                              toast.success("Invoice duplicated!");
                            }}
                            className="p-3 text-purple-600 hover:bg-purple-50 transition-all border-2 border-transparent hover:border-purple-200"
                            title="Duplicate"
                          >
                            <Copy className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              if (
                                confirm(
                                  `Are you sure you want to delete ${invoice.invoiceNumber}?`
                                )
                              ) {
                                setInvoices(
                                  invoices.filter((i) => i.id !== invoice.id)
                                );
                                toast.success("Invoice deleted");
                              }
                            }}
                            className="p-3 text-red-600 hover:bg-red-50 transition-all border-2 border-transparent hover:border-red-200"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* Create Invoice Modal - Premium */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl border-4 border-blue-200"
            >
              {/* Premium Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 p-8 z-10 border-b-4 border-blue-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-white/20 backdrop-blur-xl border-2 border-white/30">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">
                        Create New Invoice
                      </h2>
                      <p className="text-blue-100 text-sm mt-1">
                        Build a professional invoice with our premium templates
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowCreateModal(false)}
                    className="text-white hover:bg-white/20 p-3 transition-all border-2 border-white/30"
                  >
                    <X className="w-7 h-7" />
                  </motion.button>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[calc(95vh-140px)] p-8 space-y-8 bg-gradient-to-br from-slate-50 to-blue-50/30">
                {/* Client Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">
                      Client Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">
                        Client Name *
                      </label>
                      <input
                        type="text"
                        value={formData.clientName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            clientName: e.target.value,
                          })
                        }
                        className="w-full px-5 py-4 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all text-slate-900 font-medium text-lg"
                        placeholder="John Doe Enterprises"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.clientEmail}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            clientEmail: e.target.value,
                          })
                        }
                        className="w-full px-5 py-4 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all text-slate-900 font-medium text-lg"
                        placeholder="client@company.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.clientPhone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            clientPhone: e.target.value,
                          })
                        }
                        className="w-full px-5 py-4 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all text-slate-900 font-medium text-lg"
                        placeholder="+254 700 000 000"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">
                        Address
                      </label>
                      <input
                        type="text"
                        value={formData.clientAddress}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            clientAddress: e.target.value,
                          })
                        }
                        className="w-full px-5 py-4 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all text-slate-900 font-medium text-lg"
                        placeholder="Nairobi, Kenya"
                      />
                    </div>
                  </div>
                </div>

                {/* Invoice Details */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">
                      Invoice Details
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">
                        Invoice Date *
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        className="w-full px-5 py-4 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all text-slate-900 font-medium text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">
                        Due Date *
                      </label>
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) =>
                          setFormData({ ...formData, dueDate: e.target.value })
                        }
                        className="w-full px-5 py-4 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all text-slate-900 font-medium text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">
                        Currency *
                      </label>
                      <select
                        value={formData.currency}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            currency: e.target.value as "KES" | "USD",
                          })
                        }
                        className="w-full px-5 py-4 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all text-slate-900 font-bold text-lg"
                      >
                        <option value="KES">KES - Kenyan Shilling</option>
                        <option value="USD">USD - US Dollar</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Invoice Items */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
                        <ShoppingCart className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800">
                        Line Items
                      </h3>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addInvoiceItem}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 transition-all font-bold flex items-center gap-2 shadow-lg"
                    >
                      <Plus className="w-5 h-5" />
                      Add Line Item
                    </motion.button>
                  </div>

                  <div className="space-y-4">
                    {formData.items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="grid grid-cols-12 gap-4 p-6 bg-white border-2 border-slate-200 hover:border-blue-300 transition-all shadow-md"
                      >
                        <div className="col-span-12 md:col-span-5">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) =>
                              updateInvoiceItem(
                                item.id,
                                "description",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all text-slate-900 font-medium"
                            placeholder="Item description..."
                          />
                        </div>
                        <div className="col-span-4 md:col-span-2">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateInvoiceItem(
                                item.id,
                                "quantity",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all text-slate-900 font-bold text-center"
                            placeholder="Qty"
                            min="1"
                          />
                        </div>
                        <div className="col-span-4 md:col-span-2">
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) =>
                              updateInvoiceItem(
                                item.id,
                                "unitPrice",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all text-slate-900 font-bold text-right"
                            placeholder="Price"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div className="col-span-3 md:col-span-2">
                          <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 text-blue-700 font-bold text-lg text-right">
                            {item.amount.toLocaleString()}
                          </div>
                        </div>
                        <div className="col-span-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeInvoiceItem(item.id)}
                            className="w-full h-full text-red-600 hover:bg-red-50 transition-all border-2 border-transparent hover:border-red-200 flex items-center justify-center"
                            disabled={formData.items.length === 1}
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Calculations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left - Tax & Discount */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800">
                        Adjustments
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">
                          Tax Rate (%)
                        </label>
                        <input
                          type="number"
                          value={formData.tax}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              tax: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-5 py-4 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all text-slate-900 font-bold text-lg"
                          placeholder="0"
                          min="0"
                          max="100"
                          step="0.01"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">
                          Discount Amount
                        </label>
                        <input
                          type="number"
                          value={formData.discount}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              discount: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-5 py-4 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all text-slate-900 font-bold text-lg"
                          placeholder="0"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right - Totals */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                        <Receipt className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800">
                        Summary
                      </h3>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 p-8 border-2 border-blue-300 shadow-xl">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b-2 border-blue-200">
                          <span className="text-lg font-semibold text-slate-700">
                            Subtotal:
                          </span>
                          <span className="text-xl font-bold text-slate-900">
                            {formData.currency} {subtotal.toLocaleString()}
                          </span>
                        </div>
                        {formData.tax > 0 && (
                          <div className="flex justify-between items-center pb-2 border-b-2 border-blue-200">
                            <span className="text-lg font-semibold text-slate-700">
                              Tax ({formData.tax}%):
                            </span>
                            <span className="text-xl font-bold text-blue-700">
                              {formData.currency} {taxAmount.toLocaleString()}
                            </span>
                          </div>
                        )}
                        {formData.discount > 0 && (
                          <div className="flex justify-between items-center pb-2 border-b-2 border-blue-200">
                            <span className="text-lg font-semibold text-slate-700">
                              Discount:
                            </span>
                            <span className="text-xl font-bold text-red-600">
                              -{formData.currency}{" "}
                              {formData.discount.toLocaleString()}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center pt-4 border-t-4 border-blue-400">
                          <span className="text-2xl font-bold text-slate-900">
                            TOTAL:
                          </span>
                          <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            {formData.currency} {total.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-gray-700 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">
                      Notes & Terms
                    </h3>
                  </div>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="w-full px-5 py-4 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all text-slate-900 font-medium"
                    rows={4}
                    placeholder="Thank you for your business! Payment is due within 30 days."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t-4 border-slate-200">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-8 py-5 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 transition-all font-bold text-lg"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateInvoice}
                    className="flex-1 px-8 py-5 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 text-white hover:from-blue-700 hover:via-cyan-700 hover:to-blue-700 transition-all font-bold text-lg flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/50"
                  >
                    <Sparkles className="w-6 h-6" />
                    Create Invoice
                    <ArrowRight className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Template Selector Modal - Ultra Premium */}
      <AnimatePresence>
        {showTemplateSelector && selectedInvoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50 p-4"
            onClick={() => setShowTemplateSelector(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-7xl max-h-[95vh] overflow-hidden shadow-2xl border-4 border-purple-200"
            >
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-8 border-b-4 border-purple-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="p-4 bg-white/20 backdrop-blur-xl border-2 border-white/30"
                    >
                      <LayoutTemplate className="w-10 h-10 text-white" />
                    </motion.div>
                    <div>
                      <h2 className="text-4xl font-bold text-white mb-2">
                        Choose Your Template
                      </h2>
                      <p className="text-purple-100 text-lg">
                        Select a premium design for{" "}
                        {selectedInvoice.invoiceNumber}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowTemplateSelector(false)}
                    className="text-white hover:bg-white/20 p-3 transition-all border-2 border-white/30"
                  >
                    <X className="w-7 h-7" />
                  </motion.button>
                </div>
              </div>

              <div className="p-8 overflow-y-auto max-h-[calc(95vh-160px)] bg-gradient-to-br from-slate-50 to-purple-50/30">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {INVOICE_TEMPLATES.map((template, index) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05, y: -10 }}
                      onClick={() => {
                        setSelectedTemplate(template.id);
                        exportToPDF(selectedInvoice);
                        setShowTemplateSelector(false);
                      }}
                      className="cursor-pointer border-4 border-slate-200 hover:border-purple-400 transition-all overflow-hidden group shadow-xl hover:shadow-2xl"
                    >
                      <div
                        className={`h-48 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br ${template.gradient}`}
                      >
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all" />
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute top-4 right-4"
                        >
                          <Star className="w-8 h-8 text-white/30" />
                        </motion.div>
                        <Sparkles className="w-16 h-16 text-white mb-4 opacity-80 group-hover:opacity-100 transition-opacity" />
                        <div className="w-full px-4 space-y-2">
                          <div className="h-3 bg-white/30 w-3/4" />
                          <div className="h-2 bg-white/20 w-1/2" />
                          <div className="h-2 bg-white/20 w-2/3" />
                        </div>
                      </div>
                      <div className="p-5 bg-white group-hover:bg-gradient-to-br group-hover:from-purple-50 group-hover:to-pink-50 transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-lg text-slate-900">
                            {template.name}
                          </h3>
                          <Download className="w-5 h-5 text-slate-400 group-hover:text-purple-600 transition-colors" />
                        </div>
                        <p className="text-sm text-slate-600 mb-3">
                          {template.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6"
                            style={{ backgroundColor: template.color }}
                          />
                          <span className="text-xs font-mono text-slate-500">
                            {template.color}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Company Settings Modal - Premium */}
      <AnimatePresence>
        {showCompanySettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setShowCompanySettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-3xl shadow-2xl border-4 border-blue-200"
            >
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8 border-b-4 border-blue-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-white/20 backdrop-blur-xl border-2 border-white/30">
                      <Building className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">
                        Company Information
                      </h2>
                      <p className="text-blue-100 mt-1">
                        Configure your business details for invoices
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowCompanySettings(false)}
                    className="text-white hover:bg-white/20 p-3 transition-all border-2 border-white/30"
                  >
                    <X className="w-7 h-7" />
                  </motion.button>
                </div>
              </div>

              <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50/30">
                {/* Logo Upload */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">
                    Company Logo
                  </label>
                  <div className="flex items-center gap-6">
                    {companyInfo.logo ? (
                      <div className="w-40 h-40 border-4 border-blue-200 flex items-center justify-center overflow-hidden bg-white shadow-xl">
                        <img
                          src={companyInfo.logo}
                          alt="Logo"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-40 h-40 border-4 border-dashed border-slate-300 flex items-center justify-center bg-slate-50">
                        <ImageIcon className="w-16 h-16 text-slate-300" />
                      </div>
                    )}
                    <div className="flex-1 space-y-3">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 transition-all font-bold inline-flex items-center gap-3 shadow-xl"
                        >
                          <Upload className="w-5 h-5" />
                          Upload Logo
                        </motion.div>
                      </label>
                      <p className="text-sm text-slate-600">
                        <strong>Recommended:</strong> PNG or JPG, max 5MB
                        <br />
                        <strong>Size:</strong> 500x500px for best results
                      </p>
                    </div>
                  </div>
                </div>

                {/* Company Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      label: "Company Name",
                      field: "name",
                      type: "text",
                      icon: Building,
                    },
                    {
                      label: "Tax ID / KRA PIN",
                      field: "taxId",
                      type: "text",
                      icon: Hash,
                    },
                    {
                      label: "Email Address",
                      field: "email",
                      type: "email",
                      icon: Mail,
                    },
                    {
                      label: "Phone Number",
                      field: "phone",
                      type: "tel",
                      icon: Phone,
                    },
                    {
                      label: "Website",
                      field: "website",
                      type: "text",
                      icon: Building,
                    },
                    {
                      label: "Address",
                      field: "address",
                      type: "text",
                      icon: Building,
                    },
                  ].map((field) => (
                    <div key={field.field} className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                        <field.icon className="w-4 h-4" />
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        value={companyInfo[field.field as keyof CompanyInfo]}
                        onChange={(e) =>
                          setCompanyInfo({
                            ...companyInfo,
                            [field.field]: e.target.value,
                          })
                        }
                        className="w-full px-5 py-4 border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all text-slate-900 font-medium text-lg"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 pt-6 border-t-4 border-slate-200">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCompanySettings(false)}
                    className="flex-1 px-8 py-5 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 transition-all font-bold text-lg"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowCompanySettings(false);
                      toast.success("✨ Company information saved!", {
                        description:
                          "Your settings have been updated successfully",
                      });
                    }}
                    className="flex-1 px-8 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 transition-all font-bold text-lg flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/50"
                  >
                    <Save className="w-6 h-6" />
                    Save Changes
                    <CheckCircle className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
