
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let birdX = 50;
let birdY = 200;
let birdVelocity = 0;
let gravity = 0.45;
let gap = Math.floor(Math.random() * 3) * 20 + 130;
let pipeX = 400;
let pipeY = Math.random() * 200 + 100;
let pipeWidth = 50;
let pipeHeight = 600;
let score = 0;
let gameOver = false;
let isGameStarted = false;


function drawPreview() {
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw bird
  ctx.fillStyle = "yellow";
  ctx.fillRect(birdX, birdY, 30, 30);

  // draw pipes
  ctx.fillStyle = "green";
  ctx.fillRect(pipeX, 0, pipeWidth, pipeY);
  ctx.fillRect(pipeX, pipeY + gap, pipeWidth, pipeHeight - pipeY - gap);

  // draw introduction text
  ctx.textAlign ="center";
  ctx.font = " bold 50px Avenir";
  ctx.fillText("Birdie Bounce", canvas.width / 2, canvas.height / 2 - 180);
  ctx.font = "18px Avenir";
  ctx.fillStyle = "gray";
  ctx.fillText("created by: Nepo Aquino", canvas.width / 2, canvas.height / 2 - 150);
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText("Press Spacebar or", canvas.width / 2, canvas.height / 2 + 50);
  ctx.fillText("Touch the screen to start", canvas.width / 2, canvas.height / 2 + 80);
}
// draw initial preview
drawPreview();

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
  ctx.textAlign = "left";
  ctx.font = "25px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30); 

  // update bird position
  birdVelocity += gravity; 
  birdY += birdVelocity;

  // update pipe position
   pipeX -= 3.5 + score * 0.02;
  if (pipeX + pipeWidth < 0) {
    pipeX = canvas.width;
    pipeY = Math.random() * 200 + 100;
    gap = Math.floor(Math.random() * 3) * 20 + 130; // set a new gap value
    score++;
  }

  // check for collisions
  if (
    birdX < pipeX + pipeWidth &&
    birdX + 30 > pipeX &&
    (birdY < pipeY || birdY + 30 > pipeY + gap) ||
    birdY + 30 > canvas.height
  ) {
    gameOver = true;
   }

  // check for game over
  if (birdY + 30 > canvas.height || gameOver) {
    ctx.textAlign = "center";
    ctx.fillStyle = "red";
    ctx.font = "bold 50px Arial";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 100);
    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.fillText(`Your Score: ${score}`, canvas.width / 2, canvas.height / 2);
    ctx.fillText("Press Spacebar or", canvas.width / 2, canvas.height / 2 + 50);
  ctx.fillText("Touch the screen to restart", canvas.width / 2, canvas.height / 2 + 80);
    return;
}
  // request next frame
  requestAnimationFrame(draw);
}



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
    pipeY = Math.random() * 200 +100 ;
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
    pipeY = Math.random() * 200 + 100;
    draw();
  }
});


