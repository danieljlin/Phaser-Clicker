var game = new Phaser.Game(800, 600, Phaser.AUTO, '');

game.state.add('play', {
    preload: function () {
        game.load.image('skeleton', 'assets/allacrost_enemy_sprites/skeleton.png');
        game.load.image('forest-lights', 'assets/parallax_forest_pack/layers/parallax-forest-lights.png');
        game.load.image('forest-back', 'assets/parallax_forest_pack/layers/parallax-forest-back-trees.png');
        game.load.image('forest-middle', 'assets/parallax_forest_pack/layers/parallax-forest-middle-trees.png');
        game.load.image('forest-front', 'assets/parallax_forest_pack/layers/parallax-forest-front-trees.png');
    },
    create: function () {
        var background = game.add.group();
        // set up each of our background layers to take the full screen
        ['forest-back', 'forest-lights', 'forest-middle', 'forest-front']
            .forEach(function (image) {
                var bg = game.add.tileSprite(0, 0, game.world.width, game.world.height, image, '', game.background);
                bg.tileScale.setTo(4, 4);
            });
        var skeletonSprite = game.add.sprite(450, 290, 'skeleton');
        skeletonSprite.anchor.setTo(0.5, 0.5);

    },
    render: function () {
        game.debug.text('Adventure Awaits!', 250, 290);
    }
});

game.state.start('play');