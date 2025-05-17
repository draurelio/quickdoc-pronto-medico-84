
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import LoginPageLayout from '@/components/auth/LoginPageLayout';

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [activeTab, setActiveTab] = useState('login');

  useEffect(() => {
    // Redirecionar para página principal se já estiver autenticado
    if (isAuthenticated) {
      navigate('/index');
    }
  }, [isAuthenticated, navigate]);

  const handleSignupSuccess = () => {
    setActiveTab('login');
    // Mostrar mensagem para verificar email se necessário
  };

  return (
    <LoginPageLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      loading={authLoading}
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
