
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { User, UserRole } from '@/types/models';

// Define the context interface
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  session: Session | null;
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
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing user session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get the current session
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          setSession(data.session);
          await fetchUserProfile(data.session);
        }
      } catch (err) {
        console.error('Auth error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Set up listener for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        
        if (newSession) {
          await fetchUserProfile(newSession);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Cleanup
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile from profiles table
  const fetchUserProfile = async (userSession: Session) => {
    try {
      // Get the profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userSession.user.id)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      if (profile) {
        // Convert Supabase profile to our User type
        const userData: User = {
          id: profile.id,
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
          email: profile.email || userSession.user.email || '',
          role: (profile.role as UserRole) || 'leader',
          image: profile.avatar_url,
          age: profile.age,
          skills: [], // Optional
          notes: profile.notes,
          activities: [], // Optional
          team: profile.team,
          phone: profile.phone,
          hasDriverLicense: profile.has_driving_license,
          hasCar: profile.has_car,
          hasBoatLicense: profile.has_boat_license,
          rappellingAbility: profile.rappelling_ability as any,
          ziplineAbility: profile.zipline_ability as any,
          climbingAbility: profile.climbing_ability as any,
        };

        setUser(userData);
      } else {
        // If no profile found, try to create one from auth metadata
        const authUser = userSession.user;
        const metadata = authUser.user_metadata || {};
        
        const newProfile = {
          id: authUser.id,
          first_name: metadata.firstName || '',
          last_name: metadata.lastName || '',
          email: authUser.email,
          role: 'leader' as UserRole,
        };
        
        // Insert the new profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert(newProfile);
          
        if (insertError) {
          console.error('Error creating profile:', insertError);
        }
        
        // Set user with basic data
        setUser({
          id: authUser.id,
          name: `${metadata.firstName || ''} ${metadata.lastName || ''}`.trim(),
          email: authUser.email || '',
          role: 'leader',
        });
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setUser(null);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw new Error(error.message);
      
      // Session and user will be set by the onAuthStateChange handler
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      // Session and user will be cleared by the onAuthStateChange handler
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Determine if user is authenticated
  const isAuthenticated = !!session;

  // Create the context value
  const value = {
    user,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated,
    session
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
