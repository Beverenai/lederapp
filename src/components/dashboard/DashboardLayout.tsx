
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';

const DashboardLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-oksnoen-red text-lg">Laster...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
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
