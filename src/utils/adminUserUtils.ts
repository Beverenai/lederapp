
import { User } from '@/types/models';

/**
 * Checks if there's an admin user in localStorage
 */
export const getAdminUserFromStorage = (): User | null => {
  const adminUser = localStorage.getItem('oksnoen-admin-user');
  if (adminUser) {
    try {
      const parsedUser = JSON.parse(adminUser);
      console.log('Found admin user in localStorage:', parsedUser);
      return parsedUser;
    } catch (err) {
      console.error('Error parsing admin user:', err);
      localStorage.removeItem('oksnoen-admin-user');
      // Continue with normal auth flow if admin user parse fails
    }
  }
  return null;
};

/**
 * Removes the admin user from localStorage if it exists
 */
export const clearAdminUser = (): void => {
  if (localStorage.getItem('oksnoen-admin-user')) {
    console.log('Removing admin user from localStorage');
    localStorage.removeItem('oksnoen-admin-user');
  }
};
