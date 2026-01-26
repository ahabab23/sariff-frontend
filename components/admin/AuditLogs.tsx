import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Activity,
} from "lucide-react";

export function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const logs = [
    {
      id: 1,
      timestamp: "2026-01-07 14:32:15",
      user: "Jane Muthoni",
      role: "Office Manager",
      office: "Nairobi Central",
      action: "Created new client account",
      details: "Client: John Kamau (CL-2024-145)",
      type: "create",
      ip: "196.201.214.123",
    },
    {
      id: 2,
      timestamp: "2026-01-07 14:15:42",
      user: "System Admin",
      role: "Super Admin",
      office: "Platform",
      action: "Updated exchange rates",
      details: "USD/KES: 130.50 → 131.00",
      type: "update",
      ip: "196.201.214.100",
    },
    {
      id: 3,
      timestamp: "2026-01-07 13:58:22",
      user: "John Omondi",
      role: "Office Manager",
      office: "Mombasa Branch",
      action: "Processed debit transaction",
      details: "Amount: KES 65,000 | Method: Cash",
      type: "transaction",
      ip: "196.201.215.88",
    },
    {
      id: 4,
      timestamp: "2026-01-07 13:45:11",
      user: "Sarah Atieno",
      role: "Office Manager",
      office: "Kisumu Office",
      action: "Reconciliation completed",
      details: "M-Pesa Account - All matched",
      type: "reconciliation",
      ip: "196.201.216.45",
    },
    {
      id: 5,
      timestamp: "2026-01-07 12:30:05",
      user: "System Admin",
      role: "Super Admin",
      office: "Platform",
      action: "Office suspended",
      details: "Office: Nakuru Branch - Compliance review",
      type: "admin",
      ip: "196.201.214.100",
    },
    {
      id: 6,
      timestamp: "2026-01-07 11:22:33",
      user: "Grace Chebet",
      role: "Office Manager",
      office: "Eldoret Office",
      action: "Generated invoice",
      details: "Invoice #INV-2024-0892",
      type: "invoice",
      ip: "196.201.217.92",
    },
    {
      id: 7,
      timestamp: "2026-01-07 10:15:18",
      user: "Peter Kipchoge",
      role: "Office Manager",
      office: "Nakuru Branch",
      action: "Failed login attempt",
      details: "Invalid password (3 attempts)",
      type: "security",
      ip: "196.201.218.71",
    },
    {
      id: 8,
      timestamp: "2026-01-07 09:42:50",
      user: "Jane Muthoni",
      role: "Office Manager",
      office: "Nairobi Central",
      action: "Exported report",
      details: "Daily transactions report (PDF)",
      type: "report",
      ip: "196.201.214.123",
    },
  ];

  const getActionColor = (type: string) => {
    switch (type) {
      case "create":
        return "bg-emerald-100 text-emerald-700";
      case "update":
        return "bg-blue-100 text-blue-700";
      case "transaction":
        return "bg-purple-100 text-purple-700";
      case "reconciliation":
        return "bg-cyan-100 text-cyan-700";
      case "admin":
        return "bg-indigo-100 text-indigo-700";
      case "invoice":
        return "bg-amber-100 text-amber-700";
      case "security":
        return "bg-red-100 text-red-700";
      case "report":
        return "bg-teal-100 text-teal-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.office.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === "all" || log.type === filterType;

    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1>Audit Logs</h1>
          <p className="text-slate-600 mt-1">
            Monitor all system activities and user actions
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all">
          <Download className="w-5 h-5" />
          Export Logs
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Actions</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="transaction">Transactions</option>
              <option value="reconciliation">Reconciliation</option>
              <option value="admin">Admin Actions</option>
              <option value="security">Security</option>
            </select>
          </div>

          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="date"
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              defaultValue="2026-01-07"
            />
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-hover table-zebra">
            <thead className="bg-slate-50 sticky top-0">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Office
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="cursor-pointer">
                  <td className="px-6 py-4 text-sm text-slate-900">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      <div>
                        <div className="font-medium text-slate-900">
                          {log.user}
                        </div>
                        <div className="text-xs text-slate-500">{log.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {log.office}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getActionColor(
                        log.type
                      )}`}
                    >
                      <Activity className="w-3 h-3" />
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {log.details}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                    {log.ip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
