class Cell {

    constructor(x, y, len, color) {
        this.x = x;
        this.y = y;
        this.len = len;
        this.color = color;
        this.midX = this.x + (this.len / 2);
        this.midY = this.y + (this.len / 2);

    }

    show() {
        push();
        fill(this.color);
        rect(this.x, this.y, this.len, this.len);

        if (this.occupied) {
            fill('red');
            circle(this.midX, this.midY, 30);
        }
        if (this.inPath) {
            fill(this.textColor);
            text(this.order, this.midX, this.midY);
        }
        pop();
    }

    update() {


    }
    getPath(startXY, destinationCell, moveType = "midstraight") { //movetypes= edges,diagonal,midstraight
        let coordinates = [];
        let requestedType = moveType;
        //we have to move though edges
        if (this.occupied) {
            moveType = "edges";
        }
        //if startXY is within the cell we can only use midstraight move
        // if (startXY.x == this.midX && startXY.y == this.midY) {
        //     moveType = "midstraight";
        // }

        switch (moveType) {
            case "midstraight": {
                coordinates = this.getMidStraightPoints(startXY, destinationCell);
                break;
            }
            case "edges": {
                coordinates = this.getEdgePoints(startXY, destinationCell);

                break;
            }
            case "diagonal": {
                coordinates = this.getDiagonalPoints(startXY, destinationCell);
                break;
            }

            default:
                break;
        }

        if (requestedType == "diagonal" && moveType == "edges") {
            // last point would be the mid of the cell so move it to the edge.
            let startPoint = coordinates.length > 0 ? coordinates[coordinates.length - 1] : startXY;
            let incords = this.getStraightPathPoints(startPoint, destinationCell.x, destinationCell.y);
            coordinates = coordinates.concat(incords);

        }

        if (this === destinationCell) {//move to mid point

            if (moveType != "diagonal") {
                let startPoint = coordinates.length > 0 ? coordinates[coordinates.length - 1] : startXY;
                let incords = this.getStraightPathPoints(startPoint, this.midX, this.midY);
                coordinates = coordinates.concat(incords);
            }
        }

        return coordinates;
    }
    getMidStraightPoints(startXY, destinationCell) {
        let coordinates = [];

        //dcell on top or dcell on bottom
        if (destinationCell.y < this.y || destinationCell.y > this.y) {
            let ex = this.midX;// if its top or bottom x would the same mid pos
            let ey = destinationCell.y < this.y ? this.y : this.y + this.len;// if its the top y would be the same as this.y other wise it would be the bottom line of this cell

            //move to top mid posistion
            coordinates = this.getStraightPathPoints(startXY, ex, ey);


        }
        //dcell on left destinationCell.y == this.y or  on right destinationCell.y == this.y
        else if (destinationCell.x < this.x || destinationCell.x > this.x) {
            let ex = destinationCell.x < this.x ? this.x : this.x + this.len;// if its the left y would be the same as this.x other wise it would be the right line of this cell
            let ey = this.midY;// if its the top y would be the same as this.y other wise it would be the bottom line of this cell
            coordinates = this.getStraightPathPoints(startXY, ex, ey);

        }
        //cordinates.push({ x: destinationCell.midX, y: destinationCell.midY });

        return coordinates;
    }

    getEdgePoints(startXY, destinationCell) {
        let cordinates = [];

        //dcell on top 
        if (destinationCell.y < this.y) {
            cordinates = this.edgePointsToTop(startXY);
        }
        //dcell on bottom
        else if (destinationCell.y > this.y) {

            //move xyx
            // if the start is at the bottom of the cell
            cordinates = this.edgePointsToBottom(startXY);

        }
        //dcell on left
        else if (destinationCell.x < this.x) {

            //move xyx
            // if the start is at the bottom of the cell
            cordinates = this.edgePointsToLeft(startXY);

        }
        //dcell on right
        else if (destinationCell.x > this.x) {

            //move xyx
            // if the start is at the bottom of the cell
            cordinates = this.edgePointsToRight(startXY);

        }
        return cordinates;
    }

    getDiagonalPoints(startXY, destinationCell) {
        let cordinates = [];
        let dx = this === destinationCell ? destinationCell.midX : destinationCell.x;
        let dy = this === destinationCell ? destinationCell.midY : destinationCell.y;

        let vDir = startXY.y > dy ? -1 : 1;
        let hDir = startXY.x > dx ? -1 : 1;

        let l = abs(startXY.x - dx);
        //let l = sqrt(sq(destinationCell.x - startXY.x) + sq(destinationCell.y - startXY.y));
        for (let index = 0; index < l; index++) {
            cordinates.push({ x: startXY.x + (index * hDir), y: startXY.y + (index * vDir) });
        }

        return cordinates;


    }
    edgePointsToRight(startXY) {
        let cordinates = [];
        // if the start is at the bottom of the cell
        if (startXY.y >= this.y + this.len) {
            //move to the bottom right corner
            let br = this.pointsToBottomRightCorner(startXY);

            //move to the right middle
            // let rm = this.pointsToRightMid(br[br.length - 1]);
            cordinates = br;//.concat(rm);
        }

        // if the start is at the left of the cell
        else if (startXY.x <= this.x) {
            //move to the bottom left corner                
            let bl = this.pointsToBottomLeftCorner(startXY);
            //move to the bottom right corner                
            let br = this.pointsToBottomRightCorner(bl[bl.length - 1]);
            //move to the right middle              
            // let rm = this.pointsToRightMid(br[br.length - 1]);
            cordinates = bl.concat(br);//.concat(rm);
        }

        // if the start is at the right of the cell
        else if (startXY.x >= this.x + this.len) {
            //move to the right middle                
            let rm = this.pointsToRightMid(startXY);
            cordinates = rm;

        }

        // if the start is at the top of the cell
        else if (startXY.y <= this.y) {

            //move to the top right corner                
            let tr = this.pointsToTopRightCorner(startXY);
            //move to the right middle                                
            //let rm = this.pointsToRightMid(tr[tr.length - 1]);
            cordinates = tr;//.concat(rm);

        }
        return cordinates;
    }



    edgePointsToLeft(startXY) {
        let cordinates = [];
        // if the start is at the bottom of the cell
        if (startXY.y >= this.y + this.len) {
            let bl = this.pointsToBottomLeftCorner(startXY);
            //move to the left middle
            //let lm = this.pointsToLeftMid(bl[bl.length - 1]);
            cordinates = bl;//.concat(lm);

        } // if the start is at the left of the cell
        else if (startXY.x <= this.x) {
            //move to the left middle
            let lm = this.pointsToLeftMid(startXY);
            cordinates = lm;

        }

        // if the start is at the right of the cell
        else if (startXY.x >= this.x + this.len) {
            //move to the bottom right corner
            let br = this.pointsToBottomRightCorner(startXY);
            //move to the bottom left corner
            let bl = this.pointsToBottomLeftCorner(br[br.length - 1]);
            //move to the left middle
            //let lm = this.pointsToLeftMid(bl[bl.length - 1]);
            cordinates = br.concat(bl);//.concat(lm);
        }

        // if the start is at the top of the cell
        else if (startXY.y <= this.y) {

            //move to the top left corner
            let tl = this.pointsToTopLeftCorner(startXY);
            //move to the left middle
            //let lm = this.pointsToLeftMid(tl[tl.length - 1]);
            cordinates = tl;//.concat(lm);
        }
        return cordinates;
    }


    edgePointsToBottom(startXY) {
        let cordinates = [];
        // if the start is at the bottom of the cell
        if (startXY.y >= this.y + this.len) {
            //move to the bottom mid pos
            let tm = this.pointsToBottomMid(startXY);
            cordinates = tm;

        } // if the start is at the left of the cell
        else if (startXY.x <= this.x) {
            //move to the bottom left corner
            let bl = this.pointsToBottomLeftCorner(startXY);
            //move to the bottom mid pos
            //let bm = this.pointsToBottomMid(bl[bl.length - 1]);
            cordinates = bl;//.concat(bm);

        }

        // if the start is at the right of the cell
        else if (startXY.x >= this.x + this.len) {
            //move to the bottom right corner                
            let br = this.pointsToBottomRightCorner(startXY);
            //move to the bottom mid pos
            //let bm = this.pointsToBottomMid(br[br.length - 1]);
            cordinates = br;//.concat(bm);
        }

        // if the start is at the top of the cell
        else if (startXY.y <= this.y) {

            //move to the top left corner
            let tl = this.pointsToTopLeftCorner(startXY);
            //move to the bottom left corner
            let bl = this.pointsToBottomLeftCorner(tl[tl.length - 1]);

            //move to the bottom mid pos
            // let bm = this.pointsToBottomMid(bl[bl.length - 1]);
            cordinates = tl.concat(bl);//.concat(bm);
        }
        return cordinates;
    }



    edgePointsToTop(startXY) {
        let cordinates = [];
        // if the start is at the bottom of the cell
        if (startXY.y >= this.y + this.len) {
            //move to the bottom left corner                
            let bl = this.pointsToBottomLeftCorner(startXY);
            //move to the top left corner
            let tl = this.pointsToTopLeftCorner(bl[bl.length - 1]);
            //move to the top mid pos
            //let tm = this.pointsToTopMid(tl[tl.length - 1]);

            cordinates = bl.concat(tl);//.concat(tm);

        } // if the start is at the left of the cell
        else if (startXY.x <= this.x) {
            //move to the top left corner           
            let tl = this.pointsToTopLeftCorner(startXY);
            //move to the top mid pos         
            //let tm = this.pointsToTopMid(tl[tl.length - 1]);
            cordinates = tl;//.concat(tm);

        }

        // if the start is at the right of the cell
        else if (startXY.x >= this.x + this.len) {
            //move to the top right corner
            let tr = this.pointsToTopRightCorner(startXY);
            //move to the top mid pos
            //let tm = this.pointsToTopMid(tr[tr.length - 1]);
            cordinates = tl;//.concat(tm);
        }

        // if the start is at the top of the cell
        else if (startXY.y <= this.y) {
            //move to the top mid pos
            let tm = this.pointsToTopMid(tr[tr.length - 1]);
            cordinates = tm;
        }
        return cordinates;
    }
    pointsToBottomRightCorner(startXY) {
        let ex = this.x + this.len;
        let ey = this.y + this.len;
        let br = this.getStraightPathPoints(startXY, ex, ey);
        return br;
    }
    pointsToTopRightCorner(startXY) {
        let ex = this.x + this.len;
        let ey = this.y;
        let tr = this.getStraightPathPoints(startXY, ex, ey);
        return tr;
    }
    pointsToBottomLeftCorner(startXY) {
        let ex = this.x;
        let ey = this.y + this.len;
        let bl = this.getStraightPathPoints(startXY, ex, ey);
        return bl;
    }
    pointsToTopLeftCorner(startXY) {
        let ex = this.x;
        let ey = this.y;
        let tl = this.getStraightPathPoints(startXY, ex, ey);
        return tl;
    }
    pointsToBottomMid(startXY) {
        let ex = this.midX;
        let ey = this.y + this.len;
        let tm = this.getStraightPathPoints(startXY, ex, ey);
        return tm;
    }
    pointsToTopMid(startXY) {
        let ex = this.midX;
        let ey = this.y;
        let tm = this.getStraightPathPoints(startXY, ex, ey);
        return tm;
    }
    pointsToRightMid(startXY) {
        let ex = this.x + this.len;
        let ey = this.midY;
        let rm = this.getStraightPathPoints(startXY, ex, ey);
        return rm;
    }
    pointsToLeftMid(startXY, bl) {
        let ex = this.x;
        let ey = this.midY;
        let lm = this.getStraightPathPoints(startXY, ex, ey);
        return lm;
    }

    getStraightPathPoints(startXY, ex, ey) {
        let cordinates = [];
        let cX = startXY.x;
        let cY = startXY.y;
        cordinates.push({ x: cX, y: cY });
        //move to min X  with the same Y.
        const midX = ex;
        let dx = ex > startXY.x ? 1 : -1; // if the start is on the right multipy by -1 so that we reduce x
        let diffx = abs(startXY.x - midX);
        for (let index = 1; index <= diffx; index++) {
            cX += dx;
            cordinates.push({ x: cX, y: cY });
        }
        const midY = ey;
        let dy = ey > startXY.y ? 1 : -1;
        let diffy = abs(startXY.y - midY);
        for (let index = 1; index <= diffy; index++) {
            cY += dy;
            cordinates.push({ x: cX, y: cY });

        }
        return cordinates;
    }

}
