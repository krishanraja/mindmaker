import { Button } from "@/components/ui/button";
import { ExternalLink, BookOpen } from "lucide-react";

const ContentHubSection = () => {
  return (
    <section className="section-padding bg-gradient-to-r from-accent/5 to-primary/5">
      <div className="container-width">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4 mr-2" />
              Free Thought Leadership
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mb-6 text-foreground">
              Start Your AI Journey with Our 
              <span className="text-primary"> Content Hub</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground max-w-3xl mx-auto">
              Get immediate access to curated AI insights, industry reports, and strategic frameworks. 
              See our expertise in action before we work together.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Industry Reports</h3>
              <p className="text-sm text-muted-foreground">Latest AI adoption trends and market insights</p>
            </div>
            
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Strategy Frameworks</h3>
              <p className="text-sm text-muted-foreground">Proven methodologies for AI implementation</p>
            </div>
            
            <div className="glass-card p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Expert Insights</h3>
              <p className="text-sm text-muted-foreground">Exclusive content from industry leaders</p>
            </div>
          </div>
          
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white font-semibold px-8 py-3 text-lg group">
            <a href="https://learning.fractionl.ai/" target="_blank" rel="noopener noreferrer">
              Access Content Hub
              <ExternalLink className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
          
          <p className="text-sm text-muted-foreground mt-4">
            Free access • No signup required • Updated weekly
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContentHubSection;