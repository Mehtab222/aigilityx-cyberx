import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions, AppRole } from "@/hooks/usePermissions";
import { useAuditLog } from "@/hooks/useAuditLog";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type DbAppRole = Database["public"]["Enums"]["app_role"];

export interface UserWithRole {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: DbAppRole | null;
  role_id: string | null;
  created_at: string;
}

export function useUserManagement() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { canViewAllUsers, canEditUsers, canDeleteUsers, isAdmin } = usePermissions();
  const { logAction } = useAuditLog();

  // Fetch all users with their roles (Admin only)
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users-with-roles"],
    queryFn: async () => {
      if (!canViewAllUsers) {
        return [];
      }

      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;

      // Merge profiles with roles
      const usersWithRoles: UserWithRole[] = profiles.map((profile) => {
        const userRole = roles.find((r) => r.user_id === profile.user_id);
        return {
          id: profile.id,
          user_id: profile.user_id,
          email: profile.email,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          role: userRole?.role || null,
          role_id: userRole?.id || null,
          created_at: profile.created_at,
        };
      });

      return usersWithRoles;
    },
    enabled: !!user && canViewAllUsers,
  });

  // Assign or update role
  const assignRoleMutation = useMutation({
    mutationFn: async ({
      userId,
      role,
      existingRoleId,
    }: {
      userId: string;
      role: DbAppRole;
      existingRoleId: string | null;
    }) => {
      if (!canEditUsers) {
        throw new Error("You don't have permission to assign roles");
      }

      if (existingRoleId) {
        // Update existing role
        const { error } = await supabase
          .from("user_roles")
          .update({ role })
          .eq("id", existingRoleId);

        if (error) throw error;
      } else {
        // Insert new role
        const { error } = await supabase.from("user_roles").insert([
          {
            user_id: userId,
            role,
          },
        ]);

        if (error) throw error;
      }

      return { userId, role };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
      logAction({
        action: "role.assign",
        resourceType: "user",
        resourceId: data.userId,
        details: { newRole: data.role },
      });
      toast.success(`Role updated to ${data.role}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to assign role");
    },
  });

  // Remove role
  const removeRoleMutation = useMutation({
    mutationFn: async (roleId: string) => {
      if (!canDeleteUsers) {
        throw new Error("You don't have permission to remove roles");
      }

      const { error } = await supabase.from("user_roles").delete().eq("id", roleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
      toast.success("Role removed");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to remove role");
    },
  });

  return {
    users,
    isLoading,
    error,
    assignRole: assignRoleMutation.mutate,
    removeRole: removeRoleMutation.mutate,
    isAssigning: assignRoleMutation.isPending,
    isRemoving: removeRoleMutation.isPending,
    canManageUsers: isAdmin,
  };
}
