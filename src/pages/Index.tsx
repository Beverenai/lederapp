
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Index: React.FC = () => {
  const { isAuthenticated, isLoading, authInitialized } = useAuth();
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);
  
  useEffect(() => {
    console.log('Index page auth state:', { isAuthenticated, isLoading, authInitialized });
    
    if (authInitialized && !isLoading && isAuthenticated && !redirecting) {
      console.log('User is authenticated, redirecting to dashboard');
      setRedirecting(true);
      
      // Use Navigate for smoother transitions
      navigate('/dashboard');
      
      // As a fallback, use direct window location after a delay
      const timeoutId = setTimeout(() => {
        if (window.location.pathname === '/') {
          console.log('Fallback redirect to dashboard');
          window.location.href = '/dashboard';
        }
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isAuthenticated, isLoading, navigate, authInitialized, redirecting]);
  
  // If authentication is still initializing, show appropriate loading state
  if (!authInitialized || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-oksnoen-light to-white">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
          <p className="text-xl font-medium text-oksnoen-dark mb-2">Laster...</p>
          <p className="text-sm text-gray-600 mb-4">
            {!authInitialized 
              ? "Initialiserer autentisering..." 
              : "Sjekker innloggingsstatusen din..."}
          </p>
          <div className="animate-pulse flex space-x-4 justify-center">
            <div className="w-12 h-2 bg-oksnoen-red rounded"></div>
            <div className="w-12 h-2 bg-oksnoen-red rounded"></div>
            <div className="w-12 h-2 bg-oksnoen-red rounded"></div>
          </div>
          <p className="text-xs text-gray-400 mt-6">
            Dette tar vanligvis bare noen sekunder.
            {authInitialized && 
              <button 
                onClick={() => window.location.reload()} 
                className="text-oksnoen-red underline ml-2"
              >
                Oppdater siden
              </button>
            }
          </p>
        </div>
      </div>
    );
  }
  
  // If authentication has initialized and user is not authenticated, show login form
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
