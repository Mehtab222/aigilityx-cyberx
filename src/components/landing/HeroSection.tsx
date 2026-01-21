import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroDashboard from "@/assets/cyber-hero.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroDashboard}
          alt="CyberX Command Center Dashboard"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
      </div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(hsl(var(--primary) / 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary) / 0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-primary/30 bg-primary/5 mb-8">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-mono text-primary tracking-wide">POWERED BY AIGILITYX</span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="text-foreground">AIgility X </span>
            <span className="text-primary" style={{ textShadow: '0 0 30px hsl(var(--primary) / 0.5)' }}>CyberX</span>
            <br />
            <span className="text-foreground">Agentic AI Platform</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            A sovereign, AI-powered cybersecurity solution uniting strategic leadership, 
            compliance oversight, real-time threat detection, and automated incident response 
            into a single, cohesive platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button 
              size="lg" 
              onClick={() => navigate("/login")}
              className="group px-8 py-6 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all" 
              style={{ boxShadow: '0 0 30px hsl(var(--primary) / 0.3)' }}
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg font-semibold border-border hover:bg-secondary">
              <Play className="mr-2 w-5 h-5" />
              Watch Overview
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-10 border-t border-border">
            {[
              { value: "99.9%", label: "Threat Detection Rate" },
              { value: "<2s", label: "Response Time" },
              { value: "75%", label: "Reduced False Positives" },
              { value: "24/7", label: "Automated Monitoring" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1" style={{ textShadow: '0 0 20px hsl(var(--primary) / 0.5)' }}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
