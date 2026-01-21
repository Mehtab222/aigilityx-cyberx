import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

/**
 * App-level auth guard that enforces redirects on:
 * - initial load
 * - route changes
 * - refresh/deep links
 *
 * NOTE: This is complementary to <ProtectedRoute />. It ensures we don't accidentally
 * expose protected pages if a route is added without the wrapper.
 */
export function AuthRouteSync() {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    const pathname = location.pathname;

    const protectedRoutes = [
      "/dashboard",
      "/operations",
      "/admin",
      "/users",
      "/agents",
      "/user-management",
    ];

    const isProtected = protectedRoutes.some(
      (r) => pathname === r || pathname.startsWith(`${r}/`)
    );

    // Unauthenticated users must never reach protected routes.
    if (!user && isProtected) {
      navigate("/login", { replace: true, state: { from: location } });
      return;
    }

    // Auth-only route: prevent authenticated users from staying on /login.
    if (user && pathname === "/login") {
      navigate("/dashboard", { replace: true });
    }

    // Prevent landing page from appearing in authenticated context when directly navigating
    // (This is optional - users can still visit landing page while logged in)
  }, [isLoading, user, location, navigate]);

  return null;
}
