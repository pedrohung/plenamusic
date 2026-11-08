// Motor de audio sintetizado (Web Audio). Loops: dembow, reguetón, quiteño, bajo.
export type Layer = "dembow" | "regueton" | "quiteno" | "bajo";

type Listener = () => void;

class Engine {
  ctx: AudioContext | null = null;
  master: GainNode | null = null;
  analyser: AnalyserNode | null = null;
  layers = new Set<Layer>(["dembow", "regueton", "quiteno", "bajo"]);
  playing = false;
  studioMode = false;
  track: { id: string | null; title: string; sub: string } = { id: null, title: "La Plena Vol. I", sub: "Mezcla del colectivo" };
  bpm = 96;
  step = 0;
  private nextTime = 0;
  private timer: number | null = null;
  private listeners = new Set<Listener>();
  private data = new Uint8Array(64);

  subscribe(l: Listener) { this.listeners.add(l); return () => { this.listeners.delete(l); }; }
  private emit() { this.listeners.forEach((l) => l()); }

  private init() {
    if (this.ctx) return;
    const ctx = new AudioContext();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0.7;
    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 128;
    this.master.connect(this.analyser);
    this.analyser.connect(ctx.destination);
  }

  level() {
    if (!this.analyser || !this.playing) return 0;
    this.analyser.getByteFrequencyData(this.data);
    let s = 0;
    for (let i = 0; i < 12; i++) s += this.data[i] ?? 0;
    return s / (12 * 255);
  }
  spectrum() {
    if (this.analyser) this.analyser.getByteFrequencyData(this.data);
    return this.data;
  }

  toggle() { this.playing ? this.stop() : this.play(); }
  play() {
    this.init();
    this.ctx!.resume();
    this.playing = true;
    this.nextTime = this.ctx!.currentTime + 0.05;
    this.timer = window.setInterval(() => this.schedule(), 25);
    this.emit();
  }
  stop() {
    this.playing = false;
    if (this.timer) clearInterval(this.timer);
    this.emit();
  }
  setLayer(l: Layer, on: boolean) { on ? this.layers.add(l) : this.layers.delete(l); this.emit(); }
  playTrack(id: string, title: string, sub: string) {
    if (this.track.id === id && this.playing) { this.stop(); return; }
    this.track = { id, title, sub };
    this.studioMode = false;
    this.layers = new Set(["dembow", "regueton", "quiteno", "bajo"]);
    if (!this.playing) this.play(); else this.emit();
  }
  toggleStudio(l: Layer) {
    if (!this.studioMode) { this.studioMode = true; this.layers = new Set(); this.track = { id: "studio", title: "Tu propia Plena", sub: "Mini-estudio" }; }
    this.layers.has(l) ? this.layers.delete(l) : this.layers.add(l);
    if (!this.playing) this.play(); else this.emit();
  }
  setLayers(ls: Layer[]) { this.layers = new Set(ls); this.emit(); }

  private schedule() {
    const ctx = this.ctx!;
    const dt = 60 / this.bpm / 4;
    while (this.nextTime < ctx.currentTime + 0.1) {
      this.playStep(this.step % 32, this.nextTime);
      this.nextTime += dt;
      this.step++;
    }
  }

  private playStep(s: number, t: number) {
    const st = s % 16;
    const L = this.layers;
    if (L.has("dembow")) {
      if (st % 4 === 0) this.kick(t);
      if ([3, 6, 11, 14].includes(st)) this.snare(t);
    }
    if (L.has("regueton")) {
      if (st % 2 === 0) this.hat(t, st % 4 === 2 ? 0.25 : 0.12);
      if ([7, 15].includes(st)) this.clap(t);
    }
    if (L.has("bajo")) {
      const notes: Record<number, number> = { 0: 43.65, 6: 43.65, 8: 51.91, 14: 49 };
      const n = notes[st];
      if (n) this.bass(t, s >= 16 ? n * 0.89 : n);
    }
    if (L.has("quiteno")) {
      // pentatónica andina (La menor)
      const scale = [440, 523.25, 587.33, 659.25, 783.99, 880];
      const pat = [0, -1, 2, -1, 3, 2, -1, 1, 4, -1, 3, 2, -1, 0, 1, -1];
      const p = pat[st] ?? -1;
      if (p >= 0) this.pluck(t, scale[(p + (s >= 16 ? 1 : 0)) % scale.length] ?? 440);
    }
  }

  private env(t: number, g: number, d: number) {
    const n = this.ctx!.createGain();
    n.gain.setValueAtTime(g, t);
    n.gain.exponentialRampToValueAtTime(0.001, t + d);
    n.connect(this.master!);
    return n;
  }
  private kick(t: number) {
    const o = this.ctx!.createOscillator();
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(40, t + 0.15);
    o.connect(this.env(t, 1, 0.35)); o.start(t); o.stop(t + 0.4);
  }
  private noise(t: number, g: number, d: number, f: number, type: BiquadFilterType) {
    const ctx = this.ctx!;
    const b = ctx.createBuffer(1, ctx.sampleRate * d, ctx.sampleRate);
    const ch = b.getChannelData(0);
    for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = b;
    const fl = ctx.createBiquadFilter(); fl.type = type; fl.frequency.value = f;
    src.connect(fl); fl.connect(this.env(t, g, d)); src.start(t);
  }
  private snare(t: number) { this.noise(t, 0.5, 0.18, 1800, "highpass"); }
  private clap(t: number) { this.noise(t, 0.35, 0.12, 1200, "bandpass"); }
  private hat(t: number, g: number) { this.noise(t, g, 0.05, 8000, "highpass"); }
  private bass(t: number, f: number) {
    const o = this.ctx!.createOscillator(); o.type = "sine"; o.frequency.value = f;
    o.connect(this.env(t, 0.8, 0.5)); o.start(t); o.stop(t + 0.55);
  }
  private pluck(t: number, f: number) {
    const o = this.ctx!.createOscillator(); o.type = "triangle"; o.frequency.value = f;
    o.connect(this.env(t, 0.18, 0.3)); o.start(t); o.stop(t + 0.32);
  }
}

export const engine = new Engine();
