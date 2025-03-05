
export type UserRole = 'admin' | 'nurse' | 'leader';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
  age?: number;
  skills?: string[];
  weeks?: number[];
  assignedCabinId?: string;
}

export interface Child {
  id: string;
  name: string;
  age: number;
  cabinId: string;
  image?: string;
  medicalInfo?: string; // Synlig kun for sykepleier og admin
  notes?: string;
  activities?: Activity[];
}

export interface Cabin {
  id: string;
  name: string;
  capacity: number;
  assignedLeaderId?: string;
  children?: Child[];
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  childId: string;
  completed: boolean;
  comment?: string;
  completedAt?: Date;
  completedById?: string;
}

export interface Week {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedToId: string;
  completed: boolean;
  dueDate: Date;
}

export interface PassTemplate {
  title: string;
  subtitle: string;
  includeActivities: boolean;
  includeComments: boolean;
  includeImage: boolean;
  customMessage?: string;
}
