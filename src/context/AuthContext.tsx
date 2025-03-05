
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { User } from '@/types/models';
import { AuthContextType, AuthProviderProps } from './AuthContext.types';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { fetchUserProfile } from '@/utils/userProfileUtils';

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const { isLoading, setIsLoading, error, setError, login, logout } = useSupabaseAuth();

  // Check for existing user session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get the current session
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          setSession(data.session);
          const userProfile = await fetchUserProfile(data.session);
          setUser(userProfile);
        }
      } catch (err) {
        console.error('Auth error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Set up listener for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        
        if (newSession) {
          const userProfile = await fetchUserProfile(newSession);
          setUser(userProfile);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Cleanup
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setIsLoading]);

  // Determine if user is authenticated
  const isAuthenticated = !!session;

  // Create the context value
  const value: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated,
    session
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
