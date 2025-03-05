
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
        name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
        notes: profileData.notes,
        team: profileData.team
      };
      
      localStorage.setItem('oksnoen-admin-user', JSON.stringify(updatedAdminUser));
      return;
    }
    
    // Validate the userId is a proper UUID for normal users
    if (!isValidUUID(userId)) {
      console.error('Invalid user ID for profile update:', userId);
      throw new Error(`Invalid user ID format: ${userId}`);
    }
    
    console.log('Updating profile for user ID:', userId);
    
    await updateProfileInDatabase(userId, profileData);
    await updateUserMetadata(profileData);
    
  } catch (err) {
    console.error('Profile update error:', err);
    throw err;
  }
};

/**
 * Update or create profile in the database
 */
async function updateProfileInDatabase(userId: string, profileData: any) {
  // Check if profile exists first
  const { data: existingProfile, error: checkError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  
  if (checkError && !checkError.message.includes('No rows found')) {
    console.error('Profile check error:', checkError);
    throw checkError;
  }
  
  // If profile doesn't exist, create it
  if (!existingProfile) {
    console.log('Creating new profile for user', userId);
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
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
        team: profileData.team
      });
    
    if (insertError) {
      console.error('Profile insert error:', insertError);
      throw insertError;
    }
  } else {
    // Update existing profile
    console.log('Updating existing profile for user', userId);
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
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
        team: profileData.team
      })
      .eq('id', userId);
    
    if (updateError) {
      console.error('Profile update error:', updateError);
      throw updateError;
    }
  }
}

/**
 * Update user metadata in Supabase Auth
 */
async function updateUserMetadata(profileData: any) {
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
    // Don't throw error here, the profile update is more important
  }
}
