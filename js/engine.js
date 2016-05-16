/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        collisionCounter = 0,
        msg = "",
        gameReset = false,
        buttonAdded = false,
        lastTime;

        canvas.width = 505;
        canvas.height = 606;
        canvas.style.zIndex = "1";
        doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {

        collisionCounter = 0;
        msg = "";
        gameReset = false;
        buttonAdded = false;
        player.score = 0;
        lastTime = Date.now();
        main();
        initializeEnemies();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {

        updateEntities(dt);
        checkCollisions();
    }

    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {

        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
    }

    /* This function detects collision between all enemies and the player.
     * if there is a collision it subtracts the score and removes an enemy
     * from the screen.*/
    function checkCollisions(){

        allEnemies.forEach(function(enemy) {
        if(isCollide(player,enemy)) {
            player.initialize();
            player.changeScore('subtract');
            allEnemies.pop();
            collisionCounter++;
        }
        });
    }

    // This is the actual function which finds collision between objects.
    function isCollide(a, b) {

    return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    );
}

    // This function initalizes the enemies when the game begins.
    function initializeEnemies(){

        var enemy1 = new Enemy(enemyStartPos[0], enemyRows[0], speeds[0]),
            enemy2 = new Enemy(enemyStartPos[1], enemyRows[1], speeds[4]),
            enemy3 = new Enemy(enemyStartPos[2], enemyRows[2], speeds[2]);
            allEnemies.push(enemy1);
            allEnemies.push(enemy2);
            allEnemies.push(enemy3);

    }
    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
        displayScore(ctx);
        checkScore();
        reset();
    }

    // This function displays the score on the screen.
    function displayScore(ctx){

        ctx.font = "20px Georgia";
        ctx.fillText("Total score : "+player.score, 305, 570);
    }

    /* This function checks the score and according to score or number of collisions decides the
     success or failure of a player.*/
    function checkScore(){

        if(player.score >= 1000) {
            gameReset = true;
            msg = "Congratulations! You Won.";
        }else if(collisionCounter >= 10) {
            gameReset = true;
            msg = "Sorry you Failed. Try Again.";
        }
    }
    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        player.render();
    }

    // This function  handle game reset states.
    function reset() {

        if (gameReset) {
        allEnemies = [];
        player.initialize();
        addHeading();
            if (!buttonAdded) {
            doc.body.appendChild(addButton());
            buttonAdded = true;
            }
        }
    }

    // This function renders Play button on the screen when the game finishes.
    function addButton() {

        var element = document.createElement("input");
        element.type = "button"
        element.value = "Play Again";
        element.id = "btnPlay";
        element.style.position = "absolute";
        element.style.top = "240px";
        element.style.left = "580px";
        element.style.width = "200px";
        element.style.height = "50px";
        element.style.backgroundColor = "#300000";
        element.style.color = "#fff";
        element.style.fontWeight = "bold";
        element.onclick = function() {
        gameReset=false;
        document.body.removeChild(document.getElementById('btnPlay'))
        init();
        };
        return element;
    }

    // This function shows the result on the screen when the game finishes.
    function addHeading(){

        ctx.font="30px Verdana";
        ctx.fillStyle = 'red';
        ctx.fillText(msg, 50, 190);
        ctx.fillStyle = 'black';
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
