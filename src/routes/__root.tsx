import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  Link,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { CustomCursor } from "@/components/site/CustomCursor";
import { AmbientBackdrop } from "@/components/site/AmbientBackdrop";
import { BackgroundMusic } from "@/components/site/BackgroundMusic";

function NotFoundComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center max-w-md">
        <h1 className="text-display text-8xl gradient-text">404</h1>
        <p className="mt-4 text-muted-foreground">This scene doesn't exist.</p>
        <Link to="/" className="mt-8 inline-flex items-center rounded-full glass px-6 py-3 text-sm">Return home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "root" }); }, [error]);
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-display text-4xl">Something broke the scene.</h1>
        <p className="mt-3 text-sm text-muted-foreground">Try again or head back home.</p>
        <div className="mt-6 flex gap-3 justify-center">
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-full bg-foreground text-background px-5 py-2.5 text-sm">Try again</button>
          <a href="/" className="rounded-full glass px-5 py-2.5 text-sm">Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Movixa — Cinematic AI Creative Studio" },
      { name: "description", content: "AI commercials, CGI product ads, architectural transformations, logo animations, and cinematic AI films. Built for brands that refuse the ordinary." },
      { name: "author", content: "Movixa" },
      { property: "og:title", content: "Movixa — Cinematic AI Creative Studio" },
      { property: "og:description", content: "AI commercials, CGI product ads, architectural transformations, logo animations, and cinematic AI films. Built for brands that refuse the ordinary." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Movixa — Cinematic AI Creative Studio" },
      { name: "twitter:description", content: "AI commercials, CGI product ads, architectural transformations, logo animations, and cinematic AI films. Built for brands that refuse the ordinary." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/3d6c1ed9-25cd-4cb2-8944-b979d33eac37" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/3d6c1ed9-25cd-4cb2-8944-b979d33eac37" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <SmoothScroll />
      <AmbientBackdrop />
      <CustomCursor />
      <Navbar />
      <main className="relative">
        <Outlet />
      </main>
      <Footer />
      <Toaster theme="dark" />
      <BackgroundMusic />
    </QueryClientProvider>
  );
}
