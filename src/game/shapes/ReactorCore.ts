import type { ObstacleShape } from '../../types/GameTypes';

export class ReactorCore implements ObstacleShape {
    private readonly points = 6;

    draw(graphics: Phaser.GameObjects.Graphics, size: number): void {
        // Outer hexagon
        graphics.beginPath();
        for (let i = 0; i <= this.points; i++) {
            const angle = (Math.PI * 2 * i) / this.points - Math.PI / 2;
            const x = Math.cos(angle) * size;
            const y = Math.sin(angle) * size;
            if (i === 0) graphics.moveTo(x, y);
            else graphics.lineTo(x, y);
        }
        
        // Inner details - concentric hexagons with rotation
        for (let radius = size * 0.75; radius > size * 0.2; radius *= 0.6) {
            const rotation = (size - radius) * 0.1;
            graphics.moveTo(
                Math.cos(-Math.PI/2 + rotation) * radius,
                Math.sin(-Math.PI/2 + rotation) * radius
            );
            for (let i = 1; i <= this.points; i++) {
                const angle = (Math.PI * 2 * i) / this.points - Math.PI / 2 + rotation;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                graphics.lineTo(x, y);
            }
        }
    }

    getCollisionMultiplier(): number {
        return 1.0; // Regular hexagon collision
    }
}
