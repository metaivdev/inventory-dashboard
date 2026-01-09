import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { PackageCheck, RefreshCw, MapPin, Search, ChevronDown, ChevronUp } from "lucide-react";
import { fetchItemsWithStock } from "../api/inventory";
import { StatsCard } from "../components/StatsCard";
import type { ItemWithStock } from "../types/inventory";

export function InStockPage() {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["itemsWithStock"],
    queryFn: fetchItemsWithStock,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const items = data?.items || [];

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;
    const term = searchTerm.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.sku?.toLowerCase().includes(term) ||
        item.locations.some((loc) => loc.location_name.toLowerCase().includes(term))
    );
  }, [items, searchTerm]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalItems = items.length;
    const totalStock = items.reduce((acc, item) => acc + item.stock_on_hand, 0);
    const uniqueLocations = new Set(
      items.flatMap((item) => item.locations.map((loc) => loc.location_name))
    ).size;
    const multiLocationItems = items.filter((item) => item.locations.length > 1).length;

    return { totalItems, totalStock, uniqueLocations, multiLocationItems };
  }, [items]);

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <PackageCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">In Stock Items</h1>
          </div>
          <p className="text-slate-400">
            Items with available stock across all locations ({data?.count || 0} total)
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30 hover:bg-emerald-500/30 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Items In Stock"
          value={stats.totalItems}
          icon={<PackageCheck className="w-6 h-6" />}
          color="emerald"
        />
        <StatsCard
          title="Total Stock Units"
          value={stats.totalStock.toLocaleString()}
          icon={<PackageCheck className="w-6 h-6" />}
          color="cyan"
        />
        <StatsCard
          title="Active Locations"
          value={stats.uniqueLocations}
          icon={<MapPin className="w-6 h-6" />}
          color="violet"
        />
        <StatsCard
          title="Multi-Location Items"
          value={stats.multiLocationItems}
          icon={<MapPin className="w-6 h-6" />}
          color="amber"
        />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search items by name, SKU, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
        />
      </div>

      {/* Items Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">
                Item Name
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-300">
                SKU
              </th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-slate-300">
                Stock on Hand
              </th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-slate-300">
                Available
              </th>
              <th className="text-center px-6 py-4 text-sm font-semibold text-slate-300">
                Locations
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                  Loading items...
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  No items found
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <ItemRow
                  key={item.item_id}
                  item={item}
                  isExpanded={expandedItems.has(item.item_id)}
                  onToggle={() => toggleExpand(item.item_id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface ItemRowProps {
  item: ItemWithStock;
  isExpanded: boolean;
  onToggle: () => void;
}

function ItemRow({ item, isExpanded, onToggle }: ItemRowProps) {
  const hasMultipleLocations = item.locations.length > 1;

  return (
    <>
      <tr
        className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${
          hasMultipleLocations ? "cursor-pointer" : ""
        }`}
        onClick={hasMultipleLocations ? onToggle : undefined}
      >
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            {hasMultipleLocations && (
              <span className="text-slate-400">
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </span>
            )}
            <span className="text-white font-medium">{item.name}</span>
          </div>
        </td>
        <td className="px-6 py-4 text-slate-400 font-mono text-sm">
          {item.sku || "—"}
        </td>
        <td className="px-6 py-4 text-right">
          <span
            className={`font-semibold ${
              item.stock_on_hand <= 5
                ? "text-amber-400"
                : item.stock_on_hand <= 10
                ? "text-yellow-400"
                : "text-emerald-400"
            }`}
          >
            {item.stock_on_hand.toLocaleString()}
          </span>
        </td>
        <td className="px-6 py-4 text-right text-slate-300">
          {item.available_stock.toLocaleString()}
        </td>
        <td className="px-6 py-4 text-center">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-violet-500/20 text-violet-400 rounded-full text-xs font-medium">
            <MapPin className="w-3 h-3" />
            {item.locations.length}
          </span>
        </td>
      </tr>

      {/* Expanded Location Details */}
      {isExpanded && hasMultipleLocations && (
        <tr className="bg-slate-900/50">
          <td colSpan={5} className="px-6 py-4">
            <div className="ml-6 space-y-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Stock by Location
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {item.locations.map((loc) => (
                  <div
                    key={loc.location_id}
                    className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-violet-400" />
                      <span className="text-sm text-slate-300">
                        {loc.location_name}
                      </span>
                      {loc.is_primary && (
                        <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold rounded">
                          PRIMARY
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-emerald-400">
                        {loc.location_stock_on_hand.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-500">in stock</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}


