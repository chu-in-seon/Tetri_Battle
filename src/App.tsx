// src/App.tsx

import styles from './App.module.css';
import { useTetrisGame } from './game/hooks/useTetrisGame';
import Board from './components/Board/Board';
import TetrominoPreview from './components/TetrominoPreview/TetrominoPreview';

function App() {
  const {
    grid,
    currentPiece,
    ghostPiece,
    nextPieceType,
    heldPieceType,
    score,
    level,
    linesCleared,
    gameOver,
    gameStarted,
    startGame,
    resetGame,
  } = useTetrisGame();

  return (
    <div className={styles.App}>
      <div className={styles.sidebar}>
        <div className={styles.infoPanel}>
          <h3>Hold</h3>
          <TetrominoPreview tetrominoType={heldPieceType} label="" />
        </div>
      </div>

      <div className={styles.gameContainer}>
        <h1>Tetribattle</h1>
        <Board grid={grid} currentPiece={currentPiece} ghostPiece={ghostPiece} />
        {gameOver && <h2 className={styles.gameOver}>Game Over!</h2>}
        <div className={styles.controls}>
          {!gameStarted && !gameOver && (
            <button onClick={startGame}>Start Game</button>
          )}
          {gameStarted && (
            <button onClick={resetGame}>Reset Game</button>
          )}
        </div>
      </div>

      <div className={styles.sidebar}>
        <div className={styles.infoPanel}>
          <h3>Next</h3>
          <TetrominoPreview tetrominoType={nextPieceType} label="" />
        </div>
        <div className={styles.infoPanel}>
          <h3>Score</h3>
          <p><span>{score}</span></p>
        </div>
        <div className={styles.infoPanel}>
          <h3>Level</h3>
          <p><span>{level}</span></p>
        </div>
        <div className={styles.infoPanel}>
          <h3>Lines</h3>
          <p><span>{linesCleared}</span></p>
        </div>
      </div>
    </div>
  );
}

export default App;
