const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

// Set canvas to fullscreen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.font = '16px sans-serif';

// Game state
let onStartScreen = true;
let onEndScreen = false;

document.addEventListener('keypress', e => {
    if (e.code === 'Space') {
        onStartScreen = false;
        // Start spawning enemies
        let enemySpawnInterval = setInterval(spawnEnemy, objectSpawnRate);

        // Spawn powerups every 5 seconds
        let powerupSpawnInterval = setInterval(spawnPowerup, objectSpawnRate + 5000);
    }
});

// Keyboard events
let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;

// Array of enemy objects and powerup objects on screen, along with common properties
let enemies = [];
let powerups = [];
let objectSpawnRate = 500;   // in ms
let objectSpeed = 3;

// The score (how long the player has been playing) and the current level
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
    y: canvas.height - 100,
    r: 18,
    speed: 6,
    state: 'alive',
    lives: 5,


    // Draw the player character
    draw() {
        // Player icon is thinking normally, dizzy when losing a life, and smirking on powerup
        const playerImg = new Image();
        playerImg.src = 'images/thinking-face.png';

        switch (this.state) {
            case 'alive':
                break;
            case 'dead':
                playerImg.src = 'images/dizzy-face.png';
                break;

            case 'smirk':
                playerImg.src = 'images/smirking-face.png';
                break;
        }

        playerImg.width *= 0.25;
        playerImg.height *= 0.25;
        ctx.drawImage(playerImg, this.x - playerImg.width / 2, this.y - playerImg.height / 2, playerImg.width, playerImg.height);

        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        // ctx.fillStyle = this.alive ? '#0095DD' : '#FF0055';
        // ctx.fill();
        // ctx.closePath();
    },

    // Move the player character based on the keypress event flags set above
    move() {
        // Handle movement with edge conditions
        if (upPressed) {
            if (player.y <= 0) {
                player.y += 1;
            } else {
                player.y -= player.speed;
            }
        }
        else if (downPressed) {
            if (player.y >= canvas.height) {
                player.y -= 1;
            } else {
                player.y += player.speed;
            }
        }
        if (rightPressed) {
            if (player.x >= canvas.width) {
                player.x -= 1;
            } else {
                player.x += player.speed;
            }
        }
        else if (leftPressed) {
            if (player.x <= 0) {
                player.x += 1;
            }
            else {
                player.x -= player.speed;
            }
        }
    },

    // "Kill" the player and revive after some time
    collide() {
        this.state = 'dead';
        this.lives--;
        setTimeout(() => this.state = 'alive', 2000);
    },

    // Smirk while gaining a life
    gainLife() {
        this.state = 'smirk';
        this.lives++;
        setTimeout(() => this.state = 'alive', 1500);
    }
}


// Enemy class for defining enemy objects
// Might as well make this an ES6 class since we'll be making a bunch of these
class Enemy {
    constructor(x, y, radius, speed) {
        this.x = x;
        this.y = y;
        this.r = radius;
        this.speed = speed;
    }

    draw() {
        // Draw a poop emoji
        const poopEmoji = new Image();
        poopEmoji.src = 'images/poo.png';
        poopEmoji.width *= 0.25;
        poopEmoji.height *= 0.25;
        ctx.drawImage(poopEmoji, this.x - poopEmoji.width / 2, this.y - poopEmoji.height / 2, poopEmoji.width, poopEmoji.height);

        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        // ctx.fillStyle = '#F095DD';
        // ctx.fill();
        // ctx.closePath();
    }

    move() {
        this.y += this.speed;
    }
}


// Powerup class for defining powerup objects
class Powerup {
    constructor(x, y, radius, speed, type) {
        this.x = x;
        this.y = y;
        this.r = radius;
        this.speed = speed;
        this.type = type;
    }

    draw() {
        // Draw the powerup emoji depending on supplied type
        if (this.type === 'heart') {
            // Draw a heart powerup
            const heartEmoji = new Image();
            heartEmoji.src = 'images/heart.png';
            heartEmoji.width *= 0.25;
            heartEmoji.height *= 0.25;
            ctx.drawImage(heartEmoji, this.x - heartEmoji.width / 2, this.y - heartEmoji.height / 2, heartEmoji.width, heartEmoji.height);
        }
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        // ctx.fillStyle = '#F095DD';
        // ctx.fill();
        // ctx.closePath();
    }

    move() {
        this.y += this.speed;
    }
}


// Spawn a new Enemy object on the screen and delete Enemies that move off the screen
const spawnEnemy = () => {
    // Create a new enemy
    const randomX = Math.random() * canvas.width;
    const randomSpeed = ((Math.random() * objectSpeed) + objectSpeed) / 2;
    // const randomRadius = ((Math.random() * 10) + 5) / 2;
    const randomRadius = 20;
    let enemy = new Enemy(randomX, 0, randomRadius, randomSpeed);
    enemies.push(enemy);

    // Filter out enemies that aren't on the screen anymore
    enemies = enemies.filter(enemy => {
        return enemy.y < canvas.height;
    });
}


// Spawn a new Powerup object on the screen and delete Powerups that move off the screen
const spawnPowerup = () => {
    // Create a new powerup
    const randomX = Math.random() * canvas.width;
    const randomSpeed = ((Math.random() * objectSpeed) + objectSpeed) / 2;
    const randomRadius = 20;
    let powerup = new Powerup(randomX, 0, randomRadius, randomSpeed, 'heart');
    powerups.push(powerup);

    // Filter out powerups that aren't on the screen anymore
    powerups = powerups.filter(powerup => {
        return powerup.y < canvas.height;
    });
}


// Check if the player has collided with enemies and update player accordingly
const detectEnemyCollisions = () => {
    // If player isn't alive, don't bother checking for enemy collisions
    if (player.state == 'dead') {
        return;
    }

    // Check each enemy
    enemies.forEach(enemy => {
        // Calculate distance between centers of player and enemy using distance formula
        let distance = Math.sqrt(Math.pow(player.x - enemy.x, 2) + Math.pow(player.y - enemy.y, 2));

        // If there's a collision, reduce lives and make the player inactive for a bit
        if (distance <= (player.r + enemy.r)) {
            player.collide();
        }
    });
}


// Check if the player has collided with powerups and update
const detectPowerupCollisions = () => {
    // Check each powerup
    powerups.forEach(powerup => {
        // Calculate distance between centers of player and powerup using distance formula
        let distance = Math.sqrt(Math.pow(player.x - powerup.x, 2) + Math.pow(player.y - powerup.y, 2));

        // If there's a collision, increase lives and remove powerup from screen
        if (distance <= (player.r + powerup.r)) {
            player.gainLife();
            powerups = powerups.filter(p => p !== powerup);
        }
    });
}


// Increase intensity of the game at specific intervals
const increaseGameIntensity = () => {
    // Every 1000 frames, go up a level and ramp things up
    if (frames % 1000 == 0) {
        level++;
        if (objectSpawnRate > 175) {
            // Scale game faster in the beginning
            objectSpawnRate -= 50;
            objectSpeed += 1;
        }
        else if (objectSpawnRate > 50) {
            // Slow down scaling but keep spawning enemies faster
            objectSpawnRate -= 10;
        }
        else if (objectSpawnRate == 130) {
            // Stop increasing spawn rate
        }

        // Reset enemy spawn interval with new values
        enemySpawnInterval = setInterval(spawnEnemy, objectSpawnRate);
    }
}


// Ends the game and shows a defeat popup
const endGame = () => {
    // Draw the dead player
    player.draw();

    // Draw the game over screen
    ctx.fillStyle = '#e3e3e3';
    ctx.fillRect(canvas.width / 4, canvas.height / 4, canvas.width / 2, canvas.height / 2);

    // Draw the game over text
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText('You Died! Refresh the browser to play again.', canvas.width / 2, canvas.height / 2);

    console.log('DED');
}


// Draw current level, score, # of lives, etc
const drawTextInfo = () => {
    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';
    ctx.fillText(`Level ${level}`, 10, 25);
    ctx.fillText(`Score: ${frames++}`, 10, 55);
    ctx.fillText(`Lives: ${player.lives}`, 10, 85);
    ctx.fillText(`Enemy objects: ${enemies.length}`, 10, 115);
    ctx.fillText(`Enemy spawn rate: ${objectSpawnRate}ms`, 10, 145);
    ctx.fillText(`Enemy speed: ${objectSpeed}`, 10, 175);
}


// Draw the start screen
const drawStartScreen = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#e3e3e3';
    ctx.fillRect(canvas.width / 4, canvas.height / 4, canvas.width / 2, canvas.height / 2);
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText('Welcome, press the spacebar to begin the game.', canvas.width / 2, canvas.height / 2);
    ctx.fillText('Move with the arrow keys or WASD, and avoid the poop emojis. Hearts give you more lives.', canvas.width / 2, (canvas.height / 2) + 50);
    ctx.fillText('You have five lives. The game starts out easy, but becomes more difficult as time progresses. Good luck!', canvas.width / 2, (canvas.height / 2) + 80);
}


// -----------------------------------------------------------------
// Main draw loop
const draw = () => {
    // Clear last frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Show start screen if the game hasn't started yet
    if (onStartScreen) {
        drawStartScreen();
    }
    else {
        // Draw UI
        drawTextInfo();

        // Respond to player input and draw
        player.move();
        player.draw();

        // Move and draw enemies
        enemies.forEach(enemy => {
            enemy.draw();
            enemy.move();
        });

        // Move and draw powerups
        powerups.forEach(powerup => {
            powerup.draw();
            powerup.move();
        });

        // Check if the player has collided with an enemy and decrement lives if so
        detectEnemyCollisions();

        // Check if the player has collided with a powerup and increment lives if so
        detectPowerupCollisions();

        // Ramp the game up
        increaseGameIntensity();

        // End the game if the player runs out of lives
        if (player.lives <= 0) {
            player.state = 'dead';
            onEndScreen = true;
            endGame();
            return;
        }
    }
    // Continue
    window.requestAnimationFrame(draw);
}

// Begin draw loop
draw();
