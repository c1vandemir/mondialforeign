/**
 * Mondial Foreign Trade — Landing
 * ------------------------------------------------------------
 * Stack : React 18+ · Tailwind CSS · Framer Motion · lucide-react
 *
 * Arka plandaki küre Afrika'ya odaklanır; Türkiye'den 54 Afrika ülkesine akan
 * sevkiyat rotaları Canvas 2D ile çizilir. Ana hedef pazar frankofon ülkelerdir:
 * başkentleri her zaman etiketlenir ve rotaları belirgin (turuncu olmayan) çizilir.
 * Next.js App Router'da kullanılacaksa dosyanın başına "use client" ekleyin.
 */
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Mail, ArrowUpRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Marka / içerik (FR · EN)                                           */
/* ------------------------------------------------------------------ */

const ORANGE = "#F15A24";
const EMAIL = "info@mondialforeign.com";

const LANGS = ["fr", "en"];
const COPY = {
  fr: {
    title: "Mondial Foreign Trade — Import · Export · Turquie → Afrique",
    home: "accueil",
    mailLabel: "Envoyer un e-mail",
    langLabel: "Langue",
    eyebrow: "De la Turquie à l'Afrique",
    line1: ["Relier", "les", "continents,"],
    line2: ["Connecter", "le", "commerce."],
    lede:
      "Import, export et logistique de bout en bout — nous acheminons vos marchandises de la Turquie vers les 54 pays d'Afrique, d'Abidjan au Cap, avec précision et confiance.",
    cta: "Nous contacter",
    legendOrigin: "Départ — Turquie",
    legendDest: (n) => `${n} pays africains desservis`,
    services: "Import · Export · Logistique",
    route: "Turquie → Afrique",
    globe: { africa: "AFRIQUE", turkey: "TURQUIE" },
  },
  en: {
    title: "Mondial Foreign Trade — Import · Export · Türkiye → Africa",
    home: "home",
    mailLabel: "Send an e-mail",
    langLabel: "Language",
    eyebrow: "From Türkiye to Africa",
    line1: ["Bridging", "continents,"],
    line2: ["Connecting", "trade."],
    lede:
      "Import, export and end-to-end logistics — we move your goods from Türkiye to all 54 African countries, from Abidjan to Cape Town, with precision and trust.",
    cta: "Contact us",
    legendOrigin: "Origin — Türkiye",
    legendDest: (n) => `${n} African countries served`,
    services: "Import · Export · Logistics",
    route: "Türkiye → Africa",
    globe: { africa: "AFRICA", turkey: "TÜRKİYE" },
  },
};

const LANG_KEY = "mf-lang";
const readLang = () => {
  try {
    const v = localStorage.getItem(LANG_KEY);
    if (LANGS.includes(v)) return v;
  } catch {}
  return "fr";
};

/* ------------------------------------------------------------------ */
/*  Global stiller                                                     */
/* ------------------------------------------------------------------ */

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Manrope:wght@300;400;500;600&family=Fredoka:wght@600&display=swap');
.font-display { font-family: 'Cormorant Garamond', 'Times New Roman', serif; }
@keyframes mf-shine { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
@keyframes mf-spin  { to { transform: rotate(360deg); } }
@keyframes mf-pulse { 0%,100% { opacity: .35; transform: scale(.9); } 50% { opacity: 1; transform: scale(1.15); } }
@keyframes mf-dash  { to { stroke-dashoffset: -68; } }
.mf-logo .mf-dash { animation: mf-dash 1.6s linear infinite; animation-play-state: paused; }
.mf-logo:hover .mf-dash { animation-play-state: running; }
`;

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/* ------------------------------------------------------------------ */
/*  Coğrafya (sadeleştirilmiş poligonlar: [lon, lat])                  */
/* ------------------------------------------------------------------ */

const TURKEY = [[26.0,40.6],[26.6,41.6],[28.0,42.0],[29.1,41.2],[31.2,41.1],[33.4,42.0],[35.2,42.0],[36.9,41.3],[38.3,40.9],[40.1,40.9],[41.5,41.5],[42.8,41.6],[43.6,41.1],[43.7,40.1],[44.8,39.7],[44.4,38.4],[44.3,37.2],[42.4,37.1],[41.2,37.1],[40.0,36.9],[38.0,36.8],[36.7,36.8],[36.2,36.0],[35.8,36.8],[34.6,36.8],[33.5,36.2],[32.0,36.5],[30.6,36.7],[29.7,36.1],[28.2,36.7],[27.4,37.0],[26.3,38.2],[26.8,39.0],[26.2,39.5]];

const AFRICA = [[-17.1,21],[-16.5,19.5],[-16.3,16.5],[-17.5,14.7],[-16.7,12.5],[-15,11],[-13.3,9.5],[-11.5,7],[-9,5],[-7.5,4.4],[-4,5.2],[-2,4.8],[1,6],[2.7,6.3],[4.5,6.3],[6,4.3],[7.8,4.4],[9.5,3.9],[9.8,2.3],[9.3,0.5],[8.9,-1],[11,-3.8],[12.2,-6],[13.2,-8.5],[13.5,-11],[12.5,-13.5],[11.8,-17.2],[13,-20.5],[14.5,-23],[15.2,-27],[16.5,-28.6],[18.4,-34.1],[20,-34.8],[22.5,-34],[25.6,-34],[27.5,-33.2],[30,-31.3],[31.3,-29.5],[32.6,-26.5],[33,-25.5],[35.5,-24],[35.5,-21.5],[34.7,-19.8],[36.8,-17.8],[40.5,-15],[40.6,-11],[39.3,-8],[39.5,-6],[39.2,-4.7],[40.8,-2.4],[42,-0.5],[44,1.5],[46,2.4],[48,4.5],[49.6,7.5],[50.8,10],[51.3,11.8],[49,11.2],[45,10.6],[43.3,11.6],[43,12.7],[41.8,13.8],[40,15.6],[39,17.5],[37.4,18.8],[37,21],[35.6,23.5],[34.4,26.5],[33,28.6],[32.6,30],[32.3,31.3],[31,31.6],[29,30.9],[25.2,31.6],[23,32.6],[20,32],[20,30.8],[19,30.3],[15.5,31.6],[15.2,32.3],[11.5,33.2],[10.2,34.3],[11.1,35.2],[10.3,37],[9.5,37.3],[8,36.9],[5,36.8],[3,36.8],[0,35.9],[-2.2,35.1],[-5.4,35.9],[-6.2,35.2],[-6.8,34],[-8.6,33.2],[-9.8,31.4],[-9.6,29.9],[-11.5,28.2],[-13,27.6],[-14.5,26],[-16,24],[-17,22]];

const MADAGASCAR = [[44,-25],[47,-25],[50,-15],[49,-12],[44,-16]];

const LAND = [
  // North America
  [[-168,66],[-162,70],[-140,70],[-125,72],[-95,73],[-80,70],[-65,62],[-60,55],[-56,52],[-66,45],[-70,42],[-76,38],[-76,35],[-81,31],[-80,25],[-82,27],[-84,30],[-90,29],[-97,27],[-97,22],[-95,18],[-90,21],[-87,21],[-88,16],[-83,10],[-79,9],[-81,8],[-86,12],[-92,14],[-105,20],[-110,24],[-112,30],[-115,30],[-117,33],[-121,35],[-124,40],[-124,46],[-128,51],[-135,57],[-142,60],[-150,60],[-158,57],[-165,60],[-166,64]],
  [[-55,60],[-42,60],[-20,70],[-18,77],[-30,83],[-60,82],[-72,78],[-56,70]],
  [[-24,64],[-13,64],[-15,66.5],[-22,66.5]],
  // South America
  [[-80,9],[-72,12],[-62,11],[-52,5],[-50,0],[-35,-5],[-35,-9],[-39,-15],[-41,-22],[-48,-26],[-53,-34],[-58,-38],[-65,-41],[-66,-47],[-69,-52],[-72,-54],[-74,-50],[-74,-40],[-72,-30],[-70,-18],[-76,-14],[-81,-6],[-80,0],[-77,4]],
  // Eurasia
  [[-10,36],[-9,43],[-2,44],[-5,48],[2,51],[8,54],[10,58],[5,58],[5,62],[14,68],[25,71],[40,68],[45,68],[60,69],[70,73],[80,73],[100,78],[115,73],[130,72],[140,72],[160,70],[180,68],[180,65],[170,60],[162,58],[156,51],[155,57],[143,59],[137,54],[140,48],[135,43],[130,42],[127,39],[126,35],[121,32],[122,30],[119,25],[111,21],[108,21],[106,17],[109,12],[105,9],[103,10],[100,13],[100,8],[103,1],[100,3],[98,8],[98,16],[94,17],[92,22],[88,22],[80,15],[78,8],[73,17],[72,21],[67,24],[62,25],[57,26],[56,24],[59,22],[55,17],[44,12],[43,17],[39,21],[35,28],[34,31],[36,36],[30,36],[27,37],[26,40],[29,41],[23,40],[20,42],[19,40],[16,38],[12,44],[14,41],[16,40],[12,38],[8,44],[3,43],[-1,37],[-6,36]],
  AFRICA,
  MADAGASCAR,
  [[-5,50],[1,51],[1,53],[-2,56],[-3,58.5],[-6,58],[-5,55],[-3,54]],
  [[-10,52],[-6,52],[-6,55],[-8,55]],
  [[130,31],[135,34],[140,35],[142,40],[141,45],[145,44],[140,41],[136,37],[131,34]],
  [[109,1],[117,7],[119,1],[116,-4],[110,-3]],
  [[95,5],[98,4],[106,-6],[102,-4]],
  [[106,-6],[115,-8],[114,-9],[106,-7]],
  [[131,-1],[141,-3],[150,-10],[141,-9],[138,-8]],
  [[114,-22],[114,-34],[118,-35],[124,-34],[131,-31],[138,-35],[141,-38],[147,-39],[150,-37],[153,-28],[153,-25],[146,-19],[143,-11],[141,-13],[136,-12],[136,-16],[130,-12],[126,-14],[122,-18]],
  [[172,-34],[178,-38],[174,-41],[167,-46],[171,-44],[174,-39]],
];

// Çıkış: Türkiye (tek merkez)
const ORIGIN = { lat: 39.2, lon: 34.0 };

// Afrika'nın 54 ülkesi — başkent / ana liman (Fransızca adlar; farklıysa `en`)
// fr: frankofon ülke (ana hedef) → başkenti her zaman yazılır.
// side: etiket konumu (r = sağ, l = sol, b = alt) — yakın şehirlerde çakışmayı önler.
const DESTINATIONS = [
  // --- Frankofon ülkeler ---
  { name: "Abidjan", country: "Côte d'Ivoire", lat: 5.36, lon: -4.01, fr: true, side: "r" },
  { name: "Yamoussoukro", country: "Côte d'Ivoire", lat: 6.82, lon: -5.28, fr: true, side: "l" },
  { name: "Dakar", country: "Sénégal", lat: 14.72, lon: -17.47, fr: true, side: "l" },
  { name: "Bamako", country: "Mali", lat: 12.64, lon: -8.0, fr: true, side: "l" },
  { name: "Ouagadougou", country: "Burkina Faso", lat: 12.37, lon: -1.52, fr: true, side: "b" },
  { name: "Niamey", country: "Niger", lat: 13.51, lon: 2.11, fr: true, side: "r" },
  { name: "Conakry", country: "Guinée", lat: 9.51, lon: -13.71, fr: true, side: "l" },
  { name: "Lomé", country: "Togo", lat: 6.13, lon: 1.22, fr: true, side: "b" },
  { name: "Porto-Novo", country: "Bénin", lat: 6.5, lon: 2.6, fr: true, side: "r" },
  { name: "Nouakchott", country: "Mauritanie", lat: 18.08, lon: -15.98, fr: true, side: "l" },
  { name: "Yaoundé", country: "Cameroun", lat: 3.87, lon: 11.52, fr: true, side: "r" },
  { name: "Malabo", country: "Guinée équatoriale", lat: 3.75, lon: 8.78, fr: true, side: "l" },
  { name: "Libreville", country: "Gabon", lat: 0.42, lon: 9.47, fr: true, side: "l" },
  { name: "Brazzaville", country: "Congo", lat: -4.27, lon: 15.28, fr: true, side: "l" },
  { name: "Kinshasa", country: "RD Congo", lat: -4.32, lon: 15.31, fr: true, side: "r" },
  { name: "Bangui", country: "Centrafrique", lat: 4.39, lon: 18.56, fr: true, side: "r" },
  { name: "N'Djamena", country: "Tchad", lat: 12.13, lon: 15.06, fr: true, side: "r" },
  { name: "Kigali", country: "Rwanda", lat: -1.94, lon: 30.06, fr: true, side: "r" },
  { name: "Gitega", country: "Burundi", lat: -3.43, lon: 29.92, fr: true, side: "r" },
  { name: "Djibouti", country: "Djibouti", lat: 11.59, lon: 43.15, fr: true, side: "r" },
  { name: "Moroni", country: "Comores", lat: -11.7, lon: 43.26, fr: true, side: "l" },
  { name: "Antananarivo", country: "Madagascar", lat: -18.88, lon: 47.51, fr: true, side: "r" },
  { name: "Victoria", country: "Seychelles", lat: -4.62, lon: 55.45, fr: true, side: "r" },
  { name: "Port-Louis", country: "Maurice", lat: -20.16, lon: 57.5, fr: true, side: "r" },
  { name: "Rabat", country: "Maroc", lat: 34.02, lon: -6.84, fr: true, side: "l" },
  { name: "Alger", en: "Algiers", country: "Algérie", lat: 36.75, lon: 3.06, fr: true, side: "r" },
  { name: "Tunis", country: "Tunisie", lat: 36.81, lon: 10.18, fr: true, side: "r" },
  // --- Diğer ülkeler ---
  { name: "Tripoli", lat: 32.89, lon: 13.19 },
  { name: "Alexandrie", en: "Alexandria", lat: 31.2, lon: 29.92, label: true },
  { name: "Banjul", lat: 13.45, lon: -16.58 },
  { name: "Bissau", lat: 11.86, lon: -15.6 },
  { name: "Freetown", lat: 8.48, lon: -13.23 },
  { name: "Monrovia", lat: 6.31, lon: -10.8 },
  { name: "Accra", lat: 5.6, lon: -0.19 },
  { name: "Lagos", lat: 6.52, lon: 3.38 },
  { name: "São Tomé", lat: 0.34, lon: 6.73 },
  { name: "Luanda", lat: -8.84, lon: 13.23 },
  { name: "Windhoek", lat: -22.56, lon: 17.08 },
  { name: "Le Cap", en: "Cape Town", lat: -33.92, lon: 18.42, label: true },
  { name: "Gaborone", lat: -24.65, lon: 25.91 },
  { name: "Harare", lat: -17.83, lon: 31.05 },
  { name: "Maputo", lat: -25.97, lon: 32.57 },
  { name: "Mbabane", lat: -26.31, lon: 31.14 },
  { name: "Maseru", lat: -29.31, lon: 27.48 },
  { name: "Lusaka", lat: -15.39, lon: 28.32 },
  { name: "Lilongwe", lat: -13.96, lon: 33.79 },
  { name: "Dar es Salaam", lat: -6.79, lon: 39.21 },
  { name: "Mombasa", lat: -4.04, lon: 39.67, label: true },
  { name: "Kampala", lat: 0.35, lon: 32.58 },
  { name: "Mogadiscio", en: "Mogadishu", lat: 2.05, lon: 45.32 },
  { name: "Addis-Abeba", en: "Addis Ababa", lat: 9.03, lon: 38.74 },
  { name: "Asmara", lat: 15.32, lon: 38.93 },
  { name: "Khartoum", lat: 15.5, lon: 32.56 },
  { name: "Djouba", en: "Juba", lat: 4.86, lon: 31.57 },
  { name: "Praia", lat: 14.93, lon: -23.51 },
];

/* ------------------------------------------------------------------ */
/*  Geometri yardımcıları                                              */
/* ------------------------------------------------------------------ */

const D2R = Math.PI / 180;
const TAU = Math.PI * 2;

const toVec = (lat, lon) => {
  const la = lat * D2R, lo = lon * D2R;
  return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)];
};

const withBox = (p) => {
  const xs = p.map((q) => q[0]), ys = p.map((q) => q[1]);
  return { p, x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
};

const inPoly = (lon, lat, poly) => {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
const inBox = (lon, lat, q) =>
  lon >= q.x0 && lon <= q.x1 && lat >= q.y0 && lat <= q.y1 && inPoly(lon, lat, q.p);

/** Eşit alanlı ızgara üzerinde lon/lat noktaları üretir. */
function grid(step, lat0, lat1, lon0, lon1, cb) {
  for (let lat = lat0; lat <= lat1; lat += step) {
    const n = Math.max(1, Math.round((360 * Math.cos(lat * D2R)) / step));
    for (let j = 0; j < n; j++) {
      const lon = -180 + ((j + 0.5) * 360) / n;
      if (lon >= lon0 && lon <= lon1) cb(lon, lat);
    }
  }
}

/** Nokta bulutu: 0 = dünya, 1 = Afrika, 2 = Türkiye. */
function buildDots() {
  const land = LAND.map(withBox);
  const af = [withBox(AFRICA), withBox(MADAGASCAR)];
  const tr = withBox(TURKEY);
  const pos = [], type = [];
  const push = (lat, lon, t) => { pos.push(...toVec(lat, lon)); type.push(t); };

  grid(1.6, -56, 83, -180, 180, (lon, lat) => {
    if (af.some((q) => inBox(lon, lat, q)) || inBox(lon, lat, tr)) return;
    if (land.some((q) => inBox(lon, lat, q))) push(lat, lon, 0);
  });
  grid(1.0, -36, 38, -18, 52, (lon, lat) => {
    if (af.some((q) => inBox(lon, lat, q))) push(lat, lon, 1);
  });
  grid(0.42, 35.8, 42.2, 25.5, 45, (lon, lat) => {
    if (inBox(lon, lat, tr)) push(lat, lon, 2);
  });
  return { pos: new Float32Array(pos), type: new Uint8Array(type) };
}

/** Yükseltilmiş büyük daire yayı (slerp). */
function buildArc(a, b, segments = 80) {
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const w = Math.acos(dot);
  const s = Math.sin(w) || 1e-6;
  const lift = 0.02 + w * 0.1;
  const pts = new Float32Array((segments + 1) * 3);
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const k0 = Math.sin((1 - t) * w) / s;
    const k1 = Math.sin(t * w) / s;
    const h = 1 + lift * Math.sin(Math.PI * t);
    pts[i * 3] = (a[0] * k0 + b[0] * k1) * h;
    pts[i * 3 + 1] = (a[1] * k0 + b[1] * k1) * h;
    pts[i * 3 + 2] = (a[2] * k0 + b[2] * k1) * h;
  }
  return pts;
}

/* ------------------------------------------------------------------ */
/*  Canvas: Afrika odaklı küre + Türkiye → Afrika sevkiyatları         */
/* ------------------------------------------------------------------ */

const VIEW_LON = 16 * D2R;
const VIEW_LAT = 11 * D2R;

function GlobeCanvas({ mouse, lang }) {
  const canvasRef = useRef(null);
  const reduceMotion = useReducedMotion();
  // dil değişince animasyon döngüsü yeniden başlamasın diye ref ile okunur
  const langRef = useRef(lang);
  langRef.current = lang;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, dpr = 1, R = 0, cx0 = 0, cy0 = 0, wide = false, raf = 0;

    const { pos: dots, type: dotType } = buildDots();
    const dotCount = dotType.length;
    const origin = toVec(ORIGIN.lat, ORIGIN.lon);
    const dests = DESTINATIONS.map((c, i) => ({
      ...c,
      v: toVec(c.lat, c.lon),
      pts: buildArc(origin, toVec(c.lat, c.lon)),
      heads: [(i * 0.618) % 1],
      speed: 0.045 + (i % 5) * 0.01,
    }));
    const trCenter = toVec(39, 35);
    const afLabel = toVec(-17, 21);
    const trLabel = toVec(44.2, 35);
    dests.sort((a, b) => (a.fr ? 1 : 0) - (b.fr ? 1 : 0)); // frankofon rotalar en üstte çizilsin
    const stars = Array.from({ length: 170 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.1 + 0.2,
      p: Math.random() * TAU,
    }));

    const proj = new Float32Array(81 * 3);
    const o = [0, 0, 0];
    const m = { x: 0, y: 0 };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      wide = w >= 1024;
      if (wide) {
        R = Math.min(w * 0.3, h * 0.43);
        cx0 = w * 0.7;
        cy0 = h * 0.53;
      } else {
        R = Math.min(w * 0.52, h * 0.36);
        cx0 = w / 2;
        cy0 = h * 0.66;
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const frame = (nowMs) => {
      const t = nowMs / 1000;
      const lng = langRef.current;
      const names = COPY[lng].globe;
      const cityName = (d) => (lng === "en" && d.en) || d.name;

      m.x += (mouse.current.x - m.x) * 0.04;
      m.y += (mouse.current.y - m.y) * 0.04;

      // Afrika merkezde kalacak şekilde yavaş salınım
      const sway = reduceMotion ? 0 : Math.sin(t * 0.09) * 0.2;
      const Y = -VIEW_LON + sway + m.x * 0.22;
      const P = VIEW_LAT + m.y * 0.1;
      const cY = Math.cos(Y), sY = Math.sin(Y), cP = Math.cos(P), sP = Math.sin(P);
      const rot = (x, y, z) => {
        const x1 = x * cY + z * sY;
        const z1 = -x * sY + z * cY;
        o[0] = x1;
        o[1] = y * cP - z1 * sP;
        o[2] = y * sP + z1 * cP;
      };
      const cx = cx0 + m.x * 18;
      const cy = cy0 + m.y * 12;
      const sx = () => cx + o[0] * R;
      const sy = () => cy - o[1] * R;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // --- yıldızlar ---
      ctx.fillStyle = "#dbe7ff";
      for (const s of stars) {
        ctx.globalAlpha = (0.15 + 0.4 * (0.5 + 0.5 * Math.sin(t * 0.7 + s.p))) * s.r * 0.8;
        ctx.fillRect(s.x * w - m.x * 10 * s.r, s.y * h - m.y * 8 * s.r, s.r, s.r);
      }
      ctx.globalAlpha = 1;

      // --- atmosfer + gövde ---
      let g = ctx.createRadialGradient(cx, cy, R * 0.92, cx, cy, R * 1.3);
      g.addColorStop(0, "rgba(125,211,252,0.2)");
      g.addColorStop(0.35, "rgba(59,130,246,0.06)");
      g.addColorStop(1, "rgba(3,6,15,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.3, 0, TAU);
      ctx.fill();

      g = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.45, R * 0.05, cx, cy, R);
      g.addColorStop(0, "rgba(40,62,118,0.55)");
      g.addColorStop(0.6, "rgba(10,18,42,0.9)");
      g.addColorStop(1, "rgba(4,8,20,0.97)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = "rgba(165,215,255,0.16)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // --- Türkiye çevresinde turuncu hale ---
      const halo = (v, radius, alpha) => {
        rot(v[0], v[1], v[2]);
        if (o[2] <= 0) return;
        const hx = sx(), hy = sy();
        const hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, radius);
        hg.addColorStop(0, `rgba(241,90,36,${alpha})`);
        hg.addColorStop(1, "rgba(241,90,36,0)");
        ctx.fillStyle = hg;
        ctx.beginPath();
        ctx.arc(hx, hy, radius, 0, TAU);
        ctx.fill();
      };
      halo(trCenter, R * 0.2, 0.35);

      // --- kara noktaları ---
      const base = Math.max(1, R / 260);
      const styles = [
        { color: "#7f95b8", size: base, k: 0.35 },
        { color: "#d9e7ff", size: base * 1.05, k: 0.95 },
        { color: "#ff7a45", size: base * 1.15, k: 1 },
      ];
      for (let s = 0; s < styles.length; s++) {
        const st = styles[s];
        ctx.fillStyle = st.color;
        for (let i = 0; i < dotCount; i++) {
          if (dotType[i] !== s) continue;
          rot(dots[i * 3], dots[i * 3 + 1], dots[i * 3 + 2]);
          if (o[2] <= 0.02) continue;
          const light = 0.6 + 0.4 * Math.max(0, -o[0] * 0.4 + o[1] * 0.5 + o[2] * 0.75);
          ctx.globalAlpha = Math.min(1, (0.1 + 0.85 * Math.pow(o[2], 1.3)) * light * st.k);
          ctx.fillRect(sx() - st.size / 2, sy() - st.size / 2, st.size, st.size);
        }
      }
      ctx.globalAlpha = 1;

      // --- bölge etiketleri ---
      const label = (v, text, font, color, spacing) => {
        rot(v[0], v[1], v[2]);
        if (o[2] <= 0.1) return;
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.globalAlpha = Math.min(1, o[2] * 1.3);
        if ("letterSpacing" in ctx) ctx.letterSpacing = spacing;
        ctx.textAlign = "center";
        ctx.fillText(text, sx(), sy());
        if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
        ctx.globalAlpha = 1;
      };
      label(afLabel, names.africa, `500 ${Math.round(R / 11)}px 'Cormorant Garamond', serif`, "rgba(220,232,255,0.16)", `${Math.round(R / 28)}px`);
      label(trLabel, names.turkey, `600 ${Math.max(10, Math.round(R / 30))}px Manrope, sans-serif`, "rgba(255,150,105,0.95)", "3px");

      // --- sevkiyat rotaları ---
      ctx.lineCap = "round";
      for (const d of dests) {
        const n = d.pts.length / 3;
        for (let i = 0; i < n; i++) {
          rot(d.pts[i * 3], d.pts[i * 3 + 1], d.pts[i * 3 + 2]);
          proj[i * 3] = sx();
          proj[i * 3 + 1] = sy();
          proj[i * 3 + 2] = o[2] > 0 || o[0] * o[0] + o[1] * o[1] > 1 ? 1 : 0;
        }

        // rota çizgisi: frankofon rotalar açık mavi ve kesintisiz, diğerleri ince kesikli
        if (d.fr) {
          ctx.setLineDash([]);
          ctx.strokeStyle = "rgba(186,214,255,0.22)";
          ctx.lineWidth = 0.9;
        } else {
          ctx.setLineDash([3, 5]);
          ctx.strokeStyle = "rgba(241,90,36,0.14)";
          ctx.lineWidth = 0.7;
        }
        ctx.beginPath();
        let pen = false;
        for (let i = 0; i < n; i++) {
          if (!proj[i * 3 + 2]) { pen = false; continue; }
          if (pen) ctx.lineTo(proj[i * 3], proj[i * 3 + 1]);
          else { ctx.moveTo(proj[i * 3], proj[i * 3 + 1]); pen = true; }
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Türkiye'den çıkan yük ışıkları
        const trail = d.fr ? 0.18 : 0.16;
        const peak = d.fr ? 0.85 : 0.65;
        const glowR = d.fr ? 8 : 6;
        let arrival = 1;
        for (const offset of d.heads) {
          const head = (offset + t * d.speed) % 1;
          arrival = Math.min(arrival, head);
          const fade = Math.min(1, head / 0.08) * peak;
          const i1 = Math.floor(head * (n - 1));
          const i0 = Math.max(0, i1 - Math.floor((n - 1) * trail));
          for (let i = i0; i < i1; i++) {
            if (!proj[i * 3 + 2] || !proj[(i + 1) * 3 + 2]) continue;
            const k = (i - i0) / Math.max(1, i1 - i0);
            ctx.strokeStyle = `rgba(255,${Math.round(120 + 80 * k)},${Math.round(60 + 120 * k)},${k * 0.95 * fade})`;
            ctx.lineWidth = (d.fr ? 0.5 : 0.4) + k * (d.fr ? 1.8 : 1.4);
            ctx.beginPath();
            ctx.moveTo(proj[i * 3], proj[i * 3 + 1]);
            ctx.lineTo(proj[(i + 1) * 3], proj[(i + 1) * 3 + 1]);
            ctx.stroke();
          }
          if (proj[i1 * 3 + 2]) {
            const hx = proj[i1 * 3], hy = proj[i1 * 3 + 1];
            const hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, glowR);
            hg.addColorStop(0, `rgba(255,255,255,${0.95 * fade})`);
            hg.addColorStop(0.3, `rgba(255,140,80,${0.75 * fade})`);
            hg.addColorStop(1, "rgba(241,90,36,0)");
            ctx.fillStyle = hg;
            ctx.beginPath();
            ctx.arc(hx, hy, glowR, 0, TAU);
            ctx.fill();
          }
        }

        // varış noktası + teslim anındaki halka
        rot(d.v[0], d.v[1], d.v[2]);
        if (o[2] > 0.05) {
          const x = sx(), y = sy();
          const depth = Math.min(1, o[2] * 1.4);
          if (d.fr) {
            if (arrival < 0.14) {
              const a = arrival / 0.14;
              ctx.strokeStyle = `rgba(186,214,255,${(1 - a) * 0.75 * depth})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.arc(x, y, 3 + a * 13, 0, TAU);
              ctx.stroke();
            }
            ctx.fillStyle = `rgba(240,247,255,${0.95 * depth})`;
            ctx.beginPath();
            ctx.arc(x, y, 2.2, 0, TAU);
            ctx.fill();
            if (R > 150) {
              const fs = R > 330 ? 11 : R > 230 ? 10 : 9;
              ctx.font = `500 ${fs}px Manrope, sans-serif`;
              ctx.fillStyle = `rgba(226,236,252,${0.9 * depth})`;
              if (d.side === "l") {
                ctx.textAlign = "right";
                ctx.fillText(cityName(d), x - 6, y + 3.5);
              } else if (d.side === "b") {
                ctx.textAlign = "center";
                ctx.fillText(cityName(d), x, y + fs + 5);
              } else {
                ctx.textAlign = "left";
                ctx.fillText(cityName(d), x + 6, y + 3.5);
              }
            }
          } else {
            if (arrival < 0.14) {
              const a = arrival / 0.14;
              ctx.strokeStyle = `rgba(125,211,252,${(1 - a) * 0.6 * depth})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.arc(x, y, 2.5 + a * 11, 0, TAU);
              ctx.stroke();
            }
            ctx.fillStyle = `rgba(224,242,254,${0.85 * depth})`;
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, TAU);
            ctx.fill();
            if (d.label && R > 220) {
              ctx.font = `500 ${R > 330 ? 11 : 10}px Manrope, sans-serif`;
              ctx.textAlign = "left";
              ctx.fillStyle = `rgba(203,219,240,${0.6 * depth})`;
              ctx.fillText(cityName(d), x + 6, y + 3.5);
            }
          }
        }
      }

      // --- çıkış noktası: Türkiye ---
      rot(origin[0], origin[1], origin[2]);
      if (o[2] > 0.05) {
        const x = sx(), y = sy();
        for (let k = 0; k < 2; k++) {
          const phase = (t * 0.45 + k * 0.5) % 1;
          ctx.strokeStyle = `rgba(241,90,36,${(1 - phase) * 0.7})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(x, y, 4 + phase * 22, 0, TAU);
          ctx.stroke();
        }
        ctx.fillStyle = "#fff1e8";
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, TAU);
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [mouse, reduceMotion]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

/* ------------------------------------------------------------------ */
/*  Logo — "mondial" kesikli harfler + turuncu dünya + FOREIGN TRADE   */
/* ------------------------------------------------------------------ */

/** Logo içindeki küre için Avrupa/Afrika merkezli ortografik kıta yolu. */
function globeLandPath(cx, cy, r, lon0, lat0) {
  const c0 = Math.cos(lat0 * D2R), s0 = Math.sin(lat0 * D2R);
  let d = "";
  for (const poly of LAND) {
    let visible = false;
    const pts = poly.map(([lon, lat]) => {
      const la = lat * D2R, dl = (lon - lon0) * D2R;
      let x = Math.cos(la) * Math.sin(dl);
      let y = c0 * Math.sin(la) - s0 * Math.cos(la) * Math.cos(dl);
      const z = s0 * Math.sin(la) + c0 * Math.cos(la) * Math.cos(dl);
      if (z >= 0) visible = true;
      else {
        const k = Math.hypot(x, y) || 1;
        x /= k;
        y /= k;
      }
      return `${(cx + x * r).toFixed(1)} ${(cy - y * r).toFixed(1)}`;
    });
    if (visible) d += `M${pts.join("L")}Z`;
  }
  return d;
}

const LOGO_GLOBE = { cx: 530, cy: 208, r: 92 };
const LOGO_LAND = globeLandPath(LOGO_GLOBE.cx, LOGO_GLOBE.cy, LOGO_GLOBE.r - 9, 18, 28);

const LETTERS = [
  "M132 290V185A63 57 0 0 1 258 185V290M258 185A63 57 0 0 1 384 185V290", // m
  "M668 290V185A63.5 57 0 0 1 795 185V290", // n
  "M1012 208A77 80 0 1 1 1012 207.9M1014 48V290", // d
  "M1101 68V80M1101 128V290", // i
  "M1332 208A77 80 0 1 1 1332 207.9M1334 128V290", // a
  "M1420 48V290", // l
];

function Logo({ className = "", label }) {
  return (
    <a href="#" aria-label={`Mondial Foreign Trade — ${label}`} className={`mf-logo group block ${className}`}>
      <svg viewBox="110 30 1340 360" className="h-auto w-full overflow-visible" fill="none">
        <defs>
          <clipPath id="mf-globe-clip">
            <circle cx={LOGO_GLOBE.cx} cy={LOGO_GLOBE.cy} r={LOGO_GLOBE.r - 9} />
          </clipPath>
          <radialGradient id="mf-globe-fill" cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" stopColor="#F15A24" stopOpacity=".18" />
            <stop offset="1" stopColor="#F15A24" stopOpacity=".03" />
          </radialGradient>
          <filter id="mf-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="10" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* kesikli harfler */}
        {LETTERS.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            className="mf-dash"
            stroke="#eef2f8"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="20 14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.25 + (i >= 1 ? i + 1 : i) * 0.09 }}
          />
        ))}

        {/* "o" — turuncu dünya */}
        <motion.g
          style={{ transformOrigin: `${LOGO_GLOBE.cx}px ${LOGO_GLOBE.cy}px` }}
          initial={{ opacity: 0, scale: 0.6, rotate: -40 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.3, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <circle cx={LOGO_GLOBE.cx} cy={LOGO_GLOBE.cy} r={LOGO_GLOBE.r - 9} fill="url(#mf-globe-fill)" />
          <path d={LOGO_LAND} fill={ORANGE} clipPath="url(#mf-globe-clip)" />
          <circle
            cx={LOGO_GLOBE.cx}
            cy={LOGO_GLOBE.cy}
            r={LOGO_GLOBE.r}
            stroke={ORANGE}
            strokeWidth="14"
            filter="url(#mf-glow)"
            className="transition-[stroke-width] duration-500 group-hover:[stroke-width:16]"
          />
        </motion.g>

        {/* FOREIGN TRADE */}
        <motion.text
          x="130"
          y="372"
          textLength="1296"
          lengthAdjust="spacing"
          fill={ORANGE}
          style={{ fontFamily: "'Fredoka', 'Manrope', sans-serif", fontWeight: 600, fontSize: 60 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
        >
          FOREIGN{"   "}TRADE
        </motion.text>
      </svg>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Başlık kelimesi                                                    */
/* ------------------------------------------------------------------ */

const wordVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(14px)" },
  show: ({ i, base }) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: base + i * 0.12, duration: 1.2, ease: [0.22, 1, 0.36, 1] },
  }),
};

const PLATINUM =
  "bg-[linear-gradient(110deg,#7c8799_0%,#e2e8f0_20%,#ffffff_35%,#94a3b8_50%,#f8fafc_65%,#cbd5e1_80%,#7c8799_100%)]";
const COPPER =
  "bg-[linear-gradient(110deg,#9a3412_0%,#f15a24_20%,#ffd9c4_35%,#f97316_50%,#ffe6d6_65%,#ea580c_80%,#9a3412_100%)]";

function Word({ children, index, base, tone }) {
  return (
    <motion.span
      custom={{ i: index, base }}
      variants={wordVariants}
      initial="hidden"
      animate="show"
      className={`inline-block bg-[length:250%_100%] bg-clip-text pb-[0.12em] pr-[0.04em] text-transparent [animation:mf-shine_9s_ease-in-out_infinite_alternate] ${
        tone === "copper" ? COPPER : PLATINUM
      }`}
    >
      {children}
    </motion.span>
  );
}

function Line({ words, start, base, tone }) {
  return words.map((word, i) => (
    <span key={i}>
      <Word index={start + i} base={base} tone={tone}>{word}</Word>
      {i < words.length - 1 && " "}
    </span>
  ));
}

/* ------------------------------------------------------------------ */
/*  Dil seçici — kayan turuncu göstergeli cam kapsül                   */
/* ------------------------------------------------------------------ */

function LangSwitch({ lang, onChange, label }) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="relative flex h-11 items-center rounded-full border border-white/10 bg-white/[0.04] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md transition-colors duration-500 hover:border-white/20"
    >
      {LANGS.map((l) => {
        const active = l === lang;
        return (
          <button
            key={l}
            type="button"
            role="radio"
            aria-checked={active}
            lang={l}
            onClick={() => onChange(l)}
            className={`relative h-full w-11 cursor-pointer rounded-full text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors duration-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-300/60 ${
              active ? "text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {active && (
              <motion.span
                layoutId="mf-lang-pill"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="absolute inset-0 rounded-full border border-orange-300/30 bg-[linear-gradient(135deg,rgba(241,90,36,0.55),rgba(241,90,36,0.18))] shadow-[0_0_18px_rgba(241,90,36,0.45),inset_0_1px_0_rgba(255,255,255,0.18)]"
              />
            )}
            <span className="relative pl-[0.2em]">{l}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Dil değişiminde metni yumuşakça yeniden belirginleştirir. */
function Swap({ k, children }) {
  return (
    <motion.span
      key={k}
      initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="inline-block"
    >
      {children}
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/*  Sayfa                                                              */
/* ------------------------------------------------------------------ */

const EASE = [0.22, 1, 0.36, 1];

export default function MondialForeign() {
  const [lang, setLang] = useState(readLang);
  const [switched, setSwitched] = useState(false);
  const c = COPY[lang];
  const wordBase = switched ? 0.05 : 0.7;

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = c.title;
  }, [lang, c.title]);

  const changeLang = (l) => {
    if (l === lang) return;
    setLang(l);
    setSwitched(true);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {}
  };

  const mouse = useRef({ x: 0, y: 0 });
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 18, mass: 0.7 });
  const sy = useSpring(my, { stiffness: 40, damping: 18, mass: 0.7 });

  const meshX = useTransform(sx, (v) => v * 40);
  const meshY = useTransform(sy, (v) => v * 30);
  const textX = useTransform(sx, (v) => v * -14);
  const textY = useTransform(sy, (v) => v * -10);
  const chromeX = useTransform(sx, (v) => v * -5);
  const chromeY = useTransform(sy, (v) => v * -4);

  const handleMove = (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    mouse.current = { x, y };
    mx.set(x);
    my.set(y);
  };
  const handleLeave = () => {
    mouse.current = { x: 0, y: 0 };
    mx.set(0);
    my.set(0);
  };

  return (
    <main
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="relative flex h-[100svh] min-h-[640px] w-full flex-col overflow-hidden bg-[#03060f] text-slate-200 antialiased selection:bg-orange-500/30"
      style={{ fontFamily: "'Manrope', ui-sans-serif, system-ui, sans-serif" }}
    >
      <style>{GLOBAL_CSS}</style>

      {/* ---------- Mesh gradient ---------- */}
      <motion.div style={{ x: meshX, y: meshY }} className="pointer-events-none absolute inset-[-10%]">
        <motion.div
          className="absolute left-[-10%] top-[-15%] h-[65vmax] w-[65vmax] rounded-full bg-[radial-gradient(circle,rgba(30,58,138,0.5),transparent_62%)] blur-3xl"
          animate={{ x: [0, 80, -30, 0], y: [0, 50, 20, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-25%] right-[-15%] h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(circle,rgba(241,90,36,0.13),transparent_60%)] blur-3xl"
          animate={{ x: [0, -70, 20, 0], y: [0, -40, 30, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[10%] top-[5%] h-[40vmax] w-[40vmax] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.1),transparent_60%)] blur-3xl"
          animate={{ x: [0, -40, 30, 0], y: [0, 60, -20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* ---------- Küre ---------- */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 2.6, ease: EASE }}
      >
        <GlobeCanvas mouse={mouse} lang={lang} />
      </motion.div>

      {/* ---------- Okunabilirlik katmanları ---------- */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_42%_at_50%_48%,rgba(3,6,15,0.78),rgba(3,6,15,0.3)_60%,transparent_80%)] lg:hidden" />
      <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(3,6,15,0.9)_0%,rgba(3,6,15,0.55)_38%,transparent_58%)] lg:block" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.7)_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />

      {/* ---------- Üst bar ---------- */}
      <motion.header
        style={{ x: chromeX, y: chromeY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.1 }}
        className="relative z-20 flex items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8 lg:px-16 xl:px-24"
      >
        <Logo label={c.home} className="w-[160px] drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] sm:w-[250px]" />
        <div className="flex items-center gap-2.5 sm:gap-3">
          <LangSwitch lang={lang} onChange={changeLang} label={c.langLabel} />
          <a
            href={`mailto:${EMAIL}`}
            aria-label={c.mailLabel}
            className="group grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md transition-all duration-500 hover:border-orange-400/40 hover:bg-white/[0.08] hover:shadow-[0_0_24px_rgba(241,90,36,0.4)]"
          >
            <Mail className="h-[18px] w-[18px] text-slate-300 transition-colors duration-500 group-hover:text-orange-300" strokeWidth={1.5} />
          </a>
        </div>
      </motion.header>

      {/* ---------- Hero ---------- */}
      <motion.section
        style={{ x: textX, y: textY }}
        className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center lg:max-w-[58%] lg:items-start lg:px-16 lg:text-left xl:px-24"
      >
        <motion.div
          initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, delay: 0.45, ease: EASE }}
          className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.035] px-5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#F15A24] shadow-[0_0_10px_2px_rgba(241,90,36,0.75)] [animation:mf-pulse_2.4s_ease-in-out_infinite]" />
          <span className="text-[10px] font-medium uppercase tracking-[0.38em] text-sky-100/80 sm:text-[11px]">
            <Swap k={lang}>{c.eyebrow}</Swap>
          </span>
        </motion.div>

        <h1
          key={lang}
          className="font-display text-[clamp(2.5rem,5.4vw,5.8rem)] font-medium leading-[1] tracking-[-0.01em]"
          style={{ filter: "drop-shadow(0 0 28px rgba(186,214,255,0.16)) drop-shadow(0 2px 2px rgba(0,0,0,0.6))" }}
        >
          <span className="block">
            <Line words={c.line1} start={0} base={wordBase} tone="platinum" />
          </span>
          <span className="block italic" style={{ filter: "drop-shadow(0 0 30px rgba(241,90,36,0.3))" }}>
            <Line words={c.line2} start={c.line1.length} base={wordBase} tone="copper" />
          </span>
        </h1>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 1.5, ease: EASE }}
          className="mt-8 h-px w-40 origin-center bg-[linear-gradient(90deg,transparent,rgba(241,90,36,0.85),rgba(125,211,252,0.8),transparent)] lg:origin-left lg:bg-[linear-gradient(90deg,rgba(241,90,36,0.85),rgba(125,211,252,0.8),transparent)]"
        />

        <motion.p
          initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2, delay: 1.7, ease: EASE }}
          className="mt-7 max-w-lg text-[15px] font-light leading-relaxed text-slate-400 sm:text-base"
        >
          <Swap k={lang}>{c.lede}</Swap>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 2.0, ease: EASE }}
          className="mt-10"
        >
          <a
            href={`mailto:${EMAIL}`}
            className="group relative inline-flex overflow-hidden rounded-full p-px transition-shadow duration-700 hover:shadow-[0_0_48px_-4px_rgba(241,90,36,0.6)]"
          >
            <span className="absolute inset-[-120%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_250deg,#F15A24_300deg,#7dd3fc_340deg,transparent_360deg)] [animation:mf-spin_4.5s_linear_infinite] group-hover:[animation-duration:2s]" />
            <span className="absolute inset-0 rounded-full border border-white/10" />
            <span className="relative inline-flex items-center gap-3 rounded-full bg-[#060b18]/90 px-8 py-4 backdrop-blur-xl transition-colors duration-500 group-hover:bg-[#0a1226]/80">
              <span className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <Mail className="h-4 w-4 text-orange-300/90" strokeWidth={1.6} />
              <span className="text-[13px] font-medium uppercase tracking-[0.28em] text-slate-100"><Swap k={lang}>{c.cta}</Swap></span>
              <ArrowUpRight
                className="h-4 w-4 text-sky-200/80 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.6}
              />
            </span>
          </a>
        </motion.div>
      </motion.section>

      {/* ---------- Harita lejantı (masaüstü) ---------- */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 2.6, ease: EASE }}
        className="absolute bottom-24 right-16 z-20 hidden flex-col gap-2.5 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-[11px] tracking-[0.12em] text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl lg:flex xl:right-24"
      >
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-[#F15A24] shadow-[0_0_8px_rgba(241,90,36,0.9)]" />
          <Swap k={lang}>{c.legendOrigin}</Swap>
        </div>
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-sky-100 shadow-[0_0_8px_rgba(186,230,253,0.9)]" />
          <Swap k={lang}>{c.legendDest(DESTINATIONS.length)}</Swap>
        </div>
      </motion.div>

      {/* ---------- Alt bar ---------- */}
      <motion.footer
        style={{ x: chromeX, y: chromeY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 2.3 }}
        className="relative z-20 flex items-end justify-between gap-6 px-6 pb-6 text-[10px] uppercase tracking-[0.32em] text-slate-500 sm:px-10 sm:pb-8 lg:px-16 xl:px-24"
      >
        <span className="hidden sm:block"><Swap k={lang}>{c.services}</Swap></span>
        <span className="font-mono tracking-[0.2em] text-slate-500/80"><Swap k={lang}>{c.route}</Swap></span>
        <span className="hidden sm:block">© {new Date().getFullYear()} Mondial Foreign Trade</span>
      </motion.footer>
    </main>
  );
}
