"use strict";

(function () {
  const config = {
    type: Phaser.CANVAS,
    width: 480,
    height: 320,
    backgroundColor: "#eee",
    physics: {
      default: "arcade",
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: {
      preload: preload,
      create: create,
      update: update,
    },
  };

  const game = new Phaser.Game(config);

  let ball;
  let paddle;
  let bricks;
  let newBrick;
  let brickProps;

  let score = 0;
  let scoreText;
  let lives = 3;
  let livesText;
  let lifeLostText;

  let isPlaying = false;
  let startButton;

  function preload() {
    this.load.image("ball", "img/ball.png");
    this.load.image("paddle", "img/paddle.png");
    this.load.image("brick", "img/brick.png");
    this.load.spritesheet("wobble", "img/wobble.png", {
      frameWidth: 14,
      frameHeight: 14,
    });
    this.load.spritesheet("button", "img/button.png", {
      frameWidth: 120,
      frameHeight: 40,
    });
  }

  function create() {
    // Start button
    startButton = this.add
      .sprite(game.canvas.width / 2, game.canvas.height / 2, "button")
      .setFrame(0)
      .setInteractive();
    startButton.on("pointerover", () => startButton.setFrame(1));
    startButton.on("pointerout", () => startButton.setFrame(0));
    startButton.on("pointerdown", startGame);

    const textStyle = { font: "18px Arial", fill: "606170" };
    // Score text
    scoreText = this.add.text(5, 5, "Score: 0", textStyle);

    // Lives text
    livesText = this.add.text(game.canvas.width - 5, 5, "Lives: 3", textStyle);
    livesText.setOrigin(1, 0);

    // Text on life losing
    lifeLostText = this.add.text(
      game.canvas.width / 2,
      game.canvas.height / 2,
      "Life lost, click to continue",
      textStyle
    );
    lifeLostText.setOrigin(0.5);
    lifeLostText.visible = false;

    // Ball
    ball = this.add.sprite(
      game.canvas.width / 2,
      game.canvas.height - 25,
      "ball"
    );

    this.physics.world.enable(ball);
    ball.body.setCollideWorldBounds();
    ball.body.onWorldBounds = true;
    ball.body.setBounce(1, 1);

    this.anims.create({
      key: "wobble",
      frames: this.anims.generateFrameNumbers("wobble", {
        prefix: "",
        suffix: "",
        zeroPad: 0,
        frames: [0, 1, 0, 2, 0, 1, 0, 2, 0],
      }),
    });

    // Paddle
    paddle = this.add.sprite(
      game.canvas.width / 2,
      game.canvas.height - 5,
      "paddle"
    );
    paddle.setOrigin(0.5, 1);
    this.physics.world.enable(paddle);
    paddle.body.setImmovable();
    this.physics.add.collider(ball, paddle, ballHitPaddle);

    // Checking collision of the ball with the world's bottom bound
    this.physics.world.on("worldbounds", (body, blockedUp, blockedDown) => {
      if (body === ball.body && blockedDown) ballHitBottom.call(this);
    });

    generateBricks.call(this);
  }

  function update() {
    if (isPlaying) paddle.x = this.input.x || game.canvas.width / 2;
  }

  function generateBricks() {
    brickProps = {
      width: 40,
      height: 20,
      count: {
        row: 3,
        col: 7,
      },
      offset: {
        top: 50,
        left: 60,
      },
      paddingX: 20,
      paddingY: 10,
    };

    bricks = this.add.group();
    for (let i = 0; i < brickProps.count.row; i++) {
      for (let j = 0; j < brickProps.count.col; j++) {
        newBrick = this.add.sprite(
          brickProps.offset.left + j * (brickProps.width + brickProps.paddingX),
          brickProps.offset.top + i * (brickProps.height + brickProps.paddingY),
          "brick"
        );
        this.physics.world.enable(newBrick);
        newBrick.body.setImmovable();
        bricks.add(newBrick);
      }
    }
    this.physics.add.collider(ball, bricks, ballHitBrick.bind(this));
  }

  function startGame() {
    startButton.destroy();
    ball.body.setVelocity(150, -250);
    isPlaying = true;
  }

  function ballHitPaddle(ball, paddle) {
    ball.anims.play("wobble", true);
    ball.body.setVelocityX(-5 * (paddle.x - ball.x));
  }

  function ballHitBrick(ball, brick) {
    ball.anims.play("wobble", true);
    const killTween = this.tweens.add({
      targets: brick,
      scale: 0,
      duration: 200,
      ease: "Linear",
      onComplete() {
        bricks.killAndHide(brick);
        bricks.remove(brick);
      },
    });
    killTween.play();

    score += 10;
    scoreText.setText(`Score: ${score}`);

    // Checking if the ball hitted the last brick
    if (bricks.getLength() === 1) {
      game.pause();
      alert("You won the game, congratulations!");
      location.reload();
    }
  }

  function ballHitBottom() {
    game.pause();
    lives--;
    if (lives) {
      livesText.setText(`Lives: ${lives}`);
      lifeLostText.visible = true;
      ball.body.reset(game.canvas.width / 2, game.canvas.height - 25);
      this.input.activePointer.x = game.canvas.width / 2;
      this.input.on("pointerdown", () => {
        lifeLostText.visible = false;
        ball.body.setVelocity(150, -250);
        this.input.off("pointerdown");
        game.resume();
      });
    } else {
      alert("You lost, game over!");
      location.reload();
    }
  }
})();
