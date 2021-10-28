class EndScene extends Phaser.Scene {
	constructor() {
		super({ key: 'EndScene' })
	}
    preload(){
        
    }

	create() {
        // Creating text on screen
        this.add.text(this.cameras.main.width/3, this.cameras.main.height/2 - 160, 'Game over!', {fill: '#FFFFFF', fontSize: '40px'})

        // Creating buttons on screen
        gameState.menu = this.add.image(100, 40, 'iconmenu').setScale(.3).setInteractive();
        gameState.continue = this.add.image(this.cameras.main.width/2, this.cameras.main.height/2 - 80, 'iconcontinue').setScale(.3).setInteractive();
        gameState.sound = this.add.image(this.cameras.main.width/2, this.cameras.main.height/2 , 'iconsound').setScale(.3).setInteractive();
        gameState.settings = this.add.image(this.cameras.main.width/2, this.cameras.main.height/2 + 80, 'iconsettings').setScale(.3).setInteractive();
        gameState.exit = this.add.image(this.cameras.main.width/2, this.cameras.main.height/2 + 160, 'iconexit').setScale(.3).setInteractive();
        gameState.howto = this.add.image(this.cameras.main.width/2, this.cameras.main.height/2 + 240, 'iconhowtoplay').setScale(.3).setInteractive();
            

        // Button functionality;
        // Hide buttons 
        var buttonsShowing = true;
        gameState.menu.on('pointerup', () => {
            if(buttonsShowing){
                this.scene.bringToTop('GameScene');
                buttonsShowing = false;
            } else{ 
                this.scene.bringToTop('EndScene');
                buttonsShowing = true;
            }
         })  
         gameState.menu.on('pointerover', () => {
            if(!buttonsShowing){
                this.scene.bringToTop('EndScene');
                buttonsShowing = true;
              }
         })        

  
        // Start new game by pressing the menu button again or the continue button
        gameState.continue.on('pointerup', () => {
			this.scene.stop('PauseScene');
			this.scene.start('GameScene');
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

        })

        // How to play
        gameState.howto.on('pointerup', () => {

        })       



        // Button functions and styling shared by ALL buttons
       const endButtonList = [
            gameState.menu,
            gameState.continue,
            gameState.sound,
            gameState.settings,
            gameState.exit,
            gameState.howto
        ]
        endButtonList.forEach(btn => {
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

// this.scene.restart()
// this.pauseButtons.toggleVisible();
// this.scene.bringToTop('GameScene');