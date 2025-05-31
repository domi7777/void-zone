import Phaser from 'phaser';
import { ObstacleType } from '../game/shapes/ShapeFactory';

export interface IGameObject {
    update(delta: number): void;
    destroy(): void;
}

export interface ICollidable {
    isCollidingWith(other: Phaser.GameObjects.GameObject): boolean;
}

export interface IObstacle extends IGameObject, ICollidable {
    readonly shapeType: ObstacleType;
    readonly color: number;
}
