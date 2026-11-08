import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { Hero } from "@/components/plena/Hero";
import { Viaje, Manifiesto, Padrinos, Volumen, Elenco, ArtistModal, Unete, Player, useReveal } from "@/components/plena/Sections";
import type { Artist } from "@/data/artists";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "La Plena Music — Colectivo urbano ecuatoriano en Europa" },
      { name: "description", content: "Entrar por la bandera. Viajar con el viaje. Quedarse por la música. Cantantes urbanos ecuatorianos emergentes en España y Europa." },
      { property: "og:title", content: "La Plena Music" },
      { property: "og:description", content: "El primer colectivo de cantantes urbanos ecuatorianos emergentes en España y Europa." },
    ],
  }),
  component: Index,
});

function Index() {
  const [open, setOpen] = useState<Artist | null>(null);
  const close = useCallback(() => setOpen(null), []);
  useReveal();
  return (
    <main className="pb-20">
      <Hero />
      <Viaje onOpen={setOpen} />
      <Manifiesto />
      <Padrinos />
      <Volumen />
      <Elenco onOpen={setOpen} />
      <Unete />
      <Player />
      <ArtistModal artist={open} onClose={close} />
    </main>
  );
}
