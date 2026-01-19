import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/MetricCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Eye,
  FileCheck,
  AlertTriangle,
  Activity,
  Clock,
  Target,
  TrendingUp,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";

const vcisotasks = [
  { task: "Review Q4 Security Strategy", priority: "high", due: "Today", status: "pending" },
  { task: "Approve Incident Response Plan", priority: "medium", due: "Tomorrow", status: "pending" },
  { task: "Board Security Presentation", priority: "high", due: "3 days", status: "in-progress" },
];

const vsocAlerts = [
  { alert: "Suspicious login activity detected", severity: "high", time: "5 min ago", source: "Auth Monitor" },
  { alert: "Malware signature detected", severity: "critical", time: "15 min ago", source: "Endpoint Agent" },
  { alert: "DDoS attempt blocked", severity: "medium", time: "1 hour ago", source: "WAF" },
  { alert: "Certificate expiry warning", severity: "low", time: "2 hours ago", source: "SSL Monitor" },
];

const auditFindings = [
  { finding: "Missing MFA on 12 admin accounts", category: "Access Control", risk: "high", status: "open" },
  { finding: "Outdated encryption protocols", category: "Data Protection", risk: "medium", status: "remediation" },
  { finding: "Incomplete asset inventory", category: "Asset Management", risk: "medium", status: "open" },
  { finding: "Logging gaps in cloud infrastructure", category: "Monitoring", risk: "high", status: "review" },
];

const UsersDashboard = () => {
  return (
    <DashboardLayout
      title="Users Dashboard"
      subtitle="Role-based views for V-CISO, V-SOC, and V-Auditor"
    >
      <div className="space-y-6 animate-fade-in">
        <Tabs defaultValue="vciso" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-muted/50">
            <TabsTrigger value="vciso" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              V-CISO
            </TabsTrigger>
            <TabsTrigger value="vsoc" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              V-SOC
            </TabsTrigger>
            <TabsTrigger value="vauditor" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              V-Auditor
            </TabsTrigger>
          </TabsList>

          {/* V-CISO View */}
          <TabsContent value="vciso" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Risk Score"
                value={72}
                subtitle="Moderate risk level"
                icon={Target}
                status="warning"
                trend={{ value: 5, isPositive: true }}
              />
              <MetricCard
                title="Compliance Rate"
                value="89%"
                subtitle="Across all frameworks"
                icon={FileCheck}
                status="success"
              />
              <MetricCard
                title="Open Incidents"
                value={7}
                subtitle="2 critical pending"
                icon={AlertTriangle}
                status="high"
              />
              <MetricCard
                title="Security Budget"
                value="$2.4M"
                subtitle="68% utilized"
                icon={TrendingUp}
                status="success"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="cyber-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    Strategic Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {vcisotasks.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            item.priority === "high"
                              ? "bg-cyber-error"
                              : "bg-cyber-warning"
                          }`}
                        />
                        <div>
                          <p className="text-sm font-medium">{item.task}</p>
                          <p className="text-xs text-muted-foreground">Due: {item.due}</p>
                        </div>
                      </div>
                      <StatusBadge
                        status={item.status === "in-progress" ? "active" : "pending"}
                        label={item.status}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="cyber-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    Executive Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-cyber-success/10 border border-cyber-success/20">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-cyber-success" />
                        <span className="text-xs text-muted-foreground">Strengths</span>
                      </div>
                      <p className="text-2xl font-bold text-cyber-success">18</p>
                      <p className="text-xs text-muted-foreground">Controls exceeding</p>
                    </div>
                    <div className="p-4 rounded-lg bg-cyber-error/10 border border-cyber-error/20">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="w-4 h-4 text-cyber-error" />
                        <span className="text-xs text-muted-foreground">Gaps</span>
                      </div>
                      <p className="text-2xl font-bold text-cyber-error">6</p>
                      <p className="text-xs text-muted-foreground">Require attention</p>
                    </div>
                  </div>
                  <Button variant="cyber" className="w-full">
                    Generate Board Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* V-SOC View */}
          <TabsContent value="vsoc" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Active Alerts"
                value={23}
                subtitle="8 high severity"
                icon={AlertTriangle}
                status="high"
              />
              <MetricCard
                title="MTTR"
                value="3.2h"
                subtitle="Below target 4h"
                icon={Clock}
                status="success"
                trend={{ value: 18, isPositive: true }}
              />
              <MetricCard
                title="Threats Blocked"
                value="1,847"
                subtitle="Last 24 hours"
                icon={Shield}
                status="success"
              />
              <MetricCard
                title="Coverage"
                value="97%"
                subtitle="Endpoint visibility"
                icon={Eye}
                status="success"
              />
            </div>

            <Card className="cyber-card">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-primary" />
                  Live Alert Feed
                </CardTitle>
                <Button size="sm" variant="cyber">
                  View All Alerts
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {vsocAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      alert.severity === "critical"
                        ? "bg-cyber-error/10 border-cyber-error/30"
                        : alert.severity === "high"
                        ? "bg-cyber-warning/10 border-cyber-warning/30"
                        : "bg-muted/50 border-border"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          alert.severity === "critical"
                            ? "bg-cyber-error animate-pulse"
                            : alert.severity === "high"
                            ? "bg-cyber-warning"
                            : "bg-muted-foreground"
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium">{alert.alert}</p>
                        <p className="text-xs text-muted-foreground">
                          Source: {alert.source}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{alert.time}</span>
                      <StatusBadge
                        status={
                          alert.severity === "critical"
                            ? "critical"
                            : alert.severity === "high"
                            ? "high"
                            : alert.severity === "medium"
                            ? "medium"
                            : "low"
                        }
                        label={alert.severity}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* V-Auditor View */}
          <TabsContent value="vauditor" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Open Findings"
                value={24}
                subtitle="4 critical"
                icon={FileText}
                status="warning"
              />
              <MetricCard
                title="Audit Progress"
                value="67%"
                subtitle="Q4 Assessment"
                icon={Target}
                status="active"
              />
              <MetricCard
                title="Remediated"
                value={18}
                subtitle="This quarter"
                icon={CheckCircle}
                status="success"
                trend={{ value: 25, isPositive: true }}
              />
              <MetricCard
                title="Overdue Items"
                value={3}
                subtitle="Requires escalation"
                icon={Clock}
                status="high"
              />
            </div>

            <Card className="cyber-card">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-primary" />
                  Audit Findings
                </CardTitle>
                <Button size="sm" variant="cyber">
                  Export Report
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {auditFindings.map((finding, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-sm font-medium">{finding.finding}</p>
                        <StatusBadge
                          status={
                            finding.risk === "high"
                              ? "high"
                              : finding.risk === "medium"
                              ? "medium"
                              : "low"
                          }
                          label={finding.risk}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Category: {finding.category}
                      </p>
                    </div>
                    <StatusBadge
                      status={
                        finding.status === "open"
                          ? "pending"
                          : finding.status === "remediation"
                          ? "active"
                          : "success"
                      }
                      label={finding.status}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default UsersDashboard;
