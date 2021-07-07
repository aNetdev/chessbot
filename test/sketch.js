let width = 600;
let hight = 600;
let cols = 8;
let distance = width / (cols + 2); // one empty row on each side
let newWidth = width / 2;
let newHeight = hight / 2;
let armLen = 0
let arm1Len = armLen;
let arm2Len = armLen; //equal lengh

let gotoX = 100;
let gotoY = -200;

let prevX = 0;
let prevY = 0;
let inp;
let cells = [];

function setup() {
  createCanvas(width, hight);
  background(220);
  //angleMode(DEGREES);
  armLen = sqrt(sq(newWidth) + sq(newHeight)) / 2;
  arm1Len = armLen;
  arm2Len = armLen;
  inp = createInput(`${gotoX},${gotoY}`);
  inp.position(width + 50, 0)
  inp.size(50);
  inp.input(setxy);


}

function draw() {
  // noFill();
  clear();
  createChessBoard(cols, distance);

  //createGraph(width, hight, distance);

  push();
  translate((width / 2), (hight / 2));//move the cordinate to center
  scale(1, -1);

  mark(0, 0);
  //draw xy axis
  //drawXYAxis(newWidth, newHeight);

  //to reach the corners the total length of the arm should be the hypotenuse

  //console.log(`armlength ${armLen}`)

  mark(gotoX, gotoY);
  angles = getAngles(gotoX, gotoY);
  //console.log(`angles.A1 ${angles.A1} angles.A2 ${angles.A2}`)
  arm1XY = getCordinates(arm1Len, angles.A1);



  stroke('black');
  strokeWeight(2);
  let v0 = createVector(0, 0);

  let arm1V = createVector(arm1Len, 0);
  arm1V.setHeading(angles.A1);
  drawArrow(v0, arm1V, "blue");
  circle(arm1XY.X, arm1XY.Y, 20);


  let tempV = createVector(gotoX, gotoY);
  //drawArrow(v0, tempV, "green");

  let arm2V = p5.Vector.sub(tempV, arm1V);
  drawArrow(arm1V, arm2V, "red");


  let x = arm2V.angleBetween(arm1V);
  //console.log(`arm2 len ${arm2V.mag()} angleBetween ${180 - degrees(x)}`);
  angles.A2_Calc = PI - x;
  angles.A2_Len = arm2V.mag();



  pop();

  prevX = gotoX;
  prevY = gotoY;
  displayText(angles);
}
function mousePressed() {
  if (mouseX <= width && mouseY <= height) {
    gotoX = mouseX - width / 2;
    gotoY = (mouseY - height / 2) * -1;
    inp.value(`${gotoX},${gotoY}`);
  }
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
  text(`A1 - ${degrees(angles.A1)}`, width - 175, hight - 50);
  text(`A2 - ${degrees(angles.A2)}`, width - 175, hight - 35);
  text(`A2(calc) - ${degrees(angles.A2_Calc)}`, width - 175, hight - 20);
  text(`A2len(calc) - ${angles.A2_Len}`, width - 175, hight - 5);

}
function setxy() {

  let s = this.value();
  let v = split(s, ',');
  gotoX = float(v[0]);
  gotoY = float(v[1]);
  //console.log(`gotoX ${gotoX} gotoY ${gotoY}`);
}

function createGraph(w, h, d = 1) {
  stroke('green');
  strokeWeight(1);
  //y axis
  for (let index = distance; index < w; index += d) {
    line(distance, index, w - distance, index);
  }
  for (let index = distance; index < h; index += d) {
    line(index, distance, index, hight - distance);
  }
}
function createChessBoard(cols, distance) {


  for (let i = 1; i <= cols; i++) {
    for (let j = 1; j <= cols; j++) {
      let color = 'black';
      if (j % 2 == 0) {
        if (i % 2 == 0) {
          color = 'white'
        }
        else {
          color = 'black';
        }
      }
      else {
        if (i % 2 == 0) {
          color = 'black';
        }
        else {
          color = 'white'
        }
      }
      let c = new Cell(i * distance, j * distance, distance, color);
      c.occupied = j < 3 || j > cols - 2;
      c.update();
      c.show();

      cells.push(c);
      //rect(i * distance, j * distance, distance, distance);
    }
  }
  push();
  let c = 'a';
  for (let i = 1; i <= cols; i++) {
    //rows
    let midX = i * distance + distance / 2;
    let midY = distance / 2;

    text(c, midX, midY);
    c = String.fromCharCode(c.charCodeAt(0) + 1);
    //columns
    text(i, midY, midX);
  }
  pop();
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
  // console.log(`l ${l}`);
  //console.log(`angle ${angle}`);

  //angle from y axis
  x = orginX + cos(angle) * l;
  y = orginY + sin(angle) * l;

  return { X: x, Y: y };
}
function getAngles(x, y) {
  //https://appliedgo.net/roboticarm/
  //https://howtomechatronics.com/projects/scara-robot-how-to-build-your-own-arduino-based-robot/

  if (x == 0 && y == 0) {//this does not form a triangle so hard code. this would be the home position
    return { A1: 0, A2: 360 };
  }

  let h = sqrt(sq(x) + sq(y));
  let d1 = atan(y / x);

  let d2 = lawOfcosines(h, arm1Len, arm2Len);// acos((sq(h) + sq(arm1Len) - sq(arm2Len)) / (2 * h * arm1Len)); 

  let a2 = lawOfcosines(arm1Len, arm2Len, h)//acos((sq(arm1Len) + sq(arm2Len) - sq(h)) / (2 * h * arm2Len));
  let a1 = d1 + d2;
  if (y < 0) {
    a2 = a2;
  }

  if (x < 0) {
    a1 = PI + a1;
  }


  return { A1: a1, A2: a2 };
}
function lawOfcosines(a, b, h) {
  let c = acos((sq(a) + sq(b) - sq(h)) / (2 * a * b))
  return c;
}
