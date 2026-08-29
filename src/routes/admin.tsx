import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Facebook,
  Film,
  ImagePlus,
  Instagram,
  Link2,
  Loader2,
  LogOut,
  Search,
  Shield,
  Trash2,
  Upload,
  Youtube,
} from "lucide-react";
import { motion } from "framer-motion";
import { sectionMediaPublicUrl } from "@/components/site/SectionMedia";
import { SOCIAL_KEYS, type SocialKey } from "@/hooks/useSiteLinks";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin — Movixa" }, { name: "robots", content: "noindex" }] }),
});

type Status = "new" | "contacted" | "in_progress" | "completed" | "closed";
interface Submission {
  id: string;
  full_name: string;
  company_name: string | null;
  email: string;
  phone: string | null;
  country: string;
  website: string | null;
  service_required: string | null;
  estimated_budget: string | null;
  project_timeline: string | null;
  project_description: string | null;
  file_urls: string[] | null;
  status: Status;
  admin_notes: string | null;
  created_at: string;
}

interface Video {
  id: string;
  title: string;
  description: string | null;
  category: string;
  storage_path: string;
  video_url: string;
  thumbnail_url: string | null;
  display_video_url?: string;
  display_thumbnail_url?: string | null;
  sort_order: number;
  is_published: boolean;
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
  new: "New",
  contacted: "Contacted",
  in_progress: "In Progress",
  completed: "Completed",
  closed: "Closed",
};

const titleFromFileName = (name: string) =>
  name
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const CATEGORIES = [
  "Showreel",
  "AI Commercial",
  "CGI Product Ads",
  "Architectural",
  "Logo Motion",
  "Cinematic Films",
  "Miniature Worlds",
  "Experiments",
  "Digital Experiences",
  "Brand Visuals",
];

const VIDEO_BUCKET = "videos";
const signedUrlTtlSeconds = 60 * 60;

async function resolveStorageUrl(path: string | null | undefined, fallback?: string | null) {
  if (!path) return fallback ?? null;

  const { data } = await supabase.storage
    .from(VIDEO_BUCKET)
    .createSignedUrl(path, signedUrlTtlSeconds);

  if (data?.signedUrl) return data.signedUrl;

  const { data: publicUrl } = supabase.storage.from(VIDEO_BUCKET).getPublicUrl(path);
  return publicUrl.publicUrl || fallback || null;
}

const publicStorageUrl = sectionMediaPublicUrl;

function makeStoragePath(folder: "videos" | "thumbnails" | "images", file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase() || (folder === "videos" ? "mp4" : "jpg");
  return `${folder}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
}

function AdminPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        navigate({ to: "/auth", replace: true });
        return;
      }
      setUserId(data.user.id);
      const { data: roleRow, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (roleError) toast.error(roleError.message);
      setIsAdmin(roleRow?.role === "admin");
      setChecking(false);
    })();
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  if (checking) return <CenterSpinner />;

  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-32 px-6">
        <div className="mx-auto max-w-xl glass rounded-3xl p-10 text-center">
          <Shield className="mx-auto h-10 w-10 text-[oklch(0.78_0.17_55)]" />
          <h1 className="mt-6 text-display text-3xl">Admin access required</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            You're signed in, but your account isn't an admin yet. Grant yourself the admin role in
            Supabase:
          </p>
          <pre className="mt-4 text-left text-xs bg-black/40 rounded-lg p-4 overflow-x-auto">{`INSERT INTO public.user_roles (user_id, role)
VALUES ('${userId ?? "YOUR_USER_ID"}', 'admin');`}</pre>
          <button
            onClick={signOut}
            className="mt-6 text-sm text-muted-foreground hover:text-foreground"
          >
            Sign out
          </button>
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
            <p className="mt-1 text-sm text-muted-foreground">
              Manage inquiries and showreel videos
            </p>
          </div>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>

        <Tabs defaultValue="inquiries" className="mt-8">
          <TabsList className="glass">
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
            <TabsTrigger value="videos">
              <Film className="h-4 w-4 mr-1.5" /> Videos
            </TabsTrigger>
            <TabsTrigger value="sections">
              <ImagePlus className="h-4 w-4 mr-1.5" /> Sections
            </TabsTrigger>
            <TabsTrigger value="links">
              <Link2 className="h-4 w-4 mr-1.5" /> Links
            </TabsTrigger>
          </TabsList>
          <TabsContent value="inquiries" className="mt-6">
            <InquiriesPanel />
          </TabsContent>
          <TabsContent value="videos" className="mt-6">
            <VideosPanel />
          </TabsContent>
          <TabsContent value="sections" className="mt-6">
            <SectionsPanel />
          </TabsContent>
          <TabsContent value="links" className="mt-6">
            <LinksPanel />
          </TabsContent>
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
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) toast.error(error.message);
      else setRows(data as Submission[]);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!query) return true;
      return [r.full_name, r.email, r.company_name, r.country, r.service_required].some((v) =>
        v?.toLowerCase().includes(query),
      );
    });
  }, [rows, q, statusFilter]);

  const updateStatus = async (id: string, status: Status) => {
    const prev = rows;
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
    if (active?.id === id) setActive({ ...active, status });
    const { error } = await supabase.from("contact_submissions").update({ status }).eq("id", id);
    if (error) {
      setRows(prev);
      toast.error(error.message);
    } else toast.success("Status updated");
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {(Object.keys(STATUS_LABELS) as Status[]).map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 glass rounded-2xl overflow-hidden">
        {loading ? (
          <CenterSpinner />
        ) : filtered.length === 0 ? (
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
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
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={STATUS_COLORS[r.status]}>
                        {STATUS_LABELS[r.status]}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
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
              <DialogHeader>
                <DialogTitle className="text-2xl text-display">{active.full_name}</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-4 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={STATUS_COLORS[active.status]}>
                    {STATUS_LABELS[active.status]}
                  </Badge>
                  <Select
                    value={active.status}
                    onValueChange={(v) => updateStatus(active.id, v as Status)}
                  >
                    <SelectTrigger className="w-[180px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(STATUS_LABELS) as Status[]).map((s) => (
                        <SelectItem key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </SelectItem>
                      ))}
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
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">
                      Description
                    </div>
                    <p className="mt-2 leading-relaxed whitespace-pre-wrap">
                      {active.project_description}
                    </p>
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
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const thumbnailRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("sort_order")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else {
      const rows = (data as Video[]) ?? [];
      const resolved = await Promise.all(
        rows.map(async (video) => ({
          ...video,
          display_video_url:
            (await resolveStorageUrl(video.storage_path, video.video_url)) ?? video.video_url,
          display_thumbnail_url: video.thumbnail_url,
        })),
      );
      setVideos(resolved);
    }
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const upload = async () => {
    if (!file) {
      toast.error("Choose a video file first");
      return;
    }
    const videoTitle = title.trim() || titleFromFileName(file.name) || "Untitled video";
    setUploading(true);
    setProgress(10);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user)
        throw userError ?? new Error("You must be signed in to upload videos.");
      const path = makeStoragePath("videos", file);
      setProgress(30);
      const { error: upErr } = await supabase.storage.from(VIDEO_BUCKET).upload(path, file, {
        contentType: file.type,
        cacheControl: "31536000",
        upsert: false,
      });
      if (upErr) throw upErr;

      let thumbnailPath: string | null = null;
      let thumbnailUrl: string | null = null;
      if (thumbnailFile) {
        setProgress(58);
        thumbnailPath = makeStoragePath("thumbnails", thumbnailFile);
        const { error: thumbnailError } = await supabase.storage
          .from(VIDEO_BUCKET)
          .upload(thumbnailPath, thumbnailFile, {
            contentType: thumbnailFile.type,
            cacheControl: "31536000",
            upsert: false,
          });
        if (thumbnailError) throw thumbnailError;
        thumbnailUrl = publicStorageUrl(thumbnailPath);
      }

      setProgress(75);
      const publicUrl = publicStorageUrl(path);
      const { error: insErr } = await supabase.from("videos").insert({
        title: videoTitle,
        description: description.trim() || null,
        category,
        storage_path: path,
        video_url: publicUrl,
        thumbnail_url: thumbnailUrl,
        sort_order: videos.length,
        created_by: userData.user.id,
      });
      if (insErr) throw insErr;
      setProgress(100);
      toast.success("Video uploaded");
      setTitle("");
      setDescription("");
      setFile(null);
      setThumbnailFile(null);
      if (fileRef.current) fileRef.current.value = "";
      if (thumbnailRef.current) thumbnailRef.current.value = "";
      await load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const togglePublish = async (v: Video) => {
    const { error } = await supabase
      .from("videos")
      .update({ is_published: !v.is_published })
      .eq("id", v.id);
    if (error) toast.error(error.message);
    else {
      setVideos((xs) =>
        xs.map((x) => (x.id === v.id ? { ...x, is_published: !x.is_published } : x)),
      );
    }
  };

  const remove = async (v: Video) => {
    if (!confirm(`Delete "${v.title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("videos").delete().eq("id", v.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    await supabase.storage.from(VIDEO_BUCKET).remove([v.storage_path]);
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
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Aether Perfume — Cinematic Ad"
              className="mt-2"
              disabled={uploading}
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">
              Category
            </label>
            <Select value={category} onValueChange={setCategory} disabled={uploading}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-2"
              disabled={uploading}
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">
              Video file
            </label>
            <Input
              ref={fileRef}
              type="file"
              accept="video/*"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0] ?? null;
                setFile(selectedFile);
                if (selectedFile && !title.trim()) {
                  setTitle(titleFromFileName(selectedFile.name));
                }
              }}
              className="mt-2"
              disabled={uploading}
            />
            {file && (
              <p className="mt-1 text-xs text-muted-foreground">
                {file.name} · {(file.size / 1024 / 1024).toFixed(1)} MB
              </p>
            )}
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">
              Thumbnail image
            </label>
            <Input
              ref={thumbnailRef}
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)}
              className="mt-2"
              disabled={uploading}
            />
            {thumbnailFile && (
              <p className="mt-1 text-xs text-muted-foreground">
                {thumbnailFile.name} Â· {(thumbnailFile.size / 1024 / 1024).toFixed(1)} MB
              </p>
            )}
          </div>
          {uploading && (
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-[oklch(0.78_0.17_55)] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          <Button onClick={upload} disabled={uploading || !file} className="w-full">
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading…
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" /> Upload
              </>
            )}
          </Button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-display text-2xl">Library</h2>
          <span className="text-xs text-muted-foreground">
            {videos.length} video{videos.length === 1 ? "" : "s"}
          </span>
        </div>
        {loading ? (
          <CenterSpinner />
        ) : videos.length === 0 ? (
          <div className="mt-6 glass rounded-2xl p-12 text-center text-muted-foreground">
            No videos yet. Upload your first showreel.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {videos.map((v) => (
              <div key={v.id} className="glass rounded-2xl overflow-hidden">
                <video
                  src={v.display_video_url ?? v.video_url}
                  poster={v.display_thumbnail_url ?? v.thumbnail_url ?? undefined}
                  muted
                  playsInline
                  preload="metadata"
                  className="aspect-video w-full object-cover bg-black"
                  controls
                />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{v.title}</div>
                      <div className="text-xs text-muted-foreground">{v.category}</div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        v.is_published
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                          : "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"
                      }
                    >
                      {v.is_published ? "Live" : "Hidden"}
                    </Badge>
                  </div>
                  {v.description && (
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                      {v.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Switch checked={v.is_published} onCheckedChange={() => togglePublish(v)} />
                      Published
                    </div>
                    {v.display_thumbnail_url && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <ImagePlus className="h-3.5 w-3.5" /> Thumbnail
                      </span>
                    )}
                    <button
                      onClick={() => remove(v)}
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10"
                    >
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
  return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

interface SiteSection {
  slot: string;
  label: string;
  title: string;
  description: string | null;
  storage_path: string | null;
  video_url: string | null;
  image_paths: string[] | null;
  image_urls: string[] | null;
}

const SLOT_NAMES: Record<string, string> = {
  frame_sequence: "Frame Sequence",
  brand_visuals: "Brand Visuals",
  digital_experiences: "Digital Experiences",
};

function SectionsPanel() {
  const [rows, setRows] = useState<SiteSection[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("site_sections")
      .select("slot,label,title,description,storage_path,video_url,image_paths,image_urls")
      .order("slot");
    if (error) toast.error(error.message);
    else setRows(((data ?? []) as SiteSection[]).filter((row) => row.slot !== "film_reel"));
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  if (loading) return <CenterSpinner />;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {rows.map((row) => (
        <SectionCard key={row.slot} row={row} onSaved={load} />
      ))}
      {rows.length === 0 && (
        <p className="text-sm text-muted-foreground">No editable sections found.</p>
      )}
    </div>
  );
}

function SectionCard({ row, onSaved }: { row: SiteSection; onSaved: () => void }) {
  const [label, setLabel] = useState(row.label ?? "");
  const [title, setTitle] = useState(row.title ?? "");
  const [description, setDescription] = useState(row.description ?? "");
  const [imagePaths, setImagePaths] = useState<string[]>(row.image_paths ?? []);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const isBrandSection = row.slot === "brand_visuals";
  const acceptsVideo = row.slot === "frame_sequence" || row.slot === "digital_experiences";

  useEffect(() => {
    setLabel(row.label ?? "");
    setTitle(row.title ?? "");
    setDescription(row.description ?? "");
    setImagePaths(row.image_paths ?? []);
  }, [row]);

  const save = async (patch: Partial<SiteSection> = {}) => {
    setSaving(true);
    const { error } = await supabase
      .from("site_sections")
      .update({ label, title, description: description || null, ...patch })
      .eq("slot", row.slot);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Section updated");
    onSaved();
  };

  const upload = async (file: File) => {
    setUploading(true);
    const path = makeStoragePath("videos", file);
    const { error } = await supabase.storage.from(VIDEO_BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    setUploading(false);
    if (error) return toast.error(error.message);
    await save({ storage_path: path, video_url: publicStorageUrl(path) });
  };

  const uploadImages = async (files: FileList) => {
    const selected = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (!selected.length) return toast.error("Choose image files first");

    setUploading(true);
    const nextPaths = [...imagePaths];
    const nextUrls = [...(row.image_urls ?? [])];
    try {
      for (const file of selected) {
        const path = makeStoragePath("images", file);
        const { error } = await supabase.storage.from(VIDEO_BUCKET).upload(path, file, {
          contentType: file.type,
          cacheControl: "31536000",
          upsert: false,
        });
        if (error) throw error;
        nextPaths.push(path);
        nextUrls.push(publicStorageUrl(path));
      }

      setImagePaths(nextPaths);
      await save({ image_paths: nextPaths, image_urls: nextUrls });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (path: string) => {
    const nextPaths = imagePaths.filter((item) => item !== path);
    setImagePaths(nextPaths);
    await save({
      image_paths: nextPaths,
      image_urls: nextPaths.map(publicStorageUrl),
    });
    await supabase.storage.from(VIDEO_BUCKET).remove([path]);
  };

  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-display text-2xl">{SLOT_NAMES[row.slot] ?? row.slot}</h3>
        <Badge variant="outline" className="text-[10px] uppercase tracking-widest">
          {isBrandSection
            ? imagePaths.length
              ? `${imagePaths.length} image${imagePaths.length === 1 ? "" : "s"}`
              : "No images"
            : row.storage_path
              ? "Video set"
              : "No video"}
        </Badge>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Label</label>
          <Input value={label} onChange={(e) => setLabel(e.target.value)} className="mt-1" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground">
            Description
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1"
          />
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void upload(f);
          e.target.value = "";
        }}
      />

      <input
        ref={imageRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = e.target.files;
          if (files) void uploadImages(files);
          e.target.value = "";
        }}
      />

      {isBrandSection && imagePaths.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {imagePaths.map((path) => (
            <div key={path} className="group relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-black">
              <img src={publicStorageUrl(path)} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => void removeImage(path)}
                className="absolute right-1.5 top-1.5 rounded-full bg-black/70 p-1 opacity-0 transition group-hover:opacity-100"
                aria-label="Remove image"
              >
                <Trash2 className="h-3.5 w-3.5 text-red-200" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => void save()} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save text"}
        </Button>
        {acceptsVideo && (
          <Button variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Upload className="h-4 w-4 mr-1.5" /> {row.storage_path ? "Replace video" : "Upload video"}
              </>
            )}
          </Button>
        )}
        {isBrandSection && (
          <Button variant="outline" onClick={() => imageRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><ImagePlus className="h-4 w-4 mr-1.5" /> Upload images</>}
          </Button>
        )}
        {acceptsVideo && row.storage_path && (
          <Button
            variant="ghost"
            onClick={() => void save({ storage_path: null, video_url: null })}
            disabled={saving}
          >
            <Trash2 className="h-4 w-4 mr-1.5" /> Remove video
          </Button>
          )}
      </div>
    </div>
  );
}

type SiteLink = {
  key: SocialKey;
  label: string;
  Icon: typeof Instagram;
  placeholder: string;
};

const SITE_LINKS: SiteLink[] = [
  {
    key: "instagram_url",
    label: "Instagram",
    Icon: Instagram,
    placeholder: "https://instagram.com/movixa",
  },
  {
    key: "youtube_url",
    label: "YouTube",
    Icon: Youtube,
    placeholder: "https://youtube.com/@movixa",
  },
  {
    key: "facebook_url",
    label: "Facebook",
    Icon: Facebook,
    placeholder: "https://facebook.com/movixa",
  },
];

function LinksPanel() {
  const [values, setValues] = useState<Record<SocialKey, string>>({
    instagram_url: "",
    youtube_url: "",
    facebook_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("site_settings")
        .select("key,value")
        .in("key", SOCIAL_KEYS as unknown as string[]);
      if (error) toast.error(error.message);
      else {
        const next = { ...values };
        for (const row of (data ?? []) as { key: string; value: string }[]) {
          if ((SOCIAL_KEYS as readonly string[]).includes(row.key)) {
            next[row.key as SocialKey] = row.value;
          }
        }
        setValues(next);
      }
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("site_settings").upsert(
      SOCIAL_KEYS.map((key) => ({
        key,
        value: values[key].trim(),
      })),
      { onConflict: "key" },
    );
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Links updated");
  };

  if (loading) return <CenterSpinner />;

  return (
    <div className="max-w-2xl glass rounded-2xl p-6">
      <h2 className="text-display text-2xl">Social links</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        These links are used by the homepage social buttons.
      </p>
      <div className="mt-6 space-y-4">
        {SITE_LINKS.map(({ key, label, Icon, placeholder }) => (
          <div key={key}>
            <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <Icon className="h-4 w-4" /> {label}
            </label>
            <Input
              value={values[key]}
              onChange={(e) => setValues((current) => ({ ...current, [key]: e.target.value }))}
              placeholder={placeholder}
              className="mt-2"
            />
          </div>
        ))}
      </div>
      <Button onClick={save} disabled={saving} className="mt-6">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save links"}
      </Button>
    </div>
  );
}
