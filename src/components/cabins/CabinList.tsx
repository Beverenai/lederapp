
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockCabins, mockUsers, getChildrenByCabinId } from '@/data/mockData';
import CabinCard from '@/components/cabins/CabinCard';
import { Cabin, User } from '@/types/models';

const CabinList = () => {
  const [cabins] = useState<Cabin[]>(mockCabins);

  const getCabinLeader = (leaderId?: string): User | undefined => {
    if (!leaderId) return undefined;
    return mockUsers.find(user => user.id === leaderId);
  };

  const getChildCount = (cabinId: string): number => {
    return getChildrenByCabinId(cabinId).length;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Hytteoversikt</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cabins.map(cabin => (
            <CabinCard
              key={cabin.id}
              cabin={cabin}
              leader={getCabinLeader(cabin.assignedLeaderId)}
              childCount={getChildCount(cabin.id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CabinList;
