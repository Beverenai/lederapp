
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { User } from '@/types/models';
import { useAuth } from '@/context/AuthContext';
import ProfileAvatarUpload from '@/components/auth/ProfileAvatarUpload';
import ProfileLicenses from '@/components/auth/ProfileLicenses';
import ProfileAbilities, { AbilityOption } from '@/components/auth/ProfileAbilities';
import { uploadAvatar, updateUserProfile } from '@/utils/profileUtils';

interface ProfileFormProps {
  initialUser: User;
}

const ProfileForm = ({ initialUser }: ProfileFormProps) => {
  const { refreshUser } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data states
  const [firstName, setFirstName] = useState(initialUser.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(
    initialUser.name?.split(' ').slice(1).join(' ') || ''
  );
  const [phone, setPhone] = useState(initialUser.phone || '');
  const [email, setEmail] = useState(initialUser.email || '');
  const [age, setAge] = useState<number | undefined>(initialUser.age || undefined);
  const [team, setTeam] = useState(initialUser.team || '');
  const [notes, setNotes] = useState(initialUser.notes || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  
  // License states
  const [hasDriverLicense, setHasDriverLicense] = useState(initialUser.hasDriverLicense || false);
  const [hasCar, setHasCar] = useState(initialUser.hasCar || false);
  const [hasBoatLicense, setHasBoatLicense] = useState(initialUser.hasBoatLicense || false);
  
  // Abilities states
  const [rappellingAbility, setRappellingAbility] = useState<AbilityOption>(
    initialUser.rappellingAbility || 'Nei'
  );
  const [ziplineAbility, setZiplineAbility] = useState<AbilityOption>(
    initialUser.ziplineAbility || 'Nei'
  );
  const [climbingAbility, setClimbingAbility] = useState<AbilityOption>(
    initialUser.climbingAbility || 'Nei'
  );
  
  // Handle avatar change
  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file);
  };
  
  // Submit profile update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!initialUser.id) {
        toast({
          title: 'Feil',
          description: 'Bruker ID mangler. Vennligst logg ut og inn igjen.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }
      
      console.log('Submitting profile update with user ID:', initialUser.id);
      
      // Upload avatar if selected
      const avatarUrl = await uploadAvatar(initialUser.id, avatarFile, initialUser.image);
      
      // Update profile in Supabase
      await updateUserProfile(initialUser.id, {
        phone,
        age: age || null,
        has_driving_license: hasDriverLicense,
        has_car: hasCar,
        has_boat_license: hasBoatLicense,
        rappelling_ability: rappellingAbility,
        zipline_ability: ziplineAbility,
        climbing_ability: climbingAbility,
        avatar_url: avatarUrl || initialUser.image,
        first_name: firstName,
        last_name: lastName,
        notes,
        team
      });
      
      // Refresh user data
      await refreshUser();
      
      toast({
        title: 'Profil oppdatert',
        description: 'Din profil er nå oppdatert!',
      });
    } catch (error: any) {
      console.error('Profile update error:', error);
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Avatar Upload Section */}
      <ProfileAvatarUpload 
        initialImage={initialUser.image || null}
        userName={initialUser.name}
        onAvatarChange={handleAvatarChange}
      />
      
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">Fornavn</Label>
          <Input 
            id="firstName" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Etternavn</Label>
          <Input 
            id="lastName" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">E-post</Label>
          <Input 
            id="email" 
            type="email" 
            value={email}
            disabled 
            className="bg-muted"
          />
          <p className="text-sm text-muted-foreground">E-post kan ikke endres</p>
        </div>
        
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
        
        <div className="space-y-2">
          <Label htmlFor="age">Alder</Label>
          <Input 
            id="age" 
            type="number" 
            placeholder="Skriv inn alderen din" 
            value={age || ''}
            onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : undefined)}
            min={16}
            max={100}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="team">Lag/Team</Label>
          <Input 
            id="team" 
            placeholder="Ditt lag eller team" 
            value={team} 
            onChange={(e) => setTeam(e.target.value)}
          />
        </div>
      </div>
      
      {/* Notes/Bio */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notater / Om meg</Label>
        <Textarea 
          id="notes" 
          placeholder="Skriv litt om deg selv, relevante detaljer eller notater" 
          value={notes || ''} 
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      
      {/* Licenses */}
      <div className="pt-4 border-t">
        <h3 className="text-lg font-medium mb-4">Lisenser og sertifikater</h3>
        <ProfileLicenses 
          hasDriverLicense={hasDriverLicense}
          hasCar={hasCar}
          hasBoatLicense={hasBoatLicense}
          onDriverLicenseChange={setHasDriverLicense}
          onCarChange={setHasCar}
          onBoatLicenseChange={setHasBoatLicense}
        />
      </div>
      
      {/* Abilities */}
      <div className="pt-4 border-t">
        <h3 className="text-lg font-medium mb-4">Dine ferdigheter</h3>
        <ProfileAbilities 
          rappellingAbility={rappellingAbility}
          ziplineAbility={ziplineAbility}
          climbingAbility={climbingAbility}
          onRappellingChange={setRappellingAbility}
          onZiplineChange={setZiplineAbility}
          onClimbingChange={setClimbingAbility}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full md:w-auto" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Lagrer...' : 'Lagre profil'}
      </Button>
    </form>
  );
};

export default ProfileForm;
