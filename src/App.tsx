
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProfileCompletion from "./pages/ProfileCompletion"; 
import ProfilePage from "./pages/ProfilePage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import LeaderDashboard from "./components/dashboard/LeaderDashboard";
import NurseDashboard from "./components/dashboard/NurseDashboard";
import { needsProfileCompletion } from "./utils/userProfileUtils";

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
    return <Navigate to="/" replace />;
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

// Component to check if profile needs completion
const ProfileCompletionCheck = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Laster...</div>;
  }
  
  // Check if essential profile data is missing using our utility function
  if (user && needsProfileCompletion(user)) {
    console.log('User needs to complete profile, redirecting to profile completion page');
    return <Navigate to="/profile-completion" replace />;
  }
  
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Index page is now the login page */}
            <Route path="/" element={<Index />} />
            
            {/* Redirect /login to root since that's now the login page */}
            <Route path="/login" element={<Navigate to="/" replace />} />
            
            <Route 
              path="/profile-completion" 
              element={
                <ProtectedRoute 
                  element={<ProfileCompletion />} 
                  allowedRoles={['admin', 'nurse', 'leader']} 
                />
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <ProfileCompletionCheck>
                  <ProtectedRoute 
                    element={<ProfilePage />} 
                    allowedRoles={['admin', 'nurse', 'leader']} 
                  />
                </ProfileCompletionCheck>
              } 
            />
            
            <Route 
              path="/dashboard" 
              element={
                <ProfileCompletionCheck>
                  <DashboardLayout />
                </ProfileCompletionCheck>
              }
            >
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
