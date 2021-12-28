// cheers https://codepen.io/WillemCrnlssn/pen/JgFGs

const bgCanvas = document.querySelector('#background');
const bgCtx = bgCanvas.getContext('2d');

let stars = [];
let fps = 50;
let numStars = 2000;

/**
 * Star
 *
 * @param int x
 * @param int y
 * @param int length
 * @param opacity
 */

class Star {
	constructor(x, y, length, opacity) {
		this.x = parseInt(x);
		this.y = parseInt(y);
		this.length = parseInt(length);
		this.opacity = opacity;
		this.factor = 1;
		this.increment = Math.random() * 0.03;
	}

	/**
	 * Draw a star
	 * You need to give the contaxt as a parameter
	 * @param bgCtx
	 */
	draw() {
		bgCtx.rotate((Math.PI * 1) / 10);

		// Save the bgCtx
		bgCtx.save();

		// move into the middle of the bg, just to make room
		bgCtx.translate(this.x, this.y);

		// Change the opacity
		if (this.opacity > 1) {
			this.factor = -1;
		} else if (this.opacity <= 0) {
			this.factor = 1;

			this.x = Math.round(Math.random() * bgCanvas.width);
			this.y = Math.round(Math.random() * bgCanvas.height);
		}

		this.opacity += this.increment * this.factor;

		bgCtx.beginPath();
		for (let i = 5; i--; ) {
			bgCtx.lineTo(0, this.length);
			bgCtx.translate(0, this.length);
			bgCtx.rotate((Math.PI * 2) / 10);
			bgCtx.lineTo(0, -this.length);
			bgCtx.translate(0, -this.length);
			bgCtx.rotate(-((Math.PI * 6) / 10));
		}
		bgCtx.lineTo(0, this.length);
		bgCtx.closePath();
		bgCtx.fillStyle = 'rgba(255, 255, 200, ' + this.opacity + ')';
		bgCtx.shadowBlur = 5;
		bgCtx.shadowColor = '#ffff33';
		bgCtx.fill();

		bgCtx.restore();
	}
}

(function () {
	// Resize the canvas to fill browser window dynamically courtesy https://stackoverflow.com/a/8486324/12104850
	window.addEventListener('resize', resizeCanvas, false);

	// Create all the stars
	for (let i = 0; i < numStars; i++) {
		let x = Math.round(Math.random() * bgCanvas.width);
		let y = Math.round(Math.random() * bgCanvas.height);
		let length = 1 + Math.random() * 2;
		let opacity = Math.random();

		// Create a new star and draw
		let star = new Star(x, y, length, opacity);

		// Add the the stars array
		stars.push(star);
	}

	function animateBg() {
		setInterval(animateBg, 1000 / fps);
		bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
		stars.forEach((star) => star.draw(bgCtx));
	}

	function resizeCanvas() {
		bgCanvas.width = window.innerWidth;
		bgCanvas.height = window.innerHeight;

		animateBg();
	}

	resizeCanvas();
})();
