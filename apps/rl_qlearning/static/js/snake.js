class Snake {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.reset();
    }
    reset() {
        this.grid = Array(this.width * this.height).fill(0);
        this.done = 0;
        this.action = null;
        this.key = null;
        this.directions = Array(4).fill(0);
        var x = Math.floor(this.height * Math.random());
        var y = Math.floor(this.width * Math.random());
        this.body = [{"x": x, "y": y}];
        this.grid[this.body[0].x * this.width + this.body[0].y] = 1;
        this.target = {};
        this.distance = [];
        this.setTarget();
    }
    setTarget() {
        var x = Math.floor(this.height * Math.random());
        var y = Math.floor(this.width * Math.random());
        while (this.grid[x * this.width + y]) {
            x = Math.floor(this.height * Math.random());
            y = Math.floor(this.width * Math.random());
        }
        this.target = {"x": x, "y": y};
    }
    setDistance() {
        this.distance = [
            (this.body[0].x > this.target.x) - (this.body[0].x < this.target.x),
            (this.body[0].y > this.target.y) - (this.body[0].y < this.target.y)
        ];
    }
    setDirections() {
        for (var i = 0; i < 4; i++) {
            var x = this.body[0].x + ACTIONS[i].x;
            var y = this.body[0].y + ACTIONS[i].y;
            if (this.isCollision(x, y)) {
                this.directions[i] = -2;
            }
            else if (!this.isSafeAction(x, y)) {
                this.directions[i] = -1;
            }
            else if (x == this.target.x && y == this.target.y) {
                this.directions[i] = 2;
            }
            else {
                this.directions[i] = 0;
            }
        }
    }
    floodFill(x, y, i, visited) {
        if (this.isCollision(x, y) || visited[x * this.width + y]) {
            return 0;
        }
        visited[x * this.width + y] = 1;
        var size = 1;
        for (var action of ACTIONS) {
            var has_tail = false;
            if (i > 1) {
                has_tail = true;
                this.grid[this.body[i].x * this.width + this.body[i].y] = 0;
            }
            size += this.floodFill(x + action.x, y + action.y, i - 1, visited);
            if (has_tail) {
                this.grid[this.body[i].x * this.width + this.body[i].y] = 1;
            }
        }
        return size;
    }
    isSafeAction(x, y) {
        var visited = Array(this.width * this.height).fill(0);
        var size = this.body.length;
        return this.floodFill(x, y, size - 1, visited) > size;
    }
    isOutOfBounds(x, y) {
        return 0 > x || x >= this.height || 0 > y || y >= this.width;
    }
    isCollision(x, y) {
        if (this.isOutOfBounds(x, y)) {
            return 1;
        }
        return this.grid[this.width * x + y];
    }
    increaseBody() {
        var size = this.body.length;
        if (size >= this.width * this.height) {
            this.done = 1;
            return;
        }
        var x = this.body[0].x + ACTIONS[this.action].x;
        var y = this.body[0].y + ACTIONS[this.action].y;
        this.body = [{"x": x, "y": y}, ...this.body];
        this.grid[this.width * x + y] = 1;
    }
    decreaseBody() {
        var tail = this.body.pop();
        this.grid[tail.x * this.width + tail.y] = 0;
    }
    printGrid(ctx) {
        ctx.clearRect(0, 0, 1000, 1000);
        for (var row = 0; row < this.height; row++) {
            for (var col = 0; col < this.width; col++) {
                if (this.grid[row * this.width + col]) {
                    ctx.fillStyle = "red";
                } else if (row == this.target.x && col == this.target.y) {
                    ctx.fillStyle = "blue";
                } else {
                    ctx.fillStyle = "black";
                }
                ctx.fillRect(row * PX, col * PX, PX, PX);

            }
        }
    }
}