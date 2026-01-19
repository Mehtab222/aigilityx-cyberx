import { Clock, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";

interface Incident {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "active" | "investigating" | "resolved";
  time: string;
  assignee: string;
}

const incidents: Incident[] = [
  {
    id: "INC-001",
    title: "Suspicious login attempts detected from unknown IP range",
    severity: "critical",
    status: "active",
    time: "5 mins ago",
    assignee: "Sarah Chen",
  },
  {
    id: "INC-002",
    title: "Potential data exfiltration attempt blocked",
    severity: "high",
    status: "investigating",
    time: "23 mins ago",
    assignee: "Mike Johnson",
  },
  {
    id: "INC-003",
    title: "Malware detected in email attachment",
    severity: "high",
    status: "investigating",
    time: "1 hour ago",
    assignee: "Alex Rivera",
  },
  {
    id: "INC-004",
    title: "Unauthorized access attempt on admin portal",
    severity: "medium",
    status: "resolved",
    time: "2 hours ago",
    assignee: "Emily Zhang",
  },
];

export function RecentIncidents() {
  return (
    <div className="metric-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Recent Incidents
          </h3>
          <p className="text-sm text-muted-foreground">
            Active security incidents
          </p>
        </div>
        <button className="flex items-center gap-1 text-sm text-primary hover:underline">
          View all <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {incidents.map((incident, index) => (
          <div
            key={incident.id}
            className={cn(
              "group flex items-start gap-4 p-3 rounded-lg transition-colors hover:bg-muted/50 cursor-pointer",
              index === 0 && "bg-muted/30"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Status Icon */}
            <div
              className={cn(
                "mt-0.5 p-2 rounded-lg shrink-0",
                incident.status === "active" && "bg-critical/10",
                incident.status === "investigating" && "bg-warning/10",
                incident.status === "resolved" && "bg-success/10"
              )}
            >
              {incident.status === "active" ? (
                <AlertTriangle className="w-4 h-4 text-critical" />
              ) : incident.status === "investigating" ? (
                <Clock className="w-4 h-4 text-warning" />
              ) : (
                <CheckCircle className="w-4 h-4 text-success" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {incident.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground font-mono">
                      {incident.id}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {incident.time}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      → {incident.assignee}
                    </span>
                  </div>
                </div>
                <StatusBadge status={incident.severity} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
