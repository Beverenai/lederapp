
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
        
        uiToast({
          title: 'Innlogget som admin',
          description: 'Du er nå logget inn som administrator',
        });
        
        // Use navigate for smoother transition
        setTimeout(() => {
          navigate('/dashboard/admin', { replace: true });
        }, 500);
        return;
      }
      
      // Regular Supabase login for other users
      await login(email, password);
      
      uiToast({
        title: 'Innlogget',
        description: 'Du er nå logget inn',
      });
      
      toast.success('Innlogging vellykket!');
      
      // Navigate to dashboard with a short delay to allow auth state to update
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 500);
      
    } catch (err: any) {
      console.error('Login error:', err);
      
      uiToast({
        title: 'Feil ved innlogging',
        description: err.message || 'Kunne ikke logge inn. Prøv igjen.',
        variant: 'destructive',
      });
      
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
