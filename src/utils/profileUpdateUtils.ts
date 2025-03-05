
import { supabase } from '@/integrations/supabase/client';
import { isValidUUID } from './validationUtils';

/**
 * Update profile in Supabase
 */
export const updateUserProfile = async (
  userId: string, 
  profileData: {
    phone: string;
    age: number | null;
    has_driving_license: boolean;
    has_car: boolean;
    has_boat_license: boolean;
    rappelling_ability: string;
    zipline_ability: string;
    climbing_ability: string;
    avatar_url: string | null;
    first_name?: string;
    last_name?: string;
    notes?: string;
    team?: string;
  }
) => {
  try {
    console.log('Starting profile update for user ID:', userId);
    
    // Special handling for admin user
    if (userId === '1') {
      console.log('Admin user detected, storing profile data in localStorage only');
      
      // For admin user, just store the profile data in localStorage
      const adminUser = JSON.parse(localStorage.getItem('oksnoen-admin-user') || '{}');
      const updatedAdminUser = {
        ...adminUser,
        phone: profileData.phone,
        age: profileData.age,
        hasDriverLicense: profileData.has_driving_license,
        hasCar: profileData.has_car,
        hasBoatLicense: profileData.has_boat_license,
        rappellingAbility: profileData.rappelling_ability,
        ziplineAbility: profileData.zipline_ability,
        climbingAbility: profileData.climbing_ability,
        image: profileData.avatar_url,
        name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || adminUser.name,
        notes: profileData.notes,
        team: profileData.team
      };
      
      localStorage.setItem('oksnoen-admin-user', JSON.stringify(updatedAdminUser));
      console.log('Admin user profile updated in localStorage:', updatedAdminUser);
      return;
    }
    
    // Validate the userId is a proper UUID for normal users
    if (!isValidUUID(userId)) {
      console.error('Invalid user ID format for profile update:', userId);
      throw new Error(`Invalid user ID format: ${userId}`);
    }
    
    console.log('Updating profile for user ID:', userId);
    
    await updateProfileInDatabase(userId, profileData);
    await updateUserMetadata(profileData);
    
    console.log('Profile update completed successfully');
  } catch (err) {
    console.error('Profile update error:', err);
    throw err;
  }
};

/**
 * Update or create profile in the database
 */
async function updateProfileInDatabase(userId: string, profileData: any) {
  console.log('Checking if profile exists for user:', userId);
  
  // Check if profile exists first with better error handling
  const { data: existingProfile, error: checkError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();
  
  if (checkError) {
    console.error('Error checking if profile exists:', checkError);
    throw new Error(`Failed to check existing profile: ${checkError.message}`);
  }
  
  console.log('Existing profile check result:', existingProfile ? 'Profile exists' : 'No profile found');
  
  // Create the profile data object with all the fields
  const profileUpdateData = {
    phone: profileData.phone,
    age: profileData.age,
    has_driving_license: profileData.has_driving_license,
    has_car: profileData.has_car,
    has_boat_license: profileData.has_boat_license,
    rappelling_ability: profileData.rappelling_ability,
    zipline_ability: profileData.zipline_ability,
    climbing_ability: profileData.climbing_ability,
    avatar_url: profileData.avatar_url,
    first_name: profileData.first_name,
    last_name: profileData.last_name,
    notes: profileData.notes,
    team: profileData.team,
    // If we're inserting a new profile, we need to include the id
    ...(existingProfile ? {} : { id: userId })
  };
  
  // Determine whether to insert or update
  if (!existingProfile) {
    console.log('Creating new profile for user', userId);
    const { error: insertError } = await supabase
      .from('profiles')
      .insert(profileUpdateData);
    
    if (insertError) {
      console.error('Profile insert error:', insertError);
      throw new Error(`Failed to create profile: ${insertError.message}`);
    }
    
    console.log('Profile created successfully');
  } else {
    // Update existing profile
    console.log('Updating existing profile for user', userId);
    const { error: updateError } = await supabase
      .from('profiles')
      .update(profileUpdateData)
      .eq('id', userId);
    
    if (updateError) {
      console.error('Profile update error:', updateError);
      throw new Error(`Failed to update profile: ${updateError.message}`);
    }
    
    console.log('Profile updated successfully');
  }
}

/**
 * Update user metadata in Supabase Auth
 */
async function updateUserMetadata(profileData: any) {
  try {
    console.log('Updating user metadata in Auth');
    
    const { error: metadataError } = await supabase.auth.updateUser({
      data: {
        phone: profileData.phone,
        age: profileData.age,
        hasDriverLicense: profileData.has_driving_license,
        hasCar: profileData.has_car,
        hasBoatLicense: profileData.has_boat_license,
        rappellingAbility: profileData.rappelling_ability,
        ziplineAbility: profileData.zipline_ability,
        climbingAbility: profileData.climbing_ability,
        firstName: profileData.first_name,
        lastName: profileData.last_name
      }
    });
    
    if (metadataError) {
      console.error('User metadata update error:', metadataError);
      // Log but don't throw error here, as the profile update is more important
      console.warn('Continuing despite metadata update error');
    } else {
      console.log('User metadata updated successfully');
    }
  } catch (err) {
    console.error('Unexpected error updating user metadata:', err);
    console.warn('Continuing despite metadata update error');
  }
}
