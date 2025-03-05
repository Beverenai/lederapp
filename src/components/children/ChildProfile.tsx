
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Home, 
  Camera, 
  ClipboardList, 
  Pill, 
  AlertCircle, 
  User,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  name: string;
  completed: boolean;
  date: string;
  comment?: string;
}

interface MedicalInfo {
  condition?: string;
  medications?: string[];
  allergies?: string[];
  notes?: string;
}

interface ChildProfileProps {
  id: string;
  name: string;
  age: number;
  profileImage: string;
  cabin: string;
  activities: Activity[];
  medicalInfo?: MedicalInfo;
  onTakePhoto?: () => void;
}

const ChildProfile: React.FC<ChildProfileProps> = ({
  id,
  name,
  age,
  profileImage,
  cabin,
  activities,
  medicalInfo,
  onTakePhoto
}) => {
  const { user } = useAuth();
  const isNurseOrAdmin = user?.role === 'nurse' || user?.role === 'admin';
  
  const completedActivities = activities.filter(activity => activity.completed);
  const completionPercentage = (completedActivities.length / activities.length) * 100;
  
  return (
    <Card className="glass-card max-w-3xl mx-auto animate-enter">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <div className="relative mr-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profileImage} alt={name} />
                <AvatarFallback className="text-xl">{name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button 
                size="icon" 
                variant="secondary" 
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-md"
                onClick={onTakePhoto}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <CardTitle className="text-2xl">{name}</CardTitle>
              <CardDescription className="flex items-center mt-1">
                <span>{age} år</span>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <span className="flex items-center">
                  <Home className="h-3.5 w-3.5 mr-1 text-oksnoen-green" />
                  {cabin}
                </span>
              </CardDescription>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="gap-1">
              <ClipboardList className="h-4 w-4 mr-1" />
              Aktiviteter
            </Button>
            <Button className="gap-1 bg-oksnoen-green hover:bg-oksnoen-green/90">
              <CheckCircle className="h-4 w-4 mr-1" />
              Registrer
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="activities">
          <TabsList className="mb-4 w-full sm:w-auto">
            <TabsTrigger value="activities">Aktiviteter</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
            {isNurseOrAdmin && (
              <TabsTrigger value="medical">Medisinsk</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="activities" className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-medium">Fullførte aktiviteter</h3>
                  <p className="text-sm text-muted-foreground">
                    {completedActivities.length} av {activities.length} aktiviteter fullført
                  </p>
                </div>
                <div className="text-sm font-medium">
                  {Math.round(completionPercentage)}%
                </div>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-oksnoen-green rounded-full"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              {activities.map((activity) => (
                <div 
                  key={activity.id}
                  className={cn(
                    "p-3 rounded-lg",
                    activity.completed ? "bg-oksnoen-green/5 border border-oksnoen-green/20" : "bg-muted/40"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className={cn(
                        "h-5 w-5 rounded-full mr-3 flex items-center justify-center",
                        activity.completed ? "bg-oksnoen-green text-white" : "bg-muted"
                      )}>
                        {activity.completed && <CheckCircle className="h-4 w-4" />}
                      </div>
                      <div>
                        <span className={cn(
                          "font-medium",
                          activity.completed && "text-oksnoen-green"
                        )}>
                          {activity.name}
                        </span>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {activity.date}
                        </p>
                      </div>
                    </div>
                    
                    {!activity.completed && (
                      <Button size="sm" variant="outline">
                        Registrer
                      </Button>
                    )}
                  </div>
                  
                  {activity.comment && (
                    <div className="mt-2 ml-8 text-sm text-muted-foreground">
                      <span className="font-medium">Kommentar:</span> {activity.comment}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="info">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Personlig informasjon</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Navn</p>
                    <p className="font-medium">{name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Alder</p>
                    <p className="font-medium">{age} år</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Hytte</p>
                    <p className="font-medium">{cabin}</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Opphold</h3>
                <div className="bg-muted/40 p-3 rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">Uke:</span> Uke 26: 24-30 Juni
                  </p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">Ankomst:</span> Mandag 24. Juni
                  </p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">Avreise:</span> Søndag 30. Juni
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Kontaktinformasjon</h3>
                <div className="bg-muted/40 p-3 rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">Foresatt:</span> Anders Hansen
                  </p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">Telefon:</span> +47 123 45 678
                  </p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">E-post:</span> anders.hansen@example.com
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {isNurseOrAdmin && medicalInfo && (
            <TabsContent value="medical">
              <div className="space-y-4">
                {medicalInfo.condition && (
                  <div>
                    <h3 className="font-medium mb-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1 text-oksnoen-red" />
                      Medisinsk tilstand
                    </h3>
                    <div className="bg-red-50 border border-red-100 p-3 rounded-lg">
                      <p>{medicalInfo.condition}</p>
                    </div>
                  </div>
                )}
                
                {medicalInfo.medications && medicalInfo.medications.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2 flex items-center">
                      <Pill className="h-4 w-4 mr-1 text-oksnoen-red" />
                      Medisiner
                    </h3>
                    <div className="bg-muted/40 p-3 rounded-lg">
                      <ul className="list-disc list-inside space-y-1">
                        {medicalInfo.medications.map((med, idx) => (
                          <li key={idx} className="text-sm">{med}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                {medicalInfo.allergies && medicalInfo.allergies.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1 text-oksnoen-red" />
                      Allergier
                    </h3>
                    <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg">
                      <div className="flex flex-wrap gap-2">
                        {medicalInfo.allergies.map((allergy, idx) => (
                          <Badge key={idx} variant="outline" className="bg-amber-100 border-amber-200 text-amber-800">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {medicalInfo.notes && (
                  <div>
                    <h3 className="font-medium mb-2">Notater</h3>
                    <div className="bg-muted/40 p-3 rounded-lg">
                      <p className="text-sm">{medicalInfo.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ChildProfile;
