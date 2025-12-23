import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MarkdownResponse } from '@/components/ui/markdown-response';
import { useIsMobile } from '@/hooks/use-mobile';
import { MindmakerIcon, MindmakerBadge } from '@/components/ui/MindmakerIcon';

interface TryItWidgetProps {
  compact?: boolean;
  onClose?: () => void;
}

export const TryItWidget = ({ compact = false, onClose }: TryItWidgetProps) => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // #region agent log
    fetch('http://127.0.0.1:7247/ingest/d84be03b-cc5f-4a51-8624-1abff965b9ec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AIDecisionHelper.tsx:23',message:'AI Decision Helper submit',data:{inputLength:input.length,inputPreview:input.substring(0,50)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    setIsLoading(true);
    setResponse('');

    try {
      // #region agent log
      fetch('http://127.0.0.1:7247/ingest/d84be03b-cc5f-4a51-8624-1abff965b9ec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AIDecisionHelper.tsx:30',message:'Calling chat-with-krish',data:{inputLength:input.length},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'FRONTEND'})}).catch(()=>{});
      // #endregion
      
      const { data, error } = await supabase.functions.invoke('chat-with-krish', {
        body: {
          messages: [
            {
              role: 'user',
              content: input
            }
          ],
          widgetMode: 'tryit'
        }
      });

      // #region agent log
      fetch('http://127.0.0.1:7247/ingest/d84be03b-cc5f-4a51-8624-1abff965b9ec',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AIDecisionHelper.tsx:47',message:'Response received',data:{hasData:!!data,hasError:!!error,errorMsg:error?.message,messageLength:data?.message?.length,metadataFallback:data?.metadata?.fallback,first100:data?.message?.substring(0,100)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'FRONTEND'})}).catch(()=>{});
      // #endregion

      if (error) throw new Error(error.message || 'API error');

      const message = data?.message;
      if (!message || message.trim() === '') {
        throw new Error('Empty response received');
      }

      setResponse(message);
    } catch (error: any) {
      console.error('Error:', error);
      if (error.message?.includes('429')) {
        toast.error('Rate limit exceeded. Please try again in a moment.');
      } else if (error.message?.includes('402')) {
        toast.error('Service temporarily unavailable. Please try again later.');
      } else {
        toast.error('Failed to get response. Please try again.');
      }
      setResponse("I'm having trouble connecting right now. Here's what I'd suggest:\n\n**For your AI decision**, consider applying first-principles thinking: What's the fundamental problem you're actually trying to solve? Strip away assumptions and start from the core need.\n\n[Book a Builder Session](/#book) to work through this together in 60 minutes.");
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
              <MindmakerBadge text="Mindmaker Framework Applied" className="mb-3" />
              <MarkdownResponse 
                content={response} 
                className="text-xs text-muted-foreground leading-relaxed max-h-[300px] overflow-y-auto"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Mobile full-screen wizard layout
  if (isMobile) {
    return (
      <div className="flex flex-col h-full min-h-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <MindmakerIcon size={24} />
            <div>
              <h2 className="font-semibold">AI Decision Helper</h2>
              <p className="text-xs text-muted-foreground">Powered by Mindmaker</p>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center p-8 text-center"
              >
                <MindmakerIcon size={64} animated />
                <h3 className="text-lg font-bold mt-4 mb-2">Thinking...</h3>
                <p className="text-sm text-muted-foreground">
                  Applying cognitive frameworks to your decision
                </p>
              </motion.div>
            ) : response ? (
              <motion.div
                key="response"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col"
              >
                {/* Response content */}
                <div className="flex-1 overflow-y-auto p-4">
                  <MindmakerBadge text="Mindmaker Framework Applied" className="mb-4" />
                  <MarkdownResponse 
                    content={response} 
                    className="text-sm leading-relaxed"
                  />
                </div>

                {/* Actions */}
                <div className="p-4 border-t space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setResponse('');
                      setInput('');
                    }}
                  >
                    Ask Another Question
                  </Button>
                  <Button
                    className="w-full bg-ink text-white hover:bg-ink/90"
                    onClick={() => window.open('https://calendly.com/krish-raja/mindmaker-meeting', '_blank')}
                  >
                    Book a Builder Session
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col p-4"
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">Stuck on an AI Decision?</h3>
                  <p className="text-muted-foreground text-sm">
                    Describe your challenge. Get instant clarity.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Example: Should we build or buy our AI chatbot? We have limited engineering resources but need something in production within 3 months..."
                    className="flex-1 min-h-[150px] resize-none text-base"
                    disabled={isLoading}
                  />
                  
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full mt-4 bg-mint text-ink hover:bg-mint/90 font-bold"
                    disabled={isLoading || !input.trim()}
                  >
                    Get Instant Clarity
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="flex flex-col h-full max-h-[70vh] min-h-0">
      {/* Header - Fixed */}
      <div className="shrink-0 text-center mb-4 pb-4 border-b">
        <h3 className="text-2xl font-bold mb-2">Stuck on an AI Decision?</h3>
        <p className="text-muted-foreground">
          Describe your challenge. Get instant clarity.
        </p>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-2 -mr-2">
        <div className="pr-2">
          {!response ? (
            <div className="space-y-4">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Example: Should we build or buy our AI chatbot? We have limited engineering resources but need something in production within 3 months..."
                className="min-h-[120px] resize-none text-base"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    handleSubmit(e as any);
                  }
                }}
              />
            </div>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <MindmakerBadge text="Mindmaker Framework Applied" />
                <MarkdownResponse 
                  content={response} 
                  className="text-sm text-muted-foreground leading-relaxed"
                />
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Fixed Buttons at Bottom */}
      <div className="shrink-0 pt-4 mt-4 border-t bg-background">
        {!response ? (
          <Button
            type="submit"
            size="lg"
            className="w-full bg-mint text-ink hover:bg-mint/90 font-bold"
            disabled={isLoading || !input.trim()}
            onClick={handleSubmit}
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
        ) : (
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setResponse('');
                setInput('');
              }}
            >
              Ask Another Question
            </Button>
            <Button
              size="lg"
              className="w-full bg-ink text-white hover:bg-ink/90"
              onClick={() => window.open('https://calendly.com/krish-raja/mindmaker-meeting', '_blank')}
            >
              Book a Builder Session
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
