import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Megaphone, Target, Cog, Search, Hammer, UserCheck, GamepadIcon, Workflow, Telescope, Users2, PenTool, RotateCcw } from "lucide-react";
import { useState } from "react";
import ResponsiveCardGrid from "@/components/ResponsiveCardGrid";

const PathwaysSection = () => {
  const [showSpecializedModules, setShowSpecializedModules] = useState(false);
  const [showLevel3Modules, setShowLevel3Modules] = useState(false);

  const coreModules = [
    {
      id: "align-leaders",
      title: "ALIGN LEADERS",
      credits: 15,
      description: "Exec Team primer on AI literacy, market shifts, and how media leaders are preparing for 2030",
      icon: Users,
      track: "LEADERSHIP",
      recommended: true
    },
    {
      id: "inspire-staff", 
      title: "INSPIRE STAFF",
      credits: 10,
      description: "All Hands keynote on the future of work & principles to thrive",
      icon: Megaphone,
      track: "LEADERSHIP",
      recommended: true
    },
    {
      id: "product-strategy",
      title: "PRODUCT STRATEGY", 
      credits: 25,
      description: "Map AI capabilities to your product roadmap or new revenue lines",
      icon: Target,
      track: "LEADERSHIP",
      recommended: true
    },
    {
      id: "agent-opp-spotter",
      title: "AGENT OPP SPOTTER",
      credits: 5,
      description: "Workflow redesign jam: spot agent opportunities",
      icon: Search,
      track: "IMPLEMENTATION",
      recommended: true
    }
  ];

  const specializedModules = [
    {
      id: "formalize-ops",
      title: "FORMALIZE OPS",
      credits: 20, 
      description: "Produce & train an internal AI usage playbook",
      icon: Cog,
      track: "LEADERSHIP",
      unlockable: true
    },
    {
      id: "get-building",
      title: "GET BUILDING", 
      credits: 20,
      description: "Deep dive: build a lightweight tool with one team and track KPIs",
      icon: Hammer,
      track: "IMPLEMENTATION",
      unlockable: true
    },
    {
      id: "coach-the-coaches",
      title: "COACH THE COACHES",
      credits: 20,
      description: "1-1 coaching for power users to scale literacy",
      icon: UserCheck,
      track: "IMPLEMENTATION",
      unlockable: true
    },
    {
      id: "gamify-learning",
      title: "GAMIFY LEARNING",
      credits: 15,
      description: "Mini-lessons + scorecards delivered via email/newsletter",
      icon: GamepadIcon,
      track: "IMPLEMENTATION",
      unlockable: true
    }
  ];

  // Level 3 modules array - Advanced specialized content
  const level3ModulesArray = [
    {
      id: "workflow-redesign-mastery",
      title: "WORKFLOW REDESIGN MASTERY",
      credits: 25,
      description: "Advanced process redesign with AI-first thinking",
      icon: Workflow,
      track: "IMPLEMENTATION"
    },
    {
      id: "competitive-intelligence-bootcamp", 
      title: "COMPETITIVE INTELLIGENCE BOOTCAMP",
      credits: 40,
      description: "Transform market research using AI",
      icon: Telescope,
      track: "IMPLEMENTATION"
    },
    {
      id: "internal-champion-development",
      title: "INTERNAL CHAMPION DEVELOPMENT", 
      credits: 45,
      description: "Build a network of AI champions across the org",
      icon: Users2,
      track: "LEADERSHIP"
    },
    {
      id: "ai-powered-content-strategy",
      title: "AI-POWERED CONTENT STRATEGY",
      credits: 20, 
      description: "Create systematic AI-driven content workflows",
      icon: PenTool,
      track: "IMPLEMENTATION"
    }
  ];

  const resetToCore = () => {
    setShowSpecializedModules(false);
    setShowLevel3Modules(false);
    // Scroll to top of the section
    document.querySelector('[data-section="pathways"]')?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  };

  const renderModule = (module: any, isCoreModule: boolean = false, isLevel3: boolean = false) => {
    const IconComponent = module.icon;
    const isLeadership = module.track === "LEADERSHIP";
    
    return (
      <div key={module.id} className={`glass-card p-4 sm:p-6 lg:p-8 hover:scale-105 transition-all duration-300 group flex flex-col h-full rounded-xl ${!isCoreModule && !isLevel3 ? 'opacity-75' : ''}`}>
        {/* Header Section */}
        <div className="flex flex-col mb-4">
          {/* Badge */}
          <div className="flex justify-end mb-3 sm:mb-4">
            {isCoreModule ? (
              <span className="bg-primary text-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                Start Here
              </span>
            ) : isLevel3 ? (
              <span className="bg-accent/10 text-accent px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                Expert Level
              </span>
            ) : (
              <span className="bg-muted text-muted-foreground px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                Intermediate
              </span>
            )}
          </div>
          
          {/* Icon and Credits */}
          <div className="flex items-center justify-between w-full mb-3 sm:mb-4">
            <div className={`w-10 sm:w-12 h-10 sm:h-12 ${isLeadership ? 'bg-primary/10' : 'bg-accent/10'} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <IconComponent className={`w-5 sm:w-6 h-5 sm:h-6 ${isLeadership ? 'text-primary' : 'text-accent'}`} />
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`text-xs ${isLeadership ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'} px-2 py-1 rounded-full font-medium`}>
                {module.track}
              </span>
              <span className={`text-base sm:text-lg font-bold ${isLeadership ? 'text-primary' : 'text-accent'}`}>
                {module.credits}
              </span>
              <span className="text-xs text-muted-foreground">credits</span>
            </div>
          </div>
          
          {/* Title */}
          <h4 className={`text-xs sm:text-sm font-bold uppercase tracking-wide ${isLeadership ? 'text-primary' : 'text-accent'} mb-2 sm:mb-3`}>
            {module.title}
          </h4>
        </div>
        
        {/* Content Section - Flexible Height */}
        <div className="flex-1 flex flex-col">
          <p className="text-xs sm:text-sm font-normal leading-relaxed text-muted-foreground mb-4 sm:mb-6 flex-1">
            {module.description}
          </p>
          
          {/* Button Section - Bottom Aligned */}
          {isCoreModule ? (
            <Button 
              asChild
              variant="outline" 
              size="sm" 
              className="group w-full mt-auto min-h-[40px] sm:min-h-[44px] text-xs sm:text-sm"
            >
              <a 
                href={
                  module.id === 'align-leaders' ? 'https://calendly.com/krish-raja/mindmaker-align-leaders' :
                  module.id === 'inspire-staff' ? 'https://calendly.com/krish-raja/mindmaker-inspire-staff' :
                  module.id === 'product-strategy' ? 'https://calendly.com/krish-raja/mindmaker-product-strategy' :
                  module.id === 'agent-opp-spotter' ? 'https://calendly.com/krish-raja/mindmaker-agent-opp-spotter' :
                  '#'
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                Book Session
                <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          ) : isLevel3 ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-auto min-h-[40px] sm:min-h-[44px] text-xs sm:text-sm"
              onClick={resetToCore}
            >
              <RotateCcw className="mr-2 h-3 w-3" />
              Back to Core
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-auto min-h-[40px] sm:min-h-[44px] text-xs sm:text-sm"
              onClick={resetToCore}
            >
              <RotateCcw className="mr-2 h-3 w-3" />
              Back to Core
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <section id="pathways" className="section-padding bg-purple-50" data-section="pathways">
      <div className="container-width">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mb-4 sm:mb-6 text-foreground">Modules You Can Combine</h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-5xl mx-auto">
            Choose what you need, when you need it. Build custom pathways with flexible, outcome-focused modules.
          </p>
        </div>

        {/* Core Modules - Always Visible */}
        <div className="mb-8 sm:mb-12">
          <ResponsiveCardGrid
            desktopGridClass="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto mb-8"
          >
            {coreModules.map((module) => renderModule(module, true, false))}
          </ResponsiveCardGrid>
          
          {/* Show/Hide Specialized Modules Button */}
          <div className="text-center mt-8 sm:mt-12 mb-8">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowSpecializedModules(!showSpecializedModules)}
              className="group min-h-[48px] px-8"
            >
              {showSpecializedModules ? 'Hide Intermediate Modules' : 'Unlock Intermediate Modules'}
              <ArrowRight className={`ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform ${showSpecializedModules ? 'rotate-90' : ''}`} />
            </Button>
          </div>
          
          {/* Specialized Modules - Progressive Disclosure */}
          {showSpecializedModules && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              {/* Level 2 Grid */}
              <ResponsiveCardGrid
                desktopGridClass="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
              >
                {specializedModules.map((module) => renderModule(module, false, false))}
              </ResponsiveCardGrid>
              
              {/* Show/Hide Level 3 Modules Button */}
              <div className="text-center mt-8 sm:mt-12 mb-8">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowLevel3Modules(!showLevel3Modules)}
                  className="group min-h-[48px] px-8"
                >
                  {showLevel3Modules ? 'Hide Expert Modules' : 'Unlock Expert Modules'}
                  <ArrowRight className={`ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform ${showLevel3Modules ? 'rotate-90' : ''}`} />
                </Button>
              </div>
              
              {/* Level 3 Grid */}
              {showLevel3Modules && (
                <div className="max-w-7xl mx-auto animate-fade-in">
                  <ResponsiveCardGrid
                    desktopGridClass="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
                  >
                    {level3ModulesArray.map((module) => renderModule(module, false, true))}
                  </ResponsiveCardGrid>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            These are just some of our available modules - tailored upon further discovery
          </p>
        </div>
      </div>
    </section>
  );
};

export default PathwaysSection;