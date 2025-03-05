
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { User, UserRole } from '@/types/models';

/**
 * Fetches user profile from Supabase and converts it to our User model
 */
export const fetchUserProfile = async (userSession: Session): Promise<User | null> => {
  try {
    if (!userSession?.user?.id) {
      console.error('No user ID in session');
      return null;
    }
    
    const userId = userSession.user.id;
    console.log('Fetching profile for user ID:', userId);
    
    try {
      // Get the profile data directly
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        // Instead of throwing error, continue with metadata-only profile
        console.log('Using fallback profile from auth metadata');
      }

      // Get metadata from the session's user object
      const authUser = userSession.user;
      const metadata = authUser.user_metadata || {};
      
      console.log('Auth user metadata:', metadata);

      if (profile) {
        console.log('Profile data:', profile);
        // Convert Supabase profile to our User type
        const userData: User = {
          id: profile.id,
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Bruker',
          email: profile.email || authUser.email || '',
          role: (profile.role as UserRole) || 'leader',
          image: profile.avatar_url,
          age: profile.age,
          skills: [], // Optional
          notes: profile.notes,
          activities: [], // Optional
          team: profile.team,
          phone: profile.phone,
          hasDriverLicense: profile.has_driving_license,
          hasCar: profile.has_car,
          hasBoatLicense: profile.has_boat_license,
          rappellingAbility: profile.rappelling_ability as any,
          ziplineAbility: profile.zipline_ability as any,
          climbingAbility: profile.climbing_ability as any,
        };

        console.log('Converted user data:', userData);
        return userData;
      } else {
        // If no profile found or error, create user from auth metadata
        console.log('Creating user from auth metadata');
        
        // Extract role from metadata, default to leader
        const role = metadata.role || 'leader';
        
        // Create a basic user object from auth metadata
        const userData: User = {
          id: authUser.id,
          name: `${metadata.firstName || ''} ${metadata.lastName || ''}`.trim() || authUser.email?.split('@')[0] || 'Bruker',
          email: authUser.email || '',
          role: role as UserRole,
          // If metadata contains additional profile fields, use them
          phone: metadata.phone,
          hasDriverLicense: metadata.hasDrivingLicense,
          hasCar: metadata.hasCar,
          hasBoatLicense: metadata.hasBoatLicense,
          rappellingAbility: metadata.rappellingAbility,
          ziplineAbility: metadata.ziplineAbility,
          climbingAbility: metadata.climbingAbility
        };
        
        console.log('Created user from metadata:', userData);
        return userData;
      }
    } catch (err) {
      console.error('Error in profile fetching:', err);
      
      // Fallback user creation from auth metadata only
      const metadata = userSession.user.user_metadata || {};
      return {
        id: userSession.user.id,
        name: metadata.firstName || userSession.user.email?.split('@')[0] || 'Bruker',
        email: userSession.user.email || '',
        role: (metadata.role || 'leader') as UserRole
      };
    }
  } catch (err) {
    console.error('Fatal error fetching user profile:', err);
    // Return a minimal valid user to prevent login failures
    return {
      id: userSession.user.id,
      name: userSession.user.email?.split('@')[0] || 'Bruker',
      email: userSession.user.email || '',
      role: 'leader'
    };
  }
};

/**
 * Checks if a user profile needs completion
 */
export const needsProfileCompletion = (user: User | null): boolean => {
  if (!user) return false;
  
  // Admin user always has a complete profile
  if (user.id === '1') return false;
  
  return (
    !user.phone || 
    user.hasDriverLicense === undefined || 
    user.hasBoatLicense === undefined ||
    user.rappellingAbility === undefined ||
    user.ziplineAbility === undefined ||
    user.climbingAbility === undefined
  );
};
