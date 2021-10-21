const gameState ={};

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: "game-container",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 90},
            debug: false
        }
    },
    scene: [GameScene]
};

const game = new Phaser.Game(config);
