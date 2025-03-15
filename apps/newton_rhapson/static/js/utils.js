#!/usr/bin/node

function df_backward(f, x, dx, nth) {
    return (nth > 0) ? (df_backward(f, x + dx, dx, nth - 1) - df_backward(f, x, dx, nth - 1)) / dx : f(x);
}

function df_central(f, x, dx, nth) {
    return (nth > 0) ? (df_central(f, x + dx, dx, nth - 1) - df_central(f, x - dx, dx, nth - 1)) / (2 * dx) : f(x);
}

function df_forward(f, x, dx, nth) {
    return (nth > 0) ? (df_forward(f, x, dx, nth - 1) - df_forward(f, x - dx, dx, nth - 1)) / dx : f(x);
}

function slope(x1, y1, x2, y2) {
    if (x1 == x2) {
        return (x) => { return y1; };
    }
    const m = (y2 - y1) / (x2 - x1);
    return (x) => { return m * (x - x1) + y1; };
}

function newton_rhapson(f, x, dx, df, max_iter) {
    var values = [];
    for (var i = 0; i < max_iter; i++) {
        var x1 = x;
        var y1 = f(x);
        x = x - y1 / df(f, x, dx, 1);
        var x2 = x;
        var y2 = f(x);
        if (Math.abs(y2) < dx) {
            break;
        }
        values.push([x1, y1, x2, 0, slope(x1, y1, x2, 0)]);
    }
    return values;
}

function xy_pair(start, end, num, f) {
    var pair = [];
    var step = (end - start) / (num - 1);
    for (var i = 0; i < num; i++) {
        pair.push({"x": start, "y": f(start)})
        start += step;
    }
    return pair;
}

function xy_values(values) {
    var xy_tangents = [];
    var x_axis = [];
    var y_axis = [];
    var num = values.length;
    for (var [x1, y1, x2, y2, func] of values) {
        xy_tangents.push(xy_pair(x1, x2, 100, func));
        x_axis.push([{"x": 0, "y": y1}, {"x": x1, "y": y1}]);
        y_axis.push([{"x": x1, "y": 0}, {"x": x1, "y": y1}]);
    }
    return [xy_tangents, x_axis, y_axis];
}

function create_dataset(data, color, dashed) {
    var dataset = {
        data: data,
        borderColor: color,
        borderWidth: 2,
        fill: false,
        pointRadius: 0
    };
    if (dashed) {
        dataset["borderDash"] = [5, 5];
    }
    return dataset;
}
