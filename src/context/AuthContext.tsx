
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
      console.log('Admin user refreshed from localStorage');
      return;
    }
    
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
      setIsLoading(true);
      console.log('Checking authentication status...');
      
      try {
        // Check for admin user in localStorage first
        const adminUser = localStorage.getItem('oksnoen-admin-user');
        if (adminUser) {
          console.log('Found admin user in localStorage:', adminUser);
          setUser(JSON.parse(adminUser));
          setIsLoading(false);
          setAuthInitialized(true);
          return;
        }
        
        // Get the current session from Supabase
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setError(sessionError.message);
          setIsLoading(false);
          setAuthInitialized(true);
          return;
        }
        
        if (data.session) {
          console.log('Found existing session:', data.session.user.id);
          setSession(data.session);
          try {
            const userProfile = await fetchUserProfile(data.session);
            console.log('User profile loaded:', userProfile);
            setUser(userProfile);
          } catch (profileErr) {
            console.error('Error loading user profile:', profileErr);
            setError('Failed to load user profile');
          }
        } else {
          console.log('No active session found');
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setError('Authentication check failed');
      } finally {
        // Always mark auth as initialized and loading as complete
        setIsLoading(false);
        setAuthInitialized(true);
        console.log('Auth check complete, initialized:', true);
      }
    };

    // Execute the check immediately
    checkAuth();

    // Set up listener for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event, newSession?.user?.id);
        
        // If admin user exists in localStorage, prioritize that
        const adminUser = localStorage.getItem('oksnoen-admin-user');
        if (adminUser) {
          console.log('Admin user found in localStorage during auth change');
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
            setUser(null);
          } finally {
            setIsLoading(false);
          }
        } else {
          setUser(null);
          setIsLoading(false);
        }
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
