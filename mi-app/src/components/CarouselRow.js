// src/components/CarouselRow.js
import React, { useRef } from "react";
import MovieCard from "./MovieCard";
import "./CarouselRow.css";

export default function CarouselRow({ title, items = [], onTheaterClick }) {
  const scrollerRef = useRef(null);
  const scrollBy = (d) => scrollerRef.current?.scrollBy({ left: d, behavior: "smooth" });
  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") scrollBy(320);
    if (e.key === "ArrowLeft")  scrollBy(-320);
  };

  return (
    <section className="row" aria-label={`Carrusel: ${title}`}>
      <h2 className="row-title">{title}</h2>

      <div className="row-wrap">
        <button className="arrow left"  aria-label={`Desplazar ${title} a la izquierda`} onClick={() => scrollBy(-380)}>‹</button>

        <div
          className="row-scroller"
          ref={scrollerRef}
          role="list"
          tabIndex={0}
          onKeyDown={onKeyDown}
          aria-roledescription="lista desplazable de tarjetas"
        >
          {items.map((it) => (
            <div key={it.id} role="listitem" className="row-item">
              <MovieCard item={it} onTheaterClick={onTheaterClick} />
            </div>
          ))}
        </div>

        <button className="arrow right" aria-label={`Desplazar ${title} a la derecha`} onClick={() => scrollBy(380)}>›</button>
      </div>
    </section>
  );
}
