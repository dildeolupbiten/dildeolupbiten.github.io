var solution = null;
var loop = false;

function animate(ctx, callback) {
    if (!solution || loop) {
        return;
    }
    loop = true;
    let i = 0;
    function drawStep() {
        const path = solution.pos.slice(0, i + 1);
        solution.printGrid(ctx, path);
        i++;
        if (i < solution.pos.length) {
            setTimeout(drawStep, 100);
        } else {
            loop = false;
        }
    }
    drawStep();
}

function geneticAlgorithm(
    grid,
    population_size,
    n_generations,
    gene_length,
    mutation_rate,
    ctx,
    pbar
) {
    if (loop) {
        return;
    }
    loop = true;
    var generation = 0;
    var population = [
        ...Array(population_size).keys()
    ].map(i => (new Maze(grid, gene_length, mutation_rate)));
    function nextGeneration() {
        if (!loop) {
            return;
        }
        if (generation >= n_generations) {
            alert("Maze not resolvable!");
            loop = false;
            return;
        }
        for (var maze of population) {
            maze.evaluate();
        }
        ctx.gen.innerHTML = generation;
        pbar.setAttribute("aria-valuenow", generation + 1);
        pbar.style.width = `${(generation + 1) / n_generations * 100}%`;
        pbar.innerHTML = `${(generation + 1) / n_generations * 100}%`;
        population.sort((a, b) => b.fitness - a.fitness);
        const best = population[0];
        if (best.setDistance() === 0) {
            console.log("Solution found at generation:", generation);
            solution = best;
            pbar.setAttribute("aria-valuenow", 100);
            pbar.style.width = "100%";
            pbar.innerHTML = "100%";
            loop = false;
            return;
        }
        const next_generation = population.slice(0, 10);
        while (next_generation.length < population_size) {
            const parent1 = population[Math.floor(50 * Math.random())];
            const parent2 = population[Math.floor(50 * Math.random())];
            const child = parent1.crossover(parent2);
            child.mutate();
            next_generation.push(child);
        }
        population = next_generation;
        generation++;
        setTimeout(nextGeneration, 0);
    }
    nextGeneration();
}
 
