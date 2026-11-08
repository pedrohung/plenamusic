import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import singer from "@/assets/hero-singer.jpg";
import condor from "@/assets/hero-condor.jpg";
import { artists } from "@/data/artists";
import { useEngine, useLevel } from "@/hooks/use-engine";

const flagBg = { amarillo: "bg-flag-yellow", azul: "bg-flag-blue", rojo: "bg-flag-red" } as const;

function Wave({ level }: { level: number }) {
  const bars = 28;
  return (
    <div className="flex h-1/2 w-full items-center justify-center gap-[3px] px-3">
      {Array.from({ length: bars }).map((_, i) => {
        const base = Math.abs(Math.sin(i * 0.7 + performance.now() / 400));
        const h = 8 + (base * 30 + level * 70) * (1 - Math.abs(i - bars / 2) / bars);
        return <span key={i} className="w-full max-w-2 rounded-full bg-foreground/90" style={{ height: `${h}%`, transition: "height 80ms" }} />;
      })}
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const [holding, setHolding] = useState(false);
  const [idx, setIdx] = useState(0);
  const eng = useEngine();
  const level = useLevel();

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      setP(Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight))));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mantén pulsado: viaja entre artistas
  useEffect(() => {
    if (!holding) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % artists.length), 900);
    return () => clearInterval(t);
  }, [holding]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === "Space" && !(e.target as HTMLElement).closest("input,textarea,button")) { e.preventDefault(); setHolding(true); }
    };
    const up = (e: KeyboardEvent) => { if (e.code === "Space") setHolding(false); };
    window.addEventListener("keydown", down); window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  const pulse = 1 + level * 0.06;
  const gap = (1 - p) * 6; // separación entre franjas
  const fuse = p; // 0 franjas → 1 collage
  const a = artists[idx] ?? artists[0]!;

  return (
    <section ref={ref} className="relative h-[220vh] bg-stage" aria-label="Portada">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden grain select-none">
        {/* Franjas */}
        <div className="absolute inset-0 flex" style={{ gap: `${gap}px`, transform: `scale(${pulse})`, transition: "transform 90ms" }}>
          <div className="relative overflow-hidden bg-flag-yellow" style={{ flex: 2 - fuse * 0.6 }}>
            <img src={singer} alt="Cantante urbano en escena" width={768} height={1344} className="absolute inset-0 h-full w-full object-cover mix-blend-multiply" style={{ transform: `translateX(${fuse * 10}%) scale(${1 + fuse * 0.2})` }} />
            <div className="absolute left-0 top-0 h-[120%] w-1/3 origin-top animate-beam bg-gradient-to-b from-foreground/40 to-transparent blur-2xl" />
          </div>
          <div className="relative flex items-center overflow-hidden bg-flag-blue" style={{ flex: 1 + fuse * 0.2 }}>
            <Wave level={level} />
          </div>
          <div className="relative overflow-hidden bg-flag-red" style={{ flex: 1 - fuse * 0.3 }}>
            <img src={condor} alt="Volcán y cóndor andino" width={768} height={1344} className="absolute inset-0 h-full w-full object-cover mix-blend-screen" style={{ transform: `translateX(${-fuse * 20}%) scale(${1 + fuse * 0.3})` }} />
          </div>
        </div>

        {/* Collage final: las escenas se funden */}
        <div className="pointer-events-none absolute inset-0" style={{ opacity: fuse }}>
          <img src={condor} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70 mix-blend-screen" />
          <img src={singer} alt="" className="absolute inset-0 h-full w-full object-cover object-top opacity-60 mix-blend-lighten" />
          <div className="absolute inset-0 bg-gradient-to-t from-stage via-stage/40 to-transparent" />
        </div>
        <div className="pointer-events-none absolute inset-0 smoke" />

        {/* Título */}
        <div className="absolute inset-x-0 top-[8vh] z-10 px-4 text-center" style={{ opacity: 0.8 + fuse * 0.2, transform: `translateY(${(1 - fuse) * -10}px)` }}>
          <p className="text-xs uppercase tracking-[0.5em] text-foreground/80 md:text-sm">Colectivo urbano ecuatoriano · Europa</p>
          <h1 style={{ WebkitTextStroke: "2px var(--stage)" }} className="spray mt-2 text-[17vw] leading-[0.85] md:text-[11vw] animate-flicker">LA PLENA</h1>
          <p className="text-3xl gold-text md:text-6xl">Music</p>
        </div>

        {/* Controles */}
        <div className="absolute inset-x-0 bottom-24 z-20 flex flex-col items-center gap-4 px-4">
          <button onClick={() => eng.toggle()} aria-label={eng.playing ? "Pausar" : "Reproducir"}
            className="group flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--glow-yellow)] transition hover:scale-110"
            style={{ transform: `scale(${1 + level * 0.3})` }}>
            {eng.playing ? <Pause className="h-8 w-8" /> : <Play className="ml-1 h-8 w-8" />}
          </button>
          <button
            onPointerDown={(e) => { e.preventDefault(); setHolding(true); }}
            onPointerUp={() => setHolding(false)} onPointerLeave={() => setHolding(false)} onPointerCancel={() => setHolding(false)}
            onContextMenu={(e) => e.preventDefault()}
            className="touch-none rounded-full border border-foreground/40 bg-stage/60 px-6 py-3 text-xs uppercase tracking-[0.3em] text-foreground backdrop-blur transition active:scale-95">
            Mantén pulsado para descubrir <span className="hidden md:inline">· o la barra espaciadora</span>
          </button>
          <p className="text-[10px] uppercase tracking-[0.4em] text-foreground/50">Desliza · las franjas se funden</p>
        </div>

        {/* Mini-mundo del artista al mantener pulsado */}
        <div className={`absolute inset-0 z-30 transition-opacity duration-300 ${holding ? "opacity-100" : "pointer-events-none opacity-0"}`}
          onPointerUp={() => setHolding(false)}>
          <div className={`absolute inset-0 ${flagBg[a.color]}`} />
          <img key={a.id} src={a.photo} alt={a.name} className="absolute inset-0 h-full w-full object-cover mix-blend-multiply animate-in fade-in zoom-in-110 duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-stage via-transparent to-stage/60" />
          <div className="absolute inset-x-0 bottom-32 px-6 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-foreground/70">Mini-mundo {a.id} / 0{artists.length}</p>
            <h2 key={a.name} className="spray text-6xl md:text-9xl animate-in slide-in-from-bottom-6 duration-500">{a.name}</h2>
            <p className="mt-2 text-lg text-foreground md:text-2xl">{a.phrase}</p>
            <span className="mt-3 inline-block rounded-sm bg-destructive px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-destructive-foreground">Perfil de ejemplo — por confirmar</span>
          </div>
        </div>
      </div>
    </section>
  );
}
