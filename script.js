// Initialize variables
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const snakeSize = 10;
const foodSize = 10;
let snake = [{ x: 200, y: 200 }];
let food = { x: 0, y: 0 };
let direction = "right";
let gameStarted = false;
let scoreboard = [];

  // Set the size of the canvas based on the device
  if (isMobile()) {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = canvas.width * 0.75;
  } else {
    canvas.width = 600;
    canvas.height = 450;
}
  
function isMobile() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

function startGame() {
	// Prompt the user to enter their name
	name = prompt('Please enter your name:');

	// Reset the game variables
	snake = [{ x: Math.floor(canvas.width / 2), y: Math.floor(canvas.height / 2) }];
	direction = null;
	generateFood();
	gameStarted = false;

	// Draw the initial game state
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawSnake();
	drawFood();
	displayScoreboard();

	// Add a listener to set the direction of the snake
	document.addEventListener('keydown', function setDirection(event) {
		switch (event.key) {
			case 'ArrowUp':
				if (direction != 'down') {
					direction = 'up';
					gameStarted = true;
					document.removeEventListener('keydown', setDirection);
				}
				break;
			case 'ArrowDown':
				if (direction != 'up') {
					direction = 'down';
					gameStarted = true;
					document.removeEventListener('keydown', setDirection);
				}
				break;
			case 'ArrowLeft':
				if (direction != 'right') {
					direction = 'left';
					gameStarted = true;
					document.removeEventListener('keydown', setDirection);
				}
				break;
			case 'ArrowRight':
				if (direction != 'left') {
					direction = 'right';
					gameStarted = true;
					document.removeEventListener('keydown', setDirection);
				}
				break;
		}
	});


	// Set up touch controls for mobile devices
	if (isMobile()) {
		
		let touchStartX = 0;
		let touchStartY = 0;
		let touchEndX = 0;
		let touchEndY = 0;

		canvas.addEventListener('touchstart', function (event) {
			touchStartX = event.changedTouches[0].clientX;
			touchStartY = event.changedTouches[0].clientY;
			console.log('touchstart: ', touchStartX, touchStartY);
		});

		canvas.addEventListener('touchmove', function (event) {
			touchEndX = event.changedTouches[0].clientX;
			touchEndY = event.changedTouches[0].clientY;
			console.log('touchmove: ', touchEndX, touchEndY);
		});

		canvas.addEventListener('touchend', function handleTouchEnd(event) {
			event.preventDefault();
			console.log('touchend: ', touchEndX, touchEndY);
			let deltaX = touchEndX - touchStartX;
			let deltaY = touchEndY - touchStartY;

			if (Math.abs(deltaX) > Math.abs(deltaY)) {
				if (deltaX > 0 && direction != 'left') {
					direction = 'right';
					gameStarted = true;
					setTimeout(function () {
						document.removeEventListener('touchend', handleTouchEnd);
					}, 100);
				} else if (deltaX < 0 && direction != 'right') {
					direction = 'left';
					gameStarted = true;
					setTimeout(function () {
						document.removeEventListener('touchend', handleTouchEnd);
					}, 100);
				}
			} else {
				if (deltaY > 0 && direction != 'up') {
					direction = 'down';
					gameStarted = true;
					setTimeout(function () {
						document.removeEventListener('touchend', handleTouchEnd);
					}, 100);
				} else if (deltaY < 0 && direction != 'down') {
					direction = 'up';
					gameStarted = true;
					setTimeout(function () {
						document.removeEventListener('touchend', handleTouchEnd);
					}, 100);
				}
			}
		});
	}
}

  // Initialize variables
  gameStarted = true;
  snake = [{ x: 200, y: 200 }];
  food = { x: 0, y: 0 };
  direction = "right";
  const startTime = Date.now();

  // Generate the initial food
  generateFood();

  // Set up the game loop
  setInterval(function () {
    if (gameStarted) {
      // Move the snake
      moveSnake();

      // Check for collisions
      checkCollisions();

      // Clear the canvas and draw the snake and food
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawSnake();
      drawFood();
    } else {
      // Display the scoreboard
      displayScoreboard();
    }
  }, 100);

  function moveSnake() {
    // Move the snake in the current direction
    let head = { x: snake[0].x, y: snake[0].y };
    switch (direction) {
      case "up":
        head.y -= snakeSize;
        break;
      case "down":
        head.y += snakeSize;
        break;
      case "left":
        head.x -= snakeSize;
        break;
      case "right":
        head.x += snakeSize;
        break;
    }
    snake.unshift(head);
    snake.pop();
  }

  function checkCollisions() {
    // Check if the snake collided with a wall or with itself
    if (
      snake[0].x < 0 ||
      snake[0].x >= canvas.width ||
      snake[0].y < 0 ||
      snake[0].y >= canvas.height
    ) {
      endGame(startTime);
      return;
    }
    for (let i = 1; i < snake.length; i++) {
      if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
        endGame(startTime);
        return;
      }
    }

    // Check if the snake ate the food
    if (snake[0].x == food.x && snake[0].y == food.y) {
      // Add a new segment to the snake and generate new food
      snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
      generateFood();
    }
}

 function generateFood() {
		// Generate a random position for the food within the visible area of the canvas
		food.x = Math.floor(Math.random() * (canvas.width - foodSize));
		food.y = Math.floor(Math.random() * (canvas.height - foodSize));

		// Round the position to the nearest multiple of the snake size
		food.x = Math.floor(food.x / snakeSize) * snakeSize;
		food.y = Math.floor(food.y / snakeSize) * snakeSize;

		// Make sure the food doesn't overlap with the snake
		for (let i = 0; i < snake.length; i++) {
			if (
				food.x == snake[i].x &&
				food.y == snake[i].y &&
				// Check if the food overlaps with the snake's head
				(food.x != snake[0].x || food.y != snake[0].y)
			) {
				generateFood();
				return;
			}
			// Check if the food overlaps with the snake's body
			for (let j = 1; j < snake.length; j++) {
				if (food.x == snake[j].x && food.y == snake[j].y) {
					generateFood();
					return;
				}
			}
		}
 }

  function drawSnake() {
    // Draw each segment of the snake
    for (let i = 0; i < snake.length; i++) {
      ctx.fillStyle = "green";
      ctx.fillRect(snake[i].x, snake[i].y, snakeSize, snakeSize);
    }
  }

  function drawFood() {
    // Draw the food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, foodSize, foodSize);
  }

function endGame(startTime) {
	// Calculate the time played in seconds
	const endTime = Date.now();
	const timePlayed = (endTime - startTime) / 1000;

	// Add the player's score to the scoreboard
	scoreboard.push({ name: name, score: timePlayed });

	// Sort the scoreboard in descending order of score
	scoreboard.sort(function (a, b) {
		return b.score - a.score;
	});

	// Display the updated scoreboard
	if (!gameStarted) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		displayScoreboard();
	}

	// Reset the game variables
	snake = [{ x: Math.floor(canvas.width / 2), y: Math.floor(canvas.height / 2) }];
	direction = null;
	generateFood();
	gameStarted = false;
}
function displayScoreboard() {
	// Display the scoreboard
	scoreboard.sort((a, b) => b.score - a.score);
	let scoreboardHTML = '<h2>Scoreboard</h2>';
	scoreboardHTML += '<table>';
	scoreboardHTML += '<tr><th>Name</th><th>Time Played</th></tr>';
	for (let i = 0; i < scoreboard.length; i++) {
		scoreboardHTML += `<tr><td>${scoreboard[i].name}</td><td>${scoreboard[i].score.toFixed(2)} seconds</td></tr>`;
	}
	scoreboardHTML += '</table>';
	document.getElementById('game').innerHTML = scoreboardHTML;

	// Generate new food
	generateFood();
}

 

  // Listen for key presses to change the direction of the snake
  document.addEventListener("keydown", function (event) {
    switch (event.key) {
      case "ArrowUp":
        if (direction != "down") {
          direction = "up";
        }
        break;
      case "ArrowDown":
        if (direction != "up") {
          direction = "down";
        }
        break;
      case "ArrowLeft":
        if (direction != "right") {
          direction = "left";
        }
        break;
      case "ArrowRight":
        if (direction != "left") {
          direction = "right";
        }
        break;
    }
  });