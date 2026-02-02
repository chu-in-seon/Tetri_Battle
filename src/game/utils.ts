// src/game/utils.ts

import { GRID_HEIGHT, GRID_WIDTH, type TetrominoType, type Cell } from './constants';

export interface PieceData {
  shape: (0 | 1)[][];
  type: TetrominoType;
  position: { x: number; y: number };
  rotation: number;
}

export function createEmptyGrid(): Cell[][] {
  return Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(0));
}

export function rotateTetromino(matrix: (0 | 1)[][], direction: 'left' | 'right'): (0 | 1)[][] {
  const numRows = matrix.length;
  const numCols = matrix[0].length;
  const rotated: (0 | 1)[][] = Array.from({ length: numCols }, () => Array(numRows).fill(0));

  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      if (direction === 'right') {
        rotated[c][numRows - 1 - r] = matrix[r][c];
      } else { 
        rotated[numCols - 1 - c][r] = matrix[r][c];
      }
    }
  }
  return rotated;
}

export function checkCollision(
  tetromino: (0 | 1)[][],
  grid: Cell[][],
  position: { x: number; y: number }
): boolean {
  for (let r = 0; r < tetromino.length; r++) {
    for (let c = 0; c < tetromino[r].length; c++) {
      if (tetromino[r][c] !== 0) {
        const gridX = position.x + c;
        const gridY = position.y + r;

        if (
          gridX < 0 ||
          gridX >= GRID_WIDTH ||
          gridY >= GRID_HEIGHT ||
          gridY < 0
        ) {
          return true;
        }

        if (grid[gridY] && grid[gridY][gridX] !== 0) {
          return true;
        }
      }
    }
  }
  return false;
}

let bag: TetrominoType[] = [];
const TETROMINO_TYPES_LIST: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function generateRandomTetrominoType(): TetrominoType {
  if (bag.length === 0) {
    bag = shuffleArray([...TETROMINO_TYPES_LIST]);
  }
  const nextType = bag.pop();
  if (nextType === undefined) {
    return TETROMINO_TYPES_LIST[Math.floor(Math.random() * TETROMINO_TYPES_LIST.length)];
  }
  return nextType;
}

export function calculateGhostPiecePosition(piece: PieceData, grid: Cell[][]): PieceData {
  let ghostY = piece.position.y;
  while (!checkCollision(piece.shape, grid, { x: piece.position.x, y: ghostY + 1 })) {
    ghostY++;
  }
  return { ...piece, position: { x: piece.position.x, y: ghostY } };
}

export function mergePiece(piece: PieceData, currentGrid: Cell[][]): Cell[][] {
  const newGrid = currentGrid.map(row => [...row]);
  piece.shape.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell !== 0) {
        const gridX = piece.position.x + c;
        const gridY = piece.position.y + r;
        if (gridY >= 0 && gridY < GRID_HEIGHT && gridX >= 0 && gridX < GRID_WIDTH) {
          newGrid[gridY][gridX] = piece.type;
        }
      }
    });
  });
  return newGrid;
}

export function clearLines(currentGrid: Cell[][]): { newGrid: Cell[][]; lines: number } {
  let lines = 0;
  const newGrid = currentGrid.filter(row => {
    if (row.every(cell => cell !== 0)) {
      lines++;
      return false;
    }
    return true;
  });

  while (newGrid.length < GRID_HEIGHT) {
    newGrid.unshift(Array(GRID_WIDTH).fill(0));
  }

  return { newGrid, lines };
}
