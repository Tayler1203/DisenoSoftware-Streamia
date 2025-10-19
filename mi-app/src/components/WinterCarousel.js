import React, { useRef, useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import "./WinterCarousel.css";

export default function WinterCarousel({ title, items, onTheaterClick }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      checkScroll();
      return () => el.removeEventListener("scroll", checkScroll);
    }
  }, [items]);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const distance = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === "left" ? -distance : distance, behavior: "smooth" });
  };

  // Generar copos de nieve
  const snowflakes = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
    size: 2 + Math.random() * 4,
    opacity: 0.3 + Math.random() * 0.7,
  }));

  return (
    <section className="winter-carousel" aria-label={title}>
      {/* Efecto de nieve cayendo */}
      <div className="snowfall" aria-hidden="true">
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="snowflake"
            style={{
              left: `${flake.left}%`,
              animationDelay: `${flake.delay}s`,
              animationDuration: `${flake.duration}s`,
              width: `${flake.size}px`,
              height: `${flake.size}px`,
              opacity: flake.opacity,
            }}
          />
        ))}
      </div>

      {/* Decoraciones navideñas */}
      <div className="winter-decorations" aria-hidden="true">
        <div className="decoration left-top">❄️</div>
        <div className="decoration right-top">⛄</div>
        <div className="decoration left-bottom">🎄</div>
        <div className="decoration right-bottom">🎅</div>
      </div>

      {/* Título con efecto frost */}
      <div className="winter-header">
        <h2 className="winter-title">
          <span className="title-icon">❄️</span>
          {title}
          <span className="title-icon">❄️</span>
        </h2>
        <div className="winter-subtitle">Contenido especial de temporada</div>
      </div>

      {/* Contenedor con efecto de escarcha */}
      <div className="winter-carousel-wrap">
        <div className="frost-overlay" aria-hidden="true" />
        
        {canScrollLeft && (
          <button
            className="winter-arrow left"
            onClick={() => scroll("left")}
            aria-label="Ver películas anteriores"
          >
            ❮
          </button>
        )}
        
        {canScrollRight && (
          <button
            className="winter-arrow right"
            onClick={() => scroll("right")}
            aria-label="Ver más películas"
          >
            ❯
          </button>
        )}

        <div className="winter-scroller" ref={scrollRef}>
          {items.map((item) => (
            <div key={item.id} className="winter-item">
              <MovieCard item={item} onTheaterClick={onTheaterClick} />
            </div>
          ))}
        </div>
      </div>

      {/* Luces navideñas animadas */}
      <div className="christmas-lights" aria-hidden="true">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className={`light light-${(i % 4) + 1}`}
            style={{
              left: `${(i * 5) + 2}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </section>
  );
}
