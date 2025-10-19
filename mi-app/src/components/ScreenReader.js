import { useEffect, useRef } from 'react';

export default function ScreenReader({ enabled }) {
  const speechSynthRef = useRef(null);
  const lastSpokenTextRef = useRef('');
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      console.warn('La síntesis de voz no está disponible en este navegador');
      return;
    }

    speechSynthRef.current = window.speechSynthesis;

    if (!enabled) {
      // Cancelar cualquier lectura en curso
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }
      return;
    }

    const speak = (text) => {
      if (!text || text === lastSpokenTextRef.current) return;
      
      // Cancelar lectura anterior
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }

      lastSpokenTextRef.current = text;
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      utteranceRef.current = utterance;
      speechSynthRef.current.speak(utterance);
    };

    // Evento para elementos interactivos
    const handleFocus = (e) => {
      const element = e.target;
      if (!element) return;
      
      let textToSpeak = '';

      // Botones
      if (element.tagName === 'BUTTON') {
        textToSpeak = element.textContent || element.getAttribute('aria-label') || 'Botón';
      }
      // Enlaces
      else if (element.tagName === 'A') {
        textToSpeak = element.textContent || element.getAttribute('aria-label') || 'Enlace';
      }
      // Inputs
      else if (element.tagName === 'INPUT') {
        const label = element.getAttribute('placeholder') || element.getAttribute('aria-label') || 'Campo de texto';
        textToSpeak = label;
      }
      // Movie cards
      else if (element.classList && element.classList.contains('movie-card')) {
        const title = element.querySelector('.movie-card-title')?.textContent || '';
        const rating = element.querySelector('.rating-value')?.textContent || '';
        textToSpeak = `${title}. Valoración ${rating}`;
      }
      // Avatar/Profile
      else if (element.classList && element.classList.contains('avatar-button')) {
        textToSpeak = 'Menú de perfil';
      }
      // Elementos con aria-label
      else if (element.getAttribute('aria-label')) {
        textToSpeak = element.getAttribute('aria-label');
      }
      // Títulos
      else if (element.tagName && element.tagName.match(/^H[1-6]$/)) {
        textToSpeak = element.textContent;
      }

      if (textToSpeak) {
        speak(textToSpeak);
      }
    };

    const handleMouseEnter = (e) => {
      const element = e.target;
      if (!element) return;
      
      let textToSpeak = '';

      // Solo para ciertos elementos al hacer hover
      if (element.classList && element.classList.contains('movie-card')) {
        const title = element.querySelector('.movie-card-title')?.textContent || '';
        const rating = element.querySelector('.rating-value')?.textContent || '';
        textToSpeak = `${title}. Valoración ${rating}`;
      }
      else if (element.classList && element.classList.contains('nav-link')) {
        textToSpeak = element.textContent;
      }
      else if (element.classList && element.classList.contains('profile-item')) {
        textToSpeak = element.textContent;
      }

      if (textToSpeak) {
        speak(textToSpeak);
      }
    };

    // Agregar listeners
    document.addEventListener('focus', handleFocus, true);
    document.addEventListener('mouseenter', handleMouseEnter, true);

    // Anunciar activación
    speak('Lector de pantalla activado. Navega con el teclado o el mouse para escuchar el contenido.');

    return () => {
      document.removeEventListener('focus', handleFocus, true);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }
    };
  }, [enabled]);

  // Atajos de teclado
  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (e) => {
      // Ctrl + Shift + S para detener la lectura
      if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        if (speechSynthRef.current) {
          speechSynthRef.current.cancel();
        }
      }
      // Ctrl + Shift + R para repetir última lectura
      else if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        if (lastSpokenTextRef.current && speechSynthRef.current) {
          const utterance = new SpeechSynthesisUtterance(lastSpokenTextRef.current);
          utterance.lang = 'es-ES';
          speechSynthRef.current.speak(utterance);
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [enabled]);

  return null; // Este componente no renderiza nada visible
}
