
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Home, Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CabinChild {
  id: string;
  name: string;
  age: number;
  profileImage: string;
}

interface CabinLeader {
  id: string;
  name: string;
  profileImage: string;
}

interface CabinCardProps {
  id: string;
  name: string;
  capacity: number;
  children: CabinChild[];
  leader?: CabinLeader;
  onClick?: () => void;
}

const CabinCard: React.FC<CabinCardProps> = ({
  id,
  name,
  capacity,
  children,
  leader,
  onClick
}) => {
  const occupancyPercentage = (children.length / capacity) * 100;
  
  return (
    <Card className="hover-scale glass-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Home className="h-5 w-5 mr-2 text-oksnoen-green" />
            {name}
          </CardTitle>
          <Badge variant={children.length === capacity ? "default" : "outline"}>
            {children.length} / {capacity}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Occupancy bar */}
        <div>
          <div className="text-sm text-muted-foreground mb-1 flex justify-between">
            <span>Belegg</span>
            <span>{Math.round(occupancyPercentage)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full",
                occupancyPercentage < 50 ? "bg-oksnoen-green" : 
                occupancyPercentage < 90 ? "bg-oksnoen-blue" : "bg-oksnoen-red"
              )}
              style={{ width: `${occupancyPercentage}%` }}
            />
          </div>
        </div>
        
        {/* Leader */}
        {leader && (
          <div>
            <div className="text-sm font-medium mb-2">Leder:</div>
            <div className="flex items-center bg-muted/40 p-2 rounded-lg">
              <Avatar className="h-8 w-8">
                <AvatarImage src={leader.profileImage} alt={leader.name} />
                <AvatarFallback>{leader.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium leading-none">{leader.name}</p>
                <p className="text-xs text-muted-foreground">Hytteleder</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Children */}
        <div>
          <div className="text-sm font-medium mb-2">Barn:</div>
          <div className="flex flex-wrap gap-1">
            {children.slice(0, 5).map((child) => (
              <Avatar key={child.id} className="h-8 w-8 border-2 border-background">
                <AvatarImage src={child.profileImage} alt={child.name} />
                <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
            {children.length > 5 && (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                +{children.length - 5}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onClick}
        >
          <Users className="h-4 w-4 mr-2" />
          Se detaljer
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CabinCard;
