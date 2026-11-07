import { useEffect, useRef, useState } from "react";
import { X, Play, Pause, Instagram, Youtube, Music2, Disc3, Plus } from "lucide-react";
import { artists, stats, type Artist } from "@/data/artists";
import { engine, type Layer } from "@/lib/audio";
import { useEngine, useLevel } from "@/hooks/use-engine";

const flagText = { amarillo: "text-flag-yellow", azul: "text-flag-blue", rojo: "text-flag-red" } as const;
const flagBg = { amarillo: "bg-flag-yellow", azul: "bg-flag-blue", rojo: "bg-flag-red" } as const;

export function Badge() {
  return <span className="inline-block rounded-sm bg-destructive px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-destructive-foreground">Perfil de ejemplo — por confirmar</span>;
}

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Heading({ n, kicker, title }: { n: string; kicker: string; title: string }) {
  return (
    <div className="reveal mb-12">
      <p className="font-classic text-sm italic text-gold">{n} — {kicker}</p>
      <h2 className="spray text-5xl leading-none md:text-8xl">{title}</h2>
    </div>
  );
}

/* ============ 2. EL VIAJE ============ */
const px = (lon: number) => (lon + 90) * 10;
const py = (lat: number) => (60 - lat) * 10;

export function Viaje({ onOpen }: { onOpen: (a: Artist) => void }) {
  const [sel, setSel] = useState<Artist>(artists[0]);
  return (
    <section id="viaje" className="relative px-5 py-28 md:px-12">
      <Heading n="02" kicker="De Ecuador a Europa" title="EL VIAJE" />
      <p className="reveal mb-10 max-w-2xl text-lg text-muted-foreground">
        La gente que cruza el océano buscando el triunfo. Cada línea es una ruta, cada punto una historia. La migración no es nuestro contexto: es nuestro relato.
      </p>
      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="reveal relative overflow-hidden rounded-lg border bg-card">
          <svg viewBox="0 0 1100 720" className="h-auto w-full">
            <defs>
              <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" className="fill-foreground/15" /></pattern>
            </defs>
            <rect width="1100" height="720" fill="url(#dots)" />
            <text x={px(-84)} y={py(-6)} className="fill-flag-yellow font-spray" fontSize="44">ECUADOR</text>
            <text x={px(-12)} y={py(57)} className="fill-flag-yellow font-spray" fontSize="44">EUROPA</text>
            <text x={px(-55)} y={py(24)} className="fill-foreground/30 font-classic" fontSize="22" fontStyle="italic">Océano Atlántico</text>
            {artists.map((a) => {
              const x1 = px(a.origin.lon), y1 = py(a.origin.lat), x2 = px(a.destination.lon), y2 = py(a.destination.lat);
              const active = sel.id === a.id;
              const d = `M${x1},${y1} Q${(x1 + x2) / 2},${Math.min(y1, y2) - 180} ${x2},${y2}`;
              return (
                <g key={a.id} className="cursor-pointer" onClick={() => setSel(a)}>
                  <path d={d} fill="none" strokeWidth={active ? 4 : 1.5} strokeDasharray="1200" strokeDashoffset={active ? 0 : 0}
                    className={active ? "stroke-flag-yellow" : "stroke-foreground/30"} style={{ transition: "all .5s" }} />
                  <circle cx={x1} cy={y1 + a.id.charCodeAt(1) * 2 - 100} r={0} />
                  <circle cx={x2} cy={y2} r={active ? 12 : 8} className={active ? "fill-flag-yellow" : "fill-flag-red"} />
                  <text x={x2 + 14} y={y2 + 5} fontSize="18" className="fill-foreground">{a.destination.city}</text>
                </g>
              );
            })}
            {artists.map((a) => (
              <circle key={"o" + a.id} cx={px(a.origin.lon)} cy={py(a.origin.lat)} r={7} className="cursor-pointer fill-flag-blue stroke-foreground" strokeWidth="2" onClick={() => setSel(a)} />
            ))}
          </svg>
        </div>
        <article key={sel.id} className="reveal in flex flex-col gap-4 rounded-lg border bg-card p-6 animate-in fade-in slide-in-from-right-6 duration-500">
          <img src={sel.photo} alt={sel.name} loading="lazy" className="aspect-[4/3] w-full rounded object-cover" />
          <Badge />
          <h3 className="spray text-4xl">{sel.name}</h3>
          <p className="font-classic text-xl italic">{sel.origin.city} → {sel.destination.city}</p>
          <p className="text-muted-foreground">{sel.story}</p>
          <div className="mt-auto flex flex-wrap gap-3">
            <button onClick={() => engine.play()} className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground">▶ Su canción</button>
            <a href={sel.videoUrl} target="_blank" rel="noreferrer" className="rounded-full border px-5 py-2 text-sm">Ver vídeo</a>
            <button onClick={() => onOpen(sel)} className="rounded-full border px-5 py-2 text-sm">Ficha completa</button>
          </div>
        </article>
      </div>
    </section>
  );
}

/* ============ 3. MANIFIESTO ============ */
export function Manifiesto() {
  return (
    <section id="manifiesto" className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-stage px-5 py-28 grain md:px-12">
      <div className="absolute inset-x-0 top-0 h-2 flag-bar" />
      <p className="reveal font-classic text-sm italic text-gold">03 — Manifiesto</p>
      <h2 className="reveal spray text-[13vw] leading-[0.9] md:text-[9vw]">Entrar por<br />la bandera.</h2>
      <h2 className="reveal font-classic text-[10vw] italic leading-[0.95] text-flag-blue md:text-[7vw]">Viajar con el viaje.</h2>
      <h2 className="reveal spray text-[13vw] leading-[0.9] md:text-[9vw]" style={{ color: "var(--flag-red)" }}>Quedarse por<br />la música.</h2>
      <div className="reveal mt-16 grid max-w-5xl gap-8 text-lg md:grid-cols-3">
        <p><strong className="text-primary">Reunimos.</strong> A la mayor cantidad posible de cantantes urbanos ecuatorianos emergentes. No existe otro colectivo así en Europa.</p>
        <p><strong className="text-primary">Impulsamos.</strong> Cada artista aporta todo su talento para que la música sea su medio de vida. Empezamos en España, llegamos a toda Europa.</p>
        <p><strong className="text-primary">Devolvemos.</strong> Quien triunfa, abre la puerta al siguiente. Esa es la única regla.</p>
      </div>
    </section>
  );
}

/* ============ 4. PADRINOS ============ */
export function Padrinos() {
  const chain = artists.filter((a) => a.sponsors);
  return (
    <section id="padrinos" className="px-5 py-28 md:px-12">
      <Heading n="04" kicker="Padrinos" title="PASA EL MICRÓFONO" />
      <p className="reveal mb-12 max-w-2xl text-lg text-muted-foreground">Cada artista consolidado apadrina públicamente a uno emergente: un feat, un teloneo, una colaboración. La cadena nunca se rompe.</p>
      <div className="reveal flex snap-x gap-0 overflow-x-auto pb-6">
        {chain.map((a) => {
          const b = artists.find((x) => x.id === a.sponsors)!;
          return (
            <div key={a.id} className="flex shrink-0 snap-start items-center">
              <figure className="flex w-40 flex-col items-center gap-2 text-center">
                <img src={a.photo} alt={a.name} loading="lazy" className={`h-28 w-28 rounded-full border-4 object-cover ${a.color === "amarillo" ? "border-flag-yellow" : a.color === "azul" ? "border-flag-blue" : "border-flag-red"}`} />
                <figcaption className="font-bold">{a.name}</figcaption>
              </figure>
              <div className="flex w-36 flex-col items-center">
                <span className="font-classic text-sm italic text-gold">apadrina a</span>
                <div className="relative h-1 w-full flag-bar"><span className="absolute -right-1 -top-2 text-xl text-flag-red">🎤</span></div>
                <span className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">feat · teloneo</span>
              </div>
              {b.id === artists[artists.length - 1].id && (
                <figure className="flex w-40 flex-col items-center gap-2 text-center">
                  <img src={b.photo} alt={b.name} loading="lazy" className="h-28 w-28 rounded-full border-4 border-flag-blue object-cover" />
                  <figcaption className="font-bold">{b.name}</figcaption>
                </figure>
              )}
            </div>
          );
        })}
      </div>
      <p className="reveal font-classic text-2xl italic">«{chain[0].name} apadrina a {artists[1].name}, que apadrina a {artists[2].name}…» <span className="text-muted-foreground">— cadena de ejemplo</span></p>
    </section>
  );
}

/* ============ 5. LA PLENA VOL. I + MINI-ESTUDIO ============ */
const LOOPS: { id: Layer; label: string; desc: string; bg: string }[] = [
  { id: "dembow", label: "Dembow", desc: "Bombo + caja tumbada", bg: "bg-flag-yellow text-primary-foreground" },
  { id: "regueton", label: "Reguetón", desc: "Hi-hats + palmas", bg: "bg-flag-blue text-accent-foreground" },
  { id: "quiteno", label: "Beat quiteño", desc: "Pentatónica andina", bg: "bg-flag-red text-destructive-foreground" },
  { id: "bajo", label: "Bajo 808", desc: "Sub que retumba", bg: "bg-gold text-primary-foreground" },
];

export function Volumen() {
  const eng = useEngine();
  return (
    <section id="vol1" className="relative overflow-hidden bg-card px-5 py-28 md:px-12">
      <div className="pointer-events-none absolute -top-10 left-0 w-[200%] animate-marquee whitespace-nowrap font-spray text-[18vw] leading-none text-foreground/5">LA PLENA VOL. I · LA PLENA VOL. I · LA PLENA VOL. I · </div>
      <Heading n="05" kicker="El sonido del colectivo · Temporada 2026" title="LA PLENA VOL. I" />
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="reveal">
          <p className="mb-6 text-lg text-muted-foreground">No singles sueltos: una colección por temporada, como la moda. Todos los artistas en un solo trabajo. Dale al play y sigue navegando: la música te acompaña.</p>
          <ol className="divide-y border-y">
            {artists.map((a, i) => (
              <li key={a.id} className="flex items-center gap-4 py-3">
                <span className="w-6 font-classic italic text-gold">{String(i + 1).padStart(2, "0")}</span>
                <img src={a.photo} alt="" loading="lazy" className="h-10 w-10 rounded object-cover" />
                <div className="flex-1"><p className="font-bold">Tema de ejemplo {i + 1}</p><p className="text-xs text-muted-foreground">{a.name} · {a.style}</p></div>
                <button onClick={() => engine.play()} aria-label="Reproducir" className="rounded-full border p-2 hover:bg-primary hover:text-primary-foreground"><Play className="h-4 w-4" /></button>
              </li>
            ))}
          </ol>
        </div>
        <div className="reveal rounded-lg border bg-stage p-6 md:p-8">
          <h3 className="spray text-4xl">Haz tu propia Plena</h3>
          <p className="mb-6 mt-2 text-muted-foreground">Mini-estudio: activa y combina loops. Tu mezcla suena en directo.</p>
          <div className="grid grid-cols-2 gap-3">
            {LOOPS.map((l) => {
              const on = eng.layers.has(l.id);
              return (
                <button key={l.id} onClick={() => { engine.setLayer(l.id, !on); if (!engine.playing) engine.play(); }}
                  className={`aspect-square rounded-lg p-4 text-left transition active:scale-95 ${on ? l.bg + " shadow-[var(--glow-yellow)]" : "border bg-card text-foreground opacity-60"}`}>
                  <span className="block font-spray text-2xl md:text-3xl">{l.label}</span>
                  <span className="text-xs">{l.desc}</span>
                  <span className="mt-2 block text-[10px] font-bold uppercase">{on ? "● Sonando" : "○ Silencio"}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex items-center gap-4">
            <label className="text-xs uppercase tracking-widest">Tempo {eng.bpm}</label>
            <input type="range" min={80} max={110} value={eng.bpm} onChange={(e) => { engine.bpm = +e.target.value; engine.setLayers([...engine.layers]); }} className="flex-1 accent-[var(--flag-yellow)]" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ 6. ELENCO ============ */
export function Elenco({ onOpen }: { onOpen: (a: Artist) => void }) {
  return (
    <section id="elenco" className="px-5 py-28 md:px-12">
      <Heading n="06" kicker="Clase La Plena 2026" title="EL ELENCO" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {artists.map((a) => (
          <button key={a.id} onClick={() => onOpen(a)} className="reveal card-lift group relative overflow-hidden rounded-lg border bg-card text-left">
            <div className={`absolute inset-x-0 top-0 z-10 h-1 ${flagBg[a.color]}`} />
            <img src={a.photo} alt={a.name} loading="lazy" width={768} height={960} className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-stage via-stage/20 to-transparent" />
            <div className="absolute left-2 top-3"><Badge /></div>
            <div className="absolute inset-x-0 bottom-0 p-4">
              <h3 className="spray text-2xl md:text-3xl">{a.name}</h3>
              <p className={`text-xs font-bold uppercase tracking-wider ${flagText[a.color]}`}>{a.style}</p>
              <p className="mt-1 hidden text-xs text-foreground/80 md:block">{a.phrase}</p>
            </div>
          </button>
        ))}
        <a href="#unete" className="reveal card-lift flex aspect-[4/5] flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/60 text-center">
          <Plus className="h-12 w-12 text-primary" />
          <span className="spray text-6xl">¿TÚ?</span>
          <span className="mt-2 px-4 text-sm text-muted-foreground">El próximo nombre del colectivo</span>
        </a>
      </div>
    </section>
  );
}

export function ArtistModal({ artist, onClose }: { artist: Artist | null; onClose: () => void }) {
  useEffect(() => {
    if (!artist) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [artist, onClose]);
  if (!artist) return null;
  const a = artist;
  const socials = [
    { label: "Instagram", href: a.socials.instagram, Icon: Instagram },
    { label: "TikTok", href: a.socials.tiktok, Icon: Music2 },
    { label: "YouTube", href: a.socials.youtube, Icon: Youtube },
    { label: "Spotify", href: a.socials.spotify, Icon: Disc3 },
  ];
  return (
    <div role="dialog" aria-modal="true" aria-label={a.name} onClick={onClose}
      className="fixed inset-0 z-[60] flex items-end justify-center bg-stage/85 backdrop-blur-md animate-in fade-in duration-300 md:items-center md:p-6">
      <div onClick={(e) => e.stopPropagation()} className="relative max-h-[92svh] w-full max-w-5xl overflow-y-auto rounded-t-xl border bg-popover animate-in slide-in-from-bottom-10 zoom-in-95 duration-500 md:rounded-xl">
        <button onClick={onClose} aria-label="Cerrar" className="absolute right-3 top-3 z-10 rounded-full bg-stage/80 p-2 hover:bg-primary hover:text-primary-foreground"><X className="h-5 w-5" /></button>
        <div className="grid md:grid-cols-2">
          <div className="relative">
            <img src={a.photo} alt={a.name} className="h-72 w-full object-cover md:h-full" />
            <div className={`absolute inset-x-0 bottom-0 h-2 ${flagBg[a.color]}`} />
          </div>
          <div className="flex flex-col gap-5 p-6 md:p-8">
            <Badge />
            <div>
              <h3 className="spray text-5xl">{a.name}</h3>
              <p className="font-classic mt-1 text-xl italic">{a.phrase}</p>
            </div>
            <p className="text-muted-foreground">{a.bio}</p>
            <div>
              <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-gold">Trabajos más relevantes (ejemplo)</h4>
              <ul className="divide-y border-y">{a.works.map((w) => <li key={w.title} className="flex justify-between py-2"><span>{w.title}</span><span className="font-classic italic text-muted-foreground">{w.year}</span></li>)}</ul>
            </div>
            <div>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-gold">Escucha su historia</h4>
              <ol className="relative ml-2 border-l-2 border-primary/60">
                {a.timeline.map((t) => (
                  <li key={t.date} className="mb-4 ml-5">
                    <span className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full bg-primary" />
                    <p className="font-classic text-lg italic text-primary">{t.date}</p><p className="text-sm">{t.text}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="flex flex-wrap gap-2">
              {socials.map(({ label, href, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground"><Icon className="h-4 w-4" />{label}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ 7. ÚNETE ============ */
export function Unete() {
  const [sent, setSent] = useState(false);
  return (
    <section id="unete" className="relative overflow-hidden bg-stage px-5 py-28 grain md:px-12">
      <Heading n="07" kicker="Clase La Plena 2027" title="ÚNETE" />
      <div className="grid gap-6 md:grid-cols-3">
        <div className="reveal rounded-lg border bg-card p-6">
          <p className="font-classic italic text-gold">Clase anual</p>
          <h3 className="spray mt-1 text-3xl">Clase La Plena 2027</h3>
          <p className="mt-3 text-muted-foreground">Cada año presentamos una nueva promoción con un concierto de presentación en una sala de Madrid o Barcelona.</p>
        </div>
        <div className="reveal rounded-lg border bg-card p-6">
          <p className="font-classic italic text-gold">Dos niveles</p>
          <h3 className="spray mt-1 text-3xl">Colectivo · Rising</h3>
          <p className="mt-3 text-muted-foreground"><strong className="text-foreground">La Plena</strong>: el colectivo principal. <strong className="text-foreground">La Plena Rising</strong>: la cantera para artistas en una etapa aún más temprana.</p>
        </div>
        <div className="reveal flex flex-col items-center justify-center rounded-lg border bg-card p-6 text-center">
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-gold bg-stage shadow-[var(--glow-yellow)]">
            <div className="absolute inset-2 rounded-full border border-dashed border-primary/60" />
            <div><p className="font-spray text-2xl text-primary leading-none">LA PLENA</p><p className="font-classic text-xs italic text-gold">miembro · 2026</p></div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Insignia oficial para tu perfil</p>
          <div className="mt-3 flex gap-6 text-center">
            <div><p className="spray text-3xl">{stats.artistas}</p><p className="text-[10px] uppercase">artistas</p></div>
            <div><p className="spray text-3xl">{stats.paises}</p><p className="text-[10px] uppercase">países</p></div>
            <div><p className="spray text-3xl">{stats.streams}</p><p className="text-[10px] uppercase">streams</p></div>
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground">Cifras de ejemplo</p>
        </div>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="reveal mx-auto mt-16 grid max-w-3xl gap-3 md:grid-cols-[1fr_1fr_auto]">
        <input required placeholder="Tu nombre artístico" className="rounded-full border bg-card px-5 py-3 outline-none focus:border-primary" />
        <input required placeholder="Enlace a tu música" className="rounded-full border bg-card px-5 py-3 outline-none focus:border-primary" />
        <button className="rounded-full bg-primary px-8 py-3 font-bold text-primary-foreground transition hover:scale-105">{sent ? "¡Recibido!" : "Postúlate"}</button>
      </form>
      <footer className="mt-24 flex flex-col items-center gap-3 text-center text-sm text-muted-foreground">
        <div className="h-1 w-40 flag-bar" />
        <p className="spray text-3xl">LA PLENA MUSIC</p>
        <p>Colectivo de cantantes urbanos ecuatorianos · España y Europa · © 2026</p>
      </footer>
    </section>
  );
}

/* ============ REPRODUCTOR PERSISTENTE + MENÚ INFERIOR ============ */
export function Player() {
  const eng = useEngine();
  const level = useLevel();
  const bars = useRef(Array.from({ length: 5 }));
  const links = [["#viaje", "Viaje"], ["#manifiesto", "Manifiesto"], ["#padrinos", "Padrinos"], ["#vol1", "Vol. I"], ["#elenco", "Elenco"], ["#unete", "Únete"]];
  return (
    <div className="fixed inset-x-2 bottom-2 z-50 flex items-center gap-3 rounded-full border bg-stage/85 p-2 pr-4 backdrop-blur-xl md:inset-x-auto md:left-1/2 md:-translate-x-1/2">
      <button onClick={() => eng.toggle()} aria-label={eng.playing ? "Pausar" : "Reproducir"} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        {eng.playing ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
      </button>
      <div className="flex h-6 items-end gap-0.5">
        {bars.current.map((_, i) => <span key={i} className="w-1 rounded-full bg-primary" style={{ height: `${eng.playing ? 20 + level * 80 * (0.5 + Math.abs(Math.sin(i + performance.now() / 200))) : 15}%` }} />)}
      </div>
      <div className="hidden min-w-0 sm:block"><p className="truncate text-xs font-bold">La Plena Vol. I</p><p className="truncate text-[10px] text-muted-foreground">Mezcla del colectivo</p></div>
      <nav className="flex gap-1 overflow-x-auto text-[11px] uppercase tracking-wider md:ml-4">
        {links.map(([h, l]) => <a key={h} href={h} className="whitespace-nowrap rounded-full px-2 py-1 hover:bg-primary hover:text-primary-foreground">{l}</a>)}
      </nav>
    </div>
  );
}

export { useReveal };
