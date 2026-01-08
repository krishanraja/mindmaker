import { useState, useEffect, ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

export interface JourneyCard {
  id: string;
  title: string;
  content: ReactNode;
  /** Optional background class for the card */
  bgClass?: string;
}

interface JourneyInfoCarouselProps {
  cards: JourneyCard[];
  /** Optional class for the container */
  className?: string;
}

/**
 * JourneyInfoCarousel - Displays info cards as a swipeable carousel on mobile,
 * stacked cards on desktop. All cards have equal height.
 */
export const JourneyInfoCarousel = ({ cards, className = "" }: JourneyInfoCarouselProps) => {
  const isMobile = useIsMobile();
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;

    setCurrent(carouselApi.selectedScrollSnap());

    carouselApi.on("select", () => {
      setCurrent(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  // Desktop: Stacked cards with equal heights using grid
  if (!isMobile) {
    return (
      <div className={`space-y-6 ${className}`}>
        {cards.map((card) => (
          <div
            key={card.id}
            className={`minimal-card ${card.bgClass || ""}`}
          >
            <h2 className="text-2xl font-bold mb-4">{card.title}</h2>
            {card.content}
          </div>
        ))}
      </div>
    );
  }

  // Mobile: Horizontal swipeable carousel
  return (
    <div className={className}>
      <Carousel
        setApi={setCarouselApi}
        opts={{
          align: "start",
          loop: false,
          dragFree: false,
          containScroll: "trimSnaps",
        }}
        orientation="horizontal"
        className="w-full"
      >
        <CarouselContent className="-ml-3">
          {cards.map((card) => (
            <CarouselItem
              key={card.id}
              className="pl-3 basis-[88%]"
            >
              {/* Equal height card container */}
              <div
                className={`minimal-card h-full min-h-[280px] flex flex-col ${card.bgClass || ""}`}
              >
                <h2 className="text-xl font-bold mb-3">{card.title}</h2>
                <div className="flex-1">{card.content}</div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {cards.map((card, index) => (
          <button
            key={card.id}
            onClick={() => carouselApi?.scrollTo(index)}
            className={`h-2 rounded-full transition-all duration-200 ${
              current === index
                ? "w-6 bg-mint"
                : "w-2 bg-muted-foreground/30"
            }`}
            aria-label={`Go to ${card.title}`}
          />
        ))}
      </div>
    </div>
  );
};

export default JourneyInfoCarousel;
