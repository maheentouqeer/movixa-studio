import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-border">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[oklch(0.78_0.17_55)]/60 to-transparent" />
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <h2 className="text-display text-5xl leading-[0.95]">
              BUILT FOR
              <br />
              THE NEXT FRAME.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
              Movixa creates digital experiences, cinematic AI advertising and visual systems for
              ambitious brands.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-muted-foreground">Navigation</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                ["Work", "/#work"],
                ["Services", "/#services"],
                ["Process", "/#process"],
                ["Lab", "/#lab"],
              ].map(([label, href]) => (
                <li key={href}>
                  <a href={href} className="text-muted-foreground hover:text-foreground">
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-muted-foreground">Connect</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href="mailto:maheentouqeer786@gmail.com"
                  className="text-muted-foreground hover:text-foreground"
                >
                  maheentouqeer786@gmail.com
                </a>
              </li>
              {["Instagram", "YouTube", "Facebook"].map((label) => (
                <li key={label}>
                  <a
                    href={`https://${label.toLowerCase()}.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
          <p>Copyright 2026 Movixa Studio</p>
          <p>Crafted with obsessive detail.</p>
        </div>
      </div>
    </footer>
  );
}
