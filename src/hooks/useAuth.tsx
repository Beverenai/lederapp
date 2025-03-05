
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContextProvider';

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    console.error('useAuth was called outside of AuthProvider - this will cause errors');
    // Return a default minimal context to prevent complete crashes
    return {
      user: null,
      isLoading: false,
      error: 'Auth context not available',
      login: async (email: string, password: string) => {
        console.error('Auth provider not available');
        throw new Error('Auth provider not available');
      },
      logout: () => {
        console.error('Auth provider not available');
      },
      isAuthenticated: false,
      session: null,
      refreshUser: async () => {
        console.error('Auth provider not available');
      },
      authInitialized: true
    };
  }
  
  return context;
};
