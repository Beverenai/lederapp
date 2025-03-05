
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
      isLoading: true,
      error: 'Auth context not available',
      login: async () => {
        throw new Error('Auth provider not available');
      },
      logout: () => {},
      isAuthenticated: false,
      session: null,
      refreshUser: async () => {},
      authInitialized: false
    };
  }
  return context;
};
