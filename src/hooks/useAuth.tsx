
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica sessão atual
    const getUser = async () => {
      setLoading(true);
      try {
        console.log('useAuth - Verificando sessão...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('useAuth - Erro ao obter sessão:', error);
        } else {
          console.log('useAuth - Sessão obtida:', data.session ? 'Existe sessão' : 'Sem sessão');
          setUser(data.session?.user || null);
        }
      } catch (error) {
        console.error('useAuth - Erro ao obter usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Configura listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('useAuth - Mudança de estado de autenticação:', event);
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    // Limpa o listener quando o componente for desmontado
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('useAuth - Tentando login:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      console.log('useAuth - Login bem-sucedido:', data.user?.email);
      return { user: data.user, error: null };
    } catch (error: any) {
      console.error('useAuth - Erro no login:', error.message);
      return { user: null, error };
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      console.log('useAuth - Tentando cadastro:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      console.log('useAuth - Cadastro bem-sucedido:', data.user?.email);
      return { user: data.user, error: null };
    } catch (error: any) {
      console.error('useAuth - Erro no cadastro:', error.message);
      return { user: null, error };
    }
  };

  const logout = async () => {
    try {
      console.log('useAuth - Realizando logout');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log('useAuth - Logout bem-sucedido');
      return { error: null };
    } catch (error: any) {
      console.error('useAuth - Erro no logout:', error.message);
      return { error };
    }
  };

  return {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };
}
