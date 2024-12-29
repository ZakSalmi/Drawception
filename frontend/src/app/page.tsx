"use client";

import { useState, MouseEvent } from 'react';

const GRID_SIZE = 32;
const SHADE_DECREMENT = 50;

export default function Home() {
  const [isDrawing, setIsDrawing] = useState(false);

  const handleMouseDown = () => setIsDrawing(true);
  const handleMouseUp = () => setIsDrawing(false);

  const handleMouseOver = (e: MouseEvent<HTMLDivElement>) => {
    if (isDrawing) {
      const colorCell = (cell: HTMLElement | null) => {
        if (cell) {
          let currentColor = cell.style.backgroundColor;
          let shade = 255;

          if (currentColor) {
            const rgbValues = currentColor.match(/\d+/g);
            if (rgbValues) {
              shade = Math.max(0, parseInt(rgbValues[0]) - SHADE_DECREMENT); // Decrease the shade by 50
            }
          }

          cell.style.backgroundColor = `rgb(${shade}, ${shade}, ${shade})`;
        }
      };

      const target = e.target as HTMLElement;
      colorCell(target);

      // Get the adjacent cells
      const index = Array.prototype.indexOf.call(target.parentNode?.children, target);
      const row = Math.floor(index / GRID_SIZE);
      const col = index % GRID_SIZE;

      const adjacentIndices = [
        index - 1, // left
        index + 1, // right
        index - GRID_SIZE, // top
        index + GRID_SIZE, // bottom
      ];

      adjacentIndices.forEach((adjIndex) => {
        if (adjIndex >= 0 && adjIndex < GRID_SIZE * GRID_SIZE) {
          const adjRow = Math.floor(adjIndex / GRID_SIZE);
          const adjCol = adjIndex % GRID_SIZE;
          if (Math.abs(adjRow - row) <= 1 && Math.abs(adjCol - col) <= 1) {
            const parentNode = target.parentNode;
            if (parentNode) {
              colorCell(parentNode.children[adjIndex] as HTMLElement);
            }
          }
        }
      });
    }
  };

  const handleReset = () => {
    const cells = document.querySelectorAll('.grid-cell');
    cells.forEach(cell => {
      (cell as HTMLElement).style.backgroundColor = 'rgb(255, 255, 255)';
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <main>
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(32, 1fr)', gridTemplateRows: 'repeat(32, 1fr)', gap: '1px' }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {Array.from({ length: 32 * 32 }).map((_, index) => (
            <div
              key={index}
              className="grid-cell"
              style={{ width: '20px', height: '20px', border: '1px solid black', backgroundColor: 'rgb(255, 255, 255)' }}
              onMouseOver={handleMouseOver}
            ></div>
          ))}
        </div>
      </main>
      <button onClick={handleReset} style={{ marginTop: '20px', padding: '10px 20px', border: '1px solid black', background: 'none', cursor: 'pointer' }}>Reset Grid</button>
      <footer>
      </footer>
    </div>
  );
}