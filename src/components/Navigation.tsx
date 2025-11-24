import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import mindmakerLogo from "@/assets/mindmaker-logo-new.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const navItems = [
    { label: "Builder Session", href: "/builder-session" },
    { 
      label: "Programs", 
      href: "/builder-sprint",
      dropdown: [
        { label: "30-Day Sprint", href: "/builder-sprint" },
        { label: "AI Leadership Lab", href: "/leadership-lab" },
        { label: "Partner Program", href: "/partner-program" },
      ]
    },
    { label: "Builder Economy", href: "/builder-economy" },
    { label: "FAQ", href: "/faq" },
  ];

  return (
    <nav className="fixed top-0 w-full z-[100] bg-background border-b border-border shadow-sm">
      <div className="container-width">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Larger */}
          <div className="flex items-center">
            <a href="/" className="transition-opacity hover:opacity-80">
              <img 
                src={mindmakerLogo} 
                alt="Mindmaker" 
                className="h-10 w-auto"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ))}

            {/* Premium CTA Button */}
            <Button 
              size="default" 
              className="ml-4 relative"
              onClick={() => window.open('https://calendly.com/krish-raja/mindmaker-meeting', '_blank')}
            >
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-mint rounded-full animate-pulse" />
              Book Session
            </Button>
          </div>

          {/* Theme toggle and mobile menu button */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
               <Button 
                size="sm" 
                className="w-fit"
                onClick={() => window.open('https://calendly.com/krish-raja/mindmaker-meeting', '_blank')}
              >
                Book Session
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;