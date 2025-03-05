
import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const DashboardLayout: React.FC = () => {
  const { isAuthenticated, isLoading, user, authInitialized } = useAuth();
  const navigate = useNavigate();
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
    console.log('DashboardLayout auth state:', { isAuthenticated, isLoading, authInitialized });
    
    // If auth is initialized, not loading, and not authenticated, redirect to login
    if (authInitialized && !isLoading && !isAuthenticated) {
      console.log('Not authenticated in DashboardLayout, redirecting to login');
      navigate('/');
      
      // Use direct location as a fallback
      setTimeout(() => {
        if (window.location.pathname.startsWith('/dashboard')) {
          window.location.href = '/';
        }
      }, 500);
    }
    
    // Welcome message on successful login
    if (authInitialized && !isLoading && isAuthenticated && user) {
      toast.success(`Velkommen, ${user.name || 'bruker'}!`);
    }
    
    // Set a timeout for the loading screen
    const timer = setTimeout(() => {
      setLoadingTimeout(true);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, user, navigate, authInitialized]);

  // Show improved loading state while checking auth
  if (!authInitialized || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
          <div className="text-oksnoen-red text-lg mb-2">Laster dashboard...</div>
          <div className="text-sm text-gray-500 mb-4">
            {!authInitialized 
              ? "Initialiserer autentisering..." 
              : "Henter brukerdata..."}
          </div>
          
          <div className="animate-pulse flex space-x-4 justify-center mb-4">
            <div className="w-12 h-2 bg-oksnoen-red rounded"></div>
            <div className="w-12 h-2 bg-oksnoen-red rounded"></div>
            <div className="w-12 h-2 bg-oksnoen-red rounded"></div>
          </div>
          
          {loadingTimeout && (
            <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-md border border-yellow-200 mt-4">
              <p className="font-medium">Det tar lengre tid enn forventet.</p>
              <p className="mt-1">Du kan prøve å:</p>
              <ul className="list-disc pl-5 mt-2 text-xs space-y-1">
                <li>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="text-oksnoen-red underline"
                  >
                    Laste siden på nytt
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      localStorage.clear();
                      window.location.href = '/';
                    }} 
                    className="text-oksnoen-red underline"
                  >
                    Logge ut og prøve på nytt
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto bg-muted/20">
        <div className={cn(
          "container mx-auto p-6 animate-fade-in",
          "transition-all duration-300 ease-in-out"
        )}>
          <Outlet />
        </div>
      </main>
      
      <Toaster />
    </div>
  );
};

export default DashboardLayout;
