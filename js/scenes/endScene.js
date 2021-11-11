class EndScene extends Phaser.Scene {
    constructor() {
      super({ key: "EndScene" });
    }
    preload() {}
  
    create() {
      // Creating text on screen
      // this.add.text(this.cameras.main.width/3, centerY - 160, 'Game over!', {fill: '#FFFFFF', fontSize: '40px'})
  
      // Creating buttons on screen
      // gameState.menu = this.add.image(100, 40, 'iconmenu').setScale(.3).setInteractive();
      // gameState.continue = this.add.image(centerX, centerY - 80, 'iconcontinue').setScale(.3).setInteractive();
      // gameState.sound = this.add.image(centerX, centerY , 'iconsound').setScale(.3).setInteractive();
      // gameState.settings = this.add.image(centerX, centerY + 80, 'iconsettings').setScale(.3).setInteractive();
      // gameState.exit = this.add.image(centerX, centerY + 160, 'iconexit').setScale(.3).setInteractive();
      // gameState.howto = this.add.image(centerX, centerY + 240, 'iconhowtoplay').setScale(.3).setInteractive();
  
      // gameState.settings = this.add.image(100, 40, 'iconsettings').setScale(.3).setInteractive();
  
      //For scaling
      let scaleX = this.cameras.main.width / gameState.bgWave.width;
      let scaleY = this.cameras.main.height / gameState.bgWave.height;
      let scale = Math.max(scaleX, scaleY);
  
      let centerX = this.cameras.main.width / 2;
      let centerY = this.cameras.main.height / 2;
  
      this.add.image(centerX, centerY + 110, "frame").setScale(scale / 3.2);
      gameState.gameOver = this.add
        .image(centerX, centerY - 200 * gameState.displayFactor, "gameOver")
        .setScale(scale / 5);
      gameState.play = this.add
        .image(centerX, centerY + 50 * gameState.displayFactor, "iconplay")
        .setScale(scale / 3.6)
        .setInteractive();
      gameState.sound = this.add
        .image(centerX, centerY + 110 * gameState.displayFactor, "iconsound")
        .setScale(scale / 3.6)
        .setInteractive();
      gameState.exit = this.add
        .image(centerX, centerY + 170 * gameState.displayFactor, "iconexit")
        .setScale(scale / 3.6)
        .setInteractive();
  
      //show stars
      let score = JSON.parse(localStorage.getItem("score"));
  
      if (score == null) {
        score = 0;
      } else if (score < 10000) {
        this.add.image(centerX, centerY - 80, "star").setScale(scale / 2);
      } else if (score < 20000) {
        this.add.image(centerX - 60, centerY - 80, "star").setScale(scale / 2);
        this.add.image(centerX + 60, centerY - 80, "star").setScale(scale / 2);
      } else {
        this.add.image(centerX - 100, centerY - 80, "star").setScale(scale / 2);
        this.add.image(centerX + 100, centerY - 80, "star").setScale(scale / 2);
        this.add.image(centerX, centerY - 120, "star").setScale(scale / 2);
      }
  
      this.add.text(centerX - 90, centerY, `SCORE: ${score}`, {
        fontFamily: gameState.fontFamily,
        fontSize: "30px",
        fill: "#000000",
      });
  
      // Button functionality;
  
      // Start new game by pressing play
      gameState.play.on("pointerup", () => {
        gameState.clickEffect.play();
  
        this.scene.stop("EndScene");
        this.scene.start("GameScene");
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
  
      // Settings
      // gameState.settings.on('pointerup', () => {
  
      // })
  
      // Exit
      gameState.exit.on("pointerup", () => {
        gameState.clickEffect.play();
        window.location.replace("../../index.html");
      });
  
      // How to play
      // gameState.howto.on('pointerup', () => {
      //     document.getElementsByClassName('box-menu')
      // })
  
      // Button functions and styling shared by ALL buttons
      const endButtonList = [
        // gameState.menu,
        // gameState.continue,
        gameState.sound,
        gameState.settings,
        gameState.exit,
        // gameState.howto,
        gameState.play,
      ];
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
  
  // this.scene.restart()
  // this.pauseButtons.toggleVisible();
  // this.scene.bringToTop('GameScene');
  