const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let birdX = 50;
let birdY = 200;
let birdVelocity = 0;
const gravity = 0.45;
let gap = getRandomGap();
let pipeX = 400;
let pipeY = getRandomPipeY();
let pipeWidth = 50;
let pipeHeight = 600;
let score = 0;
let gameOver = false;
let isGameStarted = false;

const bird = new Image();
bird.src = "bird.png";

const clouds = new Image();
clouds.src = "clouds.png";

function getRandomGap() {
  return Math.floor(Math.random() * 3) * 20 + 130;
}

function getRandomPipeY() {
  return Math.round(Math.random() * 200 + 100);
}

let cloudsArr = [];
let isCloudPassedCanvas = false;

let cloudX = Math.random() * canvas.width;
let cloudY = Math.random() * 200;
let cloudVelX = -0.5;
let cloud = { x: cloudX, y: cloudY, velX: cloudVelX };
cloudsArr.push(cloud);

function drawBackground() {
  // draw background
  ctx.fillStyle = "#d4e8de";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // calculate pipe speed
  let pipeSpeed = 3.5 + score * 0.8;

  // draw clouds
  let isCloudPassedCanvasTemp = false; // temporary variable to keep track of cloud passing
  for (let i = 0; i < cloudsArr.length; i++) {
    let cloud = cloudsArr[i];
    ctx.drawImage(clouds, cloud.x, cloud.y, 150, 100);

    // calculate cloud velocity based on pipe speed
    let cloudVelX = -(pipeSpeed / 20);

    cloud.x += cloudVelX;

    if (cloud.x < -canvas.width) {
      cloud.x = canvas.width + (Math.random() * canvas.width) / 2;
      cloud.y = (Math.random() * canvas.height) / 2;
      isCloudPassedCanvasTemp = true; // cloud has passed the canvas
    }
  }

  if (isCloudPassedCanvasTemp) {
    // if at least one cloud passed the canvas
    isCloudPassedCanvas = true; // set the variable to true
  }

  if (isCloudPassedCanvas) {
    // if a cloud has passed the canvas
    for (let i = 0; i < cloudsArr.length; i++) {
      let cloud = cloudsArr[i];
      ctx.drawImage(clouds, cloud.x, cloud.y, 150, 100);
    }
  }

  // add new clouds
  if (cloudsArr.length < 5) {
    // add a new cloud if there are less than 5 clouds
    let cloudX = canvas.width + (Math.random() * canvas.width) / 2;
    let cloudY = (Math.random() * canvas.height) / 2;
    let cloud = { x: cloudX, y: cloudY };
    cloudsArr.push(cloud);
  }
}

function draw() {
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw background
  drawBackground();

  // draw bird
  ctx.fillStyle = "yellow";
  ctx.drawImage(bird, birdX, birdY, 30, 30);

  // draw pipes
  ctx.fillStyle = "green";
  ctx.fillRect(pipeX, 0, pipeWidth, pipeY);
  ctx.fillRect(pipeX, pipeY + gap, pipeWidth, pipeHeight - pipeY - gap);

  // draw score
  ctx.fillStyle = "black";
  ctx.textAlign = "left";
  ctx.font = "25px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);

  // update bird position
  birdVelocity += gravity;
  birdY += birdVelocity;

  // update pipe position
  pipeX -= 3.5 + score * 0.03;

  if (pipeX + pipeWidth < 0) {
    pipeX = canvas.width;
    pipeY = Math.random() * 200 + 100;
    gap = getRandomGap(); // set a new gap value
    score++;
  }

  //check for collisions
  if (
    birdX + 25 > pipeX && // Bird hits right side of pipe
    birdX < pipeX + pipeWidth && // Bird hits left side of pipe
    (birdY + 5 < pipeY || birdY + 25 > pipeY + gap) // Bird hits top or bottom of pipe
  ) {
    gameOver = true;
  }
  if (birdY + 25 > canvas.height) {
    // Bird hits bottom of screen
    gameOver = true;
  }

  // check for game over
  if (gameOver) {
    ctx.textAlign = "center";
    ctx.fillStyle = "red";
    ctx.font = "bold 50px Arial";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 100);
    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.fillText(`Your Score: ${score}`, canvas.width / 2, canvas.height / 2);
    ctx.fillText("Press Spacebar or", canvas.width / 2, canvas.height / 2 + 50);
    ctx.fillText(
      "Touch the screen to restart",
      canvas.width / 2,
      canvas.height / 2 + 80
    );
    return;
  }
  // request next frame
  requestAnimationFrame(draw);
}

function drawPreview() {
  // draw background
  ctx.fillStyle = "#d4e8de";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // draw introduction text
  ctx.fillStyle = "green";
  ctx.textAlign = "center";
  ctx.font = " bold 50px Avenir";
  ctx.fillText("Birdie Bounce", canvas.width / 2, canvas.height / 2 - 180);
  ctx.font = "18px Avenir";
  ctx.fillStyle = "gray";
  ctx.fillText(
    "created by: Nepo Aquino",
    canvas.width / 2,
    canvas.height / 2 - 150
  );
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText("Press Spacebar or", canvas.width / 2, canvas.height / 2 + 50);
  ctx.fillText(
    "Touch the screen to start",
    canvas.width / 2,
    canvas.height / 2 + 80
  );
}
// draw initial preview
drawPreview();

// listen for keypress
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
