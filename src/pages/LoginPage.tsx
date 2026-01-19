import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import cyberHero from "@/assets/cyber-hero.jpg";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo, just navigate to dashboard
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={cyberHero}
          alt="Cybersecurity Command Center"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
        <div className="relative z-10 flex flex-col justify-end p-12">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              AI-Powered Cybersecurity Command Center
            </h2>
            <p className="text-muted-foreground">
              Unified visibility across your security landscape with intelligent
              insights from our virtual CISO, SOC analysts, and threat hunters.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Logo */}
          <div className="flex flex-col items-center text-center">
            <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 glow-primary mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome to <span className="text-gradient">CyberX</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Sign in to access your security dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-muted/50 border-border focus:bg-background"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-muted/50 border-border focus:bg-background pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="cyber"
              className="w-full h-12 text-base font-semibold"
            >
              Sign In
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8 p-4 rounded-xl bg-muted/30 border border-border">
            <p className="text-xs text-muted-foreground text-center mb-3">
              Demo Accounts (click to fill)
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { role: "CISO", email: "ciso@cyberx.demo" },
                { role: "SOC Analyst", email: "analyst@cyberx.demo" },
                { role: "Auditor", email: "auditor@cyberx.demo" },
                { role: "Executive", email: "exec@cyberx.demo" },
              ].map((demo) => (
                <button
                  key={demo.role}
                  type="button"
                  onClick={() => {
                    setEmail(demo.email);
                    setPassword("demo123");
                  }}
                  className="px-3 py-2 text-xs rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
                >
                  {demo.role}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Contact your administrator
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
