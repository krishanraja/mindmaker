import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ChatBot } from "@/components/ChatBot";
import NewIndex from "./pages/NewIndex";
import BuilderSession from "./pages/BuilderSession";
import BuilderSprint from "./pages/BuilderSprint";
import LeadershipLab from "./pages/LeadershipLab";
import PartnerProgram from "./pages/PartnerProgram";
import BuilderEconomy from "./pages/BuilderEconomy";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import FAQ from "./pages/FAQ";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<NewIndex />} />
            <Route path="/builder-session" element={<BuilderSession />} />
            <Route path="/builder-sprint" element={<BuilderSprint />} />
            <Route path="/leadership-lab" element={<LeadershipLab />} />
            <Route path="/partner-program" element={<PartnerProgram />} />
            <Route path="/builder-economy" element={<BuilderEconomy />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/faq" element={<FAQ />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatBot />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
