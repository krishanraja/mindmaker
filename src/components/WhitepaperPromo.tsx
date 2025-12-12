import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import whitepaperCover from "@/assets/whitepaper-cover-2026.png";

const WhitepaperPromo = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8 items-center bg-card border-2 border-border rounded-lg p-4 md:p-8 shadow-lg">
          {/* Cover Image - Left */}
          <div className="relative flex justify-center md:block">
            <div className="transform md:rotate-[-3deg] md:hover:rotate-0 transition-transform duration-300 max-w-[200px] mx-auto md:max-w-none">
              <img
                src={whitepaperCover}
                alt="Resolving The AI Literacy Crisis in 2026 Whitepaper Cover"
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
          </div>

          {/* Content - Right */}
          <div className="space-y-3 md:space-y-4">
            <div className="inline-block">
              <span className="px-3 py-1 bg-ink text-white dark:bg-white dark:text-ink rounded-full text-sm font-semibold">
                Featured Report
              </span>
            </div>
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
              Resolving The AI Literacy Crisis in 2026
            </h2>
            
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Discover the critical insights and frameworks leaders need to bridge the AI knowledge gap in their organizations. Learn why 95% of enterprise AI initiatives fail and how to ensure yours succeeds.
            </p>

            <Button
              variant="mint"
              size="lg"
              className="w-full md:w-auto"
              asChild
            >
              <a
                href="https://docsend.com/view/uybrzhx75fcwp2n7"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                Download Free Report
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhitepaperPromo;
