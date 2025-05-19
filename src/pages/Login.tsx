
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import LoginPageLayout from '@/components/auth/LoginPageLayout';
import { toast } from '@/components/ui/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  
  // Get the redirect path from location state or default to /index
  const from = location.state?.from?.pathname || '/index';

  useEffect(() => {
    // Redirect to intended page if already authenticated
    if (isAuthenticated && !loading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, from]);

  const handleSignupSuccess = () => {
    setActiveTab('login');
    toast({
      title: "Conta criada com sucesso",
      description: "Agora você pode fazer login com suas credenciais.",
    });
  };

  return (
    <LoginPageLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      loading={loading}
      loginForm={
        <LoginForm 
          email={email} 
          setEmail={setEmail} 
        />
      }
      signupForm={
        <SignupForm 
          email={email} 
          setEmail={setEmail} 
          onSignupSuccess={handleSignupSuccess} 
        />
      }
    />
  );
};

export default Login;
