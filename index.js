const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let birdX = 50;
let birdY = 200;
let birdVelocity = 0;
let gravity = 0.5;
let gap = 150;
let pipeX = 400;
let pipeY = Math.random() * 200 + 100;
let pipeWidth = 50;
let pipeHeight = 400;
let score = 0;
let gameOver = false;

function draw() {
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw bird
  ctx.fillStyle = "yellow";
  ctx.fillRect(birdX, birdY, 30, 30);

  // draw pipes
  ctx.fillStyle = "green";
  ctx.fillRect(pipeX, 0, pipeWidth, pipeY);
  ctx.fillRect(pipeX, pipeY + gap, pipeWidth, pipeHeight - pipeY - gap);

  // draw score
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);

  // update bird position
  birdVelocity += gravity;
  birdY += birdVelocity;

  // update pipe position
  pipeX -= 5;
  if (pipeX + pipeWidth < 0) {
    pipeX = canvas.width;
    pipeY = Math.random() * 200 + 100;
    score++;
  }

  // check for collisions
  if (
    birdX < pipeX + pipeWidth &&
    birdX + 30 > pipeX &&
    (birdY < pipeY || birdY + 30 > pipeY + gap)
  ) {
    gameOver = true;
  }

  // check for game over
  if (birdY + 30 > canvas.height || gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "48px Arial";
    ctx.fillText("Game Over", 80, 300);
    return;
  }

  // request next frame
  requestAnimationFrame(draw);
}

// listen for keypress
document.addEventListener("keydown", function (event) {
  if (event.key === " ") {
    birdVelocity = -10;
  }
});

// start game
requestAnimationFrame(draw);
