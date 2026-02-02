// src/game/constants.ts

export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 20;

export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L' | 'G';
export type Cell = TetrominoType | 0;

export type Grid = Cell[][];

export const TETROMINO_COLORS: Record<TetrominoType, string> = {
  I: '#00FFFF',
  O: '#FFFF00',
  T: '#800080',
  S: '#00FF00',
  Z: '#FF0000',
  J: '#0000FF',
  L: '#FFA500',
  G: '#808080',
};

export const TETROMINO_SHAPES: Record<TetrominoType, (0 | 1)[][]> = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  G: [
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
  ]
};

export const SPAWN_POSITION = { x: Math.floor(GRID_WIDTH / 2) - 2, y: 0 };
