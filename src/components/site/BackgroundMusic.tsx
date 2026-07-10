import { useEffect, useRef, useState } from "react";
import { Music2, VolumeX } from "lucide-react";
import trackAsset from "@/assets/funk-sereno.mp3.asset.json";

const TRACK_URL = trackAsset.url;
const STORAGE_KEY = "movixa:bg-music";

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  // Lazily create the audio element (avoids SSR + mobile preload issues)
  const getAudio = () => {
    if (audioRef.current) return audioRef.current;
    const audio = new Audio(TRACK_URL);
    audio.loop = true;
    audio.volume = 0.35;
    audio.preload = "auto";
    audio.crossOrigin = "anonymous";
    audio.addEventListener("play", () => setPlaying(true));
    audio.addEventListener("pause", () => setPlaying(false));
    audioRef.current = audio;
    return audio;
  };

  useEffect(() => {
    const muted = typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "muted";
    if (muted) return;

    // Try autoplay; if blocked, wait for the first user gesture.
    const start = async () => {
      const audio = getAudio();
      try {
        await audio.play();
      } catch {
        const onGesture = async () => {
          try { await audio.play(); } catch {}
          window.removeEventListener("pointerdown", onGesture);
          window.removeEventListener("keydown", onGesture);
          window.removeEventListener("touchstart", onGesture);
        };
        window.addEventListener("pointerdown", onGesture, { once: true });
        window.addEventListener("keydown", onGesture, { once: true });
        window.addEventListener("touchstart", onGesture, { once: true });
      }
    };
    start();

    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const toggle = async () => {
    const audio = getAudio();
    if (audio.paused) {
      setLoading(true);
      try {
        await audio.play();
        localStorage.removeItem(STORAGE_KEY);
      } catch (err) {
        console.error("Audio playback failed", err);
      } finally {
        setLoading(false);
      }
    } else {
      audio.pause();
      localStorage.setItem(STORAGE_KEY, "muted");
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={playing ? "Mute background music" : "Play background music"}
      className="fixed bottom-6 right-6 z-50 h-11 w-11 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-60"
    >
      {playing ? (
        <Music2 className="h-4 w-4 text-[oklch(0.78_0.17_55)] animate-pulse" />
      ) : (
        <VolumeX className="h-4 w-4 text-muted-foreground" />
      )}
    </button>
  );
}
