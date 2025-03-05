
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type AbilityOption = 'Ja' | 'Nei' | 'Nesten';

interface ProfileAbilitiesProps {
  rappellingAbility: AbilityOption;
  ziplineAbility: AbilityOption;
  climbingAbility: AbilityOption;
  onRappellingChange: (value: AbilityOption) => void;
  onZiplineChange: (value: AbilityOption) => void;
  onClimbingChange: (value: AbilityOption) => void;
}

const ProfileAbilities = ({
  rappellingAbility,
  ziplineAbility,
  climbingAbility,
  onRappellingChange,
  onZiplineChange,
  onClimbingChange
}: ProfileAbilitiesProps) => {
  // Function to safely handle ability changes
  const handleAbilityChange = (setter: (value: AbilityOption) => void) => {
    return (value: string) => {
      // Ensure the value is a valid AbilityOption
      if (value === 'Ja' || value === 'Nei' || value === 'Nesten') {
        setter(value as AbilityOption);
      }
    };
  };
  
  return (
    <div className="space-y-4">
      <Label>Dine ferdigheter</Label>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rappellingAbility">Rappellering</Label>
          <Select 
            value={rappellingAbility} 
            onValueChange={handleAbilityChange(onRappellingChange)}
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
            onValueChange={handleAbilityChange(onZiplineChange)}
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
            onValueChange={handleAbilityChange(onClimbingChange)}
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
  );
};

export default ProfileAbilities;
