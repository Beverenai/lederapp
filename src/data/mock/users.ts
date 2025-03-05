
import { User, UserRole } from '@/types/models';

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
    phone: '99887766',
    hasDriverLicense: true,
    hasCar: true,
    hasBoatLicense: false,
    rappellingAbility: 'Ja',
    ziplineAbility: 'Nesten',
    climbingAbility: 'Ja'
  },
  {
    id: '2',
    name: 'Syke Pleier',
    email: 'nurse@oksnoen.no',
    role: 'nurse',
    image: 'https://i.pravatar.cc/150?img=2',
    age: 42,
    skills: ['Førstehjelp', 'Medisinering', 'Omsorg'],
    phone: '99778855',
    hasDriverLicense: true,
    hasCar: false,
    hasBoatLicense: false
  },
  {
    id: '3',
    name: 'Lars Leder',
    email: 'leder1@oksnoen.no',
    role: 'leader',
    image: 'https://i.pravatar.cc/150?img=3',
    age: 26,
    skills: ['Ballspill', 'Svømming', 'Friluftsliv'],
    assignedCabinId: '1',
    phone: '45678901',
    hasDriverLicense: true,
    hasCar: true,
    hasBoatLicense: true,
    rappellingAbility: 'Nesten',
    ziplineAbility: 'Ja',
    climbingAbility: 'Nei'
  },
  {
    id: '4',
    name: 'Lise Leder',
    email: 'leder2@oksnoen.no',
    role: 'leader',
    image: 'https://i.pravatar.cc/150?img=4',
    age: 24,
    skills: ['Håndverk', 'Musikk', 'Matlaging'],
    assignedCabinId: '2',
    phone: '67890123',
    hasDriverLicense: false,
    hasCar: false,
    hasBoatLicense: false,
    rappellingAbility: 'Nei',
    ziplineAbility: 'Nei',
    climbingAbility: 'Ja'
  },
];

// Hjelpefunksjon for å finne brukere basert på rolle
export const getUsersByRole = (role: UserRole): User[] => {
  return mockUsers.filter(user => user.role === role);
};
