
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nhiasluiscvfhswnbzfl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oaWFzbHVpc2N2Zmhzd25iemZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMTc3NTMsImV4cCI6MjA2MTc5Mzc1M30.NdeJF_QhRbbPm9j-OnFL8EJlzFvPJf-0JrpakunlIq4';

// Create Supabase client with additional options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storageKey: 'quickdoc-auth-token',
  }
});
