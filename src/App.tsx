
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import LeaderDashboard from "./components/dashboard/LeaderDashboard";
import NurseDashboard from "./components/dashboard/NurseDashboard";

const queryClient = new QueryClient();

// Role-based route protection component
const ProtectedRoute = ({ 
  element, 
  allowedRoles 
}: { 
  element: JSX.Element, 
  allowedRoles: string[] 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return <div>Laster...</div>;
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated but doesn't have the required role, redirect to default dashboard
  if (!allowedRoles.includes(user?.role || '')) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If authenticated and has required role, show the requested page
  return element;
};

// Component to select the appropriate dashboard based on user role
const DashboardSelector = () => {
  const { user } = useAuth();
  
  if (user?.role === 'admin') {
    return <Navigate to="/dashboard/admin" replace />;
  } else if (user?.role === 'nurse') {
    return <Navigate to="/dashboard/nurse" replace />;
  } else {
    return <Navigate to="/dashboard/leader" replace />;
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardSelector />} />
              <Route 
                path="admin" 
                element={
                  <ProtectedRoute 
                    element={<AdminDashboard />} 
                    allowedRoles={['admin']} 
                  />
                } 
              />
              <Route 
                path="nurse" 
                element={
                  <ProtectedRoute 
                    element={<NurseDashboard />} 
                    allowedRoles={['nurse']} 
                  />
                } 
              />
              <Route 
                path="leader" 
                element={
                  <ProtectedRoute 
                    element={<LeaderDashboard />} 
                    allowedRoles={['leader']} 
                  />
                } 
              />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
