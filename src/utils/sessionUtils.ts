
import { Session } from '@supabase/supabase-js';
import { User } from '@/types/models';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserProfile } from './userProfileUtils';

/**
 * Creates a fallback user from session data when profile fetch fails
 */
export const createFallbackUserFromSession = (userSession: Session): User => {
  console.log('Creating fallback user from session:', userSession.user.id);
  const userData = userSession.user;
  
  // Extract user metadata including role
  const metadata = userData.user_metadata || {};
  
  // Extract role from user metadata if available, default to 'leader'
  const role = metadata.role || 'leader';
  
  const fallbackUser: User = {
    id: userData.id,
    name: metadata.firstName 
      ? `${metadata.firstName} ${metadata.lastName || ''}`.trim() 
      : (userData.email?.split('@')[0] || 'Bruker'),
    email: userData.email || '',
    role: role,
    // Include any metadata fields that might exist
    age: metadata.age,
    phone: metadata.phone,
    hasDriverLicense: metadata.hasDriverLicense,
    hasCar: metadata.hasCar,
    hasBoatLicense: metadata.hasBoatLicense,
    rappellingAbility: metadata.rappellingAbility,
    ziplineAbility: metadata.ziplineAbility,
    climbingAbility: metadata.climbingAbility
  };
  
  console.log('Created fallback user:', fallbackUser);
  return fallbackUser;
};

/**
 * Gets the current session from Supabase
 */
export const getCurrentSession = async () => {
  try {
    console.log('Getting current session from Supabase');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Session error:', error.message);
      return { session: null, error: error.message };
    }
    
    console.log('Session check result:', data?.session ? 'Active session found' : 'No active session');
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
    
    // Attempt to get user profile from database
    try {
      const userProfile = await fetchUserProfile(session);
      
      if (userProfile) {
        console.log('User profile loaded successfully:', userProfile.id);
        return { user: userProfile, error: null };
      } else {
        console.warn('No user profile found, using fallback');
        const fallbackUser = createFallbackUserFromSession(session);
        return { user: fallbackUser, error: 'No user profile found' };
      }
    } catch (profileErr) {
      console.error('Error loading user profile:', profileErr);
      const fallbackUser = createFallbackUserFromSession(session);
      return { user: fallbackUser, error: 'Error loading user profile' };
    }
  } catch (err) {
    console.error('Error in getUserFromSession:', err);
    const fallbackUser = createFallbackUserFromSession(session);
    return { user: fallbackUser, error: 'Error processing user session' };
  }
};
