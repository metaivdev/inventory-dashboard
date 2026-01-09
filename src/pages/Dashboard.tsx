import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  Package,
  Boxes,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Wrench,
  Store,
  ArrowRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { fetchItemsWithStock } from "../api/inventory";
import { StatsCard } from "../components/StatsCard";

// Helper to determine location type
function getLocationType(name: string): "store" | "workstation" {
  const workstationKeywords = [
    "station",
    "sanding",
    "coating",
    "printing",
    "assembly",
  ];
  const lowerName = name.toLowerCase();
  return workstationKeywords.some((kw) => lowerName.includes(kw))
    ? "workstation"
    : "store";
}

const COLORS = {
  emerald: "#10b981",
  cyan: "#06b6d4",
  amber: "#f59e0b",
  violet: "#8b5cf6",
  rose: "#f43f5e",
  slate: "#64748b",
};

export function Dashboard() {
  const { data: stockData, isLoading: stockLoading } = useQuery({
    queryKey: ["itemsWithStock"],
    queryFn: fetchItemsWithStock,
  });

  const stockItems = stockData?.items || [];
  
  // Use items-with-stock count (from MongoDB) for accurate totals
  const itemsInStock = stockData?.count || 0;
  
  // Calculate stock stats from the complete stockItems data
  const lowStockItems = stockItems.filter(
    (item) => item.stock_on_hand > 0 && item.stock_on_hand <= 10
  ).length;
  
  // Items with 0 stock but exist in locations (edge case)
  const criticalItems = stockItems.filter(
    (item) => item.stock_on_hand <= 5 && item.stock_on_hand > 0
  ).length;
  
  // Calculate total stock units
  const totalStockUnits = stockItems.reduce(
    (acc, item) => acc + (item.stock_on_hand || 0),
    0
  );

  // Aggregate location data
  const locationStats = useMemo(() => {
    const locationMap = new Map<
      string,
      {
        name: string;
        type: "store" | "workstation";
        totalUnits: number;
        itemCount: number;
      }
    >();

    stockItems.forEach((item) => {
      item.locations.forEach((loc) => {
        if (!locationMap.has(loc.location_id)) {
          locationMap.set(loc.location_id, {
            name: loc.location_name,
            type: getLocationType(loc.location_name),
            totalUnits: 0,
            itemCount: 0,
          });
        }
        const stats = locationMap.get(loc.location_id)!;
        stats.totalUnits += loc.location_stock_on_hand;
        stats.itemCount += 1;
      });
    });

    const all = Array.from(locationMap.values());
    const stores = all.filter((l) => l.type === "store");
    const workstations = all.filter((l) => l.type === "workstation");

    const storeUnits = stores.reduce((acc, l) => acc + l.totalUnits, 0);
    const workstationUnits = workstations.reduce(
      (acc, l) => acc + l.totalUnits,
      0
    );

    return {
      all,
      stores,
      workstations,
      storeUnits,
      workstationUnits,
      totalLocations: all.length,
    };
  }, [stockItems]);

  // Data for location bar chart
  const locationChartData = useMemo(() => {
    return locationStats.all
      .sort((a, b) => b.totalUnits - a.totalUnits)
      .slice(0, 8)
      .map((loc) => ({
        name:
          loc.name.length > 15 ? loc.name.substring(0, 15) + "..." : loc.name,
        fullName: loc.name,
        units: loc.totalUnits,
        items: loc.itemCount,
        type: loc.type,
        fill: loc.type === "store" ? COLORS.cyan : COLORS.amber,
      }));
  }, [locationStats]);

  // Data for workstation breakdown
  const workstationChartData = useMemo(() => {
    return locationStats.workstations
      .sort((a, b) => b.totalUnits - a.totalUnits)
      .map((loc) => ({
        name: loc.name.replace(" Station", "").replace("Pre-", ""),
        fullName: loc.name,
        units: loc.totalUnits,
        items: loc.itemCount,
      }));
  }, [locationStats]);

  // Data for distribution pie chart
  const distributionData = useMemo(() => {
    return [
      {
        name: "Stores & Warehouses",
        value: locationStats.storeUnits,
        color: COLORS.cyan,
      },
      {
        name: "Workstations",
        value: locationStats.workstationUnits,
        color: COLORS.amber,
      },
    ];
  }, [locationStats]);

  const isLoading = stockLoading;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Inventory Dashboard
        </h1>
        <p className="text-slate-400">
          Overview of your inventory status, locations, and production flow
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Items In Stock"
          value={itemsInStock}
          icon={<Package className="w-6 h-6 text-white" />}
          color="emerald"
        />
        <StatsCard
          title="Total Stock Units"
          value={totalStockUnits.toLocaleString()}
          icon={<Boxes className="w-6 h-6 text-white" />}
          color="cyan"
        />
        <StatsCard
          title="Low Stock (≤10)"
          value={lowStockItems}
          icon={<AlertTriangle className="w-6 h-6 text-white" />}
          color="amber"
        />
        <StatsCard
          title="Critical (≤5)"
          value={criticalItems}
          icon={<AlertTriangle className="w-6 h-6 text-white" />}
          color="rose"
        />
      </div>

      {/* Stock Value + Distribution Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock Summary Card */}
        <div className="lg:col-span-2 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-violet-500/10 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">
                Total Inventory
              </p>
              <p className="text-4xl font-bold text-white">
                {totalStockUnits.toLocaleString()} units
              </p>
              <p className="text-sm text-slate-400 mt-2">
                Across {itemsInStock} different products in {locationStats.totalLocations} locations
              </p>
            </div>
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
              <Package className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Stock Distribution Pie */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">
            Stock Distribution
          </h3>
          {isLoading ? (
            <div className="h-32 flex items-center justify-center text-slate-500">
              Loading...
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-24 h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      innerRadius={25}
                      outerRadius={40}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: COLORS.cyan }}
                  />
                  <span className="text-xs text-slate-400">Stores</span>
                  <span className="text-xs font-semibold text-white ml-auto">
                    {locationStats.storeUnits.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: COLORS.amber }}
                  />
                  <span className="text-xs text-slate-400">Workstations</span>
                  <span className="text-xs font-semibold text-white ml-auto">
                    {locationStats.workstationUnits.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Location Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {locationStats.totalLocations}
              </p>
              <p className="text-xs text-slate-400">Total Locations</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {locationStats.stores.length}
              </p>
              <p className="text-xs text-slate-400">Stores & Warehouses</p>
            </div>
          </div>
          <p className="text-sm text-slate-500">
            {locationStats.storeUnits.toLocaleString()} units stored
          </p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {locationStats.workstations.length}
              </p>
              <p className="text-xs text-slate-400">Workstations</p>
            </div>
          </div>
          <p className="text-sm text-slate-500">
            {locationStats.workstationUnits.toLocaleString()} units in process
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock by Location Bar Chart */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              Stock by Location
            </h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: COLORS.cyan }}
                />
                <span className="text-slate-400">Store</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: COLORS.amber }}
                />
                <span className="text-slate-400">Workstation</span>
              </div>
            </div>
          </div>
          {isLoading ? (
            <div className="h-64 flex items-center justify-center text-slate-500">
              Loading...
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={locationChartData}
                  layout="vertical"
                  margin={{ left: 0, right: 20 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={100}
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#f1f5f9" }}
                    formatter={(value: number, name: string) => [
                      `${value.toLocaleString()} units`,
                      "Stock",
                    ]}
                    labelFormatter={(label, payload) =>
                      payload?.[0]?.payload?.fullName || label
                    }
                  />
                  <Bar dataKey="units" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Workstation Pipeline */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Wrench className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-semibold text-white">
              Production Pipeline
            </h3>
          </div>
          <p className="text-sm text-slate-400 mb-6">
            Units currently at each workstation
          </p>
          {isLoading ? (
            <div className="h-48 flex items-center justify-center text-slate-500">
              Loading...
            </div>
          ) : workstationChartData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-500">
              No workstation data
            </div>
          ) : (
            <div className="space-y-4">
              {workstationChartData.map((station, index) => {
                const maxUnits = Math.max(
                  ...workstationChartData.map((s) => s.units)
                );
                const percentage = (station.units / maxUnits) * 100;

                return (
                  <div key={station.fullName}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-300">
                          {station.name}
                        </span>
                        {index < workstationChartData.length - 1 && (
                          <ArrowRight className="w-3 h-3 text-slate-600" />
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-amber-400">
                          {station.units.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-500 ml-1">
                          units
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {station.items} different items
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-gradient-to-r from-violet-500/10 via-amber-500/10 to-cyan-500/10 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-violet-400" />
          <h3 className="text-lg font-semibold text-white">Quick Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-400">
              {itemsInStock}
            </p>
            <p className="text-sm text-slate-400 mt-1">Products In Stock</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-cyan-400">
              {totalStockUnits.toLocaleString()}
            </p>
            <p className="text-sm text-slate-400 mt-1">Total Units</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-amber-400">
              {locationStats.workstationUnits > 0
                ? Math.round(
                    (locationStats.workstationUnits /
                      (locationStats.storeUnits +
                        locationStats.workstationUnits)) *
                      100
                  )
                : 0}
              %
            </p>
            <p className="text-sm text-slate-400 mt-1">In Production</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-violet-400">
              {locationStats.stores.length > 0
                ? Math.round(
                    locationStats.storeUnits / locationStats.stores.length
                  ).toLocaleString()
                : 0}
            </p>
            <p className="text-sm text-slate-400 mt-1">Avg Units/Store</p>
          </div>
        </div>
      </div>
    </div>
  );
}
