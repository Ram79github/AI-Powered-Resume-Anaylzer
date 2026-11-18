import { Navigate, Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api.js';
import { ErrorState, LoadingState } from './States.jsx';

export default function ProtectedRoute() {
  const auth = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        return await api('/api/auth/me');
      } catch (error) {
        if (error.message === 'Sign in to continue' || error.message === 'Please sign in again') {
          try {
            await api('/api/auth/refresh', { method: 'POST' });
            return api('/api/auth/me');
          } catch {
            return null;
          }
        }
        throw error;
      }
    },
    retry: false,
  });

  if (auth.isPending) return <LoadingState label="Checking your session…" />;
  if (auth.error) return <ErrorState message={auth.error.message} />;
  if (!auth.data?.data?.user) return <Navigate to="/login" replace />;
  return <Outlet />;
}
