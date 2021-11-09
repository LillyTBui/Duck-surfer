/* Change log
// 8.11 Johannes
  Prøver å låse aspektet så man viser hele bølgen. Tanker?? (game.js linje 14-19)
  La inn hoppefunksjon over bølgen (så man faller ned på bølgen igjen) (linje 229-240 pluss update())
  Jobber med en vanskelighetsgrad, men ikke funnet helt ut av det ennå.

// 9.11 lilly
  lagt til lyd på knappene
  index knappene og brettene blir litt større når man hover over dem
  byttet audio type fra ogg til mp3
  fjernet oppløsning fra index siden
  lagt til samme font family i spill teksten som blir brukt på index siden

  NB! klikke lyden funker også på exit knappene men siden blir 
  redirektet til index siden så fort at den ikke blir spilt av
*/

const id = JSON.parse(localStorage.getItem("surfboard"));
let key;

if (id === "1") {
  key = "sprite1";
} else if (id === "2") {
  key = "sprite2";
} else {
  key = "sprite3";
}

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.image("bgEnd", "../../images/background_end2.png");
    this.load.image("shark", "../../images/shark.png");
    this.load.image("iceblock", "../../images/ice_block.png");

    //background
    this.load.spritesheet("bgWave", "../../images/test-background.png", {
      frameHeight: 1200,
      frameWidth: 1200,
    });
    this.load.spritesheet("bgWave2", "../../images/test-bølge.png", {
      frameHeight: 1200,
      frameWidth: 1200,
    });
    this.load.image("waveTop", "../../images/waveTop.png");

    //sprite
    this.load.spritesheet("sprite1", "../../images/spritesheet-green.png", { frameWidth: 644, frameHeight: 335 });
    this.load.spritesheet("sprite2", "../../images/spritesheet-gray.png", { frameWidth: 644, frameHeight: 335 });
    this.load.spritesheet("sprite3", "../../images/spritesheet-pink.png", { frameWidth: 644, frameHeight: 335 });
  }

  create() {
    // !Ikke implementert ennå !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Center values
    let centerX = this.cameras.main.width / 2;
    let centerY = this.cameras.main.height / 2;

    // Cursor input
    gameState.cursors = this.input.keyboard.createCursorKeys();

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Difficulty level
    gameState.difficulty = 1;

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // WaveTop
    const waveTopUpper = this.physics.add.staticGroup();
    waveTopUpper
      .create(this.cameras.main.width / 2, this.cameras.main.height / 11, "waveTop")
      .setScale(gameState.displayFactor, 5)
      .refreshBody();

    const waveTopLower = this.physics.add.staticGroup();
    waveTopLower
      .create(this.cameras.main.width / 2, this.cameras.main.height / 5, "waveTop")
      .setScale(gameState.displayFactor, 2)
      .refreshBody();

    // waveEnd - platform to the far left that respawns enemies / kills player
    const waveEnd = this.physics.add.staticGroup();
    waveEnd
      .create(-14, this.cameras.main.height / 2, "bgEnd")
      .setScale(1, 1.5)
      .refreshBody();

    // Sprite background wave animation
    gameState.bgWave = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, "bgWave");
    this.anims.create({
      key: "wave",
      frames: this.anims.generateFrameNumbers("bgWave", {
        start: 0,
        end: 6,
      }),
      frameRate: 7,
      repeat: -1,
    });
    gameState.bgWave.anims.play("wave", true);

    //sprite background wave animation 2
    gameState.bgWave2 = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, "bgWave2");
    this.anims.create({
      key: "wave2",
      frames: this.anims.generateFrameNumbers("bgWave2", {
        start: 0,
        end: 4,
      }),
      frameRate: 7,
      repeat: -1,
    });
    gameState.bgWave2.anims.play("wave2", true);
    gameState.bgWave2.depth = 100;

    // Scaling
    let scaleX = this.cameras.main.width / gameState.bgWave.width;
    let scaleY = this.cameras.main.height / gameState.bgWave.height;
    let scale = Math.max(scaleX, scaleY);
    gameState.bgWave.setScale(scale).setScrollFactor(0);
    gameState.bgWave2.setScale(scale).setScrollFactor(0);

    // Player animation
    gameState.player = this.physics.add.sprite(this.cameras.main.width / 4, this.cameras.main.height / 3, key);
    gameState.player.setSize(280, 90);
    gameState.player.setOffset(270, 160);
    gameState.player.setCollideWorldBounds(true);
    gameState.player.depth = 90;

    this.anims.create({
      key: "movement",
      frames: this.anims.generateFrameNumbers(key, { start: 0, end: 5 }),
      frameRate: 9,
      repeat: -1,
    });

    gameState.player.anims.play("movement", true);
    gameState.player.setScale(scale / 2.5).setScrollFactor(0); //scale board sprite

    //Settings button
    gameState.settings = this.add
      .image(100, 40, "iconpause")
      .setScale(scale / 3.6)
      .setInteractive();
    gameState.settings.depth = 100;

    //Settings functionality
    gameState.settings.on("pointerover", () => {
      gameState.settings.setScale(scale / 3);
    });
    gameState.settings.on("pointerout", () => {
      gameState.settings.setScale(scale / 3.6);
    });
    gameState.settings.on("pointerdown", () => {
      gameState.settings.setScale(scale / 2.7);
    });
    gameState.settings.on("pointerup", () => {
      gameState.settings.setScale(scale / 3.6);
      gameState.clickEffect.play();
      this.scene.pause("GameScene");
      this.scene.launch("PauseScene");
    });

    // Score text
    let highScore = JSON.parse(localStorage.getItem("highscore"));
    if (highScore == null) {
      highScore = 0;
    }
    gameState.scoreText = this.add.text(this.cameras.main.width / 2 - 100, 10, "Score: 0", {
      fontFamily: gameState.fontFamily,
      fontSize: "30px",
      fill: "#000000",
    });
    gameState.highScoreText = this.add.text(this.cameras.main.width / 2 + 100, 10, `High score: ${highScore}`, {
      fontFamily: gameState.fontFamily,
      fontSize: "30px",
      fill: "#000000",
    });

    // Lives
    gameState.lives = 3;
    //  gameState.livesText = this.add.text((this.cameras.main.width / 2 + 300), 10, 'Lives: 3', { fontSize: '20px', fill: '#000000' });

    //Static Hearts
    gameState.heart1 = this.add.image(200, 40, "heart").setScale(scale / 2.6);
    gameState.heart1.depth = 100;
    gameState.heart2 = this.add.image(270, 40, "heart").setScale(scale / 2.6);
    gameState.heart2.depth = 100;
    gameState.heart3 = this.add.image(340, 40, "heart").setScale(scale / 2.6);
    gameState.heart3.depth = 100;

    //Event hearts
    const hearts = this.physics.add.group();

    function heartGen() {
      const yCoord = Math.random() * this.cameras.main.height + this.cameras.main.height / 8;
      hearts.create(this.cameras.main.width, yCoord, "heart").setScale(scale / 3);
      hearts.depth = 50;
    }
    // Heart loop
    const heartGenLoop = this.time.addEvent({
      delay: 10000 * gameState.difficulty,
      callback: heartGen,
      callbackScope: this,
      loop: true,
    });

    // Remove hearts that leave scene
    this.physics.add.overlap(hearts, waveEnd, function (heart) {
      heart.destroy();
    });

    // Capture hearts
    this.physics.add.overlap(gameState.player, hearts, () => {
      this.cameras.main.shake(200, 0.009);
      if (gameState.lives == 3) {
        gameState.score += 500;
        gameState.scoreText.setText(`Score: ${gameState.score}`);
      } else if ((gameState.lives < 3) & !(gameState.lives < 2)) {
        gameState.lives += 1;
        gameState.heart3.setScale(scale / 2.6);
      } else if ((gameState.lives < 2) & !(gameState.lives < 1)) {
        gameState.lives += 1;
        gameState.heart2.setScale(scale / 2.6);
      }
      // gameState.livesText.setText(`Lives: ${gameState.lives}`);
    });
    // Disable hearts that have overlapped
    this.physics.add.overlap(gameState.player, hearts, function (player, heart) {
      heart.disableBody(true, true);
    });

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // WaveTop
    gameState.jump = false;
    this.physics.add.overlap(gameState.player, waveTopUpper, () => {
      gameState.jump = true;
    });
    this.physics.add.overlap(gameState.player, waveTopLower, () => {
      gameState.jump = false;
    });

    //Kill by waveEnd
    this.physics.add.overlap(gameState.player, waveEnd, () => {
      gameState.heart3.destroy();
      gameState.heart2.destroy();
      gameState.heart1.destroy();
      // this.add.text(
      //   this.cameras.main.width / 3,
      //   this.cameras.main.height / 2 - 230,
      //   "Oops! You got caught by the wave!",
      //   { fontSize: "30px", fill: "#000000" }
      // );
      localStorage.setItem("score", JSON.stringify(gameState.score));
      this.scene.pause("GameScene");
      this.scene.launch("EndScene");
      if (gameState.score > highScore) {
        highScore = gameState.score;
        localStorage.setItem("highscore", JSON.stringify(highScore));
        gameState.highScoreText.setText(`High score: ${highScore}`);
        // this.add.text(
        //   this.cameras.main.width / 3,
        //   this.cameras.main.height / 2 - 190,
        //   `But YAY! New High Score: ${highScore}`,
        //   { fontSize: "30px", fill: "#000000" }
        // );
      }
    });

    //Enemies

    const enemies = this.physics.add.group();
    const enemyList = ["shark", "iceblock"];

    function enemyGen() {
      const yCoord = Math.random() * this.cameras.main.height + this.cameras.main.height / 8;
      let randomEnemies = enemyList[Math.floor(Math.random() * enemyList.length)];
      enemies.create(this.cameras.main.width, yCoord, randomEnemies).setScale(scale / 3);
      enemies.depth = 50;
    }
    // Enemy loop
    const enemyGenLoop = this.time.addEvent({
      delay: 500 / gameState.difficulty,
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

    //Hit enemy logic:
    this.physics.add.overlap(gameState.player, enemies, () => {
      this.cameras.main.shake(200, 0.009);

      gameState.lives -= 1;
      // gameState.livesText.setText(`Lives: ${gameState.lives}`);

      if (gameState.lives < 3) {
        gameState.heart3.setScale(0.001);
      }
      if (gameState.lives < 2) {
        gameState.heart2.setScale(0.001);
      }
      if (gameState.lives < 1) {
        gameState.heart1.setScale(0.001);
        this.add.text(this.cameras.main.width / 3, this.cameras.main.height / 2 - 230, `Ouch! You got hit!`, {
          fontSize: "30px",
          fill: "#000000",
        });
        localStorage.setItem("score", JSON.stringify(gameState.score));
        this.scene.pause("GameScene");
        this.scene.launch("EndScene");
      }

      if (gameState.score > highScore) {
        highScore = gameState.score;
        localStorage.setItem("highscore", JSON.stringify(highScore));
        gameState.highScoreText.setText(`High score: ${highScore}`);
        // this.add.text(this.cameras.main.width / 3, (this.cameras.main.height / 2) - 190, `But YAY! New High Score: ${highScore}`, { fontSize: '30px', fill: '#000000' });
      }
    });
    // Disable enemy that has been hit
    this.physics.add.overlap(gameState.player, enemies, function (player, enemy) {
      enemy.disableBody(true, true);
    });
  }

  update() {
    //Movement + gravity effects to simulate motion of waves
    if (gameState.jump) {
      //Jump movement
      if (gameState.cursors.right.isDown) {
        gameState.player.x += 2;
        gameState.player.setGravity(0 * gameState.displayFactor, 40 * gameState.displayFactor);
      } else if (gameState.cursors.left.isDown) {
        gameState.player.x -= 1;
        gameState.player.setGravity(0 * gameState.displayFactor, 40 * gameState.displayFactor);
      } else if (gameState.cursors.up.isDown) {
        gameState.player.y -= 1;
        gameState.player.setGravity(0 * gameState.displayFactor, 40 * gameState.displayFactor);
      } else if (gameState.cursors.down.isDown) {
        gameState.player.y += 4;
        gameState.player.setGravity(0 * gameState.displayFactor, 60 * gameState.displayFactor);
      } else {
        gameState.player.setGravity(0 * gameState.displayFactor, 80 * gameState.displayFactor);
      }
    } else {
      //Normal movement
      if (gameState.cursors.right.isDown) {
        gameState.player.x += 3;
        gameState.player.setGravity(100 * gameState.displayFactor, 30 * gameState.displayFactor);
      } else if (gameState.cursors.left.isDown) {
        gameState.player.x -= 2;
        gameState.player.setGravity(-50 * gameState.displayFactor, -40 * gameState.displayFactor);
      } else if (gameState.cursors.up.isDown) {
        gameState.player.y -= 3;
        gameState.player.setGravity(40 * gameState.displayFactor, -70 * gameState.displayFactor);
      } else if (gameState.cursors.down.isDown) {
        gameState.player.y += 3;
        gameState.player.setGravity(30 * gameState.displayFactor, 60 * gameState.displayFactor);
      } else {
        gameState.player.setGravity(-20 * gameState.displayFactor, -40 * gameState.displayFactor);
      }
    }

    //Pause game by pressing space
    if (gameState.cursors.space.isDown) {
      this.scene.pause("GameScene");
      this.scene.launch("PauseScene");
    }
  }
  d;
}
