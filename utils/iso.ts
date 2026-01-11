import { CONFIG, COLORS } from '../constants';
import { Vector3, Point2D } from '../types';

export const projectIso = (x: number, y: number, z: number, offsetX: number, offsetY: number): Point2D => {
  const isoX = (x - y) * CONFIG.tileWidth * 0.5 + offsetX;
  const isoY = (x + y) * CONFIG.tileHeight * 0.5 - (z * CONFIG.tileHeight) + offsetY;
  return { x: isoX, y: isoY };
};

export const getGridFromScreen = (
  screenX: number, 
  screenY: number, 
  offsetX: number, 
  offsetY: number
): { x: number; y: number } => {
  // Inverse isometric projection (assuming z=0 plane for mouse picking)
  // screenX - offsetX = (x - y) * W/2
  // screenY - offsetY = (x + y) * H/2
  
  const adjX = screenX - offsetX;
  const adjY = screenY - offsetY;

  const halfW = CONFIG.tileWidth * 0.5;
  const halfH = CONFIG.tileHeight * 0.5;

  // Solving system of linear equations
  // adjY / halfH = x + y
  // adjX / halfW = x - y
  // (adjY/halfH + adjX/halfW) = 2x => x = (adjY/halfH + adjX/halfW) / 2
  // (adjY/halfH - adjX/halfW) = 2y => y = (adjY/halfH - adjX/halfW) / 2

  const x = Math.floor(((adjY / halfH) + (adjX / halfW)) / 2);
  const y = Math.floor(((adjY / halfH) - (adjX / halfW)) / 2);

  return { x, y };
};

export const drawCube = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  z: number,
  color: string,
  offsetX: number,
  offsetY: number,
  opacity: number = 1.0,
  isGhost: boolean = false
) => {
  const { x: px, y: py } = projectIso(x, y, z, offsetX, offsetY);
  const hw = CONFIG.tileWidth * 0.5;
  const hh = CONFIG.tileHeight * 0.5;
  const h = CONFIG.tileHeight; // Height of the cube visually

  // Shade colors
  const baseColor = hexToRgb(color);
  if (!baseColor) return;

  const topColor = `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${opacity})`;
  const rightColor = `rgba(${Math.max(0, baseColor.r - 40)}, ${Math.max(0, baseColor.g - 40)}, ${Math.max(0, baseColor.b - 40)}, ${opacity})`;
  const leftColor = `rgba(${Math.max(0, baseColor.r - 20)}, ${Math.max(0, baseColor.g - 20)}, ${Math.max(0, baseColor.b - 20)}, ${opacity})`;

  ctx.lineWidth = 1;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = isGhost ? `rgba(255,255,255,0.5)` : `rgba(0,0,0,0.3)`;

  // Draw Top Face
  ctx.beginPath();
  ctx.moveTo(px, py - h);
  ctx.lineTo(px + hw, py - h - hh);
  ctx.lineTo(px, py - h - 2 * hh);
  ctx.lineTo(px - hw, py - h - hh);
  ctx.closePath();
  ctx.fillStyle = topColor;
  ctx.fill();
  if(!isGhost) ctx.stroke();

  // Draw Right Face
  ctx.beginPath();
  ctx.moveTo(px, py - h);
  ctx.lineTo(px + hw, py - h - hh);
  ctx.lineTo(px + hw, py - hh);
  ctx.lineTo(px, py);
  ctx.closePath();
  ctx.fillStyle = rightColor;
  ctx.fill();
  if(!isGhost) ctx.stroke();

  // Draw Left Face
  ctx.beginPath();
  ctx.moveTo(px, py - h);
  ctx.lineTo(px - hw, py - h - hh);
  ctx.lineTo(px - hw, py - hh);
  ctx.lineTo(px, py);
  ctx.closePath();
  ctx.fillStyle = leftColor;
  ctx.fill();
  if(!isGhost) ctx.stroke();
};

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};