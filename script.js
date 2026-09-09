// ======================================================
// 🏓 PING PONG
// ======================================================
//
// Versão 2:
//
// ✓ Menu
// ✓ Dificuldade
// ✓ Partida até 11
// ✓ Sets
// ✓ Melhor de 3
// ✓ Contagem regressiva
// ✓ "PONTO!"
// ✓ Tela de vitória
// ✓ Raquetes melhoradas
// ✓ Movimento suave
//
// Agora sim isso está começando a parecer um jogo.
//
// ======================================================


// ======================================================
// CANVAS
// ======================================================

const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");


// ======================================================
// TELAS
// ======================================================

const menu =
    document.getElementById("menu");

const game =
    document.getElementById("game");

const gameOver =
    document.getElementById("gameOver");


// ======================================================
// BOTÕES
// ======================================================

const startButton =
    document.getElementById("startButton");

const restartButton =
    document.getElementById("restartButton");

const menuButton =
    document.getElementById("menuButton");


// ======================================================
// PLACAR
// ======================================================

const playerScoreText =
    document.getElementById("playerScore");

const cpuScoreText =
    document.getElementById("cpuScore");

const playerSetsText =
    document.getElementById("playerSets");

const cpuSetsText =
    document.getElementById("cpuSets");


// ======================================================
// OUTROS ELEMENTOS
// ======================================================

const countdownText =
    document.getElementById("countdown");

const pointMessage =
    document.getElementById("pointMessage");

const winnerText =
    document.getElementById("winnerText");

const finalScore =
    document.getElementById("finalScore");


// ======================================================
// DIFICULDADE
// ======================================================

let difficulty = "normal";


const difficulties = {

    easy: {
        cpuSpeed: 2.0
    },

    normal: {
        cpuSpeed: 2.8
    },

    hard: {
        cpuSpeed: 3.8
    }

};


// ======================================================
// PLACAR
// ======================================================

let playerScore = 0;

let cpuScore = 0;

let playerSets = 0;

let cpuSets = 0;


// ======================================================
// ESTADO
// ======================================================

let gameRunning = false;

let gamePaused = true;

let countdownRunning = false;


// ======================================================
// RAQUETES
// ======================================================

const paddleWidth = 18;

const paddleHeight = 95;


// ------------------------------------------------------
// JOGADOR
// ------------------------------------------------------

const player = {

    x: 25,

    y:
        canvas.height / 2 -
        paddleHeight / 2,

    width: paddleWidth,

    height: paddleHeight,

    // Velocidade máxima.
    // Devagar o suficiente para você não
    // atravessar a parede em busca da bola.

    maxSpeed: 3.5,

    // Velocidade atual.

    velocityY: 0

};


// ------------------------------------------------------
// CPU
// ------------------------------------------------------

const cpu = {

    x:
        canvas.width -
        25 -
        paddleWidth,

    y:
        canvas.height / 2 -
        paddleHeight / 2,

    width: paddleWidth,

    height: paddleHeight,

    speed: 2.8

};


// ======================================================
// BOLA
// ======================================================

const ball = {

    x: canvas.width / 2,

    y: canvas.height / 2,

    size: 13,

    speedX: 3.5,

    speedY: 2

};


// ======================================================
// CONTROLES
// ======================================================

let keys = {};


// Tecla pressionada.

document.addEventListener(
    "keydown",
    function(event) {

        keys[event.key.toLowerCase()] = true;

    }
);


// Tecla solta.

document.addEventListener(
    "keyup",
    function(event) {

        keys[event.key.toLowerCase()] = false;

    }
);


// ======================================================
// DIFICULDADE
// ======================================================

const difficultyButtons =
    document.querySelectorAll(
        ".difficulty-button"
    );


difficultyButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                difficultyButtons.forEach(
                    function(otherButton) {

                        otherButton.classList.remove(
                            "selected"
                        );

                    }
                );


                button.classList.add(
                    "selected"
                );


                difficulty =
                    button.dataset.difficulty;


                cpu.speed =
                    difficulties[
                        difficulty
                    ].cpuSpeed;

            }
        );

    }
);


// ======================================================
// INICIAR PARTIDA
// ======================================================

startButton.addEventListener(
    "click",
    function() {

        startMatch();

    }
);


function startMatch() {

    menu.classList.add("hidden");

    gameOver.classList.add("hidden");

    game.classList.remove("hidden");


    // Aqui estava faltando antes.
    // Agora o jogo sabe que deve existir.

    gameRunning = true;


    // Zera o placar.

    playerScore = 0;

    cpuScore = 0;

    playerSets = 0;

    cpuSets = 0;


    updateScore();


    // Atualiza a CPU conforme a dificuldade.

    cpu.speed =
        difficulties[
            difficulty
        ].cpuSpeed;


    resetBall();

    startCountdown();

}


// ======================================================
// CONTAGEM
// ======================================================

function startCountdown() {

    gamePaused = true;

    countdownRunning = true;


    let count = 3;


    countdownText.textContent =
        count;


    const interval =
        setInterval(
            function() {

                count--;


                if (count > 0) {

                    countdownText.textContent =
                        count;

                }

                else {

                    clearInterval(interval);


                    countdownText.textContent =
                        "JÁ!";


                    gamePaused = false;

                    countdownRunning = false;


                    setTimeout(
                        function() {

                            countdownText.textContent =
                                "";

                        },
                        600
                    );

                }

            },
            1000
        );

}


// ======================================================
// MOVIMENTO DO JOGADOR
// ======================================================

function updatePlayer() {

    // --------------------------------------------------
    // ACELERAÇÃO
    // --------------------------------------------------
    //
    // Agora não é simplesmente:
    //
    // "apertou W = teleporte"
    //
    // A raquete acelera e desacelera.
    // Finalmente civilização.
    // --------------------------------------------------

    if (keys["w"]) {

        player.velocityY -= 0.35;

    }

    else if (keys["s"]) {

        player.velocityY += 0.35;

    }

    else {

        // Soltou a tecla?
        // Vai desacelerando suavemente.

        player.velocityY *= 0.80;

    }


    // --------------------------------------------------
    // VELOCIDADE MÁXIMA
    // --------------------------------------------------

    if (
        player.velocityY <
        -player.maxSpeed
    ) {

        player.velocityY =
            -player.maxSpeed;

    }


    if (
        player.velocityY >
        player.maxSpeed
    ) {

        player.velocityY =
            player.maxSpeed;

    }


    // --------------------------------------------------
    // MOVIMENTO
    // --------------------------------------------------

    player.y +=
        player.velocityY;


    // --------------------------------------------------
    // LIMITES
    // --------------------------------------------------

    if (player.y < 0) {

        player.y = 0;

        player.velocityY = 0;

    }


    if (
        player.y +
        player.height >
        canvas.height
    ) {

        player.y =
            canvas.height -
            player.height;

        player.velocityY = 0;

    }

}


// ======================================================
// MOVIMENTO DA CPU
// ======================================================

function updateCPU() {

    const cpuCenter =
        cpu.y +
        cpu.height / 2;


    // A CPU tenta acompanhar a bola,
    // mas possui uma pequena margem de erro.

    if (
        cpuCenter <
        ball.y - 10
    ) {

        cpu.y += cpu.speed;

    }

    else if (
        cpuCenter >
        ball.y + 10
    ) {

        cpu.y -= cpu.speed;

    }


    // Limites.

    if (cpu.y < 0) {

        cpu.y = 0;

    }


    if (
        cpu.y +
        cpu.height >
        canvas.height
    ) {

        cpu.y =
            canvas.height -
            cpu.height;

    }

}


// ======================================================
// MOVIMENTO DA BOLA
// ======================================================

function updateBall() {

    ball.x += ball.speedX;

    ball.y += ball.speedY;

}


// ======================================================
// COLISÃO COM PAREDES
// ======================================================

function wallCollision() {

    if (ball.y <= 0) {

        ball.y = 0;

        ball.speedY *= -1;

    }


    if (
        ball.y +
        ball.size >=
        canvas.height
    ) {

        ball.y =
            canvas.height -
            ball.size;

        ball.speedY *= -1;

    }

}


// ======================================================
// COLISÃO COM RAQUETES
// ======================================================

function paddleCollision() {

    // --------------------------------------------------
    // JOGADOR
    // --------------------------------------------------

    if (
        ball.speedX < 0 &&

        ball.x <
        player.x +
        player.width &&

        ball.x +
        ball.size >
        player.x &&

        ball.y <
        player.y +
        player.height &&

        ball.y +
        ball.size >
        player.y
    ) {

        ball.x =
            player.x +
            player.width;


        ball.speedX *= -1;


        changeBallDirection(player);

    }


    // --------------------------------------------------
    // CPU
    // --------------------------------------------------

    if (
        ball.speedX > 0 &&

        ball.x +
        ball.size >
        cpu.x &&

        ball.x <
        cpu.x +
        cpu.width &&

        ball.y <
        cpu.y +
        cpu.height &&

        ball.y +
        ball.size >
        cpu.y
    ) {

        ball.x =
            cpu.x -
            ball.size;


        ball.speedX *= -1;


        changeBallDirection(cpu);

    }

}


// ======================================================
// DIREÇÃO DA BOLA
// ======================================================

function changeBallDirection(paddle) {

    const paddleCenter =
        paddle.y +
        paddle.height / 2;


    const ballCenter =
        ball.y +
        ball.size / 2;


    const difference =
        ballCenter -
        paddleCenter;


    // A posição do impacto determina
    // a inclinação da bola.

    ball.speedY =
        difference * 0.09;


    // Pequena aceleração.

    ball.speedX *= 1.03;


    // Limite.

    if (
        Math.abs(ball.speedX) > 7
    ) {

        ball.speedX =
            ball.speedX > 0
                ? 7
                : -7;

    }

}


// ======================================================
// VERIFICAR PONTO
// ======================================================

function checkScore() {

    // CPU marcou.

    if (
        ball.x +
        ball.size <
        0
    ) {

        cpuScore++;

        updateScore();

        showPoint();

        checkSet();

    }


    // Jogador marcou.

    if (
        ball.x >
        canvas.width
    ) {

        playerScore++;

        updateScore();

        showPoint();

        checkSet();

    }

}


// ======================================================
// ATUALIZAR PLACAR
// ======================================================

function updateScore() {

    playerScoreText.textContent =
        playerScore;

    cpuScoreText.textContent =
        cpuScore;

    playerSetsText.textContent =
        playerSets;

    cpuSetsText.textContent =
        cpuSets;

}


// ======================================================
// MOSTRAR PONTO
// ======================================================

function showPoint() {

    gamePaused = true;


    pointMessage.textContent =
        "PONTO!";


    pointMessage.classList.add(
        "show"
    );


    setTimeout(
        function() {

            pointMessage.classList.remove(
                "show"
            );

        },
        700
    );


    setTimeout(
        function() {

            if (gameRunning) {

                resetBall();

                startCountdown();

            }

        },
        900
    );

}


// ======================================================
// VERIFICAR SET
// ======================================================

function checkSet() {

    // Precisa chegar em 11
    // e ter dois pontos de vantagem.

    if (
        playerScore >= 11 &&

        playerScore -
        cpuScore >= 2
    ) {

        playerSets++;

        updateScore();

        finishSet("player");

        return;

    }


    if (
        cpuScore >= 11 &&

        cpuScore -
        playerScore >= 2
    ) {

        cpuSets++;

        updateScore();

        finishSet("cpu");

        return;

    }

}


// ======================================================
// FINALIZAR SET
// ======================================================

function finishSet(winner) {

    gamePaused = true;


    // Primeiro vemos se alguém ganhou
    // dois sets.

    if (playerSets >= 2) {

        setTimeout(
            function() {

                endMatch("player");

            },
            1000
        );

        return;

    }


    if (cpuSets >= 2) {

        setTimeout(
            function() {

                endMatch("cpu");

            },
            1000
        );

        return;

    }


    // Ainda não acabou.
    // Novo set.

    setTimeout(
        function() {

            playerScore = 0;

            cpuScore = 0;


            updateScore();


            resetBall();


            startCountdown();

        },
        1200
    );

}


// ======================================================
// FIM DA PARTIDA
// ======================================================

function endMatch(winner) {

    gameRunning = false;

    gamePaused = true;


    game.classList.add("hidden");

    gameOver.classList.remove("hidden");


    if (winner === "player") {

        winnerText.textContent =
            "🏆 VOCÊ VENCEU!";

    }

    else {

        winnerText.textContent =
            "💀 CPU VENCEU!";

    }


    finalScore.textContent =
        playerSets +
        " - " +
        cpuSets;

}


// ======================================================
// RESETAR BOLA
// ======================================================

function resetBall() {

    ball.x =
        canvas.width / 2 -
        ball.size / 2;


    ball.y =
        canvas.height / 2 -
        ball.size / 2;


    // A bola começa devagar novamente.

    const direction =
        Math.random() > 0.5
            ? 1
            : -1;


    ball.speedX =
        3.5 * direction;


    ball.speedY =
        Math.random() > 0.5
            ? 2
            : -2;


    // Raquetes voltam ao centro.

    player.y =
        canvas.height / 2 -
        player.height / 2;


    cpu.y =
        canvas.height / 2 -
        cpu.height / 2;


    // E o jogador não continua deslizando
    // depois do ponto como se tivesse escorregado.

    player.velocityY = 0;

}


// ======================================================
// DESENHAR RAQUETE
// ======================================================

function drawPaddle(paddle) {

    // --------------------------------------------------
    // SOMBRA
    // --------------------------------------------------

    ctx.fillStyle = "#000";

    ctx.beginPath();

    ctx.roundRect(
        paddle.x + 4,
        paddle.y + 4,
        paddle.width,
        paddle.height,
        6
    );

    ctx.fill();


    // --------------------------------------------------
    // CORPO
    // --------------------------------------------------

    ctx.fillStyle = "#eeeeee";

    ctx.beginPath();

    ctx.roundRect(
        paddle.x,
        paddle.y,
        paddle.width,
        paddle.height,
        6
    );

    ctx.fill();


    // --------------------------------------------------
    // DETALHE
    // --------------------------------------------------

    ctx.fillStyle = "#777";

    ctx.beginPath();

    ctx.roundRect(
        paddle.x + 4,
        paddle.y + 8,
        4,
        paddle.height - 16,
        3
    );

    ctx.fill();

}


// ======================================================
// DESENHAR BOLA
// ======================================================

function drawBall() {

    ctx.fillStyle = "white";


    ctx.beginPath();

    ctx.arc(
        ball.x +
        ball.size / 2,

        ball.y +
        ball.size / 2,

        ball.size / 2,

        0,

        Math.PI * 2
    );

    ctx.fill();

}


// ======================================================
// LINHA CENTRAL
// ======================================================

function drawCenterLine() {

    ctx.strokeStyle = "#444";

    ctx.lineWidth = 2;

    ctx.setLineDash([
        10,
        12
    ]);


    ctx.beginPath();

    ctx.moveTo(
        canvas.width / 2,
        0
    );

    ctx.lineTo(
        canvas.width / 2,
        canvas.height
    );

    ctx.stroke();


    ctx.setLineDash([]);

}


// ======================================================
// DESENHAR
// ======================================================

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    drawCenterLine();

    drawPaddle(player);

    drawPaddle(cpu);

    drawBall();

}


// ======================================================
// LOOP
// ======================================================

function gameLoop() {

    // O jogador pode mover a raquete
    // mesmo durante a contagem.
    //
    // Porque esperar parado é coisa de NPC.

    if (!countdownRunning) {

        updatePlayer();

    }


    if (
        gameRunning &&
        !gamePaused &&
        !countdownRunning
    ) {

        updateCPU();

        updateBall();

        wallCollision();

        paddleCollision();

        checkScore();

    }


    draw();


    requestAnimationFrame(
        gameLoop
    );

}


// ======================================================
// JOGAR NOVAMENTE
// ======================================================

restartButton.addEventListener(
    "click",
    function() {

        gameOver.classList.add("hidden");

        game.classList.remove("hidden");


        playerScore = 0;

        cpuScore = 0;

        playerSets = 0;

        cpuSets = 0;


        updateScore();


        gameRunning = true;

        gamePaused = true;


        resetBall();

        startCountdown();

    }
);


// ======================================================
// VOLTAR AO MENU
// ======================================================

menuButton.addEventListener(
    "click",
    function() {

        gameOver.classList.add("hidden");

        game.classList.add("hidden");

        menu.classList.remove("hidden");


        gameRunning = false;

        gamePaused = true;

    }
);


// ======================================================
// INICIALIZAÇÃO
// ======================================================

gameRunning = false;

gamePaused = true;

resetBall();

gameLoop();


// ======================================================
// FIM
// ======================================================
//
// Se funcionou:
// parabéns.
//
// Se não funcionou:
// JavaScript acaba de declarar guerra à humanidade.
//
// ======================================================ameLoop();