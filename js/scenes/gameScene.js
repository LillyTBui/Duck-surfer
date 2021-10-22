const id = JSON.parse(localStorage.getItem("surfboard"));
let key;

if(id === "1"){
    key = 'sprite';
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
        this.load.image('background', '../../images/platform3.gif')
        this.load.spritesheet('sprite', '../../images/spritesheet-green.png', {frameWidth: 400, frameHeight: 220});
        this.load.spritesheet('sprite2', '../../images/spritesheet-gray.png', {frameWidth: 400, frameHeight: 220});
        this.load.spritesheet('sprite3', '../../images/spritesheet-pink.png', {frameWidth: 400, frameHeight: 220});
    }

    create() {
        gameState.background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background');
        let scaleX = this.cameras.main.width / gameState.background.width;
        let scaleY = this.cameras.main.height / gameState.background.height;
        let scale = Math.min(scaleX, scaleY);
        gameState.background.setScale(scale).setScrollFactor(0);

        gameState.cursors = this.input.keyboard.createCursorKeys();

        gameState.sprite = this.physics.add.sprite(200, 400, key).setScale(0.3);
        gameState.sprite.setCollideWorldBounds(true);
        this.anims.create({
            key: 'movement',
            frames:
            this.anims.generateFrameNumbers(key, {start: 0, end: 4}),
            frameRate: 9, 
            repeat: -1
        });

       gameState.sprite.anims.play('movement', true);
    }

    update() {
        if (gameState.cursors.right.isDown) {
            gameState.sprite.x += 2;
        } else if (gameState.cursors.left.isDown) {
            gameState.sprite.x -= 2;
        } else if (gameState.cursors.up.isDown) {
            gameState.sprite.y -= 3;
        } else if (gameState.cursors.down.isDown) {
            gameState.sprite.y += 3;
        }
    }

}




