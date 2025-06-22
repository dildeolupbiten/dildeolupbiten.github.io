class Grid {
    constructor(width, height, fulness) {
        this.width = width;
        this.height = height;
        this.fulness = fulness;
        this.start = {"x": 0, "y": 0};
        this.end = {"x": height - 1, "y": width - 1};
        this.grid = Array(width * height).fill(0);
        this.setObstacles();
        this.setPath();
    }
    setPath() {
        let x = this.start.x;
        let y = this.start.y;
        while (x !== this.end.x || y !== this.end.y) {
            this.grid[x * this.width + y] = 0;
            if (x < this.end.x && (Math.random() < 0.5 || y === this.end.y)) {
                x++;
            } else if (y < this.end.y) {
                y++;
            }
        }
        this.grid[this.end.x * this.width + this.end.y] = 0;
    }

    setObstacles() {
        var d = this.fulness * 100;
        let path = new Set();
        let x = this.start.x;
        let y = this.start.y;
        while (x !== this.end.x || y !== this.end.y) {
            path.add(x + "," + y);
            if (x < this.end.x && (Math.random() < 0.5 || y === this.end.y)) {
                x++;
            } else if (y < this.end.y) {
                y++;
            }
        }
        path.add(this.end.x + "," + this.end.y);
        while (d) {
            const row = Math.floor(this.height * Math.random());
            const col = Math.floor(this.width * Math.random());
            if (!path.has(row + "," + col) && this.grid[row * this.width + col] === 0) {
                this.grid[row * this.width + col] = 1;
                d--;
            }
        }
    }
    
}

