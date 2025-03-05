
import React, { createContext } from 'react';
import { AuthContextType, AuthProviderProps } from './AuthContext.types';
import { useAuthState } from '@/hooks/useAuthState';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { 
    user, 
    session, 
    isLoading, 
    setIsLoading, 
    error, 
    setError, 
    authInitialized, 
    refreshUser 
  } = useAuthState();
  
  const { login, logout: supabaseLogout } = useSupabaseAuth();

  // Update logout to also clear admin user
  const handleLogout = async () => {
    setIsLoading(true);
    console.log('Logging out user:', user?.id || 'unknown');
    
    // Clear admin user if it exists
    localStorage.removeItem('oksnoen-admin-user');
    
    // Regular Supabase logout
    await supabaseLogout();
    
    // Force clear user state and redirect
    setIsLoading(false);
    
    // Redirect to login page with page reload to clear all state
    console.log('Logout complete, redirecting to login');
    window.location.href = '/';
  };

  // Determine if user is authenticated
  const isAuthenticated = !!user;

  console.log('Auth provider state:', { 
    isAuthenticated, 
    userId: user?.id || 'none',
    authInitialized,
    isLoading
  });

  // Create the context value
  const value: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    logout: handleLogout,
    isAuthenticated,
    session,
    refreshUser,
    authInitialized
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
