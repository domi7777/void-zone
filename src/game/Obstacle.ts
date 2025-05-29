import Phaser from 'phaser';

export class Obstacle extends Phaser.GameObjects.Container {
    private readonly shape: Phaser.GameObjects.Graphics;
    private _rotation: number = 0;
    private readonly maxZ: number = 1000;
    private readonly baseSize: number = 40;
    private readonly shapeType: number;
    private readonly color: number;
    private _z: number;
    
    constructor(scene: Phaser.Scene, x: number, z: number) {
        super(scene, x, 0);
        scene.add.existing(this);
        
        this._z = z;
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
            case 0: // Spiked Star
                this.drawSpikedStar(size);
                break;
                
            case 1: // Reactor Core
                this.drawReactorCore(size);
                break;
                
            case 2: // Evil Eye
                this.drawEvilEye(size);
                break;
                
            case 3: // Energy Crystal
                this.drawEnergyCrystal(size);
                break;
        }
        
        this.shape.strokePath();
    }

    private drawSpikedStar(size: number) {
        const spikes = 8;
        const innerRadius = size * 0.4;
        const outerRadius = size;
        
        this.shape.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (Math.PI * 2 * i) / (spikes * 2);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            if (i === 0) this.shape.moveTo(x, y);
            else this.shape.lineTo(x, y);
        }
        this.shape.closePath();
        
        // Add inner details
        for (let i = 0; i < spikes; i++) {
            const angle = (Math.PI * 2 * i) / spikes;
            const x1 = Math.cos(angle) * innerRadius;
            const y1 = Math.sin(angle) * innerRadius;
            const x2 = Math.cos(angle + Math.PI) * innerRadius;
            const y2 = Math.sin(angle + Math.PI) * innerRadius;
            this.shape.moveTo(x1, y1);
            this.shape.lineTo(x2, y2);
        }
    }

    private drawReactorCore(size: number) {
        // Outer hexagon
        const points = 6;
        this.shape.beginPath();
        for (let i = 0; i <= points; i++) {
            const angle = (Math.PI * 2 * i) / points - Math.PI / 2;
            const x = Math.cos(angle) * size;
            const y = Math.sin(angle) * size;
            if (i === 0) this.shape.moveTo(x, y);
            else this.shape.lineTo(x, y);
        }
        
        // Inner details - concentric hexagons with rotation
        for (let radius = size * 0.75; radius > size * 0.2; radius *= 0.6) {
            const rotation = (size - radius) * 0.1;
            this.shape.moveTo(Math.cos(-Math.PI/2 + rotation) * radius, Math.sin(-Math.PI/2 + rotation) * radius);
            for (let i = 1; i <= points; i++) {
                const angle = (Math.PI * 2 * i) / points - Math.PI / 2 + rotation;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                this.shape.lineTo(x, y);
            }
        }
    }

    private drawEvilEye(size: number) {
        // Outer ring
        this.shape.beginPath();
        this.shape.arc(0, 0, size, 0, Math.PI * 2);
        
        // Inner ring
        const innerSize = size * 0.7;
        this.shape.arc(0, 0, innerSize, 0, Math.PI * 2);
        
        // Pupil
        const pupilSize = size * 0.3;
        this.shape.arc(0, 0, pupilSize, 0, Math.PI * 2);
        
        // Add spikes around the outer ring
        const spikes = 12;
        for (let i = 0; i < spikes; i++) {
            const angle = (Math.PI * 2 * i) / spikes;
            const x1 = Math.cos(angle) * size;
            const y1 = Math.sin(angle) * size;
            const x2 = Math.cos(angle) * (size * 1.2);
            const y2 = Math.sin(angle) * (size * 1.2);
            this.shape.moveTo(x1, y1);
            this.shape.lineTo(x2, y2);
        }
    }

    private drawEnergyCrystal(size: number) {
        // Main crystal shape
        const points = [
            { x: 0, y: -size },
            { x: size * 0.7, y: -size * 0.3 },
            { x: size * 0.7, y: size * 0.3 },
            { x: 0, y: size },
            { x: -size * 0.7, y: size * 0.3 },
            { x: -size * 0.7, y: -size * 0.3 }
        ];
        
        this.shape.beginPath();
        this.shape.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            this.shape.lineTo(points[i].x, points[i].y);
        }
        this.shape.closePath();
        
        // Internal lines for crystal facets
        this.shape.moveTo(points[0].x, points[0].y);
        this.shape.lineTo(points[3].x, points[3].y);
        this.shape.moveTo(points[1].x, points[1].y);
        this.shape.lineTo(points[4].x, points[4].y);
        this.shape.moveTo(points[2].x, points[2].y);
        this.shape.lineTo(points[5].x, points[5].y);
    }

    public preUpdate(time: number, delta: number): void {
        this._rotation = (this._rotation + delta * 0.001) % (Math.PI * 2);
        this.setRotation(this._rotation);
    }

    public update(speed: number): boolean {
        // Move obstacle closer
        this._z -= speed;
        
        // Update position and scale based on z
        const progress = this._z / this.maxZ;
        const screenHeight = this.scene.cameras.main.height;
        const horizonY = 150; // Should match BackgroundGrid's horizonY
        
        // Calculate y position with perspective
        this.y = horizonY + (screenHeight - horizonY) * (1 - progress);
        
        // Update visual size
        this.drawShape();
        
        return this._z <= 0;
    }

    private getScale(): number {
        const progress = this._z / this.maxZ;
        return Phaser.Math.Linear(3, 0.1, progress);
    }

    public isCollidingWith(player: Phaser.GameObjects.Triangle): boolean {
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
