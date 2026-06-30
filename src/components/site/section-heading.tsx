import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap-init";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      gsap.set(el.querySelectorAll("[data-anim]"), { opacity: 1, y: 0 });
      return;
    }
    const items = el.querySelectorAll<HTMLElement>("[data-anim]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y: 32, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: el, start: "top 80%", once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className={`${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} mb-16`}
    >
      {eyebrow && (
        <div
          data-anim
          className="mb-5 inline-flex items-center rounded-full border border-[var(--border-glow)] bg-[var(--primary)]/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--primary-lite)] opacity-0"
        >
          {eyebrow}
        </div>
      )}
      <h2
        data-anim
        className="font-display text-[clamp(2.4rem,5vw,4.75rem)] font-black leading-[0.98] tracking-[-0.03em] opacity-0"
      >
        {title}
      </h2>
      {subtitle && (
        <p data-anim className="mt-6 text-lg text-[var(--text-sub)] md:text-xl opacity-0">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function Reveal({
  children,
  delay = 0,
  className = "",
  y = 40,
  ease = "power3.out",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  ease?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease,
          delay,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [delay, y, ease]);

  return (
    <div ref={ref} className={`opacity-0 ${className}`}>
      {children}
    </div>
  );
}
