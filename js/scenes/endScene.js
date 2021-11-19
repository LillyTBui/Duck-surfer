class EndScene extends Phaser.Scene {
  constructor() {
    super({ key: "EndScene" });
  }
  preload() {}

  create() {
    //For scaling
    let scaleX = this.cameras.main.width / gameState.bgWave.width;
    let scaleY = this.cameras.main.height / gameState.bgWave.height;
    let scale = Math.max(scaleX, scaleY);

    let centerX = this.cameras.main.width / 2;
    let centerY = this.cameras.main.height / 2;

    // Set music Icon
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

    this.add.image(centerX, centerY + 110, "frame").setScale(scale / 2.8);
    gameState.gameOver = this.add
      .image(centerX, centerY - 200 * gameState.displayFactor, "gameOver")
      .setScale(scale / 5);
    gameState.play = this.add
      .image(centerX, centerY + 80 * gameState.displayFactor, "iconplay")
      .setScale(scale / 3.6)
      .setInteractive();
    gameState.sound = this.add
      .image(centerX, centerY + 140 * gameState.displayFactor, soundIcon)
      .setScale(scale / 3.6)
      .setInteractive();
    gameState.exit = this.add
      .image(centerX, centerY + 200 * gameState.displayFactor, "iconexit")
      .setScale(scale / 3.6)
      .setInteractive();

    //Play winning sound and show score + difficulty level
    let score = JSON.parse(localStorage.getItem("score"));
    let highscore = JSON.parse(localStorage.getItem("highscore"));
    let diff = JSON.parse(localStorage.getItem("difficultySetting"));
    let difficultyLevel = "";
    if (diff == 0.5){
      difficultyLevel = "EASY"
    } else if( diff == 1.5){
      difficultyLevel = "HARD"
    } else {
      difficultyLevel = "MEDIUM"
    }

    if (score >= highscore && score > 0) {
      gameState.applause.play();
      this.add.text(centerX - 120, centerY -50, "NEW HIGH SCORE!", {
        fontFamily: gameState.fontFamily,
        fontSize: "32px",
        fill: "#000000",
      });

      this.add.text(centerX - 120, centerY, `DIFFICULTY: ${difficultyLevel}`, {
        fontFamily: gameState.fontFamily,
        fontSize: "32px",
        fill: "#000000",
      });

      this.add.text(centerX - 120, centerY + 50, `SCORE: ${score}`, {
        fontFamily: gameState.fontFamily,
        fontSize: "30px",
        fill: "#000000",
      });
    } else {
      this.add.text(centerX - 120, centerY, `DIFFICULTY: ${difficultyLevel}`, {
        fontFamily: gameState.fontFamily,
        fontSize: "32px",
        fill: "#000000",
      });

      this.add.text(centerX - 120, centerY + 50, `SCORE: ${score}`, {
        fontFamily: gameState.fontFamily,
        fontSize: "30px",
        fill: "#000000",
      });
    }

    // Add stars based on score
    gameState.activeStars = [];
    if (score == null) {
      score = 0;
    } else if (score < 10000) {
      // Center
      gameState.starCenter = this.add.image(centerX, centerY - 110, "star").setScale(0.1);
      gameState.activeStars.push(gameState.starCenter);
      gameState.smallWinningSound.play();
    } else if (score < 20000) {
      // Left and right
      gameState.starLeft = this.add.image(centerX - 60, centerY - 110, "star").setScale(0.1);
      gameState.starRight = this.add.image(centerX + 60, centerY - 110, "star").setScale(0.1);
      gameState.activeStars.push(gameState.starLeft);
      gameState.activeStars.push(gameState.starRight);
      gameState.winningSound.play();
    } else {
      // Left, right and center
      gameState.starLeft = this.add.image(centerX - 100, centerY - 110, "star").setScale(0.1);
      gameState.starRight = this.add.image(centerX + 100, centerY - 110, "star").setScale(0.1);
      gameState.starCenter = this.add.image(centerX, centerY - 150, "star").setScale(0.1);
      gameState.activeStars.push(gameState.starLeft);
      gameState.activeStars.push(gameState.starRight);
      gameState.activeStars.push(gameState.starCenter);
      gameState.bigWinningSound.play();
    }
    // Star animation
    gameState.moveStars = this.tweens.add({
      targets: gameState.activeStars,
      scale: scale / 2,
      ease: "Linear",
      duration: 1000,
      repeat: 0,
      yoyo: false,
    });

    // Button functionality;

    // Start new game by pressing play
    gameState.play.on("pointerup", () => {
      gameState.clickEffect.play();

      this.scene.stop("EndScene");
      this.scene.start("GameScene");
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
      window.location.replace("../../index.html");
    });

    // Button functions and styling shared by ALL buttons
    const endButtonList = [gameState.sound, gameState.settings, gameState.exit, gameState.play];

    endButtonList.forEach((btn) => {
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
