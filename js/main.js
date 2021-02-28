window.addEventListener("load", function () {
    var game = new Game;
    game.initialize();
});

function Game() {
    // Variables
    var canvas, ctx, background, spaceship, defaultSpaceShipHeight, defaultSpaceShipWidth, defaultSpaceShipShotHeight, defaultSpaceShipShotWidth, lapse, arraySpaceShipShots = [], arrayEnemyShots = [], keyboard;

    // Mètodes públics
    this.initialize = function () {
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        addKeyboardEvents();
        backgroundInitialize();
        spaceshipInitialize();
        enemiesInitialize();
        finalBossInitialize();
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
            },
            life: 1
        }
    }

    function enemiesInitialize() {
        arrayEnemies = new Array();
        for (var i=0;i<10;i++) {
            var currentEnemy = new Enemy();
            currentEnemy.x = 10 + (i*79);
            arrayEnemies.push(currentEnemy);
        }
    }

    function finalBossInitialize() {
        defaultFinalBossWidth = 500;
        defaultFinalBossHeight = 325;
        finalBoss = {
            width: defaultFinalBossWidth,
            height: defaultFinalBossHeight,
            x: (canvas.width/2) - (defaultFinalBossWidth/2),
            y: 20,
            image: function() {
                var img = new Image();
                img.src = "img/finalBoss.png";
                return img;
            },
            life: 25
        }
    }
    
    function frameLoop() {
        moveSpaceShip();
        moveShots();
        enemyFire();
        drawBackground();
        drawSpaceship();
        drawSpaceShipShots();
        drawEnemyShots();
        drawEnemies();
        if (!checkEnemies()) {
            drawFinalBoss();
        }
        checkHit();
        checkEnemies();
    }
    
    function drawBackground() {
        ctx.drawImage(background, 0, 0);
    }
    
    function drawSpaceship() {

        if (spaceship.life <= 0) {
            return;
        }
        ctx.drawImage(spaceship.image(), spaceship.x, spaceship.y);
    }

    function drawSpaceShipShots() {
        for (var i in arraySpaceShipShots) {
            var currentShot = arraySpaceShipShots[i];
            ctx.drawImage(currentShot.image, currentShot.x, currentShot.y);
        }
    }

    function drawEnemies() {
        arrayEnemies.forEach(function(currentEnemy, i) {
            ctx.drawImage(currentEnemy.image, currentEnemy.x, currentEnemy.y);
        });
    }

    function drawFinalBoss() {
        if (finalBoss.life <= 0) {
            return;
        }
        ctx.drawImage(finalBoss.image(),finalBoss.x,finalBoss.y);
    }

    function drawEnemyShots() {
        arrayEnemyShots.forEach(function (currentShot, i) {
            ctx.drawImage(currentShot.image, currentShot.x, currentShot.y);
        })
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

        if (keyboard[32]) {
            if (!keyboard.fire) {
                fire();
                keyboard.fire = true;
            }
        } else {
            keyboard.fire = false;
        }
    }

    function SpaceShipShot() {
        defaultSpaceShipShotWidth = 24;
        defaultSpaceShipShotHeight = 36;
        this.width = defaultSpaceShipShotWidth;
        this.height = defaultSpaceShipShotHeight;
        this.x = spaceship.x + ((spaceship.width/2)-(defaultSpaceShipShotWidth/2)); // volem que surti del centre this.y = spaceShip.y -10;
        this.y = spaceship.y -10;
        this.image = new Image();
        this.image.src = "img/goodProjectile.png";
    }

    function Enemy() {
        defaultEnemyWidth = 72;
        defaultEnemyHeight = 50;
        this.width = defaultEnemyWidth;
        this.height = defaultEnemyHeight;
        this.x = 0;
        this.y = 10;
        this.image = new Image();
        this.image.src = "img/badGuy.png";
    }

    function EnemyShot(enemy) {
        defaultEnemyShotWidth = 20;
        defaultEnemyShotHeight = 33;
        this.width = defaultEnemyShotWidth;
        this.height = defaultEnemyShotHeight;
        this.x = enemy.x + ((enemy.width/2)-(defaultEnemyShotWidth/2)); // volem que surti del centre this.y = enemy.y + 30;
        this.y = enemy.y + 30;
        this.image = new Image();
        this.image.src = "img/badProjectile.png";
    }

    function moveShots() {
        for (var i in arraySpaceShipShots) {
            var currentShot = arraySpaceShipShots[i];
            currentShot.y -= 2;
        }
        /*
        Aquesta funció de filter() serveix per esborrar elements de l'array quan han sobrepassat el canvas, és a dir, quan la coordenada y < 0
        */
        arraySpaceShipShots = arraySpaceShipShots.filter(function(shot) {
            return shot.y > 0;
        });

        /*********** CONTROL DEL FOC HOSTIL *************/
        for (var i in arrayEnemyShots) {
            var currentShot = arrayEnemyShots[i];
            currentShot.y += 2;
        }

        arrayEnemyShots = arrayEnemyShots.filter(function(shot) {
            return shot.y > 0;
        });

    }

    /*
    Posem projectils al array de projectils arraySpaceShipShots[] per anar-los posteriorment dibuixant per pantalla.
    */
    function fire() {
        var currentShot = new SpaceShipShot();
        arraySpaceShipShots.push(currentShot);
    }

    function hit(a,b) {

        var hit = false;

        //Col·lisions horitzontals
        if(b.x + b.width >= a.x && b.x < a.x + a.width) {
            //Col·lisions verticals
            if(b.y + b.height >= a.y && b.y < a.y + a.height) {
                hit = true;
            }
        }

        //Col·lisió de a amb b
        if(b.x <= a.x && b.x + b.width >= a.x + a.width) {
            if(b.y <= a.y && b.y + b.height >= a.y + a.height) {
                hit = true;
            }
        }

        //Col·lisió de b amb a
        if(a.x <= b.x && a.x + a.width >= b.x + b.width) {
            if(a.y <= b.y && a.y + a.height >= b.y + b.height) {
                hit = true;
            }
        }

        return hit;
    }

    function checkHit() {

        // Aquesta funció verifica si dos elements han col·lisionat.
        for(var i in arraySpaceShipShots) {

            var currentShot = arraySpaceShipShots[i];

            for(var j in arrayEnemies) {

                var currentEnemy = arrayEnemies[j];

                if (hit(currentShot, currentEnemy)) {
                    console.log("BOOM!");
                    arrayEnemies.splice(arrayEnemies.indexOf(currentEnemy),1);
                }

            }
            if (!checkEnemies() && finalBoss.life > 0) {
                if (hit(currentShot, finalBoss)) {
                    finalBoss.life--;
                    arraySpaceShipShots.splice(arraySpaceShipShots.indexOf(currentShot),1);
                    console.log(finalBoss.life);
                }
            }
        }

        // Verifiquem col·lisions amb la nau
        if(spaceship.life > 0) {
            arrayEnemyShots.forEach(function(currentShot, i) {
                if(hit(currentShot,spaceship)) {
                    spaceship.life--;
                }
            });
        }
    }

    function checkEnemies() {
        if (arrayEnemies.length <= 0)
            return false;
        return true;
    }

    function enemyFire() {
        
        if (checkEnemies()) {
            arrayEnemies.forEach(function(currentEnemy, i) {
                // Això és la IA dels enemics
                if (Math.floor(Math.random() * 200) == 0) {
                    var currentShot = new EnemyShot(currentEnemy);
                    arrayEnemyShots.push(currentShot);
                }
            });
        } else {
            if(finalBoss.life <= 0) {
                return;
            }
            // IA del Final Boss
            if (Math.floor(Math.random() * 30) == 0) {
                var currentShot = new EnemyShot(finalBoss);
                arrayEnemyShots.push(currentShot);
            }
        }
    }
}
