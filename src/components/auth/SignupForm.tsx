
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { UserRound } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface SignupFormProps {
  email: string;
  setEmail: (email: string) => void;
  onSignupSuccess: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ email, setEmail, onSignupSuccess }) => {
  const { signup } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
      return;
    }
    
    if (!validatePassword(password)) {
      toast({
        title: "Senha fraca",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Senhas não conferem",
        description: "As senhas digitadas não são iguais.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      const { user, error } = await signup(email, password);

      if (error) {
        throw error;
      }

      toast({
        title: "Solicitação de cadastro enviada",
        description: "Sua conta foi criada, mas precisa ser aprovada pelo administrador antes que você possa fazer login.",
        duration: 8000,
      });
      
      // Clear password fields after successful signup
      setPassword('');
      setConfirmPassword('');
      
      // Change to login tab after signup
      onSignupSuccess();
    } catch (error: any) {
      const errorMsg = error.message || "Ocorreu um erro ao criar sua conta.";
      
      // More user-friendly error messages
      let userFriendlyMessage = errorMsg;
      if (errorMsg.includes("User already registered")) {
        userFriendlyMessage = "Este email já está cadastrado. Tente fazer login.";
      } else if (errorMsg.includes("network")) {
        userFriendlyMessage = "Erro de conexão. Verifique sua internet.";
      }
      
      toast({
        title: "Erro ao criar conta",
        description: userFriendlyMessage,
        variant: "destructive",
      });
      console.error("Detalhes do erro de cadastro:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="seu.email@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password">Senha</Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
        />
        <p className="text-xs text-gray-500">A senha deve ter pelo menos 6 caracteres</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirmar Senha</Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
      </div>
      
      <div className="rounded-md bg-blue-50 p-4 mt-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Após o cadastro, um administrador precisará aprovar seu acesso antes que você possa fazer login.
            </p>
          </div>
        </div>
      </div>
      
      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center">
            <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
            Cadastrando...
          </span>
        ) : (
          <>
            <UserRound className="mr-2 h-4 w-4" />
            Criar Conta
          </>
        )}
      </Button>
    </form>
  );
};

export default SignupForm;
