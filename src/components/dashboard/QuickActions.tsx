import {
  FileText,
  Shield,
  MessageSquare,
  PlayCircle,
  Plus,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const actions = [
  {
    label: "Generate Executive Report",
    icon: FileText,
    variant: "default" as const,
  },
  {
    label: "Run Simulation",
    icon: PlayCircle,
    variant: "secondary" as const,
  },
  {
    label: "Ask vCISO",
    icon: MessageSquare,
    variant: "secondary" as const,
  },
  {
    label: "Add New Risk",
    icon: Plus,
    variant: "outline" as const,
  },
];

export function QuickActions() {
  return (
    <div className="metric-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.label}
              variant={action.variant}
              className="h-auto py-4 flex flex-col items-center gap-2 text-center"
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs text-center w-full">{action.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
