
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
