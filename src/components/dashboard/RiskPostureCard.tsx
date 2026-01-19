import { Shield, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskPostureCardProps {
  score: number;
  trend: number;
  label: string;
}

export function RiskPostureCard({ score, trend, label }: RiskPostureCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-medium";
    if (score >= 40) return "text-high";
    return "text-critical";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Critical";
  };

  const circumference = 2 * Math.PI * 58;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="metric-card flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className={cn("text-sm font-semibold", getScoreColor(score))}>
            {getScoreLabel(score)}
          </p>
        </div>
        <div className="p-2 rounded-lg bg-primary/10">
          <Shield className="w-5 h-5 text-primary" />
        </div>
      </div>

      {/* Circular Progress */}
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          {/* Background circle */}
          <circle
            cx="64"
            cy="64"
            r="58"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="64"
            cy="64"
            r="58"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
            style={{
              filter: "drop-shadow(0 0 6px hsl(var(--primary) / 0.5))",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold font-mono-data">{score}</span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
      </div>

      {/* Trend */}
      <div className="flex items-center gap-2 mt-4">
        {trend > 0 ? (
          <TrendingUp className="w-4 h-4 text-success" />
        ) : (
          <TrendingDown className="w-4 h-4 text-destructive" />
        )}
        <span
          className={cn(
            "text-sm font-medium",
            trend > 0 ? "text-success" : "text-destructive"
          )}
        >
          {trend > 0 ? "+" : ""}
          {trend}% from last month
        </span>
      </div>
    </div>
  );
}
