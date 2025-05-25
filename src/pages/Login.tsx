
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from '@/components/auth/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRound } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState('');
  
  // Get the redirect path from location state or default to /index
  const from = location.state?.from?.pathname || '/index';

  useEffect(() => {
    // Redirect to intended page if already authenticated
    if (isAuthenticated && !loading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, from]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medblue-600"></div>
      </div>
    );
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-8 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="bg-gradient-to-r from-medblue-100 to-medblue-50">
          <div className="flex flex-col items-center space-y-2">
            <UserRound className="h-12 w-12 text-medblue-600" />
            <CardTitle className="text-xl text-medblue-800 text-center">
              Acesso ao Sistema
            </CardTitle>
            <CardDescription className="text-center">
              Faça login para acessar o sistema
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="mt-6">
          <LoginForm 
            email={email} 
            setEmail={setEmail} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
