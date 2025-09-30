import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface ResponsiveCardGridProps {
  children: ReactNode[];
  desktopGridClass: string;
  className?: string;
  mobileCardHeight?: string;
}

const ResponsiveCardGrid = ({ 
  children, 
  desktopGridClass, 
  className,
  mobileCardHeight = "h-[360px]"
}: ResponsiveCardGridProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className={cn("relative", className)}>
        <Carousel
          opts={{
            align: "start",
            slidesToScroll: 1,
            containScroll: "trimSnaps",
            dragFree: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4 items-stretch">
            {children.map((child, index) => (
              <CarouselItem 
                key={index} 
                className="pl-2 md:pl-4 basis-[85%] sm:basis-[70%] h-full"
              >
                <div className={cn(mobileCardHeight, "w-full overflow-hidden")}>
                  {child}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 h-9 w-9 border-2 bg-background/95 backdrop-blur-sm" />
          <CarouselNext className="right-2 h-9 w-9 border-2 bg-background/95 backdrop-blur-sm" />
        </Carousel>
      </div>
    );
  }

  return (
    <div className={cn(desktopGridClass, className)}>
      {children}
    </div>
  );
};

export default ResponsiveCardGrid;