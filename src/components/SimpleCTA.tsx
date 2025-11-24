import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const SimpleCTA = () => {
  return (
    <section className="section-padding bg-ink text-white">
      <div className="container-width">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Building?
          </h2>
          
          <p className="text-xl text-white/80 leading-relaxed mb-8">
            Book a 60-minute Builder Session with Krish. 
            Bring one real leadership problem. 
            Leave with working systems.
          </p>
          
          <Button 
            size="lg"
            className="bg-mint text-ink hover:bg-mint/90 font-semibold px-12 py-6 text-lg touch-target group"
            onClick={() => window.open('https://calendly.com/krish-raja/mindmaker-meeting', '_blank')}
          >
            Book Your Builder Session
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <p className="text-sm text-white/60 mt-6">
            No prep required. Just bring your real work.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SimpleCTA;
