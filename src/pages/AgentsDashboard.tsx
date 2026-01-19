import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/MetricCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CreateAgentDialog } from "@/components/agents/CreateAgentDialog";
import { useAgents, Agent } from "@/hooks/useAgents";
import { useAuth } from "@/hooks/useAuth";
import {
  Cpu,
  FileCheck,
  Search,
  AlertTriangle,
  Shield,
  Activity,
  Clock,
  CheckCircle,
  RefreshCw,
  PlayCircle,
  PauseCircle,
  Zap,
  BarChart3,
  Loader2,
} from "lucide-react";

const getAgentIcon = (type: string) => {
  switch (type) {
    case "vcompliance": return FileCheck;
    case "vaudit": return Search;
    case "vrisk": return AlertTriangle;
    case "vgovernance": return Shield;
    default: return Cpu;
  }
};

function AgentCard({ agent, canManage, onToggle, isUpdating }: { 
  agent: Agent; 
  canManage: boolean;
  onToggle: () => void;
  isUpdating: boolean;
}) {
  const Icon = getAgentIcon(agent.type);
  const progress = agent.status === "active" ? 100 : 0;

  return (
    <Card className="cyber-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">{agent.name}</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                {agent.type.replace("v", "V")} Agent
              </p>
            </div>
          </div>
          <StatusBadge
            status={
              agent.status === "active"
                ? "success"
                : agent.status === "inactive"
                ? "inactive"
                : agent.status === "pending"
                ? "pending"
                : "critical"
            }
            label={agent.status}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Description */}
        {agent.description && (
          <p className="text-sm text-muted-foreground">{agent.description}</p>
        )}

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-muted-foreground">Status</span>
            <span className="font-medium">
              {agent.status === "active" ? "Running" : "Stopped"}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Created: {new Date(agent.created_at).toLocaleDateString()}
          </span>
          {canManage && (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-7 px-2"
                onClick={onToggle}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : agent.status === "active" ? (
                  <PauseCircle className="w-4 h-4" />
                ) : (
                  <PlayCircle className="w-4 h-4" />
                )}
              </Button>
              <Button size="sm" variant="ghost" className="h-7 px-2">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const AgentsDashboard = () => {
  const { agents, isLoading, toggleAgentStatus, isUpdating } = useAgents();
  const { isManager } = useAuth();

  const activeAgents = agents.filter(a => a.status === "active").length;

  return (
    <DashboardLayout
      title="Agents Dashboard"
      subtitle="AI agent orchestration and monitoring"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Active Agents"
            value={`${activeAgents}/${agents.length}`}
            subtitle={agents.length > 0 ? `${agents.length - activeAgents} inactive` : "No agents"}
            icon={Cpu}
            status="success"
          />
          <MetricCard
            title="Tasks Completed"
            value={362}
            subtitle="Today"
            icon={CheckCircle}
            status="success"
            trend={{ value: 15, isPositive: true }}
          />
          <MetricCard
            title="Avg Response Time"
            value="1.2s"
            subtitle="Below threshold"
            icon={Zap}
            status="success"
          />
          <MetricCard
            title="Automation Rate"
            value="78%"
            subtitle="Tasks automated"
            icon={BarChart3}
            status="success"
            trend={{ value: 8, isPositive: true }}
          />
        </div>

        {/* Create Agent Button for Managers */}
        {isManager && (
          <div className="flex justify-end">
            <CreateAgentDialog />
          </div>
        )}

        {/* Agent Cards Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : agents.length === 0 ? (
          <Card className="cyber-card">
            <CardContent className="py-12 text-center">
              <Cpu className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No Agents Deployed</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {isManager 
                  ? "Create your first AI agent to start automating security operations."
                  : "Contact your administrator or CISO to deploy agents."
                }
              </p>
              {isManager && <CreateAgentDialog />}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {agents.map((agent) => (
              <AgentCard 
                key={agent.id} 
                agent={agent} 
                canManage={isManager}
                onToggle={() => toggleAgentStatus(agent.id, agent.status)}
                isUpdating={isUpdating}
              />
            ))}
          </div>
        )}

        {/* Recent Agent Activity */}
        <Card className="cyber-card">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Recent Agent Activity
            </CardTitle>
            <Button size="sm" variant="outline">
              View Full Log
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {agents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No agent activity yet
                </p>
              ) : (
                agents.slice(0, 5).map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {agent.status === "active" ? (
                        <CheckCircle className="w-4 h-4 text-cyber-success" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-cyber-warning" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-primary capitalize">
                            {agent.type.replace("v", "V")}
                          </span>
                          <span className="text-sm">{agent.name}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(agent.updated_at).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AgentsDashboard;
