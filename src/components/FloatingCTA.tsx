import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "lucide-react";
import { InitialConsultModal } from "@/components/InitialConsultModal";

export const FloatingCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [consultModalOpen, setConsultModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Get hero section
      const heroSection = document.getElementById('hero');
      if (!heroSection) {
        // If no hero, show after scrolling 100vh
        setIsVisible(window.scrollY > window.innerHeight);
        return;
      }

      const heroRect = heroSection.getBoundingClientRect();
      // Show floating CTA when hero is mostly out of view (80% scrolled past)
      const heroMostlyScrolled = heroRect.bottom < window.innerHeight * 0.2;
      setIsVisible(heroMostlyScrolled);
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[55]"
          >
            <button
              onClick={() => setConsultModalOpen(true)}
              className="group relative flex items-center gap-2 px-5 py-3 md:px-6 md:py-3.5 rounded-full
                bg-mint text-ink font-semibold text-sm md:text-base
                shadow-lg shadow-mint/25 hover:shadow-xl hover:shadow-mint/30
                transition-all duration-300 ease-out
                hover:scale-[1.03] hover:-translate-y-0.5
                touch-target"
              aria-label="Book Session"
            >
              {/* Pulse indicator */}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              
              <Calendar className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:scale-110" />
              <span>Book Session</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <InitialConsultModal 
        open={consultModalOpen} 
        onOpenChange={setConsultModalOpen}
      />
    </>
  );
};

