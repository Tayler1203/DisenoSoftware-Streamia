// src/components/ErrorScreen.js
import React from "react";
import "./ErrorScreen.css";

export default function ErrorScreen({ message, retry }) {
  return (
    <div className="error-screen">
      <div className="error-content">
        <h1 className="error-logo">Streamia</h1>
        <p className="error-msg">{message || "No se pudo cargar el catálogo."}</p>
        {retry && (
          <button className="retry-btn" onClick={retry}>
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
}
