class EndScene extends Phaser.Scene {
	constructor() {
		super({ key: 'EndScene' })
	}
    preload(){
        
    }

	create() {
        // Creating text on screen
        // this.add.text(this.cameras.main.width/3, this.cameras.main.height/2 - 160, 'Game over!', {fill: '#FFFFFF', fontSize: '40px'})

        // Creating buttons on screen
        // gameState.menu = this.add.image(100, 40, 'iconmenu').setScale(.3).setInteractive();
        // gameState.continue = this.add.image(this.cameras.main.width/2, this.cameras.main.height/2 - 80, 'iconcontinue').setScale(.3).setInteractive();
        // gameState.sound = this.add.image(this.cameras.main.width/2, this.cameras.main.height/2 , 'iconsound').setScale(.3).setInteractive();
        // gameState.settings = this.add.image(this.cameras.main.width/2, this.cameras.main.height/2 + 80, 'iconsettings').setScale(.3).setInteractive();
        // gameState.exit = this.add.image(this.cameras.main.width/2, this.cameras.main.height/2 + 160, 'iconexit').setScale(.3).setInteractive();
        // gameState.howto = this.add.image(this.cameras.main.width/2, this.cameras.main.height/2 + 240, 'iconhowtoplay').setScale(.3).setInteractive();
            
        // gameState.settings = this.add.image(100, 40, 'iconsettings').setScale(.3).setInteractive();
        
        //For scaling
        let scaleX = this.cameras.main.width / gameState.bgWave.width;
        let scaleY = this.cameras.main.height / gameState.bgWave.height;
        let scale = Math.max(scaleX, scaleY);

        gameState.play = this.add.image(this.cameras.main.width/2, this.cameras.main.height/2 - 80, 'iconplay').setScale(scale / 3.6).setInteractive();
        gameState.sound = this.add.image(this.cameras.main.width/2, this.cameras.main.height/2 , 'iconsound').setScale(scale / 3.6).setInteractive();
        gameState.exit = this.add.image(this.cameras.main.width/2, this.cameras.main.height/2 + 80, 'iconexit').setScale(scale / 3.6).setInteractive();



        // Button functionality;
  
  
        // Start new game by pressing play
        gameState.play.on('pointerup', () => {
			this.scene.stop('EndScene');
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
        // gameState.settings.on('pointerup', () => {

        // })

        // Exit
        gameState.exit.on('pointerup', () => {
            window.location.replace('../../index.html')
        })

        // How to play
        // gameState.howto.on('pointerup', () => {
        //     document.getElementsByClassName('box-menu')
        // })       



        // Button functions and styling shared by ALL buttons
       const endButtonList = [
            // gameState.menu,
            // gameState.continue,
            gameState.sound,
            gameState.settings,
            gameState.exit,
            // gameState.howto,
            gameState.play
        ]
        endButtonList.forEach(btn => {
            btn.on('pointerover', () => {
                btn.setScale(scale /3);
               })
            btn.on('pointerout', () => {
                btn.setScale(scale / 3.6);
               })
            btn.on('pointerdown', () => {
                btn.setScale(scale / 2.7);
               })
            btn.on('pointerup', () => {
                btn.setScale(scale / 3.6);
               })


            }); 
    }
    update(){

    }
}

// this.scene.restart()
// this.pauseButtons.toggleVisible();
// this.scene.bringToTop('GameScene');