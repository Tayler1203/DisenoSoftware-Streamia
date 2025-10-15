import React from "react";
import "./VirtualKeyboard.css";

const ROWS = [
  ["1","2","3","4","5","6","7","8","9","0"],
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L","Ñ"],
  ["Z","X","C","V","B","N","M"]
];

export default function VirtualKeyboard({ value, onChange, onEnter, onClose }) {
  const press = (ch) => onChange?.(value + ch);
  const backspace = () => onChange?.(value.slice(0, -1));
  const clear = () => onChange?.("");
  const space = () => onChange?.(value + " ");

  return (
    <div className="vk" role="group" aria-label="Teclado virtual de búsqueda">
      <div className="vk-rows">
        {ROWS.map((row, idx) => (
          <div className="vk-row" key={idx}>
            {row.map((k) => (
              <button
                key={k}
                className="vk-key"
                onClick={() => press(k.toLowerCase())}
                aria-label={`Insertar ${k}`}
              >
                {k}
              </button>
            ))}
          </div>
        ))}

        <div className="vk-row">
          <button className="vk-key wide" onClick={space} aria-label="Espacio">Espacio</button>
        </div>

        <div className="vk-row vk-actions">
          <button className="vk-key action" onClick={clear} aria-label="Limpiar">Limpiar</button>
          <button className="vk-key action" onClick={backspace} aria-label="Borrar">Borrar</button>
          <button className="vk-key action primary" onClick={onEnter} aria-label="Buscar">Buscar</button>
          <button className="vk-key action" onClick={onClose} aria-label="Cerrar">Cerrar</button>
        </div>
      </div>
    </div>
  );
}
