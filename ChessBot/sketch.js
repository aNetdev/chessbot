let width = 600;
let height = 600;
let cols = 8;
let distance = width / (cols + 2); // one empty row on each side

let halfWidth = width / 2;
let halfheight = height / 2;


let gotoX = 80;
let gotoY = 80;

let previousX;
let previousY;

let previousCell;
let nextCell;
let inp;
let cells = [];

let bot;

function setup() {
  createCanvas(width + 200, height + 100);
  //createCanvas(width , height);
  background(220);
  let armLen = sqrt(sq(halfWidth) + sq(halfheight)) / 2;
  let arm1Len = armLen;
  let arm2Len = armLen;

  inp = createInput(`${gotoX},${gotoY}`);
  inp.position(width, 10)
  inp.size(50);
  inp.input(setxy);

  bot = new Scara(arm1Len, arm2Len, width, height);
  createChessBoard(cols, distance);
}

function draw() {
  // noFill();
  clear();
  showCellLable();
  updateCells();

  bot.goto(gotoX, gotoY);
  bot.update();
  bot.show();

  mark(halfWidth, halfheight);//center
  mark(gotoX, gotoY);

  var cell = getCellFromXY(gotoX, gotoY);
  if (cell) {
    cell.occupied = true;
    nextCell = cell;
  }
  if (previousX != gotoX || previousY != gotoY) {
    var pcell = getCellFromXY(previousX, previousY);
    if (pcell) {
      pcell.occupied = false;
      previousCell = pcell;
      getPath(previousCell, nextCell);
    }
  }


  inp.value(`${gotoX},${gotoY}`);
  previousX = gotoX;
  previousY = gotoY;
}


function updateCells() {
  for (const cell of cells) {
    cell.update();
    cell.show();
  }

}
function showCellLable() {
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
  push()
  stroke('yellow');
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

      cells.push(c);
      //rect(i * distance, j * distance, distance, distance);
    }
  }

}


function getCellFromXY(x, y) {
  for (const cell of cells) {
    if ((cell.x <= x && (cell.x + cell.len) >= x) && (cell.y <= y && (cell.y + cell.len) >= y)) {
      return cell;
    }
  }

}
function getVerticalCells(x, startY, endY, len) {
  let cellsInPath = [];

  let y = endY + (len + 1);
  while (y < startY) {
    let c = getCellFromXY(x, y);
    cellsInPath.push(c);
    y += len;
  }
  return cellsInPath;
}
function getHorizontalCells(y, startX, endX, len) {
  let cellsInPath = [];

  let x = endX + (len + 1);
  while (x < startX) {
    let c = getCellFromXY(x, y);
    cellsInPath.push(c);
    x += len;
  }
  return cellsInPath;
}


function getPath(start, end) {
  //check if this is on a straight path?
  let cellsInPath = [];
  if (start.x == end.x) { //move vertically
    const x = start.x;
    if (start.y > end.y) { // move up

      cellsInPath.push(end);
      let cells = getVerticalCells(x, start.y, end.y, end.len);
      cellsInPath = cellsInPath.concat(cells);
      //add the souce as well
      cellsInPath.push(start);
    }
    else { //movedown
      cellsInPath.push(end);
      let cells = getVerticalCells(x, end.y, start.y, end.len);
      cellsInPath = cellsInPath.concat(cells.reverse());
      //add the souce as well
      cellsInPath.push(start);
    }

  }
  else if (start.y == end.y)// move horizontaly
  {
    const y = start.y;
    if (start.x < end.x) { // move right

      cellsInPath.push(end);
      let cells = getHorizontalCells(y, end.x, start.x, end.len);
      cellsInPath = cellsInPath.concat(cells);
      //add the souce as well
      cellsInPath.push(start);
    }
    else { //move left
      cellsInPath.push(end);
      let cells = getHorizontalCells(y, start.x, end.x, end.len);
      cellsInPath = cellsInPath.concat(cells.reverse());
      //add the souce as well
      cellsInPath.push(start);
    }
  }
  console.log(cellsInPath);
  return cellsInPath;
}
// function createGraph(w, h, d = 1) {
//   stroke('green');
//   strokeWeight(1);
//   //y axis
//   for (let index = distance; index < w; index += d) {
//     line(distance, index, w - distance, index);
//   }
//   for (let index = distance; index < h; index += d) {
//     line(index, distance, index, height - distance);
//   }
// }
// function drawXYAxis(w, h) {
//   stroke('red');
//   strokeWeight(2);
//   line(0, -h, 0, h);
//   line(-w, 0, w, 0);
// }
