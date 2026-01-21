import { Building2, Landmark, Factory } from "lucide-react";

const useCases = [
  {
    icon: Building2,
    title: "Banking & Financial Services",
    description: "Comprehensive PCI DSS compliance, fraud detection, and real-time transaction monitoring with automated threat response.",
    metrics: [
      { value: "99.7%", label: "Fraud Detection" },
      { value: "< 500ms", label: "Alert Response" },
      { value: "100%", label: "PCI Compliance" }
    ],
    features: [
      "Real-time transaction anomaly detection",
      "Automated compliance reporting",
      "Insider threat identification",
      "Secure API integration"
    ]
  },
  {
    icon: Landmark,
    title: "Government & Public Sector",
    description: "Sovereign security solution meeting NIST, FedRAMP, and agency-specific requirements with classified data protection.",
    metrics: [
      { value: "NIST", label: "Compliant" },
      { value: "24/7", label: "Monitoring" },
      { value: "Zero", label: "Data Breaches" }
    ],
    features: [
      "Sovereign data handling",
      "Multi-framework compliance",
      "Classified network protection",
      "Audit trail management"
    ]
  },
  {
    icon: Factory,
    title: "Enterprise & Manufacturing",
    description: "OT/IT convergence security, supply chain protection, and industrial control system monitoring with predictive maintenance.",
    metrics: [
      { value: "85%", label: "Cost Reduction" },
      { value: "3x", label: "Faster Response" },
      { value: "ISO", label: "27001 Ready" }
    ],
    features: [
      "OT/IT security convergence",
      "Supply chain risk analysis",
      "Industrial protocol monitoring",
      "Asset vulnerability management"
    ]
  }
];

const UseCasesSection = () => {
  return (
    <section id="use-cases" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-mono text-primary mb-4 tracking-wide">
            USE CASES
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built for <span className="text-primary">Every Sector</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            From financial institutions to government agencies, CyberX adapts 
            to your industry's unique security and compliance requirements.
          </p>
        </div>

        {/* Use Cases */}
        <div className="space-y-8">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="group bg-card border border-border hover:border-primary/30 transition-all duration-300"
            >
              <div className="grid lg:grid-cols-3 gap-0">
                {/* Left Column - Info */}
                <div className="p-8 border-b lg:border-b-0 lg:border-r border-border">
                  <div className="w-12 h-12 flex items-center justify-center border border-primary/30 mb-4">
                    <useCase.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{useCase.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {useCase.description}
                  </p>
                </div>

                {/* Middle Column - Metrics */}
                <div className="p-8 border-b lg:border-b-0 lg:border-r border-border bg-secondary/30">
                  <h4 className="text-sm font-mono text-muted-foreground mb-6">KEY METRICS</h4>
                  <div className="space-y-6">
                    {useCase.metrics.map((metric, i) => (
                      <div key={i}>
                        <div className="text-2xl font-bold text-primary mb-1" style={{ textShadow: '0 0 20px hsl(var(--primary) / 0.5)' }}>
                          {metric.value}
                        </div>
                        <div className="text-sm text-muted-foreground">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column - Features */}
                <div className="p-8">
                  <h4 className="text-sm font-mono text-muted-foreground mb-6">CAPABILITIES</h4>
                  <ul className="space-y-3">
                    {useCase.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm">
                        <div className="w-1.5 h-1.5 bg-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
