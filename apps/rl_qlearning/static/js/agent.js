class Agent {
    constructor() {
        this.table = {};
    }
    getKey(snake) {
        snake.setDistance();
        snake.setDirections();
        return [...snake.directions, ...snake.distance].join();
    }
    setKey(key) {
        if (!this.table[key]) {
            this.table[key] = Array(4).fill(0);
        }
    }
};