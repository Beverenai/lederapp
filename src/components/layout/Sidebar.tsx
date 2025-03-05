
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  Home, 
  ClipboardCheck, 
  User, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Separator } from '@/components/ui/separator';

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon: Icon, label, isCollapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <NavLink to={to} className="w-full">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start mb-1 relative overflow-hidden transition-all",
          isActive 
            ? "bg-oksnoen-red/10 text-oksnoen-red hover:bg-oksnoen-red/20 hover:text-oksnoen-red"
            : "hover:bg-muted hover:text-oksnoen-red",
          isCollapsed ? "px-3" : "px-4"
        )}
      >
        <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-oksnoen-red")} />
        {!isCollapsed && (
          <span className="ml-3 font-medium transition-opacity">{label}</span>
        )}
        {isActive && (
          <span className="absolute right-0 top-0 bottom-0 w-1 bg-oksnoen-red rounded-l-full" />
        )}
      </Button>
    </NavLink>
  );
};

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();
  
  if (!user) return null;

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div 
      className={cn(
        "h-screen bg-background border-r border-border flex flex-col transition-all duration-300 relative",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-4 flex justify-center items-center">
        <img 
          src="/lovable-uploads/91dc8516-a852-46c0-8f93-11206371545a.png" 
          alt="Oksnøen Logo" 
          className="h-12 w-12 object-contain transition-all duration-300" 
        />
        {!isCollapsed && (
          <span className="ml-3 font-bold text-lg">Oksnøen</span>
        )}
      </div>
      
      <Separator />
      
      {/* User Info */}
      <div className={cn(
        "p-4 flex items-center",
        isCollapsed ? "justify-center" : "justify-start"
      )}>
        <div className="w-8 h-8 rounded-full bg-muted overflow-hidden">
          <img 
            src={user.imageUrl || "/placeholder.svg"} 
            alt={user.name} 
            className="w-full h-full object-cover"
          />
        </div>
        {!isCollapsed && (
          <div className="ml-3 overflow-hidden">
            <p className="font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
          </div>
        )}
      </div>
      
      <Separator className="mb-2" />
      
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <SidebarLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" isCollapsed={isCollapsed} />
        <SidebarLink to="/cabins" icon={Home} label="Hytter" isCollapsed={isCollapsed} />
        <SidebarLink to="/children" icon={Users} label="Barn" isCollapsed={isCollapsed} />
        <SidebarLink to="/activities" icon={ClipboardCheck} label="Aktiviteter" isCollapsed={isCollapsed} />
        <SidebarLink to="/profile" icon={User} label="Min Profil" isCollapsed={isCollapsed} />
        
        {user.role === 'admin' && (
          <SidebarLink to="/settings" icon={Settings} label="Innstillinger" isCollapsed={isCollapsed} />
        )}
      </div>
      
      {/* Logout Button */}
      <div className="p-3 mt-auto">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-oksnoen-red"
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="ml-3">Logg ut</span>}
        </Button>
      </div>
      
      {/* Collapse/Expand Button */}
      <Button 
        variant="ghost" 
        size="icon"
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-background shadow-md flex items-center justify-center"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default Sidebar;
