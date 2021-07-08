class Scara {

    constructor(arm1Len, arm2Len, width, height) {
        this.arm1Len = arm1Len;
        this.arm2Len = arm2Len;
        this.width = width;
        this.height = height;
        this.orginV = createVector(0,0);
    }

    goto(x, y) {
        this.gotoX = x - (this.width / 2); // convert the 0,0 left corner axis to mid point cordinates
        this.gotoY = -1 * (y - (this.height / 2));
    }
    update() {

        //get the arm 1 and 2 angles
        this.angles = this.getAngles(this.gotoX, this.gotoY);

        this.arm1V = createVector(this.arm1Len, 0);
        this.arm1V.setHeading(this.angles.A1);

        let tempV = createVector(this.gotoX, this.gotoY);
        // insted of calculating the angle between arm2 and x axis, 
        //draw the arm and then check to see if the caclulated angle is same as acutal
        this.arm2V = p5.Vector.sub(tempV, this.arm1V);
        let x = this.arm2V.angleBetween(this.arm1V);
        this.angles.A2_Calc = PI - x;
        this.angles.A2_Len = this.arm2V.mag();

    }
    show() {

        push();
        translate((this.width / 2), (this.height / 2));//move the cordinate to center
        scale(1, -1);
        stroke('black');
        strokeWeight(2);
        this.drawArrow(this.orginV, this.arm1V, "blue");
        let arm1Tip = this.getCordinates(this.arm1Len, this.angles.A1);
        circle(arm1Tip.X, arm1Tip.Y, 20);//joint circle

        this.drawArrow(this.arm1V, this.arm2V, "green");

        pop();

        this.displayText(this.angles);
    }


    drawArrow(base, vec, myColor) {
        push();
        stroke(myColor);
        strokeWeight(3);
        fill(myColor);
        translate(base.x, base.y);
        line(0, 0, vec.x, vec.y);
        rotate(vec.heading());
        let arrowSize = 7;
        translate(vec.mag() - arrowSize, 0);
        triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
        pop();
    }

    displayText(angles) {

        textSize(12);
        stroke('black');
        let x = width - 50
        let y = 100
        text(`A1 - ${degrees(angles.A1)}`, x, y);
        text(`A2 - ${degrees(angles.A2)}`, x, y += 20);
        text(`A2(calc) - ${degrees(angles.A2_Calc)}`, x, y += 20);
        text(`A2len(calc) - ${angles.A2_Len}`, x, y += 20);
        text(`x(calc) - ${this.gotoX}`, x, y += 20);
        text(`y(calc) - ${this.gotoY}`, x, y += 20);

    }



    getCordinates(l, angle, orginX = 0, orginY = 0) {
        // console.log(`l ${l}`);
        //console.log(`angle ${angle}`);

        //angle from y axis
        let x = orginX + cos(angle) * l;
        let y = orginY + sin(angle) * l;

        return { X: x, Y: y };
    }
    getAngles(x, y) {
        //https://appliedgo.net/roboticarm/
        //https://howtomechatronics.com/projects/scara-robot-how-to-build-your-own-arduino-based-robot/

        if (x == 0 && y == 0) {//this does not form a triangle so hard code. this would be the home position
            return { A1: 0, A2: 360 };
        }

        let h = sqrt(sq(x) + sq(y));
        let d1 = atan(y / x);

        let d2 = this.lawOfcosines(h, this.arm1Len, this.arm2Len);// acos((sq(h) + sq(arm1Len) - sq(arm2Len)) / (2 * h * arm1Len)); 

        let a2 = this.lawOfcosines(this.arm1Len, this.arm2Len, h)//acos((sq(arm1Len) + sq(arm2Len) - sq(h)) / (2 * h * arm2Len));
        let a1 = d1 + d2;
        if (y < 0) {
            a2 = a2;
        }

        if (x < 0) {
            a1 = PI + a1;
        }


        return { A1: a1, A2: a2 };
    }
    lawOfcosines(a, b, h) {
        let c = acos((sq(a) + sq(b) - sq(h)) / (2 * a * b))
        return c;
    }

}