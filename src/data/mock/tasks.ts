
import { Task } from '@/types/models';

// Mock-data for oppgaver
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Vekking av barna kl. 07:30',
    description: 'Pass på at alle barn i hytta er våkne og klare til frokost.',
    assignedToId: '3',
    completed: false,
    dueDate: new Date('2023-07-04T07:30:00'),
  },
  {
    id: '2',
    title: 'Svømmeaktivitet kl. 10:00',
    description: 'Lede svømmeaktivitet for alle barn ved strandområdet.',
    assignedToId: '3',
    completed: false,
    dueDate: new Date('2023-07-04T10:00:00'),
  },
  {
    id: '3',
    title: 'Koordinere medisinering kl. 08:00',
    description: 'Sørg for at alle barn får sin medisin til riktig tid.',
    assignedToId: '2',
    completed: false,
    dueDate: new Date('2023-07-04T08:00:00'),
  },
  {
    id: '4',
    title: 'Planlegg ukens aktiviteter',
    description: 'Sett opp aktivitetsplan for uke 28 og fordel ansvar.',
    assignedToId: '1',
    completed: false,
    dueDate: new Date('2023-07-08T15:00:00'),
  },
];

// Hjelpefunksjon for å finne oppgaver for en spesifikk bruker
export const getTasksByUserId = (userId: string): Task[] => {
  return mockTasks.filter(task => task.assignedToId === userId);
};
