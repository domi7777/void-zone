import Phaser from 'phaser';

export class Player extends Phaser.GameObjects.Container {
    private playerGraphics: Phaser.GameObjects.Graphics;
    private glowGraphics: Phaser.GameObjects.Graphics;
    private color: number = 0x00ff00;
    
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        scene.add.existing(this);
        
        // Create player graphics
        this.playerGraphics = scene.add.graphics();
        this.glowGraphics = scene.add.graphics();
        this.add([this.glowGraphics, this.playerGraphics]);
        
        this.drawPlayer();
    }
    
    setColor(color: number): void {
        this.color = color;
        this.drawPlayer();
    }

    private drawPlayer(): void {
        // Clear previous graphics
        this.playerGraphics.clear();
        this.glowGraphics.clear();
        
        // Draw the player triangle
        this.playerGraphics.lineStyle(2, this.color, 1);
        this.playerGraphics.fillStyle(this.color, 0.3);
        this.playerGraphics.beginPath();
        this.playerGraphics.moveTo(0, -20);
        this.playerGraphics.lineTo(-20, 20);
        this.playerGraphics.lineTo(20, 20);
        this.playerGraphics.closePath();
        this.playerGraphics.strokePath();
        this.playerGraphics.fillPath();
        
        // Add glow effect
        this.glowGraphics.lineStyle(3, this.color, 0.3);
        this.glowGraphics.strokeCircle(0, 0, 25);
    }
    
    // Add methods needed for collision detection
    getTopLeft(): Phaser.Math.Vector2 {
        return new Phaser.Math.Vector2(this.x - 20, this.y - 20);
    }
    
    getTopCenter(): Phaser.Math.Vector2 {
        return new Phaser.Math.Vector2(this.x, this.y - 20);
    }
    
    getTopRight(): Phaser.Math.Vector2 {
        return new Phaser.Math.Vector2(this.x + 20, this.y - 20);
    }
    
    getCenter(): Phaser.Math.Vector2 {
        return new Phaser.Math.Vector2(this.x, this.y);
    }
    
    setTo(x: number, y: number): this {
        this.setPosition(x, y);
        return this;
    }
}
