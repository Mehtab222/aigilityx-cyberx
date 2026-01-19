import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  roles?: string[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Operations", icon: Activity, href: "/operations" },
  { label: "Compliance", icon: FileCheck, href: "/compliance" },
  { label: "Risks", icon: AlertTriangle, href: "/risks" },
  { label: "Reports", icon: BarChart3, href: "/reports" },
  { label: "Digital Twin", icon: Cpu, href: "/simulation" },
  { label: "Advisors", icon: MessageSquare, href: "/advisors" },
  { label: "Policies", icon: FileText, href: "/policies" },
  { label: "Playbooks", icon: BookOpen, href: "/playbooks" },
  { label: "Users", icon: Users, href: "/users", roles: ["Admin"] },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

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
          {navItems.map((item) => {
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
            <span className="text-sm font-semibold text-primary">JD</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 animate-fade-in">
              <p className="text-sm font-medium text-foreground truncate">
                John Doe
              </p>
              <p className="text-xs text-muted-foreground">CISO</p>
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-center text-muted-foreground hover:text-foreground"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
