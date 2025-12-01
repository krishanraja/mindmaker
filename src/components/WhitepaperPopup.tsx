import { useState } from "react";
import { ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useScrollBackToTop } from "@/hooks/useScrollBackToTop";
import { useIsMobile } from "@/hooks/use-mobile";
import whitepaperCover from "@/assets/whitepaper-cover-2026.png";

const WhitepaperPopup = () => {
  const { shouldShowPopup, dismissPopup } = useScrollBackToTop();
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const isMobile = useIsMobile();

  const handleClose = () => {
    dismissPopup(dontShowAgain);
  };

  const handleReadReport = () => {
    window.open("https://docsend.com/view/uybrzhx75fcwp2n7", "_blank", "noopener,noreferrer");
    dismissPopup(dontShowAgain);
  };

  const popupContent = (
    <div className={isMobile ? "space-y-4" : "space-y-6"}>
      {/* Whitepaper Cover */}
      <div className="flex justify-center">
        <img
          src={whitepaperCover}
          alt="Resolving The AI Literacy Crisis in 2026"
          className={`h-auto rounded-lg shadow-lg ${isMobile ? "w-36" : "w-48"}`}
        />
      </div>

      {/* Content */}
      <div className="text-center space-y-3">
        <p className="text-muted-foreground text-sm">
          This might be worth your time.
        </p>
        
        <p className={`font-semibold text-foreground ${isMobile ? "text-base" : "text-lg"}`}>
          "Resolving The AI Literacy Crisis in 2026"
        </p>
        
        <p className={`text-muted-foreground ${isMobile ? "text-sm" : "text-base"}`}>
          95% of enterprise AI initiatives fail due to workforce literacy gaps. This report shows you how to fix it.
        </p>
      </div>

      {/* Don't Show Again Checkbox */}
      <div className="flex items-center space-x-2 justify-center pt-2">
        <Checkbox
          id="dont-show-again"
          checked={dontShowAgain}
          onCheckedChange={(checked) => setDontShowAgain(checked === true)}
        />
        <Label
          htmlFor="dont-show-again"
          className="text-sm text-muted-foreground cursor-pointer"
        >
          Don't show this again
        </Label>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-3 pt-2">
        <Button
          variant="mint"
          size={isMobile ? "default" : "lg"}
          className="w-full"
          onClick={handleReadReport}
        >
          <span className="inline-flex items-center gap-2">
            Read the Free Report
            <ExternalLink className="w-4 h-4" />
          </span>
        </Button>
        <Button
          variant="outline"
          size={isMobile ? "default" : "lg"}
          className="w-full"
          onClick={handleClose}
        >
          Maybe Later
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={shouldShowPopup} onOpenChange={handleClose}>
        <DrawerContent className="max-h-[85vh] px-4 pb-8">
          <DrawerHeader className="text-center pb-4">
            <DrawerTitle className="text-xl font-bold">
              Before you go...
            </DrawerTitle>
          </DrawerHeader>
          {popupContent}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={shouldShowPopup} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            Before you go...
          </DialogTitle>
        </DialogHeader>
        {popupContent}
      </DialogContent>
    </Dialog>
  );
};

export default WhitepaperPopup;
