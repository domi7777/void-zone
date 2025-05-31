import './style.css';
import Phaser from 'phaser';
import MainScene from './scenes/MainScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 390,  // iPhone-like width
  height: 844, // iPhone-like height
  backgroundColor: '#000000',
  scene: MainScene,
  pixelArt: false, // Enable anti-aliasing
  antialias: true, // Enable anti-aliasing
  roundPixels: false, // Disable pixel rounding for smoother graphics
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    autoRound: false, // Prevent pixel rounding
    zoom: window.devicePixelRatio // Use zoom for high DPI instead of resolution
  },
  parent: 'game-container',
};

new Phaser.Game(config);
