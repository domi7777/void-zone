import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Triangle;
  private groundGrid!: Phaser.GameObjects.Graphics;
  
  // Perspective constants
  private readonly horizonY: number = 150;
  private readonly gridColumns: number = 12; // More vertical lines for better effect
  private gridZ: number = 0;
  private readonly scrollSpeed: number = 4;
  private readonly cellSize: number = 60; // Smaller cells for denser grid
  private readonly maxDepth: number = 15; // More depth for smoother perspective
  
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
    // Only update Z position for horizontal line movement
    this.gridZ = (this.gridZ + this.scrollSpeed) % this.cellSize;
    this.updateGroundGrid();
  }

  private projectPoint(x: number, z: number, width: number, height: number): { screenX: number, screenY: number } {
    const centerX = width / 2;
    const vanishingPointY = this.horizonY;
    
    // Improved perspective calculation
    const distance = z + 100; // Add minimum distance to prevent extreme distortion
    const scale = 1 - (z / (this.maxDepth * this.cellSize));
    const perspectiveY = vanishingPointY + (height - vanishingPointY) * scale;
    
    // Scale X based on Y position
    const xScale = (perspectiveY - vanishingPointY) / (height - vanishingPointY);
    const screenX = centerX + (x * xScale);

    return {
      screenX,
      screenY: perspectiveY
    };
  }

  private updateGroundGrid() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    this.groundGrid.clear();
    this.groundGrid.lineStyle(1, 0x00ff00);

    // Draw vertical lines first (fixed position)
    const gridWidth = width * 1.2; // Slightly wider than screen
    const startX = -gridWidth / 2;
    const columnWidth = gridWidth / this.gridColumns;

    // Draw vertical lines
    for (let col = 0; col <= this.gridColumns; col++) {
      const x = startX + col * columnWidth;
      this.groundGrid.beginPath();
      this.groundGrid.moveTo(
        width / 2 + x * ((height - this.horizonY) / (height - this.horizonY)),
        height
      );
      this.groundGrid.lineTo(width / 2 + x * 0.1, this.horizonY);
      this.groundGrid.strokePath();
    }

    // Draw horizontal lines
    for (let z = this.gridZ; z < this.cellSize * this.maxDepth; z += this.cellSize) {
      const y = this.projectPoint(0, z, width, height).screenY;
      
      if (y >= this.horizonY && y <= height) {
        const perspectiveScale = (y - this.horizonY) / (height - this.horizonY);
        const lineWidth = gridWidth * perspectiveScale;
        
        this.groundGrid.beginPath();
        this.groundGrid.moveTo(width / 2 - lineWidth / 2, y);
        this.groundGrid.lineTo(width / 2 + lineWidth / 2, y);
        this.groundGrid.strokePath();
      }
    }
  }
}
