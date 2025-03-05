
import React, { useEffect } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const DashboardLayout: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If not authenticated and finished loading, redirect to login
    if (!isLoading && !isAuthenticated) {
      console.log('Not authenticated in DashboardLayout, redirecting to login');
      navigate('/', { replace: true });
    }
    
    // Welcome message on successful login
    if (!isLoading && isAuthenticated && user) {
      toast.success(`Velkommen, ${user.name || 'bruker'}!`);
    }
    
    // Log authentication state for debugging
    if (!isLoading) {
      console.log('Auth state in DashboardLayout:', { isAuthenticated, user });
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  // Show improved loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="text-oksnoen-red text-lg mb-2">Laster dashboard...</div>
        <div className="text-sm text-gray-500">Henter brukerdata og innstillinger</div>
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
