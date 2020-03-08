var config = {
    type: Phaser.AUTO,
    width: 900,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 }
        }
    },
    scene: [
        MainMenu, EntryLevel
    ]
};


var game = new Phaser.Game(config);
