import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, User, Mail, Lock, Phone, Shield, ToggleLeft, Pencil } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import { UserWithRole } from "@/hooks/useUserManagement";

type DbAppRole = Database["public"]["Enums"]["app_role"];

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UpdateUserData) => void;
  isLoading: boolean;
  user: UserWithRole | null;
}

export interface UpdateUserData {
  user_id: string;
  full_name: string;
  phone?: string;
  role: DbAppRole;
  is_active: boolean;
  password?: string;
}

const AVAILABLE_ROLES: { value: DbAppRole; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "ciso", label: "CISO" },
  { value: "operational", label: "Operational" },
  { value: "executive", label: "Executive" },
  { value: "soc", label: "SOC (Legacy)" },
  { value: "auditor", label: "Auditor (Legacy)" },
];

export function EditUserDialog({ open, onOpenChange, onSubmit, isLoading, user }: EditUserDialogProps) {
  const [formData, setFormData] = useState<Omit<UpdateUserData, 'user_id'>>({
    full_name: "",
    phone: "",
    role: "operational",
    is_active: true,
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-fill form when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        phone: user.phone || "",
        role: user.role || "operational",
        is_active: user.is_active !== false, // Default to true if undefined
        password: "",
      });
      setConfirmPassword("");
      setShowPassword(false);
      setErrors({});
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    // Only validate password if user is changing it
    if (showPassword && formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
      if (formData.password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (validateForm()) {
      const submitData: UpdateUserData = {
        user_id: user.user_id,
        full_name: formData.full_name,
        phone: formData.phone,
        role: formData.role,
        is_active: formData.is_active,
      };
      
      // Only include password if it was changed
      if (showPassword && formData.password) {
        submitData.password = formData.password;
      }
      
      onSubmit(submitData);
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: "",
      phone: "",
      role: "operational",
      is_active: true,
      password: "",
    });
    setConfirmPassword("");
    setShowPassword(false);
    setErrors({});
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  const getPasswordStrength = (password: string): { label: string; color: string } => {
    if (password.length === 0) return { label: "", color: "" };
    if (password.length < 6) return { label: "Too short", color: "text-destructive" };
    if (password.length < 8) return { label: "Weak", color: "text-orange-500" };
    if (password.length < 12 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { label: "Medium", color: "text-yellow-500" };
    }
    if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      return { label: "Strong", color: "text-green-500" };
    }
    return { label: "Medium", color: "text-yellow-500" };
  };

  const passwordStrength = getPasswordStrength(formData.password || "");

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Pencil className="w-5 h-5 text-primary" />
            Edit User
          </DialogTitle>
          <DialogDescription>
            Update user information and role assignment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* User Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <User className="w-4 h-4" />
              User Information
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="edit_full_name">Full Name *</Label>
              <Input
                id="edit_full_name"
                placeholder="Enter full name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className={errors.full_name ? "border-destructive" : ""}
                autoFocus
              />
              {errors.full_name && (
                <p className="text-xs text-destructive">{errors.full_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="edit_email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="pl-10 opacity-60 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
          </div>

          {/* Security Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Security / Access
            </h3>

            <div className="space-y-2">
              <Label htmlFor="edit_role">Role Assignment *</Label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as DbAppRole })}
                >
                  <SelectTrigger className={`pl-10 ${errors.role ? "border-destructive" : ""}`}>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_ROLES.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors.role && (
                <p className="text-xs text-destructive">{errors.role}</p>
              )}
            </div>

            {/* Password Change Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <div className="space-y-0.5">
                <Label htmlFor="change_password" className="text-sm font-medium">
                  Change Password
                </Label>
                <p className="text-xs text-muted-foreground">
                  Enable to set a new password
                </p>
              </div>
              <Switch
                id="change_password"
                checked={showPassword}
                onCheckedChange={(checked) => {
                  setShowPassword(checked);
                  if (!checked) {
                    setFormData({ ...formData, password: "" });
                    setConfirmPassword("");
                  }
                }}
              />
            </div>

            {showPassword && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="edit_password">New Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="edit_password"
                      type="text"
                      placeholder="Enter new password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`pl-10 ${errors.password ? "border-destructive" : ""}`}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    {errors.password && (
                      <p className="text-xs text-destructive">{errors.password}</p>
                    )}
                    {passwordStrength.label && (
                      <p className={`text-xs ${passwordStrength.color} ml-auto`}>
                        {passwordStrength.label}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="edit_confirmPassword"
                      type="text"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`pl-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Contact Information
            </h3>

            <div className="space-y-2">
              <Label htmlFor="edit_phone">Phone Number (Optional)</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="edit_phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Account Status Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ToggleLeft className="w-4 h-4" />
              Account Status
            </h3>

            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <div className="space-y-0.5">
                <Label htmlFor="edit_is_active" className="text-sm font-medium">
                  Account Active
                </Label>
                <p className="text-xs text-muted-foreground">
                  User can log in when active
                </p>
              </div>
              <Switch
                id="edit_is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
