import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import krishHeadshot from "@/assets/krish-headshot.png";
import { InitialConsultModal } from "@/components/InitialConsultModal";

const SimpleCTA = () => {
  const [consultModalOpen, setConsultModalOpen] = useState(false);

  return (
    <>
      <InitialConsultModal 
        open={consultModalOpen} 
        onOpenChange={setConsultModalOpen}
      />
    <section className="section-padding bg-ink text-white">
      <div className="container-width">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <img 
              src={krishHeadshot} 
              alt="Krish Raja" 
              className="w-48 h-48 rounded-full border-4 border-mint/20"
              loading="eager"
            />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Building?
          </h2>
          
          <p className="text-xl text-white/80 leading-relaxed mb-8">
            "Businesses with AI literate leaders will set the pace in 2026 - and the rest will have to keep up with them"
            <span className="block mt-2 text-lg">-Krish Raja, Founder</span>
          </p>
          
          <Button 
            size="lg"
            className="bg-mint text-ink hover:bg-mint/90 font-semibold px-12 py-6 text-lg touch-target group"
            onClick={() => setConsultModalOpen(true)}
          >
            Book Your Initial Consult
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <p className="text-sm text-white/60 mt-6">
            No prep required. Just bring your real work.
          </p>
        </div>
      </div>
    </section>
    </>
  );
};

export default SimpleCTA;
