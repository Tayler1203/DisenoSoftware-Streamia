// src/lib/catalog.js
const API = "https://api.themoviedb.org/3";
const KEY = process.env.REACT_APP_TMDB_KEY;

function imgUrl(path, size = "w780") {
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

async function fetchList(endpoint) {
  const url = `${API}${endpoint}?api_key=${KEY}&language=es-ES&page=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  const data = await res.json();
  return (data.results || [])
    .map((m) => {
      const img = m.backdrop_path || m.poster_path;
      if (!img) return null;
      return {
        id: String(m.id),
        title: m.title || m.name || "Sin título",
        year: (m.release_date || m.first_air_date || "").slice(0, 4),
        rating: Number(m.vote_average || 0),
        tags: [],
        poster: imgUrl(img, "w780"),
      };
    })
    .filter(Boolean)
    .slice(0, 12);
}

export async function getCatalog() {
  const cats = [
    { id: "popular", title: "Populares", endpoint: "/movie/popular" },
    { id: "top", title: "Más valoradas", endpoint: "/movie/top_rated" },
    { id: "now", title: "En cartelera", endpoint: "/movie/now_playing" },
  ];

  const out = [];
  for (const c of cats) {
    try {
      const items = await fetchList(c.endpoint);
      out.push({ ...c, items });
    } catch (e) {
      console.error("TMDB error:", e);
    }
  }

  if (out.length) return out;

  try {
    const mod = await import("../data/movies.js");
    return mod.categories || mod.default || [];
  } catch {
    return [];
  }
}
