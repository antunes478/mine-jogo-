const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = {
  x: 50,
  y: canvas.height - 30,
  width: 20,
  height: 20,
  speed: 7,
  jumpHeight: 300,
  yVelocity: 0,
  jumping: false,
  lives: 3,
};

const platforms = [];
const obstacles = [];

function gameLoop() {
  updatePlayer();
  updateObstacles();

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.fillStyle = "green";
  platforms.forEach(platform => {
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  });

  ctx.fillStyle = "red";
  obstacles.forEach(obstacle => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });

  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Lives: " + player.lives, 10, 20);

  requestAnimationFrame(gameLoop);
}

function handleKeyPress(event) {
  if (event.code === "KeyA" && player.x > 0) {
    player.x -= player.speed;
  } else if (event.code === "KeyD" && player.x < canvas.width - player.width) {
    player.x += player.speed;
  } else if (event.code === "Space" && !player.jumping) {
    player.jumping = true;
    player.yVelocity = -Math.sqrt(2 * player.jumpHeight * 0.5);
  }
}

function handleKeyRelease(event) {
  if (event.code === "Space") {
    player.jumping = false;
  }
}

function updatePlayer() {
  // Simulate gravity
  player.yVelocity += 0.5;
  player.y += player.yVelocity;

  // Check for collisions with platforms
  platforms.forEach(platform => {
    if (
      player.x < platform.x + platform.width &&
      player.x + player.width > platform.x &&
      player.y + player.height > platform.y &&
      player.y < platform.y + platform.height
    ) {
      player.y = platform.y - player.height;
      player.yVelocity = 0;
      player.jumping = false;
    }
  });

  // Check for collisions with obstacles
  obstacles.forEach(obstacle => {
    if (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y + player.height > obstacle.y &&
      player.y < obstacle.y + obstacle.height
    ) {
      player.lives--;

      if (player.lives <= 0) {
        alert("Game Over");
        resetGame();
      } else {
        player.x = 50;
        player.y = canvas.height - 30;
      }
    }
  });

  // Keep the player within the canvas
  if (player.y > canvas.height - player.height) {
    player.y = canvas.height - player.height;
    player.yVelocity = 0;
    player.jumping = false;
  }

  // Add some friction to slow down the player gradually
  player.yVelocity *= 0.9;
}

function updateObstacles() {
  obstacles.forEach(obstacle => {
    obstacle.y += 2;

    if (obstacle.y > canvas.height) {
      obstacle.y = 0;
      obstacle.x = Math.random() * (canvas.width - obstacle.width);
    }
  });
}

function resetGame() {
  player.lives = 3;
  player.x = 50;
  player.y = canvas.height - 30;

  platforms.length = 0;
  obstacles.length = 0;

  createPlatform(0, canvas.height - 10, canvas.width, 10);
  createPlatform(200, 300, 100, 10);
  createPlatform(400, 250, 100, 10);
  createPlatform(600, 200, 100, 10);

  createObstacle(100, canvas.height - 20, 20, 20);
  createObstacle(300, canvas.height - 20, 20, 20);
  createObstacle(500, canvas.height - 20, 20, 20);
}

function createPlatform(x, y, width, height) {
  platforms.push({ x, y, width, height });
}

function createObstacle(x, y, width, height) {
  obstacles.push({ x, y, width, height });
}

document.addEventListener("keydown", handleKeyPress);
document.addEventListener("keyup", handleKeyRelease);

resetGame();
gameLoop();
