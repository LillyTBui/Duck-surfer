const gameState ={
    score: 0,
    highScore: 0,
};

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: "game-container",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {x:-20, y: 0},
            debug: true
        }
    },
    scene: [GameScene]
};

const game = new Phaser.Game(config);
