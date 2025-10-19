import React, { useState, useEffect, useCallback } from "react";
import "./HeroCarousel.css";

export default function HeroCarousel({ items = [] }) {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prev = () => {
    setCurrent((c) => (c - 1 + items.length) % items.length);
  };

  const goTo = (index) => {
    setCurrent(index);
    setIsPlaying(false);
  };

  // Autoplay
  useEffect(() => {
    if (!isPlaying || items.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isPlaying, items.length, next]);

  if (!items.length) return null;

  const item = items[current];

  return (
    <section className="hero-carousel" aria-label="Recomendaciones destacadas">
      <div className="hero-slide">
        {/* Imagen de fondo */}
        <div className="hero-bg">
          <img 
            src={item.poster} 
            alt="" 
            className="hero-bg-img"
          />
          <div className="hero-overlay" />
        </div>

        {/* Contenido */}
        <div className="hero-content">
          <div className="hero-meta">
            <h1 className="hero-title">{item.title}</h1>
            <div className="hero-info">
              {item.year && <span className="hero-year">{item.year}</span>}
              {item.rating && (
                <span className="hero-rating">
                  ⭐ {Number(item.rating).toFixed(1)}
                </span>
              )}
            </div>
            {item.tags && item.tags.length > 0 && (
              <div className="hero-tags">
                {item.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="hero-tag">{tag}</span>
                ))}
              </div>
            )}
            <div className="hero-actions">
              <button className="hero-btn primary" aria-label={`Reproducir ${item.title}`}>
                ▶ Reproducir
              </button>
              <button className="hero-btn secondary" aria-label={`Más información sobre ${item.title}`}>
                ⓘ Más información
              </button>
            </div>
          </div>
        </div>

        {/* Controles de navegación */}
        {items.length > 1 && (
          <>
            <button 
              className="hero-nav left" 
              onClick={prev}
              aria-label="Anterior recomendación"
            >
              ‹
            </button>
            <button 
              className="hero-nav right" 
              onClick={next}
              aria-label="Siguiente recomendación"
            >
              ›
            </button>

            {/* Indicadores */}
            <div className="hero-indicators">
              {items.map((_, index) => (
                <button
                  key={index}
                  className={`hero-dot ${index === current ? "active" : ""}`}
                  onClick={() => goTo(index)}
                  aria-label={`Ir a recomendación ${index + 1}`}
                  aria-current={index === current}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
