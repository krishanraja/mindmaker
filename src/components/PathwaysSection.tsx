import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, User, Lightbulb, GraduationCap } from "lucide-react";

const PathwaysSection = () => {
  return (
    <section className="py-20 bg-secondary/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-title">Choose Your Transformation Pathway</h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            Whether you're transforming an enterprise or developing personal AI mastery, 
            our battle-tested methodology accelerates your journey from AI-anxious to AI-advantaged.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* For Businesses */}
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-primary mb-4">FOR BUSINESSES</h3>
              <p className="text-lg text-muted-foreground">
                Escape pilot purgatory. Build AI-first competitive advantages that create sustainable revenue growth.
              </p>
            </div>

            <div className="space-y-6">
              {/* Executive Leaders */}
              <div className="bg-card rounded-xl p-6 shadow-soft hover:shadow-strong transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-primary mb-2">1A: EXECUTIVE LEADERS</h4>
                    <p className="text-muted-foreground mb-4">
                      Strategic AI leadership for C-suite executives who need to make confident decisions that drive competitive advantage
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-sm bg-accent/10 text-accent px-3 py-1 rounded-full">4-phase transformation methodology</span>
                      <span className="text-sm bg-accent/10 text-accent px-3 py-1 rounded-full">Board-ready AI strategy</span>
                      <span className="text-sm bg-accent/10 text-accent px-3 py-1 rounded-full">Competitive moat development</span>
                    </div>
                    <Button variant="outline" className="group">
                      Take Leadership Assessment
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Enterprise Teams */}
              <div className="bg-card rounded-xl p-6 shadow-soft hover:shadow-strong transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-primary mb-2">1B: ENTERPRISE TEAMS</h4>
                    <p className="text-muted-foreground mb-4">
                      Workforce transformation programs that move entire departments from AI-anxious to AI-advantaged
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-sm bg-accent/10 text-accent px-3 py-1 rounded-full">Custom workshops</span>
                      <span className="text-sm bg-accent/10 text-accent px-3 py-1 rounded-full">Workflow redesign</span>
                      <span className="text-sm bg-accent/10 text-accent px-3 py-1 rounded-full">AI usage playbooks</span>
                      <span className="text-sm bg-accent/10 text-accent px-3 py-1 rounded-full">Adoption measurement</span>
                    </div>
                    <Button variant="outline" className="group">
                      Request Team Transformation Quote
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* For Individuals */}
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-3xl font-bold text-accent mb-4">FOR INDIVIDUALS</h3>
              <p className="text-lg text-muted-foreground">
                Future-proof your career and become indispensable in the AI-first economy
              </p>
            </div>

            <div className="space-y-6">
              {/* Ideas to Blueprints */}
              <div className="bg-card rounded-xl p-6 shadow-soft hover:shadow-strong transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-accent mb-2">2A: IDEAS-TO-BLUEPRINTS</h4>
                    <p className="text-muted-foreground mb-4">
                      For entrepreneurs and innovators who want to transform business ideas into AI-powered solutions
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">AI opportunity identification</span>
                      <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">Solution architecture</span>
                      <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">Implementation roadmap</span>
                    </div>
                    <Button variant="outline" className="group">
                      Start Idea Assessment
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* AI Literacy Mastery */}
              <div className="bg-card rounded-xl p-6 shadow-soft hover:shadow-strong transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-accent mb-2">2B: AI LITERACY MASTERY</h4>
                    <p className="text-muted-foreground mb-4">
                      For professionals who want to develop comprehensive AI fluency and career-protection skills
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">Personal readiness assessment</span>
                      <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">Strategic AI thinking</span>
                      <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">Career future-proofing</span>
                    </div>
                    <Button variant="outline" className="group">
                      Take AI Literacy Assessment
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PathwaysSection;