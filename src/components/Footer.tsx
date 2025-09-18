const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-8 sm:py-12">
      <div className="container-width">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm text-muted-foreground">
              © 2025 MindMaker AI. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <a 
              href="/privacy" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="/terms" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;