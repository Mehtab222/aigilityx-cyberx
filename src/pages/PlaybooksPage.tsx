import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/ui/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Play,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Zap,
  Users,
  ArrowRight,
  History,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

interface Playbook {
  id: string;
  title: string;
  category: string;
  description: string;
  steps: number;
  automationLevel: number;
  avgCompletionTime: string;
  lastExecuted: string;
  executionCount: number;
  status: "active" | "draft" | "deprecated";
  severity: "critical" | "high" | "medium" | "low";
}

interface ExecutionLog {
  id: string;
  playbookName: string;
  triggeredBy: string;
  startTime: string;
  duration: string;
  status: "completed" | "in-progress" | "failed";
  incidentId: string;
}

const playbooks: Playbook[] = [
  {
    id: "PB-001",
    title: "Ransomware Incident Response",
    category: "Malware",
    description: "Step-by-step response for ransomware attacks including containment, eradication, and recovery",
    steps: 24,
    automationLevel: 65,
    avgCompletionTime: "4.5h",
    lastExecuted: "2024-01-12",
    executionCount: 8,
    status: "active",
    severity: "critical",
  },
  {
    id: "PB-002",
    title: "Phishing Email Response",
    category: "Social Engineering",
    description: "Procedures for handling reported phishing emails and potential compromises",
    steps: 12,
    automationLevel: 80,
    avgCompletionTime: "45m",
    lastExecuted: "2024-01-15",
    executionCount: 156,
    status: "active",
    severity: "high",
  },
  {
    id: "PB-003",
    title: "DDoS Attack Mitigation",
    category: "Network",
    description: "Response procedures for distributed denial of service attacks",
    steps: 18,
    automationLevel: 75,
    avgCompletionTime: "2h",
    lastExecuted: "2024-01-08",
    executionCount: 12,
    status: "active",
    severity: "critical",
  },
  {
    id: "PB-004",
    title: "Insider Threat Investigation",
    category: "Insider Threat",
    description: "Investigation procedures for suspected insider threat activities",
    steps: 32,
    automationLevel: 35,
    avgCompletionTime: "8h",
    lastExecuted: "2023-12-20",
    executionCount: 4,
    status: "active",
    severity: "high",
  },
  {
    id: "PB-005",
    title: "Data Breach Response",
    category: "Data Protection",
    description: "Comprehensive response for data breach incidents including notification procedures",
    steps: 28,
    automationLevel: 45,
    avgCompletionTime: "12h",
    lastExecuted: "2023-11-15",
    executionCount: 2,
    status: "active",
    severity: "critical",
  },
  {
    id: "PB-006",
    title: "Account Compromise Response",
    category: "Identity",
    description: "Response procedures for compromised user accounts",
    steps: 14,
    automationLevel: 85,
    avgCompletionTime: "30m",
    lastExecuted: "2024-01-14",
    executionCount: 89,
    status: "active",
    severity: "medium",
  },
];

const executionLogs: ExecutionLog[] = [
  {
    id: "1",
    playbookName: "Phishing Email Response",
    triggeredBy: "SOC Analyst",
    startTime: "2024-01-15 14:32",
    duration: "38m",
    status: "completed",
    incidentId: "INC-2024-0042",
  },
  {
    id: "2",
    playbookName: "Account Compromise Response",
    triggeredBy: "Automated",
    startTime: "2024-01-15 12:15",
    duration: "25m",
    status: "completed",
    incidentId: "INC-2024-0041",
  },
  {
    id: "3",
    playbookName: "DDoS Attack Mitigation",
    triggeredBy: "SOC Manager",
    startTime: "2024-01-15 10:45",
    duration: "In progress",
    status: "in-progress",
    incidentId: "INC-2024-0040",
  },
  {
    id: "4",
    playbookName: "Phishing Email Response",
    triggeredBy: "Automated",
    startTime: "2024-01-14 16:22",
    duration: "42m",
    status: "completed",
    incidentId: "INC-2024-0039",
  },
  {
    id: "5",
    playbookName: "Ransomware Incident Response",
    triggeredBy: "CISO",
    startTime: "2024-01-12 08:15",
    duration: "5.2h",
    status: "completed",
    incidentId: "INC-2024-0035",
  },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "high":
      return "bg-warning/10 text-warning border-warning/20";
    case "medium":
      return "bg-info/10 text-info border-info/20";
    default:
      return "bg-success/10 text-success border-success/20";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-success/10 text-success";
    case "in-progress":
      return "bg-info/10 text-info animate-pulse";
    case "failed":
      return "bg-destructive/10 text-destructive";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function PlaybooksPage() {
  const avgAutomation = Math.round(
    playbooks.reduce((sum, p) => sum + p.automationLevel, 0) / playbooks.length
  );

  return (
    <DashboardLayout
      title="Incident Playbooks"
      subtitle="Automated response procedures and runbooks"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Active Playbooks"
            value={playbooks.filter((p) => p.status === "active").length}
            subtitle="Ready for execution"
            icon={BookOpen}
            status="success"
          />
          <MetricCard
            title="Avg. Automation"
            value={`${avgAutomation}%`}
            subtitle="Automated steps"
            icon={Zap}
            status="success"
            trend={{ value: 8, isPositive: true }}
          />
          <MetricCard
            title="Executions This Month"
            value={executionLogs.length}
            subtitle="Across all playbooks"
            icon={Play}
            status="medium"
          />
          <MetricCard
            title="Avg. Resolution Time"
            value="1.8h"
            subtitle="Target: < 2h"
            icon={Clock}
            status="success"
            trend={{ value: 15, isPositive: true }}
          />
        </div>

        <Tabs defaultValue="playbooks" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="playbooks">All Playbooks</TabsTrigger>
              <TabsTrigger value="executions">Execution History</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search playbooks..." className="pl-9 w-64" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button size="sm" className="bg-primary">
                <Plus className="w-4 h-4 mr-2" />
                New Playbook
              </Button>
            </div>
          </div>

          <TabsContent value="playbooks" className="space-y-4">
            <div className="grid gap-4">
              {playbooks.map((playbook) => (
                <Card key={playbook.id} className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{playbook.title}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(playbook.severity)}`}>
                            {playbook.severity}
                          </span>
                          <Badge variant="outline">{playbook.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{playbook.description}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Play className="w-4 h-4 mr-2" />
                        Execute
                      </Button>
                    </div>

                    <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">Steps</p>
                        <p className="text-sm font-medium">{playbook.steps}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Automation</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{playbook.automationLevel}%</p>
                          <Progress value={playbook.automationLevel} className="w-12 h-1.5" />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Avg. Time</p>
                        <p className="text-sm font-medium">{playbook.avgCompletionTime}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Executions</p>
                        <p className="text-sm font-medium">{playbook.executionCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Last Run</p>
                        <p className="text-sm font-medium">{playbook.lastExecuted}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="executions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Recent Executions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Incident</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Playbook</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Triggered By</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Start Time</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Duration</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Status</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {executionLogs.map((log) => (
                        <tr key={log.id} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="py-4 px-4 font-mono text-sm text-primary">{log.incidentId}</td>
                          <td className="py-4 px-4 text-sm font-medium">{log.playbookName}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              {log.triggeredBy === "Automated" ? (
                                <Zap className="w-4 h-4 text-primary" />
                              ) : (
                                <Users className="w-4 h-4 text-muted-foreground" />
                              )}
                              <span className="text-sm">{log.triggeredBy}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-muted-foreground">{log.startTime}</td>
                          <td className="py-4 px-4 text-sm font-medium">{log.duration}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                              {log.status.replace("-", " ")}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <Button variant="ghost" size="sm">
                              View Details
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Playbook Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {playbooks.slice(0, 5).map((playbook) => (
                      <div key={playbook.id} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="truncate max-w-xs">{playbook.title}</span>
                          <span className="text-muted-foreground">{playbook.executionCount} runs</span>
                        </div>
                        <Progress value={(playbook.executionCount / 200) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Automation Levels by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { category: "Social Engineering", automation: 80 },
                      { category: "Identity", automation: 85 },
                      { category: "Network", automation: 75 },
                      { category: "Malware", automation: 65 },
                      { category: "Data Protection", automation: 45 },
                    ].map((item) => (
                      <div key={item.category} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <span className="font-medium">{item.category}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={item.automation} className="w-24 h-2" />
                          <span className="text-sm text-muted-foreground w-12">{item.automation}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
