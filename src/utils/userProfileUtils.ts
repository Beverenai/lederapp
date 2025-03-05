
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
    
    // Get the profile data directly (don't try to access auth.users table)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      throw profileError;
    }

    // Get metadata from the session's user object instead
    const authUser = userSession.user;
    const metadata = authUser.user_metadata || {};

    if (profile) {
      // Convert Supabase profile to our User type
      const userData: User = {
        id: profile.id,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
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

      return userData;
    } else {
      // If no profile found, create one from auth metadata
      console.log('No profile found, creating one from auth metadata');
      
      const newProfile = {
        id: authUser.id,
        first_name: metadata.firstName || '',
        last_name: metadata.lastName || '',
        email: authUser.email,
        role: 'leader' as UserRole,
      };
      
      // Insert the new profile
      const { error: insertError } = await supabase
        .from('profiles')
        .insert(newProfile);
        
      if (insertError) {
        console.error('Error creating profile:', insertError);
      }
      
      // Set user with basic data - needs to complete profile
      return {
        id: authUser.id,
        name: `${metadata.firstName || ''} ${metadata.lastName || ''}`.trim(),
        email: authUser.email || '',
        role: 'leader',
        // These fields are intentionally undefined to trigger profile completion
        phone: undefined,
        hasDriverLicense: undefined,
        hasCar: undefined,
        hasBoatLicense: undefined,
        rappellingAbility: undefined,
        ziplineAbility: undefined,
        climbingAbility: undefined
      };
    }
  } catch (err) {
    console.error('Error fetching user profile:', err);
    return null;
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
