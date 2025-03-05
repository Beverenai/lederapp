
import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileAvatarUploadProps {
  initialImage: string | null;
  userName: string | undefined;
  onAvatarChange: (file: File | null) => void;
}

const ProfileAvatarUpload = ({ initialImage, userName, onAvatarChange }: ProfileAvatarUploadProps) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialImage);
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onAvatarChange(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarPreview || ''} />
        <AvatarFallback>{userName?.charAt(0) || 'U'}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-center">
        <Label htmlFor="avatar" className="cursor-pointer text-blue-600 hover:underline">
          Last opp profilbilde
        </Label>
        <Input 
          id="avatar" 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleAvatarChange}
        />
      </div>
    </div>
  );
};

export default ProfileAvatarUpload;
