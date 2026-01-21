import { Shield } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="text-lg font-bold tracking-tight">
              CPX <span className="text-primary">CyberX</span>
            </span>
          </a>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Security</a>
            <a href="#" className="hover:text-primary transition-colors">Documentation</a>
          </div>

          {/* Copyright */}
          <div className="text-sm text-muted-foreground">
            © {currentYear} AIgilityX. All rights reserved.
          </div>
        </div>

        {/* Powered by badge */}
        <div className="mt-8 pt-8 border-t border-border text-center">
          <span className="text-xs font-mono text-muted-foreground">
            POWERED BY <span className="text-primary">AIGILITYX</span>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
