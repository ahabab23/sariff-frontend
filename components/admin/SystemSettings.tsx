import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, FileText, Shield, Save } from "lucide-react";
import { toast } from "sonner";

export function SystemSettings() {
  const [currencies, setCurrencies] = useState(["KES", "USD"]);
  const [newCurrency, setNewCurrency] = useState("");

  const handleAddCurrency = () => {
    if (newCurrency && !currencies.includes(newCurrency)) {
      setCurrencies([...currencies, newCurrency]);
      setNewCurrency("");
      toast.success(`${newCurrency} added successfully!`);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-8">
        <h1>System Settings</h1>
        <p className="text-slate-600 mt-1">
          Configure platform-wide settings and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Supported Currencies */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3>Supported Currencies</h3>
              <p className="text-sm text-slate-600">
                Manage currencies available across all offices
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {currencies.map((currency) => (
                <div
                  key={currency}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl"
                >
                  <span className="font-semibold text-emerald-700">
                    {currency}
                  </span>
                  <button
                    onClick={() => {
                      setCurrencies(currencies.filter((c) => c !== currency));
                      toast.success(`${currency} removed`);
                    }}
                    className="text-emerald-600 hover:text-emerald-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                value={newCurrency}
                onChange={(e) => setNewCurrency(e.target.value.toUpperCase())}
                placeholder="Enter currency code (e.g., EUR)"
                className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                maxLength={3}
              />
              <button
                onClick={handleAddCurrency}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Add Currency
              </button>
            </div>
          </div>
        </div>

        {/* Exchange Rates */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3>Exchange Rate Settings</h3>
              <p className="text-sm text-slate-600">
                Configure default exchange rates and margins
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  USD to KES Buy Rate
                </label>
                <input
                  type="number"
                  defaultValue="130.50"
                  step="0.01"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  USD to KES Sell Rate
                </label>
                <input
                  type="number"
                  defaultValue="132.00"
                  step="0.01"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Margin %
                </label>
                <input
                  type="number"
                  defaultValue="1.15"
                  step="0.01"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Templates */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3>Invoice Templates</h3>
              <p className="text-sm text-slate-600">
                Manage invoice templates and electronic stamps
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                defaultValue="Sarif Exchange Ltd."
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tax ID / PIN
                </label>
                <input
                  type="text"
                  defaultValue="P051234567X"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Electronic Stamp Code
                </label>
                <input
                  type="text"
                  defaultValue="EST-2024-SARIF"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Invoice Footer Text
              </label>
              <textarea
                defaultValue="Thank you for choosing Sarif. For inquiries, contact support@sarif.com"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* System Rules */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3>System Rules & Limits</h3>
              <p className="text-sm text-slate-600">
                Configure transaction limits and security rules
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Max Daily Transaction (KES)
                </label>
                <input
                  type="number"
                  defaultValue="1000000"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Max Daily Transaction (USD)
                </label>
                <input
                  type="number"
                  defaultValue="10000"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  KYC Required Above (KES)
                </label>
                <input
                  type="number"
                  defaultValue="100000"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  defaultValue="30"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={() => toast.success("Settings saved successfully!")}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <Save className="w-5 h-5" />
            Save All Settings
          </button>
        </div>
      </div>
    </motion.div>
  );
}
