import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Demo Request Received",
      description: "Our team will contact you within 24 hours to schedule your demo.",
    });
    setFormData({ name: "", email: "", company: "", message: "" });
  };

  return (
    <section id="contact" className="py-24 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/30 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left Column - Info */}
          <div>
            <span className="inline-block text-sm font-mono text-primary mb-4 tracking-wide">
              GET IN TOUCH
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your <span className="text-primary">Security?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Schedule a personalized demo with our security experts and discover 
              how CyberX can revolutionize your cybersecurity operations.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center border border-primary/30">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium">contact@cpxcyberx.com</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center border border-primary/30">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Phone</div>
                  <div className="font-medium">+1 (800) CYBERX</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center border border-primary/30">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Headquarters</div>
                  <div className="font-medium">Silicon Valley, CA</div>
                </div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="p-4 border border-border bg-card/50">
              <div className="text-sm font-mono text-primary mb-2">TRUSTED BY</div>
              <p className="text-sm text-muted-foreground">
                Fortune 500 companies, government agencies, and leading financial 
                institutions rely on AIgilityX for their security needs.
              </p>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-card border border-border p-8">
            <h3 className="text-xl font-bold mb-6">Request a Demo</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Smith"
                  required
                  className="bg-background border-border focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Work Email *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@company.com"
                  required
                  className="bg-background border-border focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Company *</label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Company Name"
                  required
                  className="bg-background border-border focus:border-primary"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Message</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your security challenges..."
                  rows={4}
                  className="bg-background border-border focus:border-primary resize-none"
                />
              </div>
              <Button type="submit" className="w-full group bg-primary text-primary-foreground hover:bg-primary/90">
                Schedule Demo
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                By submitting, you agree to our Privacy Policy and Terms of Service.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
