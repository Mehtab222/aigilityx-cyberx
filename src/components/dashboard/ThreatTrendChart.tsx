import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", threats: 45, mitigated: 42 },
  { name: "Feb", threats: 52, mitigated: 48 },
  { name: "Mar", threats: 38, mitigated: 35 },
  { name: "Apr", threats: 65, mitigated: 60 },
  { name: "May", threats: 58, mitigated: 55 },
  { name: "Jun", threats: 72, mitigated: 68 },
  { name: "Jul", threats: 48, mitigated: 46 },
];

export function ThreatTrendChart() {
  return (
    <div className="metric-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Threat Trends
          </h3>
          <p className="text-sm text-muted-foreground">
            Threats detected vs mitigated
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <span className="text-muted-foreground">Detected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Mitigated</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorMitigated" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(187, 100%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(187, 100%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(217, 33%, 17%)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222, 47%, 10%)",
                border: "1px solid hsl(217, 33%, 17%)",
                borderRadius: "8px",
                boxShadow: "0 4px 24px hsl(0, 0%, 0%, 0.4)",
              }}
              labelStyle={{ color: "hsl(210, 40%, 98%)" }}
              itemStyle={{ color: "hsl(215, 20%, 65%)" }}
            />
            <Area
              type="monotone"
              dataKey="threats"
              stroke="hsl(0, 84%, 60%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorThreats)"
            />
            <Area
              type="monotone"
              dataKey="mitigated"
              stroke="hsl(187, 100%, 50%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorMitigated)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
