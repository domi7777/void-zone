import './style.css'
import Phaser from 'phaser';
import MainScene from './scenes/MainScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [MainScene],
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
};
new Phaser.Game(config);
