import Phaser from 'phaser';
import { BackgroundGrid } from '../game/BackgroundGrid';
import { Obstacle } from '../game/Obstacle';

export default class MainScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Triangle;
  private backgroundGrid!: BackgroundGrid;
  private targetX: number = 0;
  private targetY: number = 0;
  private readonly moveSpeed: number = 0.03;

  // Obstacle management
  private obstacles: Obstacle[] = [];
  private nextObstacleSpawn: number = 0;
  private readonly obstacleSpeed: number = 5;
  private readonly spawnInterval: number = 2000; // ms between spawns

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

    // Set initial spawn time
    this.nextObstacleSpawn = 0;
  }

  update(time: number) {
    this.backgroundGrid.update();
    
    // Smoothly move player towards target position using lerp
    this.player.x = Phaser.Math.Linear(this.player.x, this.targetX, this.moveSpeed);
    this.player.y = Phaser.Math.Linear(this.player.y, this.targetY, this.moveSpeed);

    // Spawn new obstacles
    if (time > this.nextObstacleSpawn) {
      this.spawnObstacle();
      this.nextObstacleSpawn = time + this.spawnInterval;
    }

    // Update obstacles and check collisions
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obstacle = this.obstacles[i];
      const shouldRemove = obstacle.update(this.obstacleSpeed);

      // Check collision with player
      if (obstacle.isCollidingWith(this.player)) {
        // Flash the player red when hit
        this.player.setFillStyle(0xff0000);
        this.time.delayedCall(100, () => {
          this.player.setFillStyle(0x00ff00);
        });
      }

      // Remove obstacle if it's passed the screen
      if (shouldRemove) {
        obstacle.destroy();
        this.obstacles.splice(i, 1);
      }
    }
  }

  private spawnObstacle() {
    const x = Phaser.Math.Between(100, this.cameras.main.width - 100);
    const z = 1000; // Start from far away
    const obstacle = new Obstacle(this, x, z);
    this.obstacles.push(obstacle);
  }
}
