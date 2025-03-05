
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const useLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Special case: admin login
      if (email.toLowerCase() === 'admin' && password === 'admin') {
        const adminUser = {
          id: '1',
          name: 'Admin',
          email: 'admin@oksnoen.no',
          role: 'admin',
        };
        
        localStorage.setItem('oksnoen-admin-user', JSON.stringify(adminUser));
        toast.success('Innlogget som admin');
        navigate('/dashboard/admin');
        return;
      }
      
      // Standard email login
      console.log('Attempting login with:', email);
      await login(email, password);
      toast.success('Innlogging vellykket!');
      
      // Let the auth state change listener handle the navigation
      // This prevents race conditions between manual navigation and auth state changes
    } catch (err: any) {
      console.error('Login error:', err);
      toast.error(err.message || 'Innlogging feilet. Sjekk brukernavn og passord.');
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
