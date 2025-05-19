
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, loading, isAdmin, userStatus } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    console.log('ProtectedRoute - Auth state:', { isAuthenticated, loading, isAdmin, userStatus, path: location.pathname });
  }, [isAuthenticated, loading, isAdmin, userStatus, location.pathname]);
  
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
  
  // Check if admin access is required
  if (requireAdmin && !isAdmin) {
    console.log('ProtectedRoute - Admin access required, redirecting to home...');
    toast({
      title: "Acesso negado",
      description: "Você não tem permissões de administrador para acessar esta página",
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }
  
  // Check if user is approved (unless they're an admin)
  if (!isAdmin && userStatus !== 'approved') {
    console.log('ProtectedRoute - User not approved, showing pending message...');
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-yellow-500 mx-auto mb-4">
            <svg className="h-16 w-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Conta pendente de aprovação</h2>
          {userStatus === 'pending' ? (
            <p className="text-gray-600 mb-6">
              Sua conta está aguardando aprovação do administrador. 
              Você receberá acesso ao sistema assim que sua conta for aprovada.
            </p>
          ) : (
            <p className="text-gray-600 mb-6">
              Sua solicitação de acesso foi negada pelo administrador.
              Entre em contato com o administrador do sistema para mais informações.
            </p>
          )}
          <button 
            onClick={() => window.location.href = "/login"}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Voltar para o login
          </button>
        </div>
      </div>
    );
  }

  console.log('ProtectedRoute - User authenticated and approved, rendering children...');
  return <>{children}</>;
};

export default ProtectedRoute;
