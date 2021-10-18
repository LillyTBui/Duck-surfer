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
        this.load.image('background', '../../images/platform3.gif')
        this.load.image('sprite1', '../../images/player-green.png')
        this.load.image('sprite2', '../../images/player-gray.png')
        this.load.image('sprite3', '../../images/player-pink.png')
    }

    create() {
        gameState.background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background');
        let scaleX = this.cameras.main.width / gameState.background.width;
        let scaleY = this.cameras.main.height / gameState.background.height;
        let scale = Math.min(scaleX, scaleY);
        gameState.background.setScale(scale).setScrollFactor(0);

        gameState.duckRight = this.physics.add.sprite(300, 400, key)
        gameState.duckRight.setScale(0.3);
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




