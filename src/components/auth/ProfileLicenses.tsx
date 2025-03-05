
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ProfileLicensesProps {
  hasDriverLicense: boolean;
  hasCar: boolean;
  hasBoatLicense: boolean;
  onDriverLicenseChange: (checked: boolean) => void;
  onCarChange: (checked: boolean) => void;
  onBoatLicenseChange: (checked: boolean) => void;
}

const ProfileLicenses = ({
  hasDriverLicense,
  hasCar,
  hasBoatLicense,
  onDriverLicenseChange,
  onCarChange,
  onBoatLicenseChange
}: ProfileLicensesProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="hasDriverLicense" 
          checked={hasDriverLicense} 
          onCheckedChange={(checked) => 
            onDriverLicenseChange(checked as boolean)
          }
        />
        <Label htmlFor="hasDriverLicense">Jeg har førerkort</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="hasCar" 
          checked={hasCar} 
          onCheckedChange={(checked) => 
            onCarChange(checked as boolean)
          }
        />
        <Label htmlFor="hasCar">Jeg har bil tilgjengelig</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="hasBoatLicense" 
          checked={hasBoatLicense} 
          onCheckedChange={(checked) => 
            onBoatLicenseChange(checked as boolean)
          }
        />
        <Label htmlFor="hasBoatLicense">Jeg har båtlappen</Label>
      </div>
    </div>
  );
};

export default ProfileLicenses;
