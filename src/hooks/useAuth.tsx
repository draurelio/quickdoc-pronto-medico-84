
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Admin user email for special privileges
const ADMIN_EMAIL = 'med.hospitaldraurelio@gmail.com';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ user: User | null; error: Error | null }>;
  signup: (email: string, password: string) => Promise<{ user: User | null; error: Error | null }>;
  logout: () => Promise<{ error: Error | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if current user is admin
  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth state changed:', event);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Using setTimeout to avoid potential deadlocks with Supabase's auth system
        if (event === 'SIGNED_IN' && newSession?.user) {
          setTimeout(() => {
            console.log('User signed in:', newSession.user);
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Current session:', currentSession);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      return { user: data.user, error: null };
    } catch (error: any) {
      console.error('Login error:', error.message);
      return { user: null, error };
    }
  };

  const signup = async (email: string, password: string) => {
    try {
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
      
      return { user: data.user, error: null };
    } catch (error: any) {
      console.error('Signup error:', error.message);
      return { user: null, error };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Logout error:', error.message);
      return { error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAuthenticated: !!user,
        isAdmin,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
