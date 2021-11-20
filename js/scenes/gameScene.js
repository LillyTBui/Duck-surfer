/* Change log
// 16.11 Johannes
  Ryddet kode. Kuttet mange kommenterte linjer og redusert kode som var unødvendig. Samlet logikk for octopus og enemies i størst mulig grad uten å fjerne funksjonalitet.
  (Linje 364- 375 og 410-416 skal fjernes når vi er ferdige med vanskelighetsgrad.)
  Forbedret kommentarer til kode.
  La til to ekstra farger plastposer.
  Lagt til lyd på mellomrom -> pause.
  Lagt inn ny info i hovedmenyen. Skrev det på engelsk siden alle knappene er på engelsk, men det kan vi eventuelt endre tilbake til norsk igjen.
  Lagt til tweens for å animere stjernene i endgame.
  Lagt inn struktur for at spiller kan velge vanskelighetsgrad - !MEN den må linkes opp med spillerens valg.
  ->Lilly, vet du hvordan man fikser dette? variabelen er gameState.difficultySetting;

// 16.11 Lilly
  På index siden:
  fjernet vanskelighetsgrad fra settings og har planker i stedenfor
  har satt vanskelighetsgrad til:
  - easy = 1
  - medium = 2
  - hard = 3
  disse kan du justere på index.js fra l.94 
  som default er difficultyChoice satt til 2 (medium) linje 94, hvis spilleren ikke velger 
  vanskelighetsgrad selv.

  la til gameState.splashSound.play(); l.365 i gameScene

  lagt til de nye lydeffektene i bootScene.
  lagt til new highscore tekst, applause lyd og 3 ulike vinne lyder 
  l.50 - l.98 i endScene.js
  
  //17.11 Johannes
Oppdaterte vanskelighetsgrad til:
 - easy = 0.5 
- medium = 1 (samme for standard)
- hard = 1.5 
Dette fungerer med oppdateringsmekanismen for økende vanskelighetsgrad utover i spillet

*/

// Player surfboard
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
    //Background
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

    //Enemies
    this.load.image("bgEnd", "../../images/background_end2.png");
    this.load.image("shark", "../../images/shark.png");
    this.load.image("ink", "../../../images/ink.png");
    this.load.image("octopus", "../../images/octopus.png");
    this.load.image("plastic-bag-gray", "../../images/plastic-bag-gray.png");
    this.load.image("plastic-bag-yellow", "../../images/plastic-bag-yellow.png");
    this.load.image("plastic-bag-blue", "../../images/plastic-bag-blue.png");

    //Player sprites
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

    // Base difficulty levels
    var enemyBaseDelay = 3000;
    var enemyPoints = 50;
    var heartBaseDelay = 2000;
    var heartPoints = 200;
    var octopusBaseDelay = 15000;
    var octopusPoints = 200;
    gameState.difficulty = 1 * gameState.difficultySetting;

    //***Background***'
    // WaveTop & Sky
    // Sky element -> player jump mechanics ON
    const waveTopUpper = this.physics.add.staticGroup();
    waveTopUpper
      .create(centerX, height / 13, "waveTop")
      .setScale(gameState.displayFactor, 6)
      .refreshBody();
    // Reset element -> player jump mechanics OFF
    const waveTopLower = this.physics.add.staticGroup();
    waveTopLower
      .create(centerX, height / 5, "waveTop")
      .setScale(gameState.displayFactor, 2)
      .refreshBody();

    // waveEnd - platform to the far left that respawns enemies / kills player
    const waveEnd = this.physics.add.staticGroup();
    waveEnd.create(-14, centerY, "bgEnd").setScale(1, 1.5).refreshBody();

    //Wave2 Top barrier -> in order to make the camera shake if you go "thorugh" the wave.
    const waveTwoTop = this.physics.add.staticGroup();
    waveTwoTop
      .create(0.14375 * width, height / 5.2, "waveTwoTop")
      .setScale(gameState.displayFactor, 2.2)
      .refreshBody();

    // Background wave animation sprite
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

    //Background wave 2 animation sprite (falling water effect)
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
      .image(100, 60, "iconpause")
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
    gameState.heart1 = this.add.image(200, 60, "heart").setScale(scale / 2.6);
    gameState.heart1.depth = 100;
    gameState.heart2 = this.add.image(270, 60, "heart").setScale(scale / 2.6);
    gameState.heart2.depth = 100;
    gameState.heart3 = this.add.image(340, 60, "heart").setScale(scale / 2.6);
    gameState.heart3.depth = 100;

    // Octopus ink element
    const ink = this.add.image(centerX, centerY, "ink");
    ink.depth = 400;
    ink.visible = false;

    //***Player***
    // Player sprite creation and config
    gameState.player = this.physics.add.sprite(width / 4, height / 3, key);
    gameState.player
      .setSize(280, 90)
      .setOffset(270, 160)
      .setBounce(0.2)
      .setCollideWorldBounds(true)
      .setScale(scale / 2.5)
      .setScrollFactor(0).depth = 90;

    // Player sprite animation
    this.anims.create({
      key: "movement",
      frames: this.anims.generateFrameNumbers(key, { start: 0, end: 4 }),
      frameRate: 9,
      repeat: -1,
    });
    gameState.player.anims.play("movement", true);

    // WaveTop interaction
    gameState.jump = false;
    this.physics.add.overlap(gameState.player, waveTopUpper, () => {
      gameState.jump = true;
    });
    this.physics.add.overlap(gameState.player, waveTopLower, () => {
      gameState.jump = false;
    });

    // WaveTwoTop interaction (barrier that shakes when player passe through wave)
    this.physics.add.collider(gameState.player, waveTwoTop, () => {
      this.cameras.main.shake(200, 0.005);
    });

    //WaveEnd interaction
    this.physics.add.overlap(gameState.player, waveEnd, () => {
      gameState.heart3.destroy();
      gameState.heart2.destroy();
      gameState.heart1.destroy();
      localStorage.setItem("score", JSON.stringify(gameState.score));
      this.scene.pause("GameScene");
      this.scene.launch("EndScene");
      if (gameState.score > highScore) {
        highScore = gameState.score;
        localStorage.setItem("highscore", JSON.stringify(highScore));
        gameState.highScoreText.setText(`High score: ${highScore}`);
      }
    });

    //***Gameplay hearts***
    // Create hearts
    const hearts = this.physics.add.group();

    function heartGen() {
      const yCoord = Math.random() * height + height / 8;
      hearts.create(width, yCoord, "heart").setScale(scale / 3);
      hearts.depth = 60;
    }
    // Heart loop
    const heartGenLoop = this.time.addEvent({
      delay: heartBaseDelay,
      callback: heartGen,
      callbackScope: this,
      loop: true,
    });

    // Capture hearts
    this.physics.add.overlap(gameState.player, hearts, () => {
      this.cameras.main.shake(200, 0.003);
      gameState.positiveSound.play();

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
    });

    // Disable hearts that have overlapped
    this.physics.add.overlap(gameState.player, hearts, function (player, heart) {
      heart.disableBody(true, true);
    });

    // Remove hearts that leave scene
    this.physics.add.overlap(hearts, waveEnd, function (heart) {
      heart.destroy();
    });

    //***Gameplay Enemies***
    //Create Rare octopuses
    const octopuses = this.physics.add.group();
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
    // Create other enemies
    const enemies = this.physics.add.group();
    const enemyList = ["shark", "plastic-bag-gray", "plastic-bag-blue", "plastic-bag-yellow"];
    function enemyGen() {
      const yCoord = Math.random() * height + height / 8;
      let randomEnemies = enemyList[Math.floor(Math.random() * enemyList.length)];
      enemies.create(width, yCoord, randomEnemies).setScale(scale / 3);
      enemies.depth = 50;
    }
    const enemyGenLoop = this.time.addEvent({
      delay: enemyBaseDelay,
      callback: enemyGen,
      callbackScope: this,
      loop: true,
    });

    //Hit enemy or octopuses logic:
    this.physics.add.overlap(gameState.player, [enemies, octopuses], () => {
      this.cameras.main.shake(200, 0.009);
      gameState.hitSound.play();
      gameState.lives -= 1;

      // Hide hearts when losing lives
      if (gameState.lives < 3) {
        gameState.heart3.setScale(0.001);
      }
      if (gameState.lives < 2) {
        gameState.heart2.setScale(0.001);
      }
      // Gameover when players lose their final life
      if (gameState.lives < 1) {
        gameState.heart1.setScale(0.001);
        localStorage.setItem("score", JSON.stringify(gameState.score));
        this.scene.pause("GameScene");
        this.scene.launch("EndScene");
      }

      if (gameState.score > highScore) {
        highScore = gameState.score;
        localStorage.setItem("highscore", JSON.stringify(highScore));
        gameState.highScoreText.setText(`High score: ${highScore}`);
      }
    });

    //Ink splash event for octopuses that are hit
    this.physics.add.overlap(gameState.player, octopuses, function () {
      ink.visible = true;
      gameState.splashSound.play();
      setInterval(hideInk, 5000);
    });
    function hideInk() {
      ink.visible = false;
    }

    // Disable all enemies that are hit
    this.physics.add.overlap(gameState.player, [enemies, octopuses], function (player, enemy) {
      enemy.disableBody(true, true);
    });

    // Remove enemies that leave scene
    // Extra points for rare octopuses
    this.physics.add.overlap(octopuses, waveEnd, function () {
      gameState.score += octopusPoints;
    });
    //Remove event
    this.physics.add.overlap([enemies, octopuses], waveEnd, function (enemy) {
      enemy.destroy();
      //Avoiding enemies adds score
      gameState.score += enemyPoints;
      gameState.scoreText.setText(`Score: ${gameState.score}`);

      // Update spawn delay based on difficulty
      heartGenLoop.delay = heartBaseDelay * gameState.difficulty;
      enemyGenLoop.delay = enemyBaseDelay / gameState.difficulty;
      octopusGenLoop.delay = octopusBaseDelay / gameState.difficulty;
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
      gameState.clickEffect.play();
      this.scene.pause("GameScene");
      this.scene.launch("PauseScene");
    }

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
      gameState.difficulty = 1.5 * gameState.difficultySetting;
    } else if (gameState.score >= l2 && gameState.score < l3) {
      gameState.difficulty = 2 * gameState.difficultySetting;
    } else if (gameState.score >= l3 && gameState.score < l4) {
      gameState.difficulty = 2.5 * gameState.difficultySetting;
    } else if (gameState.score >= l4 && gameState.score < l5) {
      gameState.difficulty = 3 * gameState.difficultySetting;
    } else if (gameState.score >= l5 && gameState.score < l6) {
      gameState.difficulty = 3.5 * gameState.difficultySetting;
    } else if (gameState.score >= l6 && gameState.score < l7) {
      gameState.difficulty = 4 * gameState.difficultySetting;
    } else if (gameState.score >= l7 && gameState.score < l8) {
      gameState.difficulty = 4.5 * gameState.difficultySetting;
    } else if (gameState.score >= l8 && gameState.score < l9) {
      gameState.difficulty = 5 * gameState.difficultySetting;
    } else if (gameState.score >= l9 && gameState.score < l10) {
      gameState.difficulty = 5.5 * gameState.difficultySetting;
    } else if (gameState.score >= l10 && gameState.score < l11) {
      gameState.difficulty = 6.5 * gameState.difficultySetting;
    } else if (gameState.score >= l11 && gameState.score < l12) {
      gameState.difficulty = 7 * gameState.difficultySetting;
    } else if (gameState.score >= l12 && gameState.score < l13) {
      gameState.difficulty = 7.5 * gameState.difficultySetting;
    } else if (gameState.score >= l14 && gameState.score < l15) {
      gameState.difficulty = 8 * gameState.difficultySetting;
    } else if (gameState.score >= l15) {
      gameState.difficulty = 10 * gameState.difficultySetting;
    }
  }
}
