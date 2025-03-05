
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for handling Supabase authentication operations
 */
export const useSupabaseAuth = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Login function - properly returns void as expected by the AuthContext type
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error('E-post og passord er påkrevd');
      }
      
      console.log('Attempting login with email:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error.message);
        
        // Provide user-friendly error message in Norwegian
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Feil e-post eller passord');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('E-posten er ikke bekreftet. Sjekk innboksen din for en bekreftelseslenke.');
        } else {
          throw new Error(error.message);
        }
      }
      
      console.log('Login successful:', data);
      // Don't return data, just let the auth state change listener handle it
      return;
    } catch (err: any) {
      console.error('Login process error:', err.message);
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
      console.log('Logged out successfully');
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
