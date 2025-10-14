import React from "react";
import Navbar from "./components/Navbar";
import ContentGrid from "./components/ContentGrid";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <h1 className="title">Bienvenido a Streamia 🎬</h1>
        <p className="subtitle">Disfruta de tus películas y series favoritas en un solo lugar.</p>
        <ContentGrid />
      </main>
      <Footer />
    </div>
  );
}

export default App;
