
import { Child } from '@/types/models';

// Mock-data for barn
export const mockChildren: Child[] = [
  {
    id: '1',
    name: 'Ole Hansen',
    age: 9,
    cabinId: '1',
    image: 'https://i.pravatar.cc/150?img=5',
    medicalInfo: 'Allergisk mot peanøtter, må ha epipen tilgjengelig.',
    notes: 'Liker fotball og klatring.',
  },
  {
    id: '2',
    name: 'Kari Olsen',
    age: 10,
    cabinId: '1',
    image: 'https://i.pravatar.cc/150?img=6',
    notes: 'Svømmedyktig, elsker å være i vannet.',
  },
  {
    id: '3',
    name: 'Jonas Pedersen',
    age: 11,
    cabinId: '2',
    image: 'https://i.pravatar.cc/150?img=7',
    medicalInfo: 'Bruker astmamedisin ved behov.',
    notes: 'Interessert i naturfag og insekter.',
  },
  {
    id: '4',
    name: 'Emma Andersen',
    age: 10,
    cabinId: '2',
    image: 'https://i.pravatar.cc/150?img=8',
    notes: 'Veldig kreativ, liker tegning og maling.',
  },
];

// Hjelpefunksjon for å finne barn i en spesifikk hytte
export const getChildrenByCabinId = (cabinId: string): Child[] => {
  return mockChildren.filter(child => child.cabinId === cabinId);
};
