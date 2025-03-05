
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { User } from '@/types/models';
import { fetchUserProfile } from '@/utils/userProfileUtils';
import { 
  getAdminUserFromStorage, 
  clearAdminUser 
} from '@/utils/adminUserUtils';
import { 
  createFallbackUserFromSession, 
  getCurrentSession,
  getUserFromSession
} from '@/utils/sessionUtils';

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
    try {
      setIsLoading(true);
      console.log('Refreshing user data...');
      
      // Check for admin user in localStorage first
      const adminUser = getAdminUserFromStorage();
      if (adminUser) {
        console.log('Using admin user from localStorage:', adminUser);
        setUser(adminUser);
        setIsLoading(false);
        return;
      }
      
      // Get the current session directly
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error refreshing session:', sessionError);
        setError(sessionError.message);
        setIsLoading(false);
        return;
      }
      
      if (!sessionData?.session) {
        console.log('No active session found during refresh');
        setUser(null);
        setSession(null);
        setIsLoading(false);
        return;
      }
      
      // Update session
      setSession(sessionData.session);
      
      try {
        const { user: userProfile, error: userError } = await getUserFromSession(sessionData.session);
        if (userError) {
          console.warn('Using fallback user creation due to error:', userError);
        }
        setUser(userProfile);
      } catch (err) {
        console.error('Error in user profile refresh:', err);
        // Create a fallback user from session
        const fallbackUser = createFallbackUserFromSession(sessionData.session);
        setUser(fallbackUser);
      }
    } catch (err) {
      console.error('Refresh user error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Check for existing user session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        console.log('Checking authentication status...');
        
        // Check for admin user in localStorage first
        const adminUser = getAdminUserFromStorage();
        if (adminUser) {
          setUser(adminUser);
          setSession(null);
          console.log('Found admin user in localStorage:', adminUser);
          setIsLoading(false);
          setAuthInitialized(true);
          return;
        }
        
        // Get the current session from Supabase
        const { session: currentSession, error: sessionError } = await getCurrentSession();
        
        if (sessionError) {
          setError(sessionError);
          setUser(null);
          setSession(null);
          setIsLoading(false);
          setAuthInitialized(true);
          return;
        }
        
        if (currentSession) {
          setSession(currentSession);
          const { user: userProfile } = await getUserFromSession(currentSession);
          setUser(userProfile);
        } else {
          console.log('No active session found');
          setUser(null);
          setSession(null);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setError('Authentication check failed');
        setUser(null);
        setSession(null);
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
        console.log('Auth state changed:', event, newSession?.user?.id);
        
        // If admin user exists in localStorage, prioritize that
        const adminUser = getAdminUserFromStorage();
        if (adminUser) {
          setUser(adminUser);
          setSession(null);
          setIsLoading(false);
          return;
        }
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setSession(newSession);
          
          if (newSession) {
            try {
              setIsLoading(true);
              const { user: userProfile } = await getUserFromSession(newSession);
              setUser(userProfile);
            } catch (err) {
              console.error('Error getting user profile on auth change:', err);
              const fallbackUser = createFallbackUserFromSession(newSession);
              setUser(fallbackUser);
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
