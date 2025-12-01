import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon, ChevronDown, ExternalLink } from "lucide-react";
import { useTheme } from "next-themes";
import mindmakerLogoDark from "@/assets/mindmaker-logo-dark.png";
import mindmakerLogoLight from "@/assets/mindmaker-logo-light.png";
import { LightningLessons } from "@/components/LightningLessons";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const navItems = [
    { 
      label: "Individuals", 
      dropdown: [
        { label: "Builder Session", href: "/builder-session" },
        { label: "Weekly Updates", href: "/builder-session" },
        { label: "90-Day Program", href: "/builder-sprint" },
      ]
    },
    { label: "Teams", href: "/leadership-lab" },
    { label: "Portfolios", href: "/portfolio-program" },
    { 
      label: "Content", 
      dropdown: [
        { label: "The Builder Economy", href: "https://thebuildereconomy.com/", external: true, comingSoon: true, allowClick: true },
        { label: "Blog", href: "https://content.themindmaker.ai", external: true },
      ]
    },
    { label: "FAQ", href: "/faq" },
  ];

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown) {
        const currentRef = dropdownRefs.current[openDropdown];
        if (currentRef && !currentRef.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpenDropdown(null);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-[100] bg-background border-b border-border shadow-sm pt-safe-top">
      <div className="container-width">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="transition-opacity hover:opacity-80">
              <img 
                src={mindmakerLogoDark} 
                alt="Mindmaker" 
                className="h-6 sm:h-7 md:h-[22px] w-auto max-w-[140px] sm:max-w-[170px] object-contain dark:hidden"
              />
              <img 
                src={mindmakerLogoLight} 
                alt="Mindmaker" 
                className="h-6 sm:h-7 md:h-[22px] w-auto max-w-[140px] sm:max-w-[170px] object-contain hidden dark:block"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <div 
                key={item.label}
                className="relative"
                ref={(el) => {
                  if (item.dropdown) {
                    dropdownRefs.current[item.label] = el;
                  }
                }}
                onKeyDown={handleKeyDown}
              >
                {item.dropdown ? (
                  <>
                    <button 
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      className={`text-sm font-semibold transition-colors flex items-center gap-1.5
                        py-2 px-3 rounded-md ${
                        openDropdown === item.label 
                          ? 'text-mint bg-mint/10' 
                          : 'text-ink dark:text-white hover:text-mint hover:bg-mint/5'
                      }`}
                      aria-expanded={openDropdown === item.label}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                        openDropdown === item.label ? 'rotate-180' : ''
                      }`} />
                    </button>
                    {openDropdown === item.label && (
                      <div 
                        className="absolute top-full left-0 mt-1 
                          bg-white dark:bg-[#0e1a2b] 
                          border-2 border-border 
                          rounded-lg shadow-xl 
                          py-3 min-w-[240px] z-50
                          animate-in fade-in slide-in-from-top-2 duration-200"
                        role="menu"
                        aria-label={`${item.label} menu`}
                      >
                        {item.dropdown.map((subItem) => (
                          <a
                            key={subItem.label}
                            href={subItem.href}
                            target={subItem.external ? "_blank" : undefined}
                            rel={subItem.external ? "noopener noreferrer" : undefined}
                            role="menuitem"
                            className={`flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-md mx-2
                              transition-colors ${
                              subItem.comingSoon && !subItem.allowClick
                                ? 'text-muted-foreground/50 cursor-not-allowed' 
                                : 'text-ink dark:text-white hover:bg-mint/10 hover:text-ink dark:hover:text-white'
                            }`}
                            onClick={(e) => {
                              if (subItem.comingSoon && !subItem.allowClick) e.preventDefault();
                            }}
                          >
                            <span>{subItem.label}</span>
                            {subItem.comingSoon && (
                              <span className="text-xs text-mint font-semibold">Coming Soon</span>
                            )}
                            {subItem.external && (
                              <ExternalLink className="h-3 w-3 ml-2" />
                            )}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <a
                    href={item.href}
                    className="text-sm font-semibold text-ink dark:text-white 
                      hover:text-mint transition-colors py-2 px-3 rounded-md 
                      hover:bg-mint/5 flex items-center"
                  >
                    {item.label}
                  </a>
                )}
              </div>
            ))}

            {/* Lightning Lessons */}
            <div className="ml-4">
              <LightningLessons />
            </div>

            {/* Premium CTA Button */}
            <Button 
              size="sm" 
              className="ml-4 relative touch-target"
              onClick={() => window.open('https://calendly.com/krish-raja/mindmaker-meeting', '_blank')}
            >
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-mint rounded-full animate-pulse" />
              Book Session
            </Button>
          </div>

          {/* Theme toggle and mobile menu button */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="touch-target"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden touch-target"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border pb-safe-bottom">
            <div className="flex flex-col space-y-1">
              {navItems.map((item, index) => (
                <div key={item.label}>
                  {item.dropdown ? (
                    <div className="py-2">
                      <div className="text-xs font-bold uppercase tracking-wider 
                        text-muted-foreground mb-3 px-4">{item.label}</div>
                      <div className="flex flex-col space-y-1">
                        {item.dropdown.map((subItem) => (
                          <a
                            key={subItem.label}
                            href={subItem.href}
                            target={subItem.external ? "_blank" : undefined}
                            rel={subItem.external ? "noopener noreferrer" : undefined}
                            className={`min-h-[44px] flex items-center justify-between px-4 py-3 
                              text-base font-medium rounded-md transition-colors ${
                              subItem.comingSoon 
                                ? 'text-muted-foreground/50 cursor-not-allowed' 
                                : 'text-ink dark:text-white hover:bg-mint/10'
                            }`}
                            onClick={(e) => {
                              if (subItem.comingSoon) e.preventDefault();
                              else setIsOpen(false);
                            }}
                          >
                            <span>{subItem.label}</span>
                            {subItem.comingSoon && 
                              <span className="text-xs text-mint font-semibold">Coming Soon</span>}
                            {subItem.external && 
                              <ExternalLink className="h-3 w-3" />}
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <a
                      href={item.href}
                      className="min-h-[44px] flex items-center px-4 py-3 
                        text-base font-medium text-ink dark:text-white 
                        hover:bg-mint/10 rounded-md transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </a>
                  )}
                  {index < navItems.length - 1 && 
                    <div className="h-px bg-border my-2" />}
                </div>
              ))}
              
              {/* Builder Economy in Mobile */}
              <div className="h-px bg-border my-2" />
              <a
                href="/builder-economy"
                className="min-h-[44px] flex items-center px-4 py-3 
                  text-base font-medium text-ink dark:text-white 
                  hover:bg-mint/10 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Builder Economy
              </a>
              
              {/* Lightning Lessons in Mobile */}
              <div className="h-px bg-border my-2" />
              <div className="px-4 py-2">
                <LightningLessons />
              </div>
              
              <Button 
                size="sm" 
                className="w-fit mx-4 mt-2"
                onClick={() => {
                  window.open('https://calendly.com/krish-raja/mindmaker-meeting', '_blank');
                  setIsOpen(false);
                }}
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
