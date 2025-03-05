
import React, { useEffect } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';

const DashboardLayout: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If not authenticated and finished loading, redirect to login
    if (!isLoading && !isAuthenticated) {
      navigate('/', { replace: true });
    }
    
    // If authenticated and user needs profile completion, redirect them
    if (!isLoading && isAuthenticated && user && user.id !== '1') {
      // Log authentication state for debugging
      console.log('Auth state in DashboardLayout:', { isAuthenticated, user });
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-oksnoen-red text-lg">Laster...</div>
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
