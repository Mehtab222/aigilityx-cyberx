import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/MetricCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { CreateAgentDialog } from "@/components/agents/CreateAgentDialog";
import { useAgents } from "@/hooks/useAgents";
import {
  Users,
  Shield,
  Settings,
  Server,
  Database,
  Key,
  UserPlus,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Bot,
} from "lucide-react";

const systemHealth = [
  { name: "Database", status: "healthy" as const, uptime: "99.99%" },
  { name: "API Gateway", status: "healthy" as const, uptime: "99.95%" },
  { name: "Auth Service", status: "healthy" as const, uptime: "100%" },
  { name: "Agent Orchestrator", status: "warning" as const, uptime: "98.5%" },
];

const recentUsers = [
  { name: "Ahmed Al-Rashid", role: "V-CISO", status: "active", lastActive: "2 min ago" },
  { name: "Sarah Johnson", role: "V-SOC", status: "active", lastActive: "5 min ago" },
  { name: "Mohammed Hassan", role: "V-Auditor", status: "inactive", lastActive: "2 hours ago" },
  { name: "Fatima Al-Zahra", role: "V-CISO", status: "active", lastActive: "1 hour ago" },
];

const AdminDashboard = () => {
  const { agents } = useAgents();
  const activeAgents = agents.filter(a => a.status === "active").length;

  return (
    <DashboardLayout
      title="Administrator Dashboard"
      subtitle="System administration and platform management"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Users"
            value={48}
            subtitle="12 active now"
            icon={Users}
            status="success"
            trend={{ value: 8, isPositive: true }}
          />
          <MetricCard
            title="Active Agents"
            value={`${activeAgents}/${agents.length}`}
            subtitle={agents.length > 0 ? `${agents.length - activeAgents} inactive` : "No agents yet"}
            icon={Bot}
            status="success"
          />
          <MetricCard
            title="System Uptime"
            value="99.9%"
            subtitle="Last 30 days"
            icon={Server}
            status="success"
          />
          <MetricCard
            title="API Calls Today"
            value="12.4K"
            subtitle="+23% from avg"
            icon={Activity}
            status="success"
            trend={{ value: 23, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Health */}
          <Card className="cyber-card lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Server className="w-4 h-4 text-primary" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {systemHealth.map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        service.status === "healthy"
                          ? "bg-cyber-success"
                          : "bg-cyber-warning animate-pulse"
                      }`}
                    />
                    <span className="text-sm font-medium">{service.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {service.uptime}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* User Management */}
          <Card className="cyber-card lg:col-span-2">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Recent Users
              </CardTitle>
              <Button size="sm" variant="cyber">
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentUsers.map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary">
                          {user.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {user.lastActive}
                      </span>
                      <StatusBadge
                        status={user.status === "active" ? "success" : "inactive"}
                        label={user.status}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agent Management Section */}
        <Card className="cyber-card">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary" />
              Agent Management
            </CardTitle>
            <CreateAgentDialog />
          </CardHeader>
          <CardContent>
            {agents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No agents created yet</p>
                <p className="text-xs">Click "Create Agent" to deploy your first AI agent</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {agents.slice(0, 4).map((agent) => (
                  <div
                    key={agent.id}
                    className="p-4 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{agent.name}</span>
                      <StatusBadge
                        status={agent.status === "active" ? "success" : agent.status === "error" ? "critical" : "inactive"}
                        label={agent.status}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground capitalize">{agent.type.replace("v", "V")}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="cyber-card hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">User Management</p>
                <p className="text-xs text-muted-foreground">Manage roles & permissions</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Database Admin</p>
                <p className="text-xs text-muted-foreground">Backup & restore</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Key className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">API Keys</p>
                <p className="text-xs text-muted-foreground">Manage integrations</p>
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">System Settings</p>
                <p className="text-xs text-muted-foreground">Platform configuration</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Audit Log Preview */}
        <Card className="cyber-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Recent Activity Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { action: "User login", user: "Ahmed Al-Rashid", time: "2 min ago", type: "info" },
                { action: "Policy updated", user: "System", time: "15 min ago", type: "success" },
                { action: "Failed login attempt", user: "Unknown", time: "1 hour ago", type: "warning" },
                { action: "Agent deployed", user: "Admin", time: "2 hours ago", type: "success" },
              ].map((log, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    {log.type === "success" && (
                      <CheckCircle className="w-4 h-4 text-cyber-success" />
                    )}
                    {log.type === "warning" && (
                      <AlertTriangle className="w-4 h-4 text-cyber-warning" />
                    )}
                    {log.type === "info" && (
                      <Activity className="w-4 h-4 text-primary" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{log.action}</p>
                      <p className="text-xs text-muted-foreground">by {log.user}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{log.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
