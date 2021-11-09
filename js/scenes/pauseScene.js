class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: "PauseScene" });
  }
  preload() {}

  create() {
    let scaleX = this.cameras.main.width / gameState.bgWave.width;
    let scaleY = this.cameras.main.height / gameState.bgWave.height;
    let scale = Math.max(scaleX, scaleY);

    let centerX = this.cameras.main.width / 2;
    let centerY = this.cameras.main.height / 2;

    this.add.image(centerX, centerY, "frame").setScale(scale / 4);
    gameState.play = this.add
      .image(centerX, centerY - 60 * gameState.displayFactor, "iconplay")
      .setScale(scale / 3.6)
      .setInteractive();
    gameState.sound = this.add
      .image(centerX, centerY, "iconsound")
      .setScale(scale / 3.6)
      .setInteractive();
    gameState.exit = this.add
      .image(centerX, centerY + 60 * gameState.displayFactor, "iconexit")
      .setScale(scale / 3.6)
      .setInteractive();

    // Button functionality;
    // Continue game by pressing play
    gameState.play.on("pointerup", () => {
      gameState.clickEffect.play();
      this.scene.stop("PauseScene");
      this.scene.resume("GameScene");
    });

    // Music: switch on or off
    var musicPlaying = true;
    gameState.sound.on("pointerup", () => {
      gameState.clickEffect.play();
      if (musicPlaying) {
        gameState.music.pause();
        musicPlaying = false;
      } else {
        gameState.music.resume();
        musicPlaying = true;
      }
    });

    // Exit
    gameState.exit.on("pointerup", () => {
      gameState.clickEffect.play();
      window.location.replace("/../../index.html");
    });

    // Button functions and styling shared by ALL buttons
    const pauseButtonList = [gameState.sound, gameState.exit, gameState.play];
    pauseButtonList.forEach((btn) => {
      btn.on("pointerover", () => {
        btn.setScale(scale / 3);
      });
      btn.on("pointerout", () => {
        btn.setScale(scale / 3.6);
      });
      btn.on("pointerdown", () => {
        btn.setScale(scale / 2.7);
      });
      btn.on("pointerup", () => {
        btn.setScale(scale / 3.6);
      });
    });
  }

  update() {}
}
