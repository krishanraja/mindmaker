import { useState } from "react";
import Navigation from "@/components/Navigation";
import NewHero from "@/components/NewHero";
import ChaosToClarity from "@/components/ShowDontTell/ChaosToClarity";
import TheProblem from "@/components/TheProblem";
import ProductLadder from "@/components/ProductLadder";
import TrustSection from "@/components/TrustSection";
import BeforeAfterSplit from "@/components/ShowDontTell/BeforeAfterSplit";
import SimpleCTA from "@/components/SimpleCTA";
import Footer from "@/components/Footer";
import { ParticleBackground } from "@/components/Animations/ParticleBackground";
import WhitepaperPromo from "@/components/WhitepaperPromo";
import WhitepaperPopup from "@/components/WhitepaperPopup";
import { ToolsDrawerButton } from "@/components/ToolsDrawerButton";
import { FloatingCTA } from "@/components/FloatingCTA";
import { Dialog, DialogWizardContent } from "@/components/ui/dialog";
import { BuilderAssessment } from "@/components/Interactive/BuilderAssessment";
import { FrictionMapBuilder } from "@/components/Interactive/FrictionMapBuilder";
import { TryItWidget } from "@/components/Interactive/AIDecisionHelper";
import { PortfolioBuilder } from "@/components/Interactive/PortfolioBuilder";
import { Mic } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

type DialogType = 'quiz' | 'decision' | 'friction' | 'portfolio' | null;

const Index = () => {
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const isMobile = useIsMobile();

  const getDialogTitle = () => {
    switch (dialogType) {
      case 'quiz': return 'Builder Profile Quiz';
      case 'decision': return 'AI Decision Helper';
      case 'friction': return 'Friction Map Builder';
      case 'portfolio': return 'Model out your starting points';
      default: return '';
    }
  };

  const renderDialogContent = () => {
    switch (dialogType) {
      case 'quiz':
        return <BuilderAssessment compact={false} onClose={() => setDialogType(null)} />;
      case 'decision':
        return <TryItWidget compact={false} onClose={() => setDialogType(null)} />;
      case 'friction':
        return <FrictionMapBuilder compact={false} onClose={() => setDialogType(null)} />;
      case 'portfolio':
        return <PortfolioBuilder compact={false} onClose={() => setDialogType(null)} />;
      default:
        return null;
    }
  };

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
      
      {/* Whitepaper Lead Magnet */}
      <WhitepaperPromo />
      
      {/* Simple CTA */}
      <SimpleCTA />
      
      {/* Footer */}
      <Footer />
      
      {/* Whitepaper Popup */}
      <WhitepaperPopup />
      
      {/* Tools Drawer Button - Fixed at page level */}
      <ToolsDrawerButton onToolClick={setDialogType} />
      
      {/* Floating CTA - Persistent Book Session button */}
      <FloatingCTA />

      {/* Dialog for Interactive Tools */}
      <Dialog open={dialogType !== null} onOpenChange={() => setDialogType(null)}>
        <DialogWizardContent className="sm:max-w-2xl sm:max-h-[85vh]" hideCloseButton={isMobile}>
          {/* Desktop: Header with close button */}
          {!isMobile && (
            <div className="shrink-0 p-6 pb-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{getDialogTitle()}</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Powered by Mindmaker Methodology
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-mint/10 border border-mint/20">
                  <Mic className="w-3 h-3 text-mint" />
                  <span className="text-[10px] font-medium text-mint-dark">Voice Enabled</span>
                </div>
              </div>
            </div>
          )}
          <div className="flex-1 flex flex-col overflow-hidden min-h-0 sm:p-6 sm:pt-4">
            {renderDialogContent()}
          </div>
        </DialogWizardContent>
      </Dialog>
    </main>
  );
};

export default Index;
