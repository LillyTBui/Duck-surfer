const gameState = {
  score: 0,
  highScore: 0,
  lives: 3,
  music: true,
  displayFactor: 2,
  jump: false,
  difficulty: 1,
  fontFamily:
    'system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans","Liberation Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
};

const config = {
  type: Phaser.AUTO,
  backgroundColor: "90e0ef",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1200 * gameState.displayFactor,
    height: 800 * gameState.displayFactor,
  },
  parent: "game-container",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: -20 * gameState.displayFactor, y: 0 },
      enableBody: true,
      debug: false,
    },
  },
  scene: [BootScene, GameScene, PauseScene, EndScene],
};

const game = new Phaser.Game(config);
const gameContainer = document.querySelector("#game-container");
const loading = document.querySelector(".loading");

window.addEventListener("load", function () {
  loading.style.display = "none";
});
