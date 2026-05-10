import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isGuest, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyber-blue/30 border-t-cyber-blue rounded-full animate-spin" />
      </div>
    );
  }

  if (!user && !isGuest) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
