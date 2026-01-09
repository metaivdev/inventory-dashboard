import { useQuery } from "@tanstack/react-query";
import { Boxes, RefreshCw } from "lucide-react";
import { fetchCompositeItems } from "../api/inventory";
import { InventoryTable } from "../components/InventoryTable";

export function CompositePage() {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["compositeItems"],
    queryFn: fetchCompositeItems,
  });

  const items = data?.compositeItems || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <Boxes className="w-5 h-5 text-cyan-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Composite Items</h1>
          </div>
          <p className="text-slate-400">
            Assembled products and bundles ({items.length} total)
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500/20 text-cyan-400 rounded-lg border border-cyan-500/30 hover:bg-cyan-500/30 transition-all disabled:opacity-50">
          <RefreshCw
            className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Table */}
      <InventoryTable items={items} type="composite" isLoading={isLoading} />
    </div>
  );
}
