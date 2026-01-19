import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "./useAuth";
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
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateAgentInput {
  name: string;
  type: AgentType;
  description?: string;
  config?: Json;
}

export function useAgents() {
  const { user } = useAuth();
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
      const { data, error } = await supabase
        .from("agents")
        .insert({
          name: input.name,
          type: input.type,
          description: input.description || null,
          config: input.config || {},
          created_by: user?.id,
        })
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

  const toggleAgentStatus = async (id: string, currentStatus: AgentStatus) => {
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
    toggleAgentStatus,
    isCreating: createAgentMutation.isPending,
    isUpdating: updateAgentMutation.isPending,
    isDeleting: deleteAgentMutation.isPending,
  };
}
