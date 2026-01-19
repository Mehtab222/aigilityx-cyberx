import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { Json } from "@/integrations/supabase/types";

export interface AuditLogEntry {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: Json | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export type AuditAction =
  | "user.create"
  | "user.update"
  | "user.delete"
  | "user.login"
  | "user.logout"
  | "role.assign"
  | "role.revoke"
  | "template.create"
  | "template.update"
  | "template.delete"
  | "agent.create"
  | "agent.update"
  | "agent.delete"
  | "agent.assign"
  | "agent.toggle"
  | "task.create"
  | "task.assign"
  | "task.update"
  | "task.complete"
  | "task.delete"
  | "operation.execute"
  | "report.generate"
  | "report.export"
  | "settings.update";

export type ResourceType =
  | "user"
  | "role"
  | "template"
  | "agent"
  | "task"
  | "operation"
  | "report"
  | "settings";

export function useAuditLog() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { canViewAllAuditLogs } = usePermissions();

  // Fetch audit logs
  const {
    data: logs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as AuditLogEntry[];
    },
    enabled: !!user,
  });

  // Log an action
  const logActionMutation = useMutation({
    mutationFn: async ({
      action,
      resourceType,
      resourceId,
      details,
    }: {
      action: AuditAction;
      resourceType: ResourceType;
      resourceId?: string;
      details?: Record<string, unknown>;
    }) => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("audit_logs")
        .insert([{
          user_id: user.id,
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          details: (details || null) as Json,
          user_agent: navigator.userAgent,
        }])
        .select()
        .single();

      if (error) {
        console.error("Failed to log audit action:", error);
        // Don't throw - audit logging should not break the app
        return null;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
    },
  });

  // Get logs by resource type
  const getLogsByResourceType = (type: ResourceType) => {
    return logs.filter((log) => log.resource_type === type);
  };

  // Get logs by user
  const getLogsByUser = (userId: string) => {
    return logs.filter((log) => log.user_id === userId);
  };

  // Get recent activity (last 24 hours)
  const recentActivity = logs.filter((log) => {
    const logDate = new Date(log.created_at);
    const now = new Date();
    const diff = now.getTime() - logDate.getTime();
    return diff < 24 * 60 * 60 * 1000;
  });

  return {
    logs: canViewAllAuditLogs ? logs : logs.filter((l) => l.user_id === user?.id),
    allLogs: logs,
    recentActivity,
    isLoading,
    error,
    logAction: logActionMutation.mutate,
    logActionAsync: logActionMutation.mutateAsync,
    getLogsByResourceType,
    getLogsByUser,
    isLogging: logActionMutation.isPending,
  };
}

// Helper function to create audit log entries from components
export function createAuditLogHelper(logAction: ReturnType<typeof useAuditLog>["logAction"]) {
  return {
    logUserAction: (action: "create" | "update" | "delete" | "login" | "logout", userId?: string, details?: Record<string, unknown>) => {
      logAction({
        action: `user.${action}` as AuditAction,
        resourceType: "user",
        resourceId: userId,
        details,
      });
    },
    logTemplateAction: (action: "create" | "update" | "delete", templateId: string, details?: Record<string, unknown>) => {
      logAction({
        action: `template.${action}` as AuditAction,
        resourceType: "template",
        resourceId: templateId,
        details,
      });
    },
    logAgentAction: (action: "create" | "update" | "delete" | "assign" | "toggle", agentId: string, details?: Record<string, unknown>) => {
      logAction({
        action: `agent.${action}` as AuditAction,
        resourceType: "agent",
        resourceId: agentId,
        details,
      });
    },
    logTaskAction: (action: "create" | "assign" | "update" | "complete" | "delete", taskId: string, details?: Record<string, unknown>) => {
      logAction({
        action: `task.${action}` as AuditAction,
        resourceType: "task",
        resourceId: taskId,
        details,
      });
    },
  };
}
