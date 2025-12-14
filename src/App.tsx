import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ChatBot } from "@/components/ChatBot";
import { SessionDataProvider } from "@/contexts/SessionDataContext";
import Index from "./pages/Index";
import BuilderSession from "./pages/BuilderSession";
import BuilderSprint from "./pages/BuilderSprint";
import LeadershipLab from "./pages/LeadershipLab";
import PartnerProgram from "./pages/PartnerProgram";
import BuilderEconomy from "./pages/BuilderEconomy";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import LeadershipInsights from "./pages/LeadershipInsights";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionDataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/builder-session" element={<BuilderSession />} />
            <Route path="/builder-sprint" element={<BuilderSprint />} />
            <Route path="/leadership-lab" element={<LeadershipLab />} />
            <Route path="/portfolio-program" element={<PartnerProgram />} />
            <Route path="/builder-economy" element={<BuilderEconomy />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            {/* Leadership Insights Diagnostic - accessible at /leaders */}
            <Route path="/leaders" element={<LeadershipInsights />} />
            <Route path="/leadership-insights" element={<LeadershipInsights />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatBot />
        </BrowserRouter>
      </SessionDataProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
