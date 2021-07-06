let width = 600;
let hight = 600;
let distance = 10;
let newWidth = width / 2;
let newHeight = hight / 2;
let armLen = 0
let arm1Len = armLen;
let arm2Len = armLen; //equal lengh

let gotoX = -200;
let gotoY = 200;

let prevX = 0;
let prevY = 0;
function setup() {
  createCanvas(width, hight);
  background(220);
  //angleMode(DEGREES);
  armLen = sqrt(sq(newWidth) + sq(newHeight)) / 2;
  arm1Len = armLen;
  arm2Len = armLen;
  let inp = createInput(`${gotoX},${gotoY}`);
  inp.position(width + 50, 0)
  inp.size(50);
  inp.input(setxy);

}

function draw() {
  noFill();
  clear();

  createGraph(width, hight, distance);
  push();
  translate((width / 2), (hight / 2));//move the cordinate to center
  scale(1, -1);

  mark(0, 0);
  //draw xy axis
  drawXYAxis(newWidth, newHeight);

  //to reach the corners the total length of the arm should be the hypotenuse

  console.log(`armlength ${armLen}`)

  mark(gotoX, gotoY);
  angles = getAngles(gotoX, gotoY);
  console.log(`angles.A1 ${angles.A1} angles.A2 ${angles.A2}`)
  arm1XY = getCordinates(arm1Len, angles.A1);



  stroke('black');
  strokeWeight(2);
  let v0 = createVector(0, 0);

  let arm1V = createVector(arm1Len, 0);
  arm1V.setHeading(angles.A1);
  drawArrow(v0, arm1V, "blue");
  circle(arm1XY.X, arm1XY.Y, 20);

  let arm2V = arm1V.copy();
  //calculate the angle of second arm from x axis. we dont need to do this for real arm since we can referane the arm 1 and angle arm2 from there
  let b2 = asin((gotoY - arm1XY.Y) / arm2Len);
  if (gotoX < 0) {
    b2 = PI - b2;

  }
  // if (gotoY < 0) {
  //   b2 = -(arm2Len * PI) - b2
  // }
  arm2V.setHeading(b2);

  drawArrow(arm1V, arm2V, "green");



  pop();

  prevX = gotoX;
  prevY = gotoY;
  displayText(angles);
}


function drawArrow(base, vec, myColor) {
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

function displayText(angles) {

  textSize(12);
  stroke('black');
  text(`A1 - ${degrees(angles.A1)}`, width - 150, hight - 50);
  text(`A2 - ${degrees(angles.A2)}`, width - 150, hight - 30);

}
function setxy() {

  let s = this.value();
  let v = split(s, ',');
  gotoX = float(v[0]);
  gotoY = float(v[1]);
  console.log(`gotoX ${gotoX} gotoY ${gotoY}`);
}

function createGraph(w, h, d = 1) {
  stroke('green');
  strokeWeight(1);
  //y axis
  for (let index = 0; index < w; index += d) {
    line(0, index, w, index);
  }
  for (let index = 0; index < h; index += d) {
    line(index, 0, index, hight);
  }
}
function mark(x, y) {
  stroke('red');
  strokeWeight(10);
  point(x, y);

}

function drawXYAxis(w, h) {
  stroke('red');
  strokeWeight(2);
  line(0, -h, 0, h);
  line(-w, 0, w, 0);
}

function getCordinates(l, angle, orginX = 0, orginY = 0) {
  console.log(`l ${l}`);
  console.log(`angle ${angle}`);

  //angle from y axis
  x = orginX + cos(angle) * l;
  y = orginY + sin(angle) * l;

  return { X: x, Y: y };
}
function getAngles(x, y) {
  //https://appliedgo.net/roboticarm/
  //https://howtomechatronics.com/projects/scara-robot-how-to-build-your-own-arduino-based-robot/

  /*   
       _a2_______(x,y)
      / theta2
   a1/          h
    /     
     theta1
  
     theta1= d1+ d2 (d1 angle beteen x and hypotanuse d2 angle between hypo and a1)
     d1=atan(y/x)
     d2=   acos((sq(a)+sq(b)-sq(c))/2ab)
  
  */
  if (x == 0 && y == 0) {//this does not form a triangle so hard code. this would be the home position
    return { A1: 0, A2: 360 };
  }
  let h = sqrt(sq(x) + sq(y));
  let d1 = atan(y / x);

  let d2 = lawOfcosines(h, arm1Len, arm2Len);// acos((sq(h) + sq(arm1Len) - sq(arm2Len)) / (2 * h * arm1Len)); 
  
  let a2 = lawOfcosines(arm1Len, arm2Len, h)//acos((sq(arm1Len) + sq(arm2Len) - sq(h)) / (2 * h * arm2Len));
  let a1 = d1 + d2;

  if (x < 0) {    
    a1 = HALF_PI - a1;
  }
  // if (x >= 0 & y >= 0) {       // 1st quadrant
  //   a1 = 90 - a1;
  // }
  // if (x < 0 & y > 0) {       // 2nd quadrant
  //   a1 = 90 - a1;
  // }
  // if (x < 0 & y < 0) {       // 3d quadrant
  //   a1 = 270 - a1;
  // }
  // if (x > 0 & y < 0) {       // 4th quadrant
  //   a1 = -90 - a1;
  // }
  // if (x < 0 & y == 0) {
  //   a1 = 270 + a1;
  // }

  return { A1: a1, A2: a2 };
}
function lawOfcosines(a, b, h) {
  let c = acos((sq(a) + sq(b) - sq(h)) / (2 * a * b))
  return c;
}
