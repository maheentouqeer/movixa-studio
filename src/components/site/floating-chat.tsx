import { useState } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoAsset from "@/assets/karigar-logo.jpg.asset.json";

export function FloatingChat() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-[0_0_30px_rgba(20,255,236,0.4)] transition hover:scale-110"
        aria-label="Open chat"
      >
        {open ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-40 w-[340px] glass-card overflow-hidden p-0"
          >
            <div className="flex items-center gap-3 border-b border-[var(--border-glow)] bg-[var(--primary)]/10 p-3">
              <img src={logoAsset.url} alt="Karigar" className="h-9 w-9 rounded-full ring-1 ring-[var(--primary-lite)]/40" />
              <div>
                <div className="text-sm font-bold">Karigar AI Assistant</div>
                <div className="flex items-center gap-1 text-[10px] text-[var(--success)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)] animate-pulse" /> Online
                </div>
              </div>
            </div>
            <div className="space-y-2 p-4 text-xs">
              <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-white/5 px-3 py-2">
                mujhe plumber chahiye G-9
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-[var(--primary)]/20 px-3 py-2 text-white">
                Found <b>3 plumbers</b> near G-9. Best match: <b>Hassan Plumbing (4.8★)</b>. Negotiated price <b>Rs 650</b>. Book now?
              </div>
              <button className="ml-auto mt-2 block rounded-lg bg-[var(--primary-lite)] px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-[var(--bg-deep)]">
                Book →
              </button>
            </div>
            <div className="flex items-center gap-2 border-t border-[var(--border-glow)] p-3">
              <input
                placeholder="Type or speak..."
                className="flex-1 rounded-lg bg-white/5 px-3 py-2 text-xs focus:outline-none"
              />
              <button className="rounded-lg bg-[var(--primary)] p-2 text-white">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
