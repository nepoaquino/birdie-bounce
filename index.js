window.onload = function () {
  // Define the canvas and its context
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  // Cache canvas dimensions
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  // Game Buttons
  const startButton = document.getElementById("startButton");
  const restartButton = document.getElementById("restartButton");

  // Define the bird and its properties
  const bird = new Image();
  bird.src = "sprite/bird.png";
  const birdfly = new Image();
  birdfly.src = "sprite/birdfly.png";

  let birdX = 50;
  let birdY = 200;
  const birdWidth = 50;
  const birdHeight = 50;
  let birdVelocity = 0;
  let birdAngle = 0;

  // Define the pipes and their properties
  let pipeX = canvasWidth + 200;

  function getRandomPipeY() {
    return Math.round(Math.random() * 200 + 100);
  }

  let pipeY = getRandomPipeY();
  let pipeWidth = 50;
  let pipeHeight = 600;

  function getRandomGap() {
    return Math.round(Math.random() * 3) * 10 + 150;
  }

  let gap = getRandomGap();

  // Define the clouds and their properties
  const clouds = new Image();
  clouds.src = "sprite/clouds.png";
  let cloudsArr = [];

  function createCloud() {
    const cloudX = canvasWidth + Math.random() * canvasWidth;
    const cloudY = Math.random() * 50;
    const cloudVelX = -0.5;
    const cloudWidths = [150, 200, 250];
    const width = cloudWidths[Math.floor(Math.random() * cloudWidths.length)];
    const cloud = { x: cloudX, y: cloudY, velX: cloudVelX, width: width };
    cloudsArr.push(cloud);
  }

  createCloud();

  // Define game variables and functions
  const gravity = 0.4;
  const accelaration = 0.04;
  const speed = 3.5;
  let score = 0;
  let gameOver = false;
  let isGameStarted = false;
  let controlling = false;

  const wingsFlap = new Audio("soundeffects/wingsFlap.wav");
  wingsFlap.volume = 0.7;
  const bump = new Audio("soundeffects/bump.wav");
  bump.volume = 1;
  const fall = new Audio("soundeffects/fall.wav");
  fall.volume = 0.4;

  // Play wings flap sound effect only if the game is ongoing
  function playWingsFlap() {
    if (!gameOver) {
      wingsFlap.play();
      wingsFlap.currentTime = 0;
    }
  }

  // Play bump sound effect only if the game is ongoing
  function playBump() {
    if (!gameOver) {
      bump.play();
    }
  }

  // Play fall sound effect only if the game is ongoing
  function playFall() {
    if (!gameOver) {
      fall.play();
    }
  }

  // Define the desired frame rate (60 FPS)
  const targetFrameRate = 60;
  const frameDelay = 1000 / targetFrameRate;
  let lastFrameTime = 0;

  // Game loop function
  function gameLoop(timestamp) {
    // Calculate the time elapsed since the last frame
    const deltaTime = timestamp - lastFrameTime;

    // Only update and render the game if enough time has passed
    if (deltaTime >= frameDelay) {
      // Clear the canvas
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      drawBackground();
      drawPipes(pipeX, pipeY, gap, pipeWidth, pipeHeight);
      drawBird();
      drawScore();

      // Update pipe position
      pipeX -= speed + score * accelaration;

      // Check if a pipe has moved off the screen and reset it with a new gap and score
      if (pipeX + pipeWidth < 0) {
        pipeX = canvasWidth;
        pipeY = Math.random() * 200 + 100;
        gap = getRandomGap();
        score++;
      }

      // Check for collisions
      if (
        birdX + birdWidth - 5 > pipeX && // Bird hits right side of pipe
        birdX < pipeX + pipeWidth && // Bird hits left side of pipe
        (birdY + 10 < pipeY || birdY + birdHeight - 10 > pipeY + gap)
      ) {
        bump.play();
        gameOver = true;
      }

      // Check if bird has hit the bottom of the screen
      if (birdY - 500 > canvasHeight || birdY < -500) {
        fall.play();
        gameOver = true;
      }

      // Check for game over
      if (gameOver) {
        isGameStarted == false;

        ctx.textAlign = "center";
        ctx.fillStyle = "red";
        ctx.font = "bold 50px Arial";
        ctx.fillText("Game Over", canvasWidth / 2, canvasHeight / 2 - 100);

        // Display the restart button after 1 second
        setTimeout(function () {
          restartButton.style.display = "block";
        }, 1000);

        return;
      }

      // Update the last frame time
      lastFrameTime = timestamp - (deltaTime % frameDelay);
    }

    // Request the next animation frame
    requestAnimationFrame(gameLoop);
  }

  // Draw bird
  function drawBird() {
    ctx.save();
    ctx.translate(birdX + birdWidth / 2, birdY + birdHeight / 2);
    ctx.rotate(birdAngle);
    ctx.fillStyle = "yellow";
    ctx.drawImage(
      birdVelocity > 0 ? bird : birdfly,
      -birdWidth / 2,
      -birdHeight / 2,
      birdWidth,
      birdHeight
    );
    ctx.restore();

    birdVelocity += gravity;
    birdY += birdVelocity;

    if (birdVelocity > 0) {
      birdAngle = Math.min(Math.PI / 4, birdVelocity * 0.06);
    } else if (birdVelocity < 0) {
      birdAngle = Math.max(-Math.PI, birdVelocity * 0.06);
    }
  }

  // Draw Pipes
  function drawPipes(pipeX, pipeY, gap, pipeWidth, pipeHeight) {
    const pipeGradient = ctx.createLinearGradient(
      pipeX,
      0,
      pipeX + pipeWidth,
      0
    );

    if (pipeX + 80 <= pipeWidth * 2) {
      pipeGradient.addColorStop(0, "#009c00");
      pipeGradient.addColorStop(0.4, "#00bf00");
      pipeGradient.addColorStop(0.6, "#00e600");
      pipeGradient.addColorStop(1, "#00bf00");
    } else {
      pipeGradient.addColorStop(0, "#005c00");
      pipeGradient.addColorStop(0.4, "#007f00");
      pipeGradient.addColorStop(0.6, "#00a600");
      pipeGradient.addColorStop(1, "#007f00");
    }
    ctx.fillStyle = pipeGradient;

    ctx.fillRect(pipeX - 5, pipeY - 30, pipeWidth + 10, 30);
    ctx.fillRect(pipeX, 0, pipeWidth, pipeY - 29.9);

    const bottomPipeHeight = canvasHeight - pipeY - gap;
    ctx.fillRect(pipeX - 5, pipeY + gap, pipeWidth + 10, 30);
    ctx.fillRect(pipeX, pipeY + gap + 30, pipeWidth, bottomPipeHeight);
  }

  function drawBackground() {
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    skyGradient.addColorStop(0, "#005588");
    skyGradient.addColorStop(0.5, "#66ccff");
    skyGradient.addColorStop(1, "#ffffff");

    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    let cloudspeed = speed + score * accelaration;

    for (let i = 0; i < cloudsArr.length; i++) {
      let cloud = cloudsArr[i];
      ctx.drawImage(clouds, cloud.x, cloud.y, cloud.width, 80);

      const cloudVelX = -(cloudspeed / 2);
      cloud.x += cloudVelX;

      if (cloud.x + cloud.width < 0) {
        cloudsArr.splice(i, 1);
        i--;
        continue;
      }
    }

    if (Math.random() < 0.007 && cloudsArr.length <= 4) {
      createCloud();
    }
  }

  function drawScore() {
    const gradient = ctx.createLinearGradient(0, 0, canvasWidth, 0);
    gradient.addColorStop(0, "#ff5722");
    gradient.addColorStop(1, "#f44336");
    ctx.fillStyle = gradient;
    ctx.textAlign = "left";
    ctx.font = "bold 30px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.strokeText(`Score: ${score}`, 10, 30);
  }

  function drawIntroduction() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    skyGradient.addColorStop(0, "#005588");
    skyGradient.addColorStop(0.5, "#66ccff");
    skyGradient.addColorStop(1, "#ffffff");

    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = "green";
    ctx.textAlign = "center";
    ctx.font = " bold 50px Avenir";
    ctx.fillText("Birdie Bounce", canvasWidth / 2, canvasHeight / 2 - 180);
    ctx.font = "18px Avenir";
    ctx.fillStyle = "gray";
    ctx.fillText(
      "created by: Nepo Aquino",
      canvasWidth / 2,
      canvasHeight / 2 - 150
    );
  }

  drawIntroduction();

  function startGame() {
    isGameStarted = true;
    startButton.remove();
    requestAnimationFrame(gameLoop);
  }

  startButton.addEventListener("click", startGame);

  restartButton.addEventListener("click", function () {
    birdY = 200;
    birdVelocity = 0;
    score = 0;
    pipeX = canvasWidth + 200;
    pipeY = getRandomPipeY();
    gap = getRandomGap();
    gameOver = false;

    startGame();

    restartButton.style.display = "none";
  });

  const isMobileDevice =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  if (!isMobileDevice) {
    document.addEventListener("keydown", function (event) {
      if (event.key === " " && !controlling && isGameStarted === true) {
        playWingsFlap();
        controlling = true;
        birdVelocity = -8;
      }
    });

    document.addEventListener("keyup", function (event) {
      if (event.key === " ") {
        controlling = false;
      }
    });
  }

  document.addEventListener("touchstart", function (event) {
    if (isGameStarted === true) {
      playWingsFlap();
      controlling = true;
      birdVelocity = -8;
    }
  });

  function flapBird() {
    if (isGameStarted === true && !controlling) {
      playWingsFlap();
      controlling = true;
      birdVelocity = -8;
    }
  }

  canvas.addEventListener("mousedown", flapBird);

  canvas.addEventListener("mouseup", function () {
    controlling = false;
  });
};
