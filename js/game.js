const gameState = {
  score: 0,
  highScore: 0,
  lives: 3,
  music: true,
  displayFactor: 2,
  jump: false,
  difficulty: 1,
};

const config = {
  type: Phaser.AUTO,
  backgroundColor: "90e0ef",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1200*gameState.displayFactor,
    height: 800*gameState.displayFactor,
  },
  parent: "game-container",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: -20*gameState.displayFactor, y: 0 },
      enableBody: true,
      debug: true,
    },
  },
  scene: [BootScene, GameScene, PauseScene, EndScene],
};

const game = new Phaser.Game(config);
