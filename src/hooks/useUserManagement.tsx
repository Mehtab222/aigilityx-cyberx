import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions, AppRole } from "@/hooks/usePermissions";
import { useAuditLog } from "@/hooks/useAuditLog";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type DbAppRole = Database["public"]["Enums"]["app_role"];

export interface CreateUserPayload {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role: DbAppRole;
  is_active: boolean;
}

export interface UpdateUserPayload {
  user_id: string;
  full_name: string;
  phone?: string;
  role: DbAppRole;
  is_active: boolean;
  password?: string;
}

export interface UserWithRole {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  is_active: boolean;
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
          phone: profile.phone || null,
          is_active: true, // Default to active (we can add is_active column later if needed)
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

  // Create new user
  const createUserMutation = useMutation({
    mutationFn: async (payload: CreateUserPayload) => {
      if (!isAdmin) {
        throw new Error("Only admins can create users");
      }

      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error("No active session");
      }

      const response = await supabase.functions.invoke("create-user", {
        body: payload,
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to create user");
      }

      // Check for application-level error in response data
      if (response.data && !response.data.success && response.data.error) {
        throw new Error(response.data.error);
      }

      if (!response.data?.success) {
        throw new Error("Failed to create user");
      }

      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
      logAction({
        action: "user.create",
        resourceType: "user",
        resourceId: data.user_id,
        details: { message: "User created via admin panel" },
      });
      toast.success("User created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create user");
    },
  });

  // Update user profile and role
  const updateUserMutation = useMutation({
    mutationFn: async (payload: UpdateUserPayload) => {
      if (!isAdmin) {
        throw new Error("Only admins can update users");
      }

      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: payload.full_name,
          phone: payload.phone || null,
        })
        .eq("user_id", payload.user_id);

      if (profileError) throw profileError;

      // Get existing role for this user
      const { data: existingRole } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", payload.user_id)
        .single();

      if (existingRole) {
        // Update existing role
        const { error: roleError } = await supabase
          .from("user_roles")
          .update({ role: payload.role })
          .eq("id", existingRole.id);

        if (roleError) throw roleError;
      } else {
        // Insert new role
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert([{ user_id: payload.user_id, role: payload.role }]);

        if (roleError) throw roleError;
      }

      return payload;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
      logAction({
        action: "user.update",
        resourceType: "user",
        resourceId: data.user_id,
        details: { message: "User updated via admin panel" },
      });
      toast.success("User updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user");
    },
  });

  // Delete user (soft delete - just removes from profiles, auth user remains)
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      if (!isAdmin) {
        throw new Error("Only admins can delete users");
      }

      // First delete the role
      const { error: roleError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);

      if (roleError) throw roleError;

      // Note: We can't delete auth.users from client side
      // The profile will remain but role is removed
      // For full deletion, we'd need an edge function with service role

      return userId;
    },
    onSuccess: (userId) => {
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
      logAction({
        action: "user.delete",
        resourceType: "user",
        resourceId: userId,
        details: { message: "User role removed via admin panel" },
      });
      toast.success("User deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete user");
    },
  });

  return {
    users,
    isLoading,
    error,
    assignRole: assignRoleMutation.mutate,
    removeRole: removeRoleMutation.mutate,
    createUser: createUserMutation.mutateAsync,
    updateUser: updateUserMutation.mutateAsync,
    deleteUser: deleteUserMutation.mutateAsync,
    isAssigning: assignRoleMutation.isPending,
    isRemoving: removeRoleMutation.isPending,
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
    canManageUsers: isAdmin,
  };
}
