const ValuePropsSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-width">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4 fade-in-up">
            <div className="text-mint text-sm font-semibold uppercase tracking-wider">For Individual Leaders</div>
            <h3 className="text-xl font-bold text-foreground">Builder Session</h3>
            <p className="text-muted-foreground leading-relaxed">
              Walk in unclear. Walk out with a working prototype. 90 minutes, your problem, real code.
            </p>
          </div>
          <div className="text-center space-y-4 fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="text-mint text-sm font-semibold uppercase tracking-wider">For Executive Teams</div>
            <h3 className="text-xl font-bold text-foreground">Leadership Lab</h3>
            <p className="text-muted-foreground leading-relaxed">
              Upskill your team. Build AI literacy. Make better decisions faster, together.
            </p>
          </div>
          <div className="text-center space-y-4 fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-mint text-sm font-semibold uppercase tracking-wider">For Partners</div>
            <h3 className="text-xl font-bold text-foreground">Partner Program</h3>
            <p className="text-muted-foreground leading-relaxed">
              Deliver real AI value to your clients. White-label or co-brand. No vendor risk.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuePropsSection;
