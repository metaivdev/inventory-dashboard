import { useQuery } from "@tanstack/react-query";
import {
  Package,
  Boxes,
  AlertTriangle,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { fetchItems, fetchCompositeItems } from "../api/inventory";
import { StatsCard } from "../components/StatsCard";
import { InventoryTable } from "../components/InventoryTable";

export function Dashboard() {
  const { data: itemsData, isLoading: itemsLoading } = useQuery({
    queryKey: ["items"],
    queryFn: fetchItems,
  });

  const { data: compositeData, isLoading: compositeLoading } = useQuery({
    queryKey: ["compositeItems"],
    queryFn: fetchCompositeItems,
  });

  const items = itemsData?.items || [];
  const compositeItems = compositeData?.compositeItems || [];
  const allItems = [...items, ...compositeItems];

  // Calculate stats
  const totalItems = items.length;
  const totalComposite = compositeItems.length;
  const lowStockItems = allItems.filter(
    (item) => item.stock_on_hand > 0 && item.stock_on_hand <= 10
  ).length;
  const outOfStockItems = allItems.filter(
    (item) => item.stock_on_hand <= 0
  ).length;
  const totalStockValue = items.reduce((acc, item) => {
    const stock = item.stock_on_hand || 0;
    const rate = item.rate || 0;
    return acc + (stock > 0 ? stock * rate : 0);
  }, 0);

  // Get recent items (last 10 modified)
  const recentItems = [...allItems]
    .sort(
      (a, b) =>
        new Date(b.last_modified_time).getTime() -
        new Date(a.last_modified_time).getTime()
    )
    .slice(0, 10);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Inventory Dashboard
        </h1>
        <p className="text-slate-400">
          Overview of your inventory status and metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Items"
          value={totalItems}
          icon={<Package className="w-6 h-6 text-white" />}
          color="emerald"
        />
        <StatsCard
          title="Composite Products"
          value={totalComposite}
          icon={<Boxes className="w-6 h-6 text-white" />}
          color="cyan"
        />
        <StatsCard
          title="Low Stock Items"
          value={lowStockItems}
          icon={<AlertTriangle className="w-6 h-6 text-white" />}
          color="amber"
        />
        <StatsCard
          title="Out of Stock"
          value={outOfStockItems}
          icon={<AlertTriangle className="w-6 h-6 text-white" />}
          color="rose"
        />
      </div>

      {/* Stock Value Card */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-violet-500/10 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">
              Estimated Stock Value
            </p>
            <p className="text-4xl font-bold text-white">
              ₦{totalStockValue.toLocaleString()}
            </p>
            <p className="text-sm text-slate-400 mt-2">
              Based on {totalItems} items with rates
            </p>
          </div>
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">
            Recently Updated Items
          </h2>
          <div className="flex items-center gap-2 text-emerald-400 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>Live data</span>
          </div>
        </div>
        <InventoryTable
          items={recentItems}
          type="items"
          isLoading={itemsLoading || compositeLoading}
        />
      </div>
    </div>
  );
}
