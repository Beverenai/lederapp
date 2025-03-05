
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockWeeks } from '@/data/mockData';

interface WeekSelectorProps {
  selectedWeek: number;
  onSelectWeek: (weekId: number) => void;
  className?: string;
}

const WeekSelector = ({ selectedWeek, onSelectWeek, className }: WeekSelectorProps) => {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="mr-2 text-sm font-medium">Aktiv uke:</span>
      <Select 
        value={selectedWeek.toString()} 
        onValueChange={(value) => onSelectWeek(parseInt(value))}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Velg uke" />
        </SelectTrigger>
        <SelectContent>
          {mockWeeks.map((week) => (
            <SelectItem key={week.id} value={week.id.toString()}>
              {week.name} ({formatDateRange(week.startDate, week.endDate)})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const formatDateRange = (start: Date, end: Date) => {
  const startDay = start.getDate();
  const endDay = end.getDate();
  const month = start.toLocaleString('no-NO', { month: 'short' });
  
  return `${startDay}.-${endDay}. ${month}`;
};

export default WeekSelector;
