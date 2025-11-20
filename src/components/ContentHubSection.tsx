import { Button } from "@/components/ui/button";
import { ExternalLink, BookOpen, BarChart3, Target, Lightbulb, Download } from "lucide-react";
import ResponsiveCardGrid from "@/components/ResponsiveCardGrid";
import whitepaperCover from "@/assets/whitepaper-cover.png";

const ContentHubSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-width">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4 mr-2" />
              Mental Models Behind the System
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
              The <span className="text-primary">Cognitive Frameworks</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl mx-auto">
              The mental models we use to map how leaders think about AI and make better decisions.
            </p>
          </div>

          {/* Featured Whitepaper Card */}
          <a 
            href="https://docsend.com/view/uybrzhx75fcwp2n7" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block mb-8 group"
          >
            <div className="glass-card p-6 sm:p-8 transition-all duration-300 hover:shadow-xl">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
                {/* Whitepaper Cover Image */}
                <div className="flex-shrink-0">
                  <img 
                    src={whitepaperCover} 
                    alt="Resolving the AI Literacy Crisis Whitepaper Cover" 
                    className="w-full max-w-[200px] md:max-w-[240px] rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-border/50 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-4">
                    Featured Report
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3">
                    Resolving the AI Literacy Crisis
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-6">
                    Discover the critical insights and frameworks leaders need to bridge the AI knowledge gap in their organizations.
                  </p>
                  <Button variant="hero-primary" size="lg" className="pointer-events-none">
                    Download Free Report
                    <Download className="ml-2 h-5 w-5 group-hover:translate-y-0.5 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </a>
          
          <ResponsiveCardGrid 
            desktopGridClass="grid md:grid-cols-3 gap-6 mb-8"
            className="mb-8"
          >
            <div className="glass-card p-4 sm:p-6 lg:p-8 text-center h-full flex flex-col">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Cognitive Diagnostic Framework</h3>
              <p className="text-sm text-muted-foreground">How we map leadership thinking patterns</p>
            </div>
            
            <div className="glass-card p-4 sm:p-6 lg:p-8 text-center h-full flex flex-col">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Mental Model Development</h3>
              <p className="text-sm text-muted-foreground">How practice builds cognitive infrastructure</p>
            </div>
            
            <div className="glass-card p-4 sm:p-6 lg:p-8 text-center h-full flex flex-col">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Decision Velocity Measurement</h3>
              <p className="text-sm text-muted-foreground">Track clarity improvements over time</p>
            </div>
          </ResponsiveCardGrid>
          
          <Button asChild variant="cta" size="lg">
            <a href="https://content.fractionl.ai/" target="_blank" rel="noopener noreferrer" className="group">
              Download Framework Guide
              <Download className="ml-2 h-5 w-5 group-hover:translate-y-0.5 transition-transform" />
            </a>
          </Button>
          
          <p className="text-sm text-muted-foreground mt-4">
            <span className="whitespace-nowrap">Free access to all frameworks</span><br className="sm:hidden" />
            <span className="hidden sm:inline"> • </span><span className="whitespace-nowrap">Partner licensing available</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContentHubSection;