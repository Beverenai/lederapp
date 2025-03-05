
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Search, 
  AlertCircle, 
  Check, 
  Calendar, 
  User,
  PlusCircle,
  Pill,
  Clock
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

// Mock data for medical alerts
const MEDICAL_ALERTS = [
  { 
    id: '1', 
    childName: 'Emma Hansen', 
    childImage: '/placeholder.svg',
    alert: 'Astma medisin kl 12:00', 
    time: '12:00',
    priority: 'high' 
  },
  { 
    id: '2', 
    childName: 'William Larsen',
    childImage: '/placeholder.svg', 
    alert: 'Allergi medisin', 
    time: '15:00',
    priority: 'medium' 
  },
  { 
    id: '3', 
    childName: 'Sofia Pedersen',
    childImage: '/placeholder.svg', 
    alert: 'Må ta insulin', 
    time: '18:00',
    priority: 'high' 
  },
];

// Mock data for children with medical needs
const CHILDREN_WITH_MEDICAL_NEEDS = [
  { 
    id: '1', 
    name: 'Emma Hansen', 
    age: 10,
    profileImage: '/placeholder.svg',
    condition: 'Astma',
    medications: ['Ventolin inhalator (ved behov)', 'Flutide morgen og kveld'],
    allergies: ['Pollen', 'Katt'],
    cabin: 'Fjellhytta'
  },
  { 
    id: '2', 
    name: 'Lucas Jensen', 
    age: 9,
    profileImage: '/placeholder.svg',
    condition: 'Matallergier',
    medications: ['Antihistamin ved behov'],
    allergies: ['Nøtter', 'Egg', 'Melk'],
    cabin: 'Sjøhytta'
  },
  { 
    id: '3', 
    name: 'Sofia Pedersen', 
    age: 11,
    profileImage: '/placeholder.svg',
    condition: 'Type 1 diabetes',
    medications: ['Insulin før måltider og ved behov'],
    allergies: [],
    cabin: 'Fjellhytta'
  },
  { 
    id: '4', 
    name: 'William Larsen', 
    age: 11,
    profileImage: '/placeholder.svg',
    condition: 'Allergier',
    medications: ['Antihistamin daglig'],
    allergies: ['Pollen', 'Katt', 'Hund'],
    cabin: 'Skogshytta'
  },
];

// Mock data for medication schedule
const MEDICATION_SCHEDULE = [
  { 
    id: '1', 
    childName: 'Emma Hansen',
    childImage: '/placeholder.svg',
    medication: 'Flutide', 
    time: '08:00',
    given: true 
  },
  { 
    id: '2', 
    childName: 'Sofia Pedersen',
    childImage: '/placeholder.svg',
    medication: 'Insulin', 
    time: '08:00',
    given: true 
  },
  { 
    id: '3', 
    childName: 'Lucas Jensen',
    childImage: '/placeholder.svg',
    medication: 'Antihistamin', 
    time: '08:00',
    given: true 
  },
  { 
    id: '4', 
    childName: 'Emma Hansen',
    childImage: '/placeholder.svg',
    medication: 'Flutide', 
    time: '20:00',
    given: false 
  },
  { 
    id: '5', 
    childName: 'Sofia Pedersen',
    childImage: '/placeholder.svg',
    medication: 'Insulin', 
    time: '18:00',
    given: false 
  },
];

const NurseDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter children based on search query
  const filteredChildren = CHILDREN_WITH_MEDICAL_NEEDS.filter(child => 
    child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    child.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
    child.allergies.some(allergy => 
      allergy.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sykepleier Dashboard</h1>
        <p className="text-muted-foreground">
          Oversikt over barn med medisinske behov
        </p>
      </div>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {/* Search and filter */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Søk etter barn eller medisinske tilstander..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <PlusCircle className="h-4 w-4 mr-2" />
              Nytt medisinsk behov
            </Button>
          </div>
          
          {/* Children with medical needs */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Barn med medisinske behov</CardTitle>
              <CardDescription>
                {filteredChildren.length} barn har registrerte medisinske behov
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredChildren.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Ingen barn funnet som matcher søkekriteriene
                  </div>
                ) : (
                  filteredChildren.map((child) => (
                    <Card key={child.id} className="hover-scale">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={child.profileImage} alt={child.name} />
                              <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{child.name}</CardTitle>
                              <CardDescription>{child.age} år, {child.cabin}</CardDescription>
                            </div>
                          </div>
                          <Badge variant="outline" className={cn(
                            child.condition === 'Astma' ? "bg-blue-50 text-blue-700 border-blue-200" :
                            child.condition === 'Type 1 diabetes' ? "bg-red-50 text-red-700 border-red-200" :
                            "bg-amber-50 text-amber-700 border-amber-200"
                          )}>
                            {child.condition}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {child.medications.length > 0 && (
                          <div className="mb-2">
                            <h4 className="text-sm font-medium mb-1 flex items-center">
                              <Pill className="h-3.5 w-3.5 mr-1 text-oksnoen-red" />
                              Medisiner:
                            </h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground pl-1">
                              {child.medications.map((med, idx) => (
                                <li key={idx}>{med}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {child.allergies.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-1 flex items-center">
                              <AlertCircle className="h-3.5 w-3.5 mr-1 text-oksnoen-red" />
                              Allergier:
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {child.allergies.map((allergy, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {allergy}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="outline" size="sm" className="w-full">
                          <User className="h-3.5 w-3.5 mr-1" />
                          Se full profil
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          {/* Medication Alerts */}
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-oksnoen-red" />
                Medisinske varsler
              </CardTitle>
              <CardDescription>
                Kommende medisiner for i dag
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {MEDICAL_ALERTS.map((alert) => (
                  <div 
                    key={alert.id}
                    className={cn(
                      "p-3 rounded-lg flex items-start",
                      alert.priority === 'high' ? "bg-red-50 border border-red-100" : 
                      alert.priority === 'medium' ? "bg-amber-50 border border-amber-100" :
                      "bg-muted/40"
                    )}
                  >
                    <Avatar className="h-8 w-8 mr-2 mt-0.5">
                      <AvatarImage src={alert.childImage} alt={alert.childName} />
                      <AvatarFallback>{alert.childName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="font-medium">{alert.childName}</p>
                        <Badge variant="outline" className={cn(
                          "ml-2",
                          alert.priority === 'high' ? "bg-red-50 text-red-700 border-red-200" :
                          alert.priority === 'medium' ? "bg-amber-50 text-amber-700 border-amber-200" :
                          "bg-green-50 text-green-700 border-green-200"
                        )}>
                          {alert.time}
                        </Badge>
                      </div>
                      <p className="text-sm mt-1">{alert.alert}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Medication Schedule */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-oksnoen-green" />
                Medisinplan for i dag
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {MEDICATION_SCHEDULE.map((schedule) => (
                <div key={schedule.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={cn(
                      "h-6 w-6 rounded-full mr-2 flex items-center justify-center border",
                      schedule.given 
                        ? "bg-oksnoen-green text-white border-transparent"
                        : "border-muted"
                    )}>
                      {schedule.given && <Check className="h-4 w-4" />}
                    </div>
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={schedule.childImage} alt={schedule.childName} />
                        <AvatarFallback>{schedule.childName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {schedule.childName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {schedule.medication}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-muted-foreground flex items-center mr-2">
                      <Clock className="h-3 w-3 mr-1" />
                      {schedule.time}
                    </span>
                    {!schedule.given && (
                      <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                        Registrer
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                Se fullstendig plan
              </Button>
            </CardFooter>
          </Card>
          
          {/* Quick Actions */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Hurtighandlinger</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="default">
                <PlusCircle className="h-4 w-4 mr-2" />
                Registrer medisin
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <AlertCircle className="h-4 w-4 mr-2" />
                Logg medisinsk hendelse
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <User className="h-4 w-4 mr-2" />
                Se barn med spesielle behov
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NurseDashboard;
