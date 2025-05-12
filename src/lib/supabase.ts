
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../integrations/supabase/types';

// Configuração do Supabase
const supabaseUrl = 'https://nhiasluiscvfhswnbzfl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oaWFzbHVpc2N2Zmhzd25iemZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMTc3NTMsImV4cCI6MjA2MTc5Mzc1M30.NdeJF_QhRbbPm9j-OnFL8EJlzFvPJf-0JrpakunlIq4';

// Criando o cliente com tipagem adequada
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Função auxiliar para verificar o status da autenticação
export const checkAuthStatus = async () => {
  try {
    const { data: session } = await supabase.auth.getSession();
    return {
      authenticated: !!session?.session?.user,
      user: session?.session?.user || null
    };
  } catch (error) {
    console.error('Erro ao verificar status de autenticação:', error);
    return {
      authenticated: false,
      user: null
    };
  }
};
