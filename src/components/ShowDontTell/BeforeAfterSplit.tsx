import { motion } from 'framer-motion';

const BeforeAfterSplit = () => {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container-width">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Before & After Mindmaker
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From drowning in AI noise to building with conviction
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* BEFORE */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="editorial-card space-y-6"
          >
            <div className="border-l-4 border-destructive pl-4">
              <h3 className="text-xl font-bold text-foreground mb-2">Before: Chaos</h3>
              <p className="text-sm text-muted-foreground">Overwhelmed by AI hype</p>
            </div>

            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive mt-2 flex-shrink-0" />
                <p>47 browser tabs about "AI strategy"</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive mt-2 flex-shrink-0" />
                <p>Conflicting vendor promises everywhere</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive mt-2 flex-shrink-0" />
                <p>Scattered notes across 5 apps</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive mt-2 flex-shrink-0" />
                <p>Endless AI meetings going nowhere</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive mt-2 flex-shrink-0" />
                <p>Team asking about AI news daily</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive mt-2 flex-shrink-0" />
                <p>Zero prototypes. Zero conviction.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground italic">
                "Everyone's talking about AI, but I don't know where to start or who to trust."
              </p>
            </div>
          </motion.div>

          {/* AFTER */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="premium-card space-y-6"
          >
            <div className="border-l-4 border-mint pl-4">
              <h3 className="text-xl font-bold text-foreground mb-2">After: Clarity</h3>
              <p className="text-sm text-muted-foreground">Building with conviction</p>
            </div>

            <div className="space-y-4 text-sm text-foreground">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-mint mt-2 flex-shrink-0" />
                <p>Clear decision framework that makes sense</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-mint mt-2 flex-shrink-0" />
                <p>Vendor evaluation criteria with BS detector</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-mint mt-2 flex-shrink-0" />
                <p>Working prototype in production</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-mint mt-2 flex-shrink-0" />
                <p>Confident narrative and boardroom prep</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-mint mt-2 flex-shrink-0" />
                <p>You're the one others DM for advice</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-mint mt-2 flex-shrink-0" />
                <p>Confidence to say "no" to shiny objects</p>
              </div>
            </div>

            <div className="pt-4 border-t border-mint/20">
              <p className="text-xs font-semibold text-green-700 dark:text-green-600">
                "I know exactly what we're building, why it matters, and how to get there."
              </p>
              <p className="text-xs font-bold text-foreground mt-2">
                Guarantee or your money back
              </p>
            </div>
          </motion.div>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            This isn't theory. It's what happens when you work with a practitioner who's been in your seat.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSplit;
