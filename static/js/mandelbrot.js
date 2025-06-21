const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 300;
canvas.height = 300;

class Complex {
    constructor(re, im) {
        this.re = re;
        this.im = im;
    }
    sum(c) {
        return new Complex(this.re + c.re, this.im + c.im);
    }
    mul(c) {
        return new Complex(
            this.re * c.re - this.im * c.im,
            this.re * c.im + this.im * c.re
        );
    }
    abs() {
        return Math.sqrt(this.re * this.re + this.im * this.im);
    }
    pow(n) {
        const r = this.abs();
        const theta = Math.atan2(this.im, this.re);
        const r_n = Math.pow(r, n);
        const theta_n = theta * n;
        const new_re = r_n * Math.cos(theta_n);
        const new_im = r_n * Math.sin(theta_n);
        return new Complex(new_re, new_im);
    }
}

function mandelbrot(c, iterations, power) {
    var z = new Complex(0, 0);
    for (var i = 0; i < iterations; i++) {
        z = z.pow(power).sum(c);
        if (z.abs() > 2) {
            return i;
        }
    }
    return iterations;
}

var is_dragging = false;
var start_x, start_y;
var offset_x = 0, offset_y = 0;

canvas.addEventListener("mousedown", (e) => {
    is_dragging = true;
    start_x = e.offsetX;
    start_y = e.offsetY;
});

canvas.addEventListener("mousemove", (e) => {
    if (!is_dragging) {
        return;
    }
    const dx = e.offsetX - start_x;
    const dy = e.offsetY - start_y;
    offset_x -= dx;
    offset_y -= dy;
    start_x = e.offsetX;
    start_y = e.offsetY;
    updateMandelbrot();
});

canvas.addEventListener("mouseup", () => {
    is_dragging = false;
});

canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const mouse_x = e.clientX - rect.left;
    const mouse_y = e.clientY - rect.top;
    const zoom_factor = e.deltaY < 0 ? 1.1 : 0.9;
    const old_zoom = parseFloat(zoom.value);
    const new_zoom = Math.max(1, old_zoom * zoom_factor);
    const center_x = -0.75 + offset_x / canvas.width * (2.5 / old_zoom);
    const center_y = 0 + offset_y / canvas.height * (2.5 / old_zoom);
    const width = 2.5 / old_zoom;
    const x_min = center_x - width / 2;
    const y_min = center_y - width / 2;
    const click_re = x_min + (mouse_x / canvas.width) * width;
    const click_im = y_min + (mouse_y / canvas.height) * width;
    const new_width = 2.5 / new_zoom;
    const new_x_min = click_re - (mouse_x / canvas.width) * new_width;
    const new_y_min = click_im - (mouse_y / canvas.height) * new_width;
    offset_x = ((new_x_min + new_width / 2) - (-0.75)) * (canvas.width / (2.5 / new_zoom));
    offset_y = ((new_y_min + new_width / 2) - (0)) * (canvas.height / (2.5 / new_zoom));
    zoom.value = new_zoom.toFixed(4);
    updateMandelbrot();
}, { passive: false });

canvas.addEventListener("touchstart", (e) => {
    is_dragging = true;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    start_x = touch.clientX - rect.left;
    start_y = touch.clientY - rect.top;
});

canvas.addEventListener("touchmove", (e) => {
    if (!is_dragging) {
        return;
    }
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const dx = (touch.clientX - rect.left) - start_x;
    const dy = (touch.clientY - rect.top) - start_y;
    offset_x -= dx;
    offset_y -= dy;
    start_x = touch.clientX - rect.left;
    start_y = touch.clientY - rect.top;
    updateMandelbrot();
});

canvas.addEventListener("touchend", () => {
    is_dragging = false;
});

function complexArray(res, iter, pw, zoom_level = 1) {
    const center_x = -0.75 + offset_x / canvas.width * (2.5 / zoom_level);
    const center_y = 0 + offset_y / canvas.height * (2.5 / zoom_level);
    const width = 2.5 / zoom_level + (pw - 2) * 0.4;
    const x_min = center_x - width / 2;
    const x_max = center_x + width / 2;
    const y_min = center_y - width / 2;
    const y_max = center_y + width / 2;
    const new_res = Math.floor(res * zoom_level);
    const res_x = (x_max - x_min) * new_res;
    const res_y = (y_max - y_min) * new_res;
    const x_step = (x_max - x_min) / (res_x - 1);
    const y_step = (y_max - y_min) / (res_y - 1);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < res_y; i++) {
        for (var j = 0; j < res_x; j++) {
            const c = new Complex(x_min + x_step * j, y_min + y_step * i);
            if (c.re < x_min || c.re > x_max || c.im < y_min || c.im > y_max) {
                continue;
            }
            const m_iter = mandelbrot(c, iter, pw);
            const hue = Math.round(360 * (m_iter / iter));
            const lightness = m_iter === iter ? 0 : 50;
            ctx.fillStyle = `hsl(${hue}, 100%, ${lightness}%)`;
            const screenX = Math.floor((c.re - x_min) / (x_max - x_min) * canvas.width);
            const screenY = Math.floor((c.im - y_min) / (y_max - y_min) * canvas.height);
            ctx.fillRect(screenX, screenY, 1, 1);
        }
    }
}

const resolution = document.getElementById("Resolution");
const iters = document.getElementById("Iteration");
const pwr = document.getElementById("Power");
const zoom = document.getElementById("Zoom");

resolution.value = 125;
iters.value = 100;
pwr.value = 2;
zoom.value = 1;
zoom.min = 1;

zoom.step = .1;
pwr.step = .1;

function updateMandelbrot() {
    var res = parseInt(resolution.value);
    var it = parseInt(iters.value);
    var pw = parseFloat(pwr.value);
    var zoom_level = parseFloat(zoom.value);
    complexArray(res, it, pw, zoom_level);
}

[resolution, iters, pwr, zoom].forEach((input) => {
    input.addEventListener("input", (e) => { updateMandelbrot(); });
});

updateMandelbrot();

function resetPan() {
    resolution.value = 150;
    iters.value = 100;
    pwr.value = 2;
    zoom.value = 1;
    offset_x = 0, offset_y = 0;
    updateMandelbrot();
}

document.getElementById("reset").addEventListener("click", resetPan);
