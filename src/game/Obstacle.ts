import Phaser from 'phaser';
import type { IObstacle } from '../interfaces/GameObjects';
import { GameConfig } from '../config/GameConfig';
import { ObstacleType, ShapeFactory } from './shapes/ShapeFactory';
import type { Player } from './Player';

export class Obstacle extends Phaser.GameObjects.Container implements IObstacle {
    private readonly shape: Phaser.GameObjects.Graphics;
    private _rotation: number = 0;
    private _z: number;
    
    public readonly shapeType: ObstacleType;
    public readonly color: number;
    
    constructor(scene: Phaser.Scene, x: number, z: number) {
        super(scene, x, 0);
        scene.add.existing(this);
        
        this._z = z;
        this.shape = scene.add.graphics();
        this.add(this.shape);
        
        // Random shape and color
        const shapeTypes = [
            ObstacleType.SpikedStar,
            ObstacleType.ReactorCore,
            ObstacleType.EvilEye,
            ObstacleType.EnergyCrystal
        ] as const;
        this.shapeType = shapeTypes[Phaser.Math.Between(0, shapeTypes.length - 1)];
        this.color = GameConfig.OBSTACLES.COLORS[
            Phaser.Math.Between(0, GameConfig.OBSTACLES.COLORS.length - 1)
        ];
        
        this.drawShape();
    }

    private drawShape() {
        this.shape.clear();
        
        const scale = this.getScale();
        const size = GameConfig.OBSTACLES.BASE_SIZE * scale;
        
        this.shape.lineStyle(2 * scale, this.color, 1.0);
        
        // Get the appropriate shape from factory and draw it
        const shape = ShapeFactory.getShape(this.shapeType);
        shape.draw(this.shape, size);
        
        this.shape.strokePath();
    }



    public preUpdate(_time: number, delta: number): void {
        this._rotation = (this._rotation + delta * 0.001) % (Math.PI * 2);
        this.setRotation(this._rotation);
    }

    public update(speed: number): boolean {
        // Move obstacle closer
        this._z -= speed;
        
        // Update position and scale based on z
        const progress = this._z / GameConfig.OBSTACLES.MAX_Z;
        const screenHeight = this.scene.cameras.main.height;
        
        // Calculate y position with perspective
        this.y = GameConfig.HORIZON_Y + (screenHeight - GameConfig.HORIZON_Y) * (1 - progress);
        
        // Update visual size
        this.drawShape();
        
        return this._z <= 0;
    }

    private getScale(): number {
        const progress = this._z / GameConfig.OBSTACLES.MAX_Z;
        return Phaser.Math.Linear(3, 0.1, progress);
    }

    public isCollidingWith(player: Player): boolean {
        const scale = this.getScale();
        const size = GameConfig.OBSTACLES.BASE_SIZE * scale;
        
        // Get collision multiplier from shape
        const shape = ShapeFactory.getShape(this.shapeType);
        const collisionRadius = size * shape.getCollisionMultiplier();
        
        // Simple circular collision detection
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance < collisionRadius;
    }
}
