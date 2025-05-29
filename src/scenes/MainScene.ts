import Phaser from 'phaser';
import { BackgroundGrid } from '../game/BackgroundGrid';

export default class MainScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Triangle;
  private backgroundGrid!: BackgroundGrid;
  private targetX: number = 0;
  private targetY: number = 0;
  private readonly moveSpeed: number = 0.03; // Adjust this value to change movement speed (0-1)

  constructor() {
    super('MainScene');
  }

  create() {
    this.backgroundGrid = new BackgroundGrid(this);

    // Create player
    const centerX = this.cameras.main.width / 2;
    const playerY = this.cameras.main.height - 100;
    this.player = this.add.triangle(centerX, playerY, 0, 0, 20, 40, 40, 0, 0x00ff00);
    this.player.setOrigin(0.5, 0.5);
    
    // Initialize target position to player's starting position
    this.targetX = centerX;
    this.targetY = playerY;

    // Update target position on pointer move
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.targetX = Phaser.Math.Clamp(
        pointer.x,
        50,
        this.cameras.main.width - 50
      );
      this.targetY = Phaser.Math.Clamp(
        pointer.y,
        this.cameras.main.height / 2,
        this.cameras.main.height - 50
      );
    });
  }

  update() {
    this.backgroundGrid.update();
    
    // Smoothly move player towards target position using lerp
    this.player.x = Phaser.Math.Linear(this.player.x, this.targetX, this.moveSpeed);
    this.player.y = Phaser.Math.Linear(this.player.y, this.targetY, this.moveSpeed);
  }
}
