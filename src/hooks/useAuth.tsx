
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

// Admin user email for special privileges
const ADMIN_EMAIL = 'med.hospitaldraurelio@gmail.com';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if current user is admin
  const isAdmin = user?.email === ADMIN_EMAIL;

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
      async (event, session) => {
        console.log('useAuth - Mudança de estado de autenticação:', event);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setUser(session?.user || null);
          // Ensures profile is created if this is first login
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            if (!profile) {
              // Set admin flag if the user is the admin
              const isAdminUser = session.user.email === ADMIN_EMAIL;
              
              const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                  { 
                    id: session.user.id, 
                    name: session.user.email?.split('@')[0] || 'Usuário',
                    is_admin: isAdminUser
                  }
                ]);
              
              if (profileError) {
                console.error('useAuth - Erro ao criar perfil automático:', profileError);
              }
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        
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
      
      // Using signUp with email confirmation disabled for better cross-device support
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            created_at: new Date().toISOString(),
          }
        }
      });

      if (error) throw error;
      
      console.log('useAuth - Cadastro bem-sucedido:', data);
      
      // Create a profile record for the new user
      if (data.user) {
        // Check if user being created is the admin
        const isAdminUser = data.user.email === ADMIN_EMAIL;
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id, 
              name: email.split('@')[0] || 'Usuário',
              is_admin: isAdminUser 
            }
          ]);
        
        if (profileError) {
          console.error('useAuth - Erro ao criar perfil:', profileError);
        }
      }
      
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
    isAdmin,
  };
}
