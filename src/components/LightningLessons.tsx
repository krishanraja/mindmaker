import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel';
import { GraduationCap, ExternalLink } from 'lucide-react';

export const LightningLessons = () => {
  const [open, setOpen] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);

  const lessons = [
    {
      title: "Learn How To Program Your AI Tools",
      url: "https://maven.com/p/1eb66a/learn-how-to-program-your-ai-tools",
      image: "/lesson-program-ai-tools.jpg"
    },
    {
      title: "Build In Public with Gen AI as your cofounder",
      url: "https://maven.com/p/1054a6/build-in-public-with-gen-ai-as-your-co-founder",
      image: "/lesson-build-in-public.jpg"
    },
    {
      title: "Vibe Code Your Way To A New Income Stream",
      url: "https://maven.com/p/b95f6c/vibe-code-your-way-to-a-new-income-stream",
      image: "/lesson-vibe-code.jpg"
    }
  ];

  useEffect(() => {
    if (!carouselApi) return;
    carouselApi.on("select", () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        size="lg"
        className="group"
      >
        <GraduationCap className="mr-2 h-5 w-5 text-mint" />
        Free Lightning Lessons
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Free Lightning Lessons</DialogTitle>
          </DialogHeader>
          
          <Carousel setApi={setCarouselApi} className="w-full">
            <CarouselContent>
              {lessons.map((lesson, index) => (
                <CarouselItem key={index}>
                  <div className="space-y-4">
                    <img 
                      src={lesson.image} 
                      alt={lesson.title}
                      className="w-full rounded-lg"
                    />
                    <h3 className="font-bold text-lg">{lesson.title}</h3>
                    <Button 
                      asChild 
                      className="w-full bg-mint text-ink hover:bg-mint/90"
                    >
                      <a href={lesson.url} target="_blank" rel="noopener noreferrer">
                        Start Learning <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Swipe Indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {lessons.map((_, index) => (
              <button
                key={index}
                onClick={() => carouselApi?.scrollTo(index)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === index 
                    ? 'w-8 bg-mint' 
                    : 'w-2 bg-muted-foreground/30'
                }`}
                aria-label={`Go to lesson ${index + 1}`}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
