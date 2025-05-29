import Phaser from 'phaser';

export class BackgroundGrid {
    private groundGrid: Phaser.GameObjects.Graphics;
    private gridZ: number = 0;
    
    // Perspective constants
    private readonly horizonY: number = 150;
    private readonly gridColumns: number = 12;
    private readonly scrollSpeed: number = 4;
    private readonly cellSize: number = 60;
    private readonly maxDepth: number = 20;

    constructor(scene: Phaser.Scene) {
        this.groundGrid = scene.add.graphics();
    }

    update() {
        this.gridZ = (this.gridZ - this.scrollSpeed + this.cellSize) % this.cellSize;
        this.updateGroundGrid();
    }

    private updateGroundGrid() {
        const width = this.groundGrid.scene.cameras.main.width;
        const height = this.groundGrid.scene.cameras.main.height;
        
        this.groundGrid.clear();
        this.groundGrid.lineStyle(1, 0x00ff00);

        // Calculate base dimensions
        const gridWidth = width * 1.5;
        const vanishingX = width / 2;
        const totalDepth = this.cellSize * this.maxDepth;

        // Draw horizontal lines with increasing gaps
        for (let z = 0; z < totalDepth; z += this.cellSize) {
            const currentZ = (z + this.gridZ) % totalDepth;
            const t = 1 - (currentZ / totalDepth);
            const progress = Math.pow(t, 3);
            const y = this.horizonY + (height - this.horizonY) * progress;
            
            if (y >= this.horizonY && y <= height) {
                const lineStartX = 0;
                const lineEndX = width;
                
                this.groundGrid.beginPath();
                this.groundGrid.moveTo(lineStartX, y);
                this.groundGrid.lineTo(lineEndX, y);
                this.groundGrid.strokePath();
            }
        }

        // Draw vertical lines
        for (let col = 0; col <= this.gridColumns; col++) {
            // Calculate base position at bottom of screen
            const normalizedCol = col / this.gridColumns - 0.5; // -0.5 to 0.5
            const xOffset = normalizedCol * gridWidth;
            const startX = vanishingX + xOffset;
            
            this.groundGrid.beginPath();
            this.groundGrid.moveTo(startX, height);

            // Draw slightly curved lines from bottom to near horizon
            const numPoints = 50;
            const stopBeforeHorizon = -0; // pixels before horizon
            for (let i = 0; i <= numPoints; i++) {
                const t = i / numPoints;
                // Add subtle curve with quadratic easing
                const curve = t * t;
                const blend = 0.7; // Blend between linear and curved
                const y = this.horizonY + stopBeforeHorizon + (height - this.horizonY - stopBeforeHorizon) * (1 - t);
                const x = vanishingX + xOffset * (1 - (t * blend + curve * (1 - blend)));
                this.groundGrid.lineTo(x, y);
            }

            this.groundGrid.strokePath();
        }
    }
}
