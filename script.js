const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restartButton'); // Novo!

const gridSize = 20;
let snake = [];
let food = {};
let dx = 1;
let dy = 0;
let score = 0;
let gameInterval;
let isGameOver = false;

// 1. Gera uma nova posição para a comida
function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
}

// 2. Desenha a cobrinha e a comida
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    ctx.fillStyle = 'lime';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
}

// 3. Atualiza a posição da cobrinha
function update() {
    if (isGameOver) {
        return;
    }

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = `Pontos: ${score}`;
        generateFood();
    } else {
        snake.pop();
    }

    if (checkCollision()) {
        endGame();
        return;
    }
}

// 4. Verifica se a cobrinha colidiu com a parede ou com ela mesma
function checkCollision() {
    const head = snake[0];

    const hitWall = head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize;

    const hitSelf = snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);

    return hitWall || hitSelf;
}

// 5. Função para terminar o jogo
function endGame() {
    isGameOver = true;
    clearInterval(gameInterval);
    alert(`Fim de jogo! Sua pontuação: ${score}`);
}

// 6. Loop principal do jogo
function gameLoop() {
    update();
    draw();
}

// 7. Função para iniciar/reiniciar o jogo - Novo!
function startGame() {
    // Reseta as variáveis do jogo
    snake = [{ x: 10, y: 10 }];
    dx = 1;
    dy = 0;
    score = 0;
    isGameOver = false;
    scoreElement.textContent = `Pontos: 0`;

    // Limpa qualquer intervalo anterior e inicia um novo
    if (gameInterval) {
        clearInterval(gameInterval);
    }
    generateFood();
    gameInterval = setInterval(gameLoop, 100);
}

// 8. Controle de movimento com as setas do teclado
document.addEventListener('keydown', e => {
    // Previne que o jogo mude de direção para o oposto
    switch (e.key) {
        case 'ArrowUp':
            if (dy === 0) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
            if (dy === 0) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
            if (dx === 0) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx === 0) { dx = 1; dy = 0; }
            break;
    }
});

// Evento para o botão de Recomeçar - Novo!
restartButton.addEventListener('click', startGame);

// Inicia o jogo pela primeira vez
startGame();