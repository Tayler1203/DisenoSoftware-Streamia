import React, { useRef } from "react";
import "./MovieCard.css";

export default function MovieCard({ item, onTheaterClick }) {
  // Los hooks SIEMPRE deben estar al inicio
  const cardRef = useRef(null);
  
  // Validación después de los hooks
  if (!item) return null;
  const { id, title, year, rating, tags = [], poster } = item;

  // Generador de Lorem Ipsum
  const getLoremDescription = () => {
    const descriptions = [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam.",
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed quia consequuntur magni.",
      "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur adipisci velit sed quia non numquam.",
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti."
    ];
    // Usar el id para seleccionar una descripción consistente
    const index = parseInt(id?.replace(/\D/g, "") || "0") % descriptions.length;
    return descriptions[index];
  };

  // Efecto 3D Tilt
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10; // -10 a 10 grados
    const rotateY = ((x - centerX) / centerX) * 10;  // -10 a 10 grados
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

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
    <div
      ref={cardRef}
      className="movie-card"
      onClick={() => onTheaterClick && onTheaterClick(item)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: 'pointer' }}
    >
      <div className="movie-card-inner">
        <img src={poster} alt={title} className="movie-poster" onError={onImgError} />
        <div className="movie-overlay">
          <div className="movie-info">
            <h3 className="movie-title">{title}</h3>
            <div className="movie-meta">
              <span className="movie-year">{year}</span>
              {rating && <span className="movie-rating">⭐ {rating}</span>}
            </div>
            <p className="movie-description">{getLoremDescription()}</p>
            {tags.length > 0 && (
              <div className="movie-tags">
                {tags.slice(0, 3).map((tag, i) => (
                  <span key={i} className="movie-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
