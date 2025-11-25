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
              <h3 className="text-xl font-bold text-foreground mb-2">Week 0: Chaos</h3>
              <p className="text-sm text-muted-foreground">Overwhelmed by AI hype</p>
            </div>

            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive mt-2 flex-shrink-0" />
                <p>47 browser tabs open about "AI strategy"</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive mt-2 flex-shrink-0" />
                <p>Conflicting vendor whitepapers promising everything</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive mt-2 flex-shrink-0" />
                <p>Scattered notes across 5 different apps</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive mt-2 flex-shrink-0" />
                <p>Calendar packed with "AI alignment meetings" going nowhere</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive mt-2 flex-shrink-0" />
                <p>Team asking "Did you see this AI news?" every day</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive mt-2 flex-shrink-0" />
                <p>Zero working prototypes. Zero conviction.</p>
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
              <h3 className="text-xl font-bold text-foreground mb-2">Week 4: Clarity</h3>
              <p className="text-sm text-muted-foreground">Building with conviction</p>
            </div>

            <div className="space-y-4 text-sm text-foreground">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-mint mt-2 flex-shrink-0" />
                <p>Single organized decision framework (that actually makes sense)</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-mint mt-2 flex-shrink-0" />
                <p>Clear vendor evaluation criteria (no BS detector built-in)</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-mint mt-2 flex-shrink-0" />
                <p>Working prototype in production (real users, real feedback)</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-mint mt-2 flex-shrink-0" />
                <p>Calendar: "AI Wins" blocks replacing endless alignment</p>
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
              <p className="text-xs font-semibold text-mint">
                "I know exactly what we're building, why it matters, and how to get there."
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
