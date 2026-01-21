import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/ui/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Cpu,
  Network,
  Server,
  Shield,
  Activity,
  AlertTriangle,
  Play,
  Pause,
  RefreshCw,
  Layers,
  Zap,
  Globe,
  Database,
  Cloud,
  Lock,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  type: "attack" | "failure" | "compliance" | "capacity";
  status: "ready" | "running" | "completed";
  lastRun: string;
  successRate: number;
  impactScore: number;
}

interface Asset {
  id: string;
  name: string;
  type: string;
  status: "healthy" | "warning" | "critical";
  riskScore: number;
  connections: number;
}

const scenarios: SimulationScenario[] = [
  {
    id: "1",
    name: "Ransomware Attack Simulation",
    description: "Simulates ransomware propagation through network segments",
    type: "attack",
    status: "completed",
    lastRun: "2024-01-14",
    successRate: 94,
    impactScore: 85,
  },
  {
    id: "2",
    name: "Data Center Failover",
    description: "Tests disaster recovery procedures for primary DC failure",
    type: "failure",
    status: "ready",
    lastRun: "2024-01-10",
    successRate: 98,
    impactScore: 45,
  },
  {
    id: "3",
    name: "DDoS Attack Response",
    description: "Evaluates DDoS mitigation and traffic rerouting capabilities",
    type: "attack",
    status: "running",
    lastRun: "2024-01-15",
    successRate: 0,
    impactScore: 72,
  },
  {
    id: "4",
    name: "Compliance Gap Analysis",
    description: "Identifies potential compliance violations under stress",
    type: "compliance",
    status: "completed",
    lastRun: "2024-01-12",
    successRate: 87,
    impactScore: 38,
  },
  {
    id: "5",
    name: "Cloud Capacity Stress Test",
    description: "Tests auto-scaling and resource allocation under peak load",
    type: "capacity",
    status: "ready",
    lastRun: "2024-01-08",
    successRate: 91,
    impactScore: 55,
  },
];

const assets: Asset[] = [
  { id: "1", name: "Production Web Cluster", type: "server", status: "healthy", riskScore: 25, connections: 48 },
  { id: "2", name: "Primary Database Server", type: "database", status: "warning", riskScore: 45, connections: 32 },
  { id: "3", name: "Edge Firewall", type: "network", status: "healthy", riskScore: 15, connections: 128 },
  { id: "4", name: "Cloud Storage Gateway", type: "cloud", status: "healthy", riskScore: 30, connections: 64 },
  { id: "5", name: "Identity Provider", type: "security", status: "critical", riskScore: 68, connections: 256 },
  { id: "6", name: "API Gateway", type: "network", status: "healthy", riskScore: 22, connections: 96 },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "server":
      return Server;
    case "database":
      return Database;
    case "network":
      return Network;
    case "cloud":
      return Cloud;
    case "security":
      return Lock;
    default:
      return Cpu;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "healthy":
      return "bg-success text-success-foreground";
    case "warning":
      return "bg-warning text-warning-foreground";
    case "critical":
      return "bg-destructive text-destructive-foreground";
    case "running":
      return "bg-info text-info-foreground animate-pulse";
    case "completed":
      return "bg-success/10 text-success";
    case "ready":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getScenarioTypeColor = (type: string) => {
  switch (type) {
    case "attack":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "failure":
      return "bg-warning/10 text-warning border-warning/20";
    case "compliance":
      return "bg-info/10 text-info border-info/20";
    case "capacity":
      return "bg-primary/10 text-primary border-primary/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function DigitalTwinPage() {
  return (
    <DashboardLayout
      title="Digital Twin"
      subtitle="Infrastructure simulation and attack scenario modeling"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Assets Modeled"
            value={assets.length}
            subtitle="In digital twin"
            icon={Layers}
            status="success"
          />
          <MetricCard
            title="Active Simulations"
            value={scenarios.filter((s) => s.status === "running").length}
            subtitle="Currently running"
            icon={Activity}
            status="medium"
          />
          <MetricCard
            title="Avg. Success Rate"
            value="92%"
            subtitle="Across all scenarios"
            icon={Shield}
            status="success"
            trend={{ value: 5, isPositive: true }}
          />
          <MetricCard
            title="Critical Findings"
            value={3}
            subtitle="Require attention"
            icon={AlertTriangle}
            status="critical"
          />
        </div>

        <Tabs defaultValue="scenarios" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="scenarios">Simulation Scenarios</TabsTrigger>
              <TabsTrigger value="topology">Network Topology</TabsTrigger>
              <TabsTrigger value="assets">Asset Inventory</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync Assets
              </Button>
              <Button size="sm" className="bg-primary">
                <Play className="w-4 h-4 mr-2" />
                New Simulation
              </Button>
            </div>
          </div>

          <TabsContent value="scenarios" className="space-y-4">
            <div className="grid gap-4">
              {scenarios.map((scenario) => (
                <Card key={scenario.id} className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{scenario.name}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getScenarioTypeColor(scenario.type)}`}>
                            {scenario.type}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(scenario.status)}`}>
                            {scenario.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{scenario.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {scenario.status === "running" ? (
                          <Button variant="outline" size="sm">
                            <Pause className="w-4 h-4 mr-2" />
                            Pause
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm">
                            <Play className="w-4 h-4 mr-2" />
                            Run
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">Last Run</p>
                        <p className="text-sm font-medium">{scenario.lastRun}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Success Rate</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">
                            {scenario.status === "running" ? "—" : `${scenario.successRate}%`}
                          </p>
                          {scenario.status !== "running" && (
                            <Progress value={scenario.successRate} className="w-16 h-1.5" />
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Impact Score</p>
                        <p className={`text-sm font-medium ${
                          scenario.impactScore >= 70 ? "text-destructive" :
                          scenario.impactScore >= 40 ? "text-warning" : "text-success"
                        }`}>
                          {scenario.impactScore}/100
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Affected Assets</p>
                        <p className="text-sm font-medium">{Math.floor(Math.random() * 20) + 5}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="topology" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Network Topology Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-96 bg-muted/20 rounded-lg border border-border overflow-hidden">
                  {/* Simplified network visualization */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-8">
                      {/* Internet */}
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-4 rounded-full bg-info/20 border-2 border-info">
                          <Globe className="w-8 h-8 text-info" />
                        </div>
                        <span className="text-sm font-medium">Internet</span>
                      </div>

                      {/* Edge */}
                      <div className="flex flex-col items-center gap-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-3 rounded-lg bg-success/20 border border-success">
                            <Shield className="w-6 h-6 text-success" />
                          </div>
                          <div className="p-3 rounded-lg bg-success/20 border border-success">
                            <Network className="w-6 h-6 text-success" />
                          </div>
                        </div>
                        <span className="text-sm font-medium">Edge Security</span>
                      </div>

                      {/* Core */}
                      <div className="flex flex-col items-center gap-4">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="p-3 rounded-lg bg-primary/20 border border-primary">
                            <Server className="w-6 h-6 text-primary" />
                          </div>
                          <div className="p-3 rounded-lg bg-warning/20 border border-warning">
                            <Database className="w-6 h-6 text-warning" />
                          </div>
                          <div className="p-3 rounded-lg bg-primary/20 border border-primary">
                            <Cloud className="w-6 h-6 text-primary" />
                          </div>
                        </div>
                        <span className="text-sm font-medium">Core Infrastructure</span>
                      </div>
                    </div>
                  </div>

                  {/* Connection lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <line x1="20%" y1="50%" x2="40%" y2="50%" stroke="currentColor" strokeWidth="2" className="text-border" strokeDasharray="4" />
                    <line x1="60%" y1="50%" x2="80%" y2="50%" stroke="currentColor" strokeWidth="2" className="text-border" strokeDasharray="4" />
                  </svg>
                </div>

                <div className="mt-4 flex items-center justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-success" />
                    <span>Healthy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-warning" />
                    <span>Warning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive" />
                    <span>Critical</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assets" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assets.map((asset) => {
                const Icon = getTypeIcon(asset.type);
                return (
                  <Card key={asset.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            asset.status === "healthy" ? "bg-success/10" :
                            asset.status === "warning" ? "bg-warning/10" : "bg-destructive/10"
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              asset.status === "healthy" ? "text-success" :
                              asset.status === "warning" ? "text-warning" : "text-destructive"
                            }`} />
                          </div>
                          <div>
                            <h3 className="font-medium">{asset.name}</h3>
                            <p className="text-xs text-muted-foreground capitalize">{asset.type}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(asset.status)}>
                          {asset.status}
                        </Badge>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-border">
                        <div>
                          <p className="text-xs text-muted-foreground">Risk Score</p>
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-medium ${
                              asset.riskScore >= 60 ? "text-destructive" :
                              asset.riskScore >= 30 ? "text-warning" : "text-success"
                            }`}>
                              {asset.riskScore}
                            </p>
                            <Progress value={asset.riskScore} className="w-12 h-1.5" />
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Connections</p>
                          <p className="text-sm font-medium">{asset.connections}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
