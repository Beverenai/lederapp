
import { Activity } from '@/types/models';

// Mock-data for aktiviteter
export const mockActivities: Activity[] = [
  {
    id: '1',
    name: 'Kanopadling',
    description: 'Kano på innsjøen med sikkerhetsinstruksjoner',
    childId: '1',
    completed: true,
    comment: 'Ole var flink til å padle og hjalp til med å bære kanoen.',
    completedAt: new Date('2023-07-05T14:30:00'),
    completedById: '3',
  },
  {
    id: '2',
    name: 'Svømmetrening',
    description: 'Svømmeundervisning i vannet',
    childId: '2',
    completed: true,
    comment: 'Kari svømte 50 meter på egenhånd for første gang!',
    completedAt: new Date('2023-07-06T10:15:00'),
    completedById: '3',
  },
  {
    id: '3',
    name: 'Insektjakt',
    description: 'Finn og observer insekter i skogen',
    childId: '3',
    completed: false,
  },
  {
    id: '4',
    name: 'Kunstverksted',
    description: 'Tegning og maling av naturmotiver',
    childId: '4',
    completed: true,
    comment: 'Emma lagde et nydelig bilde av solnedgangen over sjøen.',
    completedAt: new Date('2023-07-07T13:45:00'),
    completedById: '4',
  },
];

// Hjelpefunksjon for å finne aktiviteter for et spesifikt barn
export const getActivitiesByChildId = (childId: string): Activity[] => {
  return mockActivities.filter(activity => activity.childId === childId);
};
