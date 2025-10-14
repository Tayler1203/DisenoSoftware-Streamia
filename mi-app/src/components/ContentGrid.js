import React from "react";
import "./ContentGrid.css";

const mockData = [
  { id: 1, title: "Breaking Stream"},
  { id: 2, title: "Stream Wars"},
  { id: 3, title: "The Streamer"},
  { id: 4, title: "Flow Things"},
];

function ContentGrid() {
  return (
    <div className="grid-container">
      {mockData.map((item) => (
        <div key={item.id} className="card">
          <h3 className="card-title">{item.title}</h3>
        </div>
      ))}
    </div>
  );
}

export default ContentGrid;
