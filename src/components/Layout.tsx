import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Boxes, 
  AlertTriangle,
  Truck,
  Settings,
  PackageCheck,
  MapPin
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/in-stock', label: 'In Stock', icon: PackageCheck },
  { path: '/locations', label: 'Locations', icon: MapPin },
  { path: '/items', label: 'All Items', icon: Package },
  { path: '/composite', label: 'Composite Items', icon: Boxes },
  { path: '/transfers', label: 'Transfer Orders', icon: Truck },
  { path: '/low-stock', label: 'Low Stock', icon: AlertTriangle },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center">
              <Boxes className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Meta4</h1>
              <p className="text-xs text-slate-400">Inventory Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-400 border-l-2 border-emerald-400'
                        : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 cursor-pointer transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

