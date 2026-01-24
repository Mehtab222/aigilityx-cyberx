import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Shield,
  AlertTriangle,
  FileCheck,
  BarChart3,
  Users,
  Settings,
  MessageSquare,
  Activity,
  BookOpen,
  FileText,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Cpu,
  UserCog,
  Bot,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  roles?: ("admin" | "ciso" | "soc" | "auditor" | "operational" | "executive")[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "ConversX Core", icon: MessageSquare, href: "/conversx", roles: ["admin", "ciso", "soc", "operational"] },
  { label: "Operations", icon: Activity, href: "/operations", roles: ["admin", "ciso", "soc", "operational"] },
  { label: "Admin", icon: UserCog, href: "/admin", roles: ["admin"] },
  { label: "User Management", icon: Users, href: "/user-management", roles: ["admin"] },
  { label: "Users", icon: Users, href: "/users", roles: ["admin", "ciso"] },
  { label: "Agents", icon: Bot, href: "/agents" },
  { label: "Compliance", icon: FileCheck, href: "/compliance", roles: ["admin", "ciso", "auditor", "executive"] },
  { label: "Risks", icon: AlertTriangle, href: "/risks", roles: ["admin", "ciso", "auditor", "executive"] },
  { label: "Reports", icon: BarChart3, href: "/reports", roles: ["admin", "ciso", "auditor", "executive"] },
  { label: "Digital Twin", icon: Cpu, href: "/simulation", roles: ["admin", "ciso"] },
  { label: "Advisors", icon: MessageSquare, href: "/advisors", roles: ["admin", "ciso"] },
  { label: "Policies", icon: FileText, href: "/policies", roles: ["admin", "ciso", "auditor"] },
  { label: "Playbooks", icon: BookOpen, href: "/playbooks", roles: ["admin", "ciso", "soc", "operational"] },
  { label: "Settings", icon: Settings, href: "/settings", roles: ["admin"] },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, signOut, isLoading } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  // Filter nav items based on role
  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    if (!role) return false;
    return item.roles.includes(role);
  });

  // Get user initials from profile
  const userInitials = user?.email?.slice(0, 2).toUpperCase() || "??";
  const userEmail = user?.email || "Loading...";

  const getRoleBadgeStatus = () => {
    switch (role) {
      case "admin": return "critical";
      case "ciso": return "high";
      case "soc": 
      case "operational": return "medium";
      case "auditor": 
      case "executive": return "low";
      default: return "inactive";
    }
  };

  // Get display name for role
  const getRoleDisplayName = () => {
    switch (role) {
      case "admin": return "ADMIN";
      case "ciso": return "CISO";
      case "soc": return "SOC";
      case "operational": return "OPERATOR";
      case "auditor": return "AUDITOR";
      case "executive": return "EXECUTIVE";
      default: return "NO ROLE";
    }
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-sidebar-border">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 glow-primary">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        {!collapsed && (
          <div className="flex flex-col animate-fade-in">
            <span className="font-bold text-lg text-foreground tracking-tight">
              CyberX
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Agentic AI Platform
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            const linkContent = (
              <Link
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive
                    ? "nav-link-active text-primary"
                    : "text-sidebar-foreground"
                )}
              >
                <Icon className={cn("w-5 h-5 shrink-0", isActive && "text-primary")} />
                {!collapsed && (
                  <span className="animate-fade-in">{item.label}</span>
                )}
              </Link>
            );

            if (collapsed) {
              return (
                <li key={item.href}>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right" className="font-medium">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                </li>
              );
            }

            return <li key={item.href}>{linkContent}</li>;
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        {/* User Info */}
        <div
          className={cn(
            "flex items-center gap-3 p-2 mb-2 rounded-lg bg-sidebar-accent/50",
            collapsed && "justify-center"
          )}
        >
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">{userInitials}</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 animate-fade-in">
              <p className="text-sm font-medium truncate">{userEmail}</p>
              <div className="flex items-center gap-2">
                {isLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                ) : role ? (
                  <StatusBadge status={getRoleBadgeStatus()} label={getRoleDisplayName()} />
                ) : (
                  <span className="text-xs text-muted-foreground">No role assigned</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full justify-start text-muted-foreground hover:text-foreground hover:bg-sidebar-accent",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span className="ml-2 animate-fade-in">Logout</span>}
        </Button>

        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full mt-2 text-muted-foreground hover:text-foreground",
            collapsed && "justify-center"
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="ml-2">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
