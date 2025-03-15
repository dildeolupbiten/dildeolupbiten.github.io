const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const learning_rate = document.getElementById("Learning Rate");
const discount_factor = document.getElementById("Discount Factor");
const epsilon = document.getElementById("Epsilon");
const episodes = document.getElementById("Episodes");
const width = document.getElementById("Width");
const height = document.getElementById("Height");
const pixel = document.getElementById("Pixel");

learning_rate.value = .1;
discount_factor.value = .9;
epsilon.value = .01;
episodes.value = 1000;
width.value = 10;
height.value = 10;
pixel.value = PX;

canvas.width = width.value * PX;
canvas.height = height.value * PX;

learning_rate.step = .01;
discount_factor.step = .01;
epsilon.step = .01;

var agent = new Agent();
var snake = new Snake(parseFloat(width.value), parseFloat(height.value));
snake.loop = false;


pixel.addEventListener("input", (e) => {
    if (snake.loop) {
        return;
    }
    PX = parseInt(pixel.value);
    canvas.height = parseInt(height.value) * PX;
    canvas.width = parseInt(width.value) * PX;
});

width.addEventListener("input", (e) => {
    if (snake.loop) {
        return;
    }
    canvas.width = parseInt(width.value) * PX;
});

height.addEventListener("input", (e) => {
    if (snake.loop) {
        return;
    }
    canvas.height = parseInt(height.value) * PX;
});

const btn_train = document.getElementById("btn_train");
const btn_play = document.getElementById("btn_play");
const btn_reset = document.getElementById("btn_reset");
const pbar = document.getElementById("pbar");
const avg_size = document.getElementById("avg. size");
const avg_size_label = document.getElementById("avg. size label");
const container = document.getElementById("container");

pbar.avg_size = avg_size;
ctx.avg_size = avg_size;

container.style.visibility = "hidden";

function cmdTrain(e) {
    if (snake.loop) {
        return;
    }
    snake.loop = true;
    container.style.visibility = "visible";
    avg_size_label.innerHTML = "Avg. Size";
    trainSnake(
        agent,
        snake,
        parseFloat(learning_rate.value),
        parseFloat(discount_factor.value),
        parseFloat(epsilon.value),
        parseFloat(episodes.value),
        pbar,
        ctx,
        0
    );
}

function cmdPlay(e) {
    if (snake.loop) {
        return;
    }
    snake.loop = true;
    container.style.visibility = "visible";
    avg_size_label.innerHTML = "Size";
    playSnake(
        agent,
        snake,
        parseFloat(learning_rate.value),
        parseFloat(discount_factor.value),
        parseFloat(epsilon.value),
        ctx,
        1
    );
}

function cmdReset(e) {
    snake.loop = false;
    snake.done = true;
}

btn_train.addEventListener("click", cmdTrain);
btn_play.addEventListener("click", cmdPlay);
btn_reset.addEventListener("click", cmdReset);