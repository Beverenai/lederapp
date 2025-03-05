
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
    
    if (isSubmitting) {
      console.log('Already submitting, ignoring duplicate submit');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Attempting login with:', email);
      
      // Special case: admin login - handle without requiring email format
      if (email.toLowerCase() === 'admin' && password === 'admin') {
        console.log('Admin login detected');
        const adminUser = {
          id: '1',
          name: 'Admin',
          email: 'admin@oksnoen.no',
          role: 'admin',
        };
        
        localStorage.setItem('oksnoen-admin-user', JSON.stringify(adminUser));
        toast.success('Innlogget som admin');
        
        // Force reload to trigger auth state update
        window.location.href = '/dashboard/admin';
        return;
      }
      
      // Standard email login
      await login(email, password);
      
      console.log('Login successful, waiting for auth state to update');
      toast.success('Innlogging vellykket!');
      
      // Force navigate to dashboard
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
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
