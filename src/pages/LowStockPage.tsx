import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { fetchItems, fetchCompositeItems } from '../api/inventory';
import { InventoryTable } from '../components/InventoryTable';

export function LowStockPage() {
  const { data: itemsData, isLoading: itemsLoading, refetch: refetchItems } = useQuery({
    queryKey: ['items'],
    queryFn: fetchItems,
  });

  const { data: compositeData, isLoading: compositeLoading, refetch: refetchComposite } = useQuery({
    queryKey: ['compositeItems'],
    queryFn: fetchCompositeItems,
  });

  const isLoading = itemsLoading || compositeLoading;
  const isFetching = itemsLoading || compositeLoading;

  const allItems = [
    ...(itemsData?.items || []),
    ...(compositeData?.compositeItems || []),
  ];

  // Filter low stock (<=10) and out of stock (<=0)
  const lowStockItems = allItems.filter(item => item.stock_on_hand <= 10);
  const outOfStock = lowStockItems.filter(item => item.stock_on_hand <= 0);
  const criticalLow = lowStockItems.filter(item => item.stock_on_hand > 0 && item.stock_on_hand <= 5);

  const handleRefresh = () => {
    refetchItems();
    refetchComposite();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Low Stock Alerts</h1>
          </div>
          <p className="text-slate-400">
            Items that need restocking attention ({lowStockItems.length} items)
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30 hover:bg-amber-500/30 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 text-rose-400" />
            <span className="text-rose-400 font-semibold">Out of Stock</span>
          </div>
          <p className="text-4xl font-bold text-white">{outOfStock.length}</p>
          <p className="text-sm text-slate-400 mt-1">Items with zero or negative stock</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            <span className="text-amber-400 font-semibold">Critical Low</span>
          </div>
          <p className="text-4xl font-bold text-white">{criticalLow.length}</p>
          <p className="text-sm text-slate-400 mt-1">Items with 5 or fewer in stock</p>
        </div>
      </div>

      {/* Table */}
      <InventoryTable items={lowStockItems} type="items" isLoading={isLoading} />
    </div>
  );
}

