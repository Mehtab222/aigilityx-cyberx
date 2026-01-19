import { Bot, Brain, Eye, Shield, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Agent {
  name: string;
  role: string;
  status: "active" | "idle" | "processing";
  lastAction: string;
  confidence: number;
  icon: React.ElementType;
}

const agents: Agent[] = [
  {
    name: "vCISO",
    role: "Strategic Advisor",
    status: "active",
    lastAction: "Analyzing Q4 risk report",
    confidence: 94,
    icon: Shield,
  },
  {
    name: "vSOC",
    role: "Security Operations",
    status: "processing",
    lastAction: "Investigating INC-001",
    confidence: 87,
    icon: Eye,
  },
  {
    name: "ThreatHunter",
    role: "Threat Intelligence",
    status: "active",
    lastAction: "Scanning network anomalies",
    confidence: 91,
    icon: Brain,
  },
  {
    name: "Compliance Bot",
    role: "Audit Assistant",
    status: "idle",
    lastAction: "Completed ISO audit prep",
    confidence: 96,
    icon: Bot,
  },
];

export function AgentStatusPanel() {
  return (
    <div className="metric-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">AI Agents</h3>
          <p className="text-sm text-muted-foreground">
            Active virtual assistants
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
          <Zap className="w-3 h-3 text-primary" />
          <span className="text-xs font-medium text-primary">
            {agents.filter((a) => a.status !== "idle").length} Active
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {agents.map((agent) => {
          const Icon = agent.icon;
          return (
            <div
              key={agent.name}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
            >
              <div
                className={cn(
                  "p-2 rounded-lg shrink-0",
                  agent.status === "active" && "bg-success/10",
                  agent.status === "processing" && "bg-primary/10",
                  agent.status === "idle" && "bg-muted"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4",
                    agent.status === "active" && "text-success",
                    agent.status === "processing" && "text-primary animate-pulse",
                    agent.status === "idle" && "text-muted-foreground"
                  )}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {agent.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {agent.role}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium",
                        agent.status === "active" &&
                          "bg-success/10 text-success",
                        agent.status === "processing" &&
                          "bg-primary/10 text-primary",
                        agent.status === "idle" && "bg-muted text-muted-foreground"
                      )}
                    >
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          agent.status === "active" && "bg-success animate-pulse",
                          agent.status === "processing" && "bg-primary animate-pulse",
                          agent.status === "idle" && "bg-muted-foreground"
                        )}
                      />
                      {agent.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground truncate">
                    {agent.lastAction}
                  </span>
                  <span className="text-primary font-mono shrink-0 ml-2">
                    {agent.confidence}% conf
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
