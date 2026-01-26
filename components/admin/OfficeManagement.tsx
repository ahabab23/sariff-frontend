import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Plus,
  Search,
  MoreVertical,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Users,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";

export function OfficeManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const offices = [
    {
      id: 1,
      name: "Nairobi Central",
      location: "Nairobi, Kenya",
      status: "active",
      manager: "Jane Muthoni",
      clients: 145,
      monthlyVolume: "KES 12.4M",
      lastActive: "2 minutes ago",
      performance: "+12.5%",
    },
    {
      id: 2,
      name: "Mombasa Branch",
      location: "Mombasa, Kenya",
      status: "active",
      manager: "John Omondi",
      clients: 98,
      monthlyVolume: "KES 8.2M",
      lastActive: "15 minutes ago",
      performance: "+8.3%",
    },
    {
      id: 3,
      name: "Kisumu Office",
      location: "Kisumu, Kenya",
      status: "active",
      manager: "Sarah Atieno",
      clients: 67,
      monthlyVolume: "KES 5.1M",
      lastActive: "1 hour ago",
      performance: "+15.2%",
    },
    {
      id: 4,
      name: "Nakuru Branch",
      location: "Nakuru, Kenya",
      status: "suspended",
      manager: "Peter Kipchoge",
      clients: 45,
      monthlyVolume: "KES 3.8M",
      lastActive: "5 days ago",
      performance: "-2.1%",
    },
    {
      id: 5,
      name: "Eldoret Office",
      location: "Eldoret, Kenya",
      status: "active",
      manager: "Grace Chebet",
      clients: 89,
      monthlyVolume: "KES 6.9M",
      lastActive: "30 minutes ago",
      performance: "+9.7%",
    },
  ];

  const filteredOffices = offices.filter(
    (office) =>
      office.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      office.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1>Office Management</h1>
          <p className="text-slate-600 mt-1">
            Manage and monitor all office branches
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          Create New Office
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search offices by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Office Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOffices.map((office) => (
          <motion.div
            key={office.id}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{office.name}</h3>
                    <p className="text-sm text-slate-600">{office.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      office.status === "active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {office.status === "active" ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                    {office.status}
                  </span>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                    <MoreVertical className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-purple-600" />
                    <p className="text-xs text-slate-600">Clients</p>
                  </div>
                  <p className="text-lg font-bold">{office.clients}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <p className="text-xs text-slate-600">Monthly Vol.</p>
                  </div>
                  <p className="text-lg font-bold">{office.monthlyVolume}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <p className="text-xs text-slate-600">Growth</p>
                  </div>
                  <p
                    className={`text-lg font-bold ${
                      office.performance.startsWith("+")
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {office.performance}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div>
                  <p className="text-xs text-slate-600">Manager</p>
                  <p className="text-sm font-medium">{office.manager}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-600">Last Active</p>
                  <p className="text-sm font-medium">{office.lastActive}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Office Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8"
          >
            <h2 className="text-2xl font-bold mb-6">Create New Office</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Office Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Nairobi Central"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Nairobi, Kenya"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Manager Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Manager full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Manager Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="manager@office.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Office Address
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="Full office address"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.success("Office created successfully!");
                    setShowCreateModal(false);
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Create Office
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
