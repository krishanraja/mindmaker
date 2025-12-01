import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import krishHeadshot from "@/assets/krish-headshot.png";

const Contact = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: formData,
      });

      if (error) throw error;

      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Get In Touch
          </h1>
          <p className="text-lg text-muted-foreground mb-12">
            Have questions about our programs or want to learn more? We'd love to hear from you.
          </p>

          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            {/* Left: About section */}
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <img 
                  src={krishHeadshot} 
                  alt="Krish Raja" 
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Krish Raja</h2>
                  <p className="text-muted-foreground">Founder, Mindmaker</p>
                </div>
              </div>

              <div className="prose prose-slate dark:prose-invert">
                <p className="text-base text-foreground leading-relaxed">
                  At Mindmaker, we believe AI fluency is the new competitive advantage. 
                  We help executives, teams, and portfolio companies cut through the AI noise 
                  and build real capabilities that compound over time.
                </p>
                <p className="text-base text-foreground leading-relaxed">
                  Whether you're an individual looking to 10x your output or a portfolio 
                  operator scaling AI across companies, we meet you where you are and help 
                  you get where you need to be.
                </p>
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-semibold text-foreground mb-3">Ready to start?</h3>
                <Button 
                  size="lg"
                  onClick={() => window.open('https://calendly.com/krish-raja/mindmaker-meeting', '_blank')}
                  className="w-full md:w-auto"
                >
                  Book a Discovery Call
                </Button>
              </div>
            </div>

            {/* Right: Contact form */}
            <div className="bg-card border border-border rounded-lg p-8">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Send us a message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="How can we help you?"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full resize-none"
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;