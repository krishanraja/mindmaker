import Navigation from "@/components/Navigation";
import NewHero from "@/components/NewHero";
import ChaosToClarity from "@/components/ShowDontTell/ChaosToClarity";
import TheProblem from "@/components/TheProblem";
import ProductLadder from "@/components/ProductLadder";
import TrustSection from "@/components/TrustSection";
import BeforeAfterSplit from "@/components/ShowDontTell/BeforeAfterSplit";
import SimpleCTA from "@/components/SimpleCTA";
import Footer from "@/components/Footer";
import { ChatBot } from "@/components/ChatBot";
import { ParticleBackground } from "@/components/Animations/ParticleBackground";

const Index = () => {
  return (
    <main className="min-h-screen bg-background relative">
      {/* Particle Background Effect */}
      <ParticleBackground />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <NewHero />
      
      {/* Chaos to Clarity Animation */}
      <div id="problem">
        <ChaosToClarity />
      </div>
      
      {/* Interactive Command Centre */}
      <TheProblem />
      
      {/* Product Ladder */}
      <div id="book">
        <ProductLadder />
      </div>
      
      {/* Trust Section */}
      <TrustSection />
      
      {/* Before/After Split */}
      <BeforeAfterSplit />
      
      {/* Simple CTA */}
      <SimpleCTA />
      
      {/* Footer */}
      <Footer />
      
      {/* ChatBot */}
      <ChatBot />
    </main>
  );
};

export default Index;
