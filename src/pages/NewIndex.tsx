import { lazy, Suspense } from "react";
import Navigation from "@/components/Navigation";
import NewHero from "@/components/NewHero";
import WhoThisIsFor from "@/components/WhoThisIsFor";
import TheProblem from "@/components/TheProblem";
import ProductLadder from "@/components/ProductLadder";
import HowItsDifferent from "@/components/HowItsDifferent";
import BuilderEconomyConnection from "@/components/BuilderEconomyConnection";
import SimpleCTA from "@/components/SimpleCTA";

const Footer = lazy(() => import("@/components/Footer"));

const NewIndex = () => {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      <header>
        <NewHero />
      </header>

      <WhoThisIsFor />
      <TheProblem />
      <ProductLadder />
      <HowItsDifferent />
      <BuilderEconomyConnection />
      <SimpleCTA />
      
      <Suspense fallback={<div className="min-h-[200px]" />}>
        <Footer />
      </Suspense>
    </main>
  );
};

export default NewIndex;
