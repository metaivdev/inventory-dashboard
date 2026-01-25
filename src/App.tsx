import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import type { ReactNode } from 'react';

// Auth Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { SetPassword } from './pages/SetPassword';
import { SuccessScreen } from './pages/SuccessScreen';

// App Pages
import { ProjectPage } from './pages/ProjectPage';

// Layout
import { Layout } from './components/Layout';
import { Projects } from './pages/Projects';

interface RouteConfig {
  path: string;
  element: ReactNode;
}

// Auth routes - no sidebar
const authRoutes: RouteConfig[] = [
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/set-password', element: <SetPassword /> },
  { path: '/success', element: <SuccessScreen /> },
];

// App routes - with sidebar/layout
const appRoutes: RouteConfig[] = [
  { path: '/', element: <Projects /> },
  { path: '/dashboard', element: <Projects /> },
  { path: '/projects', element: <Projects /> },
  { path: '/project/:projectId', element: <ProjectPage /> },
];

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
    <ChakraProvider value={defaultSystem}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* Auth routes - no layout/sidebar */}
            {authRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}

            {/* App routes - with layout/sidebar */}
            {appRoutes.map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={<Layout>{element}</Layout>}
              />
            ))}
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
