class Maze {
    constructor(grid, gene_length, mutation_rate) {
        this.grid = grid;
        this.done = 0;
        this.gene_length = gene_length;
        this.mutation_rate = mutation_rate;
        this.gene = [...Array(gene_length).keys()].map((i) => (Math.floor(4 * Math.random())));
        this.pos = [{"x": this.grid.start.x, "y": this.grid.start.y}];
        this.fitness = null;
    }
    move(action) {
        const d = ACTIONS[action];
        const last = this.pos.length - 1;
        return {"x": this.pos[last].x + d.x, "y": this.pos[last].y + d.y};
    }
    setDistance() {
        const last = this.pos.length - 1;
        const x = (this.pos[last].x - this.grid.end.x) ** 2;
        const y = (this.pos[last].y - this.grid.end.y) ** 2;
        return (x + y) ** .5;
    }
    step(action) {
        if (!this.done) {
            this.pos.push(this.move(action));
            const last = this.pos.length - 1;
            if (this.isCollision()) {
                this.done = 1;
            }
        }
    }
    evaluate() {
        for (var action of this.gene) {
            this.step(action);
            const last = this.pos.length - 1;
            if (this.pos[last].x == this.grid.end.x && this.pos[last].y == this.grid.end.y) {
                break;
            }
        }
        this.fitness = -this.setDistance();
        const last = this.pos.length - 1;
        if (this.pos[last].x == this.grid.end.x && this.pos[last].y == this.grid.end.y) {
            this.fitness += 100;
        }
    }
    crossover(other) {
        var point = 1 + Math.floor((this.gene_length - 1) * Math.random());
        var child = new Maze(this.grid, this.gene_length, this.mutation_rate);
        child.gene = [...this.gene.slice(0, point), ...other.gene.slice(point, other.gene.length)];
        return child;
    }
    mutate() {
        this.gene = this.gene.map(bit => (Math.random() > this.mutation_rate ? bit : Math.floor(4 * Math.random())));
    }
    isOutOfBounds() {
        const last = this.pos.length - 1;
        return 0 > this.pos[last].x || this.pos[last].x >= this.grid.height || 0 > this.pos[last].y || this.pos[last].y >= this.grid.width;
    }
    isCollision() {
        const last = this.pos.length - 1;
        return this.isOutOfBounds() || this.grid.grid[this.pos[last].x * this.grid.width + this.pos[last].y] == 1;
    }
    printGrid(ctx, path) {
        ctx.clearRect(0, 0, 1000, 1000);
        const last = path.length - 1;
        for (var row = 0; row < this.grid.height; row++) {
            for (var col = 0; col < this.grid.width; col++) {
                let color = "black";
                if (row == this.grid.end.x && col == this.grid.end.y) {
                    color = "blue";
                } else if (this.grid.grid[row * this.grid.width + col]) { 
                    color = "grey";
                }
               for (var p of path) {
                    if (row == p.x && col == p.y) {
                        color = "red";
                        break;
                    }
                }
                ctx.fillStyle = color;
                ctx.fillRect(col * PX, row * PX, PX, PX);
            }
        }
    }

}
