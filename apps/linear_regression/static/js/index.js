const table_div = document.getElementById("table_div");
const encode_div = document.getElementById("encode_div");
const encode_button_div = document.getElementById("encode_button_div");
const xy_div = document.getElementById("xy_div");
const train_test = document.getElementById("train_test");
var test_button = null;
var export_button = null;

const chart = new Chart("canvas", {
    type: "line",
    data: {
        labels: [],
        datasets: []
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

function removeChild(div) {
    while (div.children.length) {
        div.removeChild(div.children[0]);
    }
    export_button = null;
    test_button = null;
}

function add_table(data, columns) {
    var table = new Table("table_div", columns);
    data.forEach((i) => {
        table.init_tr(i);
    });
    return table;
}

function get_col_values(data, col) {
    var result = [];
    for (var i = 0; i < data.length; i++) {
        result.push(data[i][col]);
    }
    return result;
}

function new_datasets(y_pred, y_test, cols, columns) {
    var datasets = [];
    var prompts = ["Pred: ", "Test: "];
    var data = [y_pred, y_test];
    var colors = ["red", "green", "blue", "yellow", "magenta", "orange", "cyan", "grey"];
    var c = 0;
    for (var col = 0; col < cols.length; col++) {
        for (var i = 0; i < 2; i++) {
            datasets.push({
                label: prompts[i] + columns[cols[col]],
                data: get_col_values(data[i], col),
                fill: false,
                borderColor: colors[c]
            });
            c++;
            c %= colors.length;
        }
    }
    return datasets;
}

function edit_data(y_pred, y_test, columns, cols) {
    var data = [];
    var sub = [];
    for (var col of cols) {
        sub.push(columns[col] + "_Pred");
        sub.push(columns[col] + "_Test");
    }
    data.push(sub);
    for (var i = 0; i < y_pred.length; i++) {
        sub = [];
        for (var j = 0; j < y_pred[0].length; j++) {
            sub.push(y_pred[i][j]);
            sub.push(y_test[i][j]);
        }
        data.push(sub);
    }
    return data;
}

function sum(y_pred, y_test) {
    var total = 0;
    for (var j = 0; j < y_pred[0].length; j++) {
        var s = 0;
        for (var i = 0; i < y_pred.length; i++) {
            if (y_pred[i][j] < y_test[i][j]) {
                s += y_pred[i][j] / y_test[i][j];
            } else {
                s += 1 - (y_pred[i][j] / y_test[i][j] - 1);
            }
        }
        total += s / y_pred.length;
    }
    return `${Math.round(total / y_pred[0].length * 100 * 100) / 100} %`;
}

function train_test_table(data, columns) {
    var xy = new Table("xy_div", ["Columns To Be Predicted"]);
    columns.forEach((i) => {
        xy.init_tr(["check_y_" + i]);
    });
    var train_test_table = new Table("train_test", ["Test Size", "Success"]);
    train_test_table.init_tr(["input", ""]);
    var train_test_div = document.createElement("div");
    train_test_div.className = "d-flex justify-content-center";
    var train_test_button = document.createElement("button");
    train_test_button.className = "btn btn-dark mx-2";
    train_test_button.innerHTML = "Train";
    train_test_button.style.minWidth = "100px";
    train_test_div.appendChild(train_test_button);
    train_test.appendChild(train_test_div);
    train_test_button.onclick = function (e) {
        var cols = []
        columns.forEach((col) => {
            if (document.getElementById("check_y_" + col).checked) {
                cols.push(columns.indexOf(col));
            }
        });
        var ratio = document.getElementById("input").value;
        if (cols.length > 0 && ratio > 0) {
            var splitted = test_train_split(data, cols, ratio/data.length);
            var [x_train, x_test, y_train, y_test] = splitted;
            var beta = linear_regression(x_train, y_train, 1);
            var y_pred = [];
            canvas.style.display = "none";
            if (test_button) {
                train_test_div.removeChild(test_button);
                test_button = null;
            }
            if (export_button) {
                train_test_div.removeChild(export_button);
                export_button = null;
            }
            test_button = document.createElement("button");
            test_button.innerHTML = "Test";
            test_button.className = "btn btn-dark mx-2";
            test_button.style.minWidth = "100px";
            test_button.onclick = function (ev) {
                y_pred = predict(x_test, beta, 1);
                canvas.style.display = "block";
                chart.data.labels = [...Array(y_pred.length).keys()];
                chart.data.datasets = new_datasets(y_pred, y_test, cols, columns);
                chart.update();
                train_test_table.table.children[1].children[1].innerHTML = sum(y_pred, y_test);
            }
            train_test_div.appendChild(test_button);
            export_button = document.createElement("button");
            export_button.innerHTML = "Export";
            export_button.className = "btn btn-dark mx-2";
            export_button.style.minWidth = "100px";
            export_button.onclick = function (ev) {
                downloadCSV(edit_data(y_pred, y_test, columns, cols));
                var modified_beta = [["Beta"], ...beta];
                downloadCSV(modified_beta, "beta.csv");
            }
            train_test_div.appendChild(export_button);
        } else {
            alert("Select at least one column");
            return;
        }
    }
}

document.getElementById("csv").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            canvas.style.display = "none";
            chart.data.labels = [];
            chart.data.datasets = [];
            chart.update();
            [table_div, encode_div, encode_button_div, xy_div, train_test].forEach((div) => { removeChild(div); });
            encode_div.style.display = "block";
            var [columns, data, to_be_encoded] = parse_csv(e.target.result);
            var table = add_table(data, columns);
            if (to_be_encoded.length) {
                var encode = new Table("encode_div", ["Columns To Be Encoded", "Label Encoder", "One Hot Encoder"]);
                to_be_encoded.forEach((i) => {
                    encode.init_tr([i, "check" + "_le_" + i, "check" + "_ohe_" + i]);
                });
                var encode_button = document.createElement("button");
                encode_button.className = "btn btn-dark";
                encode_button.innerHTML = "Encode";
                encode_button.addEventListener("click", (e) => {
                    var total = 0;
                    const save = data.map(i => (i));
                    to_be_encoded.forEach((i) => {
                        var le = document.getElementById("check_le_" + i);
                        var ohe = document.getElementById("check_ohe_" + i);
                        if (le.checked) {
                            label_encoder(data, columns.indexOf(i));
                            total++;
                        }
                        if (ohe.checked) {
                            columns = one_hot_encoder(data, columns.indexOf(i), columns);
                            total++;
                        }
                    });
                    if (total != to_be_encoded.length) {
                        data = save.map(i => (i));
                        alert("Check the columns that need to be encoded.");
                        return;
                    }
                    [table_div, encode_div, encode_button_div].forEach((div) => { removeChild(div); });
                    encode_div.style.display = "none";
                    encode_button_div.style.display = "none";
                    table = add_table(data, columns)
                    train_test_table(data, columns);
                });
                encode_button_div.appendChild(encode_button);
            } else {
                encode_div.style.display = "none";
                train_test_table(data, columns);
            }
        };
        reader.readAsText(file);
    }
});

canvas.style.display = "none";

