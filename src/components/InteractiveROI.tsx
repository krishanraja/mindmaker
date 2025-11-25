import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioBuilder } from "@/components/Interactive/PortfolioBuilder";

const InteractiveROI = () => {
  return (
    <section className="section-padding bg-background" id="portfolio">
      <div className="container-width">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Lead from the front.
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground px-4 sm:px-0">
              AI Agents will be working inside most businesses within six months. Are you ready to lead a new species of worker alongside your existing team? Creating a builder-mentality builds your muscle memory and starts your journey to becoming an AI forward leader.
            </p>
          </div>
          
          <PortfolioBuilder />

          <p className="text-xs text-muted-foreground text-center mt-6 px-4">
            * Time savings based on average results from 90+ leadership teams. Individual results vary based on current workflows and implementation depth.
          </p>
        </div>
      </div>
    </section>
  );
};

export default InteractiveROI;
