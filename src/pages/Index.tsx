import Navigation from "@/components/Navigation";
import NewHero from "@/components/NewHero";
import ValuePropsSection from "@/components/ValuePropsSection";
import WhoThisIsFor from "@/components/WhoThisIsFor";
import TheProblem from "@/components/TheProblem";
import InteractiveROI from "@/components/InteractiveROI";
import ProductLadder from "@/components/ProductLadder";
import TrustSection from "@/components/TrustSection";
import HowItsDifferent from "@/components/HowItsDifferent";
import BuilderEconomyConnection from "@/components/BuilderEconomyConnection";
import SimpleCTA from "@/components/SimpleCTA";
import Footer from "@/components/Footer";
import { ChatBot } from "@/components/ChatBot";
import { ProgressNavigator } from "@/components/Navigation/ProgressNavigator";
import { ParticleBackground } from "@/components/Animations/ParticleBackground";

const Index = () => {
  return (
    <main className="min-h-screen bg-background relative">
      {/* Particle Background Effect */}
      <ParticleBackground />
      
      {/* Navigation */}
      <Navigation />
      <ProgressNavigator />
      
      {/* Hero Section */}
      <NewHero />
      
      {/* Value Props Section */}
      <div id="problem">
        <ValuePropsSection />
      </div>
      
      {/* Builder Assessment (replaces Who This Is For) */}
      <WhoThisIsFor />
      
      {/* The Problem */}
      <TheProblem />
      
      {/* Interactive Portfolio Builder (enhanced ROI) */}
      <InteractiveROI />
      
      {/* Product Ladder */}
      <ProductLadder />
      
      {/* Trust Section */}
      <TrustSection />
      
      {/* How It's Different */}
      <HowItsDifferent />
      
      {/* Builder Economy Connection */}
      <BuilderEconomyConnection />
      
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
