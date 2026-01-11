import React, { useState, useCallback, useEffect, useMemo, Suspense } from 'react';
import GameCanvas from './components/GameCanvas';
import LandingPage from './components/LandingPage';
import { HUD, GameOverModal, LegalModal } from './components/UI';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Block, Shape } from './types';
import { CONFIG } from './constants';
import { createNewShape, rotateShape, findDropPosition } from './utils/gameLogic';

const App: React.FC = () => {
  // Navigation State
  const [view, setView] = useState<'landing' | 'game'>('landing');
  const [activeLegal, setActiveLegal] = useState<'privacy' | 'terms' | null>(null);
  
  // Game State
  const [placedBlocks, setPlacedBlocks] = useState<Block[]>([]);
  const [activeShape, setActiveShape] = useState<Shape>(() => createNewShape());
  const [cursorPos, setCursorPos] = useState<{ x: number, y: number } | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [nextShape, setNextShape] = useState<Shape>(() => createNewShape());

  // Game Stats
  const totalVolume = CONFIG.gridSize * CONFIG.gridSize * CONFIG.maxHeight;
  const volumeFilled = placedBlocks.length;
  const score = useMemo(() => placedBlocks.length, [placedBlocks]);

  // Handle Rotation
  const handleRotate = useCallback(() => {
    if (gameOver || view !== 'game') return;
    setActiveShape(prev => rotateShape(prev));
  }, [gameOver, view]);

  // Handle Keyboard Inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (view === 'game') {
        if (e.code === 'KeyR' || e.code === 'Space') {
          // Prevent space scrolling
          if (e.code === 'Space') e.preventDefault();
          handleRotate();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRotate, view]);

  // Handle Mouse/Touch Hover from Canvas
  const handleHoverUpdate = useCallback((pos: { x: number, y: number } | null) => {
    if (gameOver) return;
    setCursorPos(pos);
  }, [gameOver]);

  // Handle Placement
  const handleCanvasClick = useCallback(() => {
    if (gameOver || !cursorPos) return;

    const { x, y } = cursorPos;
    const dropZ = findDropPosition(activeShape, x, y, placedBlocks);

    if (dropZ !== null) {
      // Valid placement
      const newBlocks: Block[] = activeShape.blocks.map(b => ({
        x: x + b.x,
        y: y + b.y,
        z: dropZ + b.z,
        color: activeShape.color,
        id: activeShape.id
      }));

      setPlacedBlocks(prev => [...prev, ...newBlocks]);
      
      // Spawn new shape
      setActiveShape(nextShape);
      setNextShape(createNewShape());
    }
  }, [activeShape, cursorPos, placedBlocks, gameOver, nextShape]);

  // Check Game Over Condition
  useEffect(() => {
      if (volumeFilled >= totalVolume) {
          setGameOver(true);
      }
  }, [volumeFilled, totalVolume]);

  const resetGame = () => {
    setPlacedBlocks([]);
    setGameOver(false);
    setActiveShape(createNewShape());
    setNextShape(createNewShape());
  };

  const handleStartGame = () => {
    setView('game');
  };

  // Render Landing Page
  if (view === 'landing') {
    return (
      <ErrorBoundary>
        <LandingPage 
          onPlay={handleStartGame} 
          onLegal={(type) => setActiveLegal(type)}
        />
        {activeLegal && (
          <LegalModal 
            type={activeLegal} 
            onClose={() => setActiveLegal(null)} 
          />
        )}
      </ErrorBoundary>
    );
  }

  // Render Game
  return (
    <ErrorBoundary>
      <div className="w-full h-[100dvh] bg-[#1a1a1a] overflow-hidden relative select-none touch-none overscroll-none">
        
        {/* 3D Canvas Layer */}
        <GameCanvas 
          placedBlocks={placedBlocks}
          activeShape={activeShape}
          onHoverUpdate={handleHoverUpdate}
          onCanvasClick={handleCanvasClick}
          cursorGridPos={cursorPos}
        />

        {/* UI Overlay */}
        <HUD 
          score={score}
          volumeFilled={volumeFilled}
          totalVolume={totalVolume}
          nextPieceColor={nextShape.color}
          onReset={resetGame}
        />
        
        {/* Mobile Rotate Button (Bottom Right) - Only visible in Game */}
        <div className="absolute bottom-6 right-6 z-30 md:hidden">
             <button 
                onClick={handleRotate}
                className="w-16 h-16 bg-orange-600 rounded-full shadow-xl flex items-center justify-center border-4 border-orange-400 active:scale-90 transition-transform"
                aria-label="Rotate Shape"
             >
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                     <path d="M3 3v5h5" />
                 </svg>
             </button>
        </div>

        {/* Game Over Modal */}
        <GameOverModal 
          isOpen={gameOver}
          score={score}
          percentage={Math.round((volumeFilled / totalVolume) * 100)}
          onRestart={resetGame}
        />
        
        {/* Branding overlay/decorations - Hidden on Mobile to clear view */}
        <div className="absolute bottom-4 left-4 text-left pointer-events-none opacity-30 hidden md:block">
          <h3 className="text-white font-bold text-2xl tracking-tighter">FEDEX<span className="text-orange-500">CORP</span></h3>
          <p className="text-gray-500 text-xs font-mono">VIRTUAL LOGISTICS TRAINER v1.0</p>
        </div>

      </div>
    </ErrorBoundary>
  );
};

export default App;