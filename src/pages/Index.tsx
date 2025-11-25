import Navigation from "@/components/Navigation";
import NewHero from "@/components/NewHero";
import ChaosToClarity from "@/components/ShowDontTell/ChaosToClarity";
import WhoThisIsFor from "@/components/WhoThisIsFor";
import TheProblem from "@/components/TheProblem";
import InteractiveROI from "@/components/InteractiveROI";
import ProductLadder from "@/components/ProductLadder";
import TrustSection from "@/components/TrustSection";
import BeforeAfterSplit from "@/components/ShowDontTell/BeforeAfterSplit";
import TryItWidget from "@/components/ShowDontTell/TryItWidget";
import BuilderEconomyConnection from "@/components/BuilderEconomyConnection";
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
      
      {/* Builder Assessment */}
      <WhoThisIsFor />
      
      {/* The Problem */}
      <TheProblem />
      
      {/* Interactive Portfolio Builder */}
      <InteractiveROI />
      
      {/* Product Ladder */}
      <ProductLadder />
      
      {/* Try It Widget */}
      <TryItWidget />
      
      {/* Trust Section */}
      <TrustSection />
      
      {/* Before/After Split */}
      <BeforeAfterSplit />
      
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
