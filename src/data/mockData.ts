
import { User, Cabin, Child, Activity, Week, Task, UserRole } from '@/types/models';

// Mock-data for brukere
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin Adminsen',
    email: 'admin@oksnoen.no',
    role: 'admin',
    image: 'https://i.pravatar.cc/150?img=1',
    age: 35,
    skills: ['Førstehjelp', 'Svømming', 'Kanopadling'],
    weeks: [1, 2, 3, 4],
  },
  {
    id: '2',
    name: 'Syke Pleier',
    email: 'nurse@oksnoen.no',
    role: 'nurse',
    image: 'https://i.pravatar.cc/150?img=2',
    age: 42,
    skills: ['Førstehjelp', 'Medisinering', 'Omsorg'],
    weeks: [1, 2],
  },
  {
    id: '3',
    name: 'Lars Leder',
    email: 'leder1@oksnoen.no',
    role: 'leader',
    image: 'https://i.pravatar.cc/150?img=3',
    age: 26,
    skills: ['Ballspill', 'Svømming', 'Friluftsliv'],
    weeks: [1, 3],
    assignedCabinId: '1',
  },
  {
    id: '4',
    name: 'Lise Leder',
    email: 'leder2@oksnoen.no',
    role: 'leader',
    image: 'https://i.pravatar.cc/150?img=4',
    age: 24,
    skills: ['Håndverk', 'Musikk', 'Matlaging'],
    weeks: [2, 4],
    assignedCabinId: '2',
  },
];

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

// Hjelpefunksjon for å finne brukere basert på rolle
export const getUsersByRole = (role: UserRole): User[] => {
  return mockUsers.filter(user => user.role === role);
};

// Hjelpefunksjon for å finne barn i en spesifikk hytte
export const getChildrenByCabinId = (cabinId: string): Child[] => {
  return mockChildren.filter(child => child.cabinId === cabinId);
};

// Hjelpefunksjon for å finne aktiviteter for et spesifikt barn
export const getActivitiesByChildId = (childId: string): Activity[] => {
  return mockActivities.filter(activity => activity.childId === childId);
};

// Hjelpefunksjon for å finne oppgaver for en spesifikk bruker
export const getTasksByUserId = (userId: string): Task[] => {
  return mockTasks.filter(task => task.assignedToId === userId);
};
