import type { ObstacleShape } from '../../types/GameTypes';

export class EvilEye implements ObstacleShape {
    private readonly spikes = 12;

    draw(graphics: Phaser.GameObjects.Graphics, size: number): void {
        // Outer ring
        graphics.beginPath();
        graphics.arc(0, 0, size, 0, Math.PI * 2);
        
        // Inner ring
        const innerSize = size * 0.7;
        graphics.arc(0, 0, innerSize, 0, Math.PI * 2);
        
        // Pupil
        const pupilSize = size * 0.3;
        graphics.arc(0, 0, pupilSize, 0, Math.PI * 2);
        
        // Add spikes around the outer ring
        for (let i = 0; i < this.spikes; i++) {
            const angle = (Math.PI * 2 * i) / this.spikes;
            const x1 = Math.cos(angle) * size;
            const y1 = Math.sin(angle) * size;
            const x2 = Math.cos(angle) * (size * 1.2);
            const y2 = Math.sin(angle) * (size * 1.2);
            graphics.moveTo(x1, y1);
            graphics.lineTo(x2, y2);
        }
    }

    getCollisionMultiplier(): number {
        return 1.2; // Account for spikes
    }
}
