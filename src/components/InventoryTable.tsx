import { useState, useMemo } from "react";
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Package,
  ArrowUpDown,
} from "lucide-react";
import type { InventoryItem, CompositeItem } from "../types/inventory";

type SortDirection = "asc" | "desc" | null;
type SortField =
  | "name"
  | "stock_on_hand"
  | "rate"
  | "status"
  | "last_modified_time";

interface InventoryTableProps {
  items: (InventoryItem | CompositeItem)[];
  type: "items" | "composite";
  isLoading?: boolean;
}

function getItemId(item: InventoryItem | CompositeItem): string {
  return "item_id" in item ? item.item_id : item.composite_item_id;
}

function getStockStatus(stock: number): { label: string; color: string } {
  if (stock <= 0)
    return {
      label: "Out of Stock",
      color: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    };
  if (stock < 10)
    return {
      label: "Low Stock",
      color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    };
  return {
    label: "In Stock",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  };
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export function InventoryTable({
  items,
  type,
  isLoading,
}: InventoryTableProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(
        sortDirection === "asc"
          ? "desc"
          : sortDirection === "desc"
          ? null
          : "asc"
      );
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.sku?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((item) => {
        if (statusFilter === "in-stock") return item.stock_on_hand > 10;
        if (statusFilter === "low-stock")
          return item.stock_on_hand > 0 && item.stock_on_hand <= 10;
        if (statusFilter === "out-of-stock") return item.stock_on_hand <= 0;
        return true;
      });
    }

    // Sort
    if (sortDirection) {
      result.sort((a, b) => {
        let aVal: string | number = "";
        let bVal: string | number = "";

        switch (sortField) {
          case "name":
            aVal = a.name.toLowerCase();
            bVal = b.name.toLowerCase();
            break;
          case "stock_on_hand":
            aVal = a.stock_on_hand;
            bVal = b.stock_on_hand;
            break;
          case "rate":
            aVal = a.rate;
            bVal = b.rate;
            break;
          case "status":
            aVal = a.status;
            bVal = b.status;
            break;
          case "last_modified_time":
            aVal = new Date(a.last_modified_time).getTime();
            bVal = new Date(b.last_modified_time).getTime();
            break;
        }

        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [items, search, sortField, sortDirection, statusFilter]);

  // Pagination calculations
  const totalItems = filteredAndSortedItems.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedItems = filteredAndSortedItems.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ArrowUpDown className="w-4 h-4 text-slate-500" />;
    if (sortDirection === "asc")
      return <ChevronUp className="w-4 h-4 text-emerald-400" />;
    if (sortDirection === "desc")
      return <ChevronDown className="w-4 h-4 text-emerald-400" />;
    return <ArrowUpDown className="w-4 h-4 text-slate-500" />;
  };

  if (isLoading) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
        <div className="flex items-center justify-center gap-3 text-slate-400">
          <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          <span>Loading inventory...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-700 flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-[280px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            className="px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50 transition-all cursor-pointer">
            <option value="all">All Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>

          <div className="text-sm text-slate-400">
            Showing {startIndex + 1}-{endIndex} of{" "}
            {filteredAndSortedItems.length}{" "}
            {type === "items" ? "items" : "composite items"}
            {filteredAndSortedItems.length !== items.length && (
              <span className="text-slate-500">
                {" "}
                (filtered from {items.length})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-900/30">
              <th className="text-left py-4 px-4 font-medium text-slate-400">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-2 hover:text-slate-200 transition-colors">
                  Product Name
                  <SortIcon field="name" />
                </button>
              </th>
              <th className="text-left py-4 px-4 font-medium text-slate-400">
                SKU
              </th>
              <th className="text-left py-4 px-4 font-medium text-slate-400">
                <button
                  onClick={() => handleSort("stock_on_hand")}
                  className="flex items-center gap-2 hover:text-slate-200 transition-colors">
                  Stock
                  <SortIcon field="stock_on_hand" />
                </button>
              </th>
              <th className="text-left py-4 px-4 font-medium text-slate-400">
                Status
              </th>
              <th className="text-left py-4 px-4 font-medium text-slate-400">
                <button
                  onClick={() => handleSort("rate")}
                  className="flex items-center gap-2 hover:text-slate-200 transition-colors">
                  Rate
                  <SortIcon field="rate" />
                </button>
              </th>
              <th className="text-left py-4 px-4 font-medium text-slate-400">
                Unit
              </th>
              <th className="text-left py-4 px-4 font-medium text-slate-400">
                <button
                  onClick={() => handleSort("last_modified_time")}
                  className="flex items-center gap-2 hover:text-slate-200 transition-colors">
                  Last Updated
                  <SortIcon field="last_modified_time" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No items found</p>
                </td>
              </tr>
            ) : (
              paginatedItems.map((item) => {
                const stockStatus = getStockStatus(item.stock_on_hand);
                return (
                  <tr
                    key={getItemId(item)}
                    className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-200 max-w-[300px] truncate">
                            {item.name}
                          </p>
                          {item.description && (
                            <p className="text-sm text-slate-500 truncate max-w-[300px]">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-400 font-mono text-sm">
                      {item.sku || "-"}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`font-semibold ${
                          item.stock_on_hand <= 0
                            ? "text-rose-400"
                            : item.stock_on_hand < 10
                            ? "text-amber-400"
                            : "text-slate-200"
                        }`}>
                        {item.stock_on_hand}
                      </span>
                      <span className="text-slate-500 ml-1">
                        {item.unit || "units"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border ${stockStatus.color}`}>
                        {stockStatus.label}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-200 font-medium">
                      {item.rate > 0 ? `₦${item.rate.toLocaleString()}` : "-"}
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      {item.unit || "-"}
                    </td>
                    <td className="py-4 px-4 text-slate-400 text-sm">
                      {new Date(item.last_modified_time).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="p-4 border-t border-slate-700 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="px-3 py-1.5 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-emerald-500/50 transition-all cursor-pointer">
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">
              {startIndex + 1}-{endIndex} of {totalItems}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="First page">
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Previous page">
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                      currentPage === pageNum
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                    }`}>
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Next page">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Last page">
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
