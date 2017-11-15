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
            { name: 'Aerocephal', image: 'aerocephal' },
            { name: 'Arcana Drake', image: 'arcana_drake' },
            { name: 'Aurum Drakueli', image: 'aurum-drakueli' },
            { name: 'Bat', image: 'bat' },
            { name: 'Daemarbora', image: 'daemarbora' },
            { name: 'Deceleon', image: 'deceleon' },
            { name: 'Demonic Essence', image: 'demonic_essence' },
            { name: 'Dune Crawler', image: 'dune_crawler' },
            { name: 'Green Slime', image: 'green_slime' },
            { name: 'Nagaruda', image: 'nagaruda' },
            { name: 'Rat', image: 'rat' },
            { name: 'Scorpion', image: 'scorpion' },
            { name: 'Skeleton', image: 'skeleton' },
            { name: 'Snake', image: 'snake' },
            { name: 'Spider', image: 'spider' },
            { name: 'Stygian Lizard', image: 'stygian_lizard' }
        ]
        this.monsters = this.game.add.group();
        var monster;
        monsterData.forEach(function(data) {
            // Create a sprite for them off screen
            monster = state.monsters.create(1000, game.world.centerY, data.image);
            // Center anchor
            monster.anchor.setTo(0.5);
            // Reference to the database
            monster.details = data;

            // Enable input so we can click it!
            monster.inputEnabled = true;
            monster.events.onInputDown.add(state.onClickMonster, state);
        });

        this.currentMonster = this.monsters.getRandom();
        this.currentMonster.position.set(this.game.world.centerX + 100, this.game.world.centerY);

        //var skeletonSprite = game.add.sprite(450, 290, 'skeleton');
        //skeletonSprite.anchor.setTo(0.5, 0.5);

    },
    render: function () {
        //game.debug.text('Adventure Awaits!', 250, 290);
        game.debug.text(this.currentMonster.details.name, 
            this.game.world.centerX - this.currentMonster.width/2, 
            this.game.world.centerY + this.currentMonster.height/2);
    },

    onClickMonster: function() {
        // Reset the currentMonster before we move him
        this.currentMonster.position.set(1000, this.game.world.centerY);
        // Now pick the next in the list, and bring him up
        this.currentMonster = this.monsters.getRandom();
        this.currentMonster.position.set(this.game.world.centerX + 100, this.game.world.centerY);
    }
});



game.state.start('play');