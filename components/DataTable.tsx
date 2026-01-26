import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  pageSize?: number;
  onRowClick?: (row: any) => void;
  emptyMessage?: string;
}

export function DataTable({
  columns,
  data,
  pageSize = 10,
  onRowClick,
  emptyMessage = "No data available",
}: DataTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting logic
  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0;

    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-2 border-slate-200 p-12 text-center">
        <p className="text-slate-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b-2 border-slate-200">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-6 py-4 text-left">
                  {column.sortable ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleSort(column.key)}
                      className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider hover:text-slate-900 transition-colors group"
                    >
                      <span>{column.label}</span>
                      <motion.div
                        animate={{
                          rotate:
                            sortColumn === column.key &&
                            sortDirection === "desc"
                              ? 180
                              : 0,
                        }}
                      >
                        {sortColumn === column.key ? (
                          <ArrowUp className="w-4 h-4" />
                        ) : (
                          <ArrowUpDown className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                        )}
                      </motion.div>
                    </motion.button>
                  ) : (
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      {column.label}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <AnimatePresence mode="popLayout">
              {paginatedData.map((row, rowIndex) => (
                <motion.tr
                  key={row.id || rowIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: rowIndex * 0.05 }}
                  onClick={() => onRowClick?.(row)}
                  className={`${
                    onRowClick ? "cursor-pointer" : ""
                  } hover:bg-blue-50 transition-colors group`}
                  whileHover={{ scale: 1.01 }}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4">
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t-2 border-slate-200 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + pageSize, data.length)} of {data.length}{" "}
            results
          </p>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border-2 border-slate-200 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </motion.button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <motion.button
                    key={page}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all ${
                      currentPage === page
                        ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {page}
                  </motion.button>
                )
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border-2 border-slate-200 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact table variant for mobile
export function CompactTable({
  data,
  renderRow,
  onRowClick,
}: {
  data: any[];
  renderRow: (row: any) => React.ReactNode;
  onRowClick?: (row: any) => void;
}) {
  return (
    <div className="divide-y divide-slate-200">
      {data.map((row, index) => (
        <motion.div
          key={row.id || index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onRowClick?.(row)}
          className={`p-4 ${
            onRowClick ? "cursor-pointer" : ""
          } hover:bg-blue-50 transition-colors`}
          whileTap={{ scale: 0.98 }}
        >
          {renderRow(row)}
        </motion.div>
      ))}
    </div>
  );
}
