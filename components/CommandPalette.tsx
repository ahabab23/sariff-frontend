import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Command,
  ArrowRight,
  Clock,
  Star,
  Settings,
  LogOut,
  Users,
  Building2,
  FileText,
  BarChart3,
  Plus,
  TrendingUp,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

interface Command {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
  keywords?: string[];
  shortcut?: string;
}

interface CommandPaletteProps {
  commands: Command[];
}

export function CommandPalette({ commands }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentCommands, setRecentCommands] = useState<string[]>([]);

  // Filter commands based on search
  const filteredCommands = commands.filter((cmd) => {
    const searchLower = search.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(searchLower) ||
      cmd.subtitle?.toLowerCase().includes(searchLower) ||
      cmd.keywords?.some((k) => k.toLowerCase().includes(searchLower))
    );
  });

  // Group by category
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, Command[]>);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }

      // Escape to close
      if (e.key === "Escape") {
        setIsOpen(false);
        setSearch("");
        setSelectedIndex(0);
      }

      if (!isOpen) return;

      // Arrow navigation
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1));
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      }

      // Enter to execute
      if (e.key === "Enter" && filteredCommands[selectedIndex]) {
        e.preventDefault();
        executeCommand(filteredCommands[selectedIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands]);

  const executeCommand = (cmd: Command) => {
    cmd.action();
    setRecentCommands((prev) => [
      cmd.id,
      ...prev.filter((id) => id !== cmd.id).slice(0, 4),
    ]);
    setIsOpen(false);
    setSearch("");
    setSelectedIndex(0);
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-slate-300 dark:hover:border-slate-600 transition-all text-sm text-slate-600 dark:text-slate-400"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Quick search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded text-xs">
          <Command className="w-3 h-3" />K
        </kbd>
      </motion.button>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            />

            {/* Palette */}
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ type: "spring", damping: 25 }}
                className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden"
              >
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-200 dark:border-slate-800">
                  <Search className="w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search commands..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setSelectedIndex(0);
                    }}
                    autoFocus
                    className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none text-lg"
                  />
                  <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-600 dark:text-slate-400">
                    ESC
                  </kbd>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto">
                  {Object.keys(groupedCommands).length === 0 ? (
                    <div className="p-12 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center"
                      >
                        <Search className="w-8 h-8 text-slate-400" />
                      </motion.div>
                      <p className="text-slate-600 dark:text-slate-400">
                        No commands found
                      </p>
                    </div>
                  ) : (
                    Object.entries(groupedCommands).map(([category, cmds]) => (
                      <div key={category} className="py-2">
                        <div className="px-4 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          {category}
                        </div>
                        {cmds.map((cmd, idx) => {
                          const globalIndex = filteredCommands.indexOf(cmd);
                          const isSelected = globalIndex === selectedIndex;

                          return (
                            <motion.button
                              key={cmd.id}
                              onClick={() => executeCommand(cmd)}
                              onMouseEnter={() => setSelectedIndex(globalIndex)}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.02 }}
                              className={`w-full flex items-center gap-4 px-4 py-3 transition-colors ${
                                isSelected
                                  ? "bg-violet-50 dark:bg-violet-900/20"
                                  : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                              }`}
                            >
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                  isSelected
                                    ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                }`}
                              >
                                {cmd.icon}
                              </div>

                              <div className="flex-1 text-left">
                                <p
                                  className={`font-semibold ${
                                    isSelected
                                      ? "text-violet-900 dark:text-violet-100"
                                      : "text-slate-900 dark:text-slate-100"
                                  }`}
                                >
                                  {cmd.title}
                                </p>
                                {cmd.subtitle && (
                                  <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {cmd.subtitle}
                                  </p>
                                )}
                              </div>

                              {cmd.shortcut && (
                                <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs text-slate-600 dark:text-slate-400">
                                  {cmd.shortcut}
                                </kbd>
                              )}

                              {isSelected && (
                                <motion.div
                                  initial={{ x: -10, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                >
                                  <ArrowRight className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                                </motion.div>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                  <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded">
                        ↑↓
                      </kbd>
                      <span>Navigate</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded">
                        ↵
                      </kbd>
                      <span>Select</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded">
                        ESC
                      </kbd>
                      <span>Close</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-violet-500" />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      {filteredCommands.length} commands
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Example commands for different roles
export const superAdminCommands: Command[] = [
  {
    id: "add-office",
    title: "Add New Office",
    subtitle: "Create a new branch office",
    icon: <Plus className="w-5 h-5" />,
    action: () => toast.success("Opening office creation form..."),
    category: "Actions",
    keywords: ["create", "new", "branch"],
    shortcut: "⌘N",
  },
  {
    id: "view-offices",
    title: "View All Offices",
    subtitle: "Manage existing offices",
    icon: <Building2 className="w-5 h-5" />,
    action: () => toast.info("Navigating to offices..."),
    category: "Navigation",
    keywords: ["offices", "branches"],
  },
  {
    id: "system-settings",
    title: "System Settings",
    subtitle: "Configure platform settings",
    icon: <Settings className="w-5 h-5" />,
    action: () => toast.info("Opening settings..."),
    category: "Settings",
    keywords: ["config", "preferences"],
  },
  {
    id: "audit-logs",
    title: "View Audit Logs",
    subtitle: "Review system activity",
    icon: <FileText className="w-5 h-5" />,
    action: () => toast.info("Opening audit logs..."),
    category: "Navigation",
    keywords: ["logs", "history", "activity"],
  },
  {
    id: "reports",
    title: "Generate Reports",
    subtitle: "Create platform reports",
    icon: <BarChart3 className="w-5 h-5" />,
    action: () => toast.info("Opening reports..."),
    category: "Actions",
    keywords: ["analytics", "stats"],
  },
];

export const officeUserCommands: Command[] = [
  {
    id: "new-transaction",
    title: "New Transaction",
    subtitle: "Create a new transaction",
    icon: <Plus className="w-5 h-5" />,
    action: () => toast.success("Opening transaction form..."),
    category: "Actions",
    keywords: ["create", "payment"],
    shortcut: "⌘N",
  },
  {
    id: "view-clients",
    title: "View Clients",
    subtitle: "Manage client accounts",
    icon: <Users className="w-5 h-5" />,
    action: () => toast.info("Navigating to clients..."),
    category: "Navigation",
    keywords: ["customers", "accounts"],
  },
  {
    id: "reconciliation",
    title: "Daily Reconciliation",
    subtitle: "Balance accounts",
    icon: <TrendingUp className="w-5 h-5" />,
    action: () => toast.info("Opening reconciliation..."),
    category: "Actions",
    keywords: ["balance", "accounts"],
  },
  {
    id: "invoices",
    title: "Manage Invoices",
    subtitle: "Create and send invoices",
    icon: <FileText className="w-5 h-5" />,
    action: () => toast.info("Opening invoices..."),
    category: "Navigation",
    keywords: ["billing", "payments"],
  },
];
