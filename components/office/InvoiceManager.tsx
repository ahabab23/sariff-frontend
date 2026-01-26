import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Plus,
  Download,
  Printer,
  Eye,
  Search,
  Calendar,
  DollarSign,
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Send,
  Edit,
  Trash2,
  Filter,
  X,
  Save,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  notes?: string;
  stampCode?: string;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

type TemplateType = "professional" | "modern" | "classic" | "minimal";

export function InvoiceManager() {
  const [view, setView] = useState<"list" | "create" | "preview">("list");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "draft" | "sent" | "paid" | "overdue" | "cancelled"
  >("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateType>("professional");
  const [loading, setLoading] = useState(false);

  // New Invoice Form State
  const [formData, setFormData] = useState({
    clientId: "",
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    currency: "KES",
    notes: "",
    items: [
      { description: "", quantity: 1, rate: 0, amount: 0 },
    ] as InvoiceItem[],
  });

  useEffect(() => {
    fetchInvoices();
    fetchClients();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      // For demo, using mock data - in production, fetch from backend
      const mockInvoices: Invoice[] = [
        {
          id: "1",
          invoiceNumber: "INV-2026-001",
          clientId: "client1",
          clientName: "John Kamau",
          date: "2026-01-07",
          dueDate: "2026-01-14",
          items: [
            {
              description: "USD to KES Exchange - $500",
              quantity: 1,
              rate: 65000,
              amount: 65000,
            },
          ],
          subtotal: 65000,
          tax: 0,
          total: 65000,
          currency: "KES",
          status: "paid",
          stampCode: "EST-2026-SARIF-001",
        },
        {
          id: "2",
          invoiceNumber: "INV-2026-002",
          clientId: "client2",
          clientName: "Sarah Wanjiku",
          date: "2026-01-08",
          dueDate: "2026-01-15",
          items: [
            {
              description: "Money Transfer Service",
              quantity: 1,
              rate: 25000,
              amount: 25000,
            },
          ],
          subtotal: 25000,
          tax: 0,
          total: 25000,
          currency: "KES",
          status: "sent",
          stampCode: "EST-2026-SARIF-002",
        },
        {
          id: "3",
          invoiceNumber: "INV-2026-003",
          clientId: "client3",
          clientName: "Michael Ochieng",
          date: "2026-01-05",
          dueDate: "2026-01-12",
          items: [
            {
              description: "KES to USD Exchange - 100,000 KES",
              quantity: 1,
              rate: 727.27,
              amount: 727.27,
            },
          ],
          subtotal: 727.27,
          tax: 0,
          total: 727.27,
          currency: "USD",
          status: "overdue",
          stampCode: "EST-2026-SARIF-003",
        },
      ];
      setInvoices(mockInvoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-32ed8237/accounts`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      const result = await response.json();
      if (result.success) {
        const clientAccounts = result.accounts.filter(
          (acc: any) => acc.type === "Client"
        );
        setClients(clientAccounts);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: invoices.length,
    draft: invoices.filter((i) => i.status === "draft").length,
    sent: invoices.filter((i) => i.status === "sent").length,
    paid: invoices.filter((i) => i.status === "paid").length,
    overdue: invoices.filter((i) => i.status === "overdue").length,
    totalRevenue: invoices
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + i.total, 0),
    pendingRevenue: invoices
      .filter((i) => i.status === "sent" || i.status === "overdue")
      .reduce((sum, i) => sum + i.total, 0),
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { description: "", quantity: 1, rate: 0, amount: 0 },
      ],
    });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: any
  ) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === "quantity" || field === "rate") {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }

    setFormData({ ...formData, items: newItems });
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0);
    const tax = 0; // Can be configured
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleCreateInvoice = () => {
    const { subtotal, tax, total } = calculateTotals();
    const selectedClient = clients.find((c) => c.id === formData.clientId);

    if (!selectedClient) {
      toast.error("Please select a client");
      return;
    }

    if (formData.items.some((item) => !item.description || item.rate === 0)) {
      toast.error("Please fill in all item details");
      return;
    }

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${String(invoices.length + 1).padStart(3, "0")}`,
      clientId: formData.clientId,
      clientName: selectedClient.name,
      date: formData.date,
      dueDate: formData.dueDate,
      items: formData.items,
      subtotal,
      tax,
      total,
      currency: formData.currency,
      status: "draft",
      notes: formData.notes,
      stampCode: `EST-2026-SARIF-${String(invoices.length + 1).padStart(
        3,
        "0"
      )}`,
    };

    setInvoices([newInvoice, ...invoices]);
    toast.success("Invoice created successfully!");
    setView("list");
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      clientId: "",
      date: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      currency: "KES",
      notes: "",
      items: [{ description: "", quantity: 1, rate: 0, amount: 0 }],
    });
  };

  const handlePreview = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setView("preview");
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-emerald-100 text-emerald-700";
      case "sent":
        return "bg-blue-100 text-blue-700";
      case "overdue":
        return "bg-red-100 text-red-700";
      case "draft":
        return "bg-slate-100 text-slate-700";
      case "cancelled":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-3 h-3" />;
      case "sent":
        return <Send className="w-3 h-3" />;
      case "overdue":
        return <AlertCircle className="w-3 h-3" />;
      case "draft":
        return <Edit className="w-3 h-3" />;
      case "cancelled":
        return <XCircle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  if (view === "create") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setView("list")}
              className="p-2 hover:bg-slate-100 transition-all"
            >
              <ArrowLeft className="w-6 h-6 text-slate-600" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Create New Invoice
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Fill in the details to generate an invoice
              </p>
            </div>
          </div>
        </div>

        {/* Invoice Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client & Date Info */}
            <div className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 p-6 shadow-lg">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Invoice Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Select Client *
                  </label>
                  <select
                    value={formData.clientId}
                    onChange={(e) =>
                      setFormData({ ...formData, clientId: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="">Choose a client...</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name} - {client.currency}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData({ ...formData, currency: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="KES">KES - Kenyan Shilling</option>
                    <option value="USD">USD - US Dollar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 outline-none bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Line Items</h3>
                <button
                  onClick={handleAddItem}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>

              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-3 items-start pb-4 border-b border-slate-200 last:border-0"
                  >
                    <div className="col-span-5">
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(index, "description", e.target.value)
                        }
                        placeholder="Item description..."
                        className="w-full px-3 py-2 border-2 border-slate-200 focus:border-blue-500 outline-none text-sm bg-white"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Qty
                      </label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "quantity",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        min="1"
                        className="w-full px-3 py-2 border-2 border-slate-200 focus:border-blue-500 outline-none text-sm bg-white"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Rate
                      </label>
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "rate",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        step="0.01"
                        className="w-full px-3 py-2 border-2 border-slate-200 focus:border-blue-500 outline-none text-sm bg-white"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Amount
                      </label>
                      <div className="px-3 py-2 bg-slate-100 border-2 border-slate-200 text-sm font-bold">
                        {item.amount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                    <div className="col-span-1 flex items-end">
                      {formData.items.length > 1 && (
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="p-2 text-red-600 hover:bg-red-50 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 p-6 shadow-lg">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Additional Notes
              </h3>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Add any additional notes or payment terms..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 outline-none bg-white"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 p-6 shadow-lg sticky top-4">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Invoice Summary
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-700">Subtotal:</span>
                  <span className="font-bold text-slate-900">
                    {formData.currency}{" "}
                    {calculateTotals().subtotal.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-700">Tax:</span>
                  <span className="font-bold text-slate-900">
                    {formData.currency}{" "}
                    {calculateTotals().tax.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="border-t-2 border-blue-300 pt-3 flex justify-between">
                  <span className="font-bold text-slate-900">Total:</span>
                  <span className="text-2xl font-bold text-blue-700">
                    {formData.currency}{" "}
                    {calculateTotals().total.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCreateInvoice}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Create Invoice
                </button>
                <button
                  onClick={() => setView("list")}
                  className="w-full px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (view === "preview" && selectedInvoice) {
    return (
      <InvoicePreview
        invoice={selectedInvoice}
        template={selectedTemplate}
        onBack={() => setView("list")}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Invoice Manager</h2>
          <p className="text-sm text-slate-600 mt-1">
            Create, manage, and track all your invoices
          </p>
        </div>
        <button
          onClick={() => setView("create")}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Create Invoice
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-bold text-emerald-700 uppercase">
              Paid
            </span>
          </div>
          <div className="text-3xl font-bold text-emerald-700 mb-1">
            {stats.paid}
          </div>
          <div className="text-sm text-slate-600">
            KES {stats.totalRevenue.toLocaleString()}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-600 flex items-center justify-center">
              <Send className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-bold text-blue-700 uppercase">
              Sent
            </span>
          </div>
          <div className="text-3xl font-bold text-blue-700 mb-1">
            {stats.sent}
          </div>
          <div className="text-sm text-slate-600">Awaiting payment</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-red-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-bold text-red-700 uppercase">
              Overdue
            </span>
          </div>
          <div className="text-3xl font-bold text-red-700 mb-1">
            {stats.overdue}
          </div>
          <div className="text-sm text-slate-600">Requires attention</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-bold text-purple-700 uppercase">
              Pending
            </span>
          </div>
          <div className="text-3xl font-bold text-purple-700 mb-1">
            {stats.pendingRevenue.toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })}
          </div>
          <div className="text-sm text-slate-600">Total pending (KES)</div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Search Invoices
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by invoice number or client name..."
                className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-4 py-3 border-2 border-slate-200 focus:border-blue-500 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 shadow-lg overflow-hidden">
        <div className="p-6 border-b-2 border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">
            All Invoices ({filteredInvoices.length})
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600">Loading invoices...</p>
            </div>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FileText className="w-16 h-16 text-slate-300 mb-4" />
            <p className="text-lg font-medium text-slate-600">
              No invoices found
            </p>
            <p className="text-sm text-slate-500">
              Create your first invoice to get started
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-200">
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-900">
                        {invoice.invoiceNumber}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        {invoice.stampCode}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                      {invoice.clientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {new Date(invoice.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {new Date(invoice.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-bold text-slate-900">
                        {invoice.currency}{" "}
                        {invoice.total.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold uppercase ${getStatusColor(
                          invoice.status
                        )}`}
                      >
                        {getStatusIcon(invoice.status)}
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handlePreview(invoice)}
                          className="p-2 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toast.success("Downloading PDF...")}
                          className="p-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-all"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            toast.info("Email feature coming soon")
                          }
                          className="p-2 bg-purple-100 text-purple-700 hover:bg-purple-200 transition-all"
                          title="Send Email"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Invoice Preview Component with Templates
function InvoicePreview({
  invoice,
  template,
  onBack,
}: {
  invoice: Invoice;
  template: TemplateType;
  onBack: () => void;
}) {
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateType>(template);

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Invoice Preview
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {invoice.invoiceNumber}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <select
            value={selectedTemplate}
            onChange={(e) =>
              setSelectedTemplate(e.target.value as TemplateType)
            }
            className="px-4 py-2 border-2 border-slate-200 focus:border-blue-500 outline-none"
          >
            <option value="professional">Professional</option>
            <option value="modern">Modern</option>
            <option value="classic">Classic</option>
            <option value="minimal">Minimal</option>
          </select>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all font-bold text-slate-700"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>

          <button
            onClick={() => toast.success("Downloading PDF...")}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold hover:shadow-lg transition-all"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Invoice Template */}
      {selectedTemplate === "professional" && (
        <ProfessionalTemplate invoice={invoice} />
      )}
      {selectedTemplate === "modern" && <ModernTemplate invoice={invoice} />}
      {selectedTemplate === "classic" && <ClassicTemplate invoice={invoice} />}
      {selectedTemplate === "minimal" && <MinimalTemplate invoice={invoice} />}
    </motion.div>
  );
}

// Professional Template
function ProfessionalTemplate({ invoice }: { invoice: Invoice }) {
  return (
    <div className="bg-white shadow-2xl max-w-4xl mx-auto p-12 print:shadow-none">
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            INVOICE
          </h1>
          <div className="text-slate-600">
            <p className="font-bold text-lg">Sarif Money Exchange</p>
            <p className="text-sm">Nairobi Central Branch</p>
          </div>
        </div>
        <div className="text-right">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 mb-4">
            <p className="text-xs uppercase tracking-wider">Invoice Number</p>
            <p className="text-2xl font-bold">{invoice.invoiceNumber}</p>
          </div>
          <div className="text-sm text-slate-600">
            <p>
              <strong>Date:</strong>{" "}
              {new Date(invoice.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p>
              <strong>Due Date:</strong>{" "}
              {new Date(invoice.dueDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-2 gap-8 mb-12">
        <div className="bg-slate-50 p-6">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            From
          </p>
          <p className="font-bold text-slate-900">Sarif Money Exchange Ltd.</p>
          <p className="text-sm text-slate-600">Kimathi Street, Nairobi</p>
          <p className="text-sm text-slate-600">P.O. Box 12345-00100</p>
          <p className="text-sm text-slate-600">Nairobi, Kenya</p>
          <p className="text-sm text-slate-600 mt-2">
            <strong>PIN:</strong> P051234567X
          </p>
          <p className="text-sm text-slate-600">
            <strong>Email:</strong> billing@sarif.com
          </p>
        </div>

        <div className="bg-blue-50 p-6">
          <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3">
            Bill To
          </p>
          <p className="font-bold text-slate-900">{invoice.clientName}</p>
          <p className="text-sm text-slate-600">
            Client ID: {invoice.clientId}
          </p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-12">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
              <th className="px-6 py-4 text-left text-sm font-bold uppercase">
                Description
              </th>
              <th className="px-6 py-4 text-center text-sm font-bold uppercase">
                Qty
              </th>
              <th className="px-6 py-4 text-right text-sm font-bold uppercase">
                Rate
              </th>
              <th className="px-6 py-4 text-right text-sm font-bold uppercase">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} className="border-b border-slate-200">
                <td className="px-6 py-4 text-slate-900">{item.description}</td>
                <td className="px-6 py-4 text-center text-slate-600">
                  {item.quantity}
                </td>
                <td className="px-6 py-4 text-right text-slate-600">
                  {invoice.currency}{" "}
                  {item.rate.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="px-6 py-4 text-right font-bold text-slate-900">
                  {invoice.currency}{" "}
                  {item.amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-300">
              <td
                colSpan={3}
                className="px-6 py-4 text-right font-bold text-slate-700"
              >
                Subtotal:
              </td>
              <td className="px-6 py-4 text-right font-bold text-slate-900">
                {invoice.currency}{" "}
                {invoice.subtotal.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </td>
            </tr>
            <tr>
              <td
                colSpan={3}
                className="px-6 py-4 text-right font-bold text-slate-700"
              >
                Tax:
              </td>
              <td className="px-6 py-4 text-right font-bold text-slate-900">
                {invoice.currency}{" "}
                {invoice.tax.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </td>
            </tr>
            <tr className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
              <td
                colSpan={3}
                className="px-6 py-4 text-right font-bold text-lg"
              >
                TOTAL:
              </td>
              <td className="px-6 py-4 text-right font-bold text-2xl">
                {invoice.currency}{" "}
                {invoice.total.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Electronic Stamp */}
      <div className="bg-slate-50 p-6 mb-8">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Electronic Tax Stamp
        </p>
        <p className="font-mono text-lg font-bold text-slate-900">
          {invoice.stampCode}
        </p>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="mb-8">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Notes
          </p>
          <p className="text-sm text-slate-600">{invoice.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="text-center border-t-2 border-slate-200 pt-6">
        <p className="text-slate-600 font-medium">
          Thank you for your business!
        </p>
        <p className="text-sm text-slate-500 mt-2">
          For any questions, please contact us at support@sarif.com or +254 700
          123 456
        </p>
      </div>
    </div>
  );
}

// Modern Template
function ModernTemplate({ invoice }: { invoice: Invoice }) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-8 print:bg-white">
      <div className="bg-white shadow-2xl max-w-4xl mx-auto overflow-hidden print:shadow-none">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-12 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-6xl font-black mb-4">INVOICE</h1>
              <p className="text-xl font-bold">Sarif Money Exchange</p>
            </div>
            <div className="text-right bg-white/10 backdrop-blur-xl px-6 py-4">
              <p className="text-sm uppercase tracking-wider mb-1">Invoice #</p>
              <p className="text-3xl font-bold">{invoice.invoiceNumber}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-12">
          {/* Dates */}
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div>
              <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2">
                Invoice Date
              </p>
              <p className="text-lg font-bold text-slate-900">
                {new Date(invoice.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-pink-600 uppercase tracking-wider mb-2">
                Due Date
              </p>
              <p className="text-lg font-bold text-slate-900">
                {new Date(invoice.dueDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Client */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 mb-12">
            <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2">
              Billed To
            </p>
            <p className="text-2xl font-bold text-slate-900">
              {invoice.clientName}
            </p>
            <p className="text-slate-600">Client ID: {invoice.clientId}</p>
          </div>

          {/* Items */}
          <div className="mb-12">
            {invoice.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-4 border-b border-slate-200"
              >
                <div className="flex-1">
                  <p className="font-bold text-slate-900">{item.description}</p>
                  <p className="text-sm text-slate-600">
                    {item.quantity} × {invoice.currency}{" "}
                    {item.rate.toLocaleString()}
                  </p>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {invoice.currency}{" "}
                  {item.amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-8 text-white">
            <div className="flex justify-between items-center">
              <p className="text-2xl font-bold">TOTAL AMOUNT DUE</p>
              <p className="text-5xl font-black">
                {invoice.currency}{" "}
                {invoice.total.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>

          {/* Stamp */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
              Electronic Stamp
            </p>
            <p className="font-mono text-sm font-bold text-slate-900">
              {invoice.stampCode}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Classic Template
function ClassicTemplate({ invoice }: { invoice: Invoice }) {
  return (
    <div className="bg-white shadow-2xl max-w-4xl mx-auto p-12 border-8 border-slate-900 print:shadow-none print:border-4">
      {/* Header */}
      <div className="text-center mb-12 pb-8 border-b-4 border-slate-900">
        <h1 className="text-6xl font-serif font-black text-slate-900 mb-4">
          INVOICE
        </h1>
        <p className="text-xl font-serif text-slate-700">
          Sarif Money Exchange Limited
        </p>
        <p className="text-sm text-slate-600 mt-2">Established 2020</p>
      </div>

      {/* Invoice Info */}
      <div className="grid grid-cols-2 gap-12 mb-12">
        <div>
          <p className="font-serif font-bold text-slate-900 mb-4">
            Invoice Details:
          </p>
          <p className="text-slate-700">
            <strong>Number:</strong> {invoice.invoiceNumber}
          </p>
          <p className="text-slate-700">
            <strong>Date:</strong>{" "}
            {new Date(invoice.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <p className="text-slate-700">
            <strong>Due:</strong>{" "}
            {new Date(invoice.dueDate).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        <div>
          <p className="font-serif font-bold text-slate-900 mb-4">Bill To:</p>
          <p className="text-lg font-bold text-slate-900">
            {invoice.clientName}
          </p>
          <p className="text-slate-700">Client ID: {invoice.clientId}</p>
        </div>
      </div>

      {/* Items */}
      <table className="w-full mb-12 border-4 border-slate-900">
        <thead>
          <tr className="bg-slate-900 text-white">
            <th className="px-6 py-4 text-left font-serif">Description</th>
            <th className="px-6 py-4 text-center font-serif">Quantity</th>
            <th className="px-6 py-4 text-right font-serif">Rate</th>
            <th className="px-6 py-4 text-right font-serif">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index} className="border-b-2 border-slate-300">
              <td className="px-6 py-4 text-slate-900">{item.description}</td>
              <td className="px-6 py-4 text-center text-slate-700">
                {item.quantity}
              </td>
              <td className="px-6 py-4 text-right text-slate-700">
                {invoice.currency}{" "}
                {item.rate.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </td>
              <td className="px-6 py-4 text-right font-bold text-slate-900">
                {invoice.currency}{" "}
                {item.amount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-slate-900 text-white">
            <td
              colSpan={3}
              className="px-6 py-4 text-right font-serif font-bold text-xl"
            >
              TOTAL:
            </td>
            <td className="px-6 py-4 text-right font-serif font-bold text-2xl">
              {invoice.currency}{" "}
              {invoice.total.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Stamp */}
      <div className="border-4 border-slate-900 p-6 text-center mb-8">
        <p className="font-serif font-bold text-slate-900 mb-2">
          Electronic Tax Stamp
        </p>
        <p className="font-mono text-lg font-bold">{invoice.stampCode}</p>
      </div>

      {/* Footer */}
      <div className="text-center border-t-4 border-slate-900 pt-6">
        <p className="font-serif text-slate-700">
          Thank you for your patronage
        </p>
      </div>
    </div>
  );
}

// Minimal Template
function MinimalTemplate({ invoice }: { invoice: Invoice }) {
  return (
    <div className="bg-white max-w-4xl mx-auto p-12">
      {/* Header */}
      <div className="flex justify-between items-start mb-16">
        <div>
          <h1 className="text-8xl font-thin text-slate-900 mb-2">Invoice</h1>
          <p className="text-sm text-slate-500">{invoice.invoiceNumber}</p>
        </div>
        <div className="text-right text-sm text-slate-600">
          <p>
            {new Date(invoice.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Client */}
      <div className="mb-16">
        <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">
          To
        </p>
        <p className="text-2xl font-light text-slate-900">
          {invoice.clientName}
        </p>
      </div>

      {/* Items */}
      <div className="mb-16">
        {invoice.items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-start py-6 border-b border-slate-200"
          >
            <div className="flex-1">
              <p className="text-lg font-light text-slate-900">
                {item.description}
              </p>
              <p className="text-sm text-slate-400">
                {item.quantity} × {invoice.currency}{" "}
                {item.rate.toLocaleString()}
              </p>
            </div>
            <p className="text-xl font-light text-slate-900">
              {invoice.currency}{" "}
              {item.amount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center pb-8 border-b-2 border-slate-900 mb-16">
        <p className="text-sm text-slate-400 uppercase tracking-widest">
          Total
        </p>
        <p className="text-4xl font-light text-slate-900">
          {invoice.currency}{" "}
          {invoice.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </p>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-400">
        <p className="font-mono">{invoice.stampCode}</p>
      </div>
    </div>
  );
}
