import { useQuery } from '@tanstack/react-query';
import { Truck, RefreshCw, MapPin, ArrowRightLeft } from 'lucide-react';
import { fetchTransferOrders } from '../api/inventory';
import { TransferOrdersTable } from '../components/TransferOrdersTable';
import { StatsCard } from '../components/StatsCard';
import { useMemo } from 'react';

export function TransferOrdersPage() {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['transferOrders'],
    queryFn: fetchTransferOrders,
  });

  const orders = data?.transferOrders || [];

  // Calculate stats
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalQuantity = orders.reduce((acc, o) => acc + o.quantity_transfer, 0);
    const uniqueFromLocations = new Set(orders.map((o) => o.from_location_name)).size;
    const uniqueToLocations = new Set(orders.map((o) => o.to_location_name)).size;
    const transferredCount = orders.filter((o) => o.status === 'transferred').length;

    return {
      totalOrders,
      totalQuantity,
      uniqueFromLocations,
      uniqueToLocations,
      transferredCount,
    };
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-cyan-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Transfer Orders</h1>
          </div>
          <p className="text-slate-400">
            Track inventory movements between locations ({orders.length} total)
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/30 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<Truck className="w-6 h-6" />}
          color="cyan"
        />
        <StatsCard
          title="Total Qty Moved"
          value={stats.totalQuantity}
          icon={<ArrowRightLeft className="w-6 h-6" />}
          color="emerald"
        />
        <StatsCard
          title="Source Locations"
          value={stats.uniqueFromLocations}
          icon={<MapPin className="w-6 h-6" />}
          color="amber"
        />
        <StatsCard
          title="Destination Locations"
          value={stats.uniqueToLocations}
          icon={<MapPin className="w-6 h-6" />}
          color="violet"
        />
      </div>

      {/* Table */}
      <TransferOrdersTable orders={orders} isLoading={isLoading} />
    </div>
  );
}
