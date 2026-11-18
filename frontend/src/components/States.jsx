export function LoadingState({ label = 'Loading…' }) {
  return <p className="state-message" role="status">{label}</p>;
}

export function ErrorState({ message }) {
  return <p className="notice notice-error" role="alert">{message}</p>;
}

export function EmptyState({ children }) {
  return <p className="state-message">{children}</p>;
}
