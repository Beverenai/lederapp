
import { supabase } from '@/integrations/supabase/client';

// Upload avatar to Supabase Storage
export const uploadAvatar = async (userId: string, avatarFile: File | null, currentImageUrl: string | undefined | null): Promise<string | null> => {
  if (!avatarFile) return currentImageUrl || null;
  
  try {
    // Special handling for admin user
    if (userId === '1') {
      console.log('Admin user detected, skipping avatar upload');
      return currentImageUrl || null;
    }
    
    // Validate the userId is a proper UUID for normal users
    if (!isValidUUID(userId)) {
      console.error('Invalid user ID for avatar upload:', userId);
      return currentImageUrl || null;
    }
    
    const fileExt = avatarFile.name.split('.').pop();
    const filePath = `${userId}/${Math.random().toString(36).slice(2)}.${fileExt}`;
    
    // Check if bucket exists and create it if needed
    try {
      const { data: bucketData } = await supabase.storage.getBucket('avatars');
      if (!bucketData) {
        console.log('Creating avatars bucket');
        const { error: createBucketError } = await supabase.storage
          .createBucket('avatars', {
            public: true
          });
        
        if (createBucketError) {
          console.error('Error creating bucket:', createBucketError);
          return null;
        }
      }
    } catch (bucketError: any) {
      if (bucketError.message && bucketError.message.includes('The resource was not found')) {
        // Need to create the bucket
        console.log('Creating avatars bucket');
        const { error: createBucketError } = await supabase.storage
          .createBucket('avatars', {
            public: true
          });
        
        if (createBucketError) {
          console.error('Error creating bucket:', createBucketError);
          return null;
        }
      } else {
        console.error('Bucket check error:', bucketError);
        return null;
      }
    }
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, avatarFile);
    
    if (uploadError) {
      console.error('Avatar upload error:', uploadError);
      return null;
    }
    
    // Get the public URL
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return data.publicUrl;
  } catch (err) {
    console.error('Avatar upload error:', err);
    return null;
  }
};

// Update profile in Supabase
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
        image: profileData.avatar_url
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
          avatar_url: profileData.avatar_url
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
        .update(profileData)
        .eq('id', userId);
      
      if (updateError) {
        console.error('Profile update error:', updateError);
        throw updateError;
      }
    }
    
    // Also update user metadata
    const { error: metadataError } = await supabase.auth.updateUser({
      data: {
        phone: profileData.phone,
        age: profileData.age,
        hasDriverLicense: profileData.has_driving_license,
        hasCar: profileData.has_car,
        hasBoatLicense: profileData.has_boat_license,
        rappellingAbility: profileData.rappelling_ability,
        ziplineAbility: profileData.zipline_ability,
        climbingAbility: profileData.climbing_ability
      }
    });
    
    if (metadataError) {
      console.error('User metadata update error:', metadataError);
      // Don't throw error here, the profile update is more important
    }
  } catch (err) {
    console.error('Profile update error:', err);
    throw err;
  }
};

// Helper function to validate UUID format
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
