import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ArrowRight, Users, Megaphone, Target, Cog, Search, Hammer, UserCheck, GamepadIcon, Workflow, Telescope, Users2, PenTool } from "lucide-react";
import { useState } from "react";

const PathwaysSection = () => {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [showSpecializedModules, setShowSpecializedModules] = useState(false);

  const coreModules = [
    {
      id: "align-leaders",
      title: "ALIGN LEADERS",
      credits: 15,
      description: "Exec Team primer on AI literacy, market shifts, and how media leaders are preparing teams for 2030",
      icon: Users,
      track: "LEADERSHIP",
      recommended: true
    },
    {
      id: "inspire-staff", 
      title: "INSPIRE STAFF",
      credits: 10,
      description: "All Hands keynote on the future of work in 2030 & principles required to thrive",
      icon: Megaphone,
      track: "LEADERSHIP",
      recommended: true
    },
    {
      id: "product-strategy",
      title: "PRODUCT STRATEGY", 
      credits: 25,
      description: "Map AI capabilities to your Product Strategy to future-proof the business or develop a new revenue line",
      icon: Target,
      track: "LEADERSHIP",
      recommended: true
    },
    {
      id: "agent-opp-spotter",
      title: "AGENT OPP SPOTTER",
      credits: 5,
      description: "Learn to spot Agent opportunities, workflow redesign jam session with one team",
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
      description: "Production and training of an internal AI usage playbook",
      icon: Cog,
      track: "LEADERSHIP",
      unlockable: true
    },
    {
      id: "get-building",
      title: "GET BUILDING", 
      credits: 20,
      description: "Deep dive inspiration session on AI usage patterns, build a lightweight internal tool with one team and track it to a chosen KPI",
      icon: Hammer,
      track: "IMPLEMENTATION",
      unlockable: true
    },
    {
      id: "coach-the-coaches",
      title: "COACH THE COACHES",
      credits: 20,
      description: "Coach the coach: 1-1 AI literacy coaching for power users",
      icon: UserCheck,
      track: "IMPLEMENTATION",
      unlockable: true
    },
    {
      id: "gamify-learning",
      title: "GAMIFY LEARNING",
      credits: 15,
      description: '"No time - no problem" internal newsletter: produce tailored digital mini-lessons and score cards to distribute via email',
      icon: GamepadIcon,
      track: "IMPLEMENTATION",
      unlockable: true
    }
  ];

  // Level 3 modules - Advanced specialized content
  const level3Modules = {
    "formalize-ops": {
      id: "workflow-redesign-mastery",
      title: "WORKFLOW REDESIGN MASTERY",
      credits: 25,
      description: "Master the art of identifying inefficient processes and redesigning them with AI-first thinking for maximum business impact",
      icon: Workflow,
      track: "IMPLEMENTATION"
    },
    "get-building": {
      id: "competitive-intelligence-bootcamp", 
      title: "COMPETITIVE INTELLIGENCE BOOTCAMP",
      credits: 30,
      description: "Transform market research and competitor analysis using AI tools to gain strategic advantages and spot opportunities faster",
      icon: Telescope,
      track: "IMPLEMENTATION"
    },
    "coach-the-coaches": {
      id: "internal-champion-development",
      title: "INTERNAL CHAMPION DEVELOPMENT", 
      credits: 35,
      description: "Build a network of AI champions across departments who can drive adoption, training, and continuous improvement initiatives",
      icon: Users2,
      track: "LEADERSHIP"
    },
    "gamify-learning": {
      id: "ai-powered-content-strategy",
      title: "AI-POWERED CONTENT STRATEGY",
      credits: 20, 
      description: "Create systematic content workflows using AI for consistent, high-quality output across all marketing and communication channels",
      icon: PenTool,
      track: "IMPLEMENTATION"
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const renderLevel3Module = (level3Module: any) => {
    const IconComponent = level3Module.icon;
    const isLeadership = level3Module.track === "LEADERSHIP";
    
    return (
      <div className="glass-card p-4 sm:p-6 rounded-xl border-l-4 border-primary/20 max-w-4xl mx-auto">
        <div className="flex items-center justify-between w-full mb-3 sm:mb-4">
          <div className={`w-8 sm:w-10 h-8 sm:h-10 ${isLeadership ? 'bg-primary/10' : 'bg-accent/10'} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <IconComponent className={`w-4 sm:w-5 h-4 sm:h-5 ${isLeadership ? 'text-primary' : 'text-accent'}`} />
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`text-xs ${isLeadership ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'} px-2 py-1 rounded-full font-medium`}>
              {level3Module.track}
            </span>
            <span className={`text-sm sm:text-base font-bold ${isLeadership ? 'text-primary' : 'text-accent'}`}>
              {level3Module.credits}
            </span>
            <span className="text-xs text-muted-foreground">credits</span>
          </div>
        </div>
        
        <h4 className={`text-xs sm:text-sm font-bold uppercase tracking-wide ${isLeadership ? 'text-primary' : 'text-accent'} mb-2 sm:mb-3`}>
          {level3Module.title}
        </h4>
        
        <p className="text-xs sm:text-sm font-normal leading-relaxed text-muted-foreground mb-4 sm:mb-6">
          {level3Module.description}
        </p>
        
        <Button 
          asChild
          variant="outline" 
          size="sm" 
          className="group w-full min-h-[36px] sm:min-h-[40px] text-xs sm:text-sm"
        >
          <a 
            href="https://calendly.com/krish-raja/mindmaker-advanced-module"
            target="_blank"
            rel="noopener noreferrer"
          >
            Book Advanced Session
            <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </a>
        </Button>
      </div>
    );
  };

  const renderModule = (module: any, isCoreModule: boolean = false) => {
    const IconComponent = module.icon;
    const isLeadership = module.track === "LEADERSHIP";
    const isExpanded = expandedModules[module.id];
    const hasLevel3 = !isCoreModule && level3Modules[module.id as keyof typeof level3Modules];
    
    // For specialized modules with Level 3 content, return card without onClick (Collapsible handles it)
    if (!isCoreModule && hasLevel3) {
      return (
        <div className={`glass-card p-4 sm:p-6 hover:scale-105 transition-all duration-300 group flex flex-col rounded-xl cursor-pointer w-full max-w-4xl mx-auto`}>
          {/* Header Section - Fixed Height */}
          <div className="min-h-[100px] sm:min-h-[120px] flex flex-col">
            {/* Badge */}
            <div className="flex justify-end mb-3 sm:mb-4">
              <span className="bg-accent/10 text-accent px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                {isExpanded ? 'Expanded' : 'Click to Expand'}
              </span>
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
            
            {/* Visual indicator - no button needed, entire card is clickable */}
            <div className="mt-auto flex items-center justify-center">
              <ArrowRight className={`h-4 w-4 text-accent transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div key={module.id} className={`glass-card p-4 sm:p-6 hover:scale-105 transition-all duration-300 group flex flex-col h-full rounded-xl ${!isCoreModule ? 'opacity-75' : ''}`}>
        {/* Header Section - Fixed Height */}
        <div className="min-h-[100px] sm:min-h-[120px] flex flex-col">
          {/* Badge */}
          <div className="flex justify-end mb-3 sm:mb-4">
            {isCoreModule ? (
              <span className="bg-primary text-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                Start Here
              </span>
            ) : (
              <span className="bg-muted text-muted-foreground px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                Unlock Later
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
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="group w-full mt-auto min-h-[40px] sm:min-h-[44px] text-xs sm:text-sm"
              onClick={() => setShowSpecializedModules(true)}
            >
              Unlock Advanced
              <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="section-padding bg-secondary/20">
      <div className="container-width">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mb-4 sm:mb-6 text-foreground">AI Literacy-to-Strategy Sprints</h2>
        </div>

        {/* Core Modules - Always Visible */}
        <div className="mb-8 sm:mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto mb-8">
            {coreModules.map((module) => renderModule(module, true))}
          </div>
          
          {/* Show/Hide Specialized Modules Button */}
          <div className="text-center mb-8">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowSpecializedModules(!showSpecializedModules)}
              className="group min-h-[48px] px-8"
            >
              {showSpecializedModules ? 'Hide Advanced Modules' : 'Unlock Advanced Modules'}
              <ArrowRight className={`ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform ${showSpecializedModules ? 'rotate-90' : ''}`} />
            </Button>
          </div>
          
          {/* Specialized Modules - Progressive Disclosure */}
          {showSpecializedModules && (
            <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
              {specializedModules.map((module) => {
                const hasLevel3 = level3Modules[module.id as keyof typeof level3Modules];
                const isExpanded = expandedModules[module.id];
                
                if (hasLevel3) {
                  return (
                    <Collapsible key={module.id} open={isExpanded} onOpenChange={() => toggleModule(module.id)}>
                      <div className="w-full">
                        <CollapsibleTrigger asChild>
                          <div className="w-full cursor-pointer">
                            {renderModule(module, false)}
                          </div>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                          <div className="w-full mt-4">
                            {renderLevel3Module(level3Modules[module.id as keyof typeof level3Modules])}
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  );
                }
                
                return (
                  <div key={module.id} className="w-full">
                    {renderModule(module, false)}
                  </div>
                );
              })}
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