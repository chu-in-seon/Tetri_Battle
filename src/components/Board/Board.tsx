// src/components/Board/Board.tsx

import React from 'react';
import styles from './Board.module.css';
import Cell from '../Cell/Cell';
import { type Cell as GridCell, GRID_HEIGHT, GRID_WIDTH, type TetrominoType } from '../../game/constants';
import type { Piece } from '../../game/hooks/useTetrisGame';

interface BoardProps {
  grid: GridCell[][];
  currentPiece: Piece | null;
  ghostPiece: Piece | null;
}

const Board: React.FC<BoardProps> = ({ grid, currentPiece, ghostPiece }) => {
  const boardToRender: (GridCell | 'G')[][] = grid.map((row: GridCell[]) => [...row]);

  if (ghostPiece) {
    ghostPiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell !== 0) {
          const gridX = ghostPiece.position.x + x;
          const gridY = ghostPiece.position.y + y;
          if (
            gridY >= 0 &&
            gridY < GRID_HEIGHT &&
            gridX >= 0 &&
            gridX < GRID_WIDTH &&
            boardToRender[gridY][gridX] === 0
          ) {
            boardToRender[gridY][gridX] = 'G';
          }
        }
      });
    });
  }

  if (currentPiece) {
    currentPiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell !== 0) {
          const gridX = currentPiece.position.x + x;
          const gridY = currentPiece.position.y + y;
          if (
            gridY >= 0 &&
            gridY < GRID_HEIGHT &&
            gridX >= 0 &&
            gridX < GRID_WIDTH
          ) {
            boardToRender[gridY][gridX] = currentPiece.type;
          }
        }
      });
    });
  }

  return (
    <div
      className={styles.board}
      style={{
        gridTemplateRows: `repeat(${GRID_HEIGHT}, var(--cell-size))`,
        gridTemplateColumns: `repeat(${GRID_WIDTH}, var(--cell-size))`,
      } as React.CSSProperties}
    >
      {boardToRender.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell key={`${rowIndex}-${colIndex}`} type={cell as TetrominoType | 0} />
        ))
      )}
    </div>
  );
};

export default Board;
