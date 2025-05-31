import type Phaser from 'phaser'

export type Point = {
  x: number
  y: number
}

export interface ObstacleShape {
  draw(graphics: Phaser.GameObjects.Graphics, size: number): void
  getCollisionMultiplier(): number
}
