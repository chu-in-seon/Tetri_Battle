// src/game/hooks/useTetrisGame.ts

import { create } from 'zustand';
import {
  SPAWN_POSITION,
  TETROMINO_SHAPES,
  type TetrominoType,
  type Cell,
} from '../constants';
import {
  createEmptyGrid,
  rotateTetromino,
  checkCollision,
  generateRandomTetrominoType,
  calculateGhostPiecePosition,
  mergePiece,
  clearLines,
  type PieceData
} from '../utils';
import { useCallback, useEffect } from 'react';

export type Piece = PieceData;

interface GameState {
  grid: Cell[][];
  currentPiece: Piece | null;
  ghostPiece: Piece | null;
  nextPieceType: TetrominoType;
  heldPieceType: TetrominoType | null;
  canHold: boolean;
  score: number;
  level: number;
  linesCleared: number;
  gameOver: boolean;
  gameStarted: boolean;
  dropTime: number;

  resetGame: () => void;
  startGame: () => void;
  movePiece: (direction: 'left' | 'right' | 'down') => void;
  rotatePiece: () => void;
  hardDrop: () => void;
  holdPiece: () => void;
  
  spawnNewPiece: () => void;
}

const useTetrisStore = create<GameState>((set, get) => ({
  grid: createEmptyGrid(),
  currentPiece: null,
  ghostPiece: null,
  nextPieceType: generateRandomTetrominoType(),
  heldPieceType: null,
  canHold: true,
  score: 0,
  level: 1,
  linesCleared: 0,
  gameOver: false,
  gameStarted: false,
  dropTime: 1000,

  resetGame: () => {
    set({
      grid: createEmptyGrid(),
      currentPiece: null,
      ghostPiece: null,
      nextPieceType: generateRandomTetrominoType(),
      heldPieceType: null,
      canHold: true,
      score: 0,
      level: 1,
      linesCleared: 0,
      gameOver: false,
      gameStarted: false,
      dropTime: 1000,
    });
  },

  startGame: () => {
    get().resetGame();
    set({ gameStarted: true });
    get().spawnNewPiece();
  },

  spawnNewPiece: () => {
    const { nextPieceType, grid } = get();
    const type = nextPieceType;
    const shape = TETROMINO_SHAPES[type];
    const newPiece: Piece = {
      shape: shape,
      type: type,
      position: SPAWN_POSITION,
      rotation: 0,
    };

    if (checkCollision(newPiece.shape, grid, newPiece.position)) {
      set({ gameOver: true, gameStarted: false });
      return;
    }

    const ghost = calculateGhostPiecePosition(newPiece, grid);

    set({
      currentPiece: newPiece,
      ghostPiece: ghost,
      nextPieceType: generateRandomTetrominoType(),
      canHold: true,
    });
  },

  movePiece: (direction) => {
    const { gameOver, currentPiece, grid, level, linesCleared, score } = get();
    if (gameOver || !currentPiece) return;

    const newPosition = { ...currentPiece.position };
    if (direction === 'left') newPosition.x--;
    else if (direction === 'right') newPosition.x++;
    else if (direction === 'down') newPosition.y++;

    if (!checkCollision(currentPiece.shape, grid, newPosition)) {
      const newCurrentPiece = { ...currentPiece, position: newPosition };
      const ghost = calculateGhostPiecePosition(newCurrentPiece, grid);
      set({
        currentPiece: newCurrentPiece,
        ghostPiece: ghost,
      });
    } else if (direction === 'down') {
      const mergedGrid = mergePiece(currentPiece, grid);
      const { newGrid, lines } = clearLines(mergedGrid);
      
      let newScore = score;
      let newLinesCleared = linesCleared;
      let newLevel = level;
      let newDropTime = get().dropTime;

      if (lines > 0) {
        const lineClearScores = [0, 100, 300, 500, 800];
        const scoreToAdd = lineClearScores[lines] * level;
        newScore += scoreToAdd;
        newLinesCleared += lines;
        newLevel = Math.floor(newLinesCleared / 10) + 1;
        newDropTime = Math.max(100, 1000 - (newLevel - 1) * 100);
      }

      set({
        grid: newGrid,
        currentPiece: null,
        ghostPiece: null,
        score: newScore,
        linesCleared: newLinesCleared,
        level: newLevel,
        dropTime: newDropTime,
      });
    }
  },

  rotatePiece: () => {
    const { gameOver, currentPiece, grid } = get();
    if (gameOver || !currentPiece) return;

    const rotatedShape = rotateTetromino(currentPiece.shape, 'right');
    let newX = currentPiece.position.x;
    let newY = currentPiece.position.y;

    const kicks = [
      [0, 0], [-1, 0], [1, 0], [0, -1], [-2, 0], [2, 0],
    ];

    for (const [offsetX, offsetY] of kicks) {
      if (!checkCollision(rotatedShape, grid, { x: newX + offsetX, y: newY + offsetY })) {
        const newCurrentPiece = {
          ...currentPiece,
          shape: rotatedShape,
          position: { x: newX + offsetX, y: newY + offsetY },
          rotation: (currentPiece.rotation + 1) % 4,
        };
        const ghost = calculateGhostPiecePosition(newCurrentPiece, grid);
        
        set({
          currentPiece: newCurrentPiece,
          ghostPiece: ghost,
        });
        return;
      }
    }
  },

  hardDrop: () => {
    const { gameOver, currentPiece, grid, level, linesCleared, score } = get();
    if (gameOver || !currentPiece) return;

    let droppedPiece = { ...currentPiece };
    let newY = droppedPiece.position.y;

    while (!checkCollision(droppedPiece.shape, grid, { x: droppedPiece.position.x, y: newY + 1 })) {
      newY++;
    }
    droppedPiece.position.y = newY;

    const mergedGrid = mergePiece(droppedPiece, grid);
    const { newGrid, lines } = clearLines(mergedGrid);
    
    let newScore = score;
    let newLinesCleared = linesCleared;
    let newLevel = level;
    let newDropTime = get().dropTime;

    if (lines > 0) {
      const lineClearScores = [0, 100, 300, 500, 800];
      const scoreToAdd = lineClearScores[lines] * level;
      newScore += scoreToAdd;
      newLinesCleared += lines;
      newLevel = Math.floor(newLinesCleared / 10) + 1;
      newDropTime = Math.max(100, 1000 - (newLevel - 1) * 100);
    }

    set({
      grid: newGrid,
      currentPiece: null,
      ghostPiece: null,
      score: newScore,
      linesCleared: newLinesCleared,
      level: newLevel,
      dropTime: newDropTime,
    });
  },

  holdPiece: () => {
    const { gameOver, currentPiece, heldPieceType, nextPieceType, canHold, grid } = get();
    if (gameOver || !currentPiece || !canHold) return;

    let newHeldType: TetrominoType = currentPiece.type;
    let newCurrentPiece: Piece;
    let newNextPieceType = nextPieceType;

    if (heldPieceType) {
      newCurrentPiece = {
        shape: TETROMINO_SHAPES[heldPieceType],
        type: heldPieceType,
        position: SPAWN_POSITION,
        rotation: 0,
      };
    } else {
      newCurrentPiece = {
        shape: TETROMINO_SHAPES[nextPieceType],
        type: nextPieceType,
        position: SPAWN_POSITION,
        rotation: 0,
      };
      newNextPieceType = generateRandomTetrominoType();
    }

    if (checkCollision(newCurrentPiece.shape, grid, newCurrentPiece.position)) {
      set({ gameOver: true, gameStarted: false });
      return;
    }

    const ghost = calculateGhostPiecePosition(newCurrentPiece, grid);

    set({
      currentPiece: newCurrentPiece,
      ghostPiece: ghost,
      heldPieceType: newHeldType,
      nextPieceType: newNextPieceType,
      canHold: false,
    });
  },
}));

export const useTetrisGame = () => {
  const store = useTetrisStore();

  useEffect(() => {
    let dropInterval: number | undefined;

    if (store.gameStarted && !store.gameOver) {
      dropInterval = setInterval(() => {
        if (!useTetrisStore.getState().currentPiece) {
          useTetrisStore.getState().spawnNewPiece();
          return;
        }
        useTetrisStore.getState().movePiece('down');
      }, store.dropTime);
    } else if (dropInterval) {
      clearInterval(dropInterval);
    }

    return () => {
      if (dropInterval) {
        clearInterval(dropInterval);
      }
    };
  }, [store.gameStarted, store.gameOver, store.dropTime]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const state = useTetrisStore.getState();
      if (state.gameOver || !state.gameStarted) return;

      switch (event.key) {
        case 'ArrowLeft': state.movePiece('left'); break;
        case 'ArrowRight': state.movePiece('right'); break;
        case 'ArrowDown': state.movePiece('down'); break;
        case 'ArrowUp': state.rotatePiece(); break;
        case ' ': state.hardDrop(); break;
        case 'c': 
        case 'C': state.holdPiece(); break;
        default: break;
      }
    },
    []
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return store;
};
