
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
    try {
      // Check for admin user in localStorage first
      const adminUser = localStorage.getItem('oksnoen-admin-user');
      if (adminUser) {
        try {
          const parsedUser = JSON.parse(adminUser);
          setUser(parsedUser);
          console.log('Using admin user from localStorage:', parsedUser);
          return;
        } catch (err) {
          console.error('Error parsing admin user:', err);
          localStorage.removeItem('oksnoen-admin-user');
          // Continue with normal auth flow if admin user parse fails
        }
      }
      
      if (session) {
        try {
          setIsLoading(true);
          console.log('Refreshing user profile with session:', session.user.id);
          const userProfile = await fetchUserProfile(session);
          console.log('Refreshed user profile:', userProfile);
          setUser(userProfile);
        } catch (err) {
          console.error('Error refreshing user profile:', err);
          // Create a fallback user from session if profile fetch fails
          createFallbackUserFromSession(session);
        } finally {
          setIsLoading(false);
        }
      } else {
        setUser(null);
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Refresh user error:', err);
      setIsLoading(false);
    }
  };

  // Helper function to create a basic user from session data
  const createFallbackUserFromSession = (userSession: Session) => {
    console.log('Creating fallback user from session:', userSession.user);
    const userData = userSession.user;
    
    // Extract role from user metadata if available
    const role = userData.user_metadata?.role || 'leader';
    
    const fallbackUser: User = {
      id: userData.id,
      name: userData.user_metadata?.firstName || userData.email?.split('@')[0] || 'Bruker',
      email: userData.email || '',
      role: role
    };
    
    console.log('Created fallback user:', fallbackUser);
    setUser(fallbackUser);
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
            const parsedUser = JSON.parse(adminUser);
            setUser(parsedUser);
            setSession(null);
            console.log('Found admin user in localStorage:', parsedUser);
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
          setUser(null);
          setSession(null);
          setIsLoading(false);
          setAuthInitialized(true);
          return;
        }
        
        console.log('Session check result:', data?.session ? 'Active session' : 'No session');
        
        if (data.session) {
          setSession(data.session);
          try {
            console.log('Fetching user profile with session ID:', data.session.user.id);
            const userProfile = await fetchUserProfile(data.session);
            console.log('Initial user profile loaded:', userProfile);
            setUser(userProfile);
          } catch (profileErr) {
            console.error('Error loading user profile:', profileErr);
            createFallbackUserFromSession(data.session);
          }
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
        const adminUser = localStorage.getItem('oksnoen-admin-user');
        if (adminUser) {
          try {
            const parsedUser = JSON.parse(adminUser);
            setUser(parsedUser);
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
              console.log('Auth change: fetching user profile with ID:', newSession.user.id);
              const userProfile = await fetchUserProfile(newSession);
              console.log('User profile updated after auth change:', userProfile);
              setUser(userProfile);
            } catch (err) {
              console.error('Error getting user profile on auth change:', err);
              createFallbackUserFromSession(newSession);
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
