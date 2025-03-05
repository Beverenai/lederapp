
import React, { useState, useEffect } from 'react';
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
import LeaderListItem from './LeaderListItem';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const LeaderManagement = () => {
  const [leaders, setLeaders] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeader, setSelectedLeader] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Fetch leaders from Supabase on component mount
  useEffect(() => {
    fetchLeaders();
  }, []);

  // Function to fetch leaders from Supabase
  const fetchLeaders = async () => {
    setLoading(true);
    try {
      // Get profiles with role 'leader' or 'nurse'
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['leader', 'nurse']);

      if (profilesError) {
        throw profilesError;
      }

      // Transform profiles data to match User type
      const transformedLeaders: User[] = profilesData.map(profile => ({
        id: profile.id,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
        email: profile.email || '',
        role: profile.role as any || 'leader',
        age: profile.age,
        skills: [], // We'll populate this from activities
        assignedCabinId: undefined, // We'll populate this later
        notes: profile.notes,
        activities: [], // To be populated
        team: profile.team,
        phone: profile.phone,
        hasDriverLicense: profile.has_driving_license,
        hasCar: profile.has_car,
        hasBoatLicense: profile.has_boat_license,
        rappellingAbility: profile.rappelling_ability as any || 'Nei',
        ziplineAbility: profile.zipline_ability as any || 'Nei',
        climbingAbility: profile.climbing_ability as any || 'Nei',
      }));

      // Set leaders state with transformed data
      setLeaders(transformedLeaders);
    } catch (error) {
      console.error('Error fetching leaders:', error);
      toast({
        title: 'Feil ved henting av ledere',
        description: 'Kunne ikke hente ledere fra databasen. Prøv igjen senere.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to update a leader
  const handleSaveChanges = async (updatedLeader: User) => {
    try {
      // Update the profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: updatedLeader.name.split(' ')[0],
          last_name: updatedLeader.name.split(' ').slice(1).join(' '),
          email: updatedLeader.email,
          role: updatedLeader.role,
          age: updatedLeader.age,
          notes: updatedLeader.notes,
          team: updatedLeader.team,
          phone: updatedLeader.phone,
          has_driving_license: updatedLeader.hasDriverLicense,
          has_car: updatedLeader.hasCar,
          has_boat_license: updatedLeader.hasBoatLicense,
          rappelling_ability: updatedLeader.rappellingAbility,
          zipline_ability: updatedLeader.ziplineAbility,
          climbing_ability: updatedLeader.climbingAbility,
        })
        .eq('id', updatedLeader.id);

      if (error) {
        throw error;
      }

      // Update local state
      setLeaders(prevLeaders => 
        prevLeaders.map(leader => 
          leader.id === updatedLeader.id ? updatedLeader : leader
        )
      );
      
      setSelectedLeader(null);
      
      toast({
        title: 'Leder oppdatert',
        description: 'Lederens informasjon er oppdatert.',
      });
    } catch (error) {
      console.error('Error updating leader:', error);
      toast({
        title: 'Feil ved oppdatering',
        description: 'Kunne ikke oppdatere lederen. Prøv igjen senere.',
        variant: 'destructive',
      });
    }
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
        {loading ? (
          <div className="text-center py-4">Laster ledere...</div>
        ) : (
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
              {filteredLeaders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Ingen ledere funnet.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeaders.map(leader => (
                  <LeaderListItem
                    key={leader.id}
                    leader={leader}
                    onSave={handleSaveChanges}
                    isSelected={selectedLeader?.id === leader.id}
                    onSelect={setSelectedLeader}
                  />
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaderManagement;
