import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Calendar, CheckCircle } from "lucide-react";
import { ConsultationBooking } from "@/components/ConsultationBooking";

const BuilderSprint = () => {
  const weeks = [
    {
      week: "Week 0",
      title: "Intake",
      description: "Short form and a 45 minute call to map your current week, your 2026 targets and your main constraints.",
    },
    {
      week: "Week 1",
      title: "The Mirror",
      description: "We map the real work you do: writing, decisions, coaching, alignment, board prep, crisis moments. You see where time is really going and where AI can act as a thinking partner.",
    },
    {
      week: "Week 2",
      title: "The Systems",
      description: "We design and build your first set of support systems. Examples: briefing and decision templates, weekly review packs, board narrative engines.",
    },
    {
      week: "Week 3",
      title: "The Team",
      description: "We bring 1 to 3 of your key people into the picture. You run one live meeting or decision using the new systems. We capture what worked, what broke and what needs guardrails.",
    },
    {
      week: "Week 4",
      title: "The Charter",
      description: "We write a short charter and operating guide. You finish with a visible change in how you run your week and a draft playbook for your team.",
    },
  ];

  const deliverables = [
    "4 live sessions with Krish",
    "A written Builder Dossier that includes your new workflows, prompts and guardrails",
    "Simple metrics that track time saved, cycle time and decision quality",
    "Optional recorded clips for your own internal sharing",
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <section className="section-padding">
        <div className="container-width max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block bg-ink/10 text-ink px-4 py-2 rounded-full text-sm font-bold mb-6">
              FOR LEADERS
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              30-Day Builder Sprint
            </h1>
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
              <Calendar className="h-5 w-5" />
              <span className="text-lg">4 weeks</span>
            </div>
            <p className="text-xl text-foreground leading-relaxed max-w-3xl mx-auto">
              In 30 days you go from talking about AI to running a small set of working systems 
              that support how you think, decide and lead.
            </p>
          </div>
          
          {/* Who It's For */}
          <div className="minimal-card mb-12">
            <h2 className="text-2xl font-bold mb-4">Who It's For</h2>
            <p className="text-foreground leading-relaxed mb-4">
              A single senior leader with real authority over a slice of the business. 
              Often a CEO, GM, CCO, CPO, CRO or transformation owner.
            </p>
            <p className="text-foreground leading-relaxed">
              You are likely:
            </p>
            <ul className="space-y-2 text-foreground mt-4">
              <li>• Still handing most AI conversations to the tech team</li>
              <li>• Dipping into tools yourself but with no repeatable method</li>
              <li>• Frustrated that every AI meeting ends in a slide, not a change</li>
            </ul>
          </div>
          
          {/* Structure */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Structure</h2>
            <div className="space-y-4">
              {weeks.map((week, index) => (
                <div 
                  key={index} 
                  className="minimal-card fade-in-up"
                  style={{animationDelay: `${index * 0.05}s`}}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-20 h-20 bg-ink text-white rounded-md flex items-center justify-center">
                      <span className="text-sm font-bold">{week.week}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-2">{week.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{week.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* What You Get */}
          <div className="minimal-card mb-8">
            <h2 className="text-2xl font-bold mb-6">What You Get, Concretely</h2>
            <div className="space-y-4">
              {deliverables.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-mint flex-shrink-0 mt-0.5" />
                  <p className="text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Outcome */}
          <div className="minimal-card bg-muted/30 mb-8">
            <h2 className="text-2xl font-bold mb-4">Outcome in Plain Language</h2>
            <p className="text-foreground leading-relaxed mb-4">
              You leave with:
            </p>
            <ul className="space-y-3 text-foreground">
              <li>• 3 to 5 live workflows or systems built around your actual week</li>
              <li>• A personal prompt and system library tailored to how you think</li>
              <li>• A 90 day plan to extend this to your team without chaos</li>
              <li>• A clear story you can tell the board about where this is going</li>
            </ul>
          </div>
          
          {/* CTA */}
          <ConsultationBooking variant="default" />
        </div>
      </section>
      
      <Footer />
    </main>
  );
};

export default BuilderSprint;
