
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Pencil } from 'lucide-react';
import { User } from '@/types/models';
import { mockCabins } from '@/data/mockData';
import LeaderEditDialog from './LeaderEditDialog';

interface LeaderListItemProps {
  leader: User;
  onSave: (updatedLeader: User) => void;
  isSelected: boolean;
  onSelect: (leader: User) => void;
}

const LeaderListItem = ({ leader, onSave, isSelected, onSelect }: LeaderListItemProps) => {
  return (
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
              onClick={() => onSelect(leader)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          {isSelected && (
            <LeaderEditDialog 
              leader={leader} 
              onSave={onSave} 
            />
          )}
        </Dialog>
      </TableCell>
    </TableRow>
  );
};

export default LeaderListItem;
