import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

export interface TaskAssignment {
  id: string;
  agent_id: string;
  assigned_to: string;
  assigned_by: string;
  title: string;
  description: string | null;
  category: string;
  status: "pending" | "in_progress" | "completed" | "failed" | "cancelled";
  priority: "low" | "medium" | "high" | "critical";
  result: Json | null;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskInput {
  agent_id: string;
  assigned_to: string;
  title: string;
  description?: string;
  category: string;
  priority?: "low" | "medium" | "high" | "critical";
  due_date?: string;
}

export function useTaskAssignments() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { canCreateTasks, canViewAllTasks, isOperational } = usePermissions();

  // Fetch tasks (filtered by role)
  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["task-assignments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("task_assignments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as TaskAssignment[];
    },
    enabled: !!user,
  });

  // Create task (Managers only)
  const createTaskMutation = useMutation({
    mutationFn: async (input: CreateTaskInput) => {
      if (!canCreateTasks) {
        throw new Error("You don't have permission to create tasks");
      }

      const { data, error } = await supabase
        .from("task_assignments")
        .insert({
          agent_id: input.agent_id,
          assigned_to: input.assigned_to,
          assigned_by: user!.id,
          title: input.title,
          description: input.description,
          category: input.category,
          priority: input.priority || "medium",
          due_date: input.due_date,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-assignments"] });
      toast.success("Task assigned successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to assign task");
    },
  });

  // Update task status (Operational users can update their own)
  const updateTaskStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
      result,
    }: {
      id: string;
      status: TaskAssignment["status"];
      result?: Json;
    }) => {
      const updates: Partial<TaskAssignment> = { status };
      
      if (status === "completed") {
        updates.completed_at = new Date().toISOString();
      }
      
      if (result) {
        updates.result = result;
      }

      const { data, error } = await supabase
        .from("task_assignments")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-assignments"] });
      toast.success("Task updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update task");
    },
  });

  // Delete task (Managers only)
  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!canCreateTasks) {
        throw new Error("You don't have permission to delete tasks");
      }

      const { error } = await supabase
        .from("task_assignments")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-assignments"] });
      toast.success("Task deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete task");
    },
  });

  // Get tasks for current user (Operational)
  const myTasks = tasks.filter((t) => t.assigned_to === user?.id);

  // Get tasks by status
  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  return {
    tasks: canViewAllTasks ? tasks : myTasks,
    allTasks: tasks,
    myTasks,
    pendingTasks,
    inProgressTasks,
    completedTasks,
    isLoading,
    error,
    createTask: createTaskMutation.mutate,
    updateTaskStatus: updateTaskStatusMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskStatusMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
    canManageTasks: canCreateTasks,
  };
}
