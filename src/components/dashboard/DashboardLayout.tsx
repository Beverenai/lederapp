
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const DashboardLayout: React.FC = () => {
  const { isAuthenticated, isLoading, user, authInitialized } = useAuth();

  React.useEffect(() => {
    // Welcome message on successful login
    if (authInitialized && !isLoading && isAuthenticated && user) {
      toast.success(`Velkommen, ${user.name || 'bruker'}!`);
    }
  }, [isAuthenticated, isLoading, user, authInitialized]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
          <div className="text-oksnoen-red text-lg mb-2">Laster dashboard...</div>
          <div className="animate-pulse flex space-x-4 justify-center mb-4">
            <div className="w-12 h-2 bg-oksnoen-red rounded"></div>
            <div className="w-12 h-2 bg-oksnoen-red rounded"></div>
            <div className="w-12 h-2 bg-oksnoen-red rounded"></div>
          </div>
          <p className="text-sm text-gray-500 mb-3">Dette kan ta litt tid hvis du er logget inn for første gang.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-oksnoen-red underline text-sm"
          >
            Last siden på nytt
          </button>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
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
