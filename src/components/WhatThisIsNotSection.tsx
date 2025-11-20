import { X, Check } from "lucide-react";

const WhatThisIsNotSection = () => {
  const notItems = [
    "AI implementation consulting",
    "A ChatGPT quiz wrapper",
    "Prompt tricks or hype sessions",
    "Another slide deck that dies in email",
  ];

  const isItems = [
    "A way to see through AI hype and make better calls",
    "Questions you'll actually use when vendors pitch you",
    "Practice with your real work until it clicks",
    "Confidence in rooms where everyone's bluffing about AI",
  ];

  return (
    <section className="section-padding bg-muted/50">
      <div className="container-width max-w-4xl">
        <div className="text-center mb-12 fade-in-up">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">
            What This <span className="text-primary">Is Not</span>
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
            Let's be clear about what Mindmaker isn't—and what it actually delivers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 fade-in-up">
          {/* What This Is NOT */}
          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <X className="h-5 w-5 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold">This Is NOT</h3>
            </div>
            <ul className="space-y-4">
              {notItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <X className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What This IS */}
          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">This IS</h3>
            </div>
            <ul className="space-y-4">
              {isItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center mt-8 fade-in-up">
          <p className="text-sm text-muted-foreground italic">
            You don't need more AI hype. You need a way to think clearly about it.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhatThisIsNotSection;