import { Vector3, Block, Shape } from '../types';
import { CONFIG, SHAPE_TEMPLATES, SHAPE_COLORS } from '../constants';

export const createNewShape = (): Shape => {
  const templateIdx = Math.floor(Math.random() * SHAPE_TEMPLATES.length);
  const colorIdx = Math.floor(Math.random() * SHAPE_COLORS.length);
  
  // Clone the blocks so we don't mutate the template
  const blocks = SHAPE_TEMPLATES[templateIdx].map(b => ({ ...b }));
  
  return {
    blocks,
    color: SHAPE_COLORS[colorIdx],
    id: Math.random().toString(36).substr(2, 9)
  };
};

export const rotateShape = (shape: Shape): Shape => {
  // Rotate 90 degrees around Z axis (x, y) -> (-y, x)
  // Simplified rotation around local center
  // 1. Find center of mass roughly or just 0,0 if shapes are defined relative to 0,0
  
  // Standard matrix rotation for 90 deg: x' = -y, y' = x
  const newBlocks = shape.blocks.map(b => ({
    x: -b.y,
    y: b.x,
    z: b.z
  }));

  // Re-center logic: ensure no negative coordinates relative to bounding box origin, 
  // or just let the user move it. 
  // Better: Normalize so the top-left-most is close to 0,0 to prevent swinging wildly
  const minX = Math.min(...newBlocks.map(b => b.x));
  const minY = Math.min(...newBlocks.map(b => b.y));

  const normalizedBlocks = newBlocks.map(b => ({
    x: b.x - minX,
    y: b.y - minY,
    z: b.z
  }));

  return { ...shape, blocks: normalizedBlocks };
};

export const checkCollision = (
  blocks: Vector3[], 
  gridOffset: Vector3, 
  placedBlocks: Block[]
): boolean => {
  const gridSize = CONFIG.gridSize;
  const maxHeight = CONFIG.maxHeight;

  for (const b of blocks) {
    const absX = b.x + gridOffset.x;
    const absY = b.y + gridOffset.y;
    const absZ = b.z + gridOffset.z;

    // Bounds Check
    if (absX < 0 || absX >= gridSize) return true;
    if (absY < 0 || absY >= gridSize) return true;
    if (absZ < 0 || absZ >= maxHeight) return true;

    // Block Overlap Check
    // Optimization: Use a 3D array or spatial hash in a real large app.
    // For < 1000 blocks, linear scan or simple lookup is fine.
    const isOccupied = placedBlocks.some(
      pb => pb.x === absX && pb.y === absY && pb.z === absZ
    );
    if (isOccupied) return true;
  }

  return false;
};

export const findDropPosition = (
  shape: Shape, 
  cursorX: number, 
  cursorY: number, 
  placedBlocks: Block[]
): number | null => {
  // Try to find the lowest Z where the shape fits at (cursorX, cursorY)
  // Start from top (maxHeight) and go down.
  // Actually, we want the lowest valid position, so we should "drop" it.
  // Start from z=maxHeight (outside) and move down until collision, then step back up 1.
  
  // Correction: We want to place it ON TOP of existing stuff or floor.
  // Check z from 0 upwards. The first Z where the shape FITS (no collision) 
  // AND if we moved it down one step (z-1) it WOULD collide (or is floor -1).
  
  // Simpler approach: Start at z = maxHeight. Check collision. If colliding, can't place.
  // If not colliding, move down. Repeat until collision. The last valid Z is the drop spot.
  
  let validZ = -1;

  for (let z = CONFIG.maxHeight - 1; z >= 0; z--) {
    const isColliding = checkCollision(shape.blocks, { x: cursorX, y: cursorY, z }, placedBlocks);
    if (isColliding) {
      // If we collide at Z, then Z+1 was the last valid spot (unless we started colliding)
      // Wait, if we collide at Z, we can't be at Z.
      break; 
    }
    validZ = z;
  }

  // If validZ is still -1, it means we collided even at the very top, or logic is flawed.
  // Wait, if we iterate top-down:
  // Z=8 (Space) -> No Coll
  // Z=7 (Space) -> No Coll
  // ...
  // Z=0 (Space) -> No Coll -> Returns 0.
  // Z=-1 (Floor) -> Logic handles floor as boundary?
  // My checkCollision doesn't check floor z < 0 implicitly, but it does `if (absZ < 0) return true`
  
  // So loop:
  // z=5: safe
  // z=4: safe
  // z=3: collision!
  // Loop breaks. validZ was 4.
  
  if (validZ === -1) return null; // Can't fit in container at all (stack full)
  
  return validZ;
};
