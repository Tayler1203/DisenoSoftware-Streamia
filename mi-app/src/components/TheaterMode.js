import React, { useEffect, useRef } from 'react';
import './TheaterMode.css';

export default function TheaterMode({ item, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';

    // Cerrar con ESC
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Cerrar al hacer click en el backdrop
  const handleBackdropClick = (e) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  if (!item) return null;

  const { title, year, rating, tags = [], poster, description } = item;

  return (
    <div 
      className="theater-mode" 
      ref={modalRef}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Detalles de ${title}`}
    >
      {/* Backdrop oscuro con blur */}
      <div className="theater-backdrop" />

      {/* Contenido del modal */}
      <div className="theater-content">
        {/* Botón cerrar */}
        <button 
          className="theater-close"
          onClick={onClose}
          aria-label="Cerrar modo cine"
        >
          ✕
        </button>

        {/* Imagen principal */}
        <div className="theater-poster">
          <img 
            src={poster} 
            alt={title}
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml;utf8,' +
                encodeURIComponent(
                  `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='1200'>
                     <rect width='100%' height='100%' fill='%231b1b1f'/>
                     <text x='50%' y='50%' fill='%239aa0a6' font-size='24' text-anchor='middle' font-family='sans-serif'>
                       ${title}
                     </text>
                   </svg>`
                );
            }}
          />
          <div className="theater-poster-gradient" />
        </div>

        {/* Información detallada */}
        <div className="theater-info">
          <div className="theater-header">
            <h2 className="theater-title">{title}</h2>
            <div className="theater-meta">
              {year && <span className="theater-year">{year}</span>}
              <span className="theater-separator">•</span>
              <div className="theater-rating">
                <span className="rating-star">⭐</span>
                <span className="rating-number">{Number(rating || 0).toFixed(1)}</span>
                <span className="rating-max">/10</span>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="theater-description">
            <h3>Sinopsis</h3>
            <p>
              {description || 
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'}
            </p>
          </div>

          {/* Tags/Géneros */}
          {tags.length > 0 && (
            <div className="theater-genres">
              <h3>Géneros</h3>
              <div className="theater-tags">
                {tags.map((tag) => (
                  <span key={tag} className="theater-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="theater-actions">
            <button className="theater-btn theater-btn-play">
              <span className="btn-icon">▶</span>
              Reproducir
            </button>
            <button className="theater-btn theater-btn-secondary">
              <span className="btn-icon">+</span>
              Mi Lista
            </button>
            <button className="theater-btn theater-btn-secondary">
              <span className="btn-icon">ℹ</span>
              Más Info
            </button>
          </div>

          {/* Información adicional */}
          <div className="theater-details">
            <div className="detail-row">
              <span className="detail-label">Duración:</span>
              <span className="detail-value">2h 15min</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Idioma:</span>
              <span className="detail-value">Español, Inglés</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Clasificación:</span>
              <span className="detail-value">+16</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
