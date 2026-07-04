import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, LogOut, Search, Shield } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin — Movixa" }, { name: "robots", content: "noindex" }] }),
});

type Status = "new" | "contacted" | "in_progress" | "completed" | "closed";
interface Submission {
  id: string; full_name: string; company_name: string | null; email: string;
  phone: string | null; country: string; website: string | null;
  service_required: string | null; estimated_budget: string | null;
  project_timeline: string | null; project_description: string | null;
  file_urls: string[] | null; status: Status; admin_notes: string | null;
  created_at: string;
}

const STATUS_COLORS: Record<Status, string> = {
  new: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  contacted: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  in_progress: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  completed: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  closed: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
};
const STATUS_LABELS: Record<Status, string> = {
  new: "New", contacted: "Contacted", in_progress: "In Progress", completed: "Completed", closed: "Closed",
};

function AdminPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [rows, setRows] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [active, setActive] = useState<Submission | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) { navigate({ to: "/auth" }); return; }
      setUserId(data.session.user.id);
      const { data: roleRow } = await supabase.rpc("has_role", { _user_id: data.session.user.id, _role: "admin" });
      setIsAdmin(roleRow === true);
      setChecking(false);
    })();
  }, [navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
      if (error) toast.error(error.message);
      else setRows(data as Submission[]);
      setLoading(false);
    })();
  }, [isAdmin]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!query) return true;
      return [r.full_name, r.email, r.company_name, r.country, r.service_required]
        .some((v) => v?.toLowerCase().includes(query));
    });
  }, [rows, q, statusFilter]);

  const updateStatus = async (id: string, status: Status) => {
    const prev = rows;
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
    if (active?.id === id) setActive({ ...active, status });
    const { error } = await supabase.from("contact_submissions").update({ status }).eq("id", id);
    if (error) { setRows(prev); toast.error(error.message); } else toast.success("Status updated");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  if (checking) return <CenterSpinner />;

  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-32 px-6">
        <div className="mx-auto max-w-xl glass rounded-3xl p-10 text-center">
          <Shield className="mx-auto h-10 w-10 text-[oklch(0.78_0.17_55)]" />
          <h1 className="mt-6 text-display text-3xl">Admin access required</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            You're signed in, but your account isn't an admin yet. Grant yourself the admin role in Supabase:
          </p>
          <pre className="mt-4 text-left text-xs bg-black/40 rounded-lg p-4 overflow-x-auto">{`INSERT INTO public.user_roles (user_id, role)
VALUES ('${userId ?? "YOUR_USER_ID"}', 'admin');`}</pre>
          <button onClick={signOut} className="mt-6 text-sm text-muted-foreground hover:text-foreground">Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-16 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-display text-4xl">Inquiries</h1>
            <p className="mt-1 text-sm text-muted-foreground">{rows.length} total · {rows.filter((r) => r.status === "new").length} new</p>
          </div>
          <button onClick={signOut} className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm hover:bg-white/10">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name, email, company…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-10" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {(Object.keys(STATUS_LABELS) as Status[]).map((s) => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-6 glass rounded-2xl overflow-hidden">
          {loading ? <CenterSpinner /> : filtered.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">No inquiries match.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                  <tr>
                    <th className="text-left px-6 py-4">Name</th>
                    <th className="text-left px-6 py-4">Company</th>
                    <th className="text-left px-6 py-4">Service</th>
                    <th className="text-left px-6 py-4">Country</th>
                    <th className="text-left px-6 py-4">Status</th>
                    <th className="text-left px-6 py-4">Received</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                      onClick={() => setActive(r)}
                      className="border-b border-border/50 last:border-0 hover:bg-white/5 cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div>{r.full_name}</div>
                        <div className="text-xs text-muted-foreground">{r.email}</div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{r.company_name ?? "—"}</td>
                      <td className="px-6 py-4 text-muted-foreground">{r.service_required ?? "—"}</td>
                      <td className="px-6 py-4 text-muted-foreground">{r.country}</td>
                      <td className="px-6 py-4"><Badge variant="outline" className={STATUS_COLORS[r.status]}>{STATUS_LABELS[r.status]}</Badge></td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {active && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-display">{active.full_name}</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-4 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={STATUS_COLORS[active.status]}>{STATUS_LABELS[active.status]}</Badge>
                  <Select value={active.status} onValueChange={(v) => updateStatus(active.id, v as Status)}>
                    <SelectTrigger className="w-[180px] h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(Object.keys(STATUS_LABELS) as Status[]).map((s) => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Grid label="Email" value={active.email} />
                <Grid label="Phone" value={active.phone} />
                <Grid label="Company" value={active.company_name} />
                <Grid label="Website" value={active.website} />
                <Grid label="Country" value={active.country} />
                <Grid label="Service" value={active.service_required} />
                <Grid label="Budget" value={active.estimated_budget} />
                <Grid label="Timeline" value={active.project_timeline} />
                <Grid label="Received" value={new Date(active.created_at).toLocaleString()} />
                {active.project_description && (
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Description</div>
                    <p className="mt-2 leading-relaxed whitespace-pre-wrap">{active.project_description}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Grid({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-4">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div>{value || "—"}</div>
    </div>
  );
}

function CenterSpinner() {
  return <div className="flex items-center justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
}
