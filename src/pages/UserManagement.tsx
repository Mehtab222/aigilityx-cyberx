import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUserManagement, UserWithRole, UpdateUserPayload } from "@/hooks/useUserManagement";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuth } from "@/hooks/useAuth";
import { Users, Shield, UserCog, Loader2, UserPlus, Pencil, Trash2, Phone } from "lucide-react";
import { format } from "date-fns";
import { Database } from "@/integrations/supabase/types";
import { AddUserDialog, CreateUserData } from "@/components/users/AddUserDialog";
import { EditUserDialog, UpdateUserData } from "@/components/users/EditUserDialog";
import { DeleteUserDialog } from "@/components/users/DeleteUserDialog";

type DbAppRole = Database["public"]["Enums"]["app_role"];

const AVAILABLE_ROLES: { value: DbAppRole; label: string; description: string }[] = [
  { value: "admin", label: "Admin", description: "Full system access" },
  { value: "ciso", label: "CISO", description: "Security operations management" },
  { value: "operational", label: "Operational", description: "Task execution" },
  { value: "executive", label: "Executive", description: "Read-only strategic view" },
  { value: "soc", label: "SOC (Legacy)", description: "Maps to Operational" },
  { value: "auditor", label: "Auditor (Legacy)", description: "Maps to Executive" },
];

const getRoleBadgeVariant = (role: DbAppRole | null) => {
  switch (role) {
    case "admin":
      return "destructive";
    case "ciso":
      return "default";
    case "operational":
    case "soc":
      return "secondary";
    case "executive":
    case "auditor":
      return "outline";
    default:
      return "outline";
  }
};

const getInitials = (name: string | null, email: string | null) => {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return "??";
};

const UserManagement = () => {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  
  const { 
    users, 
    isLoading, 
    assignRole, 
    createUser, 
    updateUser,
    deleteUser,
    isAssigning, 
    isCreating,
    isUpdating,
    isDeleting,
    canManageUsers 
  } = useUserManagement();
  const { isAdmin } = usePermissions();
  const { user: currentUser } = useAuth();

  const handleRoleChange = (user: UserWithRole, newRole: DbAppRole) => {
    assignRole({
      userId: user.user_id,
      role: newRole,
      existingRoleId: user.role_id,
    });
  };

  const handleCreateUser = async (data: CreateUserData) => {
    try {
      await createUser(data);
      setIsAddUserOpen(false);
    } catch (error) {
      // Error handled in mutation
    }
  };

  const handleEditClick = (user: UserWithRole) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  const handleUpdateUser = async (data: UpdateUserData) => {
    try {
      await updateUser(data);
      setIsEditUserOpen(false);
      setSelectedUser(null);
    } catch (error) {
      // Error handled in mutation
    }
  };

  const handleDeleteClick = (user: UserWithRole) => {
    setSelectedUser(user);
    setIsDeleteUserOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser(selectedUser.user_id);
      setIsDeleteUserOpen(false);
      setSelectedUser(null);
    } catch (error) {
      // Error handled in mutation
    }
  };

  // Check if user is the currently logged in admin
  const isCurrentUser = (user: UserWithRole) => {
    return currentUser?.id === user.user_id;
  };

  if (!isAdmin) {
    return (
      <DashboardLayout title="Access Denied" subtitle="You don't have permission to view this page">
        <Card className="cyber-card">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Admin access required</p>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="User Management"
      subtitle="Manage user accounts and role assignments"
    >
      {/* Dialogs */}
      <AddUserDialog
        open={isAddUserOpen}
        onOpenChange={setIsAddUserOpen}
        onSubmit={handleCreateUser}
        isLoading={isCreating}
      />
      <EditUserDialog
        open={isEditUserOpen}
        onOpenChange={setIsEditUserOpen}
        onSubmit={handleUpdateUser}
        isLoading={isUpdating}
        user={selectedUser}
      />
      <DeleteUserDialog
        open={isDeleteUserOpen}
        onOpenChange={setIsDeleteUserOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        user={selectedUser}
      />

      <div className="space-y-6 animate-fade-in">
        {/* Add User Button */}
        <div className="flex justify-end">
          <Button onClick={() => setIsAddUserOpen(true)} className="gap-2">
            <UserPlus className="w-4 h-4" />
            Add User
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="cyber-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{users.length}</p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="cyber-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-destructive/10">
                  <Shield className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {users.filter((u) => u.role === "admin").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Admins</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="cyber-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <UserCog className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {users.filter((u) => u.role === "ciso").length}
                  </p>
                  <p className="text-sm text-muted-foreground">CISOs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="cyber-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-muted">
                  <Users className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {users.filter((u) => !u.role).length}
                  </p>
                  <p className="text-sm text-muted-foreground">No Role</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              All Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No users found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                    <TableHead>Edit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar_url || undefined} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {getInitials(user.full_name, user.email)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {user.full_name || "Unknown"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.email || "No email"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.phone ? (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{user.phone}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground/50">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.role ? (
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            {user.role}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            No role
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.is_active ? "default" : "secondary"} className={user.is_active ? "bg-green-600 hover:bg-green-700" : ""}>
                          {user.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(user.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={user.role || ""}
                          onValueChange={(value) =>
                            handleRoleChange(user, value as DbAppRole)
                          }
                          disabled={isAssigning}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Assign role" />
                          </SelectTrigger>
                          <SelectContent>
                            {AVAILABLE_ROLES.map((role) => (
                              <SelectItem key={role.value} value={role.value}>
                                <div className="flex flex-col">
                                  <span>{role.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(user)}
                            className="h-8 w-8 hover:bg-primary/10"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(user)}
                            disabled={isCurrentUser(user)}
                            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                            title={isCurrentUser(user) ? "Cannot delete yourself" : "Delete user"}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Role Descriptions */}
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Role Permissions Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AVAILABLE_ROLES.slice(0, 4).map((role) => (
                <div
                  key={role.value}
                  className="p-4 rounded-lg border bg-muted/30"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={getRoleBadgeVariant(role.value)}>
                      {role.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {role.description}
                  </p>
                  <ul className="mt-2 text-xs text-muted-foreground space-y-1">
                    {role.value === "admin" && (
                      <>
                        <li>• Full CRUD on users, templates, agents</li>
                        <li>• System configuration access</li>
                        <li>• View all audit logs</li>
                      </>
                    )}
                    {role.value === "ciso" && (
                      <>
                        <li>• Create agents from templates</li>
                        <li>• Assign agents and tasks</li>
                        <li>• View operations dashboard</li>
                      </>
                    )}
                    {role.value === "operational" && (
                      <>
                        <li>• Execute assigned tasks</li>
                        <li>• Interact with assigned agents</li>
                        <li>• View own task dashboard</li>
                      </>
                    )}
                    {role.value === "executive" && (
                      <>
                        <li>• Read-only strategic dashboards</li>
                        <li>• Generate and export reports</li>
                        <li>• Monitor risk and compliance</li>
                      </>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;
