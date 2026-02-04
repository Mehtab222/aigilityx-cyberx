import { useState } from "react";
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
import { Loader2, User, Mail, Lock, Phone, Shield, ToggleLeft } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type DbAppRole = Database["public"]["Enums"]["app_role"];

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateUserData) => void;
  isLoading: boolean;
}

export interface CreateUserData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role: DbAppRole;
  is_active: boolean;
}

const AVAILABLE_ROLES: { value: DbAppRole; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "ciso", label: "CISO" },
  { value: "operational", label: "Operational" },
  { value: "executive", label: "Executive" },
  { value: "soc", label: "SOC (Legacy)" },
  { value: "auditor", label: "Auditor (Legacy)" },
];

export function AddUserDialog({ open, onOpenChange, onSubmit, isLoading }: AddUserDialogProps) {
  const [formData, setFormData] = useState<CreateUserData>({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    role: "operational",
    is_active: true,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      full_name: "",
      phone: "",
      role: "operational",
      is_active: true,
    });
    setConfirmPassword("");
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

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Add New User
          </DialogTitle>
          <DialogDescription>
            Create a new user account with role assignment.
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
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
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
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Security Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Security / Access
            </h3>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="text"
                  placeholder="Enter password"
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
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="text"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pl-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role Assignment *</Label>
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
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Contact Information
            </h3>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
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
                <Label htmlFor="is_active" className="text-sm font-medium">
                  Account Active
                </Label>
                <p className="text-xs text-muted-foreground">
                  User can log in immediately after creation
                </p>
              </div>
              <Switch
                id="is_active"
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
                  Creating...
                </>
              ) : (
                "Add User"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
