import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Navbar.css";
import { getCatalog } from "../lib/catalog";
import VirtualKeyboard from "./VirtualKeyboard";
import VoicePanel from "./VoicePanel";

export default function Navbar({ screenReaderEnabled, onToggleScreenReader }) {
  const [query, setQuery] = useState("");
  const [openPanel, setOpenPanel] = useState(false);  
  const [kbOpen, setKbOpen] = useState(false);        
  const [list, setList] = useState([]);
  const inputRef = useRef(null);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [voiceStopTick, setVoiceStopTick] = useState(0);
  const stopAllVoice = () => setVoiceStopTick(t => t + 1);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);


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

// Dentro de VirtualKeyboard.js (useEffect si es React) — versión genérica
  useEffect(() => {
    const root = document.querySelector('.vk');  // el contenedor del teclado
    if (!root) return;

    const onKeyDown = (e) => {
      const keyEl = e.target.closest('.vk-key');
      if (!keyEl) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();               // evita scroll con espacio
        keyEl.classList.add('pressed');   // efecto visual
        keyEl.click();                    // dispara la acción existente
      }
    };

    const onKeyUp = (e) => {
      const keyEl = e.target.closest('.vk-key');
      if (!keyEl) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        keyEl.classList.remove('pressed');
      }
    };

    const onBlur = (e) => {
      e.target.classList?.remove('pressed');
    };

    root.addEventListener('keydown', onKeyDown);
    root.addEventListener('keyup', onKeyUp);
    root.addEventListener('blur', onBlur, true);

    return () => {
      root.removeEventListener('keydown', onKeyDown);
      root.removeEventListener('keyup', onKeyUp);
      root.removeEventListener('blur', onBlur, true);
    };
  }, []);


  const scrollToItem = (id) => {
    const el = document.getElementById(`movie-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    setOpenPanel(false);
    closeKB();
  };

  // Cerrar menú de perfil al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    
    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [profileOpen]);

  const menuItems = ["Inicio", "Series", "Películas", "Mi lista"];

  return (
    <>
       <nav className={`navbar ${(kbOpen || voiceOpen) ? "search-active" : ""}`} role="navigation" aria-label="Barra principal">
        <div className="nav-inner">
           <div className={`brand ${(kbOpen || voiceOpen) ? "hide-when-search" : ""}`} aria-label="Streamia inicio">
            <div className={`brand ${kbOpen ? "hide-when-search" : ""}`} aria-label="Streamia inicio"></div>
            <span className="brand-emoji" aria-hidden="true">🎬</span> Streamia
            {screenReaderEnabled && (
              <span className="screen-reader-badge" title="Lector de pantalla activado">
                🔊
              </span>
            )}
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

            <div className="profile-container" ref={profileRef}>
              <button 
                className="avatar-button" 
                onClick={() => setProfileOpen(!profileOpen)}
                aria-label="Menú de perfil"
              >
                <img 
                  className="avatar" 
                  src="https://i.pravatar.cc/40?img=5" 
                  alt="Perfil" 
                  width="36" 
                  height="36" 
                />
                <span className={`avatar-arrow ${profileOpen ? 'open' : ''}`}>▼</span>
              </button>

              {profileOpen && (
                <div className="profile-menu">
                  <div className="profile-header">
                    <img 
                      className="profile-avatar-large" 
                      src="https://i.pravatar.cc/80?img=5" 
                      alt="Perfil" 
                    />
                    <div className="profile-info">
                      <h4 className="profile-name">Usuario Premium</h4>
                      <p className="profile-email">usuario@streamia.com</p>
                    </div>
                  </div>

                  <div className="profile-divider"></div>

                  <nav className="profile-nav">
                    <button className="profile-item">
                      <span className="profile-icon">👤</span>
                      <span>Mi Perfil</span>
                    </button>
                    <button className="profile-item">
                      <span className="profile-icon">⚙️</span>
                      <span>Configuración</span>
                    </button>
                    <button className="profile-item">
                      <span className="profile-icon">💳</span>
                      <span>Suscripción</span>
                    </button>
                    <button className="profile-item">
                      <span className="profile-icon">❤️</span>
                      <span>Mi Lista</span>
                    </button>
                    <button className="profile-item">
                      <span className="profile-icon">📊</span>
                      <span>Historial</span>
                    </button>
                    
                    <div className="profile-divider"></div>
                    
                    <button 
                      className={`profile-item accessibility ${screenReaderEnabled ? 'active' : ''}`}
                      onClick={onToggleScreenReader}
                      aria-label={screenReaderEnabled ? 'Desactivar lector de pantalla' : 'Activar lector de pantalla'}
                    >
                      <span className="profile-icon">🔊</span>
                      <span className="accessibility-label">
                        Lector de Pantalla
                        <span className="accessibility-status">
                          {screenReaderEnabled ? 'Activado' : 'Desactivado'}
                        </span>
                      </span>
                      <span className={`toggle-indicator ${screenReaderEnabled ? 'on' : 'off'}`}>
                        {screenReaderEnabled ? '●' : '○'}
                      </span>
                    </button>
                  </nav>

                  <div className="profile-divider"></div>

                  <button className="profile-item logout">
                    <span className="profile-icon">🚪</span>
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>
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
