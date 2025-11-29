const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Розмір клітинки
let size = 25;

// Фіксоване поле 600×600
canvas.width = 600;
canvas.height = 600;

let snake = [{ x: snap(canvas.width / 2), y: snap(canvas.height / 2) }];
let dx = size;
let dy = 0;

let food = randomFood();

let lastTime = 0;
let speed = 6;
let paused = false;

document.addEventListener("keydown", handleKeys);

function gameLoop(timestamp) {
    if (!paused && timestamp - lastTime > 1000 / speed) {
        lastTime = timestamp;

        moveSnake();

        if (checkDeath()) {
            alert("Game Over");
            document.location.reload();
            return;
        }

        if (eatFood()) {
            food = randomFood(); // зʼїли → ростемо
        } else {
            snake.pop();
        }

        draw();
    }

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

// --- Малювання ---
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // рамка
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // їжа
    ctx.fillStyle = "#d11";
    ctx.fillRect(food.x, food.y, size, size);

    // змійка
    ctx.fillStyle = "#2b7a0b";
    snake.forEach(p => ctx.fillRect(p.x, p.y, size, size));

    // пауза
    if (paused) {
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.fillText("PAUSE", canvas.width / 2, canvas.height / 2);
    }
}

// --- Логіка ---
function moveSnake() {
    const head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };
    snake.unshift(head);
}

function handleKeys(e) {
    const k = e.key;

    if (k === " ") { // пауза
        paused = !paused;
        return;
    }

    if (paused) return;

    if (k === "ArrowUp" && dy === 0) { dx = 0; dy = -size; }
    if (k === "ArrowDown" && dy === 0) { dx = 0; dy = size; }
    if (k === "ArrowLeft" && dx === 0) { dx = -size; dy = 0; }
    if (k === "ArrowRight" && dx === 0) { dx = size; dy = 0; }
}

function eatFood() {
    return snake[0].x === food.x && snake[0].y === food.y;
}

function randomFood() {
    const cellsX = canvas.width / size;
    const cellsY = canvas.height / size;

    return {
        x: Math.floor(Math.random() * cellsX) * size,
        y: Math.floor(Math.random() * cellsY) * size
    };
}

function checkDeath() {
    const h = snake[0];

    if (h.x < 0 || h.x >= canvas.width ||
        h.y < 0 || h.y >= canvas.height)
        return true;

    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === h.x && snake[i].y === h.y) return true;
    }

    return false;
}

// Вирівнювання до сітки
function snap(v) {
    return Math.floor(v / size) * size;
}
