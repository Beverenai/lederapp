
import { supabase } from '@/integrations/supabase/client';
import { isValidUUID } from './validationUtils';

/**
 * Upload avatar to Supabase Storage
 */
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
