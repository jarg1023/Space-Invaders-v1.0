window.addEventListener("load", function() {
    var game = new Game;
    game.initialize();
});

function Game() {
    // Variables var canvas,
    var canvas, ctx, background, spaceship, defaultSpaceShipHeight, defaultSpaceShipWidth, lapse;

    // Mètodes públics
    this.initialize = function() {
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        backgroundInitialize();
        spaceshipInitialize();
        lapse = window.setInterval(frameLoop, 1000/60);
    }

    // Mètodes privats
    function backgroundInitialize() {
        background = new Image();
        background.src = "img/background.png";
    }

    function spaceshipInitialize() {
        defaultSpaceShipWidth = 72;
        defaultSpaceShipHeight = 100;
        spaceship = {
            width: defaultSpaceShipWidth,
            height: defaultSpaceShipHeight,
            x: (canvas.width/2) - (defaultSpaceShipWidth/2),
            y: canvas.height - defaultSpaceShipHeight - 10,
            image: function() {
                let img = new Image();
                img.src = "img/goodGuy.png";
                return img;
            }
        }
    }

    function frameLoop() {
        drawBackground();
        drawSpaceship();
    }

    function drawBackground() {
        ctx.drawImage(background, 0, 0);
    }

    function drawSpaceship() {
        ctx.drawImage(spaceship.image(), spaceship.x, spaceship.y);
    }
}