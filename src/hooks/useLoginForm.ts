
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const useLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Check for admin credentials
      if (email.toLowerCase() === 'admin' && password === 'admin') {
        // Use the mock admin user from our data
        const adminUser = {
          id: '1',
          name: 'Admin',
          email: 'admin@oksnoen.no',
          role: 'admin',
        };
        
        // Set the admin user in context without going through Supabase
        localStorage.setItem('oksnoen-admin-user', JSON.stringify(adminUser));
        
        toast.success('Innlogget som admin');
        
        // Use direct window.location for guaranteed redirect
        window.location.href = '/dashboard/admin';
        return;
      }
      
      // Regular Supabase login for other users
      await login(email, password);
      
      toast.success('Innlogging vellykket!');
      
      // Force redirect to dashboard using window.location
      console.log('Login successful, redirecting to dashboard');
      window.location.href = '/dashboard';
      
    } catch (err: any) {
      console.error('Login error:', err);
      
      toast.error('Innlogging feilet. Sjekk brukernavn og passord.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isSubmitting,
    handleLogin
  };
};
