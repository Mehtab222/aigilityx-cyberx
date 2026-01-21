import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/ui/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Download,
  Calendar,
  FileText,
  PieChart,
  TrendingUp,
  Clock,
  Share2,
  Plus,
  Eye,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Report {
  id: string;
  title: string;
  type: "executive" | "operational" | "compliance" | "incident" | "risk";
  frequency: string;
  lastGenerated: string;
  nextScheduled: string;
  recipients: number;
  status: "ready" | "generating" | "scheduled";
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  dataPoints: number;
  estimatedTime: string;
}

const reports: Report[] = [
  {
    id: "1",
    title: "Executive Security Summary",
    type: "executive",
    frequency: "Weekly",
    lastGenerated: "2024-01-15 09:00",
    nextScheduled: "2024-01-22 09:00",
    recipients: 5,
    status: "ready",
  },
  {
    id: "2",
    title: "SOC Operations Report",
    type: "operational",
    frequency: "Daily",
    lastGenerated: "2024-01-15 06:00",
    nextScheduled: "2024-01-16 06:00",
    recipients: 12,
    status: "ready",
  },
  {
    id: "3",
    title: "Compliance Status Report",
    type: "compliance",
    frequency: "Monthly",
    lastGenerated: "2024-01-01 00:00",
    nextScheduled: "2024-02-01 00:00",
    recipients: 8,
    status: "ready",
  },
  {
    id: "4",
    title: "Incident Response Summary",
    type: "incident",
    frequency: "Weekly",
    lastGenerated: "2024-01-14 18:00",
    nextScheduled: "2024-01-21 18:00",
    recipients: 15,
    status: "generating",
  },
  {
    id: "5",
    title: "Risk Assessment Dashboard",
    type: "risk",
    frequency: "Quarterly",
    lastGenerated: "2024-01-01 00:00",
    nextScheduled: "2024-04-01 00:00",
    recipients: 6,
    status: "ready",
  },
  {
    id: "6",
    title: "Threat Intelligence Briefing",
    type: "operational",
    frequency: "Daily",
    lastGenerated: "2024-01-15 08:00",
    nextScheduled: "2024-01-16 08:00",
    recipients: 20,
    status: "scheduled",
  },
];

const reportTemplates: ReportTemplate[] = [
  {
    id: "1",
    name: "Board Security Report",
    description: "High-level security posture overview for board presentations",
    category: "Executive",
    dataPoints: 15,
    estimatedTime: "5 min",
  },
  {
    id: "2",
    name: "Vulnerability Assessment",
    description: "Detailed vulnerability scan results and remediation tracking",
    category: "Technical",
    dataPoints: 45,
    estimatedTime: "15 min",
  },
  {
    id: "3",
    name: "Audit Trail Export",
    description: "Complete audit log export for compliance requirements",
    category: "Compliance",
    dataPoints: 100,
    estimatedTime: "30 min",
  },
  {
    id: "4",
    name: "Incident Timeline",
    description: "Chronological incident analysis with impact assessment",
    category: "Incident",
    dataPoints: 25,
    estimatedTime: "10 min",
  },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "executive":
      return "bg-primary/10 text-primary border-primary/20";
    case "operational":
      return "bg-info/10 text-info border-info/20";
    case "compliance":
      return "bg-success/10 text-success border-success/20";
    case "incident":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "risk":
      return "bg-warning/10 text-warning border-warning/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "ready":
      return <Badge className="bg-success/10 text-success border-success/20">Ready</Badge>;
    case "generating":
      return <Badge className="bg-warning/10 text-warning border-warning/20 animate-pulse">Generating...</Badge>;
    case "scheduled":
      return <Badge className="bg-info/10 text-info border-info/20">Scheduled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function ReportsPage() {
  return (
    <DashboardLayout
      title="Reports Center"
      subtitle="Security analytics, dashboards, and scheduled reporting"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Active Reports"
            value={reports.length}
            subtitle="Scheduled and ready"
            icon={BarChart3}
            status="success"
          />
          <MetricCard
            title="Generated This Month"
            value={47}
            subtitle="Across all report types"
            icon={FileText}
            status="success"
            trend={{ value: 12, isPositive: true }}
          />
          <MetricCard
            title="Report Recipients"
            value={reports.reduce((sum, r) => sum + r.recipients, 0)}
            subtitle="Unique stakeholders"
            icon={Share2}
            status="medium"
          />
          <MetricCard
            title="Avg. Generation Time"
            value="4.2m"
            subtitle="Target: < 10m"
            icon={Clock}
            status="success"
          />
        </div>

        <Tabs defaultValue="scheduled" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
              <TabsTrigger value="templates">Report Templates</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule
              </Button>
              <Button size="sm" className="bg-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Report
              </Button>
            </div>
          </div>

          <TabsContent value="scheduled" className="space-y-4">
            <div className="grid gap-4">
              {reports.map((report) => (
                <Card key={report.id} className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{report.title}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(report.type)}`}>
                            {report.type}
                          </span>
                          {getStatusBadge(report.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {report.frequency} • {report.recipients} recipients
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">Last Generated</p>
                        <p className="text-sm font-medium">{report.lastGenerated}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Next Scheduled</p>
                        <p className="text-sm font-medium">{report.nextScheduled}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportTemplates.map((template) => (
                <Card key={template.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                      <Badge variant="outline">{template.category}</Badge>
                    </div>
                    <div className="mt-4 flex items-center gap-4 pt-4 border-t border-border text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <PieChart className="w-4 h-4" />
                        {template.dataPoints} data points
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        ~{template.estimatedTime}
                      </div>
                    </div>
                    <Button className="mt-4 w-full" variant="outline">
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Report Generation Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["Executive", "Operational", "Compliance", "Incident", "Risk"].map((type, index) => (
                      <div key={type} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{type}</span>
                          <span className="text-muted-foreground">{[12, 45, 18, 8, 6][index]} reports</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${[15, 55, 22, 10, 8][index]}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Report Consumers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Executive Leadership", reports: 24 },
                      { name: "Security Operations", reports: 52 },
                      { name: "Compliance Team", reports: 18 },
                      { name: "IT Infrastructure", reports: 31 },
                      { name: "Risk Management", reports: 15 },
                    ].map((consumer) => (
                      <div key={consumer.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <span className="font-medium">{consumer.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{consumer.reports} reports</span>
                          <TrendingUp className="w-4 h-4 text-success" />
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
