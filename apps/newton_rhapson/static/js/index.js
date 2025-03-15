const chart = new Chart("canvas", {
    type: "scatter",
    data: {
        labels: [],
        datasets: []
    },
    options: {
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                type: "linear",
                gridLines: {
                    color: "rgba(0, 0, 0, 0)",
                    zeroLineColor: "black",
                    zeroLineWidth: 1,
                },
                ticks: {
                    min: -2,
                    max: 2
                }
            }],
            yAxes: [{
                gridLines: {
                    color: "rgba(0, 0, 0, 0)",
                    zeroLineColor: "black",
                    zeroLineWidth: 1,
                },
                ticks: {
                    min: -2,
                    max: 2
                }
            }]
        }
    }
});

function isSafeExpression(expr) {
    return /^[0-9+\-*/().x\s]+$/.test(expr);
}

function update(e) {
    var error = false;
    for (var [k, v] of Object.entries(inputs)) {
        if (!v.value) {
            error = true;
        }
    }
    if (error) {
        return;
    }
    try {
        if (!isSafeExpression(inputs["f"].value)) {
            console.error("Error: Syntax Error!");
        } else {
            var f = new Function("x", `return ${inputs["f"].value};`);
        }
    } catch (error) {
        return;
    }
    var x = parseFloat(inputs["x"].value);
    var dx = parseFloat(inputs["dx"].value);
    var start = parseFloat(inputs["start"].value);
    var end = parseFloat(inputs["end"].value);
    var df = diff[inputs["df"].value];
    var xy = xy_pair(start, end, 100, f);
    var x_values = xy.map(i => (i.x));
    var y_values = xy.map(i => (i.y));
    var datasets = [create_dataset(xy, "blue", false)];
    var [xy_tangents, x_axis, y_axis] = xy_values(newton_rhapson(f, x, dx, df, 100));

    xy_table.clear_rows();
    for (var j = 0; j < xy_tangents.length; j++) {
        xy_table.init_row([x_axis[j][1].x, y_axis[j][1].y]);
        datasets.push(create_dataset(xy_tangents[j], "red", false));
        datasets.push(create_dataset(x_axis[j], "grey", true));
        datasets.push(create_dataset(y_axis[j], "grey", true));
    }
    chart.options.scales.xAxes[0].ticks.min = Math.min(...x_values);
    chart.options.scales.xAxes[0].ticks.max = Math.max(...x_values);
    chart.options.scales.yAxes[0].ticks.min = Math.min(...y_values);
    chart.options.scales.yAxes[0].ticks.max = Math.max(...y_values);
    chart.options.legend.display = false
    chart.data.datasets = datasets;
    chart.update();
}

var inputs = {
    "f": document.getElementById("f(x)"),
    "x": document.getElementById("x"),
    "dx": document.getElementById("dx"),
    "df": document.getElementById("df"),
    "start": document.getElementById("start"),
    "end": document.getElementById("end")
};

const diff = {
    "Backward": df_backward,
    "Central": df_central,
    "Forward": df_forward
};

Object.values(inputs).forEach((input) => {
    input.addEventListener("input", function(e) { update(e); });
});

inputs["f"].value = "x**2-x-1";
inputs["x"].value = 1;
inputs["dx"].value = 1e-15;
inputs["start"].value = -1;
inputs["end"].value = 2;

inputs["x"].step = .1;
inputs["start"].step = .1;
inputs["end"].step = .1;
inputs["dx"].step = 1e-15;

update(inputs["f"]);

function adjustCanvasHeight() {
    const canvas = document.getElementById("canvas");
    if (window.innerWidth <= 768) {
        canvas.style.minHeight = "200px";
    } else {
        canvas.style.minHeight = "auto";
    }
}

window.addEventListener("load", adjustCanvasHeight);
window.addEventListener("resize", adjustCanvasHeight);
