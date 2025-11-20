import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import mindmakerIcon from "@/assets/mindmaker-icon-black.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const navItems = [
    { label: "About", href: "#system" },
    { label: "Diagnostic", href: "#outcomes" },
    { label: "For Teams", href: "/exec-teams" },
    { label: "For Partners", href: "/partners-interest" },
    { label: "Founder", href: "#access-unique-expertise" },
  ];

  return (
    <nav className="fixed top-0 w-full z-[100] bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container-width">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src={mindmakerIcon} 
              alt="MindMaker" 
              className="h-8 w-auto"
            />
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

            {/* CTA Button */}
            <Button 
              size="sm" 
              className="ml-4"
              onClick={() => window.location.href = '/leaders'}
            >
              Get Your Baseline
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
                onClick={() => window.location.href = '/leaders'}
              >
                Get Your Baseline
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;