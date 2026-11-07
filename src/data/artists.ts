// ============================================================
// LA PLENA MUSIC — ARCHIVO ÚNICO DE DATOS DE ARTISTAS
// Todos los perfiles son DE EJEMPLO. Sustituye cada campo por los datos reales.
// Para cambiar una foto: reemplaza el import de la imagen correspondiente.
// ============================================================
import a1 from "@/assets/artist-01.jpg";
import a2 from "@/assets/artist-02.jpg";
import a3 from "@/assets/artist-03.jpg";
import a4 from "@/assets/artist-04.jpg";
import a5 from "@/assets/artist-05.jpg";
import a6 from "@/assets/artist-06.jpg";
import a7 from "@/assets/artist-07.jpg";
import a8 from "@/assets/artist-08.jpg";

export type Flag = "amarillo" | "azul" | "rojo";

export interface Artist {
  id: string;
  name: string;
  style: string;
  phrase: string; // una sola frase: mundo sonoro + ruta
  origin: { city: string; lon: number; lat: number };
  destination: { city: string; lon: number; lat: number };
  photo: string;
  color: Flag;
  bio: string;
  story: string; // historia para el mapa del viaje
  works: { title: string; year: number }[];
  timeline: { date: string; text: string }[];
  socials: { instagram: string; tiktok: string; youtube: string; spotify: string };
  videoUrl: string;
  sponsors?: string; // id del artista al que apadrina
}

const S = (u: string) => ({
  instagram: `https://instagram.com/${u}`,
  tiktok: `https://tiktok.com/@${u}`,
  youtube: `https://youtube.com/@${u}`,
  spotify: `https://open.spotify.com/artist/${u}`,
});

export const artists: Artist[] = [
  {
    id: "01", name: "Artista 01", style: "Dembow esmeraldeño", color: "amarillo", photo: a1,
    phrase: "Esmeraldas → Madrid · dembow esmeraldeño + reguetón",
    origin: { city: "Esmeraldas", lon: -79.65, lat: 0.96 }, destination: { city: "Madrid", lon: -3.7, lat: 40.42 },
    bio: "Texto de ejemplo. Creció entre la marimba de su barrio y los altavoces del malecón. Llegó a Madrid con una libreta llena de letras y la convirtió en su primer EP.",
    story: "Texto de ejemplo. Prototipo de ficha: infancia en España por la migración de sus padres, regreso a Ecuador y vuelta a Europa para cumplir el sueño.",
    works: [{ title: "Tema de ejemplo I", year: 2023 }, { title: "Tema de ejemplo II", year: 2024 }, { title: "Tema de ejemplo III", year: 2025 }],
    timeline: [{ date: "2019", text: "Primera maqueta casera grabada con el móvil." }, { date: "2022", text: "Vídeo en TikTok: 100.000 reproducciones (cifra de ejemplo)." }, { date: "2025", text: "Primer show en Europa, sala de Madrid." }],
    socials: S("usuario01"), videoUrl: "https://youtube.com/@usuario01", sponsors: "02",
  },
  {
    id: "02", name: "Artista 02", style: "R&B urbano", color: "azul", photo: a2,
    phrase: "Guayaquil → Barcelona · R&B de malecón + perreo lento",
    origin: { city: "Guayaquil", lon: -79.9, lat: -2.19 }, destination: { city: "Barcelona", lon: 2.17, lat: 41.38 },
    bio: "Texto de ejemplo. Voz suave, letras que hablan de distancia y de volver. Canta en el metro de Barcelona antes de cada estudio.",
    story: "Texto de ejemplo. Salió de Guayaquil a los 16 años con su madre. Su primera canción la escribió en el aeropuerto.",
    works: [{ title: "Tema de ejemplo I", year: 2022 }, { title: "Tema de ejemplo II", year: 2024 }, { title: "Tema de ejemplo III", year: 2025 }],
    timeline: [{ date: "2020", text: "Primer cover subido a YouTube." }, { date: "2023", text: "Colaboración con Artista 01 (ejemplo)." }, { date: "2025", text: "Telonera en Barcelona." }],
    socials: S("usuario02"), videoUrl: "https://youtube.com/@usuario02", sponsors: "03",
  },
  {
    id: "03", name: "Artista 03", style: "Trap andino", color: "rojo", photo: a3,
    phrase: "Quito → Valencia · trap andino + bajos de 808",
    origin: { city: "Quito", lon: -78.47, lat: -0.18 }, destination: { city: "Valencia", lon: -0.38, lat: 39.47 },
    bio: "Texto de ejemplo. Mezcla quenas sampleadas con 808 que retumban. Productor y rapero, graba todo en su cuarto.",
    story: "Texto de ejemplo. De las calles de La Ronda a los barrios de Valencia: el viaje como ritmo.",
    works: [{ title: "Tema de ejemplo I", year: 2023 }, { title: "Tema de ejemplo II", year: 2024 }, { title: "Tema de ejemplo III", year: 2025 }, { title: "Tema de ejemplo IV", year: 2026 }],
    timeline: [{ date: "2018", text: "Primer beat en un portátil prestado." }, { date: "2023", text: "10.000 oyentes mensuales (cifra de ejemplo)." }, { date: "2026", text: "Primer festival en Europa." }],
    socials: S("usuario03"), videoUrl: "https://youtube.com/@usuario03", sponsors: "04",
  },
  {
    id: "04", name: "Artista 04", style: "Pasillo urbano", color: "amarillo", photo: a4,
    phrase: "Cuenca → Milán · pasillo quiteño + reguetón lento",
    origin: { city: "Cuenca", lon: -79.0, lat: -2.9 }, destination: { city: "Milán", lon: 9.19, lat: 45.46 },
    bio: "Texto de ejemplo. Rescata los pasillos de su abuela y los viste de calle. Su voz es puente entre generaciones.",
    story: "Texto de ejemplo. Llegó a Milán por trabajo y se quedó por la música.",
    works: [{ title: "Tema de ejemplo I", year: 2024 }, { title: "Tema de ejemplo II", year: 2025 }, { title: "Tema de ejemplo III", year: 2026 }],
    timeline: [{ date: "2021", text: "Canta en una fiesta de la comunidad ecuatoriana." }, { date: "2024", text: "Primer single en plataformas." }, { date: "2026", text: "Concierto en Milán." }],
    socials: S("usuario04"), videoUrl: "https://youtube.com/@usuario04", sponsors: "05",
  },
  {
    id: "05", name: "Artista 05", style: "Drill latino", color: "azul", photo: a5,
    phrase: "Manta → Londres · drill latino + salsa choke",
    origin: { city: "Manta", lon: -80.71, lat: -0.95 }, destination: { city: "Londres", lon: -0.13, lat: 51.5 },
    bio: "Texto de ejemplo. Flow rápido, letras de puerto y de frío. Lleva el choke de la costa al drill de Londres.",
    story: "Texto de ejemplo. Del puerto de Manta al sur de Londres, pasando por Madrid.",
    works: [{ title: "Tema de ejemplo I", year: 2024 }, { title: "Tema de ejemplo II", year: 2025 }, { title: "Tema de ejemplo III", year: 2025 }],
    timeline: [{ date: "2022", text: "Freestyle viral en TikTok (ejemplo)." }, { date: "2024", text: "Primer EP." }, { date: "2025", text: "Show en Londres." }],
    socials: S("usuario05"), videoUrl: "https://youtube.com/@usuario05", sponsors: "06",
  },
  {
    id: "06", name: "Artista 06", style: "Reguetón", color: "rojo", photo: a6,
    phrase: "Santo Domingo → Murcia · reguetón clásico + bomba del Chota",
    origin: { city: "Santo Domingo", lon: -79.17, lat: -0.25 }, destination: { city: "Murcia", lon: -1.13, lat: 37.98 },
    bio: "Texto de ejemplo. Reina del perreo con raíz. Sus coros son himnos en las fiestas del barrio.",
    story: "Texto de ejemplo. Su familia llegó a Murcia en 2001. Ella llegó a los escenarios en 2024.",
    works: [{ title: "Tema de ejemplo I", year: 2023 }, { title: "Tema de ejemplo II", year: 2024 }, { title: "Tema de ejemplo III", year: 2026 }],
    timeline: [{ date: "2020", text: "Primer vídeo casero." }, { date: "2024", text: "Primer concierto propio." }, { date: "2026", text: "Gira por España (ejemplo)." }],
    socials: S("usuario06"), videoUrl: "https://youtube.com/@usuario06", sponsors: "07",
  },
  {
    id: "07", name: "Artista 07", style: "Rap consciente", color: "amarillo", photo: a7,
    phrase: "Loja → París · rap consciente + guitarra lojana",
    origin: { city: "Loja", lon: -79.2, lat: -3.99 }, destination: { city: "París", lon: 2.35, lat: 48.86 },
    bio: "Texto de ejemplo. Poeta de esquina. Escribe sobre la migración con la guitarra de su padre de fondo.",
    story: "Texto de ejemplo. De la ciudad de la música de Ecuador a la ciudad de la luz.",
    works: [{ title: "Tema de ejemplo I", year: 2022 }, { title: "Tema de ejemplo II", year: 2024 }, { title: "Tema de ejemplo III", year: 2025 }],
    timeline: [{ date: "2017", text: "Primera batalla de gallos." }, { date: "2023", text: "Disco autoeditado." }, { date: "2025", text: "Primer show en París." }],
    socials: S("usuario07"), videoUrl: "https://youtube.com/@usuario07", sponsors: "08",
  },
  {
    id: "08", name: "Artista 08", style: "Afrobeat latino", color: "azul", photo: a8,
    phrase: "Ambato → Bilbao · afrobeat latino + pop urbano",
    origin: { city: "Ambato", lon: -78.62, lat: -1.24 }, destination: { city: "Bilbao", lon: -2.93, lat: 43.26 },
    bio: "Texto de ejemplo. La más joven del colectivo. Melodías pegadizas, producción brillante, futuro enorme.",
    story: "Texto de ejemplo. Llegó a Bilbao con 12 años. Hoy es la promesa de La Plena Rising.",
    works: [{ title: "Tema de ejemplo I", year: 2025 }, { title: "Tema de ejemplo II", year: 2026 }, { title: "Tema de ejemplo III", year: 2026 }],
    timeline: [{ date: "2023", text: "Primer cover en TikTok." }, { date: "2025", text: "Entra en La Plena Rising." }, { date: "2026", text: "Primer escenario en Europa." }],
    socials: S("usuario08"), videoUrl: "https://youtube.com/@usuario08",
  },
];

export const stats = { artistas: 8, paises: 6, streams: "1,2 M" }; // cifras de ejemplo
