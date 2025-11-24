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

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section - Bloomberg-level premium */}
      <NewHero />
      
      {/* Value Props Section */}
      <ValuePropsSection />
      
      {/* Who This Is For */}
      <WhoThisIsFor />
      
      {/* The Problem */}
      <TheProblem />
      
      {/* Interactive ROI Calculator - NEW */}
      <InteractiveROI />
      
      {/* Product Ladder - Premium redesign */}
      <ProductLadder />
      
      {/* Trust Section - NEW */}
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
