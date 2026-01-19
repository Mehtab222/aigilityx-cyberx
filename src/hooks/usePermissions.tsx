import { useAuth } from "@/hooks/useAuth";

export type AppRole = "admin" | "ciso" | "operational" | "executive" | null;

// Extended role type that includes legacy roles for backwards compatibility
export type LegacyRole = "admin" | "ciso" | "soc" | "auditor" | "operational" | "executive" | null;

interface Permissions {
  // User Management
  canCreateUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  canViewAllUsers: boolean;

  // Agent Templates (Admin Only)
  canCreateTemplates: boolean;
  canEditTemplates: boolean;
  canDeleteTemplates: boolean;

  // Agents
  canCreateAgents: boolean;
  canEditAgents: boolean;
  canDeleteAgents: boolean;
  canAssignAgents: boolean;
  canViewAllAgents: boolean;
  canViewAssignedAgents: boolean;
  canInteractWithAgents: boolean;

  // Tasks
  canCreateTasks: boolean;
  canAssignTasks: boolean;
  canViewAllTasks: boolean;
  canViewOwnTasks: boolean;
  canExecuteTasks: boolean;
  canUpdateOwnTaskStatus: boolean;

  // Operations
  canViewOperations: boolean;
  canManageOperations: boolean;

  // Dashboards
  canViewCISODashboard: boolean;
  canViewAdminDashboard: boolean;
  canViewExecutiveDashboard: boolean;
  canViewOperationalDashboard: boolean;

  // Reports
  canGenerateReports: boolean;
  canExportReports: boolean;
  canViewStrategicReports: boolean;

  // Audit
  canViewAuditLogs: boolean;
  canViewAllAuditLogs: boolean;

  // System
  canAccessSystemSettings: boolean;
  canManageAPIKeys: boolean;

  // Role-specific flags
  isAdmin: boolean;
  isCISO: boolean;
  isOperational: boolean;
  isExecutive: boolean;
  isManager: boolean; // Admin or CISO
}

export function usePermissions(): Permissions {
  const { role } = useAuth();

  // Map legacy roles to new roles
  const normalizedRole = mapLegacyRole(role as LegacyRole);

  const isAdmin = normalizedRole === "admin";
  const isCISO = normalizedRole === "ciso";
  const isOperational = normalizedRole === "operational";
  const isExecutive = normalizedRole === "executive";
  const isManager = isAdmin || isCISO;

  return {
    // User Management - Admin Only
    canCreateUsers: isAdmin,
    canEditUsers: isAdmin,
    canDeleteUsers: isAdmin,
    canViewAllUsers: isAdmin,

    // Agent Templates - Admin Only
    canCreateTemplates: isAdmin,
    canEditTemplates: isAdmin,
    canDeleteTemplates: isAdmin,

    // Agents
    canCreateAgents: isManager, // Admin or CISO, but CISO must use templates
    canEditAgents: isManager,
    canDeleteAgents: isAdmin, // Only Admin can delete
    canAssignAgents: isManager,
    canViewAllAgents: isAdmin || isCISO || isExecutive,
    canViewAssignedAgents: isOperational,
    canInteractWithAgents: isOperational,

    // Tasks
    canCreateTasks: isManager,
    canAssignTasks: isManager,
    canViewAllTasks: isManager,
    canViewOwnTasks: true, // All authenticated users
    canExecuteTasks: isOperational,
    canUpdateOwnTaskStatus: isOperational,

    // Operations
    canViewOperations: isAdmin || isCISO || isOperational,
    canManageOperations: isCISO,

    // Dashboards
    canViewCISODashboard: isAdmin || isCISO,
    canViewAdminDashboard: isAdmin,
    canViewExecutiveDashboard: isAdmin || isExecutive,
    canViewOperationalDashboard: isOperational,

    // Reports
    canGenerateReports: isExecutive || isCISO,
    canExportReports: isExecutive || isCISO,
    canViewStrategicReports: isExecutive,

    // Audit
    canViewAuditLogs: true, // Own logs
    canViewAllAuditLogs: isAdmin,

    // System
    canAccessSystemSettings: isAdmin,
    canManageAPIKeys: isAdmin,

    // Role flags
    isAdmin,
    isCISO,
    isOperational,
    isExecutive,
    isManager,
  };
}

// Map legacy roles to new system
function mapLegacyRole(role: LegacyRole): AppRole {
  switch (role) {
    case "admin":
      return "admin";
    case "ciso":
      return "ciso";
    case "soc":
    case "operational":
      return "operational";
    case "auditor":
    case "executive":
      return "executive";
    default:
      return null;
  }
}

// Utility function for checking specific permissions
export function checkPermission(
  permissions: Permissions,
  action: keyof Permissions
): boolean {
  return Boolean(permissions[action]);
}
