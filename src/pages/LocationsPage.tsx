import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  MapPin,
  RefreshCw,
  Package,
  ArrowLeft,
  Search,
  Store,
  Wrench,
  Info,
  X,
} from "lucide-react";
import { fetchItemsWithStock } from "../api/inventory";
import { StatsCard } from "../components/StatsCard";

interface LocationSummary {
  location_id: string;
  location_name: string;
  is_primary: boolean;
  total_items: number;
  total_stock: number;
  items: {
    item_id: string;
    name: string;
    sku: string;
    stock_on_hand: number;
    available_stock: number;
  }[];
}

// Helper to determine location type based on name patterns
function getLocationType(name: string): "store" | "workstation" {
  const workstationKeywords = ["station", "sanding", "coating", "printing", "assembly"];
  const lowerName = name.toLowerCase();
  return workstationKeywords.some((kw) => lowerName.includes(kw))
    ? "workstation"
    : "store";
}

export function LocationsPage() {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["itemsWithStock"],
    queryFn: fetchItemsWithStock,
  });

  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showInfoBanner, setShowInfoBanner] = useState(true);

  const items = data?.items || [];

  // Aggregate items by location
  const locationSummaries = useMemo(() => {
    const locationMap = new Map<string, LocationSummary>();

    items.forEach((item) => {
      item.locations.forEach((loc) => {
        if (!locationMap.has(loc.location_id)) {
          locationMap.set(loc.location_id, {
            location_id: loc.location_id,
            location_name: loc.location_name,
            is_primary: loc.is_primary,
            total_items: 0,
            total_stock: 0,
            items: [],
          });
        }

        const summary = locationMap.get(loc.location_id)!;
        summary.total_items += 1;
        summary.total_stock += loc.location_stock_on_hand;
        summary.items.push({
          item_id: item.item_id,
          name: item.name,
          sku: item.sku || "",
          stock_on_hand: loc.location_stock_on_hand,
          available_stock: loc.location_available_stock,
        });
      });
    });

    // Sort by total stock descending
    return Array.from(locationMap.values()).sort(
      (a, b) => b.total_stock - a.total_stock
    );
  }, [items]);

  // Filter locations based on search
  const filteredLocations = useMemo(() => {
    if (!searchTerm.trim()) return locationSummaries;
    const term = searchTerm.toLowerCase();
    return locationSummaries.filter((loc) =>
      loc.location_name.toLowerCase().includes(term)
    );
  }, [locationSummaries, searchTerm]);

  // Get selected location details
  const selectedLocationData = useMemo(() => {
    if (!selectedLocation) return null;
    return locationSummaries.find((loc) => loc.location_id === selectedLocation);
  }, [selectedLocation, locationSummaries]);

  // Filter items in selected location
  const filteredLocationItems = useMemo(() => {
    if (!selectedLocationData) return [];
    if (!searchTerm.trim()) return selectedLocationData.items;
    const term = searchTerm.toLowerCase();
    return selectedLocationData.items.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.sku.toLowerCase().includes(term)
    );
  }, [selectedLocationData, searchTerm]);

  // Calculate overall stats
  const stats = useMemo(() => {
    const totalLocations = locationSummaries.length;
    const totalStock = locationSummaries.reduce(
      (acc, loc) => acc + loc.total_stock,
      0
    );
    const storeLocations = locationSummaries.filter(
      (loc) => getLocationType(loc.location_name) === "store"
    ).length;
    const workstationLocations = locationSummaries.filter(
      (loc) => getLocationType(loc.location_name) === "workstation"
    ).length;

    return { totalLocations, totalStock, storeLocations, workstationLocations };
  }, [locationSummaries]);

  // Categorize locations
  const categorizedLocations = useMemo(() => {
    const stores = filteredLocations.filter(
      (loc) => getLocationType(loc.location_name) === "store"
    );
    const workstations = filteredLocations.filter(
      (loc) => getLocationType(loc.location_name) === "workstation"
    );
    return { stores, workstations };
  }, [filteredLocations]);

  // Back to locations list
  const handleBack = () => {
    setSelectedLocation(null);
    setSearchTerm("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            {selectedLocation ? (
              <button
                onClick={handleBack}
                className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-300" />
              </button>
            ) : (
              <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-violet-400" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-white">
                {selectedLocationData
                  ? selectedLocationData.location_name
                  : "Locations"}
              </h1>
              {selectedLocationData && (
                <p className="text-slate-400 text-sm">
                  {selectedLocationData.total_items} items •{" "}
                  {selectedLocationData.total_stock.toLocaleString()} units
                </p>
              )}
            </div>
          </div>
          {!selectedLocation && (
            <p className="text-slate-400">
              Stock distribution across {stats.totalLocations} locations
            </p>
          )}
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2.5 bg-violet-500/20 text-violet-400 rounded-lg border border-violet-500/30 hover:bg-violet-500/30 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Info Banner - Explains how locations work */}
      {!selectedLocation && showInfoBanner && (
        <div className="relative bg-gradient-to-r from-violet-500/10 via-cyan-500/10 to-emerald-500/10 border border-violet-500/30 rounded-xl p-5">
          <button
            onClick={() => setShowInfoBanner(false)}
            className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">How Locations Work</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <Store className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-cyan-400 font-medium">Stores & Warehouses</span>
                    <p className="text-slate-400">Physical retail or storage locations (e.g., Oregun Store, Marina)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Wrench className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-amber-400 font-medium">Workstations</span>
                    <p className="text-slate-400">Production areas where items are processed (e.g., Coating Station, Printing Station)</p>
                  </div>
                </div>
              </div>
              <p className="text-slate-500 text-xs mt-3">
                <span className="text-emerald-400 font-medium">DEFAULT</span> = The main location where new items are initially assigned
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards - Only show on locations list */}
      {!selectedLocation && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Locations"
            value={stats.totalLocations}
            icon={<MapPin className="w-6 h-6" />}
            color="violet"
          />
          <StatsCard
            title="Total Stock Units"
            value={stats.totalStock.toLocaleString()}
            icon={<Package className="w-6 h-6" />}
            color="emerald"
          />
          <StatsCard
            title="Stores & Warehouses"
            value={stats.storeLocations}
            icon={<Store className="w-6 h-6" />}
            color="cyan"
          />
          <StatsCard
            title="Workstations"
            value={stats.workstationLocations}
            icon={<Wrench className="w-6 h-6" />}
            color="amber"
          />
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder={
            selectedLocation
              ? "Search items by name or SKU..."
              : "Search locations..."
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50"
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 animate-spin text-violet-400" />
        </div>
      ) : selectedLocation ? (
        // Location Detail View - Items in this location
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
              </tr>
            </thead>
            <tbody>
              {filteredLocationItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    No items found
                  </td>
                </tr>
              ) : (
                filteredLocationItems.map((item) => (
                  <tr
                    key={item.item_id}
                    className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-white font-medium">{item.name}</span>
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        // Locations Grid - Categorized
        <div className="space-y-8">
          {filteredLocations.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              No locations found
            </div>
          ) : (
            <>
              {/* Stores & Warehouses Section */}
              {categorizedLocations.stores.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Store className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-lg font-semibold text-white">
                      Stores & Warehouses
                    </h2>
                    <span className="text-sm text-slate-500">
                      ({categorizedLocations.stores.length})
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categorizedLocations.stores.map((location) => (
                      <LocationCard
                        key={location.location_id}
                        location={location}
                        type="store"
                        onClick={() => {
                          setSelectedLocation(location.location_id);
                          setSearchTerm("");
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Workstations Section */}
              {categorizedLocations.workstations.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Wrench className="w-5 h-5 text-amber-400" />
                    <h2 className="text-lg font-semibold text-white">
                      Workstations
                    </h2>
                    <span className="text-sm text-slate-500">
                      ({categorizedLocations.workstations.length})
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categorizedLocations.workstations.map((location) => (
                      <LocationCard
                        key={location.location_id}
                        location={location}
                        type="workstation"
                        onClick={() => {
                          setSelectedLocation(location.location_id);
                          setSearchTerm("");
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Location Card Component
interface LocationCardProps {
  location: LocationSummary;
  type: "store" | "workstation";
  onClick: () => void;
}

function LocationCard({ location, type, onClick }: LocationCardProps) {
  const isStore = type === "store";

  return (
    <button
      onClick={onClick}
      className={`group bg-slate-800 border rounded-xl p-6 text-left transition-all ${
        isStore
          ? "border-slate-700 hover:border-cyan-500/50"
          : "border-slate-700 hover:border-amber-500/50"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
            isStore
              ? "bg-cyan-500/20 group-hover:bg-cyan-500/30"
              : "bg-amber-500/20 group-hover:bg-amber-500/30"
          }`}
        >
          {isStore ? (
            <Store className="w-6 h-6 text-cyan-400" />
          ) : (
            <Wrench className="w-6 h-6 text-amber-400" />
          )}
        </div>
        {location.is_primary && (
          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-lg">
            DEFAULT
          </span>
        )}
      </div>

      <h3
        className={`text-lg font-semibold text-white mb-1 transition-colors ${
          isStore ? "group-hover:text-cyan-300" : "group-hover:text-amber-300"
        }`}
      >
        {location.location_name}
      </h3>

      <div className="flex items-center gap-4 mt-4">
        <div>
          <p className="text-2xl font-bold text-emerald-400">
            {location.total_stock.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500">Total Units</p>
        </div>
        <div className="w-px h-10 bg-slate-700" />
        <div>
          <p
            className={`text-2xl font-bold ${
              isStore ? "text-cyan-400" : "text-amber-400"
            }`}
          >
            {location.total_items}
          </p>
          <p className="text-xs text-slate-500">Items</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700">
        <p
          className={`text-xs text-slate-400 transition-colors ${
            isStore ? "group-hover:text-cyan-400" : "group-hover:text-amber-400"
          }`}
        >
          Click to view items →
        </p>
      </div>
    </button>
  );
}
