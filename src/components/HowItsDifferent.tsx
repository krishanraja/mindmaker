import { X, Check } from "lucide-react";

const HowItsDifferent = () => {
  const differences = [
    {
      icon: X,
      title: "Not a Course",
      description: "Everything revolves around real work, real decisions and real stakes. No slide decks that die in your email.",
    },
    {
      icon: X,
      title: "Not a Vendor Pitch",
      description: "There is no hidden software agenda. No upselling to tools you don't need.",
    },
    {
      icon: Check,
      title: "Not AI Replacing You",
      description: "The goal is to make the human better, not invisible. You stay in the driver's seat.",
    },
  ];

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-width">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            How It's Different
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {differences.map((diff, index) => {
            const IconComponent = diff.icon;
            const isCheck = diff.icon === Check;
            
            return (
              <div 
                key={index}
                className="minimal-card text-center fade-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  isCheck ? 'bg-mint/10' : 'bg-destructive/10'
                }`}>
                  <IconComponent className={`h-6 w-6 ${
                    isCheck ? 'text-mint' : 'text-destructive'
                  }`} />
                </div>
                
                <h3 className="text-lg font-bold text-foreground mb-3">
                  {diff.title}
                </h3>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {diff.description}
                </p>
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-12 max-w-3xl mx-auto">
          <div className="minimal-card bg-ink text-white p-6">
            <p className="text-lg font-semibold">
              Built by a practitioner: Krish has run P&Ls, built markets, sold and delivered 
              AI and data products, and now spends his time inside real leadership rooms.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItsDifferent;
