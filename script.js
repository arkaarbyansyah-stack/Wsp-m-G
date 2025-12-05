// Setup game
const gameContainer = document.getElementById('game-container');
const player = document.getElementById('player');
const restartBtn = document.getElementById('restart-btn');
const scoreElement = document.getElementById('score');
const leftThruster = player.querySelector('.thruster.left');
const rightThruster = player.querySelector('.thruster.right');

let isJumping = false;
let jumpVelocity = 0;
const gravity = 0.8;
let obstacles = [];
let gameActive = true;
let score = 0;
let gameSpeed = 4;

// Mecha idle pose helper
function setThruster(on) {
    leftThruster.style.display = on ? 'block' : 'none';
    rightThruster.style.display = on ? 'block' : 'none';
}

// Create a new obstacle block
function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.className = 'obstacle';
    obstacle.style.left = '600px';
    gameContainer.appendChild(obstacle);
    obstacles.push(obstacle);
}

// Reset everything for new game
function resetGame() {
    obstacles.forEach(o => gameContainer.removeChild(o));
    obstacles = [];
    player.style.bottom = '45px';
    player.classList.remove('gameover');
    isJumping = false;
    jumpVelocity = 0;
    score = 0;
    scoreElement.textContent = "Score: 0";
    gameActive = true;
    restartBtn.style.display = 'none';
    gameSpeed = 4;
    setThruster(false);
}

// Main game loop
function gameLoop() {
    if (!gameActive) return;

    // Sometimes create obstacle
    if (Math.random() < 0.015) {
        createObstacle();
    }

    // Handle jump animation/physics
    let playerBottom = parseInt(player.style.bottom);
    if (isJumping) {
        jumpVelocity -= gravity;
        playerBottom += jumpVelocity;
        setThruster(true);
        if (playerBottom <= 45) {
            playerBottom = 45;
            isJumping = false;
            setThruster(false);
        }
        player.style.bottom = playerBottom + 'px';
    }

    // Update each obstacle's place and check collision
    obstacles.forEach((obs, idx) => {
        let left = parseInt(obs.style.left);
        left -= gameSpeed;
        obs.style.left = `${left}px`;

        // collision
        let playerRect = player.getBoundingClientRect();
        let obsRect = obs.getBoundingClientRect();

        if (
            obsRect.left < playerRect.right - 22 && // margin for chimney
            obsRect.right > playerRect.left + 10 &&
            obsRect.top < playerRect.bottom &&
            obsRect.bottom > playerRect.top + 8
        ) {
            gameActive = false;
            restartBtn.style.display = 'inline-block';
            player.classList.add('gameover'); // grayscale
            setThruster(false);
        }

        // lewat, hilangkan obstacle dan naikin skor
        if (left + obs.offsetWidth < 0) {
            gameContainer.removeChild(obs);
            obstacles.splice(idx, 1);
            if (gameActive) {
                score++;
                scoreElement.textContent = "Score: " + score;
                if (score % 10 === 0)
                    gameSpeed += 0.5;
            }
        }
    });

    requestAnimationFrame(gameLoop);
}

// Player Jump event (spacebar or mouse)
function jump() {
    if (!isJumping && gameActive) {
        isJumping = true;
        jumpVelocity = 14.8;
        setThruster(true);
    }
}

// Binding control events
document.addEventListener('keydown', e => {
    if (e.code === 'Space'||e.code==="ArrowUp") jump();
});
document.addEventListener('mousedown', jump);

// Restart
restartBtn.onclick = () => {
    resetGame();
    requestAnimationFrame(gameLoop);
};

// Set awalan anchor player
player.style.bottom = '45px';
setThruster(false);

// Start!
requestAnimationFrame(gameLoop);
