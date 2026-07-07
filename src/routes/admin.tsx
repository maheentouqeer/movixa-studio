import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, LogOut, Search, Shield, Upload, Trash2, Film } from "lucide-react";
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

interface Video {
  id: string; title: string; description: string | null; category: string;
  storage_path: string; video_url: string; thumbnail_url: string | null;
  sort_order: number; is_published: boolean; created_at: string;
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

const CATEGORIES = ["Showreel", "AI Commercials", "CGI Product Ads", "Architectural", "Logo Motion", "Cinematic Films", "Miniature Worlds", "Experiments"];

function AdminPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

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
            <h1 className="text-display text-4xl">Admin</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage inquiries and showreel videos</p>
          </div>
          <button onClick={signOut} className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm hover:bg-white/10">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>

        <Tabs defaultValue="inquiries" className="mt-8">
          <TabsList className="glass">
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
            <TabsTrigger value="videos"><Film className="h-4 w-4 mr-1.5" /> Videos</TabsTrigger>
          </TabsList>
          <TabsContent value="inquiries" className="mt-6"><InquiriesPanel /></TabsContent>
          <TabsContent value="videos" className="mt-6"><VideosPanel /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function InquiriesPanel() {
  const [rows, setRows] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [active, setActive] = useState<Submission | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
      if (error) toast.error(error.message); else setRows(data as Submission[]);
      setLoading(false);
    })();
  }, []);

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

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-10" />
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
                  <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                    onClick={() => setActive(r)} className="border-b border-border/50 last:border-0 hover:bg-white/5 cursor-pointer">
                    <td className="px-6 py-4"><div>{r.full_name}</div><div className="text-xs text-muted-foreground">{r.email}</div></td>
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

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {active && (
            <>
              <DialogHeader><DialogTitle className="text-2xl text-display">{active.full_name}</DialogTitle></DialogHeader>
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
    </>
  );
}

function VideosPanel() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("videos").select("*").order("sort_order").order("created_at", { ascending: false });
    if (error) toast.error(error.message); else setVideos(data as Video[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const upload = async () => {
    if (!file || !title.trim()) { toast.error("Title and video file required"); return; }
    setUploading(true); setProgress(10);
    try {
      const ext = file.name.split(".").pop() || "mp4";
      const path = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
      setProgress(30);
      const { error: upErr } = await supabase.storage.from("videos").upload(path, file, {
        contentType: file.type, cacheControl: "31536000", upsert: false,
      });
      if (upErr) throw upErr;
      setProgress(75);
      // Long-lived signed URL (10 years) since bucket is private
      const { data: signed, error: signErr } = await supabase.storage.from("videos").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      if (signErr || !signed) throw signErr ?? new Error("Failed to sign URL");
      const { error: insErr } = await supabase.from("videos").insert({
        title: title.trim(), description: description.trim() || null, category,
        storage_path: path, video_url: signed.signedUrl, sort_order: videos.length,
      });
      if (insErr) throw insErr;
      setProgress(100);
      toast.success("Video uploaded");
      setTitle(""); setDescription(""); setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      await load();
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setUploading(false); setProgress(0);
    }
  };

  const togglePublish = async (v: Video) => {
    const { error } = await supabase.from("videos").update({ is_published: !v.is_published }).eq("id", v.id);
    if (error) toast.error(error.message);
    else { setVideos((xs) => xs.map((x) => x.id === v.id ? { ...x, is_published: !x.is_published } : x)); }
  };

  const remove = async (v: Video) => {
    if (!confirm(`Delete "${v.title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("videos").delete().eq("id", v.id);
    if (error) { toast.error(error.message); return; }
    await supabase.storage.from("videos").remove([v.storage_path]);
    setVideos((xs) => xs.filter((x) => x.id !== v.id));
    toast.success("Video deleted");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
      <div className="glass rounded-2xl p-6 h-fit">
        <h2 className="text-display text-2xl">Upload video</h2>
        <p className="mt-1 text-xs text-muted-foreground">Shown on the homepage showreel.</p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Aether Perfume — Cinematic Ad" className="mt-2" disabled={uploading} />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Category</label>
            <Select value={category} onValueChange={setCategory} disabled={uploading}>
              <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Description</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-2" disabled={uploading} />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Video file</label>
            <Input ref={fileRef} type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="mt-2" disabled={uploading} />
            {file && <p className="mt-1 text-xs text-muted-foreground">{file.name} · {(file.size / 1024 / 1024).toFixed(1)} MB</p>}
          </div>
          {uploading && (
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-[oklch(0.78_0.17_55)] transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
          <Button onClick={upload} disabled={uploading || !file || !title.trim()} className="w-full">
            {uploading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading…</> : <><Upload className="h-4 w-4 mr-2" /> Upload</>}
          </Button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-display text-2xl">Library</h2>
          <span className="text-xs text-muted-foreground">{videos.length} video{videos.length === 1 ? "" : "s"}</span>
        </div>
        {loading ? <CenterSpinner /> : videos.length === 0 ? (
          <div className="mt-6 glass rounded-2xl p-12 text-center text-muted-foreground">No videos yet. Upload your first showreel.</div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {videos.map((v) => (
              <div key={v.id} className="glass rounded-2xl overflow-hidden">
                <video src={v.video_url} muted playsInline preload="metadata" className="aspect-video w-full object-cover bg-black" controls />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{v.title}</div>
                      <div className="text-xs text-muted-foreground">{v.category}</div>
                    </div>
                    <Badge variant="outline" className={v.is_published ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"}>
                      {v.is_published ? "Live" : "Hidden"}
                    </Badge>
                  </div>
                  {v.description && <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{v.description}</p>}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Switch checked={v.is_published} onCheckedChange={() => togglePublish(v)} />
                      Published
                    </div>
                    <button onClick={() => remove(v)} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10">
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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
