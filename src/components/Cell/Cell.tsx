// src/components/Cell/Cell.tsx

import React from 'react';
import clsx from 'clsx';
import styles from './Cell.module.css';
import type { TetrominoType } from '../../game/constants';

interface CellProps {
  type: TetrominoType | 0;
}

const Cell: React.FC<CellProps> = ({ type }) => {
  return (
    <div
      className={clsx(styles.cell, {
        [styles.empty]: type === 0,
        [styles.I]: type === 'I',
        [styles.O]: type === 'O',
        [styles.T]: type === 'T',
        [styles.S]: type === 'S',
        [styles.Z]: type === 'Z',
        [styles.J]: type === 'J',
        [styles.L]: type === 'L',
        [styles.G]: type === 'G',
      })}
    />
  );
};

export default Cell;
