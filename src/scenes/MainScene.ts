import Phaser from 'phaser';
import { BackgroundGrid } from '../game/BackgroundGrid';
import { Obstacle } from '../game/Obstacle';
import { GameConfig } from '../config/GameConfig';

export default class MainScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Triangle;
  private backgroundGrid!: BackgroundGrid;
  private targetX: number = 0;
  private targetY: number = 0;
  private readonly moveSpeed: number = GameConfig.PLAYER.MOVEMENT_SPEED;

  // Obstacle management
  private obstacles: Obstacle[] = [];
  private nextObstacleSpawn: number = 0;
  private readonly obstacleSpeed: number = GameConfig.OBSTACLES.SPEED;
  private readonly spawnInterval: number = GameConfig.OBSTACLES.SPAWN_INTERVAL;

  // Score tracking
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private isInvulnerable: boolean = false;
  private readonly invulnerabilityTime: number = GameConfig.PLAYER.INVULNERABILITY_TIME;

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

    // Add score text
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '32px',
      color: '#fff'
    });
    
    // Start score incrementing
    this.time.addEvent({
      delay: 100, // Increase score every 100ms
      callback: () => {
        this.score += 1;
        this.scoreText.setText(`Score: ${this.score}`);
      },
      loop: true
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
      if (!this.isInvulnerable && obstacle.isCollidingWith(this.player)) {
        this.handleCollision();
      }

      // Remove obstacle if it's passed the screen
      if (shouldRemove) {
        this.score += 10; // Bonus points for surviving an obstacle
        this.scoreText.setText(`Score: ${this.score}`);
        obstacle.destroy();
        this.obstacles.splice(i, 1);
      }
    }
  }

  private spawnObstacle() {
    const margin = GameConfig.OBSTACLES.SPAWN_MARGIN;
    const x = Phaser.Math.Between(margin, this.cameras.main.width - margin);
    const z = GameConfig.OBSTACLES.MAX_Z;
    const obstacle = new Obstacle(this, x, z);
    this.obstacles.push(obstacle);
  }

  private handleCollision() {
    // Set invulnerability
    this.isInvulnerable = true;
    
    // Visual feedback - start with red flashing
    this.player.setFillStyle(0xff0000);
    
    // Screen shake effect
    this.cameras.main.shake(200, 0.01);
    
    // Deduct points
    this.score = Math.max(0, this.score - 50);
    this.scoreText.setText(`Score: ${this.score}`);
    
    // Flash red for 500ms
    this.tweens.add({
      targets: this.player,
      alpha: 0.5,
      duration: 100,
      yoyo: true,
      repeat: 4, // 5 flashes total in 500ms
      onComplete: () => {
        // Switch to green flashing after red period
        this.player.setFillStyle(0x00ff00);
        
        const remainingTime = this.invulnerabilityTime - 500;
        const flashCount = Math.floor(remainingTime / 200); // 2 flashes per 200ms
        
        this.tweens.add({
          targets: this.player,
          alpha: 0.5,
          duration: 100,
          yoyo: true,
          repeat: flashCount * 2 - 1,
          onComplete: () => {
            this.player.setAlpha(1);
            this.isInvulnerable = false;
          }
        });
      }
    });
  }
}
