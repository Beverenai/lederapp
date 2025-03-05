
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Home, 
  Calendar, 
  ClipboardList,
  ChevronLeft,
  ChevronRight 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// Mock data
const WEEKS = [
  { id: '1', name: 'Uke 26: 24-30 Juni' },
  { id: '2', name: 'Uke 27: 1-7 Juli' },
  { id: '3', name: 'Uke 28: 8-14 Juli' },
];

const LEADERS = [
  { id: '1', name: 'Anna Hansen', role: 'Leder', cabin: 'Fjellhytta', weeks: ['1', '2'] },
  { id: '2', name: 'Erik Johansen', role: 'Leder', cabin: 'Sjøhytta', weeks: ['1'] },
  { id: '3', name: 'Maria Olsen', role: 'Nurse', cabin: null, weeks: ['1', '3'] },
  { id: '4', name: 'Thomas Berg', role: 'Admin', cabin: null, weeks: ['1', '2', '3'] },
];

const CABINS = [
  { id: '1', name: 'Fjellhytta', capacity: 8, currentOccupancy: 6 },
  { id: '2', name: 'Sjøhytta', capacity: 10, currentOccupancy: 9 },
  { id: '3', name: 'Skogshytta', capacity: 6, currentOccupancy: 4 },
  { id: '4', name: 'Elvehytta', capacity: 8, currentOccupancy: 7 },
];

const ACTIVITIES = [
  { id: '1', name: 'Kanopadling', completed: 12, total: 24 },
  { id: '2', name: 'Fjelltur', completed: 18, total: 24 },
  { id: '3', name: 'Leirbål', completed: 24, total: 24 },
  { id: '4', name: 'Svømming', completed: 16, total: 24 },
];

const StatCard: React.FC<{ 
  title: string; 
  value: string | number; 
  description: string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, description, icon, color }) => {
  return (
    <Card className="hover-scale glass-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn("p-2 rounded-full", `bg-${color}/10`)}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const AdminDashboard: React.FC = () => {
  const [activeWeek, setActiveWeek] = useState(WEEKS[0]);

  const nextWeek = () => {
    const currentIndex = WEEKS.findIndex(week => week.id === activeWeek.id);
    if (currentIndex < WEEKS.length - 1) {
      setActiveWeek(WEEKS[currentIndex + 1]);
    }
  };

  const prevWeek = () => {
    const currentIndex = WEEKS.findIndex(week => week.id === activeWeek.id);
    if (currentIndex > 0) {
      setActiveWeek(WEEKS[currentIndex - 1]);
    }
  };

  // Filter leaders by active week
  const weekLeaders = LEADERS.filter(leader => 
    leader.weeks.includes(activeWeek.id)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Oversikt over leiren, ledere, hytter og aktiviteter
          </p>
        </div>
        
        <div className="flex items-center mt-4 md:mt-0 space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={prevWeek}
            disabled={activeWeek.id === WEEKS[0].id}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center bg-muted px-4 py-1.5 rounded-md">
            <Calendar className="h-4 w-4 mr-2 text-oksnoen-green" />
            <span className="text-sm font-medium">{activeWeek.name}</span>
          </div>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={nextWeek}
            disabled={activeWeek.id === WEEKS[WEEKS.length - 1].id}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Totalt Ledere"
          value={weekLeaders.length}
          description={`Aktive i ${activeWeek.name}`}
          icon={<Users className="h-4 w-4 text-oksnoen-red" />}
          color="oksnoen-red"
        />
        <StatCard
          title="Hytter"
          value={CABINS.length}
          description="Totalt antall hytter"
          icon={<Home className="h-4 w-4 text-oksnoen-green" />}
          color="oksnoen-green"
        />
        <StatCard
          title="Belegg"
          value={`${Math.round(
            (CABINS.reduce((acc, cabin) => acc + cabin.currentOccupancy, 0) / 
            CABINS.reduce((acc, cabin) => acc + cabin.capacity, 0)) * 100
          )}%`}
          description="Gjennomsnittlig hyttebelegg"
          icon={<Users className="h-4 w-4 text-oksnoen-blue" />}
          color="oksnoen-blue"
        />
        <StatCard
          title="Aktiviteter"
          value={ACTIVITIES.length}
          description="Planlagte aktiviteter denne uken"
          icon={<ClipboardList className="h-4 w-4 text-oksnoen-red" />}
          color="oksnoen-red"
        />
      </div>

      <Tabs defaultValue="leaders" className="w-full">
        <TabsList className="mb-4 w-full sm:w-auto">
          <TabsTrigger value="leaders">Ledere</TabsTrigger>
          <TabsTrigger value="cabins">Hytter</TabsTrigger>
          <TabsTrigger value="activities">Aktiviteter</TabsTrigger>
        </TabsList>
        
        <TabsContent value="leaders" className="mt-0">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Ledere for {activeWeek.name}</CardTitle>
              <CardDescription>
                Oversikt over ledere og deres roller
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weekLeaders.map((leader) => (
                  <div key={leader.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg hover:bg-muted/60 transition-colors">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                        <img 
                          src="/placeholder.svg" 
                          alt={leader.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">{leader.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">{leader.role}</p>
                      </div>
                    </div>
                    <div className="text-sm">
                      {leader.cabin ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-oksnoen-green/10 text-oksnoen-green">
                          <Home className="h-3 w-3 mr-1" /> {leader.cabin}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                          Ingen hytte
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cabins" className="mt-0">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Hytteoversikt</CardTitle>
              <CardDescription>
                Status for alle hytter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {CABINS.map((cabin) => {
                  const occupancyPercentage = Math.round((cabin.currentOccupancy / cabin.capacity) * 100);
                  
                  return (
                    <div key={cabin.id} className="flex flex-col p-4 bg-muted/40 rounded-lg hover:bg-muted/60 transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium flex items-center">
                          <Home className="h-4 w-4 mr-2 text-oksnoen-green" /> 
                          {cabin.name}
                        </h3>
                        <span className="text-sm">
                          {cabin.currentOccupancy} / {cabin.capacity} plasser
                        </span>
                      </div>
                      
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            occupancyPercentage < 50 ? "bg-oksnoen-green" : 
                            occupancyPercentage < 90 ? "bg-oksnoen-blue" : "bg-oksnoen-red"
                          )}
                          style={{ width: `${occupancyPercentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activities" className="mt-0">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Aktivitetsstatus</CardTitle>
              <CardDescription>
                Oversikt over gjennomførte aktiviteter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ACTIVITIES.map((activity) => {
                  const completionPercentage = Math.round((activity.completed / activity.total) * 100);
                  
                  return (
                    <div key={activity.id} className="flex flex-col p-4 bg-muted/40 rounded-lg hover:bg-muted/60 transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{activity.name}</h3>
                        <span className="text-sm">
                          {completionPercentage}% gjennomført
                        </span>
                      </div>
                      
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-oksnoen-blue rounded-full"
                          style={{ width: `${completionPercentage}%` }}
                        />
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-2">
                        {activity.completed} av {activity.total} barn har fullført
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
