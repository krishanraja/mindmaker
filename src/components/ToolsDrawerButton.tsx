import { useState } from "react";
import { Sparkles, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { ToolsDrawer } from "./ToolsDrawer";
import { cn } from "@/lib/utils";

type DialogType = 'quiz' | 'decision' | 'friction' | 'portfolio' | null;

interface ToolsDrawerButtonProps {
  onToolClick: (toolId: DialogType) => void;
}

export const ToolsDrawerButton = ({ onToolClick }: ToolsDrawerButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Tab Button - Extends from right edge, positioned higher up */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed right-0 z-[60]",
          "bottom-1/2 translate-y-1/2 md:bottom-auto md:top-1/2 md:-translate-y-1/2",
          "w-12 h-24 rounded-l-2xl",
          "bg-gradient-to-br from-mint to-mint-dark",
          "shadow-lg hover:shadow-xl",
          "flex flex-col items-center justify-center gap-1",
          "transition-all duration-300",
          "group",
          isOpen && "bg-gradient-to-br from-mint-dark to-mint"
        )}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        aria-label={isOpen ? "Close AI Tools" : "Open AI Tools"}
      >
        <Sparkles className={cn(
          "w-5 h-5 text-white transition-transform duration-300",
          isOpen && "rotate-180"
        )} />
        <ChevronRight className={cn(
          "w-4 h-4 text-white/80 transition-transform duration-300",
          isOpen && "rotate-180"
        )} />
      </motion.button>

      <ToolsDrawer 
        open={isOpen} 
        onOpenChange={setIsOpen}
        onToolClick={onToolClick}
      />
    </>
  );
};

