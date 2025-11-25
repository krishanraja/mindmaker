import { motion } from "framer-motion";
import { useRef } from "react";
import { useScrollTrigger } from "@/hooks/useScrollTrigger";
import { BuilderAssessment } from "@/components/Interactive/BuilderAssessment";
import { FrictionMapBuilder } from "@/components/Interactive/FrictionMapBuilder";
import { TryItWidget } from "@/components/Interactive/AIDecisionHelper";
import { User, Lightbulb, Map } from "lucide-react";

const TheProblem = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { elementRef: triggerRef, isVisible } = useScrollTrigger({ threshold: 0.2 });

  return (
    <section 
      ref={sectionRef}
      className="section-padding bg-muted/30 relative overflow-hidden"
    >
      <div ref={triggerRef as any} className="container-width">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              The Weight You're Carrying
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Choose how you want to get unstuck
            </p>
          </motion.div>

          {/* 3-Column Interactive Command Centre */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {/* Module 1: Builder Profile Quiz */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col"
            >
              <div className="minimal-card flex-1 flex flex-col p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-mint/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-mint" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Builder Profile Quiz</h3>
                    <p className="text-xs text-muted-foreground">60-second assessment</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Where are you on your AI journey? Take a quick assessment to get personalized recommendations.
                </p>
                <div className="mt-auto">
                  <BuilderAssessment compact={true} />
                </div>
              </div>
            </motion.div>

            {/* Module 2: AI Decision Helper */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col"
            >
              <div className="minimal-card flex-1 flex flex-col p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-mint/20 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-mint" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">AI Decision Helper</h3>
                    <p className="text-xs text-muted-foreground">Instant clarity</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Stuck on an AI decision? Get structured advice and a clear next step right now.
                </p>
                <div className="mt-auto">
                  <TryItWidget compact={true} />
                </div>
              </div>
            </motion.div>

            {/* Module 3: Friction Map Builder */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col"
            >
              <div className="minimal-card flex-1 flex flex-col p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-mint/20 flex items-center justify-center">
                    <Map className="w-5 h-5 text-mint" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Friction Map Builder</h3>
                    <p className="text-xs text-muted-foreground">Map your time sink</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Visualize your biggest friction point and see how AI can help you reclaim your time.
                </p>
                <div className="mt-auto">
                  <FrictionMapBuilder compact={true} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheProblem;
