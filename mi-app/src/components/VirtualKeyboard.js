import React, { useRef } from "react";
import "./VirtualKeyboard.css";

const ROWS = [
  ["1","2","3","4","5","6","7","8","9","0"],
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L","Ñ"],
  ["Z","X","C","V","B","N","M"]
];

export default function VirtualKeyboard({ value, onChange, onEnter, onClose }) {
  const wrapRef = useRef(null);

  const press = (ch) => onChange?.(value + ch);
  const backspace = () => onChange?.(value.slice(0, -1));
  const clear = () => onChange?.("");
  const space = () => onChange?.(value + " ");

  const countCols = (rowIdx) => {
    return wrapRef.current
      ? wrapRef.current.querySelectorAll(`.vk-key[data-row="${rowIdx}"]`).length
      : 0;
  };

  const focusAt = (rowIdx, colIdx) => {
    if (!wrapRef.current) return;
    const target = wrapRef.current.querySelector(
      `.vk-key[data-row="${rowIdx}"][data-col="${colIdx}"]`
    );
    target?.focus();
  };

  const onKeyDownKey = (e) => {
    const k = e.key;
    const btn = e.currentTarget;
    const row = Number(btn.dataset.row);
    const col = Number(btn.dataset.col);

    if (k === "Enter" || k === " ") {
      btn.classList.add("pressed");
      return;
    }

    if (k === "ArrowLeft" || k === "ArrowRight" || k === "ArrowUp" || k === "ArrowDown" || k === "Home" || k === "End") {
      e.preventDefault();

      if (k === "Home") { focusAt(row, 0); return; }
      if (k === "End")  { focusAt(row, Math.max(0, countCols(row) - 1)); return; }

      let newRow = row;
      let newCol = col;

      if (k === "ArrowLeft")  newCol = Math.max(0, col - 1);
      if (k === "ArrowRight") newCol = Math.min(col + 1, Math.max(0, countCols(row) - 1));

      if (k === "ArrowUp") {
        newRow = Math.max(0, row - 1);
        newCol = Math.min(col, Math.max(0, countCols(newRow) - 1));
      }
      if (k === "ArrowDown") {
        const lastRow = 5;
        newRow = Math.min(lastRow, row + 1);
        newCol = Math.min(col, Math.max(0, countCols(newRow) - 1));
      }

      focusAt(newRow, newCol);
    }
  };

  const onKeyUpKey = (e) => {
    const k = e.key;
    if (k === "Enter" || k === " ") {
      e.currentTarget.classList.remove("pressed");
    }
  };

  return (
    <div className="vk" role="group" aria-label="Teclado virtual de búsqueda">
      <div className="vk-rows" ref={wrapRef}>
        {ROWS.map((row, rIdx) => (
          <div className="vk-row" key={rIdx}>
            {row.map((k, cIdx) => (
              <button
                key={k}
                type="button"
                className="vk-key"
                data-row={rIdx}
                data-col={cIdx}
                onClick={() => press(k.toLowerCase())}
                onKeyDown={onKeyDownKey}
                onKeyUp={onKeyUpKey}
                aria-label={`Insertar ${k}`}
              >
                {k}
              </button>
            ))}
          </div>
        ))}

        <div className="vk-row">
          <button
            type="button"
            className="vk-key wide"
            data-row={4}
            data-col={0}
            onClick={space}
            onKeyDown={onKeyDownKey}
            onKeyUp={onKeyUpKey}
            aria-label="Espacio"
          >
            Espacio
          </button>
        </div>

        <div className="vk-row vk-actions">
          <button
            type="button"
            className="vk-key action"
            data-row={5}
            data-col={0}
            onClick={clear}
            onKeyDown={onKeyDownKey}
            onKeyUp={onKeyUpKey}
            aria-label="Limpiar"
          >
            Limpiar
          </button>
          <button
            type="button"
            className="vk-key action"
            data-row={5}
            data-col={1}
            onClick={backspace}
            onKeyDown={onKeyDownKey}
            onKeyUp={onKeyUpKey}
            aria-label="Borrar"
          >
            Borrar
          </button>
          <button
            type="button"
            className="vk-key action primary"
            data-row={5}
            data-col={2}
            onClick={onEnter}
            onKeyDown={onKeyDownKey}
            onKeyUp={onKeyUpKey}
            aria-label="Buscar"
          >
            Buscar
          </button>
          <button
            type="button"
            className="vk-key action"
            data-row={5}
            data-col={3}
            onClick={onClose}
            onKeyDown={onKeyDownKey}
            onKeyUp={onKeyUpKey}
            aria-label="Cerrar"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
