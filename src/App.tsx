import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { SessionDataProvider } from "@/contexts/SessionDataContext";
import Index from "./pages/Index";
import Individual from "./pages/Individual";
import Team from "./pages/Team";
import BuilderSprint from "./pages/BuilderSprint";
import BuilderEconomy from "./pages/BuilderEconomy";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import LeadershipInsights from "./pages/LeadershipInsights";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionDataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/individual" element={<Individual />} />
            <Route path="/team" element={<Team />} />
            <Route path="/builder-sprint" element={<BuilderSprint />} />
            <Route path="/builder-economy" element={<BuilderEconomy />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            {/* Leadership Insights Diagnostic - accessible at /leaders */}
            <Route path="/leaders" element={<LeadershipInsights />} />
            <Route path="/leadership-insights" element={<LeadershipInsights />} />
            {/* Redirects for old URLs */}
            <Route path="/builder-session" element={<Navigate to="/individual?path=orchestrate" replace />} />
            <Route path="/leadership-lab" element={<Navigate to="/team" replace />} />
            <Route path="/builder" element={<Navigate to="/individual?path=build" replace />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SessionDataProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
