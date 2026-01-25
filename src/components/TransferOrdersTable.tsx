// import { useState, useMemo } from 'react';
// import {
//   Search,
//   ChevronUp,
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
//   ArrowRight,
//   ArrowUpDown,
//   Truck,
// } from 'lucide-react';
// import type { TransferOrder } from '../types/inventory';

// type SortDirection = 'asc' | 'desc' | null;
// type SortField =
//   | 'transfer_order_number'
//   | 'date'
//   | 'quantity_transfer'
//   | 'from_location_name'
//   | 'to_location_name'
//   | 'status';

// interface TransferOrdersTableProps {
//   orders: TransferOrder[];
//   isLoading?: boolean;
// }

// function getStatusColor(status: string): string {
//   switch (status.toLowerCase()) {
//     case 'transferred':
//       return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
//     case 'pending':
//       return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
//     case 'cancelled':
//       return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
//     default:
//       return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
//   }
// }

// const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// export function TransferOrdersTable({ orders, isLoading }: TransferOrdersTableProps) {
//   const [search, setSearch] = useState('');
//   const [sortField, setSortField] = useState<SortField>('date');
//   const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
//   const [locationFilter, setLocationFilter] = useState<string>('all');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(25);

//   // Get unique locations for filter dropdown
//   const locations = useMemo(() => {
//     const fromLocs = new Set(orders.map((o) => o.from_location_name));
//     const toLocs = new Set(orders.map((o) => o.to_location_name));
//     return Array.from(new Set([...fromLocs, ...toLocs])).sort();
//   }, [orders]);

//   const handleSort = (field: SortField) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === 'asc' ? 'desc' : sortDirection === 'desc' ? null : 'asc');
//     } else {
//       setSortField(field);
//       setSortDirection('asc');
//     }
//   };

//   const filteredAndSortedOrders = useMemo(() => {
//     let result = [...orders];

//     // Filter by search
//     if (search) {
//       const searchLower = search.toLowerCase();
//       result = result.filter(
//         (order) =>
//           order.transfer_order_number.toLowerCase().includes(searchLower) ||
//           order.description.toLowerCase().includes(searchLower) ||
//           order.from_location_name.toLowerCase().includes(searchLower) ||
//           order.to_location_name.toLowerCase().includes(searchLower) ||
//           order.created_by_name.toLowerCase().includes(searchLower)
//       );
//     }

//     // Filter by location
//     if (locationFilter !== 'all') {
//       result = result.filter(
//         (order) =>
//           order.from_location_name === locationFilter || order.to_location_name === locationFilter
//       );
//     }

//     // Sort
//     if (sortDirection) {
//       result.sort((a, b) => {
//         let aVal: string | number = '';
//         let bVal: string | number = '';

//         switch (sortField) {
//           case 'transfer_order_number':
//             aVal = a.transfer_order_number;
//             bVal = b.transfer_order_number;
//             break;
//           case 'date':
//             aVal = new Date(a.date).getTime();
//             bVal = new Date(b.date).getTime();
//             break;
//           case 'quantity_transfer':
//             aVal = a.quantity_transfer;
//             bVal = b.quantity_transfer;
//             break;
//           case 'from_location_name':
//             aVal = a.from_location_name.toLowerCase();
//             bVal = b.from_location_name.toLowerCase();
//             break;
//           case 'to_location_name':
//             aVal = a.to_location_name.toLowerCase();
//             bVal = b.to_location_name.toLowerCase();
//             break;
//           case 'status':
//             aVal = a.status;
//             bVal = b.status;
//             break;
//         }

//         if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
//         if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
//         return 0;
//       });
//     }

//     return result;
//   }, [orders, search, sortField, sortDirection, locationFilter]);

//   // Pagination calculations
//   const totalItems = filteredAndSortedOrders.length;
//   const totalPages = Math.ceil(totalItems / pageSize);
//   const startIndex = (currentPage - 1) * pageSize;
//   const endIndex = Math.min(startIndex + pageSize, totalItems);
//   const paginatedOrders = filteredAndSortedOrders.slice(startIndex, endIndex);

//   // Reset to page 1 when filters change
//   const handleSearchChange = (value: string) => {
//     setSearch(value);
//     setCurrentPage(1);
//   };

//   const handleLocationFilterChange = (value: string) => {
//     setLocationFilter(value);
//     setCurrentPage(1);
//   };

//   const handlePageSizeChange = (value: number) => {
//     setPageSize(value);
//     setCurrentPage(1);
//   };

//   const SortIcon = ({ field }: { field: SortField }) => {
//     if (sortField !== field) return <ArrowUpDown className="w-4 h-4 text-slate-500" />;
//     if (sortDirection === 'asc') return <ChevronUp className="w-4 h-4 text-cyan-400" />;
//     if (sortDirection === 'desc') return <ChevronDown className="w-4 h-4 text-cyan-400" />;
//     return <ArrowUpDown className="w-4 h-4 text-slate-500" />;
//   };

//   if (isLoading) {
//     return (
//       <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
//         <div className="flex items-center justify-center gap-3 text-slate-400">
//           <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
//           <span>Loading transfer orders...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
//       {/* Toolbar */}
//       <div className="p-4 border-b border-slate-700 flex flex-wrap gap-4 items-center justify-between">
//         <div className="relative flex-1 min-w-[280px] max-w-md">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
//           <input
//             type="text"
//             placeholder="Search by order #, description, location..."
//             value={search}
//             onChange={(e) => handleSearchChange(e.target.value)}
//             className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
//           />
//         </div>

//         <div className="flex items-center gap-3">
//           <select
//             value={locationFilter}
//             onChange={(e) => handleLocationFilterChange(e.target.value)}
//             className="px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-all cursor-pointer"
//           >
//             <option value="all">All Locations</option>
//             {locations.map((loc) => (
//               <option key={loc} value={loc}>
//                 {loc}
//               </option>
//             ))}
//           </select>

//           <div className="text-sm text-slate-400">
//             Showing {startIndex + 1}-{endIndex} of {filteredAndSortedOrders.length} orders
//             {filteredAndSortedOrders.length !== orders.length && (
//               <span className="text-slate-500"> (filtered from {orders.length})</span>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead>
//             <tr className="border-b border-slate-700 bg-slate-900/30">
//               <th className="text-left py-4 px-4 font-medium text-slate-400">
//                 <button
//                   onClick={() => handleSort('transfer_order_number')}
//                   className="flex items-center gap-2 hover:text-slate-200 transition-colors"
//                 >
//                   Order #
//                   <SortIcon field="transfer_order_number" />
//                 </button>
//               </th>
//               <th className="text-left py-4 px-4 font-medium text-slate-400">
//                 <button
//                   onClick={() => handleSort('date')}
//                   className="flex items-center gap-2 hover:text-slate-200 transition-colors"
//                 >
//                   Date
//                   <SortIcon field="date" />
//                 </button>
//               </th>
//               <th className="text-left py-4 px-4 font-medium text-slate-400">Description</th>
//               <th className="text-left py-4 px-4 font-medium text-slate-400">
//                 <button
//                   onClick={() => handleSort('from_location_name')}
//                   className="flex items-center gap-2 hover:text-slate-200 transition-colors"
//                 >
//                   From → To
//                   <SortIcon field="from_location_name" />
//                 </button>
//               </th>
//               <th className="text-left py-4 px-4 font-medium text-slate-400">
//                 <button
//                   onClick={() => handleSort('quantity_transfer')}
//                   className="flex items-center gap-2 hover:text-slate-200 transition-colors"
//                 >
//                   Qty
//                   <SortIcon field="quantity_transfer" />
//                 </button>
//               </th>
//               <th className="text-left py-4 px-4 font-medium text-slate-400">
//                 <button
//                   onClick={() => handleSort('status')}
//                   className="flex items-center gap-2 hover:text-slate-200 transition-colors"
//                 >
//                   Status
//                   <SortIcon field="status" />
//                 </button>
//               </th>
//               <th className="text-left py-4 px-4 font-medium text-slate-400">Created By</th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginatedOrders.length === 0 ? (
//               <tr>
//                 <td colSpan={7} className="py-12 text-center text-slate-400">
//                   <Truck className="w-12 h-12 mx-auto mb-3 opacity-50" />
//                   <p>No transfer orders found</p>
//                 </td>
//               </tr>
//             ) : (
//               paginatedOrders.map((order) => (
//                 <tr
//                   key={order.transfer_order_id}
//                   className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors"
//                 >
//                   <td className="py-4 px-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
//                         <Truck className="w-5 h-5 text-cyan-400" />
//                       </div>
//                       <span className="font-medium text-slate-200">
//                         {order.transfer_order_number}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="py-4 px-4 text-slate-300">
//                     {new Date(order.date).toLocaleDateString('en-GB', {
//                       day: '2-digit',
//                       month: 'short',
//                       year: 'numeric',
//                     })}
//                   </td>
//                   <td className="py-4 px-4 text-slate-400 max-w-[200px] truncate">
//                     {order.description || '-'}
//                   </td>
//                   <td className="py-4 px-4">
//                     <div className="flex items-center gap-2 text-sm">
//                       <span
//                         className="text-slate-300 max-w-[120px] truncate"
//                         title={order.from_location_name}
//                       >
//                         {order.from_location_name}
//                       </span>
//                       <ArrowRight className="w-4 h-4 text-cyan-400 flex-shrink-0" />
//                       <span
//                         className="text-slate-300 max-w-[120px] truncate"
//                         title={order.to_location_name}
//                       >
//                         {order.to_location_name}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="py-4 px-4">
//                     <span className="font-semibold text-slate-200">{order.quantity_transfer}</span>
//                     {order.quantity_transferred !== order.quantity_transfer && (
//                       <span className="text-slate-500 text-sm ml-1">
//                         ({order.quantity_transferred} done)
//                       </span>
//                     )}
//                   </td>
//                   <td className="py-4 px-4">
//                     <span
//                       className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(
//                         order.status
//                       )}`}
//                     >
//                       {order.status}
//                     </span>
//                   </td>
//                   <td className="py-4 px-4 text-slate-400 text-sm">{order.created_by_name}</td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {totalItems > 0 && (
//         <div className="p-4 border-t border-slate-700 flex flex-wrap gap-4 items-center justify-between">
//           <div className="flex items-center gap-3">
//             <span className="text-sm text-slate-400">Rows per page:</span>
//             <select
//               value={pageSize}
//               onChange={(e) => handlePageSizeChange(Number(e.target.value))}
//               className="px-3 py-1.5 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50 transition-all cursor-pointer"
//             >
//               {PAGE_SIZE_OPTIONS.map((size) => (
//                 <option key={size} value={size}>
//                   {size}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex items-center gap-2">
//             <span className="text-sm text-slate-400">
//               {startIndex + 1}-{endIndex} of {totalItems}
//             </span>
//           </div>

//           <div className="flex items-center gap-1">
//             <button
//               onClick={() => setCurrentPage(1)}
//               disabled={currentPage === 1}
//               className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//               title="First page"
//             >
//               <ChevronsLeft className="w-4 h-4" />
//             </button>
//             <button
//               onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
//               disabled={currentPage === 1}
//               className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//               title="Previous page"
//             >
//               <ChevronLeft className="w-4 h-4" />
//             </button>

//             {/* Page numbers */}
//             <div className="flex items-center gap-1 mx-2">
//               {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                 let pageNum: number;
//                 if (totalPages <= 5) {
//                   pageNum = i + 1;
//                 } else if (currentPage <= 3) {
//                   pageNum = i + 1;
//                 } else if (currentPage >= totalPages - 2) {
//                   pageNum = totalPages - 4 + i;
//                 } else {
//                   pageNum = currentPage - 2 + i;
//                 }
//                 return (
//                   <button
//                     key={pageNum}
//                     onClick={() => setCurrentPage(pageNum)}
//                     className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
//                       currentPage === pageNum
//                         ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
//                         : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
//                     }`}
//                   >
//                     {pageNum}
//                   </button>
//                 );
//               })}
//             </div>

//             <button
//               onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
//               disabled={currentPage === totalPages}
//               className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//               title="Next page"
//             >
//               <ChevronRight className="w-4 h-4" />
//             </button>
//             <button
//               onClick={() => setCurrentPage(totalPages)}
//               disabled={currentPage === totalPages}
//               className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//               title="Last page"
//             >
//               <ChevronsRight className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
