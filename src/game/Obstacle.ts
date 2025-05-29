import Phaser from 'phaser';

export class Obstacle extends Phaser.GameObjects.Container {
    private shape: Phaser.GameObjects.Graphics;
    private zDepth: number = 0;
    private readonly maxZDepth: number = 1000;
    private readonly baseSize: number = 40;
    private readonly shapeType: number;
    private readonly color: number;

    constructor(scene: Phaser.Scene, x: number, z: number) {
        super(scene, x, 0);
        scene.add.existing(this);
        
        this.zDepth = z;
        this.shape = scene.add.graphics();
        this.add(this.shape);
        
        // Random shape and color
        this.shapeType = Phaser.Math.Between(0, 3);
        const colors = [0xff0000, 0x00ff00, 0xff00ff, 0xffff00];
        this.color = colors[Phaser.Math.Between(0, colors.length - 1)];
        
        this.drawShape();
    }

    private drawShape() {
        this.shape.clear();
        
        const scale = this.getScale();
        const size = this.baseSize * scale;
        
        this.shape.lineStyle(2 * scale, this.color);
        
        switch (this.shapeType) {
            case 0: // Diamond
                this.shape.beginPath();
                this.shape.moveTo(0, -size);
                this.shape.lineTo(size, 0);
                this.shape.lineTo(0, size);
                this.shape.lineTo(-size, 0);
                this.shape.closePath();
                break;
                
            case 1: // Circle
                this.shape.beginPath();
                this.shape.arc(0, 0, size, 0, Math.PI * 2);
                this.shape.closePath();
                break;
                
            case 2: // Square
                this.shape.beginPath();
                this.shape.moveTo(-size, -size);
                this.shape.lineTo(size, -size);
                this.shape.lineTo(size, size);
                this.shape.lineTo(-size, size);
                this.shape.closePath();
                break;
                
            case 3: // Triangle
                this.shape.beginPath();
                this.shape.moveTo(0, -size);
                this.shape.lineTo(size, size);
                this.shape.lineTo(-size, size);
                this.shape.closePath();
                break;
        }
        
        this.shape.strokePath();
    }

    update(speed: number) {
        // Move obstacle closer
        this.zDepth -= speed;
        
        // Update position and scale based on z
        const progress = this.zDepth / this.maxZDepth;
        const screenHeight = this.scene.cameras.main.height;
        const horizonY = 150; // Should match BackgroundGrid's horizonY
        
        // Calculate y position with perspective
        this.y = horizonY + (screenHeight - horizonY) * (1 - progress);
        
        // Update visual size
        this.drawShape();
        
        return this.zDepth <= 0; // Return true if obstacle should be removed
    }

    private getScale(): number {
        const progress = this.zDepth / this.maxZDepth;
        return Phaser.Math.Linear(3, 0.1, progress);
    }

    isCollidingWith(player: Phaser.GameObjects.Triangle): boolean {
        const scale = this.getScale();
        const size = this.baseSize * scale;
        
        // Adjust collision radius based on shape
        const collisionMultiplier = this.shapeType === 1 ? 1 : 1.2; // Larger for non-circular shapes
        const collisionRadius = size * collisionMultiplier;
        
        // Simple circular collision detection
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance < collisionRadius;
    }
}
