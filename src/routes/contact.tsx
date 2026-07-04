import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { COUNTRIES, SERVICES, BUDGETS, TIMELINES } from "@/lib/countries";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Check, Upload, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { Particles } from "@/components/site/Particles";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Start your project — Movixa" },
      { name: "description", content: "Tell us about your project. Movixa replies within one business day with a clear next step." },
      { property: "og:title", content: "Start your project — Movixa" },
      { property: "og:description", content: "Cinematic AI creative studio. Reply within 24 hours." },
    ],
  }),
});

const schema = z.object({
  full_name: z.string().trim().min(2, "Please share your full name").max(120),
  company_name: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  country: z.string().min(1, "Country is required"),
  website: z.string().trim().max(255).optional().or(z.literal("")),
  service_required: z.string().optional(),
  estimated_budget: z.string().optional(),
  project_timeline: z.string().optional(),
  project_description: z.string().trim().max(4000).optional().or(z.literal("")),
  consent: z.literal(true, { message: "Please accept the privacy terms" }),
});

function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [form, setForm] = useState({
    full_name: "", company_name: "", email: "", phone: "", country: "",
    website: "", service_required: "", estimated_budget: "", project_timeline: "",
    project_description: "", consent: false,
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please review the form");
      return;
    }
    setSubmitting(true);
    try {
      const { consent, ...payload } = parsed.data;
      void consent;
      const { error } = await supabase.from("contact_submissions").insert({
        ...payload,
        company_name: payload.company_name || null,
        phone: payload.phone || null,
        website: payload.website || null,
        service_required: payload.service_required || null,
        estimated_budget: payload.estimated_budget || null,
        project_timeline: payload.project_timeline || null,
        project_description: payload.project_description || null,
        file_urls: [],
      });
      if (error) throw error;
      setDone(true);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again or email hello@movixa.studio");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen pt-32 pb-24 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-[oklch(0.72_0.19_45)]/15 blur-[140px]" />
      <Particles count={30} />
      <div className="relative mx-auto max-w-4xl px-6">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="glass rounded-[2rem] p-12 md:p-20 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.78_0.17_55)] to-[oklch(0.68_0.22_25)]"
              >
                <Check className="h-8 w-8 text-background" />
              </motion.div>
              <h2 className="mt-8 text-display text-4xl md:text-5xl">Your brief just landed.</h2>
              <p className="mt-4 text-muted-foreground max-w-md mx-auto">
                We'll review your project and reply within one business day. In the meantime, a confirmation is on its way to <span className="text-foreground">{form.email}</span>.
              </p>
              <a href="/" className="mt-10 inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm hover:bg-white/10 transition">
                Back to home <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="text-center">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground">
                  <Sparkles className="h-3 w-3 text-[oklch(0.78_0.17_55)]" /> Reply within 24 hours
                </div>
                <h1 className="mt-6 text-display text-5xl md:text-7xl">Tell us about<br /><span className="gradient-text">your project.</span></h1>
                <p className="mt-4 text-muted-foreground max-w-md mx-auto">The more detail you share, the better we can shape your first proposal.</p>
              </div>

              <form onSubmit={onSubmit} className="mt-16 glass rounded-[2rem] p-6 md:p-10 space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <Field label="Full name *"><Input value={form.full_name} onChange={(e) => set("full_name", e.target.value)} required maxLength={120} /></Field>
                  <Field label="Company name"><Input value={form.company_name} onChange={(e) => set("company_name", e.target.value)} maxLength={120} /></Field>
                  <Field label="Email *"><Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required maxLength={255} /></Field>
                  <Field label="Phone number"><Input value={form.phone} onChange={(e) => set("phone", e.target.value)} maxLength={40} /></Field>
                  <Field label="Country *">
                    <Select value={form.country} onValueChange={(v) => set("country", v)}>
                      <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                      <SelectContent>{COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </Field>
                  <Field label="Company website"><Input value={form.website} onChange={(e) => set("website", e.target.value)} maxLength={255} placeholder="https://" /></Field>
                  <Field label="Service required">
                    <Select value={form.service_required} onValueChange={(v) => set("service_required", v)}>
                      <SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger>
                      <SelectContent>{SERVICES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </Field>
                  <Field label="Estimated budget">
                    <Select value={form.estimated_budget} onValueChange={(v) => set("estimated_budget", v)}>
                      <SelectTrigger><SelectValue placeholder="Select budget" /></SelectTrigger>
                      <SelectContent>{BUDGETS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                    </Select>
                  </Field>
                  <Field label="Project timeline" className="md:col-span-2">
                    <Select value={form.project_timeline} onValueChange={(v) => set("project_timeline", v)}>
                      <SelectTrigger><SelectValue placeholder="Select timeline" /></SelectTrigger>
                      <SelectContent>{TIMELINES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                  </Field>
                </div>

                <Field label="Project description">
                  <Textarea rows={5} value={form.project_description} onChange={(e) => set("project_description", e.target.value)} maxLength={4000} placeholder="Tell us the story, the audience, the mood, references, and anything else that matters." />
                </Field>

                <Field label="Attachments (logo, brief, references)">
                  <label className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-8 cursor-pointer hover:bg-white/5 transition">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="mt-2 text-sm text-muted-foreground">
                      {files.length ? `${files.length} file(s) selected` : "Click to upload PDF, ZIP, or images"}
                    </span>
                    <input
                      type="file" multiple className="hidden"
                      accept=".pdf,.zip,.png,.jpg,.jpeg,.webp,.svg,.ai,.psd"
                      onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
                    />
                  </label>
                  <p className="mt-2 text-xs text-muted-foreground">Files are noted with your inquiry. We'll follow up to transfer securely.</p>
                </Field>

                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox checked={form.consent} onCheckedChange={(v) => set("consent", v === true)} className="mt-0.5" />
                  <span className="text-sm text-muted-foreground">I agree to Movixa processing my information to respond to this inquiry. We never share your data.</span>
                </label>

                <button
                  type="submit" disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-8 py-4 text-sm font-medium hover:opacity-90 disabled:opacity-60 transition"
                >
                  {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : <>Send project brief <ArrowRight className="h-4 w-4" /></>}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
