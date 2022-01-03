const canvas = document.querySelector('#game-board');
const ctx = canvas.getContext('2d');

let holePosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let holeRadius = 30;
let particleCount = 500;
let starsEaten = 0;

let goUp = false;
let goDown = false;
let goLeft = false;
let goRight = false;

document.body.addEventListener('keydown', (e) => keyPress(e, 'down'));
document.body.addEventListener('keyup', (e) => keyPress(e, 'up'));

function drawCanvas() {
	ctx.fillStyle = 'rgba(0,0,0,1)';
	ctx.clearRect(0, 0, canvas.width, canvas.height);
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

class Planet {
	constructor() {
		this.planets = [
			'earth1',
			'earth2',
			'earth3',
			'moon',
			'darkmoon',
			'redmoon',
			'jupiter',
			'mercury',
			'saturn',
			'venus',
		];
		this.planetImage = new Image();
		this.planetImage.src = './assets/earth1.png';
		this.position = { x: 350, y: 350 };
	}

	getNewPlanetSrc() {
		this.planetImage.src = `./assets/${
			this.planets[Math.floor(Math.random() * this.planets.length)]
		}.png`;
	}

	generatePlanet() {
		ctx.drawImage(this.planetImage, this.position.x - 28, this.position.y - 28);
	}

	randomisePosition() {
		this.position = {
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
		};
	}

	preloadImage(file) {
		let img = new Image();
		img.src = `./assets/${file}.png`;
	}
}

// Particle and Blackhole built on https://codepen.io/piyushwalia/pen/JxMbMM

// Particles around the BlackHole
class Particle {
	constructor() {
		this.angle = Math.random() * 2 * Math.PI;
		this.radius = Math.random();
		this.opacity = (Math.random() * 5 + 2) / 10;
		// this.distance = (1 / this.opacity) * holeRadius;
		this.speed = (1 / this.opacity) * holeRadius * 0.00003;
		this.position = {
			x:
				holePosition.x + (1 / this.opacity) * holeRadius * Math.cos(this.angle),
			y:
				holePosition.y + (1 / this.opacity) * holeRadius * Math.sin(this.angle),
		};
	}

	draw() {
		ctx.fillStyle = 'rgba(255,255,255,' + this.opacity + ')';
		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();
	}

	update() {
		this.angle += this.speed;
		this.position = {
			x:
				holePosition.x + (1 / this.opacity) * holeRadius * Math.cos(this.angle),
			y:
				holePosition.y + (1 / this.opacity) * holeRadius * Math.sin(this.angle),
		};
		this.draw();
	}
}

class BlackHole {
	constructor() {
		this.particleCount = 3000;
		this.particles = [];
		this.speed = 7;

		for (let i = 0; i < this.particleCount; i++) {
			this.particles.push(new Particle());
		}
	}

	draw() {
		let gradient = ctx.createRadialGradient(
			holePosition.x,
			holePosition.y,
			holeRadius * 0.75,
			holePosition.x,
			holePosition.y,
			holeRadius * 2.5
		);
		gradient.addColorStop(0, 'rgba(0,0,0,1)');
		gradient.addColorStop(1, 'rgba(0,0,0,0)');
		ctx.beginPath();
		ctx.arc(holePosition.x, holePosition.y, holeRadius * 2, 0, Math.PI * 2);
		ctx.fillStyle = gradient;
		ctx.fill();
		ctx.closePath();
	}

	update() {
		for (let i = 0; i < this.particleCount; i++) {
			this.particles[i].update();
		}
		this.draw();
	}

	move() {
		if (goUp) holePosition.y -= this.speed;
		if (goDown) holePosition.y += this.speed;
		if (goLeft) holePosition.x -= this.speed;
		if (goRight) holePosition.x += this.speed;
	}

	increaseHoleSize() {
		holeRadius += 5;
	}

	increaseStarEatenCount() {
		starsEaten += 1;
		console.log(starsEaten);
	}

	checkCollision() {
		if (
			holePosition.x > planet.position.x - holeRadius &&
			holePosition.x < planet.position.x + holeRadius &&
			holePosition.y > planet.position.y - holeRadius &&
			holePosition.y < planet.position.y + holeRadius
		) {
			this.increaseHoleSize();
			this.increaseStarEatenCount();
			planet.randomisePosition();
			planet.getNewPlanetSrc();
		}
	}

	checkBoundary() {
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
}

let planet = new Planet();
let blackHole = new BlackHole();

// IIFE

(function () {
	// Resize the canvas to fill browser window dynamically courtesy https://stackoverflow.com/a/8486324/12104850
	window.addEventListener('resize', resizeCanvas, false);

	// Preload the planet images so they don't glitch when first appearing
	planet.planets.forEach((planetImg) => planet.preloadImage(planetImg));

	function drawGame() {
		requestAnimationFrame(drawGame);
		drawCanvas();
		blackHole.move();
		blackHole.checkBoundary();
		blackHole.checkCollision();
		planet.generatePlanet();
		blackHole.update();
	}

	function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		drawGame();
	}

	resizeCanvas();
})();
