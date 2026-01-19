import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

export interface AgentTemplate {
  id: string;
  name: string;
  description: string | null;
  type: "vcompliance" | "vaudit" | "vrisk" | "vgovernance";
  allowed_task_categories: string[];
  data_access_scope: Json;
  max_concurrent_tasks: number;
  permissions: Json;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTemplateInput {
  name: string;
  description?: string;
  type: "vcompliance" | "vaudit" | "vrisk" | "vgovernance";
  allowed_task_categories?: string[];
  data_access_scope?: Record<string, unknown>;
  max_concurrent_tasks?: number;
  permissions?: Record<string, boolean>;
}

export function useAgentTemplates() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { canCreateTemplates, canEditTemplates, canDeleteTemplates } = usePermissions();

  // Fetch all active templates
  const {
    data: templates = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["agent-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agent_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as AgentTemplate[];
    },
    enabled: !!user,
  });

  // Create template (Admin only)
  const createTemplateMutation = useMutation({
    mutationFn: async (input: CreateTemplateInput) => {
      if (!canCreateTemplates) {
        throw new Error("You don't have permission to create templates");
      }

      const { data, error } = await supabase
        .from("agent_templates")
        .insert([{
          name: input.name,
          description: input.description,
          type: input.type,
          allowed_task_categories: input.allowed_task_categories || [],
          data_access_scope: (input.data_access_scope || { level: "restricted", departments: [] }) as Json,
          max_concurrent_tasks: input.max_concurrent_tasks || 5,
          permissions: (input.permissions || { can_read: true, can_write: false, can_delete: false }) as Json,
          created_by: user?.id,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-templates"] });
      toast.success("Agent template created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create template");
    },
  });

  // Update template (Admin only)
  const updateTemplateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AgentTemplate> & { id: string }) => {
      if (!canEditTemplates) {
        throw new Error("You don't have permission to edit templates");
      }

      const { data, error } = await supabase
        .from("agent_templates")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-templates"] });
      toast.success("Template updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update template");
    },
  });

  // Delete template (Admin only)
  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!canDeleteTemplates) {
        throw new Error("You don't have permission to delete templates");
      }

      const { error } = await supabase
        .from("agent_templates")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-templates"] });
      toast.success("Template deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete template");
    },
  });

  return {
    templates,
    isLoading,
    error,
    createTemplate: createTemplateMutation.mutate,
    updateTemplate: updateTemplateMutation.mutate,
    deleteTemplate: deleteTemplateMutation.mutate,
    isCreating: createTemplateMutation.isPending,
    isUpdating: updateTemplateMutation.isPending,
    isDeleting: deleteTemplateMutation.isPending,
    canManageTemplates: canCreateTemplates || canEditTemplates || canDeleteTemplates,
  };
}
