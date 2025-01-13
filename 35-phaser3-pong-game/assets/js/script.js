'use strict';

// Game Assets from https://hektorprofe.itch.io/neon-pong

(async function () {
  // Loading Custom Fonts
  // https://www.fontspace.com/ozone-font-f2519
  const ozoneFont = new FontFace(
    'Ozone',
    `url(${location.href}/assets/fonts/Ozone-xRRO.ttf)`
  );
  // https://www.fontspace.com/sf-digital-readout-font-f6427
  const readoutFont = new FontFace(
    'Readout',
    `url(${location.href}/assets/fonts/SfDigitalReadoutHeavy-AwVg.ttf)`
  );
  document.fonts.add(ozoneFont);
  document.fonts.add(readoutFont);

  ozoneFont.load();
  readoutFont.load();
  await document.fonts.ready;

  // Phaser Configuration
  const config = {
    type: Phaser.CANVAS,
    width: 1280,
    height: 720,
    physics: {
      default: 'arcade',
    },
    scale: {
      mode: Phaser.Scale.NONE,
      autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    },
    scene: {
      preload: preload,
      create: create,
      update: update,
    },
  };

  const game = new Phaser.Game(config);

  // Game Objects
  let gamefield;
  let ball;
  let paddlePlayer;
  let paddleComputer;

  // Constants and props
  const ballInitialVelocityX = 800;
  const paddleComputerSpeed = 8;
  const amplifierCoeff = 15;
  const gamefieldProps = {
    x: 95,
    y: 89,
    width: 1090,
    height: 540,
    scoreOffsetX: 40,
    scoreOffsetY: 30,
  };
  const paddleProps = {
    offsetX: 40,
    height: 110,
  };

  // State
  let isPlaying = false;
  const score = {
    player: 0,
    computer: 0,
  };
  const winScore = 7;
  let scorePlayerText;
  let scoreComputerText;
  let startGameText;
  let winnerText;

  function preload() {
    this.load.image('gamefield', './assets/img/gamefield.png');
    this.load.image('ball', './assets/img/ball.png');
    this.load.image('paddlePlayer', './assets/img/paddle_2.png');
    this.load.image('paddleComputer', './assets/img/paddle_1.png');
  }

  function create() {
    // Setting world boundaries
    this.physics.world.setBounds(
      gamefieldProps.x,
      gamefieldProps.y,
      gamefieldProps.width,
      gamefieldProps.height
    );

    // Game field
    gamefield = this.add.sprite(0, 0, 'gamefield');
    gamefield.setOrigin(0, 0);
    this.physics.world.enable(gamefield);

    // Score
    const fontStyle = { font: '64px Ozone' };
    scoreComputerText = this.add.text(
      gamefieldProps.x + gamefieldProps.width / 2 - gamefieldProps.scoreOffsetX,
      gamefieldProps.y + gamefieldProps.scoreOffsetY,
      score.computer,
      fontStyle
    );
    scoreComputerText.setStroke('#3a43a5', 6);
    scoreComputerText.setOrigin(1, 0);

    scorePlayerText = this.add.text(
      gamefieldProps.x + gamefieldProps.width / 2 + gamefieldProps.scoreOffsetX,
      gamefieldProps.y + gamefieldProps.scoreOffsetY,
      score.player,
      fontStyle
    );
    scorePlayerText.setStroke('#601c8b', 6);

    // Start Game Text
    startGameText = this.add.text(
      game.canvas.width / 2,
      game.canvas.height / 2 - 100,
      'Press LMB to Start',
      { font: '72px Readout' }
    );
    startGameText.setOrigin(0.5, 0.5);

    // Winner Text
    winnerText = this.add.text(
      game.canvas.width / 2,
      game.canvas.height / 2 - 50,
      '',
      { font: '96px Readout' }
    );
    winnerText.setOrigin(0.5, 0.5);
    winnerText.visible = false;

    // Ball
    ball = this.add.sprite(
      game.canvas.width / 2,
      game.canvas.height / 2,
      'ball'
    );
    this.physics.world.enable(ball);
    ball.body.setCollideWorldBounds();
    ball.body.onWorldBounds = true;
    ball.body.setBounce(1, 1);

    // Computer paddle
    paddleComputer = this.add.sprite(
      gamefieldProps.x + paddleProps.offsetX,
      (game.canvas.height - paddleProps.height) / 2,
      'paddleComputer'
    );
    paddleComputer.setOrigin(0.5, 0);
    this.physics.world.enable(paddleComputer);
    paddleComputer.body.setImmovable();
    paddleComputer.body.setCollideWorldBounds();
    this.physics.add.collider(ball, paddleComputer, ballHitPaddle);

    // Player paddle
    paddlePlayer = this.add.sprite(
      gamefieldProps.x + gamefieldProps.width - paddleProps.offsetX,
      (game.canvas.height - paddleProps.height) / 2,
      'paddlePlayer'
    );
    paddlePlayer.setOrigin(0.5, 0);
    this.physics.world.enable(paddlePlayer);
    paddlePlayer.body.setImmovable();
    paddleComputer.body.setCollideWorldBounds();
    this.physics.add.collider(ball, paddlePlayer, ballHitPaddle);

    // Checking collision of the ball with the world's left and right bounds
    this.physics.world.on(
      'worldbounds',
      (body, blockedUp, blockedDown, blockedLeft, blockedRight) => {
        if (body === ball.body && (blockedLeft || blockedRight)) {
          if (blockedLeft) {
            score.player++;
            scorePlayerText.setText(score.player);
          }
          if (blockedRight) {
            score.computer++;
            scoreComputerText.setText(score.computer);
          }
          if (score.player === winScore || score.computer === winScore)
            gameOver.call(this, blockedLeft ? 'Player' : 'Computer');
          else scored.call(this);
        }
      }
    );

    listenGameStart.call(this);
  }

  function update() {
    if (!isPlaying) return;
    calculatePaddlePlayerPos.call(this, paddlePlayer);
    calculatePaddleComputerPos.call(this, paddleComputer);
  }

  function ballHitPaddle(ball, paddle) {
    ball.body.setVelocityY(
      -amplifierCoeff * (paddle.y + paddle.height / 2 - ball.y)
    );
  }

  function calculatePaddlePlayerPos(paddle) {
    paddle.y =
      this.input.y - paddle.height / 2 < this.physics.world.bounds.top
        ? this.physics.world.bounds.top
        : this.input.y > this.physics.world.bounds.bottom
        ? this.physics.world.bounds.bottom - paddle.height
        : Math.min(
            this.input.y - paddle.height / 2,
            this.physics.world.bounds.bottom - paddle.height
          );
  }

  function calculatePaddleComputerPos(paddle) {
    if (ball.y < paddle.y + paddle.height / 2) {
      paddle.y -= Math.min(
        paddleComputerSpeed,
        paddle.y - this.physics.world.bounds.top
      );
    }
    if (ball.y > paddle.y + paddle.height / 2) {
      paddle.y += Math.min(
        paddleComputerSpeed,
        this.physics.world.bounds.bottom - (paddle.y + paddle.height)
      );
    }
  }

  function listenGameStart(toReset = false) {
    // Change start text after first score
    if (score.player + score.computer === 1)
      startGameText.setText('Press LMB to Go On');

    startGameText.visible = true;
    this.input.on('pointerdown', () => {
      if (toReset) resetGameAfterGameOver();

      startGameText.visible = false;
      startGame();
      this.input.off('pointerdown');
    });
  }

  function startGame() {
    isPlaying = true;
    ball.body.setVelocityX(ballInitialVelocityX);
  }

  function scored() {
    isPlaying = false;
    resetGame();
    listenGameStart.call(this);
  }

  function resetGame() {
    ball.body.reset(game.canvas.width / 2, game.canvas.height / 2);
    paddleComputer.body.reset(
      gamefieldProps.x + paddleProps.offsetX,
      (game.canvas.height - paddleProps.height) / 2
    );
    paddlePlayer.body.reset(
      gamefieldProps.x + gamefieldProps.width - paddleProps.offsetX,
      (game.canvas.height - paddleProps.height) / 2
    );
  }

  function gameOver(winner) {
    isPlaying = false;
    ball.body.setVelocity(0, 0);

    winnerText.setText(`${winner} Wins!`);
    winnerText.visible = true;
    startGameText.setText('Press LMB to Play Again');
    startGameText.y = winnerText.y + 120;
    startGameText.visible = true;

    listenGameStart.call(this, true);
  }

  function resetGameAfterGameOver() {
    score.player = 0;
    score.computer = 0;
    scorePlayerText.setText(score.player);
    scoreComputerText.setText(score.computer);

    winnerText.visible = false;
    startGameText.y = game.canvas.height / 2 - 100;

    resetGame();
  }
})();
