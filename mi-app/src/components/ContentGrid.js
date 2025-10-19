// src/components/ContentGrid.js
import React, { useEffect, useState } from "react";
import CarouselRow from "./CarouselRow";
import WinterCarousel from "./WinterCarousel";
import TheaterMode from "./TheaterMode";
import "../ContentGrid.css";
import { getCatalog } from "../lib/catalog";

export default function ContentGrid({ onTheaterModeChange }) {
  const [cats, setCats] = useState(null); // null = cargando
  const [err, setErr]   = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Notificar cuando cambia el estado del theater mode
  useEffect(() => {
    if (onTheaterModeChange) {
      onTheaterModeChange(!!selectedMovie);
    }
  }, [selectedMovie, onTheaterModeChange]);
  
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const arr = await getCatalog();
        if (!alive) return;
        if (!arr || !arr.length) throw new Error("Catálogo vacío");
        setCats(arr);
      } catch {
        setErr("No se pudo cargar el catálogo.");
        setCats([]); // muestra mensaje y evita re-render raros
      }
    })();
    return () => { alive = false; };
  }, []);

  if (cats === null) {
    return (
      <div className="home">
        {[1,2,3].map((r) => (
          <section key={r} className="row">
            <h2 className="row-title skeleton-title">Cargando...</h2>
            <div className="row-wrap">
              <div className="row-scroller">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skeleton-card" aria-hidden="true" />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    );
  }

return (
    <div className="home">
      {err && <p style={{color:"#fca5a5", margin:"6px 8px"}}>{err}</p>}
      {cats.map((c) => {
        // Usar WinterCarousel para la categoría de invierno
        if (c.id === "winter") {
          return <WinterCarousel key={c.id} title={c.title} items={c.items || []} onTheaterClick={setSelectedMovie} />;
        }
        return <CarouselRow key={c.id} title={c.title} items={c.items || []} onTheaterClick={setSelectedMovie} />;
      })}
      
      {/* Theater Mode Modal */}
      {selectedMovie && (
        <TheaterMode 
          item={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}
    </div>
  );
}
