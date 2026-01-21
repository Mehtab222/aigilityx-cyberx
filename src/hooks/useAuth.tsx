import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

// Includes both legacy roles and new RBAC roles
type AppRole = "admin" | "ciso" | "soc" | "auditor" | "operational" | "executive" | null;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: AppRole;
  isLoading: boolean;
  isManager: boolean; // Can create agents (admin or ciso)
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isManager = role === "admin" || role === "ciso";

  const fetchUserRole = async (userId: string): Promise<AppRole> => {
    try {
      console.log("Fetching role for user:", userId);
      
      // Use the RPC function which bypasses RLS with security definer
      const { data, error } = await supabase
        .rpc('get_user_role', { _user_id: userId });

      if (error) {
        console.error("Error fetching role via RPC:", error);
        // Fallback to direct query
        const { data: directData, error: directError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .maybeSingle();
        
        if (directError) {
          console.error("Error fetching role directly:", directError);
          return null;
        }
        console.log("Role fetched directly:", directData?.role);
        return directData?.role as AppRole;
      }
      
      console.log("Role fetched via RPC:", data);
      return data as AppRole;
    } catch (err) {
      console.error("Error fetching role:", err);
      return null;
    }
  };

  /**
   * IMPORTANT (security): getSession() reads from local storage and may be stale.
   * We validate a session by calling getUser(), which checks the JWT with the backend.
   */
  const syncAuthState = async (currentSession: Session | null) => {
    setSession(currentSession);

    if (!currentSession) {
      setUser(null);
      setRole(null);
      setIsLoading(false);
      return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      console.warn("Session validation failed; treating as signed out", userError);
      setSession(null);
      setUser(null);
      setRole(null);
      setIsLoading(false);
      return;
    }

    setUser(userData.user);
    const userRole = await fetchUserRole(userData.user.id);
    setRole(userRole);
    setIsLoading(false);
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        // Any auth event should re-sync state (and validate the session)
        setIsLoading(true);
        await syncAuthState(currentSession);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setIsLoading(true);
      await syncAuthState(currentSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
      throw error;
    }
    toast.success("Signed in successfully");
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) {
      toast.error(error.message);
      throw error;
    }
    toast.success("Account created successfully! You can now sign in.");
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      throw error;
    }
    toast.success("Signed out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role,
        isLoading,
        isManager,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
