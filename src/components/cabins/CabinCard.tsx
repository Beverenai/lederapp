
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Home, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Cabin, User } from '@/types/models';

interface CabinCardProps {
  cabin: Cabin;
  leader?: User;
  childCount: number;
  onClick?: () => void;
}

const CabinCard: React.FC<CabinCardProps> = ({
  cabin,
  leader,
  childCount,
  onClick
}) => {
  const { name, capacity } = cabin;
  const occupancyPercentage = (childCount / capacity) * 100;
  
  return (
    <Card className="hover-scale glass-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Home className="h-5 w-5 mr-2 text-oksnoen-green" />
            {name}
          </CardTitle>
          <Badge variant={childCount === capacity ? "default" : "outline"}>
            {childCount} / {capacity}
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
                <AvatarImage src={leader.image} alt={leader.name} />
                <AvatarFallback>{leader.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium leading-none">{leader.name}</p>
                <p className="text-xs text-muted-foreground">Hytteleder</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Children count */}
        <div>
          <div className="text-sm font-medium mb-2">Barn:</div>
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-muted-foreground" />
            <span>{childCount} barn i hytta</span>
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
