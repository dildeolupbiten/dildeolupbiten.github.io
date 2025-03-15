const chart = new Chart("canvas", {
    type: "scatter",
    data: {
        labels: [],
        datasets: [
            {
                label: "Case Group",
                data: [],
                borderColor: "red",
                fill: false,
                pointRadius: 0
            },
            {
                label: "Expected Group",
                data: [],
                borderColor: "green",
                fill: false,
                pointRadius: 0
            }
        ]
    },
    options: {
        scales: {
            xAxes: [{
                gridLines: {
                    display:false
                }
            }],
            yAxes: [{
                gridLines: {
                    display:false
                }
            }]
        }
    }
});

const n_expected = document.getElementById("N_expected");
const x_expected = document.getElementById("X_expected");
const p_expected = document.getElementById("p_expected");
const var_expected = document.getElementById("Var_expected");
const sd_expected = document.getElementById("SD_expected");

const z_score = document.getElementById("Z-Score");
const risk = document.getElementById("Cum. Risk");
const px_lower = document.getElementById("P(x <= k)");
const px = document.getElementById("P(x = k)");
const px_greater = document.getElementById("P(x >= k)");
const cohens_d = document.getElementById("Cohen's D");
const approx = document.getElementById("Return Period");
const sign_level = document.getElementById("Sig. Level");
const alpha = document.getElementById("Alpha");

function update_chart(type) {
    const x = parseInt(document.getElementById(`X_${type}`).value);
    const n = parseInt(document.getElementById(`N_${type}`).value);
    const n_case = parseInt(document.getElementById("N_case").value);
    if (isNaN(x) || isNaN(n)) return;
    const values = get_values(n, x, type === "control" ? n_case : 0);
    chart.data.labels = values.map((_, index) => index);
    const datasetIndex = type === "case" ? 0 : 1;
    if (type == "case") {
        n_expected.innerHTML = n_case;
    }
    if (type == "control") {
        x_expected.innerHTML = Math.round(x * n_case / n * 100) / 100;
    }
    var n_norm = parseInt(n_expected.innerHTML);
    var x_norm = parseInt(x_expected.innerHTML);
    if (!isNaN(n_norm) && !isNaN(x_norm)) {
        p_expected.innerHTML = Math.round(x_norm / n_norm * 100) / 100;
    }
    var p = x / n;
    var v = variance(n, p);
    var sd = stdev(n, p);
    document.getElementById(`p_${type}`).innerHTML = Math.round(p * 100) / 100;
    document.getElementById(`Var_${type}`).innerHTML = Math.round(v * 100) / 100;
    document.getElementById(`SD_${type}`).innerHTML = Math.round(sd * 100) / 100;
    for (var [key, value] of Object.entries(confidence_interval)) {
        document.getElementById(`${key}_${type}`).innerHTML = Math.round((x + value["val"] * sd) * 100) / 100;
    }
    var n1 = parseInt(document.getElementById("N_case").value);
    var n2 = parseInt(document.getElementById("N_control").value);
    var x1 = parseInt(document.getElementById("X_case").value);
    var x2 = parseInt(document.getElementById("X_control").value);
    var new_sd = parseFloat(document.getElementById("SD_control").innerHTML);
    if (!isNaN(n1) && !isNaN(n2) && !isNaN(sd)) {
        var norm_sd = new_sd * n1 / n2;
        sd_expected.innerHTML = Math.round(norm_sd * 100) / 100;
        var_expected.innerHTML = Math.round(Math.pow(norm_sd, 2) * 100) / 100;
        z_score.innerHTML = Math.round(zscore(n1, x1, x2 / n2, 0) * 100) / 100;
        risk.innerHTML = Math.round(100 * cdf(x1, x2 * n1 / n2, norm_sd) * 10000) / 10000 + " %";
        px_lower.innerHTML = Math.round(100 * pmf(n1, x1, x2 / n2) * 10000) / 10000 + " %";
        px.innerHTML = Math.round(100 * binom(n1, x1, x2 / n2) * 10000) / 10000 + " %";
        px_greater.innerHTML = Math.round(100 * (1 - pmf(n1, x1 - 1, x2 / n2)) * 10000) / 10000 + " %";
        cohens_d.innerHTML = Math.round(cohens_d_effect(x1, x2, n1, n2) * 100) / 100;
        approx.innerHTML = Math.round(approx_exp_freq(n1, x1, x2 / n2) * 10000) / 10000 + " (Years)";
        sign_level.innerHTML = has_significance(n1, x1, x2 / n2, parseFloat(alpha.value));
        var new_x = parseInt(x_expected.innerHTML);
        if (!isNaN(new_x)) {
            for (var [key, value] of Object.entries(confidence_interval)) {
                document.getElementById(`${key}_expected`).innerHTML = Math.round((new_x + value["val"] * norm_sd) * 100) / 100;
            }
        }
    }
    chart.data.datasets[datasetIndex].data = values;
    chart.update();
}

["case", "control"].forEach(type => {
    ["X", "N"].forEach(param => {
        document.getElementById(`${param}_${type}`).addEventListener(
            "input", () => { update_chart(type); }
        );
    });
});

document.getElementById(`Alpha`).addEventListener(
    "input", () => { update_chart("case"); }
);

const params = new URLSearchParams(window.location.search);
const _xcase = params.get('xcase');
const _ncase = params.get('ncase');
const _xcontrol = params.get('xcontrol');
const _ncontrol = params.get('ncontrol');
const _alpha = params.get('alpha');
if (_alpha) {
    alpha.value = _alpha;
} else {
    alpha.value = 0.001;
}

if (_xcase && _ncase && _xcontrol && _ncontrol) {
    document.getElementById("X_case").value = _xcase;
    document.getElementById("N_case").value = _ncase;
    document.getElementById("X_control").value = _xcontrol;
    document.getElementById("N_control").value = _ncontrol;

} else {
    document.getElementById("X_case").value = 65;
    document.getElementById("N_case").value = 100;
    document.getElementById("X_control").value = 50;
    document.getElementById("N_control").value = 100;
}
update_chart("case");
update_chart("control");

