
import { Cabin } from '@/types/models';

// Mock-data for hytter
export const mockCabins: Cabin[] = [
  {
    id: '1',
    name: 'Elgbu',
    capacity: 8,
    assignedLeaderId: '3',
  },
  {
    id: '2',
    name: 'Bjørnebo',
    capacity: 10,
    assignedLeaderId: '4',
  },
  {
    id: '3',
    name: 'Revehiet',
    capacity: 6,
    assignedLeaderId: undefined,
  },
];
