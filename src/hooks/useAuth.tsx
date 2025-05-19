
import React, { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Admin user email for special privileges
const ADMIN_EMAIL = 'med.hospitaldraurelio@gmail.com';

type UserStatus = 'pending' | 'approved' | 'rejected';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  userStatus: UserStatus;
  login: (email: string, password: string) => Promise<{ user: User | null; error: Error | null }>;
  signup: (email: string, password: string) => Promise<{ user: User | null; error: Error | null }>;
  logout: () => Promise<{ error: Error | null }>;
  getPendingUsers: () => Promise<any[]>;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userStatus, setUserStatus] = useState<UserStatus>('pending');

  // Check if current user is admin
  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    console.log('Auth Provider useEffect running...');
    
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
            fetchUserStatus(newSession.user.id);
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Current session:', currentSession);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserStatus(currentSession.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const fetchUserStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user status:', error);
        return;
      }
      
      // If no status or admin, treat as approved
      if (!data || !data.status || isAdmin) {
        setUserStatus('approved');
      } else {
        setUserStatus(data.status as UserStatus);
      }
    } catch (error) {
      console.error('Error in fetchUserStatus:', error);
    }
  };

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
      
      // After signup, set the user status as pending in the profiles table
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ status: 'pending' as UserStatus })
          .eq('id', data.user.id);
          
        if (profileError) {
          console.error('Error updating profile status:', profileError);
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
  
  // Admin functions to manage users
  const getPendingUsers = async () => {
    if (!isAdmin) {
      console.error('Only admins can get pending users');
      return [];
    }
    
    try {
      // Query the profiles table for pending users
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, created_at, status')
        .eq('status', 'pending');
        
      if (error) {
        console.error('Error fetching pending users:', error);
        return [];
      }
      
      // For each profile, get the email from auth.users if possible
      if (data) {
        const enhancedProfiles = await Promise.all(data.map(async (profile) => {
          // For security, we can't directly query auth.users from the client
          // So we use the id to match with the auth user's email
          const { data: userData } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', profile.id)
            .single();
            
          return {
            ...profile,
            email: userData ? userData.id : profile.id, // If we can't get email, use id
          };
        }));
        
        return enhancedProfiles;
      }
      
      return [];
    } catch (error) {
      console.error('Error in getPendingUsers:', error);
      return [];
    }
  };
  
  const approveUser = async (userId: string) => {
    if (!isAdmin) {
      throw new Error('Only admins can approve users');
    }
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'approved' as UserStatus })
        .eq('id', userId);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Usuário aprovado",
        description: "O usuário agora tem acesso ao sistema",
      });
    } catch (error: any) {
      console.error('Error approving user:', error);
      toast({
        title: "Erro ao aprovar usuário",
        description: error.message || "Não foi possível aprovar o usuário",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const rejectUser = async (userId: string) => {
    if (!isAdmin) {
      throw new Error('Only admins can reject users');
    }
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'rejected' as UserStatus })
        .eq('id', userId);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Usuário rejeitado",
        description: "O acesso do usuário foi negado",
      });
    } catch (error: any) {
      console.error('Error rejecting user:', error);
      toast({
        title: "Erro ao rejeitar usuário",
        description: error.message || "Não foi possível rejeitar o usuário",
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    isAdmin,
    userStatus,
    login,
    signup,
    logout,
    getPendingUsers,
    approveUser,
    rejectUser,
  };

  return (
    <AuthContext.Provider value={value}>
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
