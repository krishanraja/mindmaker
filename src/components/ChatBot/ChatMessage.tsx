import { Message } from './useChatBot';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import krishHeadshot from '@/assets/krish-headshot.png';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isAssistant = message.role === 'assistant';

  const markdownComponents = {
    p: ({ children }: any) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
    strong: ({ children }: any) => <strong className="font-semibold text-foreground">{children}</strong>,
    a: ({ href, children }: any) => {
      const isCalendly = href?.includes('calendly.com');
      const isPathway = href?.includes('#pathways');
      
      if (isCalendly) {
        return (
          <Button
            variant="hero-primary"
            size="sm"
            onClick={() => window.open(href, '_blank')}
            className="my-1 inline-flex"
          >
            {children}
          </Button>
        );
      }
      
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`font-medium underline hover:no-underline ${
            isPathway ? 'text-primary hover:text-primary/80' : 'text-accent hover:text-accent/80'
          }`}
        >
          {children}
        </a>
      );
    },
    ul: ({ children }: any) => <ul className="space-y-2 my-3">{children}</ul>,
    li: ({ children }: any) => (
      <li className="flex gap-2">
        <span className="text-primary mt-0.5">•</span>
        <span className="flex-1">{children}</span>
      </li>
    ),
  };

  return (
    <div className={`flex gap-3 ${isAssistant ? '' : 'flex-row-reverse'} fade-in-up`}>
      <Avatar className="h-8 w-8 shrink-0">
        {isAssistant ? (
          <>
            <AvatarImage src={krishHeadshot} alt="Krish" />
            <AvatarFallback>K</AvatarFallback>
          </>
        ) : (
          <AvatarFallback className="bg-primary text-primary-foreground">U</AvatarFallback>
        )}
      </Avatar>
      
      <div className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'} max-w-[85%]`}>
        <div
          className={`rounded-lg px-5 py-4 ${
            isAssistant
              ? 'bg-muted text-foreground'
              : 'bg-primary text-primary-foreground'
          }`}
        >
          <div className="text-sm leading-relaxed">
            <ReactMarkdown components={markdownComponents}>
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
        <span className="text-xs text-muted-foreground mt-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};
