
import { Session } from '@supabase/supabase-js';
import { User } from '@/types/models';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserProfile } from './userProfileUtils';

/**
 * Creates a fallback user from session data when profile fetch fails
 */
export const createFallbackUserFromSession = (userSession: Session): User => {
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
  return fallbackUser;
};

/**
 * Gets the current session from Supabase
 */
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Session error:', error.message);
      return { session: null, error: error.message };
    }
    
    console.log('Session check result:', data?.session ? 'Active session' : 'No session');
    return { session: data.session, error: null };
  } catch (err) {
    console.error('Auth check error:', err);
    return { session: null, error: 'Authentication check failed' };
  }
};

/**
 * Fetches user data from an active session
 */
export const getUserFromSession = async (session: Session) => {
  try {
    console.log('Fetching user profile with session ID:', session.user.id);
    const userProfile = await fetchUserProfile(session);
    console.log('User profile loaded:', userProfile);
    return { user: userProfile, error: null };
  } catch (profileErr) {
    console.error('Error loading user profile:', profileErr);
    const fallbackUser = createFallbackUserFromSession(session);
    return { user: fallbackUser, error: 'Error loading user profile' };
  }
};
