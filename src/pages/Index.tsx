import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RiskPostureCard } from "@/components/dashboard/RiskPostureCard";
import { ComplianceOverview } from "@/components/dashboard/ComplianceOverview";
import { RecentIncidents } from "@/components/dashboard/RecentIncidents";
import { ThreatTrendChart } from "@/components/dashboard/ThreatTrendChart";
import { AgentStatusPanel } from "@/components/dashboard/AgentStatusPanel";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ConversXCore } from "@/components/dashboard/ConversXCore";
import { MetricCard } from "@/components/ui/MetricCard";
import {
  AlertTriangle,
  Shield,
  Clock,
  FileCheck,
} from "lucide-react";

const Index = () => {
  return (
    <DashboardLayout
      title="CISO Dashboard"
      subtitle="Welcome back, John. Here's your security overview."
    >
      <div className="space-y-6 animate-fade-in">
        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Active Incidents"
            value={12}
            subtitle="3 critical, 5 high"
            icon={AlertTriangle}
            status="high"
            trend={{ value: 15, isPositive: false }}
          />
          <MetricCard
            title="Mean Time to Resolve"
            value="4.2h"
            subtitle="Target: < 6h"
            icon={Clock}
            status="success"
            trend={{ value: 23, isPositive: true }}
          />
          <MetricCard
            title="Controls Monitored"
            value={161}
            subtitle="89% compliant"
            icon={FileCheck}
            status="success"
          />
          <MetricCard
            title="Security Score"
            value={78}
            subtitle="Industry avg: 65"
            icon={Shield}
            status="success"
            trend={{ value: 8, isPositive: true }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Risk Posture & Trends */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RiskPostureCard
                score={78}
                trend={5}
                label="Overall Risk Posture"
              />
              <QuickActions />
            </div>
            <ThreatTrendChart />
            <RecentIncidents />
          </div>

          {/* Right Column - Compliance & Agents */}
          <div className="space-y-6">
            <ComplianceOverview />
            <AgentStatusPanel />
          </div>
        </div>

        {/* ConversX Core Section */}
        <ConversXCore />
      </div>
    </DashboardLayout>
  );
};

export default Index;
