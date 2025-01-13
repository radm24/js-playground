"use strict";

(function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#606170";
  let raf;

  // Constants
  const brickRows = 3;
  const brickCols = 5;
  const brickWidth = 75;
  const brickHeight = 20;
  const brickPadding = 10;
  const brickOffsetTop = 30;
  const brickOffsetLeft = 30;

  // State
  let score = 0;
  let lives = 3;
  let rightPressed = false;
  let leftPressed = false;
  const bricks = [];

  const ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    vx: 2,
    vy: -2,
    radius: 10,
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fill();
    },
  };

  const paddle = {
    x: (canvas.width - 75) / 2,
    y: canvas.height - 10,
    vx: 7,
    width: 75,
    heigth: 10,
    draw() {
      ctx.beginPath();
      ctx.fillRect(this.x, this.y, this.width, this.heigth);
      ctx.closePath();
    },
  };

  function generateBricks() {
    for (let i = 0; i < brickRows; i++) {
      for (let j = 0; j < brickCols; j++) {
        bricks.push({
          x: brickOffsetLeft + j * (brickWidth + brickPadding),
          y: brickOffsetTop + i * (brickHeight + brickPadding),
        });
      }
    }
  }

  function drawGame() {
    // Draw bricks
    bricks.forEach(({ x, y }) => ctx.fillRect(x, y, brickWidth, brickHeight));
    // Draw ball
    ball.draw();
    // Draw paddle
    paddle.draw();
    // Draw score
    drawScore();
    // Draw user lives
    drawLives();
  }

  function draw() {
    // Save canvas state
    ctx.save();
    // Clear frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Restore canvas state
    ctx.restore();
    // Draw bricks
    bricks.forEach(({ x, y }) => ctx.fillRect(x, y, brickWidth, brickHeight));
    // Draw ball
    ball.draw();
    // Draw paddle
    paddle.draw();
    // Draw score
    drawScore();
    // Draw user lives
    drawLives();

    // Checking if paddle position should be changed
    if (leftPressed) paddle.x = Math.max(paddle.x - paddle.vx, 0);
    if (rightPressed)
      paddle.x = Math.min(paddle.x + paddle.vx, canvas.width - paddle.width);

    // Collision detection
    // Checking if ball hits the bottom
    if (ball.y + ball.vy + ball.radius > canvas.height) {
      if (lives === 1) {
        gameOver();
      }
      if (lives > 1) {
        lives--;
        resetGame();
      }
      return;
    }

    // Checking collision between ball and walls
    if (
      ball.x + ball.vx + ball.radius > canvas.width ||
      ball.x + ball.vx < ball.radius
    )
      ball.vx = -ball.vx;

    if (ball.y + ball.vy < ball.radius) ball.vy = -ball.vy;

    // Checking collision between ball and paddle
    if (
      ball.y + ball.vy + ball.radius > paddle.y &&
      ball.x + ball.vx > paddle.x &&
      ball.x + ball.vx < paddle.x + paddle.width
    ) {
      ball.vx =
        ball.x > paddle.x + paddle.width / 2
          ? Math.random() + 1
          : -(Math.random() + 1);
      ball.vy = -ball.vy;
    }

    // Checking collision between ball and bricks
    bricks.some((brick, idx) => {
      if (
        ball.y > brick.y &&
        ball.y < brick.y + brickHeight &&
        ball.x > brick.x &&
        ball.x < brick.x + brickWidth
      ) {
        ball.vy = -ball.vy;
        bricks.splice(idx, 1);
        score++;
        // Checking if an user won
        if (bricks.length === 0) userWon();
        return true;
      }
    });

    // Ball Movement
    ball.x += ball.vx;
    ball.y += ball.vy;

    raf = window.requestAnimationFrame(draw);
  }

  function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillText(`Score: ${score}`, 8, 20);
  }

  function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
  }

  function resetGame() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 30;
    ball.vx = 2;
    ball.vy = -2;
    paddle.x = (canvas.width - 75) / 2;
    drawGame();
    raf = window.requestAnimationFrame(draw);
  }

  function gameOver() {
    window.cancelAnimationFrame(raf);
    alert("GAME OVER");
    window.location.reload();
  }

  function userWon() {
    window.cancelAnimationFrame(raf);
    alert("YOU WON, CONGRATULATIONS!");
    document.location.reload();
  }

  function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
    if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
  }

  function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
    if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
  }

  function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width)
      paddle.x = relativeX - paddle.width / 2;
  }

  canvas.addEventListener(
    "mouseover",
    () => {
      raf = window.requestAnimationFrame(draw);
    },
    { once: true }
  );

  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);
  document.addEventListener("mousemove", mouseMoveHandler);

  generateBricks();
  drawGame();
})();
