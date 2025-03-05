
import { supabase } from '@/integrations/supabase/client';

// Upload avatar to Supabase Storage
export const uploadAvatar = async (userId: string, avatarFile: File | null, currentImageUrl: string | undefined | null): Promise<string | null> => {
  if (!avatarFile) return currentImageUrl || null;
  
  try {
    const fileExt = avatarFile.name.split('.').pop();
    const filePath = `${userId}/${Math.random().toString(36).slice(2)}.${fileExt}`;
    
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
    has_driving_license: boolean;
    has_car: boolean;
    has_boat_license: boolean;
    rappelling_ability: string;
    zipline_ability: string;
    climbing_ability: string;
    avatar_url: string | null;
  }
) => {
  const { error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', userId);

  if (error) {
    throw error;
  }
};
