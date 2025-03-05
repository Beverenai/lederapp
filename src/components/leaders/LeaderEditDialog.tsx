
import React, { useState } from 'react';
import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { User, UserRole } from '@/types/models';
import { mockCabins } from '@/data/mockData';

interface LeaderEditDialogProps {
  leader: User;
  onSave: (updatedLeader: User) => void;
}

const LeaderEditDialog = ({ leader, onSave }: LeaderEditDialogProps) => {
  const [editedLeader, setEditedLeader] = useState<User>({...leader});
  
  const handleChange = (field: keyof User, value: any) => {
    setEditedLeader(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSave = () => {
    onSave({
      ...editedLeader
    });
  };
  
  const handleSkillsChange = (skillsString: string) => {
    const skillsArray = skillsString
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill !== '');
    
    handleChange('skills', skillsArray);
  };
  
  const handleActivitiesChange = (activitiesString: string) => {
    const activitiesArray = activitiesString
      .split(',')
      .map(activity => activity.trim())
      .filter(activity => activity !== '');
    
    handleChange('activities', activitiesArray);
  };

  const abilityOptions = ['Ja', 'Nei', 'Nesten'];

  return (
    <DialogContent className="max-w-4xl">
      <DialogHeader>
        <DialogTitle>Rediger Lederinformasjon</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Navn</Label>
            <Input 
              id="name" 
              value={editedLeader.name} 
              onChange={(e) => handleChange('name', e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">E-post</Label>
            <Input 
              id="email" 
              value={editedLeader.email} 
              onChange={(e) => handleChange('email', e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input 
              id="phone" 
              value={editedLeader.phone || ''} 
              onChange={(e) => handleChange('phone', e.target.value || undefined)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="age">Alder</Label>
            <Input 
              id="age" 
              type="number" 
              value={editedLeader.age || ''} 
              onChange={(e) => handleChange('age', parseInt(e.target.value) || undefined)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Rolle</Label>
            <Select 
              value={editedLeader.role} 
              onValueChange={(value: UserRole) => handleChange('role', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Velg rolle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="nurse">Sykepleier</SelectItem>
                <SelectItem value="leader">Leder</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cabin">Tildelt Hytte</Label>
            <Select 
              value={editedLeader.assignedCabinId || ''} 
              onValueChange={(value) => handleChange('assignedCabinId', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Velg hytte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Ingen hytte</SelectItem>
                {mockCabins.map(cabin => (
                  <SelectItem key={cabin.id} value={cabin.id}>
                    {cabin.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="team">Team</Label>
            <Input 
              id="team" 
              value={editedLeader.team || ''} 
              onChange={(e) => handleChange('team', e.target.value || undefined)} 
            />
          </div>
          
          <div className="flex flex-col space-y-4">
            <Label>Sertifikater og Tilgjengelighet</Label>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hasDriverLicense" 
                checked={editedLeader.hasDriverLicense || false}
                onCheckedChange={(checked) => 
                  handleChange('hasDriverLicense', checked === true ? true : false)
                }
              />
              <Label htmlFor="hasDriverLicense">Har førerkort</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hasCar" 
                checked={editedLeader.hasCar || false}
                onCheckedChange={(checked) => 
                  handleChange('hasCar', checked === true ? true : false)
                }
              />
              <Label htmlFor="hasCar">Har bil</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hasBoatLicense" 
                checked={editedLeader.hasBoatLicense || false}
                onCheckedChange={(checked) => 
                  handleChange('hasBoatLicense', checked === true ? true : false)
                }
              />
              <Label htmlFor="hasBoatLicense">Har båtlappen</Label>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-4">
            <Label>Ferdigheter</Label>
            
            <div className="space-y-2">
              <Label htmlFor="rappellingAbility">Kan rapellering</Label>
              <Select 
                value={editedLeader.rappellingAbility || 'Nei'} 
                onValueChange={(value) => handleChange('rappellingAbility', value as 'Ja' | 'Nei' | 'Nesten')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Velg nivå" />
                </SelectTrigger>
                <SelectContent>
                  {abilityOptions.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ziplineAbility">Kan tbane-oppsett</Label>
              <Select 
                value={editedLeader.ziplineAbility || 'Nei'} 
                onValueChange={(value) => handleChange('ziplineAbility', value as 'Ja' | 'Nei' | 'Nesten')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Velg nivå" />
                </SelectTrigger>
                <SelectContent>
                  {abilityOptions.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="climbingAbility">Kan klatring</Label>
              <Select 
                value={editedLeader.climbingAbility || 'Nei'} 
                onValueChange={(value) => handleChange('climbingAbility', value as 'Ja' | 'Nei' | 'Nesten')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Velg nivå" />
                </SelectTrigger>
                <SelectContent>
                  {abilityOptions.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="skills">Ferdigheter (kommaseparert)</Label>
            <Textarea 
              id="skills" 
              value={editedLeader.skills?.join(', ') || ''} 
              onChange={(e) => handleSkillsChange(e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="activities">Aktiviteter (kommaseparert)</Label>
            <Textarea 
              id="activities" 
              value={editedLeader.activities?.join(', ') || ''} 
              onChange={(e) => handleActivitiesChange(e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notater</Label>
            <Textarea 
              id="notes" 
              value={editedLeader.notes || ''} 
              onChange={(e) => handleChange('notes', e.target.value || undefined)} 
            />
          </div>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Avbryt</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button onClick={handleSave}>Lagre endringer</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};

export default LeaderEditDialog;
