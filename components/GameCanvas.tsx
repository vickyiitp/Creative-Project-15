import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CONFIG, COLORS } from '../constants';
import { Block, Shape } from '../types';
import { drawCube, getGridFromScreen } from '../utils/iso';
import { findDropPosition } from '../utils/gameLogic';

interface GameCanvasProps {
  placedBlocks: Block[];
  activeShape: Shape;
  onHoverUpdate: (pos: { x: number, y: number } | null) => void;
  onCanvasClick: () => void;
  cursorGridPos: { x: number, y: number } | null;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ 
  placedBlocks, 
  activeShape, 
  onHoverUpdate, 
  onCanvasClick,
  cursorGridPos
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Viewport State
  const [viewport, setViewport] = useState({ 
    width: 800, 
    height: 600, 
    dpr: 1, 
    zoom: 1 
  });
  const [offset, setOffset] = useState({ x: 400, y: 100 });

  // Handle Resize & DPI Scaling
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        const dpr = window.devicePixelRatio || 1;
        
        // Calculate responsive zoom
        // Base tile width is 64. A 6x6 grid needs roughly 400-500px width.
        // If screen is smaller (e.g., 360px), we need to zoom out.
        let newZoom = 1.0;
        if (clientWidth < 600) {
            newZoom = clientWidth / 600; // Scale down for mobile
        }
        // Minimal Zoom clamp
        newZoom = Math.max(0.6, newZoom);

        setViewport({ width: clientWidth, height: clientHeight, dpr, zoom: newZoom });
        
        // Center offset based on logic
        setOffset({ 
            x: clientWidth / 2, 
            y: clientHeight * 0.25 // Slightly lower start
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Init

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle High-DPI Scaling
    canvas.width = viewport.width * viewport.dpr;
    canvas.height = viewport.height * viewport.dpr;
    
    // CSS Size
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;

    // Scale Context
    ctx.scale(viewport.dpr, viewport.dpr);
    
    // Apply Zoom for small screens
    // We apply zoom to the draw calls implicitly by scaling the coordinate system temporarily?
    // Or we pass zoom to draw functions. 
    // Easier: Scale context again.
    ctx.save();
    // Center the zoom
    ctx.translate(viewport.width/2, viewport.height/2);
    ctx.scale(viewport.zoom, viewport.zoom);
    ctx.translate(-viewport.width/2, -viewport.height/2);

    // Clear Logic (must assume transformed coords if we don't reset, but we clear whole rect)
    // To clear properly, we should reset transform or clear a huge area.
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset for clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Render Logic using standard offsets (zoom is handled by context scale)
    const { gridSize, maxHeight, tileWidth, tileHeight } = CONFIG;
    const { x: offsetX, y: offsetY } = offset;

    // --- Draw Container Floor (Grid) ---
    ctx.lineWidth = 1;
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        // We use projectIso helper. It uses CONSTANTS, so it doesn't know about zoom. 
        // That's why we scaled the Context.
        
        // Wait, projectIso uses `CONFIG.tileWidth`. 
        // If we scaled context, we don't need to change projectIso inputs.
        
        // ... drawCube implementation uses projectIso internally ...
        
        // Draw floor logic reused from drawCube essentially or manual path:
        const px = (x - y) * tileWidth * 0.5 + offsetX;
        const py = (x + y) * tileHeight * 0.5 + offsetY;
        
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + tileWidth / 2, py + tileHeight / 2);
        ctx.lineTo(px, py + tileHeight);
        ctx.lineTo(px - tileWidth / 2, py + tileHeight / 2);
        ctx.closePath();
        
        ctx.fillStyle = COLORS.containerFloor;
        ctx.fill();
        ctx.strokeStyle = COLORS.gridLines;
        ctx.stroke();
      }
    }

    // --- Draw Pillars ---
    const corners = [
      { x: 0, y: 0 },
      { x: gridSize, y: 0 },
      { x: 0, y: gridSize },
      { x: gridSize, y: gridSize },
    ];
    
    ctx.strokeStyle = COLORS.containerWall;
    ctx.lineWidth = 2;
    // Helper to get iso point
    const getP = (x: number, y: number, z: number) => {
        const isoX = (x - y) * tileWidth * 0.5 + offsetX;
        const isoY = (x + y) * tileHeight * 0.5 - (z * tileHeight) + offsetY;
        return { x: isoX, y: isoY };
    }

    corners.forEach(c => {
        const bottom = getP(c.x, c.y, 0);
        const top = getP(c.x, c.y, maxHeight);
        ctx.beginPath();
        ctx.moveTo(bottom.x, bottom.y);
        ctx.lineTo(top.x, top.y);
        ctx.stroke();
    });

    // Draw Top Lid Outline
    ctx.beginPath();
    const p1 = getP(0, 0, maxHeight);
    const p2 = getP(gridSize, 0, maxHeight);
    const p3 = getP(gridSize, gridSize, maxHeight);
    const p4 = getP(0, gridSize, maxHeight);
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.stroke();
    ctx.setLineDash([]);


    // --- Prepare Render List ---
    let renderList: { 
      x: number; y: number; z: number; color: string; type: 'placed' | 'ghost' | 'active';
    }[] = placedBlocks.map(b => ({ ...b, type: 'placed' }));

    if (cursorGridPos) {
      const dropZ = findDropPosition(activeShape, cursorGridPos.x, cursorGridPos.y, placedBlocks);
      
      if (dropZ !== null) {
        // Valid Drop Preview
        activeShape.blocks.forEach(b => {
          renderList.push({
            x: cursorGridPos.x + b.x,
            y: cursorGridPos.y + b.y,
            z: dropZ + b.z,
            color: activeShape.color,
            type: 'active'
          });
        });
      } else {
        // Invalid Position (Red Ghost)
        activeShape.blocks.forEach(b => {
             renderList.push({
                x: cursorGridPos.x + b.x,
                y: cursorGridPos.y + b.y,
                z: maxHeight, // Float at top
                color: COLORS.highlightInvalid,
                type: 'ghost'
            });
        });
      }
    }

    // Sort Painter's Algorithm
    renderList.sort((a, b) => (a.x + a.y + a.z) - (b.x + b.y + b.z));

    // Render Blocks
    renderList.forEach(b => {
        let opacity = 1.0;
        let isGhost = false;
        
        if (b.type === 'ghost') {
            opacity = 0.4;
            isGhost = true;
        } else if (b.type === 'active') {
             opacity = 0.95;
        }

        drawCube(ctx, b.x, b.y, b.z, b.color, offsetX, offsetY, opacity, isGhost);
    });

    ctx.restore(); // Restore zoom scale

  }, [viewport, offset, placedBlocks, activeShape, cursorGridPos]);

  // --- Input Handling ---

  const handleInput = useCallback((clientX: number, clientY: number) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    
    // 1. Get Mouse relative to Canvas CSS Dimensions
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    // 2. Adjust for Zoom (Inverse Scale)
    // Center point for scaling
    const cx = viewport.width / 2;
    const cy = viewport.height / 2;
    
    // (mouseX - cx) / zoom + cx
    const zoomedX = (mouseX - cx) / viewport.zoom + cx;
    const zoomedY = (mouseY - cx) / viewport.zoom + cy; // Wait, we scaled around center.
    // Actually we translated viewport.width/2, viewport.height/2.
    // Let's use simpler logic if we assume scale was uniform around center.
    // Yes:
    const finalX = (mouseX - viewport.width/2) / viewport.zoom + viewport.width/2;
    const finalY = (mouseY - viewport.height/2) / viewport.zoom + viewport.height/2;

    // 3. Project to Grid
    const { x, y } = getGridFromScreen(finalX, finalY, offset.x, offset.y);
    
    onHoverUpdate({ x, y });
  }, [viewport, offset, onHoverUpdate]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    handleInput(e.clientX, e.clientY);
  }, [handleInput]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    // Prevent scrolling while playing
    // e.preventDefault(); // React passive event issue, handle in style or useEffect
    if (e.touches.length > 0) {
        const touch = e.touches[0];
        // Offset Y slightly so finger doesn't cover block
        handleInput(touch.clientX, touch.clientY - 60); 
    }
  }, [handleInput]);

  return (
    <div ref={containerRef} className="w-full h-full relative cursor-crosshair touch-none">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onClick={onCanvasClick}
        onTouchStart={handleTouchMove} // Treat start as move to jump instantly
        onTouchMove={handleTouchMove}
        onTouchEnd={onCanvasClick} // Tap to place
        className="block touch-none select-none outline-none"
        aria-label="Game Board: Use mouse or touch to move blocks, click or tap to place."
      />
    </div>
  );
};

export default GameCanvas;