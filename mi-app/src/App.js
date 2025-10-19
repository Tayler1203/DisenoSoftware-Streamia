import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import HeroCarousel from "./components/HeroCarousel";
import ContentGrid from "./components/ContentGrid";
import Footer from "./components/Footer";
import ParticleBackground from "./components/ParticleBackground";
import CustomCursor from "./components/CustomCursor";
import ScreenReader from "./components/ScreenReader";
import { getCatalog } from "./lib/catalog";
import "./App.css";

function App() {
  const [featured, setFeatured] = useState([]);
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const [theaterModeActive, setTheaterModeActive] = useState(false);

  useEffect(() => {
    // Obtener películas destacadas para el carrusel hero
    getCatalog().then((cats) => {
      const allItems = [];
      cats.forEach((cat) => {
        if (cat.items) {
          allItems.push(...cat.items);
        }
      });
      
      // Seleccionar las mejor valoradas para el hero
      const topRated = allItems
        .filter((item) => item.rating >= 8.0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);
      
      setFeatured(topRated);
    });
  }, []);

  return (
    <div className="app-container">
      <ScreenReader enabled={screenReaderEnabled} />
      <CustomCursor />
      <ParticleBackground />
      <Navbar 
        screenReaderEnabled={screenReaderEnabled}
        onToggleScreenReader={() => setScreenReaderEnabled(!screenReaderEnabled)}
      />
      
      {/* Hero Carousel con recomendaciones destacadas */}
      {featured.length > 0 && !theaterModeActive && <HeroCarousel items={featured} />}
      
      <main className="main-content">
        <ContentGrid onTheaterModeChange={setTheaterModeActive} />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
