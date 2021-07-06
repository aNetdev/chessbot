let balls = [];
function setup() {
	createCanvas(800, 800);
	let count = 5
	for (let index = 0; index < count; index++) {
		ball = new Ball(index * (width / count), 10, round(random(1, 10)));
		balls.push(ball);
	}

}

function draw() {
	let wind;
	background(0);
	//circle(10,10,10);
	if (mouseIsPressed) {
		wind = createVector(0.1, 0);
	}

	let gravity = createVector(0, 0.2);

	for (let index = 0; index < balls.length; index++) {
		const ball = balls[index];
		ball.applyForce(wind);
		let weight = p5.Vector.mult(gravity, ball.mass)//f=ma
		ball.applyForce(weight);

		//intersect bounce
		for (let j = 0; j < balls.length; j++) {
			const otherBall = balls[j];
			if (ball != otherBall) {
				ball.handleCollision(otherBall);
			}
		}


		ball.update();
		ball.edges();
		ball.show();

	}


}
