/* Change log
// 1.11   Lilly
1) Merget med main
2) lagt til den gamle bakgrunnen
3) merget brettet og spriten sammen
4) gjort rammen til brettet smallere, kan eventuelt justeres selv linje 77 og 78.
5) lagd til endringene til Stian: 
    ->flere liv (l.130 - 136 og l.191-210)
    ->knapp endringer i endScene og pauseScene
*/

const id = JSON.parse(localStorage.getItem("surfboard"));
let key;

if (id === "1") {
  key = 'sprite1';
}
else if (id === "2") {
  key = 'sprite2';
}
else {
  key = 'sprite3';
}

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.image("bgEnd", "../../images/background_end2.png");
    this.load.image("shark", "../../images/shark.png");
    this.load.image("iceblock", "../../images/ice_block.png");
    this.load.spritesheet('bgWave', '../../images/background_wave.png', {
      frameHeight: 1200,
      frameWidth: 1200,
    });

    //Heart
    this.load.image('heart', '../../images/heart.png');

    //sprite
    this.load.spritesheet('sprite1', '../../images/spritesheet-green.png', { frameWidth: 644, frameHeight: 335 });
    this.load.spritesheet('sprite2', '../../images/spritesheet-gray.png', { frameWidth: 644, frameHeight: 335 });
    this.load.spritesheet('sprite3', '../../images/spritesheet-pink.png', { frameWidth: 644, frameHeight: 335 });
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

    // Sprite background wave animation
    gameState.bgWave = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'bgWave');
    this.anims.create({
      key: "wave",
      frames: this.anims.generateFrameNumbers("bgWave", {
        start: 0,
        end: 6
      }),
      frameRate: 7,
      repeat: -1
    });
    gameState.bgWave.anims.play("wave", true);

    // Scaling
    let scaleX = this.cameras.main.width / gameState.bgWave.width;
    let scaleY = this.cameras.main.height / gameState.bgWave.height;
    let scale = Math.max(scaleX, scaleY);
    gameState.bgWave.setScale(scale).setScrollFactor(0);

    // Player animation
    gameState.player = this.physics.add.sprite(400, 100, key);
    gameState.player.setSize(280, 90);
    gameState.player.setOffset(270, 160);
    gameState.player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'movement',
      frames:
        this.anims.generateFrameNumbers(key, { start: 0, end: 5 }),
      frameRate: 9,
      repeat: -1
    });

    gameState.player.anims.play('movement', true);
    gameState.player.setScale(scale / 2.5).setScrollFactor(0); //scale board sprite

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

    //Hearts
    gameState.heart1 = this.add.image(200, 40, 'heart').setScale(.4);
    gameState.heart2 = this.add.image(270, 40, 'heart').setScale(.4);
    gameState.heart3 = this.add.image(340, 40, 'heart').setScale(.4);

    // Lives        
    gameState.livesText = this.add.text((this.cameras.main.width / 2 + 450), 10, 'Lives: 3', { fontSize: '20px', fill: '#000000' });

    //Kill by waveEnd
    this.physics.add.overlap(gameState.player, waveEnd, () => {
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
    this.physics.add.overlap(gameState.player, enemies, () => {

      //System for å miste ett hjerte ved hvert 100. liv.

      this.cameras.main.shake(100, .006);
      console.log(gameState.lives);
      gameState.lives += 1;
      gameState.livesText.setText(`Lives: ${gameState.lives}`);

      if (gameState.lives > 100) {
          gameState.heart3.destroy();
      }
      if (gameState.lives > 200) {
          gameState.heart2.destroy();
      }
      if (gameState.lives > 300) {
          gameState.heart1.destroy();
      }
      if (gameState.lives > 400) {
          this.add.text(this.cameras.main.width / 3, this.cameras.main.height / 2 - 230, `Ouch! You got hit!`, { fontSize: '30px', fill: '#000000' });
          this.scene.pause('GameScene')
          this.scene.launch('EndScene')
      }

      if (gameState.score > highScore) {
          highScore = gameState.score
          localStorage.setItem("highscore", JSON.stringify(highScore));
          gameState.highScoreText.setText(`High score: ${highScore}`);
          this.add.text(this.cameras.main.width / 3, (this.cameras.main.height / 2) - 190, `But YAY! New High Score: ${highScore}`, { fontSize: '30px', fill: '#000000' });
      }
  });
  }

  update() {
    //Movement + gravity effects to simulate motion of waves
    if (gameState.cursors.right.isDown) {
      gameState.player.x += 3;
      gameState.player.setGravity(100, 30);
    } else if (gameState.cursors.left.isDown) {
      gameState.player.x -= 2;
      gameState.player.setGravity(-50, -40);
    } else if (gameState.cursors.up.isDown) {
      gameState.player.y -= 3;
      gameState.player.setGravity(-40, -40);
    } else if (gameState.cursors.down.isDown) {
      gameState.player.y += 3;
      gameState.player.setGravity(30, 60);
    } else {
      gameState.player.setGravity(-20, -40);
    }

    //Pause game by pressing space
    if (gameState.cursors.space.isDown) {
      this.scene.pause("GameScene");
      this.scene.launch("PauseScene");
    }
  }
}
