// Define the canvas and its context
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Cache canvas dimensions
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Define the bird and its properties
const bird = new Image();

bird.src = "bird.png";
let birdX = 50;
let birdY = 200;
const birdWidth = 50;
const birdHeight = 50;
let birdVelocity = 0;
let birdAngle = 0;

// Define the pipes and their properties
let pipeX = canvasWidth;
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
clouds.src = "clouds.png";
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
let score = 0;
let gameOver = false;
let isGameStarted = false;

function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  // Set image smoothing properties
  ctx.imageSmoothingEnabled = true; // enable image smoothing
  ctx.imageSmoothingQuality = "high"; // set image smoothing quality to high
  drawBackground();
  drawPipes(pipeX, pipeY, gap, pipeWidth, pipeHeight);
  drawBird();
  drawScore();

  // Update pipe position
  pipeX -= 3.5 + score * 0.05;
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
    (birdY + 10 < pipeY || birdY + birdHeight > pipeY + gap) // Bird hits top or bottom of pipe
  ) {
    gameOver = true;
  }

  // Check if bird has hit the bottom of the screen
  if (birdY - 800 > canvasHeight || birdY < -800) {
    gameOver = true;
  }

  // Check for game over
  if (gameOver) {
    ctx.textAlign = "center";
    ctx.fillStyle = "red";
    ctx.font = "bold 50px Arial";
    ctx.fillText("Game Over", canvasWidth / 2, canvasHeight / 2 - 100);
    ctx.fillStyle = "black";
    ctx.font = "24px Verdana, sans-serif";
    ctx.fillText(`Your Score: ${score}`, canvasWidth / 2, canvasHeight / 2);
    ctx.fillText("Press Spacebar or", canvasWidth / 2, canvasHeight / 2 + 50);
    ctx.fillText(
      "Touch the screen to restart",
      canvasWidth / 2,
      canvasHeight / 2 + 80
    );
    return;
  }

  // Request the next animation frame
  requestAnimationFrame(draw);
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
    bird.src = "bird.png";
    birdAngle = Math.min(Math.PI / 4, birdVelocity * 0.06); // Going Down
  } else if (birdVelocity < 0) {
    bird.src = "birdfly.png";
    birdAngle = Math.max(-Math.PI, birdVelocity * 0.06); // Going Up
  }
}

function drawPipes(pipeX, pipeY, gap, pipeWidth, pipeHeight) {
  const pipeGradient = ctx.createLinearGradient(pipeX, 0, pipeX + pipeWidth, 0);

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
  let cloudspeed = 3.5 + score * 0.05;

  // draw clouds
  for (let i = 0; i < cloudsArr.length; i++) {
    let cloud = cloudsArr[i];
    ctx.drawImage(clouds, cloud.x, cloud.y, cloud.width, 80); // use the width property of the cloud

    // calculate cloud velocity based on pipe speed
    const cloudVelX = -(cloudspeed / 2);
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
  skyGradient.addColorStop(0.5, "#66ccff"); // Light blue
  skyGradient.addColorStop(1, "#ffffff"); // White

  // Draw the sky gradient background
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // draw introduction text
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
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText("Press Spacebar or", canvasWidth / 2, canvasHeight / 2 + 50);
  ctx.fillText(
    "Touch the screen to start",
    canvasWidth / 2,
    canvasHeight / 2 + 80
  );
}
// Game Preview
drawIntroduction();

// GAME CONTROLS
document.addEventListener("keydown", function (event) {
  if (event.key === " " && !isGameStarted) {
    isGameStarted = true;
    
    draw();
  } else if (event.key === " " && gameOver) {
    isGameStarted = true;
    gameOver = false;
    score = 0;
    birdY = 200;
    birdVelocity = 0;
    pipeX = 400;
    pipeY = getRandomPipeY();
    draw();
  } else if (event.key === " ") {
    birdVelocity = -8;
  }
});

// add touch event listeners to start the game and jump the bird
document.addEventListener("touchstart", function (event) {
  if (!isGameStarted) {
    isGameStarted = true;
    draw();
  } else if (!gameOver) {
    birdVelocity = -8;
  }
});

// add touch event listener to reset the game
document.addEventListener("touchend", function (event) {
  if (gameOver) {
    isGameStarted = true;
    gameOver = false;
    score = 0;
    birdY = 200;
    birdVelocity = 0;
    pipeX = 400;
    pipeY = getRandomPipeY();
    draw();
  }
});
