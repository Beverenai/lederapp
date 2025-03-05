
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
        throw new Error('Brukernavn/E-post og passord er påkrevd');
      }
      
      console.log('Attempting login with:', email);
      
      // Special case: admin quick login
      if (email.toLowerCase() === 'admin' && password === 'admin') {
        console.log('Admin login detected, bypassing Supabase');
        const adminUser = {
          id: '1',
          name: 'Admin',
          email: 'admin@oksnoen.no',
          role: 'admin',
        };
        
        localStorage.setItem('oksnoen-admin-user', JSON.stringify(adminUser));
        console.log('Admin user set in localStorage');
        return;
      }
      
      // For regular users, attempt email login
      console.log('Standard login with:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error.message);
        
        // Provide user-friendly error message in Norwegian
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Feil brukernavn/e-post eller passord');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('E-posten er ikke bekreftet. Sjekk innboksen din for en bekreftelseslenke.');
        } else if (error.message.includes('Invalid email')) {
          throw new Error('Ugyldig e-post format');
        } else {
          throw new Error(error.message);
        }
      }
      
      console.log('Login successful, data:', data ? 'Session found' : 'No session');
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
      console.log('Starting logout process');
      
      // Clear admin user if it exists
      const adminUser = localStorage.getItem('oksnoen-admin-user');
      if (adminUser) {
        console.log('Removing admin user from localStorage');
        localStorage.removeItem('oksnoen-admin-user');
      }
      
      // Perform Supabase signout
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error from Supabase:', error);
        throw error;
      }
      
      console.log('Logged out successfully');
      // Session and user will be cleared by the onAuthStateChange handler
    } catch (err) {
      console.error('Logout error:', err);
      throw err;
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
