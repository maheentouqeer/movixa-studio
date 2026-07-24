import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="relative border-t border-border mt-32">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[oklch(0.78_0.17_55)]/60 to-transparent" />
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.78_0.17_55)] to-[oklch(0.68_0.22_25)] text-background font-bold text-sm">
                M
              </span>
              <span className="text-display text-2xl">movixa</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm">
              Cinematic AI Creative Studio
            </p>
            <p className="mt-3 text-sm text-muted-foreground max-w-sm leading-relaxed">
              Creating premium AI commercials, CGI advertisements, architectural visualizations and
              cinematic brand films.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-muted-foreground">Navigation</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href="/#top" className="hover:text-foreground text-muted-foreground">
                  Home
                </a>
              </li>
              <li>
                <a href="/#work" className="hover:text-foreground text-muted-foreground">
                  Work
                </a>
              </li>
              <li>
                <a href="/#services" className="hover:text-foreground text-muted-foreground">
                  Services
                </a>
              </li>
              <li>
                <a href="/#process" className="hover:text-foreground text-muted-foreground">
                  Process
                </a>
              </li>
              <li>
                <Link to="/contact" className="hover:text-foreground text-muted-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-muted-foreground">Email</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href="mailto:maheentouqeer786@gmail.com"
                  className="hover:text-foreground text-muted-foreground"
                >
                  maheentouqeer786@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 Movixa Studio</p>
          <p>Crafted with obsessive detail.</p>
        </div>
      </div>
    </footer>
  );
}
