import type { ObstacleShape, Point } from '../../types/GameTypes';

export class EnergyCrystal implements ObstacleShape {
    draw(graphics: Phaser.GameObjects.Graphics, size: number): void {
        const points: Point[] = [
            { x: 0, y: -size },
            { x: size * 0.7, y: -size * 0.3 },
            { x: size * 0.7, y: size * 0.3 },
            { x: 0, y: size },
            { x: -size * 0.7, y: size * 0.3 },
            { x: -size * 0.7, y: -size * 0.3 }
        ];
        
        // Draw main crystal shape
        graphics.beginPath();
        graphics.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            graphics.lineTo(points[i].x, points[i].y);
        }
        graphics.closePath();
        
        // Draw internal facet lines
        graphics.moveTo(points[0].x, points[0].y);
        graphics.lineTo(points[3].x, points[3].y);
        graphics.moveTo(points[1].x, points[1].y);
        graphics.lineTo(points[4].x, points[4].y);
        graphics.moveTo(points[2].x, points[2].y);
        graphics.lineTo(points[5].x, points[5].y);
    }

    getCollisionMultiplier(): number {
        return 1.1; // Slightly larger for crystal edges
    }
}
