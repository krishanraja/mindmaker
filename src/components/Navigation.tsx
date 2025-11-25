import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import mindmakerFavicon from "/mindmaker-favicon.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navItems = [
    { 
      label: "For Individuals", 
      href: "/builder-session",
      dropdown: [
        { label: "Builder Session", href: "/builder-session" },
      ]
    },
    { 
      label: "For Teams", 
      href: "/builder-sprint",
      dropdown: [
        { label: "Builder Sprint", href: "/builder-sprint" },
        { label: "AI Leadership Lab", href: "/leadership-lab" },
      ]
    },
    { 
      label: "For Partners", 
      href: "/partner-program"
    },
    { 
      label: "Content", 
      href: "#",
      dropdown: [
        { label: "The Builder Economy (Coming Soon)", href: "#", comingSoon: true },
        { label: "Blog", href: "https://content.themindmaker.ai", external: true },
      ]
    },
    { label: "FAQ", href: "/faq" },
  ];

  return (
    <nav className="fixed top-0 w-full z-[100] bg-background border-b border-border shadow-sm">
      <div className="container-width">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Favicon */}
          <div className="flex items-center">
            <a href="/" className="transition-opacity hover:opacity-80">
              <img 
                src={mindmakerFavicon} 
                alt="Mindmaker" 
                className="h-8 w-auto"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <div 
                key={item.label}
                className="relative"
                onMouseEnter={() => item.dropdown && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {item.dropdown ? (
                  <>
                    <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                      {item.label}
                      <ChevronDown className="h-3 w-3" />
                    </button>
                    {openDropdown === item.label && (
                      <div className="absolute top-full left-0 mt-2 bg-background border border-border rounded-md shadow-lg py-2 min-w-[200px] z-50">
                        {item.dropdown.map((subItem) => (
                          <a
                            key={subItem.label}
                            href={subItem.href}
                            target={subItem.external ? "_blank" : undefined}
                            rel={subItem.external ? "noopener noreferrer" : undefined}
                            className={`block px-4 py-2 text-sm hover:bg-accent transition-colors ${
                              subItem.comingSoon ? 'text-muted-foreground/50 cursor-default' : 'text-muted-foreground hover:text-foreground'
                            }`}
                            onClick={(e) => subItem.comingSoon && e.preventDefault()}
                          >
                            {subItem.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <a
                    href={item.href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </a>
                )}
              </div>
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
                <div key={item.label}>
                  {item.dropdown ? (
                    <>
                      <div className="text-sm font-medium text-foreground mb-2">{item.label}</div>
                      <div className="flex flex-col space-y-2 pl-4">
                        {item.dropdown.map((subItem) => (
                          <a
                            key={subItem.label}
                            href={subItem.href}
                            target={subItem.external ? "_blank" : undefined}
                            rel={subItem.external ? "noopener noreferrer" : undefined}
                            className={`text-sm ${
                              subItem.comingSoon ? 'text-muted-foreground/50' : 'text-muted-foreground hover:text-foreground'
                            } transition-colors`}
                            onClick={(e) => {
                              if (subItem.comingSoon) e.preventDefault();
                              else setIsOpen(false);
                            }}
                          >
                            {subItem.label}
                          </a>
                        ))}
                      </div>
                    </>
                  ) : (
                    <a
                      href={item.href}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </a>
                  )}
                </div>
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