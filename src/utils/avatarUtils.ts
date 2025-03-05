
import { supabase } from '@/integrations/supabase/client';
import { isValidUUID } from './validationUtils';

/**
 * Upload avatar to Supabase Storage
 */
export const uploadAvatar = async (userId: string, avatarFile: File | null, currentImageUrl: string | undefined | null): Promise<string | null> => {
  if (!avatarFile) {
    console.log('No avatar file provided, keeping current image URL:', currentImageUrl);
    return currentImageUrl || null;
  }
  
  try {
    console.log('Starting avatar upload for user ID:', userId);
    
    // Special handling for admin user
    if (userId === '1') {
      console.log('Admin user detected, skipping avatar upload');
      
      // For admin users, we could implement a local file handling solution
      // For now, return the current image URL
      return currentImageUrl || null;
    }
    
    // Validate the userId is a proper UUID for normal users
    if (!isValidUUID(userId)) {
      console.error('Invalid user ID for avatar upload:', userId);
      return currentImageUrl || null;
    }
    
    const fileExt = avatarFile.name.split('.').pop();
    const filePath = `${userId}/${Math.random().toString(36).slice(2)}.${fileExt}`;
    
    console.log('Checking for avatars bucket');
    
    // Check if bucket exists and create it if needed
    try {
      const { data: bucketData, error: bucketError } = await supabase
        .storage
        .listBuckets();
      
      if (bucketError) {
        console.error('Error listing buckets:', bucketError);
        return currentImageUrl || null;
      }
      
      // Find the avatars bucket
      const avatarsBucket = bucketData?.find(bucket => bucket.name === 'avatars');
      
      if (!avatarsBucket) {
        console.log('Creating avatars bucket');
        const { error: createBucketError } = await supabase.storage
          .createBucket('avatars', {
            public: true
          });
        
        if (createBucketError) {
          console.error('Error creating bucket:', createBucketError);
          return currentImageUrl || null;
        }
        
        console.log('Avatars bucket created successfully');
      } else {
        console.log('Avatars bucket already exists');
      }
    } catch (bucketError: any) {
      console.error('Error checking bucket:', bucketError);
      return currentImageUrl || null;
    }
    
    console.log('Uploading avatar file to path:', filePath);
    
    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, avatarFile);
    
    if (uploadError) {
      console.error('Avatar upload error:', uploadError);
      return currentImageUrl || null;
    }
    
    console.log('Avatar uploaded successfully');
    
    // Get the public URL
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    console.log('Generated public URL:', data.publicUrl);
    
    return data.publicUrl;
  } catch (err) {
    console.error('Avatar upload error:', err);
    return currentImageUrl || null;
  }
};
