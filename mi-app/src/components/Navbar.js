import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Navbar.css";
import { getCatalog } from "../lib/catalog";
import VirtualKeyboard from "./VirtualKeyboard";
import VoicePanel from "./VoicePanel";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [openPanel, setOpenPanel] = useState(false);  
  const [kbOpen, setKbOpen] = useState(false);        
  const [list, setList] = useState([]);
  const inputRef = useRef(null);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [voiceStopTick, setVoiceStopTick] = useState(0);
  const stopAllVoice = () => setVoiceStopTick(t => t + 1);


  const handleSearch = () => {
    console.log("🔎 Buscar:", query);
    stopAllVoice();
  };

  useEffect(() => {
    let alive = true;
    getCatalog().then((cats) => {
      if (!alive) return;
      const out = [];
      cats.forEach(c => (c.items || []).forEach(it => out.push({ ...it, categoryId: c.id, category: c.title })));
      setList(out);
    });
    return () => { alive = false; };
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return list
      .filter(it =>
        it.title?.toLowerCase().includes(q) ||
        it.tags?.some?.((t) => t.toLowerCase().includes(q)) ||
        String(it.year || "").includes(q)
      )
      .slice(0, 8);
  }, [query, list]);

    const handleVoice = () => {
      setKbOpen(false);
      setVoiceOpen(true);
      document.body.style.overflow = "hidden";
    };

  const openKB = () => { setKbOpen(true); setOpenPanel(true); document.body.style.overflow = "hidden"; };
  const closeKB = () => { 
    setKbOpen(false); 
    setOpenPanel(false); 
    document.body.style.overflow = ""; 
    if (voiceOpen) stopAllVoice();
  };

  const closeVoice = () => {
    stopAllVoice();
    setVoiceOpen(false);
    openKB();
  };
  const finishVoice = (text) => {
    setVoiceOpen(false);
    setQuery(text || "");
    openKB();
    inputRef.current?.focus();
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") closeKB(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const scrollToItem = (id) => {
    const el = document.getElementById(`movie-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    setOpenPanel(false);
    closeKB();
  };

  const menuItems = ["Inicio", "Series", "Películas", "Mi lista"];

  return (
    <>
       <nav className={`navbar ${(kbOpen || voiceOpen) ? "search-active" : ""}`} role="navigation" aria-label="Barra principal">
        <div className="nav-inner">
           <div className={`brand ${(kbOpen || voiceOpen) ? "hide-when-search" : ""}`} aria-label="Streamia inicio">
            <div className={`brand ${kbOpen ? "hide-when-search" : ""}`} aria-label="Streamia inicio"></div>
            <span className="brand-emoji" aria-hidden="true">🎬</span> Streamia
          </div>

          <ul className="nav-menu" role="menubar" aria-label="Secciones">
            {menuItems.map(name => (
              <li key={name} role="none"><button role="menuitem" className="nav-link">{name}</button></li>
            ))}
          </ul>

          <div className={`nav-actions ${(kbOpen || voiceOpen) ? "hidden-when-search" : ""}`}>
            <div className={`nav-search ${kbOpen ? "expanded" : ""}`} role="search">
              <input
                ref={inputRef}
                type="search"
                className="search-input"
                placeholder="Buscar títulos, géneros o año…"
                value={query}
                onFocus={() => openKB()}
                autoComplete="off"
                spellCheck={false}
                inputMode="search"
                onChange={(e) => { setQuery(e.target.value); setOpenPanel(true); }}
                aria-label="Buscar contenido"
              />
              <button className="mic-btn" aria-label="Dictar búsqueda por voz" title="Dictado por voz" onClick={handleVoice}>🎤</button>

              {!kbOpen && openPanel && results.length > 0 && (
                <div id="search-panel" className="search-panel" role="listbox" aria-label="Resultados de búsqueda">
                  {results.map((r) => (
                    <button
                      key={r.id}
                      className="search-item"
                      role="option"
                      aria-selected="false"
                      onClick={() => scrollToItem(r.id)}
                    >
                      <img src={r.poster} alt="" />
                      <div className="si-meta">
                        <span className="si-title">{r.title}</span>
                        <span className="si-sub">{r.year} • {r.category}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <img className="avatar" src="https://i.pravatar.cc/40?img=5" alt="Perfil" width="36" height="36" />
          </div>

          {(kbOpen || voiceOpen) && (
            <div className="nav-search expanded takeover" role="search">
              <input
                ref={inputRef}
                autoFocus
                type="search"
                className="search-input"
                placeholder="Buscar títulos, géneros o año…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Buscar contenido"
                autoComplete="off"
                spellCheck={false}
                inputMode="search"
              />
              <button className="mic-btn" onClick={handleVoice}>🎤</button>
              {/* sin coincidencias en takeover */}
              {!kbOpen && openPanel && results.length > 0 && (
                <div
                  id="search-panel"
                  className="search-panel"
                  role="listbox"
                  aria-label="Resultados de búsqueda"
                >
                  {results.map((r) => (
                    <button
                      key={r.id}
                      className="search-item"
                      role="option"
                      aria-selected="false"
                      onClick={() => scrollToItem(r.id)}
                    >
                      <img src={r.poster} alt="" />
                      <div className="si-meta">
                        <span className="si-title">{r.title}</span>
                        <span className="si-sub">
                          {r.year} • {r.category}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {(kbOpen || voiceOpen) && <div className="search-dim" onClick={kbOpen ? closeKB : closeVoice} aria-hidden="true" />}

      {kbOpen && !voiceOpen && (
        <VirtualKeyboard
          value={query}
          onChange={setQuery}
          onEnter={() => { handleSearch(); stopAllVoice(); }}
          onClose={closeKB}
        />
      )}

      {voiceOpen && (
        <VoicePanel
          onPartial={(text) => setQuery(text)}
          onFinish={(text) => {
            setQuery((text || "").trim());
            handleSearch();
            stopAllVoice();
            setVoiceOpen(false);
            openKB();
            inputRef.current?.focus();
          }}
          onClose={() => {
            stopAllVoice();
            setVoiceOpen(false);
            openKB();            
          }}
          initialLang="auto"
          stopSignal={voiceStopTick}
        />
      )}
    </>
  );

}
