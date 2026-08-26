import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

export interface SectionMedia {
  slot: string;
  label: string;
  title: string;
  description: string | null;
  storage_path: string | null;
  video_url: string | null;
}

const VIDEO_BUCKET = "videos";

export async function resolveSectionVideo(media: SectionMedia | null) {
  if (!media) return null;
  if (media.storage_path) {
    const { data } = await supabase.storage
      .from(VIDEO_BUCKET)
      .createSignedUrl(media.storage_path, 60 * 60);
    if (data?.signedUrl) return data.signedUrl;
    const { data: pub } = supabase.storage.from(VIDEO_BUCKET).getPublicUrl(media.storage_path);
    if (pub.publicUrl) return pub.publicUrl;
  }
  return media.video_url;
}

/** Reads the admin-editable copy + video for a homepage section slot. */
export function useSectionMedia(slot: string, fallback: Partial<SectionMedia> = {}) {
  const [media, setMedia] = useState<SectionMedia | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("site_sections")
        .select("slot,label,title,description,storage_path,video_url")
        .eq("slot", slot)
        .maybeSingle();
      if (cancelled || !data) return;
      const row = data as SectionMedia;
      setMedia(row);
      const url = await resolveSectionVideo(row);
      if (!cancelled) setVideoUrl(url);
    })();
    return () => {
      cancelled = true;
    };
  }, [slot]);

  return {
    label: media?.label || fallback.label || "",
    title: media?.title || fallback.title || "",
    description: media?.description ?? fallback.description ?? null,
    videoUrl,
  };
}

/** Lightweight video frame with a gradient placeholder when nothing is uploaded yet. */
export function SectionVideoFrame({
  src,
  className = "",
  aspect = "aspect-video",
}: {
  src: string | null;
  className?: string;
  aspect?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`relative ${aspect} overflow-hidden rounded-2xl border border-white/10 bg-black ${className}`}
    >
      {src ? (
        <video
          ref={ref}
          src={src}
          muted
          loop
          playsInline
          autoPlay
          controls
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_35%,oklch(0.78_0.17_55_/_0.28),transparent_60%),linear-gradient(135deg,oklch(0.17_0.012_260),black)]" />
          <div className="absolute inset-0 grid-bg opacity-25" />
          <div className="absolute bottom-5 left-5 text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Video coming soon
          </div>
        </>
      )}
    </motion.div>
  );
}
