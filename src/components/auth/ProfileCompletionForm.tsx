
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/models';

const ProfileCompletionForm = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.image || null);
  
  // Form data states
  const [phone, setPhone] = useState(user?.phone || '');
  const [hasDriverLicense, setHasDriverLicense] = useState(user?.hasDriverLicense || false);
  const [hasCar, setHasCar] = useState(user?.hasCar || false);
  const [hasBoatLicense, setHasBoatLicense] = useState(user?.hasBoatLicense || false);
  const [rappellingAbility, setRappellingAbility] = useState(user?.rappellingAbility || 'Nei');
  const [ziplineAbility, setZiplineAbility] = useState(user?.ziplineAbility || 'Nei');
  const [climbingAbility, setClimbingAbility] = useState(user?.climbingAbility || 'Nei');
  
  // Avatar upload handling
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Upload avatar to Supabase Storage
  const uploadAvatar = async (userId: string): Promise<string | null> => {
    if (!avatarFile) return user?.image || null;
    
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
      const avatarUrl = await uploadAvatar(user.id);
      
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          phone,
          has_driving_license: hasDriverLicense,
          has_car: hasCar,
          has_boat_license: hasBoatLicense,
          rappelling_ability: rappellingAbility,
          zipline_ability: ziplineAbility,
          climbing_ability: climbingAbility,
          avatar_url: avatarUrl || user.image,
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
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
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarPreview || ''} />
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
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
            
            {/* Checkboxes for licenses */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hasDriverLicense" 
                  checked={hasDriverLicense} 
                  onCheckedChange={(checked) => 
                    setHasDriverLicense(checked as boolean)
                  }
                />
                <Label htmlFor="hasDriverLicense">Jeg har førerkort</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hasCar" 
                  checked={hasCar} 
                  onCheckedChange={(checked) => 
                    setHasCar(checked as boolean)
                  }
                />
                <Label htmlFor="hasCar">Jeg har bil tilgjengelig</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hasBoatLicense" 
                  checked={hasBoatLicense} 
                  onCheckedChange={(checked) => 
                    setHasBoatLicense(checked as boolean)
                  }
                />
                <Label htmlFor="hasBoatLicense">Jeg har båtlappen</Label>
              </div>
            </div>
            
            {/* Ability Selects */}
            <div className="space-y-4">
              <Label>Dine ferdigheter</Label>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rappellingAbility">Rappellering</Label>
                  <Select 
                    value={rappellingAbility} 
                    onValueChange={setRappellingAbility}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Velg nivå" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ja">Ja</SelectItem>
                      <SelectItem value="Nei">Nei</SelectItem>
                      <SelectItem value="Nesten">Nesten</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ziplineAbility">Tbane-oppsett</Label>
                  <Select 
                    value={ziplineAbility} 
                    onValueChange={setZiplineAbility}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Velg nivå" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ja">Ja</SelectItem>
                      <SelectItem value="Nei">Nei</SelectItem>
                      <SelectItem value="Nesten">Nesten</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="climbingAbility">Klatring</Label>
                  <Select 
                    value={climbingAbility} 
                    onValueChange={setClimbingAbility}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Velg nivå" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ja">Ja</SelectItem>
                      <SelectItem value="Nei">Nei</SelectItem>
                      <SelectItem value="Nesten">Nesten</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
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
