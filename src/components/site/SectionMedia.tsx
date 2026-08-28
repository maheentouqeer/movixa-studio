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
  image_paths: string[] | null;
  image_urls: string[] | null;
}

const VIDEO_BUCKET = "videos";

async function signPath(path: string) {
  const { data } = await supabase.storage.from(VIDEO_BUCKET).createSignedUrl(path, 60 * 60);
  if (data?.signedUrl) return data.signedUrl;
  const { data: pub } = supabase.storage.from(VIDEO_BUCKET).getPublicUrl(path);
  return pub.publicUrl || null;
}

export async function resolveSectionVideo(media: SectionMedia | null) {
  if (!media) return null;
  if (media.storage_path) {
    const url = await signPath(media.storage_path);
    if (url) return url;
  }
  return media.video_url;
}

/** Reads the admin-editable copy, video and images for a homepage section slot. */
export function useSectionMedia(slot: string, fallback: Partial<SectionMedia> = {}) {
  const [media, setMedia] = useState<SectionMedia | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("site_sections")
        .select("slot,label,title,description,storage_path,video_url,image_paths,image_urls")
        .eq("slot", slot)
        .maybeSingle();
      if (cancelled || !data) return;
      const row = data as unknown as SectionMedia;
      setMedia(row);

      const url = await resolveSectionVideo(row);
      if (!cancelled) setVideoUrl(url);

      const paths = row.image_paths ?? [];
      if (paths.length) {
        const signed = await Promise.all(paths.map((p) => signPath(p)));
        if (!cancelled) setImageUrls(signed.filter((u): u is string => Boolean(u)));
      } else if (!cancelled) {
        setImageUrls(row.image_urls ?? []);
      }
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
    imageUrls,
  };
}

/**
 * Video frame that adapts to the uploaded file's orientation
 * (vertical, square or horizontal) instead of forcing 16:9.
 */
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
  const [ratio, setRatio] = useState<number | null>(null);

  useEffect(() => {
    setRatio(null);
  }, [src]);

  const isVertical = ratio !== null && ratio < 0.95;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-black ${
        ratio === null ? aspect : ""
      } ${isVertical ? "mx-auto w-full max-w-[420px]" : ""} ${className}`}
      style={ratio !== null ? { aspectRatio: ratio } : undefined}
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
          onLoadedMetadata={(e) => {
            const v = e.currentTarget;
            if (v.videoWidth && v.videoHeight) setRatio(v.videoWidth / v.videoHeight);
          }}
          className={`absolute inset-0 h-full w-full ${isVertical ? "object-contain" : "object-cover"}`}
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

/** Masonry-ish gallery for admin uploaded section images. */
export function SectionImageGrid({
  images,
  fallback,
}: {
  images: string[];
  fallback?: React.ReactNode;
}) {
  if (!images.length) return <>{fallback ?? null}</>;

  return (
    <div className="grid grid-cols-2 gap-3">
      {images.map((src, i) => (
        <motion.div
          key={src}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          className={`group relative overflow-hidden rounded-xl border border-white/10 bg-black ${
            i % 5 === 0 ? "col-span-2 aspect-[16/9]" : "aspect-[4/5]"
          }`}
        >
          <img
            src={src}
            alt={`Brand visual ${i + 1}`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        </motion.div>
      ))}
    </div>
  );
}
