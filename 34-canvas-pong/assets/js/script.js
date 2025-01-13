'use strict';

(function () {
  const gameOverEl = document.querySelector('.game-over');
  const gameOverHeading = document.querySelector('.game-over h1');
  const btnRestart = document.querySelector('.btn-restart');

  // Canvas
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  let raf;
  const score = {
    player: 0,
    computer: 0,
  };
  const winScore = 7;
  const paddleComputerSpeed = 9;

  const ballInitialVelocityY = 3;
  const paddleWidth = 50;
  const paddleHeight = 10;
  const ballRadius = 5;

  const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballRadius,
    vx: 0,
    vy: ballInitialVelocityY,
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fill();
    },
  };

  const paddlePlayer = {
    x: (canvas.width - paddleWidth) / 2,
    y: canvas.height - 20,
    width: paddleWidth,
    height: paddleHeight,
    draw() {
      ctx.beginPath();
      ctx.fillStyle = '#edf6ff';
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.closePath();
    },
  };

  const paddleComputer = {
    x: (canvas.width - paddleWidth) / 2,
    y: 10,
    vx: paddleComputerSpeed,
    width: paddleWidth,
    height: paddleHeight,
    draw() {
      ctx.beginPath();
      ctx.fillStyle = '#cde3ff';
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.closePath();
    },
  };

  function drawGame() {
    // Draw ball
    ball.draw();
    // Draw paddles
    [paddlePlayer, paddleComputer].forEach((paddle) => paddle.draw());
    // Draw score
    drawScore();
    // Draw line
    drawLine();
  }

  function drawScore() {
    ctx.font = '32px Courier New';
    ctx.fillStyle = '#edf6ff';
    ctx.fillText(score.computer, 20, canvas.height / 2 - 30);
    ctx.fillText(score.player, 20, canvas.height / 2 + 50);
  }

  function drawLine() {
    ctx.beginPath();
    ctx.setLineDash([7]);
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.strokeStyle = '#edf6ff';
    ctx.stroke();
  }

  function resetGame() {
    // Reset ball
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vx = 0;
    ball.vy = ballInitialVelocityY;
    // Reset paddles
    paddlePlayer.x = (canvas.width - paddleWidth) / 2;
    paddleComputer.x = (canvas.width - paddleWidth) / 2;
  }

  function gameOver() {
    window.cancelAnimationFrame(raf);
    canvas.classList.add('hidden');
    gameOverHeading.textContent = `${
      score.player === winScore ? 'Player ' : 'Computer '
    } Wins!`;
    gameOverEl.classList.remove('hidden');
  }

  function draw() {
    // Clear frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw ball
    ball.draw();
    // Draw paddles
    [paddlePlayer, paddleComputer].forEach((paddle) => paddle.draw());
    // Draw score
    drawScore();
    // Draw line
    drawLine();

    // Collision detection
    // Checking collision between ball and walls
    if (
      ball.x + ball.vx + ball.radius > canvas.width ||
      ball.x + ball.vx < ball.radius
    )
      ball.vx = -ball.vx;
    // Checking collision between ball and bottom / top
    if (
      ball.y + ball.vy + ball.radius > canvas.height ||
      ball.y + ball.vy < ball.radius
    ) {
      if (ball.y + ball.vy < ball.radius) score.player++;
      else score.computer++;

      if (score.player === winScore || score.computer === winScore) {
        gameOver();
      } else {
        resetGame();
        raf = window.requestAnimationFrame(draw);
      }
      return;
    }
    // Checking collision between ball and player paddle
    if (
      ball.x + ball.vx > paddlePlayer.x &&
      ball.x + ball.vx < paddlePlayer.x + paddlePlayer.width &&
      ball.y + ball.vy + ball.radius > paddlePlayer.y
    ) {
      ball.vx =
        ball.x > paddlePlayer.x + paddlePlayer.width / 2
          ? calculateVelocityX()
          : -calculateVelocityX();
      ball.vy = -Math.max(ball.vy, calculateVelocityY());
    }
    // Checking collision between ball and computer paddle
    if (
      ball.x + ball.vx > paddleComputer.x &&
      ball.x + ball.vx < paddleComputer.x + paddleComputer.width &&
      ball.y + ball.vy < paddleComputer.y + paddleComputer.height
    ) {
      ball.vx =
        ball.x > paddlePlayer.x + paddlePlayer.width / 2
          ? calculateVelocityX()
          : -calculateVelocityX();
      ball.vy = Math.max(-ball.vy, calculateVelocityY());
    }

    // Ball movement
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Computer paddle movement
    if (
      ball.x + ball.vx + ball.radius >
      paddleComputer.x + paddleComputer.width
    )
      paddleComputer.x += paddleComputer.vx;
    if (ball.x + ball.vx - ball.radius < paddleComputer.x)
      paddleComputer.x -= paddleComputer.vx;

    raf = window.requestAnimationFrame(draw);
  }

  function calculateVelocityX() {
    return Math.floor(Math.random() * 8) + 3;
  }

  function calculateVelocityY() {
    return Math.floor(Math.random() * 10) + 3;
  }

  function restartGame() {
    score.computer = 0;
    score.player = 0;
    resetGame();
    drawGame();
    gameOverEl.classList.add('hidden');
    canvas.classList.remove('hidden');

    raf = window.requestAnimationFrame(draw);
  }

  function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
      paddlePlayer.x = relativeX - paddlePlayer.width / 2;
    }
  }

  canvas.addEventListener(
    'mouseover',
    () => {
      raf = window.requestAnimationFrame(draw);
    },
    { once: true }
  );

  document.addEventListener('mousemove', mouseMoveHandler);
  btnRestart.addEventListener('click', restartGame);

  drawGame();
})();
