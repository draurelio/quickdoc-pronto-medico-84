
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { syncLocalModelsToSupabase } from '@/utils/syncLocalModelsToSupabase';

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ email, setEmail }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      const { user, error } = await login(email, password);

      if (error) {
        throw error;
      }

      if (user) {
        // Sincronizar modelos locais com Supabase após login
        await syncLocalModelsToSupabase(user.id);

        // Check if admin login
        const isAdmin = email === 'med.hospitaldraurelio@gmail.com';
        
        toast({
          title: isAdmin ? "Login de Administrador" : "Login realizado com sucesso",
          description: "Você será redirecionado para a página inicial.",
        });
        
        navigate('/index');
      } else {
        throw new Error("Falha no login. Por favor, tente novamente.");
      }
    } catch (error: any) {
      let errorMessage = "Verifique suas credenciais e tente novamente.";
      
      if (error.message === "Invalid login credentials") {
        errorMessage = "Email ou senha incorretos.";
      } else if (error.message?.includes("network")) {
        errorMessage = "Erro de conexão. Verifique sua internet.";
      }
      
      toast({
        title: "Erro ao fazer login",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Detalhes do erro de login:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to pre-fill admin credentials
  const fillAdminCredentials = () => {
    setEmail('med.hospitaldraurelio@gmail.com');
    setPassword('alagoas305');
    toast({
      title: "Credenciais de administrador",
      description: "Credenciais de administrador preenchidas, clique em Entrar.",
    });
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu.email@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center">
            <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
            Entrando...
          </span>
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" />
            Entrar
          </>
        )}
      </Button>
      
      <div className="text-center pt-2">
        <button 
          type="button"
          className="text-xs text-gray-500 hover:text-gray-700"
          onClick={fillAdminCredentials}
        >
          Entrar como administrador
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
