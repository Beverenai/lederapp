
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockChildren, mockCabins } from '@/data/mockData';
import { Child } from '@/types/models';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';

interface ChildListProps {
  cabinId?: string; // Optional, to filter by cabin
  canViewMedicalInfo?: boolean; // For role-based access
}

const ChildList = ({ cabinId, canViewMedicalInfo = false }: ChildListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const getCabinName = (id: string) => {
    const cabin = mockCabins.find(c => c.id === id);
    return cabin ? cabin.name : 'Ukjent hytte';
  };

  // Filter children by cabin and search term
  const filteredChildren = mockChildren.filter(child => {
    const matchesCabin = !cabinId || child.cabinId === cabinId;
    const matchesSearch = child.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCabin && matchesSearch;
  });

  const handleChildClick = (child: Child) => {
    // Navigate to child profile (we'll implement this route later)
    console.log('Navigating to child profile:', child.id);
    // navigate(`/child/${child.id}`);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">
          {cabinId ? `Barn i ${getCabinName(cabinId)}` : 'Alle barn'}
        </CardTitle>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Søk etter barn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredChildren.map((child) => (
            <div 
              key={child.id}
              className="flex flex-col border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleChildClick(child)}
            >
              <div className="aspect-video w-full bg-muted relative">
                {child.image ? (
                  <img 
                    src={child.image} 
                    alt={child.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Intet bilde
                  </div>
                )}
                {child.medicalInfo && canViewMedicalInfo && (
                  <div className="absolute top-2 right-2 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100 px-2 py-1 rounded-full text-xs font-medium">
                    Medisinsk info
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-base">{child.name}</h3>
                <div className="text-sm text-muted-foreground mt-1 space-y-1">
                  <p>{child.age} år • {getCabinName(child.cabinId)}</p>
                  {child.notes && (
                    <p className="line-clamp-2">{child.notes}</p>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2 w-full"
                >
                  Se detaljer
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChildList;
