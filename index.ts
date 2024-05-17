//initializing canvas
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;

//from canvas now geting rendering context object to create drawing on canvas  as 2d rendering
const context = canvas.getContext("2d");

//canvas Setting
const height = 500;
const width = 500;
canvas.height = height;
canvas.width = width;

//grid setting
const rows = 25;
const cols = 25;
const boxSize = width / cols;

// food creation

interface Position {
  x: number;
  y: number;
}

let food: Position;

// food sound 
const foodSound = new Audio('../views/food.mp3')
// Define the direction
let direction: { x: number, y: number } = { x: 0, y: 0 };

// Snake position
let snake: Position[] = [{ x: 10, y: 10 }];

// scores 3points on each eat
let score:number= 0  ; 
// Function to draw the grid
function drawGrid() {
  context.strokeStyle = "#baf462";

  // Draw vertical lines
  for (let i = 0; i <= cols; i++) {
    const x = i * boxSize;
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }

  // draw horizontal lines
  for (let i = 0; i <= rows; i++) {
    const y = i * boxSize;
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }
  drawFood(food);
  drawSnake()
}

// on start food location creation

function getRandomPosition(): Position {
  const x = Math.floor(Math.random() * cols);
  const y = Math.floor(Math.random() * rows);
  return { x, y };
}
// draw food on grid
function drawFood(position: Position) {
  context.fillStyle = "red";
  context.fillRect(
    position.x * boxSize,
    position.y * boxSize,
    boxSize,
    boxSize
  );
}
food = getRandomPosition();
// on start snake creation
function drawSnake() {
    context.fillStyle = 'black';
    snake.forEach(segment => {
        context.fillRect(segment.x * boxSize, segment.y * boxSize, boxSize, boxSize);
    });

}

function checkSelfCollision(head: Position): boolean {
  // Check if the head position matches any segment of the body
  for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
          return true;
      }
  }
  return false;
}



// Function to update the snake's position
function updateSnake() {
  const scorebox = document.getElementById('scores')
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    //checking boundaries collision
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
      console.log("Game Over-boundary collide");
      // Optionally, you can stop the game loop or reset the game here.
      snake = [getRandomPosition()];
      direction = {x:0,y:0}
      food = getRandomPosition()
      scorebox.innerText = 'Game Over! '
      setTimeout(()=>{
        document.getElementById('scores').innerText='Press Arrow Key To Start.'

      },500)
      score = 0

      return drawGrid();
  }

   // Check self-collision
   if (checkSelfCollision(head)) {
    console.log("Game Over-SelfColllide");
    snake = [getRandomPosition()];
      direction = {x:0,y:0}
      food = getRandomPosition()
      scorebox.innerText = 'Game Over! '
      setTimeout(()=>{
        document.getElementById('scores').innerText='Press Arrow Key To Start.'

      },500)
      score = 0;
      return drawGrid();
}
    // Add new head to the snake
    snake.unshift(head);

    // Remove the last part of the snake
    snake.pop();
    // food eaten 
    if(head.x === food.x && head.y===food.y)
      {
        foodSound.play()
        snake.unshift(food)
        food = getRandomPosition()
        score+=3;
        scorebox.innerHTML = 'Score : '+score.toString()
        drawFood(food)
        
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
document.addEventListener('keydown', (event) => {
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
gameLoop()
