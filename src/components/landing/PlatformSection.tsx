import { 
  Zap, 
  Lock, 
  TrendingUp, 
  Layers, 
  Bot,
  BarChart3
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI-Driven Detection",
    description: "Machine learning and behavior analytics detect anomalies and reduce false positives with predictive threat intelligence."
  },
  {
    icon: Zap,
    title: "Automated Response",
    description: "Automated playbooks execute containment actions and remediation steps, dramatically reducing response time."
  },
  {
    icon: TrendingUp,
    title: "Predictive Analytics",
    description: "Highlight emerging threats and insider risks early with advanced predictive modeling and trend analysis."
  },
  {
    icon: Lock,
    title: "Compliance Management",
    description: "Automated analysis of audit reports and control checklists to identify gaps and produce prioritized remediation plans."
  },
  {
    icon: Layers,
    title: "Unified Platform",
    description: "Single cohesive platform integrating vCISO guidance, risk analysis, compliance, incident response, and threat intelligence."
  },
  {
    icon: BarChart3,
    title: "Strategic Insights",
    description: "Generate executive reports linking security initiatives to business objectives with clear ROI metrics."
  }
];

const PlatformSection = () => {
  return (
    <section id="platform" className="py-24 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-mono text-primary mb-4 tracking-wide">
            PLATFORM CAPABILITIES
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Enterprise-Grade <span className="text-primary">Security</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Built from the ground up to scale from small businesses to large enterprises 
            and public agencies with sovereign, AI-powered protection.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 border border-border bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-12 h-12 flex items-center justify-center border border-primary/30 mb-4 group-hover:bg-primary/10 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Integration Banner */}
        <div className="mt-16 p-8 border border-border bg-card/50 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Seamless Integration</h3>
              <p className="text-muted-foreground max-w-xl">
                Connect with existing SIEMs, GRC tools, ticketing systems, and more 
                to deliver a holistic security view across your organization.
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm font-mono text-primary">
              <span className="px-3 py-1 border border-primary/30">SIEM</span>
              <span className="px-3 py-1 border border-primary/30">GRC</span>
              <span className="px-3 py-1 border border-primary/30">SOAR</span>
              <span className="px-3 py-1 border border-primary/30">API</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformSection;
