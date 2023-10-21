import React, { useState, useEffect } from 'react';

interface GridProps {
  rows: number;
  columns: number;
  howFast: number;
}

const Grid: React.FC<GridProps> = ({ rows, columns, howFast }) => {
  const [selectedCells, setSelectedCells] = useState<Set<number>>(new Set());
  const [didLost, setDidLost] = useState(false);

  const toggleCell = (index: number) => {
    if (didLost) {
      return;
    }

    setSelectedCells((prevSelectedCells) => {
      const updatedCells = new Set(prevSelectedCells);

      if (updatedCells.has(index)) {
        updatedCells.delete(index);
      } else {
        if (updatedCells.size >= 5) {
          setDidLost(true);
        } else {
          updatedCells.add(index);
        }
      }

      return updatedCells;
    });
  };

  const resetGame = () => {
    setSelectedCells(new Set());
    setDidLost(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!didLost) {
        const unselectedCells = Array.from({ length: rows * columns }, (_, i) => i).filter(
          (index) => !selectedCells.has(index)
        );

        if (unselectedCells.length > 0) {
          const randomIndex = unselectedCells[Math.floor(Math.random() * unselectedCells.length)];
          toggleCell(randomIndex);
        }
      }
    }, howFast);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, columns, didLost, howFast, selectedCells]);

  const cellCount = selectedCells.size;

  return (
    <div className="grid">
      <div className="cell-count">Selected: {cellCount}/5</div>
      <div className="cell-count">Did Lost: {didLost ? 'Yes' : 'No'}</div>
      <button className="btn btn-primary" onClick={resetGame}>
        Reset Game
      </button>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="row">
          {Array.from({ length: columns }, (_, j) => {
            const index = i * columns + j;
            return (
              <div
                key={index}
                className={`cell ${selectedCells.has(index) ? 'selected' : 'unselected'}`}
                onClick={() => toggleCell(index)}
              >
                {/* Tutaj możesz dodać zawartość komórki */}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Grid;
