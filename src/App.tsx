import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { ItemsPage } from './pages/ItemsPage';
import { CompositePage } from './pages/CompositePage';
import { TransferOrdersPage } from './pages/TransferOrdersPage';
import { LowStockPage } from './pages/LowStockPage';
import { InStockPage } from './pages/InStockPage';
import { LocationsPage } from './pages/LocationsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/in-stock" element={<InStockPage />} />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/items" element={<ItemsPage />} />
            <Route path="/composite" element={<CompositePage />} />
            <Route path="/transfers" element={<TransferOrdersPage />} />
            <Route path="/low-stock" element={<LowStockPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
