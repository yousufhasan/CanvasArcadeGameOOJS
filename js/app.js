// Enemies our player must avoid
var Enemy = function(x,y,speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.initialLeft = 100;
    this.x = x;
    this.y = y;
    this.width = 80;
    this.height = 68;
    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    if(this.x > 500) {
        this.x =- this.initialLeft;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player that plays this game
var Player = function(){

    this.sprite = 'images/char-boy.png';
    this.initialX = 200;
    this.initialY = 380;
    this.width = 67;
    this.height = 78;
    this.score = 0;
    this.yLimit = 60;
    this.leftLimit = 50;
    this.rightLimit = 400;
    this.horizontalJump = 100;
    this.verticalJump = 80;
    this.x = this.initialX;
    this.y = this.initialY;
}

// Add or subtracts the score based on the type
Player.prototype.changeScore = function(type) {

    if(type == 'add') {
        this.score += 100;
    } else {
        if (this.score > 0) {
            this.score -= 100;
        }
    }
};

// initialize the vertical and horizontal position of the player
Player.prototype.initialize = function() {

    this.y = this.initialY;
    this.x = this.initialX;
};

// Draws the player on the screen
Player.prototype.render = function() {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// This function moves the player on canvas based on the type of key pressed.
Player.prototype.handleInput = function(direction) {

    if (direction == 'up') {
        if(this.y > this.yLimit) {
        this.y -= this.verticalJump;
    } else {
        this.changeScore('add');
        this.initialize();
        addNewEnemy();
    }
    } else if (direction == 'down') {
        if (this.y < this.initialY) {
        this.y += this.verticalJump;
        }
    }else if (direction == 'left') {
        if(this.x > this.leftLimit) {
        this.x -= this.horizontalJump;
        }
    }else if (direction == 'right') {
        if(this.x < this.rightLimit) {
        this.x += this.horizontalJump;
        }
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player(),
    allEnemies = [],
    speeds = [50,100,150,200,250],
    enemyRows = [60,140,220],
    enemyStartPos = [-100,-200,-300];

// Adds the new enemy on the screen whenever he reaches the level.
function addNewEnemy() {

    allEnemies.push(new Enemy(enemyStartPos[getRandomInt(0,2)], enemyRows[getRandomInt(0,2)], speeds[getRandomInt(0,4)]));
}

// Generates the random number between min and max range
function getRandomInt(min, max) {

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* This listens for key presses and sends the keys to your
 * Player.handleInput() method. You don't need to modify this.
 */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
