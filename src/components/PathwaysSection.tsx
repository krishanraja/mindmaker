import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Megaphone, Target, Cog, Search, Hammer, UserCheck, GamepadIcon } from "lucide-react";

const PathwaysSection = () => {
  const modules = [
    // Leadership Track
    {
      id: "align-leaders",
      title: "ALIGN LEADERS",
      credits: 15,
      description: "Exec Team primer on AI literacy, market shifts, and how media leaders are preparing teams for 2030",
      icon: Users,
      track: "LEADERSHIP"
    },
    {
      id: "inspire-staff", 
      title: "INSPIRE STAFF",
      credits: 10,
      description: "All Hands keynote on the future of work in 2030 & principles required to thrive",
      icon: Megaphone,
      track: "LEADERSHIP"
    },
    {
      id: "product-strategy",
      title: "PRODUCT STRATEGY", 
      credits: 25,
      description: "Map AI capabilities to your Product Strategy to future-proof the business or develop a new revenue line",
      icon: Target,
      track: "LEADERSHIP"
    },
    {
      id: "formalize-ops",
      title: "FORMALIZE OPS",
      credits: 20, 
      description: "Production and training of an internal AI usage playbook",
      icon: Cog,
      track: "LEADERSHIP"
    },
    // Implementation Track
    {
      id: "agent-opp-spotter",
      title: "AGENT OPP SPOTTER",
      credits: 5,
      description: "Learn to spot Agent opportunities, workflow redesign jam session with one team",
      icon: Search,
      track: "IMPLEMENTATION"
    },
    {
      id: "get-building",
      title: "GET BUILDING", 
      credits: 20,
      description: "Deep dive inspiration session on AI usage patterns, build a lightweight internal tool with one team and track it to a chosen KPI",
      icon: Hammer,
      track: "IMPLEMENTATION"
    },
    {
      id: "coach-the-coaches",
      title: "COACH THE COACHES",
      credits: 20,
      description: "Coach the coach: 1-1 AI literacy coaching for power users",
      icon: UserCheck,
      track: "IMPLEMENTATION"
    },
    {
      id: "gamify-learning",
      title: "GAMIFY LEARNING",
      credits: 15,
      description: '"No time - no problem" internal newsletter: produce tailored digital mini-lessons and score cards to distribute via email',
      icon: GamepadIcon,
      track: "IMPLEMENTATION"
    }
  ];

  return (
    <section className="py-20 bg-secondary/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6 text-foreground">AI MindMaker Program Modules</h2>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground max-w-4xl mx-auto">
            <strong>Agentic AI Sprints for Commercial Product Strategy Team Literacy</strong><br/>
            Personalized AI literacy → product strategy sprints with decades of media industry experience
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {modules.map((module) => {
            const IconComponent = module.icon;
            const isLeadership = module.track === "LEADERSHIP";
            
            return (
              <div key={module.id} className="glass-card p-6 hover:scale-105 transition-all duration-300 group h-full">
                <div className="flex items-start gap-4 h-full flex-col">
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className={`w-12 h-12 ${isLeadership ? 'bg-primary/10' : 'bg-accent/10'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className={`w-6 h-6 ${isLeadership ? 'text-primary' : 'text-accent'}`} />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-xs ${isLeadership ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'} px-2 py-1 rounded-full font-medium`}>
                        {module.track}
                      </span>
                      <span className={`text-lg font-bold ${isLeadership ? 'text-primary' : 'text-accent'}`}>
                        {module.credits}
                      </span>
                      <span className="text-xs text-muted-foreground">credits</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-lg font-semibold ${isLeadership ? 'text-primary' : 'text-accent'} mb-3`}>
                      {module.title}
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {module.description}
                    </p>
                    <Button variant="outline" size="sm" className="group w-full">
                      Learn More
                      <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground mb-4">
            These are just some of our available modules - tailored upon further discovery
          </p>
          <p className="text-sm text-muted-foreground">
            Reach out to <a href="mailto:krish@fractionl.ai" className="text-primary hover:underline font-medium">krish@fractionl.ai</a> to discuss your needs
          </p>
        </div>
      </div>
    </section>
  );
};

export default PathwaysSection;