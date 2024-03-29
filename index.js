"use strict";
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
  const birdWidth = 60;
  const birdHeight = 60;
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
    //Pipe Gap
    return Math.round(Math.random() * 3) * 10 + 150;
  }
  let gap = getRandomGap();

  // Define the clouds and their properties
  const clouds = new Image();
  clouds.src = "sprite/clouds.png";
  let cloudsArr = [];
  let cloudX = Math.random() * canvasWidth;
  let cloudY = Math.random() * 50;
  let cloudVelX = -0.5;
  const cloudWidths = [150, 200, 250]; // array of different widths for each cloud
  let cloud = {
    x: cloudX,
    y: cloudY,
    velX: cloudVelX,
    width: cloudWidths[Math.floor(Math.random() * cloudWidths.length)],
  };
  cloudsArr.push(cloud);

  // Define game variables and functions
  const gravity = 0.4;
  const acceleration = 0.1;
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
      pipeX -= speed + score * acceleration;
      // Check if a pipe has moved off the screen and reset it with a new gap and score
      if (pipeX + pipeWidth < 0) {
        pipeX = canvasWidth;
        pipeY = Math.random() * 200 + 100;
        gap = getRandomGap(); // Set a new gap value
        score++;
      }

      // Check for collisions
      if (
        birdX + birdWidth - 5 > pipeX && // Bird hits right side of pipe
        birdX < pipeX + pipeWidth && // Bird hits left side of pipe
        (birdY + 10 < pipeY || birdY + birdHeight - 10 > pipeY + gap) // Bird hits top or bottom of pipe
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
        isGameStarted = false;

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
    // Update bird position
    ctx.save();
    ctx.translate(birdX + birdWidth / 2, birdY + birdHeight / 2);
    ctx.rotate(birdAngle);
    ctx.fillStyle = "yellow";
    ctx.drawImage(bird, -birdWidth / 2, -birdHeight / 2, birdWidth, birdHeight);
    ctx.restore();

    birdVelocity += gravity;
    birdY += birdVelocity;

    // Rotate bird based on velocity
    if (birdVelocity > 0) {
      bird.src = "sprite/bird.png";
      birdAngle = Math.min(Math.PI / 4, birdVelocity * 0.06); // Going Down
    } else if (birdVelocity < 0) {
      bird.src = birdfly.src;
      birdAngle = Math.max(-Math.PI, birdVelocity * 0.06); // Going Up
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
      // if first two pipes
      pipeGradient.addColorStop(0, "#009c00"); // dark green
      pipeGradient.addColorStop(0.4, "#00bf00"); // medium green
      pipeGradient.addColorStop(0.6, "#00e600"); // light green
      pipeGradient.addColorStop(1, "#00bf00"); // medium green
    } else {
      // if other pipes
      pipeGradient.addColorStop(0, "#005c00"); // dark green
      pipeGradient.addColorStop(0.4, "#007f00"); // medium green
      pipeGradient.addColorStop(0.6, "#00a600"); // light green
      pipeGradient.addColorStop(1, "#007f00"); // medium green
    }
    ctx.fillStyle = pipeGradient;

    // draw top pipe
    ctx.fillRect(pipeX - 5, pipeY - 30, pipeWidth + 10, 30);
    ctx.fillRect(pipeX, 0, pipeWidth, pipeY - 29.9);

    // draw bottom pipe
    const bottomPipeHeight = canvasHeight - pipeY - gap; // calculate the height of the bottom pipe based on canvas height, pipe y, and gap
    ctx.fillRect(pipeX - 5, pipeY + gap, pipeWidth + 10, 30);
    ctx.fillRect(pipeX, pipeY + gap + 30, pipeWidth, bottomPipeHeight); // subtract 30 from bottomPipeHeight to account for the bottom pipe cap
  }

  function drawBackground() {
    // Define the gradient sky colors
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    skyGradient.addColorStop(0, "#005588"); // Dark blue
    skyGradient.addColorStop(0.5, "#66ccff"); // Light blue
    skyGradient.addColorStop(1, "#ffffff"); // White

    // Draw the sky gradient background
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // calculate cloud speed
    let cloudSpeed = speed + score * acceleration;

    // draw clouds
    for (let i = 0; i < cloudsArr.length; i++) {
      let cloud = cloudsArr[i];
      ctx.drawImage(clouds, cloud.x, cloud.y, cloud.width, 80); // use the width property of the cloud

      // calculate cloud velocity based on pipe speed
      const cloudVelX = -(cloudSpeed / 2);
      cloud.x += cloudVelX;

      if (cloud.x + cloud.width < 0) {
        // check if the cloud is outside the canvas
        cloudsArr.splice(i, 1); // remove the cloud from the array
        i--; // decrement the loop variable to compensate for the removed element
        continue; // skip the rest of the loop iteration
      }
    }

    // add a new cloud
    if (Math.random() < 0.007 && cloudsArr.length <= 4) {
      let cloudX = canvasWidth + (Math.random() * canvasWidth) / 2;
      let cloudY = (Math.random() * canvasHeight) / 2.5;
      let width = cloudWidths[Math.floor(Math.random() * cloudWidths.length)];
      let cloud = { x: cloudX, y: cloudY, width: width };
      cloudsArr.push(cloud);
    }
  }

  // Draw score
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

    // Define the gradient sky colors
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    skyGradient.addColorStop(0, "#005588"); // Dark blue
    skyGradient.addColorStop(0.5, "#66ccff"); // Light blue
    skyGradient.addColorStop(1, "#ffffff"); // White

    // Draw the sky gradient background
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // GAME TITLE TEXT
    const titleGradient = ctx.createLinearGradient(0, 0, canvasWidth, 0);
    titleGradient.addColorStop(0, "#009c00");
    titleGradient.addColorStop(0.4, "#00bf00");
    titleGradient.addColorStop(0.6, "#00e600");
    titleGradient.addColorStop(1, "#00bf00");

    ctx.fillStyle = titleGradient;
    ctx.textAlign = "center";
    ctx.font = " bold 50px Arial";

    ctx.fillText("Birdie Bounce", canvasWidth / 2, canvasHeight / 2 - 180);
    ctx.strokeStyle = "wheat";
    ctx.lineWidth = 3;
    ctx.strokeText("Birdie Bounce", canvasWidth / 2, canvasHeight / 2 - 180);

    // Created By Text
    ctx.font = "18px Arial";
    ctx.fillStyle = "#333";
    ctx.fillText(
      "Created by: Nepo Aquino",
      canvasWidth / 2,
      canvasHeight / 2 - 150
    );
  }
  // Game Preview
  drawIntroduction();

  // Start the game loop
  function startGame() {
    isGameStarted = true;
    startButton.remove();
    requestAnimationFrame(gameLoop);
  }

  // Add a start button click event listener
  startButton.addEventListener("click", startGame);

  restartButton.addEventListener("click", function () {
    // Reset game variables to initial values
    birdY = 200;
    birdVelocity = 0;
    score = 0;
    pipeX = canvasWidth + 200;
    pipeY = getRandomPipeY();
    gap = getRandomGap();
    gameOver = false;

    // Start the game again
    startGame();

    // Hide restart button again
    restartButton.style.display = "none";
  });

  // Check if user is on a mobile device
  const isMobileDevice =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  if (!isMobileDevice) {
    // disable keydown and keyup listeners for mobile devices
    // Add keydown event listener
    document.addEventListener("keydown", function (event) {
      if (event.key === " " && !controlling && isGameStarted === true) {
        playWingsFlap();
        controlling = true;
        birdVelocity = -8;
      }
    });

    // Add keyup event listener
    document.addEventListener("keyup", function (event) {
      if (event.key === " ") {
        controlling = false;
      }
    });
  }

  // Add touchstart event listener to start the game and jump the bird
  document.addEventListener("touchstart", function (event) {
    if (isGameStarted === true) {
      playWingsFlap();
      controlling = true;
      birdVelocity = -8;
    }
  });

  // Function to make the bird flap
  function flapBird() {
    if (isGameStarted === true && !controlling) {
      playWingsFlap();
      controlling = true;
      birdVelocity = -8;
    }
  }

  // Add a mousedown event listener to the canvas for mouse click
  canvas.addEventListener("mousedown", flapBird);

  // Add a mouseup event listener to simulate keyup behavior
  canvas.addEventListener("mouseup", function () {
    controlling = false;
  });
};
