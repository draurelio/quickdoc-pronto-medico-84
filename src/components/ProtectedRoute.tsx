
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    console.log('ProtectedRoute - Auth state:', { isAuthenticated, loading, path: location.pathname });
  }, [isAuthenticated, loading, location.pathname]);
  
  if (loading) {
    console.log('ProtectedRoute - Loading authentication state...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medblue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute - User not authenticated, redirecting to login...');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('ProtectedRoute - User authenticated, rendering children...');
  return <>{children}</>;
};

export default ProtectedRoute;
