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
        let cordinates = [];
        //we have to move though edges
        // if (this.occupied) {
        //     moveType = "edges"
        // }
        switch (moveType) {
            case "midstraight": {

                cordinates = this.getMidStraightPoints(startXY, destinationCell);


                break;
            }
            case "edges": {

                break;
            }
            case "diagonal": {

                break;
            }

            default:
                break;
        }
        //check the direction we have to move

        return cordinates;
    }
    getMidStraightPoints(startXY, destinationCell) {
        let cordinates = [];

        //dcell on top or dcell on bottom
        if (destinationCell.y < this.y || destinationCell.y > this.y) {
            let ex = this.midX // if its top or bottom x would the same mid pos
            let ey = destinationCell.y < this.y ? this.y : this.y + this.len// if its the top y would be the same as this.y other wise it would be the bottom line of this cell

            //move to top mid posistion
            let cX = startXY.x;
            let cY = startXY.y;
            cordinates.push({ x: cX, y: cY });
            //move to min X  with the same Y.
            const midX = ex;
            let dx = ex > startXY.x ? 1 : -1;// if the start is on the right multipy by -1 so that we reduce x
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
            //cordinates.push({ x: ex, y: ey });

        }
        //dcell on left destinationCell.y == this.y or  on right destinationCell.y == this.y
        else if (destinationCell.x < this.x || destinationCell.x > this.x) {
            let ex = destinationCell.x < this.x ? this.x : this.x + this.len // if its the left y would be the same as this.x other wise it would be the right line of this cell
            let ey = this.midY // if its the top y would be the same as this.y other wise it would be the bottom line of this cell

            //move to top mid posistion
            let cX = startXY.x;
            let cY = startXY.y;
            cordinates.push({ x: cX, y: cY });
            //move to min X  with the same Y.
            const midX = ex;
            let dx = ex > startXY.x ? 1 : -1;// if the start is on the right multipy by -1 so that we reduce x
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
            // 
        }
        cordinates.push({ x: destinationCell.midX, y: destinationCell.midY });

        return cordinates;
    }

}
