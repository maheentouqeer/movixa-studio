import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="relative border-t border-border mt-32">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[oklch(0.78_0.17_55)]/60 to-transparent" />
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.78_0.17_55)] to-[oklch(0.68_0.22_25)] text-background font-bold text-sm">M</span>
              <span className="text-display text-2xl">movixa</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm">
              A cinematic AI creative studio for brands that refuse the ordinary.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-muted-foreground">Studio</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="/#work" className="hover:text-foreground text-muted-foreground">Work</a></li>
              <li><a href="/#services" className="hover:text-foreground text-muted-foreground">Services</a></li>
              <li><a href="/#process" className="hover:text-foreground text-muted-foreground">Process</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-muted-foreground">Connect</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/contact" className="hover:text-foreground text-muted-foreground">Start a project</Link></li>
              <li><a href="mailto:hello@movixa.studio" className="hover:text-foreground text-muted-foreground">hello@movixa.studio</a></li>
              <li><Link to="/auth" className="hover:text-foreground text-muted-foreground">Admin</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Movixa Studio. All rights reserved.</p>
          <p>Crafted with obsessive detail.</p>
        </div>
      </div>
    </footer>
  );
}
