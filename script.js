const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

const background = new Image();
background.src = "https://tse1.mm.bing.net/th?id=OIP.1qTMKwdpiGAbQPoIDnr04wHaEK&pid=Api&rs=1&c=1&qlt=95&w=211&h=118";

background.onerror = function () {
    console.error("Erro ao carregar a imagem de fundo.");
};

background.onload = function () {
    const img = new Image();
    img.crossOrigin = "anonymous";

    const player = {
        x: 50,
        y: canvas.height - 70,
        width: 60,
        height: 60,
        jumping: false,
        jumpHeight: 100,
        yVelocity: 0,
        speed: 5,
        sprite: img,
        lives: 3,
    };

    const path = [];

    const platforms = [
        { x: 0, y: canvas.height - 20, width: canvas.width, height: 20, imageSrc: "https://tse1.mm.bing.net/th?id=OIP.1qTMKwdpiGAbQPoIDnr04wHaEK&pid=Api&rs=1&c=1&qlt=95&w=211&h=118" },
        // Adicione uma plataforma sólida no fundo
        { x: 0, y: canvas.height - 10, width: canvas.width, height: 10 },
        // ... (resto do código da plataforma)
    ];

    const obstacles = [
        { x: 200, y: canvas.height - 50, width: 40, height: 30 },
        // ... (resto do código dos obstáculos)
    ];

    function drawPlayer() {
        ctx.drawImage(player.sprite, player.x, player.y, player.width, player.height);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.lineWidth = 5;
        ctx.lineJoin = "round";
        ctx.beginPath();
        for (let i = 0; i < path.length; i++) {
            const point = path[i];
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }

    function updatePlayer() {
        player.yVelocity += 0.5;
        player.y += player.yVelocity;

        if (leftPressed()) {
            player.x -= player.speed;
        }
        if (rightPressed()) {
            player.x += player.speed;
        }

        path.push({ x: player.x + player.width / 2, y: player.y + player.height / 2 });
        if (path.length > 20) {
            path.shift();
        }

        platforms.forEach(platform => {
            if (
                player.x < platform.x + platform.width &&
                player.x + player.width > platform.x &&
                player.y < platform.y + platform.height &&
                player.y + player.height > platform.y
            ) {
                if (platform.slope) {
                    const platformTopY = platform.y + (platform.slope > 0 ? 0 : platform.height);
                    const playerOnPlatformY = player.y + player.height;
                    if (playerOnPlatformY > platformTopY) {
                        player.y = platformTopY - player.height;
                        player.yVelocity = 0;
                        player.jumping = false;
                        player.jumpHeight = 100;
                    }
                } else {
                    player.y = platform.y - player.height;
                    player.yVelocity = 0;
                    player.jumping = false;
                    player.jumpHeight = 100;
                }
            }
        });

        obstacles.forEach(obstacle => {
            if (
                player.x < obstacle.x + obstacle.width &&
                player.x + player.width > obstacle.x &&
                player.y < obstacle.y + obstacle.height &&
                player.y + player.height > obstacle.y
            ) {
                player.lives--;
                player.x = 50;
                player.y = canvas.height - 70;
                player.yVelocity = 0;
                if (player.lives <= 0) {
                    console.log("Game Over");
                }
            }
        });

        if (player.y > canvas.height) {
            player.x = 50;
            player.y = canvas.height - 70;
            player.yVelocity = 0;
            player.lives--;
            if (player.lives <= 0) {
                console.log("Game Over");
            }
        }
    }

    function drawPlatforms() {
        platforms.forEach(platform => {
            const platformImage = new Image();
            platformImage.crossOrigin = "anonymous";
            platformImage.src = platform.imageSrc;

            if (platform.slope) {
                ctx.save();
                ctx.transform(1, 0, platform.slope, 1, platform.x, platform.y);
                ctx.drawImage(platformImage, 0, 0, platform.width, platform.height);
                ctx.restore();
            } else {
                ctx.drawImage(platformImage, platform.x, platform.y, platform.width, platform.height);
            }
        });
    }

    function drawObstacles() {
        ctx.fillStyle = "red";
        obstacles.forEach(obstacle => {
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
    }

    function drawLives() {
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("Lives: " + player.lives, 10, 20);
    }

    function keyDownHandler(event) {
        if (event.code === "Space" && !player.jumping) {
            player.jumping = true;
            player.yVelocity = -10;
        }
    }

    function leftPressed() {
        return keyState["KeyA"];
    }
    function leftPressed() {
        return keyState["KeyA"];
    }

    function rightPressed() {
        return keyState["KeyD"];
    }

    const keyState = {};

    document.addEventListener("keydown", (event) => {
        keyState[event.code] = true;
    });

    document.addEventListener("keyup", (event) => {
        keyState[event.code] = false;
    });

    function gameLoop() {
        updatePlayer();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawPlatforms();
        drawObstacles();
        drawPlayer();
        drawLives();

        requestAnimationFrame(gameLoop);
    }

    player.sprite.onload = function () {
        gameLoop();
    };

    player.sprite.src = "https://tse2.mm.bing.net/th?id=OIP.LShNUkMPdfwzn46OVHwOfgHaEH&pid=Api&P=0&h=220";
};

// Carregue a imagem de fundo após definir os handlers onload e onerror
background.src;
