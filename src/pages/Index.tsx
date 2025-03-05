
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Index: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [redirectAttempts, setRedirectAttempts] = useState(0);
  
  useEffect(() => {
    console.log('Index page auth state:', { isAuthenticated, isLoading });
    
    if (!isLoading && isAuthenticated) {
      console.log('Redirecting to dashboard from Index page');
      // Redirect to dashboard if already logged in
      navigate('/dashboard', { replace: true });
    }
    
    // Prevent infinite redirect loops
    if (!isLoading && isAuthenticated && redirectAttempts > 3) {
      console.error('Too many redirect attempts, might be an authentication issue');
      toast.error('Det oppstod et problem med innloggingen. Prøv igjen senere.');
    }
  }, [isAuthenticated, isLoading, navigate, redirectAttempts]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p>Laster...</p>
        <p className="text-sm text-gray-500 mt-2">Venter på autentisering...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-oksnoen-light to-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/91dc8516-a852-46c0-8f93-11206371545a.png" 
            alt="Oksnøen Logo" 
            className="h-32 mx-auto mb-4" 
          />
          <h1 className="text-3xl font-bold text-oksnoen-dark">Oksnøen Leder App</h1>
          <p className="text-gray-600 mt-2">
            Intern applikasjon for sommerleirene på Oksnøen
          </p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
};

export default Index;
