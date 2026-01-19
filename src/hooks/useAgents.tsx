import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "./useAuth";
import { usePermissions } from "./usePermissions";
import { Json } from "@/integrations/supabase/types";

export type AgentType = "vcompliance" | "vaudit" | "vrisk" | "vgovernance";
export type AgentStatus = "active" | "inactive" | "pending" | "error";

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  description: string | null;
  status: AgentStatus;
  config: Json;
  template_id: string | null;
  assigned_to: string | null;
  objectives: Json;
  constraints: Json;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateAgentInput {
  name: string;
  type: AgentType;
  description?: string;
  config?: Json;
  template_id?: string;
  assigned_to?: string;
  objectives?: Record<string, unknown>[];
}

export function useAgents() {
  const { user } = useAuth();
  const { canCreateAgents, canEditAgents, canDeleteAgents, isCISO } = usePermissions();
  const queryClient = useQueryClient();

  const { data: agents = [], isLoading, error } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Agent[];
    },
    enabled: !!user,
  });

  const createAgentMutation = useMutation({
    mutationFn: async (input: CreateAgentInput) => {
      if (!canCreateAgents) {
        throw new Error("You don't have permission to create agents");
      }

      // CISO must use a template
      if (isCISO && !input.template_id) {
        throw new Error("CISO must create agents from templates");
      }

      // If using a template, fetch template constraints
      let templateConstraints: Json = {};
      if (input.template_id) {
        const { data: template, error: templateError } = await supabase
          .from("agent_templates")
          .select("*")
          .eq("id", input.template_id)
          .single();

        if (templateError) throw templateError;
        if (!template.is_active) {
          throw new Error("Cannot create agent from inactive template");
        }

        templateConstraints = {
          allowed_task_categories: template.allowed_task_categories,
          data_access_scope: template.data_access_scope,
          max_concurrent_tasks: template.max_concurrent_tasks,
          permissions: template.permissions,
        };
      }

      const { data, error } = await supabase
        .from("agents")
        .insert([{
          name: input.name,
          type: input.type,
          description: input.description || null,
          config: input.config || {},
          template_id: input.template_id || null,
          assigned_to: input.assigned_to || null,
          objectives: (input.objectives || []) as Json,
          constraints: templateConstraints,
          created_by: user?.id,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      toast.success("Agent created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create agent");
    },
  });

  const updateAgentMutation = useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: { id: string; name?: string; type?: AgentType; description?: string; status?: AgentStatus; config?: Json }) => {
      if (!canEditAgents) {
        throw new Error("You don't have permission to update agents");
      }

      const { data, error } = await supabase
        .from("agents")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      toast.success("Agent updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update agent");
    },
  });

  const deleteAgentMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!canDeleteAgents) {
        throw new Error("Only administrators can delete agents");
      }

      const { error } = await supabase
        .from("agents")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      toast.success("Agent deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete agent");
    },
  });

  // Assign agent to user
  const assignAgentMutation = useMutation({
    mutationFn: async ({ agentId, userId }: { agentId: string; userId: string }) => {
      if (!canEditAgents) {
        throw new Error("You don't have permission to assign agents");
      }

      const { data, error } = await supabase
        .from("agents")
        .update({ assigned_to: userId })
        .eq("id", agentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      toast.success("Agent assigned successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to assign agent");
    },
  });

  const toggleAgentStatus = async (id: string, currentStatus: AgentStatus) => {
    if (!canEditAgents) {
      toast.error("You don't have permission to modify agents");
      return;
    }
    const newStatus: AgentStatus = currentStatus === "active" ? "inactive" : "active";
    await updateAgentMutation.mutateAsync({ id, status: newStatus });
  };

  return {
    agents,
    isLoading,
    error,
    createAgent: createAgentMutation.mutateAsync,
    updateAgent: updateAgentMutation.mutateAsync,
    deleteAgent: deleteAgentMutation.mutateAsync,
    assignAgent: assignAgentMutation.mutate,
    toggleAgentStatus,
    isCreating: createAgentMutation.isPending,
    isUpdating: updateAgentMutation.isPending || assignAgentMutation.isPending,
    isDeleting: deleteAgentMutation.isPending,
    canManageAgents: canCreateAgents || canEditAgents,
    canDeleteAgents,
  };
}
