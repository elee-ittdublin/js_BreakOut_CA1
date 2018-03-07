// Based on: Learn how to build 2D HTML5 Breakout game with pure JavaScript
// https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript
// https://github.com/end3r/Gamedev-Canvas-workshop

var canvas = document.getElementById("breakout");
var ctx = canvas.getContext("2d");

// Game constants
const height = canvas.height;
const width = canvas.width;
const startLives = 3;
const paddleBounceFactor = 0.3;

ctx.fillStyle = '#0095DD';
ctx.font = "16px Arial";

// key codes
const keyRight = 39; // right arrow
const keyLeft = 37;  // left arrow

// Ball
ballRadius = 10;
// Ball centre
var ballX = width/2;
var ballY = height/2;
// Amount (speed) to move ball x and y
var dx = 2;
var dy = 2;

// Paddle
const paddleHeight = height * 0.02;
const paddleWidth = width * 0.1;
var paddleX = (width-paddleWidth) / 2;

// From bottom edge
const paddleOffsetBottom = height * 0.1;
const paddleMove = 7;

var rightPressed = false;
var leftPressed = false;

// Game info
var score = 0;
var lives = startLives;

// Bricks
const brickRowCount = 5;     // number rows
const brickColumnCount = 3;  // number columns
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;     // space between bricks
const brickOffsetTop = 30;   // distance from top edge
const brickOffsetLeft = 30;  // distance from left edge

// Create an rrray of bricks
var bricks = [];
// column of bricks
for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    // rows in column
    for(r=0; r<brickRowCount; r++) {
        // Each brick object has (x,y) and status (1 = show, 0 = hide)
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Attach event listeners to the document
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

// Handle keydown event
function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}

// Handle keyup event
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

// Handle mouse movement
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

// Collision detection - bricks
function collisionDetectionBricks() {
    // compare ball (x,y) with every brick in the array
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(ballX > b.x && ballX < b.x+brickWidth && ballY > b.y && ballY < b.y+brickHeight) {
                    // if brick collision then reverse ball 
                    dy = -dy;
                    // switch off brick
                    b.status = 0;
                    // increment score
                    score++;
                    // check win condition (score == brick count)
                    if(score == brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// Draw ball at co-ordinates
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2);
    ctx.fill();
    ctx.closePath();
}

// Draw Paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fill();
    ctx.closePath();
}

// Draw bricks
function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                // calculate (x,y) for current brick
                var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
                // set (x,y) in brick object
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                // Draw the brick
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Show score
function drawScore() {
    ctx.fillText("Score: "+score, 8, 20);
}

// Show lives
function drawLives() {
    ctx.fillText("Lives: "+lives, width-65, 20);
}

function movePaddle() {
    if(rightPressed && paddleX < width-paddleWidth) {
        paddleX += paddleMove;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= paddleMove;
    }
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, width, height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetectionBricks();

    // Game Logic - handle ball movement
    if(ballX + dx > width-ballRadius || ballX + dx < ballRadius) {
        dx = -dx;
    }
    if(ballY + dy < ballRadius) {
        dy = -dy;
    }
    // Ball hits the paddle
    else if(ballY + dy > height-ballRadius) {
        if(ballX > paddleX && ballX < paddleX + paddleWidth) {
            
            dy = -dy; // reverse direction of ball
            
        }
        else {
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                ballX = width/2;
                ballY = height-30;
                dx = 3;
                dy = -3;
                paddleX = (width-paddleWidth)/2;
            }
        }
    }
    movePaddle();

    ballX += dx;
    ballY += dy;

    // speed the animation of the game according to the device speed
    // Better alternative to setInterval()
    // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();