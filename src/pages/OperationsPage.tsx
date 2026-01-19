import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/ui/MetricCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  AlertTriangle,
  Clock,
  Activity,
  Zap,
  Filter,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Alert {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  source: string;
  time: string;
  status: "new" | "investigating" | "resolved";
}

const alerts: Alert[] = [
  {
    id: "ALT-001",
    title: "Brute force attack detected on SSH service",
    severity: "critical",
    source: "Firewall",
    time: "2 mins ago",
    status: "new",
  },
  {
    id: "ALT-002",
    title: "Unusual outbound traffic pattern detected",
    severity: "high",
    source: "Network Monitor",
    time: "8 mins ago",
    status: "investigating",
  },
  {
    id: "ALT-003",
    title: "Failed login attempts from multiple IPs",
    severity: "high",
    source: "IAM System",
    time: "15 mins ago",
    status: "new",
  },
  {
    id: "ALT-004",
    title: "Suspicious DNS query to known C2 domain",
    severity: "critical",
    source: "DNS Logs",
    time: "22 mins ago",
    status: "investigating",
  },
  {
    id: "ALT-005",
    title: "Endpoint antivirus signature outdated",
    severity: "medium",
    source: "Endpoint Protection",
    time: "45 mins ago",
    status: "new",
  },
  {
    id: "ALT-006",
    title: "Privilege escalation attempt blocked",
    severity: "high",
    source: "SIEM",
    time: "1 hour ago",
    status: "resolved",
  },
];

export default function OperationsPage() {
  return (
    <DashboardLayout
      title="SOC Operations"
      subtitle="Real-time security monitoring and incident response"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Active Alerts"
            value={24}
            subtitle="6 require immediate action"
            icon={AlertTriangle}
            status="critical"
          />
          <MetricCard
            title="Avg Response Time"
            value="3.2m"
            subtitle="Target: < 5m"
            icon={Clock}
            status="success"
            trend={{ value: 18, isPositive: true }}
          />
          <MetricCard
            title="Threats Blocked"
            value={847}
            subtitle="Last 24 hours"
            icon={Zap}
            status="success"
          />
          <MetricCard
            title="System Health"
            value="98.5%"
            subtitle="All systems operational"
            icon={Activity}
            status="success"
          />
        </div>

        {/* Alerts Section */}
        <div className="metric-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Live Alerts Feed
              </h3>
              <p className="text-sm text-muted-foreground">
                Real-time security alerts from all sources
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="ghost" size="sm">
                <RefreshCw className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
                <div className="w-2 h-2 rounded-full bg-success pulse-live" />
                <span className="text-xs font-medium text-success">
                  Live Updates
                </span>
              </div>
            </div>
          </div>

          {/* Alerts Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Alert ID
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Description
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Source
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Time
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert, index) => (
                  <tr
                    key={alert.id}
                    className="border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm text-muted-foreground">
                        {alert.id}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-foreground">
                        {alert.title}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={alert.severity} />
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-muted-foreground">
                        {alert.source}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-muted-foreground">
                        {alert.time}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          alert.status === "new"
                            ? "bg-info/10 text-info"
                            : alert.status === "investigating"
                            ? "bg-warning/10 text-warning"
                            : "bg-success/10 text-success"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            alert.status === "new"
                              ? "bg-info animate-pulse"
                              : alert.status === "investigating"
                              ? "bg-warning animate-pulse"
                              : "bg-success"
                          }`}
                        />
                        {alert.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
