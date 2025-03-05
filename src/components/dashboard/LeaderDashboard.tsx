
import React, { useState } from 'react';
import TaskList from '@/components/tasks/TaskList';
import CabinList from '@/components/cabins/CabinList';
import ChildList from '@/components/children/ChildList';
import WeekSelector from '@/components/shared/WeekSelector';
import { mockWeeks, mockUsers } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LeaderDashboard = () => {
  const [selectedWeek, setSelectedWeek] = useState<number>(
    mockWeeks.find(week => week.isActive)?.id || 1
  );
  
  // For demo, let's assume we're logged in as leader Lars
  const currentUser = mockUsers.find(user => user.id === '3');
  const assignedCabinId = currentUser?.assignedCabinId;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Leder Dashboard</h1>
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
              {/* Display week information */}
              Du er innlogget for {mockWeeks.find(w => w.id === selectedWeek)?.name}. 
              {assignedCabinId 
                ? ` Du er tildelt hytte ${mockUsers.find(u => u.id === currentUser?.id)?.assignedCabinId}.`
                : ' Du er ikke tildelt noen hytte ennå.'
              }
            </p>
          </CardContent>
        </Card>
        
        <TaskList userId={currentUser?.id || '3'} />
      </div>

      {assignedCabinId && (
        <ChildList cabinId={assignedCabinId} canViewMedicalInfo={false} />
      )}
    </div>
  );
};

export default LeaderDashboard;
