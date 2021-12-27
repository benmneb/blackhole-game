const canvas = document.querySelector('#game-board');
const ctx = canvas.getContext('2d');
const starCountEl = document.querySelector('#star-count');

let holePosition = { x: 100, y: 100 };
let starPosition = { x: 350, y: 350 };
let holeRadius = 30;
let starRadius = 5;
let speed = 7;
let starsEaten = 0;

let goUp = false;
let goDown = false;
let goLeft = false;
let goRight = false;

document.body.addEventListener('keydown', (e) => keyPress(e, 'down'));
document.body.addEventListener('keyup', (e) => keyPress(e, 'up'));

function drawHole() {
	ctx.fillStyle = 'darkgrey';
	ctx.beginPath();
	ctx.arc(holePosition.x, holePosition.y, holeRadius, 0, Math.PI * 2);
	ctx.fill();
}

function drawCanvas() {
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawStar(radius = starRadius, spikes = 6, inset = 3) {
	ctx.save();
	ctx.fillStyle = 'yellow';
	ctx.beginPath();
	ctx.translate(starPosition.x, starPosition.y);
	ctx.moveTo(0, 0 - radius);
	for (let i = 0; i < spikes; i++) {
		ctx.rotate(Math.PI / spikes);
		ctx.lineTo(0, 0 - radius * inset);
		ctx.rotate(Math.PI / spikes);
		ctx.lineTo(0, 0 - radius);
	}
	ctx.closePath();
	ctx.fill();
	ctx.restore();
}

function keyPress(e, action) {
	switch (e.keyCode) {
		case 37:
			if (action === 'down') return (goLeft = true);
			return (goLeft = false);
		case 38:
			if (action === 'down') return (goUp = true);
			return (goUp = false);
		case 39:
			if (action === 'down') return (goRight = true);
			return (goRight = false);
		case 40:
			if (action === 'down') return (goDown = true);
			return (goDown = false);
		default:
			return;
	}
}

function moveHole() {
	if (goUp) {
		holePosition.y -= speed;
	}
	if (goDown) {
		holePosition.y += speed;
	}
	if (goLeft) {
		holePosition.x -= speed;
	}
	if (goRight) {
		holePosition.x += speed;
	}
}

function checkBoundary() {
	// top
	if (holePosition.y < holeRadius) {
		holePosition.y = canvas.height - holeRadius;
	}
	// bottom
	if (holePosition.y > canvas.height - holeRadius) {
		holePosition.y = holeRadius;
	}
	// left
	if (holePosition.x < holeRadius) {
		holePosition.x = canvas.width - holeRadius;
	}
	// right
	if (holePosition.x > canvas.width - holeRadius) {
		holePosition.x = holeRadius;
	}
}

function randomiseStarPosition() {
	starPosition = {
		x: Math.random() * canvas.width,
		y: Math.random() * canvas.height,
	};
}

function increaseHoleSize() {
	holeRadius += 2;
}

function increaseStarEatenCount() {
	starsEaten += 1;
	// starCountEl.textContent = starsEaten;
}

function checkCollision() {
	if (
		holePosition.x > starPosition.x - holeRadius &&
		holePosition.x < starPosition.x + holeRadius &&
		holePosition.y > starPosition.y - holeRadius &&
		holePosition.y < starPosition.y + holeRadius
	) {
		randomiseStarPosition();
		increaseHoleSize();
		increaseStarEatenCount();
	}
}

(function () {
	// Resize the canvas to fill browser window dynamically courtesy https://stackoverflow.com/a/8486324/12104850
	window.addEventListener('resize', resizeCanvas, false);

	function drawGame() {
		requestAnimationFrame(drawGame);
		drawCanvas();
		drawHole();
		moveHole();
		checkBoundary();
		checkCollision();
		drawStar();
	}

	function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		drawGame();
	}

	resizeCanvas();
})();
