function transpose(mat) {
    var transposed = [...Array(mat[0].length).keys()].map(
        e => ([...Array(mat.length).keys()].fill(0))
    );
    for (var i = 0; i < mat.length; i++) {
        for (var j = 0; j < mat[0].length; j++) {
            transposed[j][i] = mat[i][j];
        }
    }
    return transposed;
}

function matmul(mat1, mat2) {
    var result = [];
    for (var i = 0; i < mat1.length; i++) {
        result.push(new Array(mat2[0].length).fill(0));
        for (var j = 0; j < mat2[0].length; j++) {
            for (var k = 0; k < mat2.length; k++) {
                result[i][j] += mat1[i][k] * mat2[k][j];
            }
        }
    }
    return result;
}

function gauss_jordan_elimination(mat) {
    for (var i = 0; i < mat.length; i++) {
        var pivot = -1;
        for (var j = i; j < mat.length; j++) {
            if (mat[j][i]) {
                pivot = j;
                break;
            }
        }
        if (pivot == -1) {
            return 0;
        }
        if (pivot != i) {
            [mat[i], mat[pivot]] = [mat[pivot], mat[i]];
        }
        var temp = mat[i][i];
        for (var j = 0; j < 2 * mat.length; j++) {
            mat[i][j] /= temp;
        }
        for (var j = 0; j < mat.length; j++) {
            temp = mat[j][i];
            if (i != j) {
                for (var k = 0; k < 2 * mat.length; k++) {
                    mat[j][k] -= temp * mat[i][k];
                }
            }
        }
    }
    return 1;
}

function augment(mat) {
    var augmented = [];
    for (var i = 0; i < mat.length; i++) {
        augmented.push(new Array(2 * mat[0].length).fill(0));
        for (var j = 0; j < 2 * mat[0].length; j++) {
            if (j < mat[0].length) {
                augmented[i][j] = mat[i][j];
            } else {
                augmented[i][j] = i == (j - mat[0].length) ? 1 : 0
            }
        }
    }
    return augmented;
}

function inverse(mat) {
    var augmented = augment(mat);
    if (!gauss_jordan_elimination(augmented)) {
        return [];
    }
    var inversed = [];
    for (var i = 0; i < mat.length; i++) {
        inversed.push(new Array(mat[0].length).fill(0));
        for (var j = 0; j < mat[0].length; j++) {
            inversed[i][j] = augmented[i][mat[0].length + j];
        }
    }
    return inversed;
}

function add_bias_term(mat) {
    var added = [];
    for (var i = 0; i < mat.length; i++) {
        added.push(new Array(mat[0].length + 1).fill(0));
        added[i][0] = 1;
        for (var j = 0; j < mat[0].length; j++) {
            added[i][j + 1] = mat[i][j];
        }
    }
    return added;
}

function linear_regression(X, y, bias_term) {
    var Xt = [];
    var XtX = [];
    if (bias_term) {
        var Xbt = add_bias_term(X);
        Xt = transpose(Xbt);
        XtX = matmul(Xt, Xbt);
    } else {
        Xt = transpose(X);
        XtX = matmul(Xt, X);
    }
    var XtY = matmul(Xt, y);
    var XtX_inv = inverse(XtX);
    if (!XtX_inv) { return []; }
    return matmul(XtX_inv, XtY)
}

function predict(X, beta, bias_term) {
    if (bias_term) {
        return matmul(add_bias_term(X), beta);
    } else {
        return matmul(X, beta);
    }
}

function test_train_split(data, y_cols, ratio) {
    const test_size = parseInt(data.length * ratio);
    const train_size = data.length - test_size - 1;
    var x_train = [];
    var x_test = [];
    var y_train = [];
    var y_test = [];
    for (var i = 0; i < data.length; i++) {
        var sub_x_train = [];
        var sub_y_train = [];
        var sub_x_test = [];
        var sub_y_test = [];
        for (var j = 0; j < data[0].length; j++) {
            if (i < train_size) {
                if (!y_cols.includes(j)) {
                    sub_x_train.push(data[i][j]);
                } else {
                    sub_y_train.push(data[i][j]);
                }
            } else {
               if (!y_cols.includes(j)) {
                    sub_x_test.push(data[i][j]);
                } else {
                    sub_y_test.push(data[i][j]);
                }
            }
        }
        if (sub_x_train.length) {
            x_train.push(sub_x_train);
        }
        if (sub_y_train.length) {
            y_train.push(sub_y_train);
        }
        if (sub_x_test.length) {
            x_test.push(sub_x_test);
        }
        if (sub_y_test.length) {
            y_test.push(sub_y_test);
        }
    }
    return [x_train, x_test, y_train, y_test];
}

function analyze_data(data, columns) {
    var to_be_encoded = [];
    for (var i = 0; i < data[0].length; i++) {
        for (var j = 0; j < data.length; j++) {
            if (isNaN(data[j][i] * 2)) {
                to_be_encoded.push(columns[i]);
                break;
            }
        }
    }
    return to_be_encoded;
}

function parse_csv(csv) {
    const rows = csv.split("\n");
    const columns = rows.shift().split(",");
    rows.pop();
    const data = rows.map(row => row.split(","));
    const to_be_encoded = analyze_data(data, columns);
    return [
        columns, 
        data,
        to_be_encoded
    ];
}

function label_encoder(data, col) {
    var unique = [];
    for (var i = 0; i < data.length; i++) {
        if (unique.includes(data[i][col])) {
            data[i][col] = `${unique.indexOf(data[i][col])}`;
        } else {
            unique.push(data[i][col]);
            data[i][col] = `${unique.length - 1}`;
        }
    }
}

function one_hot_encoder(data, col, columns) {
    var unique = [];
    for (var i = 0; i < data.length; i++) {
        if (!unique.includes(data[i][col])) {
            unique.push(data[i][col]);
        }
    }
    for (var i = 0; i < data.length; i++) {
        var new_value = unique.map(e => (e == data[i][col] ? "1" : "0"));
        data[i] = [
            ...data[i].slice(0, col), 
            ...new_value, 
            ...data[i].slice(col + 1)
        ];
    }
    return [...columns.slice(0, col), ...unique, ...columns.slice(col + 1)];
}

function downloadCSV(data, filename = "data.csv") {
    const csvContent = data.map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

