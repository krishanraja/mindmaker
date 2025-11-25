import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TryItWidgetProps {
  compact?: boolean;
}

export const TryItWidget = ({ compact = false }: TryItWidgetProps) => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setResponse('');

    try {
      const { data, error } = await supabase.functions.invoke('chat-with-krish', {
        body: {
          messages: [
            {
              role: 'user',
              content: `I'm stuck on this AI decision: ${input}

Please help me organize my thinking by providing:
1. The 3 key questions I should be asking
2. A simple decision framework to use
3. One concrete next step I can take today

Keep it practical and actionable.`
            }
          ]
        }
      });

      if (error) throw error;

      setResponse(data?.message || 'Unable to generate response. Please try again.');
    } catch (error: any) {
      console.error('Error:', error);
      if (error.message?.includes('429')) {
        toast.error('Rate limit exceeded. Please try again in a moment.');
      } else if (error.message?.includes('402')) {
        toast.error('Service temporarily unavailable. Please try again later.');
      } else {
        toast.error('Failed to get response. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (compact) {
    return (
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., Should we build or buy our AI chatbot?"
            className="min-h-[100px] resize-none text-sm"
            disabled={isLoading}
          />
          
          <Button
            type="submit"
            size="sm"
            className="w-full bg-mint text-ink hover:bg-mint/90 font-bold"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Thinking...
              </>
            ) : (
              'Get Clarity'
            )}
          </Button>
        </form>

        <AnimatePresence>
          {response && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="pt-4 border-t border-border"
            >
              <div className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto">
                {response}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Full-size version (original)
  return (
    <section className="section-padding bg-background">
      <div className="container-width">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mint/10 border border-mint/20 mb-6">
              <Sparkles className="w-4 h-4 text-mint" />
              <span className="text-sm font-semibold text-mint">Try It Now</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Stuck on an AI Decision?
            </h2>
            <p className="text-lg text-muted-foreground">
              Describe your challenge. Get instant clarity.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="accent-card"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Example: Should we build or buy our AI chatbot? We have limited engineering resources but need something in production within 3 months..."
                  className="min-h-[120px] resize-none text-base"
                  disabled={isLoading}
                />
              </div>
              
              <Button
                type="submit"
                size="lg"
                className="w-full bg-mint text-ink hover:bg-mint/90 font-bold"
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Organizing your thinking...
                  </>
                ) : (
                  'Get Instant Clarity'
                )}
              </Button>
            </form>

            <AnimatePresence>
              {response && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-6 pt-6 border-t border-mint/20"
                >
                  <div className="prose prose-sm max-w-none">
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {response}
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-xs text-muted-foreground text-center mb-4">
                      Want deeper analysis for your specific situation?
                    </p>
                    <Button
                      size="sm"
                      className="w-full bg-ink text-white hover:bg-ink/90"
                      onClick={() => window.open('https://calendly.com/krish-raja/mindmaker-meeting', '_blank')}
                    >
                      Book a Builder Session
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <p className="text-xs text-muted-foreground text-center mt-4">
            This is a taste of the Mindmaker approach: turning chaos into actionable clarity.
          </p>
        </div>
      </div>
    </section>
  );
};
