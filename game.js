const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

// Set canvas to fullscreen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Keyboard events
let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;

// Array of enemy objects on screen
let enemies = [];

// Interval to spawn enemies, gets faster as time progresses
let enemySpawnInterval = 500;

// The score and the current level
let frames = 0;
let level = 1;


// Handle player key down event
document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'Up':
        case 'ArrowUp':
        case 'w':
            upPressed = true;
            break;

        case 'Down':
        case 'ArrowDown':
        case 's':
            downPressed = true;
            break;

        case 'Left':
        case 'ArrowLeft':
        case 'a':
            leftPressed = true;
            break;

        case 'Right':
        case 'ArrowRight':
        case 'd':
            rightPressed = true;
            break;
    }
}, false);


// Handle player key up event
document.addEventListener('keyup', e => {
    switch (e.key) {
        case 'Up':
        case 'ArrowUp':
        case 'w':
            upPressed = false
            break;

        case 'Down':
        case 'ArrowDown':
        case 's':
            downPressed = false
            break;

        case 'Left':
        case 'ArrowLeft':
        case 'a':
            leftPressed = false
            break;

        case 'Right':
        case 'ArrowRight':
        case 'd':
            rightPressed = false;
            break;
    }
}, false);


// Player object
const player =  {
    x: canvas.width / 2,
    y: canvas.height - 30,
    r: 10,
    speed: 4,
    alive: true,
    lives: 5,

    // Draw the player character
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        ctx.fillStyle = this.alive ? '#0095DD' : '#FF0055';
        ctx.fill();
        ctx.closePath();
    },

    // Move the player character based on the keypress event flags set above
    move() {
        if (upPressed) {
            player.y -= player.speed;
        }
        else if (downPressed) {
            player.y += player.speed;
        }
        if (rightPressed) {
            player.x += player.speed;
        }
        else if (leftPressed) {
            player.x -= player.speed;
        }
    },

    // "Kill" the player and revive after some time
    collide() {
        this.alive = false;
        this.lives--;
        setTimeout(() => this.alive = true, 2000);
    }
}


// Enemy class for defining enemy objects
// Might as well make this an ES6 class since we'll be making a bunch of these
class Enemy {
    constructor(x, y, radius = 5, speed = 3) {
        this.x = x;
        this.y = y;
        this.r = radius;
        this.speed = speed;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        ctx.fillStyle = '#F095DD';
        ctx.fill();
        ctx.closePath();
    }

    move() {
        this.y += this.speed;
    }
}


// Spawn a new Enemy object on the screen and delete Enemies that move off the screen
const spawnEnemy = () => {
    // Create a new enemy
    let enemy = new Enemy(Math.random() * canvas.width, 0);
    enemies.push(enemy);

    // Filter out enemies that aren't on the screen anymore
    enemies = enemies.filter(enemy => {
        return enemy.y < canvas.height;
    });
}


// Check if the player has collided with enemies and update player accordingly
const detectCollisions = () => {
    // If player isn't alive, don't bother checking for collisions
    if (!player.alive) {
        return;
    }

    // Check each enemy
    enemies.forEach(enemy => {
        // Calculate distance between centers of player and enemy
        let distance = Math.sqrt(Math.pow(player.x - enemy.x, 2) + Math.pow(player.y - enemy.y, 2));

        // If there's a collision, reduce lives and make the player inactive for a bit
        if (distance <= (player.r + enemy.r)) {
            player.collide();
        }
    });
}


// -----------------------------------------------------------------
// Main draw loop
const draw = () => {
    // Clear last frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Respond to player input and draw
    player.move();
    player.draw();

    // Move and draw enemies
    enemies.forEach(enemy => {
        enemy.draw();
        enemy.move();
    });

    // Check if the player has collided with an enemy and decrement lives if so
    detectCollisions();

    // Continue
    window.requestAnimationFrame(draw);
}

// Begin
draw();

// Start spawning enemies
setInterval(spawnEnemy, enemySpawnInterval);
