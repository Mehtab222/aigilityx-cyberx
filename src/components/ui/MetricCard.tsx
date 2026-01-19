import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  status?: "critical" | "high" | "medium" | "low" | "success" | "warning" | "active";
  className?: string;
  children?: React.ReactNode;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  status,
  className,
  children,
}: MetricCardProps) {
  return (
    <div className={cn("metric-card group", className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold font-mono-data tracking-tight">
              {value}
            </span>
            {trend && (
              <span
                className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-success" : "text-destructive"
                )}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              "p-3 rounded-lg transition-colors",
              status === "critical" && "bg-critical/10 text-critical",
              status === "high" && "bg-high/10 text-high",
              status === "medium" && "bg-medium/10 text-medium",
              status === "low" && "bg-low/10 text-low",
              status === "success" && "bg-success/10 text-success",
              status === "warning" && "bg-cyber-warning/10 text-cyber-warning",
              status === "active" && "bg-primary/10 text-primary",
              !status && "bg-primary/10 text-primary"
            )}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
