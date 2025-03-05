
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types/models';
import ProfileAvatarUpload from './ProfileAvatarUpload';
import ProfileLicenses from './ProfileLicenses';
import ProfileAbilities, { AbilityOption } from './ProfileAbilities';
import { uploadAvatar, updateUserProfile } from '@/utils/profileUtils';

const ProfileCompletionForm = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  
  // Form data states
  const [phone, setPhone] = useState(user?.phone || '');
  const [hasDriverLicense, setHasDriverLicense] = useState(user?.hasDriverLicense || false);
  const [hasCar, setHasCar] = useState(user?.hasCar || false);
  const [hasBoatLicense, setHasBoatLicense] = useState(user?.hasBoatLicense || false);
  const [rappellingAbility, setRappellingAbility] = useState<AbilityOption>(user?.rappellingAbility || 'Nei');
  const [ziplineAbility, setZiplineAbility] = useState<AbilityOption>(user?.ziplineAbility || 'Nei');
  const [climbingAbility, setClimbingAbility] = useState<AbilityOption>(user?.climbingAbility || 'Nei');
  
  // Handle avatar change
  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file);
  };
  
  // Submit profile completion
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!user?.id) {
        toast({
          title: 'Feil',
          description: 'Bruker ID mangler. Vennligst logg ut og inn igjen.',
          variant: 'destructive',
        });
        return;
      }
      
      // Upload avatar if selected
      const avatarUrl = await uploadAvatar(user.id, avatarFile, user.image);
      
      // Update profile in Supabase
      await updateUserProfile(user.id, {
        phone,
        has_driving_license: hasDriverLicense,
        has_car: hasCar,
        has_boat_license: hasBoatLicense,
        rappelling_ability: rappellingAbility,
        zipline_ability: ziplineAbility,
        climbing_ability: climbingAbility,
        avatar_url: avatarUrl || user.image,
      });
      
      // Refresh user data
      await refreshUser();
      
      toast({
        title: 'Profil oppdatert',
        description: 'Din profil er nå komplett!',
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Profile completion error:', error);
      toast({
        title: 'Feil ved oppdatering',
        description: error.message || 'Kunne ikke oppdatere profilen. Prøv igjen.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto max-w-lg py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Fullfør profilen din</CardTitle>
          <CardDescription>
            Vi trenger litt mer informasjon for å fullføre oppsettet av kontoen din.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload Section */}
            <ProfileAvatarUpload 
              initialImage={user?.image || null}
              userName={user?.name}
              onAvatarChange={handleAvatarChange}
            />
            
            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone">Telefonnummer</Label>
              <Input 
                id="phone" 
                placeholder="f.eks. 98765432" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            
            {/* Licenses */}
            <ProfileLicenses 
              hasDriverLicense={hasDriverLicense}
              hasCar={hasCar}
              hasBoatLicense={hasBoatLicense}
              onDriverLicenseChange={setHasDriverLicense}
              onCarChange={setHasCar}
              onBoatLicenseChange={setHasBoatLicense}
            />
            
            {/* Abilities */}
            <ProfileAbilities 
              rappellingAbility={rappellingAbility}
              ziplineAbility={ziplineAbility}
              climbingAbility={climbingAbility}
              onRappellingChange={setRappellingAbility}
              onZiplineChange={setZiplineAbility}
              onClimbingChange={setClimbingAbility}
            />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Lagrer...' : 'Fullfør profil'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCompletionForm;
