
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { User } from '@/types/models';
import { mockUsers } from '@/data/mockData';
import LeaderListItem from './LeaderListItem';

const LeaderManagement = () => {
  const [leaders, setLeaders] = useState<User[]>(
    mockUsers.filter(user => user.role === 'leader' || user.role === 'nurse')
  );
  const [selectedLeader, setSelectedLeader] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSaveChanges = (updatedLeader: User) => {
    setLeaders(prevLeaders => 
      prevLeaders.map(leader => 
        leader.id === updatedLeader.id ? updatedLeader : leader
      )
    );
    setSelectedLeader(null);
  };

  const filteredLeaders = leaders.filter(leader => 
    leader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leader.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">Administrer Ledere</CardTitle>
        <div className="w-1/3">
          <Input
            placeholder="Søk etter ledere..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Leder</TableHead>
              <TableHead>Rolle</TableHead>
              <TableHead>Hytte</TableHead>
              <TableHead>Ferdigheter</TableHead>
              <TableHead>Handlinger</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeaders.map(leader => (
              <LeaderListItem
                key={leader.id}
                leader={leader}
                onSave={handleSaveChanges}
                isSelected={selectedLeader?.id === leader.id}
                onSelect={setSelectedLeader}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LeaderManagement;
