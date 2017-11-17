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

        game.load.image('dagger', 'assets/496_RPG_icons/W_Dagger002.png');
        game.load.image('swordIcon1', 'assets/496_RPG_icons/S_Sword15.png');

        // Build panel for upgrades
        var bmd = game.add.bitmapData(250, 500);
        bmd.ctx.fillStyle = '#9a783d';
        bmd.ctx.strokeStyle = '#35371c';
        bmd.ctx.lineWidth = 12;
        bmd.ctx.fillRect(0, 0, 250, 500);
        bmd.ctx.strokeRect(0, 0, 250, 500);
        game.cache.addBitmapData('upgradePanel', bmd);

        var buttonImage = game.add.bitmapData(476, 48);
        buttonImage.ctx.fillStyle = '#e6dec7';
        buttonImage.ctx.strokeStyle = '#35371c';
        buttonImage.ctx.lineWidth = 4;
        buttonImage.ctx.fillRect(0, 0, 225, 48);
        buttonImage.ctx.strokeRect(0, 0, 225, 48);
        game.cache.addBitmapData('button', buttonImage);

        // The Main Player
        this.player = {
            gold: 0,
            clickDmg: 1,
            dps: 0
        }

        // World progression
        this.level = 1;
        // # of monsters killed this level
        this.levelKills = 0;
        // # of monsters required to advance a level
        this.levelKillsRequired = 10;
    },
    create: function () {
        var state = this;
        var background = game.add.group();
        // set up each of our background layers to take the full screen
        ['forest-back', 'forest-lights', 'forest-middle', 'forest-front']
            .forEach(function (image) {
                var bg = game.add.tileSprite(0, 0, game.world.width,
                    game.world.height, image, '', background);
                bg.tileScale.setTo(4, 4);
            });

        upgradePanel = game.add.image(10, 70, game.cache.getBitmapData('upgradePanel'));

        playerInfoUI = upgradePanel.addChild(game.add.group());
        playerInfoUI.position.setTo(8, 8);
        playerInfoUI.ClickDmgText = playerInfoUI.addChild(game.add.text(6, 6, 'Click Damage: ' + this.player.clickDmg, { font: '16px Arial Black' }));
        playerInfoUI.DPSText = playerInfoUI.addChild(game.add.text(6, 24, 'Damage Per Second: ' + this.player.dps, { font: '16px Arial Black' }));
        // upgradePanel.addChild(playerInfoUI);

        var upgradeButtons = upgradePanel.addChild(game.add.group());
        upgradeButtons.position.setTo(8, 58);

        var upgradeButtonsData = [
            { icon: 'dagger', name: 'Attack', level: 0, cost: 1, purchaseHandler: function (button, player) { player.clickDmg += 1; } },
            { icon: 'swordIcon1', name: 'Auto-Attack', level: 0, cost: 2, purchaseHandler: function (button, player) { player.dps += 1; } }
        ];

        var button;
        upgradeButtonsData.forEach(function (buttonData, index) {
            button = state.game.add.button(0, 50 * index, state.game.cache.getBitmapData('button'));
            button.details = buttonData;
            button.icon = button.addChild(state.game.add.image(6, 6, buttonData.icon));
            button.text = button.addChild(state.game.add.text(42, 6, 'Lvl. ' + buttonData.level + ' ' + buttonData.name, { font: '16px Arial Black' }));
            button.costText = button.addChild(state.game.add.text(42, 24, 'Cost: ' + buttonData.cost, { font: '16px Arial Black' }));
            button.events.onInputDown.add(state.onUpgradeButtonClick, state);
            upgradeButtons.addChild(button);
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
        state.monsters = game.add.group();
        var monster;
        monsterData.forEach(function (data) {
            // Create a sprite for them off screen
            monster = state.monsters.create(1000, state.game.world.centerY, data.image);
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

        this.currentMonster = state.monsters.getRandom();
        this.currentMonster.position.set(game.world.centerX + 100, game.world.centerY);


        this.monsterInfoUI = game.add.group();
        this.monsterInfoUI.position.setTo(this.currentMonster.x - 220, this.currentMonster.y + 120);
        this.monsterNameText = this.monsterInfoUI.addChild(game.add.text(0, 0, this.currentMonster.details.name, {
            font: '48px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        }));
        this.monsterHealthText = this.monsterInfoUI.addChild(game.add.text(0, 80, this.currentMonster.health + ' HP', {
            font: '32px Arial Black',
            fill: '#ff0000',
            strokeThickness: 4
        }));

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
                    x: game.rnd.integerInRange(100, 700)
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

        this.dpsTimer = game.time.events.loop(100, this.onDPS, this);

        // Set up the world progression display
        this.levelUI = game.add.group();
        this.levelUI.position.setTo(game.world.centerX, 30);
        this.levelText = this.levelUI.addChild(game.add.text(0, 0, 'Level: ' + this.level, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        }));
        this.levelKillsText = this.levelUI.addChild(game.add.text(0, 30, 'Kills: ' + this.levelKills, {
            font: '24px Arial Black',
            fill: '#fff',
            strokeThickness: 4
        }));
    },
    render: function () {
        //game.debug.text('Adventure Awaits!', 250, 290);
        // game.debug.text(this.currentMonster.details.name, 
        //     game.world.centerX - this.currentMonster.width/2, 
        //     game.world.centerY + this.currentMonster.height/2);
    },

    onClickMonster: function (monster, pointer) {
        // Apply click damage to monster
        this.currentMonster.damage(this.player.clickDmg);

        // Grab a damage text from the pool to display what happened
        var dmgText = this.dmgTextPool.getFirstExists(false);
        if (dmgText) {
            dmgText.text = this.player.clickDmg;
            dmgText.reset(pointer.positionDown.x, pointer.positionDown.y);
            dmgText.alpha = 1;
            dmgText.tween.start();
        }

        // Update health text
        this.monsterHealthText.text = this.currentMonster.alive ? this.currentMonster.health + ' HP' : 'DEAD';
    },

    onKilledMonster: function (monster) {
        // Move monster off screen
        monster.position.set(1000, game.world.centerY);

        var coin;
        // Spawn a coin on ground
        coin = this.coins.getFirstExists(false);
        coin.reset(game.world.centerX + game.rnd.integerInRange(-100, 100), game.world.centerY);
        coin.goldValue = Math.round(this.level * 1.33);
        game.time.events.add(Phaser.Timer.SECOND * 3, this.onClickCoin, this, coin);

        this.levelKills++;
        if (this.levelKills >= this.levelKillsRequired) {
            this.level++;
            this.levelKills = 0;
        }

        this.levelText.text = 'Level: ' + this.level;
        this.levelKillsText.text = 'Kills: ' + this.levelKills + '/' + this.levelKillsRequired;

        // Pick new monster
        this.currentMonster = this.monsters.getRandom();
        // Upgrade monster based on level
        this.currentMonster.maxHealth = Math.ceil(this.currentMonster.details.maxHealth + ((this.level - 1) * 10.6));
        // Make sure new monster is at full health
        this.currentMonster.revive(this.currentMonster.maxHealth);
    },

    onRevivedMonster: function (monster) {
        // Move new monster on screen
        monster.position.set(game.world.centerX + 100, game.world.centerY);
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
        this.playerGoldText.text = 'Gold: ' + this.player.gold;
        // Remove the coin
        coin.kill();
    },

    onUpgradeButtonClick: function (button, pointer) {
        // Make this a function so that it updates after upgrade
        function getAdjustedCost() {
            return Math.ceil(button.details.cost + (button.details.level * 1.46));
        }

        if (this.player.gold >= getAdjustedCost()) {
            this.player.gold -= getAdjustedCost();
            this.playerGoldText.text = 'Gold: ' + this.player.gold;
            button.details.level++;
            button.text.text = 'Lvl. ' + button.details.level + ' ' + button.details.name;
            button.costText.text = 'Cost: ' + getAdjustedCost();
            button.details.purchaseHandler.call(this, button, this.player);
            playerInfoUI.ClickDmgText.text = 'Click Damage: ' + this.player.clickDmg;
            playerInfoUI.DPSText.text = 'Damage Per Second: ' + this.player.dps;            
        }
    },

    onDPS: function () {
        if (this.player.dps > 0) {
            if (this.currentMonster && this.currentMonster.alive) {
                var dmg = this.player.dps / 10;
                this.currentMonster.damage(dmg);
                // Update health text
                this.monsterHealthText.text = this.currentMonster.alive ? Math.round(this.currentMonster.health) + ' HP' : 'DEAD';
            }
        }
    }
});



game.state.start('play');