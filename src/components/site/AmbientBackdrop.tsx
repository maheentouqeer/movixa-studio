import { motion } from "framer-motion";

/** Site-wide cinematic backdrop: slow gradient mesh, moving light beams, noise. */
export function AmbientBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute -top-1/3 -left-1/3 h-[80vmax] w-[80vmax] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.72 0.19 45 / 0.18), transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ x: [0, 60, -40, 0], y: [0, -30, 40, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-1/3 -right-1/3 h-[70vmax] w-[70vmax] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.68 0.22 25 / 0.14), transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{ x: [0, -50, 30, 0], y: [0, 40, -30, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* subtle moving light beam */}
      <motion.div
        className="absolute inset-y-0 -left-1/2 w-1/2 opacity-[0.05]"
        style={{
          background:
            "linear-gradient(115deg, transparent 20%, white 50%, transparent 80%)",
        }}
        animate={{ x: ["0vw", "220vw"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />
      {/* noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'160\' height=\'160\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'2\' stitchTiles=\'stitch\'/></filter><rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\'/></svg>")',
          backgroundSize: "160px 160px",
        }}
      />
      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, oklch(0.14 0.01 260 / 0.6) 100%)",
        }}
      />
    </div>
  );
}
