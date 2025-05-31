import type { ObstacleShape } from '../../types/GameTypes';

export class SpikedStar implements ObstacleShape {
    private readonly spikes = 8;

    draw(graphics: Phaser.GameObjects.Graphics, size: number): void {
        const innerRadius = size * 0.4;
        const outerRadius = size;
        
        graphics.beginPath();
        for (let i = 0; i < this.spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (Math.PI * 2 * i) / (this.spikes * 2);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            if (i === 0) graphics.moveTo(x, y);
            else graphics.lineTo(x, y);
        }
        graphics.closePath();
        
        // Add inner details
        for (let i = 0; i < this.spikes; i++) {
            const angle = (Math.PI * 2 * i) / this.spikes;
            const x1 = Math.cos(angle) * innerRadius;
            const y1 = Math.sin(angle) * innerRadius;
            const x2 = Math.cos(angle + Math.PI) * innerRadius;
            const y2 = Math.sin(angle + Math.PI) * innerRadius;
            graphics.moveTo(x1, y1);
            graphics.lineTo(x2, y2);
        }
    }

    getCollisionMultiplier(): number {
        return 1.2; // Star shape needs larger collision area
    }
}
