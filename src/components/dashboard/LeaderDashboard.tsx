
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Home, 
  Calendar, 
  ClipboardList,
  Calendar as CalendarIcon,
  User,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

// Mock data
const TODAY_TASKS = [
  { id: '1', title: 'Morgensamling', time: '08:00', completed: true },
  { id: '2', title: 'Aktivitet: Kanopadling', time: '10:00', completed: false },
  { id: '3', title: 'Lunsj med hytte', time: '12:00', completed: false },
  { id: '4', title: 'Aktivitet: Fjelltur', time: '14:00', completed: false },
  { id: '5', title: 'Kveldssamling', time: '20:00', completed: false },
];

const CABIN_CHILDREN = [
  { id: '1', name: 'Emma Hansen', age: 10, profileImage: '/placeholder.svg' },
  { id: '2', name: 'Lucas Jensen', age: 9, profileImage: '/placeholder.svg' },
  { id: '3', name: 'Sofia Pedersen', age: 11, profileImage: '/placeholder.svg' },
  { id: '4', name: 'Noah Andersen', age: 10, profileImage: '/placeholder.svg' },
  { id: '5', name: 'Olivia Christensen', age: 9, profileImage: '/placeholder.svg' },
  { id: '6', name: 'William Larsen', age: 11, profileImage: '/placeholder.svg' },
];

const UPCOMING_ACTIVITIES = [
  { id: '1', title: 'Kanopadling', time: 'Mandag 10:00', status: 'pending' },
  { id: '2', title: 'Fjelltur', time: 'Mandag 14:00', status: 'pending' },
  { id: '3', title: 'Leirbål', time: 'Mandag 20:00', status: 'pending' },
  { id: '4', title: 'Svømming', time: 'Tirsdag 10:00', status: 'pending' },
];

const LeaderDashboard: React.FC = () => {
  const { user } = useAuth();
  const cabinName = user?.cabin || 'Ingen tildelt hytte';
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leder Dashboard</h1>
        <p className="text-muted-foreground">
          Velkommen tilbake, {user?.name}
        </p>
      </div>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {/* Daily Tasks */}
          <Card className="glass-card">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Dagens oppgaver</CardTitle>
                  <CardDescription>Mandag, 26. Juni</CardDescription>
                </div>
                <div className="bg-oksnoen-red/10 text-oksnoen-red rounded-full px-3 py-1 text-sm font-medium flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>Uke 26</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {TODAY_TASKS.map((task) => (
                  <div 
                    key={task.id}
                    className={cn(
                      "p-3 rounded-lg flex items-center justify-between",
                      task.completed ? "bg-oksnoen-green/5" : "bg-muted/40"
                    )}
                  >
                    <div className="flex items-center">
                      <div className={cn(
                        "h-5 w-5 rounded-full mr-3 flex items-center justify-center",
                        task.completed ? "bg-oksnoen-green text-white" : "bg-muted"
                      )}>
                        {task.completed && <CheckCircle className="h-4 w-4" />}
                      </div>
                      <span className={cn(
                        task.completed && "line-through text-muted-foreground"
                      )}>
                        {task.title}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">{task.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Upcoming Activities */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Kommende aktiviteter</CardTitle>
              <CardDescription>Aktiviteter for din hytte denne uken</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {UPCOMING_ACTIVITIES.map((activity) => (
                  <div key={activity.id} className="p-4 bg-muted/40 rounded-lg hover:bg-muted/60 transition-colors">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{activity.title}</h3>
                      <span className="text-sm text-muted-foreground">{activity.time}</span>
                    </div>
                    <div className="mt-2">
                      <Button size="sm" variant="outline" className="mr-2">
                        <ClipboardList className="h-4 w-4 mr-1" />
                        Se deltakerliste
                      </Button>
                      <Button size="sm" variant="default" className="bg-oksnoen-green hover:bg-oksnoen-green/90">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Registrer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          {/* Cabin Info */}
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Din Hytte</CardTitle>
                <Home className="h-5 w-5 text-oksnoen-green" />
              </div>
              <CardDescription>
                {cabinName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <span>Kapasitet</span>
                <span className="font-medium">{CABIN_CHILDREN.length} / 8 barn</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-oksnoen-green rounded-full"
                  style={{ width: `${(CABIN_CHILDREN.length / 8) * 100}%` }}
                />
              </div>
            </CardContent>
            <Separator />
            <CardHeader className="pb-0 pt-4">
              <CardTitle className="text-base">Barn i din hytte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mt-2">
                {CABIN_CHILDREN.map((child) => (
                  <div key={child.id} className="flex items-center p-2 hover:bg-muted/40 rounded-lg transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={child.profileImage} alt={child.name} />
                      <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <p className="text-sm font-medium leading-none">{child.name}</p>
                      <p className="text-xs text-muted-foreground">{child.age} år</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Se alle barn
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
                <ClipboardList className="h-4 w-4 mr-2" />
                Registrer aktivitet
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <User className="h-4 w-4 mr-2" />
                Ta bilde av barn
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Home className="h-4 w-4 mr-2" />
                Hytte-status
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LeaderDashboard;
