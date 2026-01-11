export type Vector3 = {
  x: number;
  y: number;
  z: number;
};

export type Point2D = {
  x: number;
  y: number;
};

export interface Block {
  x: number;
  y: number;
  z: number;
  color: string;
  id: string; // To group blocks belonging to the same piece
}

export interface Shape {
  blocks: Vector3[]; // Relative coordinates
  color: string;
  id: string;
}

export interface GameConfig {
  gridSize: number; // e.g., 6 for a 6x6x6 container
  maxHeight: number;
  tileWidth: number;
  tileHeight: number;
}
