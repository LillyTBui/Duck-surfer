// Trenger ikke implementere denne i main, hvis det ikke passer. Jeg bare tester:
// Change log
// Implementert Lilly's spritesheet for .sprite
// Endret navn fra .sprite til .player
// Gjorde om .background til animert spritesheet
// Endret navn fra .background til .bgWave
// Testet ut tyngdekraft som simulerer bølger
// Testet ut om man kan få en platform på venstre side av spiller 
//  -> brukte denne til respawn av haier og til å drepe spiller
// Testet ut hvordan spiller sprite interagerer med fiender for å lage score
// -> Problem: boksene kræsjer med hverandre, så krusningen i vannet bak deg kan kræsje med en hai, og drepe deg.
// Lagde enkelt score system hvis man unngår haier
// ->Problem: highscore blir ikke med når spillet starter på nytt



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
        this.load.image('iceBlock', '../../images/ice block.png')
        this.load.spritesheet('bgWave', '../../images/background_wave.png',{
            frameHeight: 1200,
            frameWidth: 1200,
        });     
        this.load.spritesheet('sprite1', '../../images/spritesheet-green.png', {frameWidth: 400, frameHeight: 220});
        this.load.spritesheet('sprite2', '../../images/spritesheet-gray.png', {frameWidth: 400, frameHeight: 220});
        this.load.spritesheet('sprite3', '../../images/spritesheet-pink.png', {frameWidth: 400, frameHeight: 220});
    }

    create() {
        // waveEnd - platform to the far left that respawns enemies / kills player
        const waveEnd = this.physics.add.staticGroup();
        waveEnd.create(0, 0, 'bgEnd').setScale(1, 1).refreshBody();
        
        
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

        gameState.cursors = this.input.keyboard.createCursorKeys();

        // Player animation
        gameState.player = this.physics.add.sprite(400, 100, key);
        gameState.player.setCollideWorldBounds(true);
        this.anims.create({
            key: 'movement',
            frames:
            this.anims.generateFrameNumbers(key, {start: 0, end: 5}),
            frameRate: 9, 
            repeat: -1
        });

       gameState.player.anims.play('movement', true);

       // Score text 
       gameState.scoreText = this.add.text((this.cameras.main.width / 2), 10, 'Score: 0', { fontSize: '20px', fill: '#000000' });
       gameState.highScoreText = this.add.text((this.cameras.main.width / 2) + 200, 10, 'High score: 0', { fontSize: '20px', fill: '#000000' });


        //Kill by waveEnd
        this.physics.add.overlap(gameState.player, waveEnd, () => {
            this.physics.pause();
            this.add.text(this.cameras.main.width / 3, this.cameras.main.height / 2, 'Oops! You got caught by the wave!', { fontSize: '30px', fill: '#000000' });
            this.add.text(this.cameras.main.width / 3, (this.cameras.main.height / 2) + 50, 'Click to Restart', { fontSize: '15px', fill: '#000000' });
            if(gameState.score > gameState.highScore){
                gameState.highScore = gameState.score
                gameState.highScoreText.setText(`High score: ${gameState.highScore}`);
                this.add.text(this.cameras.main.width / 3, (this.cameras.main.height / 2) + 100, 'YAY! New High Score', { fontSize: '30px', fill: '#000000' });
                }
            gameState.active = false;
            this.anims.pauseAll();        
            this.input.on('pointerup', () =>{
                gameState.score = 0;
                this.anims.resumeAll();
                this.scene.restart();
            });
          });

        //Sharks
          const sharks = this.physics.add.group();

          function sharkGen () {
            const yCoord = Math.random() * this.cameras.main.height + (this.cameras.main.height/8);
            sharks.create(this.cameras.main.width, yCoord, 'shark').setScale(0.3);
          }
        // Shark loop
          const sharkGenLoop = this.time.addEvent({
            delay: 5000,
            callback: sharkGen,
            callbackScope: this,
            loop: true,
          });

        // Remove sharks
          this.physics.add.overlap(sharks, waveEnd, function (shark) {
            shark.destroy();
            //Avoiding sharks adds score
            gameState.score += 10;
            gameState.scoreText.setText(`Score: ${gameState.score}`);              
          });
          
        // Kill by sharks  
          this.physics.add.overlap(gameState.player, sharks, () => {
            sharkGenLoop.destroy();
            this.physics.pause();
            
            this.add.text(this.cameras.main.width / 3, this.cameras.main.height / 2, 'Ouch! You got caught by a shark!', { fontSize: '30px', fill: '#000000' });
            this.add.text(this.cameras.main.width / 3, (this.cameras.main.height / 2) + 50, 'Click to Restart', { fontSize: '15px', fill: '#000000' });
            if(gameState.score > gameState.highScore){
                gameState.highScore = gameState.score
                gameState.highScoreText.setText(`High score: ${gameState.highScore}`);
                this.add.text(this.cameras.main.width / 3, (this.cameras.main.height / 2) + 100, 'YAY! New High Score', { fontSize: '30px', fill: '#000000' });
                }
            gameState.active = false;
            this.anims.pauseAll();
            this.input.on('pointerup', () =>{
                gameState.score = 0;
                this.anims.resumeAll();
                this.scene.restart();
            });
          });

          //IceBlocks
          const IceBlocks = this.physics.add.group();

          function iceBlockGen () {
            const yCoord = Math.random() * this.cameras.main.height + (this.cameras.main.height/8);
            IceBlocks.create(this.cameras.main.width, yCoord, 'iceBlock').setScale(0.3);
          }
        // IceBlock loop
          const iceBlockGenLoop = this.time.addEvent({
            delay: 10,
            callback: iceBlockGen,
            callbackScope: this,
            loop: true,
          });

        // Remove IceBlocks
          this.physics.add.overlap(IceBlocks, waveEnd, function (iceBlock) {
            iceBlock.destroy();
            //Avoiding iceBlocks adds score
            gameState.score += 10;
            gameState.scoreText.setText(`Score: ${gameState.score}`);              
          });
          
        // Overlap IceBlocks  
          this.physics.add.overlap(gameState.player, IceBlocks, () => {
            iceBlockGenLoop.destroy();
            this.physics.pause();
            
            this.add.text(this.cameras.main.width / 3, this.cameras.main.height / 2, 'Ouch! You hit an Ice Berg!', { fontSize: '30px', fill: '#000000' });
            this.add.text(this.cameras.main.width / 3, (this.cameras.main.height / 2) + 50, 'Click to Restart', { fontSize: '15px', fill: '#000000' });
            if(gameState.score > gameState.highScore){
                gameState.highScore = gameState.score
                gameState.highScoreText.setText(`High score: ${gameState.highScore}`);
                this.add.text(this.cameras.main.width / 3, (this.cameras.main.height / 2) + 100, 'YAY! New High Score', { fontSize: '30px', fill: '#000000' });
                }
            gameState.active = false;
            this.anims.pauseAll();
            this.input.on('pointerup', () =>{
                gameState.score = 0;
                this.anims.resumeAll();
                this.scene.restart();
            });
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
    }

}




