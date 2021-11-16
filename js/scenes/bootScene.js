class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }
  preload() {
    //Load common resources
    this.load.image("iconsettings", "../../images/icon-settings.png");
    this.load.image("iconpause", "../../images/icon-pause.png");
    this.load.image("iconexit", "../../images/icon-exit.png");
    this.load.image("iconsound", "../../images/icon-sound.png");
    this.load.image("iconplay", "../../images/icon-play.png");
    this.load.image("no-sound", "../../images/no-sound.png");
    this.load.image("low-sound", "../../images/low-sound.png");
    this.load.image("high-sound", "../../images/high-sound.png");
    this.load.image("heart", "../../images/heart.png");
    this.load.image("gameOver", "../../images/game-over.png");
    this.load.image("star", "../../images/star.png");
    this.load.image("frame", "../../images/frame.png");
    this.load.audio("background_music", "../../media/background.mp3");
    this.load.audio("click-sound", "../../media/select-click.mp3");
    this.load.audio("splash-sound", "../../media/splash-effect.mp3");
    this.load.audio("positive-sound", "../../media/positive-effect.mp3");
    this.load.audio("hit-sound", "../../media/hit-effect.mp3");
    this.load.audio("small-win", "../../media/small-win.mp3");
    this.load.audio("winning-sound", "../../media/winning-sound.mp3");
    this.load.audio("big-win", "../../media/big-win.mp3");
    this.load.audio("applause", "../../media/applause.mp3");
  }

  create() {
    // Playing music by default
    const volume = JSON.parse(localStorage.getItem("volume"));
    gameState.music = this.sound.add("background_music");
    gameState.music.loop = true;
    gameState.music.volume = volume;
    gameState.music.play();

    // Add sound effects:
    gameState.clickEffect = this.sound.add("click-sound");
    gameState.splashSound = this.sound.add("splash-sound");
    gameState.positiveSound = this.sound.add("positive-sound");
    gameState.hitSound = this.sound.add("hit-sound");
    gameState.smallWinningSound = this.sound.add("small-win");
    gameState.winningSound = this.sound.add("winning-sound");
    gameState.bigWinningSound = this.sound.add("big-win");
    gameState.applause = this.sound.add("applause");

    // Start game
    this.scene.start("GameScene");
  }

  update() {}
}
