
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
    // Verify current session
    const checkSession = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Authentication error:', error);
        } else {
          setUser(data.session?.user || null);
        }
      } catch (error) {
        console.error('Failed to get user session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Setup authentication state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setUser(session?.user || null);
          
          // Create profile if this is first login
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
                    name: session.user.email?.split('@')[0] || 'User',
                    is_admin: isAdminUser
                  }
                ]);
              
              if (profileError) {
                console.error('Error creating automatic profile:', profileError);
              }
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // Clean up listener when component unmounts
    return () => {
      authListener.subscription.unsubscribe();
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
      
      // Create a profile record for the new user
      if (data.user) {
        // Check if user being created is the admin
        const isAdminUser = data.user.email === ADMIN_EMAIL;
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id, 
              name: email.split('@')[0] || 'User',
              is_admin: isAdminUser 
            }
          ]);
        
        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }
      
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
