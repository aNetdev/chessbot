class Ball {

    constructor(x, y, mass) {
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.r = sqrt(mass) * 10;
        this.color = { R: random(0, 255), B: random(0, 255), G: random(0, 255) }
        this.mass = mass;
    }


    applyForce(force) {
        if (force) {
            let a = p5.Vector.div(force, this.mass) //a=F/m
            this.acc.add(a);
        }
    }

    edges() {
        if (this.pos.y >= height - this.r) {
            this.pos.y = height - this.r;
            this.vel.y *= -1;
        }
        else if (this.pos.y <= this.r) {
            this.pos.y = this.r;
            this.vel.y *= -1;
        }

        if (this.pos.x >= width - this.r) {
            this.pos.x = width - this.r;
            this.vel.x *= -1;
        } else if (this.pos.x <= this.r) {
            this.pos.x = this.r;
            this.vel.x *= -1;
        }
    }

    handleCollision(otherBall) {
        //if (this.isTouching(otherBall)) {
        //move away from the otherBall
        let distanceVect = p5.Vector.sub(otherBall.pos, this.pos);
        // Calculate magnitude of the vector separating the balls
        let distanceVectMag = distanceVect.mag();

        // Minimum distance before they are touching
        let minDistance = this.r + otherBall.r;

        if (distanceVectMag < minDistance) {
            let distanceCorrection = (minDistance - distanceVectMag) / 2.0;
            let d = distanceVect.copy();
            let correctionVector = d.normalize().mult(distanceCorrection);
            otherBall.pos.add(correctionVector);
            this.pos.sub(correctionVector);

            //figure out the angle of bounce

            let theta = distanceVect.heading();// get angle of distanceVect
            // precalculate trig values
            let sine = sin(theta);
            let cosine = cos(theta);

            /* bTemp will hold rotated ball this.positions. You 
                   just need to worry about bTemp[1] this.position*/
            let bTemp = [createVector(), createVector()];

            /* this ball's this.position is relative to the other
             so you can use the vector between them (bVect) as the 
             reference point in the rotation expressions.
             bTemp[0].this.position.x and bTemp[0].this.position.y will initialize
             automatically to 0.0, which is what you want
             since b[1] will rotate around b[0] */
            bTemp[1].x = cosine * distanceVect.x + sine * distanceVect.y;
            bTemp[1].y = cosine * distanceVect.y - sine * distanceVect.x;

            // rotate Temporary velocities
            let vTemp = [createVector(), createVector()];

            vTemp[0].x = cosine * this.vel.x + sine * this.vel.y;
            vTemp[0].y = cosine * this.vel.y - sine * this.vel.x;
            vTemp[1].x = cosine * otherBall.vel.x + sine * otherBall.vel.y;
            vTemp[1].y = cosine * otherBall.vel.y - sine * otherBall.vel.x;


            /* Now that velocities are rotated, you can use 1D
             conservation of momentum equations to calculate 
             the final this.velocity along the x-axis. */
            let vFinal = [createVector(), createVector()];
            // final rotated this.velocity for b[0]
            vFinal[0].x =
                ((this.mass - otherBall.mass) * vTemp[0].x + 2 * otherBall.mass * vTemp[1].x) /
                (this.mass + otherBall.mass);
            vFinal[0].y = vTemp[0].y;

            // final rotated this.velocity for b[0]
            vFinal[1].x =
                ((otherBall.mass - this.mass) * vTemp[1].x + 2 * this.mass * vTemp[0].x) /
                (this.m + otherBall.m);
            vFinal[1].y = vTemp[1].y;

            // hack to avoid clumping
            bTemp[0].x += vFinal[0].x;
            bTemp[1].x += vFinal[1].x;

            /* Rotate ball this.positions and velocities back
             Reverse signs in trig expressions to rotate 
             in the opposite direction */
            // rotate balls
            let bFinal = [createVector(), createVector()];

            bFinal[0].x = cosine * bTemp[0].x - sine * bTemp[0].y;
            bFinal[0].y = cosine * bTemp[0].y + sine * bTemp[0].x;
            bFinal[1].x = cosine * bTemp[1].x - sine * bTemp[1].y;
            bFinal[1].y = cosine * bTemp[1].y + sine * bTemp[1].x;

            // update balls to screen this.position
            otherBall.pos.x = this.pos.x + bFinal[1].x;
            otherBall.pos.y = this.pos.y + bFinal[1].y;

            this.pos.add(bFinal[0]);

            // update velocities
            this.vel.x = cosine * vFinal[0].x - sine * vFinal[0].y;
            this.vel.y = cosine * vFinal[0].y + sine * vFinal[0].x;
            otherBall.vel.x = cosine * vFinal[1].x - sine * vFinal[1].y;
            otherBall.vel.y = cosine * vFinal[1].y + sine * vFinal[1].x;
        }

    }

    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.set(0, 0);
    }

    show() {
        stroke(255);
        strokeWeight(2);
        fill(this.color.R, this.color.B, this.color.G);
        ellipse(this.pos.x, this.pos.y, this.r * 2);
        text(this.mass, this.pos.x, this.pos.y);
    }
}
