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

    // Draw the player character
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        ctx.fillStyle = '#0095DD';
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

    // Continue
    window.requestAnimationFrame(draw);
}

// Begin
draw();

// Start spawning enemies
setInterval(spawnEnemy, 200);
