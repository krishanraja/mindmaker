import { ArrowLeft, ChevronDown } from "lucide-react";
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
    document.title = "FAQ - AI Leadership Questions Answered | The Mindmaker";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Frequently asked questions about The Mindmaker System, AI Leadership Index, coaching programs, pricing, and how to transform from AI-aware to AI-capable.");
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
      document.title = "The Mindmaker";
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const faqCategories = [
    {
      category: "About The Mindmaker System",
      questions: [
        {
          q: "What is The Mindmaker System?",
          a: "The Mindmaker System is a comprehensive AI leadership infrastructure designed to transform executives and teams from AI-aware to AI-capable. Unlike traditional AI literacy programs, we focus on building measurable capability systems that compound over time through our proprietary Literacy-to-Leverage Loop™ framework."
        },
        {
          q: "How is Mindmaker different from other AI training programs?",
          a: "Most AI training programs focus on awareness and tool demonstrations that fade within weeks. Mindmaker builds leadership capability infrastructure with three key differentiators: (1) The AI Leadership Index™ for baseline measurement and progress tracking, (2) The Literacy-to-Leverage Loop™ for compounding capability development, and (3) Custom leadership protocols that integrate directly into your existing workflows."
        },
        {
          q: "Who is Mindmaker designed for?",
          a: "Mindmaker serves three primary audiences: (1) Individual Leaders seeking to benchmark and accelerate their AI leadership capabilities, (2) Executive Teams building strategic AI capability across C-suite functions, and (3) Portfolio Partners deploying AI infrastructure at scale across multiple portfolio companies."
        },
        {
          q: "What results can I expect from The Mindmaker System?",
          a: "Our clients typically see: 3-6 month acceleration in AI capability development, measurable improvements in AI Leadership Index scores, successful transformation of 70%+ of GenAI pilots from stalled to scaling, and the establishment of compounding capability systems that continue to deliver value long after initial implementation."
        }
      ]
    },
    {
      category: "AI Leadership Index™",
      questions: [
        {
          q: "What is the AI Leadership Index?",
          a: "The AI Leadership Index™ is a proprietary assessment framework that measures AI leadership capability across multiple dimensions: strategic vision, operational readiness, team capability, and execution infrastructure. It provides a baseline score and tracking mechanism to measure real progress over time."
        },
        {
          q: "How long does the AI Leadership Index assessment take?",
          a: "The initial assessment takes approximately 30-45 minutes to complete. It includes both quantitative measurements and qualitative evaluation across key leadership dimensions. Results are delivered with a comprehensive report and personalized recommendations."
        },
        {
          q: "Can I retake the AI Leadership Index to track progress?",
          a: "Yes! We recommend quarterly reassessments to track capability development over time. This creates a data-driven feedback loop that shows measurable improvement and identifies areas requiring additional focus."
        },
        {
          q: "Is the AI Leadership Index scientifically validated?",
          a: "The AI Leadership Index™ is built on frameworks refined through 200+ AI literacy accelerations, backed by research from leading institutions, and continuously validated through real-world executive outcomes. It measures capability infrastructure, not just knowledge retention."
        }
      ]
    },
    {
      category: "Programs & Pathways",
      questions: [
        {
          q: "What pathways are available?",
          a: "We offer three primary pathways: (1) Leaders Pathway - Individual AI Leadership Index benchmark and accelerated capability development ($2,500-$5,000), (2) Executive Teams Pathway - Full team capability building with custom protocols (3-6 months, $15K-$35K), and (3) Portfolio Partners - Scaled deployment across multiple companies (Annual, Custom pricing)."
        },
        {
          q: "How long does the coaching program take?",
          a: "Program duration varies by pathway: Individual leaders typically engage for 3 months, executive teams for 3-6 months, and portfolio partners operate on annual engagements with quarterly milestones. All programs are designed to build compounding capability, not just deliver one-time training."
        },
        {
          q: "Do you offer custom programs for enterprise clients?",
          a: "Yes! Our Executive Teams and Portfolio Partners pathways are fully customizable. We design capability infrastructure specific to your industry, technology stack, organizational structure, and strategic objectives. Contact us to discuss your specific requirements."
        },
        {
          q: "Can I upgrade from one pathway to another?",
          a: "Absolutely. Many clients start with the Individual Leaders pathway to establish a baseline, then expand to Executive Teams as they see results. Portfolio partners often begin with pilot deployments before scaling across their full portfolio."
        }
      ]
    },
    {
      category: "Coaching & Support",
      questions: [
        {
          q: "Who is my coach?",
          a: "All coaching is led by Krish Subramanian, founder of The Mindmaker System. Krish brings expertise from leading AI literacy accelerations with 200+ executives, teaching at Stanford, and designing capability systems for Fortune 500 companies and VC-backed startups."
        },
        {
          q: "How often do coaching sessions occur?",
          a: "Session frequency is customized to your pathway and objectives. Individual leaders typically have bi-weekly sessions, executive teams meet weekly during intensive capability building phases, and portfolio partners have quarterly strategic reviews with ongoing asynchronous support."
        },
        {
          q: "What happens between coaching sessions?",
          a: "Between sessions, you'll implement leadership protocols, complete capability-building exercises, and track progress through the Literacy-to-Leverage Loop™. You'll also have access to our content library, implementation frameworks, and asynchronous support through our platform."
        },
        {
          q: "Do you offer group coaching or peer learning?",
          a: "Executive Teams pathways include peer learning components. Portfolio partners gain access to exclusive cross-portfolio sessions where leaders share insights and strategies. We also host quarterly webinars and workshops for all active clients."
        }
      ]
    },
    {
      category: "Investment & ROI",
      questions: [
        {
          q: "How much does Mindmaker cost?",
          a: "Investment varies by pathway: Individual Leaders ($2,500-$5,000), Executive Teams ($15K-$35K over 3-6 months), Portfolio Partners (Custom, typically $20K-$50K annually). All programs are designed to deliver measurable ROI through accelerated capability development and improved AI initiative success rates."
        },
        {
          q: "Do you offer payment plans?",
          a: "Yes, we offer flexible payment structures for all pathways. Individual programs can be paid upfront or split across program duration. Executive Teams and Portfolio Partners typically use milestone-based payment schedules aligned with capability development phases."
        },
        {
          q: "What's included in the program fee?",
          a: "All pathways include: AI Leadership Index assessment(s), one-on-one coaching with Krish, custom capability protocols, access to proprietary frameworks and content library, implementation support, and progress tracking tools. Executive Teams and Portfolio Partners receive additional strategic planning, team workshops, and executive reporting."
        },
        {
          q: "What kind of ROI can I expect?",
          a: "Clients typically see ROI through: 3-6 month acceleration in AI capability development (equivalent to $50K-$150K in accelerated productivity), improved GenAI pilot success rates (70%+ stall rate reduced to 20-30%), and establishment of compounding capability infrastructure that continues delivering value indefinitely."
        }
      ]
    },
    {
      category: "Getting Started",
      questions: [
        {
          q: "How do I get started?",
          a: "Begin by taking the AI Leadership Index assessment to establish your baseline. After completing the assessment, you'll receive a comprehensive report with personalized recommendations and pathway options. Schedule a discovery call to discuss which pathway aligns best with your objectives."
        },
        {
          q: "Is there a free trial or demo?",
          a: "We offer a complimentary 30-minute strategic consultation where we review your AI leadership objectives, discuss pathway options, and provide initial recommendations. This helps ensure Mindmaker is the right fit for your specific needs before making an investment."
        },
        {
          q: "What if I'm not sure which pathway is right for me?",
          a: "Start with the AI Leadership Index assessment - your results will clarify which pathway aligns best with your current capability level and development goals. You can also schedule a discovery call to discuss your specific situation and receive personalized pathway recommendations."
        },
        {
          q: "Do you work with international clients?",
          a: "Yes! We work with leaders and teams globally. All coaching sessions are conducted virtually, and our frameworks are designed to work across different industries, company sizes, and geographic regions. Time zone differences are accommodated through flexible scheduling."
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
                Everything you need to know about The Mindmaker System, AI Leadership Index, 
                and how to accelerate your AI leadership capability.
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
                Schedule a complimentary 30-minute strategic consultation to discuss 
                your specific AI leadership objectives and pathway options.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="hero-primary" 
                  size="lg"
                  onClick={() => window.open('https://calendly.com/krishsubramanian/ai-leadership-consultation', '_blank')}
                >
                  Schedule Consultation
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
