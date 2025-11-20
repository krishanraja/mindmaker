const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-8 sm:py-12">
      <div className="container-width">
        <div className="flex flex-col gap-6">
          {/* Main Footer Content */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm text-muted-foreground">
                © 2025 Mindmaker LLC. All rights reserved.
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <a 
                href="/faq" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </a>
              <a 
                href="/leaders" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                For Leaders
              </a>
              <a 
                href="/exec-teams" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                For Teams
              </a>
              <a 
                href="/partners-interest" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                For Partners
              </a>
              <a 
                href="/privacy" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </a>
              <a 
                href="/terms" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;