// src/components/TetrominoPreview/TetrominoPreview.tsx

import React from 'react';
import styles from './TetrominoPreview.module.css';
import Cell from '../Cell/Cell';
import { type TetrominoType, TETROMINO_SHAPES } from '../../game/constants';

interface TetrominoPreviewProps {
  tetrominoType: TetrominoType | null;
  label: string;
}

const TetrominoPreview: React.FC<TetrominoPreviewProps> = ({ tetrominoType, label }) => {
  const shape = tetrominoType ? TETROMINO_SHAPES[tetrominoType] : null;

  const previewGrid = Array.from({ length: 4 }, () => Array(4).fill(0));

  if (shape) {
    shape.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell !== 0 && previewGrid[r] && previewGrid[r][c] !== undefined) {
          previewGrid[r][c] = tetrominoType;
        }
      });
    });
  }

  return (
    <div className={styles.previewContainer}>
      <h3>{label}</h3>
      <div className={styles.grid}>
        {previewGrid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell key={`${rowIndex}-${colIndex}`} type={cell as TetrominoType | 0} />
          ))
        )}
      </div>
    </div>
  );
};

export default TetrominoPreview;
