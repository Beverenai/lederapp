
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { User } from '@/types/models';
import { fetchUserProfile } from '@/utils/userProfileUtils';

/**
 * Hook that manages authentication state and session handling
 */
export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to refresh user data
  const refreshUser = async () => {
    // Check for admin user in localStorage first
    const adminUser = localStorage.getItem('oksnoen-admin-user');
    if (adminUser) {
      try {
        setUser(JSON.parse(adminUser));
        return;
      } catch (err) {
        console.error('Error parsing admin user:', err);
        // Continue with normal auth flow if admin user parse fails
      }
    }
    
    if (session) {
      try {
        setIsLoading(true);
        const userProfile = await fetchUserProfile(session);
        setUser(userProfile);
      } catch (err) {
        console.error('Error refreshing user profile:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Check for existing user session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        console.log('Checking authentication status...');
        
        // Check for admin user in localStorage first
        const adminUser = localStorage.getItem('oksnoen-admin-user');
        if (adminUser) {
          try {
            setUser(JSON.parse(adminUser));
            console.log('Found admin user in localStorage');
            setIsLoading(false);
            setAuthInitialized(true);
            return;
          } catch (err) {
            console.error('Error parsing admin user:', err);
            localStorage.removeItem('oksnoen-admin-user');
            // Continue with normal auth flow
          }
        }
        
        // Get the current session from Supabase
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError.message);
          setError(sessionError.message);
          setIsLoading(false);
          setAuthInitialized(true);
          return;
        }
        
        console.log('Session check result:', data?.session ? 'Active session' : 'No session');
        
        if (data.session) {
          setSession(data.session);
          try {
            const userProfile = await fetchUserProfile(data.session);
            setUser(userProfile);
            console.log('User profile loaded:', userProfile?.email);
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
        console.log('Auth initialized');
      }
    };

    // Execute the check immediately
    checkAuth();

    // Set up listener for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);
        
        // If admin user exists in localStorage, prioritize that
        const adminUser = localStorage.getItem('oksnoen-admin-user');
        if (adminUser) {
          try {
            setUser(JSON.parse(adminUser));
            setSession(null);
            setIsLoading(false);
            return;
          } catch (err) {
            console.error('Error parsing admin user:', err);
            localStorage.removeItem('oksnoen-admin-user');
            // Continue with normal auth flow
          }
        }
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setSession(newSession);
          
          if (newSession) {
            try {
              setIsLoading(true);
              const userProfile = await fetchUserProfile(newSession);
              setUser(userProfile);
              console.log('User profile updated after auth change:', userProfile?.email);
            } catch (err) {
              console.error('Error getting user profile:', err);
              setUser(null);
            } finally {
              setIsLoading(false);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
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
  }, []);

  return {
    user,
    setUser,
    session,
    setSession,
    isLoading,
    setIsLoading,
    error,
    setError,
    authInitialized,
    refreshUser
  };
};
