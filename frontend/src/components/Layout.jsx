import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api.js';
import { ErrorState } from './States.jsx';

export default function Layout({ children }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const logout = useMutation({
    mutationFn: () => api('/api/auth/logout', { method: 'POST' }),
    onSuccess: () => {
      queryClient.clear();
      navigate('/login');
    },
  });

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link to="/" className="brand" aria-label="Resume Lens home">
          <span className="brand-mark" aria-hidden="true">R</span>
          <span>resume<span className="brand-accent">lens</span></span>
        </Link>
        <nav aria-label="Main navigation">
          <NavLink to="/" end>Analyzer</NavLink>
          <NavLink to="/history">History</NavLink>
        </nav>
        <button className="button button-quiet" type="button" disabled={logout.isPending} onClick={() => logout.mutate()}>
          {logout.isPending ? 'Signing out…' : 'Sign out'}
        </button>
      </header>
      {logout.error && <div className="page-container"><ErrorState message={logout.error.message} /></div>}
      <main>{children}</main>
      <footer className="site-footer">Your next opportunity starts with a sharper resume.</footer>
    </div>
  );
}
