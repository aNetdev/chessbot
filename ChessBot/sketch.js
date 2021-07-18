
let width = 600;
let height = 600;
let cols = 8;
let distance = width / (cols + 2); // one empty row on each side

let halfWidth = width / 2;
let halfheight = height / 2;


let gotoX = 0;
let gotoY = 0;

let previousX;
let previousY;

let previousCell;
let nextCell;
let inp;
let cells = [];

let bot;
let path;
let isMoving = false;

function setup() {
  createCanvas(width + 200, height + 100);
  //createCanvas(width , height);
  background(220);
  let armLen = sqrt(sq(halfWidth) + sq(halfheight)) / 2;
  let arm1Len = armLen;
  let arm2Len = armLen;

  inp = createInput(`${gotoX},${gotoY}`);
  inp.position(width, 10);
  inp.size(50);
  inp.input(setxy);

  bot = new Scara(arm1Len, arm2Len, width, height);
  createChessBoard(cols, distance);
  gotoX = cells[0].midX;
  gotoY = cells[0].midY;
}

function draw() {
  // noFill();
  clear();
  showCellLable();
  updateCells();
  if (path && path.length > 0) {
    const p = path.pop();
    gotoX = p.x;
    gotoY = p.y;
    isMoving = true;
  }
  else {
    isMoving = false;
  }

  bot.goto(gotoX, gotoY);
  bot.update();
  bot.show();

  mark(halfWidth, halfheight);//center
  mark(gotoX, gotoY);

  var cell = getCellFromXY(gotoX, gotoY);
  if (cell) {
    cell.occupied = true;
    nextCell = cell;
    nextCell.color = "green";
  }
  if ((previousX != gotoX || previousY != gotoY)) {
    var pcell = getCellFromXY(previousX, previousY);
    if (pcell) {
      pcell.occupied = false;
      previousCell = pcell;      
      previousCell.color = "blue";

      if (!isMoving) {
        path = getPath(previousCell, nextCell);
        path = path.reverse();// easy to pop
      }

      //   console.log(path.dir);
      //   const c = color(random(0, 255), random(0, 255), random(0, 255));
      //   let cells = path.cells;
      //   for (let index = 0; index < cells.length; index++) {
      //     const cell = cells[index];
      //     cell.textColor = c;
      //     cell.inPath = true;
      //     cell.order = index;
      //   }
      // }
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
  push();
  stroke('yellow');
  strokeWeight(10);
  point(x, y);
  pop();
}

function mousePressed() {
  if (mouseX <= width && mouseY <= height) {
    gotoX = mouseX;
    gotoY = mouseY;
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
          color = 'white';
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
          color = 'white';
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
  //ignore borders
  for (const cell of cells) {
    if ((cell.x < x && (cell.x + cell.len ) > x) && (cell.y < y && (cell.y + cell.len ) > y)) {
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
  let resultCells = {};
  let points = [];
  //check if this is on a straight path?
  if (start.x != end.x && start.y != end.y) { // not in a straight path
    //we can move in a L patern. for this divide the cells into a vertical and horizontal arm
    const vEnd = getCellFromXY(start.x+1, end.y+1);
    let v = getCellsInPath(start, vEnd);
    let vCellsInPath = v.cells;
    vCellsInPath.pop();//remove the last cell since it would be added in hCellsInPath
    let h = getCellsInPath(vEnd, end);
    let hCellsInPath = h.cells;
    cellsInPath = vCellsInPath.concat(hCellsInPath);
    resultCells = {
      cells: cellsInPath,
      dir: v.dir + '-' + h.dir
    };
  }
  else {
    resultCells = getCellsInPath(start, end);
  }
  console.log(resultCells.dir);

  let startXY = { x: start.midX, y: start.midY };
  const cells = resultCells.cells;
  for (let index = 0; index < cells.length; index++) {
    const currentCell = cells[index];
    const nextCell = index + 1 >= cells.length ? currentCell : cells[index + 1];
    let p = currentCell.getPath(startXY, nextCell);
    points = points.concat(p);
    lastPoint =points[points.length-1];
    startXY.x = lastPoint.x;
    startXY.y = lastPoint.y;
  }



  return points;
}

function getCellsInPath(start, end) {
  let dir = "";
  let cellsInPath = [];
  cellsInPath.push(start);
  const x = start.x;
  if (start.y > end.y) { // move up    
    let cells = getVerticalCells(x + 1, start.y, end.y, end.len);
    cellsInPath = cellsInPath.concat(cells.reverse());
    dir = "up";
  }
  else if (start.y < end.y) { //movedown
    let cells = getVerticalCells(x + 1, end.y, start.y, end.len);
    cellsInPath = cellsInPath.concat(cells);
    dir = "down";
  }

  const y = start.y;
  if (start.x < end.x) { // move right

    let cells = getHorizontalCells(y + 1, end.x, start.x, end.len);
    cellsInPath = cellsInPath.concat(cells);
    dir = "right";
  }
  else if (start.x > end.x) { //move left    
    let cells = getHorizontalCells(y + 1, start.x, end.x, end.len);
    cellsInPath = cellsInPath.concat(cells.reverse());
    dir = "left";
  }
  cellsInPath.push(end);
  console.log(cellsInPath);
  return {
    cells: cellsInPath,
    dir: dir
  };
}


