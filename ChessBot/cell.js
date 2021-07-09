class Cell {
    constructor(x, y, len, color) {
        this.x = x;
        this.y = y;
        this.len = len;
        this.color = color;

    }
    midpoint() {

        return { x: this.x + (this.len / 2), y: this.y + (this.len / 2) };
    }
    show() {
        push();
        fill(this.color);
        rect(this.x, this.y, this.len, this.len);

        if (this.occupied) {
            fill('red');
            let midp = this.midpoint();
            circle(midp.x, midp.y, 30);
        }
        if (this.inPath) {
            fill(this.textColor);
            let midp = this.midpoint();
            text(this.order, midp.x, midp.y);
        }
        pop();
    }

    update() {


    }

}
