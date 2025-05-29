import './style.css';
import Phaser from 'phaser';
import MainScene from './scenes/MainScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 390,  // iPhone-like width
  height: 844, // iPhone-like height
  backgroundColor: '#000000',
  scene: MainScene,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  // //fps
  // fps: {
  //   target: 30,
  //   forceSetTimeOut: true
  // },
  parent: 'game-container',
};

new Phaser.Game(config);
