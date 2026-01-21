import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import PlatformSection from "@/components/landing/PlatformSection";
import ModulesSection from "@/components/landing/ModulesSection";
import UseCasesSection from "@/components/landing/UseCasesSection";
import ContactSection from "@/components/landing/ContactSection";
import Footer from "@/components/landing/Footer";

const LandingPage = () => {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <PlatformSection />
      <ModulesSection />
      <UseCasesSection />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default LandingPage;
