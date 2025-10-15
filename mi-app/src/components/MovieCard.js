import React from "react";
import "./MovieCard.css";

export default function MovieCard({ item }) {
  if (!item) return null;
  const { id, title, year, rating, tags = [], poster } = item;

  const onImgError = (e) => {
    e.currentTarget.src =
      "data:image/svg+xml;utf8," +
      encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='225'>
           <rect width='100%' height='100%' fill='#1b1b1f'/>
           <text x='50%' y='50%' fill='#9aa0a6' font-size='18' text-anchor='middle' font-family='sans-serif'>
             Sin imagen
           </text>
         </svg>`
      );
  };

  return (
    <article
      id={`movie-${id}`}
      className="card"
      tabIndex={0}
      aria-label={`${title}${year ? ", " + year : ""}. Calificación ${Number(rating || 0).toFixed(1)} de 10.`}
    >
      <div className="card-media">
        <img
          className="card-image"
          src={poster}
          alt={`Póster de ${title}`}
          loading="lazy"
          onError={onImgError}
        />
        <div className="card-overlay" aria-hidden="true">
          <div className="card-meta">
            <h3 className="card-title">{title}</h3>
            <p className="card-sub">
              {year ? `${year} • ` : ""}⭐ {Number(rating || 0).toFixed(1)}
            </p>
            <div className="card-tags">
              {tags.slice(0, 3).map((t) => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
