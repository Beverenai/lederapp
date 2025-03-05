
import React, { useState } from 'react';
import TaskList from '@/components/tasks/TaskList';
import ChildList from '@/components/children/ChildList';
import WeekSelector from '@/components/shared/WeekSelector';
import { mockWeeks, mockUsers } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const NurseDashboard = () => {
  const [selectedWeek, setSelectedWeek] = useState<number>(
    mockWeeks.find(week => week.isActive)?.id || 1
  );
  
  // For demo, let's assume we're logged in as nurse
  const currentUser = mockUsers.find(user => user.id === '2');

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sykepleier Dashboard</h1>
        <WeekSelector 
          selectedWeek={selectedWeek} 
          onSelectWeek={setSelectedWeek} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Velkommen, {currentUser?.name}!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Du er innlogget for {mockWeeks.find(w => w.id === selectedWeek)?.name}. 
              Som sykepleier har du tilgang til all medisinsk informasjon om barna.
            </p>
          </CardContent>
        </Card>
        
        <TaskList userId={currentUser?.id || '2'} />
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Alle barn</TabsTrigger>
          <TabsTrigger value="medical">Barn med medisinsk info</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <ChildList canViewMedicalInfo={true} />
        </TabsContent>
        <TabsContent value="medical">
          {/* For medisinsk info, vi ville filtrere barn med medisinsk info */}
          <Card>
            <CardHeader>
              <CardTitle>Barn med medisinsk informasjon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Dette viser kun barn som har medisinsk informasjon registrert.
              </p>
              <ChildList canViewMedicalInfo={true} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NurseDashboard;
