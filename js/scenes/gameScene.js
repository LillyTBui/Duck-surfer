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
        this.load.spritesheet('backgroundWave', '../../images/backgroundWaveSprite.png',{
            frameHeight: 1200,
            frameWidth: 1200,
        });
        this.load.image('sprite1', '../../images/player-green.png')
        this.load.image('sprite2', '../../images/player-gray.png')
        this.load.image('sprite3', '../../images/player-pink.png')
    }

    create() {
        gameState.backgroundWave = this.add.sprite( this.cameras.main.width/2 , this.cameras.main.height/2, 'backgroundWave');
        this.anims.create({
            key: "wave",
            frames: this.anims.generateFrameNumbers("backgroundWave", {
                start: 0,
                end: 6
            }),
            frameRate: 7,
            repeat: -1
        });
        gameState.backgroundWave.anims.play("wave", true);
        let scaleX = this.cameras.main.width / gameState.backgroundWave.width ;
        let scaleY = this.cameras.main.height / gameState.backgroundWave.height;
        let scale = Math.min(scaleX, scaleY);
        gameState.backgroundWave.setScale(scale*1.35).setScrollFactor(0);

        gameState.duckRight = this.physics.add.sprite(this.cameras.main.width / 3, this.cameras.main.height / 1.8, key)
        gameState.duckRight.setScale(scale*0.4);
        gameState.duckRight.setCollideWorldBounds(true);

        gameState.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (gameState.cursors.right.isDown) {
            gameState.duckRight.x += 3;
        } else if (gameState.cursors.left.isDown) {
            gameState.duckRight.x -= 3;
        } else if (gameState.cursors.up.isDown) {
            gameState.duckRight.y -= 5;
        } else if (gameState.cursors.down.isDown) {
            gameState.duckRight.y += 2;
        }
    }

}




