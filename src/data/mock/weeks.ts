
import { Week } from '@/types/models';

// Mock-data for uker
export const mockWeeks: Week[] = [
  {
    id: 1,
    name: 'Uke 27',
    startDate: new Date('2023-07-03'),
    endDate: new Date('2023-07-09'),
    isActive: true,
  },
  {
    id: 2,
    name: 'Uke 28',
    startDate: new Date('2023-07-10'),
    endDate: new Date('2023-07-16'),
    isActive: false,
  },
  {
    id: 3,
    name: 'Uke 29',
    startDate: new Date('2023-07-17'),
    endDate: new Date('2023-07-23'),
    isActive: false,
  },
  {
    id: 4,
    name: 'Uke 30',
    startDate: new Date('2023-07-24'),
    endDate: new Date('2023-07-30'),
    isActive: false,
  },
];
