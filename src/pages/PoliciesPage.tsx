import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/ui/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Download,
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  Eye,
  Edit,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

interface Policy {
  id: string;
  title: string;
  category: string;
  version: string;
  status: "active" | "draft" | "under-review" | "expired";
  owner: string;
  lastUpdated: string;
  nextReview: string;
  acknowledgedBy: number;
  totalEmployees: number;
}

interface PolicyCategory {
  name: string;
  count: number;
  activeCount: number;
}

const policies: Policy[] = [
  {
    id: "POL-001",
    title: "Information Security Policy",
    category: "Security",
    version: "3.2",
    status: "active",
    owner: "CISO Office",
    lastUpdated: "2024-01-10",
    nextReview: "2024-07-10",
    acknowledgedBy: 892,
    totalEmployees: 950,
  },
  {
    id: "POL-002",
    title: "Acceptable Use Policy",
    category: "IT Governance",
    version: "2.5",
    status: "active",
    owner: "IT Department",
    lastUpdated: "2023-12-15",
    nextReview: "2024-06-15",
    acknowledgedBy: 945,
    totalEmployees: 950,
  },
  {
    id: "POL-003",
    title: "Data Classification Policy",
    category: "Data Protection",
    version: "1.8",
    status: "under-review",
    owner: "Data Governance",
    lastUpdated: "2023-11-20",
    nextReview: "2024-02-20",
    acknowledgedBy: 756,
    totalEmployees: 950,
  },
  {
    id: "POL-004",
    title: "Incident Response Policy",
    category: "Security",
    version: "4.0",
    status: "active",
    owner: "SOC Team",
    lastUpdated: "2024-01-05",
    nextReview: "2024-07-05",
    acknowledgedBy: 234,
    totalEmployees: 250,
  },
  {
    id: "POL-005",
    title: "Access Control Policy",
    category: "Security",
    version: "2.1",
    status: "draft",
    owner: "IAM Team",
    lastUpdated: "2024-01-12",
    nextReview: "2024-04-12",
    acknowledgedBy: 0,
    totalEmployees: 950,
  },
  {
    id: "POL-006",
    title: "Privacy Policy",
    category: "Data Protection",
    version: "3.0",
    status: "active",
    owner: "Legal & Compliance",
    lastUpdated: "2023-10-01",
    nextReview: "2024-04-01",
    acknowledgedBy: 920,
    totalEmployees: 950,
  },
  {
    id: "POL-007",
    title: "Business Continuity Policy",
    category: "Business Continuity",
    version: "1.5",
    status: "expired",
    owner: "Operations",
    lastUpdated: "2023-01-15",
    nextReview: "2024-01-15",
    acknowledgedBy: 450,
    totalEmployees: 950,
  },
];

const policyCategories: PolicyCategory[] = [
  { name: "Security", count: 8, activeCount: 7 },
  { name: "Data Protection", count: 5, activeCount: 4 },
  { name: "IT Governance", count: 6, activeCount: 5 },
  { name: "Business Continuity", count: 3, activeCount: 2 },
  { name: "HR & Training", count: 4, activeCount: 4 },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-success/10 text-success border-success/20";
    case "draft":
      return "bg-info/10 text-info border-info/20";
    case "under-review":
      return "bg-warning/10 text-warning border-warning/20";
    case "expired":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function PoliciesPage() {
  const activePolicies = policies.filter((p) => p.status === "active").length;
  const avgAcknowledgement = Math.round(
    policies.reduce((sum, p) => sum + (p.acknowledgedBy / p.totalEmployees) * 100, 0) / policies.length
  );

  return (
    <DashboardLayout
      title="Policy Management"
      subtitle="Security policies, standards, and compliance documentation"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Policies"
            value={policies.length}
            subtitle={`${activePolicies} active`}
            icon={FileText}
            status="success"
          />
          <MetricCard
            title="Avg. Acknowledgement"
            value={`${avgAcknowledgement}%`}
            subtitle="Across all policies"
            icon={CheckCircle}
            status={avgAcknowledgement >= 80 ? "success" : "warning"}
          />
          <MetricCard
            title="Pending Review"
            value={policies.filter((p) => p.status === "under-review").length}
            subtitle="Require attention"
            icon={Clock}
            status="medium"
          />
          <MetricCard
            title="Expired Policies"
            value={policies.filter((p) => p.status === "expired").length}
            subtitle="Need renewal"
            icon={AlertTriangle}
            status="critical"
          />
        </div>

        <Tabs defaultValue="policies" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="policies">All Policies</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="acknowledgements">Acknowledgements</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search policies..." className="pl-9 w-64" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button size="sm" className="bg-primary">
                <Plus className="w-4 h-4 mr-2" />
                New Policy
              </Button>
            </div>
          </div>

          <TabsContent value="policies" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Policy ID</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Title</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Category</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Version</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Status</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Owner</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Next Review</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {policies.map((policy) => (
                        <tr key={policy.id} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="py-4 px-4 font-mono text-sm text-primary">{policy.id}</td>
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-medium">{policy.title}</p>
                              <p className="text-xs text-muted-foreground">Updated: {policy.lastUpdated}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant="outline">{policy.category}</Badge>
                          </td>
                          <td className="py-4 px-4 text-sm">v{policy.version}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(policy.status)}`}>
                              {policy.status.replace("-", " ")}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-muted-foreground">{policy.owner}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="w-3 h-3 text-muted-foreground" />
                              {policy.nextReview}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {policyCategories.map((category) => (
                <Card key={category.name} className="hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">{category.name}</h3>
                      <Badge variant="outline">{category.count} policies</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Active Policies</span>
                        <span className="font-medium text-success">{category.activeCount}</span>
                      </div>
                      <Progress value={(category.activeCount / category.count) * 100} className="h-2" />
                    </div>
                    <div className="mt-4 text-xs text-muted-foreground">
                      {category.count - category.activeCount} policies need attention
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="acknowledgements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Policy Acknowledgement Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {policies.filter((p) => p.status === "active").map((policy) => {
                    const percentage = Math.round((policy.acknowledgedBy / policy.totalEmployees) * 100);
                    return (
                      <div key={policy.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{policy.title}</p>
                            <p className="text-xs text-muted-foreground">{policy.owner}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{percentage}%</p>
                            <p className="text-xs text-muted-foreground">
                              {policy.acknowledgedBy} / {policy.totalEmployees}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={percentage} className="flex-1 h-2" />
                          <Users className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
