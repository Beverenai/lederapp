
import { ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { User } from '@/types/models';

// Define the context interface
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  session: Session | null;
}

// Define the provider props
export interface AuthProviderProps {
  children: ReactNode;
}
