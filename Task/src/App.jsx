import React, { useState, useRef } from "react";
import "./App.css";

const colorMeanings = {
  red: "High energy, passion, excitement, but also potential anger, danger or challenges.",
  yellow:
    "Happiness, optimism, and a bright, cheerful mood, but could also hint at analytical thinking or decision making ahead.",
  green:
    "Growth, fertility, health and renewal. It may point to a productive, revitalizing day.",
  blue: "Calm, serene, stable experience. Good for concentration and clarity.",
  purple:
    "Imagination, spirituality, or dealing with deep emotions and introspection.",
  brown:
    "Associated with the earth, nature, simplicity and wholesomeness. Grounded in routine or the fundamentals.",
  gray: "Neutrality, compromise and potentially dullness or depression. A day without excessive highs or lows emotionally.",
  black:
    "Sophistication, power, formality and even sadness or negativity. A serious or mysterious day ahead.",
  white:
    "Purity, innocence, cleanliness and simplicity. A fresh start or blank slate kind of day.",
};

const App = () => {
  const [spinResult, setSpinResult] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const wheelRef = useRef(null);
  const spinButtonRef = useRef(null);

  const spinWheel = () => {
    if (!spinning) {
      setSpinning(true);
      const randomRotation = Math.floor(Math.random() * 360) + 3600;
      const currentRotation = wheelRef.current
        ? +wheelRef.current.style.transform
            .replace("rotate(", "")
            .replace("deg)", "")
        : 0;
      const totalRotation = currentRotation + randomRotation;
      wheelRef.current.style.transition =
        "transform 6s cubic-bezier(0.25, 0.1, 0.25, 1)";
      wheelRef.current.style.transform = `rotate(${totalRotation}deg)`;

      setTimeout(() => {
        const wheelRect = wheelRef.current.getBoundingClientRect();
        const sectors = wheelRef.current.querySelectorAll(".sector");
        let rightmostSector = null;
        let maxX = -Infinity;

        sectors.forEach((sector) => {
          const sectorRect = sector.getBoundingClientRect();
          if (sectorRect.right > maxX) {
            maxX = sectorRect.right;
            rightmostSector = sector;
          }
        });

        const color = rightmostSector.dataset.color;
        setSelectedColor(color);
        setSpinResult(colorMeanings[color]);
        setSpinning(false);
        wheelRef.current.style.transition = "none";
        const finalRotation = totalRotation % 360;
        wheelRef.current.style.transform = `rotate(${finalRotation}deg)`;
      }, 6000);
    }
  };

  const colors = Object.keys(colorMeanings);
  const angleIncrement = 360 / colors.length;

  return (
    <div className="App">
      <h1>Spin the Wheel</h1>
      <div className={`wheel ${spinning ? "spinning" : ""}`} ref={wheelRef}>
        {colors.map((color, index) => (
          <div
            key={index}
            className="sector"
            style={{
              backgroundColor: color,
              transform: `rotate(${index * angleIncrement}deg)`,
            }}
            data-color={color}
          ></div>
        ))}
        <div ref={spinButtonRef} className="pointer"></div>
      </div>
      <button onClick={spinWheel} disabled={spinning}>
        {spinning ? "Spinning..." : "Spin"}
      </button>
      {spinResult && (
        <div className="result">
          <h2>Selected Color:</h2>
          <p>{selectedColor}</p>
          <h2>Meaning:</h2>
          <p>{spinResult}</p>
        </div>
      )}
    </div>
  );
};

export default App;
