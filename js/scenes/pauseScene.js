class PauseScene extends Phaser.Scene {
	constructor() {
		super({ key: 'PauseScene' })
	}
    preload(){
        
    }

	create() {
        // Creating text on screen
        this.add.text(this.cameras.main.width/3, this.cameras.main.height/2 - 160, 'Game paused', {fill: '#FFFFFF', fontSize: '40px'})

        // Creating buttons on screen
        gameState.menu = this.add.image(100, 40, 'iconmenu').setScale(.3).setInteractive();
        gameState.continue = this.add.image(this.cameras.main.width/2, this.cameras.main.height/2 - 80, 'iconcontinue').setScale(.3).setInteractive();
        gameState.sound = this.add.image(this.cameras.main.width/2, this.cameras.main.height/2 , 'iconsound').setScale(.3).setInteractive();
        gameState.settings = this.add.image(this.cameras.main.width/2, this.cameras.main.height/2 + 80, 'iconsettings').setScale(.3).setInteractive();
        gameState.exit = this.add.image(this.cameras.main.width/2, this.cameras.main.height/2 + 160, 'iconexit').setScale(.3).setInteractive();
        gameState.howto = this.add.image(this.cameras.main.width/2, this.cameras.main.height/2 + 240, 'iconhowtoplay').setScale(.3).setInteractive();
            

        // Button functionality;
        // Continue game by pressing the menu button again or the continue button
        gameState.menu.on('pointerup', () => {
			this.scene.stop('PauseScene');
			this.scene.resume('GameScene');
        })
        gameState.continue.on('pointerup', () => {
			this.scene.stop('PauseScene');
			this.scene.resume('GameScene');
        })
        
        // Music: switch on or off 
        var musicPlaying = true;
        gameState.sound.on('pointerup', () => {

            if (musicPlaying){
                gameState.music.pause();
                musicPlaying = false;
            } else {
                gameState.music.resume();
                musicPlaying = true;
            }
        })

        // Settings
        gameState.settings.on('pointerup', () => {

        })

        // Exit
        gameState.exit.on('pointerup', () => {
            window.location.replace('/../../index.html');
        })

        // How to play
        gameState.howto.on('pointerup', () => {

        })       



        // Button functions and styling shared by ALL buttons
       const pauseButtonList = [
            gameState.menu,
            gameState.continue,
            gameState.sound,
            gameState.settings,
            gameState.exit,
            gameState.howto
        ]
        pauseButtonList.forEach(btn => {
            btn.on('pointerover', () => {
                btn.setScale(.4);
               })
            btn.on('pointerout', () => {
                btn.setScale(.3);
               })
            btn.on('pointerdown', () => {
                btn.setScale(.45);
               })
            btn.on('pointerup', () => {
                btn.setScale(.3);
               })


            });      

    }
    update(){

    }
}



