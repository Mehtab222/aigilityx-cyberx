import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/MetricCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
} from "lucide-react";

interface AgentCardProps {
  name: string;
  description: string;
  status: "running" | "idle" | "error";
  tasksCompleted: number;
  tasksTotal: number;
  lastRun: string;
  metrics: { label: string; value: string | number }[];
  icon: React.ElementType;
}

const agents: AgentCardProps[] = [
  {
    name: "VCompliance",
    description: "Continuous compliance monitoring and gap analysis",
    status: "running",
    tasksCompleted: 145,
    tasksTotal: 161,
    lastRun: "2 min ago",
    metrics: [
      { label: "Frameworks Monitored", value: 5 },
      { label: "Controls Checked", value: 161 },
      { label: "Gaps Found", value: 12 },
    ],
    icon: FileCheck,
  },
  {
    name: "VAudit",
    description: "Automated audit trail analysis and evidence collection",
    status: "running",
    tasksCompleted: 89,
    tasksTotal: 100,
    lastRun: "5 min ago",
    metrics: [
      { label: "Evidence Items", value: 342 },
      { label: "Findings", value: 24 },
      { label: "Auto-remediated", value: 8 },
    ],
    icon: Search,
  },
  {
    name: "VRisk",
    description: "Real-time risk assessment and threat modeling",
    status: "idle",
    tasksCompleted: 50,
    tasksTotal: 50,
    lastRun: "15 min ago",
    metrics: [
      { label: "Risks Assessed", value: 127 },
      { label: "Critical", value: 3 },
      { label: "Mitigations", value: 45 },
    ],
    icon: AlertTriangle,
  },
  {
    name: "VGovernance",
    description: "Policy enforcement and governance automation",
    status: "running",
    tasksCompleted: 78,
    tasksTotal: 85,
    lastRun: "1 min ago",
    metrics: [
      { label: "Policies Active", value: 42 },
      { label: "Violations", value: 7 },
      { label: "Auto-enforced", value: 35 },
    ],
    icon: Shield,
  },
];

const recentAgentActivity = [
  { agent: "VCompliance", action: "Completed ISO 27001 control assessment", time: "2 min ago", result: "success" },
  { agent: "VAudit", action: "Generated evidence for SOC 2 Type II", time: "5 min ago", result: "success" },
  { agent: "VGovernance", action: "Enforced password policy on 12 accounts", time: "8 min ago", result: "success" },
  { agent: "VRisk", action: "Updated threat model for cloud infrastructure", time: "15 min ago", result: "success" },
  { agent: "VCompliance", action: "Detected PCI-DSS control gap", time: "20 min ago", result: "warning" },
];

function AgentCard({ agent }: { agent: AgentCardProps }) {
  const Icon = agent.icon;
  const progress = Math.round((agent.tasksCompleted / agent.tasksTotal) * 100);

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
              <p className="text-xs text-muted-foreground mt-0.5">
                {agent.description}
              </p>
            </div>
          </div>
          <StatusBadge
            status={
              agent.status === "running"
                ? "active"
                : agent.status === "idle"
                ? "inactive"
                : "critical"
            }
            label={agent.status}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-muted-foreground">Task Progress</span>
            <span className="font-medium">
              {agent.tasksCompleted}/{agent.tasksTotal}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2">
          {agent.metrics.map((metric, index) => (
            <div key={index} className="p-2 rounded-lg bg-muted/50 text-center">
              <p className="text-lg font-bold text-primary">{metric.value}</p>
              <p className="text-[10px] text-muted-foreground leading-tight">
                {metric.label}
              </p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Last run: {agent.lastRun}
          </span>
          <div className="flex gap-2">
            {agent.status === "running" ? (
              <Button size="sm" variant="ghost" className="h-7 px-2">
                <PauseCircle className="w-4 h-4" />
              </Button>
            ) : (
              <Button size="sm" variant="ghost" className="h-7 px-2">
                <PlayCircle className="w-4 h-4" />
              </Button>
            )}
            <Button size="sm" variant="ghost" className="h-7 px-2">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const AgentsDashboard = () => {
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
            value="3/4"
            subtitle="1 idle"
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

        {/* Agent Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {agents.map((agent) => (
            <AgentCard key={agent.name} agent={agent} />
          ))}
        </div>

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
              {recentAgentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {activity.result === "success" ? (
                      <CheckCircle className="w-4 h-4 text-cyber-success" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-cyber-warning" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-primary">
                          {activity.agent}
                        </span>
                        <span className="text-sm">{activity.action}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AgentsDashboard;
