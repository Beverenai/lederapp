
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
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
        console.log('Redirecting to admin dashboard with full page reload');
        window.location.href = '/dashboard/admin';
        return;
      }
      
      // Standard email login
      console.log('Standard login with:', email);
      await login(email, password);
      
      console.log('Login successful, navigating to dashboard');
      toast.success('Innlogging vellykket!');
      
      // Manual navigation after successful login
      setTimeout(() => {
        console.log('Executing delayed redirect to dashboard');
        if (document.location.pathname === '/') {
          console.log('Forcing full page reload to ensure clean state');
          window.location.href = '/dashboard';
        } else {
          navigate('/dashboard');
        }
      }, 500);
      
    } catch (err: any) {
      console.error('Login error:', err);
      toast.error(err.message || 'Innlogging feilet. Sjekk brukernavn og passord.');
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
