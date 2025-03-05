
import React, { useEffect } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const DashboardLayout: React.FC = () => {
  const { isAuthenticated, isLoading, user, authInitialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('DashboardLayout auth state:', { isAuthenticated, isLoading, authInitialized });
    
    // If auth is initialized, not loading, and not authenticated, redirect to login
    if (authInitialized && !isLoading && !isAuthenticated) {
      console.log('Not authenticated in DashboardLayout, redirecting to login');
      window.location.href = '/';
    }
    
    // Welcome message on successful login
    if (authInitialized && !isLoading && isAuthenticated && user) {
      toast.success(`Velkommen, ${user.name || 'bruker'}!`);
    }
  }, [isAuthenticated, isLoading, user, navigate, authInitialized]);

  // Show improved loading state while checking auth
  if (!authInitialized || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="text-oksnoen-red text-lg mb-2">Laster dashboard...</div>
        <div className="text-sm text-gray-500">
          {!authInitialized 
            ? "Initialiserer autentisering..." 
            : "Henter brukerdata..."}
        </div>
        <div className="text-xs text-gray-400 mt-4">
          Dette skal bare ta noen sekunder.
          Hvis det tar for lang tid, prøv å <button 
            onClick={() => window.location.reload()} 
            className="text-oksnoen-red underline"
          >
            laste siden på nytt
          </button>
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
