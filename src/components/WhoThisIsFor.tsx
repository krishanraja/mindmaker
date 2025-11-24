const WhoThisIsFor = () => {
  const roles = [
    { title: "CEO", description: "Chief Executive Officer" },
    { title: "GM", description: "General Manager" },
    { title: "CCO", description: "Chief Commercial Officer" },
    { title: "CPO", description: "Chief Product Officer" },
    { title: "CMO", description: "Chief Marketing Officer" },
    { title: "CRO", description: "Chief Revenue Officer" },
    { title: "COO", description: "Chief Operating Officer" },
    { title: "Strategy", description: "Strategy & Transformation Leads" },
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container-width">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Who This Is For
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Leaders and founders who are accountable for growth, transformation or margins. 
            Tired of decks about AI with no decisions, no pilots and no visible uplift. 
            Feel behind but know they are capable of learning fast. 
            Want to build, not just buy, the next era of their business.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {roles.map((role, index) => (
            <div 
              key={index}
              className="minimal-card text-center fade-in-up"
              style={{animationDelay: `${index * 0.05}s`}}
            >
              <div className="text-2xl font-bold text-primary mb-1">{role.title}</div>
              <div className="text-xs text-muted-foreground">{role.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoThisIsFor;
