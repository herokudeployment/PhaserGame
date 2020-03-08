class MainMenu extends Phaser.Scene {
    constructor() {
        super('bootGame')
    }

    preload() {
        this.load.image('menuBackground', 'assets/world/menubackground.png');
        this.load.image('play_button', 'assets/world/play_button.png');
        this.load.audio('menu_music', 'assets/music/menu_music.mp3');

    }

    create() {
        this.add.image(400, 300, 'menuBackground');
        var music = this.sound.add('menu_music');
        music.play()
        var playButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 3, 'play_button').setDepth(1);
        playButton.setInteractive();
        const self = this;
        this.input.on('gameobjectdown', function () {
            self.scene.start('entryLevel');
            music.stop()
        });

    }

    update() {

    }
}