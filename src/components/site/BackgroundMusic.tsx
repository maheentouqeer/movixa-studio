import { useEffect, useRef, useState } from "react";
import { Music2, VolumeX } from "lucide-react";
import trackAsset from "@/assets/funk-sereno.mp3.asset.json";

const TRACK_URL = trackAsset.url;
const STORAGE_KEY = "movixa:bg-music";

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const audio = new Audio(TRACK_URL);
    audio.loop = true;
    audio.volume = 0.35;
    audio.preload = "auto";
    audio.addEventListener("canplaythrough", () => setReady(true), { once: true });
    audio.addEventListener("error", () => setReady(false));
    audioRef.current = audio;

    const muted = localStorage.getItem(STORAGE_KEY) === "muted";

    const tryPlay = async () => {
      if (muted) return;
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        // Autoplay blocked — wait for first user gesture
        const onGesture = async () => {
          try {
            await audio.play();
            setPlaying(true);
          } catch {}
          window.removeEventListener("pointerdown", onGesture);
          window.removeEventListener("keydown", onGesture);
          window.removeEventListener("scroll", onGesture);
        };
        window.addEventListener("pointerdown", onGesture, { once: true });
        window.addEventListener("keydown", onGesture, { once: true });
        window.addEventListener("scroll", onGesture, { once: true });
      }
    };
    tryPlay();

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      try {
        await a.play();
        setPlaying(true);
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    } else {
      a.pause();
      setPlaying(false);
      localStorage.setItem(STORAGE_KEY, "muted");
    }
  };

  if (!ready) return null;

  return (
    <button
      onClick={toggle}
      aria-label={playing ? "Mute background music" : "Play background music"}
      className="fixed bottom-6 right-6 z-50 h-11 w-11 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
    >
      {playing ? (
        <Music2 className="h-4 w-4 text-[oklch(0.78_0.17_55)] animate-pulse" />
      ) : (
        <VolumeX className="h-4 w-4 text-muted-foreground" />
      )}
    </button>
  );
}
