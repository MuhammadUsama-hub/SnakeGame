//initializing canvas
var canvas = document.getElementById("gameCanvas");
//from canvas now geting rendering context object to create drawing on canvas  as 2d rendering
var context = canvas.getContext("2d");
//canvas Setting
var height = 500;
var width = 500;
canvas.height = height;
canvas.width = width;
//grid setting
var rows = 25;
var cols = 25;
var boxSize = width / cols;
var food;
// food sound 
var foodSound = new Audio('../views/food.mp3');
// Define the direction
var direction = { x: 0, y: 0 };
// Snake position
var snake = [{ x: 10, y: 10 }];
// scores 3points on each eat
var score = 0;
// Function to draw the grid
function drawGrid() {
    context.strokeStyle = "#baf462";
    // Draw vertical lines
    for (var i = 0; i <= cols; i++) {
        var x = i * boxSize;
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
    }
    // draw horizontal lines
    for (var i = 0; i <= rows; i++) {
        var y = i * boxSize;
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
    }
    drawFood(food);
    drawSnake();
}
// on start food location creation
function getRandomPosition() {
    var x = Math.floor(Math.random() * cols);
    var y = Math.floor(Math.random() * rows);
    return { x: x, y: y };
}
// draw food on grid
function drawFood(position) {
    context.fillStyle = "red";
    context.fillRect(position.x * boxSize, position.y * boxSize, boxSize, boxSize);
}
food = getRandomPosition();
// on start snake creation
function drawSnake() {
    context.fillStyle = 'black';
    snake.forEach(function (segment) {
        context.fillRect(segment.x * boxSize, segment.y * boxSize, boxSize, boxSize);
    });
}
function checkSelfCollision(head) {
    // Check if the head position matches any segment of the body
    for (var i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}
// Function to update the snake's position
function updateSnake() {
    var scorebox = document.getElementById('scores');
    var head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    //checking boundaries collision
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
        console.log("Game Over-boundary collide");
        // Optionally, you can stop the game loop or reset the game here.
        snake = [getRandomPosition()];
        direction = { x: 0, y: 0 };
        food = getRandomPosition();
        scorebox.innerText = 'Game Over! ';
        setTimeout(function () {
            document.getElementById('scores').innerText = 'Press Arrow Key To Start.';
        }, 500);
        score = 0;
        return drawGrid();
    }
    // Check self-collision
    if (checkSelfCollision(head)) {
        console.log("Game Over-SelfColllide");
        snake = [getRandomPosition()];
        direction = { x: 0, y: 0 };
        food = getRandomPosition();
        scorebox.innerText = 'Game Over! ';
        setTimeout(function () {
            document.getElementById('scores').innerText = 'Press Arrow Key To Start.';
        }, 500);
        score = 0;
        return drawGrid();
    }
    // Add new head to the snake
    snake.unshift(head);
    // Remove the last part of the snake
    snake.pop();
    // food eaten 
    if (head.x === food.x && head.y === food.y) {
        foodSound.play();
        snake.unshift(food);
        food = getRandomPosition();
        score += 3;
        scorebox.innerHTML = 'Score : ' + score.toString();
        drawFood(food);
    }
}
// Function to run the game loop
function gameLoop() {
    // Update snake position
    updateSnake();
    // Clear the canvas
    context.clearRect(0, 0, width, height);
    // Redraw the grid and the food
    drawGrid();
    // Draw the snake
    drawSnake();
    // Repeat the game loop
    setTimeout(gameLoop, 100);
}
// Event listener for arrow keys
document.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'ArrowUp':
            direction = { x: 0, y: -1 }; // Move up
            break;
        case 'ArrowDown':
            direction = { x: 0, y: 1 }; // Move down
            break;
        case 'ArrowLeft':
            direction = { x: -1, y: 0 }; // Move left
            break;
        case 'ArrowRight':
            direction = { x: 1, y: 0 }; // Move right
            break;
    }
});
drawGrid();
gameLoop();
