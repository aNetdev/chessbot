let width = 600;
let hight = 600;
let cols = 8;
let distance = width / (cols + 2); // one empty row on each side

let halfWidth = width / 2;
let halfHight = hight / 2;


let gotoX = 80;
let gotoY = 80;


let inp;
let cells = [];

let bot;

function setup() {
  createCanvas(width, hight);
  background(220);
  let armLen = sqrt(sq(halfWidth) + sq(halfHight)) / 2;
  let arm1Len = armLen;
  let arm2Len = armLen;

  inp = createInput(`${gotoX},${gotoY}`);
  inp.position(width + 50, 0)
  inp.size(50);
  inp.input(setxy);

  bot = new Scara(arm1Len, arm2Len, width, height);

}

function draw() {
  // noFill();
  clear();

  createChessBoard(cols, distance);
  bot.goto(gotoX, gotoY);
  bot.update();
  bot.show();
  mark(halfWidth, halfHight);//center
  mark(gotoX,gotoY);


  inp.value(`${gotoX},${gotoY}`);
}

function mark(x, y) {
  push()
  stroke('red');
  strokeWeight(10);
  point(x, y);
  pop();
}

function mousePressed() {
  if (mouseX <= width && mouseY <= height) {
    gotoX = mouseX
    gotoY = mouseY
  }
}

function setxy() {

  let s = this.value();
  let v = split(s, ',');
  gotoX = float(v[0]);
  gotoY = float(v[1]);
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

// function createGraph(w, h, d = 1) {
//   stroke('green');
//   strokeWeight(1);
//   //y axis
//   for (let index = distance; index < w; index += d) {
//     line(distance, index, w - distance, index);
//   }
//   for (let index = distance; index < h; index += d) {
//     line(index, distance, index, hight - distance);
//   }
// }
// function drawXYAxis(w, h) {
//   stroke('red');
//   strokeWeight(2);
//   line(0, -h, 0, h);
//   line(-w, 0, w, 0);
// }
