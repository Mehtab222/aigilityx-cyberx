import { 
  Shield, 
  Brain, 
  MessageSquare, 
  Radar, 
  Globe,
  ArrowRight 
} from "lucide-react";

const modules = [
  {
    icon: Shield,
    title: "vCISO Agent",
    description: "Emulates the role of a Chief Information Security Officer with continuous oversight, risk management, and compliance tracking.",
    features: [
      "Risk Ingestion & Scoring",
      "Compliance Dashboard",
      "Strategic Planning",
      "Executive Reporting"
    ],
    color: "hsl(188 95% 50%)"
  },
  {
    icon: Brain,
    title: "AdvisorX Strategic Engine",
    description: "Advanced analysis and planning capabilities supporting compliance, risk management, and resource prioritization.",
    features: [
      "Compliance Gap Analysis",
      "Threat & Risk Correlation",
      "Recommendation Generation",
      "Executive Briefs"
    ],
    color: "hsl(142 76% 45%)"
  },
  {
    icon: MessageSquare,
    title: "ConversX Chat Interface",
    description: "Natural language layer enabling users to query data, request reports, and execute actions through conversation.",
    features: [
      "Intent Recognition",
      "Role-Based Responses",
      "Command Execution",
      "Alert Notifications"
    ],
    color: "hsl(262 83% 58%)"
  },
  {
    icon: Radar,
    title: "vSOC Manager",
    description: "Virtual SOC leader focused on continuous monitoring, incident management, and operational security efficiency.",
    features: [
      "Real-Time Threat Monitoring",
      "Incident Detection & Response Coordination",
      "SOC Performance Metrics & KPIs",
      "Automated Playbooks & Escalations"
    ],
    color: "hsl(43 96% 56%)"
  },
  {
    icon: Globe,
    title: "Threat Intelligence",
    description: "Aggregates external threat intelligence and presents actionable insights to the SOC and strategic modules.",
    features: [
      "Feed Aggregation",
      "Relevance Scoring",
      "Actionable Guidance",
      "Historical Context"
    ],
    color: "hsl(0 84% 60%)"
  }
];

const ModulesSection = () => {
  return (
    <section id="modules" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-mono text-primary mb-4 tracking-wide">
            CORE MODULES
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Five Integrated <span className="text-primary">AI Agents</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Each module works seamlessly together to deliver comprehensive cybersecurity 
            coverage from strategic leadership to real-time threat response.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <div
              key={index}
              className="group relative bg-card border border-border p-6 hover:border-primary/50 transition-all duration-300"
              style={{ '--module-color': module.color } as React.CSSProperties}
            >
              {/* Icon */}
              <div 
                className="w-12 h-12 flex items-center justify-center mb-4 border border-border group-hover:border-primary/50 transition-colors"
                style={{ 
                  boxShadow: `0 0 20px ${module.color}30`
                }}
              >
                <module.icon 
                  className="w-6 h-6 transition-colors" 
                  style={{ color: module.color }}
                />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                {module.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {module.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {module.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <div 
                      className="w-1.5 h-1.5" 
                      style={{ backgroundColor: module.color }}
                    />
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Learn More Link */}
              <a 
                href="#" 
                className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group/link"
              >
                Learn more 
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </a>
            </div>
          ))}

          {/* Coming Soon Card */}
          <div className="relative bg-card/50 border border-dashed border-border p-6 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-mono text-primary mb-2">COMING SOON</span>
            <h3 className="text-xl font-bold mb-2">More Agents</h3>
            <p className="text-muted-foreground text-sm">
              Additional AI agents for specialized security functions are in development.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModulesSection;
