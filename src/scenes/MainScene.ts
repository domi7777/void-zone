import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Triangle;
  private groundGrid!: Phaser.GameObjects.Graphics;
  
  // Perspective constants
  private readonly horizonY: number = 150;
  private readonly gridColumns: number = 12;
  private gridZ: number = 0;
  private readonly scrollSpeed: number = 4;
  private readonly cellSize: number = 60;
  private readonly maxDepth: number = 20;
  
  private pointer: Phaser.Input.Pointer | null = null;

  constructor() {
    super('MainScene');
  }

  create() {
    this.groundGrid = this.add.graphics();

    // Create player
    const centerX = this.cameras.main.width / 2;
    const playerY = this.cameras.main.height - 100;
    this.player = this.add.triangle(centerX, playerY, 0, 0, 20, 40, 40, 0, 0x00ff00);
    this.player.setOrigin(0.5, 0.5);

    // Setup touch input
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.pointer = pointer;
    });

    this.input.on('pointerup', () => {
      this.pointer = null;
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.pointer) {
        const deltaX = pointer.x - this.pointer.x;
        const deltaY = pointer.y - this.pointer.y;
        
        this.player.x = Phaser.Math.Clamp(
          this.player.x + deltaX,
          50,
          this.cameras.main.width - 50
        );
        this.player.y = Phaser.Math.Clamp(
          this.player.y + deltaY,
          this.cameras.main.height / 2,
          this.cameras.main.height - 50
        );
        
        this.pointer = pointer;
      }
    });
  }

  update() {
    this.gridZ = (this.gridZ - this.scrollSpeed + this.cellSize) % this.cellSize;
    this.updateGroundGrid();
  }

  private getScaledY(progress: number, height: number): number {
    // More linear scaling for classic arcade style
    return this.horizonY + (height - this.horizonY) * progress;
  }

  private updateGroundGrid() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    this.groundGrid.clear();
    this.groundGrid.lineStyle(1, 0x00ff00);

    // Calculate base dimensions
    const gridWidth = width * 1.5;
    const vanishingX = width / 2;
    const columnWidth = gridWidth / this.gridColumns;
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

      // Draw straight lines from bottom to horizon with linear perspective
      const numPoints = 50;
      for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        // Linear interpolation for vertical lines
        const y = this.horizonY + (height - this.horizonY) * (1 - t);
        const x = vanishingX + xOffset * (1 - t); // Linear perspective for x-coordinate
        this.groundGrid.lineTo(x, y);
      }

      this.groundGrid.strokePath();
    }
  }
}
