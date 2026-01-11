import { GameConfig, Vector3 } from './types';

export const CONFIG: GameConfig = {
  gridSize: 6,
  maxHeight: 8,
  tileWidth: 64,
  tileHeight: 32,
};

export const COLORS = {
  background: '#111827', // Gray-900
  gridLines: '#374151', // Gray-700
  containerFloor: '#1F2937', // Gray-800
  containerWall: '#374151',
  highlightValid: 'rgba(255, 255, 255, 0.2)',
  highlightInvalid: 'rgba(239, 68, 68, 0.4)', // Red-500
  
  // FedEx/Logistics Palette
  brandPurple: '#4D148C',
  brandOrange: '#FF6600',
  boxBrown: '#8B4513',
  boxTeal: '#008080',
  boxGold: '#DAA520',
};

// Available shape colors
export const SHAPE_COLORS = [
  COLORS.brandPurple,
  COLORS.brandOrange,
  '#2563EB', // Blue-600
  '#DC2626', // Red-600
  '#16A34A', // Green-600
  '#9333EA', // Purple-600
  '#D97706', // Amber-600
];

export const SHAPE_TEMPLATES: Vector3[][] = [
  // 1. Single Cube
  [{ x: 0, y: 0, z: 0 }],
  
  // 2. Line (2)
  [{ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }],
  
  // 3. Line (3)
  [{ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, { x: 2, y: 0, z: 0 }],
  
  // 4. L-Shape (Small)
  [{ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }],
  
  // 5. Square (2x2)
  [{ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }, { x: 1, y: 1, z: 0 }],
  
  // 6. T-Shape
  [{ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, { x: 2, y: 0, z: 0 }, { x: 1, y: 1, z: 0 }],

  // 7. S-Shape
  [{ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, { x: 1, y: 1, z: 0 }, { x: 2, y: 1, z: 0 }],
  
  // 8. 3D Corner
  [{ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }, { x: 0, y: 0, z: 1 }],
];