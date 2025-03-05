
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/context/AuthContext';

const Index: React.FC = () => {
  const { isAuthenticated, authInitialized, user } = useAuth();
  const navigate = useNavigate();
  
  // Forcefully redirect authenticated users to dashboard
  useEffect(() => {
    if (authInitialized && isAuthenticated) {
      console.log('User is authenticated, redirecting to dashboard');
      
      if (user?.role === 'admin') {
        navigate('/dashboard/admin');
      } else if (user?.role === 'nurse') {
        navigate('/dashboard/nurse');
      } else {
        navigate('/dashboard/leader');
      }
    }
  }, [isAuthenticated, navigate, authInitialized, user]);
  
  // Show login screen
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
