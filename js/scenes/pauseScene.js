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

    //Set Music icon
    let soundIcon;
    setMusicIcon();

    function setMusicIcon() {
      if (gameState.music.volume == 0) {
        soundIcon = "no-sound";
      } else if (gameState.music.volume > 0 && gameState.music.volume <= 0.34) {
        soundIcon = "low-sound";
      } else if (gameState.music.volume > 0.34 && gameState.music.volume <= 0.67) {
        soundIcon = "iconsound";
      } else if (gameState.music.volume > 0.67 && gameState.music.volume <= 1) {
        soundIcon = "high-sound";
      }
    }

    this.add.image(centerX, centerY, "frame").setScale(scale / 4);
    gameState.play = this.add
      .image(centerX, centerY - 60 * gameState.displayFactor, "iconplay")
      .setScale(scale / 3.6)
      .setInteractive();
    gameState.sound = this.add
      .image(centerX, centerY, soundIcon)
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

    // Music settings:
    gameState.sound.on("pointerdown", () => {
      if (soundIcon == "no-sound") {
        gameState.music.volume = 0.33;
      } else if (soundIcon == "low-sound") {
        gameState.music.volume = 0.66;
      } else if (soundIcon == "iconsound") {
        gameState.music.volume = 1;
      } else if (soundIcon == "high-sound") {
        gameState.music.volume = 0;
      }
    });

    gameState.sound.on("pointerup", () => {
      gameState.clickEffect.play();
      setMusicIcon();
      gameState.sound.setTexture(soundIcon);
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
