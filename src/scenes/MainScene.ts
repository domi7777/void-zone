import Phaser from 'phaser';
import { BackgroundGrid } from '../game/BackgroundGrid';
import { Obstacle } from '../game/Obstacle';
import { GameConfig } from '../config/GameConfig';
import { Player } from '../game/Player';

export default class MainScene extends Phaser.Scene {
  private player!: Player;
  private backgroundGrid!: BackgroundGrid;
  private targetX: number = 0;
  private targetY: number = 0;
  private readonly moveSpeed: number = GameConfig.PLAYER.MOVEMENT_SPEED;

  // Obstacle management
  private obstacles: Obstacle[] = [];
  private nextObstacleSpawn: number = 0;
  private readonly obstacleSpeed: number = GameConfig.OBSTACLES.SPEED;
  private readonly spawnInterval: number = GameConfig.OBSTACLES.SPAWN_INTERVAL;

  // Score and lives tracking
  private score: number = 0;
  private lives: number = GameConfig.SCORING.STARTING_LIVES;
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private isInvulnerable: boolean = false;
  private readonly invulnerabilityTime: number = GameConfig.PLAYER.INVULNERABILITY_TIME;
  
  // Game over overlay
  private gameOverContainer!: Phaser.GameObjects.Container;
  private isGameOver: boolean = false;

  constructor() {
    super('MainScene');
  }

  create() {
    this.backgroundGrid = new BackgroundGrid(this);

    // Create player at the center bottom of the screen
    const centerX = this.cameras.main.width / 2;
    const playerY = this.cameras.main.height - 100;
    this.player = new Player(this, centerX, playerY);
    
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

    // Add score and lives text
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '32px',
      color: '#fff'
    });
    
    this.livesText = this.add.text(16, 56, `Lives: ${this.lives}`, {
      fontSize: '32px',
      color: '#fff'
    });

    // Create game over overlay (hidden by default)
    this.createGameOverOverlay();
    
    // Start score incrementing
    this.time.addEvent({
      delay: GameConfig.SCORING.TICK_INTERVAL,
      callback: () => {
        if (!this.isGameOver) {
          this.score += GameConfig.SCORING.POINTS_PER_TICK;
          this.scoreText.setText(`Score: ${this.score}`);
        }
      },
      loop: true
    });

    // Set initial spawn time
    this.nextObstacleSpawn = 0;
  }

  update(time: number) {
    if (this.isGameOver) return;
    
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
    // Reduce lives
    this.lives--;
    this.livesText.setText(`Lives: ${this.lives}`);

    if (this.lives <= 0) {
      this.showGameOver();
      return;
    }

    // Set invulnerability
    this.isInvulnerable = true;
    
    // Visual feedback - start with red flashing
    this.player.setColor(0xff0000);
    
    // Screen shake effect
    this.cameras.main.shake(200, 0.01);
    
    // Deduct points and lives
    this.score = Math.max(0, this.score - GameConfig.SCORING.COLLISION_PENALTY);
    this.lives--;
    this.scoreText.setText(`Score: ${this.score}`);
    this.livesText.setText(`Lives: ${this.lives}`);
    
    // Check for game over
    if (this.lives <= 0) {
      this.showGameOver();
      return;
    }
    
    // Flash red for 500ms
    this.tweens.add({
      targets: this.player,
      alpha: 0.5,
      duration: 100,
      yoyo: true,
      repeat: 4, // 5 flashes total in 500ms
      onComplete: () => {
        // Switch to green flashing after red period
        this.player.setColor(0x00ff00);
        
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

  private createGameOverOverlay(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // Create container for game over elements
    this.gameOverContainer = this.add.container(0, 0);
    
    // Add semi-transparent background
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
    overlay.setOrigin(0, 0);
    
    // Add game over text
    const gameOverText = this.add.text(width / 2, height / 2 - 50, 'GAME OVER', {
      fontSize: '64px',
      color: '#ff0000',
      fontStyle: 'bold'
    });
    gameOverText.setOrigin(0.5);
    
    // Add score text
    const finalScoreText = this.add.text(width / 2, height / 2 + 30, '', {
      fontSize: '32px',
      color: '#ffffff'
    });
    finalScoreText.setOrigin(0.5);
    
    // Add try again button
    const tryAgainButton = this.add.rectangle(width / 2, height / 2 + 100, 200, 50, 0x00ff00, 0.8);
    tryAgainButton.setInteractive({ useHandCursor: true });
    
    const buttonText = this.add.text(width / 2, height / 2 + 100, 'Try Again?', {
      fontSize: '24px',
      color: '#ffffff'
    });
    buttonText.setOrigin(0.5);
    
    // Add hover effects
    tryAgainButton.on('pointerover', () => {
      tryAgainButton.setFillStyle(0x00ff00, 1);
      buttonText.setScale(1.1);
    });
    
    tryAgainButton.on('pointerout', () => {
      tryAgainButton.setFillStyle(0x00ff00, 0.8);
      buttonText.setScale(1);
    });
    
    // Add click handler with visual feedback
    tryAgainButton.on('pointerdown', () => {
      tryAgainButton.setFillStyle(0x008800, 1);
      buttonText.setScale(0.9);
      this.time.delayedCall(100, () => this.restartGame());
    });
    
    // Add all elements to container
    this.gameOverContainer.add([overlay, gameOverText, finalScoreText, tryAgainButton, buttonText]);
    
    // Hide container initially
    this.gameOverContainer.setVisible(false);
  }

  private showGameOver(): void {
    this.isGameOver = true;
    this.gameOverContainer.setVisible(true);
    
    // Update final score
    const finalScoreText = this.gameOverContainer.list[2] as Phaser.GameObjects.Text;
    finalScoreText.setText(`Final Score: ${this.score}`);
    
    // Stop gameplay
    this.obstacles.forEach(obstacle => obstacle.destroy());
    this.obstacles = [];
  }

  private restartGame(): void {
    this.isGameOver = false;
    this.gameOverContainer.setVisible(false);
    this.score = 0;
    this.lives = GameConfig.SCORING.STARTING_LIVES;
    this.scoreText.setText('Score: 0');
    this.livesText.setText(`Lives: ${this.lives}`);
    this.isInvulnerable = false;
    
    // Reset player
    const centerX = this.cameras.main.width / 2;
    const playerY = this.cameras.main.height - 100;
    this.player.setPosition(centerX, playerY);
    this.player.setColor(0x00ff00);
    this.player.setAlpha(1);
    
    // Clear obstacles
    this.obstacles.forEach(obstacle => obstacle.destroy());
    this.obstacles = [];
    
    // Reset spawn timer
    this.nextObstacleSpawn = 0;
  }
}
