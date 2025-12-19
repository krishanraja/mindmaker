import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  // Log 404 for analytics/monitoring (remove console.error for production)
  // TODO: Replace with proper logging service in production
  if (process.env.NODE_ENV === 'development') {
    console.warn("404 Error: Route not found:", location.pathname);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-6xl md:text-8xl font-bold text-foreground">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground">Page Not Found</h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button 
          asChild
          size="lg"
          className="min-h-[44px]"
        >
          <a href="/" aria-label="Return to homepage">
            <Home className="mr-2 h-4 w-4" aria-hidden="true" />
            Return to Home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
