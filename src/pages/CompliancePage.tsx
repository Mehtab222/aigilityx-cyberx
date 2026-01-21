import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/ui/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  RefreshCw,
  ChevronRight,
  Calendar,
  Clock,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Framework {
  id: string;
  name: string;
  description: string;
  totalControls: number;
  compliant: number;
  partial: number;
  nonCompliant: number;
  lastAssessed: string;
  nextReview: string;
}

interface Control {
  id: string;
  controlId: string;
  title: string;
  framework: string;
  status: "compliant" | "partial" | "non-compliant";
  owner: string;
  lastTested: string;
  evidence: number;
}

const frameworks: Framework[] = [
  {
    id: "1",
    name: "ISO 27001:2022",
    description: "Information Security Management System",
    totalControls: 93,
    compliant: 78,
    partial: 12,
    nonCompliant: 3,
    lastAssessed: "2024-01-15",
    nextReview: "2024-04-15",
  },
  {
    id: "2",
    name: "NIST CSF 2.0",
    description: "Cybersecurity Framework",
    totalControls: 108,
    compliant: 89,
    partial: 15,
    nonCompliant: 4,
    lastAssessed: "2024-01-10",
    nextReview: "2024-04-10",
  },
  {
    id: "3",
    name: "SOC 2 Type II",
    description: "Service Organization Control",
    totalControls: 64,
    compliant: 58,
    partial: 5,
    nonCompliant: 1,
    lastAssessed: "2024-01-08",
    nextReview: "2024-07-08",
  },
  {
    id: "4",
    name: "GDPR",
    description: "General Data Protection Regulation",
    totalControls: 42,
    compliant: 38,
    partial: 3,
    nonCompliant: 1,
    lastAssessed: "2024-01-05",
    nextReview: "2024-03-05",
  },
  {
    id: "5",
    name: "PCI DSS 4.0",
    description: "Payment Card Industry Data Security Standard",
    totalControls: 78,
    compliant: 70,
    partial: 6,
    nonCompliant: 2,
    lastAssessed: "2024-01-12",
    nextReview: "2024-04-12",
  },
];

const controlGaps: Control[] = [
  {
    id: "1",
    controlId: "A.8.24",
    title: "Use of Cryptography",
    framework: "ISO 27001",
    status: "non-compliant",
    owner: "Security Team",
    lastTested: "2024-01-10",
    evidence: 2,
  },
  {
    id: "2",
    controlId: "PR.DS-1",
    title: "Data-at-rest Protection",
    framework: "NIST CSF",
    status: "partial",
    owner: "Infrastructure",
    lastTested: "2024-01-12",
    evidence: 5,
  },
  {
    id: "3",
    controlId: "CC6.1",
    title: "Logical Access Controls",
    framework: "SOC 2",
    status: "partial",
    owner: "IAM Team",
    lastTested: "2024-01-08",
    evidence: 8,
  },
  {
    id: "4",
    controlId: "Art.32",
    title: "Security of Processing",
    framework: "GDPR",
    status: "non-compliant",
    owner: "Privacy Team",
    lastTested: "2024-01-05",
    evidence: 3,
  },
  {
    id: "5",
    controlId: "Req.3.4",
    title: "Render PAN Unreadable",
    framework: "PCI DSS",
    status: "partial",
    owner: "Development",
    lastTested: "2024-01-14",
    evidence: 4,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "compliant":
      return "bg-success/10 text-success border-success/20";
    case "partial":
      return "bg-warning/10 text-warning border-warning/20";
    case "non-compliant":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function CompliancePage() {
  const totalControls = frameworks.reduce((sum, f) => sum + f.totalControls, 0);
  const totalCompliant = frameworks.reduce((sum, f) => sum + f.compliant, 0);
  const overallCompliance = Math.round((totalCompliant / totalControls) * 100);

  return (
    <DashboardLayout
      title="Compliance Center"
      subtitle="Framework compliance monitoring and control management"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Overall Compliance"
            value={`${overallCompliance}%`}
            subtitle="Across all frameworks"
            icon={FileCheck}
            status="success"
            trend={{ value: 3, isPositive: true }}
          />
          <MetricCard
            title="Active Frameworks"
            value={frameworks.length}
            subtitle="Currently monitored"
            icon={FileCheck}
            status="success"
          />
          <MetricCard
            title="Control Gaps"
            value={controlGaps.filter((c) => c.status === "non-compliant").length}
            subtitle="Require immediate action"
            icon={AlertTriangle}
            status="critical"
          />
          <MetricCard
            title="Upcoming Audits"
            value={3}
            subtitle="Next 90 days"
            icon={Calendar}
            status="medium"
          />
        </div>

        <Tabs defaultValue="frameworks" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
              <TabsTrigger value="gaps">Control Gaps</TabsTrigger>
              <TabsTrigger value="assessments">Assessments</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync
              </Button>
            </div>
          </div>

          <TabsContent value="frameworks" className="space-y-4">
            <div className="grid gap-4">
              {frameworks.map((framework) => {
                const compliancePercent = Math.round(
                  (framework.compliant / framework.totalControls) * 100
                );
                return (
                  <Card key={framework.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg">{framework.name}</h3>
                            <Badge variant="outline" className={compliancePercent >= 90 ? "border-success text-success" : compliancePercent >= 70 ? "border-warning text-warning" : "border-destructive text-destructive"}>
                              {compliancePercent}% Compliant
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{framework.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Total Controls</p>
                          <p className="text-lg font-semibold">{framework.totalControls}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success" />
                          <div>
                            <p className="text-xs text-muted-foreground">Compliant</p>
                            <p className="text-lg font-semibold text-success">{framework.compliant}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-warning" />
                          <div>
                            <p className="text-xs text-muted-foreground">Partial</p>
                            <p className="text-lg font-semibold text-warning">{framework.partial}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-destructive" />
                          <div>
                            <p className="text-xs text-muted-foreground">Non-Compliant</p>
                            <p className="text-lg font-semibold text-destructive">{framework.nonCompliant}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Progress value={compliancePercent} className="h-2" />
                      </div>

                      <div className="mt-4 flex items-center gap-6 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Last assessed: {framework.lastAssessed}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Next review: {framework.nextReview}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="gaps" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Control Gaps Requiring Attention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Control ID</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Title</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Framework</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Status</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Owner</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Evidence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {controlGaps.map((control) => (
                        <tr key={control.id} className="border-b border-border/50 hover:bg-muted/30 cursor-pointer">
                          <td className="py-4 px-4 font-mono text-sm">{control.controlId}</td>
                          <td className="py-4 px-4 text-sm">{control.title}</td>
                          <td className="py-4 px-4">
                            <Badge variant="outline">{control.framework}</Badge>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(control.status)}`}>
                              {control.status.replace("-", " ")}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-muted-foreground">{control.owner}</td>
                          <td className="py-4 px-4 text-sm">{control.evidence} items</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assessments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Assessments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "ISO 27001 Surveillance Audit", date: "2024-02-15", type: "External", status: "Scheduled" },
                    { name: "SOC 2 Type II Annual Audit", date: "2024-03-01", type: "External", status: "Preparing" },
                    { name: "GDPR Readiness Assessment", date: "2024-02-28", type: "Internal", status: "In Progress" },
                    { name: "PCI DSS Quarterly Scan", date: "2024-01-31", type: "Automated", status: "Scheduled" },
                  ].map((assessment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                      <div>
                        <p className="font-medium">{assessment.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {assessment.date} • {assessment.type}
                        </p>
                      </div>
                      <Badge variant="outline">{assessment.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
