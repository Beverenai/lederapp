
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { User } from '@/types/models';

/**
 * Hook for handling Supabase authentication operations
 */
export const useSupabaseAuth = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw new Error(error.message);
      
      // Session and user will be set by the onAuthStateChange handler
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      // Session and user will be cleared by the onAuthStateChange handler
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return {
    isLoading,
    setIsLoading,
    error,
    setError,
    login,
    logout
  };
};
