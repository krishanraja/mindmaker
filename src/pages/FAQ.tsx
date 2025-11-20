import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const navigate = useNavigate();

  // SEO meta tags
  useEffect(() => {
    document.title = "FAQ - AI Literacy Infrastructure Questions | Mindmaker";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Frequently asked questions about Mindmaker's AI literacy infrastructure, cognitive diagnostics, mental models, and how leaders build the thinking infrastructure to stay sharp and in control.");
    }

    // Add structured data for FAQ
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqCategories.flatMap(category => 
        category.questions.map(item => ({
          "@type": "Question",
          "name": item.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.a
          }
        }))
      )
    });
    document.head.appendChild(script);

    return () => {
      document.title = "Mindmaker";
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const faqCategories = [
    {
      category: "About Mindmaker",
      questions: [
        {
          q: "What is Mindmaker?",
          a: "Mindmaker is AI literacy infrastructure for leaders making high-stakes decisions. It's not a course or consulting—it's the cognitive scaffolding that helps you think clearly about AI, spot vendor theatre vs substance, and make better decisions when AI is involved. You get mental models, diagnostic baselines, and practice on real decisions until thinking patterns become instinct."
        },
        {
          q: "How is this different from AI courses or consulting?",
          a: "Courses teach theory that fades within weeks. Consulting tells you what to do. Tools do the work for you. Mindmaker builds the thinking infrastructure so you can evaluate all of them. It's cognitive scaffolding—not knowledge transfer. You leave with better mental models, sharper questions for vendors, and the ability to spot what's real vs hype."
        },
        {
          q: "Who is this for?",
          a: "Three audiences: (1) Individual leaders making AI decisions without clear mental models, (2) Executive teams that need aligned cognitive infrastructure to stop talking past each other, and (3) Partners (VCs, PE, consultants) who need to de-risk AI spend across portfolio companies by upgrading leadership thinking before they fund pilots."
        },
        {
          q: "What results should I expect?",
          a: "You'll make better AI decisions faster—cleaner capital allocation, less wasted spend on vendor theatre, higher confidence in strategic conversations, and the ability to spot which pilots will scale vs stall. Most importantly, you build cognitive infrastructure that persists and compounds, not one-time knowledge that fades."
        }
      ]
    },
    {
      category: "The Diagnostic Process",
      questions: [
        {
          q: "What is the cognitive diagnostic?",
          a: "A structured assessment that maps how you currently think and decide when AI is involved. It surfaces tensions, blind spots, and decision patterns—not just 'scores.' You get a baseline showing where you stand vs where you think you stand, plus specific mental models you need to upgrade your thinking."
        },
        {
          q: "How long does the diagnostic take?",
          a: "The initial baseline diagnostic takes 5 minutes. It's designed to reveal cognitive patterns quickly, not test knowledge. You'll receive immediate insights plus a roadmap showing which mental models to build first based on your actual decision context."
        },
        {
          q: "Can I retake it to track progress?",
          a: "Yes. We recommend quarterly diagnostics to track how your mental models evolve. The goal isn't a higher 'score'—it's seeing how your decision velocity, clarity, and ability to spot substance vs theatre improve over time."
        },
        {
          q: "What happens after I complete the diagnostic?",
          a: "You'll see your cognitive baseline, key tensions in how you think about AI, and 2-3 immediate mental models you can use. If you want deeper infrastructure, you can upgrade to a 90-day cognitive sprint with structured practice on real decisions until patterns become instinct."
        }
      ]
    },
    {
      category: "How It Works",
      questions: [
        {
          q: "What does 'cognitive infrastructure' actually mean?",
          a: "It means the mental scaffolding that lets you evaluate AI claims, make cleaner decisions, and spot what's real. Most leaders operate from vendor hype and media headlines. Cognitive infrastructure gives you your own framework—mental models you can re-use every week on real work."
        },
        {
          q: "What are 'mental models' in this context?",
          a: "Reusable thinking patterns that help you evaluate AI decisions. Examples: 'Can this scale beyond a demo?', 'Is this compounding or one-off?', 'What's the failure mode if the model hallucinates?' They're the questions and frameworks that separate substance from theatre."
        },
        {
          q: "How does the practice component work?",
          a: "You apply mental models to your actual work—real decisions, real constraints, real stakes. No fake scenarios or toy problems. Practice happens in a safe environment where you can test assumptions, make mistakes, and refine your thinking until it's instinct. That's what makes it infrastructure, not just knowledge."
        },
        {
          q: "Do I need technical AI expertise?",
          a: "No. This isn't about learning to code or build models. It's about upgrading how you think and decide when AI is on the table. You need to be making decisions about AI—strategy, vendor selection, pilot priorities, resource allocation. The technical details stay with your team."
        }
      ]
    },
    {
      category: "Pathways & Engagement",
      questions: [
        {
          q: "What pathways are available?",
          a: "Three paths: (1) Leaders—Individual cognitive diagnostic with optional 90-day sprint to build mental infrastructure ($5K-$10K), (2) Teams—Alignment session to surface where your leadership team actually stands and build shared mental models (custom), (3) Partners—Portfolio cognitive diagnostic across 1-10 companies to de-risk AI spend (custom)."
        },
        {
          q: "How long does it take?",
          a: "Leaders: 90-day cognitive sprint. Teams: One intensive alignment session plus 90-day integration. Partners: Initial portfolio diagnostic plus quarterly check-ins. All are designed to build infrastructure that persists, not deliver one-time sessions that fade."
        },
        {
          q: "Can I start with just the free diagnostic?",
          a: "Yes. The free diagnostic gives you a cognitive baseline and immediate mental models you can use. Many leaders start there to see if the infrastructure approach resonates before committing to a full sprint."
        },
        {
          q: "Can I upgrade later?",
          a: "Absolutely. Many start with the individual diagnostic, then bring their team once they see value. Partners often pilot with 2-3 portfolio companies before scaling across their full portfolio."
        }
      ]
    },
    {
      category: "Investment & Value",
      questions: [
        {
          q: "What does this cost?",
          a: "Leaders: $5K-$10K for 90-day cognitive sprint. Teams: Custom based on team size and depth of alignment needed. Partners: Custom based on portfolio size. All pricing is tied to de-risking AI decisions—less wasted capital on pilots that stall, faster decisions, cleaner vendor evaluations."
        },
        {
          q: "Why is this better than free AI courses?",
          a: "Free courses teach concepts that fade. Mindmaker builds cognitive infrastructure that persists. You're not paying for information—you're paying for mental scaffolding, practice on real decisions, and the ability to think for yourself instead of relying on vendor claims or media hype."
        },
        {
          q: "What's the ROI?",
          a: "Better AI decisions = less wasted capital. Most leaders waste $50K-$150K on pilots that stall because they couldn't spot theatre vs substance. Mindmaker helps you see clearly before you spend. Plus: faster decision velocity, stronger board conversations, and cognitive infrastructure that compounds every quarter."
        },
        {
          q: "Do you offer payment plans?",
          a: "Yes. Individual sprints can be paid upfront or split. Team and partner engagements typically use milestone-based schedules aligned with cognitive infrastructure development phases."
        }
      ]
    },
    {
      category: "Getting Started",
      questions: [
        {
          q: "How do I start?",
          a: "Take the free 5-minute cognitive diagnostic at the top of the homepage. You'll get immediate insights showing where you stand vs where you think you stand, plus mental models you can use today. If you want deeper infrastructure, you can book a strategy call to discuss a 90-day sprint."
        },
        {
          q: "Is there a demo or trial?",
          a: "The free cognitive diagnostic is your trial. It shows you how we map thinking patterns, surface tensions, and deliver mental models—not just concepts. After completing it, you'll know if the cognitive infrastructure approach fits your needs."
        },
        {
          q: "What if I'm not sure which path is right?",
          a: "Start with the diagnostic. Your results will clarify whether you need individual practice, team alignment, or portfolio-level infrastructure. You can also book a strategy call to discuss your specific situation."
        },
        {
          q: "Do you work internationally?",
          a: "Yes. All engagements are virtual and designed to work across time zones, industries, and company sizes. The mental models and cognitive infrastructure apply regardless of geography."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
        <div className="container-width py-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-8 p-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <header className="text-center mb-12 fade-in-up">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Frequently Asked Questions
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to know about Mindmaker's AI literacy infrastructure and how to build cognitive scaffolding for better decisions.
              </p>
            </header>

            {/* FAQ Categories */}
            <div className="space-y-8">
              {faqCategories.map((category, categoryIndex) => (
                <section 
                  key={categoryIndex}
                  className="fade-in-up"
                  style={{animationDelay: `${categoryIndex * 0.1}s`}}
                  aria-labelledby={`category-${categoryIndex}`}
                >
                  <h2 
                    id={`category-${categoryIndex}`}
                    className="text-2xl font-bold mb-4 text-primary"
                  >
                    {category.category}
                  </h2>
                  
                  <Accordion type="single" collapsible className="space-y-2">
                    {category.questions.map((item, questionIndex) => (
                      <AccordionItem 
                        key={questionIndex} 
                        value={`item-${categoryIndex}-${questionIndex}`}
                        className="glass-card border-none"
                      >
                        <AccordionTrigger className="px-6 py-4 text-left hover:no-underline group">
                          <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {item.q}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4 text-muted-foreground leading-relaxed">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>
              ))}
            </div>

            {/* CTA Section */}
            <div className="glass-card p-8 md:p-12 text-center mt-16 fade-in-up">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Still Have Questions?
              </h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Book a 30-minute strategy call to discuss your specific AI decision-making context and which cognitive infrastructure path makes sense for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="hero-primary" 
                  size="lg"
                  onClick={() => window.open('https://calendly.com/krishsubramanian/ai-leadership-consultation', '_blank')}
                >
                  Book Strategy Call
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => window.location.href = 'mailto:krish@themindmaker.ai?subject=FAQ Inquiry'}
                >
                  Email Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default FAQ;