class EntryLevel extends Phaser.Scene {
    constructor() {
        super('entryLevel');

    }

    score = 0;
    scoreText;
    dynamite;
    platforms;
    cursors;
    music;
    scoreText;
    gameOverMessage;
    gameOver = false;

    preload() {
        this.load.image('background', 'assets/world/background.png');
        this.load.image('ground', 'assets/world/ground.png');
        this.load.image('platform', 'assets/world/platform.png');
        this.load.image('money', 'assets/world/money.PNG');
        this.load.image('dynamite', 'assets/world/dynamite.png');
        this.load.audio('dynamite_explosion', 'assets/effects/dynamite_explosion.mp3');
        this.load.audio('money_collect', 'assets/effects/moneycollect.wav');
        this.load.spritesheet('player', 'assets/characters/player.png', { frameWidth: 32, frameHeight: 48 });
    }

    create() {
        this.add.image(400, 300, 'background');
        var dynamiteExplosionSound = this.sound.add('dynamite_explosion');
        var moneyColectSound = this.sound.add('money_collect');
        this.platforms = this.physics.add.staticGroup();
        this.ground = this.physics.add.staticGroup();

        this.platforms.create(600, 350, 'platform');
        this.platforms.create(50, 250, 'platform');
        this.platforms.create(650, 220, 'platform');
        this.ground.create(500, 550, 'ground');


        // Creating the player
        this.player = this.physics.add.sprite(50, 350, 'player');

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.body.setGravityY(300)
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.player, this.platforms);


        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'player', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        // Creating money

        this.moneyStack = this.physics.add.group({
            key: 'money',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        this.moneyStack.children.iterate(function (child) {

            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        });

        this.dynamites = this.physics.add.group();

        this.physics.add.collider(this.moneyStack, this.platforms);
        this.physics.add.collider(this.dynamites, this.platforms);
        this.physics.add.collider(this.dynamites, this.ground);
        this.physics.add.collider(this.moneyStack, this.ground);

        function collectMoney(player, money) {

            money.disableBody(true, true);
            this.score += 10;
            this.scoreText.setText('Score: ' + this.score);
            moneyColectSound.play();

            if (this.moneyStack.countActive(true) === 0) {

                //  A new batch of money to collect
                this.moneyStack.children.iterate(function (child) {

                    child.enableBody(true, child.x, 0, true, true);

                });

                var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

                var dynamite = this.dynamites.create(x, 16, 'dynamite');
                dynamite.setBounce(1);
                dynamite.setCollideWorldBounds(true);
                dynamite.setVelocity(Phaser.Math.Between(-200, 200), 20);
                dynamite.allowGrav = false;
            }
        }

        function hitDynamite(player, dynamite) {
            this.physics.pause();
            dynamiteExplosionSound.play();

            player.setTint(0xff0000);

            player.anims.play('turn');
            this.gameOver = true;
            if (this.gameOver) {
                this.gameOverMessage = this.add.text(260, 200, 'score: 0', { fontSize: '90px', fill: '#FF0000', fontWeight: 'bold' });
                this.gameOverMessage.setText('Game Over');
            }
        }


        this.physics.add.overlap(this.player, this.moneyStack, collectMoney, null, this)
        this.physics.add.collider(this.player, this.dynamites, hitDynamite, null, this);

        // Creating score field
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    }

    update() {

        // Setting the player controls
        this.cursors = this.input.keyboard.createCursorKeys();

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);

            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);

            this.player.anims.play('right', true);
        }
        else {
            this.player.setVelocityX(0);

            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-450);
        }
    }
}

