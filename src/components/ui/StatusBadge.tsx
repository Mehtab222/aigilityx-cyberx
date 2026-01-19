import { cn } from "@/lib/utils";

type StatusType = "critical" | "high" | "medium" | "low" | "success" | "info" | "warning";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  showDot?: boolean;
  className?: string;
}

const statusLabels: Record<StatusType, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
  success: "Compliant",
  info: "Info",
  warning: "Warning",
};

export function StatusBadge({
  status,
  label,
  showDot = true,
  className,
}: StatusBadgeProps) {
  return (
    <span className={cn("status-badge", status, className)}>
      {showDot && <span className={cn("status-dot", status)} />}
      {label || statusLabels[status]}
    </span>
  );
}
