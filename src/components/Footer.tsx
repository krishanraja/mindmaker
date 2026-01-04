import { ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-background border-t border-border/50 pt-16 sm:pt-20 pb-24 sm:pb-32 z-20">
      <div className="container-width">
        <div className="flex flex-col gap-16">
          {/* Main Footer Content - Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 lg:gap-20">
            {/* Copyright Section */}
            <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                © 2025 Mindmaker LLC. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Helping leaders become AI-literate through building, not training.
              </p>
            </div>
            
            {/* Executive Advisory */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">
                Executive Advisory
              </h4>
              <nav className="flex flex-col gap-3">
                <a 
                  href="/builder-session" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out hover:underline underline-offset-4"
                >
                  Builder Session
                </a>
                <a 
                  href="/builder-sprint" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out hover:underline underline-offset-4"
                >
                  30-Day Sprint
                </a>
                <a 
                  href="/leadership-lab" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out hover:underline underline-offset-4"
                >
                  Leadership Lab
                </a>
                <a 
                  href="/portfolio-program" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out hover:underline underline-offset-4"
                >
                  Portfolio Program
                </a>
              </nav>
            </div>

            {/* Learning & Content */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">
                Learning & Content
              </h4>
              <nav className="flex flex-col gap-3">
                <a 
                  href="/blog" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out hover:underline underline-offset-4"
                >
                  Blog
                </a>
                <a 
                  href="https://maven.com/aimindmaker/ai-literacy-to-strategy-for-leaders" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out hover:underline underline-offset-4 inline-flex items-center gap-1"
                >
                  Cohorts
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a 
                  href="https://www.content.themindmaker.ai" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out hover:underline underline-offset-4 inline-flex items-center gap-1"
                >
                  Live Learnings
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a 
                  href="https://www.thebuildereconomy.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out hover:underline underline-offset-4 inline-flex items-center gap-1"
                >
                  Podcast
                  <ExternalLink className="h-3 w-3" />
                </a>
              </nav>
            </div>

            {/* Company */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">
                Company
              </h4>
              <nav className="flex flex-col gap-3">
                <a 
                  href="/faq" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out hover:underline underline-offset-4"
                >
                  FAQ
                </a>
                <a 
                  href="/privacy" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out hover:underline underline-offset-4"
                >
                  Privacy
                </a>
                <a 
                  href="/terms" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out hover:underline underline-offset-4"
                >
                  Terms
                </a>
                <a 
                  href="/contact" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out hover:underline underline-offset-4"
                >
                  Contact
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
