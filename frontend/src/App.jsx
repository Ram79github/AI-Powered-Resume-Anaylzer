import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { ErrorState, LoadingState } from './components/States.jsx';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});
const Auth = lazy(() => import('./pages/Auth.jsx'));
const History = lazy(() => import('./pages/History.jsx'));
const Home = lazy(() => import('./pages/Home.jsx'));
const Report = lazy(() => import('./pages/Report.jsx'));

function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingState label="Loading page…" />}>
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth initialMode="register" />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/history" element={<Layout><History /></Layout>} />
            <Route path="/reports/:id" element={<Layout><Report /></Layout>} />
          </Route>
          <Route path="*" element={<main className="auth-layout"><div><ErrorState message="Page not found" /><a href="/">Return to the analyzer</a></div></main>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
    </QueryClientProvider>
  );
}
