import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/ui/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  Shield,
  TrendingUp,
  TrendingDown,
  Target,
  Download,
  Plus,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Risk {
  id: string;
  title: string;
  category: string;
  inherentRisk: number;
  residualRisk: number;
  likelihood: "low" | "medium" | "high" | "critical";
  impact: "low" | "medium" | "high" | "critical";
  owner: string;
  status: "open" | "mitigating" | "accepted" | "closed";
  trend: "increasing" | "decreasing" | "stable";
  lastReviewed: string;
}

interface RiskCategory {
  name: string;
  count: number;
  criticalCount: number;
  color: string;
}

const risks: Risk[] = [
  {
    id: "RISK-001",
    title: "Third-party vendor data breach exposure",
    category: "Third Party",
    inherentRisk: 85,
    residualRisk: 45,
    likelihood: "high",
    impact: "critical",
    owner: "Vendor Management",
    status: "mitigating",
    trend: "decreasing",
    lastReviewed: "2024-01-15",
  },
  {
    id: "RISK-002",
    title: "Ransomware attack on critical systems",
    category: "Cyber Threat",
    inherentRisk: 95,
    residualRisk: 35,
    likelihood: "medium",
    impact: "critical",
    owner: "Security Operations",
    status: "mitigating",
    trend: "stable",
    lastReviewed: "2024-01-14",
  },
  {
    id: "RISK-003",
    title: "Insider threat - privileged access abuse",
    category: "Insider Threat",
    inherentRisk: 75,
    residualRisk: 40,
    likelihood: "medium",
    impact: "high",
    owner: "IAM Team",
    status: "open",
    trend: "increasing",
    lastReviewed: "2024-01-12",
  },
  {
    id: "RISK-004",
    title: "Cloud misconfiguration data exposure",
    category: "Cloud Security",
    inherentRisk: 80,
    residualRisk: 30,
    likelihood: "high",
    impact: "high",
    owner: "Cloud Team",
    status: "mitigating",
    trend: "decreasing",
    lastReviewed: "2024-01-10",
  },
  {
    id: "RISK-005",
    title: "Regulatory non-compliance penalties",
    category: "Compliance",
    inherentRisk: 70,
    residualRisk: 25,
    likelihood: "low",
    impact: "high",
    owner: "Compliance Team",
    status: "mitigating",
    trend: "decreasing",
    lastReviewed: "2024-01-08",
  },
  {
    id: "RISK-006",
    title: "Business email compromise (BEC)",
    category: "Cyber Threat",
    inherentRisk: 65,
    residualRisk: 45,
    likelihood: "high",
    impact: "medium",
    owner: "Security Awareness",
    status: "open",
    trend: "increasing",
    lastReviewed: "2024-01-05",
  },
];

const riskCategories: RiskCategory[] = [
  { name: "Cyber Threat", count: 12, criticalCount: 3, color: "bg-destructive" },
  { name: "Third Party", count: 8, criticalCount: 2, color: "bg-warning" },
  { name: "Compliance", count: 6, criticalCount: 1, color: "bg-info" },
  { name: "Operational", count: 5, criticalCount: 0, color: "bg-success" },
  { name: "Cloud Security", count: 7, criticalCount: 2, color: "bg-primary" },
];

const getRiskColor = (score: number) => {
  if (score >= 75) return "text-destructive";
  if (score >= 50) return "text-warning";
  if (score >= 25) return "text-info";
  return "text-success";
};

const getLikelihoodImpactColor = (level: string) => {
  switch (level) {
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
    case "open":
      return "bg-destructive/10 text-destructive";
    case "mitigating":
      return "bg-warning/10 text-warning";
    case "accepted":
      return "bg-info/10 text-info";
    case "closed":
      return "bg-success/10 text-success";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function RisksPage() {
  const criticalRisks = risks.filter((r) => r.residualRisk >= 50).length;
  const avgResidualRisk = Math.round(
    risks.reduce((sum, r) => sum + r.residualRisk, 0) / risks.length
  );

  return (
    <DashboardLayout
      title="Risk Management"
      subtitle="Enterprise risk register and assessment dashboard"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Risks"
            value={risks.length}
            subtitle="Active risk items"
            icon={AlertTriangle}
            status="medium"
          />
          <MetricCard
            title="Critical Risks"
            value={criticalRisks}
            subtitle="Require immediate attention"
            icon={Target}
            status="critical"
          />
          <MetricCard
            title="Avg. Residual Risk"
            value={`${avgResidualRisk}%`}
            subtitle="After controls"
            icon={Shield}
            status={avgResidualRisk < 40 ? "success" : "high"}
            trend={{ value: 8, isPositive: true }}
          />
          <MetricCard
            title="Risk Reduction"
            value="42%"
            subtitle="YTD improvement"
            icon={TrendingDown}
            status="success"
            trend={{ value: 12, isPositive: true }}
          />
        </div>

        <Tabs defaultValue="register" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="register">Risk Register</TabsTrigger>
              <TabsTrigger value="heatmap">Heat Map</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm" className="bg-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Risk
              </Button>
            </div>
          </div>

          <TabsContent value="register" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Risk ID</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Description</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Category</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Inherent</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Residual</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Likelihood</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Impact</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Status</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {risks.map((risk) => (
                        <tr key={risk.id} className="border-b border-border/50 hover:bg-muted/30 cursor-pointer">
                          <td className="py-4 px-4 font-mono text-sm text-primary">{risk.id}</td>
                          <td className="py-4 px-4">
                            <div className="max-w-xs">
                              <p className="text-sm font-medium truncate">{risk.title}</p>
                              <p className="text-xs text-muted-foreground">{risk.owner}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant="outline">{risk.category}</Badge>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`font-semibold ${getRiskColor(risk.inherentRisk)}`}>
                              {risk.inherentRisk}%
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`font-semibold ${getRiskColor(risk.residualRisk)}`}>
                              {risk.residualRisk}%
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded text-xs ${getLikelihoodImpactColor(risk.likelihood)}`}>
                              {risk.likelihood}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded text-xs ${getLikelihoodImpactColor(risk.impact)}`}>
                              {risk.impact}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(risk.status)}`}>
                              {risk.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            {risk.trend === "increasing" && (
                              <ArrowUpRight className="w-4 h-4 text-destructive" />
                            )}
                            {risk.trend === "decreasing" && (
                              <ArrowDownRight className="w-4 h-4 text-success" />
                            )}
                            {risk.trend === "stable" && (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="heatmap" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Risk Heat Map</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-1">
                  {/* Header row */}
                  <div className="col-span-5 grid grid-cols-6 gap-1 mb-2">
                    <div className="text-xs text-muted-foreground text-center">Impact →</div>
                    <div className="text-xs text-muted-foreground text-center">Negligible</div>
                    <div className="text-xs text-muted-foreground text-center">Minor</div>
                    <div className="text-xs text-muted-foreground text-center">Moderate</div>
                    <div className="text-xs text-muted-foreground text-center">Major</div>
                    <div className="text-xs text-muted-foreground text-center">Severe</div>
                  </div>
                  {/* Heat map grid */}
                  {["Almost Certain", "Likely", "Possible", "Unlikely", "Rare"].map((likelihood, li) => (
                    <div key={likelihood} className="col-span-5 grid grid-cols-6 gap-1">
                      <div className="text-xs text-muted-foreground flex items-center">{likelihood}</div>
                      {[1, 2, 3, 4, 5].map((impact) => {
                        const score = (5 - li) * impact;
                        const riskCount = Math.floor(Math.random() * 4);
                        return (
                          <div
                            key={impact}
                            className={`h-16 rounded flex items-center justify-center text-sm font-medium ${
                              score >= 20
                                ? "bg-destructive/80 text-destructive-foreground"
                                : score >= 12
                                ? "bg-warning/80 text-warning-foreground"
                                : score >= 6
                                ? "bg-info/80 text-info-foreground"
                                : "bg-success/80 text-success-foreground"
                            }`}
                          >
                            {riskCount > 0 && riskCount}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {riskCategories.map((category) => (
                <Card key={category.name} className="hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${category.color}`} />
                        <h3 className="font-semibold">{category.name}</h3>
                      </div>
                      <Badge variant="outline">{category.count} risks</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Critical Risks</span>
                        <span className="font-medium text-destructive">{category.criticalCount}</span>
                      </div>
                      <Progress value={(category.criticalCount / category.count) * 100} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
