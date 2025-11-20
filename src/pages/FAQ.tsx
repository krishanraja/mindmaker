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

  useEffect(() => {
    document.title = "FAQ - Mindmaker";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Frequently asked questions about Mindmaker—how to think clearly about AI, make better decisions, and stop wasting money on vendor theatre.");
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    });
    document.head.appendChild(script);

    return () => {
      document.title = "Mindmaker";
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const faqItems = [
    {
      question: "What is Mindmaker?",
      answer: "Most leaders feel pressure to 'do something with AI'—but don't know how to separate real opportunities from vendor hype. Mindmaker helps you see clearly, so you can make better decisions and stop wasting money on theatre."
    },
    {
      question: "How does the diagnostic work?",
      answer: "It takes 2 minutes. You answer a few questions about how you currently think about AI. We show you where the gaps are—and what to do about them. No scoring, no judgment, just clarity."
    },
    {
      question: "Who is this for?",
      answer: "Leaders making AI decisions but not sure what to actually do. If you're nodding along in vendor demos, funding pilots that go nowhere, or watching your team all think differently about AI—this is for you. Works for individual execs, leadership teams, or partners with portfolios."
    },
    {
      question: "What do I actually get?",
      answer: "A way to see where you stand. Frameworks to evaluate AI claims. Questions you'll use when vendors pitch you. Practice on your real decisions until it sticks. Confidence to make calls without second-guessing yourself."
    },
    {
      question: "How is this different from AI training or consulting?",
      answer: "Training fades after a few weeks. Consulting tells you what to do but doesn't upgrade how you think. Tools do the work for you. We build the system so you can think for yourself—spot theatre, make better calls, stop wasting money."
    },
    {
      question: "What's the investment?",
      answer: "Free diagnostics to start—see where you stand before committing. 12-week Sprint is $6,500. 90-day Accelerator is $18,000. Portfolio partnerships are custom. Real question: what's the cost of another failed pilot because you couldn't tell substance from sales pitch?"
    },
    {
      question: "What if my team isn't aligned on AI?",
      answer: "That's exactly what we fix. Most teams have people excited, people skeptical, and everyone using different words. Our Team Alignment tool surfaces those gaps, builds shared vocabulary, and gets everyone on the same page. You can't execute on AI when your team doesn't agree on what AI even means."
    },
    {
      question: "How long does it take to see results?",
      answer: "You'll have better questions for vendors within the first week. Ways to evaluate pilots by week 3. Making decisions faster by week 8. It sticks—doesn't fade like workshops. Leaders report making AI decisions 3x faster with more confidence after the Sprint."
    },
    {
      question: "Can I try before committing to a full program?",
      answer: "Yes. Start with a free diagnostic (2 minutes for individuals, 15 minutes for teams). You'll see where you stand, what's missing, and whether the full Sprint makes sense. No pressure, no sales pitch. Just clarity."
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
          <header className="text-center mb-12 fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about thinking clearly about AI and making better decisions.
            </p>
          </header>

          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="glass-card border-none fade-in-up"
                style={{animationDelay: `${index * 0.05}s`}}
              >
                <AccordionTrigger className="px-6 py-4 text-left hover:no-underline group">
                  <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {item.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="glass-card p-8 md:p-12 text-center mt-16 fade-in-up">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Still Have Questions?
            </h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Book a call to talk through your situation and what makes sense for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero-primary" 
                size="lg"
                onClick={() => window.open('https://calendly.com/krish-raja/mindmaker-meeting', '_blank')}
              >
                Book a Call
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
