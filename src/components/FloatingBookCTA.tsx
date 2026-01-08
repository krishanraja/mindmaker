import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ConsultationBooking } from "@/components/ConsultationBooking";

interface FloatingBookCTAProps {
  /** ID of the booking section to scroll to (optional - if not provided, opens sheet) */
  bookingSectionId?: string;
  /** Pre-selected program for the booking form */
  preselectedProgram?: string;
}

/**
 * FloatingBookCTA - A floating "Book" button that appears on mobile after scrolling.
 * Provides quick access to the booking CTA without excessive scrolling.
 */
export const FloatingBookCTA = ({ bookingSectionId, preselectedProgram }: FloatingBookCTAProps) => {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      // Show after scrolling past 50% of viewport height
      const shouldShow = scrollY > viewportHeight * 0.5;
      
      // Hide when near bottom of page (within 300px of booking section)
      const documentHeight = document.documentElement.scrollHeight;
      const nearBottom = scrollY + viewportHeight > documentHeight - 300;
      
      setIsVisible(shouldShow && !nearBottom);
      lastScrollY.current = scrollY;
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  // Don't render on desktop
  if (!isMobile) return null;

  const handleClick = () => {
    if (bookingSectionId) {
      // Scroll to booking section
      const element = document.getElementById(bookingSectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      // Open sheet with compact booking form
      setIsSheetOpen(true);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 p-4 pb-safe-bottom bg-gradient-to-t from-background via-background to-transparent transition-all duration-300 ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <Button
          onClick={handleClick}
          size="lg"
          className="w-full bg-mint text-ink hover:bg-mint/90 font-bold text-base py-6 shadow-lg shadow-mint/20"
        >
          <Calendar className="mr-2 h-5 w-5" />
          Book Free Consultation
        </Button>
      </div>

      {/* Booking Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="h-auto max-h-[85vh] overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle className="text-center">Book Your Consultation</SheetTitle>
          </SheetHeader>
          <ConsultationBooking variant="compact" preselectedProgram={preselectedProgram} />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default FloatingBookCTA;
