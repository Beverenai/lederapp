
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
  const [authInitialized, setAuthInitialized] = useState(false);
  const { isLoading, setIsLoading, error, setError, login, logout } = useSupabaseAuth();

  // Function to refresh user data
  const refreshUser = async () => {
    // Check for admin user in localStorage first
    const adminUser = localStorage.getItem('oksnoen-admin-user');
    if (adminUser) {
      setUser(JSON.parse(adminUser));
      return;
    }
    
    if (session) {
      try {
        const userProfile = await fetchUserProfile(session);
        setUser(userProfile);
      } catch (err) {
        console.error('Error refreshing user profile:', err);
      }
    }
  };

  // Check for existing user session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check for admin user in localStorage first
        const adminUser = localStorage.getItem('oksnoen-admin-user');
        if (adminUser) {
          setUser(JSON.parse(adminUser));
          setIsLoading(false);
          setAuthInitialized(true);
          return;
        }
        
        // Get the current session from Supabase
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          setError(sessionError.message);
          setIsLoading(false);
          setAuthInitialized(true);
          return;
        }
        
        if (data.session) {
          setSession(data.session);
          try {
            const userProfile = await fetchUserProfile(data.session);
            setUser(userProfile);
          } catch (profileErr) {
            console.error('Error loading user profile:', profileErr);
            setError('Failed to load user profile');
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setError('Authentication check failed');
      } finally {
        // Always mark auth as initialized and loading as complete
        setIsLoading(false);
        setAuthInitialized(true);
      }
    };

    // Execute the check immediately
    checkAuth();

    // Set up listener for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        // If admin user exists in localStorage, prioritize that
        const adminUser = localStorage.getItem('oksnoen-admin-user');
        if (adminUser) {
          setUser(JSON.parse(adminUser));
          setSession(null);
          setIsLoading(false);
          return;
        }
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setSession(newSession);
          
          if (newSession) {
            try {
              setIsLoading(true);
              const userProfile = await fetchUserProfile(newSession);
              setUser(userProfile);
            } catch (err) {
              console.error('Error getting user profile:', err);
              setUser(null);
            } finally {
              setIsLoading(false);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
        }
        
        // Always ensure isLoading is false after auth state change
        setIsLoading(false);
      }
    );

    // Cleanup
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setIsLoading, setError]);

  // Update logout to also clear admin user
  const handleLogout = async () => {
    setIsLoading(true);
    // Clear admin user if it exists
    localStorage.removeItem('oksnoen-admin-user');
    
    // Regular Supabase logout
    await logout();
    
    // Force clear user state
    setUser(null);
    setSession(null);
    setIsLoading(false);
    
    // Redirect to login page
    window.location.href = '/';
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
    refreshUser,
    authInitialized
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
