
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import LoginPageLayout from '@/components/auth/LoginPageLayout';
import { toast } from '@/components/ui/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading, login } = useAuth();
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
    toast({
      title: "Conta criada com sucesso",
      description: "Agora você pode fazer login com suas credenciais.",
    });
  };

  // Function to handle admin login
  const handleAdminLogin = async () => {
    try {
      const adminEmail = 'med.hospitaldraurelio@gmail.com';
      const adminPassword = 'alagoas305';
      
      const { user, error } = await login(adminEmail, adminPassword);
      
      if (error) {
        throw error;
      }
      
      if (user) {
        toast({
          title: "Login de administrador",
          description: "Bem-vindo, Administrador.",
        });
        navigate('/index');
      }
    } catch (error) {
      console.error("Erro ao fazer login de administrador:", error);
      toast({
        title: "Erro no login de administrador",
        description: "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
    }
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
