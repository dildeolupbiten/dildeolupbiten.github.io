function combination(n, k) {
    return k ? n / k * combination(n - 1, k - 1) : 1;
}

function binom(n, k, p) {
    return combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

function binom_values(n, k) {
    var p = k / n;
    return [...Array(n + 1).keys()].map(i => binom(n, i, p));
}

function pmf(n, k, p) {
    return [...Array(k + 1).keys()].map(i => binom(n, i, p)).reduce((i, j) => (i + j))
}

function pdf(k, mu, sd) {
    var a = Math.exp(-.5 * Math.pow((k - mu) / sd, 2));
    var b = (sd * Math.sqrt(2 * Math.PI));
    return a / b;
}

function integral(f, a, b, n) {
    if (n % 2 == 1) {
        n += 1;
    }
    var h = (b - a) / n;
    var s = f(a) + f(b);
    for (var i = 1; i < n; i += 2) {
        s += 4 * f(a + i * h);
    }
    for (var i = 2; i < n - 1; i += 2) {
        s += 2 * f(a + i * h);
    }
    return (h / 3) * s;
}

function erf(x) {
    return (2 / Math.sqrt(Math.PI)) * integral((t) => Math.exp(-t * t), 0, x, 10000);
}

function cdf(k, mu, sd) {
    return .5 * (1 + erf((k - mu) / (sd * Math.sqrt(2))));
}

function linspace(start, stop, num) {
    var step = (stop - start) / (num - 1);
    var values = [...Array(num)]
    for (var i = 0; i < num; i++) {
        values[i] = start;
        start += step;
    }
    return values;
}

function pdf_values(x, mu, sd) {
    return x.map(val => pdf(val, mu, sd));
}

function variance(n, p) {
    return n * p * (1 - p);
}

function stdev(n, p) {
    return Math.sqrt(variance(n, p));
}

function zscore(n, k, p, use_p) {
    var sd = stdev(n, use_p ? p : k / n);
    return sd ? ((k - n * p) / sd) : 0;
}

function approx_exp_freq(n, k, p) {
    if (k < 50) {
        k = n - k;
    }
    return 1 / (1 - erf(zscore(n, k, p, 1) / (Math.sqrt(2)))) / 365.2524;
}

function has_significance(n, k, p, alpha) {
    return Math.abs(erf(zscore(n, k, p) / Math.sqrt(2))) > (1 - alpha);
}

function cohens_d_effect(x1, x2, n1, n2) {
    var v1 = variance(n1, x1 / n1);
    var x = x2 * n1 / n2;
    var v2 = Math.pow(n1 / n2 * Math.sqrt(variance(n2, x2 / n2)), 2)
    var div = Math.sqrt((v1 + v2) / 2);
    return isNaN(div) ? 0 : (x1 - x) / div;
}

function get_values(n, x, n_case) {
    var p = x / n;
    if (n_case && x >= 20) {
        var new_x = x * n_case / n;
        var sd = stdev(n, p) * n_case / n;
        var x_values = linspace(new_x - 3 * sd, new_x + 3 * sd, 100);
        var y_values = pdf_values(x_values, new_x, sd);
    } else {
        var x_values = [...Array(n).keys()];
        var y_values = binom_values(n, x, p);
    }
    return x_values.map((item, index) => ({ x: item, y: y_values[index] }));
}
