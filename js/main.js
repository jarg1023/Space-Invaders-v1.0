window.addEventListener("load", function () {
    var game = new Game;
    game.initialize();
});

function Game() {
    // Variables var canvas,
    var canvas, ctx, background, spaceship, defaultSpaceShipHeight, defaultSpaceShipWidth, lapse, keyboard;

    // Mètodes públics
    this.initialize = function () {
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        addKeyboardEvents();
        backgroundInitialize();
        spaceshipInitialize();
        lapse = window.setInterval(frameLoop, 1000 / 60);
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
            x: (canvas.width / 2) - (defaultSpaceShipWidth / 2),
            y: canvas.height - defaultSpaceShipHeight - 10,
            image: function () {
                let img = new Image();
                img.src = "img/goodGuy.png";
                return img;
            }
        }
    }
    
    function frameLoop() {
        drawBackground();
        drawSpaceship();
        moveSpaceShip();
    }
    
    function drawBackground() {
        ctx.drawImage(background, 0, 0);
    }
    
    function drawSpaceship() {
        ctx.drawImage(spaceship.image(), spaceship.x, spaceship.y);
    }

    function addKeyboardEvents()
    {
        keyboard = new Array();
        addEvent(document, "keydown", function (e) {
            keyboard[e.keyCode] = true;
        });
        addEvent(document, "keyup", function (e) {
            keyboard[e.keyCode] = false;
        });
        
    }

    function addEvent(element, eventName, func) {
        if (element.addEventListener) {
            //Per navegadors (Chrome, Firefox, Opera etc.)
            element.addEventListener(eventName, func, false);
        } else if (element.attachEvent) {
            //Per Internet Explorer
            element.attachEvent(eventName,func);
        }
    }
    
    function moveSpaceShip() {
        if (keyboard[37]) {
            spaceship.x -= 10;
            if (spaceship.x <= 0) spaceship.x = 0;
        }
        if (keyboard[39]) {
            spaceship.x += 10;
            if (spaceship.x >= (800 - spaceship.width)) spaceship.x = (800 - spaceship.width);
        }
    }
}