
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '@/types/models';

const ProfileCompletionForm: React.FC = () => {
  const { user, session } = useAuth();
  const [phone, setPhone] = useState(user?.phone || '');
  const [hasDriverLicense, setHasDriverLicense] = useState(user?.hasDriverLicense || false);
  const [hasCar, setHasCar] = useState(user?.hasCar || false);
  const [hasBoatLicense, setHasBoatLicense] = useState(user?.hasBoatLicense || false);
  const [rappellingAbility, setRappellingAbility] = useState<'Ja' | 'Nei' | 'Nesten'>(user?.rappellingAbility || 'Nei');
  const [ziplineAbility, setZiplineAbility] = useState<'Ja' | 'Nei' | 'Nesten'>(user?.ziplineAbility || 'Nei');
  const [climbingAbility, setClimbingAbility] = useState<'Ja' | 'Nei' | 'Nesten'>(user?.climbingAbility || 'Nei');
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(user?.image);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !user.id) {
      toast({
        title: 'Feil',
        description: 'Bruker ikke funnet. Vennligst logg inn på nytt.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload image if selected
      let avatarUrl = user.image || '';
      
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `avatars/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, image);
          
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
        avatarUrl = urlData.publicUrl;
      }
      
      // Update user profile
      const { error: updateError } = await supabase
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
        
      if (updateError) throw updateError;
      
      toast({
        title: 'Profil oppdatert',
        description: 'Din profilinformasjon er nå oppdatert.',
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast({
        title: 'Feil ved oppdatering',
        description: 'Kunne ikke oppdatere profilen. Prøv igjen senere.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted/30 p-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Fullfør din profil</CardTitle>
          <CardDescription>
            Vennligst fyll ut litt mer informasjon om deg selv for å fullføre registreringen.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Profile image upload */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={imageUrl} />
                <AvatarFallback className="text-xl">
                  {user?.name?.split(' ').map(n => n[0]).join('') || '?'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-center">
                <Label htmlFor="profile-image" className="cursor-pointer text-primary hover:underline">
                  Last opp profilbilde
                </Label>
                <Input 
                  id="profile-image" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="hidden"
                />
              </div>
            </div>
            
            {/* Phone number */}
            <div className="space-y-2">
              <Label htmlFor="phone">Telefonnummer</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Ditt telefonnummer"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            
            {/* Licenses and capabilities */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hasDriverLicense" 
                  checked={hasDriverLicense} 
                  onCheckedChange={(checked) => setHasDriverLicense(checked === true)}
                />
                <Label htmlFor="hasDriverLicense">Har førerkort</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hasCar" 
                  checked={hasCar} 
                  onCheckedChange={(checked) => setHasCar(checked === true)}
                />
                <Label htmlFor="hasCar">Har bil</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hasBoatLicense" 
                  checked={hasBoatLicense} 
                  onCheckedChange={(checked) => setHasBoatLicense(checked === true)}
                />
                <Label htmlFor="hasBoatLicense">Har båtlappen</Label>
              </div>
            </div>
            
            {/* Activity abilities */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rappellingAbility">Rappellering</Label>
                <Select 
                  value={rappellingAbility} 
                  onValueChange={(value) => setRappellingAbility(value as 'Ja' | 'Nei' | 'Nesten')}
                >
                  <SelectTrigger id="rappellingAbility">
                    <SelectValue placeholder="Velg" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ja">Ja</SelectItem>
                    <SelectItem value="Nei">Nei</SelectItem>
                    <SelectItem value="Nesten">Nesten</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ziplineAbility">Zipline</Label>
                <Select 
                  value={ziplineAbility} 
                  onValueChange={(value) => setZiplineAbility(value as 'Ja' | 'Nei' | 'Nesten')}
                >
                  <SelectTrigger id="ziplineAbility">
                    <SelectValue placeholder="Velg" />
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
                  onValueChange={(value) => setClimbingAbility(value as 'Ja' | 'Nei' | 'Nesten')}
                >
                  <SelectTrigger id="climbingAbility">
                    <SelectValue placeholder="Velg" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ja">Ja</SelectItem>
                    <SelectItem value="Nei">Nei</SelectItem>
                    <SelectItem value="Nesten">Nesten</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-oksnoen-green hover:bg-oksnoen-green/90 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Lagrer...' : 'Fullfør oppsett'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ProfileCompletionForm;
