// Change log
// 28.10    Johannes
// 1 Merget med main
// 2 Fjernet repetetiv kode for fiender og lagde det til en generell kode som kan ta inn flere forskjellige typer
// 3 Lagde BootScene og flyttet fellesressurser dit
// 4 La inn musikk for spillet i BootScene
// 5 Lagde PauseScene og EndScene
// 6 Flyttet alle knapper og koder for funksjonalitet til disse scenene (bortsett fra menyknapp)
//   -> trenger et icon for play? bytte icon for howtoplay til et spørsmålstegn?



const id = JSON.parse(localStorage.getItem("surfboard"));
let key;

if(id === "1"){
    key = 'sprite1';
}
else if(id === "2"){
    key = 'sprite2';
}
else{
    key = 'sprite3';
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' })
    }

    preload() {
        this.load.image('bgEnd', '../../images/background_end2.png')
        this.load.image('shark', '../../images/shark.png')
        this.load.image('iceblock', '../../images/ice_block.png')
        this.load.spritesheet('bgWave', '../../images/background_wave.png',{
            frameHeight: 1200,
            frameWidth: 1200,
        });     
        this.load.spritesheet('sprite1', '../../images/spritesheet-green.png', {frameWidth: 400, frameHeight: 220});
        this.load.spritesheet('sprite2', '../../images/spritesheet-gray.png', {frameWidth: 400, frameHeight: 220});
        this.load.spritesheet('sprite3', '../../images/spritesheet-pink.png', {frameWidth: 400, frameHeight: 220});

    }

    create() {
        // Cursor input
        gameState.cursors = this.input.keyboard.createCursorKeys();

        // waveEnd - platform to the far left that respawns enemies / kills player
        const waveEnd = this.physics.add.staticGroup();
        waveEnd.create(0, this.cameras.main.height /2 , 'bgEnd').setScale(1, 1.5).refreshBody();
        
        
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
        let scale = Math.min(scaleX, scaleY);
        gameState.bgWave.setScale(scale*1.5).setScrollFactor(0);

        // Player animation
        gameState.player = this.physics.add.sprite(400, 100, key);
        gameState.player.setSize(260, 100);
        gameState.player.setOffset(130,110);
        gameState.player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'movement',
            frames:
            this.anims.generateFrameNumbers(key, {start: 0, end: 5}),
            frameRate: 9, 
            repeat: -1
        });

       gameState.player.anims.play('movement', true);

      
       //Menu button
       gameState.menu = this.add.image(100, 40, 'iconmenu').setScale(.3).setInteractive();

       //ButtonBAR functionality
       gameState.menu.on('pointerover', () => {
            gameState.menu.setScale(.4);
               })
        gameState.menu.on('pointerout', () => {
            gameState.menu.setScale(.3);
               })
        gameState.menu.on('pointerdown', () => {
            gameState.menu.setScale(.45);
               })
        gameState.menu.on('pointerup', () => {
            gameState.menu.setScale(.3);
               })
        
    // Menu
       gameState.menu.on('pointerup', () => {
        this.scene.pause('GameScene');
        this.scene.launch('PauseScene');
       })



       // Score text 
       let highScore = JSON.parse(localStorage.getItem("highscore"));
       if(highScore == null){
           highScore = 0;
       }
       gameState.scoreText = this.add.text((this.cameras.main.width / 2), 10, 'Score: 0', { fontSize: '20px', fill: '#000000' });
       gameState.highScoreText = this.add.text((this.cameras.main.width / 2) + 200, 10, `High score: ${highScore}`, { fontSize: '20px', fill: '#000000' });

        //Kill by waveEnd
        this.physics.add.overlap(gameState.player, waveEnd, () => {
            this.add.text(this.cameras.main.width/3, this.cameras.main.height/2 - 230, 'Oops! You got caught by the wave!', { fontSize: '30px', fill: '#000000' });
            this.scene.pause('GameScene')
            this.scene.launch('EndScene')
            if(gameState.score > highScore){
                highScore = gameState.score
                localStorage.setItem("highscore", JSON.stringify(highScore));
                gameState.highScoreText.setText(`High score: ${highScore}`);
                this.add.text(this.cameras.main.width / 3, (this.cameras.main.height / 2) - 190, `But YAY! New High Score: ${highScore}`, { fontSize: '30px', fill: '#000000' });
            }  
            
          });


        //Enemies

          const enemies = this.physics.add.group();

          const enemyList = ['shark', 'iceblock']

          function enemyGen () {
            const yCoord = Math.random() * this.cameras.main.height + (this.cameras.main.height/8)
            let randomEnemies = enemyList[Math.floor(Math.random()*enemyList.length)]
            enemies.create(this.cameras.main.width, yCoord, randomEnemies).setScale(0.3)

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
            this.add.text(this.cameras.main.width / 3, this.cameras.main.height / 2 - 230, `Ouch! You got hit!`, { fontSize: '30px', fill: '#000000' });
            this.scene.pause('GameScene')
            this.scene.launch('EndScene')

            if(gameState.score > highScore){
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
                this.scene.pause('GameScene'); 
                this.scene.launch('PauseScene'); 
        }
    }

}