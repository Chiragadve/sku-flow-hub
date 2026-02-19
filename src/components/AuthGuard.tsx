import { Navigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { state } = useApp();
  if (!state.isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
