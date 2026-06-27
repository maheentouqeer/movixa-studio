import { Linkedin, Github, Twitter } from "lucide-react";
import logoAsset from "@/assets/karigar-logo.jpg.asset.json";

export function SiteFooter() {
  const cols = [
    {
      title: "Product",
      links: ["Features", "How It Works", "Download", "Pricing"],
    },
    {
      title: "Company",
      links: ["About", "Press", "Careers", "Investor Deck"],
    },
    {
      title: "Legal",
      links: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
    },
  ];
  return (
    <footer className="border-t border-[var(--border-glow)] bg-[#040709] py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <img src={logoAsset.url} alt="Karigar AI" className="h-10 w-10 rounded-full ring-1 ring-[var(--primary-lite)]/30" />
              <span className="font-display text-lg font-black">KARIGAR <span className="text-gradient-teal">AI</span></span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-[var(--text-sub)]">
              Pakistan ka pehla Agentic AI — ek awaaz mein koi bhi karigar.
            </p>
            <div className="mt-5 flex gap-2">
              {[Linkedin, Github, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="rounded-lg border border-[var(--border-glow)] p-2 text-[var(--text-sub)] transition hover:border-[var(--primary-lite)]/40 hover:text-[var(--primary-lite)]" aria-label="Social link">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div className="text-[10px] font-black uppercase tracking-widest text-[var(--primary-lite)]">{c.title}</div>
              <ul className="mt-4 space-y-2">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-[var(--text-sub)] transition hover:text-white">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[var(--border-glow)] pt-6 text-xs text-[var(--text-muted)] md:flex-row">
          <div>© 2026 Karigar AI. Built in Karachi, Pakistan 🇵🇰</div>
          <div>Powered by Google ADK + Gemini 2.5</div>
        </div>
      </div>
    </footer>
  );
}
