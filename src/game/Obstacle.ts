import Phaser from 'phaser';

export class Obstacle extends Phaser.GameObjects.Container {
    private shape: Phaser.GameObjects.Graphics;
    private z: number = 0;
    private readonly maxZ: number = 1000;
    private readonly baseSize: number = 40;
    
    constructor(scene: Phaser.Scene, x: number, z: number) {
        super(scene, x, 0);
        scene.add.existing(this);
        
        this.z = z;
        this.shape = scene.add.graphics();
        this.add(this.shape);
        this.drawShape();
    }

    private drawShape() {
        this.shape.clear();
        
        // Scale based on z position (perspective effect)
        const scale = this.getScale();
        const size = this.baseSize * scale;
        
        // Draw a simple diamond shape
        this.shape.lineStyle(2 * scale, 0xff0000);
        this.shape.beginPath();
        this.shape.moveTo(0, -size);
        this.shape.lineTo(size, 0);
        this.shape.lineTo(0, size);
        this.shape.lineTo(-size, 0);
        this.shape.closePath();
        this.shape.strokePath();
    }

    update(speed: number) {
        // Move obstacle closer
        this.z -= speed;
        
        // Update position and scale based on z
        const progress = this.z / this.maxZ;
        const screenHeight = this.scene.cameras.main.height;
        const horizonY = 150; // Should match BackgroundGrid's horizonY
        
        // Calculate y position with perspective
        this.y = horizonY + (screenHeight - horizonY) * (1 - progress);
        
        // Update visual size
        this.drawShape();
        
        return this.z <= 0; // Return true if obstacle should be removed
    }

    private getScale(): number {
        const progress = this.z / this.maxZ;
        return Phaser.Math.Linear(3, 0.1, progress);
    }

    isCollidingWith(player: Phaser.GameObjects.Triangle): boolean {
        const scale = this.getScale();
        const size = this.baseSize * scale;
        
        // Simple circular collision detection
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance < size;
    }
}
