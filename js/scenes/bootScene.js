class BootScene extends Phaser.Scene {
	constructor() {
		super({ key: 'BootScene' })
	}
    preload(){
        //Load common resources
        this.load.image('iconmenu', '../../images/btn-menu.png')
        this.load.image('iconsettings', '../../images/icon-settings.png');
        this.load.image('iconpause', '../../images/icon-pause.png');
        this.load.image('iconexit','../../images/icon-exit.png');
        this.load.image('iconsound','../../images/icon-sound.png');
        this.load.image('iconhowtoplay','../../images/icon-how_to_play.png');
        this.load.image('iconcontinue', '../../images/btn-continue.png');
        this.load.audio('background_music', '../../media/background.mp3'); //ADD '../../media/background.wav'


    }

	create() {
        // Playing music by default
        gameState.music = this.sound.add('background_music');
        gameState.music.loop = true;
        gameState.music.play()

        // Start game
        this.scene.start('GameScene')
    }
   
    update(){

    }
}