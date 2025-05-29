import Phaser from 'phaser';

interface GridLine {
  line: Phaser.GameObjects.Graphics;
  z: number;
}

export default class MainScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Triangle;
  private groundGrid!: Phaser.GameObjects.Graphics;
  private readonly horizonY: number = 200;
  private readonly gridSpacing: number = 50;
  private readonly maxZ: number = 1000;
  private pointer: Phaser.Input.Pointer | null = null;
  private gridOffset: number = 0;
  private readonly verticalLines: number = 10; // Number of vertical lines on each side

  constructor() {
    super('MainScene');
  }

  create() {
    // Create ground grid
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
        
        // Move player with constraints
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
        
        // Update pointer position
        this.pointer = pointer;
      }
    });
  }

  update() {
    // Update grid offset for scrolling effect
    this.gridOffset = (this.gridOffset + 2) % this.gridSpacing;
    this.updateGroundGrid();
  }

  private updateGroundGrid() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const vanishingPointX = width / 2;
    const groundY = height;

    this.groundGrid.clear();
    this.groundGrid.lineStyle(1, 0x00ff00);

    // Draw horizontal lines with perspective
    for (let z = this.gridOffset; z < this.maxZ; z += this.gridSpacing) {
      const perspective = 1 - (z / this.maxZ);
      const y = this.horizonY + (groundY - this.horizonY) * perspective;
      
      // Calculate width at this depth
      const lineWidth = width * (1 - perspective * 0.8); // 0.8 to keep some width at horizon
      
      // Draw horizontal line
      this.groundGrid.beginPath();
      this.groundGrid.moveTo(vanishingPointX - lineWidth / 2, y);
      this.groundGrid.lineTo(vanishingPointX + lineWidth / 2, y);
      this.groundGrid.strokePath();
    }

    // Draw vertical lines converging to vanishing point
    for (let i = -this.verticalLines; i <= this.verticalLines; i++) {
      const xRatio = i / this.verticalLines;
      const startX = vanishingPointX + width * 0.5 * xRatio;
      
      this.groundGrid.beginPath();
      this.groundGrid.moveTo(startX, groundY);
      this.groundGrid.lineTo(vanishingPointX, this.horizonY);
      this.groundGrid.strokePath();
    }
  }
}
