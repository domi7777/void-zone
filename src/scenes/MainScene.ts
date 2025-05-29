import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
  private roadGraphics!: Phaser.GameObjects.Graphics;
  private spaceship!: Phaser.GameObjects.Triangle;
  private roadLines: Phaser.GameObjects.Line[] = [];
  private centerX!: number;

  constructor() {
    super('MainScene');
  }

  preload() {
    // Preload assets if needed
  }

  create() {
    this.centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Draw the road
    this.roadGraphics = this.add.graphics({ lineStyle: { width: 2, color: 0xffffff } });
    this.roadGraphics.fillStyle(0x333333, 1);
    this.roadGraphics.beginPath();
    this.roadGraphics.moveTo(this.centerX - 200, this.cameras.main.height);
    this.roadGraphics.lineTo(this.centerX, centerY);
    this.roadGraphics.lineTo(this.centerX + 200, this.cameras.main.height);
    this.roadGraphics.closePath();
    this.roadGraphics.fillPath();

    // Create horizontal lines for perspective
    for (let i = 0; i < 10; i++) {
      const y = this.cameras.main.height - i * 50;
      const startX = this.centerX - 200 + i * 20;
      const endX = this.centerX + 200 - i * 20;
      const line = this.add.line(0, 0, startX, y, endX, y, 0xffffff);
      line.setOrigin(0, 0);
      this.roadLines.push(line);
    }

    // Create the spaceship
    this.spaceship = this.add.triangle(this.centerX, this.cameras.main.height - 50, 0, 0, 40, 80, 80, 0, 0xffffff);
    this.spaceship.setOrigin(0.5, 0.5);

    // Add keyboard controls
    if (this.input.keyboard) {
      this.input.keyboard.on('keydown-LEFT', () => {
        this.spaceship.x -= 10;
      });
      this.input.keyboard.on('keydown-RIGHT', () => {
        this.spaceship.x += 10;
      });
    }
  }

  update() {
    // Move horizontal lines to simulate perspective motion
    this.roadLines.forEach((line, index) => {
      line.y += 5;
      if (line.y > this.cameras.main.height) {
        line.y = 0;
        const startX = this.centerX - 200 + index * 20;
        const endX = this.centerX + 200 - index * 20;
        line.setTo(startX, line.y, endX, line.y);
      }
    });
  }
}
