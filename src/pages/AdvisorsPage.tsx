import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/ui/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Bot,
  Brain,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Shield,
  TrendingUp,
  FileText,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: "security" | "compliance" | "operations" | "risk";
  priority: "critical" | "high" | "medium" | "low";
  impact: string;
  effort: string;
  status: "new" | "in-progress" | "completed" | "dismissed";
  createdAt: string;
}

interface Insight {
  id: string;
  title: string;
  summary: string;
  type: "trend" | "anomaly" | "prediction" | "benchmark";
  confidence: number;
  source: string;
  timestamp: string;
}

const recommendations: Recommendation[] = [
  {
    id: "1",
    title: "Enable MFA for all privileged accounts",
    description: "12 admin accounts lack multi-factor authentication, exposing critical systems to credential-based attacks.",
    category: "security",
    priority: "critical",
    impact: "High",
    effort: "Low",
    status: "new",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Update firewall rules for deprecated services",
    description: "Legacy port configurations detected. 8 rules reference decommissioned services.",
    category: "operations",
    priority: "high",
    impact: "Medium",
    effort: "Medium",
    status: "in-progress",
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    title: "Implement encryption for data at rest",
    description: "3 database instances store sensitive data without encryption, violating GDPR Article 32.",
    category: "compliance",
    priority: "critical",
    impact: "High",
    effort: "High",
    status: "new",
    createdAt: "2024-01-13",
  },
  {
    id: "4",
    title: "Review third-party vendor access permissions",
    description: "5 vendor accounts have excessive permissions beyond contractual requirements.",
    category: "risk",
    priority: "medium",
    impact: "Medium",
    effort: "Low",
    status: "new",
    createdAt: "2024-01-12",
  },
  {
    id: "5",
    title: "Patch critical vulnerabilities in web servers",
    description: "CVE-2024-0001 affects 3 production web servers. Exploit code is publicly available.",
    category: "security",
    priority: "critical",
    impact: "High",
    effort: "Medium",
    status: "in-progress",
    createdAt: "2024-01-11",
  },
];

const insights: Insight[] = [
  {
    id: "1",
    title: "Unusual login pattern detected",
    summary: "Login attempts from new geographic regions increased 340% in the last 7 days.",
    type: "anomaly",
    confidence: 92,
    source: "Identity Analytics",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    title: "Phishing attempts trending upward",
    summary: "Industry-wide phishing campaigns targeting financial services increased 45% this quarter.",
    type: "trend",
    confidence: 87,
    source: "Threat Intelligence",
    timestamp: "4 hours ago",
  },
  {
    id: "3",
    title: "Compliance posture improvement predicted",
    summary: "Based on current remediation velocity, ISO 27001 compliance will reach 95% by Q2.",
    type: "prediction",
    confidence: 78,
    source: "Compliance Engine",
    timestamp: "6 hours ago",
  },
  {
    id: "4",
    title: "Security posture above industry average",
    summary: "Your security score of 78 exceeds the financial services industry average of 65.",
    type: "benchmark",
    confidence: 95,
    source: "Industry Benchmarks",
    timestamp: "1 day ago",
  },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
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

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "security":
      return Shield;
    case "compliance":
      return FileText;
    case "operations":
      return TrendingUp;
    case "risk":
      return AlertTriangle;
    default:
      return Lightbulb;
  }
};

const getInsightTypeIcon = (type: string) => {
  switch (type) {
    case "trend":
      return TrendingUp;
    case "anomaly":
      return AlertTriangle;
    case "prediction":
      return Brain;
    case "benchmark":
      return CheckCircle;
    default:
      return Lightbulb;
  }
};

export default function AdvisorsPage() {
  const criticalCount = recommendations.filter((r) => r.priority === "critical").length;
  const newCount = recommendations.filter((r) => r.status === "new").length;

  return (
    <DashboardLayout
      title="AI Advisors"
      subtitle="Intelligent recommendations and security insights"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Active Recommendations"
            value={recommendations.filter((r) => r.status !== "completed").length}
            subtitle={`${criticalCount} critical priority`}
            icon={Lightbulb}
            status="medium"
          />
          <MetricCard
            title="New This Week"
            value={newCount}
            subtitle="Awaiting review"
            icon={Sparkles}
            status="medium"
          />
          <MetricCard
            title="Insights Generated"
            value={insights.length}
            subtitle="Last 24 hours"
            icon={Brain}
            status="success"
          />
          <MetricCard
            title="Recommendations Implemented"
            value={23}
            subtitle="This month"
            icon={CheckCircle}
            status="success"
            trend={{ value: 15, isPositive: true }}
          />
        </div>

        <Tabs defaultValue="recommendations" className="space-y-6">
          <TabsList>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="chat">Security Advisor</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="space-y-4">
            <div className="grid gap-4">
              {recommendations.map((rec) => {
                const CategoryIcon = getCategoryIcon(rec.category);
                return (
                  <Card key={rec.id} className="hover:border-primary/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${
                          rec.category === "security" ? "bg-destructive/10" :
                          rec.category === "compliance" ? "bg-info/10" :
                          rec.category === "operations" ? "bg-primary/10" : "bg-warning/10"
                        }`}>
                          <CategoryIcon className={`w-5 h-5 ${
                            rec.category === "security" ? "text-destructive" :
                            rec.category === "compliance" ? "text-info" :
                            rec.category === "operations" ? "text-primary" : "text-warning"
                          }`} />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold">{rec.title}</h3>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                              {rec.priority}
                            </span>
                            {rec.status === "in-progress" && (
                              <Badge variant="outline" className="text-info border-info/20">
                                <Clock className="w-3 h-3 mr-1" />
                                In Progress
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{rec.description}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="mt-4 flex items-center gap-6 pt-4 border-t border-border text-sm">
                        <div>
                          <span className="text-muted-foreground">Impact: </span>
                          <span className="font-medium">{rec.impact}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Effort: </span>
                          <span className="font-medium">{rec.effort}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Category: </span>
                          <span className="font-medium capitalize">{rec.category}</span>
                        </div>
                        <div className="ml-auto">
                          <span className="text-muted-foreground">{rec.createdAt}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((insight) => {
                const TypeIcon = getInsightTypeIcon(insight.type);
                return (
                  <Card key={insight.id} className="hover:border-primary/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          insight.type === "anomaly" ? "bg-warning/10" :
                          insight.type === "trend" ? "bg-info/10" :
                          insight.type === "prediction" ? "bg-primary/10" : "bg-success/10"
                        }`}>
                          <TypeIcon className={`w-5 h-5 ${
                            insight.type === "anomaly" ? "text-warning" :
                            insight.type === "trend" ? "text-info" :
                            insight.type === "prediction" ? "text-primary" : "text-success"
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{insight.title}</h3>
                            <Badge variant="outline" className="text-xs capitalize">
                              {insight.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{insight.summary}</p>
                          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Brain className="w-3 h-3" />
                              {insight.confidence}% confidence
                            </div>
                            <div>{insight.source}</div>
                            <div>{insight.timestamp}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="chat" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Bot className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Security Advisor Chat</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Ask questions about your security posture, compliance, or get recommendations
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-muted/20 rounded-lg border border-border flex flex-col">
                  <div className="flex-1 p-4 space-y-4 overflow-auto">
                    {/* Sample conversation */}
                    <div className="flex gap-3">
                      <div className="p-2 rounded-full bg-primary/10 h-fit">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3 max-w-md">
                        <p className="text-sm">
                          Hello! I'm your AI Security Advisor. I can help you understand your security posture, 
                          compliance status, and provide actionable recommendations. What would you like to know?
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Ask about your security posture..."
                        className="flex-1 px-4 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <Button size="sm" className="bg-primary">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Send
                      </Button>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Quick prompts:</span>
                      <Button variant="outline" size="sm" className="text-xs h-7">
                        What are my top risks?
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs h-7">
                        Compliance summary
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs h-7">
                        Recent threats
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
