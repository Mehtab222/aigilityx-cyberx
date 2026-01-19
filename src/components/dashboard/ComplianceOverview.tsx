import { CheckCircle, AlertCircle, XCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface Framework {
  name: string;
  compliant: number;
  partial: number;
  nonCompliant: number;
  total: number;
}

const frameworks: Framework[] = [
  { name: "ISO 27001", compliant: 45, partial: 8, nonCompliant: 2, total: 55 },
  { name: "NIST CSF", compliant: 38, partial: 10, nonCompliant: 2, total: 50 },
  { name: "SOC 2", compliant: 28, partial: 5, nonCompliant: 1, total: 34 },
  { name: "GDPR", compliant: 18, partial: 3, nonCompliant: 1, total: 22 },
];

export function ComplianceOverview() {
  return (
    <div className="metric-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Compliance Status
          </h3>
          <p className="text-sm text-muted-foreground">
            Framework compliance overview
          </p>
        </div>
        <button className="flex items-center gap-1 text-sm text-primary hover:underline">
          View all <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-5">
        {frameworks.map((framework) => {
          const compliancePercent = Math.round(
            (framework.compliant / framework.total) * 100
          );
          const partialPercent = Math.round(
            (framework.partial / framework.total) * 100
          );

          return (
            <div key={framework.name} className="group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  {framework.name}
                </span>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-success">
                    <CheckCircle className="w-3 h-3" />
                    {framework.compliant}
                  </span>
                  <span className="flex items-center gap-1 text-warning">
                    <AlertCircle className="w-3 h-3" />
                    {framework.partial}
                  </span>
                  <span className="flex items-center gap-1 text-destructive">
                    <XCircle className="w-3 h-3" />
                    {framework.nonCompliant}
                  </span>
                </div>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-success rounded-full transition-all duration-500"
                  style={{ width: `${compliancePercent}%` }}
                />
                <div
                  className="absolute top-0 h-full bg-warning rounded-full transition-all duration-500"
                  style={{
                    left: `${compliancePercent}%`,
                    width: `${partialPercent}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="text-xs text-muted-foreground">Compliant</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-warning" />
          <span className="text-xs text-muted-foreground">Partial</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <span className="text-xs text-muted-foreground">Non-Compliant</span>
        </div>
      </div>
    </div>
  );
}
