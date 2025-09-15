const ProblemSection = () => {
  const problems = [
    {
      stat: "88%",
      description: "AI proof-of-concepts never reach production",
    },
    {
      stat: "74%", 
      description: "Companies fail to achieve meaningful AI value",
    },
    {
      stat: "60%",
      description: "Workers need occupational transition by 2030",
    },
    {
      stat: "Only 26%",
      description: "Can scale AI beyond pilot purgatory",
    },
  ];

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title text-primary mb-6">
              Stop Losing to AI-First Competitors
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Team AI literacy is the missing piece in enterprise AI adoption, whilst AI product 
              strategy usually goes missing - creating opportunity for emerging competitors to displace incumbents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {problems.map((problem, index) => (
              <div 
                key={index} 
                className="bg-card rounded-xl p-8 shadow-soft hover:shadow-strong transition-all duration-300 group"
              >
                <div className="text-center">
                  <div className="stat-number text-destructive mb-4 group-hover:scale-105 transition-transform">
                    {problem.stat}
                  </div>
                  <p className="text-muted-foreground text-lg">
                    {problem.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-primary/10 rounded-2xl p-8 md:p-12 text-center">
            <blockquote className="text-2xl md:text-3xl font-semibold text-primary mb-6">
              "AI won't replace managers – but managers who understand AI will replace those who don't."
            </blockquote>
            <p className="text-xl text-muted-foreground">
              The choice is simple: Transform your business before AI-first competitors transform your market.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;