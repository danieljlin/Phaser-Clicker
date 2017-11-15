var game = new Phaser.Game(800, 600, Phaser.AUTO, '');

game.state.add('play', {
    preload: function () {
        game.load.image('forest-lights', 'assets/parallax_forest_pack/layers/parallax-forest-lights.png');
        game.load.image('forest-back', 'assets/parallax_forest_pack/layers/parallax-forest-back-trees.png');
        game.load.image('forest-middle', 'assets/parallax_forest_pack/layers/parallax-forest-middle-trees.png');
        game.load.image('forest-front', 'assets/parallax_forest_pack/layers/parallax-forest-front-trees.png');

        game.load.image('aerocephal', 'assets/allacrost_enemy_sprites/aerocephal.png');
        game.load.image('arcana_drake', 'assets/allacrost_enemy_sprites/arcana_drake.png');
        game.load.image('aurum-drakueli', 'assets/allacrost_enemy_sprites/aurum-drakueli.png');
        game.load.image('bat', 'assets/allacrost_enemy_sprites/bat.png');
        game.load.image('daemarbora', 'assets/allacrost_enemy_sprites/daemarbora.png');
        game.load.image('deceleon', 'assets/allacrost_enemy_sprites/deceleon.png');
        game.load.image('demonic_essence', 'assets/allacrost_enemy_sprites/demonic_essence.png');
        game.load.image('dune_crawler', 'assets/allacrost_enemy_sprites/dune_crawler.png');
        game.load.image('green_slime', 'assets/allacrost_enemy_sprites/green_slime.png');
        game.load.image('nagaruda', 'assets/allacrost_enemy_sprites/nagaruda.png');
        game.load.image('rat', 'assets/allacrost_enemy_sprites/rat.png');
        game.load.image('scorpion', 'assets/allacrost_enemy_sprites/scorpion.png');
        game.load.image('skeleton', 'assets/allacrost_enemy_sprites/skeleton.png');
        game.load.image('snake', 'assets/allacrost_enemy_sprites/snake.png');
        game.load.image('spider', 'assets/allacrost_enemy_sprites/spider.png');
        game.load.image('stygian_lizard', 'assets/allacrost_enemy_sprites/stygian_lizard.png');

        game.load.image('gold_coin', 'assets/496_RPG_icons/I_GoldCoin.png');
    },
    create: function () {
        var state = this;
        this.background = this.game.add.group();
        // set up each of our background layers to take the full screen
        ['forest-back', 'forest-lights', 'forest-middle', 'forest-front']
            .forEach(function (image) {
                var bg = state.game.add.tileSprite(0, 0, state.game.world.width,
                    state.game.world.height, image, '', state.background);
                bg.tileScale.setTo(4, 4);
            });
        var monsterData = [
            { name: 'Aerocephal', image: 'aerocephal', maxHealth: 10 },
            { name: 'Arcana Drake', image: 'arcana_drake', maxHealth: 20 },
            { name: 'Aurum Drakueli', image: 'aurum-drakueli', maxHealth: 30 },
            { name: 'Bat', image: 'bat', maxHealth: 5 },
            { name: 'Daemarbora', image: 'daemarbora', maxHealth: 10 },
            { name: 'Deceleon', image: 'deceleon', maxHealth: 10 },
            { name: 'Demonic Essence', image: 'demonic_essence', maxHealth: 15 },
            { name: 'Dune Crawler', image: 'dune_crawler', maxHealth: 8 },
            { name: 'Green Slime', image: 'green_slime', maxHealth: 3 },
            { name: 'Nagaruda', image: 'nagaruda', maxHealth: 13 },
            { name: 'Rat', image: 'rat', maxHealth: 2 },
            { name: 'Scorpion', image: 'scorpion', maxHealth: 2 },
            { name: 'Skeleton', image: 'skeleton', maxHealth: 6 },
            { name: 'Snake', image: 'snake', maxHealth: 4 },
            { name: 'Spider', image: 'spider', maxHealth: 4 },
            { name: 'Stygian Lizard', image: 'stygian_lizard', maxHealth: 20 }
        ]
        this.monsters = this.game.add.group();
        var monster;
        monsterData.forEach(function (data) {
            // Create a sprite for them off screen
            monster = state.monsters.create(1000, game.world.centerY, data.image);
            // Center anchor
            monster.anchor.setTo(0.5);
            // Reference to the database
            monster.details = data;
            // Use the built-in health component
            monster.health = monster.maxHealth = data.maxHealth;

            // Hook into health and lifecycle events
            monster.events.onKilled.add(state.onKilledMonster, state);
            monster.events.onRevived.add(state.onRevivedMonster, state);

            // Enable input so we can click it!
            monster.inputEnabled = true;
            monster.events.onInputDown.add(state.onClickMonster, state);
        });

        this.currentMonster = this.monsters.getRandom();
        this.currentMonster.position.set(this.game.world.centerX + 100, this.game.world.centerY);

        this.monsterInfoUI = this.game.add.group();
        this.monsterInfoUI.position.setTo(this.currentMonster.x - 220, this.currentMonster.y + 120);
        this.monsterNameText = this.monsterInfoUI.addChild(this.game.add.text(0, 0, this.currentMonster.details.name, {
            font: '48px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        }));
        this.monsterHealthText = this.monsterInfoUI.addChild(this.game.add.text(0, 80, this.currentMonster.health + ' HP', {
            font: '32px Arial Black',
            fill: '#ff0000',
            strokeThickness: 4
        }));

        // The Main Player
        this.player = {
            clickDmg: 1,
            gold: 0
        }

        this.dmgTextPool = this.add.group();
        var dmgText;
        for (var d = 0; d < 50; d++) {
            dmgText = this.add.text(0, 0, '1', {
                font: '64px Arial Black',
                fill: '#fff',
                strokeThickness: 4
            });
            // Start out not existing, so we don't draw it yet
            dmgText.exists = false;
            dmgText.tween = game.add.tween(dmgText)
                .to({
                    alpha: 0,
                    y: 100,
                    x: this.game.rnd.integerInRange(100, 700)
                }, 1000, Phaser.Easing.Cubic.Out);

            dmgText.tween.onComplete.add(function (text, tween) {
                text.kill();
            });
            this.dmgTextPool.add(dmgText);
        }

        // Create a pool of gold coins
        this.coins = this.add.group();
        this.coins.createMultiple(50, 'gold_coin', '', false);
        this.coins.setAll('inputEnabled', true);
        this.coins.setAll('goldValue', 1);
        this.coins.callAll('events.onInputDown.add', 'events.onInputDown', this.onClickCoin, this);

        this.playerGoldText = this.add.text(30, 30, 'Gold: ' + this.player.gold, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        });

        
        //var skeletonSprite = game.add.sprite(450, 290, 'skeleton');
        //skeletonSprite.anchor.setTo(0.5, 0.5);

    },
    render: function () {
        //game.debug.text('Adventure Awaits!', 250, 290);
        // game.debug.text(this.currentMonster.details.name, 
        //     this.game.world.centerX - this.currentMonster.width/2, 
        //     this.game.world.centerY + this.currentMonster.height/2);
    },

    onClickMonster: function (monster, pointer) {
        // Apply click damage to monster
        this.currentMonster.damage(this.player.clickDmg);
        // Update health text
        this.monsterHealthText.text = this.currentMonster.alive ? this.currentMonster.health + ' HP' : 'DEAD';

        // Grab a damage text from the pool to display what happened
        var dmgText = this.dmgTextPool.getFirstExists(false);
        if (dmgText) {
            dmgText.text = this.player.clickDmg;
            dmgText.reset(pointer.positionDown.x, pointer.positionDown.y);
            dmgText.alpha = 1;
            dmgText.tween.start();
        }
    },

    onKilledMonster: function (monster) {
        // Move monster off screen
        monster.position.set(1000, this.game.world.centerY);
        // Pick new monster
        this.currentMonster = this.monsters.getRandom();
        // Make sure new monster is at full health
        this.currentMonster.revive(this.currentMonster.maxHealth);

        var coin;
        // Spawn a coin on ground
        coin = this.coins.getFirstExists(false);
        coin.reset(this.game.world.centerX + this.game.rnd.integerInRange(-100, 100), this.game.world.centerY);
        coin.goldValue = 1;
        this.game.time.events.add(Phaser.Timer.SECOND * 3, this.onClickCoin, this, coin);
    },

    onRevivedMonster: function (monster) {
        // Move new monster on screen
        monster.position.set(this.game.world.centerX + 100, this.game.world.centerY);
        // Update text display
        this.monsterNameText.text = monster.details.name;
        this.monsterHealthText.text = monster.health + ' HP';
    },

    onClickCoin: function (coin) {
        if (!coin.alive) {
            return;
        }
        // Give the player gold
        this.player.gold += coin.goldValue;
        // Update UI
        this.playerGoldText.text = 'Gold :' + this.player.gold;
        // Remove the coin
        coin.kill();
    }
});



game.state.start('play');