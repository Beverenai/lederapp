
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the user role types
export type UserRole = 'admin' | 'nurse' | 'leader' | 'unauthenticated';

// Define the user type
export interface User {
  id: string;
  name: string;
  role: UserRole;
  imageUrl?: string;
  cabin?: string;
  weeks?: string[];
}

// Mock users for development
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    role: 'admin',
    imageUrl: '/placeholder.svg',
    weeks: ['1', '2', '3']
  },
  {
    id: '2',
    name: 'Nurse User',
    role: 'nurse',
    imageUrl: '/placeholder.svg',
    weeks: ['1', '3']
  },
  {
    id: '3',
    name: 'Leader User',
    role: 'leader',
    imageUrl: '/placeholder.svg',
    cabin: 'Fjellhytta',
    weeks: ['2']
  }
];

// Define the context interface
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Create the provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing user session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, check localStorage or cookies for an auth token
        // and validate it with an API call
        const savedUser = localStorage.getItem('oksnoenUser');
        
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (err) {
        console.error('Auth error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock authentication logic - in real app would use an API
      const foundUser = MOCK_USERS.find(u => 
        u.name.toLowerCase() === username.toLowerCase());
      
      if (foundUser && password === 'password') {
        setUser(foundUser);
        localStorage.setItem('oksnoenUser', JSON.stringify(foundUser));
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('oksnoenUser');
  };

  // Determine if user is authenticated
  const isAuthenticated = !!user;

  // Create the context value
  const value = {
    user,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
