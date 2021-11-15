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

// 11.11 Johannes
  Bygget videre på NewEnemies (men sjekke om det funker som det skal)  -  nye lydknapper er ikke merget
  Lagt til lyd på pauseknappen i GameScene
  Lagt til variabler så vi slipper å ha this.cameras.main.xxxxx overalt i koden. Se første del under create()
  Prøvde å rydde litt i strukturen i koden så vi samler koden i grupper: funksjonalitet / bakgrunn / spiller / fiender
  La inn vanskelighetsgrad så det kommer flere fiender og færre hjerter etterhvert som du får poeng
  -> Ikke helt topp balansert nå (stjerner i gameover må også passe med vanskelighetsgrad)
  Prøvde å legge inn en sperre over wave2, men foreløpig kan spilleren komme gjennom - noen som vet hvordan man fikser dette?
  Skal vi gjøre noe med det hvite til siden for spillet (hvis det ikke dekker hele browseren)?

// 15.11 Lilly
  lagt til 3 nye farger av plastikk bag, som heter: "yellow-bag", "brown-bag", "gray.bag"
  test ut hvilken av fargene dere synes passer best, eventuelt foreslå en farge
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
    // this.load.image("iceblock", "../../images/ice_block.png");
    this.load.image("ink", "../../../images/ink.png");
    this.load.image("octopus", "../../images/octopus.png");
    this.load.image("plastic-bag", "../../images/brown-bag.png");

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
    this.load.image("waveTwoTop", "../../images/waveTwoTop.png");

    //sprite
    this.load.spritesheet("sprite1", "../../images/spritesheet-green.png", { frameWidth: 644, frameHeight: 335 });
    this.load.spritesheet("sprite2", "../../images/spritesheet-gray.png", { frameWidth: 644, frameHeight: 335 });
    this.load.spritesheet("sprite3", "../../images/spritesheet-pink.png", { frameWidth: 644, frameHeight: 335 });
  }

  create() {
    //***Settings and cursors***
    // Camera Width, height and center values
    let width = this.cameras.main.width;
    let height = this.cameras.main.height;
    let centerX = width / 2;
    let centerY = height / 2;

    // Cursor input
    gameState.cursors = this.input.keyboard.createCursorKeys();

    // !!!** Difficulty test values **!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Base difficulty level
    var enemyBaseDelay = 3000;
    var enemyPoints = 50;
    var heartBaseDelay = 2000;
    var heartPoints = 100;
    var octopusBaseDelay = 15000;
    var octopusPoints = 500;
    gameState.difficulty = 1;
    // DEBUG text - DELETE when done*****************************************************************************
    gameState.diffText = this.add.text(centerX + 400, 0, "Difficulty: ?", {
      fontFamily: gameState.fontFamily,
      fontSize: "30px",
      fill: "#000000",
    });
    // On difficulty change - check logic of these:
    // heartGenLoop.delay = heartBaseDelay * gameState.difficulty;
    // enemyGenLoop.delay = enemyBaseDelay / gameState.difficulty;

    //***Background***'
    // WaveTop
    const waveTopUpper = this.physics.add.staticGroup();
    waveTopUpper
      .create(centerX, height / 11, "waveTop")
      .setScale(gameState.displayFactor, 5)
      .refreshBody();

    const waveTopLower = this.physics.add.staticGroup();
    waveTopLower
      .create(centerX, height / 5, "waveTop")
      .setScale(gameState.displayFactor, 2)
      .refreshBody();

    // waveEnd - platform to the far left that respawns enemies / kills player
    const waveEnd = this.physics.add.staticGroup();
    waveEnd.create(-14, centerY, "bgEnd").setScale(1, 1.5).refreshBody();

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //Wave2 Top (Barrier to not go through wave 2)
    const waveTwoTop = this.physics.add.staticGroup();
    waveTwoTop
      .create(0.14375 * width, height / 5.2, "waveTwoTop")
      .setScale(gameState.displayFactor, 2.2)
      .refreshBody();

    // Sprite background wave animation
    gameState.bgWave = this.add.sprite(centerX, centerY, "bgWave");
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

    //sprite background wave 2 animation
    gameState.bgWave2 = this.add.sprite(centerX, centerY, "bgWave2");
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
    let scaleX = width / gameState.bgWave.width;
    let scaleY = height / gameState.bgWave.height;
    let scale = Math.max(scaleX, scaleY);
    gameState.bgWave.setScale(scale).setScrollFactor(0);
    gameState.bgWave2.setScale(scale).setScrollFactor(0);

    //Pause menu button
    gameState.settings = this.add
      .image(100, 40, "iconpause")
      .setScale(scale / 3.6)
      .setInteractive();
    gameState.settings.depth = 100;

    //Pause menu button functionality
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
    gameState.score = 0;
    let highScore = JSON.parse(localStorage.getItem("highscore"));
    if (highScore == null) {
      highScore = 0;
    }
    gameState.scoreText = this.add.text(centerX - 100, 10, "Score: 0", {
      fontFamily: gameState.fontFamily,
      fontSize: "30px",
      fill: "#000000",
    });
    gameState.highScoreText = this.add.text(centerX + 100, 10, `High score: ${highScore}`, {
      fontFamily: gameState.fontFamily,
      fontSize: "30px",
      fill: "#000000",
    });

    // Lives and static hearts
    gameState.lives = 3;
    //  gameState.livesText = this.add.text((centerX + 300), 10, 'Lives: 3', { fontSize: '20px', fill: '#000000' });
    gameState.heart1 = this.add.image(200, 40, "heart").setScale(scale / 2.6);
    gameState.heart1.depth = 100;
    gameState.heart2 = this.add.image(270, 40, "heart").setScale(scale / 2.6);
    gameState.heart2.depth = 100;
    gameState.heart3 = this.add.image(340, 40, "heart").setScale(scale / 2.6);
    gameState.heart3.depth = 100;

    //***Player***
    // Player animation
    gameState.player = this.physics.add.sprite(width / 4, height / 3, key);
    gameState.player.setSize(280, 90);
    gameState.player.setOffset(270, 160);
    gameState.player.setBounce(0.2);
    gameState.player.setCollideWorldBounds(true);
    gameState.player.depth = 90;

    this.anims.create({
      key: "movement",
      frames: this.anims.generateFrameNumbers(key, { start: 0, end: 4 }),
      frameRate: 9,
      repeat: -1,
    });

    gameState.player.anims.play("movement", true);
    gameState.player.setScale(scale / 2.5).setScrollFactor(0); //scale board sprite

    // WaveTop interaction
    gameState.jump = false;
    this.physics.add.overlap(gameState.player, waveTopUpper, () => {
      gameState.jump = true;
    });
    this.physics.add.overlap(gameState.player, waveTopLower, () => {
      gameState.jump = false;
    });

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // WaveTwoTop interaction (barrier)
    this.physics.add.collider(gameState.player, waveTwoTop, () => {
      this.cameras.main.shake(200, 0.003);
    });

    //WaveEnd interaction
    this.physics.add.overlap(gameState.player, waveEnd, () => {
      gameState.heart3.destroy();
      gameState.heart2.destroy();
      gameState.heart1.destroy();
      // this.add.text(
      //   width / 3,
      //   centerY - 230,
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
        //   width / 3,
        //   centerY - 190,
        //   `But YAY! New High Score: ${highScore}`,
        //   { fontSize: "30px", fill: "#000000" }
        // );
      }
    });

    //***Gameplay hearts***
    // Create hearts
    const hearts = this.physics.add.group();

    function heartGen() {
      const yCoord = Math.random() * height + height / 8;
      hearts.create(width, yCoord, "heart").setScale(scale / 3);
      hearts.depth = 50;
    }
    // Heart loop
    const heartGenLoop = this.time.addEvent({
      delay: heartBaseDelay,
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
      this.cameras.main.shake(200, 0.003);
      if (gameState.lives == 3) {
        gameState.score += heartPoints;
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

    //***Gameplay Enemies***
    // Create enemies
    const enemies = this.physics.add.group();
    const enemyList = ["shark", "plastic-bag"];

    function enemyGen() {
      const yCoord = Math.random() * height + height / 8;
      let randomEnemies = enemyList[Math.floor(Math.random() * enemyList.length)];
      enemies.create(width, yCoord, randomEnemies).setScale(scale / 3);
      enemies.depth = 50;
    }
    // Enemy loop
    const enemyGenLoop = this.time.addEvent({
      delay: enemyBaseDelay,
      callback: enemyGen,
      callbackScope: this,
      loop: true,
    });

    // Remove enemies
    this.physics.add.overlap(enemies, waveEnd, function (enemy) {
      enemy.destroy();
      //Avoiding sharks adds score
      gameState.score += enemyPoints;
      gameState.scoreText.setText(`Score: ${gameState.score}`);
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // Update spawn delay based on difficulty
      heartGenLoop.delay = heartBaseDelay * gameState.difficulty;
      enemyGenLoop.delay = enemyBaseDelay / gameState.difficulty;
      octopusGenLoop.delay = octopusBaseDelay / gameState.difficulty;
      //DEBUG TEXT _ DELETE WHEN DONE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      gameState.diffText.setText(
        `Difficulty: ${gameState.difficulty} Hdel: ${heartGenLoop.delay} EnDel:${enemyGenLoop.delay} HP:${heartPoints} EP${enemyPoints}`
      );
    });

    //Hit enemy logic:
    this.physics.add.overlap(gameState.player, enemies, () => {
      this.cameras.main.shake(200, 0.009);

      gameState.lives -= 1;
      // gameState.livesText.setText(`Lives: ${gameState.lives}`);

      // Hide hearts when losing lives
      if (gameState.lives < 3) {
        gameState.heart3.setScale(0.001);
      }
      if (gameState.lives < 2) {
        gameState.heart2.setScale(0.001);
      }
      if (gameState.lives < 1) {
        gameState.heart1.setScale(0.001);
        // this.add.text(width / 3, centerY - 230, `Ouch! You got hit!`, {
        //   fontSize: "30px",
        //   fill: "#000000",
        // });
        localStorage.setItem("score", JSON.stringify(gameState.score));
        this.scene.pause("GameScene");
        this.scene.launch("EndScene");
      }

      if (gameState.score > highScore) {
        highScore = gameState.score;
        localStorage.setItem("highscore", JSON.stringify(highScore));
        gameState.highScoreText.setText(`High score: ${highScore}`);
        // this.add.text(width / 3, (centerY) - 190, `But YAY! New High Score: ${highScore}`, { fontSize: '30px', fill: '#000000' });
      }
    });
    // Disable enemy that has been hit
    this.physics.add.overlap(gameState.player, enemies, function (player, enemy) {
      enemy.disableBody(true, true);
    });

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //Create Octopuses
    const octopuses = this.physics.add.group();
    const ink = this.add.image(centerX, centerY, "ink");
    ink.depth = 400;
    ink.visible = false;

    function octopusGen() {
      const yCoord = Math.random() * height + height / 8;
      octopuses.create(width, yCoord, "octopus").setScale(scale / 3);
      octopuses.depth = 50;
    }

    const octopusGenLoop = this.time.addEvent({
      delay: octopusBaseDelay / gameState.difficulty,
      callback: octopusGen,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.overlap(octopuses, waveEnd, function (octopus) {
      octopus.destroy();
      gameState.score += octopusPoints;
      gameState.scoreText.setText(`Score: ${gameState.score}`);
    });

    this.physics.add.overlap(gameState.player, octopuses, () => {
      this.cameras.main.shake(200, 0.009);

      gameState.lives -= 1;

      if (gameState.lives < 3) {
        gameState.heart3.setScale(0.001);
      }
      if (gameState.lives < 2) {
        gameState.heart2.setScale(0.001);
      }
      if (gameState.lives < 1) {
        gameState.heart1.setScale(0.001);
        this.add.text(width / 3, centerY - 230, `Ouch! You got hit!`, {
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
        // this.add.text(width / 3, (centerY) - 190, `But YAY! New High Score: ${highScore}`, { fontSize: '30px', fill: '#000000' });
      }
    });

    this.physics.add.overlap(gameState.player, octopuses, function (player, octopus) {
      octopus.disableBody(true, true);
      ink.visible = true;
      setInterval(hideInk, 5000);
    });

    function hideInk() {
      ink.visible = false;
    }
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
        gameState.player.y -= 0;
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

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Change difficulty level based on game score
    const l1 = 1000;
    const l2 = 2000;
    const l3 = 3000;
    const l4 = 4000;
    const l5 = 5000;
    const l6 = 6000;
    const l7 = 7000;
    const l8 = 8000;
    const l9 = 9000;
    const l10 = 10000;
    const l11 = 12000;
    const l12 = 14000;
    const l13 = 16000;
    const l14 = 18000;
    const l15 = 20000;

    if (gameState.score >= l1 && gameState.score < l2) {
      gameState.difficulty = 1.5;
    } else if (gameState.score >= l2 && gameState.score < l3) {
      gameState.difficulty = 2;
    } else if (gameState.score >= l3 && gameState.score < l4) {
      gameState.difficulty = 2.5;
    } else if (gameState.score >= l4 && gameState.score < l5) {
      gameState.difficulty = 3;
    } else if (gameState.score >= l5 && gameState.score < l6) {
      gameState.difficulty = 3.5;
    } else if (gameState.score >= l6 && gameState.score < l7) {
      gameState.difficulty = 4;
    } else if (gameState.score >= l7 && gameState.score < l8) {
      gameState.difficulty = 4.5;
    } else if (gameState.score >= l8 && gameState.score < l9) {
      gameState.difficulty = 5;
    } else if (gameState.score >= l9 && gameState.score < l10) {
      gameState.difficulty = 5.5;
    } else if (gameState.score >= l10 && gameState.score < l11) {
      gameState.difficulty = 6.5;
    } else if (gameState.score >= l11 && gameState.score < l12) {
      gameState.difficulty = 7;
    } else if (gameState.score >= l12 && gameState.score < l13) {
      gameState.difficulty = 7.5;
    } else if (gameState.score >= l14 && gameState.score < l15) {
      gameState.difficulty = 8;
    } else if (gameState.score >= l15) {
      gameState.difficulty = 10;
    }
  }
}
