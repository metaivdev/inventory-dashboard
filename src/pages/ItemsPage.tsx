import { useQuery } from '@tanstack/react-query';
import { Package, RefreshCw } from 'lucide-react';
import { fetchItems } from '../api/inventory';
import { InventoryTable } from '../components/InventoryTable';

export function ItemsPage() {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['items'],
    queryFn: fetchItems,
  });

  const items = data?.items || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">All Items</h1>
          </div>
          <p className="text-slate-400">
            Manage and view all inventory items ({items.length} total)
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30 hover:bg-emerald-500/30 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Table */}
      <InventoryTable items={items} type="items" isLoading={isLoading} />
    </div>
  );
}

