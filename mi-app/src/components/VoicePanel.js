import React, { useEffect, useRef, useState } from "react";
import "./VoicePanel.css";

const hasSpeech = () => !!(window.SpeechRecognition || window.webkitSpeechRecognition);

export default function VoicePanel({ onClose, onFinish, onPartial, initialLang = "auto", stopSignal = 0 }) {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [lang, setLang] = useState(initialLang);

  const circleRef   = useRef(null);
  const rafRef      = useRef(0);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaRef    = useRef(null);
  const recogRef    = useRef(null);

  const canvasRef   = useRef(null);
  const wavesRef    = useRef([]); 
  const restartAllowedRef = useRef(true);

  const fitCanvas = () => {
    const c = canvasRef.current;
    if (!c) return;

    const wrap = c.parentElement;                 
    const dpr  = window.devicePixelRatio || 1;

    const apply = () => {
        const rect = wrap?.getBoundingClientRect?.();
        const wCss = Math.max(300, Math.floor((rect?.width  || 600)));
        const hCss = Math.max(50,  Math.floor((rect?.height || 70)));
        const w = Math.floor(wCss * dpr);
        const h = Math.floor(hCss * dpr);
        if (c.width !== w)  c.width  = w;
        if (c.height !== h) c.height = h;
    };

    requestAnimationFrame(apply);
    setTimeout(apply, 50);
    };



  const startMicViz = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRef.current = stream;

      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      const data = new Uint8Array(analyser.frequencyBinCount);

      const loop = () => {
        analyser.getByteTimeDomainData(data);

        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.min(1, Math.sqrt(sum / data.length) * 1.8);

        const scale = 1 + Math.min(0.35, rms * 0.9);
        if (circleRef.current) circleRef.current.style.transform = `scale(${scale})`;

        drawWaves(rms);

        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    } catch (e) {
      console.warn("getUserMedia error", e);
    }
  };

  const stopMicViz = () => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    try { audioCtxRef.current && audioCtxRef.current.close(); } catch {}
    audioCtxRef.current = null;
    try { mediaRef.current && mediaRef.current.getTracks().forEach(t => t.stop()); } catch {}
    mediaRef.current = null;
  };

    const drawWaves = (rms) => {
        const c = canvasRef.current;
        if (!c) return;
        if (!c.width || !c.height) { fitCanvas(); return; }

        const ctx = c.getContext("2d");
        const dpr = window.devicePixelRatio || 1;
        const W = c.width, H = c.height;
        const midX = Math.floor(W / 2), midY = Math.floor(H / 2);

        const base = rms > 0.02 ? 1 : 0;
        const extra = Math.floor(rms * 8);
        const spawn = Math.min(6, base + extra);

        for (let i = 0; i < spawn; i++) {
            const alpha = Math.max(0.18, Math.min(0.9, 0.25 + rms));
            const width = Math.max(2, Math.round(2 * dpr));
            wavesRef.current.push({ x: 0, life: 1, dir: -1, alpha, width });
            wavesRef.current.push({ x: 0, life: 1, dir: +1, alpha, width });
        }

        const speed = (10 + rms * 20) * dpr;
        const decay = 0.02;

        wavesRef.current.forEach(w => { w.x += speed; w.life -= decay; });
        wavesRef.current = wavesRef.current.filter(w => w.life > 0.06 && Math.abs(w.x) < W);

        ctx.clearRect(0, 0, W, H);
        ctx.globalCompositeOperation = "lighter";
        ctx.lineCap = "round";

        wavesRef.current.forEach(w => {
            const len = Math.min(W / 2 - 4 * dpr, w.x);
            const x1 = midX;
            const x2 = w.dir < 0 ? x1 - len : x1 + len;
            const a  = Math.max(0, Math.min(1, w.alpha * w.life));
            ctx.strokeStyle = `rgba(255,255,255,${a})`;
            ctx.lineWidth   = w.width;
            ctx.shadowBlur  = 8 * a;
            ctx.shadowColor = `rgba(255,255,255,${a * 0.8})`;

            ctx.beginPath();
            ctx.moveTo(x1, midY);
            ctx.lineTo(x2, midY);
            ctx.stroke();
        });

        ctx.shadowBlur = 0;
        ctx.globalCompositeOperation = "source-over";
    };

  const pickLang = () => {
    if (lang !== "auto") return lang;
    return navigator.language?.toLowerCase().startsWith("es") ? "es-ES" : "en-US";
  };

    const startRecognition = () => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) {
            console.warn("SpeechRecognition no soportado en este navegador.");
            return false;
        }

        try {
            const r = new SR();
            recogRef.current = r;

            r.lang = (lang !== "auto")
            ? lang
            : (navigator.language?.toLowerCase().startsWith("es") ? "es-ES" : "en-US");

            r.interimResults = true;
            r.continuous = true;
            r.maxAlternatives = 1;

            let finalText = "";
            let gotAnyResult = false;

            r.onstart = () => {
            setListening(true);
            gotAnyResult = false;
            restartAllowedRef.current = true;
            console.log("[Voice] recognition started; lang=", r.lang);
            };

            r.onresult = (evt) => {
            gotAnyResult = true;
            let interim = "";
            for (let i = evt.resultIndex; i < evt.results.length; i++) {
                const res = evt.results[i];
                if (res.isFinal) finalText += res[0].transcript + " ";
                else interim += res[0].transcript;
            }
            const full = (finalText + interim).trim();
            setTranscript(full);
            if (onPartial) onPartial(full);
            };

            r.onerror = (e) => {
            console.warn("[Voice] error:", e?.error || e);
            if (e?.error === "aborted") restartAllowedRef.current = false;
            };

            r.onend = () => {
            setListening(false);
            console.log("[Voice] recognition ended. gotAnyResult=", gotAnyResult);
            if (restartAllowedRef.current && recogRef.current === r) {
                setTimeout(() => {
                try { r.start(); } catch (err) { console.warn("[Voice] restart failed:", err); }
                }, 300);
            }
            };

            r.start();
            return true;
        } catch (e) {
            console.warn("SpeechRecognition error al inicializar:", e);
            return false;
        }
    };


  const stopRecognition = () => { try { recogRef.current && recogRef.current.stop(); } catch {} setListening(false); };

    useEffect(() => {
        requestAnimationFrame(() => fitCanvas());
        window.addEventListener("resize", fitCanvas);

        startMicViz();
        startRecognition();

        return () => {
            window.removeEventListener("resize", fitCanvas);
            restartAllowedRef.current = false;
            try { recogRef.current && recogRef.current.stop(); } catch {}
            stopMicViz();
        };
        }, [lang]);



    const closePanel = () => {
        restartAllowedRef.current = false;
        try { recogRef.current && recogRef.current.stop(); } catch {}
        stopMicViz();
        if (onClose) onClose();
    };

    const finishPanel = () => {
        restartAllowedRef.current = false;
        try { recogRef.current && recogRef.current.stop(); } catch {}
        stopMicViz();
        if (onFinish) onFinish(transcript.trim());
    };


  return (
    <div className="vp" role="dialog" aria-label="Dictado por voz">
      <div className="vp-inner">
        <div className="vp-mic-wrap">
          <div className={`vp-mic ${listening ? "on" : ""}`} ref={circleRef}>🎤</div>
        </div>

        <div className="vp-wavesWrap">
          <canvas ref={canvasRef} className="vp-wavesInline" aria-hidden="true" />
        </div>

        <span className="sr-only" aria-live="polite">
          {listening ? (pickLang() === "es-ES" ? "Escuchando..." : "Listening...") : "Listo"}
        </span>

        <div className="vp-lang">
          <button className={`vp-pill ${pickLang() === "es-ES" ? "active" : ""}`} onClick={() => setLang("es-ES")}>ES</button>
          <button className={`vp-pill ${pickLang() === "en-US" ? "active" : ""}`} onClick={() => setLang("en-US")}>EN</button>
          <button className={`vp-pill ${lang === "auto" ? "active" : ""}`} onClick={() => setLang("auto")}>Auto</button>
        </div>

        <div className="vp-actions">
          <button className="vp-btn ghost" onClick={closePanel}>Cerrar</button>
          <button className="vp-btn primary" onClick={finishPanel}>Terminar</button>
        </div>
      </div>
    </div>
  );
}
