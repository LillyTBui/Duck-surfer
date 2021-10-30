/* Change log
// 30.10    Lilly
// 1 Merget med main
// 2 lagd 2 separate spritesheet for bakgrunn og bølgen er foran spilleren
// 3 separert and (gameState.duck) og brett (gameState.board), de har egne rammer og er gruppert i en container 
    (linje.139-141)
// 4 lagt til icon for play og icon for spørsmålstegn
// 5 ordnet highscore. highscoren blir fjernet på index.html. spilleren får da egen progresjon i game.html 
    og highscoren blir bare borte hvis spilleren går ut av game.html.
// 6 Forandret litt på waveEnd slik at den ikke synes.
// 7 La til blå bakgrunnsfarge i game.js 
// 8 scale spilleren slik som bakgrunnen (linje 123 og linje 139*/

const id = JSON.parse(localStorage.getItem("surfboard"));
let key;
let key2;

if (id === "1") {
  key = "sprite1";
  key2 = "sprite1-board";
} else if (id === "2") {
  key = "sprite2";
  key2 = "sprite2-board";
} else {
  key = "sprite3";
  key2 = "sprite3-board";
}

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.image("bgEnd", "../../images/background_end2.png");
    this.load.image("shark", "../../images/shark.png");
    this.load.image("iceblock", "../../images/ice_block.png");
    this.load.spritesheet("bg", "../../images/game_background.png", {
      frameHeight: 1200,
      frameWidth: 1200,
    });
    this.load.spritesheet("bgWave", "../../images/game_background-wave.png", {
      frameHeight: 1200,
      frameWidth: 1200,
    });

    //green player
    this.load.spritesheet("sprite1", "../../images/green-duck.png", { frameWidth: 644, frameHeight: 335 });
    this.load.spritesheet("sprite1-board", "../../images/green-board.png", { frameWidth: 644, frameHeight: 335 });

    //gray player
    this.load.spritesheet("sprite2", "../../images/gray-duck.png", { frameWidth: 644, frameHeight: 335 });
    this.load.spritesheet("sprite2-board", "../../images/gray-board.png", { frameWidth: 644, frameHeight: 335 });

    //pink player
    this.load.spritesheet("sprite3", "../../images/pink-duck.png", { frameWidth: 644, frameHeight: 335 });
    this.load.spritesheet("sprite3-board", "../../images/pink-board.png", { frameWidth: 644, frameHeight: 335 });
  }

  create() {
    // Cursor input
    gameState.cursors = this.input.keyboard.createCursorKeys();

    // waveEnd - platform to the far left that respawns enemies / kills player
    const waveEnd = this.physics.add.staticGroup();
    waveEnd
      .create(-14, this.cameras.main.height / 2, "bgEnd")
      .setScale(1, 1.5)
      .refreshBody();

    // Main background animation
    gameState.bg = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, "bg");
    this.anims.create({
      key: "background",
      frames: this.anims.generateFrameNumbers("bg", {
        start: 0,
        end: 4,
      }),
      frameRate: 7,
      repeat: -1,
    });
    gameState.bg.anims.play("background", true);

    // Wave animation
    gameState.bgWave = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, "bgWave");
    this.anims.create({
      key: "wave",
      frames: this.anims.generateFrameNumbers("bgWave", {
        start: 0,
        end: 4,
      }),
      frameRate: 7,
      repeat: -1,
    });
    gameState.bgWave.anims.play("wave", true);

    // Scaling
    let scaleX = this.cameras.main.width / gameState.bgWave.width;
    let scaleY = this.cameras.main.height / gameState.bgWave.height;
    let scale = Math.max(scaleX, scaleY);
    gameState.bg.setScale(scale).setScrollFactor(0);
    gameState.bgWave.setScale(scale).setScrollFactor(0);

    //Place wave animation in front of the player
    gameState.bgWave.depth = 100;

    // Player animation

    //Add board and its animation
    gameState.board = this.physics.add.sprite(400, 100, key2);
    gameState.board.setSize(380, 100);
    gameState.board.setOffset(250, 190);
    gameState.board.setCollideWorldBounds(true);

    this.anims.create({
      key: "movement-board",
      frames: this.anims.generateFrameNumbers(key2, { start: 0, end: 5 }),
      frameRate: 9,
      repeat: -1,
    });

    gameState.board.anims.play("movement-board", true);
    gameState.board.setScale(scale / 2.5).setScrollFactor(0); //scale board sprite

    //Add duck and its animation
    gameState.duck = this.physics.add.sprite(400, 100, key);
    gameState.duck.setSize(140, 220, true);
    gameState.duck.setOffset(340, 20);
    gameState.duck.setCollideWorldBounds(true);

    this.anims.create({
      key: "movement-duck",
      frames: this.anims.generateFrameNumbers(key, { start: 0, end: 5 }),
      frameRate: 9,
      repeat: -1,
    });

    gameState.duck.anims.play("movement-duck", true);
    gameState.duck.setScale(scale / 2.5).setScrollFactor(0); //scale duck sprite

    //Place duck and board in its own container
    gameState.player = this.add.container(400, 300);
    gameState.player.add(gameState.board);
    gameState.player.add(gameState.duck);

    //Menu button
    gameState.menu = this.add.image(100, 40, "iconmenu").setScale(0.3).setInteractive();

    //ButtonBAR functionality
    gameState.menu.on("pointerover", () => {
      gameState.menu.setScale(0.4);
    });
    gameState.menu.on("pointerout", () => {
      gameState.menu.setScale(0.3);
    });
    gameState.menu.on("pointerdown", () => {
      gameState.menu.setScale(0.45);
    });
    gameState.menu.on("pointerup", () => {
      gameState.menu.setScale(0.3);
    });

    // Menu
    gameState.menu.on("pointerup", () => {
      this.scene.pause("GameScene");
      this.scene.launch("PauseScene");
    });

    // Score text
    let highScore = JSON.parse(localStorage.getItem("highscore"));
    if (highScore == null) {
      highScore = 0;
    }
    gameState.scoreText = this.add.text(this.cameras.main.width / 2, 10, "Score: 0", {
      fontSize: "20px",
      fill: "#000000",
    });
    gameState.highScoreText = this.add.text(this.cameras.main.width / 2 + 200, 10, `High score: ${highScore}`, {
      fontSize: "20px",
      fill: "#000000",
    });

    //Kill by waveEnd
    this.physics.add.overlap(gameState.board, waveEnd, () => {
      this.add.text(
        this.cameras.main.width / 3,
        this.cameras.main.height / 2 - 230,
        "Oops! You got caught by the wave!",
        { fontSize: "30px", fill: "#000000" }
      );
      this.scene.pause("GameScene");
      this.scene.launch("EndScene");
      if (gameState.score > highScore) {
        highScore = gameState.score;
        localStorage.setItem("highscore", JSON.stringify(highScore));
        gameState.highScoreText.setText(`High score: ${highScore}`);
        this.add.text(
          this.cameras.main.width / 3,
          this.cameras.main.height / 2 - 190,
          `But YAY! New High Score: ${highScore}`,
          { fontSize: "30px", fill: "#000000" }
        );
      }
    });

    //Enemies

    const enemies = this.physics.add.group();

    const enemyList = ["shark", "iceblock"];

    function enemyGen() {
      const yCoord = Math.random() * this.cameras.main.height + this.cameras.main.height / 8;
      let randomEnemies = enemyList[Math.floor(Math.random() * enemyList.length)];
      enemies.create(this.cameras.main.width, yCoord, randomEnemies).setScale(0.3);
    }
    // Enemy loop
    const enemyGenLoop = this.time.addEvent({
      delay: 3500,
      callback: enemyGen,
      callbackScope: this,
      loop: true,
    });

    // Remove enemies
    this.physics.add.overlap(enemies, waveEnd, function (enemy) {
      enemy.destroy();
      //Avoiding sharks adds score
      gameState.score += 10;
      gameState.scoreText.setText(`Score: ${gameState.score}`);
    });

    // Kill by enemies
    this.physics.add.overlap(gameState.duck, enemies, () => {
      this.add.text(this.cameras.main.width / 3, this.cameras.main.height / 2 - 230, `Ouch! You got hit!`, {
        fontSize: "30px",
        fill: "#000000",
      });
      this.scene.pause("GameScene");
      this.scene.launch("EndScene");

      if (gameState.score > highScore) {
        highScore = gameState.score;
        localStorage.setItem("highscore", JSON.stringify(highScore));
        gameState.highScoreText.setText(`High score: ${highScore}`);
        this.add.text(
          this.cameras.main.width / 3,
          this.cameras.main.height / 2 - 190,
          `But YAY! New High Score: ${highScore}`,
          { fontSize: "30px", fill: "#000000" }
        );
      }
    });

    this.physics.add.overlap(gameState.board, enemies, () => {
      this.add.text(this.cameras.main.width / 3, this.cameras.main.height / 2 - 230, `Ouch! You got hit!`, {
        fontSize: "30px",
        fill: "#000000",
      });
      this.scene.pause("GameScene");
      this.scene.launch("EndScene");

      if (gameState.score > highScore) {
        highScore = gameState.score;
        localStorage.setItem("highscore", JSON.stringify(highScore));
        gameState.highScoreText.setText(`High score: ${highScore}`);
        this.add.text(
          this.cameras.main.width / 3,
          this.cameras.main.height / 2 - 190,
          `But YAY! New High Score: ${highScore}`,
          { fontSize: "30px", fill: "#000000" }
        );
      }
    });
  }

  update() {
    //Movement + gravity effects to simulate motion of waves
    if (gameState.cursors.right.isDown) {
      gameState.player.x += 3;
      gameState.duck.setGravity(100, 30);
      gameState.board.setGravity(100, 30);
    } else if (gameState.cursors.left.isDown) {
      gameState.player.x -= 2;
      gameState.duck.setGravity(-50, -40);
      gameState.board.setGravity(-50, -40);
    } else if (gameState.cursors.up.isDown) {
      gameState.player.y -= 3;
      gameState.duck.setGravity(-40, -40);
      gameState.board.setGravity(-40, -40);
    } else if (gameState.cursors.down.isDown) {
      gameState.player.y += 3;
      gameState.duck.setGravity(30, 60);
      gameState.board.setGravity(30, 60);
    } else {
      gameState.duck.setGravity(-20, -40);
      gameState.board.setGravity(-20, -40);
    }

    //Pause game by pressing space
    if (gameState.cursors.space.isDown) {
      this.scene.pause("GameScene");
      this.scene.launch("PauseScene");
    }
  }
}
