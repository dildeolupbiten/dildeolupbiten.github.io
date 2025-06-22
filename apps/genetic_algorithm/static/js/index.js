const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const population_size = document.getElementById("Population Size");
const gene_length = document.getElementById("Gene Length");
const mutation_rate = document.getElementById("Mutation Rate");
const n_generations = document.getElementById("N Generations");
const fulness = document.getElementById("Fulness");
const width = document.getElementById("Width");
const height = document.getElementById("Height");
const pixel = document.getElementById("Pixel");

population_size.value = 1000;
gene_length.value = 200;
mutation_rate.value = .01;
n_generations.value = 1000;
fulness.value = .5;
width.value = 10;
height.value = 10;
pixel.value = PX;

canvas.width = width.value * PX;
canvas.height = height.value * PX;

mutation_rate.step = .01;
fulness.step = .1;

pixel.addEventListener("input", (e) => {
    PX = parseInt(pixel.value);
    canvas.height = parseInt(height.value) * PX;
    canvas.width = parseInt(width.value) * PX;
});

width.addEventListener("input", (e) => {
    canvas.width = parseInt(width.value) * PX;
});

height.addEventListener("input", (e) => {
    canvas.height = parseInt(height.value) * PX;
});

const btn_train = document.getElementById("btn_train");
const btn_play = document.getElementById("btn_play");
const btn_reset = document.getElementById("btn_reset");
const pbar = document.getElementById("pbar");
const gen = document.getElementById("gen");
const gen_label = document.getElementById("gen label");
const container = document.getElementById("container");

ctx.gen = gen;

container.style.visibility = "hidden";

function cmdTrain(e) {
    container.style.visibility = "visible";
    gen_label.innerHTML = "Generation";
    const grid = new Grid(
        parseInt(width.value), 
        parseInt(height.value), 
        parseFloat(fulness.value)
    );
    geneticAlgorithm(
        grid,
        parseInt(population_size.value),
        parseInt(n_generations.value),
        parseInt(gene_length.value),
        parseFloat(mutation_rate.value),
        ctx,
        pbar
    );
}

function cmdPlay(e) {
    container.style.visibility = "visible";
    gen_label.innerHTML = "Generation";
    animate(ctx);
}

function cmdReset(e) {
    loop = false;
}

btn_train.addEventListener("click", cmdTrain);
btn_play.addEventListener("click", cmdPlay);
btn_reset.addEventListener("click", cmdReset);
