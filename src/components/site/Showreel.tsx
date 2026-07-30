import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Video {
  id: string;
  title: string;
  description: string | null;
  category: string;
  storage_path: string;
  video_url: string;
  thumbnail_url: string | null;
}

const VIDEO_BUCKET = "videos";

async function resolveVideoAsset(path: string | null | undefined, fallback?: string | null) {
  if (!path) return fallback ?? null;

  const { data } = await supabase.storage.from(VIDEO_BUCKET).createSignedUrl(path, 60 * 60);
  if (data?.signedUrl) return data.signedUrl;

  const { data: publicUrl } = supabase.storage.from(VIDEO_BUCKET).getPublicUrl(path);
  return publicUrl.publicUrl || fallback || null;
}

function VideoCard({ v, i }: { v: Video; i: number }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => {
        ref.current?.play().catch(() => {});
        setPlaying(true);
      }}
      onMouseLeave={() => {
        ref.current?.pause();
        setPlaying(false);
      }}
      className="group relative aspect-[4/5] rounded-3xl overflow-hidden glass"
    >
      <video
        ref={ref}
        src={v.video_url}
        poster={v.thumbnail_url ?? undefined}
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className={`absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent transition-opacity duration-500 ${playing ? "opacity-60" : "opacity-90"}`}
      />
      <div className="absolute top-5 left-5">
        <span className="rounded-full glass px-3 py-1 text-[10px] uppercase tracking-widest">
          {v.category}
        </span>
      </div>
      <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
        <div>
          <h3 className="text-display text-2xl md:text-3xl">{v.title}</h3>
          {v.description && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{v.description}</p>
          )}
        </div>
        <div className="rounded-full bg-foreground text-background p-3 opacity-0 group-hover:opacity-100 transition">
          <Play className="h-4 w-4 fill-current" />
        </div>
      </div>
    </motion.div>
  );
}

export function Showreel() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("videos")
        .select("id,title,description,category,storage_path,video_url,thumbnail_url")
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      const rows = (data as Video[]) ?? [];
      const resolved = await Promise.all(
        rows.map(async (video) => ({
          ...video,
          video_url:
            (await resolveVideoAsset(video.storage_path, video.video_url)) ?? video.video_url,
          thumbnail_url: video.thumbnail_url,
        })),
      );
      setVideos(resolved);
      setLoaded(true);
    })();
  }, []);

  if (!loaded || videos.length === 0) return null;

  return (
    <section id="showreel" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between flex-wrap gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <span className="h-px w-8 bg-[oklch(0.78_0.17_55)]" /> Showreel
            </div>
            <h2 className="mt-6 text-display text-4xl md:text-6xl lg:text-7xl">
              Frames that <span className="gradient-text">move brands.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Hover to preview. Every second here was rendered, refined, and directed in-house.
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((v, i) => (
            <VideoCard key={v.id} v={v} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
