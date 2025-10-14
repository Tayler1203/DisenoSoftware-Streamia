import React from "react";
import "./ContentGrid.css";

const mockData = [
  { id: 1, title: "Breaking Stream", image: "https://via.placeholder.com/200x120" },
  { id: 2, title: "Stream Wars", image: "https://via.placeholder.com/200x120" },
  { id: 3, title: "The Streamer", image: "https://via.placeholder.com/200x120" },
  { id: 4, title: "Flow Things", image: "https://via.placeholder.com/200x120" },
];

function ContentGrid() {
  return (
    <div className="grid-container">
      {mockData.map((item) => (
        <div key={item.id} className="card">
          <img src={item.image} alt={item.title} className="card-image" />
          <h3 className="card-title">{item.title}</h3>
        </div>
      ))}
    </div>
  );
}

export default ContentGrid;
