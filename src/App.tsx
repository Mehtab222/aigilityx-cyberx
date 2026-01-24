import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AuthRouteSync } from "@/components/auth/AuthRouteSync";
import LandingPage from "./pages/LandingPage";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import OperationsPage from "./pages/OperationsPage";
import AdminDashboard from "./pages/AdminDashboard";
import UsersDashboard from "./pages/UsersDashboard";
import AgentsDashboard from "./pages/AgentsDashboard";
import UserManagement from "./pages/UserManagement";
import CompliancePage from "./pages/CompliancePage";
import RisksPage from "./pages/RisksPage";
import ReportsPage from "./pages/ReportsPage";
import DigitalTwinPage from "./pages/DigitalTwinPage";
import AdvisorsPage from "./pages/AdvisorsPage";
import PoliciesPage from "./pages/PoliciesPage";
import PlaybooksPage from "./pages/PlaybooksPage";
import SettingsPage from "./pages/SettingsPage";
import ConversXPage from "./pages/ConversXPage";
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AuthRouteSync />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/conversx"
              element={
                <ProtectedRoute requiredRoles={["admin", "ciso", "soc", "operational"]}>
                  <ConversXPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/operations"
              element={
                <ProtectedRoute requiredRoles={["admin", "ciso", "soc", "operational"]}>
                  <OperationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute requiredRoles={["admin", "ciso"]}>
                  <UsersDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/agents"
              element={
                <ProtectedRoute>
                  <AgentsDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-management"
              element={
                <ProtectedRoute requiredRoles={["admin"]}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/compliance"
              element={
                <ProtectedRoute requiredRoles={["admin", "ciso", "auditor", "executive"]}>
                  <CompliancePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/risks"
              element={
                <ProtectedRoute requiredRoles={["admin", "ciso", "auditor", "executive"]}>
                  <RisksPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute requiredRoles={["admin", "ciso", "auditor", "executive"]}>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/simulation"
              element={
                <ProtectedRoute requiredRoles={["admin", "ciso"]}>
                  <DigitalTwinPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/advisors"
              element={
                <ProtectedRoute requiredRoles={["admin", "ciso"]}>
                  <AdvisorsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/policies"
              element={
                <ProtectedRoute requiredRoles={["admin", "ciso", "auditor"]}>
                  <PoliciesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/playbooks"
              element={
                <ProtectedRoute requiredRoles={["admin", "ciso", "soc", "operational"]}>
                  <PlaybooksPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute requiredRoles={["admin"]}>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
