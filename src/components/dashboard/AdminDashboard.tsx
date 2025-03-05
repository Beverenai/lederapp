
import React, { useState } from 'react';
import CabinList from '@/components/cabins/CabinList';
import WeekSelector from '@/components/shared/WeekSelector';
import LeaderManagement from '@/components/leaders/LeaderManagement';
import { mockWeeks, mockUsers, getUsersByRole } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from '@/types/models';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const AdminDashboard = () => {
  const [selectedWeek, setSelectedWeek] = useState<number>(
    mockWeeks.find(week => week.isActive)?.id || 1
  );
  
  // Get users by role
  const admins = getUsersByRole('admin');
  const nurses = getUsersByRole('nurse');
  const leaders = getUsersByRole('leader');

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <WeekSelector 
          selectedWeek={selectedWeek} 
          onSelectWeek={setSelectedWeek} 
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ukeoversikt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {mockWeeks.map(week => (
              <div 
                key={week.id}
                className={`p-4 rounded-lg border ${
                  week.isActive 
                    ? 'border-green-500 bg-green-50 dark:bg-green-950/20' 
                    : 'border-gray-200 bg-gray-50 dark:bg-gray-800/10 dark:border-gray-700'
                }`}
              >
                <h3 className="font-medium">{week.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {week.startDate.toLocaleDateString()} - {week.endDate.toLocaleDateString()}
                </p>
                {week.isActive && (
                  <Badge className="mt-2 bg-green-500">Aktiv</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="leaders">
        <TabsList>
          <TabsTrigger value="leaders">Ledere</TabsTrigger>
          <TabsTrigger value="users">Brukere</TabsTrigger>
          <TabsTrigger value="cabins">Hytter</TabsTrigger>
          <TabsTrigger value="activities">Aktiviteter</TabsTrigger>
        </TabsList>
        
        <TabsContent value="leaders">
          <LeaderManagement />
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Brukeroversikt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Administratorer</h3>
                  <UserList users={admins} />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Sykepleiere</h3>
                  <UserList users={nurses} />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Ledere</h3>
                  <UserList users={leaders} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cabins">
          <CabinList />
        </TabsContent>
        
        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle>Aktivitetsoversikt</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Her vil det komme en oversikt over alle aktiviteter.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const UserList = ({ users }: { users: User[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map(user => (
        <div key={user.id} className="flex items-center space-x-4 p-4 border rounded-lg">
          <Avatar>
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {user.weeks?.map(week => (
                <Badge key={week} variant="outline" className="text-xs">
                  Uke {week}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
