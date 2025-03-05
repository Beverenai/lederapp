
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, UserRole } from '@/types/models';
import { mockUsers, mockCabins } from '@/data/mockData';
import { Pencil } from 'lucide-react';

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
              <TableRow key={leader.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={leader.image} alt={leader.name} />
                      <AvatarFallback>{leader.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{leader.name}</div>
                      <div className="text-sm text-muted-foreground">{leader.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={
                      leader.role === 'admin' 
                        ? 'bg-blue-500' 
                        : leader.role === 'nurse' 
                          ? 'bg-green-500' 
                          : 'bg-amber-500'
                    }
                  >
                    {leader.role === 'admin' 
                      ? 'Admin' 
                      : leader.role === 'nurse' 
                        ? 'Sykepleier' 
                        : 'Leder'
                    }
                  </Badge>
                </TableCell>
                <TableCell>
                  {leader.assignedCabinId 
                    ? mockCabins.find(cabin => cabin.id === leader.assignedCabinId)?.name || '-'
                    : '-'
                  }
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {leader.skills?.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    )) || '-'}
                  </div>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => setSelectedLeader(leader)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    {selectedLeader && selectedLeader.id === leader.id && (
                      <LeaderEditDialog 
                        leader={selectedLeader} 
                        onSave={handleSaveChanges} 
                      />
                    )}
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

interface LeaderEditDialogProps {
  leader: User;
  onSave: (updatedLeader: User) => void;
}

const LeaderEditDialog = ({ leader, onSave }: LeaderEditDialogProps) => {
  const [editedLeader, setEditedLeader] = useState<User>({...leader});
  
  const handleChange = (field: keyof User, value: any) => {
    setEditedLeader(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSave = () => {
    onSave({
      ...editedLeader
    });
  };
  
  const handleSkillsChange = (skillsString: string) => {
    const skillsArray = skillsString
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill !== '');
    
    handleChange('skills', skillsArray);
  };
  
  const handleActivitiesChange = (activitiesString: string) => {
    const activitiesArray = activitiesString
      .split(',')
      .map(activity => activity.trim())
      .filter(activity => activity !== '');
    
    handleChange('activities', activitiesArray);
  };

  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>Rediger Lederinformasjon</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-6 py-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Navn</Label>
            <Input 
              id="name" 
              value={editedLeader.name} 
              onChange={(e) => handleChange('name', e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">E-post</Label>
            <Input 
              id="email" 
              value={editedLeader.email} 
              onChange={(e) => handleChange('email', e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="age">Alder</Label>
            <Input 
              id="age" 
              type="number" 
              value={editedLeader.age || ''} 
              onChange={(e) => handleChange('age', parseInt(e.target.value) || undefined)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Rolle</Label>
            <Select 
              value={editedLeader.role} 
              onValueChange={(value: UserRole) => handleChange('role', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Velg rolle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="nurse">Sykepleier</SelectItem>
                <SelectItem value="leader">Leder</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cabin">Tildelt Hytte</Label>
            <Select 
              value={editedLeader.assignedCabinId || ''} 
              onValueChange={(value) => handleChange('assignedCabinId', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Velg hytte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Ingen hytte</SelectItem>
                {mockCabins.map(cabin => (
                  <SelectItem key={cabin.id} value={cabin.id}>
                    {cabin.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="team">Team</Label>
            <Input 
              id="team" 
              value={editedLeader.team || ''} 
              onChange={(e) => handleChange('team', e.target.value || undefined)} 
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skills">Ferdigheter (kommaseparert)</Label>
            <Textarea 
              id="skills" 
              value={editedLeader.skills?.join(', ') || ''} 
              onChange={(e) => handleSkillsChange(e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="activities">Aktiviteter (kommaseparert)</Label>
            <Textarea 
              id="activities" 
              value={editedLeader.activities?.join(', ') || ''} 
              onChange={(e) => handleActivitiesChange(e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notater</Label>
            <Textarea 
              id="notes" 
              value={editedLeader.notes || ''} 
              onChange={(e) => handleChange('notes', e.target.value || undefined)} 
            />
          </div>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Avbryt</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button onClick={handleSave}>Lagre endringer</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};

export default LeaderManagement;
