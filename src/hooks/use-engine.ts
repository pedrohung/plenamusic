import { useEffect, useState } from "react";
import { engine } from "@/lib/audio";

export function useEngine() {
  const [, set] = useState(0);
  useEffect(() => engine.subscribe(() => set((n) => n + 1)), []);
  return engine;
}

/** Nivel de audio en tiempo real (0..1) vía requestAnimationFrame. */
export function useLevel() {
  const [lv, setLv] = useState(0);
  useEffect(() => {
    let r = 0;
    const tick = () => { setLv(engine.level()); r = requestAnimationFrame(tick); };
    r = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(r);
  }, []);
  return lv;
}
