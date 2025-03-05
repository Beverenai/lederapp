
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

  // Function to refresh user data
  const refreshUser = async () => {
    if (session) {
      try {
        const userProfile = await fetchUserProfile(session);
        setUser(userProfile);
        console.log('User profile refreshed:', userProfile);
      } catch (err) {
        console.error('Error refreshing user profile:', err);
      }
    }
  };

  // Check for existing user session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for admin user in localStorage first
        const adminUser = localStorage.getItem('oksnoen-admin-user');
        if (adminUser) {
          setUser(JSON.parse(adminUser));
          setIsLoading(false);
          return;
        }
        
        // Get the current session from Supabase
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          console.log('Found existing session:', data.session.user.id);
          setSession(data.session);
          const userProfile = await fetchUserProfile(data.session);
          console.log('User profile:', userProfile);
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
        console.log('Auth state changed:', event, newSession?.user.id);
        
        // If admin user exists in localStorage, prioritize that
        const adminUser = localStorage.getItem('oksnoen-admin-user');
        if (adminUser) {
          setUser(JSON.parse(adminUser));
          setSession(null);
          setIsLoading(false);
          return;
        }
        
        setSession(newSession);
        
        if (newSession) {
          try {
            const userProfile = await fetchUserProfile(newSession);
            console.log('User profile from auth change:', userProfile);
            setUser(userProfile);
          } catch (err) {
            console.error('Error getting user profile:', err);
          }
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

  // Update logout to also clear admin user
  const handleLogout = async () => {
    // Clear admin user if it exists
    localStorage.removeItem('oksnoen-admin-user');
    
    // Regular Supabase logout
    await logout();
  };

  // Determine if user is authenticated
  const isAuthenticated = !!user;

  // Create the context value
  const value: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    logout: handleLogout,
    isAuthenticated,
    session,
    refreshUser
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
