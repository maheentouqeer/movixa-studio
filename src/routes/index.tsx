import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/site-nav";
import { Hero } from "@/components/site/hero";
import {
  ProblemSection,
  HowItWorks,
  AgentsSection,
  DemoSection,
  FeaturesSection,
  TractionSection,
  MarketSection,
  PricingSection,
  InvestorsSection,
  FounderSection,
  ContactSection,
} from "@/components/site/sections";
import { SiteFooter } from "@/components/site/site-footer";
import { FloatingChat } from "@/components/site/floating-chat";
import { ElectricStorySection } from "@/components/site/electric-story";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Karigar AI — Pakistan's First Agentic AI Marketplace" },
      {
        name: "description",
        content:
          "14 AI agents. Real-time A2A negotiation. Book any karigar in Pakistan in 10 seconds with voice — Urdu, Roman Urdu or English. 4th nationally at AISeekho 2026.",
      },
      { property: "og:title", content: "Karigar AI — Ek awaaz mein koi bhi karigar" },
      {
        property: "og:description",
        content:
          "Pakistan ka pehla Agentic AI marketplace for informal home services. 14 AI agents, live price negotiation, 10-second auto-recovery.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--bg-deep)] text-white">
      <SiteNav />
      <main>
        <Hero />
        <ProblemSection />
        <ElectricStorySection />
        <HowItWorks />
        <AgentsSection />
        <DemoSection />
        <FeaturesSection />
        <TractionSection />
        <MarketSection />
        <PricingSection />
        <InvestorsSection />
        <FounderSection />
        <ContactSection />
      </main>
      <SiteFooter />
      <FloatingChat />
    </div>
  );
}
