
import { supabase } from '@/integrations/supabase/client';

// Upload avatar to Supabase Storage
export const uploadAvatar = async (userId: string, avatarFile: File | null, currentImageUrl: string | undefined | null): Promise<string | null> => {
  if (!avatarFile) return currentImageUrl || null;
  
  try {
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
